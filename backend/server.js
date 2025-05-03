require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');

const {
  sequelize,
  Galaxy,
  Station,
  Resource,
  ResourcePrice,
  User,
  UserInventory,
  Transaction,
  Achievement,
  UserAchievement,
  Artifact,
  UserArtifact,
  Auction
} = require('./models');

const authMiddleware = require('./middleware/auth');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/galaxies', require('./routes/galaxies'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/transactions', authMiddleware, require('./routes/transactions'));
app.use('/api/resource-prices', require('./routes/resourcePrices'));
app.use('/api/profile', require('./routes/profile'));

let auctionTimeout;
let cooldownTimeout;
const bidHistory = [];
let messageId = 0;
const chatHistory = []; 
let isCooldown = false;

// Создаёт новый аукцион с рандомным артефактом
async function resetAuction() {
  if (isCooldown) return;

  const artifact = await Artifact.findOne({ order: sequelize.random() });
  if (!artifact) return console.error('No artifacts for auction');

  const durationMs = 5 * 60 * 1000;
  const endTime = new Date(Date.now() + durationMs);

  const auction = await Auction.create({
    artifactId: artifact.id,
    endTime,
    status: 'active',
    currentBid: 1000,
  });

  bidHistory.length = 0;  
  chatHistory.length = 0;
  messageId = 0;
  clearTimeout(auctionTimeout);

  auctionTimeout = setTimeout(() => handleAuctionEnd(auction.id), durationMs);

  const payload = {
    type: 'auctionReset',
    auctionId: auction.id,
    currentBid: auction.currentBid,
    bidStep: Math.ceil(auction.currentBid * 1.05) - auction.currentBid,
    timeLeft: Math.floor(durationMs / 1000),
    artifact: {
      id: artifact.id,
      name: artifact.name,
      description: artifact.description,
      rarity: artifact.rarity,
      image: artifact.image
    }
  };

  broadcast(payload);
}

function broadcast(message) {
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN && ws.userId) {
      ws.send(JSON.stringify(message));
    }
  });
}

// Завершает аукцион, определяет победителя
async function handleAuctionEnd(auctionId) {
  const auction = await Auction.findByPk(auctionId, { include: Artifact });
  if (!auction || auction.status === 'ended') return;

  auction.status = 'ended';
  await auction.save();

  const highestBid = await Transaction.findOne({
    where: { auctionId, transactionType: 'bid' },
    order: [['totalPrice', 'DESC']],
  });

  let winnerInfo = null;
  if (highestBid) {
    auction.winnerId = highestBid.userId;
    await auction.save();

    const [ua] = await UserArtifact.findOrCreate({
      where: { userId: highestBid.userId, artifactId: auction.artifactId },
      defaults: { acquiredAt: new Date() }
    });

    const winner = await User.findByPk(highestBid.userId);
    winnerInfo = { id: winner.id, name: winner.fullName };
  }

  const endPayload = {
    type: 'auctionEnd',
    auctionId,
    winner: winnerInfo
  };
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(endPayload));
    }
  });

  isCooldown = true;
  broadcast({ type: 'cooldownStart', duration: 300 }); 

  cooldownTimeout = setTimeout(() => {
    isCooldown = false;
    resetAuction();
  }, 5 * 60 * 1000);
}

