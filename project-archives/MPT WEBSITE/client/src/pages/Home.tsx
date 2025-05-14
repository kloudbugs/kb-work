import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Home() {
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
      
      <main>
        {/* Hero section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/30 to-transparent"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 mb-10 lg:mb-0">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="gradient-text">Revolutionize Your</span><br />
                  <span className="text-white">Crypto Mining Experience</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-xl">
                  KloudBugs provides advanced Bitcoin mining solutions with maximum efficiency 
                  and profitability. Start mining without the hassle of hardware setup and maintenance.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/mining">
                    <Button className="btn-primary glow px-8 py-6 text-lg">
                      Explore Mining Plans
                    </Button>
                  </Link>
                  <a href="/api/mining" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="px-8 py-6 text-lg">
                      Mining Dashboard
                    </Button>
                  </a>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-px bg-blue-500/20 rounded-2xl blur-xl"></div>
                  <img 
                    src="/logo1.png" 
                    alt="Mining Illustration" 
                    className="relative z-10 w-64 h-64 md:w-96 md:h-96 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="gradient-text">Why Choose KloudBugs Mining</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">High Performance</h3>
                <p className="text-gray-400">
                  Our mining infrastructure is optimized for maximum performance, 
                  ensuring the highest possible returns on your investment.
                </p>
              </div>
              
              <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Enterprise Security</h3>
                <p className="text-gray-400">
                  Your mining operations are protected with state-of-the-art 
                  security measures including redundant systems and continuous monitoring.
                </p>
              </div>
              
              <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Automated Payouts</h3>
                <p className="text-gray-400">
                  Receive your mining rewards automatically to your Bitcoin wallet 
                  with customizable payout thresholds and schedules.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-20 bg-gradient-to-br from-blue-900/30 to-transparent">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-text">Ready to Start Mining?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Choose from our flexible subscription plans and start earning Bitcoin today.
              No hardware setup, no electricity costs, no maintenance headaches.
            </p>
            <Link href="/mining">
              <Button className="btn-primary glow px-8 py-6 text-lg">
                View Mining Plans
              </Button>
            </Link>
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