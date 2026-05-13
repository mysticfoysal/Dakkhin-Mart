const db = require('../config/db');

// ─── REVIEWS ────────────────────────────────────────────────────────────────

exports.addReview = async (req, res) => {
  try {
    const { product_id, rating, title, comment, order_id } = req.body;
    const [existing] = await db.query(
      'SELECT id FROM reviews WHERE product_id=? AND user_id=?',
      [product_id, req.user.id]
    );
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'You already reviewed this product' });
    }
    await db.query(
      'INSERT INTO reviews (product_id, user_id, order_id, rating, title, comment) VALUES (?,?,?,?,?,?)',
      [product_id, req.user.id, order_id || null, rating, title || null, comment || null]
    );
    res.status(201).json({ success: true, message: 'Review submitted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const [reviews] = await db.query(
      `SELECT r.*, u.name as user_name, u.avatar as user_avatar
       FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.product_id=? AND r.is_approved=TRUE ORDER BY r.created_at DESC`,
      [req.params.product_id]
    );
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── WISHLIST ────────────────────────────────────────────────────────────────

exports.getWishlist = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT w.id, w.created_at, p.id as product_id, p.name, p.slug, p.price, p.sale_price, p.thumbnail, p.unit,
        COALESCE(AVG(r.rating),0) as avg_rating
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE w.user_id=? AND p.is_active=TRUE
       GROUP BY w.id`,
      [req.user.id]
    );
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const [existing] = await db.query(
      'SELECT id FROM wishlist WHERE user_id=? AND product_id=?',
      [req.user.id, product_id]
    );
    if (existing.length) {
      await db.query('DELETE FROM wishlist WHERE user_id=? AND product_id=?', [req.user.id, product_id]);
      return res.json({ success: true, action: 'removed', message: 'Removed from wishlist' });
    }
    await db.query('INSERT INTO wishlist (user_id, product_id) VALUES (?,?)', [req.user.id, product_id]);
    res.json({ success: true, action: 'added', message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── COUPONS ─────────────────────────────────────────────────────────────────

exports.validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const [rows] = await db.query(
      `SELECT * FROM coupons WHERE code=? AND is_active=TRUE
       AND (expires_at IS NULL OR expires_at > NOW())
       AND used_count < usage_limit`,
      [code]
    );
    if (!rows.length) {
      return res.status(400).json({ success: false, message: 'Invalid or expired coupon' });
    }
    const coupon = rows[0];
    if (subtotal < coupon.min_order_amount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order ৳${coupon.min_order_amount} required`,
      });
    }
    const discount = coupon.type === 'percentage'
      ? Math.min(subtotal * coupon.value / 100, coupon.max_discount || Infinity)
      : coupon.value;

    res.json({ success: true, coupon: { ...coupon, discount: Math.round(discount) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM categories c LEFT JOIN products p ON c.id = p.category_id AND p.is_active=TRUE
       WHERE c.is_active=TRUE
       GROUP BY c.id ORDER BY c.sort_order ASC`
    );
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};