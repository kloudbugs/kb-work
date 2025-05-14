/**
 * Email Verification Service
 * 
 * Manages email-based verification codes for:
 * 1. Admin authentication
 * 2. User account verification
 * 3. Password reset requests
 */

import crypto from 'crypto';
import * as sendgrid from '@sendgrid/mail';
import { storage } from '../storage';

// Store verification codes with expiration times
interface VerificationEntry {
  code: string;
  email: string;
  purpose: 'admin_login' | 'user_verification' | 'password_reset';
  expires: Date;
  used: boolean;
  userData?: any; // Additional data for context
}

export class EmailVerificationService {
  private static instance: EmailVerificationService;
  
  // Map of verification ID to verification entry
  private verificationCodes: Map<string, VerificationEntry> = new Map();
  
  // Admin email is the trusted authority
  private adminEmail: string = process.env.ADMIN_EMAIL || 'admin@example.com';
  
  // Code expiration time in minutes
  private codeExpirationMinutes: number = 15;
  
  private constructor() {
    // Initialize SendGrid if API key is provided
    if (process.env.SENDGRID_API_KEY) {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('[VERIFY] SendGrid API key found, email verification enabled');
    } else {
      console.log('[VERIFY] No SendGrid API key found, email verification disabled');
    }
    
    // Clean up expired codes every 5 minutes
    setInterval(() => this.cleanupExpiredCodes(), 5 * 60 * 1000);
    
    console.log('[VERIFY] Email verification service initialized');
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): EmailVerificationService {
    if (!EmailVerificationService.instance) {
      EmailVerificationService.instance = new EmailVerificationService();
    }
    return EmailVerificationService.instance;
  }
  
