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
      <div className="flex items-center justify-center p-8 bg-gray-900 rounded-xl border border-gray-800 mb-8">
        <p className="text-gray-400">Loading stock summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border border-red-700 rounded-xl p-6 mb-8">
        <p className="text-red-200 font-semibold">Error</p>
        <p className="text-red-300">{error}</p>
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
      <div className="text-gray-400 text-center p-8 bg-gray-900 rounded-xl border border-gray-800 mb-8">
        No stock summary available
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-12 shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-white">Stock Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-900 to-gray-900 border border-blue-700 p-6 rounded-xl hover:border-blue-500 transition">
          <p className="text-blue-300 text-xs font-semibold uppercase tracking-wide">Total Stocks</p>
          <p className="text-3xl font-bold text-blue-300 mt-3">{summary.totalStocks}</p>
        </div>

        <div className="bg-gradient-to-br from-green-900 to-gray-900 border border-green-700 p-6 rounded-xl hover:border-green-500 transition">
          <p className="text-green-300 text-xs font-semibold uppercase tracking-wide">Total Quantity</p>
          <p className="text-3xl font-bold text-green-300 mt-3">
            {summary.totalQuantity ?? '0'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-gray-900 border border-purple-700 p-6 rounded-xl hover:border-purple-500 transition">
          <p className="text-purple-300 text-xs font-semibold uppercase tracking-wide">Total Invested</p>
          <p className="text-3xl font-bold text-purple-300 mt-3">
            {formatCurrency(summary.totalInvested || 0)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-900 to-gray-900 border border-amber-700 p-6 rounded-xl hover:border-amber-500 transition">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wide">Current Value</p>
          <p className="text-3xl font-bold text-amber-300 mt-3">
            {formatCurrency(summary.totalCurrentValue || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}



