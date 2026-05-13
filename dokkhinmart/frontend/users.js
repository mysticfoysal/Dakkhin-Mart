const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/Auth');
const db = require('../config/db');

// Admin: get all users
router.get('/', adminAuth, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, phone, role, is_verified, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: get single user
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, role, address, created_at FROM users WHERE id=?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
