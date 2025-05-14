/**
 * Two-Factor Authentication Service
 * 
 * This service provides QR-code based two-factor authentication
 * for all users accessing the platform.
 */

import crypto from 'crypto';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { storage } from '../storage';

export class TwoFactorAuthService {
  private static instance: TwoFactorAuthService;
  
  // Time-based verification code validity window (seconds)
  private static readonly VERIFICATION_WINDOW = 30;
  
  // Application name for TOTP
  private appName: string = 'SatoshiBeansMining';
  
  private constructor() {
    // Configure authenticator
    authenticator.options = {
      window: [1, 0], // Allow 1 period before, 0 periods after
      step: TwoFactorAuthService.VERIFICATION_WINDOW
    };
    
    console.log('[2FA] Two-factor authentication service initialized');
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): TwoFactorAuthService {
    if (!TwoFactorAuthService.instance) {
      TwoFactorAuthService.instance = new TwoFactorAuthService();
    }
    return TwoFactorAuthService.instance;
  }
  
  /**
   * Generate a new 2FA secret for a user
   * 
   * @param userId - User ID to generate secret for
   * @param username - Username to include in TOTP URI
   * @returns Object containing the secret and QR code data URL
   */
  public async generateSecret(
    userId: string,
    username: string
  ): Promise<{
    secret: string;
    qrCodeDataUrl: string;
  }> {
    try {
      // Generate a random secret
      const secret = authenticator.generateSecret();
      
      // Store the secret in the user's record
      await storage.updateUser(userId, {
        totpSecret: secret,
        totpEnabled: true
      });
      
      // Generate a TOTP URI
      const otpUri = authenticator.keyuri(username, this.appName, secret);
      
      // Generate a QR code containing the TOTP URI
      const qrCodeDataUrl = await QRCode.toDataURL(otpUri);
      
      console.log(`[2FA] Generated new TOTP secret for user ${userId}`);
      
      return {
        secret,
        qrCodeDataUrl
      };
    } catch (error: any) {
      console.error('[2FA] Error generating TOTP secret:', error);
      throw new Error('Failed to generate 2FA secret');
    }
  }
  
  /**
   * Verify a TOTP code provided by the user
   * 
   * @param userId - User ID to verify code for
   * @param code - The TOTP code provided by the user
   * @returns Boolean indicating if the code is valid
   */
  public async verifyCode(userId: string, code: string): Promise<boolean> {
    try {
      const user = await storage.getUser(userId);
      
      if (!user) {
        console.error(`[2FA] User not found: ${userId}`);
        return false;
      }
      
      if (!user.totpSecret || !user.totpEnabled) {
        console.error(`[2FA] TOTP not enabled for user: ${userId}`);
        return false;
      }
      
      // Verify the TOTP code
      const isValid = authenticator.verify({
        token: code,
        secret: user.totpSecret
      });
      
      if (isValid) {
        console.log(`[2FA] Valid TOTP code provided for user ${userId}`);
      } else {
        console.warn(`[2FA] Invalid TOTP code provided for user ${userId}`);
      }
      
      return isValid;
    } catch (error: any) {
      console.error('[2FA] Error verifying TOTP code:', error);
      return false;
    }
  }
  
  /**
   * Disable 2FA for a user
   * 
   * @param userId - User ID to disable 2FA for
   * @returns Boolean indicating if 2FA was successfully disabled
   */
  public async disableTwoFactor(userId: string): Promise<boolean> {
    try {
      await storage.updateUser(userId, {
        totpEnabled: false
      });
      
      console.log(`[2FA] Disabled 2FA for user ${userId}`);
      return true;
    } catch (error: any) {
      console.error('[2FA] Error disabling 2FA:', error);
      return false;
    }
  }
  
  /**
   * Check if 2FA is enabled for a user
   * 
   * @param userId - User ID to check
   * @returns Boolean indicating if 2FA is enabled
   */
  public async isTwoFactorEnabled(userId: string): Promise<boolean> {
    try {
      const user = await storage.getUser(userId);
      
      if (!user) {
        return false;
      }
      
      return Boolean(user.totpEnabled && user.totpSecret);
    } catch (error: any) {
      console.error('[2FA] Error checking 2FA status:', error);
      return false;
    }
  }
  
  /**
   * Generate backup codes for a user
   * 
   * @param userId - User ID to generate backup codes for
   * @param count - Number of backup codes to generate (default: 8)
   * @returns Array of backup codes
   */
  public async generateBackupCodes(
    userId: string,
    count: number = 8
  ): Promise<string[]> {
    try {
      // Generate random backup codes
      const backupCodes: string[] = [];
      
      for (let i = 0; i < count; i++) {
        // Generate a 6-character alphanumeric code
        const code = crypto.randomBytes(3).toString('hex').toUpperCase();
        backupCodes.push(code);
      }
      
      // Hash the backup codes
      const hashedCodes = backupCodes.map(code => 
        crypto.createHash('sha256').update(code).digest('hex')
      );
      
      // Store the hashed backup codes
      await storage.updateUser(userId, {
        backupCodes: hashedCodes
      });
      
      console.log(`[2FA] Generated ${count} backup codes for user ${userId}`);
      
      // Return the plain text codes (to be shown to the user once)
      return backupCodes;
    } catch (error: any) {
      console.error('[2FA] Error generating backup codes:', error);
      throw new Error('Failed to generate backup codes');
    }
  }
  
  /**
   * Verify a backup code
   * 
   * @param userId - User ID to verify code for
   * @param code - The backup code provided by the user
   * @returns Boolean indicating if the code is valid
   */
  public async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    try {
      const user = await storage.getUser(userId);
      
      if (!user || !user.backupCodes || !Array.isArray(user.backupCodes)) {
        return false;
      }
      
      // Hash the provided code
      const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
      
      // Check if the hashed code exists in the user's backup codes
      const codeIndex = user.backupCodes.indexOf(hashedCode);
      
      if (codeIndex === -1) {
        console.warn(`[2FA] Invalid backup code provided for user ${userId}`);
        return false;
      }
      
      // Remove the used backup code
      const updatedBackupCodes = [...user.backupCodes];
      updatedBackupCodes.splice(codeIndex, 1);
      
      // Update the user's backup codes
      await storage.updateUser(userId, {
        backupCodes: updatedBackupCodes
      });
      
      console.log(`[2FA] Valid backup code used for user ${userId}`);
      return true;
    } catch (error: any) {
      console.error('[2FA] Error verifying backup code:', error);
      return false;
    }
  }
  
  /**
   * Force 2FA setup for a user
   * (Useful when requiring all users to use 2FA)
   * 
   * @param userId - User ID to force 2FA setup for
   * @returns Boolean indicating if 2FA setup was successfully forced
   */
  public async forceTwoFactorSetup(userId: string): Promise<boolean> {
    try {
      await storage.updateUser(userId, {
        requireTwoFactor: true
      });
      
      console.log(`[2FA] Forced 2FA setup for user ${userId}`);
      return true;
    } catch (error: any) {
      console.error('[2FA] Error forcing 2FA setup:', error);
      return false;
    }
  }
}