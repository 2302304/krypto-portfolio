const express = require('express');
const router = express.Router();
const {
  getPortfolio,
  getPerformance,
  getTopPerformersController,
  getAllocation
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

// All routes are protected (require authentication)
router.use(protect);

// Routes
router.get('/', getPortfolio);
router.get('/performance', getPerformance);
router.get('/top-performers', getTopPerformersController);
router.get('/allocation', getAllocation);

module.exports = router;
