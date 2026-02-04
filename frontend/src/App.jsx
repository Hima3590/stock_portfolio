import { useState, useContext } from 'react';
import AddStock from './components/AddStock';
import StockList from './components/StockList';
import StockSummary from './components/StockSummary';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthContext } from './context/AuthContext';
import StockSearch from './components/StockSearch';

import './index.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showRegister, setShowRegister] = useState(false);

  const { token, logout } = useContext(AuthContext); // 🔹 reactive token

  const handleStockAdded = () => setRefreshTrigger(prev => prev + 1);

  // 🔐 NOT LOGGED IN
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {showRegister ? (
          <Register onSwitch={() => setShowRegister(false)} />
        ) : (
          <Login onSwitch={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  // ✅ LOGGED IN
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-100 p-8 mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold m-0">Stock Portfolio Tracker</h1>
        <button
          onClick={logout} // 🔹 reactive logout
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-8">
        <StockSearch onSelectStock={(stock)=>alert(`selected :${stock.symbol}`)} />
        <StockSummary refreshTrigger={refreshTrigger} />
        <AddStock onStockAdded={handleStockAdded} />
        <StockList refreshTrigger={refreshTrigger} onStockUpdated={handleStockAdded} />
      </main>
    </div>
  );
}

export default App;
