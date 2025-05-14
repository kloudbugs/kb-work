/**
 * Ghost Account Service
 * 
 * This service manages ghost accounts that can perform admin actions
 * while appearing as separate entities:
 * 1. Create ghost accounts linked to main admin
 * 2. Authenticate ghost accounts
 * 3. Track ghost account actions 
 */

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import * as sendgrid from '@sendgrid/mail';
import { storage } from '../storage';
import { UserRole } from '../../shared/schema';

// Additional role for ghost accounts
enum ExtendedUserRole {
  GHOST_ADMIN = 'ghost_admin'
}

interface GhostSession {
  id: string;
  ghostId: string;
  adminId: string;
  created: Date;
  expires: Date;
  lastActivity: Date;
}

export class GhostAccountService {
  private static instance: GhostAccountService;
  
  // Store active ghost sessions
  private activeSessions: Map<string, GhostSession> = new Map();
  
  // Admin email for notifications
  private adminEmail: string = process.env.ADMIN_EMAIL || 'admin@example.com';
  
  // Session duration (8 hours)
  private sessionDurationHours: number = 8;
  
  private constructor() {
    // Initialize SendGrid if API key is provided
    if (process.env.SENDGRID_API_KEY) {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('[GHOST] SendGrid API key found, email notifications enabled');
    } else {
      console.log('[GHOST] No SendGrid API key found, email notifications disabled');
    }
    
    // Clean up expired sessions every hour
    setInterval(() => this.cleanupExpiredSessions(), 60 * 60 * 1000);
    
    console.log('[GHOST] Ghost account service initialized');
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): GhostAccountService {
    if (!GhostAccountService.instance) {
      GhostAccountService.instance = new GhostAccountService();
    }
    return GhostAccountService.instance;
  }
  
  /**
   * Create a new ghost account
   * 
   * @param adminId - ID of the admin creating the ghost
   * @param ghostName - Display name for the ghost account
   * @param ghostUsername - Username for the ghost account
   * @param ghostEmail - Email for the ghost account (can be same as admin)
   * @param permissions - Special permissions for this ghost
   * @returns Result of ghost account creation
   */
  public async createGhostAccount(
    adminId: string,
    ghostName: string,
    ghostUsername: string,
    ghostEmail: string,
    permissions: string[] = []
  ): Promise<{
    success: boolean;
    message: string;
    ghostId?: string;
    initialPassword?: string;
  }> {
    try {
      // Verify admin exists
      const admin = await storage.getUser(adminId);
      
      if (!admin || admin.role !== UserRole.ADMIN) {
        return {
          success: false,
          message: "Only administrators can create ghost accounts"
        };
      }
      
      // Check if username is already taken
      const users = await this.getAllUsers();
      const existingUser = users.find(user => 
        user.username.toLowerCase() === ghostUsername.toLowerCase() ||
        user.email.toLowerCase() === ghostEmail.toLowerCase()
      );
      
      if (existingUser) {
        return {
          success: false,
          message: "Username or email already in use"
        };
      }
      
      // Generate a random initial password
      const initialPassword = this.generateSecurePassword();
      
      // Hash the password for storage
      const passwordHash = crypto.createHash('sha256').update(initialPassword).digest('hex');
      
      // Create ghost account
      const ghostId = uuidv4();
      const ghostUser = {
        id: ghostId,
        username: ghostUsername,
        displayName: ghostName,
        email: ghostEmail,
        passwordHash,
        role: ExtendedUserRole.GHOST_ADMIN,
        linkedAdminId: adminId,
        permissions,
        isGhostAccount: true,
        created: new Date(),
        updated: new Date()
      };
      
      // Save ghost account to database
      await storage.createUser(ghostUser);
      
      // Notify admin about ghost account creation
      await this.sendGhostCreationNotification(
        admin.email,
        ghostName,
        ghostUsername,
        initialPassword
      );
      
      console.log(`[GHOST] Ghost account created: ${ghostUsername} (linked to admin ${adminId})`);
      
      return {
        success: true,
        message: "Ghost account created successfully",
        ghostId,
        initialPassword
      };
    } catch (error: any) {
      console.error('[GHOST] Error creating ghost account:', error);
      return {
        success: false,
        message: "Error creating ghost account"
      };
    }
  }
  
