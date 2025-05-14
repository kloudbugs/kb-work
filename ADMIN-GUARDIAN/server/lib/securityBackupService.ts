/**
 * Security Backup Service
 * 
 * This service provides backup authentication methods for when:
 * 1. Admin/user loses their 2FA device
 * 2. Admin accesses from a different IP/location
 * 3. Emergency access is needed
 */

import crypto from 'crypto';
import * as sendgrid from '@sendgrid/mail';
import { storage } from '../storage';

interface RecoveryRequest {
  userId: string;
  requestId: string;
  emailCode: string;
  masterPasswordHash: string;
  expires: Date;
  used: boolean;
}

interface TrustedDevice {
  deviceId: string;
  userId: string;
  name: string;
  ipAddress: string;
  lastSeen: Date;
  browserInfo: string;
}

export class SecurityBackupService {
  private static instance: SecurityBackupService;
  
  // Emergency recovery access code (one-time use, resets after use)
  private emergencyRecoveryCodeHash: string = 'e11a7153ff818867b89a7c8aed499136d7086cf10ec6b226de9a65594f34f0c1'; // Default: "emergency-access-2024"
  
  // Store recovery requests (temporary, expire after 30 minutes)
  private recoveryRequests: Map<string, RecoveryRequest> = new Map();
  
  // Store trusted devices
  private trustedDevices: Map<string, TrustedDevice> = new Map();
  
  // Admin email for alerts
  private adminEmail: string = process.env.ADMIN_EMAIL || 'admin@example.com';
  
  // Recovery request expiration time (30 minutes)
  private recoveryRequestExpiration: number = 30 * 60 * 1000;
  
  private constructor() {
    // Initialize SendGrid if API key is provided
    if (process.env.SENDGRID_API_KEY) {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('[RECOVERY] SendGrid API key found, email recovery enabled');
    } else {
      console.log('[RECOVERY] No SendGrid API key found, email recovery disabled');
    }
    
    // Clean up expired recovery requests every 15 minutes
    setInterval(() => this.cleanupExpiredRecoveryRequests(), 15 * 60 * 1000);
    
    console.log('[RECOVERY] Security backup service initialized');
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): SecurityBackupService {
    if (!SecurityBackupService.instance) {
      SecurityBackupService.instance = new SecurityBackupService();
    }
    return SecurityBackupService.instance;
  }
  
