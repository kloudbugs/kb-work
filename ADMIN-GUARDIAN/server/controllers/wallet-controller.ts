/**
 * KLOUD BUGS Mining Command Center - GUARDIAN VERSION
 * Wallet Controller
 * 
 * This controller manages wallet operations for the GUARDIAN environment.
 * These wallet operations are sensitive and should NEVER be exposed in other environments.
 */

import { Request, Response } from 'express';
import * as walletUtils from '../utils/wallet';

/**
 * Get all wallet addresses derived from the private key
 */
export const getWalletAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = walletUtils.deriveAddresses();
    res.json({ addresses });
  } catch (error) {
    console.error('Error retrieving wallet addresses:', error);
    res.status(500).json({ message: 'Failed to retrieve wallet addresses' });
  }
};

/**
 * Get wallet balance
 */
export const getWalletBalance = async (req: Request, res: Response) => {
  try {
    const balance = await walletUtils.getWalletBalance();
    res.json({ balance });
  } catch (error) {
    console.error('Error retrieving wallet balance:', error);
    res.status(500).json({ message: 'Failed to retrieve wallet balance' });
  }
};

/**
 * Get transaction history
 */
export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const transactions = await walletUtils.getTransactionHistory();
    res.json({ transactions });
  } catch (error) {
    console.error('Error retrieving transaction history:', error);
    res.status(500).json({ message: 'Failed to retrieve transaction history' });
  }
};

/**
 * Create and sign a transaction
 */
export const createTransaction = async (req: Request, res: Response) => {
  const { destinationAddress, amount, feeRate } = req.body;
  
  // Convert amount from BTC to satoshis
  const amountSatoshis = Math.floor(parseFloat(amount) * 100000000);
  
  try {
    const result = await walletUtils.createTransaction(
      destinationAddress,
      amountSatoshis,
      feeRate
    );
    
    res.json({
      message: 'Transaction created successfully',
      txid: result.txid,
      txHex: result.txHex
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
};

/**
 * Broadcast a transaction to the network
 */
export const broadcastTransaction = async (req: Request, res: Response) => {
  const { txHex } = req.body;
  
  try {
    const txid = await walletUtils.broadcastTransaction(txHex);
    
    res.json({
      message: 'Transaction broadcast successfully',
      txid
    });
  } catch (error) {
    console.error('Error broadcasting transaction:', error);
    res.status(500).json({ message: 'Failed to broadcast transaction' });
  }
};

/**
 * Sign a message with the wallet's private key
 */
export const signMessage = async (req: Request, res: Response) => {
  const { message } = req.body;
  
  try {
    const signature = walletUtils.signMessage(message);
    
    res.json({
      message: 'Message signed successfully',
      signature
    });
  } catch (error) {
    console.error('Error signing message:', error);
    res.status(500).json({ message: 'Failed to sign message' });
  }
};

/**
 * Verify a message signature
 */
export const verifySignature = async (req: Request, res: Response) => {
  const { message, signature, address } = req.body;
  
  try {
    const isValid = walletUtils.verifySignature(message, signature, address);
    
    res.json({
      message: isValid ? 'Signature is valid' : 'Signature is invalid',
      isValid
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ message: 'Failed to verify signature' });
  }
};

/**
 * Create a backup of the wallet
 */
export const createBackup = async (req: Request, res: Response) => {
  const { passphrase } = req.body;
  
  try {
    const backup = walletUtils.createWalletBackup(passphrase);
    
    res.json({
      message: 'Wallet backup created successfully',
      backup
    });
  } catch (error) {
    console.error('Error creating wallet backup:', error);
    res.status(500).json({ message: 'Failed to create wallet backup' });
  }
};

/**
 * Import a wallet from backup
 */
export const importFromBackup = async (req: Request, res: Response) => {
  const { backup, passphrase } = req.body;
  
  try {
    const success = walletUtils.importWalletFromBackup(backup, passphrase);
    
    if (success) {
      res.json({
        message: 'Wallet imported successfully'
      });
    } else {
      res.status(400).json({
        message: 'Failed to import wallet'
      });
    }
  } catch (error) {
    console.error('Error importing wallet:', error);
    res.status(500).json({ message: 'Failed to import wallet' });
  }
};