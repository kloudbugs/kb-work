/**
 * KLOUD BUGS Mining Command Center - Guardian Version
 * API Routes
 * 
 * This file contains all API routes for the owner version with full access
 * including secure wallet system and transaction processing.
 * 
 * SECURITY NOTICE: This file contains sensitive wallet routes and should
 * never be exposed in public deployments.
 */

import express from 'express';
import { Request, Response } from 'express';
import * as cryptoUtils from './utils/crypto';
import * as storage from './storage';
import * as adminController from './controllers/admin-controller';
import * as userController from './controllers/user-controller';
import * as miningController from './controllers/mining-controller';
import * as tokenController from './controllers/token-controller';
import * as walletController from './controllers/wallet-controller';
import * as statsController from './controllers/stats-controller';
import * as systemController from './controllers/system-controller';
import * as securityController from './controllers/security-controller';
import * as aiController from './controllers/ai-controller';
import * as communityController from './controllers/community-controller';
import * as transactionController from './controllers/transaction-controller';
import { isAuthenticated, isAdmin, isOwner, hasActiveSubscription } from './middleware/auth';
import { validateRequest } from './middleware/validation';
import { z } from 'zod';

const router = express.Router();

// Authentication routes
router.post('/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  try {
    const user = await userController.authenticateUser(username, password);
    
    if (user) {
      req.session.userId = user.id;
      req.session.isAdmin = user.role === 'ADMIN' || user.role === 'OWNER';
      req.session.isOwner = user.role === 'OWNER';
      
      return res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Authentication failed' });
  }
});

router.post('/auth/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/auth/user', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const user = await userController.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'ADMIN' || user.role === 'OWNER',
      isOwner: user.role === 'OWNER',
      hasActiveSubscription: await userController.checkUserSubscription(userId)
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

// User management routes (admin only)
router.get('/users', isAdmin, async (req: Request, res: Response) => {
  try {
    const users = await userController.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/users/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const user = await userController.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

router.post('/users', isAdmin, async (req: Request, res: Response) => {
  try {
    const newUser = await userController.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

router.put('/users/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const updatedUser = await userController.updateUser(req.params.id, req.body);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Mining routes
router.get('/mining/stats', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const stats = await miningController.getUserMiningStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching mining stats:', error);
    res.status(500).json({ message: 'Failed to fetch mining statistics' });
  }
});

router.get('/mining/global', async (req: Request, res: Response) => {
  try {
    const stats = await miningController.getGlobalMiningStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching global mining stats:', error);
    res.status(500).json({ message: 'Failed to fetch global mining statistics' });
  }
});

router.get('/mining/rewards', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const rewards = await miningController.getUserMiningRewards(userId);
    res.json(rewards);
  } catch (error) {
    console.error('Error fetching mining rewards:', error);
    res.status(500).json({ message: 'Failed to fetch mining rewards' });
  }
});

// Wallet routes (owner only)
router.get('/wallet', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const wallet = await walletController.getUserWallet(userId);
    res.json(wallet);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ message: 'Failed to fetch wallet' });
  }
});

router.get('/wallet/balance', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const balance = await walletController.getWalletBalance(userId);
    res.json({ balance });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ message: 'Failed to fetch wallet balance' });
  }
});

router.get('/wallet/transactions', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const transactions = await walletController.getWalletTransactions(userId);
    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    res.status(500).json({ message: 'Failed to fetch wallet transactions' });
  }
});

// Transaction routes (owner only)
router.post('/wallet/transfer', isOwner, async (req: Request, res: Response) => {
  try {
    const { destinationAddress, amount, fee } = req.body;
    
    if (!destinationAddress || !amount) {
      return res.status(400).json({ message: 'Destination address and amount are required' });
    }
    
    const result = await transactionController.createTransfer(destinationAddress, amount, fee);
    res.json(result);
  } catch (error) {
    console.error('Error creating transfer:', error);
    res.status(500).json({ message: 'Failed to create transfer' });
  }
});

router.post('/wallet/sign', isOwner, async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.body;
    
    if (!transactionId) {
      return res.status(400).json({ message: 'Transaction ID is required' });
    }
    
    const result = await transactionController.signTransaction(transactionId);
    res.json(result);
  } catch (error) {
    console.error('Error signing transaction:', error);
    res.status(500).json({ message: 'Failed to sign transaction' });
  }
});

