const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const generateOrderNumber = () => {
  const date = new Date();
  const d = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
  return `FM${d}${Math.floor(Math.random()*9000+1000)}`;
};

// Create order
exports.createOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      customer_name, customer_phone, customer_email,
      delivery_address, delivery_type, payment_method,
      items, coupon_code, notes,
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    // Get delivery charges from settings
    const [settings] = await conn.query(
      "SELECT key_name, value FROM settings WHERE key_name IN ('delivery_charge_12h', 'delivery_charge_24h', 'free_delivery_min')"
    );
    const s = {};
    settings.forEach(r => s[r.key_name] = Number(r.value));

    // Calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.unit_price * item.quantity;
    }

    // Delivery charge
    let delivery_charge = delivery_type === '12h' ? (s.delivery_charge_12h || 80) : (s.delivery_charge_24h || 50);
    if (subtotal >= (s.free_delivery_min || 1000)) delivery_charge = 0;

    // Coupon
    let discount = 0;
    if (coupon_code) {
      const [coupons] = await conn.query(
        "SELECT * FROM coupons WHERE code = ? AND is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW()) AND used_count < usage_limit",
        [coupon_code]
      );
      if (coupons.length) {
        const coupon = coupons[0];
        if (subtotal >= coupon.min_order_amount) {
          discount = coupon.type === 'percentage'
            ? Math.min(subtotal * coupon.value / 100, coupon.max_discount || Infinity)
            : coupon.value;
          await conn.query('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [coupon.id]);
        }
      }
    }

    const total = subtotal + delivery_charge - discount;
    const order_number = generateOrderNumber();

    const [orderResult] = await conn.query(
      `INSERT INTO orders (order_number, user_id, customer_name, customer_phone, customer_email, delivery_address, delivery_type, delivery_charge, subtotal, discount, total, coupon_code, payment_method, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [order_number, req.user?.id || null, customer_name, customer_phone, customer_email || null,
       delivery_address, delivery_type, delivery_charge, subtotal, discount, total,
       coupon_code || null, payment_method, notes || null]
    );

    const orderId = orderResult.insertId;

    // Insert order items & update stock
    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, weight, unit, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.product_name, item.product_image || null,
         item.weight || null, item.unit || 'kg', item.quantity, item.unit_price, item.unit_price * item.quantity]
      );

      await conn.query(
        'UPDATE products SET stock_quantity = stock_quantity - ?, total_sold = total_sold + ? WHERE id = ?',
        [item.quantity, item.quantity, item.product_id]
      );
    }

    // Insert payment record
    await conn.query(
      'INSERT INTO payments (order_id, amount, method) VALUES (?, ?, ?)',
      [orderId, total, payment_method]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: { id: orderId, order_number, total, delivery_charge, discount },
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  } finally {
    conn.release();
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM orders WHERE order_number = ? OR id = ?', [id, id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Order not found' });

    const order = rows[0];
    if (req.user?.role !== 'admin' && order.user_id !== req.user?.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    res.json({ success: true, order: { ...order, items } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, tracking_notes } = req.body;

    const updates = ['order_status = ?', 'updated_at = NOW()'];
    const params = [order_status];

    if (tracking_notes) { updates.push('tracking_notes = ?'); params.push(tracking_notes); }
    if (order_status === 'delivered') { updates.push('delivered_at = NOW()'); }

    params.push(id);
    await db.query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, params);

    res.json({ success: true, message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    let where = ['1=1'];
    const params = [];

    if (status) { where.push('o.order_status = ?'); params.push(status); }
    if (search) {
      where.push('(o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    const offset = (Number(page) - 1) * Number(limit);
    const [orders] = await db.query(
      `SELECT o.*, COUNT(oi.id) as item_count
       FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE ${where.join(' AND ')}
       GROUP BY o.id ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM orders o WHERE ${where.join(' AND ')}`,
      params
    );

    res.json({ success: true, orders, pagination: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};