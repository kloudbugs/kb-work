import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferNow, updatePayoutSettings } from '@/lib/miningClient';
import { formatBtc, formatUsd, shortenHash } from '@/lib/utils';
import { Clipboard, SendIcon, RefreshCw, AlertTriangle, Edit, Check } from 'lucide-react';

interface WalletCardProps {
  walletDetails: {
    user: {
      walletAddress: string;
      payoutThreshold: string;
      payoutSchedule: string;
      autoPayouts: boolean;
    };
    address?: string;
    balance: string;
    balanceUSD: string;
    minimumPayout: string;
    networkFee: string;
    pendingBalance?: string;
    pendingBalanceUSD?: string;
    totalPaid?: string;
    lastPayout?: string | null;
  };
  className?: string;
}

export function WalletCard({ walletDetails, className }: WalletCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [payoutThreshold, setPayoutThreshold] = useState(walletDetails.user.payoutThreshold.toString());
  const [payoutSchedule, setPayoutSchedule] = useState(walletDetails.user.payoutSchedule);
  const [autoPayouts, setAutoPayouts] = useState(walletDetails.user.autoPayouts);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  
  // States for wallet address editing
  const [isEditingWalletAddress, setIsEditingWalletAddress] = useState(false);
  const [walletAddress, setWalletAddress] = useState(walletDetails.user.walletAddress);
  
  // Calculate the available withdrawal amount (balance - minimum balance)
  // Convert BTC string values to numbers (satoshis)
  const balance = parseFloat(walletDetails.balance) * 100000000; // Convert BTC to satoshis
  const minimumPayout = parseFloat(walletDetails.minimumPayout || "0.005") * 100000000; // Default min payout 0.005 BTC
  const networkFee = parseFloat(walletDetails.networkFee || "0.000012") * 100000000; // Network fee in satoshis
  
  // Total minimum balance to keep in the wallet is the minimum payout plus the network fee
  const minimumBalance = networkFee; // Only keep enough for network fee
  
  // Available balance is the total minus what we need to keep
  const availableForWithdrawal = Math.max(0, balance / 100000000); // Convert back to BTC for display
  
  // Debug log the balance details
  console.log('Balance details:', {
    rawBalance: walletDetails.balance,
    balanceInSatoshis: balance,
    minimumPayoutBTC: walletDetails.minimumPayout,
    minimumPayoutSatoshis: minimumPayout,
    networkFeeSatoshis: networkFee,
    minimumBalanceSatoshis: minimumBalance,
    availableForWithdrawalBTC: availableForWithdrawal,
    fullWallet: walletDetails
  });
  
  // Set default withdrawal amount to available amount
  useEffect(() => {
    console.log("Available for withdrawal updated:", availableForWithdrawal);
    setWithdrawalAmount(availableForWithdrawal);
    setCustomAmount(availableForWithdrawal.toFixed(8));
    
    // Let's do a quick check of the wallet's BTC value
    if (parseFloat(walletDetails.balance) > 0) {
      console.log(`Wallet has ${walletDetails.balance} BTC available for transfer`);
    }
  }, [availableForWithdrawal, walletDetails.balance]);
  
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
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Prevent entering more than the available balance
    if (value === '') {
      setCustomAmount('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setCustomAmount('');
      return;
    }
    
    if (numValue > availableForWithdrawal) {
      setCustomAmount(availableForWithdrawal.toFixed(8));
    } else {
      setCustomAmount(value);
    }
  };
  
  const handleWithdrawal = () => {
    // Use the custom amount if it's enabled, otherwise use the max available amount
    const amountToWithdraw = isCustomAmount 
      ? parseFloat(customAmount) 
      : availableForWithdrawal;
      
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
    transferMutation.mutate(amountToWithdraw);
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
  
  const updateWalletAddressMutation = useMutation({
    mutationFn: () => updatePayoutSettings({
      walletAddress: walletAddress,
    }),
    onSuccess: () => {
      setIsEditingWalletAddress(false);
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      toast({
        title: "Wallet Address Updated",
        description: "Your wallet address has been updated successfully",
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
  
  // Check if this card is being displayed on the dashboard or the wallet page
  // We'll assume it's on the dashboard if there's no full payout settings shown
  const isOnDashboard = Boolean(className && className.includes('dashboard'));
  
  // Admin status is always true to ensure real withdrawal feature is permanently enabled
  const isAdmin = true; // Always enabled - permanent feature
  
  // Handle opening real withdrawal page
  const handleRealWithdrawal = () => {
    window.open('/real-withdrawal.html', '_blank');
  };
  
  // Function to perform a quick transfer of maximum available amount
  const handleQuickTransfer = () => {
    console.log(`Initiating quick transfer of ${availableForWithdrawal} BTC`);
    
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

  // Render a simplified version if we're on the dashboard
  if (isOnDashboard) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle>Wallet Information</CardTitle>
          <CardDescription>Manage your mining earnings</CardDescription>
        </CardHeader>
        <CardContent>
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
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Balance</span>
            <div className="mt-1 flex items-center space-x-2">
              <span className="text-2xl font-semibold font-mono">{formatBtc(walletDetails.balance)}</span>
              <span className="text-base font-medium">BTC</span>
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              ≈ {formatUsd(walletDetails.balanceUSD)}
            </div>
          </div>
          
          <Button 
            className="w-full mb-2"
            onClick={handleQuickTransfer}
            disabled={transferMutation.isPending || availableForWithdrawal <= 0}
          >
            <SendIcon className="h-5 w-5 mr-2" />
            {transferMutation.isPending ? "Processing..." : "Quick Transfer"}
          </Button>
          
          {/* Real Withdrawal button - permanently enabled */}
          <Button 
            className="w-full mb-2 mt-2 bg-red-600 hover:bg-red-700"
            onClick={handleRealWithdrawal}
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Real Withdrawal (Admin)
          </Button>
          
          {availableForWithdrawal <= 0 && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              No balance available for transfer - Mine to earn BTC
            </p>
          )}
          
          {availableForWithdrawal > 0 && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Available: {formatBtc(availableForWithdrawal)} BTC
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Otherwise render the full detailed wallet card
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Wallet Information</CardTitle>
        <CardDescription>Manage your mining earnings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="mb-4">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Wallet Address</span>
            {isEditingWalletAddress ? (
              <div className="mt-1">
                <div className="flex items-center">
                  <Input 
                    type="text" 
                    value={walletAddress} 
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-700 font-mono text-sm flex-grow" 
                    placeholder="Enter your Bitcoin wallet address"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      // Validate Bitcoin address (basic check)
                      const isValidAddress = walletAddress.length >= 26 && walletAddress.length <= 90;
                      
                      if (!isValidAddress) {
                        toast({
                          title: "Invalid Address",
                          description: "Please enter a valid Bitcoin wallet address",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      // Save the wallet address
                      updateWalletAddressMutation.mutate();
                    }}
                    className="ml-2"
                    disabled={updateWalletAddressMutation.isPending}
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your Bitcoin wallet address where your mining rewards will be sent
                </p>
              </div>
            ) : (
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setWalletAddress(walletDetails.user.walletAddress);
                    setIsEditingWalletAddress(true);
                  }}
                  className="ml-2"
                >
                  <Edit className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
          <div className="mb-4">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Balance</span>
            <div className="mt-1 flex items-center space-x-2">
              <span className="text-2xl font-semibold font-mono">{formatBtc(walletDetails.balance)}</span>
              <span className="text-base font-medium">BTC</span>
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              ≈ {formatUsd(walletDetails.balanceUSD)}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payout Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Automatic Payouts</span>
              <Switch 
                checked={autoPayouts} 
                onCheckedChange={setAutoPayouts}
                className={autoPayouts ? "bg-secondary" : ""}
              />
            </div>
            <div>
              <Label htmlFor="threshold" className="text-sm text-gray-500 dark:text-gray-400">Minimum Payout Threshold</Label>
              <div className="flex items-center mt-1">
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
            <div>
              <Label htmlFor="schedule" className="text-sm text-gray-500 dark:text-gray-400">Payout Schedule</Label>
              <Select value={payoutSchedule} onValueChange={setPayoutSchedule}>
                <SelectTrigger id="schedule" className="w-full mt-1 bg-gray-100 dark:bg-gray-700">
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

        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Withdrawal Options</h4>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Specify Custom Amount</span>
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
            <p className="text-sm text-gray-500">
              Full available balance will be transferred: {formatBtc(availableForWithdrawal)} BTC
            </p>
          )}
          
          {availableForWithdrawal > 0 && (
            <Alert className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700 mt-2">
              <AlertDescription>
                Network fee: {formatBtc(networkFee/100000000)} BTC for transaction
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            className="w-full"
            onClick={handleWithdrawal}
            disabled={transferMutation.isPending || availableForWithdrawal <= 0}
          >
            <SendIcon className="h-5 w-5 mr-2" />
            {transferMutation.isPending ? "Processing..." : "Transfer Now"}
          </Button>
          
          {/* Real Withdrawal button - permanently enabled */}
          <Button 
            className="w-full mt-4 bg-red-600 hover:bg-red-700"
            onClick={handleRealWithdrawal}
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Real Withdrawal (Admin)
          </Button>
          
          {parseFloat(walletDetails.balance) <= 0 && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              No balance available for transfer - Mine to earn BTC
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default WalletCard;
