/**
 * Ghost User Routes
 * 
 * API endpoints for simulating ghost users:
 * - Creating ghost users for simulation
 * - Managing ghost user activity
 * - Handling ghost user mining
 */

import { Router } from 'express';
import crypto from 'crypto';
import { UserRole } from '../../shared/schema';
import { storage } from '../storage';

// Import services
const GhostAccountService = (async () => (await import('../lib/ghostAccountService')).GhostAccountService.getInstance())();

const router = Router();

// Middleware to verify admin status
const adminOnly = async (req, res, next) => {
  if (!req.session?.userId || !req.session?.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

/**
 * Get all ghost users
 * Requires admin authentication
 */
router.get('/ghost-users', adminOnly, async (req, res) => {
  try {
    // Get all users from storage
    const allUsers = await storage.getAllUsers();
    
    // Filter ghost users (non-admin ghosts)
    const ghostUsers = allUsers.filter(user => 
      user.isGhostAccount === true && 
      user.role !== UserRole.ADMIN
    );
    
    // Return safe versions without sensitive info
    const safeGhostUsers = ghostUsers.map(user => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName || user.username,
      email: user.email,
      walletAddress: user.walletAddress,
      balance: user.balance,
      created: user.created,
      lastLogin: user.lastLogin,
      settings: user.settings || {},
      subscriptions: user.subscriptions || []
    }));
    
    return res.status(200).json({
      success: true,
      ghostUsers: safeGhostUsers
    });
  } catch (error) {
    console.error('[API] Error listing ghost users:', error);
    return res.status(500).json({
      success: false,
      message: 'Error listing ghost users'
    });
  }
});

/**
 * Create a new ghost user
 * Requires admin authentication
 */
router.post('/ghost-users/create', adminOnly, async (req, res) => {
  try {
    const { username, email, walletAddress, location, deviceType, plan } = req.body;
    const adminId = req.session.userId;
    
    // Basic validation
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }
    
    // Generate a random userId
    const userId = crypto.randomBytes(16).toString('hex');
    
    // Create initial balance (random between 0 and 0.001 BTC)
    const initialBalance = Math.floor(Math.random() * 100000).toString();
    
    // Create ghost user
    const ghostUser = {
      id: userId,
      username,
      displayName: username,
      email: email || `${username}@example.com`,
      passwordHash: crypto.createHash('sha256').update('ghostuser').digest('hex'),
      walletAddress: walletAddress || 'bc1qfakeaddressxxxxxxxxxxxxxxxxxxxxxxx',
      balance: initialBalance,
      role: UserRole.USER,
      isGhostAccount: true,
      linkedAdminId: adminId,
      created: new Date(),
      lastLogin: new Date(),
      settings: {
        location: location || 'us',
        deviceType: deviceType || 'desktop',
        plan: plan || 'standard'
      }
    };
    
    // Save to storage
    await storage.saveUser(ghostUser);
    
    // Log creation
    console.log(`[GHOST] Created ghost user ${username} with ID ${userId}`);
    
    return res.status(200).json({
      success: true,
      message: 'Ghost user created successfully',
      ghostUser: {
        id: ghostUser.id,
        username: ghostUser.username,
        displayName: ghostUser.displayName,
        email: ghostUser.email,
        walletAddress: ghostUser.walletAddress,
        balance: ghostUser.balance,
        created: ghostUser.created,
        settings: ghostUser.settings
      }
    });
  } catch (error) {
    console.error('[API] Error creating ghost user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating ghost user'
    });
  }
});

/**
 * Delete a ghost user
 * Requires admin authentication
 */
router.delete('/ghost-users/:id', adminOnly, async (req, res) => {
  try {
    const ghostId = req.params.id;
    const adminId = req.session.userId;
    
    // Get the ghost user
    const ghostUser = await storage.getUser(ghostId);
    
    // Check if user exists and is a ghost account
    if (!ghostUser || !ghostUser.isGhostAccount) {
      return res.status(404).json({
        success: false,
        message: 'Ghost user not found'
      });
    }
    
    // Check if ghost belongs to this admin
    if (ghostUser.linkedAdminId !== adminId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete ghost users you created'
      });
    }
    
    // Delete the ghost user
    await storage.deleteUser(ghostId);
    
    return res.status(200).json({
      success: true,
      message: 'Ghost user deleted successfully'
    });
  } catch (error) {
    console.error('[API] Error deleting ghost user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting ghost user'
    });
  }
});

/**
 * Start ghost user mining
 * Requires admin authentication
 */
router.post('/ghost-users/:id/start-mining', adminOnly, async (req, res) => {
  try {
    const ghostId = req.params.id;
    const { poolId, hashrate } = req.body;
    
    // Get the ghost user
    const ghostUser = await storage.getUser(ghostId);
    
    // Check if user exists and is a ghost account
    if (!ghostUser || !ghostUser.isGhostAccount) {
      return res.status(404).json({
        success: false,
        message: 'Ghost user not found'
      });
    }
    
    // Create or update mining stats
    const stats = {
      userId: ghostId,
      totalHashRate: hashrate || '15000', // 15 KH/s default
      estimatedEarnings: '0.00012500',
      activeDevices: 1,
      powerConsumption: '120',
      miningEnabled: true,
      lastUpdate: new Date()
    };
    
    // Save mining stats
    await storage.saveMiningStats(stats);
    
    // Log mining start
    console.log(`[GHOST] Started mining for ghost user ${ghostUser.username} with hashrate ${stats.totalHashRate}`);
    
    return res.status(200).json({
      success: true,
      message: 'Ghost user mining started',
      stats
    });
  } catch (error) {
    console.error('[API] Error starting ghost user mining:', error);
    return res.status(500).json({
      success: false,
      message: 'Error starting ghost user mining'
    });
  }
});

/**
 * Stop ghost user mining
 * Requires admin authentication
 */
router.post('/ghost-users/:id/stop-mining', adminOnly, async (req, res) => {
  try {
    const ghostId = req.params.id;
    
    // Get the ghost user
    const ghostUser = await storage.getUser(ghostId);
    
    // Check if user exists and is a ghost account
    if (!ghostUser || !ghostUser.isGhostAccount) {
      return res.status(404).json({
        success: false,
        message: 'Ghost user not found'
      });
    }
    
    // Get current mining stats
    const currentStats = await storage.getMiningStats(ghostId);
    
    if (currentStats) {
      // Update mining stats
      const updatedStats = {
        ...currentStats,
        miningEnabled: false,
        lastUpdate: new Date()
      };
      
      // Save mining stats
      await storage.saveMiningStats(updatedStats);
    }
    
    // Log mining stop
    console.log(`[GHOST] Stopped mining for ghost user ${ghostUser.username}`);
    
    return res.status(200).json({
      success: true,
      message: 'Ghost user mining stopped'
    });
  } catch (error) {
    console.error('[API] Error stopping ghost user mining:', error);
    return res.status(500).json({
      success: false,
      message: 'Error stopping ghost user mining'
    });
  }
});

export { router as ghostUserRoutes };