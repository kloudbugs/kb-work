/**
 * Simple Security Service
 * 
 * This service provides a simplified security mechanism for sensitive operations:
 * - Admin access verification
 * - Withdrawal verification
 * - Settings change verification
 * 
 * It uses a master password approach combined with email alerts.
 */

import crypto from 'crypto';
import * as sendgrid from '@sendgrid/mail';
import { storage } from '../storage';

export class SimpleSecurityService {
  private static instance: SimpleSecurityService;
  
  // Master password hash - default is "admin123"
  private masterPasswordHash: string = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';
  
  // Admin email for alerts
  private adminEmail: string = process.env.ADMIN_EMAIL || 'admin@example.com';
  
  // Map to track authorized IP addresses and expiration
  private lastAuthByIp: Map<string, number> = new Map();
  
  // Auth session duration (30 minutes)
  private authSessionDuration: number = 30 * 60 * 1000;
  
  private constructor() {
    // Initialize SendGrid if API key is provided
    if (process.env.SENDGRID_API_KEY) {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('[SECURITY] SendGrid API key found, email alerts enabled');
    } else {
      console.log('[SECURITY] No SendGrid API key found, email alerts disabled');
    }
    
    console.log('[SECURITY] Simple security service initialized');
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): SimpleSecurityService {
    if (!SimpleSecurityService.instance) {
      SimpleSecurityService.instance = new SimpleSecurityService();
    }
    return SimpleSecurityService.instance;
  }
  
  /**
   * Verify a master password
   * 
   * @param password - Password to verify
   * @returns Boolean indicating if password is correct
   */
  public verifyMasterPassword(password: string): boolean {
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    const isValid = hash === this.masterPasswordHash;
    
    if (isValid) {
      console.log('[SECURITY] Master password verified successfully');
    } else {
      console.warn('[SECURITY] Invalid master password attempt');
    }
    
    return isValid;
  }
  
  /**
   * Update the master password
   * 
   * @param currentPassword - Current password
   * @param newPassword - New password to set
   * @returns Boolean indicating if update was successful
   */
  public updateMasterPassword(currentPassword: string, newPassword: string): boolean {
    if (!this.verifyMasterPassword(currentPassword)) {
      console.warn('[SECURITY] Failed to update master password: invalid current password');
      return false;
    }
    
    // Hash and store the new password
    this.masterPasswordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
    
    console.log('[SECURITY] Master password updated successfully');
    return true;
  }
  
  /**
   * Record successful authentication for an IP
   * 
   * @param ip - IP address to record
   */
  public recordSuccessfulAuth(ip: string): void {
    const now = Date.now();
    this.lastAuthByIp.set(ip, now);
    console.log(`[SECURITY] Recorded successful auth for IP ${ip}`);
    
    // Clean up expired sessions
    for (const [storedIp, timestamp] of this.lastAuthByIp.entries()) {
      if (now - timestamp > this.authSessionDuration) {
        this.lastAuthByIp.delete(storedIp);
      }
    }
  }
  
  /**
   * Check if an IP has an active auth session
   * 
   * @param ip - IP address to check
   * @returns Boolean indicating if IP has active auth session
   */
  public hasActiveAuthSession(ip: string): boolean {
    const timestamp = this.lastAuthByIp.get(ip);
    
    if (!timestamp) {
      return false;
    }
    
    const isValid = Date.now() - timestamp < this.authSessionDuration;
    
    if (!isValid) {
      this.lastAuthByIp.delete(ip);
    }
    
    return isValid;
  }
  
  /**
   * Verify a sensitive operation
   * 
   * @param operationType - Type of operation to verify
   * @param ip - IP address of the requester
   * @param password - Master password provided
   * @param data - Data related to the operation
   * @returns Result of verification attempt
   */
  public async verifyOperation(
    operationType: 'admin_access' | 'withdrawal' | 'settings_change',
    ip: string,
    password: string | null = null,
    data: any = {}
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    // Allow operation if IP has an active session and no password is required
    if (this.hasActiveAuthSession(ip) && !password) {
      console.log(`[SECURITY] Operation ${operationType} authorized via active session for IP ${ip}`);
      return {
        success: true,
        message: 'Authorized via active session'
      };
    }
    
    // Verify password if provided
    if (password && this.verifyMasterPassword(password)) {
      // Record successful authentication
      this.recordSuccessfulAuth(ip);
      
      // Send alert email
      await this.sendAlertEmail(operationType, data.username || 'Unknown', ip, data);
      
      console.log(`[SECURITY] Operation ${operationType} authorized via master password for IP ${ip}`);
      return {
        success: true,
        message: 'Authorized via master password'
      };
    }
    
    // If we get here, the operation is not authorized
    console.warn(`[SECURITY] Unauthorized ${operationType} attempt from IP ${ip}`);
    return {
      success: false,
      message: 'Not authorized'
    };
  }
  
  /**
   * Clear all auth sessions
   */
  public clearAllAuthSessions(): void {
    this.lastAuthByIp.clear();
    console.log('[SECURITY] All auth sessions cleared');
  }
  
  /**
   * Clear auth session for an IP
   * 
   * @param ip - IP address to clear session for
   */
  public clearAuthSession(ip: string): void {
    this.lastAuthByIp.delete(ip);
    console.log(`[SECURITY] Auth session cleared for IP ${ip}`);
  }
  
  /**
   * Send an email alert for a security event
   * 
   * @param operationType - Type of operation 
   * @param username - Username of the user performing the operation
   * @param ip - IP address of the requester
   * @param data - Data related to the operation
   */
  private async sendAlertEmail(
    operationType: 'admin_access' | 'withdrawal' | 'settings_change',
    username: string,
    ip: string,
    data: any
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[SECURITY] Email alerts disabled, would have sent alert for:', {
        operationType,
        username,
        ip,
        data
      });
      return;
    }
    
    let subject = '';
    let content = '';
    
    switch (operationType) {
      case 'admin_access':
        subject = '🔐 Admin Access Alert - Satoshi Beans Mining';
        content = `
          <h2>Admin Access Alert</h2>
          <p>Someone has accessed admin features on your Satoshi Beans Mining platform.</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>IP Address:</strong> ${ip}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p>If this was not you, please secure your account immediately.</p>
        `;
        break;
        
      case 'withdrawal':
        subject = '💸 Withdrawal Alert - Satoshi Beans Mining';
        content = `
          <h2>Withdrawal Alert</h2>
          <p>A withdrawal has been initiated on your Satoshi Beans Mining platform.</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>IP Address:</strong> ${ip}</p>
          <p><strong>Amount:</strong> ${data.amount || 'Unknown'} BTC</p>
          <p><strong>Destination:</strong> ${data.address || 'Unknown'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p>If this was not authorized by you, please secure your account immediately.</p>
        `;
        break;
        
      case 'settings_change':
        subject = '⚙️ Settings Change Alert - Satoshi Beans Mining';
        content = `
          <h2>Settings Change Alert</h2>
          <p>Settings have been changed on your Satoshi Beans Mining platform.</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>IP Address:</strong> ${ip}</p>
          <p><strong>Setting Changed:</strong> ${data.setting || 'Unknown'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p>If this was not authorized by you, please secure your account immediately.</p>
        `;
        break;
    }
    
    try {
      const msg = {
        to: this.adminEmail,
        from: 'notifications@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[SECURITY] Alert email sent to ${this.adminEmail}`);
    } catch (error) {
      console.error('[SECURITY] Error sending alert email:', error);
    }
  }
}