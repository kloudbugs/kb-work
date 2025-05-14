import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMiningStats, toggleMining, getPools, getDevices } from '@/lib/miningClient';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface MiningContextType {
  miningEnabled: boolean;
  toggleMiningState: () => void;
  totalHashRate: number | string;
  estimatedEarnings: number;
  activeDevices: number;
  powerConsumption: number;
  isLoading: boolean;
  isMiningToggleLoading: boolean;
  refreshStats: () => void;
  activeMiningPool: string | null;
  activeMiningWallet: string | null;
  activeMiningDevice: string | null;
  isMiningReady: boolean;
}

const MiningContext = createContext<MiningContextType | undefined>(undefined);

export function MiningProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [miningEnabled, setMiningEnabled] = useState(false); // Start with mining disabled by default
  const [isMiningReady, setIsMiningReady] = useState(false); // Tracks if mining is ready after ASIC config
  const [activeMiningPool, setActiveMiningPool] = useState<string | null>(null);
  const [activeMiningWallet, setActiveMiningWallet] = useState<string | null>(null);
  const [activeMiningDevice, setActiveMiningDevice] = useState<string | null>(null);
  
  // Stats state management
  const [hashRateState, setHashRateState] = useState<number | string>(0);
  const [earningsState, setEarningsState] = useState<number>(0);
  const [devicesState, setDevicesState] = useState<number>(0);
  const [powerState, setPowerState] = useState<number>(0);

  // Query for mining stats
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['/api/mining/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Update miningEnabled based on the stats data
  useEffect(() => {
    if (stats) {
      // If we have miningEnabled directly in stats, use it
      if (typeof stats.miningEnabled === 'boolean') {
        setMiningEnabled(stats.miningEnabled);
      }
      
      // If the mining is ready (ASIC is configured), set appropriate UI state
      if (stats.miningReady === true) {
        // Update UI to reflect that mining is ready to start
        // This doesn't auto-start mining but shows the UI that it can be started
        setIsMiningReady(true);
        // Update mining stats to reflect configuration
        setHashRateState(stats.totalHashRate);
        setEarningsState(stats.estimatedEarnings);
        setDevicesState(stats.activeDevices);
        setPowerState(stats.powerConsumption);
      }
    }
  }, [stats]);

  // Mutation for toggling mining
  const toggleMiningMutation = useMutation({
    mutationFn: (enabled: boolean) => toggleMining(enabled),
    onSuccess: (data: any) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      // Also refresh wallet data to show updated balance when mining is started
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      
      // Check if a bonus was added (when starting mining)
      const bonusMessage = data?.bonusAdded 
        ? ` Startup bonus of ${data.bonusAmount} satoshis added to your wallet!` 
        : '';
        
      // Update immediately to improve UI responsiveness
      setMiningEnabled(!miningEnabled);
      
      // Show toast notification
      toast({
        title: miningEnabled ? "Mining Stopped" : "Mining Started",
        description: miningEnabled 
          ? "All mining operations have been paused." 
          : `Mining operations have resumed across all devices.${bonusMessage}`,
        variant: miningEnabled ? "destructive" : "default",
      });
      
      // If starting mining and we have mining information, show a detailed alert
      if (!miningEnabled && activeMiningPool && activeMiningWallet) {
        // Add a short delay so the first toast is visible first
        setTimeout(() => {
          toast({
            title: "Mining Configuration",
            description: (
              <Alert className="mt-2 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <Info className="h-5 w-5 text-green-500 dark:text-green-400" />
                <AlertTitle className="ml-2">Mining Started with the following configuration:</AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="text-sm space-y-1">
                    <p><strong>Pool:</strong> {activeMiningPool || 'Unmineable'}</p>
                    <p><strong>Wallet:</strong> {activeMiningWallet ? `${activeMiningWallet.substring(0, 8)}...${activeMiningWallet.substring(activeMiningWallet.length - 8)}` : 'Default Wallet'}</p>
                    {activeMiningDevice && <p><strong>Device:</strong> {activeMiningDevice}</p>}
                    <p className="mt-2 text-green-600 dark:text-green-400 font-medium">Mining has started successfully! 🚀</p>
                  </div>
                </AlertDescription>
              </Alert>
            ),
            duration: 8000, // Show for 8 seconds
          });
        }, 500);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to toggle mining: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Query pools and devices for the alert message
  const { data: pools } = useQuery({
    queryKey: ['/api/pools'],
    refetchOnWindowFocus: false,
  });

  const { data: devices } = useQuery({
    queryKey: ['/api/devices'],
    refetchOnWindowFocus: false,
  });

  const { data: wallet } = useQuery({
    queryKey: ['/api/wallet'],
    refetchOnWindowFocus: false,
  });

  // Update active mining details when stats change
  useEffect(() => {
    if (stats) {
      // Find the active pool from stats or pool data
      if (pools?.pools) {
        // First, look for Unmineable specifically (our preferred pool)
        const unMineablePool = pools.pools.find((p: any) => p.name === 'Unmineable');
        
        // If Unmineable is found, use it
        if (unMineablePool) {
          setActiveMiningPool('Unmineable');
        } else {
          // If no Unmineable, try to find any active pool
          const activePool = pools.pools.find((p: any) => p.status === 'active');
          if (activePool) {
            setActiveMiningPool(activePool.name);
          } else if (pools.pools.length > 0) {
            // Default to first pool as last resort
            setActiveMiningPool(pools.pools[0].name);
          }
        }
      }

      // Set wallet address
      if (wallet?.walletAddress) {
        setActiveMiningWallet(wallet.walletAddress);
      }

      // Find active device
      if (devices && devices.length > 0) {
        const activeDevice = devices.find((d: any) => d.status === 'active');
        if (activeDevice) {
          setActiveMiningDevice(activeDevice.name);
        } else if (devices.length > 0) {
          // Default to first device
          setActiveMiningDevice(devices[0].name);
        }
      }
    }
  }, [stats, pools, devices, wallet]);

  // Toggle mining state
  const toggleMiningState = () => {
    toggleMiningMutation.mutate(!miningEnabled);
  };

  // Use the local state values

  // Context value
  const value = {
    miningEnabled,
    toggleMiningState,
    totalHashRate: hashRateState,
    estimatedEarnings: earningsState,
    activeDevices: devicesState,
    powerConsumption: powerState,
    isLoading,
    isMiningToggleLoading: toggleMiningMutation.isPending,
    refreshStats: refetch,
    activeMiningPool,
    activeMiningWallet,
    activeMiningDevice,
    isMiningReady
  };

  return (
    <MiningContext.Provider value={value}>
      {children}
    </MiningContext.Provider>
  );
}

export function useMining() {
  const context = useContext(MiningContext);
  if (context === undefined) {
    throw new Error('useMining must be used within a MiningProvider');
  }
  return context;
}
