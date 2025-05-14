/**
 * User Registration Service
 * 
 * This service manages the controlled registration process:
 * 1. Admin creates/approves new users and generates credentials
 * 2. System sends credentials to approved users
 * 3. Users log in with provided credentials
 * 4. Users must set up 2FA during first login
 * 5. Subsequent logins require 2FA
 */

import crypto from 'crypto';
import * as sendgrid from '@sendgrid/mail';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../storage';
import { UserRole, ApprovalStatus } from '../../shared/schema';

interface PendingRegistration {
  email: string;
  fullName: string;
  ipAddress: string;
  requestDate: Date;
  reason: string;
  additionalInfo: any;
  status: 'pending' | 'approved' | 'rejected';
  id: string;
}

export class UserRegistrationService {
  private static instance: UserRegistrationService;
  
  // Store pending registration requests
  private pendingRegistrations: Map<string, PendingRegistration> = new Map();
  
  // Admin email for notifications
  private adminEmail: string = process.env.ADMIN_EMAIL || 'admin@example.com';
  
  private constructor() {
    // Initialize SendGrid if API key is provided
    if (process.env.SENDGRID_API_KEY) {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('[REGISTRATION] SendGrid API key found, email notifications enabled');
    } else {
      console.log('[REGISTRATION] No SendGrid API key found, email notifications disabled');
    }
    
    console.log('[REGISTRATION] User registration service initialized');
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): UserRegistrationService {
    if (!UserRegistrationService.instance) {
      UserRegistrationService.instance = new UserRegistrationService();
    }
    return UserRegistrationService.instance;
  }
  
  /**
   * Submit a new registration request
   * 
   * @param email - Email of potential user
   * @param fullName - Full name of potential user
   * @param reason - Reason for joining
   * @param ipAddress - IP address of the request
   * @param additionalInfo - Additional information provided
   * @returns Result of submission
   */
  public async submitRegistrationRequest(
    email: string,
    fullName: string,
    reason: string,
    ipAddress: string,
    additionalInfo: any = {}
  ): Promise<{
    success: boolean;
    message: string;
    requestId?: string;
  }> {
    try {
      // Check if email is already registered
      const users = await this.getAllUsers();
      const existingUser = users.find(user => user.email === email);
      
      if (existingUser) {
        return {
          success: false,
          message: "This email is already registered."
        };
      }
      
      // Check if there's already a pending request for this email
      for (const [_, request] of this.pendingRegistrations.entries()) {
        if (request.email === email && request.status === 'pending') {
          return {
            success: false,
            message: "A registration request for this email is already pending."
          };
        }
      }
      
      // Create registration request
      const requestId = uuidv4();
      const request: PendingRegistration = {
        id: requestId,
        email,
        fullName,
        reason,
        ipAddress,
        additionalInfo,
        requestDate: new Date(),
        status: 'pending'
      };
      
      // Store the request
      this.pendingRegistrations.set(requestId, request);
      
      // Notify admin about the new registration request
      await this.notifyAdminAboutRegistrationRequest(request);
      
      // Send confirmation to the user
      await this.sendRegistrationConfirmationEmail(email, fullName);
      
      return {
        success: true,
        message: "Registration request submitted successfully. You'll be notified when your account is approved.",
        requestId
      };
    } catch (error: any) {
      console.error('[REGISTRATION] Error submitting registration request:', error);
      return {
        success: false,
        message: "Error submitting registration request."
      };
    }
  }
  
  /**
   * Get all pending registration requests
   * 
   * @returns Array of pending registration requests
   */
  public getPendingRegistrationRequests(): PendingRegistration[] {
    const pendingRequests: PendingRegistration[] = [];
    
    for (const [_, request] of this.pendingRegistrations.entries()) {
      if (request.status === 'pending') {
        pendingRequests.push(request);
      }
    }
    
    return pendingRequests;
  }
  
