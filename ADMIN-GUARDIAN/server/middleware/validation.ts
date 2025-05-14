/**
 * KLOUD BUGS Mining Command Center - GUARDIAN VERSION
 * Validation Middleware
 * 
 * This middleware provides input validation for sensitive operations
 * in the GUARDIAN environment, particularly for wallet transactions.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Validate wallet transaction requests
 */
export const validateTransaction = (req: Request, res: Response, next: NextFunction) => {
  const transactionSchema = z.object({
    destinationAddress: z.string()
      .min(26, 'Bitcoin address must be at least 26 characters')
      .max(64, 'Bitcoin address cannot exceed 64 characters'),
    amount: z.number()
      .positive('Amount must be greater than 0')
      .max(21000000, 'Amount cannot exceed total supply of Bitcoin'),
    fee: z.number().positive('Fee must be greater than 0').optional(),
    memo: z.string().max(250, 'Memo cannot exceed 250 characters').optional(),
  });
  
  try {
    transactionSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid transaction parameters',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(400).json({ message: 'Invalid transaction parameters' });
  }
};

/**
 * Validate wallet private key operations
 */
export const validateKeyOperation = (req: Request, res: Response, next: NextFunction) => {
  const keyOpSchema = z.object({
    purpose: z.enum(['sign', 'verify', 'export', 'backup'], {
      errorMap: () => ({ message: 'Invalid operation purpose' }),
    }),
    signature: z.string().optional(),
    message: z.string().optional(),
    backupPassphrase: z.string().min(12, 'Backup passphrase must be at least 12 characters').optional(),
  });
  
  try {
    keyOpSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid key operation parameters',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(400).json({ message: 'Invalid key operation parameters' });
  }
};

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
    allowWalletAccess: z.boolean().optional(),
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
 * Validate withdrawal requests
 */
export const validateWithdrawal = (req: Request, res: Response, next: NextFunction) => {
  const withdrawalSchema = z.object({
    destinationAddress: z.string()
      .min(26, 'Bitcoin address must be at least 26 characters')
      .max(64, 'Bitcoin address cannot exceed 64 characters'),
    amount: z.number()
      .positive('Amount must be greater than 0'),
    fee: z.enum(['low', 'medium', 'high', 'custom'], {
      errorMap: () => ({ message: 'Invalid fee option' }),
    }),
    customFeeRate: z.number().positive().optional(),
    memo: z.string().max(250, 'Memo cannot exceed 250 characters').optional(),
    totpCode: z.string().length(6, 'TOTP code must be 6 digits').optional(),
  });
  
  try {
    withdrawalSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid withdrawal parameters',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(400).json({ message: 'Invalid withdrawal parameters' });
  }
};