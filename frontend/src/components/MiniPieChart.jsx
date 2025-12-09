import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const MiniPieChart = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return null;
  }

  // Take top 5 holdings
  const data = holdings
    .slice(0, 5)
    .map(holding => ({
      name: holding.crypto_symbol,
      value: parseFloat(holding.current_value)
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg text-sm">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-gray-600">
            {new Intl.NumberFormat('fi-FI', {
              style: 'currency',
              currency: 'EUR',
              maximumFractionDigits: 0
            }).format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Portfolio-jakauma</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center">
        <a 
          href="/portfolio?tab=charts" 
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Näytä yksityiskohtaiset kaaviot →
        </a>
      </div>
    </div>
  );
};

export default MiniPieChart;
