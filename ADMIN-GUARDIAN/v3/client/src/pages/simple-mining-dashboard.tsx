import React from 'react';

export default function SimpleMiningDashboard() {
  const walletAddress = 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6';
  const referralCode = '1784277766';
  
  const miningPools = [
    {
      name: "NiceHash",
      url: "stratum+tcp://sha256.usa.nicehash.com:3334",
      user: `${walletAddress}.AORUS15`,
      password: "x",
      notes: "No API key required",
      algorithm: "SHA-256",
      expectedHashrate: "Varies based on hardware"
    },
    {
      name: "Unmineable",
      url: "rx.unmineable.com:3333",
      user: `BTC:${walletAddress}.AORUS15#${referralCode}`,
      password: "x",
      notes: `Referral code ${referralCode} gives 0.25% fee reduction`,
      algorithm: "RandomX (CPU mining)",
      expectedHashrate: "2000-8000 H/s on laptop CPU"
    },
    {
      name: "Slush Pool / Braiins Pool",
      url: "stratum+tcp://stratum.slushpool.com:3333",
      user: `${walletAddress}.AORUS15`,
      password: "x",
      notes: "Established since 2010, very reliable",
      algorithm: "SHA-256",
      expectedHashrate: "Varies based on hardware"
    },
    {
      name: "F2Pool",
      url: "stratum+tcp://btc.f2pool.com:3333",
      user: `${walletAddress}.AORUS15`,
      password: "x",
      notes: "Low fees (2.5% for BTC)",
      algorithm: "SHA-256",
      expectedHashrate: "Varies based on hardware"
    }
  ];
  
  const ghostFeatherInfo = {
    description: "Creates 100 virtual mining rigs with total hashrate of ~45 TH/s",
    benefits: [
      "Test TERA Guardian without actual hardware",
      "Simulate mining profitability and pool management",
      "Try different configurations risk-free",
      "Experiment with multiple mining pools"
    ]
  };
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">TERA Mining Dashboard</h1>
      <p className="text-gray-600 mb-6">AI-powered mining configuration and control panel</p>
      
      <div className="mb-8 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Your Bitcoin Wallet</h2>
        <p className="font-mono bg-white p-2 rounded">{walletAddress}</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Mining Pool Configurations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {miningPools.map((pool, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md bg-white">
              <h3 className="text-lg font-semibold mb-2">{pool.name}</h3>
              <div className="mb-3">
                <span className="text-sm text-gray-500">Pool URL:</span>
                <div className="bg-gray-100 p-2 rounded font-mono text-sm">{pool.url}</div>
              </div>
              <div className="mb-3">
                <span className="text-sm text-gray-500">Worker:</span>
                <div className="bg-gray-100 p-2 rounded font-mono text-sm">{pool.user}</div>
              </div>
              <div className="mb-3">
                <span className="text-sm text-gray-500">Password:</span>
                <div className="bg-gray-100 p-2 rounded font-mono text-sm">{pool.password}</div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Algorithm:</span> {pool.algorithm}
              </div>
              <div className="text-sm mb-2">
                <span className="font-medium">Expected hashrate:</span> {pool.expectedHashrate}
              </div>
              <div className="text-sm text-blue-600">{pool.notes}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Mobile Mining Support</h2>
        <div className="border rounded-lg p-4 bg-white">
          <p className="mb-4">Mine from any device - smartphone, tablet or laptop</p>
          <div className="mb-3">
            <h3 className="font-medium">For smartphones & tablets:</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Download Unmineable app from App/Play Store</li>
              <li>Enter your wallet and referral code</li>
              <li>Start mining with one tap</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium">For your Aorus 15 laptop:</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Optimized XMRig configuration for your CPU</li>
              <li>Power management to prevent overheating</li>
              <li>Expected hashrate: 4,000-7,000 H/s</li>
              <li>Daily earnings: ~0.00002000-0.00003500 BTC</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Ghost Feather Feature</h2>
        <div className="border rounded-lg p-4 bg-white">
          <p className="mb-4">{ghostFeatherInfo.description}</p>
          <h3 className="font-medium mb-2">Benefits:</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ghostFeatherInfo.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <button className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded hover:opacity-90">
            Activate Ghost Feather
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">TERA Guardian AI System</h2>
        <div className="border rounded-lg p-4 bg-white">
          <p className="mb-4">AI-powered security and optimization system for your mining operations</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-100 rounded">
              <h3 className="font-medium mb-1">Transaction Security</h3>
              <p className="text-sm">Verifies all blockchain transactions and protects against fraud</p>
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <h3 className="font-medium mb-1">Mining Optimization</h3>
              <p className="text-sm">Adjusts settings for maximum profitability and efficiency</p>
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <h3 className="font-medium mb-1">Automatic Pool Switching</h3>
              <p className="text-sm">Moves mining power to the most profitable pools</p>
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <h3 className="font-medium mb-1">Hardware Protection</h3>
              <p className="text-sm">Monitors temperature and prevents overheating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}