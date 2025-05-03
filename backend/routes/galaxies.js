const express = require('express');
const router = express.Router();
const { Galaxy } = require('../models');


// GET /api/galaxies
router.get('/', async (req, res) => {
  try {
    const galaxies = await Galaxy.findAll();
    res.json(galaxies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
