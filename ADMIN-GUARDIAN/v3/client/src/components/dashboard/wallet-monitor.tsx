import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMining } from "@/contexts/mining-context";
import { formatCurrency } from "@/lib/utils";
import { Wallet, Bitcoin, ArrowUpRight, Copy, CheckCircle, RefreshCw, Clock, Info, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Wallet transaction type
interface WalletTransaction {
  id: string;
  amount: number;
  type: string;
  timestamp: Date;
  status: string;
  confirmations: number;
}

// Wallet data type
interface WalletData {
  address: string;
  balance: number;
  balanceUsd: number;
  pendingBalance: number;
  pendingBalanceUsd: number;
  totalMined: number;
  totalMinedUsd: number;
  bitcoinPrice: number;
  confirmed: WalletTransaction[];
  pending: WalletTransaction[];
}

export default function WalletMonitor() {
  const [copied, setCopied] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Wallet address - default from mining settings or fall back to the specific one
  const walletAddress = "bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6";
  const abbreviatedAddress = `${walletAddress.slice(0, 10)}...${walletAddress.slice(-8)}`;
  
  // Query for real wallet data from blockchain API
  const { 
    data: walletData, 
    isLoading: updateLoading,
    isError: walletError,
    refetch: refreshWalletData
  } = useQuery({
    queryKey: ['/api/wallet/transactions'],
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
    staleTime: 60 * 1000, // Data is considered fresh for 1 minute
  });
  
  // Fallback values if API fails
  const walletBalance = walletData?.balance || 0;
  const pendingBalance = walletData?.pendingBalance || 0;
  const transactions = [...(walletData?.confirmed || []), ...(walletData?.pending || [])];
  const totalMined = walletData?.totalMined || 0;
  const bitcoinPrice = walletData?.bitcoinPrice || 84250; // Default price if API fails
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const refreshWallet = () => {
    refreshWalletData();
    setLastUpdate(new Date());
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatBtcAmount = (amount: number) => {
    return amount.toFixed(8);
  };

  return (
    <Card className="mb-6 bg-neutral-900 border-indigo-800/30 shadow-md">
      <CardHeader className="border-b border-indigo-800/30 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-600/20 rounded-md">
              <Bitcoin className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">Bitcoin Wallet</CardTitle>
              <CardDescription className="text-neutral-400">
                Mining rewards and transaction history
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-indigo-800/30 bg-neutral-800 text-neutral-400 hover:bg-indigo-900/30 hover:text-indigo-400"
            onClick={refreshWallet}
            disabled={updateLoading}
          >
            {updateLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Update
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {walletError ? (
          <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-md flex items-center mb-4">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-white">Error Connecting to Blockchain</h3>
              <p className="text-xs text-neutral-400">Could not fetch wallet data from the blockchain explorer. Please try again later.</p>
            </div>
          </div>
        ) : null}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-neutral-800/50 border border-indigo-800/30 rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-medium text-white">Wallet Address</h3>
            </div>
            
            <div className="flex items-center mb-3">
              <div className="font-mono text-xs text-indigo-400 p-2 bg-neutral-800 rounded-md flex-1 break-all">
                {walletAddress}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 text-neutral-400 hover:bg-indigo-900/30 hover:text-indigo-400"
                onClick={copyToClipboard}
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="text-xs text-neutral-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Last update: {formatDate(lastUpdate)}</span>
            </div>
          </div>
          
          <div className="bg-neutral-800/50 border border-indigo-800/30 rounded-md p-4">
            <h3 className="text-sm font-medium text-white mb-3">Current Balance</h3>
            
            <div className="flex flex-col space-y-2">
              <div className="bg-neutral-800 p-3 rounded-md">
                <div className="text-xs text-neutral-400">Confirmed Balance</div>
                <div className="flex items-center">
                  <Bitcoin className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-white text-xl font-mono">{formatBtcAmount(walletBalance)} BTC</span>
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  ≈ {formatCurrency(walletBalance * bitcoinPrice)}
                </div>
              </div>
              
              <div className="bg-neutral-800 p-3 rounded-md">
                <div className="text-xs text-neutral-400">Pending Balance</div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-yellow-500/60 mr-2" />
                  <span className="text-neutral-300 text-xl font-mono">{formatBtcAmount(pendingBalance)} BTC</span>
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  ≈ {formatCurrency(pendingBalance * bitcoinPrice)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-800/50 border border-indigo-800/30 rounded-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-white">Mining Statistics</h3>
            <Badge className="bg-indigo-900/30 text-indigo-400 border-indigo-800/30">
              Since Activation
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-neutral-800 p-3 rounded-md">
              <div className="text-xs text-neutral-400 mb-1">Total Mined</div>
              <div className="flex items-center">
                <Bitcoin className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-white text-lg font-mono">{formatBtcAmount(totalMined)} BTC</span>
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                ≈ {formatCurrency(totalMined * bitcoinPrice)}
              </div>
            </div>
            
            <div className="bg-neutral-800 p-3 rounded-md">
              <div className="text-xs text-neutral-400 mb-1">Mining Sessions</div>
              <div className="text-white text-lg font-mono">
                {walletData?.confirmed?.length || 0}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {walletData?.confirmed ? 'From blockchain data' : 'No data available'}
              </div>
            </div>
            
            <div className="bg-neutral-800 p-3 rounded-md">
              <div className="text-xs text-neutral-400 mb-1">Average Profitability</div>
              <div className="text-white text-lg font-mono">
                {formatCurrency((totalMined * bitcoinPrice) / (walletData?.confirmed?.length || 1))} <span className="text-sm">/tx</span>
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Based on current BTC price: ${bitcoinPrice.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-800/50 border border-indigo-800/30 rounded-md p-4">
          <h3 className="text-sm font-medium text-white mb-3">Transaction History</h3>
          
          {updateLoading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No transactions found for this wallet
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {transactions.map(tx => (
                <div key={tx.id} className={`bg-neutral-800 p-3 rounded-md border-l-4 ${
                  tx.status === 'confirmed' ? 'border-green-500' : 'border-yellow-500'
                }`}>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <ArrowUpRight className="h-4 w-4 text-indigo-400 mr-2" />
                      <div>
                        <div className="text-sm text-white">
                          {tx.type === 'mining' ? 'Mining Reward Payment' : 'Transaction'}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {tx.timestamp instanceof Date ? formatDate(tx.timestamp) : formatDate(new Date(tx.timestamp))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm font-mono">
                        +{formatBtcAmount(tx.amount)} BTC
                      </div>
                      <div className="flex justify-end items-center">
                        <Badge 
                          className={`text-xs ${
                            tx.status === 'confirmed' 
                              ? 'bg-green-900/20 text-green-400 border-green-700/30' 
                              : 'bg-yellow-900/20 text-yellow-400 border-yellow-700/30'
                          }`}
                        >
                          {tx.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </Badge>
                        <div className="text-xs text-neutral-500 ml-2">
                          {tx.confirmations}/6
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-3 text-xs text-neutral-500 bg-neutral-800/50 rounded-md p-2 flex items-center justify-center">
            <Info className="h-3 w-3 mr-1" />
            <span>Transactions require 6 confirmations to be considered fully confirmed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}