import { useState } from 'react';
import { addStock } from '../api/stockApi';

export default function AddStock({ onStockAdded }) {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addStock({
        symbol: symbol.toUpperCase(),
        quantity: parseFloat(quantity),
        buyPrice: parseFloat(buyPrice)
      });
      
      // Reset form
      setSymbol('');
      setQuantity('');
      setBuyPrice('');
      
      // Notify parent to refresh stock list
      if (onStockAdded) {
        onStockAdded();
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      alert(error.response?.data?.error || 'Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Add Stock</h2>
      <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Symbol (e.g., AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          required
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          min="0"
          step="0.01"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Buy Price"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          required
          min="0"
          step="0.01"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Adding...' : 'Add Stock'}
        </button>
      </form>
    </div>
  );
}
