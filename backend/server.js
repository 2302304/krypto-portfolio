const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Import routes
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const priceRoutes = require('./routes/priceRoutes');

// Import price scheduler
const { startPriceScheduler } = require('./config/priceScheduler');

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Krypto Portfolio API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Krypto Portfolio API',
    version: '1.0.0',
    phase: 'Phase 4 - CoinGecko API Integration',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (protected)',
        logout: 'POST /api/auth/logout (protected)'
      },
      transactions: {
        getAll: 'GET /api/transactions (protected)',
        getOne: 'GET /api/transactions/:id (protected)',
        create: 'POST /api/transactions (protected)',
        update: 'PUT /api/transactions/:id (protected)',
        delete: 'DELETE /api/transactions/:id (protected)',
        stats: 'GET /api/transactions/stats (protected)'
      },
      prices: {
        getAll: 'GET /api/prices',
        getOne: 'GET /api/prices/:symbol',
        refresh: 'POST /api/prices/refresh (protected)'
      },
      portfolio: '/api/portfolio (coming in Phase 5)',
      market: '/api/market (coming in Phase 7)'
    }
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/prices', priceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.url} not found`,
    availableRoutes: '/api'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: /api/auth`);
  console.log(`💰 Transaction endpoints: /api/transactions`);
  console.log(`💹 Price endpoints: /api/prices`);
  
  // Start price update scheduler
  startPriceScheduler();
});

module.exports = app;
