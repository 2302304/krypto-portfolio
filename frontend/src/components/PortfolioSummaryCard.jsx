import React from 'react';
import { formatEUR } from '../utils/formatters';

const PortfolioSummaryCard = ({ portfolio, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
    return (
      <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
        <div className="text-center py-8">
          <div className="text-5xl mb-4">💼</div>
          <p className="text-lg font-semibold text-gray-700 mb-2">Aloita portfoliosi seuranta</p>
          <p className="text-sm text-gray-600 mb-4">Lisää ensimmäinen transaktio päästäksesi alkuun</p>
          <a href="/transactions" className="btn-primary inline-block">
            ➕ Lisää transaktio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Total Value */}
      <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-blue-600 font-medium">Portfolio-arvo</p>
          <span className="text-2xl">💰</span>
        </div>
        <p className="text-3xl font-bold text-blue-700 mb-1">
          {formatEUR(portfolio.totalValue)}
        </p>
        <p className="text-xs text-blue-600">
          Sijoitettu: {formatEUR(portfolio.totalInvested)}
        </p>
      </div>

      {/* Profit/Loss */}
      <div className={`card bg-gradient-to-br border-2 hover:shadow-lg transition-shadow ${
        portfolio.totalProfitLoss >= 0 
          ? 'from-green-50 to-green-100 border-green-200' 
          : 'from-red-50 to-red-100 border-red-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <p className={`text-sm font-medium ${
            portfolio.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            Voitto/Tappio
          </p>
          <span className="text-2xl">{portfolio.totalProfitLoss >= 0 ? '📈' : '📉'}</span>
        </div>
        <p className={`text-3xl font-bold mb-1 ${
          portfolio.totalProfitLoss >= 0 ? 'text-green-700' : 'text-red-700'
        }`}>
          {portfolio.totalProfitLoss >= 0 ? '+' : ''}{formatEUR(portfolio.totalProfitLoss)}
        </p>
        <p className={`text-xs ${
          portfolio.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {portfolio.totalProfitLoss >= 0 ? '+' : ''}{portfolio.totalProfitLossPercent.toFixed(2)}% ROI
        </p>
      </div>

      {/* Holdings Count */}
      <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-purple-600 font-medium">Kryptovaluuttoja</p>
          <span className="text-2xl">🪙</span>
        </div>
        <p className="text-3xl font-bold text-purple-700 mb-1">
          {portfolio.holdings.length}
        </p>
        <p className="text-xs text-purple-600">
          Eri kryptovaluuttaa omistuksessa
        </p>
      </div>
    </div>
  );
};

export default PortfolioSummaryCard;
