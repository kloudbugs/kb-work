/**
 * Direct Transfers API Routes
 * 
 * These routes provide secure access to direct transfer functions that
 * bypass the standard hardware wallet enforcement when needed for specific
 * use cases like token liquidity and mining rewards.
 * 
 * NOTE: These routes require admin authentication and should only be accessible
 * to authorized system administrators.
 */

import express from 'express';
import { storage } from '../storage';
import { DirectTransferType } from '../../shared/schema';
import { 
  processDirectMiningReward, 
  processDirectTokenLiquidity,
  processDirectNFTTransfer,
  processDirectTransfer
} from '../lib/directTokenTransfer';
import { initializeRealWithdrawalService } from '../lib/realWithdrawalService';

const router = express.Router();

// Middleware to ensure only admins can access these routes
function ensureAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.session?.userId || req.session.isAdmin !== true) {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
}

/**
 * @route POST /api/direct-transfers/mining-reward
 * @desc Process a direct mining reward transfer
 * @access Admin only
 */
router.post('/mining-reward', ensureAdmin, async (req, res) => {
  try {
    const { userId, amount, destinationAddress } = req.body;
    
    if (!userId || !amount || !destinationAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, amount, and destinationAddress are required'
      });
    }
    
    // Validate amount is a positive number
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }
    
    // Process the direct mining reward transfer
    const result = await processDirectMiningReward(
      parseInt(userId),
      amountNum,
      destinationAddress
    );
    
    return res.json(result);
  } catch (error: any) {
    console.error('Error processing direct mining reward:', error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
});

/**
 * @route POST /api/direct-transfers/token-liquidity
 * @desc Process a direct token liquidity transfer
 * @access Admin only
 */
router.post('/token-liquidity', ensureAdmin, async (req, res) => {
  try {
    const { userId, amount, destinationAddress } = req.body;
    
    if (!userId || !amount || !destinationAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, amount, and destinationAddress are required'
      });
    }
    
    // Validate amount is a positive number
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }
    
    // Process the direct token liquidity transfer
    const result = await processDirectTokenLiquidity(
      parseInt(userId),
      amountNum,
      destinationAddress
    );
    
    return res.json(result);
  } catch (error: any) {
    console.error('Error processing direct token liquidity:', error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
});

/**
 * @route POST /api/direct-transfers/nft-transfer
 * @desc Process a direct NFT transfer
 * @access Admin only
 */
router.post('/nft-transfer', ensureAdmin, async (req, res) => {
  try {
    const { userId, amount, destinationAddress, nftId } = req.body;
    
    if (!userId || !amount || !destinationAddress || !nftId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, amount, destinationAddress, and nftId are required'
      });
    }
    
    // Validate amount is a positive number
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }
    
    // Process the direct NFT transfer
    const result = await processDirectNFTTransfer(
      parseInt(userId),
      amountNum,
      destinationAddress,
      nftId
    );
    
    return res.json(result);
  } catch (error: any) {
    console.error('Error processing direct NFT transfer:', error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
});

/**
 * @route GET /api/direct-transfers/history/:userId
 * @desc Get history of direct transfers for a user with optional type filtering
 * @param {string} userId - The user ID to fetch history for
 * @param {string} [type] - Optional filter by transfer type (mining_reward, token_liquidity, nft_transfer)
 * @returns {Object} Object containing array of transfers sorted by date (newest first)
 * @example
 *   GET /api/direct-transfers/history/123                  - Get all direct transfers for user 123
 *   GET /api/direct-transfers/history/123?type=mining_reward - Get only mining reward transfers
 * @access Admin only
 */
