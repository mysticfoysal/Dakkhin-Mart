const db = require('../config/db');
const slugify = require('slugify');

// Get all products with filters
exports.getProducts = async (req, res) => {
  try {
    const {
      category, search, minPrice, maxPrice,
      sort = 'created_at', order = 'DESC',
      page = 1, limit = 12, featured,
    } = req.query;

    let where = ['p.is_active = TRUE'];
    const params = [];

    if (category) {
      where.push('(c.slug = ? OR pc.slug = ?)');
      params.push(category, category);
    }
    if (search) {
      where.push('(p.name LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    if (minPrice) { where.push('p.price >= ?'); params.push(minPrice); }
    if (maxPrice) { where.push('p.price <= ?'); params.push(maxPrice); }
    if (featured === 'true') { where.push('p.is_featured = TRUE'); }

    const sortMap = {
      price_asc: 'p.price ASC',
      price_desc: 'p.price DESC',
      best_selling: 'p.total_sold DESC',
      newest: 'p.created_at DESC',
      rating: 'avg_rating DESC',
    };
    const orderBy = sortMap[sort] || 'p.created_at DESC';

    const offset = (Number(page) - 1) * Number(limit);

    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN categories pc ON c.parent_id = pc.id
       WHERE ${where.join(' AND ')}`,
      params
    );

    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN categories pc ON c.parent_id = pc.id
       LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = TRUE
       WHERE ${where.join(' AND ')}
       GROUP BY p.id
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    res.json({
      success: true,
      products,
      pagination: {
        total: countRows[0].total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(countRows[0].total / Number(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = TRUE
       WHERE p.slug = ? AND p.is_active = TRUE
       GROUP BY p.id`,
      [slug]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = rows[0];

    // Get reviews
    const [reviews] = await db.query(
      `SELECT r.*, u.name as user_name, u.avatar as user_avatar
       FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ? AND r.is_approved = TRUE
       ORDER BY r.created_at DESC LIMIT 10`,
      [product.id]
    );

    // Get variants
    const [variants] = await db.query(
      'SELECT * FROM product_variants WHERE product_id = ? ORDER BY weight',
      [product.id]
    );

    // Related products
    const [related] = await db.query(
      `SELECT p.*, COALESCE(AVG(r.rating), 0) as avg_rating
       FROM products p
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE p.category_id = ? AND p.id != ? AND p.is_active = TRUE
       GROUP BY p.id LIMIT 4`,
      [product.category_id, product.id]
    );

    res.json({ success: true, product, reviews, variants, related });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create product (admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, short_description, category_id, price, sale_price, unit, stock_quantity, weight_options, is_featured, tags, sku } = req.body;
    
    const slug = slugify(name, { lower: true, strict: true });
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const thumbnail = images[0] || null;

    const [result] = await db.query(
      `INSERT INTO products (name, slug, description, short_description, category_id, price, sale_price, unit, stock_quantity, weight_options, images, thumbnail, is_featured, tags, sku)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, short_description, category_id, price, sale_price || null, unit || 'kg', stock_quantity || 0,
       weight_options ? JSON.stringify(weight_options) : null,
       JSON.stringify(images), thumbnail, is_featured || false, tags, sku || null]
    );

    res.status(201).json({ success: true, message: 'Product created', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update product (admin)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, short_description, category_id, price, sale_price, unit, stock_quantity, is_featured, is_active, tags } = req.body;

    await db.query(
      `UPDATE products SET name=?, description=?, short_description=?, category_id=?, price=?, sale_price=?, unit=?, stock_quantity=?, is_featured=?, is_active=?, tags=?, updated_at=NOW()
       WHERE id=?`,
      [name, description, short_description, category_id, price, sale_price || null, unit, stock_quantity, is_featured ? 1 : 0, is_active ? 1 : 0, tags, id]
    );

    res.json({ success: true, message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete product (admin)
exports.deleteProduct = async (req, res) => {
  try {
    await db.query('UPDATE products SET is_active = FALSE WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Top selling products
exports.getTopSelling = async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, COALESCE(AVG(r.rating), 0) as avg_rating, COUNT(DISTINCT r.id) as review_count
       FROM products p
       LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = TRUE
       WHERE p.is_active = TRUE
       GROUP BY p.id
       ORDER BY p.total_sold DESC LIMIT 8`
    );
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};