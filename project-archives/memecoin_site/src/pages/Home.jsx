import React from 'react'
import { Link } from 'react-router-dom'
import { FaRocket, FaCoins, FaChartLine, FaShieldAlt } from 'react-icons/fa'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                The Next Generation 
                <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Meme Coin
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                MemeMillionaire combines the viral appeal of meme coins with 
                real utility and sustainable tokenomics. Join the revolution.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/about" className="btn-primary text-center">
                  Learn More
                </Link>
                <Link to="/mining" className="btn-secondary text-center">
                  Start Mining
                </Link>
              </div>
            </div>
            <div className="hero-animate">
              <img 
                src="/logo.png" 
                alt="MemeMillionaire Coin" 
                className="w-3/4 mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Key Features
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card">
              <div className="bg-yellow-500/20 p-3 rounded-full w-fit mb-4">
                <FaRocket className="text-yellow-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Hyper Growth</h3>
              <p className="text-gray-400">
                Our tokenomics are designed for sustainable growth and long-term value creation.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="bg-yellow-500/20 p-3 rounded-full w-fit mb-4">
                <FaCoins className="text-yellow-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real Utility</h3>
              <p className="text-gray-400">
                Not just a meme coin. Our token powers a complete ecosystem of products and services.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="bg-yellow-500/20 p-3 rounded-full w-fit mb-4">
                <FaChartLine className="text-yellow-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Mining Platform</h3>
              <p className="text-gray-400">
                Earn Bitcoin through our exclusive mining platform available to token holders.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="bg-yellow-500/20 p-3 rounded-full w-fit mb-4">
                <FaShieldAlt className="text-yellow-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Strong Security</h3>
              <p className="text-gray-400">
                Fully audited smart contracts and transparent team with long-term vision.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tokenomics Preview */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Tokenomics
                </span>
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Our tokenomics are designed for long-term sustainability, not quick pumps and dumps.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="text-yellow-500 mr-2">•</div>
                  <span className="text-gray-300">Total Supply: 1,000,000,000 MM</span>
                </li>
                <li className="flex items-start">
                  <div className="text-yellow-500 mr-2">•</div>
                  <span className="text-gray-300">40% Public Sale</span>
                </li>
                <li className="flex items-start">
                  <div className="text-yellow-500 mr-2">•</div>
                  <span className="text-gray-300">20% Mining Rewards</span>
                </li>
                <li className="flex items-start">
                  <div className="text-yellow-500 mr-2">•</div>
                  <span className="text-gray-300">20% Development Fund</span>
                </li>
                <li className="flex items-start">
                  <div className="text-yellow-500 mr-2">•</div>
                  <span className="text-gray-300">10% Marketing</span>
                </li>
                <li className="flex items-start">
                  <div className="text-yellow-500 mr-2">•</div>
                  <span className="text-gray-300">10% Team (1-year vesting)</span>
                </li>
              </ul>
              <Link to="/tokenomics" className="btn-secondary inline-block">
                View Full Tokenomics
              </Link>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <div className="relative aspect-square w-full">
                <div className="absolute inset-0 rounded-full border-8 border-yellow-500/20 flex items-center justify-center text-center">
                  <div className="absolute h-1/2 w-1/2 bg-yellow-500 rounded-full opacity-20 animate-pulse"></div>
                  <h3 className="text-xl font-bold text-yellow-500 relative z-10">Total Supply</h3>
                  <p className="text-3xl font-bold text-white relative z-10">1B</p>
                </div>
                <div className="absolute top-0 right-0 h-1/3 w-1/3 bg-yellow-500/80 rounded-full transform translate-x-1/4 -translate-y-1/4 flex items-center justify-center">
                  <p className="text-black font-bold">40%</p>
                  <p className="text-black text-xs">Public</p>
                </div>
                <div className="absolute bottom-0 right-0 h-1/4 w-1/4 bg-yellow-600/80 rounded-full transform translate-x-1/4 translate-y-1/4 flex items-center justify-center">
                  <p className="text-black font-bold">10%</p>
                  <p className="text-black text-xs">Team</p>
                </div>
                <div className="absolute bottom-0 left-0 h-1/4 w-1/4 bg-yellow-700/80 rounded-full transform -translate-x-1/4 translate-y-1/4 flex items-center justify-center">
                  <p className="text-black font-bold">10%</p>
                  <p className="text-black text-xs">Marketing</p>
                </div>
                <div className="absolute top-0 left-0 h-1/3 w-1/3 bg-yellow-400/80 rounded-full transform -translate-x-1/4 -translate-y-1/4 flex items-center justify-center">
                  <p className="text-black font-bold">20%</p>
                  <p className="text-black text-xs">Mining</p>
                </div>
                <div className="absolute top-1/2 left-0 h-1/4 w-1/4 bg-yellow-300/80 rounded-full transform -translate-x-1/3 -translate-y-1/2 flex items-center justify-center">
                  <p className="text-black font-bold">20%</p>
                  <p className="text-black text-xs">Dev</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-yellow-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join the MemeMillionaire Community?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Don't miss out on the next big thing in the crypto space.
            Join our community today and be part of the MemeMillionaire revolution.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/mining" className="btn-primary">
              Start Mining Now
            </Link>
            <a 
              href="#" 
              className="btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Our Discord
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}