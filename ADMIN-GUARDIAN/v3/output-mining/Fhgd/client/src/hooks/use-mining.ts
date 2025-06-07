import { useState, useCallback } from 'react';
import { wsManager } from '@/lib/websocket';
import MiningWorker from '@/lib/mining-worker';

let miningWorker: MiningWorker | null = null;

export function useMining() {
  const [isMining, setIsMining] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [hashRate, setHashRate] = useState(0);

  const connectWebSocket = useCallback(() => {
    // WebSocket connection is handled by wsManager singleton
    setIsConnected(wsManager.isConnected());
    
    // Check connection status periodically
    const checkConnection = () => {
      setIsConnected(wsManager.isConnected());
    };
    
    const interval = setInterval(checkConnection, 1000);
    return () => clearInterval(interval);
  }, []);

  const startMining = useCallback(() => {
    if (!miningWorker) {
      miningWorker = new MiningWorker();
    }

    // Start WebAssembly mining
    const blockHeader = "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    const target = "0000"; // Difficulty target
    
    miningWorker.startMining(blockHeader, target);
    
    // Notify server via WebSocket
    wsManager.startMining();
    
    setIsMining(true);
  }, []);

  const stopMining = useCallback(() => {
    if (miningWorker) {
      miningWorker.stopMining();
    }
    
    // Notify server via WebSocket
    wsManager.stopMining();
    
    setIsMining(false);
  }, []);

  const setMiningIntensity = useCallback((intensity: number) => {
    if (miningWorker) {
      // Adjust difficulty based on intensity (1-10)
      const difficulty = Math.max(1, Math.floor(intensity / 20));
      miningWorker.setDifficulty(difficulty);
    }
  }, []);

  return {
    isMining,
    isConnected,
    hashRate,
    connectWebSocket,
    startMining,
    stopMining,
    setMiningIntensity,
  };
}
