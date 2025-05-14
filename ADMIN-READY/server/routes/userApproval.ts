/**
 * User Approval Routes
 * 
 * Handles API endpoints for:
 * - Admin review of new user registrations
 * - Approval/rejection of users
 * - First login with temporary credentials
 * - Required 2FA setup during first login
 */

import { Express, Request, Response } from 'express';
import * as userApproval from '../lib/userApproval';
import { requireAdminTwoFactor } from '../lib/middleware/requireTwoFactor';
import { storage } from '../storage';

export function registerUserApprovalRoutes(app: Express): void {
  // Admin: Get list of pending user approvals
  app.get('/api/admin/approvals', requireAdminTwoFactor, async (req: Request, res: Response) => {
    try {
      const pendingApprovals = userApproval.getPendingApprovals();
      return res.status(200).json({ pendingApprovals });
    } catch (error) {
      console.error('Error getting pending approvals:', error);
      return res.status(500).json({ message: 'Failed to get pending approvals' });
    }
  });

  // Admin: Approve a user
  app.post('/api/admin/approvals/:userId/approve', requireAdminTwoFactor, async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      if (!req.session?.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const adminUserId = req.session.userId;
      
      const success = await userApproval.approveUser(userId, adminUserId);
      
      if (success) {
        return res.status(200).json({
          message: 'User approved successfully',
          userId
        });
      } else {
        return res.status(400).json({
          message: 'Failed to approve user',
          userId
        });
      }
    } catch (error) {
      console.error('Error approving user:', error);
      return res.status(500).json({ message: 'Failed to approve user' });
    }
  });

  // Admin: Reject a user
  app.post('/api/admin/approvals/:userId/reject', requireAdminTwoFactor, async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { reason } = req.body;
      
      if (!req.session?.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const adminUserId = req.session.userId;
      
      const success = await userApproval.rejectUser(userId, adminUserId, reason);
      
      if (success) {
        return res.status(200).json({
          message: 'User rejected successfully',
          userId
        });
      } else {
        return res.status(400).json({
          message: 'Failed to reject user',
          userId
        });
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      return res.status(500).json({ message: 'Failed to reject user' });
    }
  });

  // User: First login with temporary credentials
  app.post('/api/auth/first-login', async (req: Request, res: Response) => {
    try {
      const { username, temporaryPassword } = req.body;
      
      if (!username || !temporaryPassword) {
        return res.status(400).json({ message: 'Username and temporary password are required' });
      }
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Verify temporary credentials
      const isValid = userApproval.verifyTemporaryCredentials(user.id, temporaryPassword);
      
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid or expired temporary credentials' });
      }
      
      // Set user in session to indicate they're authenticated
      if (req.session) {
        req.session.userId = user.id;
        req.session.tempLoginCompleted = false; // Flag to indicate they need to set up 2FA
      }
      
      // Return response indicating they need to set up 2FA
      return res.status(200).json({
        message: 'Temporary credentials verified',
        userId: user.id,
        username: user.username,
        requireSetup2FA: true
      });
    } catch (error) {
      console.error('Error during first login:', error);
      return res.status(500).json({ message: 'Login failed' });
    }
  });

  // User: Complete first login by setting up 2FA
  app.post('/api/auth/first-login/complete', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      // Get user information
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Complete first login process and set up 2FA
      const { qrCode } = await userApproval.completeFirstLogin(user.id, user.username);
      
      // Set flag in session that user has set up 2FA
      req.session.twoFactorEnabled = true;
      req.session.twoFactorAuthenticated = false; // They still need to verify
      req.session.tempLoginCompleted = true; // First login process completed
      
      // Return QR code for setting up authenticator app
      return res.status(200).json({
        message: 'Please scan the QR code with your authenticator app',
        qrCode,
        userId: user.id,
        username: user.username
      });
    } catch (error) {
      console.error('Error completing first login:', error);
      return res.status(500).json({ message: 'Failed to complete first login process' });
    }
  });

  // Hook into registration route to notify admin
  app.post('/api/auth/register/hook', async (req: Request, res: Response) => {
    try {
      const { userId, username, email, ipAddress } = req.body;
      
      if (!userId || !username || !email) {
        return res.status(400).json({ message: 'User details are required' });
      }
      
      // Process the new registration
      await userApproval.processNewRegistration(userId, username, email, ipAddress);
      
      return res.status(200).json({
        message: 'Registration processed successfully',
        userId,
        requiresApproval: true
      });
    } catch (error) {
      console.error('Error processing registration:', error);
      return res.status(500).json({ message: 'Failed to process registration' });
    }
  });
}