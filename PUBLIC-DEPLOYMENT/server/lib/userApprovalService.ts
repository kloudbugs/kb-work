/**
 * User Approval Service
 * 
 * This service manages the approval process for new users.
 * New users must be approved by an admin before they can access the app.
 */

import crypto from 'crypto';
import * as sendgrid from '@sendgrid/mail';
import { storage } from '../storage';

// Approval status enum
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export class UserApprovalService {
  private static instance: UserApprovalService;
  
  // Admin email for alerts
  private adminEmail: string = process.env.ADMIN_EMAIL || 'admin@example.com';
  
  private constructor() {
    // Initialize SendGrid if API key is provided
    if (process.env.SENDGRID_API_KEY) {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('[APPROVAL] SendGrid API key found, email alerts enabled');
    } else {
      console.log('[APPROVAL] No SendGrid API key found, email alerts disabled');
    }
    
    console.log('[APPROVAL] User approval service initialized');
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): UserApprovalService {
    if (!UserApprovalService.instance) {
      UserApprovalService.instance = new UserApprovalService();
    }
    return UserApprovalService.instance;
  }
  
  /**
   * Handle a new user registration
   * 
   * @param userId - User ID of the new user
   * @param username - Username of the new user
   * @param email - Email of the new user
   * @param ip - IP address of the registration request
   * @returns Result of the registration
   */
  public async handleNewRegistration(
    userId: string,
    username: string,
    email: string,
    ip: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Record approval status
      await storage.updateUser(userId, {
        approvalStatus: ApprovalStatus.PENDING
      });
      
      // Send approval request email to admin
      await this.sendApprovalRequestEmail(userId, username, email, ip);
      
      return {
        success: true,
        message: "Registration successful. Your account is pending admin approval."
      };
    } catch (error: any) {
      console.error('[APPROVAL] Error handling new registration:', error);
      return {
        success: false,
        message: error.message || "Error processing registration"
      };
    }
  }
  
  /**
   * Approve a user
   * 
   * @param userId - User ID to approve
   * @returns Result of the approval
   */
  public async approveUser(userId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const user = await storage.getUser(userId);
      
      if (!user) {
        return {
          success: false,
          message: "User not found"
        };
      }
      
      // Update approval status
      await storage.updateUser(userId, {
        approvalStatus: ApprovalStatus.APPROVED
      });
      
      // Generate a temporary password if needed
      let tempPassword: string | null = null;
      
      if (!user.hasSetPassword) {
        // Generate a random password
        tempPassword = crypto.randomBytes(4).toString('hex');
        
        // Hash the password and update user
        const hashedPassword = crypto.createHash('sha256').update(tempPassword).digest('hex');
        
        await storage.updateUser(userId, {
          password: hashedPassword,
          hasSetPassword: true
        });
      }
      
      // Send approval notification to user
      await this.sendApprovalNotificationEmail(user.email, user.username, tempPassword);
      
      return {
        success: true,
        message: `User ${user.username} approved successfully`
      };
    } catch (error: any) {
      console.error('[APPROVAL] Error approving user:', error);
      return {
        success: false,
        message: error.message || "Error approving user"
      };
    }
  }
  
  /**
   * Reject a user
   * 
   * @param userId - User ID to reject
   * @param reason - Reason for rejection (optional)
   * @returns Result of the rejection
   */
  public async rejectUser(userId: string, reason?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const user = await storage.getUser(userId);
      
      if (!user) {
        return {
          success: false,
          message: "User not found"
        };
      }
      
      // Update approval status
      await storage.updateUser(userId, {
        approvalStatus: ApprovalStatus.REJECTED
      });
      
      // Send rejection notification to user
      await this.sendRejectionEmail(user.email, user.username, reason);
      
      return {
        success: true,
        message: `User ${user.username} rejected`
      };
    } catch (error: any) {
      console.error('[APPROVAL] Error rejecting user:', error);
      return {
        success: false,
        message: error.message || "Error rejecting user"
      };
    }
  }
  
  /**
   * Check if a user is approved
   * 
   * @param userId - User ID to check
   * @returns Boolean indicating if user is approved
   */
  public async isUserApproved(userId: string): Promise<boolean> {
    try {
      const user = await storage.getUser(userId);
      
      if (!user) {
        return false;
      }
      
      return user.approvalStatus === ApprovalStatus.APPROVED;
    } catch (error) {
      console.error('[APPROVAL] Error checking user approval status:', error);
      return false;
    }
  }
  
  /**
   * Get all pending users
   * 
   * @returns Array of pending users
   */
  public async getPendingUsers(): Promise<any[]> {
    try {
      const users = await storage.getUsers();
      
      // Filter for pending users
      return users.filter(user => user.approvalStatus === ApprovalStatus.PENDING);
    } catch (error) {
      console.error('[APPROVAL] Error getting pending users:', error);
      return [];
    }
  }
  
  /**
   * Send an approval request email to the admin
   * 
   * @param userId - User ID of the new user
   * @param username - Username of the new user
   * @param email - Email of the new user
   * @param ip - IP address of the registration request
   */
  private async sendApprovalRequestEmail(
    userId: string,
    username: string,
    email: string,
    ip: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[APPROVAL] Email alerts disabled, would have sent approval request for:', {
        userId,
        username,
        email,
        ip
      });
      return;
    }
    
    const subject = '🆕 New User Registration - Approval Required';
    const content = `
      <h2>New User Registration</h2>
      <p>A new user has registered on your Satoshi Beans Mining platform.</p>
      <p><strong>Username:</strong> ${username}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>IP Address:</strong> ${ip}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p>Please log in to the admin dashboard to approve or reject this user.</p>
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
      console.log(`[APPROVAL] Approval request email sent to ${this.adminEmail}`);
    } catch (error) {
      console.error('[APPROVAL] Error sending approval request email:', error);
    }
  }
  
  /**
   * Send an approval notification email to the user
   * 
   * @param email - Email of the approved user
   * @param username - Username of the approved user
   * @param tempPassword - Temporary password (if generated)
   */
  private async sendApprovalNotificationEmail(
    email: string,
    username: string,
    tempPassword: string | null
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[APPROVAL] Email alerts disabled, would have sent approval notification to:', {
        email,
        username,
        tempPassword: tempPassword ? '[REDACTED]' : null
      });
      return;
    }
    
    const subject = '✅ Your Account Has Been Approved';
    let content = `
      <h2>Account Approved</h2>
      <p>Hello ${username},</p>
      <p>Your account on the Satoshi Beans Mining platform has been approved!</p>
      <p>You can now log in and start using the platform.</p>
    `;
    
    // Add temporary password information if provided
    if (tempPassword) {
      content += `
        <h3>Your Login Credentials</h3>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Please change your password after logging in for the first time.</p>
      `;
    }
    
    content += `
      <p><a href="https://yourdomain.com/login">Go to Login Page</a></p>
      <p>Welcome aboard!</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'notifications@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[APPROVAL] Approval notification email sent to ${email}`);
    } catch (error) {
      console.error('[APPROVAL] Error sending approval notification email:', error);
    }
  }
  
  /**
   * Send a rejection email to the user
   * 
   * @param email - Email of the rejected user
   * @param username - Username of the rejected user
   * @param reason - Reason for rejection (optional)
   */
  private async sendRejectionEmail(
    email: string,
    username: string,
    reason?: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[APPROVAL] Email alerts disabled, would have sent rejection notification to:', {
        email,
        username,
        reason
      });
      return;
    }
    
    const subject = '❌ Account Registration Status';
    let content = `
      <h2>Account Registration Status</h2>
      <p>Hello ${username},</p>
      <p>We regret to inform you that your account registration on the Satoshi Beans Mining platform could not be approved at this time.</p>
    `;
    
    // Add reason if provided
    if (reason) {
      content += `
        <p><strong>Reason:</strong> ${reason}</p>
      `;
    }
    
    content += `
      <p>If you believe this is an error or would like to provide additional information, please contact our support team.</p>
      <p>Thank you for your interest in our platform.</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'notifications@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[APPROVAL] Rejection email sent to ${email}`);
    } catch (error) {
      console.error('[APPROVAL] Error sending rejection email:', error);
    }
  }
}