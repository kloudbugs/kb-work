import React from 'react';
import { BitcoinPriceTracker, BitcoinMiningCalculator } from '../components/bitcoin/price-tracker';

export default function BitcoinDashboard() {
  return (
    <div className="bitcoin-dashboard container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bitcoin Mining Dashboard</h1>
        <div className="wallet-address text-sm text-gray-500">
          Mining to: <span className="font-mono">bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="left-column">
          <BitcoinPriceTracker />
          
          <div className="mining-stats mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Mining Performance</h2>
            
            <div className="stats-grid grid grid-cols-2 gap-4">
              <div className="stat-card p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="stat-title text-sm text-gray-500">Current Hashrate</div>
                <div className="stat-value text-xl font-bold">31.4 MH/s</div>
              </div>
              
              <div className="stat-card p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="stat-title text-sm text-gray-500">Accepted Shares</div>
                <div className="stat-value text-xl font-bold">164</div>
              </div>
              
              <div className="stat-card p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="stat-title text-sm text-gray-500">GPU Temperature</div>
                <div className="stat-value text-xl font-bold">67°C</div>
              </div>
              
              <div className="stat-card p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="stat-title text-sm text-gray-500">Power Usage</div>
                <div className="stat-value text-xl font-bold">140W</div>
              </div>
            </div>
          </div>
          
          <div className="mining-controls mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Mining Controls</h2>
            
            <div className="controls-grid grid grid-cols-1 gap-4">
              <div className="control-card p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Mining Status</span>
                  <div className="toggle-switch relative">
                    <input type="checkbox" id="mining-toggle" className="sr-only" defaultChecked />
                    <label
                      htmlFor="mining-toggle"
                      className="block w-12 h-6 bg-gray-400 rounded-full cursor-pointer transition-colors duration-300 ease-in-out before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-transform before:duration-300 before:ease-in-out checked:bg-green-500 checked:before:transform checked:before:translate-x-6"
                    ></label>
                  </div>
                </div>
              </div>
              
              <div className="control-card p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <label className="block mb-2 text-sm">Mining Pool</label>
                <select className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                  <option value="nicehash">NiceHash</option>
                  <option value="f2pool">F2Pool</option>
                  <option value="poolin">Poolin</option>
                  <option value="antpool">AntPool</option>
                </select>
              </div>
              
              <div className="control-card p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <label className="block mb-2 text-sm">Optimization Mode</label>
                <select className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                  <option value="balanced">Balanced</option>
                  <option value="performance">Max Performance</option>
                  <option value="efficient">Efficient</option>
                  <option value="silent">Silent</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="right-column">
          <BitcoinMiningCalculator />
          
          <div className="mining-history mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Recent Mining Rewards</h2>
            
            <div className="rewards-list">
              <div className="reward-item p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-sm">Pool Payout</span>
                  <span className="font-mono font-medium">0.00045 BTC</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>May 20, 2025</span>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 rounded">Confirmed</span>
                </div>
              </div>
              
              <div className="reward-item p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-sm">Pool Payout</span>
                  <span className="font-mono font-medium">0.00038 BTC</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>May 19, 2025</span>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 rounded">Confirmed</span>
                </div>
              </div>
              
              <div className="reward-item p-3">
                <div className="flex justify-between">
                  <span className="text-sm">Pool Payout</span>
                  <span className="font-mono font-medium">0.00042 BTC</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>May 18, 2025</span>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 rounded">Confirmed</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="wallet-info mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Wallet Information</h2>
            
            <div className="wallet-content">
              <div className="mb-3">
                <div className="text-sm text-gray-500 mb-1">Total Balance</div>
                <div className="flex justify-between items-baseline">
                  <div className="text-xl font-bold">0.00345 BTC</div>
                  <div className="text-sm text-gray-500">≈ $207.00</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-sm text-gray-500 mb-1">Pending</div>
                <div className="flex justify-between items-baseline">
                  <div className="text-lg">0.00018 BTC</div>
                  <div className="text-sm text-gray-500">≈ $10.80</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 mb-2">Wallet Address</div>
                <div className="font-mono text-sm break-all bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Minimum payout threshold: 0.001 BTC
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}