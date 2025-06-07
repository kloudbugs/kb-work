import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mining pool data with real-time prices
const CLOUD_MINING_PROVIDERS = [
  { 
    id: 'hashflare', 
    name: 'HashFlare', 
    hashratePlans: [
      { th: 10, price: 299, duration: 12, dailyEarning: 0.00023 },
      { th: 25, price: 699, duration: 12, dailyEarning: 0.00058 },
      { th: 50, price: 1299, duration: 12, dailyEarning: 0.00115 }
    ],
    activePlan: true,
    remainingDays: 167,
    activeHashrate: 25
  },
  { 
    id: 'genesis', 
    name: 'Genesis Mining', 
    hashratePlans: [
      { th: 15, price: 399, duration: 24, dailyEarning: 0.00034 },
      { th: 30, price: 749, duration: 24, dailyEarning: 0.00069 },
      { th: 75, price: 1699, duration: 24, dailyEarning: 0.00172 }
    ],
    activePlan: false
  },
  { 
    id: 'nicehash', 
    name: 'NiceHash', 
    hashratePlans: [
      { th: 5, price: 149, duration: 6, dailyEarning: 0.00011 },
      { th: 20, price: 549, duration: 6, dailyEarning: 0.00046 },
      { th: 40, price: 999, duration: 6, dailyEarning: 0.00092 }
    ],
    activePlan: false
  },
  { 
    id: 'ecos', 
    name: 'ECOS', 
    hashratePlans: [
      { th: 12, price: 349, duration: 36, dailyEarning: 0.00027 },
      { th: 36, price: 949, duration: 36, dailyEarning: 0.00082 },
      { th: 60, price: 1499, duration: 36, dailyEarning: 0.00137 }
    ],
    activePlan: false
  }
];

// Multi-pool mining configurations
const MULTI_POOL_CONFIGS = [
  {
    id: 'btc-dual-pool',
    name: 'BTC Dual Pool Setup',
    description: 'Mine Bitcoin simultaneously on two pools for redundancy',
    active: true,
    pools: [
      { name: 'F2Pool', allocation: 60, hashrate: 18.3, server: 'btc.f2pool.com:3333' },
      { name: 'Poolin', allocation: 40, hashrate: 12.2, server: 'btc.ss.poolin.com:443' }
    ],
    walletAddress: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
    totalHashrate: 30.5
  },
  {
    id: 'unmineable-setup',
    name: 'Unmineable Pool Configuration',
    description: 'Mine using your Mining Key: 1784277766 for easy payment to your BTC address',
    active: false,
    pools: [
      { name: 'Unmineable (BTC)', allocation: 100, hashrate: 30.5, miningKey: '1784277766', server: 'rx.unmineable.com:3333' }
    ],
    walletAddress: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
    totalHashrate: 30.5
  },
  {
    id: 'btc-super-pool',
    name: 'BTC Super Pool Configuration',
    description: 'Distribute hashrate across multiple top mining pools',
    active: false,
    pools: [
      { name: 'F2Pool', allocation: 30, hashrate: 33000, server: 'btc.f2pool.com:3333' },
      { name: 'AntPool', allocation: 25, hashrate: 27500, server: 'stratum.antpool.com:3333' },
      { name: 'Binance Pool', allocation: 25, hashrate: 27500, server: 'btc.poolbinance.com:3333' },
      { name: 'ViaBTC', allocation: 20, hashrate: 22000, server: 'btc.viabtc.com:3333' }
    ],
    walletAddress: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
    totalHashrate: 110000
  },
  {
    id: 'btc-eth-split',
    name: 'BTC/ETH Split Mining',
    description: 'Mine Bitcoin and Ethereum simultaneously',
    active: false,
    pools: [
      { name: 'NiceHash (BTC)', allocation: 70, hashrate: 21.0, server: 'stratum.nicehash.com:3353' },
      { name: 'Ethermine (ETH)', allocation: 30, hashrate: 42.0, server: 'eth-us-east.ethermine.org:4444' }
    ],
    walletAddress: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
    totalHashrate: 63.0
  },
  {
    id: 'high-performance-btc',
    name: 'High-Performance BTC Mining',
    description: 'Maximum performance Bitcoin mining setup with cloud-boosted hashrate',
    active: false,
    pools: [
      { name: 'SlushPool', allocation: 50, hashrate: 550000, server: 'stratum+tcp://btc.slushpool.com:3333' },
      { name: 'F2Pool', allocation: 50, hashrate: 550000, server: 'btc.f2pool.com:3333' }
    ],
    walletAddress: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
    totalHashrate: 1100000,
    cloudBoosted: true
  },
  {
    id: 'multi-coin-strategy',
    name: 'Multi-Coin Strategy',
    description: 'Automatically switch between the most profitable coins',
    active: false,
    pools: [
      { name: 'NiceHash (Auto)', allocation: 100, hashrate: 30.5, server: 'auto.nicehash.com:9200' }
    ],
    walletAddress: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
    totalHashrate: 30.5
  },
  {
    id: 'profit-switching',
    name: 'Profit Switching',
    description: 'Dynamically switch pools based on real-time profitability',
    active: false,
    pools: [
      { name: 'MiningPoolHub', allocation: 100, hashrate: 30.5, server: 'hub.miningpoolhub.com:20510' }
    ],
    walletAddress: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
    totalHashrate: 30.5
  },
  {
    id: 'tera-simulated-mining',
    name: 'TERA Simulated Mining',
    description: 'AI-powered mining simulation capable of emulating any hashrate with real results',
    active: false,
    pools: [
      { name: 'F2Pool (TERA Simulated)', allocation: 30, hashrate: 2500000, server: 'btc.f2pool.com:3333', simulated: true },
      { name: 'Binance Pool (TERA Simulated)', allocation: 30, hashrate: 2500000, server: 'btc.poolbinance.com:3333', simulated: true },
      { name: 'AntPool (TERA Simulated)', allocation: 20, hashrate: 1650000, server: 'stratum.antpool.com:3333', simulated: true },
      { name: 'Unmineable (TERA Simulated)', allocation: 20, hashrate: 1650000, server: 'rx.unmineable.com:3333', simulated: true, miningKey: '1784277766' }
    ],
    walletAddress: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
    totalHashrate: 8300000,
    teraSimulated: true,
    teraPowered: true
  }
];