// WebSocket коннект
wss.on('connection', ws => {
  ws.on('message', async raw => {
    let data;
    try { data = JSON.parse(raw); }
    catch { return; }

    if (data.type === 'auth') {
      try {
        const { id } = jwt.verify(data.token, process.env.JWT_SECRET);
        const user = await User.findByPk(id);
        if (!user) return ws.close();
        ws.userId = user.id;
        ws.userName = user.fullName;

        ws.send(JSON.stringify({
          type: 'authSuccess',
          userId: user.id,
          userName: user.fullName,
          balance: user.balance
        }));

        const active = await Auction.findOne({ where: { status: 'active' }, include: Artifact });
        if (active) {
          ws.send(JSON.stringify({
            type: 'bidUpdate',
            auctionId: active.id,
            currentBid: active.currentBid,
            bidStep: Math.ceil(active.currentBid * 1.05) - active.currentBid,
            lastBidder: bidHistory.slice(-1)[0]?.userName || null,
            artifact: {
              id: active.Artifact.id,
              name: active.Artifact.name,
              description: active.Artifact.description,
              rarity: active.Artifact.rarity,
              image: active.Artifact.image
            }
          }));
          ws.send(JSON.stringify({
            type: 'timeUpdate',
            auctionId: active.id,
            timeLeft: Math.floor((active.endTime - Date.now()) / 1000)
          }));
        }

        ws.send(JSON.stringify({ type: 'bidHistory', history: bidHistory }));
        ws.send(JSON.stringify({ type: 'chatHistory', messages: chatHistory }));
      } catch {
        ws.close();
      }
    }

    if (data.type === 'bid' && ws.userId) {
      const auction = await Auction.findByPk(data.auctionId, { include: Artifact });
      if (!auction || auction.status !== 'active') {
        return ws.send(JSON.stringify({ type: 'error', message: 'Аукцион не активен' }));
      }

      const newBid = Math.ceil(auction.currentBid * 1.05);
      const step = newBid - auction.currentBid;

      const user = await User.findByPk(ws.userId);
      if (user.balance < newBid) {
        return ws.send(JSON.stringify({ type: 'error', message: 'Недостаточно средств' }));
      }

      const lastTransaction = await Transaction.findOne({
        where: { auctionId: auction.id, transactionType: 'bid' },
        order: [['timestamp', 'DESC']],
      });

      if (lastTransaction) {
        const previousBidderId = lastTransaction.userId;
        if (previousBidderId !== ws.userId) {
          const previousBidder = await User.findByPk(previousBidderId);
          previousBidder.balance += lastTransaction.totalPrice;
          await previousBidder.save();

          wss.clients.forEach(c => {
            if (c.readyState === WebSocket.OPEN && c.userId === previousBidderId) {
              c.send(JSON.stringify({ type: 'balanceUpdate', balance: previousBidder.balance }));
            }
          });
        }
      }

      user.balance -= newBid;
      await user.save();

      auction.currentBid = newBid;
      await auction.save();

      await Transaction.create({
        quantity: 1,
        pricePerUnit: newBid,
        totalPrice: newBid,
        transactionType: 'bid',
        userId: ws.userId,
        auctionId: auction.id,
        timestamp: new Date()
      });

      bidHistory.push({
        userName: ws.userName,
        amount: newBid,
        timestamp: Date.now()
      });
      if (bidHistory.length > 10) bidHistory.shift();

      const bidPayload = {
        type: 'bidUpdate',
        auctionId: auction.id,
        currentBid: newBid,
        bidStep: step,
        lastBidder: ws.userName,
        artifact: {
          id: auction.Artifact.id,
          name: auction.Artifact.name,
          description: auction.Artifact.description,
          rarity: auction.Artifact.rarity,
          image: auction.Artifact.image
        }
      };

      wss.clients.forEach(c => {
        if (c.readyState === WebSocket.OPEN) {
          c.send(JSON.stringify(bidPayload));
          c.send(JSON.stringify({
            type: 'bidHistory',
            history: bidHistory
          }));
          if (c.userId === ws.userId) {
            c.send(JSON.stringify({ type: 'balanceUpdate', balance: user.balance }));
          }
        }
      });
    }

    if (data.type === 'chat' && ws.userId) {
      const msg = {
        id: messageId++,
        userName: ws.userName,
        text: data.text,
        timestamp: Date.now()
      };
      chatHistory.push(msg);
      wss.clients.forEach(c => {
        if (c.readyState === WebSocket.OPEN && c.userId) {
          c.send(JSON.stringify({ type: 'chat', ...msg }));
        }
      });
    }
  });

  ws.on('close', () => {
    if (ws.userName) {
      console.log(`Клиент отключился: ${ws.userName}`);
    }
  });
});

setInterval(async () => {
  const now = Date.now();
  const actives = await Auction.findAll({ 
    where: { status: 'active' } 
  });
  
  for (const a of actives) {
    const left = Math.max(0, Math.floor((a.endTime - now) / 1000));
    broadcast({
      type: 'timeUpdate',
      auctionId: a.id,
      timeLeft: left
    });
    
    if (left <= 0) {
      await handleAuctionEnd(a.id);
    }
  }
}, 1000);


