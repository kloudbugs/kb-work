/**
 * User Approval and Credentials Management System
 * 
 * This module handles:
 * 1. Processing new user registrations
 * 2. Admin approval workflow
 * 3. Generating and sending temporary credentials
 * 4. Enforcing 2FA setup during first login
 */

import crypto from 'crypto';
import { storage } from '../storage';
import { log } from '../vite';
import * as emailService from './emailNotification';
import * as twoFactorAuth from './twoFactorAuth';

// Track users waiting for approval
const pendingApprovals: Record<string, {
  userId: string | number;
  username: string;
  email: string;
  registrationDate: Date;
  ipAddress?: string;
}> = {};

// Track temporary credentials
const temporaryCredentials: Record<string, {
  userId: string | number;
  username: string;
  temporaryPassword: string;
  expiresAt: Date;
  used: boolean;
}> = {};

/**
 * Process a new user registration - notify admin and add to pending approvals
 */
export async function processNewRegistration(
  userId: string | number,
  username: string,
  email: string,
  ipAddress?: string
): Promise<boolean> {
  try {
    // Add to pending approvals
    pendingApprovals[userId.toString()] = {
      userId,
      username,
      email,
      registrationDate: new Date(),
      ipAddress
    };
    
    log(`[USER APPROVAL] New registration pending approval: ${username} (${userId})`);
    
    // Send notification email to admin
    await emailService.sendNewUserNotification({
      id: userId,
      username,
      email
    });
    
    return true;
  } catch (error) {
    console.error('Error processing new registration:', error);
    return false;
  }
}

/**
 * Get list of pending user approvals
 */
export function getPendingApprovals(): any[] {
  return Object.values(pendingApprovals);
}

/**
 * Generate temporary credentials for a user
 */
export function generateTemporaryCredentials(userId: string | number, username: string): {
  temporaryPassword: string;
  expiresAt: Date;
} {
  // Generate random 8-character password
  const temporaryPassword = crypto.randomBytes(4).toString('hex');
  
  // Set expiration to 24 hours from now
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  // Store temporary credentials
  temporaryCredentials[userId.toString()] = {
    userId,
    username,
    temporaryPassword,
    expiresAt,
    used: false
  };
  
  log(`[USER APPROVAL] Temporary credentials generated for ${username} (${userId})`);
  
  return {
    temporaryPassword,
    expiresAt
  };
}

/**
 * Approve a user and send them temporary credentials
 */
export async function approveUser(
  userId: string | number,
  adminUserId: string | number
): Promise<boolean> {
  try {
    // Get pending approval
    const approval = pendingApprovals[userId.toString()];
    if (!approval) {
      console.error(`No pending approval found for user ID ${userId}`);
      return false;
    }
    
    // Get user from database
    const user = await storage.getUser(userId);
    if (!user) {
      console.error(`User not found in database: ${userId}`);
      return false;
    }
    
    // Generate temporary credentials
    const { temporaryPassword, expiresAt } = generateTemporaryCredentials(userId, approval.username);
    
    // Send credentials email to user
    const emailContent = `
      <h2>Your Account Has Been Approved!</h2>
      <p>Your account on the Bitcoin Mining Platform has been approved by our administrators.</p>
      <p>You can now log in with the following temporary credentials:</p>
      <ul>
        <li><strong>Username:</strong> ${approval.username}</li>
        <li><strong>Temporary Password:</strong> ${temporaryPassword}</li>
      </ul>
      <p><strong>Important:</strong> This temporary password will expire in 24 hours.</p>
      <p>When you first log in, you will be required to set up two-factor authentication on your phone for additional security.</p>
      <p>
        <a href="https://your-platform.com/login" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Login Now</a>
      </p>
    `;
    
    // Send email directly to user
    const msg = {
      to: approval.email,
      from: 'noreply@mining-platform.com',
      subject: 'Your Account Has Been Approved - Temporary Credentials',
      html: emailContent
    };
    
    // In a real application, you would use your email service:
    // await emailService.sendEmail(msg);
    
    // For now, just log that we would send this email
    log(`[USER APPROVAL] Would send temporary credentials to ${approval.email}`);
    log(`[USER APPROVAL] Temporary password: ${temporaryPassword}`);
    
    // Remove from pending approvals
    delete pendingApprovals[userId.toString()];
    
    // Update user status in database
    // In a real application, you would update the user's status to 'approved'
    
    // Log the approval
    log(`[USER APPROVAL] User ${approval.username} (${userId}) approved by admin ${adminUserId}`);
    
    return true;
  } catch (error) {
    console.error('Error approving user:', error);
    return false;
  }
}

/**
 * Reject a user registration
 */
export async function rejectUser(
  userId: string | number,
  adminUserId: string | number,
  reason?: string
): Promise<boolean> {
  try {
    // Get pending approval
    const approval = pendingApprovals[userId.toString()];
    if (!approval) {
      console.error(`No pending approval found for user ID ${userId}`);
      return false;
    }
    
    // Send rejection email to user
    const emailContent = `
      <h2>Your Account Registration</h2>
      <p>We've reviewed your registration request for the Bitcoin Mining Platform.</p>
      <p>Unfortunately, we are unable to approve your account at this time.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>If you believe this is an error or have questions, please contact our support team.</p>
    `;
    
    // In a real application, you would send this email to the user
    log(`[USER APPROVAL] Would send rejection email to ${approval.email}`);
    
    // Remove from pending approvals
    delete pendingApprovals[userId.toString()];
    
    // In a real application, you would either delete the user or mark them as 'rejected'
    
    // Log the rejection
    log(`[USER APPROVAL] User ${approval.username} (${userId}) rejected by admin ${adminUserId}${reason ? `: ${reason}` : ''}`);
    
    return true;
  } catch (error) {
    console.error('Error rejecting user:', error);
    return false;
  }
}

/**
 * Verify temporary credentials during first login
 */
export function verifyTemporaryCredentials(
  userId: string | number,
  providedPassword: string
): boolean {
  // Get temporary credentials
  const credentials = temporaryCredentials[userId.toString()];
  if (!credentials) {
    log(`[USER APPROVAL] No temporary credentials found for user ${userId}`);
    return false;
  }
  
  // Check if credentials have expired
  if (new Date() > credentials.expiresAt) {
    log(`[USER APPROVAL] Temporary credentials for user ${userId} have expired`);
    return false;
  }
  
  // Check if credentials have already been used
  if (credentials.used) {
    log(`[USER APPROVAL] Temporary credentials for user ${userId} have already been used`);
    return false;
  }
  
  // Verify the password
  if (credentials.temporaryPassword !== providedPassword) {
    log(`[USER APPROVAL] Invalid temporary password for user ${userId}`);
    return false;
  }
  
  // Mark credentials as used
  credentials.used = true;
  
  log(`[USER APPROVAL] Temporary credentials verified for user ${userId}`);
  return true;
}

/**
 * Complete the first login process, requiring 2FA setup
 */
export async function completeFirstLogin(
  userId: string | number,
  username: string
): Promise<{ qrCode: string }> {
  try {
    // Generate 2FA secret and QR code for the user
    const secret = twoFactorAuth.generateSecret(userId);
    const qrCode = await twoFactorAuth.generateQRCode(userId, username);
    
    // In a real application, you would update the user's status to indicate
    // they've completed the first login process
    
    log(`[USER APPROVAL] First login completed for user ${username} (${userId}), 2FA setup initiated`);
    
    return { qrCode };
  } catch (error) {
    console.error('Error completing first login process:', error);
    throw error;
  }
}