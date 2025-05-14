/**
 * Admin Account Service
 * 
 * This service manages the admin account creation and authentication:
 * 1. First-time setup (initialization)
 * 2. Secure admin authentication via email
 * 3. Admin password management
 */

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import * as sendgrid from '@sendgrid/mail';
import { storage } from '../storage';
import { UserRole } from '../../shared/schema';

interface AdminSetupToken {
  token: string;
  email: string;
  expires: Date;
}

export class AdminAccountService {
  private static instance: AdminAccountService;
  
  // Store admin setup token
  private setupToken: AdminSetupToken | null = null;
  
  // Setup token expiration (24 hours)
  private setupTokenExpirationHours: number = 24;
  
  constructor() {
    // Initialize SendGrid if API key is provided
    if (process.env.SENDGRID_API_KEY) {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('[ADMIN] SendGrid API key found, email notifications enabled');
    } else {
      console.log('[ADMIN] No SendGrid API key found, email notifications disabled');
    }
    
    console.log('[ADMIN] Admin account service initialized');
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): AdminAccountService {
    if (!AdminAccountService.instance) {
      AdminAccountService.instance = new AdminAccountService();
    }
    return AdminAccountService.instance;
  }
  
  /**
   * Check if admin account exists
   * 
   * @returns Boolean indicating if admin exists
   */
  public async adminExists(): Promise<boolean> {
    try {
      const users = await this.getAllUsers();
      return users.some(user => user.role === UserRole.ADMIN);
    } catch (error) {
      console.error('[ADMIN] Error checking if admin exists:', error);
      return false;
    }
  }
  
  /**
   * Initialize admin account setup
   * 
   * @param email - Email address for admin
   * @returns Setup token if successful
   */
  public async initializeAdminSetup(
    email: string
  ): Promise<{
    success: boolean;
    message: string;
    setupUrl?: string;
  }> {
    try {
      // Check if admin already exists
      const adminExists = await this.adminExists();
      
      if (adminExists) {
        return {
          success: false,
          message: "Admin account already exists"
        };
      }
      
      // Generate setup token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Store token with expiration
      this.setupToken = {
        token,
        email,
        expires: new Date(Date.now() + this.setupTokenExpirationHours * 60 * 60 * 1000)
      };
      
      // Generate setup URL
      const setupUrl = `${process.env.APP_URL || 'https://yourdomain.com'}/admin/setup?token=${token}`;
      
      // Send setup email
      await this.sendAdminSetupEmail(email, setupUrl);
      
      return {
        success: true,
        message: "Admin setup initialized. Check your email for setup instructions.",
        setupUrl
      };
    } catch (error: any) {
      console.error('[ADMIN] Error initializing admin setup:', error);
      return {
        success: false,
        message: "Error initializing admin setup"
      };
    }
  }
  
