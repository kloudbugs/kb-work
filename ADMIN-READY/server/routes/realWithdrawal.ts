import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/auth';
import { RealWithdrawalService } from '../lib/realWithdrawalService';
import { logger } from '../utils/logger';
import { WalletService } from '../lib/walletService';

const router = express.Router();
const realWithdrawalService = new RealWithdrawalService();
const walletService = new WalletService();

/**
 * Initiate a real Bitcoin withdrawal
 * This endpoint will create and broadcast an actual Bitcoin transaction
 */
router.post('/real-withdrawal', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { amount, destination, transferType, notes } = req.body;
    
    // Validate input parameters
    if (!amount || !destination || !transferType) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        details: {
          requiredFields: ['amount', 'destination', 'transferType'],
          providedFields: Object.keys(req.body)
        }
      });
    }
    
    // Convert amount to number if it's a string
    const amountInSatoshis = typeof amount === 'string' ? parseInt(amount, 10) : amount;
    
    // Validate amount is a positive number
    if (isNaN(amountInSatoshis) || amountInSatoshis <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    // Get user wallet balance
    const userId = req.user!.id;
    const walletInfo = await walletService.getWalletInfo(userId);
    
    if (!walletInfo) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    
    // Check if user has enough balance
    if (walletInfo.balanceSatoshis < amountInSatoshis) {
      return res.status(400).json({ 
        error: 'Insufficient balance',
        details: {
          requested: amountInSatoshis,
          available: walletInfo.balanceSatoshis
        }
      });
    }
    
    // Check if transfer type is valid
    const validTransferTypes = ['mining_reward', 'token_liquidity', 'nft_transfer'];
    if (!validTransferTypes.includes(transferType)) {
      return res.status(400).json({ 
        error: 'Invalid transfer type',
        details: {
          provided: transferType,
          valid: validTransferTypes
        }
      });
    }
    
    // Log the withdrawal attempt
    logger.info(`Real withdrawal initiated: ${amountInSatoshis} satoshis to ${destination} (${transferType})`);
    
    // Initiate the actual withdrawal
    const result = await realWithdrawalService.processRealWithdrawal({
      userId,
      amount: amountInSatoshis,
      destination,
      transferType,
      notes: notes || ''
    });
    
    // Update wallet balance after successful withdrawal
    if (result.success) {
      await walletService.updateBalance(userId, -amountInSatoshis);
      
      // Record the transaction
      await walletService.recordTransaction({
        userId,
        amount: amountInSatoshis,
        txid: result.txid || 'pending',
        type: 'withdrawal',
        status: 'processing',
        destination,
        transferType,
        notes: notes || ''
      });
      
      return res.status(200).json({
        success: true,
        txid: result.txid,
        status: result.status,
        amount: amountInSatoshis,
        txDetails: result.txDetails
      });
    } else {
      // Record the failed transaction attempt
      await walletService.recordTransaction({
        userId,
        amount: amountInSatoshis,
        txid: 'failed',
        type: 'withdrawal',
        status: 'failed',
        destination,
        transferType,
        error: result.error,
        notes: notes || ''
      });
      
      return res.status(500).json({
        error: result.error || 'Withdrawal failed',
        details: result.details
      });
    }
  } catch (error: any) {
    logger.error('Error processing real withdrawal:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

/**
 * Get withdrawal transaction status
 * This endpoint checks the status of a previously initiated withdrawal
 */
router.get('/transaction/:txid', isAuthenticated, async (req, res) => {
  try {
    const { txid } = req.params;
    const status = await realWithdrawalService.checkTransactionStatus(txid);
    return res.status(200).json(status);
  } catch (error: any) {
    logger.error('Error checking transaction status:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

export default router;