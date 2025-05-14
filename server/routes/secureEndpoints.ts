/**
 * Secure API Endpoints
 * 
 * This file provides secure endpoints that prevent puzzle scanning,
 * withdrawals, or other sensitive operations from occurring outside
 * of the ADMIN-GUARDIAN environment.
 */

import express, { Request, Response, Router } from 'express';

// Create the secure router
const secureRouter: Router = express.Router();

// Middleware to mark all secure routes
const secureModeMiddleware = (req: Request, res: Response, next: Function) => {
  // Mark this request as operating in secure mode (view-only)
  (req as any).secureMode = true;
  next();
};

// Apply secure mode middleware to all routes
secureRouter.use(secureModeMiddleware);

// Return empty/safe results for puzzle monitoring
secureRouter.post('/api/puzzle/monitor', (req: Request, res: Response) => {
  console.log('[SECURITY] Puzzle monitoring blocked (secure mode)');
  res.json({ 
    success: false,
    message: 'Puzzle monitoring is disabled in this environment',
    puzzles: []
  });
});

// Block full puzzle scanning
secureRouter.post('/api/puzzle/full-scan', (req: Request, res: Response) => {
  console.log('[SECURITY] Puzzle full scan blocked (secure mode)');
  res.json({ 
    success: false,
    message: 'Puzzle scanning is disabled in this environment'
  });
});

// Block test withdrawals
secureRouter.post('/api/wallet/test-withdrawal', (req: Request, res: Response) => {
  console.log('[SECURITY] Test withdrawal blocked (secure mode)');
  res.json({ 
    success: false,
    message: 'Test withdrawals are disabled in this environment'
  });
});

// Block real withdrawals
secureRouter.post('/api/wallet/withdrawal', (req: Request, res: Response) => {
  console.log('[SECURITY] Withdrawal blocked (secure mode)');
  res.json({ 
    success: false,
    message: 'Withdrawals are disabled in this environment'
  });
});

// Block special wallet operations
secureRouter.get('/api/wallet/special/scan-paths', (req: Request, res: Response) => {
  console.log('[SECURITY] Special wallet scan blocked (secure mode)');
  res.json({ 
    success: false,
    message: 'Special wallet operations are disabled in this environment',
    paths: []
  });
});

// Export the secure router
export default secureRouter;

console.log('[SECURITY] Secure endpoints router initialized - All sensitive operations blocked');