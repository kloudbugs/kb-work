import React from 'react'
import LoginForm from '../components/LoginForm'
import { Link } from 'react-router-dom'
import { FaLock, FaBitcoin, FaUserShield } from 'react-icons/fa'

export default function Login() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Mining Portal Access
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Enter your mining credentials to access the exclusive Bitcoin mining platform.
              Only MemeMillionaire subscribers can access this section.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
                  <FaLock className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Secure Access</h3>
                  <p className="text-gray-400">
                    Your mining credentials are securely stored and encrypted.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
                  <FaBitcoin className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Bitcoin Mining</h3>
                  <p className="text-gray-400">
                    Access our advanced Bitcoin mining infrastructure with your subscription.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
                  <FaUserShield className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Subscriber Exclusive</h3>
                  <p className="text-gray-400">
                    Don't have access? Purchase a subscription to receive your login details.
                  </p>
                </div>
              </div>
            </div>
            
            <Link to="/mining" className="btn-secondary inline-block">
              Back to Subscription Plans
            </Link>
          </div>
          
          <div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}