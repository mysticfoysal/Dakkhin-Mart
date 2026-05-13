const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Correct Frontend Folder
const FRONTEND = path.join(__dirname, 'frontend');

app.use(express.static(FRONTEND));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Page Routes
const pageMap = {
  '/': 'index.html',
  '/home': 'index.html',
  '/shop': 'pages/shop.html',
  '/about': 'pages/about.html',
  '/contact': 'pages/contact.html',
  '/auth': 'pages/auth.html',
  '/login': 'pages/auth.html',
  '/register': 'pages/auth.html',
  '/cart': 'pages/cart.html',
  '/checkout': 'pages/checkout.html',
  '/profile': 'pages/profile.html',
  '/wishlist': 'pages/wishlist.html',
  '/product': 'pages/product.html',
  '/admin': 'admin.html',
  '/admin-login': 'admin-login.html',
  '/add-product': 'admin-add-product.html',
};

for (const [route, file] of Object.entries(pageMap)) {
  app.get(route, (req, res) => {
    res.sendFile(path.join(FRONTEND, file));
  });
}

// 404
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'API route not found'
    });
  }

  res.sendFile(path.join(FRONTEND, 'index.html'));
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FreshMart server running at: http://localhost:${PORT}`);
});