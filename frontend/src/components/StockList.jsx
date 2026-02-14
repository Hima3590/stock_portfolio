import { useEffect, useState } from 'react';
import { getAllStocks, deleteStock ,updateStock} from '../api/stockApi';



export default function StockList({ refreshTrigger, onStockUpdated }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedStock, setEditedStock] = useState({
    quantity:'',
    buyPrice:''
  });

  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllStocks();
      setStocks(data);
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError(err.response?.data?.error || 'Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [refreshTrigger]);

  const handleDelete = async (stockId, symbol) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${symbol}?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteStock(stockId);
      // Refetch stock list after successful delete
      fetchStocks();
    } catch (err) {
      console.error('Error deleting stock:', err);
      alert(err.response?.data?.error || 'Failed to delete stock');
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading stocks...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  if (stocks.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">My Portfolio</h2>
        <p className="text-gray-400">No stocks in your portfolio yet. Add some stocks to get started!</p>
      </div>
    );
  }
  const handleEdit = (stock) => {
    setEditingId(stock._id);
    setEditedStock({
      quantity: stock.quantity,
      buyPrice: stock.buyPrice
    });
    setEditingId(stock._id);
    setEditedStock({
      quantity: stock.quantity,
      buyPrice: stock.buyPrice
    });
  };
  const handleSave = async (stockId) => {
    try {
      await updateStock(stockId, editedStock);
      setEditingId(null);
      fetchStocks();
      if (onStockUpdated) {
        onStockUpdated();
      }
    } catch (err) {
      console.error('Error updating stock:', err);
      alert(err.response?.data?.error || 'Failed to update stock');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">My Portfolio</h2>
      <div className="overflow-x-auto bg-gray-900 border border-gray-800 rounded-xl shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="p-4 text-left text-white font-semibold">Symbol</th>
              <th className="p-4 text-left text-white font-semibold">Quantity</th>
              <th className="p-4 text-left text-white font-semibold">Buy Price</th>
              <th className="p-4 text-left text-white font-semibold">Total Value</th>
              <th className="p-4 text-left text-white font-semibold">Date Added</th>
              <th className="p-4 text-left text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock._id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                <td className="p-4 text-white font-bold">
                  {stock.symbol}
                </td>
                <td className="p-4 text-gray-300">
                     {editingId === stock._id ? (
                         <input
                           type="number"
                           value={editedStock?.quantity}
                           onChange={(e) => setEditedStock({ ...editedStock, quantity: e.target.value })}
                           className="border border-gray-600 px-2 py-1 w-20 bg-gray-700 text-white rounded"
                         />
                       ) : (
                         stock.quantity
                       )}
                </td>

                <td className="p-4 text-gray-300">
                  {editingId=== stock._id? (
                    <input
                      type="number"
                      value={editedStock?.buyPrice}
                      onChange={(e) => setEditedStock({ ...editedStock, buyPrice: e.target.value })}
                      className="border border-gray-600 px-2 py-1 w-20 bg-gray-700 text-white rounded"
                    />
                  ) : (
                    stock.buyPrice
                  )}
                </td>
                <td className="p-4 text-gray-300">
                  ₹{(stock.quantity * stock.buyPrice).toFixed(2)}
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  {new Date(stock.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                {editingId === stock._id ? (
                  <button
                    onClick={() => handleSave(stock._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg mr-2 hover:bg-green-700 transition text-sm"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(stock)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg mr-2 hover:bg-blue-700 transition text-sm"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => handleDelete(stock._id, stock.symbol)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                >
                  Delete
                </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
