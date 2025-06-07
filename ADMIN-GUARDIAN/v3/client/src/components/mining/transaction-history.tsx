import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, Check, Clock, AlertCircle } from 'lucide-react';

interface Transaction {
  txid: string;
  amount: number;
  address: string;
  timestamp: string;
  confirmations: number;
  status: string;
  type: string;
}

const TransactionHistory = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Load transactions from local storage
    const storedTransactions = localStorage.getItem('btc_transactions');
    if (storedTransactions) {
      try {
        const parsed = JSON.parse(storedTransactions);
        setTransactions(parsed);
      } catch (error) {
        console.error("Error parsing stored transactions:", error);
      }
    }
    
    // Also load from server (if implemented)
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/wallet/transactions');
        if (response.ok) {
          const data = await response.json();
          // Merge with local transactions, avoiding duplicates by txid
          const localTxIds = new Set(transactions.map(tx => tx.txid));
          const serverTxs = data.filter((tx: Transaction) => !localTxIds.has(tx.txid));
          setTransactions(prev => [...prev, ...serverTxs]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
    
    // If no stored transactions, create some demo transactions for illustration
    if (!storedTransactions) {
      const demoTransactions = [
        {
          txid: 'tx-' + Date.now() + '-' + Math.floor(Math.random() * 1000000),
          amount: 0.00182248,
          address: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
          timestamp: new Date().toISOString(),
          confirmations: 3,
          status: 'confirmed',
          type: 'withdrawal'
        },
        {
          txid: 'tx-' + (Date.now() - 86400000) + '-' + Math.floor(Math.random() * 1000000),
          amount: 0.00123456,
          address: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          confirmations: 125,
          status: 'confirmed',
          type: 'withdrawal'
        },
        {
          txid: 'reward-' + (Date.now() - 172800000) + '-' + Math.floor(Math.random() * 1000000),
          amount: 0.00045678,
          address: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          confirmations: 246,
          status: 'confirmed',
          type: 'mining_reward'
        }
      ];
      
      setTransactions(demoTransactions);
      localStorage.setItem('btc_transactions', JSON.stringify(demoTransactions));
    }
  }, []);
  
  const filteredTransactions = activeTab === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === activeTab);
  
  const getTotalWithdrawn = () => {
    return transactions
      .filter(tx => tx.type === 'withdrawal' && tx.status === 'confirmed')
      .reduce((sum, tx) => sum + tx.amount, 0);
  };
  
  const getTotalRewarded = () => {
    return transactions
      .filter(tx => tx.type === 'mining_reward' && tx.status === 'confirmed')
      .reduce((sum, tx) => sum + tx.amount, 0);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const truncateTxid = (txid: string) => {
    if (txid.length <= 16) return txid;
    return txid.substring(0, 8) + '...' + txid.substring(txid.length - 8);
  };
  
  const getStatusIcon = (status: string, confirmations: number) => {
    if (status === 'confirmed') {
      return <Check className="h-4 w-4 text-green-500" />;
    } else if (status === 'pending') {
      return confirmations > 0 
        ? <Clock className="h-4 w-4 text-amber-500" /> 
        : <Clock className="h-4 w-4 text-slate-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };
  
  const getStatusText = (status: string, confirmations: number) => {
    if (status === 'confirmed') {
      return 'Confirmed';
    } else if (status === 'pending') {
      return confirmations > 0 
        ? `${confirmations} confirmation${confirmations > 1 ? 's' : ''}` 
        : 'Pending';
    } else {
      return 'Failed';
    }
  };
  
  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'withdrawal':
        return 'Withdrawal';
      case 'mining_reward':
        return 'Mining Reward';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  const openExplorer = (txid: string) => {
    window.open(`https://www.blockchain.com/explorer/transactions/btc/${txid}`, '_blank');
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Total Mining Rewards</h3>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {getTotalRewarded().toFixed(8)} BTC
                </div>
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                  All confirmed mining rewards
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">Total Withdrawals</h3>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {getTotalWithdrawn().toFixed(8)} BTC
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-500 mt-1">
                  All confirmed withdrawals
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
            <TabsTrigger value="mining_reward">Mining Rewards</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cosmic-blue"></div>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount (BTC)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((tx) => (
                        <TableRow key={tx.txid}>
                          <TableCell>{getTransactionTypeText(tx.type)}</TableCell>
                          <TableCell className="font-mono text-xs">{truncateTxid(tx.txid)}</TableCell>
                          <TableCell>{formatDate(tx.timestamp)}</TableCell>
                          <TableCell className="font-mono">{tx.amount.toFixed(8)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(tx.status, tx.confirmations)}
                              <span className="ml-2">{getStatusText(tx.status, tx.confirmations)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openExplorer(tx.txid)}
                              className="text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View on explorer</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transactions found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-xs text-muted-foreground">
          <p>
            Transactions are securely processed through the TERA Guardian system. 
            All withdrawals are sent to your specified Bitcoin wallet address: bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;