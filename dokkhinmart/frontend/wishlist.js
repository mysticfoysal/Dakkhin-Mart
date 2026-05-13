const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist } = require('../controllers/Misccontroller');
const { auth } = require('../middleware/Auth');

router.get('/', auth, getWishlist);
router.post('/toggle', auth, toggleWishlist);

module.exports = router;