  /**
   * Start a recovery process for a user who has lost their 2FA device
   * 
   * @param email - User's email address
   * @returns Recovery request ID if successful
   */
  public async initiate2FARecovery(email: string): Promise<{
    success: boolean;
    message: string;
    requestId?: string;
  }> {
    try {
      // Find user by email
      const users = await this.getAllUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return {
          success: false,
          message: "No account found with that email address."
        };
      }
      
      // Generate random recovery codes
      const requestId = crypto.randomBytes(16).toString('hex');
      const emailCode = this.generateRandomCode(6);
      
      // Hash the email code for storage
      const emailCodeHash = crypto.createHash('sha256').update(emailCode).digest('hex');
      
      // Store the recovery request
      const recoveryRequest: RecoveryRequest = {
        userId: user.id,
        requestId,
        emailCode: emailCodeHash,
        masterPasswordHash: user.passwordHash,
        expires: new Date(Date.now() + this.recoveryRequestExpiration),
        used: false
      };
      
      this.recoveryRequests.set(requestId, recoveryRequest);
      
      // Send the email with recovery code
      await this.sendRecoveryEmail(user.email, user.username, emailCode, requestId);
      
      // Alert admin about recovery attempt
      await this.alertAdminAboutRecovery(user.id, user.username, user.email);
      
      return {
        success: true,
        message: "Recovery instructions sent to your email address.",
        requestId
      };
    } catch (error: any) {
      console.error('[RECOVERY] Error initiating 2FA recovery:', error);
      return {
        success: false,
        message: "Error initiating recovery process."
      };
    }
  }
  
  /**
   * Verify a recovery code from email
   * 
   * @param requestId - Recovery request ID
   * @param emailCode - Code sent to user's email
   * @returns Success/failure of verification
   */
  public async verifyRecoveryEmailCode(
    requestId: string,
    emailCode: string
  ): Promise<{
    success: boolean;
    message: string;
    recoveryContinuationToken?: string;
  }> {
    try {
      const request = this.recoveryRequests.get(requestId);
      
      if (!request) {
        return {
          success: false,
          message: "Invalid or expired recovery request."
        };
      }
      
      if (request.used) {
        return {
          success: false,
          message: "This recovery request has already been used."
        };
      }
      
      if (new Date() > request.expires) {
        this.recoveryRequests.delete(requestId);
        return {
          success: false,
          message: "Recovery request has expired."
        };
      }
      
      // Hash the provided email code for comparison
      const emailCodeHash = crypto.createHash('sha256').update(emailCode).digest('hex');
      
      if (emailCodeHash !== request.emailCode) {
        return {
          success: false,
          message: "Invalid recovery code."
        };
      }
      
      // Generate a continuation token for the next step
      const continuationToken = crypto.randomBytes(24).toString('hex');
      
      // Update the request with the continuation token
      request.emailCode = continuationToken;
      
      return {
        success: true,
        message: "Email code verified successfully.",
        recoveryContinuationToken: continuationToken
      };
    } catch (error: any) {
      console.error('[RECOVERY] Error verifying recovery email code:', error);
      return {
        success: false,
        message: "Error verifying recovery code."
      };
    }
  }
  
  /**
   * Verify user's original password during recovery
   * 
   * @param requestId - Recovery request ID
   * @param continuationToken - Token from email verification step
   * @param password - User's original password
   * @returns Success/failure of password verification
   */
  public async verifyOriginalPassword(
    requestId: string,
    continuationToken: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    recoveryCompleteToken?: string;
  }> {
    try {
      const request = this.recoveryRequests.get(requestId);
      
      if (!request) {
        return {
          success: false,
          message: "Invalid or expired recovery request."
        };
      }
      
      if (request.used) {
        return {
          success: false,
          message: "This recovery request has already been used."
        };
      }
      
      if (new Date() > request.expires) {
        this.recoveryRequests.delete(requestId);
        return {
          success: false,
          message: "Recovery request has expired."
        };
      }
      
      if (request.emailCode !== continuationToken) {
        return {
          success: false,
          message: "Invalid continuation token."
        };
      }
      
      // Hash the provided password for comparison
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      
      if (passwordHash !== request.masterPasswordHash) {
        return {
          success: false,
          message: "Invalid password."
        };
      }
      
      // Generate a complete token for the final step
      const completeToken = crypto.randomBytes(32).toString('hex');
      
      // Update the request as used
      request.used = true;
      
      return {
        success: true,
        message: "Password verified successfully.",
        recoveryCompleteToken: completeToken
      };
    } catch (error: any) {
      console.error('[RECOVERY] Error verifying original password:', error);
      return {
        success: false,
        message: "Error verifying password."
      };
    }
  }
  
  /**
   * Complete the recovery process and reset 2FA
   * 
   * @param requestId - Recovery request ID
   * @param completeToken - Token from password verification step
   * @returns Success/failure of recovery completion
   */
  public async completeRecovery(
    requestId: string,
    completeToken: string
  ): Promise<{
    success: boolean;
    message: string;
    newTotpToken?: string;
  }> {
    try {
      const request = this.recoveryRequests.get(requestId);
      
      if (!request) {
        return {
          success: false,
          message: "Invalid or expired recovery request."
        };
      }
      
      if (!request.used) {
        return {
          success: false,
          message: "Recovery verification not completed."
        };
      }
      
      if (new Date() > request.expires) {
        this.recoveryRequests.delete(requestId);
        return {
          success: false,
          message: "Recovery request has expired."
        };
      }
      
      // Find the user
      const user = await storage.getUser(request.userId);
      
      if (!user) {
        return {
          success: false,
          message: "User not found."
        };
      }
      
      // Reset 2FA and generate a new token
      const twoFactorService = (await import('./twoFactorAuth')).TwoFactorAuthService.getInstance();
      const newTotpData = await twoFactorService.generateSecret(user.id, user.username);
      
      // Clean up the recovery request
      this.recoveryRequests.delete(requestId);
      
      return {
        success: true,
        message: "Recovery completed successfully. Please set up your new 2FA device.",
        newTotpToken: newTotpData.qrCodeDataUrl
      };
    } catch (error: any) {
      console.error('[RECOVERY] Error completing recovery:', error);
      return {
        success: false,
        message: "Error completing recovery process."
      };
    }
  }
  
  /**
   * Register a trusted device for a user
   * 
   * @param userId - User ID
   * @param ipAddress - IP address of the device
   * @param browserInfo - Browser/device info
   * @param deviceName - Name of the device (e.g., "My Laptop")
   * @returns Success/failure of device registration
   */
  public async registerTrustedDevice(
    userId: string,
    ipAddress: string,
    browserInfo: string,
    deviceName: string
  ): Promise<{
    success: boolean;
    message: string;
    deviceId?: string;
  }> {
    try {
      // Generate a unique device ID
      const deviceId = crypto.randomBytes(16).toString('hex');
      
      // Store the trusted device
      const trustedDevice: TrustedDevice = {
        deviceId,
        userId,
        name: deviceName,
        ipAddress,
        lastSeen: new Date(),
        browserInfo
      };
      
      this.trustedDevices.set(deviceId, trustedDevice);
      
      // Save to user's trusted devices list in database
      const user = await storage.getUser(userId);
      
      if (user) {
        // Add to user's trusted devices (if the field exists)
        const trustedDevices = user.trustedDevices || [];
        trustedDevices.push(deviceId);
        
        await storage.updateUser(userId, {
          trustedDevices
        });
      }
      
      return {
        success: true,
        message: `Device "${deviceName}" registered as trusted.`,
        deviceId
      };
    } catch (error: any) {
      console.error('[RECOVERY] Error registering trusted device:', error);
      return {
        success: false,
        message: "Error registering trusted device."
      };
    }
  }
  
  /**
   * Check if a device is trusted for a user
   * 
   * @param userId - User ID
   * @param deviceId - Device ID
   * @param ipAddress - Current IP address
   * @returns Boolean indicating if the device is trusted
   */
  public isTrustedDevice(
    userId: string,
    deviceId: string,
    ipAddress: string
  ): boolean {
    const device = this.trustedDevices.get(deviceId);
    
    if (!device) {
      return false;
    }
    
    if (device.userId !== userId) {
      return false;
    }
    
    // Update last seen time and IP if it has changed
    device.lastSeen = new Date();
    if (device.ipAddress !== ipAddress) {
      device.ipAddress = ipAddress;
    }
    
    return true;
  }
  
  /**
   * Use emergency recovery code (admin only)
   * 
   * @param emergencyCode - Emergency access code
   * @returns Success/failure of emergency recovery
   */
  public async useEmergencyRecoveryCode(
    emergencyCode: string
  ): Promise<{
    success: boolean;
    message: string;
    adminAccessToken?: string;
  }> {
    try {
      // Hash the provided emergency code for comparison
      const emergencyCodeHash = crypto.createHash('sha256').update(emergencyCode).digest('hex');
      
      if (emergencyCodeHash !== this.emergencyRecoveryCodeHash) {
        return {
          success: false,
          message: "Invalid emergency recovery code."
        };
      }
      
      // Generate a new emergency code for future use
      const newEmergencyCode = this.generateRandomCode(16);
      this.emergencyRecoveryCodeHash = crypto.createHash('sha256').update(newEmergencyCode).digest('hex');
      
      // Generate an admin access token
      const adminAccessToken = crypto.randomBytes(32).toString('hex');
      
      // Send the new emergency code to the admin email
      await this.sendNewEmergencyCodeEmail(this.adminEmail, newEmergencyCode);
      
      return {
        success: true,
        message: "Emergency recovery successful. A new emergency code has been sent to your email.",
        adminAccessToken
      };
    } catch (error: any) {
      console.error('[RECOVERY] Error using emergency recovery code:', error);
      return {
        success: false,
        message: "Error processing emergency recovery."
      };
    }
  }
  
  /**
   * Clean up expired recovery requests
   */
  private cleanupExpiredRecoveryRequests(): void {
    const now = new Date();
    
    for (const [requestId, request] of this.recoveryRequests.entries()) {
      if (now > request.expires) {
        this.recoveryRequests.delete(requestId);
      }
    }
    
    console.log(`[RECOVERY] Cleaned up expired recovery requests. ${this.recoveryRequests.size} active requests remaining.`);
  }
  
  /**
   * Generate a random numeric code of specified length
   * 
   * @param length - Length of the code
   * @returns Random code
   */
  private generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      code += chars.charAt(randomIndex);
    }
    
    return code;
  }
  
  /**
   * Send recovery email to user
   * 
   * @param email - User's email address
   * @param username - User's username
   * @param recoveryCode - Recovery code
   * @param requestId - Recovery request ID
   */
  private async sendRecoveryEmail(
    email: string,
    username: string,
    recoveryCode: string,
    requestId: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[RECOVERY] Email alerts disabled, would have sent recovery email to:', {
        email,
        username,
        recoveryCode,
        requestId
      });
      return;
    }
    
    const subject = '🔐 Account Recovery - Satoshi Beans Mining';
    const content = `
      <h2>Account Recovery Request</h2>
      <p>Hello ${username},</p>
      <p>We received a request to recover access to your account on the Satoshi Beans Mining platform.</p>
      <p>Your recovery code is: <strong>${recoveryCode}</strong></p>
      <p>This code will expire in 30 minutes.</p>
      <p>If you did not request this recovery, please contact support immediately.</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'recovery@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[RECOVERY] Recovery email sent to ${email}`);
    } catch (error) {
      console.error('[RECOVERY] Error sending recovery email:', error);
    }
  }
  
  /**
   * Send new emergency code email to admin
   * 
   * @param email - Admin email address
   * @param newEmergencyCode - New emergency code
   */
  private async sendNewEmergencyCodeEmail(
    email: string,
    newEmergencyCode: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[RECOVERY] Email alerts disabled, would have sent new emergency code email to:', {
        email,
        newEmergencyCode
      });
      return;
    }
    
    const subject = '🚨 New Emergency Access Code - Satoshi Beans Mining';
    const content = `
      <h2>New Emergency Access Code</h2>
      <p>An emergency recovery was performed on your Satoshi Beans Mining platform.</p>
      <p>Your new emergency recovery code is: <strong>${newEmergencyCode}</strong></p>
      <p>Please store this code securely. It can be used to regain access to your account if you lose your 2FA device.</p>
      <p>If you did not perform this emergency recovery, please secure your account immediately.</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'security@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[RECOVERY] New emergency code email sent to ${email}`);
    } catch (error) {
      console.error('[RECOVERY] Error sending new emergency code email:', error);
    }
  }
  
  /**
   * Alert admin about recovery attempt
   * 
   * @param userId - User ID attempting recovery
   * @param username - Username attempting recovery
   * @param email - Email of user attempting recovery
   */
  private async alertAdminAboutRecovery(
    userId: string,
    username: string,
    email: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[RECOVERY] Email alerts disabled, would have sent admin alert for recovery attempt:', {
        userId,
        username,
        email
      });
      return;
    }
    
    const subject = '🚨 Recovery Attempt Alert - Satoshi Beans Mining';
    const content = `
      <h2>Account Recovery Attempt</h2>
      <p>A recovery has been initiated on your Satoshi Beans Mining platform.</p>
      <p><strong>User ID:</strong> ${userId}</p>
      <p><strong>Username:</strong> ${username}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p>If this was not authorized by you, please secure your account immediately.</p>
    `;
    
    try {
      const msg = {
        to: this.adminEmail,
        from: 'security@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[RECOVERY] Admin alert sent to ${this.adminEmail}`);
    } catch (error) {
      console.error('[RECOVERY] Error sending admin alert:', error);
    }
  }
  
  /**
   * Get all users (temporary method for recovery lookup)
   */
  private async getAllUsers(): Promise<any[]> {
    try {
      // If storage has a getUsers method
      if (typeof storage.getUsers === 'function') {
        return await storage.getUsers();
      }
      
      // Fallback to get admin user directly
      const adminUser = await storage.getUser('admin');
      return adminUser ? [adminUser] : [];
    } catch (error) {
      console.error('[RECOVERY] Error fetching users:', error);
      return [];
    }
  }
}