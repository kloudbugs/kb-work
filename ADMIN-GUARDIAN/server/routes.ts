/**
 * KLOUD BUGS Mining Command Center - Admin Version
 * API Routes
 * 
 * This file contains all API routes for the admin version.
 * It does NOT include wallet or transaction signing routes.
 */

import express from 'express';
import { Request, Response } from 'express';
import * as cryptoUtils from './utils/crypto';
import * as storage from './storage';
import * as adminController from './controllers/admin-controller';
import * as userController from './controllers/user-controller';
import * as miningController from './controllers/mining-controller';
import * as tokenController from './controllers/token-controller';
import * as statsController from './controllers/stats-controller';
import * as systemController from './controllers/system-controller';
import * as securityController from './controllers/security-controller';
import * as aiController from './controllers/ai-controller';
import * as communityController from './controllers/community-controller';
import { isAuthenticated, isAdmin, hasActiveSubscription } from './middleware/auth';
import { validateRequest } from './middleware/validation';
import { z } from 'zod';
import demoModeRoutes from '../routes/demo-mode-routes';

const router = express.Router();

// Demo mode routes
router.use('/demo', demoModeRoutes);

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
      req.session.isAdmin = user.role === 'ADMIN';
      
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
      isAdmin: user.role === 'ADMIN',
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

router.post('/mining/start', isAuthenticated, hasActiveSubscription, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const { deviceId, hashPower } = req.body;
    
    const result = await miningController.startMining(userId, deviceId, hashPower);
    res.json(result);
  } catch (error) {
    console.error('Error starting mining:', error);
    res.status(500).json({ message: 'Failed to start mining' });
  }
});

router.post('/mining/stop', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const { deviceId } = req.body;
    
    const result = await miningController.stopMining(userId, deviceId);
    res.json(result);
  } catch (error) {
    console.error('Error stopping mining:', error);
    res.status(500).json({ message: 'Failed to stop mining' });
  }
});

// Devices routes
router.get('/devices', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const devices = await miningController.getUserDevices(userId);
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ message: 'Failed to fetch devices' });
  }
});

router.post('/devices', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const newDevice = await miningController.addUserDevice(userId, req.body);
    res.status(201).json(newDevice);
  } catch (error) {
    console.error('Error adding device:', error);
    res.status(500).json({ message: 'Failed to add device' });
  }
});

// Pool routes
router.get('/pools', async (req: Request, res: Response) => {
  try {
    const pools = await miningController.getMiningPools();
    res.json({ pools });
  } catch (error) {
    console.error('Error fetching pools:', error);
    res.status(500).json({ message: 'Failed to fetch mining pools' });
  }
});

// Token routes (no actual wallet operations)
router.get('/tokens/tera/info', async (req: Request, res: Response) => {
  try {
    const info = await tokenController.getTeraTokenInfo();
    res.json(info);
  } catch (error) {
    console.error('Error fetching token info:', error);
    res.status(500).json({ message: 'Failed to fetch token information' });
  }
});

router.get('/tokens/tera/price', async (req: Request, res: Response) => {
  try {
    const price = await tokenController.getTeraTokenPrice();
    res.json({ price });
  } catch (error) {
    console.error('Error fetching token price:', error);
    res.status(500).json({ message: 'Failed to fetch token price' });
  }
});

// AI system routes
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

// System routes (admin only)
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

router.post('/system/backup', isAdmin, async (req: Request, res: Response) => {
  try {
    const result = await systemController.createSystemBackup();
    res.json(result);
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ message: 'Failed to create system backup' });
  }
});

// Analytics routes
router.get('/analytics/user-growth', isAdmin, async (req: Request, res: Response) => {
  try {
    const data = await statsController.getUserGrowthStats();
    res.json(data);
  } catch (error) {
    console.error('Error fetching user growth stats:', error);
    res.status(500).json({ message: 'Failed to fetch user growth statistics' });
  }
});

router.get('/analytics/mining-activity', isAdmin, async (req: Request, res: Response) => {
  try {
    const data = await statsController.getMiningActivityStats();
    res.json(data);
  } catch (error) {
    console.error('Error fetching mining activity stats:', error);
    res.status(500).json({ message: 'Failed to fetch mining activity statistics' });
  }
});

router.get('/analytics/token-metrics', isAdmin, async (req: Request, res: Response) => {
  try {
    const data = await statsController.getTokenMetricsStats();
    res.json(data);
  } catch (error) {
    console.error('Error fetching token metrics:', error);
    res.status(500).json({ message: 'Failed to fetch token metrics' });
  }
});

// Community and social impact routes
router.get('/community/impact-metrics', async (req: Request, res: Response) => {
  try {
    const metrics = await communityController.getSocialImpactMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching impact metrics:', error);
    res.status(500).json({ message: 'Failed to fetch social impact metrics' });
  }
});

router.get('/community/initiatives', async (req: Request, res: Response) => {
  try {
    const initiatives = await communityController.getJusticeInitiatives();
    res.json({ initiatives });
  } catch (error) {
    console.error('Error fetching initiatives:', error);
    res.status(500).json({ message: 'Failed to fetch justice initiatives' });
  }
});

router.post('/community/initiatives', isAdmin, async (req: Request, res: Response) => {
  try {
    const newInitiative = await communityController.createJusticeInitiative(req.body);
    res.status(201).json(newInitiative);
  } catch (error) {
    console.error('Error creating initiative:', error);
    res.status(500).json({ message: 'Failed to create justice initiative' });
  }
});

export default router;