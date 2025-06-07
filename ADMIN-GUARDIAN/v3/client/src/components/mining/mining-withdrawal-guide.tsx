import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import {
  Bitcoin,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Wallet,
  ArrowUpRight
} from 'lucide-react';

interface WithdrawalTransaction {
  id: string;
  txid: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  destination: string;
  created: number;
  completed?: number;
  confirmations?: number;
}

export default function MiningWithdrawalGuide() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('0.0005');
  const [walletAddress, setWalletAddress] = useState<string>('bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6');
  const [pendingTx, setPendingTx] = useState<WithdrawalTransaction | null>(null);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalTransaction[]>([
    {
      id: 'tx-1684512345-12345',
      txid: '48a72e4583bc92bf43f68e56af81ba415241e94c5b3f97dfa2008c9c92bacd14',
      amount: 0.00123456,
      status: 'confirmed',
      destination: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
      created: Date.now() - 86400000, // Yesterday
      completed: Date.now() - 86000000,
      confirmations: 6
    }
  ]);
  const [btcPrice, setBtcPrice] = useState<number>(58500);
  const { toast } = useToast();
  
  // Request withdrawal
  const requestWithdrawal = async () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid Bitcoin amount greater than 0.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!walletAddress || walletAddress.trim() === '') {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid Bitcoin wallet address.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Call API to request withdrawal
      const response = await apiRequest({
        url: '/api/withdrawals/request',
        method: 'POST',
        data: {
          amount: parseFloat(withdrawalAmount),
          address: walletAddress
        }
      });
      
      // Handle successful response
      if (response.success) {
        // Create a pending transaction
        const newTx: WithdrawalTransaction = {
          id: response.withdrawal.id,
          txid: response.blockchain_txid,
          amount: parseFloat(withdrawalAmount),
          status: 'pending',
          destination: walletAddress,
          created: Date.now()
        };
        
        // Update state
        setPendingTx(newTx);
        setWithdrawalHistory([newTx, ...withdrawalHistory]);
        
        toast({
          title: 'Withdrawal Request Submitted',
          description: `Your withdrawal of ${withdrawalAmount} BTC has been initiated.`,
          variant: 'default'
        });
      } else {
        throw new Error(response.message || 'Failed to create withdrawal');
      }
    } catch (error) {
      console.error('Withdrawal request failed:', error);
      toast({
        title: 'Withdrawal Failed',
        description: 'There was an error processing your withdrawal request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify transaction with TERA Guardian
  const verifyTransaction = async (txid: string) => {
    setIsLoading(true);
    try {
      // Find the transaction
      const tx = pendingTx || withdrawalHistory.find(t => t.txid === txid);
      
      if (!tx) {
        throw new Error('Transaction not found');
      }
      
      // Call API to verify transaction
      const response = await apiRequest({
        url: '/api/guardian/verify-withdrawal',
        method: 'POST',
        data: {
          txid: tx.txid,
          amount: tx.amount,
          address: tx.destination
        }
      });
      
      // Handle successful response
      if (response.verified) {
        // Update UI to show verified status
        toast({
          title: 'Transaction Verified',
          description: 'TERA Guardian has verified the transaction.',
          variant: 'default'
        });
        
        // Process the withdrawal
        await processWithdrawal(tx.txid);
      } else {
        throw new Error(response.message || 'Transaction verification failed');
      }
    } catch (error) {
      console.error('Transaction verification failed:', error);
      toast({
        title: 'Verification Failed',
        description: 'There was an error verifying the transaction. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Process the withdrawal 
  const processWithdrawal = async (txid: string) => {
    setIsLoading(true);
    try {
      // Find the transaction
      const tx = pendingTx || withdrawalHistory.find(t => t.txid === txid);
      
      if (!tx) {
        throw new Error('Transaction not found');
      }
      
      // Call API to process withdrawal
      const response = await apiRequest({
        url: '/api/guardian/process-withdrawal',
        method: 'POST',
        data: {
          txid: tx.txid,
          amount: tx.amount,
          address: tx.destination
        }
      });
      
      // Handle successful response
      if (response.success) {
        // Update the transaction status
        const updatedTx: WithdrawalTransaction = {
          ...tx,
          status: 'confirmed',
          completed: Date.now(),
          confirmations: 1
        };
        
        // Update state
        setPendingTx(null);
        setWithdrawalHistory(withdrawalHistory.map(t => t.txid === txid ? updatedTx : t));
        
        toast({
          title: 'Withdrawal Processed',
          description: `Your withdrawal of ${tx.amount} BTC has been processed successfully.`,
          variant: 'default'
        });
      } else {
        throw new Error(response.message || 'Failed to process withdrawal');
      }
    } catch (error) {
      console.error('Withdrawal processing failed:', error);
      toast({
        title: 'Processing Failed',
        description: 'There was an error processing the withdrawal. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancel a pending transaction
  const cancelTransaction = (txid: string) => {
    // Find the transaction
    const tx = pendingTx || withdrawalHistory.find(t => t.txid === txid && t.status === 'pending');
    
    if (!tx) {
      toast({
        title: 'Transaction Not Found',
        description: 'The transaction could not be found or is not in a pending state.',
        variant: 'destructive'
      });
      return;
    }
    
    // Update the transaction status
    const updatedTx: WithdrawalTransaction = {
      ...tx,
      status: 'failed'
    };
    
    // Update state
    setPendingTx(null);
    setWithdrawalHistory(withdrawalHistory.map(t => t.txid === txid ? updatedTx : t));
    
    toast({
      title: 'Transaction Cancelled',
      description: 'The withdrawal request has been cancelled.',
      variant: 'default'
    });
  };
  
  // Format a date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Get transaction status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <div className="flex items-center text-green-500">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            <span>Confirmed</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-amber-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Pending</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center text-red-500">
            <XCircle className="h-4 w-4 mr-1" />
            <span>Failed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-500">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Unknown</span>
          </div>
        );
    }
  };
  
  // View transaction in a block explorer
  const viewInExplorer = (txid: string) => {
    window.open(`https://www.blockchain.com/explorer/transactions/btc/${txid}`, '_blank');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Mining Rewards Withdrawal</CardTitle>
          <CardDescription>
            Withdraw your mining rewards directly to your Bitcoin wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div>
              <div className="text-sm text-muted-foreground">Available Balance</div>
              <div className="text-2xl font-bold mt-1">0.00084532 BTC</div>
              <div className="text-sm text-muted-foreground mt-1">≈ ${(0.00084532 * btcPrice).toFixed(2)}</div>
            </div>
            <Wallet className="h-8 w-8 text-cyber-gold opacity-80" />
          </div>
          
          {pendingTx && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <div className="font-medium">Pending Withdrawal</div>
                  <p className="text-sm mt-1">
                    You have a pending withdrawal of <span className="font-medium">{pendingTx.amount} BTC</span> to {pendingTx.destination.substring(0, 10)}...{pendingTx.destination.substring(pendingTx.destination.length - 5)}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => verifyTransaction(pendingTx.txid)}
                      disabled={isLoading}
                      className="h-8"
                    >
                      Verify & Process
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => cancelTransaction(pendingTx.txid)}
                      disabled={isLoading}
                      className="h-8 text-red-500 hover:text-red-500"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Withdrawal Amount (BTC)</Label>
                <Input
                  id="amount"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="0.0005"
                  disabled={isLoading || !!pendingTx}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum withdrawal: 0.0001 BTC (≈ ${(0.0001 * btcPrice).toFixed(2)})
                </p>
              </div>
              
              <div>
                <Label htmlFor="wallet">Bitcoin Wallet Address</Label>
                <Input
                  id="wallet"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Your Bitcoin wallet address"
                  disabled={isLoading || !!pendingTx}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ensure this is a valid Bitcoin address you control
                </p>
              </div>
              
              <Button
                onClick={requestWithdrawal}
                disabled={isLoading || !!pendingTx}
                className="w-full bg-cyber-gold hover:bg-cyber-gold/80 text-dark-matter"
              >
                <Bitcoin className="h-4 w-4 mr-2" />
                Request Withdrawal
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm font-medium">Withdrawal Process</div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex h-6 w-6 rounded-full bg-zinc-800 items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs">1</span>
                  </div>
                  <div>
                    <div className="font-medium">Request Withdrawal</div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Enter the amount and destination wallet address
                    </p>
                  </div>
                </div>
                
                <div className="ml-3 h-6 border-l border-zinc-800 pl-6">
                  <ArrowRight className="h-4 w-4 text-zinc-500" />
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-6 w-6 rounded-full bg-zinc-800 items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs">2</span>
                  </div>
                  <div>
                    <div className="font-medium">TERA Guardian Verification</div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Our AI security system verifies the transaction
                    </p>
                  </div>
                </div>
                
                <div className="ml-3 h-6 border-l border-zinc-800 pl-6">
                  <ArrowRight className="h-4 w-4 text-zinc-500" />
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-6 w-6 rounded-full bg-zinc-800 items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs">3</span>
                  </div>
                  <div>
                    <div className="font-medium">Blockchain Execution</div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Funds are sent to your wallet on the Bitcoin blockchain
                    </p>
                  </div>
                </div>
                
                <div className="ml-3 h-6 border-l border-zinc-800 pl-6">
                  <ArrowRight className="h-4 w-4 text-zinc-500" />
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-6 w-6 rounded-full bg-zinc-800 items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs">4</span>
                  </div>
                  <div>
                    <div className="font-medium">Transaction Confirmation</div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Transaction is confirmed on the blockchain
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>
            Recent transactions to your Bitcoin wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawalHistory.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No withdrawal history found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawalHistory.map((tx) => (
                <div key={tx.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{tx.amount} BTC</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        To: {tx.destination.substring(0, 10)}...{tx.destination.substring(tx.destination.length - 5)}
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(tx.status)}
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(tx.created)}
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-mono text-muted-foreground overflow-hidden text-ellipsis">
                      TxID: {tx.txid.substring(0, 20)}...
                    </div>
                    <div className="flex items-center space-x-2">
                      {tx.status === 'pending' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => verifyTransaction(tx.txid)}
                          disabled={isLoading}
                          className="h-7 px-2"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Verify
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => viewInExplorer(tx.txid)}
                        className="h-7 px-2"
                      >
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        View on Blockchain
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}