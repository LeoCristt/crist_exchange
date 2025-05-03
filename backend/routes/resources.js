const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const ResourcePrice = require('../models/ResourcePrice');


// GET /api/resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.findAll();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/resources
router.get('/stations/:stationId/resources', async (req, res) => {
  try {
    const { stationId } = req.params;
    const resourcePrices = await ResourcePrice.findAll({
      where: { stationId },
      include: [{ model: Resource }],
      order: [['timestamp', 'DESC']],
    });
    res.json(resourcePrices);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;