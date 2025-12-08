import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const ProfitLossBarChart = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Ei dataa näytettäväksi
      </div>
    );
  }

  // Prepare data sorted by profit/loss
  const data = holdings
    .map(holding => ({
      name: holding.crypto_symbol,
      profit_loss: parseFloat(holding.profit_loss),
      profit_loss_percent: parseFloat(holding.profit_loss_percent)
    }))
    .sort((a, b) => b.profit_loss - a.profit_loss);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const isProfit = payload[0].value >= 0;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
          <p className={`text-sm font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {isProfit ? '+' : ''}{new Intl.NumberFormat('fi-FI', {
              style: 'currency',
              currency: 'EUR'
            }).format(payload[0].value)}
          </p>
          <p className={`text-xs ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {isProfit ? '+' : ''}{payload[0].payload.profit_loss_percent.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M €`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k €`;
    }
    return `${value} €`;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            payload={[
              { value: 'Voitto/Tappio (€)', type: 'rect', color: '#3B82F6' }
            ]}
          />
          <Bar dataKey="profit_loss" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.profit_loss >= 0 ? '#10B981' : '#EF4444'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitLossBarChart;
