const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { Op } = require('sequelize'); 
const {
  User,
  UserInventory,
  Resource,
  Transaction,
  UserAchievement,
  Achievement,
  UserArtifact,
  Artifact
} = require('../models');

// GET /api/profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    // console.log('>>> /api/profile start for user', req.user.id);

    // Баланс
    const user = await User.findByPk(req.user.id, {
      attributes: ['balance', 'fullName', 'email']
    });
    if (!user) {
      console.error('User not found in profile');
      return res.status(404).json({ error: 'User not found' });
    }
    // console.log('>>> fetched user:', user.toJSON());

    // Инвентарь
    const inventoryRecords = await UserInventory.findAll({
      where: { userId: req.user.id },
      include: [{ model: Resource, attributes: ['id','name','icon','category','color'] }]
    });
    // console.log('>>> fetched inventory count:', inventoryRecords.length);

    // Транзакции
    const transactions = await Transaction.findAll({
      where: { 
        userId: req.user.id,
        transactionType: {
          [Op.in]: ['buy', 'sell'] // Фильтруем только нужные типы
        }
      },
      order: [['timestamp','DESC']]
    });
    // console.log('>>> fetched transactions count:', transactions.length);

    // Достижения
    const userAch = await UserAchievement.findAll({
      where: { userId: req.user.id },
      include: [{ model: Achievement, attributes: ['id','name','description'] }]
    });
    // console.log('>>> fetched achievements count:', userAch.length);


    // Артефакты
    const userArtifacts = await UserArtifact.findAll({
      where: { userId: req.user.id },
      include: [{ 
        model: Artifact,
        attributes: ['id','name','description','image','rarity']
      }],
      order: [['acquiredAt','DESC']]
    });

    // Json
    res.json({
      user: user.toJSON(),
      inventory: inventoryRecords.map(i => ({
        id: i.resourceId,
        ...i.Resource.toJSON(),
        quantity: i.quantity
      })),
      transactions: transactions.map(t => t.toJSON()),
      achievements: userAch.map(ua => ({
        id: ua.achievementId,
        ...ua.Achievement.toJSON(),
        progress: ua.progress
      })),
      artifacts: userArtifacts.map(ua => ({
        id: ua.artifactId,
        acquiredAt: ua.acquiredAt,
        ...ua.Artifact.toJSON()
      }))
    });

  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
