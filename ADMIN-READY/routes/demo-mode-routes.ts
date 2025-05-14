/**
 * KLOUD BUGS MINING COMMAND CENTER - Demo Mode Routes
 * 
 * This file contains API routes specifically for the demonstration mode
 * of the platform, providing simulated data and functionality.
 */

import { Router, Request, Response } from 'express';
import { 
  authenticateDemoUser, 
  isDemoUser, 
  demoModeMiddleware,
  getSimulatedMiningStats,
  getSimulatedUsers,
  getSimulatedTokenStats,
  getSimulatedImpactMetrics
} from '../lib/demo-mode-controller';

const router = Router();

// Apply demo mode middleware to all routes
router.use(demoModeMiddleware);

/**
 * Demo mode authentication
 */
router.post('/auth/demo-login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  const result = authenticateDemoUser(username, password);
  
  if (result.success && result.userId) {
    // Set user session
    req.session.userId = result.userId;
    req.session.isAdmin = true;
    req.session.isDemoUser = true;
    
    return res.json({
      success: true,
      message: 'Demo login successful',
      user: {
        id: result.userId,
        username: username,
        role: 'admin',
        isDemoUser: true
      },
      demoMode: true
    });
  } else {
    return res.status(401).json({
      success: false,
      message: result.message || 'Demo login failed',
      demoMode: true
    });
  }
});

/**
 * Demo mode status check
 */
router.get('/demo/status', (req: Request, res: Response) => {
  const isDemoSession = req.session?.isDemoUser === true;
  
  res.json({
    demoMode: true,
    active: isDemoSession,
    version: '1.0.0',
    restrictions: isDemoSession ? {
      maxTransactionAmount: 0,
      sensitiveOperationsDisabled: true,
      dataNotPersisted: true
    } : null
  });
});

/**
 * Simulated mining statistics
 */
router.get('/demo/mining/stats', (req: Request, res: Response) => {
  res.json(getSimulatedMiningStats());
});

/**
 * Simulated users list
 */
router.get('/demo/users', (req: Request, res: Response) => {
  const count = parseInt(req.query.count as string) || 10;
  const maxCount = 100;
  
  res.json({
    users: getSimulatedUsers(Math.min(count, maxCount)),
    total: 250,
    page: parseInt(req.query.page as string) || 1,
    demoMode: true
  });
});

/**
 * Simulated token data
 */
router.get('/demo/tokens', (req: Request, res: Response) => {
  res.json(getSimulatedTokenStats());
});

/**
 * Simulated social impact data
 */
router.get('/demo/impact', (req: Request, res: Response) => {
  res.json(getSimulatedImpactMetrics());
});

/**
 * Simulated AI system status
 */
router.get('/demo/ai/status', (req: Request, res: Response) => {
  res.json({
    status: 'active',
    version: '3.2.1',
    models: [
      { name: 'Mining Optimizer', status: 'operational', efficiency: 92.5 },
      { name: 'Token Distribution', status: 'operational', efficiency: 95.7 },
      { name: 'Security Monitor', status: 'operational', efficiency: 98.1 },
      { name: 'Community Engagement', status: 'learning', efficiency: 87.3 }
    ],
    lastTraining: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    nextTraining: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    learningRate: 0.0025,
    precision: 0.9832,
    demoMode: true
  });
});

/**
 * Demo wallet operations (simulated)
 */
router.get('/demo/wallet', (req: Request, res: Response) => {
  res.json({
    address: '1DEMO123456789ABCDEFGHJKLMNOPQRST',
    balance: 5.72,
    transactions: [
      { id: 'tx1', type: 'mining_reward', amount: 0.25, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'confirmed' },
      { id: 'tx2', type: 'mining_reward', amount: 0.18, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'confirmed' },
      { id: 'tx3', type: 'withdrawal', amount: -0.5, timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'confirmed' }
    ],
    demoMode: true
  });
});

/**
 * Demo wallet transfer (always returns success without actual transfer)
 */
router.post('/demo/wallet/transfer', (req: Request, res: Response) => {
  const { amount, destination } = req.body;
  
  // Validate request
  if (!amount || !destination) {
    return res.status(400).json({
      success: false,
      message: 'Invalid transfer request',
      demoMode: true
    });
  }
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      success: true,
      message: 'Demo transfer simulated successfully',
      transaction: {
        id: `demo_tx_${Date.now()}`,
        amount: parseFloat(amount),
        destination,
        fee: 0.0001,
        timestamp: new Date().toISOString(),
        status: 'simulated'
      },
      demoMode: true
    });
  }, 1500);
});

/**
 * Demo system alerts
 */
router.get('/demo/alerts', (req: Request, res: Response) => {
  res.json({
    alerts: [
      { id: 'a1', type: 'info', message: 'Demo mode is active', timestamp: new Date().toISOString() },
      { id: 'a2', type: 'warning', message: 'No real transactions are being processed', timestamp: new Date().toISOString() },
      { id: 'a3', type: 'info', message: 'System demonstration is using simulated data', timestamp: new Date().toISOString() }
    ],
    demoMode: true
  });
});

export default router;