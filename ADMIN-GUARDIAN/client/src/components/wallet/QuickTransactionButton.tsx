import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Send } from 'lucide-react';

export function QuickTransactionButton() {
  const [open, setOpen] = useState(false);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const handleTransfer = async () => {
    // Validate input
    if (!destinationAddress || !amount) {
      toast({
        title: "Validation Error",
        description: "Please enter both a destination address and amount",
        variant: "destructive",
      });
      return;
    }
    
    // Convert amount to satoshis (assuming input is in BTC)
    const satoshis = Math.floor(parseFloat(amount) * 100000000);
    
    if (isNaN(satoshis) || satoshis <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    // Start transaction process
    setLoading(true);
    
    try {
      // Call the secure transaction signer API
      const response = await apiRequest("POST", "/api/wallet/send-bitcoin", {
        amount: satoshis,
        destinationAddress
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Transaction failed");
      }
      
      const result = await response.json();
      
      // Show success message
      toast({
        title: "Transaction Initiated",
        description: `Transaction ${result.txid.substring(0, 8)}... has been broadcast to the network`,
      });
      
      // Close dialog and reset form
      setOpen(false);
      setDestinationAddress('');
      setAmount('');
      
      // Show blockchain explorer link
      setTimeout(() => {
        toast({
          title: "View Transaction",
          description: (
            <div>
              <p>Your transaction is being processed.</p>
              <a 
                href={`https://blockchair.com/bitcoin/transaction/${result.txid}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View on Block Explorer
              </a>
            </div>
          ),
          duration: 15000, // Show for 15 seconds
        });
      }, 1000);
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to send Bitcoin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Only show for admin
  if (!user || user.role !== 'ADMIN') {
    return null;
  }
  
  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className="bg-yellow-500 hover:bg-yellow-600 text-white"
        size="sm"
      >
        <Send className="w-4 h-4 mr-2" />
        Quick Transaction
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Bitcoin Transaction</DialogTitle>
            <DialogDescription>
              Create and sign a secure Bitcoin transaction using your hardware wallet.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destination" className="text-right">
                Destination
              </Label>
              <Input
                id="destination"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder="bc1q..."
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount (BTC)
              </Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.001"
                type="number"
                step="0.00000001"
                min="0.00000001"
                className="col-span-3"
              />
            </div>
            
            <div className="text-sm text-gray-500 italic col-span-4 mt-2">
              Transaction will be signed and broadcast from your hardware wallet address: 
              <span className="font-mono text-xs block mt-1 break-all">
                {user?.hardwareWalletAddress || 'bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps'}
              </span>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleTransfer}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Send Transaction</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}