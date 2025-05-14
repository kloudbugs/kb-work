/**
 * Authentication Bridge
 * 
 * This service bridges between the old and new authentication systems:
 * 1. Maintains compatibility with existing admin credentials
 * 2. Gradually migrates to more secure authentication
 * 3. Supports both ghost accounts and direct admin login
 */

import crypto from 'crypto';
import { storage } from '../storage';
import { UserRole } from '../../shared/schema';

// The current admin password hash - for backward compatibility
const LEGACY_ADMIN_PASSWORD_HASH = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'; // "admin123"

export class AuthenticationBridge {
  private static instance: AuthenticationBridge;
  
  private constructor() {
    console.log('[AUTH] Authentication bridge initialized - maintaining compatibility with existing credentials');
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): AuthenticationBridge {
    if (!AuthenticationBridge.instance) {
      AuthenticationBridge.instance = new AuthenticationBridge();
    }
    return AuthenticationBridge.instance;
  }
  
  /**
   * Authenticate a user with username and password
   * Supports both legacy and new authentication
   * 
   * @param username - Username to authenticate
   * @param password - Password to verify
   * @returns Authentication result with user info
   */
  public async authenticateUser(
    username: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    user?: any;
    needsEmailVerification?: boolean;
    verificationId?: string;
  }> {
    try {
      // Check if this is a ghost account login attempt
      const ghostService = (await import('./ghostAccountService')).GhostAccountService.getInstance();
      const ghostResult = await ghostService.authenticateGhost(username, password);
      
      if (ghostResult.success) {
        return {
          success: true,
          message: "Ghost account authenticated successfully",
          user: {
            ...ghostResult.ghostUser,
            sessionToken: ghostResult.sessionToken
          }
        };
      }
      
      // Try to find the user
      const user = await this.findUserByUsername(username);
      
      if (!user) {
        // Special case for "admin" username with legacy password
        if (username.toLowerCase() === 'admin') {
          const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
          
          if (passwordHash === LEGACY_ADMIN_PASSWORD_HASH) {
            // Legacy admin login
            console.log('[AUTH] Legacy admin authentication successful');
            
            // Create admin user if it doesn't exist yet
            const adminUser = {
              id: 'admin',
              username: 'admin',
              email: process.env.ADMIN_EMAIL || 'admin@example.com',
              passwordHash: LEGACY_ADMIN_PASSWORD_HASH,
              role: UserRole.ADMIN,
              created: new Date(),
              updated: new Date()
            };
            
            try {
              await storage.createUser(adminUser);
              console.log('[AUTH] Created admin user from legacy credentials');
            } catch (error) {
              // Admin might already exist, ignore this error
            }
            
            // Check if we should request email verification
            if (Math.random() < 0.25) { // 25% chance to require email verification for extra security
              try {
                const emailVerificationService = (await import('./emailVerificationService')).EmailVerificationService.getInstance();
                const verificationResult = await emailVerificationService.sendAdminLoginCode(
                  adminUser.email,
                  'Legacy Admin Login'
                );
                
                if (verificationResult.success && verificationResult.verificationId) {
                  return {
                    success: true,
                    message: "Additional verification required",
                    needsEmailVerification: true,
                    verificationId: verificationResult.verificationId
                  };
                }
              } catch (error) {
                // If email verification fails, continue with normal login
                console.error('[AUTH] Email verification failed:', error);
              }
            }
            
            return {
              success: true,
              message: "Authentication successful",
              user: {
                id: 'admin',
                username: 'admin',
                role: UserRole.ADMIN
              }
            };
          }
        }
        
        return {
          success: false,
          message: "Invalid credentials"
        };
      }
      
      // Normal user authentication
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      
      if (passwordHash !== user.passwordHash) {
        return {
          success: false,
          message: "Invalid credentials"
        };
      }
      
      // Check if this is an admin login and requires additional verification
      if (user.role === UserRole.ADMIN && Math.random() < 0.25) { // 25% chance for extra security
        try {
          const emailVerificationService = (await import('./emailVerificationService')).EmailVerificationService.getInstance();
          const verificationResult = await emailVerificationService.sendAdminLoginCode(
            user.email,
            'Regular Admin Login'
          );
          
          if (verificationResult.success && verificationResult.verificationId) {
            return {
              success: true,
              message: "Additional verification required",
              needsEmailVerification: true,
              verificationId: verificationResult.verificationId
            };
          }
        } catch (error) {
          // If email verification fails, continue with normal login
          console.error('[AUTH] Email verification failed:', error);
        }
      }
      
      // Create safe user object without sensitive info
      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created: user.created
      };
      
      return {
        success: true,
        message: "Authentication successful",
        user: safeUser
      };
    } catch (error: any) {
      console.error('[AUTH] Authentication error:', error);
      return {
        success: false,
        message: "Authentication error"
      };
    }
  }
  
  /**
   * Update user password - works with both legacy and new passwords
   * 
   * @param userId - User ID to update
   * @param currentPassword - Current password
   * @param newPassword - New password to set
   * @returns Result of password update
   */
  public async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Special case for admin user
      if (userId === 'admin') {
        const currentPasswordHash = crypto.createHash('sha256').update(currentPassword).digest('hex');
        
        if (currentPasswordHash !== LEGACY_ADMIN_PASSWORD_HASH) {
          return {
            success: false,
            message: "Current password is incorrect"
          };
        }
        
        // Hash the new password
        const newPasswordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
        
        // Update user password
        await storage.updateUser('admin', {
          passwordHash: newPasswordHash,
          updated: new Date()
        });
        
        return {
          success: true,
          message: "Password updated successfully"
        };
      }
      
      // Normal user password update
      const user = await storage.getUser(userId);
      
      if (!user) {
        return {
          success: false,
          message: "User not found"
        };
      }
      
      // Verify current password
      const currentPasswordHash = crypto.createHash('sha256').update(currentPassword).digest('hex');
      
      if (currentPasswordHash !== user.passwordHash) {
        return {
          success: false,
          message: "Current password is incorrect"
        };
      }
      
      // Hash the new password
      const newPasswordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
      
      // Update user password
      await storage.updateUser(userId, {
        passwordHash: newPasswordHash,
        updated: new Date()
      });
      
      return {
        success: true,
        message: "Password updated successfully"
      };
    } catch (error: any) {
      console.error('[AUTH] Password update error:', error);
      return {
        success: false,
        message: "Password update error"
      };
    }
  }
  
  /**
   * Complete email verification for admin login
   * 
   * @param verificationId - Verification ID
   * @param code - Verification code
   * @returns Result with user info if successful
   */
  public async completeEmailVerification(
    verificationId: string,
    code: string
  ): Promise<{
    success: boolean;
    message: string;
    user?: any;
  }> {
    try {
      const emailVerificationService = (await import('./emailVerificationService')).EmailVerificationService.getInstance();
      const result = emailVerificationService.verifyCode(verificationId, code);
      
      if (!result.success) {
        return {
          success: false,
          message: result.message
        };
      }
      
      // Find user by email
      const user = await this.findUserByEmail(result.email || '');
      
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
        role: user.role,
        created: user.created
      };
      
      return {
        success: true,
        message: "Verification successful",
        user: safeUser
      };
    } catch (error: any) {
      console.error('[AUTH] Email verification completion error:', error);
      return {
        success: false,
        message: "Verification error"
      };
    }
  }
  
  /**
   * Find a user by username
   * 
   * @param username - Username to search for
   * @returns User if found
   */
  private async findUserByUsername(username: string): Promise<any | null> {
    try {
      // Check if user exists directly
      const user = await storage.getUser(username);
      
      if (user) {
        return user;
      }
      
      // Otherwise search all users
      const users = await this.getAllUsers();
      return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
    } catch (error) {
      console.error('[AUTH] Error finding user by username:', error);
      return null;
    }
  }
  
  /**
   * Find a user by email
   * 
   * @param email - Email to search for
   * @returns User if found
   */
  private async findUserByEmail(email: string): Promise<any | null> {
    try {
      // If storage has a getUserByEmail method
      if (typeof storage.getUserByEmail === 'function') {
        return await storage.getUserByEmail(email);
      }
      
      // Otherwise search all users
      const users = await this.getAllUsers();
      return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      console.error('[AUTH] Error finding user by email:', error);
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
      console.error('[AUTH] Error fetching users:', error);
      return [];
    }
  }
}