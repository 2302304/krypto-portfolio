const { query } = require('../config/database');
const { fetchPrices, fetchSinglePrice } = require('./coinGeckoService');

// Update all prices in database
const updateAllPrices = async () => {
  try {
    console.log('🔄 Updating crypto prices from CoinGecko...');
    
    const prices = await fetchPrices();
    
    // Upsert prices to database
    for (const price of prices) {
      await query(
        `INSERT INTO price_cache 
          (crypto_symbol, crypto_name, price_eur, price_usd, market_cap, volume_24h, change_24h, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (crypto_symbol) 
        DO UPDATE SET
          price_eur = EXCLUDED.price_eur,
          price_usd = EXCLUDED.price_usd,
          market_cap = EXCLUDED.market_cap,
          volume_24h = EXCLUDED.volume_24h,
          change_24h = EXCLUDED.change_24h,
          last_updated = EXCLUDED.last_updated`,
        [
          price.symbol,
          price.coinId,
          parseFloat(price.priceEur) || 0,
          parseFloat(price.priceUsd) || 0,
          parseFloat(price.marketCap) || 0,
          parseFloat(price.volume24h) || 0,
          parseFloat(price.change24h) || 0,
          price.lastUpdated
        ]
      );
    }

    console.log(`✅ Updated ${prices.length} crypto prices`);
    return prices;

  } catch (error) {
    console.error('❌ Error updating prices:', error.message);
    throw error;
  }
};

// Get all prices from database
const getAllPrices = async () => {
  try {
    const result = await query(
      `SELECT 
        crypto_symbol,
        crypto_name,
        price_eur,
        price_usd,
        market_cap,
        volume_24h,
        change_24h,
        last_updated
      FROM price_cache
      ORDER BY crypto_symbol ASC`
    );

    return result.rows;
  } catch (error) {
    console.error('Error getting prices from database:', error);
    throw error;
  }
};

// Get single price from database
const getPrice = async (symbol) => {
  try {
    const result = await query(
      `SELECT 
        crypto_symbol,
        crypto_name,
        price_eur,
        price_usd,
        market_cap,
        volume_24h,
        change_24h,
        last_updated
      FROM price_cache
      WHERE crypto_symbol = $1`,
      [symbol.toUpperCase()]
    );

    if (result.rows.length === 0) {
      // If not in cache, fetch from API
      const freshPrice = await fetchSinglePrice(symbol);
      
      // Save to cache
      await query(
        `INSERT INTO price_cache 
          (crypto_symbol, crypto_name, price_eur, price_usd, market_cap, volume_24h, change_24h, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (crypto_symbol) 
        DO UPDATE SET
          price_eur = EXCLUDED.price_eur,
          price_usd = EXCLUDED.price_usd,
          market_cap = EXCLUDED.market_cap,
          volume_24h = EXCLUDED.volume_24h,
          change_24h = EXCLUDED.change_24h,
          last_updated = EXCLUDED.last_updated`,
        [
          freshPrice.symbol,
          freshPrice.coinId,
          parseFloat(freshPrice.priceEur) || 0,
          parseFloat(freshPrice.priceUsd) || 0,
          parseFloat(freshPrice.marketCap) || 0,
          parseFloat(freshPrice.volume24h) || 0,
          parseFloat(freshPrice.change24h) || 0,
          freshPrice.lastUpdated
        ]
      );

      return freshPrice;
    }

    return result.rows[0];
  } catch (error) {
    console.error(`Error getting price for ${symbol}:`, error);
    throw error;
  }
};

// Check if prices are stale (older than 10 minutes)
const arePricesStale = async () => {
  try {
    const result = await query(
      `SELECT MAX(last_updated) as latest FROM price_cache`
    );

    if (result.rows.length === 0 || !result.rows[0].latest) {
      return true;
    }

    const latestUpdate = new Date(result.rows[0].latest);
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    return latestUpdate < tenMinutesAgo;
  } catch (error) {
    console.error('Error checking price staleness:', error);
    return true; // Assume stale on error
  }
};

module.exports = {
  updateAllPrices,
  getAllPrices,
  getPrice,
  arePricesStale
};
