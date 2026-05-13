const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getTopSelling } = require('../controllers/Productcontroller');
const { auth, adminAuth } = require('../middleware/Auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getProducts);
router.get('/top-selling', getTopSelling);
router.get('/:slug', getProduct);
router.post('/', adminAuth, upload.array('images', 5), createProduct);
router.put('/:id', adminAuth, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;
