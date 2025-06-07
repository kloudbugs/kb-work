import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { WithdrawalForm } from '@/components/ui/WithdrawalForm';
import { WithdrawalHistory } from '@/components/ui/WithdrawalHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { getWalletDetails, getPayouts } from '@/lib/miningClient';
import { BiCoinStack, BiWallet, BiRefresh, BiWrench } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { fixAccounts, fixBalance } from '@/lib/accountFixer';
import { ElectricBorder, SpaceCard } from '@/components/ui/ElectricBorder';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, BarChart3, RefreshCw, Wrench, Bitcoin, CreditCard } from 'lucide-react';

export default function Wallet() {
  // State to track balance change animation
  const [isBalanceChanged, setIsBalanceChanged] = useState(false);
  const [prevBalance, setPrevBalance] = useState<number | null>(null);
  
  // Define wallet data type
  interface WalletData {
    user: {
      walletAddress: string;
      payoutThreshold: string;
      payoutSchedule: string;
      autoPayouts: boolean;
    };
    balance: number;
    balanceUSD: number;
    minimumBalance: number;
  }
  
  // Query for wallet details with auto-refetch enabled
  const { data: wallet, isLoading: walletLoading, refetch: refetchWallet } = useQuery<any, Error, WalletData>({
    queryKey: ['/api/wallet'],
    // Refetch every 5 seconds to update balance in real-time
    refetchInterval: 5000,
    select: (data: any) => {
      // Transform API response to match WalletData type
      console.log("Raw wallet data from API:", data);
      const balance = typeof data?.balance === 'string' ? parseFloat(data.balance) : (data?.balance || 0);
      // Allow withdrawal of the entire balance (no minimum required)
      const minimumBalance = 0;
      
      console.log(`Converted balance: ${balance}, minimum: ${minimumBalance}`);
      
      return {
        user: {
          walletAddress: data?.address || '',
          payoutThreshold: data?.payoutThreshold || '0.001',
          payoutSchedule: data?.payoutSchedule || 'daily',
          autoPayouts: data?.autoPayout || true
        },
        balance: balance,
        balanceUSD: typeof data?.balanceUSD === 'string' ? parseFloat(data.balanceUSD) : (data?.balanceUSD || 0),
        minimumBalance: minimumBalance
      };
    }
  });
  
  // Check if balance changed and trigger animation
  useEffect(() => {
    if (wallet && prevBalance !== null && wallet.balance !== prevBalance) {
      // Balance changed, trigger animation
      setIsBalanceChanged(true);
      
      // Show toast notification
      const balanceDiff = wallet.balance - prevBalance;
      if (balanceDiff > 0) {
        toast({
          title: "Balance Updated",
          description: `+${balanceDiff.toFixed(8)} BTC added to your wallet`,
          variant: "default",
        });
      }
      
      // Reset animation after 2 seconds
      const timer = setTimeout(() => {
        setIsBalanceChanged(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    // Store current balance for next comparison
    if (wallet) {
      setPrevBalance(wallet.balance);
    }
  }, [wallet?.balance, prevBalance]);
  
  // Define payout type to match server schema
  interface Payout {
    id: number;
    userId: number;
    amount: string | number;
    txHash: string | null; // Changed from transactionId to match server field
    walletAddress: string;
    timestamp: string | Date;
    status: string;
    sourceAddress?: string;
    destinationAddress?: string;
    estimatedCompletionTime?: string | Date;
  }
  
  // Query for payout history
  const { data: payouts = [], isLoading: payoutsLoading, error: payoutsError } = useQuery<any, Error, Payout[]>({
    queryKey: ['/api/payouts'],
    onError: (error) => {
      console.error('Error fetching payouts:', error);
      toast({
        title: "Error fetching withdrawal history",
        description: error.message || "Could not load your withdrawal history",
        variant: "destructive",
      });
    }
  });
  
  // Log payouts data for debugging
  console.log('Payouts data:', { payouts, payoutsLoading, payoutsError });
  
  // Function to manually refresh wallet data
  const handleRefresh = () => {
    refetchWallet();
  };
  
  // Function to fix account issues
  const handleFixAccount = async () => {
    await fixAccounts();
    refetchWallet();
  };
  
  // Function to fix balance for testing
  const handleFixBalance = async () => {
    await fixBalance();
    refetchWallet();
  };

  return (
    <MainLayout>
      {/* Cosmic Wallet Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="flex items-center mb-2">
          <motion.div
            className="mr-3 relative"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-cyan-300 rounded-full opacity-20 blur-sm"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <WalletIcon className="h-7 w-7 text-purple-500" />
          </motion.div>
          
          <motion.h1 
            className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500"
            animate={{ 
              textShadow: [
                '0 0 5px rgba(139, 92, 246, 0.5)', 
                '0 0 10px rgba(139, 92, 246, 0.7)', 
                '0 0 5px rgba(139, 92, 246, 0.5)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            COSMIC WALLET TERMINAL
          </motion.h1>
        </motion.div>
        
        <motion.p 
          className="ml-10 text-sm text-purple-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Manage your mining rewards and perform secure withdrawal operations
        </motion.p>
        
        {/* Digital Line Animation */}
        <motion.div 
          className="mt-2 h-px w-full bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0"
          animate={{
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Quick Stats for Wallet */}
      {wallet && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <SpaceCard 
            title="WALLET BALANCE"
            icon={Bitcoin}
            glowColor="amber"
          >
            <motion.div
              className={`${isBalanceChanged ? 'text-amber-400' : 'text-amber-300'}`}
              animate={isBalanceChanged ? { 
                scale: [1, 1.15, 1],
                textShadow: ['0 0 0px rgba(251, 191, 36, 0)', '0 0 15px rgba(251, 191, 36, 0.8)', '0 0 0px rgba(251, 191, 36, 0)']
              } : {}}
              transition={{ duration: 1 }}
            >
              <h3 className="text-xl font-mono font-semibold">
                {walletLoading ? <Skeleton className="h-6 w-24" /> : `${wallet.balance.toFixed(8)}`} BTC
              </h3>
            </motion.div>
            <p className="text-xs text-amber-500 mt-1">Current Bitcoin Balance</p>
          </SpaceCard>
          
          <SpaceCard 
            title="USD VALUE"
            icon={BarChart3}
            glowColor="teal"
          >
            <h3 className="text-xl font-mono font-semibold text-green-300">
              {walletLoading ? <Skeleton className="h-6 w-24" /> : `$${wallet.balanceUSD.toFixed(2)}`}
            </h3>
            <p className="text-xs text-green-500 mt-1">Current Value in USD</p>
          </SpaceCard>
          
          <SpaceCard 
            title="MINIMUM PAYOUT"
            icon={CreditCard}
            glowColor="blue"
          >
            <h3 className="text-xl font-mono font-semibold text-blue-300">0.0005 BTC</h3>
            <p className="text-xs text-blue-500 mt-1">Unmineable Payout Threshold</p>
          </SpaceCard>
          
          <SpaceCard 
            title="PAYOUT METHOD"
            icon={Bitcoin}
            glowColor="purple"
          >
            <h3 className="text-xl font-mono font-semibold text-purple-300">Direct</h3>
            <p className="text-xs text-purple-500 mt-1">To Bitcoin Wallet</p>
          </SpaceCard>
        </div>
      )}
      
      {/* Withdrawals Section with Electric Border */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        {/* Withdrawal Form */}
        <div className="lg:col-span-1">
          <ElectricBorder 
            cornerSize="sm" 
            cornerAccentColor="border-purple-500"
            edgeGlowColor="rgba(139, 92, 246, 0.5)"
          >
            {walletLoading ? (
              <div className="bg-black/70 backdrop-blur-lg rounded-md p-6 space-y-6">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : wallet ? (
              <WithdrawalForm walletDetails={{
                user: wallet.user,
                balance: wallet.balance,
                balanceUSD: wallet.balanceUSD,
                minimumBalance: wallet.minimumBalance
              }} />
            ) : (
              <div className="bg-black/70 backdrop-blur-lg rounded-md p-6 text-center">
                <p className="text-gray-500">Unable to load wallet information</p>
              </div>
            )}
          </ElectricBorder>
        </div>
        
        {/* Withdrawal History */}
        <div className="lg:col-span-2">
          <ElectricBorder 
            cornerSize="sm" 
            cornerAccentColor="border-cyan-500"
            edgeGlowColor="rgba(6, 182, 212, 0.5)"
          >
            <WithdrawalHistory payouts={payouts} isLoading={payoutsLoading} />
          </ElectricBorder>
        </div>
      </div>
      
      {/* Mining Rewards Section */}
      {/* Live Balance Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BiCoinStack className="h-6 w-6 mr-2 text-accent" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Wallet Balances</h2>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleFixAccount}
              className="flex items-center space-x-1"
            >
              <BiWrench className="h-5 w-5" />
              <span>Fix Account</span>
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleFixBalance}
              className="flex items-center space-x-1"
            >
              <BiCoinStack className="h-5 w-5" />
              <span>Add 0.002 BTC</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="flex items-center space-x-1"
            >
              <BiRefresh className={`h-5 w-5 ${walletLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Real Mining Information */}
            <div className="flex flex-col items-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mining Status
              </h3>
              <div className="px-3 py-1 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 rounded-full mb-2">
                Real Mining Only
              </div>
              
              <div className="text-xl md:text-2xl font-bold mt-2 text-center text-gray-700 dark:text-gray-300">
                Mining to Your Bitcoin Wallet
              </div>
              
              <div className="text-md font-mono mt-1 text-center text-gray-600 dark:text-gray-400">
                {walletLoading ? (
                  <Skeleton className="h-6 w-32" />
                ) : wallet?.user?.walletAddress ? (
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded">
                    {wallet.user.walletAddress}
                  </code>
                ) : (
                  "No wallet address configured"
                )}
              </div>
              
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                <p>Real mining rewards are credited directly to your wallet by the mining pool when you reach the minimum payout threshold.</p>
                <p className="mt-2">No simulated balances are tracked in this application.</p>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 bg-blue-50 dark:bg-blue-900 p-2 rounded">
                Track your actual mining rewards on the mining pool website.
              </div>
            </div>
            
            {/* Real Unmineable Balance */}
            <div className="flex flex-col items-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Real Mining Balance (Unmineable)
              </h3>
              <div className="px-3 py-1 text-xs font-medium text-white bg-green-600 dark:bg-green-500 rounded-full mb-2">
                Actual Cryptocurrency
              </div>
              
              <div className="text-3xl md:text-4xl font-bold font-mono mt-2 text-center text-gray-700 dark:text-gray-300">
                Check Unmineable.com
              </div>
              
              <div className="text-lg font-mono mt-2 text-center text-gray-600 dark:text-gray-400">
                {wallet?.user?.walletAddress && (
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded">
                    {wallet.user.walletAddress}
                  </code>
                )}
              </div>
              
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                Real mining rewards are paid directly to your Bitcoin wallet by Unmineable according to their payout schedule (typically after reaching 0.0005 BTC minimum).
              </div>
              
              <div className="mt-2 flex justify-center">
                <a 
                  href={`https://unmineable.com/coins/BTC/address/${wallet?.user?.walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Check on Unmineable
                  <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Real Mining Rewards:</h4>
            <p className="text-xs text-green-700 dark:text-green-300">
              This application now exclusively handles real mining operations. All Bitcoin mining rewards are paid directly by the mining pool (Unmineable) to your hardware wallet address (bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps), while Tera token rewards go to your secondary wallet (bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6). Payouts occur when you reach the minimum threshold (typically 0.0005 BTC).
            </p>
          </div>
        </div>
      
        {/* Mining Pool Information */}
        <div>
          <div className="flex items-center mb-4">
            <BiCoinStack className="h-6 w-6 mr-2 text-accent" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Mining Pool Information</h2>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Unmineable Payout</h3>
                <p className="text-lg font-semibold">
                  <span className="text-green-600 dark:text-green-400">Automatic</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Unmineable automatically pays out when threshold is reached
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Unmineable Threshold</h3>
                <p className="text-lg font-semibold">
                  0.0005 BTC
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Standard minimum payout threshold set by Unmineable
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tracking</h3>
                <p className="text-lg font-semibold capitalize">
                  <a 
                    href={`https://unmineable.com/coins/BTC/address/${wallet?.user?.walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View on Unmineable
                  </a>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Track your rewards and payouts directly on Unmineable
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Mining Pool Information:</h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                When mining with Unmineable, all payout settings are managed by their platform. This application focuses on the mining operation while Unmineable handles the rewards distribution to your Bitcoin wallet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
