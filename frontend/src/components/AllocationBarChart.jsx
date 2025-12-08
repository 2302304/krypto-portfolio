import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

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

const AllocationBarChart = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Ei dataa näytettäväksi
      </div>
    );
  }

  // Prepare data sorted by value
  const data = holdings
    .map(holding => ({
      name: holding.crypto_symbol,
      value: parseFloat(holding.current_value),
      percentage: ((holding.current_value / holdings.reduce((sum, h) => sum + h.current_value, 0)) * 100).toFixed(2)
    }))
    .sort((a, b) => b.value - a.value);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
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
              { value: 'Portfolio-arvo per krypto (€)', type: 'rect', color: '#3B82F6' }
            ]}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AllocationBarChart;