const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('✅ База данных синхронизирована');

    const galaxiesCount = await Galaxy.count();
    if (!galaxiesCount) {
      await Galaxy.bulkCreate([
        {
          name: 'Alpha Centauri',
          type: 'Mining',
          resources: ['Titanium', 'Helium-3', 'Iron'],
          distance: '4.37 световых лет',
          image: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg',
        },
        {
          name: 'Proxima B',
          type: 'Research',
          resources: ['Xenocrystals', 'Hydrogen', 'Oxygen'],
          distance: '4.24 световых лет',
          image: 'https://images.pexels.com/photos/5486825/pexels-photo-5486825.jpeg',
        },
        {
          name: 'Trappist-1',
          type: 'Industrial',
          resources: ['Uranium', 'Rare Earth', 'Water'],
          distance: '39.6 световых лет',
          image: 'https://images.pexels.com/photos/6695443/pexels-photo-6695443.jpeg',
        },
      ]);
      console.log('🌌 Галактики добавлены');
    }

    const resourcesCount = await Resource.count();
    if (!resourcesCount) {
      await Resource.bulkCreate([
        { name: "Helium-3", icon: "⚛️", category: "Fuel", color: "bg-blue-500" },
        { name: "Titanium", icon: "⛏️", category: "Metal", color: "bg-gray-400" },
        { name: "Xenocrystal", icon: "💎", category: "Exotic", color: "bg-purple-500" },
        { name: "Oxygen", icon: "🧪", category: "Gas", color: "bg-cyan-400" },
        { name: "Uranium", icon: "☢️", category: "Radioactive", color: "bg-green-500" },
        { name: "Water", icon: "💧", category: "Liquid", color: "bg-blue-300" },
      ]);
      console.log('💧 Ресурсы добавлены');
    }

    const rpCount = await ResourcePrice.count();
    if (!rpCount) {
      const galaxies = await Galaxy.findAll();
      const resources = await Resource.findAll();
      await ResourcePrice.bulkCreate([
        { galaxyId: galaxies[0].id, resourceId: resources[0].id, price: 438.25, change: 5.7, volume: "12.5K" },
        { galaxyId: galaxies[0].id, resourceId: resources[1].id, price: 275.80, change: -2.3, volume: "35.2K" },
        { galaxyId: galaxies[1].id, resourceId: resources[2].id, price: 1205.60, change: 12.8, volume: "3.4K" },
        { galaxyId: galaxies[1].id, resourceId: resources[3].id, price: 86.15, change: 0.5, volume: "58.9K" },
        { galaxyId: galaxies[2].id, resourceId: resources[4].id, price: 562.30, change: -8.1, volume: "7.2K" },
        { galaxyId: galaxies[2].id, resourceId: resources[5].id, price: 125.75, change: 3.2, volume: "42.1K" },
      ]);
      console.log('💰 Цены ресурсов добавлены');
    }

    const achCount = await Achievement.count();
    if (!achCount) {
      await Achievement.bulkCreate([
        { name: 'First Contact', description: 'Купить первый ресурс' },
        { name: 'Trader', description: 'Завершить 100 транзакций' },
      ]);
      console.log('🏆 Достижения добавлены');
    }

    const artifactCount = await Artifact.count();
    if (!artifactCount) {
      await Artifact.bulkCreate([
        { name: "Редкое ядро для передовых технологий", description: "A rare core for advanced technology", rarity: "epic", image: "https://i.pinimg.com/originals/a5/bb/f9/a5bbf920dca1762daed3beea2f73e15a.jpg" },
        { name: "Осколок упавшей звезды", description: "A fragment of a fallen star", rarity: "rare", image: "https://turbo-uploads.s3.eu-north-1.amazonaws.com/Banner_Image_40d2f479c5.jpg" },
        { name: "Таинственный кристалл из пустоты", description: "A mysterious crystal from the void", rarity: "common", image: "https://avatars.mds.yandex.net/i?id=366903e96a2c38d443f63a79c153ef47521a6c44-12187916-images-thumbs&n=13" },
      ]);
      console.log('🪙 Артефакты добавлены');
    }

    await resetAuction();
    server.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
  } catch (err) {
    console.error('❌ Ошибка запуска:', err);
    process.exit(1);
  }
})();