import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { walletService, type AddressInfo, type Transaction } from "@/lib/wallet-service";
import { Bitcoin, ExternalLink, RefreshCw, Wallet, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from "@/lib/utils";

export default function RealWalletDashboard() {
  const [walletAddress, setWalletAddress] = useState('bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6');
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [btcPrice, setBtcPrice] = useState<number>(60000);

  const loadWalletData = async (address: string) => {
    if (!address || !await walletService.validateAddress(address)) {
      setError('Please enter a valid Bitcoin address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [info, price] = await Promise.all([
        walletService.getAddressInfo(address),
        walletService.getCurrentPrice()
      ]);
      
      setAddressInfo(info);
      setBtcPrice(price);
    } catch (err) {
      setError('Failed to load wallet data. Please try again.');
      console.error('Wallet loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      loadWalletData(walletAddress);
    }
  }, []);

  const openBlockExplorer = (txid?: string) => {
    const url = txid 
      ? `https://blockstream.info/tx/${txid}`
      : `https://blockstream.info/address/${walletAddress}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Wallet Address Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Real Bitcoin Wallet Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Bitcoin address (bc1... or 1... or 3...)"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={() => loadWalletData(walletAddress)}
              disabled={loading}
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Load Wallet'}
            </Button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {addressInfo && (
        <>
          {/* Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Bitcoin className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                    <p className="text-2xl font-bold">{addressInfo.balance.balance.toFixed(8)} BTC</p>
                    <p className="text-sm text-muted-foreground">
                      ≈ {formatCurrency(addressInfo.balance.balance * btcPrice)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Received</p>
                    <p className="text-2xl font-bold">{addressInfo.balance.totalReceived.toFixed(8)} BTC</p>
                    <p className="text-sm text-muted-foreground">
                      ≈ {formatCurrency(addressInfo.balance.totalReceived * btcPrice)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold">{addressInfo.balance.transactionCount}</p>
                    <p className="text-sm text-muted-foreground">
                      Total transaction count
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Address Details */}
          <Card>
            <CardHeader>
              <CardTitle>Address Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Address:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {addressInfo.address.substring(0, 12)}...{addressInfo.address.substring(addressInfo.address.length - 8)}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openBlockExplorer()}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {addressInfo.balance.unconfirmedBalance > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Unconfirmed:</span>
                    <Badge variant="secondary">
                      {addressInfo.balance.unconfirmedBalance.toFixed(8)} BTC
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadWalletData(walletAddress)}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </CardHeader>
            <CardContent>
              {addressInfo.transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Confirmations</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addressInfo.transactions.map((tx: Transaction) => (
                        <TableRow key={tx.txid}>
                          <TableCell>
                            <code className="text-sm">
                              {tx.txid.substring(0, 8)}...{tx.txid.substring(tx.txid.length - 8)}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge variant={tx.type === 'received' ? 'default' : 'secondary'}>
                              {tx.type}
                            </Badge>
                          </TableCell>
                          <TableCell className={tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(8)} BTC
                          </TableCell>
                          <TableCell>
                            <Badge variant={tx.confirmations >= 6 ? 'default' : 'destructive'}>
                              {tx.confirmations || 'Unconfirmed'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(new Date(tx.timestamp))}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openBlockExplorer(tx.txid)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found for this address
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}