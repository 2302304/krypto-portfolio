const { getAllPrices, getPrice, updateAllPrices, arePricesStale } = require('../services/priceService');

// @desc    Get all cryptocurrency prices
// @route   GET /api/prices
// @access  Public (but can be protected if needed)
const getPrices = async (req, res) => {
  try {
    // Check if prices are stale
    const stale = await arePricesStale();
    
    // Get prices from cache
    const prices = await getAllPrices();

    res.json({
      success: true,
      stale,
      count: prices.length,
      data: {
        prices
      }
    });

  } catch (error) {
    console.error('Get prices error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe hintojen haussa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single cryptocurrency price
// @route   GET /api/prices/:symbol
// @access  Public
const getSinglePrice = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const price = await getPrice(symbol);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: `Kryptovaluuttaa ${symbol.toUpperCase()} ei löytynyt`
      });
    }

    res.json({
      success: true,
      data: {
        price
      }
    });

  } catch (error) {
    console.error('Get single price error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe hinnan haussa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Force refresh all prices
// @route   POST /api/prices/refresh
// @access  Private (admin only ideally)
const refreshPrices = async (req, res) => {
  try {
    const prices = await updateAllPrices();

    res.json({
      success: true,
      message: 'Hinnat päivitetty onnistuneesti',
      count: prices.length,
      data: {
        prices
      }
    });

  } catch (error) {
    console.error('Refresh prices error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe hintojen päivityksessä',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getPrices,
  getSinglePrice,
  refreshPrices
};
