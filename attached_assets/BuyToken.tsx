import { useState, useEffect } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Coffee, Wallet, ArrowRight } from 'lucide-react';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ tokenAmount }: { tokenAmount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}?success=true&amount=${tokenAmount}`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <div className="text-gray-700 mb-2">You are purchasing:</div>
        <div className="text-2xl font-bold text-primary">{tokenAmount.toLocaleString()} MPT</div>
        <div className="text-xs text-gray-500 mt-1">Official Launch: April 24, 2025</div>
        <div className="text-xs text-gray-500">Created by KLOUD BUGS, Inc. (LE LUXE LLC)</div>
      </div>
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full bg-primary text-white font-semibold py-3 rounded-lg"
      >
        {isProcessing ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            Confirm Purchase <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
};

export function BuyToken() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(100);
  const [tokenAmount, setTokenAmount] = useState(833333);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAddressError, setWalletAddressError] = useState("");
  const { toast } = useToast();
  const tokenRate = 0.00012; // Current token price in USD
  
  // Fee breakdown constants
  const networkFeePercentage = 0.05; // 5% for network fees
  const creationFeePercentage = 0.15; // 15% for token creation costs
  const liquidityPoolPercentage = 0.30; // 30% for initial liquidity
  const replitFeePercentage = 0.01; // 1% to Replit
  const teraFeePercentage = 0.10; // 10% to TERA token for civil rights initiatives
  const profitPercentage = 0.39; // 39% profit (reduced to accommodate TERA and Replit fees)
  
  // Calculate fee amounts
  const calculateFeeBreakdown = (totalAmount: number) => {
    return {
      networkFee: totalAmount * networkFeePercentage,
      creationFee: totalAmount * creationFeePercentage,
      liquidityPool: totalAmount * liquidityPoolPercentage,
      replitFee: totalAmount * replitFeePercentage,
      teraFee: totalAmount * teraFeePercentage,
      profit: totalAmount * profitPercentage,
    };
  };
  
  const calculateTokens = (dollarAmount: number) => {
    return Math.floor(dollarAmount / tokenRate);
  };

  const updateTokenAmount = (dollarAmount: number) => {
    setAmount(dollarAmount);
    setTokenAmount(calculateTokens(dollarAmount));
  };

  // Validate Solana wallet address
  const validateWalletAddress = (address: string) => {
    // Basic Solana wallet address validation
    // Solana addresses are typically base58 encoded and around 32-44 characters
    if (!address.trim()) {
      return "Wallet address is required";
    }
    if (address.length < 32 || address.length > 50) {
      return "Invalid wallet address length";
    }
    // Simple regex for base58 characters
    if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(address)) {
      return "Invalid wallet address format";
    }
    return "";
  };

  const startCheckout = async () => {
    if (amount < 10) {
      toast({
        title: "Minimum Purchase",
        description: "Minimum purchase amount is $10",
        variant: "destructive",
      });
      return;
    }
    
    const walletError = validateWalletAddress(walletAddress);
    if (walletError) {
      setWalletAddressError(walletError);
      toast({
        title: "Invalid Wallet",
        description: walletError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", { 
        amount: amount,
        tokenAmount: tokenAmount,
        walletAddress: walletAddress
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for success parameter in URL (after redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const purchasedAmount = urlParams.get('amount');
    
    if (success === 'true' && purchasedAmount) {
      toast({
        title: "Purchase Successful!",
        description: `You successfully purchased ${purchasedAmount} MPT tokens. Check your wallet within 24 hours.`,
      });
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const predefinedAmounts = [10, 50, 100, 500, 1000, 5000];
  
  return (
    <section className="py-16 bg-white" id="buy">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark mb-4">
            Buy <span className="text-primary">MPT</span> Tokens
          </h2>
          <p className="text-lightgray max-w-2xl mx-auto">
            <span className="font-semibold">Mining Power Token (MPT)</span> - Join the KLOUD BUGS ecosystem today! Purchase tokens securely using credit card or crypto.
          </p>
          <div className="mt-2 inline-block bg-primary/10 px-4 py-2 rounded-full">
            <span className="font-medium text-primary">Official Launch Date: April 24, 2025</span>
          </div>
          <div className="mt-2 inline-block bg-blue-500/10 px-4 py-2 rounded-full">
            <span className="font-medium text-blue-600">10% of all token sales support TERA token civil rights initiatives</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Created by KLOUD BUGS, incorporated by LE LUXE LLC
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg">
          {!clientSecret ? (
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-4 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Coffee className="h-6 w-6 text-primary" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
                <div className="rounded-full bg-primary/10 p-3">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="amount">Purchase Amount (USD)</Label>
                  <Input 
                    id="amount"
                    type="number" 
                    value={amount} 
                    onChange={(e) => updateTokenAmount(Number(e.target.value))}
                    min="10"
                    step="10"
                    className="text-lg"
                  />
                  
                  <div className="flex flex-wrap gap-2">
                    {predefinedAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => updateTokenAmount(amt)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          amount === amt 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  
                  <div className="pt-4">
                    <Label htmlFor="wallet" className="flex items-center">
                      Solana Wallet Address
                      <span className="ml-1 text-xs text-gray-500">(where we'll send your tokens)</span>
                    </Label>
                    <Input 
                      id="wallet"
                      type="text" 
                      value={walletAddress} 
                      onChange={(e) => {
                        setWalletAddress(e.target.value);
                        if (walletAddressError) {
                          // Clear error when user starts typing
                          setWalletAddressError("");
                        }
                      }}
                      placeholder="Enter your Solana wallet address"
                      className={`mt-1 ${walletAddressError ? 'border-red-500' : ''}`}
                    />
                    {walletAddressError && (
                      <p className="mt-1 text-xs text-red-500">{walletAddressError}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      We use this to send your MPT tokens after purchase
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col">
                  <div className="text-lg font-medium text-gray-700 mb-1">You will receive:</div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {tokenAmount.toLocaleString()} MPT
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    1 MPT = ${tokenRate.toFixed(5)} USD
                  </div>
                  
                  <div className="my-2">
                    <button 
                      onClick={() => setShowFeeBreakdown(!showFeeBreakdown)}
                      className="text-xs flex items-center text-primary hover:underline"
                    >
                      {showFeeBreakdown ? 'Hide' : 'Show'} fee breakdown
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className={`ml-1 transition-transform ${showFeeBreakdown ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </div>
                  
                  {showFeeBreakdown && (
                    <div className="mb-3 bg-gray-50 p-2 rounded-lg text-xs text-gray-600 border border-gray-200">
                      <div className="font-medium mb-1">Your payment covers:</div>
                      <div className="grid grid-cols-2 gap-1">
                        <div>Network Fees:</div>
                        <div className="text-right">${(amount * networkFeePercentage).toFixed(2)} ({(networkFeePercentage * 100)}%)</div>
                        
                        <div>Token Creation:</div>
                        <div className="text-right">${(amount * creationFeePercentage).toFixed(2)} ({(creationFeePercentage * 100)}%)</div>
                        
                        <div>Liquidity Pool:</div>
                        <div className="text-right">${(amount * liquidityPoolPercentage).toFixed(2)} ({(liquidityPoolPercentage * 100)}%)</div>
                        
                        <div>Replit:</div>
                        <div className="text-right">${(amount * replitFeePercentage).toFixed(2)} ({(replitFeePercentage * 100)}%)</div>
                        
                        <div className="font-medium text-blue-600">TERA Token Fund:</div>
                        <div className="text-right font-medium text-blue-600">${(amount * teraFeePercentage).toFixed(2)} ({(teraFeePercentage * 100)}%)</div>
                        
                        <div className="border-t border-gray-300 pt-1 font-medium">Platform Fee:</div>
                        <div className="text-right border-t border-gray-300 pt-1 font-medium">${(amount * profitPercentage).toFixed(2)} ({(profitPercentage * 100)}%)</div>
                      </div>
                      <div className="mt-1 text-xxs">
                        <span className="block">• Network fees cover Solana transaction costs</span>
                        <span className="block">• Token creation funds smart contract deployment</span>
                        <span className="block">• Liquidity pool enables trading on exchanges</span>
                        <span className="block font-medium text-blue-600">• TERA Token Fund supports civil rights initiatives, including the case of Tera Ann Harris</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-auto">
                    <Button 
                      onClick={startCheckout} 
                      disabled={isLoading || amount < 10} 
                      className="w-full bg-primary text-white font-semibold py-3 rounded-lg"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                          Processing...
                        </span>
                      ) : (
                        "Continue to Checkout"
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 mt-6">
                <p>Tokens will be delivered to your wallet within 24 hours.</p>
                <p className="mt-1">Need help? Contact <a href="mailto:support@kloudbugscrypto.com" className="text-primary hover:underline">support@kloudbugscrypto.com</a></p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">Complete Your Purchase</h3>
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <CheckoutForm tokenAmount={tokenAmount} />
              </Elements>
              <button 
                onClick={() => setClientSecret("")}
                className="mt-4 text-sm text-gray-500 hover:text-primary"
              >
                ← Back to token selection
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-primary text-xl mb-3">🔒 Secure Transactions</div>
            <p className="text-gray-600">All payments are processed securely through Stripe with bank-level encryption.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-primary text-xl mb-3">⚡ Fast Delivery</div>
            <p className="text-gray-600">Tokens are delivered to your wallet within 24 hours of successful payment.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-primary text-xl mb-3">💰 Exclusive Price</div>
            <p className="text-gray-600">Buy directly from our website to get the best price before exchange listings.</p>
          </div>
        </div>
      </div>
    </section>
  );
}