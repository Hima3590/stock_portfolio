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
    return <div className="text-gray-600">Loading stocks...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (stocks.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">My Portfolio</h2>
        <p className="text-gray-600">No stocks in your portfolio yet. Add some stocks to get started!</p>
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
      <h2 className="text-2xl font-bold mb-4">My Portfolio</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border border-gray-300">Symbol</th>
              <th className="p-3 text-left border border-gray-300">Quantity</th>
              <th className="p-3 text-left border border-gray-300">Buy Price</th>
              <th className="p-3 text-left border border-gray-300">Total Value</th>
              <th className="p-3 text-left border border-gray-300">Date Added</th>
              <th className="p-3 text-left border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock._id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-300 font-bold">
                  {stock.symbol}
                </td>
                <td className="p-3 border border-gray-300">
                     {editingId === stock._id ? (
                         <input
                           type="number"
                           value={editedStock?.quantity}
                           onChange={(e) => setEditedStock({ ...editedStock, quantity: e.target.value })}
                           className="border px-2 py-1 w-20"
                         />
                       ) : (
                         stock.quantity
                       )}
                     </td>

                <td className="p-3 border border-gray-300">
                  {editingId=== stock._id? (
                    <input
                      type="number"
                      value={editedStock?.buyPrice}
                      onChange={(e) => setEditedStock({ ...editedStock, buyPrice: e.target.value })}
                      className="border px-2 py-1 w-20"
                    />
                  ) : (
                    stock.buyPrice
                  )}
                </td>
                <td className="p-3 border border-gray-300">
                  ${(stock.quantity * stock.buyPrice).toFixed(2)}
                </td>
                <td className="p-3 border border-gray-300">
                  {new Date(stock.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 border border-gray-300">
                {editingId === stock._id ? (
  <button
    onClick={() => handleSave(stock._id)}
    className="px-3 py-2 bg-green-600 text-white rounded-md mr-2"
  >
    Save
  </button>
) : (
  <button
    onClick={() => handleEdit(stock)}
    className="px-3 py-2 bg-blue-600 text-white rounded-md mr-2"
  >
    Edit
  </button>
)}

<button
  onClick={() => handleDelete(stock._id, stock.symbol)}
  className="px-3 py-2 bg-red-600 text-white rounded-md"
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
