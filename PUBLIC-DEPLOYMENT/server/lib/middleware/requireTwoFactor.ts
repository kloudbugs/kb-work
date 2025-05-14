/**
 * Two-Factor Authentication Middleware
 * Ensures that admin and enabled users have completed 2FA verification
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware that checks if the current user has completed 2FA if it's required
 */
export function requireTwoFactor(req: Request, res: Response, next: NextFunction) {
  // If no user is logged in, return authentication error
  if (!req.session?.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // For admin users, always require 2FA
  if (req.session.isAdmin === true) {
    // Check if they've completed 2FA verification
    if (req.session.twoFactorAuthenticated !== true) {
      return res.status(403).json({
        message: 'Two-factor authentication required',
        requiresTwoFactor: true,
        isAdmin: true
      });
    }
  }

  // For regular users who have enabled 2FA
  else if (req.session.twoFactorEnabled === true) {
    // Check if they've completed 2FA verification
    if (req.session.twoFactorAuthenticated !== true) {
      return res.status(403).json({
        message: 'Two-factor authentication required',
        requiresTwoFactor: true,
        isAdmin: false
      });
    }
  }

  // User either doesn't need 2FA or has completed it
  next();
}

/**
 * Middleware that checks if the current user is admin AND has completed 2FA
 * This is for extra-sensitive admin operations
 */
export function requireAdminTwoFactor(req: Request, res: Response, next: NextFunction) {
  // If no user is logged in, return authentication error
  if (!req.session?.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Check if user is admin
  if (req.session.isAdmin !== true) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  // Check if admin has completed 2FA verification
  if (req.session.twoFactorAuthenticated !== true) {
    return res.status(403).json({
      message: 'Two-factor authentication required',
      requiresTwoFactor: true,
      isAdmin: true
    });
  }

  // Admin has completed 2FA
  next();
}