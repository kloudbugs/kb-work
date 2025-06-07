import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

// Mock authentication for development purposes
// In a real app, this would use sessions, JWT, or other auth mechanisms
let authenticatedUser: User | null = null;

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (authenticatedUser) {
    // Add user to request object
    (req as any).user = authenticatedUser;
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (authenticatedUser && authenticatedUser.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  // Accept admin credentials for TERA Guardian access
  if ((username === 'admin' && password === 'lb106019') || 
      (username === 'demo' && password === 'demo123')) {
    authenticatedUser = {
      id: '1',
      username: username || 'demo',
      isAdmin: true
    };
    return res.json({ success: true, user: authenticatedUser });
  }
  
  return res.status(401).json({ message: 'Invalid credentials' });
};

export const logout = (req: Request, res: Response) => {
  authenticatedUser = null;
  return res.json({ success: true });
};

export const getUser = (req: Request, res: Response) => {
  if (authenticatedUser) {
    return res.json(authenticatedUser);
  }
  return res.status(401).json({ message: 'Not logged in' });
};

// Auto-login for development (remove in production)
authenticatedUser = {
  id: '1',
  username: 'admin',
  isAdmin: true
};