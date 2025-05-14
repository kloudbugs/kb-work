import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const SpecialWalletAccess: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<any>(null);
  const { toast } = useToast();

  // Auto-load wallet addresses when component mounts
  // Since this component is only accessible from the Admin Controls section
  useEffect(() => {
    loadWalletAddresses();
  }, []);

  const loadWalletAddresses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the hard-coded special wallet password for API request
      const apiWalletPassword = "Satoshi-Genesis-Block-2009";
      
      const response = await fetch(`/api/wallet/special/addresses?walletPassword=${encodeURIComponent(apiWalletPassword)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to access special wallet');
      }
      
      setAddresses(data);
      toast({
        title: 'Success',
        description: 'Special wallet access granted',
        variant: 'default',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to access special wallet');
      toast({
        title: 'Error',
        description: err.message || 'Failed to access special wallet',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Special Wallet Access</CardTitle>
        <CardDescription>
          Index 0 wallet addresses and functions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-2">Loading wallet information...</p>
              <Button disabled className="mt-2">
                Loading...
              </Button>
            </div>
          ) : addresses ? (
            <div className="bg-muted p-3 rounded-md text-sm">
              <h3 className="font-semibold mb-2">Wallet Addresses</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-primary">Index 0:</h4>
                  <div className="text-xs mt-1 space-y-1">
                    <p><span className="font-medium">Legacy (uncompressed):</span> {addresses.index0.legacy.uncompressed}</p>
                    <p><span className="font-medium">Legacy (compressed):</span> {addresses.index0.legacy.compressed}</p>
                    <p><span className="font-medium">SegWit (p2sh):</span> {addresses.index0.segwit.p2sh}</p>
                    <p><span className="font-medium">SegWit (native):</span> {addresses.index0.segwit.native}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-primary">Index 1:</h4>
                  <div className="text-xs mt-1 space-y-1">
                    <p><span className="font-medium">Legacy (uncompressed):</span> {addresses.index1.legacy.uncompressed}</p>
                    <p><span className="font-medium">Legacy (compressed):</span> {addresses.index1.legacy.compressed}</p>
                    <p><span className="font-medium">SegWit (p2sh):</span> {addresses.index1.segwit.p2sh}</p>
                    <p><span className="font-medium">SegWit (native):</span> {addresses.index1.segwit.native}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-2">Could not load wallet information</p>
              <Button onClick={loadWalletAddresses} className="mt-2">
                Retry
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <p>Admin access only</p>
        <Button variant="outline" size="sm" onClick={loadWalletAddresses} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpecialWalletAccess;