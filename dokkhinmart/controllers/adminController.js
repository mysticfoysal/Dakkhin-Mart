// controllers/adminController.js
const db   = require('../config/db');
const path = require('path');

// ── Add Product ──────────────────────────────────────────
exports.addProduct = async (req, res) => {
  try {
    const { name, price, category_id, description, stock_quantity } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    }

    // Build slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      + '-' + Date.now();

    // Thumbnail path from uploaded file (or null)
    const thumbnail = req.file
      ? '/uploads/' + req.file.filename
      : null;

    const [result] = await db.query(
      `INSERT INTO products
         (name, slug, price, category_id, description, stock_quantity, thumbnail, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [name, slug, price, category_id, description || '', stock_quantity || 0, thumbnail]
    );

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
};

// ── Get All Products ─────────────────────────────────────
exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    );
    res.json({ success: true, products: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Delete Product ───────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Get All Users ────────────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, email, phone, address, role, is_verified, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    res.json({ success: true, users: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Get All Orders ───────────────────────────────────────
exports.getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*,
         (SELECT JSON_ARRAYAGG(JSON_OBJECT(
           'product_name',  oi.product_name,
           'quantity',      oi.quantity,
           'unit_price',    oi.unit_price,
           'total_price',   oi.total_price,
           'product_image', oi.product_image
         )) FROM order_items oi WHERE oi.order_id = o.id) AS items
       FROM orders o
       ORDER BY o.created_at DESC`
    );
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Update Order Status ──────────────────────────────────
exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_status } = req.body;
    await db.query(
      'UPDATE orders SET order_status = ? WHERE id = ?',
      [order_status, req.params.id]
    );
    res.json({ success: true, message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Dashboard Stats ──────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [[{ total_orders }]]   = await db.query('SELECT COUNT(*) AS total_orders FROM orders');
    const [[{ total_users }]]    = await db.query('SELECT COUNT(*) AS total_users FROM users WHERE role = "customer"');
    const [[{ total_products }]] = await db.query('SELECT COUNT(*) AS total_products FROM products WHERE is_active = TRUE');
    const [[{ total_revenue }]]  = await db.query(
      'SELECT COALESCE(SUM(total), 0) AS total_revenue FROM orders WHERE order_status != "cancelled"'
    );
    const [recent_orders] = await db.query(
      `SELECT id, order_number, customer_name, total, order_status, created_at
       FROM orders ORDER BY created_at DESC LIMIT 5`
    );
    res.json({
      success: true,
      stats: { total_orders, total_users, total_products, total_revenue },
      recent_orders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Get Categories (for dropdown) ───────────────────────
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name FROM categories WHERE is_active = TRUE ORDER BY sort_order'
    );
    res.json({ success: true, categories: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
