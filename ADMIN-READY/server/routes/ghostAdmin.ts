/**
 * Ghost Admin Routes
 * 
 * API endpoints for managing ghost admin accounts:
 * - Creating new ghost admins
 * - Logging in as ghost admin
 * - Switching between ghost and real admin
 * - Generating one-time ghost admin
 */

import { Router } from 'express';
import crypto from 'crypto';
import { UserRole } from '../../shared/schema';

// Import services
const GhostAccountService = (async () => (await import('../lib/ghostAccountService')).GhostAccountService.getInstance())();
const EmailVerificationService = (async () => (await import('../lib/emailVerificationService')).EmailVerificationService.getInstance())();

const router = Router();

// Middleware to verify admin status
const adminOnly = async (req, res, next) => {
  // Check if user is authenticated and has the ADMIN role
  if (!req.session?.userId || !req.session?.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

/**
 * Create a new ghost admin account
 * Requires admin authentication
 */
router.post('/ghost/create', adminOnly, async (req, res) => {
  try {
    const { ghostName, ghostUsername, ghostEmail, permissions } = req.body;
    const adminId = req.session.userId;
    
    // Basic validation
    if (!ghostName || !ghostUsername) {
      return res.status(400).json({
        success: false,
        message: 'Name and username are required'
      });
    }
    
    // Create ghost account
    const ghostService = await GhostAccountService;
    // Get admin user data to retrieve email
    const admin = await req.app.locals.storage.getUser(adminId);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found'
      });
    }
    
    const result = await ghostService.createGhostAccount(
      adminId,
      ghostName,
      ghostUsername,
      ghostEmail || admin.email,
      permissions
    );
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('[API] Error creating ghost account:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating ghost account'
    });
  }
});

/**
 * List all ghost admin accounts
 * Requires admin authentication
 */
router.get('/ghost/list', adminOnly, async (req, res) => {
  try {
    const adminId = req.session.userId;
    
    const ghostService = await GhostAccountService;
    const ghostAccounts = await ghostService.getGhostAccountsForAdmin(adminId);
    
    return res.status(200).json({
      success: true,
      ghostAccounts
    });
  } catch (error) {
    console.error('[API] Error listing ghost accounts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error listing ghost accounts'
    });
  }
});

/**
 * Generate a one-time ghost admin (quick access)
 * Requires admin authentication
 */
router.post('/ghost/generate-one-time', adminOnly, async (req, res) => {
  try {
    const adminId = req.session.userId;
    
    // Generate random username and name
    const randomId = crypto.randomBytes(4).toString('hex');
    const ghostUsername = `ghost_${randomId}`;
    const ghostName = `One-time Admin (${new Date().toLocaleDateString()})`;
    
    // Create ghost account
    const ghostService = await GhostAccountService;
    
    // Get admin user data to retrieve email
    const admin = await req.app.locals.storage.getUser(adminId);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found'
      });
    }
    
    const result = await ghostService.createGhostAccount(
      adminId,
      ghostName,
      ghostUsername,
      admin.email
    );
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    // Auto-login as this ghost (switch from real admin to ghost)
    if (result.ghostId && result.initialPassword) {
      const authResult = await ghostService.authenticateGhost(
        ghostUsername,
        result.initialPassword
      );
      
      if (authResult.success && authResult.sessionToken) {
        // Store the real admin ID to allow switching back
        req.session.realAdminId = adminId;
        
        // Update session with ghost admin info
        req.session.userId = authResult.ghostUser.id;
        req.session.isAdmin = true;
        req.session.ghostUser = authResult.ghostUser;
        req.session.ghostSessionToken = authResult.sessionToken;
        
        return res.status(200).json({
          success: true,
          message: "One-time ghost admin created and logged in",
          ghost: {
            id: result.ghostId,
            username: ghostUsername,
            initialPassword: result.initialPassword
          }
        });
      }
    }
    
    // If auto-login fails, still return the ghost account info
    return res.status(200).json({
      success: true,
      message: "One-time ghost admin created",
      ghost: {
        id: result.ghostId,
        username: ghostUsername,
        initialPassword: result.initialPassword
      }
    });
  } catch (error) {
    console.error('[API] Error generating one-time ghost:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating one-time ghost admin'
    });
  }
});

/**
 * Login as a specific ghost admin
 * Requires admin authentication
 */