  /**
   * Generate and send a verification code for admin login
   * 
   * @param email - Should match admin email
   * @param ipAddress - IP address of the login attempt
   * @returns Verification ID if successful
   */
  public async sendAdminLoginCode(
    email: string,
    ipAddress: string
  ): Promise<{
    success: boolean;
    message: string;
    verificationId?: string;
  }> {
    try {
      // Verify email matches admin email
      if (email.toLowerCase() !== this.adminEmail.toLowerCase()) {
        console.warn(`[VERIFY] Admin login attempt with incorrect email: ${email}`);
        
        // We still return success to not reveal admin email
        return {
          success: true,
          message: "If this email is registered as an admin, a verification code has been sent."
        };
      }
      
      // Generate verification code and ID
      const verificationCode = this.generateVerificationCode();
      const verificationId = crypto.randomBytes(16).toString('hex');
      
      // Store verification entry
      const verificationEntry: VerificationEntry = {
        code: verificationCode,
        email,
        purpose: 'admin_login',
        expires: new Date(Date.now() + this.codeExpirationMinutes * 60 * 1000),
        used: false,
        userData: { ipAddress }
      };
      
      this.verificationCodes.set(verificationId, verificationEntry);
      
      // Send verification email
      await this.sendVerificationEmail(
        email,
        verificationCode,
        'admin_login',
        ipAddress
      );
      
      return {
        success: true,
        message: "Admin verification code sent to your email",
        verificationId
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
   * Generate and send a verification code for new user verification
   * 
   * @param email - User's email address
   * @param fullName - User's full name
   * @param userData - Additional user data
   * @returns Verification ID if successful
   */
  public async sendUserVerificationCode(
    email: string,
    fullName: string,
    userData: any
  ): Promise<{
    success: boolean;
    message: string;
    verificationId?: string;
  }> {
    try {
      // Generate verification code and ID
      const verificationCode = this.generateVerificationCode();
      const verificationId = crypto.randomBytes(16).toString('hex');
      
      // Store verification entry
      const verificationEntry: VerificationEntry = {
        code: verificationCode,
        email,
        purpose: 'user_verification',
        expires: new Date(Date.now() + this.codeExpirationMinutes * 60 * 1000),
        used: false,
        userData: { ...userData, fullName }
      };
      
      this.verificationCodes.set(verificationId, verificationEntry);
      
      // Send verification email
      await this.sendUserVerificationEmail(
        email,
        fullName,
        verificationCode
      );
      
      // Also send admin a notification
      await this.sendAdminNotification(
        email,
        fullName,
        userData
      );
      
      return {
        success: true,
        message: "Verification code sent to your email",
        verificationId
      };
    } catch (error: any) {
      console.error('[VERIFY] Error sending user verification code:', error);
      return {
        success: false,
        message: "Error sending verification code"
      };
    }
  }
  
  /**
   * Verify a verification code
   * 
   * @param verificationId - Verification ID
   * @param code - Verification code
   * @returns Success/failure and user data if applicable
   */
  public verifyCode(
    verificationId: string,
    code: string
  ): {
    success: boolean;
    message: string;
    purpose?: 'admin_login' | 'user_verification' | 'password_reset';
    userData?: any;
    email?: string;
  } {
    const entry = this.verificationCodes.get(verificationId);
    
    if (!entry) {
      return {
        success: false,
        message: "Invalid verification ID"
      };
    }
    
    if (entry.used) {
      return {
        success: false,
        message: "This verification code has already been used"
      };
    }
    
    if (new Date() > entry.expires) {
      this.verificationCodes.delete(verificationId);
      return {
        success: false,
        message: "Verification code has expired"
      };
    }
    
    if (entry.code !== code) {
      return {
        success: false,
        message: "Invalid verification code"
      };
    }
    
    // Mark as used
    entry.used = true;
    
    return {
      success: true,
      message: "Verification successful",
      purpose: entry.purpose,
      userData: entry.userData,
      email: entry.email
    };
  }
  
  /**
   * Generate a verification code for password reset
   * 
   * @param email - User's email address
   * @returns Verification ID if successful
   */
  public async sendPasswordResetCode(
    email: string
  ): Promise<{
    success: boolean;
    message: string;
    verificationId?: string;
  }> {
    try {
      // Check if user exists
      const user = await this.findUserByEmail(email);
      
      if (!user) {
        // To prevent email enumeration, still return success
        return {
          success: true,
          message: "If this email is registered, a password reset code has been sent."
        };
      }
      
      // Generate verification code and ID
      const verificationCode = this.generateVerificationCode();
      const verificationId = crypto.randomBytes(16).toString('hex');
      
      // Store verification entry
      const verificationEntry: VerificationEntry = {
        code: verificationCode,
        email,
        purpose: 'password_reset',
        expires: new Date(Date.now() + this.codeExpirationMinutes * 60 * 1000),
        used: false,
        userData: { userId: user.id, username: user.username }
      };
      
      this.verificationCodes.set(verificationId, verificationEntry);
      
      // Send password reset email
      await this.sendPasswordResetEmail(
        email,
        user.username,
        verificationCode
      );
      
      return {
        success: true,
        message: "Password reset code sent to your email",
        verificationId
      };
    } catch (error: any) {
      console.error('[VERIFY] Error sending password reset code:', error);
      return {
        success: false,
        message: "Error sending password reset code"
      };
    }
  }
  
  /**
   * Find a user by their email address
   * @param email - Email address to search for
   */
  private async findUserByEmail(email: string): Promise<any | null> {
    try {
      // If storage has a getUserByEmail method
      if (typeof storage.getUserByEmail === 'function') {
        return await storage.getUserByEmail(email);
      }
      
      // Fallback: check if this is the admin email
      if (email.toLowerCase() === this.adminEmail.toLowerCase()) {
        const adminUser = await storage.getUser('admin');
        return adminUser;
      }
      
      return null;
    } catch (error) {
      console.error('[VERIFY] Error finding user by email:', error);
      return null;
    }
  }
  
  /**
   * Clean up expired verification codes
   */
  private cleanupExpiredCodes(): void {
    const now = new Date();
    
    for (const [id, entry] of this.verificationCodes.entries()) {
      if (now > entry.expires) {
        this.verificationCodes.delete(id);
      }
    }
    
    console.log(`[VERIFY] Cleaned up expired verification codes. ${this.verificationCodes.size} active codes remaining.`);
  }
  
  /**
   * Generate a random verification code
   * 
   * @returns Six-digit verification code
   */
  private generateVerificationCode(): string {
    // Generate a 6-digit code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  /**
   * Send verification email to admin
   * 
   * @param email - Admin email
   * @param code - Verification code
   * @param purpose - Purpose of verification
   * @param ipAddress - IP address of the request
   */
  private async sendVerificationEmail(
    email: string,
    code: string,
    purpose: 'admin_login',
    ipAddress: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[VERIFY] Email notifications disabled, would have sent admin verification code:', {
        email,
        code,
        purpose,
        ipAddress
      });
      return;
    }
    
    const subject = '🔐 Admin Verification Code - Satoshi Beans Mining';
    const content = `
      <h2>Admin Verification Code</h2>
      <p>You're receiving this email because an admin login was attempted on the Satoshi Beans Mining platform.</p>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in ${this.codeExpirationMinutes} minutes.</p>
      <p><strong>IP Address:</strong> ${ipAddress}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p>If you did not attempt to log in, please secure your account immediately.</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'security@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[VERIFY] Admin verification email sent to ${email}`);
    } catch (error) {
      console.error('[VERIFY] Error sending admin verification email:', error);
      throw error;
    }
  }
  
  /**
   * Send verification email to user
   * 
   * @param email - User's email
   * @param fullName - User's full name
   * @param code - Verification code
   */
  private async sendUserVerificationEmail(
    email: string,
    fullName: string,
    code: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[VERIFY] Email notifications disabled, would have sent user verification code:', {
        email,
        fullName,
        code
      });
      return;
    }
    
    const subject = '✅ Verify Your Email - Satoshi Beans Mining';
    const content = `
      <h2>Email Verification</h2>
      <p>Hello ${fullName},</p>
      <p>Thank you for your interest in joining the Satoshi Beans Mining platform.</p>
      <p>Please use the following code to verify your email address:</p>
      <p style="font-size: 24px; font-weight: bold; text-align: center; padding: 10px; background-color: #f8f9fa; border-radius: 4px;">${code}</p>
      <p>This code will expire in ${this.codeExpirationMinutes} minutes.</p>
      <p>If you did not request this verification, please ignore this email.</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'verification@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[VERIFY] User verification email sent to ${email}`);
    } catch (error) {
      console.error('[VERIFY] Error sending user verification email:', error);
      throw error;
    }
  }
  
  /**
   * Send notification to admin about new registration
   * 
   * @param email - User's email
   * @param fullName - User's full name
   * @param userData - Additional user data
   */
  private async sendAdminNotification(
    email: string,
    fullName: string,
    userData: any
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[VERIFY] Email notifications disabled, would have sent admin notification:', {
        email,
        fullName,
        userData
      });
      return;
    }
    
    // Format user data for display
    const userDataHtml = Object.entries(userData)
      .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
      .join('');
    
    const subject = '🆕 New Verified Registration - Satoshi Beans Mining';
    const content = `
      <h2>New Verified Registration</h2>
      <p>A new user has verified their email address on the Satoshi Beans Mining platform.</p>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <h3>Additional Information:</h3>
      ${userDataHtml}
      <p>Please log in to the admin dashboard to create an account for this user.</p>
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
      console.log(`[VERIFY] Admin notification sent to ${this.adminEmail}`);
    } catch (error) {
      console.error('[VERIFY] Error sending admin notification:', error);
      // Don't throw error here as this is a secondary notification
    }
  }
  
  /**
   * Send password reset email
   * 
   * @param email - User's email
   * @param username - User's username
   * @param code - Reset code
   */
  private async sendPasswordResetEmail(
    email: string,
    username: string,
    code: string
  ): Promise<void> {
    // Skip if SendGrid is not configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('[VERIFY] Email notifications disabled, would have sent password reset code:', {
        email,
        username,
        code
      });
      return;
    }
    
    const subject = '🔑 Password Reset Code - Satoshi Beans Mining';
    const content = `
      <h2>Password Reset Code</h2>
      <p>Hello ${username},</p>
      <p>You're receiving this email because a password reset was requested for your account on the Satoshi Beans Mining platform.</p>
      <p>Your password reset code is: <strong>${code}</strong></p>
      <p>This code will expire in ${this.codeExpirationMinutes} minutes.</p>
      <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
    `;
    
    try {
      const msg = {
        to: email,
        from: 'security@satoshibeans.com',
        subject,
        html: content,
      };
      
      await sendgrid.send(msg);
      console.log(`[VERIFY] Password reset email sent to ${email}`);
    } catch (error) {
      console.error('[VERIFY] Error sending password reset email:', error);
      throw error;
    }
  }
}