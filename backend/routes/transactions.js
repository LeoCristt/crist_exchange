// routes/transactions.js
const express = require('express');
const router = express.Router();
const { sequelize, User, UserInventory, Transaction } = require('../models');
const authMiddleware = require('../middleware/auth');

const COMMISSION_RATE = 0.02;

// POST /api/transactions
router.post('/', authMiddleware, async (req, res) => {
  const { resourceId, quantity, transactionType, pricePerUnit } = req.body;
  const qty = parseInt(quantity, 10);

  if (!resourceId || !qty || !['buy', 'sell'].includes(transactionType) || !pricePerUnit) {
    return res.status(400).json({ error: 'Неверные входные данные' });
  }

  const subtotal = pricePerUnit * qty;
  const commission = subtotal * COMMISSION_RATE;
  const total = transactionType === 'buy'
    ? subtotal + commission
    : subtotal - commission;

  let t;
  try {
    t = await sequelize.transaction();
    console.log('Транзакция начата');

    const user = await User.findByPk(req.user.id, { transaction: t });
    if (!user) throw new Error('Пользователь не найден');

    if (transactionType === 'buy' && user.balance < total) {
      return res.status(400).json({ error: 'Недостаточно средств' });
    }

    let inventory = await UserInventory.findOne({
      where: { userId: user.id, resourceId },
      transaction: t,
    });

    if (transactionType === 'sell') {
      if (!inventory || inventory.quantity < qty) {
        return res.status(400).json({ error: 'Недостаточно ресурса для продажи' });
      }
    }

    const transaction = await Transaction.create({
      userId: user.id,
      resourceId,
      quantity: qty,
      pricePerUnit,
      totalPrice: total,
      transactionType
    }, { transaction: t });

    user.balance = transactionType === 'buy'
      ? user.balance - total
      : user.balance + total;
    await user.save({ transaction: t });

    if (inventory) {
      inventory.quantity = transactionType === 'buy'
        ? inventory.quantity + qty
        : inventory.quantity - qty;
      await inventory.save({ transaction: t });
    } else if (transactionType === 'buy') {
      inventory = await UserInventory.create({
        userId: user.id,
        resourceId,
        quantity: qty
      }, { transaction: t });
    }

    await t.commit();
    console.log('Транзакция успешно завершена');
    return res.json({
      message: `Успешно ${transactionType === 'buy' ? 'куплено' : 'продано'}`,
      balance: user.balance,
      inventory: inventory.quantity,
      transaction
    });
  } catch (err) {
    console.error('Ошибка транзакции:', err);
    if (t) await t.rollback();
    return res.status(500).json({ error: err.message || 'Ошибка сервера' });
  } finally {
    if (t && !t.finished) {
      console.warn('Транзакция осталась незавершенной, откатываем вручную');
      await t.rollback();
    }
  }
});

module.exports = router;
