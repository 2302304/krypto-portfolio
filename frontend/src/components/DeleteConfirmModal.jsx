import React from 'react';

const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, transaction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Vahvista poisto
          </h3>
          <p className="text-gray-600">
            Haluatko varmasti poistaa tämän transaktion?
          </p>
        </div>

        {transaction && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Krypto:</span>
              <span className="font-semibold">{transaction.crypto_symbol}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Määrä:</span>
              <span className="font-semibold">{transaction.amount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tyyppi:</span>
              <span className={`font-semibold ${
                transaction.transaction_type === 'buy' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.transaction_type === 'buy' ? 'Osto' : 'Myynti'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Yhteensä:</span>
              <span className="font-bold text-lg">{transaction.total_eur} €</span>
            </div>
          </div>
        )}

        <p className="text-sm text-red-600 mb-6 text-center">
          Tätä toimintoa ei voi perua!
        </p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Peruuta
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 btn-danger"
          >
            Poista
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
