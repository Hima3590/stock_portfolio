import { useState } from 'react';
import AddStock from './components/AddStock';
import StockList from './components/StockList';
import StockSummary from './components/StockSummary';

import './index.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleStockAdded = () => {
    // Trigger refresh of stock list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-100 p-8 mb-8">
        <h1 className="text-3xl font-bold m-0">Stock Portfolio Tracker</h1>
      </header>
      <main className="max-w-6xl mx-auto px-8">
        <StockSummary refreshTrigger={refreshTrigger} />
        <AddStock onStockAdded={handleStockAdded} />
        <StockList refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
}

export default App;
