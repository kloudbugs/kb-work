import { Router, Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';

// Initialize the router
const router = Router();

// Get reference to the pending registrations array from admin.ts
// In a real app, this would be a database connection
// For this demonstration, we're using module level imports
import adminRouter from './admin';
const pendingRegistrations = (global as any).pendingRegistrations || [];
(global as any).pendingRegistrations = pendingRegistrations;

// User registration schema
const registrationSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters long",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  bitcoinAddress: z.string().min(26).max(35).optional(),
});

// POST /api/auth/signup - Register a new user
router.post('/signup', async (req: Request, res: Response) => {
  // DISABLED - Registration system temporarily disabled
  const REGISTRATION_ENABLED = false; // Set to true to enable registration
  
  if (!REGISTRATION_ENABLED) {
    console.log('Registration attempt blocked - system currently disabled');
    return res.status(503).json({
      success: false,
      message: 'Registration is currently disabled. Please check back later or contact administrator for access.'
    });
  }
  
  try {
    // Validate the request body
    const validatedData = registrationSchema.parse(req.body);
    
    // Check if username or email already exists
    const existingRegistration = pendingRegistrations.find(
      (reg: any) => reg.email === validatedData.email || reg.username === validatedData.username
    );
    
    if (existingRegistration) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username or email already registered' 
      });
    }
    
    // Create a new registration
    const userId = crypto.randomUUID();
    const registration = {
      id: userId,
      username: validatedData.username,
      email: validatedData.email,
      // In a real app, you would hash the password
      password: validatedData.password,
      bitcoinAddress: validatedData.bitcoinAddress,
      registeredAt: new Date().toISOString(),
      status: 'pending'
    };
    
    // Store the registration
    pendingRegistrations.push(registration);
    
    console.log(`New user registration: ${registration.username} (${registration.email})`);
    
    // Return success
    return res.status(201).json({ 
      success: true, 
      message: 'Registration submitted successfully. An administrator will review your application.' 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid registration data', 
        errors: error.errors 
      });
    }
    
    // Handle general errors
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to process your registration. Please try again later.' 
    });
  }
});

// Existing login implementation
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  // Simple authentication for development
  if (username === 'admin' && password === 'admin123') {
    // Set session data
    if (req.session) {
      req.session.userId = '1';
      req.session.username = username;
      req.session.isAdmin = true;
    }
    
    // Return user data
    return res.json({
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: 'ADMIN',
      isAdmin: true
    });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Other existing routes...

export default router;