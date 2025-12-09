import React from 'react';
import { formatEUR, formatCryptoAmount } from '../utils/formatters';

const RecentTransactions = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Viimeisimmät transaktiot</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Viimeisimmät transaktiot</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500 mb-3">Ei vielä transaktioita</p>
          <a href="/transactions" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Lisää ensimmäinen transaktio →
          </a>
        </div>
      </div>
    );
  }

  // Take only last 5 transactions
  const recentTx = transactions.slice(0, 5);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Viimeisimmät transaktiot</h3>
        <a href="/transactions" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
          Näytä kaikki →
        </a>
      </div>

      <div className="space-y-2">
        {recentTx.map((tx) => (
          <div 
            key={tx.id} 
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
          >
            <div className="flex items-center gap-3 flex-1">
              {/* Type badge */}
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                tx.transaction_type === 'buy'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {tx.transaction_type === 'buy' ? '📈' : '📉'}
              </span>

              {/* Crypto info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{tx.crypto_symbol}</span>
                  <span className="text-xs text-gray-500">
                    {formatCryptoAmount(tx.amount)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(tx.transaction_date).toLocaleDateString('fi-FI')}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right">
              <p className={`font-semibold ${
                tx.transaction_type === 'buy' ? 'text-red-600' : 'text-green-600'
              }`}>
                {tx.transaction_type === 'buy' ? '-' : '+'}{formatEUR(tx.total_eur)}
              </p>
              <p className="text-xs text-gray-500">
                @ {formatEUR(tx.price_eur)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
