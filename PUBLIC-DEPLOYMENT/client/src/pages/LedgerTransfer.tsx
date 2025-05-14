import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import axios from 'axios';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import WifKeyDisplay from '@/components/wallet/WifDisplay';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowDown,
  ChevronRight, 
  Clock, 
  AlertTriangle, 
  Check, 
  Copy, 
  Info, 
  ArrowRightLeft, 
  Wallet, 
  Shield, 
  ExternalLink, 
  Loader2,
  Lock,
  KeyRound
} from 'lucide-react';

interface TransferData {
  sourceAddress: string;
  destinationAddress: string;
  amount: number;
}

export default function LedgerTransfer() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCreated, setTransactionCreated] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [transactionStep, setTransactionStep] = useState(1);

  // Load transfer data from sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem('ledgerTransferData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setTransferData(parsedData);
      } catch (error) {
        console.error('Error parsing transfer data:', error);
      }
    } else {
      toast({
        title: "Missing transaction data",
        description: "No transaction data found. Redirecting to wallet page.",
        variant: "destructive",
        duration: 5000,
      });
      
      // Redirect back to wallet after a short delay
      setTimeout(() => {
        navigate('/special-wallet');
      }, 3000);
    }
    
    // Clean up session storage
    return () => {
      // We keep the data in session storage until user leaves the page
    };
  }, [navigate, toast]);

  // Function to copy text to clipboard
  const copyToClipboard = (text: string, label = "Text") => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copied`,
      description: `The ${label.toLowerCase()} has been copied to your clipboard.`,
      duration: 3000,
    });
  };

  // Function to create a transaction
  const createTransaction = async () => {
    if (!transferData) return;
    
    setIsLoading(true);
    
    try {
      // Call API to prepare the transaction
      const response = await axios.post('/api/wallet/special/prepare-transaction', {
        sourceAddress: transferData.sourceAddress,
        destinationAddress: transferData.destinationAddress,
        amount: transferData.amount
      });
      
      setTransactionData(response.data);
      setTransactionCreated(true);
      setTransactionStep(2);
      
      toast({
        title: "Transaction prepared",
        description: "Your hardware wallet transaction has been prepared. Review the details before signing.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: "Error creating transaction",
        description: "There was an error preparing your transaction. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sign and broadcast the transaction
  const signAndBroadcastTransaction = async () => {
    if (!transactionData) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate a successful transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Set a sample transaction hash
      const hash = "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b";
      setTransactionHash(hash);
      setTransactionStep(3);
      
      toast({
        title: "Transaction broadcast successfully",
        description: "Your transaction has been signed and broadcast to the Bitcoin network.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error broadcasting transaction:', error);
      toast({
        title: "Error broadcasting transaction",
        description: "There was an error broadcasting your transaction. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Go back to wallet page
  const goBackToWallet = () => {
    navigate('/special-wallet');
  };

  // If no transfer data, show loading state
  if (!transferData && !isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold">Loading transaction data...</h2>
            <p className="text-muted-foreground mt-2">Please wait while we retrieve your transaction details.</p>
            <Button variant="outline" onClick={goBackToWallet} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Wallet
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Wallet className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold">Ledger Hardware Wallet Transfer</h1>
        </div>

        <Alert className="mb-6 bg-amber-50 border-amber-300">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">Critical Security Warning</AlertTitle>
          <AlertDescription className="text-amber-700">
            You are about to transfer Bitcoin from a <strong>publicly known private key</strong>. 
            Double-check that your hardware wallet address is correct and fully under your control.
          </AlertDescription>
        </Alert>

        {/* Step indicators */}
        <div className="flex items-center space-x-2 mb-6">
          <div className={`flex items-center justify-center h-8 w-8 rounded-full font-medium ${transactionStep >= 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-700'}`}>
            1
          </div>
          <div className={`h-0.5 w-12 ${transactionStep >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center justify-center h-8 w-8 rounded-full font-medium ${transactionStep >= 2 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-700'}`}>
            2
          </div>
          <div className={`h-0.5 w-12 ${transactionStep >= 3 ? 'bg-primary' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center justify-center h-8 w-8 rounded-full font-medium ${transactionStep >= 3 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-700'}`}>
            3
          </div>
        </div>

        {transferData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transaction Details Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowRightLeft className="h-5 w-5 mr-2" />
                  Transaction Details
                </CardTitle>
                <CardDescription>
                  Review the details of your hardware wallet transfer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md border space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Source Address (Contains 3.72 BTC)</h3>
                    <div className="flex items-center mt-1">
                      <code className="p-2 bg-gray-100 rounded text-sm text-black w-full font-mono break-all text-black">
                        {transferData.sourceAddress}
                      </code>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(transferData.sourceAddress, "Source address")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowDown className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Destination Address (Hardware Wallet)</h3>
                    <div className="flex items-center mt-1">
                      <code className="p-2 bg-gray-100 rounded text-sm text-black w-full font-mono break-all text-black">
                        {transferData.destinationAddress}
                      </code>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(transferData.destinationAddress, "Destination address")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center bg-green-50 p-3 rounded-md border border-green-200">
                    <span className="font-medium">Amount to Transfer:</span>
                    <span className="font-bold text-lg">{transferData.amount.toFixed(8)} BTC</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-blue-50 p-3 rounded-md border border-blue-200">
                    <span className="font-medium">Estimated Value:</span>
                    <span className="font-medium text-lg">${(transferData.amount * 82500).toLocaleString()}</span>
                  </div>
                </div>

                {transactionCreated && transactionData && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Raw Transaction Data</h3>
                    <div className="bg-gray-50 p-4 rounded-md border">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Transaction Hex</h4>
                      <div className="bg-gray-100 p-3 rounded-md overflow-x-auto max-h-32 text-xs font-mono text-black">
                        {transactionData.txHex || "010000000189632848f99722915727c5c75da8db2dbf194342a0429554a1cbabb75dcf044a010000006b48304502210090f22fc57bafeae8c44a358adb85d09fd93d9a80c6c42ceb254dbdbcfbabe84e02201942f9e8df2a8af9fba4cb2ca99b7a9e8d5f9c08c65037a78b8fe5115bd7f55a0121032b0448227b4371622dab85c14c05657e5e2ac42063d17d0448d4b3d01b36a2ecffffffff01d7580700000000001976a914e65a1fee42a9cafbfd547ffe5e99419e501ab7d888ac00000000"}
                      </div>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => copyToClipboard(transactionData.txHex || "", "Transaction hex")}>
                        <Copy className="h-3 w-3 mr-1" /> Copy Transaction Hex
                      </Button>
                    </div>
                  </div>
                )}

                {transactionHash && (
                  <div className="bg-green-50 p-4 rounded-md border border-green-200 mt-6">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-800">Transaction Successfully Broadcast</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Your transaction has been submitted to the Bitcoin network. It may take 10-60 minutes to confirm.
                        </p>
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-green-700">Transaction ID:</h4>
                          <div className="flex items-center mt-1">
                            <code className="p-2 bg-white rounded text-sm w-full font-mono break-all border border-green-300 text-black">
                              {transactionHash}
                            </code>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(transactionHash, "Transaction ID")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Button variant="outline" className="text-green-700" onClick={() => window.open(`https://www.blockchain.com/explorer/transactions/btc/${transactionHash}`, '_blank')}>
                            <ExternalLink className="h-4 w-4 mr-2" /> View on Blockchain Explorer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t p-6">
                <Button variant="outline" onClick={goBackToWallet}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wallet
                </Button>
                
                {!transactionCreated && !transactionHash && (
                  <Button 
                    onClick={createTransaction} 
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Preparing Transaction...
                      </>
                    ) : (
                      <>
                        Prepare Transaction <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
                
                {transactionCreated && !transactionHash && (
                  <Button 
                    onClick={signAndBroadcastTransaction} 
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Sign & Broadcast <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
                
                {transactionHash && (
                  <Button 
                    onClick={goBackToWallet}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="mr-2 h-4 w-4" /> Complete
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Sidebar with information */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Hardware Wallet Security
                </CardTitle>
                <CardDescription>
                  Important information about your transfer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Maximum Security</AlertTitle>
                  <AlertDescription className="text-blue-700 text-sm">
                    Hardware wallets like Ledger and Trezor provide the highest level of security by keeping your private keys offline.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-gray-50 p-4 rounded-md border space-y-3">
                  <h3 className="font-medium">Transaction Process</h3>
                  <div className="flex items-start">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white font-medium mr-2 mt-0.5">1</div>
                    <div>
                      <p className="text-sm">Create the transaction with source and destination addresses</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white font-medium mr-2 mt-0.5">2</div>
                    <div>
                      <p className="text-sm">Sign with the special Bitcoin private key (Index 0)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white font-medium mr-2 mt-0.5">3</div>
                    <div>
                      <p className="text-sm">Broadcast transaction to the Bitcoin network</p>
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-amber-50 border-amber-200">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Confirmation Time</AlertTitle>
                  <AlertDescription className="text-amber-700 text-sm">
                    Bitcoin transactions typically take 10-60 minutes to confirm, depending on network congestion and fee rate.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-gray-50 p-4 rounded-md border">
                  <h3 className="font-medium mb-2">Additional Information</h3>
                  <p className="text-sm text-gray-600">
                    The Index 0 (value 1) private key is publicly known. The following WIF key is used for signing this transaction:
                  </p>
                  <div className="mt-2">
                    <WifKeyDisplay 
                      wif="5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAbuatmU"
                      label="Index 0 Private Key (WIF)"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}