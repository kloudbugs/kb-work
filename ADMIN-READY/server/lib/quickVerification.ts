/**
 * Quick Verification Service
 * 
 * This service provides email verification codes for:
 * 1. Fast admin login (without password)
 * 2. Fast ghost account switching
 * 3. Approving sensitive operations
 */

import crypto from 'crypto';
import * as sendgrid from '@sendgrid/mail';
import { storage } from '../storage';
import { UserRole } from '../../shared/schema';

interface VerificationSession {
  code: string;
  type: 'admin_login' | 'ghost_login' | 'operation_approval';
  userId: string;
  ghostId?: string;
  ipAddress: string;
  created: Date;
  expires: Date;
  used: boolean;
  operationType?: string;
}

export class QuickVerificationService {
  private static instance: QuickVerificationService;
  
  // Store verification sessions
  private verificationSessions: Map<string, VerificationSession> = new Map();
  
  // Admin email for notifications
  private adminEmail: string = process.env.ADMIN_EMAIL || 'admin@example.com';
  
  // Code length
  private codeLength: number = 6;
  
  // Code expiration (15 minutes)
  private codeExpirationMinutes: number = 15;
  
  private constructor() {
    // Initialize SendGrid if API key is provided
    if (process.env.SENDGRID_API_KEY) {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('[VERIFY] SendGrid API key found, email verification enabled');
    } else {
      console.log('[VERIFY] No SendGrid API key found, email verification disabled');
    }
    
    // Clean up expired sessions every 5 minutes
    setInterval(() => this.cleanupExpiredSessions(), 5 * 60 * 1000);
    
    console.log('[VERIFY] Quick verification service initialized');
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): QuickVerificationService {
    if (!QuickVerificationService.instance) {
      QuickVerificationService.instance = new QuickVerificationService();
    }
    return QuickVerificationService.instance;
  }
  
  /**
   * Generate and send a verification code for admin login
   * 
   * @param email - Admin email to send code to
   * @param ipAddress - IP address requesting login
   * @returns Success/failure with session ID
   */
  public async sendAdminLoginCode(
    email: string,
    ipAddress: string
  ): Promise<{
    success: boolean;
    message: string;
    sessionId?: string;
  }> {
    try {
      // Find admin by email
      const admin = await this.findAdminByEmail(email);
      
      if (!admin) {
        // Don't reveal that the email isn't an admin
        return {
          success: true,
          message: "If this email belongs to an admin, a verification code has been sent"
        };
      }
      
      // Generate verification code
      const code = this.generateVerificationCode();
      const sessionId = crypto.randomBytes(16).toString('hex');
      
      // Store verification session
      const session: VerificationSession = {
        code,
        type: 'admin_login',
        userId: admin.id,
        ipAddress,
        created: new Date(),
        expires: new Date(Date.now() + this.codeExpirationMinutes * 60 * 1000),
        used: false
      };
      
      this.verificationSessions.set(sessionId, session);
      
      // Send verification email
      await this.sendVerificationEmail(
        email,
        code,
        'Admin Login',
        admin.username || 'Administrator',
        ipAddress
      );
      
      return {
        success: true,
        message: "Verification code sent to your email",
        sessionId
      };
    } catch (error: any) {
      console.error('[VERIFY] Error sending admin login code:', error);
      return {
        success: false,
        message: "Error sending verification code"
      };
    }
  }
  