  /**
   * Approve a registration request and create a user account
   * 
   * @param requestId - ID of the request to approve
   * @param adminId - ID of the admin approving the request
   * @param username - Username to assign (optional, generated if not provided)
   * @returns Result of approval
   */
  public async approveRegistrationRequest(
    requestId: string,
    adminId: string,
    username?: string
  ): Promise<{
    success: boolean;
    message: string;
    user?: {
      id: string;
      username: string;
      email: string;
      initialPassword: string;
    };
  }> {
    try {
      const request = this.pendingRegistrations.get(requestId);
      
      if (!request) {
        return {
          success: false,
          message: "Registration request not found."
        };
      }
      
      if (request.status !== 'pending') {
        return {
          success: false,
          message: `This request has already been ${request.status}.`
        };
      }
      
      // Generate a username if not provided
      if (!username) {
        // Create username from the first part of the email
        const emailParts = request.email.split('@');
        username = emailParts[0];
        
        // Add random numbers if needed
        if (username.length < 3) {
          username += Math.floor(Math.random() * 1000);
        }
        
        // Ensure username doesn't have special characters
        username = username.replace(/[^a-zA-Z0-9]/g, '');
      }
      
      // Generate a random initial password
      const initialPassword = this.generateSecurePassword();
      
      // Hash the password for storage
      const passwordHash = crypto.createHash('sha256').update(initialPassword).digest('hex');
      
      // Create the user account
      const userId = uuidv4();
      const user = {
        id: userId,
        username,
        email: request.email,
        passwordHash,
        role: UserRole.USER,
        approvalStatus: ApprovalStatus.APPROVED,
        approvalDate: new Date(),
        miningBalance: "0",
        totalEarned: "0",
        totalPaid: "0",
        pendingPayouts: "0",
        requireTwoFactor: true,
        twoFactorVerified: false,
        notificationsEnabled: true,
        created: new Date(),
        updated: new Date()
      };
      
      // Save the user to the database
      await storage.createUser(user);
      
      // Update the request status
      request.status = 'approved';
      
      // Send credentials to the user
      await this.sendUserCredentialsEmail(
        request.email,
        request.fullName,
        username,
        initialPassword
      );
      
      // Log the approval
      console.log(`[REGISTRATION] User registration approved by admin ${adminId}: ${request.email}`);
      
      return {
        success: true,
        message: "Registration approved and account created successfully.",
        user: {
          id: userId,
          username,
          email: request.email,
          initialPassword
        }
      };
    } catch (error: any) {
      console.error('[REGISTRATION] Error approving registration request:', error);
      return {
        success: false,
        message: "Error approving registration request."
      };
    }
  }
  
