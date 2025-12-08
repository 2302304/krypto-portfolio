const {
  calculatePortfolioValue,
  getPortfolioPerformance,
  getTopPerformers,
  getPortfolioAllocation
} = require('../services/portfolioService');

// @desc    Get user's portfolio value and holdings
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.userId;

    const portfolio = await calculatePortfolioValue(userId);

    res.json({
      success: true,
      data: portfolio
    });

  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe portfolion haussa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get portfolio performance over time
// @route   GET /api/portfolio/performance
// @access  Private
const getPerformance = async (req, res) => {
  try {
    const userId = req.user.userId;

    const performance = await getPortfolioPerformance(userId);

    res.json({
      success: true,
      data: {
        performance
      }
    });

  } catch (error) {
    console.error('Get performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe suorituskyvyn haussa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get top performing cryptocurrencies
// @route   GET /api/portfolio/top-performers
// @access  Private
const getTopPerformersController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 5;

    const topPerformers = await getTopPerformers(userId, limit);

    res.json({
      success: true,
      data: {
        topPerformers
      }
    });

  } catch (error) {
    console.error('Get top performers error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe parhaiden suorittajien haussa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get portfolio allocation (percentage per crypto)
// @route   GET /api/portfolio/allocation
// @access  Private
const getAllocation = async (req, res) => {
  try {
    const userId = req.user.userId;

    const allocation = await getPortfolioAllocation(userId);

    res.json({
      success: true,
      data: {
        allocation
      }
    });

  } catch (error) {
    console.error('Get allocation error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe allokaation haussa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getPortfolio,
  getPerformance,
  getTopPerformersController,
  getAllocation
};
