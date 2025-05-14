import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBitcoin, FaLock, FaRocket } from 'react-icons/fa'

export default function Mining() {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Placeholder for authentication check
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // This will be replaced with actual API call to miner backend
        // For now just mock the subscription status
        setTimeout(() => {
          setSubscription(null) // Set to null to simulate not subscribed
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Failed to check subscription status:', error)
        setLoading(false)
      }
    }
    
    checkSubscription()
  }, [])
  
  // Function to open the miner in an iframe or redirect
  const openMiner = () => {
    // Open miner page - will be implemented
    window.open('http://localhost:5000/subscription-mining', '_blank')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  // If not subscribed, show subscription plans
  if (!subscription) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Bitcoin Mining Access
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Unleash the power of Bitcoin mining with MemeMillionaire's exclusive mining platform.
              Subscribe to gain access and start earning Bitcoin today!
            </p>
          </div>
          
          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Basic Plan */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 transition-all hover:border-yellow-500/50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full font-medium text-sm">
                STARTER
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Basic Plan</h3>
                <div className="text-3xl font-bold text-yellow-500 mb-1">$19.99<span className="text-lg text-gray-400">/month</span></div>
                <p className="text-gray-400">Get started with mining basics</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">Access to Bitcoin mining</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">1 mining device allocation</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">Basic hashrate: up to 50 H/s</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">Email support</span>
                </li>
                <li className="flex items-start text-gray-500">
                  <div className="mr-2">✗</div>
                  <span>Priority mining access</span>
                </li>
              </ul>
              <button className="w-full btn-secondary">Select Plan</button>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-8 shadow-lg shadow-yellow-500/20 transform hover:scale-105 transition-all relative z-10">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-6 py-1 rounded-full font-medium text-sm">
                POPULAR
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
                <div className="text-3xl font-bold text-yellow-500 mb-1">$49.99<span className="text-lg text-gray-400">/month</span></div>
                <p className="text-gray-400">Optimal performance for serious miners</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">Enhanced Bitcoin mining</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">3 mining device allocation</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">Advanced hashrate: up to 150 H/s</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">Priority mining access</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">24/7 support</span>
                </li>
              </ul>
              <button className="w-full btn-primary">Select Plan</button>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 transition-all hover:border-yellow-500/50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full font-medium text-sm">
                ADVANCED
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise Plan</h3>
                <div className="text-3xl font-bold text-yellow-500 mb-1">$99.99<span className="text-lg text-gray-400">/month</span></div>
                <p className="text-gray-400">Maximum power for professional miners</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">Premium Bitcoin mining access</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">Unlimited device allocation</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">Maximum hashrate: up to 500 H/s</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">VIP mining access & priority</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-gray-300">Dedicated account manager</span>
                </li>
              </ul>
              <button className="w-full btn-secondary">Select Plan</button>
            </div>
          </div>
          
          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Mining Platform Features
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="feature-card">
                <div className="bg-yellow-500/20 p-3 rounded-full w-fit mb-4">
                  <FaBitcoin className="text-yellow-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real Bitcoin Mining</h3>
                <p className="text-gray-400">
                  Mine real Bitcoin using our advanced mining infrastructure with optimized performance.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="bg-yellow-500/20 p-3 rounded-full w-fit mb-4">
                  <FaLock className="text-yellow-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Infrastructure</h3>
                <p className="text-gray-400">
                  Enterprise-grade security protecting your mining operations and wallet connections.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="bg-yellow-500/20 p-3 rounded-full w-fit mb-4">
                  <FaRocket className="text-yellow-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Performance Optimized</h3>
                <p className="text-gray-400">
                  Our platform continuously optimizes your mining performance to maximize earnings.
                </p>
              </div>
            </div>
          </div>
          
          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <h3 className="text-xl font-medium text-yellow-500 mb-2">How does the mining platform work?</h3>
                <p className="text-gray-300">
                  Our platform connects you to a powerful mining infrastructure that mines Bitcoin. Your subscription gives you access to dedicated hashpower, with all technical details managed by our system.
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-yellow-500 mb-2">When will I receive my Bitcoin payouts?</h3>
                <p className="text-gray-300">
                  Payouts occur weekly, assuming you've reached the minimum payout threshold. You can view your current earnings and pending payments in your mining dashboard.
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-yellow-500 mb-2">Can I upgrade my subscription?</h3>
                <p className="text-gray-300">
                  Yes, you can upgrade or downgrade your subscription at any time. Changes will take effect at the start of your next billing cycle.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-yellow-500 mb-2">Is technical knowledge required?</h3>
                <p className="text-gray-300">
                  No technical knowledge is necessary. Our user-friendly platform handles all the complex aspects of Bitcoin mining for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // If subscribed, show mining info and link to miner
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Your Mining Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            You have an active subscription to our Bitcoin mining platform.
            Access your miner below to start mining Bitcoin.
          </p>
        </div>
        
        <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-8 shadow-lg shadow-yellow-500/20 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Pro Mining Subscription
              </h2>
              <p className="text-gray-400">
                Subscription renews on: <span className="text-yellow-500">May 1, 2023</span>
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button className="btn-primary" onClick={openMiner}>
                Launch Mining Platform
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Current Hashrate</p>
              <p className="text-2xl font-bold text-white">125 H/s</p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Daily Earnings</p>
              <p className="text-2xl font-bold text-white">0.0025 BTC</p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Total Mined</p>
              <p className="text-2xl font-bold text-white">0.0125 BTC</p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Next Payout</p>
              <p className="text-2xl font-bold text-white">3 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}