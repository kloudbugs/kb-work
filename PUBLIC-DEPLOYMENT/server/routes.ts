/**
 * KLOUD BUGS Mining Command Center - Public Version
 * API Routes
 * 
 * This file contains all API routes for the public user-facing version.
 * It contains NO administrative routes or wallet access.
 */

import express from 'express';
import { Request, Response } from 'express';
import * as cryptoUtils from './utils/crypto';
import * as storage from './storage';
import * as userController from './controllers/user-controller';
import * as miningController from './controllers/mining-controller';
import * as tokenController from './controllers/token-controller';
import * as communityController from './controllers/community-controller';
import { isAuthenticated, hasActiveSubscription } from './middleware/auth';
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

router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await userController.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    
    // Check if email already exists
    const existingEmail = await userController.getUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    
    // Create new user
    const newUser = await userController.createUser({
      username,
      email,
      password,
      role: 'USER'
    });
    
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register user' });
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
      hasActiveSubscription: await userController.checkUserSubscription(userId)
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

// User profile routes
router.get('/user/profile', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const profile = await userController.getUserProfile(userId);
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

router.put('/user/profile', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const updatedProfile = await userController.updateUserProfile(userId, req.body);
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
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

// Token routes (view-only)
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

router.get('/tokens/tera/distribution', async (req: Request, res: Response) => {
  try {
    const distribution = await tokenController.getTeraTokenDistribution();
    res.json(distribution);
  } catch (error) {
    console.error('Error fetching token distribution:', error);
    res.status(500).json({ message: 'Failed to fetch token distribution' });
  }
});

router.get('/tokens/balance', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const balance = await tokenController.getUserTokenBalance(userId);
    res.json({ balance });
  } catch (error) {
    console.error('Error fetching token balance:', error);
    res.status(500).json({ message: 'Failed to fetch token balance' });
  }
});

router.get('/tokens/transactions', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const transactions = await tokenController.getUserTokenTransactions(userId);
    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching token transactions:', error);
    res.status(500).json({ message: 'Failed to fetch token transactions' });
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

router.get('/community/feed', async (req: Request, res: Response) => {
  try {
    const feed = await communityController.getCommunityFeed();
    res.json({ feed });
  } catch (error) {
    console.error('Error fetching community feed:', error);
    res.status(500).json({ message: 'Failed to fetch community feed' });
  }
});

// Subscription routes
router.get('/subscriptions/plans', async (req: Request, res: Response) => {
  try {
    const plans = await userController.getSubscriptionPlans();
    res.json({ plans });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ message: 'Failed to fetch subscription plans' });
  }
});

router.get('/subscriptions/user', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const subscription = await userController.getUserSubscription(userId);
    res.json(subscription);
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    res.status(500).json({ message: 'Failed to fetch user subscription' });
  }
});

// Support routes
router.post('/support/ticket', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const ticket = await userController.createSupportTicket(userId, req.body);
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({ message: 'Failed to create support ticket' });
  }
});

router.get('/support/tickets', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const tickets = await userController.getUserSupportTickets(userId);
    res.json({ tickets });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ message: 'Failed to fetch support tickets' });
  }
});

export default router;