import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import WebsiteLayout from "./WebsiteLayout";

export default function MiningSubscription() {
  const plans = [
    {
      name: "Starter",
      price: "49",
      period: "monthly",
      description: "Perfect for beginners to Bitcoin mining",
      features: [
        "0.5 TH/s Mining Power",
        "24/7 Mining Operation",
        "Basic Mining Dashboard",
        "Email Support",
        "Monthly Bitcoin Payouts"
      ],
      popular: false,
      ctaText: "Get Started",
      ctaHref: "/login"
    },
    {
      name: "Professional",
      price: "199",
      period: "monthly",
      description: "For serious miners looking for better returns",
      features: [
        "2.5 TH/s Mining Power",
        "24/7 Mining Operation",
        "Advanced Mining Dashboard",
        "Priority Support",
        "Weekly Bitcoin Payouts",
        "Mining Pool Selection",
        "Performance Analytics"
      ],
      popular: true,
      ctaText: "Get Started",
      ctaHref: "/login"
    },
    {
      name: "Enterprise",
      price: "599",
      period: "monthly",
      description: "Maximum mining power for optimal returns",
      features: [
        "10 TH/s Mining Power",
        "24/7 Mining Operation",
        "Advanced Mining Dashboard",
        "Priority Support",
        "Daily Bitcoin Payouts",
        "Mining Pool Selection",
        "Advanced Analytics & Reports",
        "Dedicated Account Manager",
        "API Access"
      ],
      popular: false,
      ctaText: "Get Started",
      ctaHref: "/login"
    }
  ];

  return (
    <WebsiteLayout>
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">CAFE CUP SIZE PLANS</h1>
            <p className="text-xl text-gray-300">
              Choose the right cafe plan for your needs and start earning without the hassle of managing hardware.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`bg-gray-900 border-gray-800 text-white relative ${
                  plan.popular ? "border-blue-500 shadow-lg shadow-blue-500/20" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 text-center">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Link href={plan.ctaHref} className="w-full">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      {plan.ctaText}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-20 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
            
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">How does the cafe work?</h3>
                <p className="text-gray-300">
                  Our cafe allows you to earn rewards without having to buy, set up, and maintain hardware yourself. 
                  Instead, you purchase computing capacity from our data centers and we handle all the hardware and maintenance while you earn the rewards.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">When will I receive my Bitcoin payouts?</h3>
                <p className="text-gray-300">
                  Payouts are made according to your subscription plan - daily, weekly, or monthly. 
                  The Bitcoin is sent directly to the wallet address you provide in your account settings.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Can I upgrade my plan later?</h3>
                <p className="text-gray-300">
                  Yes, you can upgrade your subscription plan at any time from your account dashboard. 
                  The new rate will be prorated for the remainder of your billing cycle.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Is there a minimum contract period?</h3>
                <p className="text-gray-300">
                  No, all our plans are month-to-month with no long-term commitment required. 
                  You can cancel at any time from your account dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Join Our Cafe?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already earning with our cloud cafe platform.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
    </WebsiteLayout>
  );
}