const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/Misccontroller');
const db = require('../config/db');
const { adminAuth } = require('../middleware/Auth');

router.get('/', getCategories);

// Admin: create category
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description, parent_id, sort_order } = req.body;
    const slugify = require('slugify');
    const slug = slugify(name, { lower: true, strict: true });
    const [result] = await db.query(
      'INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES (?,?,?,?,?)',
      [name, slug, description || null, parent_id || null, sort_order || 0]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: update category
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, is_active, sort_order } = req.body;
    await db.query(
      'UPDATE categories SET name=?, description=?, is_active=?, sort_order=? WHERE id=?',
      [name, description, is_active ? 1 : 0, sort_order || 0, req.params.id]
    );
    res.json({ success: true, message: 'Category updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
