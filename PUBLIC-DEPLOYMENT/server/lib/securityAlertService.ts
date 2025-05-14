/**
 * Security Alert Service
 * 
 * This service handles security alerts for sensitive operations:
 * - Admin login attempts
 * - Withdrawal requests
 * - Wallet setting changes
 * 
 * It sends email notifications and generates one-time passwords
 * that must be verified before the operation can proceed.
 */

import crypto from 'crypto';
import * as sendgrid from '@sendgrid/mail';
import { Storage } from '../storage';

// Cache of pending approval requests
interface PendingApproval {
  id: string;
  type: 'admin_login' | 'withdrawal' | 'settings_change';
  userId: string;
  data: any;
  code: string;
  expires: Date;
  ip: string;
  userAgent: string;
  approved: boolean;
}

// 30 minute expiration for security codes
const APPROVAL_EXPIRATION_MS = 30 * 60 * 1000;

export class SecurityAlertService {
  private storage: Storage;
  private pendingApprovals: Map<string, PendingApproval> = new Map();
  private adminEmail: string = process.env.ADMIN_EMAIL || 'admin@example.com';
  private trustedIPs: Map<string, { userId: string, expires: Date }> = new Map();
  
  // Trusted IP expiration (30 days)
  private TRUSTED_IP_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000;
  
  constructor(storage: Storage) {
    this.storage = storage;
    
    // Initialize SendGrid if API key is provided
    if (process.env.SENDGRID_API_KEY) {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('[SECURITY] SendGrid API key found, email alerts enabled');
    } else {
      console.log('[SECURITY] No SendGrid API key found, email alerts disabled');
    }
    
    // Load trusted IPs (in a real app, this would come from database)
    this.loadTrustedIPs();
    
    // Set up regular cleanup of expired trusted IPs
    setInterval(() => this.cleanupExpiredTrustedIPs(), 24 * 60 * 60 * 1000); // Daily
  }
  
  /**
   * Load trusted IPs from storage
   */
  private async loadTrustedIPs(): Promise<void> {
    try {
      // In a real implementation, you would load these from your database
      // For now, we're just initializing an empty map
      console.log('[SECURITY] Trusted IP list initialized');
    } catch (error) {
      console.error('[SECURITY] Error loading trusted IPs:', error);
    }
  }
  
  /**
   * Add an IP to the trusted list for a user
   * 
   * @param userId - User ID
   * @param ip - IP address to trust
   */
  async addTrustedIP(userId: string, ip: string): Promise<void> {
    // Set expiration date (30 days from now)
    const expires = new Date(Date.now() + this.TRUSTED_IP_EXPIRATION_MS);
    
    // Store the trusted IP
    this.trustedIPs.set(`${userId}:${ip}`, { userId, expires });
    
    console.log(`[SECURITY] Added trusted IP ${ip} for user ${userId}`);
    
    // In a real implementation, you would save this to your database
  }
  
  /**
   * Remove an IP from the trusted list for a user
   * 
   * @param userId - User ID
   * @param ip - IP address to remove
   */
  async removeTrustedIP(userId: string, ip: string): Promise<void> {
    this.trustedIPs.delete(`${userId}:${ip}`);
    
    console.log(`[SECURITY] Removed trusted IP ${ip} for user ${userId}`);
    
    // In a real implementation, you would update your database
  }
  