router.post('/ghost/login', adminOnly, async (req, res) => {
  try {
    const { ghostUsername, password } = req.body;
    const adminId = req.session.userId;
    
    // Basic validation
    if (!ghostUsername || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }
    
    // Authenticate ghost account
    const ghostService = await GhostAccountService;
    const result = await ghostService.authenticateGhost(
      ghostUsername,
      password
    );
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    // Verify this ghost belongs to the current admin
    if (result.ghostUser.linkedAdminId !== adminId) {
      return res.status(403).json({
        success: false,
        message: "This ghost admin belongs to another admin account"
      });
    }
    
    // Store the real admin ID to allow switching back
    req.session.realAdminId = adminId;
    
    // Update session with ghost admin info
    req.session.userId = result.ghostUser.id;
    req.session.isAdmin = true;
    req.session.ghostUser = result.ghostUser;
    req.session.ghostSessionToken = result.sessionToken;
    
    return res.status(200).json({
      success: true,
      message: "Logged in as ghost admin",
      user: {
        ...result.ghostUser,
        isGhost: true
      }
    });
  } catch (error) {
    console.error('[API] Error logging in as ghost:', error);
    return res.status(500).json({
      success: false,
      message: 'Error logging in as ghost admin'
    });
  }
});

/**
 * Switch back to real admin account
 * Only works if currently logged in as ghost
 */
router.post('/ghost/switch-back', async (req, res) => {
  try {
    // Check if user is a ghost admin
    if (!req.session?.userId || !req.session?.ghostUser || !req.session?.realAdminId) {
      return res.status(400).json({
        success: false,
        message: "Not currently using a ghost admin account"
      });
    }
    
    // Get real admin ID
    const realAdminId = req.session.realAdminId;
    
    // End ghost session
    if (req.session.ghostSessionToken) {
      const ghostService = await GhostAccountService;
      await ghostService.endGhostSession(req.session.ghostSessionToken);
    }
    
    // Get real admin user
    const adminUser = await req.app.locals.storage.getUser(realAdminId);
    
    if (!adminUser) {
      // This shouldn't happen, but if it does, log out completely
      req.session.destroy((err) => {
        if (err) console.error('[API] Error destroying session:', err);
      });
      
      return res.status(401).json({
        success: false,
        message: "Original admin account not found, please log in again"
      });
    }
    
    // Update session with real admin info
    delete req.session.realAdminId;
    delete req.session.ghostUser;
    delete req.session.ghostSessionToken;
    
    // Set up standard session for the admin
    req.session.userId = adminUser.id;
    req.session.isAdmin = adminUser.role === UserRole.ADMIN;
    
    return res.status(200).json({
      success: true,
      message: "Switched back to real admin account",
      user: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('[API] Error switching back from ghost:', error);
    return res.status(500).json({
      success: false,
      message: 'Error switching back to real admin account'
    });
  }
});

/**
 * Verify ghost admin is active
 * Uses ghost session token
 */
router.post('/ghost/verify', async (req, res) => {
  try {
    const { sessionToken } = req.body;
    
    if (!sessionToken) {
      return res.status(400).json({
        success: false,
        message: "Session token is required"
      });
    }
    
    const ghostService = await GhostAccountService;
    const result = await ghostService.verifyGhostSession(sessionToken);
    
    return res.status(result.valid ? 200 : 401).json({
      success: result.valid,
      message: result.message || (result.valid ? "Session is valid" : "Invalid session"),
      ghostUser: result.ghostUser
    });
  } catch (error) {
    console.error('[API] Error verifying ghost session:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying ghost session'
    });
  }
});

/**
 * Create a secret quick-access URL for admin
 * Sends an email with a one-time login link
 */
router.post('/admin/magic-link', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    
    // Find admin by email
    const users = await req.app.locals.storage.getUsers();
    const admin = users.find(user => 
      user.role === UserRole.ADMIN && 
      user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (!admin) {
      // Return generic message to prevent email enumeration
      return res.status(200).json({
        success: true,
        message: "If this email belongs to an admin, a magic link has been sent"
      });
    }
    
    // Generate temporary login code
    const emailService = await EmailVerificationService;
    const result = await emailService.sendAdminLoginCode(email, req.ip);
    
    return res.status(result.success ? 200 : 400).json({
      success: true, // Always return success to prevent email enumeration
      message: "If this email belongs to an admin, a magic link has been sent"
    });
  } catch (error) {
    console.error('[API] Error creating magic link:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating magic link'
    });
  }
});

export default router;