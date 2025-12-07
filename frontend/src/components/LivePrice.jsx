import React, { useState, useEffect } from 'react';
import { getSinglePrice } from '../services/priceService';
import { formatEUR } from '../utils/formatters';

const LivePrice = ({ symbol, showChange = true }) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchPrice = async () => {
      try {
        setLoading(true);
        const response = await getSinglePrice(symbol);
        setPrice(response.data.price);
        setError(null);
      } catch (err) {
        setError('Hinnan haku epäonnistui');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();

    // Refresh every 60 seconds
    const interval = setInterval(fetchPrice, 60000);

    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) {
    return <span className="text-gray-500">Ladataan...</span>;
  }

  if (error) {
    return <span className="text-red-500 text-sm">{error}</span>;
  }

  if (!price) {
    return <span className="text-gray-500">-</span>;
  }

  // Parse price and change safely
  const priceEur = parseFloat(price.price_eur) || 0;
  const change = parseFloat(price.change_24h) || 0;
  const isPositive = change >= 0;

  return (
    <div className="inline-flex items-center gap-2">
      <span className="font-medium">{formatEUR(priceEur)}</span>
      {showChange && (
        <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </span>
      )}
    </div>
  );
};

export default LivePrice;
