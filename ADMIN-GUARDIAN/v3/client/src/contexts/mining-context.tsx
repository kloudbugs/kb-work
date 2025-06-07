import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useWebSocket, WebSocketMessage } from "@/lib/use-websocket";
import { initialMiningState, MiningState, fetchMiningSettings, updateMiningSettings, startMining as apiStartMining, stopMining as apiStopMining, fetchRewards } from "@/lib/mining-client";
import { MiningSettings, MiningStatusUpdate } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

type MiningContextType = MiningState & {
  isConnected: boolean;
  connectWebSocket: () => void;
  updateSettings: (settings: Partial<MiningSettings>) => void;
  startMining: () => void;
  stopMining: () => void;
};

const MiningContext = createContext<MiningContextType | undefined>(undefined);

export const MiningProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<MiningState>(initialMiningState);
  const { toast } = useToast();
  
  const handleMessage = useCallback((message: WebSocketMessage) => {
    try {
      if (message.type === 'miningUpdate' && message.payload) {
        const update = message.payload as MiningStatusUpdate;
        setState(prevState => ({
          ...prevState,
          hardwareStatus: update.hardwareStatus || prevState.hardwareStatus,
          miningStats: update.miningStats || prevState.miningStats,
          profitability: update.profitability || prevState.profitability,
          performanceHistory: [
            ...prevState.performanceHistory,
            { 
              time: new Date(update.timestamp || Date.now()).toLocaleTimeString(), 
              hashrate: update.miningStats?.hashrate || 0
            }
          ].slice(-30) // Keep only the last 30 data points
        }));
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, []);
  
  const handleConnected = useCallback(() => {
    toast({
      title: "Connected",
      description: "Real-time mining data connection established",
    });
  }, [toast]);
  
  const handleDisconnected = useCallback(() => {
    // Only show toast if we were previously connected
    if (state.hardwareStatus || state.miningStats) {
      toast({
        title: "Disconnected",
        description: "Real-time mining data connection lost. Attempting to reconnect...",
        variant: "destructive",
      });
    }
  }, [toast, state.hardwareStatus, state.miningStats]);
  
  // Ensure we're using the correct reference to the WebSocket hook
  const websocketConnection = useWebSocket(
    handleMessage,
    handleConnected,
    handleDisconnected
  );
  
  const { isConnected, connect, sendMessage } = websocketConnection;
  
  const loadInitialData = useCallback(async () => {
    try {
      const [settings, rewards] = await Promise.all([
        fetchMiningSettings(),
        fetchRewards()
      ]);
      
      setState(prevState => ({
        ...prevState,
        miningSettings: settings,
        rewards
      }));
    } catch (error) {
      console.error("Failed to load initial data:", error);
    }
  }, []);
  
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  
  const updateSettings = async (newSettings: Partial<MiningSettings>) => {
    try {
      const updatedSettings = await updateMiningSettings(newSettings);
      setState(prevState => ({
        ...prevState,
        miningSettings: updatedSettings
      }));
      
      // Also update the server via WebSocket for immediate effect
      sendMessage({
        type: 'updateSettings',
        payload: newSettings
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast({
        title: "Error",
        description: "Failed to update mining settings",
        variant: "destructive",
      });
    }
  };
  
  const startMining = async () => {
    try {
      await apiStartMining();
      setState(prevState => ({
        ...prevState,
        miningStats: {
          ...prevState.miningStats,
          isActive: true
        }
      }));
      
      // Also notify the server via WebSocket
      sendMessage({
        type: 'startMining',
        payload: {}
      });
    } catch (error) {
      console.error("Failed to start mining:", error);
      toast({
        title: "Error",
        description: "Failed to start mining",
        variant: "destructive",
      });
    }
  };
  
  const stopMining = async () => {
    try {
      await apiStopMining();
      setState(prevState => ({
        ...prevState,
        miningStats: {
          ...prevState.miningStats,
          isActive: false
        }
      }));
      
      // Also notify the server via WebSocket
      sendMessage({
        type: 'stopMining',
        payload: {}
      });
    } catch (error) {
      console.error("Failed to stop mining:", error);
      toast({
        title: "Error",
        description: "Failed to stop mining",
        variant: "destructive",
      });
    }
  };
  
  return (
    <MiningContext.Provider value={{
      ...state,
      isConnected,
      connectWebSocket: connect,
      updateSettings,
      startMining,
      stopMining
    }}>
      {children}
    </MiningContext.Provider>
  );
};

export const useMining = () => {
  const context = useContext(MiningContext);
  if (context === undefined) {
    throw new Error("useMining must be used within a MiningProvider");
  }
  return context;
};
