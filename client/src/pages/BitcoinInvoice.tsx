import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import WebsiteLayout from '@/components/website/WebsiteLayout';
import { qrCodeStyles } from '@/lib/qrCodeStyles';
import { AnimatePresence, motion } from 'framer-motion';

export default function BitcoinInvoice() {
  const [, setLocation] = useLocation();
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [invoiceId] = useState(() => Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
  const [copySuccess, setCopySuccess] = useState(false);
  const bitcoinAddress = 'bc1qg9xemo98e0ecnh3g8quk9ysxztj8t3mpvw6d0q'; // Example address - use real one from config
  const amount = 0.0025; // BTC amount for subscription
  
  // QR code data
  const qrData = `bitcoin:${bitcoinAddress}?amount=${amount}&label=KLOUD+BUGS+Mining+Subscription`;

  // Update countdown
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Copy bitcoin address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(bitcoinAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };
  
  // Simulate checking for payment (in a real app, this would be replaced with actual backend calls)
  const checkPaymentStatus = () => {
    // In a real implementation, this would check if payment is received
    // For demo, we'll just redirect to login page
    setLocation('/login');
  };
  
  return (
    <WebsiteLayout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-md mx-auto bg-black/40 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden p-6 border border-blue-500/30">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-purple-400">Bitcoin Payment</h2>
              <p className="mt-2 text-sm text-gray-400">Invoice #{invoiceId}</p>
            </div>
            
            {/* Status Badge */}
            <div className="bg-yellow-900/40 border border-yellow-500/40 rounded-md p-3 flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-yellow-500 mr-2 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-yellow-400">Awaiting Payment</span>
              </div>
              <span className="text-sm font-mono text-yellow-300">{formatTime(countdown)}</span>
            </div>
            
            {/* Payment Info */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Send exactly</p>
                <p className="text-2xl font-mono font-bold text-orange-500">{amount} BTC</p>
                <p className="text-xs text-gray-500 mt-1">≈ $199 USD</p>
              </div>
              
              {/* QR Code */}
              <div className="flex justify-center py-4">
                <div className="bg-white p-2 rounded-lg">
                  <div 
                    className="h-56 w-56" 
                    dangerouslySetInnerHTML={{ 
                      __html: qrCodeStyles.replace('{{data}}', encodeURIComponent(qrData)) 
                    }}
                  />
                </div>
              </div>
              
              {/* Bitcoin Address */}
              <div className="bg-gray-800/60 rounded-md p-3">
                <p className="text-xs text-gray-400 mb-1">Send to this address:</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono text-gray-300 truncate mr-2">{bitcoinAddress}</p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-7 text-xs"
                  >
                    {copySuccess ? (
                      <svg className="h-4 w-4 text-green-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                      </svg>
                    )}
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* User Wallet Address Section */}
            <div className="bg-gray-800/60 rounded-md p-3 mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Enter your wallet address for mining rewards:</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-400 hover:text-blue-300 text-xs h-7 px-2"
                  onClick={() => alert('Wallet connection will be implemented')}
                >
                  Connect Wallet
                </Button>
              </div>
              <input 
                type="text" 
                placeholder="Your Bitcoin wallet address"
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">We'll use this address to configure your mining account</p>
            </div>
            
            {/* Important Notes */}
            <div className="text-xs text-gray-500 space-y-2 mt-4">
              <p>• Send Bitcoin (BTC) only from a wallet that you control</p>
              <p>• Payment will be detected automatically</p>
              <p>• This invoice will expire in {formatTime(countdown)}</p>
              <p className="text-green-500/70">• All transaction fees are covered by the platform</p>
            </div>
            
            {/* Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={checkPaymentStatus}
              >
                I've Sent the Payment
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full text-gray-400 border-gray-700 hover:bg-gray-800"
                onClick={() => setLocation('/home')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
}