// routes/admin.js
const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const ctrl    = require('../controllers/adminController');

// ── Multer storage ───────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase())
           && allowed.test(file.mimetype);
  ok ? cb(null, true) : cb(new Error('Only image files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ── Routes ───────────────────────────────────────────────
router.get('/stats',                  ctrl.getStats);
router.get('/categories',             ctrl.getCategories);

router.get('/products',               ctrl.getProducts);
router.post('/products', upload.single('picture'), ctrl.addProduct);
router.delete('/products/:id',        ctrl.deleteProduct);

router.get('/users',                  ctrl.getUsers);

router.get('/orders',                 ctrl.getOrders);
router.put('/orders/:id/status',      ctrl.updateOrderStatus);

module.exports = router;
