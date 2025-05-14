import { useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Check, ArrowRight, Scale, FileText, Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const TeraTokenPurchaseForm = ({ amount }: { amount: number }) => {
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
          return_url: `${window.location.origin}/tera?success=true&amount=${amount}`,
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
        <div className="text-2xl font-bold text-primary">TERA Token</div>
        <div className="text-lg font-medium mt-1">${amount.toFixed(2)}</div>
        <div className="text-xs text-gray-500 mt-2">
          99% of your contribution funds the selected civil rights case, 1% goes to Replit
        </div>
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
            Support Now <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
};

export default function TeraToken() {
  const [clientSecret, setClientSecret] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const startPurchase = async (amount: number) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/create-tera-token", { 
        amount: amount
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setSelectedAmount(amount);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start purchase process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const currentCase = {
    name: "Equal Educational Access Initiative",
    description: "Supporting legal action to ensure equal access to quality education in underserved communities.",
    progress: 65, // percentage
    goal: 100000, // $100,000
    raised: 65000, // $65,000
    timeLeft: "21 days",
    updates: [
      { date: "Apr 2, 2025", text: "Initial filings submitted to federal court" },
      { date: "Mar 15, 2025", text: "Expert witnesses secured for testimonies" },
      { date: "Feb 28, 2025", text: "Research phase completed" }
    ]
  };
  
  return (
    <section className="py-16 bg-white" id="tera-token">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back to Dashboard Button */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <Button variant="ghost" size="sm" className="flex items-center gap-1" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark mb-4">
            <span className="text-primary">TERA</span> Token
          </h2>
          <p className="text-lightgray max-w-2xl mx-auto">
            Support ongoing civil rights cases directly. The TERA Token represents a direct contribution to an active legal case working toward social justice.
          </p>
          <div className="mt-2 inline-block bg-primary/10 px-4 py-2 rounded-full">
            <span className="font-medium text-primary">99% of funds go directly to legal support, 1% to Replit</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">{currentCase.name}</h3>
              
              <p className="text-gray-600 mb-6">{currentCase.description}</p>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Progress</span>
                  <span>{currentCase.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${currentCase.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">${(currentCase.raised / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-gray-500">Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">${(currentCase.goal / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-gray-500">Goal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{currentCase.timeLeft}</div>
                  <div className="text-xs text-gray-500">Remaining</div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-1" /> Recent Updates
                </h4>
                <ul className="space-y-2">
                  {currentCase.updates.map((update, idx) => (
                    <li key={idx} className="text-sm">
                      <span className="text-primary font-medium">{update.date}:</span> {update.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              {!clientSecret ? (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-xl font-bold mb-6">Support This Case</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-3 gap-2">
                      {[25, 50, 100].map((amount) => (
                        <Button 
                          key={amount}
                          variant={selectedAmount === amount ? "default" : "outline"}
                          className="rounded-full"
                          onClick={() => setSelectedAmount(amount)}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {[250, 500].map((amount) => (
                        <Button 
                          key={amount}
                          variant={selectedAmount === amount ? "default" : "outline"}
                          className="rounded-full"
                          onClick={() => setSelectedAmount(amount)}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    
                    <Button 
                      variant={selectedAmount === 1000 ? "default" : "secondary"}
                      className="w-full rounded-full"
                      onClick={() => setSelectedAmount(1000)}
                    >
                      ${1000}
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={() => startPurchase(selectedAmount)} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Processing...' : `Contribute $${selectedAmount}`}
                  </Button>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-semibold mb-6 text-center">Complete Your Contribution</h3>
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                    <TeraTokenPurchaseForm amount={selectedAmount} />
                  </Elements>
                  <button 
                    onClick={() => setClientSecret("")}
                    className="mt-4 text-sm text-gray-500 hover:text-primary text-center w-full"
                  >
                    ← Back to contribution options
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-primary text-xl mb-3 flex items-center">
              <Scale className="w-5 h-5 mr-2" /> Legal Impact
            </div>
            <p className="text-gray-600">Your contribution provides direct funding for legal representation, court fees, and expert witnesses.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-primary text-xl mb-3 flex items-center">
              <Heart className="w-5 h-5 mr-2" /> Community Support
            </div>
            <p className="text-gray-600">Each TERA Token represents a real stake in advancing civil rights through legal action that impacts communities.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-primary text-xl mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2" /> Full Transparency
            </div>
            <p className="text-gray-600">Receive updates on how your contribution is being used and the progress of the legal case you're supporting.</p>
          </div>
        </div>
      </div>
    </section>
  );
}