  /**
   * Authenticate a ghost account
   * 
   * @param username - Ghost username
   * @param password - Ghost password
   * @returns Authentication result with session token
   */
  public async authenticateGhost(
    username: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    sessionToken?: string;
    ghostUser?: any;
  }> {
    try {
      // Find ghost user
      const users = await this.getAllUsers();
      const ghostUser = users.find(user => 
        user.username.toLowerCase() === username.toLowerCase() &&
        user.isGhostAccount === true
      );
      
      if (!ghostUser) {
        return {
          success: false,
          message: "Invalid credentials"
        };
      }
      
      // Verify password
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      
      if (passwordHash !== ghostUser.passwordHash) {
        return {
          success: false,
          message: "Invalid credentials"
        };
      }
      
      // Create session
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const session: GhostSession = {
        id: sessionToken,
        ghostId: ghostUser.id,
        adminId: ghostUser.linkedAdminId,
        created: new Date(),
        expires: new Date(Date.now() + this.sessionDurationHours * 60 * 60 * 1000),
        lastActivity: new Date()
      };
      
      this.activeSessions.set(sessionToken, session);
      
      // Get linked admin for notification
      const admin = await storage.getUser(ghostUser.linkedAdminId);
      
      // Notify admin about ghost login
      if (admin) {
        await this.sendGhostLoginNotification(
          admin.email,
          ghostUser.displayName,
          ghostUser.username
        );
      }
      
      // Create safe version of ghost user (without sensitive info)
      const safeGhostUser = {
        id: ghostUser.id,
        username: ghostUser.username,
        displayName: ghostUser.displayName,
        email: ghostUser.email,
        role: ghostUser.role,
        permissions: ghostUser.permissions,
        isGhostAccount: true,
        created: ghostUser.created
      };
      
      return {
        success: true,
        message: "Ghost account authenticated successfully",
        sessionToken,
        ghostUser: safeGhostUser
      };
    } catch (error: any) {
      console.error('[GHOST] Error authenticating ghost account:', error);
      return {
        success: false,
        message: "Error authenticating ghost account"
      };
    }
  }
  
  /**
   * Verify ghost session
   * 
   * @param sessionToken - Ghost session token
   * @returns Verification result with ghost user info
   */
  public async verifyGhostSession(
    sessionToken: string
  ): Promise<{
    valid: boolean;
    message?: string;
    ghostUser?: any;
  }> {
    try {
      const session = this.activeSessions.get(sessionToken);
      
      if (!session) {
        return {
          valid: false,
          message: "Invalid or expired session"
        };
      }
      
      if (new Date() > session.expires) {
        this.activeSessions.delete(sessionToken);
        return {
          valid: false,
          message: "Session expired"
        };
      }
      
      // Update last activity
      session.lastActivity = new Date();
      
      // Get ghost user
      const ghostUser = await storage.getUser(session.ghostId);
      
      if (!ghostUser || !ghostUser.isGhostAccount) {
        this.activeSessions.delete(sessionToken);
        return {
          valid: false,
          message: "Associated ghost account not found"
        };
      }
      
      // Create safe version of ghost user
      const safeGhostUser = {
        id: ghostUser.id,
        username: ghostUser.username,
        displayName: ghostUser.displayName,
        email: ghostUser.email,
        role: ghostUser.role,
        permissions: ghostUser.permissions,
        isGhostAccount: true,
        linkedAdminId: ghostUser.linkedAdminId,
        created: ghostUser.created
      };
      
      return {
        valid: true,
        ghostUser: safeGhostUser
      };
    } catch (error: any) {
      console.error('[GHOST] Error verifying ghost session:', error);
      return {
        valid: false,
        message: "Error verifying ghost session"
      };
    }
  }
  
