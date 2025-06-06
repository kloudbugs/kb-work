import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDownRight, ExternalLink, Filter, ChevronDown, Check, RefreshCw, Code, Info } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { formatBtc, formatDate, shortenHash } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

// This interface must match both the server-side Payout model in schema.ts
// and the client-side Payout interface in Wallet.tsx
interface Payout {
  id: number;
  userId?: number;
  timestamp: string | Date;
  amount: string | number;
  txHash: string | null; // Must match server field name
  status: string;
  walletAddress: string;
  sourceAddress?: string;
  destinationAddress?: string;
  estimatedCompletionTime?: string | Date;
}

interface WithdrawalHistoryProps {
  payouts: Payout[];
  isLoading: boolean;
}

export function WithdrawalHistory({ payouts, isLoading }: WithdrawalHistoryProps) {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const [selectedTxHash, setSelectedTxHash] = useState<string | null>(null);
  
  // Function to generate Blockchair verification URL for any transaction
  const getVerificationUrl = (txHash: string | null): string | null => {
    if (!txHash) return null;
    
    // Check if txHash appears to be a real Bitcoin transaction ID (64 hex characters)
    if (txHash.length === 64 && /^[0-9a-f]+$/i.test(txHash)) {
      return `https://blockchair.com/bitcoin/transaction/${txHash}`;
    }
    
    // For test/compensation transactions, still provide a link even if not a real txid
    return `https://blockchair.com/search?q=${txHash}`;
  };
  
  // Function to generate Blockchair API debug link
  const getBlockchairDebugUrl = (txHash: string | null): string | null => {
    if (!txHash) return null;
    return `https://api.blockchair.com/bitcoin/dashboards/transaction/${txHash}`;
  };
  
  const filteredPayouts = payouts.filter(payout => 
    statusFilter.length === 0 || statusFilter.includes(payout.status)
  );
  
  const handleStatusFilterChange = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter(s => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };
  
  // Function to simulate completing a transaction (for testing)
  const completeTransaction = async (id: number) => {
    try {
      setCompletingId(id);
      const response = await apiRequest('POST', `/api/payouts/${id}/complete`);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Transaction completed",
          description: "The transaction has been confirmed on the blockchain",
          variant: "default",
        });
        
        // Invalidate the payouts query to refresh the data
        queryClient.invalidateQueries(['/api/payouts']);
      } else {
        toast({
          title: "Error completing transaction",
          description: data.message || "Failed to complete the transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error completing transaction:', error);
      toast({
        title: "Error completing transaction",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setCompletingId(null);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>Track your BTC transfers to external wallet</CardDescription>
          </div>
          
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Code className="h-4 w-4 mr-2" />
                  View Code
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Transaction Creation Code</DialogTitle>
                  <DialogDescription>
                    This is the actual code that creates and processes Bitcoin transactions
                  </DialogDescription>
                </DialogHeader>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[500px] font-mono text-sm">
                  <pre>
{`// FROM server/routes.ts
app.post("/api/wallet/transfer", async (req: Request, res: Response) => {
  try {
    if (!req.session?.userId) {
      console.log('POST /api/wallet/transfer: Not authenticated');
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    console.log(\`POST /api/wallet/transfer: Processing request for user ID \${req.session.userId}\`);
    
    const { amount, useLedger } = req.body;
    console.log(\`POST /api/wallet/transfer: Requested amount: \${amount}, useLedger: \${useLedger}\`);
    
    // Ensure amount is a number - Convert from BTC to satoshis if needed
    let numericAmount: number;
    if (typeof amount === 'string' && amount.includes('.')) {
      // Looks like BTC format (e.g., "0.0005") - convert to satoshis
      numericAmount = Math.floor(parseFloat(amount) * 100000000);
      console.log(\`POST /api/wallet/transfer: Converted BTC amount \${amount} to \${numericAmount} satoshis\`);
    } else {
      // Assume it's already in satoshis
      numericAmount = parseInt(amount);
      console.log(\`POST /api/wallet/transfer: Parsed amount as \${numericAmount} satoshis\`);
    }
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.log(\`POST /api/wallet/transfer: Invalid amount \${numericAmount}\`);
      return res.status(400).json({ message: "Amount must be a positive number" });
    }
    
    // Get user details to ensure we have the right wallet address
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      console.log(\`POST /api/wallet/transfer: User not found for ID \${req.session.userId}\`);
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    // Import the real withdrawal service for actual Bitcoin transactions
    const { processWithdrawal } = await import('./lib/realWithdrawalService');
    
    // Process a withdrawal via Bitcoin network, with optional Ledger support
    const result = await processWithdrawal(
      req.session.userId,
      numericAmount,
      user.walletAddress,
      !!useLedger // Convert to boolean
    );
    
    if (result.success) {
      console.log(\`POST /api/wallet/transfer: Real Bitcoin withdrawal request successful\`);
      
      // Verify the payout was saved by checking the database
      const payouts = await storage.getPayouts(req.session.userId);
      
      const responseData = {
        success: true,
        message: "Real Bitcoin withdrawal initiated successfully",
        txid: result.txHash,
        amount: numericAmount,
        sourceAddress: result.sourceAddress || "bc1qn3ny92uk8pkrvdz3hp7bc6up62xa5ee98fqfcl", // Pool address
        destinationAddress: user.walletAddress, // User wallet address
        walletAddress: user.walletAddress, // For compatibility with existing code
        estimatedCompletionTime: result.estimatedCompletionTime?.toISOString(),
        verificationUrl: result.txHash ? \`https://blockchair.com/bitcoin/transaction/\${result.txHash}\` : undefined,
        network: 'bitcoin',
        blockchainInfo: {
          network: 'bitcoin',
          confirmationsRequired: 1, // Reduced confirmations for faster transactions
          expectedTimePerBlock: '10 minutes'
        }
      };
      
      return res.status(200).json(responseData);
    } else {
      console.log(\`POST /api/wallet/transfer: Bitcoin withdrawal failed: \${result.message}\`);
      return res.status(400).json({ 
        success: false,
        message: result.message || "Bitcoin withdrawal failed. Please check your balance and try again."
      });
    }
  } catch (error) {
    console.error('Error processing payout:', error);
    return res.status(500).json({ 
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    });
  }
});`}
                  </pre>
                </div>
                <DialogFooter>
                  <Button variant="secondary">
                    <Info className="h-4 w-4 mr-2" />
                    See documentation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('completed')}
                  onCheckedChange={() => handleStatusFilterChange('completed')}
                >
                  Completed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('pending')}
                  onCheckedChange={() => handleStatusFilterChange('pending')}
                >
                  Pending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('failed')}
                  onCheckedChange={() => handleStatusFilterChange('failed')}
                >
                  Failed
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6 text-gray-500">
            Loading withdrawal history...
          </div>
        ) : filteredPayouts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ArrowDownRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No withdrawals yet</h3>
            <p className="text-sm max-w-md mx-auto">
              When you transfer funds to your external wallet,
              your withdrawal records will appear here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Est. Completion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>
                    {formatDate(payout.timestamp)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {typeof payout.amount === 'string' 
                      ? formatBtc(parseFloat(payout.amount), true) 
                      : formatBtc(payout.amount, true)} BTC
                  </TableCell>
                  <TableCell className="font-mono">
                    {payout.txHash ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={getVerificationUrl(payout.txHash) || "#"}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 hover:underline flex items-center"
                              onClick={() => setSelectedTxHash(payout.txHash)}
                            >
                              {shortenHash(payout.txHash, 8)}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View transaction on Blockchair</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {payout.sourceAddress ? (
                      shortenHash(payout.sourceAddress, 6)
                    ) : (
                      <span className="text-gray-500">Pool</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {payout.status === 'completed' && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                    {payout.status === 'pending' && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Pending
                      </Badge>
                    )}
                    {payout.status === 'failed' && (
                      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800">
                        Failed
                      </Badge>
                    )}
                    {!['completed', 'pending', 'failed'].includes(payout.status) && (
                      <Badge variant="outline">{payout.status}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {payout.status === 'pending' && payout.estimatedCompletionTime ? (
                      formatDate(payout.estimatedCompletionTime)
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {/* Developer Tools - Hidden in Production */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium mb-2">Developer Tools</h4>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  // Find a pending transaction
                  const pendingTx = payouts.find(p => p.status === 'pending');
                  if (pendingTx) {
                    completeTransaction(pendingTx.id);
                  } else {
                    toast({
                      title: "No pending transactions",
                      description: "There are no pending transactions to complete",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={completingId !== null || !payouts.some(p => p.status === 'pending')}
              >
                {completingId !== null ? 'Completing...' : 'Complete Pending Transaction'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}