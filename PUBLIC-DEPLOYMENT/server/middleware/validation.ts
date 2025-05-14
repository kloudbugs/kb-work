/**
 * KLOUD BUGS Mining Command Center - PUBLIC VERSION
 * Validation Middleware
 * 
 * This middleware provides basic input validation for the PUBLIC environment.
 * It includes only the minimal validation needed for end-user operations.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Validate user registration data
 */
export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const registrationSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password confirmation must be at least 8 characters'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    socialMediaLink: z.string().optional(),
    agreedToTerms: z.boolean().refine(val => val === true, {
      message: 'You must agree to the terms and conditions'
    })
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });
  
  try {
    registrationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid registration data',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(400).json({ message: 'Invalid registration data' });
  }
};

/**
 * Validate login data
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional()
  });
  
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid login data',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(400).json({ message: 'Invalid login data' });
  }
};

/**
 * Validate profile update data
 */
export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
  const profileSchema = z.object({
    email: z.string().email('Invalid email address').optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    socialMediaLink: z.string().optional(),
    notificationPreferences: z.object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      push: z.boolean().optional()
    }).optional()
  });
  
  try {
    profileSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid profile data',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(400).json({ message: 'Invalid profile data' });
  }
};

/**
 * Validate password change
 */
export const validatePasswordChange = (req: Request, res: Response, next: NextFunction) => {
  const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password confirmation must be at least 8 characters')
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });
  
  try {
    passwordSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid password data',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(400).json({ message: 'Invalid password data' });
  }
};

/**
 * Validate mining device configuration
 */
export const validateDeviceConfig = (req: Request, res: Response, next: NextFunction) => {
  const deviceConfigSchema = z.object({
    deviceType: z.string(),
    powerMode: z.enum(['low', 'medium', 'high', 'turbo'], {
      errorMap: () => ({ message: 'Invalid power mode' }),
    }),
    isActive: z.boolean().optional(),
    autoAdjust: z.boolean().optional()
  });
  
  try {
    deviceConfigSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid device configuration',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(400).json({ message: 'Invalid device configuration' });
  }
};