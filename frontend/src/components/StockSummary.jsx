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
      const data = await getStockSummary();
      console.log("summary api response", data);
      setSummary(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load summary");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading summary...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-white shadow rounded p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Portfolio Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="bg-gray-100 p-4 rounded">
    <p className="text-gray-600">Total Stocks</p>
    <p className="text-2xl font-bold">{summary.totalStocks}</p>
  </div>

  <div className="bg-gray-100 p-4 rounded">
    <p className="text-gray-600">Total Quantity</p>
    <p className="text-2xl font-bold">
      {summary.totalQuantity ?? "—"}
    </p>
  </div>

  <div className="bg-gray-100 p-4 rounded">
    <p className="text-gray-600">Total Investment</p>
    <p className="text-2xl font-bold">
      ₹{Number(summary.totalInvested).toFixed(2)}
    </p>
  </div>
</div>

    </div>
  );
}
