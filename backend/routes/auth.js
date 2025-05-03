// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');  
const authMiddleware = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { fullName, email, password, title, experience, station, balance } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      title,
      experience,
      station,
      balance,
    });
    res.status(201).json({ id: user.id, fullName: user.fullName, email: user.email });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message || 'User creation failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // По email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Wrong password' });
    }
    //JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        title: user.title,
        experience: user.experience,
        station: user.station,
        balance: user.balance,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get /me error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
