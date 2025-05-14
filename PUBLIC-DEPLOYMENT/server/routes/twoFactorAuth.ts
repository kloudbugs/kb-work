/**
 * Two-Factor Authentication Routes
 * Handle QR code generation and token verification for both admin and regular users
 */

import { Express, Request, Response } from 'express';
import * as twoFactorAuth from '../lib/twoFactorAuth';
import { storage } from '../storage';

export function registerTwoFactorAuthRoutes(app: Express) {
  // Generate a QR code for 2FA setup
  app.get('/api/auth/2fa/setup', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      // Get username from session or database
      let username = 'user';
      
      // For admin account, use 'admin' as username
      if (req.session.isAdmin === true) {
        username = 'admin';
      } else {
        // For regular user, fetch from database
        try {
          const user = await storage.getUser(req.session.userId);
          if (user && user.username) {
            username = user.username;
          }
        } catch (err) {
          console.error('Error fetching username:', err);
          // Continue with default username if error
        }
      }

      // Generate QR code for the current user
      const qrCode = await twoFactorAuth.generateQRCode(
        req.session.userId,
        username
      );

      // Store flag in session that user has set up 2FA
      req.session.twoFactorEnabled = true;

      // Return the QR code as a data URL
      return res.status(200).json({
        qrCode,
        message: 'Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)',
        username,
        userId: req.session.userId,
        twoFactorEnabled: true
      });
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      return res.status(500).json({ message: 'Failed to set up 2FA' });
    }
  });

  // Verify a 2FA token
  app.post('/api/auth/2fa/verify', (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ message: '2FA token is required' });
      }

      // Special verification for admin with rate limiting
      if (req.session.isAdmin === true) {
        const isValid = twoFactorAuth.verifyAdminToken(token);

        if (isValid) {
          // Mark admin as authenticated with 2FA
          req.session.twoFactorAuthenticated = true;
          
          // Log for security auditing
          console.log(`[2FA] Admin (ID: ${req.session.userId}) authenticated with 2FA`);
          
          return res.status(200).json({
            success: true,
            message: '2FA verification successful',
            isAdmin: true
          });
        } else {
          console.warn(`[2FA] Failed admin verification attempt for ID: ${req.session.userId}`);
          return res.status(401).json({
            success: false,
            message: 'Invalid 2FA token',
            isAdmin: true
          });
        }
      } else {
        // For regular users
        const isValid = twoFactorAuth.verifyToken(req.session.userId, token);

        if (isValid) {
          req.session.twoFactorAuthenticated = true;
          console.log(`[2FA] User (ID: ${req.session.userId}) authenticated with 2FA`);
          
          return res.status(200).json({
            success: true,
            message: '2FA verification successful',
            isAdmin: false
          });
        } else {
          console.warn(`[2FA] Failed user verification attempt for ID: ${req.session.userId}`);
          return res.status(401).json({
            success: false,
            message: 'Invalid 2FA token',
            isAdmin: false
          });
        }
      }
    } catch (error) {
      console.error('Error verifying 2FA token:', error);
      return res.status(500).json({ message: 'Failed to verify 2FA token' });
    }
  });

  // Check if 2FA is required/enabled for the current user
  app.get('/api/auth/2fa/status', (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      // For admin account - 2FA is always required
      if (req.session.isAdmin === true) {
        return res.status(200).json({
          enabled: true,
          authenticated: !!req.session.twoFactorAuthenticated,
          required: true,
          isAdmin: true,
          userId: req.session.userId
        });
      }

      // For regular users - only required if they've enabled it
      const isEnabled = !!req.session.twoFactorEnabled;
      return res.status(200).json({
        enabled: isEnabled,
        authenticated: !!req.session.twoFactorAuthenticated,
        required: isEnabled, // Only required if enabled
        isAdmin: false,
        userId: req.session.userId
      });
    } catch (error) {
      console.error('Error checking 2FA status:', error);
      return res.status(500).json({ message: 'Failed to check 2FA status' });
    }
  });
  
  // Enable/disable 2FA for regular users
  app.post('/api/auth/2fa/toggle', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { enabled } = req.body;
      
      if (typeof enabled !== 'boolean') {
        return res.status(400).json({ message: 'Enabled status is required (true/false)' });
      }
      
      // For admin - cannot disable 2FA
      if (req.session.isAdmin === true && enabled === false) {
        return res.status(403).json({ 
          message: 'Admin cannot disable 2FA for security reasons',
          enabled: true // Still enabled
        });
      }
      
      // Update session state
      req.session.twoFactorEnabled = enabled;
      
      // If enabling, make sure they need to verify
      if (enabled) {
        req.session.twoFactorAuthenticated = false;
        
        // Generate a new secret if needed
        if (!twoFactorAuth.getSecret(req.session.userId)) {
          twoFactorAuth.generateSecret(req.session.userId);
        }
      }
      
      // In a real app, you would save this preference to the database
      
      return res.status(200).json({
        success: true,
        enabled,
        message: enabled ? '2FA has been enabled' : '2FA has been disabled',
        requiresSetup: enabled && !twoFactorAuth.getSecret(req.session.userId)
      });
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      return res.status(500).json({ message: 'Failed to toggle 2FA' });
    }
  });
}