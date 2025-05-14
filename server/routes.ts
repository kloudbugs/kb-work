/**
 * API Routes
 * 
 * This file registers all the routes for the application.
 * SECURE VERSION - No private keys, no wallet scanning.
 */

import express, { Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import session from 'express-session';
import trialRoutes from './routes/trial';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

// Declare the session type extensions
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    username?: string;
    isAdmin?: boolean;
  }
}

// Create routes function
export async function registerRoutes(app: express.Express): Promise<Server> {
  // Create a server instance
  const server = new Server(app);
  
  // Basic health check route
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });
  
  // Authentication routes
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    // Simple authentication for development
    if (username === 'admin' && password === 'admin123') {
      // Set session data
      if (req.session) {
        req.session.userId = '1';
        req.session.username = username;
        req.session.isAdmin = true;
      }
      
      // Return user data
      return res.json({
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'ADMIN',
        isAdmin: true
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
  
  // Get current user
  app.get('/api/auth/user', (req: Request, res: Response) => {
    // Check if user is authenticated
    if (req.session && req.session.userId) {
      return res.json({
        id: req.session.userId,
        username: req.session.username || 'admin',
        email: 'admin@example.com',
        role: 'ADMIN',
        isAdmin: req.session.isAdmin || false
      });
    } else {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  });
  
  // Check session status
  app.get('/api/auth/session-status', (req: Request, res: Response) => {
    res.json({
      active: !!(req.session && req.session.userId),
      userId: req.session?.userId,
      username: req.session?.username
    });
  });
  
  // Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    if (req.session) {
      req.session.destroy(() => {
        res.json({ message: 'Logged out successfully' });
      });
    } else {
      res.json({ message: 'No active session to destroy' });
    }
  });
  
  // Mining pools info route
  app.get('/api/pools', (req: Request, res: Response) => {
    console.log('Getting mining pools info');
    
    // Return mining pools from the secure mining settings
    const pools = [
      {
        id: 7,
        name: 'Unmineable',
        url: 'stratum+tcp://rx.unmineable.com:3333',
        port: 3333,
        algorithm: 'RandomX',
        created: new Date(),
        updated: new Date(),
        fee: 0.75
      },
      {
        id: 2,
        name: 'SlushPool',
        url: 'stratum+tcp://btc.slushpool.com:3333',
        port: 3333,
        algorithm: 'SHA-256',
        created: new Date(),
        updated: new Date(),
        fee: 2.0
      },
      {
        id: 3,
        name: 'F2Pool',
        url: 'stratum+tcp://btc.f2pool.com:3333',
        port: 3333,
        algorithm: 'SHA-256',
        created: new Date(),
        updated: new Date(),
        fee: 2.5
      }
    ];
    
    res.json({ pools });
  });
  
  // Wallet info route
  app.get('/api/wallet', (req: Request, res: Response) => {
    console.log('Getting wallet info');
    
    // Use a fixed mining address instead of requiring a module
    const MINING_ADDRESS = "bc1qg9xemo98e0ecnh3g8quk9ysxztj8t3mpvwa78f"; // Example wallet address
    
    // Check if user is admin
    const isAdmin = req.session && req.session.isAdmin === true;
    
    // Return wallet information with appropriate permissions
    const walletInfo = {
      address: MINING_ADDRESS,
      balance: Math.random() * 0.01, // Simulated balance
      balanceUSD: Math.random() * 300, // Simulated USD value
      payoutThreshold: '0.001',
      payoutSchedule: 'daily',
      autoPayout: true,
      canWithdrawToCustomAddress: isAdmin // Only admin can use custom withdrawal addresses
    };
    
    res.json(walletInfo);
  });
  
  // Mining stats route
  app.get('/api/mining/stats', (req: Request, res: Response) => {
    // Return mining statistics
    const stats = {
      hashRate: Math.floor(Math.random() * 10000) + 5000, // H/s
      activeMiners: Math.floor(Math.random() * 5) + 1,
      totalMined: Math.random() * 0.01,
      status: 'active',
      algorithm: 'RandomX',
      difficulty: Math.random() * 100000 + 50000,
      temperature: Math.floor(Math.random() * 30) + 50, // °C
      powerUsage: Math.floor(Math.random() * 200) + 100, // W
    };
    
    res.json(stats);
  });
  
  // Get ASIC miner types
  app.get('/api/mining/asic/types', (req: Request, res: Response) => {
    const asicTypes = [
      { id: 'antminer-s19', name: 'Antminer S19', hashRate: '95 TH/s', algorithm: 'SHA-256', power: '3250W' },
      { id: 'whatsminer-m30s', name: 'Whatsminer M30S', hashRate: '88 TH/s', algorithm: 'SHA-256', power: '3344W' },
      { id: 'avalon-1246', name: 'Avalon 1246', hashRate: '90 TH/s', algorithm: 'SHA-256', power: '3420W' },
      { id: 'antminer-s17', name: 'Antminer S17', hashRate: '56 TH/s', algorithm: 'SHA-256', power: '2520W' },
      { id: 'innosilicon-t3', name: 'Innosilicon T3', hashRate: '52 TH/s', algorithm: 'SHA-256', power: '2100W' }
    ];
    
    res.json({ asicTypes });
  });
  
  // Get mining devices
  app.get('/api/devices', (req: Request, res: Response) => {
    // Check if user is authenticated
    const isAuthenticated = req.session && req.session.userId;
    const isAdmin = req.session && req.session.isAdmin === true;
    
    if (!isAuthenticated) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Define device interface with optional admin property
    interface MiningDevice {
      id: number;
      name: string;
      type: string;
      model: string;
      status: string;
      hashRate: number;
      hashRateUnit: string;
      power: number;
      temperature: number | null;
      efficiency: number | null;
      algorithm: string;
      lastSeen: Date;
      poolId: number;
      location: string;
      isAdminOnly?: boolean; // Optional property
    }
    
    // Sample devices with varied statuses
    const devices: MiningDevice[] = [
      {
        id: 1,
        name: 'Mining Rig 01',
        type: 'gpu-rig',
        model: 'Custom Build 8x RTX 3080',
        status: 'active',
        hashRate: 720,
        hashRateUnit: 'MH/s',
        power: 2350,
        temperature: 65,
        efficiency: 3.26,
        algorithm: 'Ethash',
        lastSeen: new Date(),
        poolId: 7,
        location: 'Main Facility'
      },
      {
        id: 2,
        name: 'Antminer S19-01',
        type: 'asic',
        model: 'Antminer S19 Pro',
        status: 'active',
        hashRate: 110,
        hashRateUnit: 'TH/s',
        power: 3250,
        temperature: 72,
        efficiency: 29.55,
        algorithm: 'SHA-256',
        lastSeen: new Date(),
        poolId: 2,
        location: 'Server Room B'
      },
      {
        id: 3,
        name: 'Cloud Mining Contract',
        type: 'cloud',
        model: 'NiceHash SHA-256',
        status: 'active',
        hashRate: 50,
        hashRateUnit: 'TH/s',
        power: 0, // Cloud mining doesn't have local power consumption
        temperature: null,
        efficiency: null,
        algorithm: 'SHA-256',
        lastSeen: new Date(),
        poolId: 3,
        location: 'Cloud Provider'
      }
    ];
    
    // Add additional admin-only devices if user is admin
    if (isAdmin) {
      devices.push({
        id: 4,
        name: 'Admin Dedicated Miner',
        type: 'asic',
        model: 'Whatsminer M50',
        status: 'active',
        hashRate: 126,
        hashRateUnit: 'TH/s',
        power: 3276,
        temperature: 68,
        efficiency: 26,
        algorithm: 'SHA-256',
        lastSeen: new Date(),
        poolId: 7,
        location: 'Secure Facility',
        isAdminOnly: true
      });
    }
    
    res.json(devices);
  });
  
  // Withdrawal endpoint - with role-based permissions
  app.post('/api/wallet/withdrawal', (req: Request, res: Response) => {
    const { amount, destinationAddress } = req.body;
    const isAdmin = req.session && req.session.isAdmin === true;
    
    // Use a fixed mining address as default destination
    const MINING_ADDRESS = "bc1qg9xemo98e0ecnh3g8quk9ysxztj8t3mpvwa78f"; // Example wallet address
    
    // Validate amount
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid withdrawal amount' 
      });
    }
    
    // For non-admin users, only allow withdrawals to admin wallet
    const finalDestination = isAdmin && destinationAddress ? destinationAddress : MINING_ADDRESS;
    
    // Log withdrawal request
    console.log(`Withdrawal request: ${amount} BTC to ${finalDestination} (admin: ${isAdmin})`);
    
    // Simulate successful withdrawal
    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      transactionId: `tx_${Date.now().toString(36)}`,
      amount,
      destinationAddress: finalDestination,
      estimatedCompletionTime: new Date(Date.now() + 3600000) // 1 hour from now
    });
  });
  
  // Payout history endpoint
  app.get('/api/payouts', (req: Request, res: Response) => {
    const isAdmin = req.session && req.session.isAdmin === true;
    const MINING_ADDRESS = "bc1qg9xemo98e0ecnh3g8quk9ysxztj8t3mpvwa78f"; // Example wallet address
    
    // Generate some sample payout history
    const payouts = [
      {
        id: 1,
        userId: 1,
        amount: "0.00158",
        txHash: "3f7d56f83dc2259db932654f5c4d7db3fc4f4a4d5241bbc05b45d5b8edefc441",
        walletAddress: MINING_ADDRESS,
        timestamp: new Date(Date.now() - 86400000 * 7), // 7 days ago
        status: "completed",
        sourceAddress: "Unmineable Pool",
        destinationAddress: MINING_ADDRESS
      },
      {
        id: 2,
        userId: 1,
        amount: "0.00237",
        txHash: "8a91f4b5c72d9f3fb8ec679fe497bd6fa2c5d3256735279f896d8961ad9c68b4",
        walletAddress: MINING_ADDRESS,
        timestamp: new Date(Date.now() - 86400000 * 14), // 14 days ago
        status: "completed",
        sourceAddress: "Unmineable Pool",
        destinationAddress: MINING_ADDRESS
      }
    ];
    
    // If admin, add some admin-specific withdrawal examples
    if (isAdmin) {
      payouts.push({
        id: 3,
        userId: 1,
        amount: "0.01500",
        txHash: "6e9d4e54f98cb45b25f5ac50f7cafb8c123af1bcce77d79e07960db13ceed0c8",
        walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", // Example external address
        timestamp: new Date(Date.now() - 86400000 * 3), // 3 days ago
        status: "completed",
        sourceAddress: MINING_ADDRESS,
        destinationAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
      });
    }
    
    res.json(payouts);
  });
  
  // Use the trial routes
  app.use('/api/trial', trialRoutes);
  
  // Use the auth routes (but keep the existing /api/auth/login for backward compatibility)
  app.use('/api/auth', authRoutes);
  
  // Add admin routes
  app.use('/api/admin', adminRoutes);
  
  console.log('Registration system registered but DISABLED by default');
  console.log('To enable, set REGISTRATION_ENABLED=true in server/routes/auth.ts');
  console.log('And set APPROVAL_SYSTEM_ENABLED=true in server/routes/admin.ts');
  
  // Return the server
  return server;
}

// Set up website routes
export function setupWebsiteRoutes(app: express.Express): void {
  console.log('Setting up website routes');
  
  // Serve static website routes
  app.get('/website/*', (req: Request, res: Response) => {
    // Forward to client-side routing
    res.redirect('/');
  });
  
  // Make "?" folder accessible and downloadable
  app.use('/docs', express.static('./?'));
  
  // Documentation download route for single files
  app.get('/api/documentation/download/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = path.join('./?', filename);
    
    console.log(`Documentation download requested: ${filename}`);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error(`Error sending documentation file ${filename}:`, err);
          res.status(500).send('Error downloading documentation');
        }
      });
    } else {
      res.status(404).send('Documentation file not found');
    }
  });
}

// Set up WebSocket server
export function setupWebSocketServer(server: Server): void {
  console.log('Setting up WebSocket server...');
  // Basic WebSocket server implementation (dummy version)
}

// Serve static files in production
export function serveStatic(app: express.Express): void {
  console.log('Setting up static file serving');
  app.use(express.static('client/dist'));
}