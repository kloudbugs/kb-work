import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { connectLedger, isLedgerSupported } from '@/lib/miningClient';

interface LedgerConnectButtonProps {
  onLedgerConnected: (connected: boolean) => void;
}

const LedgerConnectButton: React.FC<LedgerConnectButtonProps> = ({ onLedgerConnected }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Safely check if browser has WebUSB support
      if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.usb) {
        setError('WebUSB not supported in this browser');
        toast({
          title: "Browser Not Supported",
          description: "Ledger hardware wallets require a browser that supports WebUSB. Please use Chrome, Edge, or Brave.",
          variant: "destructive",
        });
        onLedgerConnected(false);
        return;
      }
      
      // First check if Ledger is supported by the server
      const { supported, message } = await isLedgerSupported();
      
      if (!supported) {
        setError('Ledger not supported');
        toast({
          title: "Ledger Support Unavailable",
          description: message || "Ledger hardware wallets are not supported in this environment.",
          variant: "destructive",
        });
        onLedgerConnected(false);
        return;
      }
      
      // Try to ask user for permission to access USB devices
      try {
        // Double check that we're in a browser environment with WebUSB support
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.usb) {
          try {
            // Dynamically import and use TransportWebUSB.requestDevice
            const { default: TransportWebUSB } = await import('@ledgerhq/hw-transport-webusb');
            await TransportWebUSB.requestDevice();
          } catch (importError) {
            console.error('Error importing TransportWebUSB:', importError);
            // Fallback to direct WebUSB API
            await navigator.usb.requestDevice({
              filters: [
                { vendorId: 0x2c97 } // Ledger vendor ID
              ]
            });
          }
        } else {
          throw new Error('WebUSB not available in this environment');
        }
      } catch (err) {
        console.error('User did not select a device or canceled the operation:', err);
        setError('No Ledger device selected');
        toast({
          title: "No Device Selected",
          description: "You must select your Ledger device when prompted to connect it.",
          variant: "destructive",
        });
        onLedgerConnected(false);
        setIsLoading(false);
        return;
      }
      
      // If we get here, the user selected a device, now try to connect to it
      const response = await connectLedger();
      
      if (response.connected) {
        setIsConnected(true);
        toast({
          title: "Ledger Connected",
          description: "Your Ledger device is now connected. Keep it unlocked with the Bitcoin app open during the transaction.",
        });
        onLedgerConnected(true);
      } else {
        setError(response.error || 'Failed to connect');
        toast({
          title: "Connection Failed",
          description: response.error || "Failed to connect to Ledger device. Make sure it's connected, unlocked, and has the Bitcoin app open.",
          variant: "destructive",
        });
        onLedgerConnected(false);
      }
    } catch (err) {
      console.error('Error connecting to Ledger:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast({
        title: "Connection Error",
        description: err instanceof Error ? err.message : "An unknown error occurred while connecting to the Ledger device.",
        variant: "destructive",
      });
      onLedgerConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isConnected ? "outline" : "default"}
      size="sm"
      onClick={handleConnect}
      disabled={isLoading}
      className={`w-full ${isConnected 
        ? "bg-green-100 border-green-500 text-green-600 hover:bg-green-100 hover:text-green-700" 
        : error 
          ? "bg-red-100 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700" 
          : "bg-blue-500 text-white hover:bg-blue-600"}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Connecting to Ledger...
        </>
      ) : isConnected ? (
        <>
          <Check className="h-5 w-5 mr-2" />
          Ledger Connected
        </>
      ) : error ? (
        <>
          <AlertTriangle className="h-5 w-5 mr-2" />
          Retry Connection
        </>
      ) : (
        <>
          <Shield className="h-5 w-5 mr-2" />
          Connect Ledger Device
        </>
      )}
    </Button>
  );
};

export default LedgerConnectButton;