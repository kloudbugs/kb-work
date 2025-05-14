import { Router } from 'express';
import * as sendgrid from '@sendgrid/mail';

const router = Router();

// Admin email (should be stored in environment variable)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

// Initialize SendGrid if API key exists
if (process.env.SENDGRID_API_KEY) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('[EMAIL] SendGrid API key found, email notifications enabled');
} else {
  console.log('[EMAIL] No SendGrid API key found, email notifications disabled');
}

/**
 * Handle pre-launch registration requests
 * Simply forwards the information to admin email
 */
router.post('/pre-launch-register', async (req, res) => {
  try {
    const { email, fullName, reason, phoneNumber } = req.body;
    
    // Basic validation
    if (!email || !fullName || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, name and reason for joining'
      });
    }
    
    // Get IP address (for admin records)
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Forward registration info to admin email
    await sendRegistrationEmail(email, fullName, reason, phoneNumber, ipAddress);
    
    // Send confirmation to user
    await sendConfirmationEmail(email, fullName);
    
    return res.status(200).json({
      success: true,
      message: 'Registration request received'
    });
  } catch (error) {
    console.error('[REGISTRATION] Error handling registration:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred processing your request'
    });
  }
});

/**
 * Send registration information to admin
 */
async function sendRegistrationEmail(
  email: string,
  fullName: string,
  reason: string,
  phoneNumber?: string,
  ipAddress?: string | string[]
): Promise<void> {
  // Skip if SendGrid is not configured
  if (!process.env.SENDGRID_API_KEY) {
    console.log('[REGISTRATION] Would have sent registration info to admin:', {
      email,
      fullName,
      reason,
      phoneNumber,
      ipAddress
    });
    return;
  }
  
  const subject = '🆕 New Registration Request - Satoshi Beans Mining';
  const content = `
    <h2>New Registration Request</h2>
    <p>Someone has requested to join the Satoshi Beans Mining platform.</p>
    <p><strong>Full Name:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone Number:</strong> ${phoneNumber || 'Not provided'}</p>
    <p><strong>Reason for Joining:</strong> ${reason}</p>
    <p><strong>IP Address:</strong> ${ipAddress || 'Unknown'}</p>
    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    <hr>
    <p>To approve this user, create their account manually from the admin dashboard.</p>
  `;
  
  try {
    const msg = {
      to: ADMIN_EMAIL,
      from: 'notifications@satoshibeans.com',
      subject,
      html: content,
    };
    
    await sendgrid.send(msg);
    console.log(`[REGISTRATION] Registration info sent to ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error('[REGISTRATION] Error sending registration email:', error);
    throw error;
  }
}

/**
 * Send confirmation email to user
 */
async function sendConfirmationEmail(
  email: string,
  fullName: string
): Promise<void> {
  // Skip if SendGrid is not configured
  if (!process.env.SENDGRID_API_KEY) {
    console.log('[REGISTRATION] Would have sent confirmation to user:', {
      email,
      fullName
    });
    return;
  }
  
  const subject = '✅ Registration Request Received - Satoshi Beans Mining';
  const content = `
    <h2>Registration Request Received</h2>
    <p>Hello ${fullName},</p>
    <p>Thank you for your interest in joining the Satoshi Beans Mining platform.</p>
    <p>We have received your registration request. Our team will review it and contact you when your account is ready.</p>
    <p>Thank you for your patience.</p>
  `;
  
  try {
    const msg = {
      to: email,
      from: 'notifications@satoshibeans.com',
      subject,
      html: content,
    };
    
    await sendgrid.send(msg);
    console.log(`[REGISTRATION] Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('[REGISTRATION] Error sending confirmation email:', error);
    // Don't throw error here, as the main task (notifying admin) is done
  }
}

export default router;