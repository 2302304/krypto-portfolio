const { query } = require('../config/database');
const { validationResult } = require('express-validator');

// @desc    Get all transactions for logged-in user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(
      `SELECT 
        id, 
        crypto_symbol, 
        crypto_name, 
        amount, 
        price_eur, 
        total_eur, 
        transaction_type, 
        transaction_date, 
        notes, 
        created_at, 
        updated_at
      FROM transactions 
      WHERE user_id = $1 
      ORDER BY transaction_date DESC, created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: {
        transactions: result.rows
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe transaktioiden haussa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await query(
      `SELECT * FROM transactions WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaktiota ei löytynyt'
      });
    }

    res.json({
      success: true,
      data: {
        transaction: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe transaktion haussa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const userId = req.user.userId;
    const {
      cryptoSymbol,
      cryptoName,
      amount,
      priceEur,
      transactionType,
      transactionDate,
      notes
    } = req.body;

    // Calculate total
    const totalEur = (parseFloat(amount) * parseFloat(priceEur)).toFixed(2);

    const result = await query(
      `INSERT INTO transactions 
        (user_id, crypto_symbol, crypto_name, amount, price_eur, total_eur, transaction_type, transaction_date, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        userId,
        cryptoSymbol.toUpperCase(),
        cryptoName,
        amount,
        priceEur,
        totalEur,
        transactionType,
        transactionDate,
        notes || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Transaktio luotu onnistuneesti',
      data: {
        transaction: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe transaktion luomisessa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const userId = req.user.userId;
    const {
      cryptoSymbol,
      cryptoName,
      amount,
      priceEur,
      transactionType,
      transactionDate,
      notes
    } = req.body;

    // Check if transaction exists and belongs to user
    const checkResult = await query(
      'SELECT id FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaktiota ei löytynyt tai ei oikeutta muokata'
      });
    }

    // Calculate total
    const totalEur = (parseFloat(amount) * parseFloat(priceEur)).toFixed(2);

    const result = await query(
      `UPDATE transactions 
      SET 
        crypto_symbol = $1,
        crypto_name = $2,
        amount = $3,
        price_eur = $4,
        total_eur = $5,
        transaction_type = $6,
        transaction_date = $7,
        notes = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9 AND user_id = $10
      RETURNING *`,
      [
        cryptoSymbol.toUpperCase(),
        cryptoName,
        amount,
        priceEur,
        totalEur,
        transactionType,
        transactionDate,
        notes || null,
        id,
        userId
      ]
    );

    res.json({
      success: true,
      message: 'Transaktio päivitetty onnistuneesti',
      data: {
        transaction: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe transaktion päivittämisessä',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if transaction exists and belongs to user
    const checkResult = await query(
      'SELECT id FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaktiota ei löytynyt tai ei oikeutta poistaa'
      });
    }

    await query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.json({
      success: true,
      message: 'Transaktio poistettu onnistuneesti'
    });

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe transaktion poistamisessa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get transaction statistics
// @route   GET /api/transactions/stats
// @access  Private
const getTransactionStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get total number of transactions
    const countResult = await query(
      'SELECT COUNT(*) as total FROM transactions WHERE user_id = $1',
      [userId]
    );

    // Get buy vs sell counts
    const typeResult = await query(
      `SELECT 
        transaction_type, 
        COUNT(*) as count, 
        SUM(total_eur) as total
      FROM transactions 
      WHERE user_id = $1 
      GROUP BY transaction_type`,
      [userId]
    );

    // Get total invested
    const totalInvestedResult = await query(
      `SELECT SUM(total_eur) as total_invested 
      FROM transactions 
      WHERE user_id = $1 AND transaction_type = 'buy'`,
      [userId]
    );

    const stats = {
      totalTransactions: parseInt(countResult.rows[0].total),
      totalInvested: parseFloat(totalInvestedResult.rows[0]?.total_invested || 0),
      byType: typeResult.rows.reduce((acc, row) => {
        acc[row.transaction_type] = {
          count: parseInt(row.count),
          total: parseFloat(row.total)
        };
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Virhe tilastojen haussa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
};
