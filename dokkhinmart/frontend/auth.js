const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword, getMyOrders } = require('../controllers/Authcontroller');
const { auth } = require('../middleware/Auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.get('/orders', auth, getMyOrders);

module.exports = router;
