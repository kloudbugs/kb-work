import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TAHInfo() {
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
              <span className="gradient-text">TAH Token</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              The TAH Token ecosystem combines innovative blockchain technology with real-world utility,
              creating a sustainable model for decentralized finance and peer-to-peer transactions.
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
                    alt="TAH Token Logo" 
                    className="relative z-10 w-64 h-64 mx-auto object-contain"
                  />
                </div>
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="gradient-text">About TAH</span>
                </h2>
                <div className="space-y-6 text-gray-300">
                  <p className="text-lg">
                    TAH Token is designed to facilitate a decentralized economy, focusing on real-world 
                    applications and creating value through utility rather than speculation. 
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                      <h3 className="font-bold mb-2">Token Symbol</h3>
                      <p className="text-2xl text-blue-400">TAH</p>
                    </div>
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                      <h3 className="font-bold mb-2">Network</h3>
                      <p className="text-2xl text-blue-400">Ethereum</p>
                    </div>
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                      <h3 className="font-bold mb-2">Token Standard</h3>
                      <p className="text-2xl text-blue-400">ERC-20</p>
                    </div>
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                      <h3 className="font-bold mb-2">Total Supply</h3>
                      <p className="text-2xl text-blue-400">250,000,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Key Features section */}
        <section className="py-16 bg-gradient-to-b from-blue-900/20 to-transparent">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="gradient-text">Key Features</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-gray-800/30 border border-gray-700 h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl font-bold">Enhanced Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Built with advanced cryptographic protocols that ensure secure transactions, protecting
                    user data and funds from unauthorized access and potential threats.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/30 border border-gray-700 h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl font-bold">Fast Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Optimized for speed and efficiency, enabling near-instantaneous transfer of value 
                    between participants in the ecosystem, regardless of geographical location.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/30 border border-gray-700 h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl font-bold">Low Transaction Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Designed to keep transaction costs minimal, making TAH Token suitable for both large-scale
                    transfers and microtransactions within the ecosystem.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/30 border border-gray-700 h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl font-bold">Cross-Platform Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Seamlessly integrates with various platforms and services, including the KloudBugs mining 
                    ecosystem, creating a unified experience across the digital landscape.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/30 border border-gray-700 h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl font-bold">Community Governance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    TAH Token holders can participate in important ecosystem decisions through a 
                    decentralized voting system, ensuring the platform evolves according to community needs.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/30 border border-gray-700 h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl font-bold">Staking Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Incentivizes long-term holding by offering staking rewards to users who lock their tokens,
                    contributing to network stability and reduced market volatility.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Use Cases section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="gradient-text">TAH Token Use Cases</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-4">Mining Ecosystem</h3>
                <p className="text-gray-400">
                  TAH Tokens can be used to purchase mining equipment, pay for mining pool subscriptions,
                  and receive priority access to new mining hardware releases.
                </p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-4">Decentralized Marketplace</h3>
                <p className="text-gray-400">
                  Access to buy and sell products and services within the ecosystem's marketplace,
                  with special discounts for TAH Token users.
                </p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-4">Yield Farming</h3>
                <p className="text-gray-400">
                  Participate in yield farming programs by providing liquidity to designated pools,
                  earning additional TAH Tokens as rewards.
                </p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-4">Cross-Chain Bridge</h3>
                <p className="text-gray-400">
                  Use TAH Tokens to facilitate transfers between different blockchain networks,
                  reducing friction in cross-chain transactions.
                </p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-4">NFT Ecosystem</h3>
                <p className="text-gray-400">
                  Purchase, trade, and mint exclusive NFTs within the TAH ecosystem, with special
                  collections only available to token holders.
                </p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-4">DeFi Services</h3>
                <p className="text-gray-400">
                  Access a suite of decentralized financial services including lending, borrowing,
                  and insurance products with preferential rates.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Roadmap section */}
        <section id="roadmap" className="py-16 bg-gradient-to-b from-blue-900/20 to-transparent">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="gradient-text">TAH Token Roadmap</span>
            </h2>
            
            <div className="relative max-w-4xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500/20"></div>
              
              {/* Q1 2023 */}
              <div className="relative z-10 mb-12">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 absolute left-1/2 transform -translate-x-1/2"></div>
                  <div className="w-1/2 pr-8 text-right">
                    <h3 className="text-xl font-bold gradient-text">Q1 2023</h3>
                    <div className="mt-3 bg-gray-800/30 p-4 rounded-xl border border-gray-700 ml-auto">
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Token concept development</li>
                        <li>Market research and analysis</li>
                        <li>Team formation and structuring</li>
                      </ul>
                    </div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              </div>
              
              {/* Q2 2023 */}
              <div className="relative z-10 mb-12">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 absolute left-1/2 transform -translate-x-1/2"></div>
                  <div className="w-1/2"></div>
                  <div className="w-1/2 pl-8">
                    <h3 className="text-xl font-bold gradient-text">Q2 2023</h3>
                    <div className="mt-3 bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Smart contract development</li>
                        <li>Security audits</li>
                        <li>Testnet launch and initial testing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Q3 2023 */}
              <div className="relative z-10 mb-12">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 absolute left-1/2 transform -translate-x-1/2"></div>
                  <div className="w-1/2 pr-8 text-right">
                    <h3 className="text-xl font-bold gradient-text">Q3 2023</h3>
                    <div className="mt-3 bg-gray-800/30 p-4 rounded-xl border border-gray-700 ml-auto">
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>TAH Token mainnet launch</li>
                        <li>Initial exchange listings</li>
                        <li>Community building initiatives</li>
                      </ul>
                    </div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              </div>
              
              {/* Q4 2023 */}
              <div className="relative z-10 mb-12">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 absolute left-1/2 transform -translate-x-1/2"></div>
                  <div className="w-1/2"></div>
                  <div className="w-1/2 pl-8">
                    <h3 className="text-xl font-bold gradient-text">Q4 2023</h3>
                    <div className="mt-3 bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Staking platform release</li>
                        <li>Integration with mining ecosystem</li>
                        <li>Partnership announcements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Q1 2024 */}
              <div className="relative z-10 mb-12">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 absolute left-1/2 transform -translate-x-1/2"></div>
                  <div className="w-1/2 pr-8 text-right">
                    <h3 className="text-xl font-bold gradient-text">Q1 2024</h3>
                    <div className="mt-3 bg-gray-800/30 p-4 rounded-xl border border-gray-700 ml-auto">
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Marketplace beta launch</li>
                        <li>Mobile wallet development</li>
                        <li>Governance mechanism implementation</li>
                      </ul>
                    </div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              </div>
              
              {/* Q2 2024 */}
              <div className="relative z-10">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 absolute left-1/2 transform -translate-x-1/2"></div>
                  <div className="w-1/2"></div>
                  <div className="w-1/2 pl-8">
                    <h3 className="text-xl font-bold gradient-text">Q2 2024</h3>
                    <div className="mt-3 bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>NFT platform integration</li>
                        <li>Cross-chain bridge deployment</li>
                        <li>DeFi services expansion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 bg-gradient-to-br from-blue-900/30 to-transparent">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-text">Join the TAH Ecosystem</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Become part of a revolutionary blockchain project that's building the future of decentralized finance.
            </p>
            <Button className="btn-primary glow px-8 py-6 text-lg">
              Get TAH Tokens
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