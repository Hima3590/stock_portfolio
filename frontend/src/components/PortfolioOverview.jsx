import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function PortfolioOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/stocks/portfolio/overview`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setData(response.data);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err.response?.data?.error || 'Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-600 text-lg">Loading portfolio overview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <p className="text-red-700 font-semibold">Error</p>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchPortfolioData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-gray-500 text-center p-12">
        No portfolio data available
      </div>
    );
  }

  const isPositive = data.profitLoss >= 0;

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Portfolio Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Invested Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Invested</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(data.totalInvested)}
          </p>
        </div>

        {/* Current Value Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium mb-2">Current Value</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(data.currentValue)}
          </p>
        </div>

        {/* Profit/Loss Card */}
        <div
          className={`rounded-lg shadow-md p-6 border-l-4 ${
            isPositive
              ? 'bg-green-50 border-green-500'
              : 'bg-red-50 border-red-500'
          }`}
        >
          <p className="text-gray-600 text-sm font-medium mb-2">Profit / Loss</p>
          <p
            className={`text-3xl font-bold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? '▲' : '▼'} {formatCurrency(data.profitLoss)}
          </p>
          <p
            className={`text-sm font-medium mt-1 ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatPercent(data.profitLossPercent)}
          </p>
        </div>
      </div>
    </div>
  );
}
