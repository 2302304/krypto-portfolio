const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const { transactionValidation } = require('../middleware/transactionValidation');

// All routes are protected (require authentication)
router.use(protect);

// Routes
router.route('/')
  .get(getTransactions)
  .post(transactionValidation, createTransaction);

router.get('/stats', getTransactionStats);

router.route('/:id')
  .get(getTransaction)
  .put(transactionValidation, updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
