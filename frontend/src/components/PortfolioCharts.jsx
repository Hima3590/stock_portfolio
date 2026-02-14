import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
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



  // Colors for bar chart
  const colors = ['#3b82f6', '#ef4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-gray-900 rounded-xl border border-gray-800 mb-8">
        <div className="text-gray-400 text-lg">Loading portfolio charts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border border-red-700 rounded-xl p-6 mb-8">
        <p className="text-red-200 font-semibold">Error</p>
        <p className="text-red-300">{error}</p>
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
      <div className="text-gray-400 text-center p-8 bg-gray-900 rounded-xl border border-gray-800 mb-8">
        No portfolio data available. Add stocks to see charts.
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-8">
      {/* Bar Chart - Invested vs Current Value per Stock */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-white">Invested vs Current Value</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={breakdown} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="symbol" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => formatCurrencyFull(value)}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                padding: '12px',
                color: '#e5e7eb'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', color: '#9ca3af' }}
              iconType="square"
            />
            <Bar dataKey="investedValue" fill="#3b82f6" name="Invested" radius={[8, 8, 0, 0]} />
            <Bar dataKey="currentValue" fill="#10b981" name="Current" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-white">Portfolio Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-900 to-gray-900 border border-blue-700 p-4 rounded-lg hover:border-blue-500 transition">
            <p className="text-blue-300 text-sm font-semibold uppercase tracking-wide">Total Invested</p>
            <p className="text-2xl font-bold text-blue-300 mt-2">
              {formatCurrencyFull(breakdown.reduce((sum, stock) => sum + stock.investedValue, 0))}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-900 to-gray-900 border border-green-700 p-4 rounded-lg hover:border-green-500 transition">
            <p className="text-green-300 text-sm font-semibold uppercase tracking-wide">Current Value</p>
            <p className="text-2xl font-bold text-green-300 mt-2">
              {formatCurrencyFull(breakdown.reduce((sum, stock) => sum + stock.currentValue, 0))}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-900 to-gray-900 border border-purple-700 p-4 rounded-lg hover:border-purple-500 transition">
            <p className="text-purple-300 text-sm font-semibold uppercase tracking-wide">Total Gain/Loss</p>
            <p className="text-2xl font-bold text-purple-300 mt-2">
              {formatCurrencyFull(breakdown.reduce((sum, stock) => sum + stock.profitLoss, 0))}
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-900 to-gray-900 border border-amber-700 p-4 rounded-lg hover:border-amber-500 transition">
            <p className="text-amber-300 text-sm font-semibold uppercase tracking-wide">Return %</p>
            <p className="text-2xl font-bold text-amber-300 mt-2">
              {((breakdown.reduce((sum, stock) => sum + stock.profitLoss, 0) / breakdown.reduce((sum, stock) => sum + stock.investedValue, 0)) * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
