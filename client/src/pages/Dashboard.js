const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Admin Dashboard
router.get('/admin', auth, (req, res) => {
  if (req.userRole !== 'admin') return res.status(403).json({ message: 'Access denied' });
  res.json({ message: 'Welcome to the Admin Dashboard' });
});

// Researcher Dashboard
router.get('/researcher', auth, (req, res) => {
  if (req.userRole !== 'researcher') return res.status(403).json({ message: 'Access denied' });
  res.json({ message: 'Welcome to the Researcher Dashboard' });
});

// Test Engineer Dashboard
router.get('/testengineer', auth, (req, res) => {
  if (req.userRole !== 'testengineer') return res.status(403).json({ message: 'Access denied' });
  res.json({ message: 'Welcome to the Test Engineer Dashboard' });
});

module.exports = router;
