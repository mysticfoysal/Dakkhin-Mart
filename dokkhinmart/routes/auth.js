// routes/auth.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register',         ctrl.register);
router.post('/login',            ctrl.login);
router.get('/profile',    auth,  ctrl.getProfile);
router.put('/profile',    auth,  ctrl.updateProfile);
router.put('/change-password', auth, ctrl.changePassword);
router.get('/my-orders',  auth,  ctrl.getMyOrders);

module.exports = router;
