/**
 * Multi-Wallet Routes
 * 
 * API endpoints for managing multiple Bitcoin private keys
 * that all enforce sending to the hardware wallet.
 */

import { Router, Request, Response } from 'express';
import { multiKeyWalletManager } from '../lib/multiKeyWalletManager';
import { HARDWARE_WALLET_ADDRESS } from '../lib/hardwareWalletEnforcer';

// For backward compatibility
const SECURE_HARDWARE_WALLET = HARDWARE_WALLET_ADDRESS;

const router = Router();

/**
 * Get all imported wallets
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const wallets = multiKeyWalletManager.getAllWallets().map(wallet => ({
      id: wallet.id,
      name: wallet.name,
      addresses: wallet.addresses,
      balance: wallet.balance,
      lastUpdated: wallet.lastUpdated
    }));
    
    res.json({
      success: true,
      wallets,
      hardwareWallet: SECURE_HARDWARE_WALLET
    });
  } catch (error: any) {
    console.error('[API] Error getting wallets:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get wallets'
    });
  }
});

/**
 * Import a new private key
 */
router.post('/import', async (req: Request, res: Response) => {
  try {
    const { name, privateKey } = req.body;
    
    if (!name || !privateKey) {
      return res.status(400).json({
        success: false,
        error: 'Name and privateKey are required'
      });
    }
    
    const wallet = multiKeyWalletManager.importPrivateKey(name, privateKey);
    
    if (!wallet) {
      return res.status(400).json({
        success: false,
        error: 'Invalid private key'
      });
    }
    
    res.json({
      success: true,
      wallet: {
        id: wallet.id,
        name: wallet.name,
        addresses: wallet.addresses,
        balance: wallet.balance,
        lastUpdated: wallet.lastUpdated
      }
    });
  } catch (error: any) {
    console.error('[API] Error importing wallet:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to import wallet'
    });
  }
});

/**
 * Get a specific wallet by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const wallet = multiKeyWalletManager.getWallet(id);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'Wallet not found'
      });
    }
    
    res.json({
      success: true,
      wallet: {
        id: wallet.id,
        name: wallet.name,
        addresses: wallet.addresses,
        balance: wallet.balance,
        lastUpdated: wallet.lastUpdated
      }
    });
  } catch (error: any) {
    console.error('[API] Error getting wallet:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get wallet'
    });
  }
});

/**
 * Update wallet balance
 */
router.put('/:id/balance', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { balance } = req.body;
    
    if (balance === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Balance is required'
      });
    }
    
    const wallet = multiKeyWalletManager.getWallet(id);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'Wallet not found'
      });
    }
    
    multiKeyWalletManager.updateWalletBalance(id, balance);
    
    res.json({
      success: true,
      id,
      balance,
      lastUpdated: Date.now()
    });
  } catch (error: any) {
    console.error('[API] Error updating wallet balance:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update wallet balance'
    });
  }
});

/**
 * Remove a wallet
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = multiKeyWalletManager.removeWallet(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Wallet not found'
      });
    }
    
    res.json({
      success: true,
      id
    });
  } catch (error: any) {
    console.error('[API] Error removing wallet:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to remove wallet'
    });
  }
});

/**
 * Create a transaction from an imported wallet to the hardware wallet
 */
router.post('/:id/transaction', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, feeRate } = req.body;
    
    if (amount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Amount is required'
      });
    }
    
    const wallet = multiKeyWalletManager.getWallet(id);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'Wallet not found'
      });
    }
    
    const transaction = await multiKeyWalletManager.createTransaction(id, amount, feeRate);
    
    res.json({
      success: true,
      transaction,
      destinationAddress: SECURE_HARDWARE_WALLET
    });
  } catch (error: any) {
    console.error('[API] Error creating transaction:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create transaction'
    });
  }
});

export default router;