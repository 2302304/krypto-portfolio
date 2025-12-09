import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PortfolioSummaryCard from '../components/PortfolioSummaryCard';
import RecentTransactions from '../components/RecentTransactions';
import TopPerformers from '../components/TopPerformers';
import QuickActions from '../components/QuickActions';
import MiniPieChart from '../components/MiniPieChart';

const Dashboard = () => {
  const { user, api } = useAuth();
  
  const [portfolio, setPortfolio] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Refresh every 2 minutes
    const interval = setInterval(loadDashboardData, 120000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load portfolio and transactions in parallel
      const [portfolioRes, transactionsRes] = await Promise.all([
        api.get('/portfolio'),
        api.get('/transactions')
      ]);

      setPortfolio(portfolioRes.data.data);
      setTransactions(transactionsRes.data.data.transactions);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Huomenta';
    if (hour < 18) return 'Hyvää päivää';
    return 'Hyvää iltaa';
  };

  const userName = user?.email?.split('@')[0] || 'Käyttäjä';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="text-gray-600">
            Tervetuloa takaisin. Tässä on yhteenveto portfoliostasi.
          </p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="mb-8">
          <PortfolioSummaryCard portfolio={portfolio} loading={loading} />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Main Content Grid */}
        {portfolio && portfolio.holdings && portfolio.holdings.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Recent Transactions */}
              <RecentTransactions transactions={transactions} loading={loading} />
              
              {/* Top Performers */}
              <TopPerformers holdings={portfolio.holdings} loading={loading} />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Mini Pie Chart */}
              <MiniPieChart holdings={portfolio.holdings} />
              
              {/* Stats Card */}
              <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
                <h3 className="text-xl font-bold mb-4">📊 Tilastoja</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Transaktioita yhteensä:</span>
                    <span className="font-semibold text-gray-900">{transactions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Eri kryptovaluuttoja:</span>
                    <span className="font-semibold text-gray-900">{portfolio.holdings.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Paras suorittaja:</span>
                    <span className="font-semibold text-green-600">
                      {[...portfolio.holdings]
                        .sort((a, b) => b.profit_loss_percent - a.profit_loss_percent)[0]
                        ?.crypto_symbol || '-'}
                      {' '}
                      ({[...portfolio.holdings]
                        .sort((a, b) => b.profit_loss_percent - a.profit_loss_percent)[0]
                        ?.profit_loss_percent.toFixed(2) || 0}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State - No Holdings */}
        {portfolio && (!portfolio.holdings || portfolio.holdings.length === 0) && !loading && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Aloita portfoliosi rakentaminen
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Lisää ensimmäinen transaktio aloittaaksesi portfoliosi seurannan ja analysoimaan sijoituksiasi.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/transactions" className="btn-primary text-lg px-8 py-3">
                ➕ Lisää transaktio
              </a>
              <a href="/market" className="btn-secondary text-lg px-8 py-3">
                📊 Selaa markkinoita
              </a>
            </div>
          </div>
        )}

        {/* Auto-refresh info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            🔄 Dashboard päivittyy automaattisesti 2 minuutin välein
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
