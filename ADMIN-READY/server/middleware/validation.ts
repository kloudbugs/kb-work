/**
 * KLOUD BUGS Mining Command Center - ADMIN VERSION
 * Validation Middleware
 * 
 * This middleware provides input validation for operations in the ADMIN environment.
 * Note that wallet transaction validation is NOT included in this environment.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Validate mining pool configuration
 */
export const validatePoolConfig = (req: Request, res: Response, next: NextFunction) => {
  const poolConfigSchema = z.object({
    poolId: z.string().or(z.number()),
    username: z.string().min(1, 'Username is required'),
    password: z.string().optional(),
    algorithm: z.string(),
    url: z.string().url('Valid pool URL is required'),
    port: z.number().int().positive('Valid port number is required'),
    isActive: z.boolean().optional(),
  });
  
  try {
    poolConfigSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid pool configuration',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(400).json({ message: 'Invalid pool configuration' });
  }
};

/**
 * Validate user permissions changes
 */
export const validatePermissionsChange = (req: Request, res: Response, next: NextFunction) => {
  const permissionsSchema = z.object({
    userId: z.string(),
    role: z.enum(['ADMIN', 'USER', 'GUEST'], {
      errorMap: () => ({ message: 'Invalid user role' }),
    }),
    restrictions: z.array(z.string()).optional(),
    allowSystemConfig: z.boolean().optional(),
    allowUserManagement: z.boolean().optional(),
  });
  
  try {
    permissionsSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid permissions parameters',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(400).json({ message: 'Invalid permissions parameters' });
  }
};

/**
 * Validate security changes (2FA, API keys, etc.)
 */
export const validateSecurityConfig = (req: Request, res: Response, next: NextFunction) => {
  const securitySchema = z.object({
    action: z.enum(['enable2FA', 'disable2FA', 'generateAPIKey', 'revokeAPIKey'], {
      errorMap: () => ({ message: 'Invalid security action' }),
    }),
    totpCode: z.string().length(6, 'TOTP code must be 6 digits').optional(),
    apiKeyId: z.string().optional(),
    apiKeyPermissions: z.array(z.string()).optional(),
  });
  
  try {
    securitySchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid security configuration',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(400).json({ message: 'Invalid security configuration' });
  }
};

/**
 * Validate user creation/update
 */
export const validateUserData = (req: Request, res: Response, next: NextFunction) => {
  const userSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    role: z.enum(['ADMIN', 'USER', 'GUEST'], {
      errorMap: () => ({ message: 'Invalid user role' }),
    }).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    socialMediaLink: z.string().optional(),
    agreedToTerms: z.boolean().optional(),
  });
  
  try {
    userSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid user data',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(400).json({ message: 'Invalid user data' });
  }
};

/**
 * Validate mining settings
 */
export const validateMiningSettings = (req: Request, res: Response, next: NextFunction) => {
  const miningSettingsSchema = z.object({
    userId: z.string(),
    hashrate: z.number().optional(),
    deviceType: z.string().optional(),
    poolId: z.string().or(z.number()).optional(),
    powerMode: z.enum(['low', 'medium', 'high', 'turbo'], {
      errorMap: () => ({ message: 'Invalid power mode' }),
    }).optional(),
    isActive: z.boolean().optional(),
    autoAdjust: z.boolean().optional(),
  });
  
  try {
    miningSettingsSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid mining settings',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(400).json({ message: 'Invalid mining settings' });
  }
};