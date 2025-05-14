import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { withdrawRequest } from '@/lib/miningClient';
import { formatBtc, formatUsd } from '@/lib/utils';
import { SendIcon, Loader2, CheckCircle2, Info } from 'lucide-react';

interface SimplifiedWalletCardProps {
  walletDetails: {
    balance: string;
    balanceUSD: string;
    pendingBalance?: string;
    pendingBalanceUSD?: string;
    totalPaid?: string;
    lastPayout?: string | null;
  };
  className?: string;
}

export function SimplifiedWalletCard({ walletDetails, className }: SimplifiedWalletCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Calculate the available withdrawal amount
  const availableBalance = parseFloat(walletDetails.balance);
  const minimumWithdrawal = 0.0005; // 50,000 satoshis minimum withdrawal
  
  const isWithdrawalEnabled = availableBalance >= minimumWithdrawal;
  
  const resetForm = () => {
    setWithdrawalAmount('');
    setDestinationAddress('');
    setIsSubmitted(false);
  };
  
  const withdrawMutation = useMutation({
    mutationFn: (data: { amount: number; address: string }) => 
      withdrawRequest(data.amount, data.address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      setIsSubmitted(true);
      
      // Don't close the dialog immediately, show success state first
      setTimeout(() => {
        setIsWithdrawDialogOpen(false);
        resetForm();
        
        // Show toast after dialog is closed
        toast({
          title: "Withdrawal Request Submitted",
          description: "Your withdrawal request has been sent to the admin for processing",
        });
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Withdrawal Failed",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const handleWithdrawal = () => {
    // Validate input
    if (!destinationAddress) {
      toast({
        title: "Missing Address",
        description: "Please enter your Bitcoin wallet address",
        variant: "destructive",
      });
      return;
    }
    
    const amount = withdrawalAmount === '' || withdrawalAmount === 'max' 
      ? availableBalance 
      : parseFloat(withdrawalAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }
    
    if (amount < minimumWithdrawal) {
      toast({
        title: "Amount Too Small",
        description: `Minimum withdrawal amount is ${minimumWithdrawal} BTC`,
        variant: "destructive",
      });
      return;
    }
    
    if (amount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `Maximum withdrawal amount is ${formatBtc(availableBalance)} BTC`,
        variant: "destructive",
      });
      return;
    }
    
    // Submit withdrawal request
    withdrawMutation.mutate({ 
      amount: amount,
      address: destinationAddress
    });
  };
  
  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle>Mining Balance</CardTitle>
          <CardDescription>Your Blockchain mining rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Available Balance</span>
            <div className="mt-1 flex items-center space-x-2">
              <span className="text-3xl font-semibold font-mono">{formatBtc(walletDetails.balance)}</span>
              <span className="text-base font-medium">BTC</span>
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              ≈ {formatUsd(walletDetails.balanceUSD)}
            </div>
          </div>
          
          {walletDetails.pendingBalance && parseFloat(walletDetails.pendingBalance) > 0 && (
            <div className="mb-6">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pending Balance</span>
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-xl font-semibold font-mono">{formatBtc(walletDetails.pendingBalance)}</span>
                <span className="text-sm font-medium">BTC</span>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                ≈ {formatUsd(walletDetails.pendingBalanceUSD || "0")}
              </div>
            </div>
          )}
          
          {walletDetails.totalPaid && parseFloat(walletDetails.totalPaid) > 0 && (
            <div className="mb-6">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Paid</span>
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-xl font-semibold font-mono">{formatBtc(walletDetails.totalPaid)}</span>
                <span className="text-sm font-medium">BTC</span>
              </div>
              {walletDetails.lastPayout && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Last payout: {new Date(walletDetails.lastPayout).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={() => setIsWithdrawDialogOpen(true)}
            disabled={!isWithdrawalEnabled}
          >
            <SendIcon className="h-5 w-5 mr-2" />
            Withdraw Funds
          </Button>
        </CardFooter>
        {!isWithdrawalEnabled && (
          <div className="px-6 pb-4">
            <p className="text-xs text-gray-500 text-center">
              Minimum withdrawal: {formatBtc(minimumWithdrawal)} BTC
            </p>
          </div>
        )}
      </Card>

      <Dialog open={isWithdrawDialogOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsWithdrawDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isSubmitted ? "Withdrawal Request Submitted" : "Withdraw Mining Rewards"}
            </DialogTitle>
            <DialogDescription>
              {isSubmitted 
                ? "Your request has been sent to the admin for processing" 
                : "Enter your Bitcoin address to receive your mining rewards"}
            </DialogDescription>
          </DialogHeader>

          {isSubmitted ? (
            <div className="flex flex-col items-center py-6">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                Your withdrawal request has been submitted successfully
              </p>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                The admin will process your request and send the funds to your Bitcoin address
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="destination" className="text-right">
                    BTC Address
                  </Label>
                  <Input
                    id="destination"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    placeholder="Enter your Bitcoin address"
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount (BTC)
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="amount"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      placeholder={`${availableBalance.toFixed(8)}`}
                      className="flex-grow"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setWithdrawalAmount('max')}
                    >
                      Max
                    </Button>
                  </div>
                </div>
                
                <div className="col-span-4 flex items-start gap-2 mt-2">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-500">
                    <p className="mb-1">
                      All withdrawal requests are processed manually by the admin.
                    </p>
                    <p>
                      Available balance: <span className="font-semibold">{formatBtc(availableBalance)} BTC</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsWithdrawDialogOpen(false)}
                  disabled={withdrawMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleWithdrawal}
                  disabled={withdrawMutation.isPending}
                >
                  {withdrawMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}