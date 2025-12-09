const axios = require('axios');

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Fetch top cryptocurrencies by market cap
const fetchTopCryptos = async (limit = 100, page = 1) => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'eur',
        order: 'market_cap_desc',
        per_page: limit,
        page: page,
        sparkline: false,
        price_change_percentage: '24h,7d'
      },
      timeout: 10000
    });

    return response.data.map(crypto => ({
      id: crypto.id,
      symbol: crypto.symbol.toUpperCase(),
      name: crypto.name,
      image: crypto.image,
      current_price: crypto.current_price,
      market_cap: crypto.market_cap,
      market_cap_rank: crypto.market_cap_rank,
      total_volume: crypto.total_volume,
      price_change_percentage_24h: crypto.price_change_percentage_24h,
      price_change_percentage_7d: crypto.price_change_percentage_7d_in_currency,
      circulating_supply: crypto.circulating_supply,
      total_supply: crypto.total_supply,
      max_supply: crypto.max_supply,
      ath: crypto.ath,
      ath_date: crypto.ath_date,
      atl: crypto.atl,
      atl_date: crypto.atl_date,
      last_updated: crypto.last_updated
    }));

  } catch (error) {
    console.error('Error fetching top cryptos from CoinGecko:', error.message);
    throw new Error('Failed to fetch market data');
  }
};

// Search cryptocurrencies
const searchCryptos = async (query) => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/search`, {
      params: {
        query: query
      },
      timeout: 10000
    });

    return response.data.coins.slice(0, 20).map(crypto => ({
      id: crypto.id,
      symbol: crypto.symbol.toUpperCase(),
      name: crypto.name,
      market_cap_rank: crypto.market_cap_rank,
      thumb: crypto.thumb,
      large: crypto.large
    }));

  } catch (error) {
    console.error('Error searching cryptos from CoinGecko:', error.message);
    throw new Error('Failed to search cryptocurrencies');
  }
};

// Get trending cryptocurrencies
const fetchTrendingCryptos = async () => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/search/trending`, {
      timeout: 10000
    });

    return response.data.coins.map(item => ({
      id: item.item.id,
      symbol: item.item.symbol.toUpperCase(),
      name: item.item.name,
      market_cap_rank: item.item.market_cap_rank,
      thumb: item.item.thumb,
      score: item.item.score
    }));

  } catch (error) {
    console.error('Error fetching trending cryptos from CoinGecko:', error.message);
    throw new Error('Failed to fetch trending cryptocurrencies');
  }
};

// Get global market data
const fetchGlobalMarketData = async () => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/global`, {
      timeout: 10000
    });

    const data = response.data.data;

    return {
      total_market_cap_eur: data.total_market_cap.eur,
      total_volume_eur: data.total_volume.eur,
      market_cap_percentage: data.market_cap_percentage,
      market_cap_change_percentage_24h: data.market_cap_change_percentage_24h_usd,
      active_cryptocurrencies: data.active_cryptocurrencies,
      markets: data.markets,
      updated_at: data.updated_at
    };

  } catch (error) {
    console.error('Error fetching global market data from CoinGecko:', error.message);
    throw new Error('Failed to fetch global market data');
  }
};

module.exports = {
  fetchTopCryptos,
  searchCryptos,
  fetchTrendingCryptos,
  fetchGlobalMarketData
};
