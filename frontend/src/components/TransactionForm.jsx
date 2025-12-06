import React, { useState, useEffect } from 'react';
import { CRYPTO_LIST } from '../utils/cryptoList';
import { getTodayDate } from '../utils/formatters';

const TransactionForm = ({ transaction, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    cryptoSymbol: '',
    cryptoName: '',
    amount: '',
    priceEur: '',
    transactionType: 'buy',
    transactionDate: getTodayDate(),
    notes: ''
  });

  const [errors, setErrors] = useState([]);

  // If editing, populate form
  useEffect(() => {
    if (transaction) {
      setFormData({
        cryptoSymbol: transaction.crypto_symbol,
        cryptoName: transaction.crypto_name,
        amount: transaction.amount,
        priceEur: transaction.price_eur,
        transactionType: transaction.transaction_type,
        transactionDate: new Date(transaction.transaction_date).toISOString().split('T')[0],
        notes: transaction.notes || ''
      });
    }
  }, [transaction]);

  const handleCryptoChange = (e) => {
    const symbol = e.target.value;
    const crypto = CRYPTO_LIST.find(c => c.symbol === symbol);
    
    setFormData({
      ...formData,
      cryptoSymbol: symbol,
      cryptoName: crypto ? crypto.name : ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const price = parseFloat(formData.priceEur) || 0;
    return (amount * price).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    
    // Basic validation
    if (!formData.cryptoSymbol || !formData.amount || !formData.priceEur) {
      setErrors(['Täytä kaikki pakolliset kentät']);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-600 text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Transaction Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaktiotyyppi *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="transactionType"
              value="buy"
              checked={formData.transactionType === 'buy'}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-green-600 font-medium">Osto</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="transactionType"
              value="sell"
              checked={formData.transactionType === 'sell'}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-red-600 font-medium">Myynti</span>
          </label>
        </div>
      </div>

      {/* Crypto Selection */}
      <div>
        <label htmlFor="cryptoSymbol" className="block text-sm font-medium text-gray-700 mb-2">
          Kryptovaluutta *
        </label>
        <select
          id="cryptoSymbol"
          name="cryptoSymbol"
          value={formData.cryptoSymbol}
          onChange={handleCryptoChange}
          className="input"
          required
        >
          <option value="">Valitse kryptovaluutta</option>
          {CRYPTO_LIST.map((crypto) => (
            <option key={crypto.symbol} value={crypto.symbol}>
              {crypto.symbol} - {crypto.name}
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          Määrä *
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          step="0.00000001"
          min="0.00000001"
          value={formData.amount}
          onChange={handleChange}
          className="input"
          placeholder="0.00000000"
          required
        />
      </div>

      {/* Price */}
      <div>
        <label htmlFor="priceEur" className="block text-sm font-medium text-gray-700 mb-2">
          Hinta (€) *
        </label>
        <input
          type="number"
          id="priceEur"
          name="priceEur"
          step="0.01"
          min="0.01"
          value={formData.priceEur}
          onChange={handleChange}
          className="input"
          placeholder="0.00"
          required
        />
      </div>

      {/* Total (calculated) */}
      {formData.amount && formData.priceEur && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700 mb-1">Yhteensä:</p>
          <p className="text-2xl font-bold text-primary-600">
            {calculateTotal()} €
          </p>
        </div>
      )}

      {/* Date */}
      <div>
        <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700 mb-2">
          Päivämäärä *
        </label>
        <input
          type="date"
          id="transactionDate"
          name="transactionDate"
          value={formData.transactionDate}
          onChange={handleChange}
          max={getTodayDate()}
          className="input"
          required
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Huomautukset
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          className="input"
          placeholder="Vapaaehtoisia huomautuksia transaktiosta..."
          maxLength="500"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.notes.length}/500 merkkiä
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Tallennetaan...' : (transaction ? 'Päivitä' : 'Tallenna')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 btn-secondary"
        >
          Peruuta
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
