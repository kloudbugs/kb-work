import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferNow, updatePayoutSettings } from '@/lib/miningClient';
import { formatBtc, formatUsd, shortenHash } from '@/lib/utils';
import { Clipboard, AlertTriangle, ArrowRightLeft, RefreshCw } from 'lucide-react';

interface WithdrawalFormProps {
  walletDetails: {
    user: {
      walletAddress: string;
      payoutThreshold: string | number;
      payoutSchedule: string;
      autoPayouts: boolean;
    };
    balance: number;
    balanceUSD: number;
    minimumBalance: number;
  };
  className?: string;
}

export function WithdrawalForm({ walletDetails, className }: WithdrawalFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [payoutThreshold, setPayoutThreshold] = useState(walletDetails.user.payoutThreshold.toString());
  const [payoutSchedule, setPayoutSchedule] = useState(walletDetails.user.payoutSchedule);
  const [autoPayouts, setAutoPayouts] = useState(walletDetails.user.autoPayouts);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  
  // Calculate the available withdrawal amount (balance - minimum balance)
  const availableForWithdrawal = Math.max(0, walletDetails.balance - walletDetails.minimumBalance);
  
  // Set default withdrawal amount to available amount
  useEffect(() => {
    console.log("Available for withdrawal updated:", availableForWithdrawal);
    setWithdrawalAmount(availableForWithdrawal);
    setCustomAmount(availableForWithdrawal.toFixed(8));
  }, [availableForWithdrawal]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletDetails.user.walletAddress)
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/payouts'] });
      
      // Check if there's a verification URL to view on blockchain explorer
      const verificationUrl = data?.verificationUrl;
      
      toast({
        title: "Bitcoin Withdrawal Initiated",
        description: (
          <div className="space-y-2">
            <p>Your withdrawal has been initiated on the Bitcoin network.</p>
            {verificationUrl && (
              <a 
                href={verificationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline block mt-1"
              >
                View transaction on blockchain explorer →
              </a>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Please wait for 6 confirmations (approximately 60 minutes) for the transaction to complete.
            </p>
          </div>
        ),
        duration: 10000, // Show for 10 seconds so user has time to click
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
  
  const updateSettingsMutation = useMutation({
    mutationFn: () => updatePayoutSettings({
      threshold: parseFloat(payoutThreshold),
      schedule: payoutSchedule,
      autoPayout: autoPayouts,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      toast({
        title: "Settings Updated",
        description: "Your payout settings have been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const handleWithdrawal = () => {
    // Use the custom amount if it's enabled, otherwise use the slider amount
    const amountToWithdraw = isCustomAmount 
      ? parseFloat(customAmount) 
      : withdrawalAmount;
      
    // Validate the amount
    if (isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }
    
    // Check if sufficient balance
    if (amountToWithdraw > availableForWithdrawal) {
      toast({
        title: "Insufficient Balance",
        description: `Maximum withdrawal amount is ${formatBtc(availableForWithdrawal)} BTC`,
        variant: "destructive",
      });
      return;
    }
    
    console.log(`Initiating withdrawal of ${amountToWithdraw} BTC`);
    
    // Initiate transfer (transferNow will convert BTC to satoshis)
    transferMutation.mutate({
      amount: amountToWithdraw,
      useLedger: false
    });
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
  };
  
  // Admin status is always true to ensure real withdrawal feature is permanently enabled
  const isAdmin = true; // Always enabled - permanent feature

  // Handle opening real withdrawal page
  const handleRealWithdrawal = () => {
    // We need to bypass the client-side router entirely
    const currentUrl = window.location.origin;
    // The _blank target ensures it opens in a new tab
    window.open(`${currentUrl}/real-withdrawal.html`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardDescription>Transfer your earnings to your Bitcoin wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="mb-4">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Wallet Address</span>
            <div className="mt-1 flex items-center">
              <div className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2 font-mono text-sm truncate flex-grow">
                {shortenHash(walletDetails.user.walletAddress, 16)}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={copyToClipboard} 
                className="ml-2"
              >
                <Clipboard className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Available Balance</span>
            <div className="mt-1 flex items-center space-x-2">
              <span className="text-2xl font-semibold font-mono">{formatBtc(walletDetails.balance)}</span>
              <span className="text-base font-medium">BTC</span>
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              ≈ {formatUsd(walletDetails.balanceUSD)}
            </div>
          </div>
        </div>
        
        {/* Withdrawal Amount Section */}
        <div className="mb-6 space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Withdrawal Amount</h4>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Custom Amount</span>
            <Switch 
              checked={isCustomAmount} 
              onCheckedChange={setIsCustomAmount}
              className={isCustomAmount ? "bg-primary" : ""}
            />
          </div>
          

          
          {isCustomAmount ? (
            <div>
              <div className="flex items-center space-x-2">
                <Input 
                  type="text" 
                  value={customAmount} 
                  onChange={handleCustomAmountChange}
                  className="bg-gray-100 dark:bg-gray-700 w-24" 
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">BTC</span>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomAmount(availableForWithdrawal.toFixed(8))}
                  className="ml-2"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Max
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Maximum: {formatBtc(availableForWithdrawal)} BTC
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">0 BTC</span>
                <span className="text-xs text-gray-500">{formatBtc(availableForWithdrawal)} BTC</span>
              </div>
              <Slider
                value={[withdrawalAmount]}
                max={availableForWithdrawal}
                step={0.0001}
                onValueChange={(values) => setWithdrawalAmount(values[0])}
              />
              <div className="flex justify-between">
                <span className="text-sm font-medium">Selected Amount</span>
                <span className="text-sm font-mono font-medium">{formatBtc(withdrawalAmount)} BTC</span>
              </div>
            </div>
          )}
          
          {availableForWithdrawal <= 0 && (
            <Alert className="bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>
                No funds available for withdrawal. Start mining to accumulate rewards.
              </AlertDescription>
            </Alert>
          )}
          
          {availableForWithdrawal > 0 && (
            <Alert className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700 mt-2">
              <AlertDescription>
                You can now withdraw your entire balance. Unmineable automatically pays out your mining rewards
                when you reach the 0.0005 BTC threshold.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* Payout Settings Section */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Automatic Payout Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Enable Auto-Payouts</span>
              <Switch 
                checked={autoPayouts} 
                onCheckedChange={setAutoPayouts}
                className={autoPayouts ? "bg-primary" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="threshold" className="text-sm text-gray-500 dark:text-gray-400">
                Payout Threshold (minimum BTC to trigger auto-payout)
              </Label>
              <div className="flex items-center">
                <Input 
                  id="threshold"
                  type="text" 
                  value={payoutThreshold} 
                  onChange={(e) => setPayoutThreshold(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 w-24" 
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">BTC</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="schedule" className="text-sm text-gray-500 dark:text-gray-400">
                Payout Schedule
              </Label>
              <Select value={payoutSchedule} onValueChange={setPayoutSchedule}>
                <SelectTrigger id="schedule" className="w-full bg-gray-100 dark:bg-gray-700">
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => updateSettingsMutation.mutate()}
              disabled={updateSettingsMutation.isPending}
              className="w-full"
            >
              {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
        
        {/* Withdrawal Button */}
        <Button 
          className="w-full"
          onClick={handleWithdrawal}
          disabled={transferMutation.isPending || availableForWithdrawal <= 0}
        >
          <ArrowRightLeft className="h-5 w-5 mr-2" />
          {transferMutation.isPending ? "Processing..." : "Withdraw Now"}
        </Button>
        
        {/* Real Withdrawal Button for Admin users */}
        {isAdmin && (
          <Button 
            className="w-full mt-4 bg-red-600 hover:bg-red-700"
            onClick={handleRealWithdrawal}
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Real Withdrawal
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default WithdrawalForm;