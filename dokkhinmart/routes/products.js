// routes/products.js
const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { category, search, featured, limit } = req.query;

    // FIX: Include aggregated avg_rating, review_count, total_sold so the
    // frontend renderProductCard() receives all required fields directly.
    let sql = `
      SELECT
        p.*,
        c.name  AS category_name,
        c.slug  AS category_slug,
        COALESCE(AVG(r.rating), 0)   AS avg_rating,
        COUNT(DISTINCT r.id)         AS review_count,
        COALESCE(SUM(oi.quantity), 0) AS total_sold
      FROM products p
      LEFT JOIN categories  c  ON p.category_id = c.id
      LEFT JOIN reviews     r  ON r.product_id  = p.id
      LEFT JOIN order_items oi ON oi.product_id = p.id
      WHERE p.is_active = TRUE`;

    const params = [];

    if (category) { sql += ' AND c.slug = ?';              params.push(category); }
    if (search)   { sql += ' AND p.name LIKE ?';           params.push(`%${search}%`); }
    if (featured === 'true') { sql += ' AND p.is_featured = TRUE'; }

    sql += ' GROUP BY p.id, c.name, c.slug';
    sql += ' ORDER BY p.created_at DESC';

    // FIX: Honour optional ?limit= query param (used by homepage featured section).
    if (limit && Number(limit) > 0) {
      sql += ' LIMIT ?';
      params.push(Number(limit));
    }

    const [rows] = await db.query(sql, params);
    res.json({ success: true, products: rows });
  } catch (err) {
    console.error('GET /api/products error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         p.*,
         c.name  AS category_name,
         c.slug  AS category_slug,
         COALESCE(AVG(r.rating), 0)    AS avg_rating,
         COUNT(DISTINCT r.id)          AS review_count,
         COALESCE(SUM(oi.quantity), 0) AS total_sold
       FROM products p
       LEFT JOIN categories  c  ON p.category_id = c.id
       LEFT JOIN reviews     r  ON r.product_id  = p.id
       LEFT JOIN order_items oi ON oi.product_id = p.id
       WHERE p.slug = ? AND p.is_active = TRUE
       GROUP BY p.id, c.name, c.slug`,
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product: rows[0] });
  } catch (err) {
    console.error('GET /api/products/:slug error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
