const express = require('express');
const router = express.Router();
const { getDashboard, getCustomers } = require('../controllers/Admincontroller');
const { adminAuth } = require('../middleware/Auth');

router.get('/dashboard', adminAuth, getDashboard);
router.get('/customers', adminAuth, getCustomers);

module.exports = router;
