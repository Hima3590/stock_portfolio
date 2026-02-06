import { useEffect, useState } from "react";
import { getStockSummary } from "../api/stockApi";

export default function StockSummary({ refreshTrigger }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStockSummary();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching stock summary:', err);
      setError(err.response?.data?.error || 'Failed to load summary');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow mb-8">
        <p className="text-gray-600">Loading stock summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <p className="text-red-700 font-semibold">Error</p>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchSummary}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-gray-500 text-center p-8 bg-white rounded-lg shadow mb-8">
        No stock summary available
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Stock Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Stocks</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{summary.totalStocks}</p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Quantity</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {summary.totalQuantity ?? '0'}
          </p>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded">
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Invested</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {formatCurrency(summary.totalInvested || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
