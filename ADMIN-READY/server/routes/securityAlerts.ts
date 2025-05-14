/**
 * Security Alert Routes
 * 
 * These routes handle security alert verification for sensitive operations:
 * - Admin login verification
 * - Withdrawal verification
 * - Settings change verification
 */

import { Router, Request, Response } from 'express';
import { SecurityAlertService } from '../lib/securityAlertService';
import { Storage } from '../storage';

export function registerSecurityAlertRoutes(app: Router, storage: Storage) {
  const securityService = new SecurityAlertService(storage);
  
  // Run regular cleanup of expired security codes
  setInterval(() => {
    securityService.cleanupExpired();
  }, 15 * 60 * 1000); // Every 15 minutes
  
  // Request security verification for admin login
  app.post('/api/security/admin-login', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get client information
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';
      
      // Request approval
      const { approvalId } = await securityService.requestApproval(
        'admin_login',
        userId,
        { username: user.username },
        ip,
        userAgent
      );
      
      return res.status(200).json({
        message: "Security verification required",
        approvalId,
        expiresIn: 30 * 60 // 30 minutes in seconds
      });
    } catch (error: any) {
      console.error('Error requesting admin login verification:', error);
      return res.status(500).json({ message: error.message || "Failed to request verification" });
    }
  });
  
  // Request security verification for withdrawal
  app.post('/api/security/withdrawal', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { amount, destinationAddress } = req.body;
      
      if (!amount || !destinationAddress) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get client information
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';
      
      // Request approval
      const { approvalId } = await securityService.requestApproval(
        'withdrawal',
        userId,
        { amount, destinationAddress },
        ip,
        userAgent
      );
      
      return res.status(200).json({
        message: "Security verification required",
        approvalId,
        expiresIn: 30 * 60 // 30 minutes in seconds
      });
    } catch (error: any) {
      console.error('Error requesting withdrawal verification:', error);
      return res.status(500).json({ message: error.message || "Failed to request verification" });
    }
  });
  
  // Request security verification for settings change
  app.post('/api/security/settings-change', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { settings } = req.body;
      
      if (!settings) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get client information
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';
      
      // Request approval
      const { approvalId } = await securityService.requestApproval(
        'settings_change',
        userId,
        settings,
        ip,
        userAgent
      );
      
      return res.status(200).json({
        message: "Security verification required",
        approvalId,
        expiresIn: 30 * 60 // 30 minutes in seconds
      });
    } catch (error: any) {
      console.error('Error requesting settings change verification:', error);
      return res.status(500).json({ message: error.message || "Failed to request verification" });
    }
  });
  
  // Verify security code
  app.post('/api/security/verify', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { approvalId, securityCode } = req.body;
      
      if (!approvalId || !securityCode) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      // Verify security code
      const isVerified = securityService.verifySecurityCode(approvalId, securityCode);
      
      if (!isVerified) {
        return res.status(401).json({ message: "Invalid or expired security code" });
      }
      
      return res.status(200).json({
        message: "Security code verified successfully",
        approvalId
      });
    } catch (error: any) {
      console.error('Error verifying security code:', error);
      return res.status(500).json({ message: error.message || "Failed to verify security code" });
    }
  });
  
  // Check approval status
  app.get('/api/security/status/:approvalId', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { approvalId } = req.params;
      
      if (!approvalId) {
        return res.status(400).json({ message: "Missing approval ID" });
      }
      
      // Check if approved
      const isApproved = securityService.isApproved(approvalId);
      
      return res.status(200).json({
        approved: isApproved
      });
    } catch (error: any) {
      console.error('Error checking approval status:', error);
      return res.status(500).json({ message: error.message || "Failed to check approval status" });
    }
  });
  
  // Clear approval (after it's been used)
  app.post('/api/security/clear/:approvalId', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { approvalId } = req.params;
      
      if (!approvalId) {
        return res.status(400).json({ message: "Missing approval ID" });
      }
      
      // Clear the approval
      securityService.clearApproval(approvalId);
      
      return res.status(200).json({
        message: "Approval cleared successfully"
      });
    } catch (error: any) {
      console.error('Error clearing approval:', error);
      return res.status(500).json({ message: error.message || "Failed to clear approval" });
    }
  });
  
  console.log('[API] Security alert routes registered');
}