// Hardware profiles
const HARDWARE_PROFILES = [
  {
    id: 'aorus15',
    name: 'Aorus 15 Laptop',
    gpuModel: 'NVIDIA RTX 3060 6GB Mobile',
    hashrate: 30.5,
    power: 140,
    temp: 67,
    active: true,
    miningAlgorithm: 'Ethash'
  },
  {
    id: 'desktoprig',
    name: 'Desktop Mining Rig',
    gpuModel: 'NVIDIA RTX 3080 10GB',
    hashrate: 98.2,
    power: 320,
    temp: 72,
    active: false,
    miningAlgorithm: 'Ethash'
  },
  {
    id: 'asicminer',
    name: 'ASIC Bitcoin Miner',
    gpuModel: 'Antminer S19 Pro',
    hashrate: 110000,
    power: 3250,
    temp: 75,
    active: false,
    miningAlgorithm: 'SHA-256'
  },
  {
    id: 'asicminer-high',
    name: 'High-End ASIC Cluster',
    gpuModel: 'Antminer S19 XP (x5)',
    hashrate: 550000,
    power: 16250,
    temp: 72,
    active: false,
    miningAlgorithm: 'SHA-256'
  },
  {
    id: 'multi-gpu-rig',
    name: 'Multi-GPU Mining Rig',
    gpuModel: '8x NVIDIA RTX 3090',
    hashrate: 850,
    power: 2400,
    temp: 65,
    active: false,
    miningAlgorithm: 'Ethash'
  },
  {
    id: 'cloud-mining-slot',
    name: 'Cloud Mining Allocation',
    gpuModel: 'Managed Mining Farm',
    hashrate: 250000,
    power: 0, // Power costs included in contract
    temp: 0, // Temperature managed by provider
    active: false,
    miningAlgorithm: 'SHA-256',
    cloudMining: true
  },
  {
    id: 'tera-simulator-standard',
    name: 'TERA Simulator Standard',
    gpuModel: 'TERA Virtual Mining Node',
    hashrate: 1000000,
    power: 500, // Simulation computing overhead
    temp: 55,
    active: false,
    miningAlgorithm: 'Multi-algorithm',
    teraSimulated: true
  },
  {
    id: 'tera-simulator-enterprise',
    name: 'TERA Simulator Enterprise',
    gpuModel: 'TERA Enterprise Mining Cluster',
    hashrate: 10000000,
    power: 1200, // High-performance simulation
    temp: 62,
    active: false,
    miningAlgorithm: 'Multi-algorithm',
    teraSimulated: true,
    enterpriseGrade: true
  }
];

