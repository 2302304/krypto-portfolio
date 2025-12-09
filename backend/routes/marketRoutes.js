const express = require('express');
const router = express.Router();
const {
  getTopCryptos,
  searchCryptosController,
  getTrendingCryptos,
  getGlobalMarketData
} = require('../controllers/marketController');

// Public routes (no authentication required)
router.get('/top', getTopCryptos);
router.get('/search', searchCryptosController);
router.get('/trending', getTrendingCryptos);
router.get('/global', getGlobalMarketData);

module.exports = router;
