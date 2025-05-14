import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clipboard, SendIcon, AlertTriangle, Bitcoin, 
  Activity, TrendingUp, DollarSign, Cpu, Plus,
  ChevronDown, ChevronUp, RefreshCw, Maximize2, 
  Minimize2, Move, MoreHorizontal
} from 'lucide-react';
import { cn, formatHashRate, formatBtc, formatUsd, shortenHash } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferNow } from '@/lib/miningClient';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface WalletDetails {
  user: {
    walletAddress: string;
    payoutThreshold: string;
    payoutSchedule: string;
    autoPayouts: boolean;
  };
  address?: string;
  balance: string | number;
  balanceUSD: string | number;
  minimumPayout?: string | number;
  networkFee?: string | number;
  pendingBalance?: string | number;
  pendingBalanceUSD?: string | number;
  totalPaid?: string | number;
  lastPayout?: string | null;
}

interface DashboardHeaderProps {
  totalHashRate: string | number;
  estimatedEarnings: string | number;
  activeDevices: string | number;
  powerConsumption: string | number;
  wallet: WalletDetails;
}

export function DashboardHeader({
  totalHashRate,
  estimatedEarnings,
  activeDevices,
  powerConsumption,
  wallet
}: DashboardHeaderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Calculate the available withdrawal amount (balance - minimum balance)
  const balance = typeof wallet.balance === 'string' ? parseFloat(wallet.balance) : wallet.balance;
  const availableForWithdrawal = Math.max(0, balance);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(wallet.user.walletAddress)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Wallet address copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Could not copy wallet address",
          variant: "destructive",
        });
      });
  };
  
  const transferMutation = useMutation({
    mutationFn: transferNow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      toast({
        title: "Transfer Initiated",
        description: "Your funds are being transferred to your wallet",
      });
    },
    onError: (error) => {
      toast({
        title: "Transfer Failed",
        description: String(error),
        variant: "destructive",
      });
    }
  });

  const handleQuickTransfer = () => {
    if (availableForWithdrawal <= 0) {
      toast({
        title: "Transfer Failed",
        description: "No funds available for withdrawal",
        variant: "destructive",
      });
      return;
    }
    
    // Initiate transfer of the maximum available amount
    transferMutation.mutate(availableForWithdrawal);
  };
  
  // Handle opening real withdrawal page
  const handleRealWithdrawal = () => {
    window.open('/real-withdrawal.html', '_blank');
  };

  return (
    <Card className="mb-6 overflow-hidden bg-opacity-90 dark:bg-opacity-90 border border-indigo-200/50 dark:border-indigo-900/50">
      <CardContent className="p-0 rounded-xl overflow-hidden">
        {/* Cosmic Background with Subtle Animation */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 opacity-50"></div>
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(50, 138, 241, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(50, 138, 241, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          {/* Holographic Light Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 mix-blend-overlay"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row relative z-10">
          {/* Mining Stats Section */}
          <div className="flex-1 flex flex-wrap lg:divide-x divide-blue-500/20">
            {/* Hash Rate - Enhanced Panel */}
            <motion.div 
              className="p-5 flex-1 min-w-[200px] relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Holographic Corner Accents */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-cyan-500/50 rounded-tl-sm"></div>
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-cyan-500/50 rounded-br-sm"></div>
              
              <div className="flex items-center relative">
                <motion.div 
                  className="flex-shrink-0 mr-4 bg-blue-900/30 p-2 rounded-full relative overflow-hidden"
                  animate={{ 
                    boxShadow: ['0 0 0px rgba(59, 130, 246, 0.5)', '0 0 15px rgba(59, 130, 246, 0.3)', '0 0 0px rgba(59, 130, 246, 0.5)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 opacity-80"
                    animate={{ 
                      rotate: [0, 360],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <Activity className="w-8 h-8 text-cyan-400 relative z-10" />
                </motion.div>
                
                <div>
                  <div className="flex items-center">
                    <motion.p 
                      className="text-sm font-medium text-gray-200 flex items-center"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      HASH RATE
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="ml-2 w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"
                      />
                    </motion.p>
                  </div>
                  <p className="text-xl font-mono font-semibold text-white bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    {formatHashRate(totalHashRate)}
                  </p>
                  <p className="text-xs text-cyan-400 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +3.2% from last week
                  </p>
                </div>
              </div>
              
              {/* Digital Line Animation */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/0 via-cyan-500/50 to-blue-500/0"
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
            
            {/* Earnings - Enhanced Panel */}
            <motion.div 
              className="p-5 flex-1 min-w-[200px] relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Holographic Corner Accents */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-purple-500/50 rounded-tl-sm"></div>
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-purple-500/50 rounded-br-sm"></div>
              
              <div className="flex items-center relative">
                <motion.div 
                  className="flex-shrink-0 mr-4 bg-indigo-900/30 p-2 rounded-full relative overflow-hidden"
                  animate={{ 
                    boxShadow: ['0 0 0px rgba(99, 102, 241, 0.5)', '0 0 15px rgba(99, 102, 241, 0.3)', '0 0 0px rgba(99, 102, 241, 0.5)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-500/20 opacity-80"
                    animate={{ 
                      rotate: [0, 360],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <DollarSign className="w-8 h-8 text-indigo-400 relative z-10" />
                </motion.div>
                
                <div>
                  <div className="flex items-center">
                    <motion.p 
                      className="text-sm font-medium text-gray-200 flex items-center"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ESTIMATED EARNINGS
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="ml-2 w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block"
                      />
                    </motion.p>
                  </div>
                  <p className="text-xl font-mono font-semibold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                    {formatBtc(estimatedEarnings)} <span className="text-sm font-normal text-gray-300">/day</span>
                  </p>
                </div>
              </div>
              
              {/* Digital Line Animation */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-indigo-500/0 via-purple-500/50 to-indigo-500/0"
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
            
            {/* Active Devices - Enhanced Panel */}
            <motion.div 
              className="p-5 flex-1 min-w-[200px] relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Holographic Corner Accents */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-teal-500/50 rounded-tl-sm"></div>
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-teal-500/50 rounded-br-sm"></div>
              
              <div className="flex items-center relative">
                <motion.div 
                  className="flex-shrink-0 mr-4 bg-teal-900/30 p-2 rounded-full relative overflow-hidden"
                  animate={{ 
                    boxShadow: ['0 0 0px rgba(20, 184, 166, 0.5)', '0 0 15px rgba(20, 184, 166, 0.3)', '0 0 0px rgba(20, 184, 166, 0.5)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-emerald-500/20 opacity-80"
                    animate={{ 
                      rotate: [0, 360],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <Cpu className="w-8 h-8 text-teal-400 relative z-10" />
                </motion.div>
                
                <div>
                  <div className="flex items-center">
                    <motion.p 
                      className="text-sm font-medium text-gray-200 flex items-center"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ACTIVE DEVICES
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="ml-2 w-1.5 h-1.5 rounded-full bg-teal-400 inline-block"
                      />
                    </motion.p>
                  </div>
                  <p className="text-xl font-mono font-semibold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                    {activeDevices}
                  </p>
                  <p className="text-xs text-teal-400 flex items-center">
                    <Plus className="h-3 w-3 mr-1" /> 1 new device connected
                  </p>
                </div>
              </div>
              
              {/* Digital Line Animation */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-teal-500/0 via-teal-500/50 to-teal-500/0"
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
            
            {/* Wallet Details Section - Enhanced Panel */}
            <motion.div 
              className="p-5 flex-1 min-w-[250px] relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Holographic border effect */}
              <div className="absolute inset-0 border-l border-blue-500/20 pointer-events-none" />
              
              {/* Glowing Corner Accents */}
              {[
                'top-0 left-0 border-t-2 border-l-2 w-6 h-6 rounded-tl-md',
                'top-0 right-0 border-t-2 border-r-2 w-6 h-6 rounded-tr-md',
                'bottom-0 left-0 border-b-2 border-l-2 w-6 h-6 rounded-bl-md',
                'bottom-0 right-0 border-b-2 border-r-2 w-6 h-6 rounded-br-md'
              ].map((position, i) => (
                <motion.div
                  key={`wallet-corner-${i}`}
                  className={`absolute ${position} border-amber-500`}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    boxShadow: [
                      '0 0 2px rgba(245, 158, 11, 0.3)',
                      '0 0 8px rgba(245, 158, 11, 0.6)',
                      '0 0 2px rgba(245, 158, 11, 0.3)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3
                  }}
                />
              ))}
              
              <div className="flex items-center">
                <motion.div 
                  className="flex-shrink-0 mr-4 relative"
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Animated glow effect behind the Bitcoin icon */}
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-amber-500/20 blur-md"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity
                    }}
                  />
                  <Bitcoin className="w-12 h-12 text-amber-500 relative z-10" />
                </motion.div>
                
                <div className="flex-1">
                  <motion.p 
                    className="text-sm font-medium text-gray-200 flex items-center"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    WALLET BALANCE
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="ml-2 w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"
                    />
                  </motion.p>
                  
                  <motion.p 
                    className="text-xl font-mono font-semibold text-amber-300"
                    animate={{
                      textShadow: [
                        '0 0 2px rgba(245, 158, 11, 0)',
                        '0 0 4px rgba(245, 158, 11, 0.5)',
                        '0 0 2px rgba(245, 158, 11, 0)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {formatBtc(wallet.balance)} BTC
                  </motion.p>
                  <p className="text-xs text-blue-200">
                    ≈ {formatUsd(wallet.balanceUSD)}
                  </p>
                  
                  {/* Wallet Address */}
                  <div className="mt-3 flex items-center">
                    <div className="bg-black/30 backdrop-blur-sm border border-blue-500/30 rounded px-2 py-1 text-xs font-mono truncate flex-grow text-blue-300">
                      {shortenHash(wallet.user.walletAddress, 12)}
                    </div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={copyToClipboard} 
                        className="ml-1 h-7 w-7 border border-blue-400/20 bg-blue-900/20 text-blue-400 hover:bg-blue-800/50 hover:text-blue-300"
                      >
                        <Clipboard className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-3 flex space-x-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="text-xs py-0 h-7 border-blue-500/50 text-blue-300 bg-blue-900/20 hover:bg-blue-800/50"
                        onClick={handleQuickTransfer}
                        disabled={transferMutation.isPending || availableForWithdrawal <= 0}
                      >
                        <SendIcon className="h-3 w-3 mr-1" />
                        Transfer
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="text-xs py-0 h-7 border-red-500/50 text-red-300 bg-red-900/20 hover:bg-red-900/50"
                        onClick={handleRealWithdrawal}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Admin
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardHeader;