/**
 * Email Notification Service
 * 
 * Handles sending email notifications to the admin when new users register
 * or when important system events occur.
 */

import sgMail from '@sendgrid/mail';
import { log } from '../vite';

// Default admin email to receive notifications
const ADMIN_EMAIL = 'admin@example.com';

/**
 * Initialize the SendGrid client with an API key
 */
export function initEmailService(apiKey?: string): boolean {
  try {
    // If an API key is provided, use it
    if (apiKey) {
      sgMail.setApiKey(apiKey);
      log('Email notification service initialized with provided API key');
      return true;
    }
    
    // Try to get API key from environment variables
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (sendgridApiKey) {
      sgMail.setApiKey(sendgridApiKey);
      log('Email notification service initialized with environment API key');
      return true;
    }
    
    log('SendGrid API key not found - email notifications will be disabled');
    return false;
  } catch (error) {
    console.error('Failed to initialize email notification service:', error);
    return false;
  }
}

/**
 * Send a new user registration notification to the admin
 */
export async function sendNewUserNotification(
  user: { username: string; email: string; id: string | number },
  adminEmail: string = ADMIN_EMAIL
): Promise<boolean> {
  try {
    // Check if we have a SendGrid API key configured
    if (!process.env.SENDGRID_API_KEY) {
      log(`[EMAIL] Would send new user notification for ${user.username}, but no API key is configured`);
      return false;
    }
    
    const msg = {
      to: adminEmail,
      from: 'notifications@mining-platform.com', // Replace with your verified sender
      subject: `New User Registration: ${user.username}`,
      html: `
        <h2>New User Registration</h2>
        <p>A new user has registered on your Bitcoin Mining Platform.</p>
        <h3>User Details:</h3>
        <ul>
          <li><strong>Username:</strong> ${user.username}</li>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>User ID:</strong> ${user.id}</li>
          <li><strong>Registration Time:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        <p>
          You can review this registration and approve or reject the user from your admin dashboard.
        </p>
        <p>
          <a href="https://your-platform.com/admin/users/${user.id}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Review User</a>
        </p>
      `,
    };
    
    await sgMail.send(msg);
    log(`[EMAIL] New user notification sent for ${user.username}`);
    return true;
  } catch (error) {
    console.error('Failed to send new user notification email:', error);
    return false;
  }
}

/**
 * Send a notification about a suspicious activity
 */
export async function sendSecurityAlert(
  details: { type: string; message: string; userId?: string | number; ipAddress?: string },
  adminEmail: string = ADMIN_EMAIL
): Promise<boolean> {
  try {
    // Check if we have a SendGrid API key configured
    if (!process.env.SENDGRID_API_KEY) {
      log(`[EMAIL] Would send security alert (${details.type}), but no API key is configured`);
      return false;
    }
    
    const msg = {
      to: adminEmail,
      from: 'security@mining-platform.com', // Replace with your verified sender
      subject: `Security Alert: ${details.type}`,
      html: `
        <h2>Security Alert: ${details.type}</h2>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Message:</strong> ${details.message}</p>
        ${details.userId ? `<p><strong>User ID:</strong> ${details.userId}</p>` : ''}
        ${details.ipAddress ? `<p><strong>IP Address:</strong> ${details.ipAddress}</p>` : ''}
        <p>
          Please review this security alert and take appropriate action if necessary.
        </p>
        <p>
          <a href="https://your-platform.com/admin/security" style="background-color: #f44336; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Review Security Alerts</a>
        </p>
      `,
    };
    
    await sgMail.send(msg);
    log(`[EMAIL] Security alert sent: ${details.type}`);
    return true;
  } catch (error) {
    console.error('Failed to send security alert email:', error);
    return false;
  }
}