  /**
   * End ghost session
   * 
   * @param sessionToken - Ghost session token
   * @returns Result of session termination
   */
  public async endGhostSession(
    sessionToken: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const session = this.activeSessions.get(sessionToken);
      
      if (!session) {
        return {
          success: false,
          message: "Session not found"
        };
      }
      
      // Delete session
      this.activeSessions.delete(sessionToken);
      
      return {
        success: true,
        message: "Ghost session ended successfully"
      };
    } catch (error: any) {
      console.error('[GHOST] Error ending ghost session:', error);
      return {
        success: false,
        message: "Error ending ghost session"
      };
    }
  }
  
  /**
   * Get all ghost accounts for an admin
   * 
   * @param adminId - Admin ID to get ghosts for
   * @returns Array of ghost accounts
   */
  public async getGhostAccountsForAdmin(
    adminId: string
  ): Promise<any[]> {
    try {
      // Get all users
      const users = await this.getAllUsers();
      
      // Filter for ghost accounts linked to this admin
      const ghostAccounts = users.filter(user => 
        user.isGhostAccount === true && 
        user.linkedAdminId === adminId
      );
      
      // Create safe versions of ghost accounts
      return ghostAccounts.map(ghost => ({
        id: ghost.id,
        username: ghost.username,
        displayName: ghost.displayName,
        email: ghost.email,
        role: ghost.role,
        permissions: ghost.permissions,
        created: ghost.created,
        updated: ghost.updated
      }));
    } catch (error: any) {
      console.error('[GHOST] Error getting ghost accounts for admin:', error);
      return [];
    }
  }
  
  /**
   * Track action performed by ghost account
   * 
   * @param sessionToken - Ghost session token
   * @param action - Action performed
   * @param details - Action details
   * @returns Result of action tracking
   */
  public async trackGhostAction(
    sessionToken: string,
    action: string,
    details: any
  ): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const session = this.activeSessions.get(sessionToken);
      
      if (!session) {
        return {
          success: false,
          message: "Invalid or expired session"
        };
      }
      
      // Get ghost user and admin
      const ghostUser = await storage.getUser(session.ghostId);
      const admin = await storage.getUser(session.adminId);
      
      if (!ghostUser || !admin) {
        return {
          success: false,
          message: "Associated accounts not found"
        };
      }
      
      // Log action
      console.log(`[GHOST] Action by ${ghostUser.username} (ghost of ${admin.username}): ${action}`);
      
      // Notify admin for significant actions
      const significantActions = [
        'create_user',
        'delete_user',
        'withdraw_funds',
        'change_settings',
        'update_payments'
      ];
      
      if (significantActions.includes(action)) {
        await this.sendGhostActionNotification(
          admin.email,
          ghostUser.displayName,
          action,
          details
        );
      }
      
      return {
        success: true
      };
    } catch (error: any) {
      console.error('[GHOST] Error tracking ghost action:', error);
      return {
        success: false,
        message: "Error tracking ghost action"
      };
    }
  }
  
  /**
   * Clean up expired sessions
   */
  private cleanupExpiredSessions(): void {
    const now = new Date();
    
    for (const [token, session] of this.activeSessions.entries()) {
      if (now > session.expires) {
        this.activeSessions.delete(token);
      }
    }
    
    console.log(`[GHOST] Cleaned up expired ghost sessions. ${this.activeSessions.size} active sessions remaining.`);
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
   * Send ghost account creation notification
   * 
   * @param adminEmail - Admin's email
   * @param ghostName - Ghost display name
   * @param ghostUsername - Ghost username
   * @param password - Initial password
   */
  private async sendGhostCreationNotification(
    adminEmail: string,
    ghostName: string,
    ghostUsername: string,
    password: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[GHOST] Email notifications disabled, would have sent ghost creation notification to:', {
        adminEmail,
        ghostName,
        ghostUsername,
        password: '[REDACTED]'
      });
      return;
    }
    
    const subject = '👻 Ghost Account Created - Satoshi Beans Mining';
    const content = `
      <h2>Ghost Account Created</h2>
      <p>A new ghost account has been created for your admin account on the Satoshi Beans Mining platform.</p>
      <p><strong>Ghost Name:</strong> ${ghostName}</p>
      <p><strong>Ghost Username:</strong> ${ghostUsername}</p>
      <p><strong>Initial Password:</strong> ${password}</p>
      <p><strong>Created:</strong> ${new Date().toLocaleString()}</p>
      <p>This ghost account can perform admin actions on your behalf. All actions will be logged and you'll receive notifications for significant operations.</p>
      <p>For security reasons, please change the password after the first login.</p>
    `;
    
    try {
      const msg = {
        to: adminEmail,
        from: 'security@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[GHOST] Ghost creation notification sent to ${adminEmail}`);
    } catch (error) {
      console.error('[GHOST] Error sending ghost creation notification:', error);
      // Don't throw error for notification
    }
  }
  
  /**
   * Send ghost login notification
   * 
   * @param adminEmail - Admin's email
   * @param ghostName - Ghost display name
   * @param ghostUsername - Ghost username
   */
  private async sendGhostLoginNotification(
    adminEmail: string,
    ghostName: string,
    ghostUsername: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[GHOST] Email notifications disabled, would have sent ghost login notification to:', {
        adminEmail,
        ghostName,
        ghostUsername
      });
      return;
    }
    
    const subject = '👻 Ghost Account Login - Satoshi Beans Mining';
    const content = `
      <h2>Ghost Account Login</h2>
      <p>Your ghost account has logged in to the Satoshi Beans Mining platform.</p>
      <p><strong>Ghost Name:</strong> ${ghostName}</p>
      <p><strong>Ghost Username:</strong> ${ghostUsername}</p>
      <p><strong>Login Time:</strong> ${new Date().toLocaleString()}</p>
      <p>If you did not authorize this login, please secure your account immediately.</p>
    `;
    
    try {
      const msg = {
        to: adminEmail,
        from: 'security@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[GHOST] Ghost login notification sent to ${adminEmail}`);
    } catch (error) {
      console.error('[GHOST] Error sending ghost login notification:', error);
      // Don't throw error for notification
    }
  }
  
  /**
   * Send ghost action notification
   * 
   * @param adminEmail - Admin's email
   * @param ghostName - Ghost display name
   * @param action - Action performed
   * @param details - Action details
   */
  private async sendGhostActionNotification(
    adminEmail: string,
    ghostName: string,
    action: string,
    details: any
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[GHOST] Email notifications disabled, would have sent ghost action notification to:', {
        adminEmail,
        ghostName,
        action,
        details
      });
      return;
    }
    
    // Format action for display
    let actionDisplay = action.replace(/_/g, ' ');
    actionDisplay = actionDisplay.charAt(0).toUpperCase() + actionDisplay.slice(1);
    
    // Format details for display
    const detailsHtml = Object.entries(details)
      .map(([key, value]) => `<p><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</p>`)
      .join('');
    
    const subject = `👻 Ghost Account Action: ${actionDisplay} - Satoshi Beans Mining`;
    const content = `
      <h2>Ghost Account Action</h2>
      <p>Your ghost account has performed a significant action on the Satoshi Beans Mining platform.</p>
      <p><strong>Ghost Name:</strong> ${ghostName}</p>
      <p><strong>Action:</strong> ${actionDisplay}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <h3>Details:</h3>
      ${detailsHtml}
      <p>If you did not authorize this action, please secure your account immediately.</p>
    `;
    
    try {
      const msg = {
        to: adminEmail,
        from: 'security@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[GHOST] Ghost action notification sent to ${adminEmail}`);
    } catch (error) {
      console.error('[GHOST] Error sending ghost action notification:', error);
      // Don't throw error for notification
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
      console.error('[GHOST] Error fetching users:', error);
      return [];
    }
  }
}