  /**
   * Generate and send a verification code for ghost admin login
   * 
   * @param email - Admin email to send code to
   * @param ghostUsername - Ghost username to log in as
   * @param ipAddress - IP address requesting login
   * @returns Success/failure with session ID
   */
  public async sendGhostLoginCode(
    email: string,
    ghostUsername: string,
    ipAddress: string
  ): Promise<{
    success: boolean;
    message: string;
    sessionId?: string;
  }> {
    try {
      // Find admin by email
      const admin = await this.findAdminByEmail(email);
      
      if (!admin) {
        // Don't reveal that the email isn't an admin
        return {
          success: true,
          message: "If this email belongs to an admin, a verification code has been sent"
        };
      }
      
      // Find ghost account
      const ghostAccount = await this.findGhostByUsername(ghostUsername);
      
      if (!ghostAccount || ghostAccount.linkedAdminId !== admin.id) {
        // Don't reveal that the ghost account doesn't exist or doesn't belong to this admin
        return {
          success: true,
          message: "If this ghost account exists and belongs to you, a verification code has been sent"
        };
      }
      
      // Generate verification code
      const code = this.generateVerificationCode();
      const sessionId = crypto.randomBytes(16).toString('hex');
      
      // Store verification session
      const session: VerificationSession = {
        code,
        type: 'ghost_login',
        userId: admin.id,
        ghostId: ghostAccount.id,
        ipAddress,
        created: new Date(),
        expires: new Date(Date.now() + this.codeExpirationMinutes * 60 * 1000),
        used: false
      };
      
      this.verificationSessions.set(sessionId, session);
      
      // Send verification email
      await this.sendGhostVerificationEmail(
        email,
        code,
        ghostUsername,
        admin.username || 'Administrator',
        ipAddress
      );
      
      return {
        success: true,
        message: "Verification code sent to your email",
        sessionId
      };
    } catch (error: any) {
      console.error('[VERIFY] Error sending ghost login code:', error);
      return {
        success: false,
        message: "Error sending verification code"
      };
    }
  }
  
  /**
   * Generate and send a verification code to approve sensitive operation
   * 
   * @param email - Admin email to send code to
   * @param operationType - Type of operation to approve
   * @param operationDetails - Details of the operation
   * @param ipAddress - IP address requesting approval
   * @returns Success/failure with session ID
   */
  public async sendOperationApprovalCode(
    email: string,
    operationType: string,
    operationDetails: any,
    ipAddress: string
  ): Promise<{
    success: boolean;
    message: string;
    sessionId?: string;
  }> {
    try {
      // Find admin by email
      const admin = await this.findAdminByEmail(email);
      
      if (!admin) {
        // Don't reveal that the email isn't an admin
        return {
          success: true,
          message: "If this email belongs to an admin, a verification code has been sent"
        };
      }
      
      // Generate verification code
      const code = this.generateVerificationCode();
      const sessionId = crypto.randomBytes(16).toString('hex');
      
      // Store verification session
      const session: VerificationSession = {
        code,
        type: 'operation_approval',
        userId: admin.id,
        ipAddress,
        created: new Date(),
        expires: new Date(Date.now() + this.codeExpirationMinutes * 60 * 1000),
        used: false,
        operationType
      };
      
      this.verificationSessions.set(sessionId, session);
      
      // Send verification email
      await this.sendOperationVerificationEmail(
        email,
        code,
        operationType,
        operationDetails,
        admin.username || 'Administrator',
        ipAddress
      );
      
      return {
        success: true,
        message: "Verification code sent to your email",
        sessionId
      };
    } catch (error: any) {
      console.error('[VERIFY] Error sending operation approval code:', error);
      return {
        success: false,
        message: "Error sending verification code"
      };
    }
  }
  
