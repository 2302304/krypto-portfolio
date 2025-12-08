import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatEUR, formatCryptoAmount } from '../utils/formatters';
import LivePrice from '../components/LivePrice';

const Portfolio = () => {
  const { api } = useAuth();
  
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPortfolio();
    
    // Refresh every 60 seconds
    const interval = setInterval(loadPortfolio, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const response = await api.get('/portfolio');
      setPortfolio(response.data.data);
      setError('');
    } catch (err) {
      setError('Virhe portfolion lataamisessa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ladataan portfoliota...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card bg-red-50 border-red-200">
            <p className="text-red-600 font-medium">❌ {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const hasHoldings = portfolio && portfolio.holdings && portfolio.holdings.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Portfolio 💼
          </h1>
          <p className="text-gray-600">
            Seuraa portfoliosi arvoa ja suorituskykyä reaaliajassa
          </p>
        </div>

        {/* Summary Cards */}
        {hasHoldings && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* Total Value */}
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <p className="text-sm text-blue-600 font-medium mb-1">Kokonaisarvo</p>
              <p className="text-3xl font-bold text-blue-700">
                {formatEUR(portfolio.totalValue)}
              </p>
            </div>

            {/* Total Invested */}
            <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <p className="text-sm text-purple-600 font-medium mb-1">Sijoitettu</p>
              <p className="text-3xl font-bold text-purple-700">
                {formatEUR(portfolio.totalInvested)}
              </p>
            </div>

            {/* Profit/Loss */}
            <div className={`card bg-gradient-to-br ${
              portfolio.totalProfitLoss >= 0 
                ? 'from-green-50 to-green-100 border-2 border-green-200' 
                : 'from-red-50 to-red-100 border-2 border-red-200'
            }`}>
              <p className={`text-sm font-medium mb-1 ${
                portfolio.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                Voitto/Tappio
              </p>
              <p className={`text-3xl font-bold ${
                portfolio.totalProfitLoss >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {portfolio.totalProfitLoss >= 0 ? '+' : ''}{formatEUR(portfolio.totalProfitLoss)}
              </p>
            </div>

            {/* ROI % */}
            <div className={`card bg-gradient-to-br ${
              portfolio.totalProfitLossPercent >= 0 
                ? 'from-green-50 to-green-100 border-2 border-green-200' 
                : 'from-red-50 to-red-100 border-2 border-red-200'
            }`}>
              <p className={`text-sm font-medium mb-1 ${
                portfolio.totalProfitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ROI %
              </p>
              <p className={`text-3xl font-bold ${
                portfolio.totalProfitLossPercent >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {portfolio.totalProfitLossPercent >= 0 ? '+' : ''}{portfolio.totalProfitLossPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        )}

        {/* Holdings Table */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Omistukset</h2>

          {!hasHoldings ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 mb-4">Ei vielä omistuksia</p>
              <p className="text-sm text-gray-400 mb-6">
                Lisää ensimmäinen transaktio aloittaaksesi portfolion seurannan
              </p>
              <a href="/transactions" className="btn-primary inline-block">
                ➕ Lisää transaktio
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Krypto
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Määrä
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Keskim. ostohinta
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Nykyinen hinta
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Sijoitettu
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Arvo nyt
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Voitto/Tappio
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      ROI %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolio.holdings.map((holding) => (
                    <tr key={holding.crypto_symbol} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {holding.crypto_symbol}
                          </div>
                          <div className="text-xs text-gray-500">
                            {holding.crypto_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCryptoAmount(holding.amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatEUR(holding.average_buy_price)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <LivePrice symbol={holding.crypto_symbol} showChange={false} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatEUR(holding.invested)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right font-semibold text-gray-900">
                        {formatEUR(holding.current_value)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <span className={`font-semibold ${
                          holding.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {holding.profit_loss >= 0 ? '+' : ''}{formatEUR(holding.profit_loss)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          holding.profit_loss_percent >= 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {holding.profit_loss_percent >= 0 ? '+' : ''}{holding.profit_loss_percent.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Auto-refresh info */}
        {hasHoldings && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              🔄 Portfolio päivittyy automaattisesti 60 sekunnin välein
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
