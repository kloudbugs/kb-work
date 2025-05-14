/**
 * Secure API Endpoints
 * 
 * This file provides secure endpoints that prevent puzzle scanning,
 * withdrawals, or other sensitive operations from occurring outside
 * of the ADMIN-GUARDIAN environment.
 */

import { Router, Request, Response } from 'express';

// Create a router for secure endpoints
const secureRouter = Router();

// Secure middleware that prevents real operations
const secureModeMiddleware = (req: Request, res: Response, next: Function) => {
  // Add secure flag to request
  req.secureMode = true;
  
  // Log security notice
  console.log('[SECURITY] Request processed through secure mode middleware');
  console.log(`[SECURITY] Request path: ${req.path}`);
  
  // Continue with request
  next();
};

// Apply secure middleware to all endpoints
secureRouter.use(secureModeMiddleware);

// Secure version of puzzle scanning endpoint
secureRouter.post('/api/puzzle/monitor', (req: Request, res: Response) => {
  console.log('[SECURITY] Puzzle monitor request intercepted in secure mode');
  
  // Return mock success response
  return res.status(200).json({
    success: true,
    message: "SECURE MODE: Puzzle address monitor simulation (no actual monitoring)",
    status: {
      isRunning: false,
      lastScan: new Date().toISOString(),
      addressesScanned: 0,
      addressesWithBalance: 0,
      totalBalanceFound: 0,
      securityNotice: "Puzzle scanning is disabled for security reasons"
    }
  });
});

// Secure version of puzzle full scan endpoint
secureRouter.post('/api/puzzle/full-scan', (req: Request, res: Response) => {
  console.log('[SECURITY] Puzzle full scan request intercepted in secure mode');
  
  // Return mock success response
  return res.status(200).json({
    success: true,
    message: "SECURE MODE: Full scan simulation (no actual scanning)",
    addressesMonitored: 0,
    addressesWithBalance: 0,
    totalBalance: 0,
    status: {
      isRunning: false,
      lastScan: new Date().toISOString(),
      addressesScanned: 0,
      addressesWithBalance: 0,
      totalBalanceFound: 0,
      securityNotice: "Puzzle scanning is disabled for security reasons"
    }
  });
});

// Secure version of wallet test withdrawal endpoint
secureRouter.post('/api/wallet/test-withdrawal', (req: Request, res: Response) => {
  console.log('[SECURITY] Test withdrawal request intercepted in secure mode');
  
  // Return mock success response
  return res.status(200).json({
    success: true,
    message: "SECURE MODE: Test withdrawal simulation (no actual transaction)",
    txHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    timestamp: Date.now(),
    status: "simulated"
  });
});

// Secure version of real withdrawal endpoint
secureRouter.post('/api/wallet/withdrawal', (req: Request, res: Response) => {
  console.log('[SECURITY] Real withdrawal request intercepted in secure mode');
  
  // Return mock success response for API compatibility
  return res.status(200).json({
    success: true,
    message: "SECURE MODE: Withdrawal simulation (no actual transaction)",
    txHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    status: "simulated"
  });
});

// Secure version of wallet paths scanning endpoint
secureRouter.get('/api/wallet/special/scan-paths', (req: Request, res: Response) => {
  console.log('[SECURITY] Wallet paths scan request intercepted in secure mode');
  
  // Return mock success response
  return res.status(200).json({
    addresses: [],
    addressesByIndex: {},
    stats: {
      totalAddressesFound: 0,
      totalBalance: 0
    },
    securityNotice: "Wallet scanning is disabled for security reasons"
  });
});

// Export the secure router
export default secureRouter;