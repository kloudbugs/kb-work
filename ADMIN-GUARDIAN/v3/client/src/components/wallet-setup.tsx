import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Shield, CheckCircle } from "lucide-react";

export default function WalletSetup() {
  const [btcAddress, setBtcAddress] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  const [threshold, setThreshold] = useState("0.001");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveWallet = async () => {
    if (!btcAddress.trim()) {
      toast({
        title: "Bitcoin Address Required",
        description: "Please enter your hardware wallet Bitcoin address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/wallet/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: btcAddress.trim(),
          ethAddress: ethAddress.trim() || undefined,
          threshold: parseFloat(threshold)
        })
      });

      if (response.ok) {
        toast({
          title: "Wallet Configured Successfully!",
          description: `Your hardware wallet is now set up for automatic payouts at ${threshold} BTC threshold`,
        });
      } else {
        throw new Error('Failed to configure wallet');
      }
    } catch (error) {
      toast({
        title: "Configuration Failed",
        description: "Unable to save wallet settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="flex items-center gap-2 justify-center">
          <Wallet className="h-5 w-5" />
          Hardware Wallet Setup
        </CardTitle>
        <CardDescription>
          Configure your hardware wallet address for secure automatic payouts
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="btc-address">Bitcoin Hardware Wallet Address *</Label>
          <Input
            id="btc-address"
            type="text"
            placeholder="Enter your hardware wallet BTC address (e.g., bc1q...)"
            value={btcAddress}
            onChange={(e) => setBtcAddress(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eth-address">Ethereum Address (Optional)</Label>
          <Input
            id="eth-address"
            type="text"
            placeholder="0x... (optional)"
            value={ethAddress}
            onChange={(e) => setEthAddress(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="threshold">Payout Threshold (BTC)</Label>
          <Input
            id="threshold"
            type="number"
            step="0.001"
            min="0.001"
            placeholder="0.001"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Automatic payout when balance reaches this amount
          </p>
        </div>

        <Button 
          onClick={handleSaveWallet} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            "Configuring..."
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Save Hardware Wallet Configuration
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
          <strong>Security Note:</strong> Your hardware wallet address will be used for all automatic payouts. 
          No private keys are stored - only your public receiving address.
        </div>
      </CardContent>
    </Card>
  );
}