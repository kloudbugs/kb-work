import { useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscriptionForm = ({ plan }: { plan: 'monthly' | 'yearly' }) => {
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
          return_url: `${window.location.origin}/mining?success=true&plan=${plan}`,
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

  const planName = plan === 'monthly' ? 'Monthly' : 'Annual';
  const planAmount = plan === 'monthly' ? '$49.99' : '$250.00';
  const savings = plan === 'yearly' ? '(Save $349.88 per year)' : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <div className="text-gray-700 mb-2">You are subscribing to:</div>
        <div className="text-2xl font-bold text-primary">{planName} Mining Subscription</div>
        <div className="text-lg font-medium mt-1">{planAmount} {savings}</div>
        <div className="text-xs text-gray-500 mt-2">
          Start mining MPT tokens immediately after subscription
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
            Subscribe Now <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
};

export default function MiningSubscription() {
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const startSubscription = async (plan: 'monthly' | 'yearly') => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/create-subscription", { 
        plan: plan
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setSelectedPlan(plan);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <section className="py-16 bg-white" id="mining">
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
            <span className="text-primary">MPT</span> Mining Subscription
          </h2>
          <p className="text-lightgray max-w-2xl mx-auto">
            Start mining MPT (Mining Power Token) today with our subscription service. Get access to our cloud mining platform to earn tokens while supporting civil rights movements worldwide.
          </p>
          <div className="mt-2 inline-block bg-primary/10 px-4 py-2 rounded-full">
            <span className="font-medium text-primary">Official Launch Date: April 24, 2025</span>
          </div>
          <div className="mt-2 inline-block bg-blue-500/10 px-4 py-2 rounded-full">
            <span className="font-medium text-blue-600">10% of all mining proceeds support TERA (TAH - Tera Ann Harris) token civil rights initiatives</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            By KLOUD BUGS, incorporated by LE LUXE LLC
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {!clientSecret ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Monthly Subscription Plan */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-gray-50 p-6">
                  <h3 className="text-xl font-bold">Monthly Subscription</h3>
                  <div className="mt-4 flex items-end">
                    <span className="text-4xl font-bold">$49.99</span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Access to cloud mining platform</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Mine MPT tokens automatically</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Weekly payouts to your wallet</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>10% of rewards support TERA/TAH civil rights initiatives</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Cancel anytime</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => startSubscription('monthly')} 
                    disabled={isLoading}
                    className="mt-6 w-full"
                  >
                    {isLoading ? 'Processing...' : 'Subscribe Monthly'}
                  </Button>
                </div>
              </div>
              
              {/* Yearly Subscription Plan */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-primary relative">
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
                  BEST VALUE
                </div>
                <div className="bg-primary/10 p-6">
                  <h3 className="text-xl font-bold">Annual Subscription</h3>
                  <div className="mt-4 flex items-end">
                    <span className="text-4xl font-bold">$250</span>
                    <span className="text-gray-500 ml-2">/year</span>
                  </div>
                  <div className="text-sm text-primary mt-2 font-medium">
                    Save $349.88 per year
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Everything in Monthly plan</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span><strong>20% bonus</strong> on mining rewards</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Priority customer support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Early access to new features</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => startSubscription('yearly')} 
                    disabled={isLoading}
                    className="mt-6 w-full"
                    variant="secondary"
                  >
                    {isLoading ? 'Processing...' : 'Subscribe Yearly'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-center">Complete Your Subscription</h3>
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <SubscriptionForm plan={selectedPlan} />
              </Elements>
              <button 
                onClick={() => setClientSecret("")}
                className="mt-4 text-sm text-gray-500 hover:text-primary text-center w-full"
              >
                ← Back to subscription options
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-primary text-xl mb-3">⛏️ Cloud Mining</div>
            <p className="text-gray-600">Mine MPT tokens without the need for expensive hardware. Our cloud platform does all the work.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-primary text-xl mb-3">💸 Weekly Payouts</div>
            <p className="text-gray-600">Receive your mined tokens directly to your wallet every week. No minimum payout threshold.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-primary text-xl mb-3">🛡️ Secure Platform</div>
            <p className="text-gray-600">Our platform uses enterprise-grade security to protect your subscription and mining rewards.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-primary text-xl mb-3">❤️ Civil Rights Impact</div>
            <p className="text-gray-600">10% of all mining rewards automatically fund TERA (TAH - Tera Ann Harris) token civil rights initiatives, including the case of Tera Ann Harris.</p>
          </div>
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto bg-primary/10 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-center mb-4">How Your Mining Subscription Makes a Difference</h3>
          <p className="text-center mb-4">
            With every MPT token you mine, you're contributing to positive change around the world.
          </p>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="font-bold text-2xl text-primary">10%</div>
              <div className="text-sm">TERA/TAH Civil Rights Initiatives</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-primary">74%</div>
              <div className="text-sm">Your Mining Revenue</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-primary">15%</div>
              <div className="text-sm">Platform Maintenance</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-primary">1%</div>
              <div className="text-sm">Replit</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}