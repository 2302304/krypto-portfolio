const {
  fetchTopCryptos,
  searchCryptos,
  fetchTrendingCryptos,
  fetchGlobalMarketData
} = require('../services/marketService');

// @desc    Get top cryptocurrencies
// @route   GET /api/market/top
// @access  Public
const getTopCryptos = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const page = parseInt(req.query.page) || 1;

    const cryptos = await fetchTopCryptos(limit, page);

    res.json({
      success: true,
      count: cryptos.length,
      data: {
        cryptos
      }
    });

  } catch (error) {
    console.error('Get top cryptos error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe markkinadatan haussa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Search cryptocurrencies
// @route   GET /api/market/search
// @access  Public
const searchCryptosController = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Hakusana vaaditaan'
      });
    }

    const results = await searchCryptos(query);

    res.json({
      success: true,
      count: results.length,
      data: {
        results
      }
    });

  } catch (error) {
    console.error('Search cryptos error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe haun suorittamisessa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get trending cryptocurrencies
// @route   GET /api/market/trending
// @access  Public
const getTrendingCryptos = async (req, res) => {
  try {
    const trending = await fetchTrendingCryptos();

    res.json({
      success: true,
      count: trending.length,
      data: {
        trending
      }
    });

  } catch (error) {
    console.error('Get trending cryptos error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe trendaavien kryptojen haussa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get global market data
// @route   GET /api/market/global
// @access  Public
const getGlobalMarketData = async (req, res) => {
  try {
    const globalData = await fetchGlobalMarketData();

    res.json({
      success: true,
      data: globalData
    });

  } catch (error) {
    console.error('Get global market data error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe globaalin markkinadatan haussa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getTopCryptos,
  searchCryptosController,
  getTrendingCryptos,
  getGlobalMarketData
};
