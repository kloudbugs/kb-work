import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaBitcoin, FaSync, FaCog, FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WalletIntegrationProps {
  user?: any;
}

export default function WalletIntegration({ user }: WalletIntegrationProps) {
  const [payoutAddress, setPayoutAddress] = useState(user?.walletAddress || "");
  const [payoutThreshold, setPayoutThreshold] = useState(user?.payoutThreshold || 0.001);
  const { toast } = useToast();

  const { data: payoutStatus } = useQuery({
    queryKey: ['/api/wallet/pending-payouts'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const setPayoutMutation = useMutation({
    mutationFn: async (data: { address: string; threshold: number }) => {
      return apiRequest({
        url: "/api/wallet/set-payout-address",
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Payout Settings Updated",
        description: "Your automatic payout settings have been saved",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/pending-payouts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Settings Update Failed",
        description: error.message || "Failed to update payout settings",
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    if (!payoutAddress.trim()) {
      toast({
        title: "Missing Address",
        description: "Please enter a valid Bitcoin address",
        variant: "destructive",
      });
      return;
    }

    if (payoutThreshold < 0.001) {
      toast({
        title: "Invalid Threshold",
        description: "Minimum payout threshold is 0.001 BTC",
        variant: "destructive",
      });
      return;
    }

    setPayoutMutation.mutate({ 
      address: payoutAddress.trim(), 
      threshold: payoutThreshold 
    });
  };

  return (
    <div className="mining-card p-6">
      <h3 className="text-lg font-semibold mb-6">Automatic Pool Payouts</h3>
      <div className="space-y-4">
        <div className="p-4 bg-elevated rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FaBitcoin className="text-bitcoin" />
              <span className="font-medium">Current Balance</span>
            </div>
            {payoutStatus?.canPayout ? (
              <span className="text-xs text-success bg-success/20 px-2 py-1 rounded">
                <FaCheckCircle className="inline mr-1" />
                Ready for Payout
              </span>
            ) : (
              <span className="text-xs text-warning bg-warning/20 px-2 py-1 rounded">
                Mining to Threshold
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-success text-lg">
                {payoutStatus?.currentBalance?.toFixed(8) || user?.balance?.toFixed(8) || '0.00000000'} BTC
              </div>
              <div className="text-xs text-muted">
                {payoutStatus?.nextPayoutAt || 'Loading...'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted">Payout Threshold</div>
              <div className="font-medium">
                {payoutStatus?.payoutThreshold?.toFixed(8) || payoutThreshold.toFixed(8)} BTC
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label className="block text-sm text-muted mb-2">Payout Address</Label>
            <Input
              type="text"
              placeholder="Enter your Bitcoin address"
              value={payoutAddress}
              onChange={(e) => setPayoutAddress(e.target.value)}
              className="font-mono text-sm bg-elevated border-border"
            />
          </div>

          <div>
            <Label className="block text-sm text-muted mb-2">Auto-Payout Threshold</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                step="0.001"
                min="0.001"
                max="10"
                value={payoutThreshold}
                onChange={(e) => setPayoutThreshold(parseFloat(e.target.value) || 0.01)}
                className="flex-1 bg-elevated border-border"
              />
              <span className="flex items-center px-3 text-muted">BTC</span>
            </div>
            <div className="text-xs text-muted mt-1">
              Pool will automatically pay out when you reach this threshold
            </div>
          </div>

          <Button
            onClick={handleSaveSettings}
            disabled={setPayoutMutation.isPending}
            className="w-full bg-bitcoin hover:bg-bitcoin/80 text-dark-bg font-semibold"
          >
            <FaCog className="mr-2" />
            {setPayoutMutation.isPending ? 'Saving...' : 'Save Payout Settings'}
          </Button>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-xs text-muted">
            <strong>How it works:</strong> The mining pool automatically sends Bitcoin to your wallet when your balance reaches the threshold. No manual withdrawals needed!
          </div>
        </div>
      </div>
    </div>
  );
}
