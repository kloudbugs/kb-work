/**
 * KLOUD BUGS Mining Command Center - ADMIN VERSION
 * Authentication Middleware
 */

import { Request, Response, NextFunction } from 'express';
import * as userService from '../controllers/user-controller';

// Extend Express Request type to include session properties
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    isAdmin?: boolean;
    isDemoUser?: boolean;
  }
}

/**
 * Middleware to check if a user is authenticated
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

/**
 * Middleware to check if user is an admin
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId || !req.session.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

/**
 * Middleware to check if a user has an active subscription
 */
export const hasActiveSubscription = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const hasSubscription = await userService.checkUserSubscription(req.session.userId);
    
    if (!hasSubscription) {
      return res.status(403).json({ 
        message: 'Active subscription required',
        subscriptionRequired: true
      });
    }
    
    next();
  } catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({ message: 'Failed to verify subscription status' });
  }
};

/**
 * Middleware to check if this is a demo session
 */
export const isDemoMode = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.isDemoUser) {
    return res.status(403).json({ message: 'Demo mode required for this action' });
  }
  next();
};