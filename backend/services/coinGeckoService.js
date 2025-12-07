const axios = require('axios');

// CoinGecko API base URL
const COINGECKO_API_URL = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';

// Map our crypto symbols to CoinGecko IDs
const CRYPTO_ID_MAP = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'BNB': 'binancecoin',
  'SOL': 'solana',
  'XRP': 'ripple',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'TRX': 'tron',
  'DOT': 'polkadot',
  'MATIC': 'matic-network',
  'LTC': 'litecoin',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'ATOM': 'cosmos',
  'UNI': 'uniswap',
  'XLM': 'stellar',
  'ALGO': 'algorand',
  'VET': 'vechain',
  'FIL': 'filecoin',
  'NEAR': 'near',
  'APT': 'aptos',
  'ARB': 'arbitrum',
  'OP': 'optimism',
  'ICP': 'internet-computer',
  'HBAR': 'hedera-hashgraph',
  'INJ': 'injective-protocol',
  'IMX': 'immutable-x',
  'GRT': 'the-graph',
  'AAVE': 'aave',
  'MKR': 'maker'
};

// Get coin IDs from symbols
const getCoinIds = () => {
  return Object.values(CRYPTO_ID_MAP).join(',');
};

// Fetch prices from CoinGecko
const fetchPrices = async () => {
  try {
    const coinIds = getCoinIds();
    
    const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: coinIds,
        vs_currencies: 'eur,usd',
        include_market_cap: true,
        include_24hr_vol: true,
        include_24hr_change: true,
        include_last_updated_at: true
      },
      timeout: 10000 // 10 second timeout
    });

    // Transform data to our format
    const prices = [];
    
    for (const [symbol, coinId] of Object.entries(CRYPTO_ID_MAP)) {
      const data = response.data[coinId];
      
      if (data) {
        prices.push({
          symbol,
          coinId,
          priceEur: data.eur || 0,
          priceUsd: data.usd || 0,
          marketCap: data.eur_market_cap || 0,
          volume24h: data.eur_24h_vol || 0,
          change24h: data.eur_24h_change || 0,
          lastUpdated: data.last_updated_at ? new Date(data.last_updated_at * 1000) : new Date()
        });
      }
    }

    return prices;

  } catch (error) {
    console.error('CoinGecko API error:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    throw new Error('Failed to fetch prices from CoinGecko');
  }
};

// Fetch single price
const fetchSinglePrice = async (symbol) => {
  try {
    const coinId = CRYPTO_ID_MAP[symbol.toUpperCase()];
    
    if (!coinId) {
      throw new Error(`Unknown cryptocurrency symbol: ${symbol}`);
    }

    const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: coinId,
        vs_currencies: 'eur,usd',
        include_market_cap: true,
        include_24hr_vol: true,
        include_24hr_change: true,
        include_last_updated_at: true
      },
      timeout: 10000
    });

    const data = response.data[coinId];
    
    if (!data) {
      throw new Error(`No data found for ${symbol}`);
    }

    return {
      symbol: symbol.toUpperCase(),
      coinId,
      priceEur: data.eur || 0,
      priceUsd: data.usd || 0,
      marketCap: data.eur_market_cap || 0,
      volume24h: data.eur_24h_vol || 0,
      change24h: data.eur_24h_change || 0,
      lastUpdated: data.last_updated_at ? new Date(data.last_updated_at * 1000) : new Date()
    };

  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error.message);
    throw error;
  }
};

// Get supported symbols
const getSupportedSymbols = () => {
  return Object.keys(CRYPTO_ID_MAP);
};

module.exports = {
  fetchPrices,
  fetchSinglePrice,
  getSupportedSymbols,
  CRYPTO_ID_MAP
};
