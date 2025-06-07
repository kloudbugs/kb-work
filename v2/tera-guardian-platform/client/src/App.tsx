import React, { useState } from 'react';
import './index.css';
import GuardianDashboard from './pages/GuardianDashboard';
import MiningRigs from './pages/MiningRigs';
import MiningPools from './pages/MiningPools';
import TrainingCenter from './pages/TrainingCenter';
import Login from './pages/Login';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setCurrentPage('guardian');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="cosmic-background min-h-screen">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            TERA Guardian Platform
          </h1>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentPage('guardian')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'guardian' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Guardian Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('rigs')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'rigs' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Mining Rigs
            </button>
            <button
              onClick={() => setCurrentPage('pools')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'pools' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Mining Pools
            </button>
            <button
              onClick={() => setCurrentPage('training')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'training' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Training Center
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="p-6">
        {currentPage === 'guardian' && <GuardianDashboard />}
        {currentPage === 'rigs' && <MiningRigs />}
        {currentPage === 'pools' && <MiningPools />}
        {currentPage === 'training' && <TrainingCenter />}
      </main>
    </div>
  );
}

export default App;