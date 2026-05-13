const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get or create cart session
router.get('/:session_id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cart_sessions WHERE session_id=?', [req.params.session_id]);
    if (!rows.length) return res.json({ success: true, cart: [] });
    res.json({ success: true, cart: JSON.parse(rows[0].cart_data || '[]') });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Save cart session
router.post('/', async (req, res) => {
  try {
    const { session_id, cart_data } = req.body;
    const sid = session_id || uuidv4();
    await db.query(
      'INSERT INTO cart_sessions (session_id, cart_data) VALUES (?,?) ON DUPLICATE KEY UPDATE cart_data=?, updated_at=NOW()',
      [sid, JSON.stringify(cart_data), JSON.stringify(cart_data)]
    );
    res.json({ success: true, session_id: sid });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
