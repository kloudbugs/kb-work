import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MiningSubscription() {
  // Default admin credentials for demonstration 
  const adminUsername = "admin";
  const adminPassword = "mining123";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 border-b border-gray-800 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/logo1.png" 
              alt="KloudBugs Logo" 
              className="h-16 w-16 mr-3"
            />
            <span className="text-2xl font-bold gradient-text">KloudBugs Mining</span>
          </div>
          
          <nav className="hidden md:flex space-x-6 text-gray-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="#plans" className="hover:text-white">Plans</Link>
            <Link href="#features" className="hover:text-white">Features</Link>
            <Link href="#faq" className="hover:text-white">FAQ</Link>
          </nav>
        </div>
      </header>
      
      <main className="pt-32">
        {/* Hero section */}
        <section className="hero-section py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Mining Subscription Plans</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Select a subscription plan that fits your mining needs. Our infrastructure is optimized for maximum efficiency and profitability.
            </p>
          </div>
        </section>
        
        {/* Subscription plans */}
        <section id="plans" className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <Card className="bg-gray-800/30 border border-gray-700 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold">Basic Plan</CardTitle>
                  <CardDescription className="text-gray-400">For casual miners</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold gradient-text">$19.99</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>100 GH/s mining power</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Basic mining dashboard</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Daily payouts</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Email support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full btn-primary">Subscribe</Button>
                </CardFooter>
              </Card>
              
              {/* Pro Plan */}
              <Card className="bg-gray-800/30 border border-blue-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-500 text-xs font-semibold px-3 py-1 text-white">
                  POPULAR
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold">Pro Plan</CardTitle>
                  <CardDescription className="text-gray-400">For serious miners</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold gradient-text">$49.99</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>500 GH/s mining power</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Advanced mining dashboard</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Daily payouts with lower threshold</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Priority email and chat support</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Mining pool optimization</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full btn-primary glow">Subscribe</Button>
                </CardFooter>
              </Card>
              
              {/* Enterprise Plan */}
              <Card className="bg-gray-800/30 border border-gray-700 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold">Enterprise Plan</CardTitle>
                  <CardDescription className="text-gray-400">For professional miners</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold gradient-text">$199.99</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>2500 GH/s mining power</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Enterprise-level dashboard</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Real-time payouts</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>24/7 dedicated support</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Custom mining configurations</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Advanced analytics</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full btn-primary">Subscribe</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Purchase Section */}
        <section className="py-12 bg-blue-900/20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">
              <span className="gradient-text">Subscribe Now</span>
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Choose a subscription plan that fits your needs and start mining Bitcoin today. After purchase, you'll receive login credentials to access our mining portal.
            </p>
            
            <div className="flex flex-col items-center gap-6">
              <button 
                className="btn-primary glow inline-block px-8 py-4 rounded-md text-lg"
              >
                Purchase Subscription
              </button>
              
              <div className="mt-2">
                <p className="text-gray-400 text-sm">Already have a subscription?</p>
                <a 
                  href="/api/mining" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Access Mining Portal
                </a>
              </div>
            </div>
            
            <div className="mt-10 p-4 bg-gray-800/50 border border-gray-700 rounded-md max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-white mb-2">For Subscribers Only</h3>
              <p className="text-gray-300 text-sm">
                Access to the mining portal is restricted to subscribers. Please contact support if you've purchased a subscription but haven't received your login credentials.
              </p>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="gradient-text">Mining Portal Features</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Real-time Statistics</h3>
                <p className="text-gray-400">Monitor your mining performance with real-time hashrate, earnings, and efficiency metrics.</p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Automated Payouts</h3>
                <p className="text-gray-400">Receive your mining rewards automatically to your Bitcoin wallet with flexible payout schedules.</p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Pool Configuration</h3>
                <p className="text-gray-400">Configure your mining setup with our optimized mining pools for maximum profitability.</p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Infrastructure</h3>
                <p className="text-gray-400">Your mining operations are protected with enterprise-grade security and redundancy measures.</p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                <p className="text-gray-400">Get detailed insights into your mining performance with comprehensive analytics and reporting.</p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                <p className="text-gray-400">Get help whenever you need it with our dedicated support team available 24/7.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ section */}
        <section id="faq" className="py-20 bg-gradient-to-b from-blue-900/20 to-transparent">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="gradient-text">Frequently Asked Questions</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-2">How do mining subscriptions work?</h3>
                <p className="text-gray-400">Our mining subscriptions provide you with dedicated mining power in our data centers. You pay a monthly fee, and we handle all the hardware, electricity, cooling, and maintenance.</p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-2">What cryptocurrencies can I mine?</h3>
                <p className="text-gray-400">Currently, we support Bitcoin mining only, with plans to expand to other cryptocurrencies in the future.</p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-2">How are mining rewards calculated?</h3>
                <p className="text-gray-400">Mining rewards are calculated based on your mining power (hash rate), the current difficulty of the Bitcoin network, and the pooled mining methodology.</p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-2">How often are payouts made?</h3>
                <p className="text-gray-400">Payouts are made on a daily basis once you reach the minimum payout threshold, which varies by subscription plan.</p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-2">Can I cancel my subscription?</h3>
                <p className="text-gray-400">Yes, you can cancel your subscription at any time. Refunds are prorated based on the unused portion of your subscription period.</p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-2">What is your uptime guarantee?</h3>
                <p className="text-gray-400">We guarantee 99.9% uptime for our mining infrastructure. In case of downtime, you will be compensated with additional mining time.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center mb-4">
                <img src="/logo1.png" alt="KloudBugs Logo" className="h-10 w-10 mr-2" />
                <span className="text-xl font-bold gradient-text">KloudBugs Mining</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for Bitcoin mining solutions with maximum efficiency and profitability.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/" className="text-gray-400 hover:text-blue-400 transition">Home</Link>
                <Link href="#plans" className="text-gray-400 hover:text-blue-400 transition">Plans</Link>
                <Link href="#features" className="text-gray-400 hover:text-blue-400 transition">Features</Link>
                <Link href="#faq" className="text-gray-400 hover:text-blue-400 transition">FAQ</Link>
                <a href="/api/mining" className="text-gray-400 hover:text-blue-400 transition">Mining Portal</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <div className="space-y-2 text-gray-400">
                <p>Email: support@kloudbugsmining.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-500/20 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-500/20 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-500/20 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} KloudBugs Mining. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}