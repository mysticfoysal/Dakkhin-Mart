const express = require('express');
const router = express.Router();
const { createOrder, getOrder, updateOrderStatus, getAllOrders } = require('../controllers/Ordercontroller');
const { auth, adminAuth, optionalAuth } = require('../middleware/Auth');

router.post('/', optionalAuth, createOrder);
router.get('/', adminAuth, getAllOrders);
router.get('/:id', optionalAuth, getOrder);
router.put('/:id/status', adminAuth, updateOrderStatus);

module.exports = router;
