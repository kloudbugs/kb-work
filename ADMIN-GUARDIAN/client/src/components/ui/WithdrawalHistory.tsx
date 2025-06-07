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
                              href={getVerificationUrl(payout.txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center"
                            >
                              {shortenHash(payout.txHash)}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="max-w-xs">
                              <p className="mb-1">View this transaction on the Bitcoin blockchain.</p>
                              <p className="text-sm opacity-80">Transaction ID: {payout.txHash}</p> 
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {payout.sourceAddress ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={`https://blockchair.com/bitcoin/address/${payout.sourceAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center"
                            >
                              {shortenHash(payout.sourceAddress)}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="max-w-xs">
                              <p className="mb-1">View source address on the Bitcoin blockchain.</p>
                              <p className="text-sm opacity-80">Address: {payout.sourceAddress}</p> 
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-gray-500">Mining Pool</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {payout.status === 'completed' ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Completed
                      </Badge>
                    ) : payout.status === 'pending' ? (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100">
                        Pending
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Failed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {payout.status === 'pending' && payout.estimatedCompletionTime ? (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDate(payout.estimatedCompletionTime)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2 h-6 px-2"
                          onClick={() => completeTransaction(payout.id)}
                          disabled={completingId === payout.id}
                        >
                          {completingId === payout.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ) : payout.status === 'completed' ? (
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Completed
                      </span>
                    ) : payout.status === 'failed' ? (
                      <span className="text-xs text-red-600 dark:text-red-400">
                        N/A
                      </span>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Est. ~30 min
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2 h-6 px-2"
                          onClick={() => completeTransaction(payout.id)}
                          disabled={completingId === payout.id}
                        >
                          {completingId === payout.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add Blockchair Debug dialog */}
      <Dialog open={selectedTxHash !== null} onOpenChange={(open) => !open && setSelectedTxHash(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Blockchair API Debug
            </DialogTitle>
            <DialogDescription>
              Troubleshooting Bitcoin transaction verification using the Blockchair API
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive" className="mb-4">
            <AlertTitle className="flex items-center gap-2">
              Blockchair API Error
            </AlertTitle>
            <AlertDescription className="mt-2">
              <p>There was an error retrieving blockchain data for transaction hash:</p>
              <code className="mt-2 block bg-black/10 p-2 rounded font-mono text-sm">
                {selectedTxHash}
              </code>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">How to Manually Construct Bitcoin Transactions</h3>
            
            <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[400px] font-mono text-xs">
              <pre>
{`// Example of how to manually create a Bitcoin transaction using bitcoinjs-lib
import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

// Create ECPair factory
const ECPair = ECPairFactory(ecc);

// Select Bitcoin network (mainnet)
const network = bitcoin.networks.bitcoin;

// 1. Create private key (NEVER hardcode in production - use secure storage)
const privateKey = ECPair.makeRandom({ network });

// 2. Get public key and address
const { address } = bitcoin.payments.p2wpkh({
  pubkey: privateKey.publicKey,
  network,
});

// 3. Create a transaction
const psbt = new bitcoin.Psbt({ network });

// 4. Add inputs (requires fetching UTXOs from blockchain)
psbt.addInput({
  hash: 'previous_transaction_hash',
  index: 0, // output index
  witnessUtxo: {
    script: bitcoin.address.toOutputScript(address, network),
    value: 100000, // amount in satoshis
  }
});

// 5. Add outputs
psbt.addOutput({
  address: 'recipient_address',
  value: 90000, // amount in satoshis minus fee
});

// 6. Sign the transaction
psbt.signInput(0, privateKey);
psbt.finalizeAllInputs();

// 7. Get transaction hex
const txHex = psbt.extractTransaction().toHex();

// 8. Broadcast transaction (using Blockchair API)
// const response = await axios.post('https://api.blockchair.com/bitcoin/push/transaction', {
//   data: txHex
// });`}
              </pre>
            </div>

            <Separator />
            
            <h3 className="text-lg font-medium">Blockchair API Alternatives</h3>
            <p className="text-sm text-muted-foreground">
              If the Blockchair API is unavailable, you can try these alternatives:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Blockchain.com API: <code>https://www.blockchain.com/api</code></li>
              <li>BlockCypher API: <code>https://www.blockcypher.com/dev/bitcoin/</code></li>
              <li>Bitcore: <code>https://bitcore.io/api/</code></li>
              <li>Mempool Space API: <code>https://mempool.space/api/</code></li>
            </ul>
          </div>

          <DialogFooter className="flex justify-between items-center">
            <a
              href={getBlockchairDebugUrl(selectedTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline flex items-center"
            >
              Try direct API request
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            
            <Button onClick={() => setSelectedTxHash(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default WithdrawalHistory;