  /**
   * Verify a verification code
   * 
   * @param sessionId - Verification session ID
   * @param code - Verification code
   * @returns Verification result with user and ghost info
   */
  public async verifyCode(
    sessionId: string,
    code: string
  ): Promise<{
    success: boolean;
    message: string;
    user?: any;
    ghostUser?: any;
    operationType?: string;
  }> {
    try {
      const session = this.verificationSessions.get(sessionId);
      
      if (!session) {
        return {
          success: false,
          message: "Invalid or expired verification session"
        };
      }
      
      if (session.used) {
        return {
          success: false,
          message: "This verification code has already been used"
        };
      }
      
      if (new Date() > session.expires) {
        this.verificationSessions.delete(sessionId);
        return {
          success: false,
          message: "Verification code has expired"
        };
      }
      
      if (session.code !== code) {
        return {
          success: false,
          message: "Invalid verification code"
        };
      }
      
      // Mark as used
      session.used = true;
      
      // Get user info
      const user = await storage.getUser(session.userId);
      
      if (!user) {
        return {
          success: false,
          message: "User not found"
        };
      }
      
      // Create safe user object
      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };
      
      // If this is a ghost login, get ghost user info
      let ghostUser = null;
      
      if (session.type === 'ghost_login' && session.ghostId) {
        const ghost = await storage.getUser(session.ghostId);
        
        if (ghost) {
          // Create safe ghost user object
          ghostUser = {
            id: ghost.id,
            username: ghost.username,
            displayName: ghost.displayName,
            email: ghost.email,
            role: ghost.role,
            isGhostAccount: true
          };
          
          // Create ghost session
          const ghostSessionService = (await import('./ghostAccountService')).GhostAccountService.getInstance();
          await ghostSessionService.createSessionForVerifiedGhost(ghost.id, user.id);
        }
      }
      
      return {
        success: true,
        message: "Verification successful",
        user: safeUser,
        ghostUser,
        operationType: session.operationType
      };
    } catch (error: any) {
      console.error('[VERIFY] Error verifying code:', error);
      return {
        success: false,
        message: "Error verifying code"
      };
    }
  }
  
  /**
   * Clean up expired sessions
   */
  private cleanupExpiredSessions(): void {
    const now = new Date();
    
    for (const [sessionId, session] of this.verificationSessions.entries()) {
      if (now > session.expires) {
        this.verificationSessions.delete(sessionId);
      }
    }
    
    console.log(`[VERIFY] Cleaned up expired verification sessions. ${this.verificationSessions.size} active sessions remaining.`);
  }
  
  /**
   * Generate a verification code
   * 
   * @returns Random verification code
   */
  private generateVerificationCode(): string {
    // Generate a 6-digit numeric code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  /**
   * Find admin by email
   * 
   * @param email - Email to search for
   * @returns Admin user if found
   */
  private async findAdminByEmail(email: string): Promise<any | null> {
    try {
      // If storage has a getUserByEmail method
      if (typeof storage.getUserByEmail === 'function') {
        const user = await storage.getUserByEmail(email);
        
        if (user && user.role === UserRole.ADMIN) {
          return user;
        }
        
        return null;
      }
      
      // Otherwise search all users
      const users = await storage.getUsers();
      
      return users.find(user => 
        user.role === UserRole.ADMIN && 
        user.email.toLowerCase() === email.toLowerCase()
      ) || null;
    } catch (error) {
      console.error('[VERIFY] Error finding admin by email:', error);
      return null;
    }
  }
  
  /**
   * Find ghost by username
   * 
   * @param username - Username to search for
   * @returns Ghost user if found
   */
  private async findGhostByUsername(username: string): Promise<any | null> {
    try {
      // If storage has a getUserByUsername method
      if (typeof storage.getUserByUsername === 'function') {
        const user = await storage.getUserByUsername(username);
        
        if (user && user.isGhostAccount) {
          return user;
        }
        
        return null;
      }
      
      // Otherwise search all users
      const users = await storage.getUsers();
      
      return users.find(user => 
        user.isGhostAccount && 
        user.username.toLowerCase() === username.toLowerCase()
      ) || null;
    } catch (error) {
      console.error('[VERIFY] Error finding ghost by username:', error);
      return null;
    }
  }
  
  /**
   * Send verification email for admin login
   * 
   * @param email - Email to send to
   * @param code - Verification code
   * @param purpose - Purpose of verification
   * @param username - Username of recipient
   * @param ipAddress - IP address requesting verification
   */
  private async sendVerificationEmail(
    email: string,
    code: string,
    purpose: string,
    username: string,
    ipAddress: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[VERIFY] Email notifications disabled, would have sent verification code:', {
        email,
        code,
        purpose,
        username,
        ipAddress
      });
      return;
    }
    
    const subject = `🔐 Verification Code: ${code} - Satoshi Beans Mining`;
    const content = `
      <h2>Verification Code: ${code}</h2>
      <p>Hello ${username},</p>
      <p>You're receiving this email because a verification code was requested for ${purpose} on the Satoshi Beans Mining platform.</p>
      <p>Your verification code is:</p>
      <div style="background-color: #f8f9fa; padding: 15px; font-size: 24px; text-align: center; font-weight: bold; letter-spacing: 5px; border-radius: 4px; margin: 20px 0;">
        ${code}
      </div>
      <p>This code will expire in ${this.codeExpirationMinutes} minutes.</p>
      <p><strong>IP Address:</strong> ${ipAddress}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p>If you did not request this code, please ignore this email or secure your account if you're concerned.</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'security@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[VERIFY] Verification email sent to ${email}`);
    } catch (error) {
      console.error('[VERIFY] Error sending verification email:', error);
      throw error;
    }
  }
  
  /**
   * Send verification email for ghost login
   * 
   * @param email - Email to send to
   * @param code - Verification code
   * @param ghostUsername - Ghost username
   * @param username - Admin username
   * @param ipAddress - IP address requesting verification
   */
  private async sendGhostVerificationEmail(
    email: string,
    code: string,
    ghostUsername: string,
    username: string,
    ipAddress: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[VERIFY] Email notifications disabled, would have sent ghost verification code:', {
        email,
        code,
        ghostUsername,
        username,
        ipAddress
      });
      return;
    }
    
    const subject = `👻 Ghost Login Code: ${code} - Satoshi Beans Mining`;
    const content = `
      <h2>Ghost Login Code: ${code}</h2>
      <p>Hello ${username},</p>
      <p>You're receiving this email because a login was requested for your ghost account "${ghostUsername}" on the Satoshi Beans Mining platform.</p>
      <p>Your verification code is:</p>
      <div style="background-color: #f8f9fa; padding: 15px; font-size: 24px; text-align: center; font-weight: bold; letter-spacing: 5px; border-radius: 4px; margin: 20px 0;">
        ${code}
      </div>
      <p>This code will expire in ${this.codeExpirationMinutes} minutes.</p>
      <p><strong>Ghost Username:</strong> ${ghostUsername}</p>
      <p><strong>IP Address:</strong> ${ipAddress}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p>If you did not request this code, please ignore this email or secure your account if you're concerned.</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'security@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[VERIFY] Ghost verification email sent to ${email}`);
    } catch (error) {
      console.error('[VERIFY] Error sending ghost verification email:', error);
      throw error;
    }
  }
  
  /**
   * Send verification email for operation approval
   * 
   * @param email - Email to send to
   * @param code - Verification code
   * @param operationType - Type of operation
   * @param operationDetails - Details of operation
   * @param username - Admin username
   * @param ipAddress - IP address requesting verification
   */
  private async sendOperationVerificationEmail(
    email: string,
    code: string,
    operationType: string,
    operationDetails: any,
    username: string,
    ipAddress: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[VERIFY] Email notifications disabled, would have sent operation verification code:', {
        email,
        code,
        operationType,
        operationDetails,
        username,
        ipAddress
      });
      return;
    }
    
    // Format operation type for display
    let operationTypeDisplay = operationType.replace(/_/g, ' ');
    operationTypeDisplay = operationTypeDisplay.charAt(0).toUpperCase() + operationTypeDisplay.slice(1);
    
    // Format details for display
    const detailsHtml = Object.entries(operationDetails)
      .map(([key, value]) => `<p><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</p>`)
      .join('');
    
    const subject = `🔒 Operation Approval: ${operationTypeDisplay} - Satoshi Beans Mining`;
    const content = `
      <h2>Operation Approval Code: ${code}</h2>
      <p>Hello ${username},</p>
      <p>You're receiving this email because approval was requested for a sensitive operation on the Satoshi Beans Mining platform.</p>
      <p>Your verification code is:</p>
      <div style="background-color: #f8f9fa; padding: 15px; font-size: 24px; text-align: center; font-weight: bold; letter-spacing: 5px; border-radius: 4px; margin: 20px 0;">
        ${code}
      </div>
      <p>This code will expire in ${this.codeExpirationMinutes} minutes.</p>
      <p><strong>Operation:</strong> ${operationTypeDisplay}</p>
      <h3>Details:</h3>
      ${detailsHtml}
      <p><strong>IP Address:</strong> ${ipAddress}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p>If you did not request this approval, please ignore this email or secure your account if you're concerned.</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'security@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[VERIFY] Operation verification email sent to ${email}`);
    } catch (error) {
      console.error('[VERIFY] Error sending operation verification email:', error);
      throw error;
    }
  }
}