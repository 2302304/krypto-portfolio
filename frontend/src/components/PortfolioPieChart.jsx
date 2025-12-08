import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
];

const PortfolioPieChart = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Ei dataa näytettäväksi
      </div>
    );
  }

  // Prepare data for pie chart
  const data = holdings.map((holding, index) => ({
    name: holding.crypto_symbol,
    value: parseFloat(holding.current_value),
    percentage: ((holding.current_value / holdings.reduce((sum, h) => sum + h.current_value, 0)) * 100).toFixed(2)
  }));

  // Custom label
  const renderLabel = (entry) => {
    return `${entry.name}: ${entry.percentage}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Arvo: {new Intl.NumberFormat('fi-FI', {
              style: 'currency',
              currency: 'EUR'
            }).format(payload[0].value)}
          </p>
          <p className="text-sm text-gray-600">
            Osuus: {payload[0].payload.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => `${value} (${entry.payload.percentage}%)`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioPieChart;
