/**
 * KLOUD BUGS Mining Command Center - ADMIN VERSION
 * Demo Mode Controller
 * 
 * This module provides simulated data for demo mode, which is used for
 * presentations, training, and sales purposes. It ensures no real wallet
 * or transaction data is used.
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Simulated mining hardware models and their specs
const MINING_HARDWARE = {
  'Antminer S19 Pro': { hashrate: 110, power: 3250 },
  'Antminer S19j Pro': { hashrate: 104, power: 3068 },
  'AvalonMiner A1166 Pro': { hashrate: 81, power: 3400 },
  'WhatsMiner M30S++': { hashrate: 112, power: 3472 },
  'Innosilicon T3+': { hashrate: 67, power: 3300 },
  'Canaan AvalonMiner 1246': { hashrate: 90, power: 3420 }
};

// Demo user data store
let demoUsers: any[] = [];
let demoMiningStats: any[] = [];
let demoPools: any[] = [];
let demoTransactions: any[] = [];
let demoDevices: any[] = [];
let demoTokensCirculating = 100000000;
let demoTokenPrice = 0.0145;

/**
 * Initialize demo data
 */
export function initializeDemoData() {
  // Generate sample users
  demoUsers = [
    {
      id: uuidv4(),
      username: 'admin_demo',
      email: 'admin@demo.com',
      role: 'ADMIN',
      status: 'Active',
      joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      lastLogin: new Date(),
      hashRate: 450,
      deviceCount: 4,
      deviceTypes: ['Antminer S19 Pro', 'WhatsMiner M30S++'],
      rewards: 0.0045,
      demoUser: true
    },
    {
      id: uuidv4(),
      username: 'john_miner',
      email: 'john@example.com',
      role: 'USER',
      status: 'Active',
      joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      hashRate: 220,
      deviceCount: 2,
      deviceTypes: ['Antminer S19 Pro'],
      rewards: 0.0023,
      demoUser: true
    },
    {
      id: uuidv4(),
      username: 'sarah_crypto',
      email: 'sarah@example.com',
      role: 'USER',
      status: 'Active',
      joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      hashRate: 112,
      deviceCount: 1,
      deviceTypes: ['WhatsMiner M30S++'],
      rewards: 0.0012,
      demoUser: true
    }
  ];
  
  // Generate mining pools
  demoPools = [
    {
      id: uuidv4(),
      name: 'KLOUD BUGS Pool',
      url: 'stratum+tcp://pool.kloudbugsmining.com:3333',
      algorithm: 'SHA-256',
      miners: 1243,
      hashrate: 156000, // TH/s
      fee: 1.0,
      status: 'Active',
      uptime: 99.98
    },
    {
      id: uuidv4(),
      name: 'TERA Mining Pool',
      url: 'stratum+tcp://pool.teramining.org:3334',
      algorithm: 'SHA-256',
      miners: 687,
      hashrate: 92000, // TH/s
      fee: 0.9,
      status: 'Active',
      uptime: 99.95
    },
    {
      id: uuidv4(),
      name: 'Justice Mining Collective',
      url: 'stratum+tcp://jmining.org:3335',
      algorithm: 'SHA-256',
      miners: 512,
      hashrate: 68000, // TH/s
      fee: 1.2,
      status: 'Active',
      uptime: 99.90
    }
  ];
  
  // Generate demo mining devices
  demoDevices = [];
  demoUsers.forEach(user => {
    user.deviceTypes.forEach((deviceType: string) => {
      demoDevices.push({
        id: uuidv4(),
        userId: user.id,
        type: deviceType,
        status: 'Online',
        hashrate: MINING_HARDWARE[deviceType as keyof typeof MINING_HARDWARE].hashrate,
        power: MINING_HARDWARE[deviceType as keyof typeof MINING_HARDWARE].power,
        temperature: Math.floor(Math.random() * 15) + 55, // 55-70°C
        efficiency: (MINING_HARDWARE[deviceType as keyof typeof MINING_HARDWARE].hashrate / 
                    MINING_HARDWARE[deviceType as keyof typeof MINING_HARDWARE].power * 1000).toFixed(2),
        uptime: Math.floor(Math.random() * 10) + 90, // 90-100%
        lastSeen: new Date(),
        poolId: demoPools[0].id,
        powerMode: 'high'
      });
    });
  });
  
  // Generate mining stats
  const now = new Date();
  demoMiningStats = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    demoMiningStats.push({
      date: date,
      totalHashrate: 750 + Math.floor(Math.random() * 50), // TH/s
      activeMiners: demoUsers.length,
      activeDevices: demoDevices.length,
      poolHashrate: 156000 + Math.floor(Math.random() * 5000),
      newUsers: i % 7 === 0 ? 1 : 0,
      tokensGenerated: 1200 + Math.floor(Math.random() * 300),
      electricityCost: 112 + Math.floor(Math.random() * 10)
    });
  }
  
  // Generate demo transactions
  demoTransactions = [];
  for (let i = 15; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    demoTransactions.push({
      id: uuidv4(),
      type: Math.random() > 0.7 ? 'Withdrawal' : 'Mining Reward',
      amount: Math.random() > 0.7 ? 
        (Math.random() * 0.002 + 0.0001).toFixed(8) : 
        (Math.random() * 0.0005 + 0.0001).toFixed(8),
      status: 'Completed',
      timestamp: date,
      fee: (Math.random() * 0.00001 + 0.000001).toFixed(8),
      confirmations: 6,
      userId: demoUsers[Math.floor(Math.random() * demoUsers.length)].id
    });
  }
  
  // Periodically update demo data to simulate real-time changes
  setInterval(updateDemoData, 60000); // Update every minute
}

