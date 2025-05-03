const express = require('express');
const router = express.Router();
const { ResourcePrice, Resource } = require('../models');

// GET /api/resource-prices/:galaxyId
router.get('/:galaxyId', async (req, res) => {
  const { galaxyId } = req.params;
  try {
    const prices = await ResourcePrice.findAll({
      where: { galaxyId },
      include: [{ model: Resource }],
      order: [['timestamp', 'DESC']],
    });

    const formatted = prices.map(p => ({
      id: p.resourceId,
      name: p.Resource.name,
      icon: p.Resource.icon,
      category: p.Resource.category,
      price: p.price,
      change: p.change,
      volume: p.volume,
      color: p.Resource.color,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch resource prices' });
  }
});

module.exports = router;
