import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * PUBLIC DEPLOYMENT NOTICE
 * 
 * Real withdrawal functionality is ONLY available in the ADMIN-GUARDIAN environment.
 * This is a placeholder route that returns an appropriate security message.
 */
router.post('/real-withdrawal', isAuthenticated, isAdmin, async (req, res) => {
  logger.info('Attempted to access real withdrawal in PUBLIC-DEPLOYMENT environment');
  return res.status(403).json({
    error: 'Security Restriction',
    message: 'Real wallet operations are only available in the ADMIN-GUARDIAN environment.',
    details: 'For security reasons, this functionality is restricted in the PUBLIC-DEPLOYMENT version.'
  });
});

/**
 * Get withdrawal transaction status
 * This endpoint provides a placeholder for the transaction status check
 */
router.get('/transaction/:txid', isAuthenticated, async (req, res) => {
  logger.info(`Attempted to check transaction status in PUBLIC-DEPLOYMENT environment: ${req.params.txid}`);
  return res.status(403).json({
    error: 'Security Restriction',
    message: 'Transaction verification is only available in the ADMIN-GUARDIAN environment.',
    details: 'For security reasons, this functionality is restricted in the PUBLIC-DEPLOYMENT version.'
  });
});

export default router;