  /**
   * Reject a registration request
   * 
   * @param requestId - ID of the request to reject
   * @param adminId - ID of the admin rejecting the request
   * @param reason - Reason for rejection
   * @returns Result of rejection
   */
  public async rejectRegistrationRequest(
    requestId: string,
    adminId: string,
    reason: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const request = this.pendingRegistrations.get(requestId);
      
      if (!request) {
        return {
          success: false,
          message: "Registration request not found."
        };
      }
      
      if (request.status !== 'pending') {
        return {
          success: false,
          message: `This request has already been ${request.status}.`
        };
      }
      
      // Update the request status
      request.status = 'rejected';
      
      // Send rejection notification to the user
      await this.sendRejectionEmail(
        request.email,
        request.fullName,
        reason
      );
      
      // Log the rejection
      console.log(`[REGISTRATION] User registration rejected by admin ${adminId}: ${request.email}`);
      
      return {
        success: true,
        message: "Registration request rejected."
      };
    } catch (error: any) {
      console.error('[REGISTRATION] Error rejecting registration request:', error);
      return {
        success: false,
        message: "Error rejecting registration request."
      };
    }
  }
  
  /**
   * Manually create a new user account
   * 
   * @param email - Email of the new user
   * @param username - Username for the new user
   * @param fullName - Full name of the new user
   * @param adminId - ID of the admin creating the account
   * @param role - Role to assign to the user
   * @returns Result of user creation
   */
  public async createUserAccount(
    email: string,
    username: string,
    fullName: string,
    adminId: string,
    role: UserRole = UserRole.USER
  ): Promise<{
    success: boolean;
    message: string;
    user?: {
      id: string;
      username: string;
      email: string;
      initialPassword: string;
    };
  }> {
    try {
      // Check if email is already registered
      const users = await this.getAllUsers();
      const existingUser = users.find(user => user.email === email || user.username === username);
      
      if (existingUser) {
        return {
          success: false,
          message: "This email or username is already registered."
        };
      }
      
      // Generate a random initial password
      const initialPassword = this.generateSecurePassword();
      
      // Hash the password for storage
      const passwordHash = crypto.createHash('sha256').update(initialPassword).digest('hex');
      
      // Create the user account
      const userId = uuidv4();
      const user = {
        id: userId,
        username,
        email,
        passwordHash,
        role,
        approvalStatus: ApprovalStatus.APPROVED,
        approvalDate: new Date(),
        miningBalance: "0",
        totalEarned: "0",
        totalPaid: "0",
        pendingPayouts: "0",
        requireTwoFactor: true,
        twoFactorVerified: false,
        notificationsEnabled: true,
        created: new Date(),
        updated: new Date()
      };
      
      // Save the user to the database
      await storage.createUser(user);
      
      // Send credentials to the user
      await this.sendUserCredentialsEmail(
        email,
        fullName,
        username,
        initialPassword
      );
      
      // Log the creation
      console.log(`[REGISTRATION] User account manually created by admin ${adminId}: ${email}`);
      
      return {
        success: true,
        message: "User account created successfully.",
        user: {
          id: userId,
          username,
          email,
          initialPassword
        }
      };
    } catch (error: any) {
      console.error('[REGISTRATION] Error creating user account:', error);
      return {
        success: false,
        message: "Error creating user account."
      };
    }
  }
  
  /**
   * Handle user's first login and 2FA setup
   * 
   * @param userId - User ID
   * @returns Result with 2FA setup information
   */
  public async handleFirstLogin(userId: string): Promise<{
    success: boolean;
    message: string;
    totpSetupData?: {
      qrCodeDataUrl: string;
      secret: string;
    };
  }> {
    try {
      const user = await storage.getUser(userId);
      
      if (!user) {
        return {
          success: false,
          message: "User not found."
        };
      }
      
      // Check if 2FA is already verified
      if (user.twoFactorVerified) {
        return {
          success: false,
          message: "Two-factor authentication is already set up for this account."
        };
      }
      
      // Generate 2FA setup data
      const twoFactorService = (await import('./twoFactorAuth')).TwoFactorAuthService.getInstance();
      const totpSetupData = await twoFactorService.generateSecret(user.id, user.username);
      
      return {
        success: true,
        message: "Please set up two-factor authentication to secure your account.",
        totpSetupData
      };
    } catch (error: any) {
      console.error('[REGISTRATION] Error handling first login:', error);
      return {
        success: false,
        message: "Error setting up two-factor authentication."
      };
    }
  }
  
  /**
   * Verify and complete 2FA setup
   * 
   * @param userId - User ID
   * @param totpCode - TOTP code from the authenticator app
   * @returns Result of verification
   */
  public async verifyAndCompleteTwoFactorSetup(
    userId: string,
    totpCode: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const user = await storage.getUser(userId);
      
      if (!user) {
        return {
          success: false,
          message: "User not found."
        };
      }
      
      // Verify the TOTP code
      const twoFactorService = (await import('./twoFactorAuth')).TwoFactorAuthService.getInstance();
      const isValid = await twoFactorService.verifyCode(userId, totpCode);
      
      if (!isValid) {
        return {
          success: false,
          message: "Invalid verification code. Please try again."
        };
      }
      
      // Update the user to mark 2FA as verified
      await storage.updateUser(userId, {
        twoFactorVerified: true
      });
      
      // Generate backup codes
      const backupCodes = await twoFactorService.generateBackupCodes(userId);
      
      return {
        success: true,
        message: "Two-factor authentication set up successfully. Please keep these backup codes in a safe place.",
        backupCodes
      };
    } catch (error: any) {
      console.error('[REGISTRATION] Error verifying 2FA setup:', error);
      return {
        success: false,
        message: "Error verifying two-factor authentication."
      };
    }
  }
  
  /**
   * Generate a secure random password
   * 
   * @returns Secure random password
   */
  private generateSecurePassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset.charAt(randomIndex);
    }
    
    return password;
  }
  
  /**
   * Send credentials email to approved user
   * 
   * @param email - User's email
   * @param fullName - User's full name
   * @param username - Assigned username
   * @param password - Initial password
   */
  private async sendUserCredentialsEmail(
    email: string,
    fullName: string,
    username: string,
    password: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[REGISTRATION] Email notifications disabled, would have sent credentials to:', {
        email,
        fullName,
        username,
        password: '[REDACTED]'
      });
      return;
    }
    
    const subject = '✅ Your Satoshi Beans Mining Account';
    const content = `
      <h2>Welcome to Satoshi Beans Mining!</h2>
      <p>Hello ${fullName},</p>
      <p>Your account has been approved and created. Here are your login credentials:</p>
      <p><strong>Username:</strong> ${username}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>On your first login, you'll be required to set up two-factor authentication (2FA) to secure your account.</p>
      <p>Please login at: <a href="https://yourdomain.com/login">https://yourdomain.com/login</a></p>
      <p>For security reasons, please change your password after your first login.</p>
      <p>Welcome aboard!</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'accounts@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[REGISTRATION] Credentials email sent to ${email}`);
    } catch (error) {
      console.error('[REGISTRATION] Error sending credentials email:', error);
    }
  }
  
  /**
   * Send rejection email to user
   * 
   * @param email - User's email
   * @param fullName - User's full name
   * @param reason - Reason for rejection
   */
  private async sendRejectionEmail(
    email: string,
    fullName: string,
    reason: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[REGISTRATION] Email notifications disabled, would have sent rejection to:', {
        email,
        fullName,
        reason
      });
      return;
    }
    
    const subject = '❌ Satoshi Beans Mining Registration Status';
    const content = `
      <h2>Registration Status Update</h2>
      <p>Hello ${fullName},</p>
      <p>We have reviewed your registration request for the Satoshi Beans Mining platform.</p>
      <p>Unfortunately, we were unable to approve your account at this time.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>If you believe this is an error or would like to provide additional information, please contact our support team.</p>
      <p>Thank you for your interest in our platform.</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'accounts@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[REGISTRATION] Rejection email sent to ${email}`);
    } catch (error) {
      console.error('[REGISTRATION] Error sending rejection email:', error);
    }
  }
  
  /**
   * Notify admin about new registration request
   * 
   * @param request - Registration request details
   */
  private async notifyAdminAboutRegistrationRequest(
    request: PendingRegistration
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[REGISTRATION] Email notifications disabled, would have sent admin notification for:', {
        request
      });
      return;
    }
    
    const subject = '🆕 New Registration Request - Satoshi Beans Mining';
    const content = `
      <h2>New Registration Request</h2>
      <p>A new user has requested to join the Satoshi Beans Mining platform.</p>
      <p><strong>Name:</strong> ${request.fullName}</p>
      <p><strong>Email:</strong> ${request.email}</p>
      <p><strong>Reason:</strong> ${request.reason}</p>
      <p><strong>IP Address:</strong> ${request.ipAddress}</p>
      <p><strong>Request Date:</strong> ${request.requestDate.toLocaleString()}</p>
      <p>Please log in to the admin dashboard to approve or reject this request.</p>
      <p><a href="https://yourdomain.com/admin/users">Go to Admin Dashboard</a></p>
    `;
    
    try {
      const msg = {
        to: this.adminEmail,
        from: 'notifications@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[REGISTRATION] Admin notification sent to ${this.adminEmail}`);
    } catch (error) {
      console.error('[REGISTRATION] Error sending admin notification:', error);
    }
  }
  
  /**
   * Send registration confirmation email to user
   * 
   * @param email - User's email
   * @param fullName - User's full name
   */
  private async sendRegistrationConfirmationEmail(
    email: string,
    fullName: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[REGISTRATION] Email notifications disabled, would have sent confirmation to:', {
        email,
        fullName
      });
      return;
    }
    
    const subject = '🔔 Registration Request Received - Satoshi Beans Mining';
    const content = `
      <h2>Registration Request Received</h2>
      <p>Hello ${fullName},</p>
      <p>Thank you for your interest in joining the Satoshi Beans Mining platform.</p>
      <p>Your registration request has been received and is pending review by our administrators.</p>
      <p>You will be notified by email once your account has been approved or if additional information is needed.</p>
      <p>Thank you for your patience.</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'accounts@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[REGISTRATION] Confirmation email sent to ${email}`);
    } catch (error) {
      console.error('[REGISTRATION] Error sending confirmation email:', error);
    }
  }
  
  /**
   * Get all users (temporary method for registration lookup)
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
      console.error('[REGISTRATION] Error fetching users:', error);
      return [];
    }
  }
}