  /**
   * Check if an IP is trusted for a user
   * 
   * @param userId - User ID
   * @param ip - IP address to check
   * @returns Boolean indicating if IP is trusted
   */
  isTrustedIP(userId: string, ip: string): boolean {
    const key = `${userId}:${ip}`;
    const trustEntry = this.trustedIPs.get(key);
    
    if (!trustEntry) {
      return false;
    }
    
    // Check if the trust has expired
    if (trustEntry.expires < new Date()) {
      this.trustedIPs.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Clean up expired trusted IPs
   */
  private cleanupExpiredTrustedIPs(): void {
    const now = new Date();
    
    for (const [key, entry] of this.trustedIPs.entries()) {
      if (entry.expires < now) {
        this.trustedIPs.delete(key);
        console.log(`[SECURITY] Trusted IP entry expired and removed: ${key}`);
      }
    }
  }
  
  /**
   * Request approval for a sensitive operation
   * 
   * @param type - Type of operation requiring approval
   * @param userId - ID of the user performing the operation
   * @param data - Data related to the operation
   * @param ip - IP address of the requester
   * @param userAgent - User agent of the requester
   * @returns Approval ID and security code
   */
  async requestApproval(
    type: 'admin_login' | 'withdrawal' | 'settings_change',
    userId: string,
    data: any,
    ip: string,
    userAgent: string
  ): Promise<{ approvalId: string; securityCode: string; autoApproved?: boolean }> {
    // Generate a unique approval ID
    const approvalId = crypto.randomBytes(16).toString('hex');
    
    // Generate a 6-digit security code
    const securityCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration date (30 minutes from now)
    const expires = new Date(Date.now() + APPROVAL_EXPIRATION_MS);
    
    // Get user information
    const user = await this.storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if this is a trusted IP address
    const isTrusted = this.isTrustedIP(userId, ip);
    
    // Store pending approval
    const approval: PendingApproval = {
      id: approvalId,
      type,
      userId,
      data,
      code: securityCode,
      expires,
      ip,
      userAgent,
      // Auto-approve if from trusted IP
      approved: isTrusted
    };
    
    this.pendingApprovals.set(approvalId, approval);
    
    // If it's not a trusted IP, send email alert
    if (!isTrusted) {
      await this.sendAlertEmail(type, user.username, securityCode, ip, data);
      console.log(`[SECURITY] Security alert generated: ${type} for user ${user.username}`);
    } else {
      console.log(`[SECURITY] Auto-approved ${type} for user ${user.username} from trusted IP ${ip}`);
      
      // Automatically add as trusted IP if this is an approval (user verified this is their location)
      if (type === 'admin_login') {
        // Refresh the trust period
        this.addTrustedIP(userId, ip);
      }
    }
    
    return {
      approvalId,
      securityCode,
      autoApproved: isTrusted
    };
  }
  
  /**
   * Verify a security code to approve an operation
   * 
   * @param approvalId - ID of the approval request
   * @param securityCode - Security code to verify
   * @returns Boolean indicating if verification was successful
   */
  verifySecurityCode(approvalId: string, securityCode: string): boolean {
    const approval = this.pendingApprovals.get(approvalId);
    
    if (!approval) {
      console.log(`[SECURITY] Approval ID not found: ${approvalId}`);
      return false;
    }
    
    if (approval.expires < new Date()) {
      console.log(`[SECURITY] Approval expired: ${approvalId}`);
      this.pendingApprovals.delete(approvalId);
      return false;
    }
    
    if (approval.code !== securityCode) {
      console.log(`[SECURITY] Invalid security code for approval: ${approvalId}`);
      return false;
    }
    
    // Mark as approved
    approval.approved = true;
    this.pendingApprovals.set(approvalId, approval);
    
    console.log(`[SECURITY] Operation approved: ${approval.type} for user ${approval.userId}`);
    return true;
  }
  
  /**
   * Check if an operation has been approved
   * 
   * @param approvalId - ID of the approval request
   * @returns Boolean indicating if operation is approved
   */
  isApproved(approvalId: string): boolean {
    const approval = this.pendingApprovals.get(approvalId);
    
    if (!approval) {
      return false;
    }
    
    if (approval.expires < new Date()) {
      this.pendingApprovals.delete(approvalId);
      return false;
    }
    
    return approval.approved;
  }
  
  /**
   * Clear an approval after it's been used
   * 
   * @param approvalId - ID of the approval request to clear
   */
  clearApproval(approvalId: string): void {
    this.pendingApprovals.delete(approvalId);
  }
  
  /**
   * Send an email alert for a security event
   * 
   * @param type - Type of operation requiring approval
   * @param username - Username of the user performing the operation
   * @param securityCode - Security code for approval
   * @param ip - IP address of the requester
   * @param data - Data related to the operation
   */
  private async sendAlertEmail(
    type: 'admin_login' | 'withdrawal' | 'settings_change',
    username: string,
    securityCode: string,
    ip: string,
    data: any
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[SECURITY] Email alerts disabled, would have sent alert for:', {
        type,
        username,
        securityCode,
        ip
      });
      return;
    }
    
    let subject = '';
    let content = '';
    
    switch (type) {
      case 'admin_login':
        subject = '🔐 Admin Login Alert - Security Code Required';
        content = `
          <h2>Admin Login Alert</h2>
          <p>There was an attempt to access the admin area of your Satoshi Beans Mining platform.</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>IP Address:</strong> ${ip}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <h3>Security Code: ${securityCode}</h3>
          <p>Enter this code on the login page to authorize access.</p>
          <p>If you did not attempt to login, please secure your account immediately.</p>
        `;
        break;
        
      case 'withdrawal':
        subject = '💸 Withdrawal Request Alert - Security Code Required';
        content = `
          <h2>Withdrawal Request Alert</h2>
          <p>A withdrawal request has been initiated on your Satoshi Beans Mining platform.</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Amount:</strong> ${data.amount ? (data.amount / 100000000).toFixed(8) + ' BTC' : 'Unknown'}</p>
          <p><strong>Destination:</strong> ${data.destinationAddress || 'Unknown'}</p>
          <p><strong>IP Address:</strong> ${ip}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <h3>Security Code: ${securityCode}</h3>
          <p>Enter this code on the withdrawal page to authorize this transaction.</p>
          <p>If you did not initiate this withdrawal, please secure your account immediately.</p>
        `;
        break;
        
      case 'settings_change':
        subject = '⚙️ Wallet Settings Change Alert - Security Code Required';
        content = `
          <h2>Wallet Settings Change Alert</h2>
          <p>Someone is attempting to change wallet settings on your Satoshi Beans Mining platform.</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>IP Address:</strong> ${ip}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <h3>Security Code: ${securityCode}</h3>
          <p>Enter this code on the settings page to authorize these changes.</p>
          <p>If you did not request these changes, please secure your account immediately.</p>
        `;
        break;
    }
    
    try {
      const msg = {
        to: this.adminEmail,
        from: 'alerts@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[SECURITY] Security alert email sent to ${this.adminEmail}`);
    } catch (error) {
      console.error('[SECURITY] Error sending security alert email:', error);
    }
  }
  
  /**
   * Clean up expired approval requests
   */
  cleanupExpired(): void {
    const now = new Date();
    
    for (const [id, approval] of this.pendingApprovals.entries()) {
      if (approval.expires < now) {
        this.pendingApprovals.delete(id);
      }
    }
  }
}