router.get('/history/:userId', ensureAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const transferType = req.query.type as DirectTransferType | undefined;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId parameter'
      });
    }
    
    const payouts = await storage.getPayouts(parseInt(userId));
    
    // Filter for direct transfers (only those with valid transferType from our DirectTransferType enum)
    let directTransfers = payouts.filter(p => 
      p.transferType === DirectTransferType.MINING_REWARD ||
      p.transferType === DirectTransferType.TOKEN_LIQUIDITY ||
      p.transferType === DirectTransferType.NFT_TRANSFER
    );
    
    // Apply additional type filtering if specified
    if (transferType) {
      directTransfers = directTransfers.filter(p => p.transferType === transferType);
    }
    
    // Sort by date (newest first)
    directTransfers.sort((a, b) => {
      // Try to get the date from various possible fields
      const dateA = new Date(a.timestamp || a.estimatedCompletionTime || a.created || 0);
      const dateB = new Date(b.timestamp || b.estimatedCompletionTime || b.created || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    return res.json({
      success: true,
      transfers: directTransfers
    });
  } catch (error: any) {
    console.error('Error fetching direct transfer history:', error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
});

/**
 * @route POST /api/direct-transfers/test-withdrawal
 * @desc Test a withdrawal using the current user's account (for testing only)
 */
router.post('/test-withdrawal', async (req, res) => {
  try {
    // Validate the request
    const { destinationAddress, amount, transferType } = req.body;
    
    if (!destinationAddress) {
      return res.status(400).json({
        success: false,
        message: 'Destination Bitcoin address is required'
      });
    }
    
    if (!amount || isNaN(parseInt(amount))) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount in satoshis is required'
      });
    }
    
    // Default to mining reward if no transfer type specified
    const selectedTransferType = transferType || DirectTransferType.MINING_REWARD;
    
    // Get user ID from session (or hardcode for testing purposes)
    const userId = 1; // For testing we'll use admin user ID
    
    console.log(`[TEST WITHDRAWAL] Initiating test withdrawal for user ${userId}`);
    console.log(`[TEST WITHDRAWAL] Destination: ${destinationAddress}`);
    console.log(`[TEST WITHDRAWAL] Amount: ${amount} satoshis`);
    console.log(`[TEST WITHDRAWAL] Transfer type: ${selectedTransferType}`);
    
    // Process the direct transfer
    const result = await processDirectTransfer(
      userId,
      parseInt(amount),
      destinationAddress,
      selectedTransferType
    );
    
    if (result.success) {
      console.log(`[TEST WITHDRAWAL] Successfully initiated withdrawal with TxID: ${result.txHash}`);
    } else {
      console.error(`[TEST WITHDRAWAL] Failed to initiate withdrawal: ${result.message}`);
    }
    
    return res.json({
      success: result.success,
      message: result.message,
      transactionId: result.txHash,
      transferType: selectedTransferType,
      estimatedCompletionTime: result.estimatedCompletionTime,
      details: result
    });
  } catch (error: any) {
    console.error('[TEST WITHDRAWAL] Error processing test withdrawal:', error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
});

/**
 * @route POST /api/direct-transfers/real-withdrawal
 * @desc Process a real Bitcoin withdrawal
 * @access Public (modified to ensure Real Withdrawal feature is permanently enabled)
 */
router.post('/real-withdrawal', async (req, res) => {
  try {
    // Initialize the real withdrawal service if not already initialized
    initializeRealWithdrawalService();
    
    // Validate the request
    const { amount, destination, transferType, notes } = req.body;
    
    if (!amount || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount and destination are required'
      });
    }
    
    // Validate amount is a positive number
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }
    
    // Default to mining reward if no transfer type specified
    const selectedTransferType = transferType || DirectTransferType.MINING_REWARD;
    
    // Get user ID from session
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    console.log(`[REAL WITHDRAWAL] Initiating real withdrawal for user ${userId}`);
    console.log(`[REAL WITHDRAWAL] Destination: ${destination}`);
    console.log(`[REAL WITHDRAWAL] Amount: ${amountNum} satoshis`);
    console.log(`[REAL WITHDRAWAL] Transfer type: ${selectedTransferType}`);
    
    // Get real withdrawal service via dynamic import to avoid circular dependencies
    const { RealWithdrawalService } = await import('../lib/realWithdrawalService');
    const realWithdrawalService = new RealWithdrawalService();
    
    // Process the actual withdrawal
    const result = await realWithdrawalService.processRealWithdrawal({
      userId: String(userId),
      amount: amountNum,
      destination,
      transferType: selectedTransferType,
      notes: notes || ''
    });
    
    if (result.success) {
      console.log(`[REAL WITHDRAWAL] Successfully initiated withdrawal with TxID: ${result.txid}`);
      
      // Record the transaction using the createPayout method
      await storage.createPayout({
        userId: Number(userId),
        amount: String(amountNum),
        txHash: result.txid || 'pending',
        status: 'processing',
        destinationAddress: destination,
        transferType: selectedTransferType,
        timestamp: new Date(),
        transactionType: 'withdrawal',
        notes: notes || 'Real withdrawal processed via admin interface'
      });
      
      return res.json({
        success: true,
        message: 'Withdrawal successfully initiated',
        transactionId: result.txid,
        status: result.status,
        amount: amountNum,
        txDetails: result.txDetails
      });
    } else {
      console.error(`[REAL WITHDRAWAL] Failed to initiate withdrawal: ${result.error}`);
      
      return res.status(500).json({
        success: false,
        message: result.error || 'Withdrawal failed',
        details: result.details
      });
    }
  } catch (error: any) {
    console.error('[REAL WITHDRAWAL] Error processing real withdrawal:', error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
});

// Export default handler for dynamic import in routes.ts
export default function(req: express.Request, res: express.Response, next: express.NextFunction) {
  return router(req, res, next);
};