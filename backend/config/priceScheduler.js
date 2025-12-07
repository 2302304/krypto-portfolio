const cron = require('node-cron');
const { updateAllPrices } = require('../services/priceService');

// Schedule price updates every 5 minutes
const startPriceScheduler = () => {
  console.log('⏰ Starting price update scheduler (every 5 minutes)...');

  // Run immediately on startup
  updateAllPrices()
    .then(() => console.log('✅ Initial price update completed'))
    .catch(err => console.error('❌ Initial price update failed:', err.message));

  // Schedule updates every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('⏰ Scheduled price update triggered...');
    try {
      await updateAllPrices();
    } catch (error) {
      console.error('❌ Scheduled price update failed:', error.message);
    }
  });

  console.log('✅ Price scheduler started successfully');
};

module.exports = { startPriceScheduler };
