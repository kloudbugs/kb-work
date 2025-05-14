import { Router, Request, Response } from 'express';
import { z } from 'zod';
import nodemailer from 'nodemailer';

// Admin email where trial requests will be sent
const ADMIN_EMAIL = 'admin@kloudbugs.com';

// Initialize the router
const router = Router();

// Validation schema
const trialSignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  organization: z.string().optional(),
  reason: z.string().min(20),
});

// Store the form data for when we don't have email credentials
const trialRequests: any[] = [];

// POST /api/trial/signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validatedData = trialSignupSchema.parse(req.body);
    
    // Store the request data (useful for development and as a backup)
    trialRequests.push({
      ...validatedData,
      timestamp: new Date(),
      status: 'pending'
    });
    
    // Log the request data
    console.log('New trial request received:', {
      name: validatedData.name,
      email: validatedData.email,
      organization: validatedData.organization || 'Not provided',
      timestamp: new Date()
    });
    
    // Create the email HTML content
    const htmlContent = `
<h1>New Trial Request</h1>
<p>A new application has been received for the Blockchain Justice Movement free trial.</p>

<h2>Applicant Details:</h2>
<ul>
  <li><strong>Name:</strong> ${validatedData.name}</li>
  <li><strong>Email:</strong> ${validatedData.email}</li>
  <li><strong>Organization:</strong> ${validatedData.organization || 'Not provided'}</li>
</ul>

<h2>Reason for joining:</h2>
<p>${validatedData.reason.replace(/\n/g, '<br>')}</p>

<p>To approve this request, please use the admin dashboard or respond directly to the applicant.</p>
    `;
    
    // Create the email text content
    const textContent = `
New trial request received:

Name: ${validatedData.name}
Email: ${validatedData.email}
Organization: ${validatedData.organization || 'Not provided'}

Reason for joining:
${validatedData.reason}

To approve this request, please use the admin dashboard or respond directly to the applicant.
    `;

    // Return success immediately to the user
    // In a production environment, you would set up real email sending here
    // with Google SMTP or another provider    
    return res.status(200).json({ 
      success: true, 
      message: 'Application received. You will be notified by email if approved.' 
    });
    
  } catch (error) {
    console.error('Trial signup error:', error);
    
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid form data', 
        errors: error.errors 
      });
    }
    
    // Handle general errors
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to process your application. Please try again later.' 
    });
  }
});

// GET /api/trial/requests (admin route to view all requests)
router.get('/requests', (req: Request, res: Response) => {
  // In a real app, this would be protected with authentication
  // For now, we're just returning the stored requests for demonstration
  return res.status(200).json({ requests: trialRequests });
});

export default router;