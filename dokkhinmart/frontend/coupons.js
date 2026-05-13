const express = require('express');
const router = express.Router();
const { validateCoupon } = require('../controllers/Misccontroller');
const { adminAuth } = require('../middleware/Auth');
const db = require('../config/db');

router.post('/validate', validateCoupon);

// Admin: list all coupons
router.get('/', adminAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json({ success: true, coupons: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: create coupon
router.post('/', adminAuth, async (req, res) => {
  try {
    const { code, type, value, min_order_amount, max_discount, usage_limit, expires_at } = req.body;
    const [result] = await db.query(
      'INSERT INTO coupons (code, type, value, min_order_amount, max_discount, usage_limit, expires_at) VALUES (?,?,?,?,?,?,?)',
      [code.toUpperCase(), type, value, min_order_amount || 0, max_discount || null, usage_limit || 100, expires_at || null]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Coupon code already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: toggle coupon
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { is_active } = req.body;
    await db.query('UPDATE coupons SET is_active=? WHERE id=?', [is_active ? 1 : 0, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
