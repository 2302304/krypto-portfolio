const express = require('express');
const router = express.Router();
const {
  getPrices,
  getSinglePrice,
  refreshPrices
} = require('../controllers/priceController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getPrices);
router.get('/:symbol', getSinglePrice);

// Protected routes
router.post('/refresh', protect, refreshPrices);

module.exports = router;