/**
 * Update demo data to simulate real-time changes
 */
function updateDemoData() {
  // Update user hashrates with small variations
  demoUsers.forEach(user => {
    user.hashRate = user.hashRate * (1 + (Math.random() * 0.02 - 0.01)); // ±1%
  });
  
  // Update device parameters
  demoDevices.forEach(device => {
    device.temperature = Math.floor(Math.random() * 15) + 55; // 55-70°C
    device.hashrate = MINING_HARDWARE[device.type as keyof typeof MINING_HARDWARE].hashrate * 
                      (1 + (Math.random() * 0.05 - 0.025)); // ±2.5%
  });
  
  // Simulate token price fluctuations
  demoTokenPrice = demoTokenPrice * (1 + (Math.random() * 0.04 - 0.02)); // ±2%
  
  // Add a new transaction occasionally
  if (Math.random() > 0.7) {
    demoTransactions.push({
      id: uuidv4(),
      type: Math.random() > 0.7 ? 'Withdrawal' : 'Mining Reward',
      amount: Math.random() > 0.7 ? 
        (Math.random() * 0.002 + 0.0001).toFixed(8) : 
        (Math.random() * 0.0005 + 0.0001).toFixed(8),
      status: 'Completed',
      timestamp: new Date(),
      fee: (Math.random() * 0.00001 + 0.000001).toFixed(8),
      confirmations: Math.floor(Math.random() * 3),
      userId: demoUsers[Math.floor(Math.random() * demoUsers.length)].id
    });
  }
}

/**
 * Middleware to check if demo mode is enabled
 */
export const isDemoMode = (req: Request, res: Response, next: NextFunction) => {
  // Check if demo mode is enabled in the environment or session
  const demoModeEnabled = process.env.DEMO_MODE === 'true' || req.session.isDemoUser;
  
  if (!demoModeEnabled) {
    return res.status(403).json({ message: 'Demo mode is not enabled' });
  }
  
  next();
};

/**
 * Get demo users for admin interface
 */
export const getDemoUsers = (req: Request, res: Response) => {
  res.json({ users: demoUsers });
};

/**
 * Get demo mining statistics
 */
export const getDemoMiningStats = (req: Request, res: Response) => {
  res.json({ stats: demoMiningStats });
};

/**
 * Get demo mining pools
 */
export const getdemoPools = (req: Request, res: Response) => {
  res.json({ pools: demoPools });
};

/**
 * Get demo transactions
 */
export const getDemoTransactions = (req: Request, res: Response) => {
  res.json({ transactions: demoTransactions });
};

/**
 * Get demo devices
 */
export const getDemoDevices = (req: Request, res: Response) => {
  res.json({ devices: demoDevices });
};

/**
 * Get demo token info
 */
export const getDemoTokenInfo = (req: Request, res: Response) => {
  res.json({
    symbol: 'TERA',
    name: 'TERA Token',
    totalSupply: 10000000000,
    circulatingSupply: demoTokensCirculating,
    price: demoTokenPrice,
    marketCap: demoTokensCirculating * demoTokenPrice,
    change24h: (Math.random() * 8 - 4).toFixed(2) // -4% to +4%
  });
};

/**
 * Add a demo user
 */
export const addDemoUser = (req: Request, res: Response) => {
  const { username, email, role, deviceTypes } = req.body;
  
  const newUser = {
    id: uuidv4(),
    username,
    email,
    role,
    status: 'Active',
    joinDate: new Date(),
    lastLogin: new Date(),
    hashRate: deviceTypes.reduce((total: number, type: string) => 
      total + MINING_HARDWARE[type as keyof typeof MINING_HARDWARE].hashrate, 0),
    deviceCount: deviceTypes.length,
    deviceTypes,
    rewards: 0,
    demoUser: true
  };
  
  demoUsers.push(newUser);
  
  // Add devices for the user
  deviceTypes.forEach((deviceType: string) => {
    demoDevices.push({
      id: uuidv4(),
      userId: newUser.id,
      type: deviceType,
      status: 'Online',
      hashrate: MINING_HARDWARE[deviceType as keyof typeof MINING_HARDWARE].hashrate,
      power: MINING_HARDWARE[deviceType as keyof typeof MINING_HARDWARE].power,
      temperature: Math.floor(Math.random() * 15) + 55, // 55-70°C
      efficiency: (MINING_HARDWARE[deviceType as keyof typeof MINING_HARDWARE].hashrate / 
                  MINING_HARDWARE[deviceType as keyof typeof MINING_HARDWARE].power * 1000).toFixed(2),
      uptime: 100,
      lastSeen: new Date(),
      poolId: demoPools[0].id,
      powerMode: 'high'
    });
  });
  
  res.status(201).json({ message: 'Demo user added', user: newUser });
};

/**
 * Initialize demo mode
 */
export function initializeDemoMode() {
  console.log('Initializing demo mode...');
  initializeDemoData();
}