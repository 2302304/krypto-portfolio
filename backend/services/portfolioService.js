const { query } = require('../config/database');

// Calculate user's holdings (what they own now)
const calculateHoldings = async (userId) => {
  try {
    const result = await query(
      `SELECT 
        crypto_symbol,
        crypto_name,
        SUM(CASE WHEN transaction_type = 'buy' THEN amount ELSE -amount END) as total_amount,
        SUM(CASE WHEN transaction_type = 'buy' THEN total_eur ELSE -total_eur END) as total_invested
      FROM transactions
      WHERE user_id = $1
      GROUP BY crypto_symbol, crypto_name
      HAVING SUM(CASE WHEN transaction_type = 'buy' THEN amount ELSE -amount END) > 0
      ORDER BY total_invested DESC`,
      [userId]
    );

    return result.rows;
  } catch (error) {
    console.error('Error calculating holdings:', error);
    throw error;
  }
};

// Calculate portfolio value with current prices
const calculatePortfolioValue = async (userId) => {
  try {
    // Get holdings
    const holdings = await calculateHoldings(userId);

    if (holdings.length === 0) {
      return {
        holdings: [],
        totalValue: 0,
        totalInvested: 0,
        totalProfitLoss: 0,
        totalProfitLossPercent: 0
      };
    }

    // Get current prices for all holdings
    const symbols = holdings.map(h => h.crypto_symbol);
    const pricesResult = await query(
      `SELECT crypto_symbol, price_eur, change_24h 
       FROM price_cache 
       WHERE crypto_symbol = ANY($1)`,
      [symbols]
    );

    // Create price map
    const priceMap = {};
    pricesResult.rows.forEach(row => {
      priceMap[row.crypto_symbol] = {
        price: parseFloat(row.price_eur),
        change24h: parseFloat(row.change_24h) || 0
      };
    });

    // Calculate values for each holding
    const enrichedHoldings = holdings.map(holding => {
      const amount = parseFloat(holding.total_amount);
      const invested = parseFloat(holding.total_invested);
      const currentPrice = priceMap[holding.crypto_symbol]?.price || 0;
      const change24h = priceMap[holding.crypto_symbol]?.change24h || 0;
      
      const currentValue = amount * currentPrice;
      const profitLoss = currentValue - invested;
      const profitLossPercent = invested > 0 ? (profitLoss / invested) * 100 : 0;
      const averageBuyPrice = amount > 0 ? invested / amount : 0;

      return {
        crypto_symbol: holding.crypto_symbol,
        crypto_name: holding.crypto_name,
        amount: amount,
        average_buy_price: averageBuyPrice,
        current_price: currentPrice,
        invested: invested,
        current_value: currentValue,
        profit_loss: profitLoss,
        profit_loss_percent: profitLossPercent,
        change_24h: change24h
      };
    });

    // Calculate totals
    const totalInvested = enrichedHoldings.reduce((sum, h) => sum + h.invested, 0);
    const totalValue = enrichedHoldings.reduce((sum, h) => sum + h.current_value, 0);
    const totalProfitLoss = totalValue - totalInvested;
    const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    return {
      holdings: enrichedHoldings,
      totalValue,
      totalInvested,
      totalProfitLoss,
      totalProfitLossPercent
    };

  } catch (error) {
    console.error('Error calculating portfolio value:', error);
    throw error;
  }
};

// Get portfolio performance over time (basic version)
const getPortfolioPerformance = async (userId) => {
  try {
    // Get all transactions ordered by date
    const result = await query(
      `SELECT 
        transaction_date,
        crypto_symbol,
        amount,
        total_eur,
        transaction_type
      FROM transactions
      WHERE user_id = $1
      ORDER BY transaction_date ASC`,
      [userId]
    );

    return result.rows;
  } catch (error) {
    console.error('Error getting portfolio performance:', error);
    throw error;
  }
};

// Get top performers
const getTopPerformers = async (userId, limit = 5) => {
  try {
    const portfolio = await calculatePortfolioValue(userId);
    
    if (!portfolio.holdings || portfolio.holdings.length === 0) {
      return [];
    }

    // Sort by profit_loss_percent
    const sorted = [...portfolio.holdings].sort((a, b) => b.profit_loss_percent - a.profit_loss_percent);
    
    return sorted.slice(0, limit);
  } catch (error) {
    console.error('Error getting top performers:', error);
    throw error;
  }
};

// Get portfolio allocation (percentage per crypto)
const getPortfolioAllocation = async (userId) => {
  try {
    const portfolio = await calculatePortfolioValue(userId);
    
    if (!portfolio.holdings || portfolio.holdings.length === 0) {
      return [];
    }

    const totalValue = portfolio.totalValue;

    return portfolio.holdings.map(holding => ({
      crypto_symbol: holding.crypto_symbol,
      crypto_name: holding.crypto_name,
      value: holding.current_value,
      percentage: totalValue > 0 ? (holding.current_value / totalValue) * 100 : 0
    }));
  } catch (error) {
    console.error('Error getting portfolio allocation:', error);
    throw error;
  }
};

module.exports = {
  calculateHoldings,
  calculatePortfolioValue,
  getPortfolioPerformance,
  getTopPerformers,
  getPortfolioAllocation
};
