import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function MPTToken() {
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
            <span className="text-2xl font-bold gradient-text">KloudBugs</span>
          </div>
          
          <nav className="hidden md:flex space-x-6 text-gray-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/mpt-token" className="hover:text-white">MPT Token</Link>
            <Link href="/tah-info" className="hover:text-white">TAH</Link>
            <Link href="/mining" className="hover:text-white">Mining</Link>
            <Link href="/#roadmap" className="hover:text-white">Roadmap</Link>
          </nav>
        </div>
      </header>
      
      <main className="pt-32">
        {/* Hero section */}
        <section className="py-16 bg-gradient-to-b from-blue-900/20 to-transparent">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">MPT Token</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              The Mining Performance Token (MPT) is designed to bridge the gap between traditional 
              coffee culture and cryptocurrency mining, offering both utility and growth potential.
            </p>
          </div>
        </section>
        
        {/* Token Overview section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-px bg-blue-500/20 rounded-full blur-xl"></div>
                  <img 
                    src="/logo1.png" 
                    alt="MPT Token Logo" 
                    className="relative z-10 w-64 h-64 mx-auto object-contain"
                  />
                </div>
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="gradient-text">Token Overview</span>
                </h2>
                <div className="space-y-6 text-gray-300">
                  <p className="text-lg">
                    MPT Token serves as the utility token within the KloudBugs ecosystem, 
                    enabling access to exclusive mining benefits, profit-sharing, and governance rights.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                      <h3 className="font-bold mb-2">Token Symbol</h3>
                      <p className="text-2xl text-blue-400">MPT</p>
                    </div>
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                      <h3 className="font-bold mb-2">Network</h3>
                      <p className="text-2xl text-blue-400">BNB Chain</p>
                    </div>
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                      <h3 className="font-bold mb-2">Total Supply</h3>
                      <p className="text-2xl text-blue-400">100,000,000</p>
                    </div>
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                      <h3 className="font-bold mb-2">Initial Price</h3>
                      <p className="text-2xl text-blue-400">$0.05 USD</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tokenomics section */}
        <section id="tokenomics" className="py-16 bg-gradient-to-b from-blue-900/20 to-transparent">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="gradient-text">Tokenomics</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-gray-800/30 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Mining Rewards</CardTitle>
                  <CardDescription className="text-gray-400">25% of Total Supply</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Allocated to reward MPT token holders who stake their tokens in the mining pool.
                    Rewards are distributed proportionally to the amount staked.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/30 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Public Sale</CardTitle>
                  <CardDescription className="text-gray-400">30% of Total Supply</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Available for public purchase during token sale events.
                    Funds used for platform development, infrastructure, and marketing.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/30 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Team & Advisors</CardTitle>
                  <CardDescription className="text-gray-400">15% of Total Supply</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Allocated to the development team and advisors with a 12-month vesting period.
                    Released quarterly to ensure long-term commitment.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/30 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Liquidity Pool</CardTitle>
                  <CardDescription className="text-gray-400">10% of Total Supply</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Locked in decentralized exchanges to ensure trading liquidity.
                    Helps maintain price stability and facilitates token trading.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/30 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Community & Ecosystem</CardTitle>
                  <CardDescription className="text-gray-400">15% of Total Supply</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Reserved for community incentives, partnerships, and ecosystem growth.
                    Includes airdrops, bounties, and promotional activities.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/30 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Reserve Fund</CardTitle>
                  <CardDescription className="text-gray-400">5% of Total Supply</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Held as a strategic reserve for future development needs and unforeseen circumstances.
                    Requires community governance approval for use.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Utility section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="gradient-text">Token Utility</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Mining Power Boost</h3>
                <p className="text-gray-400">
                  Stake MPT tokens to receive a boost in mining power, increasing your Bitcoin mining rewards
                  up to 50% depending on the amount staked.
                </p>
              </div>
              
              <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Reduced Mining Fees</h3>
                <p className="text-gray-400">
                  Pay for mining subscription fees with MPT tokens and receive discounts of up to 30%
                  compared to fiat payment methods.
                </p>
              </div>
              
              <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Governance Rights</h3>
                <p className="text-gray-400">
                  Participate in platform governance decisions including new mining pool additions,
                  feature prioritization, and revenue allocation.
                </p>
              </div>
              
              <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Exclusive Access</h3>
                <p className="text-gray-400">
                  Access premium features, early mining equipment upgrades, and exclusive mining pools
                  that are only available to MPT token holders.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 bg-gradient-to-br from-blue-900/30 to-transparent">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-text">Ready to Get MPT Tokens?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Start your journey with MPT tokens today and unlock the full potential of your mining experience.
            </p>
            <Button className="btn-primary glow px-8 py-6 text-lg">
              Buy MPT Tokens
            </Button>
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
                <span className="text-xl font-bold gradient-text">KloudBugs</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for Bitcoin mining solutions with maximum efficiency and profitability.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/" className="text-gray-400 hover:text-blue-400 transition">Home</Link>
                <Link href="/mpt-token" className="text-gray-400 hover:text-blue-400 transition">MPT Token</Link>
                <Link href="/tah-info" className="text-gray-400 hover:text-blue-400 transition">TAH</Link>
                <Link href="/mining" className="text-gray-400 hover:text-blue-400 transition">Mining</Link>
                <Link href="/#roadmap" className="text-gray-400 hover:text-blue-400 transition">Roadmap</Link>
                <a 
                  href="/api/mining" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-blue-400 transition"
                >
                  Mining Portal
                </a>
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
            <p>&copy; {new Date().getFullYear()} KloudBugs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}