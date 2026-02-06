import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const API_URL = process.env.REACT_APP_API_URL;

export default function PortfolioCharts({ refreshTrigger }) {
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPortfolioBreakdown();
  }, [refreshTrigger]);

  const fetchPortfolioBreakdown = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/stocks/portfolio/breakdown`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBreakdown(response.data);
    } catch (err) {
      console.error('Error fetching portfolio breakdown:', err);
      setError(err.response?.data?.error || 'Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `₹${(value / 100000).toFixed(1)}L`; // Format as Lakhs for readability
  };

  const formatCurrencyFull = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate portfolio value data (shows cumulative as we go through stocks)
  const portfolioValueData = breakdown.reduce((acc, stock, index) => {
    const cumulativeValue = acc.reduce((sum, item) => sum + item.totalValue, 0) + stock.currentValue;
    acc.push({
      name: stock.symbol,
      totalValue: stock.currentValue,
      cumulative: parseFloat(cumulativeValue.toFixed(2))
    });
    return acc;
  }, []);

  // Colors for bar chart
  const colors = ['#3b82f6', '#ef4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow mb-8">
        <div className="text-gray-600 text-lg">Loading portfolio charts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <p className="text-red-700 font-semibold">Error</p>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchPortfolioBreakdown}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="text-gray-500 text-center p-8 bg-white rounded-lg shadow mb-8">
        No portfolio data available. Add stocks to see charts.
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-8">
      {/* Bar Chart - Invested vs Current Value per Stock */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Invested vs Current Value</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={breakdown} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="symbol" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => formatCurrencyFull(value)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
            <Bar dataKey="investedValue" fill="#3b82f6" name="Invested" radius={[8, 8, 0, 0]} />
            <Bar dataKey="currentValue" fill="#10b981" name="Current" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Portfolio Value Progression */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Portfolio Value Progression</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={portfolioValueData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => formatCurrencyFull(value)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 5 }}
              activeDot={{ r: 7 }}
              name="Total Portfolio Value"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Portfolio Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Invested</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {formatCurrencyFull(breakdown.reduce((sum, stock) => sum + stock.investedValue, 0))}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Current Value</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {formatCurrencyFull(breakdown.reduce((sum, stock) => sum + stock.currentValue, 0))}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Gain/Loss</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {formatCurrencyFull(breakdown.reduce((sum, stock) => sum + stock.profitLoss, 0))}
            </p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Return %</p>
            <p className="text-2xl font-bold text-amber-600 mt-2">
              {((breakdown.reduce((sum, stock) => sum + stock.profitLoss, 0) / breakdown.reduce((sum, stock) => sum + stock.investedValue, 0)) * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
