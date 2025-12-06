import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TransactionForm from '../components/TransactionForm';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { formatEUR, formatCryptoAmount, formatDate } from '../utils/formatters';

const Transactions = () => {
  const { api } = useAuth();
  
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Delete modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    transaction: null
  });

  // Load transactions on mount
  useEffect(() => {
    loadTransactions();
    loadStats();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions');
      setTransactions(response.data.data.transactions);
      setError('');
    } catch (err) {
      setError('Virhe transaktioiden lataamisessa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/transactions/stats');
      setStats(response.data.data.stats);
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const handleCreateTransaction = async (formData) => {
    try {
      setFormLoading(true);
      await api.post('/transactions', formData);
      setSuccess('Transaktio lisätty onnistuneesti!');
      setShowForm(false);
      loadTransactions();
      loadStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Virhe transaktion luomisessa');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTransaction = async (formData) => {
    try {
      setFormLoading(true);
      await api.put(`/transactions/${editingTransaction.id}`, formData);
      setSuccess('Transaktio päivitetty onnistuneesti!');
      setEditingTransaction(null);
      setShowForm(false);
      loadTransactions();
      loadStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Virhe transaktion päivittämisessä');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      await api.delete(`/transactions/${deleteModal.transaction.id}`);
      setSuccess('Transaktio poistettu onnistuneesti!');
      setDeleteModal({ isOpen: false, transaction: null });
      loadTransactions();
      loadStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Virhe transaktion poistamisessa');
    }
  };

  const openEditForm = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const openDeleteModal = (transaction) => {
    setDeleteModal({ isOpen: true, transaction });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ladataan transaktioita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Transaktiot 💼
            </h1>
            <p className="text-gray-600">
              Hallinnoi kryptovaluutta-ostojasi ja -myyntejäsi
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary text-lg px-6 py-3"
          >
            {showForm ? '❌ Sulje lomake' : '➕ Uusi transaktio'}
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 font-medium">✅ {success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">❌ {error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <p className="text-sm text-blue-600 font-medium mb-1">Transaktioita yhteensä</p>
              <p className="text-3xl font-bold text-blue-700">{stats.totalTransactions}</p>
            </div>

            <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <p className="text-sm text-green-600 font-medium mb-1">Ostoja</p>
              <p className="text-3xl font-bold text-green-700">
                {stats.byType?.buy?.count || 0}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {formatEUR(stats.byType?.buy?.total || 0)}
              </p>
            </div>

            <div className="card bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
              <p className="text-sm text-red-600 font-medium mb-1">Myyntejä</p>
              <p className="text-3xl font-bold text-red-700">
                {stats.byType?.sell?.count || 0}
              </p>
              <p className="text-sm text-red-600 mt-1">
                {formatEUR(stats.byType?.sell?.total || 0)}
              </p>
            </div>
          </div>
        )}

        {/* Transaction Form */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingTransaction ? '✏️ Muokkaa transaktiota' : '➕ Uusi transaktio'}
            </h2>
            <TransactionForm
              transaction={editingTransaction}
              onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
              onCancel={closeForm}
              loading={formLoading}
            />
          </div>
        )}

        {/* Transactions Table */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Transaktiohistoria</h2>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 mb-4">Ei vielä transaktioita</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Lisää ensimmäinen transaktio
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Päivämäärä
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Tyyppi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Krypto
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Määrä
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Hinta
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Yhteensä
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Toiminnot
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(transaction.transaction_date).toLocaleDateString('fi-FI')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.transaction_type === 'buy'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.transaction_type === 'buy' ? '📈 Osto' : '📉 Myynti'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {transaction.crypto_symbol}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.crypto_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCryptoAmount(transaction.amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatEUR(transaction.price_eur)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right font-semibold text-gray-900">
                        {formatEUR(transaction.total_eur)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEditForm(transaction)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                            title="Muokkaa"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => openDeleteModal(transaction)}
                            className="text-red-600 hover:text-red-800 font-medium"
                            title="Poista"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleDeleteTransaction}
        onCancel={() => setDeleteModal({ isOpen: false, transaction: null })}
        transaction={deleteModal.transaction}
      />
    </div>
  );
};

export default Transactions;
