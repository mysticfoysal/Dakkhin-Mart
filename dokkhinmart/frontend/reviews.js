// routes/reviews.js
const express = require('express');
const router = express.Router();
const { addReview, getProductReviews } = require('../controllers/Misccontroller');
const { auth } = require('../middleware/Auth');

router.post('/', auth, addReview);
router.get('/:product_id', getProductReviews);

module.exports = router;
