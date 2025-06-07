import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';

interface BitcoinPriceData {
  usd: number;
  eur: number;
  gbp: number;
  jpy: number;
  change24h: number;
  lastUpdate: string;
  isSimulated?: boolean;
}

export function BitcoinPriceTracker() {
  const [wsConnected, setWsConnected] = useState(false);
  const [priceData, setPriceData] = useState<BitcoinPriceData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Initial fetch from API
  const { data, isLoading, error, refetch } = useQuery<BitcoinPriceData>({
    queryKey: ['/api/bitcoin/price'],
    refetchInterval: 60000, // Refetch every minute as fallback
  });

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    // Set up the WebSocket connection for real-time updates
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/bitcoin-price`);

    ws.onopen = () => {
      console.log('WebSocket connection established for Bitcoin price updates');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setPriceData(newData);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error parsing WebSocket data:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setWsConnected(false);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  // Use the API data if WebSocket isn't connected yet
  useEffect(() => {
    if (!wsConnected && data) {
      setPriceData(data);
      setLastUpdated(new Date());
    }
  }, [wsConnected, data]);

  // Format the last updated time
  const formattedLastUpdated = lastUpdated 
    ? lastUpdated.toLocaleTimeString() 
    : 'Loading...';

  // Calculate time since last update in seconds
  const secondsSinceUpdate = lastUpdated 
    ? Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000) 
    : 0;

  // Determine if the data is fresh (less than 2 minutes old)
  const isFreshData = secondsSinceUpdate < 120;

  return (
    <Card className="bitcoin-price-tracker p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 m-2">
        <button 
          onClick={() => refetch()} 
          className="refresh-button p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${wsConnected ? 'text-green-500' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L22 9"></path>
            <path d="M21 12a9 9 0 0 1-9 9-9.75 9.75 0 0 1-6.74-2.74L2 15"></path>
            <path d="M8 8v4h4"></path>
            <path d="M16 16v-4h-4"></path>
          </svg>
        </button>
      </div>

      <h3 className="text-lg font-bold mb-2">Bitcoin Price</h3>
      
      {isLoading && !priceData ? (
        <div className="loading-skeleton h-16 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
      ) : error ? (
        <div className="error-message text-red-500">Error loading price data</div>
      ) : priceData ? (
        <div className="price-content">
          <div className="price-main flex items-baseline">
            <span className="price-value text-2xl font-bold">${priceData.usd.toLocaleString()}</span>
            <span className={`price-change ml-2 text-sm ${priceData.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {priceData.change24h >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              )}
              {Math.abs(priceData.change24h).toFixed(2)}%
            </span>
          </div>
          
          <div className="price-alt text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span className="mr-3">€{priceData.eur.toLocaleString()}</span>
            <span className="mr-3">£{priceData.gbp.toLocaleString()}</span>
            <span>¥{priceData.jpy.toLocaleString()}</span>
          </div>

          <div className={`update-time text-xs mt-2 ${isFreshData ? 'text-gray-500' : 'text-orange-500'}`}>
            Updated: {formattedLastUpdated}
            {priceData.isSimulated && (
              <span className="simulated-badge ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-1 rounded">
                Simulated
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="no-data text-gray-500">No price data available</div>
      )}

      <div className="mining-info text-xs text-gray-500 dark:text-gray-400 mt-3 border-t pt-2">
        Mining Profitability: {priceData ? `$${((priceData.usd * 0.00018) - 0.35).toFixed(2)}` : '...'}/day at 30 MH/s
      </div>
    </Card>
  );
}