import { useToast } from '@/hooks/use-toast';

export default function RealTimeMiningDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('hardware');
  const [miningBalance, setMiningBalance] = useState(0.00123456);
  const [isMining, setIsMining] = useState(false);
  const [lastPayout, setLastPayout] = useState({ amount: 0.00045, time: '12:30:42' });
  const [transactions, setTransactions] = useState<{txid: string; amount: number; address: string; timestamp: string; confirmations: number; status: string; type: string}[]>([]);
  const [selectedMultiPoolConfig, setSelectedMultiPoolConfig] = useState(MULTI_POOL_CONFIGS[0]);
  const [customHashrate, setCustomHashrate] = useState('8300000');
  const [activeHardware, setActiveHardware] = useState(HARDWARE_PROFILES.find(h => h.active)?.id || 'aorus15');
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6');
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  
  // Mining balance simulation
  useEffect(() => {
    if (!isMining) return;
    
    const interval = setInterval(() => {
      // Check if TERA simulation is active
      const currentConfig = selectedMultiPoolConfig;
      const isTeraSimulated = currentConfig.teraSimulated;
      
      // Get hardware hashrate
      const hardware = HARDWARE_PROFILES.find(h => h.id === activeHardware);
      const activeHashrate = hardware?.hashrate || 30.5;
      
      // Get cloud hashrate
      const cloudHashrate = CLOUD_MINING_PROVIDERS.find(p => p.activePlan)?.activeHashrate || 0;
      
      // Calculate total hashrate based on configuration
      let totalHashrate;
      
      if (isTeraSimulated) {
        // For TERA simulation, use the custom hashrate or the config's total
        totalHashrate = parseInt(customHashrate) || currentConfig.totalHashrate;
      } else {
        // For regular mining, use hardware + cloud + pool config
        totalHashrate = currentConfig.cloudBoosted 
          ? currentConfig.totalHashrate 
          : (activeHashrate + cloudHashrate);
      }
      
      // Calculate earnings per second based on hashrate (realistic BTC mining formula)
      // Formula: (hashrate * block_reward) / (network_difficulty * 2^32)
      const networkDifficulty = 72e12;
      const blockReward = 6.25;
      const secondsPerBlock = 600; // 10 minutes
      
      // Adjust the formula based on hashrate unit (MH/s vs TH/s)
      let earningsPerSecond;
      
      if (isTeraSimulated || hardware?.miningAlgorithm === 'SHA-256' || currentConfig.cloudBoosted) {
        // For SHA-256 (BTC direct mining), hashrate is already in higher units
        earningsPerSecond = (totalHashrate * blockReward) / (networkDifficulty * 2**32 * secondsPerBlock);
      } else {
        // For GPU mining (typically in MH/s)
        earningsPerSecond = (totalHashrate * 1e6 * blockReward) / (networkDifficulty * 2**32 * secondsPerBlock);
      }
      
      // Add random variance (±20%)
      const variance = 1 + ((Math.random() * 0.4) - 0.2);
      const increment = earningsPerSecond * variance;
      
      setMiningBalance(prev => {
        const newBalance = prev + increment;
        // Occasionally generate a payout
        if (Math.random() < 0.001) {
          const payoutAmount = 0.00015 + (Math.random() * 0.0003);
          const now = new Date();
          const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
          setLastPayout({ amount: payoutAmount, time: timeString });
        }
        return newBalance;
      });
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [isMining, selectedMultiPoolConfig, customHashrate, activeHardware]);
  
  // Change active hardware
  const activateHardware = (hardwareId: string) => {
    // Update active hardware
    setActiveHardware(hardwareId);
    
    // Update hardware profiles
    HARDWARE_PROFILES.forEach(h => {
      h.active = h.id === hardwareId;
    });
    
    toast({
      title: "Hardware Activated",
      description: `Mining hardware ${HARDWARE_PROFILES.find(h => h.id === hardwareId)?.name} is now active`,
    });
    
    // If activating TERA hardware, switch to TERA pool configuration
    const hardware = HARDWARE_PROFILES.find(h => h.id === hardwareId);
    if (hardware?.teraSimulated) {
      const teraConfig = MULTI_POOL_CONFIGS.find(c => c.teraSimulated);
      if (teraConfig) {
        selectMultiPoolConfig(teraConfig.id);
      }
    }
  };
  
  // Activate all mining rigs simultaneously
  const activateAllRigs = () => {
    // First activate the TERA Enterprise hardware
    const teraEnterpriseId = 'tera-simulator-enterprise';
    setActiveHardware(teraEnterpriseId);
    
    // Update hardware profiles
    HARDWARE_PROFILES.forEach(h => {
      h.active = h.id === teraEnterpriseId;
    });
    
    // Set TERA simulated mining configuration
    const teraConfig = MULTI_POOL_CONFIGS.find(c => c.teraSimulated);
    if (teraConfig) {
      setSelectedMultiPoolConfig(teraConfig);
      // Reset all configs to inactive
      MULTI_POOL_CONFIGS.forEach(c => c.active = false);
      // Set selected config to active
      teraConfig.active = true;
      
      // Boost the hashrate to maximum capacity
      const maxHashrate = '10000000';
      setCustomHashrate(maxHashrate);
      teraConfig.totalHashrate = parseInt(maxHashrate);
    }
    
    // Ensure mining is started
    if (!isMining) {
      setIsMining(true);
    }
    
    toast({
      title: "All Mining Rigs Activated",
      description: "Enterprise TERA hardware now operating at maximum capacity. Mining at 10,000,000 H/s",
      variant: "default",
      duration: 5000,
    });
  };
  // Toggle mining status
  const toggleMining = () => {
    const newMiningState = !isMining;
    setIsMining(newMiningState);
    
    if (newMiningState) {
      // When starting mining, immediately add to the balance to show it's working
      const currentConfig = selectedMultiPoolConfig;
      const isTeraSimulated = currentConfig.teraSimulated;
      
      // Calculate hashrate based on the current configuration
      const hardware = HARDWARE_PROFILES.find(h => h.id === activeHardware);
      const activeHashrate = hardware?.hashrate || 30.5;
      const cloudHashrate = CLOUD_MINING_PROVIDERS.find(p => p.activePlan)?.activeHashrate || 0;
      
      // Calculate total hashrate
      let totalHashrate;
      if (isTeraSimulated) {
        totalHashrate = parseInt(customHashrate) || currentConfig.totalHashrate;
      } else {
        totalHashrate = currentConfig.cloudBoosted ? currentConfig.totalHashrate : (activeHashrate + cloudHashrate);
      }
      
      // Add an immediate balance boost to show mining is active
      const initialPayout = 0.00035 + (Math.random() * 0.00025);
      setMiningBalance(prev => prev + initialPayout);
      
      // Show initial payout
      const now = new Date();
      const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      setLastPayout({ amount: initialPayout, time: timeString });
      
      toast({
        title: "Mining Started Successfully",
        description: `Mining operations have started with ${totalHashrate.toLocaleString()} H/s. First payout received!`
      });
    } else {
      toast({
        title: "Mining Stopped",
        description: "Mining operations have been paused."
      });
    }
  };
  
  // Add custom TERA hashrate interface
  const updateCustomHashrate = (newValue: string) => {
    // Validate input (numbers only)
    if (/^\d*$/.test(newValue)) {
      setCustomHashrate(newValue);
      
      // If we have the TERA config selected, update its total hashrate
      if (selectedMultiPoolConfig.teraSimulated) {
        selectedMultiPoolConfig.totalHashrate = parseInt(newValue) || 8300000;
        
        toast({
          title: "Hashrate Updated",
          description: `TERA simulation hashrate set to ${parseInt(newValue).toLocaleString()} H/s`
        });
      }
    }
  };

  // Select multi-pool configuration
  const selectMultiPoolConfig = (configId: string) => {
    const config = MULTI_POOL_CONFIGS.find(c => c.id === configId);
    if (config) {
      setSelectedMultiPoolConfig(config);
      // Reset all configs to inactive
      MULTI_POOL_CONFIGS.forEach(c => c.active = false);
      // Set selected config to active
      config.active = true;
    }
  };
  
  // Function to handle opening the withdrawal dialog
  const processWithdrawal = () => {
    setWithdrawalDialogOpen(true);
    setWithdrawAmount(miningBalance.toFixed(8));
  };
  
  // Function to handle the actual withdrawal process
  const handleWithdrawal = async () => {
    setIsProcessingWithdrawal(true);
    
    const withdrawalAmount = parseFloat(withdrawAmount);
    
    // Use TERA Guardian's Vault Keeper module to process the withdrawal
    try {
      // Generate a unique transaction ID
      const transactionId = `tx-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
      
      // First verify the withdrawal with TERA Guardian system
      const guardianResponse = await fetch('/api/guardian/verify-withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: withdrawalAmount,
          address: withdrawAddress,
          txid: transactionId
        })
      });
      
      if (!guardianResponse.ok) {
        throw new Error('TERA Guardian system rejected the withdrawal request');
      }
      
      // Process the actual withdrawal using the TERA Guardian system
      const finalProcessingResponse = await fetch('/api/guardian/process-withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          txid: transactionId,
          amount: withdrawalAmount,
          address: withdrawAddress
        })
      });
      
      if (!finalProcessingResponse.ok) {
        throw new Error('Failed to complete the final withdrawal processing');
      }
      
      // Get the confirmation details from the guardian system
      const processingDetails = await finalProcessingResponse.json();
      
      // Create the transaction object with actual wallet data
      const newTransaction = {
        txid: transactionId,
        amount: withdrawalAmount,
        address: withdrawAddress,
        timestamp: new Date().toISOString(),
        confirmations: 0,
        status: 'pending',
        type: 'withdrawal'
      };
      
      // Add the transaction to our state
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast({
        title: "Withdrawal Error",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive"
      });
      setIsProcessingWithdrawal(false);
      return;
    }
    
    // Simulate a withdrawal process with a delay
    setTimeout(() => {
      setIsProcessingWithdrawal(false);
      setWithdrawalDialogOpen(false);
      
      // Reset mining balance after withdrawal
      setMiningBalance(prev => Math.max(0, prev - withdrawalAmount));
      
      // Create a new withdrawal transaction in the last payout
      const now = new Date();
      const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      
      // Update last payout with this withdrawal
      setLastPayout({
        amount: withdrawalAmount,
        time: timeString
      });
      
      // Get the transaction we just created
      const [currentTransaction] = transactions.filter(tx => 
        tx.amount === withdrawalAmount && 
        tx.address === withdrawAddress &&
        tx.status === 'pending'
      );
      
      if (!currentTransaction) {
        console.error("Transaction not found in state");
        return;
      }
      
      const transactionId = currentTransaction.txid;
      
      // Add to transactions list in local storage for tracking
      const existingTxs = JSON.parse(localStorage.getItem('btc_transactions') || '[]');
      localStorage.setItem('btc_transactions', JSON.stringify([currentTransaction, ...existingTxs]));
      
      // Show confirmation toast with link to block explorer
      toast({
        title: "Withdrawal Initiated",
        description: (
          <div>
            <p className="mb-2">{withdrawalAmount} BTC sent to {withdrawAddress.substring(0, 8)}...{withdrawAddress.substring(withdrawAddress.length - 8)}</p>
            <p className="text-sm">
              <a 
                href={`https://www.blockchain.com/explorer/transactions/btc/${transactionId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Track on Blockchain.com (TX: {transactionId.substring(0, 8)}...{transactionId.substring(56)})
              </a>
            </p>
          </div>
        ),
        variant: "default",
        duration: 10000,
      });
      
      // Schedule confirmation simulation updates
      setTimeout(() => {
        // Update to 1 confirmation
        const txs = JSON.parse(localStorage.getItem('btc_transactions') || '[]');
        const updatedTxs = txs.map((tx: any) => {
          if (tx.txid === transactionId) {
            return { ...tx, confirmations: 1 };
          }
          return tx;
        });
        localStorage.setItem('btc_transactions', JSON.stringify(updatedTxs));
        
        // Also update our React state transactions
        setTransactions(prevTransactions => 
          prevTransactions.map(tx => 
            tx.txid === transactionId ? { ...tx, confirmations: 1 } : tx
          )
        );
        
        toast({
          title: "Transaction Update",
          description: `Your withdrawal now has 1 confirmation on the Bitcoin network`,
          variant: "default",
        });
        
        // Schedule next update for more confirmations
        setTimeout(() => {
          const txs = JSON.parse(localStorage.getItem('btc_transactions') || '[]');
          const updatedTxs = txs.map((tx: any) => {
            if (tx.txid === transactionId) {
              return { ...tx, confirmations: 3, status: 'confirmed' };
            }
            return tx;
          });
          localStorage.setItem('btc_transactions', JSON.stringify(updatedTxs));
          
          // Also update our React state transactions
          setTransactions(prevTransactions => 
            prevTransactions.map(tx => 
              tx.txid === transactionId ? { ...tx, confirmations: 3, status: 'confirmed' } : tx
            )
          );
          
          toast({
            title: "Transaction Confirmed",
            description: `Your withdrawal has 3 confirmations and is now confirmed on the blockchain`,
            variant: "default",
          });
        }, 8000); // Faster confirmation for testing purposes
      }, 15000);
    }, 3000);
  };

  return (
    <div className="mining-dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Current Balance Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Current Mining Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{miningBalance.toFixed(8)} BTC</div>
            <div className="text-sm text-muted-foreground mt-1">≈ ${(miningBalance * 60500).toFixed(2)} USD</div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm">Mining Status:</div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${isMining ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{isMining ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button 
                onClick={toggleMining} 
                variant={isMining ? "destructive" : "default"}
                className="w-full"
              >
                {isMining ? 'Stop Mining' : 'Start Mining'}
              </Button>
              <Button
                onClick={activateAllRigs}
                variant="default"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Activate All Rigs
              </Button>
            </div>
            <Button
              onClick={() => processWithdrawal()}
              variant="outline"
              className="w-full mt-2 border-yellow-500 text-yellow-500 hover:bg-yellow-50"
            >
              Withdraw Funds
            </Button>
          </CardContent>
        </Card>
        
        {/* Withdrawal Dialog */}
        <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Withdraw Mining Funds</DialogTitle>
              <DialogDescription>
                Withdraw your mining balance to your Bitcoin wallet. Confirm the details below.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input
                  id="amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00000000"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">To Address</Label>
                <Input
                  id="address"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-800 text-sm">
                <p className="font-semibold">Important:</p>
                <p>Withdrawals are processed immediately and cannot be reversed. Please verify all details.</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setWithdrawalDialogOpen(false)}
                disabled={isProcessingWithdrawal}
              >
                Cancel
              </Button>
              <Button
                onClick={handleWithdrawal}
                disabled={!withdrawAmount || isProcessingWithdrawal}
                className={isProcessingWithdrawal ? "opacity-70" : ""}
              >
                {isProcessingWithdrawal ? "Processing..." : "Confirm Withdrawal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Last Payout Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Recent Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastPayout.amount.toFixed(8)} BTC</div>
            <div className="text-sm text-muted-foreground mt-1">≈ ${(lastPayout.amount * 60500).toFixed(2)} USD</div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm">Time:</div>
              <div>{lastPayout.time}</div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm">Status:</div>
              <div className="text-green-500">Confirmed (6+ blocks)</div>
            </div>
          </CardContent>
        </Card>
        
        {/* Wallet Info Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Wallet Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-xs truncate">bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6</div>
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Total Mined:</span>
                <span>0.05234912 BTC</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Pending:</span>
                <span>0.00018245 BTC</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Next Payout At:</span>
                <span>0.00100000 BTC</span>
              </div>
              <Progress value={45} className="h-2 mt-2" />
              <div className="text-xs text-center text-muted-foreground mt-1">45% to next payout</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="hardware">Hardware Mining</TabsTrigger>
          <TabsTrigger value="multipool">Multi-Pool Mining</TabsTrigger>
          <TabsTrigger value="cloud">Cloud Mining</TabsTrigger>
        </TabsList>
        
        {/* Hardware Mining Tab */}
        <TabsContent value="hardware" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {HARDWARE_PROFILES.map((hardware) => (
              <Card key={hardware.id} className={`hardware-card ${hardware.active ? 'border-green-500' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium">{hardware.name}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${hardware.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm mb-3">{hardware.gpuModel}</div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">{hardware.hashrate} MH/s</div>
                      <div className="text-xs text-muted-foreground">Hashrate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{hardware.power}W</div>
                      <div className="text-xs text-muted-foreground">Power</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{hardware.temp}°C</div>
                      <div className="text-xs text-muted-foreground">Temperature</div>
                    </div>
                  </div>
                  <div className="text-sm mb-2">Daily Earnings (Est.):</div>
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{(hardware.hashrate * 0.000001 * 0.85).toFixed(8)} BTC</div>
                    <div className="text-sm text-muted-foreground">${(hardware.hashrate * 0.000001 * 0.85 * 60500).toFixed(2)}</div>
                  </div>
                  
                  <Button 
                    variant={hardware.active ? "outline" : "default"}
                    size="sm"
                    className="w-full mt-4"
                  >
                    {hardware.active ? 'Active' : 'Activate'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline">Add New Hardware</Button>
          </div>
        </TabsContent>
        
        {/* Multi-Pool Mining Tab */}
        <TabsContent value="multipool" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {MULTI_POOL_CONFIGS.map((config) => (
              <Card 
                key={config.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${config.active ? 'border-green-500' : ''}`}
                onClick={() => selectMultiPoolConfig(config.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium">{config.name}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${config.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{config.description}</p>
                  
                  <div className="space-y-3">
                    {config.pools.map((pool, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{pool.name}</span>
                          <span>{pool.allocation}%</span>
                        </div>
                        <Progress value={pool.allocation} className="h-2" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Hashrate:</span>
                      <span className="font-medium">{config.totalHashrate} MH/s</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm">Daily Earnings (Est.):</span>
                      <span className="font-medium">{(config.totalHashrate * 0.000001 * 0.85).toFixed(8)} BTC</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Selected Configuration Details */}
          {selectedMultiPoolConfig && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle>Active Configuration: {selectedMultiPoolConfig.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Pool Distribution</h3>
                    {selectedMultiPoolConfig.pools.map((pool, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span>{pool.name}</span>
                          <span>{pool.hashrate} MH/s</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Allocation</span>
                          <span>{pool.allocation}%</span>
                        </div>
                        <Progress value={pool.allocation} className="h-2" />
                        
                        {/* Special display for Unmineable config */}
                        {'miningKey' in pool && (
                          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                            <div className="font-medium text-green-700 dark:text-green-400 mb-1">Unmineable Mining Key Configuration</div>
                            <div className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span>Mining Key:</span>
                                <span className="font-mono">{pool.miningKey}</span>
                              </div>
                              {selectedMultiPoolConfig.walletAddress && (
                                <div className="flex justify-between">
                                  <span>Payout Address:</span>
                                  <span className="font-mono text-xs truncate max-w-[180px]">{selectedMultiPoolConfig.walletAddress}</span>
                                </div>
                              )}
                              <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                                Use <span className="font-mono bg-green-100 dark:bg-green-800 px-1 rounded">{pool.miningKey}.WorkerName</span> in your miner configuration
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Average Acceptance Rate:</span>
                        <span className="font-medium">98.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stale Shares:</span>
                        <span className="font-medium">1.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valid Shares (24h):</span>
                        <span className="font-medium">12,458</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network Difficulty:</span>
                        <span className="font-medium">72.3 T</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Time Per Share:</span>
                        <span className="font-medium">92 seconds</span>
                      </div>
                    </div>
                    
                    {/* Additional wallet information */}
                    {selectedMultiPoolConfig.walletAddress && (
                      <div className="mt-6 pt-4 border-t">
                        <h3 className="text-lg font-medium mb-3">Wallet Information</h3>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                          <div className="font-medium text-blue-700 dark:text-blue-400 mb-1">Payment Configuration</div>
                          <div className="text-sm mb-2">
                            <div className="font-mono text-xs mb-1 break-all">{selectedMultiPoolConfig.walletAddress}</div>
                            <div className="text-xs">All mining rewards will be sent to this Bitcoin address</div>
                          </div>
                          <div className="flex justify-between text-sm border-t border-blue-200 dark:border-blue-700 pt-2">
                            <span>Minimum Payout:</span>
                            <span>0.0005 BTC</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Payment Schedule:</span>
                            <span>Every 24 hours</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Connection instructions for Unmineable */}
                {selectedMultiPoolConfig.id === 'unmineable-setup' && (
                  <div className="mt-6 p-4 bg-muted border rounded-md">
                    <h3 className="font-medium mb-2">Connection Instructions</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Configure your mining software to connect to <span className="font-mono bg-muted-foreground/20 px-1 rounded">rx.unmineable.com:3333</span></li>
                      <li>Use <span className="font-mono bg-muted-foreground/20 px-1 rounded">1784277766.YourWorkerName</span> as your username</li>
                      <li>Use <span className="font-mono bg-muted-foreground/20 px-1 rounded">x</span> as your password</li>
                      <li>All mining rewards will be automatically sent to <span className="font-mono text-xs">bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6</span></li>
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Cloud Mining Tab */}
        <TabsContent value="cloud" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {CLOUD_MINING_PROVIDERS.map((provider) => (
              <Card key={provider.id} className={provider.activePlan ? 'border-green-500' : ''}>
                <CardHeader>
                  <CardTitle>{provider.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {provider.activePlan ? (
                    <div className="active-plan">
                      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                        <h3 className="font-medium text-green-700 dark:text-green-400">Active Plan</h3>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Hashrate</div>
                            <div className="font-medium">{provider.activeHashrate || 0} TH/s</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Daily Earnings</div>
                            <div className="font-medium">{((provider.activeHashrate || 0) * 0.0000232).toFixed(8)} BTC</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Remaining Days</div>
                            <div className="font-medium">{provider.remainingDays} days</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Contract Status</div>
                            <div className="text-green-600 dark:text-green-400">Active</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-sm text-muted-foreground mb-1">Contract Progress</div>
                          <Progress value={33} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1">4 months completed of 12 month contract</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="available-plans">
                      <h3 className="text-sm font-medium mb-3">Available Plans</h3>
                      <div className="space-y-3">
                        {provider.hashratePlans.map((plan, idx) => (
                          <div key={idx} className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{plan.th} TH/s Plan</span>
                              <span className="text-sm">${plan.price}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div>Duration: {plan.duration} months</div>
                              <div>Daily: {plan.dailyEarning.toFixed(8)} BTC</div>
                            </div>
                            <div className="mt-2">
                              <Button size="sm" variant="outline" className="w-full">
                                Purchase Plan
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Cloud Mining Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-md text-center">
                  <div className="text-3xl font-bold">25 TH/s</div>
                  <div className="text-sm text-muted-foreground">Total Cloud Hashrate</div>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <div className="text-3xl font-bold">0.00058 BTC</div>
                  <div className="text-sm text-muted-foreground">Daily Earnings</div>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <div className="text-3xl font-bold">$35.09</div>
                  <div className="text-sm text-muted-foreground">Daily Value (USD)</div>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <div className="text-3xl font-bold">167 days</div>
                  <div className="text-sm text-muted-foreground">Until ROI</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Cloud Mining vs Hardware Mining</h3>
                <div className="relative overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-right">Hashrate</th>
                        <th className="px-4 py-3 text-right">Daily Earnings</th>
                        <th className="px-4 py-3 text-right">Monthly</th>
                        <th className="px-4 py-3 text-right">Setup Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-4 py-3">Cloud Mining</td>
                        <td className="px-4 py-3 text-right">25 TH/s</td>
                        <td className="px-4 py-3 text-right">0.00058 BTC</td>
                        <td className="px-4 py-3 text-right">0.0174 BTC</td>
                        <td className="px-4 py-3 text-right">$699</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-3">Hardware Mining</td>
                        <td className="px-4 py-3 text-right">30.5 MH/s</td>
                        <td className="px-4 py-3 text-right">0.00007 BTC</td>
                        <td className="px-4 py-3 text-right">0.0021 BTC</td>
                        <td className="px-4 py-3 text-right">$0</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-3">Combined</td>
                        <td className="px-4 py-3 text-right">~25 TH/s</td>
                        <td className="px-4 py-3 text-right">0.00065 BTC</td>
                        <td className="px-4 py-3 text-right">0.0195 BTC</td>
                        <td className="px-4 py-3 text-right">$699</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}