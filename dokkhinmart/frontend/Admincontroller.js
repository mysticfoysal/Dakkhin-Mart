const db = require('../config/db');

// Dashboard stats
exports.getDashboard = async (req, res) => {
  try {
    const [[{ total_orders }]] = await db.query('SELECT COUNT(*) as total_orders FROM orders');
    const [[{ total_revenue }]] = await db.query("SELECT COALESCE(SUM(total),0) as total_revenue FROM orders WHERE order_status != 'cancelled'");
    const [[{ total_customers }]] = await db.query("SELECT COUNT(*) as total_customers FROM users WHERE role='customer'");
    const [[{ total_products }]] = await db.query('SELECT COUNT(*) as total_products FROM products WHERE is_active=TRUE');
    const [[{ pending_orders }]] = await db.query("SELECT COUNT(*) as pending_orders FROM orders WHERE order_status='pending'");

    const [recentOrders] = await db.query(
      'SELECT id, order_number, customer_name, total, order_status, created_at FROM orders ORDER BY created_at DESC LIMIT 5'
    );

    const [topProducts] = await db.query(
      'SELECT id, name, total_sold, price, thumbnail FROM products WHERE is_active=TRUE ORDER BY total_sold DESC LIMIT 5'
    );

    const [monthlyRevenue] = await db.query(
      `SELECT DATE_FORMAT(created_at,'%Y-%m') as month, SUM(total) as revenue, COUNT(*) as orders
       FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH) AND order_status != 'cancelled'
       GROUP BY month ORDER BY month ASC`
    );

    const [ordersByStatus] = await db.query(
      'SELECT order_status, COUNT(*) as count FROM orders GROUP BY order_status'
    );

    res.json({
      success: true,
      stats: { total_orders, total_revenue, total_customers, total_products, pending_orders },
      recentOrders, topProducts, monthlyRevenue, ordersByStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    let where = ["role = 'customer'"];
    const params = [];
    if (search) {
      where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    const offset = (Number(page) - 1) * Number(limit);
    const [users] = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, u.created_at,
        COUNT(DISTINCT o.id) as order_count, COALESCE(SUM(o.total),0) as total_spent
       FROM users u LEFT JOIN orders o ON u.id = o.user_id
       WHERE ${where.join(' AND ')}
       GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};