router.post('/wallet/broadcast', isOwner, async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.body;
    
    if (!transactionId) {
      return res.status(400).json({ message: 'Transaction ID is required' });
    }
    
    const result = await transactionController.broadcastTransaction(transactionId);
    res.json(result);
  } catch (error) {
    console.error('Error broadcasting transaction:', error);
    res.status(500).json({ message: 'Failed to broadcast transaction' });
  }
});

// AI system routes (admin/owner only)
router.get('/ai/status', isAdmin, async (req: Request, res: Response) => {
  try {
    const status = await aiController.getAISystemStatus();
    res.json(status);
  } catch (error) {
    console.error('Error fetching AI status:', error);
    res.status(500).json({ message: 'Failed to fetch AI system status' });
  }
});

router.post('/ai/train', isAdmin, async (req: Request, res: Response) => {
  try {
    const { modelId, parameters } = req.body;
    const result = await aiController.trainAIModel(modelId, parameters);
    res.json(result);
  } catch (error) {
    console.error('Error training AI model:', error);
    res.status(500).json({ message: 'Failed to train AI model' });
  }
});

router.post('/ai/optimize', isAdmin, async (req: Request, res: Response) => {
  try {
    const { target, parameters } = req.body;
    const result = await aiController.optimizeSystem(target, parameters);
    res.json(result);
  } catch (error) {
    console.error('Error optimizing system:', error);
    res.status(500).json({ message: 'Failed to optimize system' });
  }
});

// System routes (owner only)
router.get('/system/status', isAdmin, async (req: Request, res: Response) => {
  try {
    const status = await systemController.getSystemStatus();
    res.json(status);
  } catch (error) {
    console.error('Error fetching system status:', error);
    res.status(500).json({ message: 'Failed to fetch system status' });
  }
});

router.get('/system/logs', isAdmin, async (req: Request, res: Response) => {
  try {
    const { type, limit } = req.query;
    const logs = await systemController.getSystemLogs(type as string, parseInt(limit as string) || 100);
    res.json({ logs });
  } catch (error) {
    console.error('Error fetching system logs:', error);
    res.status(500).json({ message: 'Failed to fetch system logs' });
  }
});

// Secure wallet configuration (owner only)
router.get('/secure-wallet/status', isOwner, async (req: Request, res: Response) => {
  try {
    const status = await walletController.getSecureWalletStatus();
    res.json(status);
  } catch (error) {
    console.error('Error fetching secure wallet status:', error);
    res.status(500).json({ message: 'Failed to fetch secure wallet status' });
  }
});

router.post('/secure-wallet/initialize', isOwner, async (req: Request, res: Response) => {
  try {
    const result = await walletController.initializeSecureWallet();
    res.json(result);
  } catch (error) {
    console.error('Error initializing secure wallet:', error);
    res.status(500).json({ message: 'Failed to initialize secure wallet' });
  }
});

router.post('/secure-wallet/backup', isOwner, async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    const result = await walletController.createWalletBackup(password);
    res.json(result);
  } catch (error) {
    console.error('Error creating wallet backup:', error);
    res.status(500).json({ message: 'Failed to create wallet backup' });
  }
});

// Security routes (admin/owner only)
router.get('/security/audit-log', isOwner, async (req: Request, res: Response) => {
  try {
    const logs = await securityController.getAuditLogs();
    res.json({ logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
});

router.get('/security/access-log', isOwner, async (req: Request, res: Response) => {
  try {
    const logs = await securityController.getAccessLogs();
    res.json({ logs });
  } catch (error) {
    console.error('Error fetching access logs:', error);
    res.status(500).json({ message: 'Failed to fetch access logs' });
  }
});

router.post('/security/keys/rotate', isOwner, async (req: Request, res: Response) => {
  try {
    const result = await securityController.rotateSecurityKeys();
    res.json(result);
  } catch (error) {
    console.error('Error rotating security keys:', error);
    res.status(500).json({ message: 'Failed to rotate security keys' });
  }
});

// Include all routes from admin and public versions
import adminRoutes from '../routes/admin-routes';
import publicRoutes from '../routes/public-routes';

// Mount admin routes
router.use('/admin', adminRoutes);

// Mount public routes
router.use('/public', publicRoutes);

export default router;