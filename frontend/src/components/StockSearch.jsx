import { useState } from 'react';
import { searchStocks, getPortfolioStockInfo } from '../api/stockApi';

export default function StockSearch({ onSelectStock }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [stockInfo, setStockInfo] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError, setInfoError] = useState(null);

  // Search stocks
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setError(null);
    setStockInfo(null);
    setInfoError(null);

    try {
      const data = await searchStocks(query);
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch stocks.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch portfolio info
  const handleSelectStock = async (stock) => {
    onSelectStock(stock);
    setStockInfo(null);
    setInfoError(null);
    setInfoLoading(true);

    try {
      const data = await getPortfolioStockInfo(stock.symbol);
      setStockInfo(data);
    } catch (err) {
      console.error(err.response || err.message);
      setInfoError('Failed to fetch stock info.');
    } finally {
      setInfoLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search stocks..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Search
        </button>
      </form>

      {loading && <p className="text-gray-600 mt-2">Searching...</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}

      {results.length > 0 && (
        <ul className="mt-2 border rounded-md overflow-hidden">
          {results.map(stock => (
            <li
              key={stock.symbol}
              className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
              onClick={() => handleSelectStock(stock)}
            >
              <span>{stock.symbol} - {stock.name}</span>
              <span className="text-gray-500">{stock.region}</span>
            </li>
          ))}
        </ul>
      )}

      {infoLoading && <p className="mt-2 text-gray-600">Fetching stock info...</p>}
      {infoError && <p className="mt-2 text-red-600">{infoError}</p>}
      {stockInfo && (
        <div className="mt-2 p-2 border rounded-md bg-gray-50">
          <p><strong>Live Price:</strong> ${stockInfo.currentPrice.toFixed(2)}</p>
          <p>
            <strong>Profit / Loss:</strong>{' '}
            <span className={parseFloat(stockInfo.profitLoss) >= 0 ? 'text-green-600' : 'text-red-600'}>
              ${stockInfo.profitLoss}
            </span>
          </p>
          <p>
            <strong>% Change:</strong>{' '}
            <span className={parseFloat(stockInfo.percentChange) >= 0 ? 'text-green-600' : 'text-red-600'}>
              {stockInfo.percentChange}%
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
