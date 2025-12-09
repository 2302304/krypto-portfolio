import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatEUR } from '../utils/formatters';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Market = () => {
  const [cryptos, setCryptos] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap_rank', direction: 'asc' });

  useEffect(() => {
    loadMarketData();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadMarketData, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Filter cryptos based on search query
    if (searchQuery.trim() === '') {
      setFilteredCryptos(cryptos);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = cryptos.filter(crypto => 
        crypto.name.toLowerCase().includes(query) ||
        crypto.symbol.toLowerCase().includes(query)
      );
      setFilteredCryptos(filtered);
    }
  }, [searchQuery, cryptos]);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/market/top?limit=100`);
      setCryptos(response.data.data.cryptos);
      setFilteredCryptos(response.data.data.cryptos);
      setError('');
    } catch (err) {
      setError('Virhe markkinadatan lataamisessa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredCryptos].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredCryptos(sorted);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const formatMarketCap = (value) => {
    if (value >= 1000000000000) {
      return `${(value / 1000000000000).toFixed(2)}T €`;
    } else if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B €`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M €`;
    }
    return formatEUR(value);
  };

  if (loading && cryptos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ladataan markkinadataa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Markkinat 📈
          </h1>
          <p className="text-gray-600">
            Seuraa kryptovaluuttamarkkinoiden kehitystä reaaliajassa
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="card bg-red-50 border-red-200 mb-6">
            <p className="text-red-600 font-medium">❌ {error}</p>
            <button 
              onClick={loadMarketData}
              className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
            >
              Yritä uudelleen
            </button>
          </div>
        )}

        {/* Search */}
        <div className="card mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Etsi kryptovaluuttaa nimellä tai symbolilla..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
              />
            </div>
            <button
              onClick={loadMarketData}
              disabled={loading}
              className="btn-secondary whitespace-nowrap"
            >
              {loading ? '🔄 Päivitetään...' : '🔄 Päivitä'}
            </button>
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              Löytyi {filteredCryptos.length} kryptovaluuttaa
            </p>
          )}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('market_cap_rank')}
                  >
                    # {getSortIcon('market_cap_rank')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Krypto
                  </th>
                  <th 
                    className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('current_price')}
                  >
                    Hinta {getSortIcon('current_price')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price_change_percentage_24h')}
                  >
                    24h % {getSortIcon('price_change_percentage_24h')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price_change_percentage_7d')}
                  >
                    7d % {getSortIcon('price_change_percentage_7d')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('market_cap')}
                  >
                    Market Cap {getSortIcon('market_cap')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('total_volume')}
                  >
                    Volume 24h {getSortIcon('total_volume')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCryptos.map((crypto) => (
                  <tr key={crypto.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {crypto.market_cap_rank}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={crypto.image} 
                          alt={crypto.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {crypto.symbol}
                          </div>
                          <div className="text-xs text-gray-500">
                            {crypto.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                      {formatEUR(crypto.current_price)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        crypto.price_change_percentage_24h >= 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                        {crypto.price_change_percentage_24h?.toFixed(2) || 0}%
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        crypto.price_change_percentage_7d >= 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {crypto.price_change_percentage_7d >= 0 ? '+' : ''}
                        {crypto.price_change_percentage_7d?.toFixed(2) || 0}%
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                      {formatMarketCap(crypto.market_cap)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                      {formatMarketCap(crypto.total_volume)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Auto-refresh info */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            🔄 Markkinadata päivittyy automaattisesti 5 minuutin välein
          </p>
        </div>
      </div>
    </div>
  );
};

export default Market;
