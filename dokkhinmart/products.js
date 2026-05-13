const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fresh_mart'
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM products ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { name, price, stock_quantity, category_id, thumbnail, description } = req.body;

  const sql = `
    INSERT INTO products
    (name, price, stock_quantity, category_id, thumbnail, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [name, price, stock_quantity, category_id, thumbnail, description],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ success: true, message: 'Product added', id: result.insertId });
    }
  );
});

module.exports = router;