  /**
   * Complete admin account setup
   * 
   * @param token - Setup token
   * @param username - Admin username
   * @param password - Admin password
   * @param fullName - Admin's full name
   * @returns Result of admin creation
   */
  public async completeAdminSetup(
    token: string,
    username: string,
    password: string,
    fullName: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Validate token
      if (!this.setupToken || this.setupToken.token !== token) {
        return {
          success: false,
          message: "Invalid setup token"
        };
      }
      
      // Check if token expired
      if (new Date() > this.setupToken.expires) {
        this.setupToken = null;
        return {
          success: false,
          message: "Setup token has expired"
        };
      }
      
      // Check if admin already exists
      const adminExists = await this.adminExists();
      
      if (adminExists) {
        return {
          success: false,
          message: "Admin account already exists"
        };
      }
      
      // Hash the password
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      
      // Create admin account
      const adminUser = {
        id: uuidv4(),
        username,
        email: this.setupToken.email,
        passwordHash,
        fullName,
        role: UserRole.ADMIN,
        created: new Date(),
        updated: new Date()
      };
      
      // Save admin to database
      await storage.createUser(adminUser);
      
      // Clear setup token
      this.setupToken = null;
      
      console.log(`[ADMIN] Admin account created: ${username} (${this.setupToken?.email})`);
      
      return {
        success: true,
        message: "Admin account created successfully"
      };
    } catch (error: any) {
      console.error('[ADMIN] Error completing admin setup:', error);
      return {
        success: false,
        message: "Error completing admin setup"
      };
    }
  }
  
  /**
   * Generate login code for admin authentication
   * 
   * @param email - Admin email address
   * @param ipAddress - IP address of login attempt
   * @returns Success/failure of login code generation
   */
  public async generateAdminLoginCode(
    email: string,
    ipAddress: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Get admin by email
      const adminUser = await this.getAdminByEmail(email);
      
      if (!adminUser) {
        // Return generic message to prevent email enumeration
        return {
          success: true,
          message: "If this email belongs to an admin, a login code has been sent."
        };
      }
      
      // Use EmailVerificationService to send the code
      const emailVerificationService = (await import('./emailVerificationService')).EmailVerificationService.getInstance();
      
      const result = await emailVerificationService.sendAdminLoginCode(email, ipAddress);
      
      return {
        success: result.success,
        message: result.message
      };
    } catch (error: any) {
      console.error('[ADMIN] Error generating admin login code:', error);
      return {
        success: false,
        message: "Error generating login code"
      };
    }
  }
  
  /**
   * Reset admin password (super admin function)
   * 
   * @param adminEmail - Admin email to confirm authority
   * @param newPassword - New password to set
   * @returns Success/failure of password reset
   */
  public async resetAdminPassword(
    adminEmail: string,
    newPassword: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Find admin user
      const adminUser = await this.getAdminByEmail(adminEmail);
      
      if (!adminUser) {
        return {
          success: false,
          message: "Admin account not found"
        };
      }
      
      // Hash the new password
      const passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
      
      // Update admin password
      await storage.updateUser(adminUser.id, {
        passwordHash,
        updated: new Date()
      });
      
      // Send notification about password change
      await this.sendPasswordChangeNotification(adminEmail);
      
      return {
        success: true,
        message: "Admin password reset successfully"
      };
    } catch (error: any) {
      console.error('[ADMIN] Error resetting admin password:', error);
      return {
        success: false,
        message: "Error resetting admin password"
      };
    }
  }
  
  /**
   * Get admin user by email
   * 
   * @param email - Admin email address
   * @returns Admin user if found
   */
  private async getAdminByEmail(email: string): Promise<any | null> {
    try {
      // Get all users (in a real app, this would use a more efficient query)
      const users = await this.getAllUsers();
      
      // Find admin user with matching email
      return users.find(user => 
        user.role === UserRole.ADMIN && 
        user.email.toLowerCase() === email.toLowerCase()
      ) || null;
    } catch (error) {
      console.error('[ADMIN] Error getting admin by email:', error);
      return null;
    }
  }
  
  /**
   * Get all users (temporary method)
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
      console.error('[ADMIN] Error fetching users:', error);
      return [];
    }
  }
  
  /**
   * Send admin setup email
   * 
   * @param email - Admin email address
   * @param setupUrl - URL for admin setup
   */
  private async sendAdminSetupEmail(
    email: string,
    setupUrl: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[ADMIN] Email notifications disabled, would have sent admin setup instructions to:', {
        email,
        setupUrl
      });
      return;
    }
    
    const subject = '🔧 Admin Account Setup - Satoshi Beans Mining';
    const content = `
      <h2>Admin Account Setup</h2>
      <p>You've been selected as an administrator for the Satoshi Beans Mining platform.</p>
      <p>Please use the following link to complete your admin account setup:</p>
      <p><a href="${setupUrl}">${setupUrl}</a></p>
      <p>This link will expire in ${this.setupTokenExpirationHours} hours.</p>
      <p>If you did not request this setup, please ignore this email.</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'admin@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[ADMIN] Admin setup email sent to ${email}`);
    } catch (error) {
      console.error('[ADMIN] Error sending admin setup email:', error);
      throw error;
    }
  }
  
  /**
   * Send password change notification
   * 
   * @param email - Admin email address
   */
  private async sendPasswordChangeNotification(
    email: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[ADMIN] Email notifications disabled, would have sent password change notification to:', {
        email
      });
      return;
    }
    
    const subject = '🔑 Admin Password Changed - Satoshi Beans Mining';
    const content = `
      <h2>Admin Password Changed</h2>
      <p>Your admin password for the Satoshi Beans Mining platform has been changed.</p>
      <p>If you did not request this change, please contact support immediately.</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'security@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[ADMIN] Password change notification sent to ${email}`);
    } catch (error) {
      console.error('[ADMIN] Error sending password change notification:', error);
      // Don't throw error for notification
    }
  }
}