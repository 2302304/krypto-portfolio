import React from 'react';
import { formatEUR } from '../utils/formatters';

const TopPerformers = ({ holdings, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Parhaat suorittajat</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Parhaat suorittajat</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-gray-500">Ei dataa näytettäväksi</p>
        </div>
      </div>
    );
  }

  // Sort by profit_loss_percent and take top 3
  const topPerformers = [...holdings]
    .sort((a, b) => b.profit_loss_percent - a.profit_loss_percent)
    .slice(0, 3);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Parhaat suorittajat</h3>
        <a href="/portfolio" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
          Näytä kaikki →
        </a>
      </div>

      <div className="space-y-3">
        {topPerformers.map((holding, index) => (
          <div 
            key={holding.crypto_symbol}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
          >
            {/* Medal and crypto */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">{medals[index]}</span>
              <div>
                <p className="font-semibold text-gray-900">{holding.crypto_symbol}</p>
                <p className="text-xs text-gray-500">{holding.crypto_name}</p>
              </div>
            </div>

            {/* Performance */}
            <div className="text-right">
              <p className={`font-bold text-lg ${
                holding.profit_loss_percent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {holding.profit_loss_percent >= 0 ? '+' : ''}{holding.profit_loss_percent.toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500">
                {holding.profit_loss >= 0 ? '+' : ''}{formatEUR(holding.profit_loss)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {holdings.length > 3 && (
        <div className="mt-4 text-center">
          <a 
            href="/portfolio" 
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Näytä kaikki {holdings.length} kryptovaluuttaa →
          </a>
        </div>
      )}
    </div>
  );
};

export default TopPerformers;