export function BitcoinMiningCalculator() {
  const [hashrate, setHashrate] = useState(30); // Default 30 MH/s
  const [electricityCost, setElectricityCost] = useState(0.12); // Default $0.12 per kWh
  const [powerConsumption, setPowerConsumption] = useState(140); // Default 140W

  const { data: bitcoinPrice } = useQuery<BitcoinPriceData>({
    queryKey: ['/api/bitcoin/price'],
    refetchInterval: 60000, // Refetch every minute
  });

  // Calculate mining profitability
  const calculateProfitability = () => {
    if (!bitcoinPrice) return null;

    // Constants for calculation
    const networkDifficulty = 72e12; // Example difficulty
    const blockReward = 6.25; // Current block reward
    const blocksPerDay = 144; // Average blocks per day
    const networkHashrate = 450e18; // Example network hashrate in H/s
    
    // Convert hashrate from MH/s to H/s
    const hashrateHs = hashrate * 1000000;
    
    // Calculate expected BTC per day
    const btcPerDay = (hashrateHs / networkHashrate) * blockReward * blocksPerDay;
    
    // Calculate earnings in USD
    const usdPerDay = btcPerDay * bitcoinPrice.usd;
    
    // Calculate power cost
    const kwhPerDay = (powerConsumption / 1000) * 24; // kWh per day
    const powerCostPerDay = kwhPerDay * electricityCost;
    
    // Calculate net profit
    const netProfitUsd = usdPerDay - powerCostPerDay;

    return {
      btcPerDay,
      usdPerDay,
      powerCostPerDay,
      netProfitUsd,
      roi: powerCostPerDay > 0 ? (netProfitUsd / powerCostPerDay) : 0
    };
  };

  const profitability = calculateProfitability();

  return (
    <Card className="bitcoin-mining-calculator p-4">
      <h3 className="text-lg font-bold mb-4">Mining Profitability Calculator</h3>
      
      <div className="input-group mb-3">
        <label className="block text-sm mb-1">Hashrate (MH/s)</label>
        <input
          type="number"
          value={hashrate}
          onChange={(e) => setHashrate(Number(e.target.value))}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          min="1"
        />
      </div>
      
      <div className="input-group mb-3">
        <label className="block text-sm mb-1">Power Consumption (W)</label>
        <input
          type="number"
          value={powerConsumption}
          onChange={(e) => setPowerConsumption(Number(e.target.value))}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          min="1"
        />
      </div>
      
      <div className="input-group mb-4">
        <label className="block text-sm mb-1">Electricity Cost ($/kWh)</label>
        <input
          type="number"
          value={electricityCost}
          onChange={(e) => setElectricityCost(Number(e.target.value))}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          min="0.01"
          step="0.01"
        />
      </div>
      
      <div className="results p-3 bg-gray-100 dark:bg-gray-800 rounded">
        <h4 className="font-medium mb-2">Estimated Results</h4>
        
        {profitability ? (
          <div className="results-grid grid grid-cols-2 gap-2 text-sm">
            <div className="result-item">
              <div className="result-label text-gray-500">Daily Bitcoin</div>
              <div className="result-value">{profitability.btcPerDay.toFixed(8)} BTC</div>
            </div>
            <div className="result-item">
              <div className="result-label text-gray-500">Daily Revenue</div>
              <div className="result-value">${profitability.usdPerDay.toFixed(2)}</div>
            </div>
            <div className="result-item">
              <div className="result-label text-gray-500">Power Cost</div>
              <div className="result-value">${profitability.powerCostPerDay.toFixed(2)}/day</div>
            </div>
            <div className="result-item">
              <div className="result-label text-gray-500">Net Profit</div>
              <div className={`result-value font-medium ${profitability.netProfitUsd >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ${profitability.netProfitUsd.toFixed(2)}/day
              </div>
            </div>
            <div className="result-item col-span-2">
              <div className="result-label text-gray-500">Monthly Projection</div>
              <div className={`result-value font-medium ${profitability.netProfitUsd >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ${(profitability.netProfitUsd * 30).toFixed(2)}/month
              </div>
            </div>
          </div>
        ) : (
          <div className="loading text-center py-2">
            Loading price data...
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 mt-3 text-center">
        Calculations based on current network difficulty and Bitcoin price of ${bitcoinPrice?.usd.toLocaleString() || '...'}
      </div>
    </Card>
  );
}