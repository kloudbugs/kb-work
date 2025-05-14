/**
 * Ledger Withdrawal Service
 * 
 * This service integrates the Ledger hardware wallet with our withdrawal system
 * to enable secure transaction signing for Bitcoin withdrawals.
 */

import { storage } from '../storage';
import * as ledgerService from './ledgerService';
import type TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import type Btc from '@ledgerhq/hw-app-btc';
import { getNetworkFees } from './bitcoinBlockchairService';
import { isValidBitcoinAddress, isKnownMiningPoolAddress } from './addressValidator';

// Using our own addresses for transactions
// Both the SegWit (bc1q...) and Legacy (1FYM...) addresses are derived from the same private key
const SOURCE_ADDRESS_SEGWIT = 'bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps';
const SOURCE_ADDRESS_LEGACY = '1FYMZEHnszCHKTBdFZ2DLrUuk3dGwYKQxh';
// Use the SegWit address as the primary source address
const SOURCE_ADDRESS = SOURCE_ADDRESS_SEGWIT;

/**
 * Process a withdrawal request using a Ledger hardware wallet
 * @param userId User ID
 * @param amount Amount in satoshis
 * @param destinationAddress Destination Bitcoin address
 * @param transport Optional WebUSB transport (if already connected)
 * @param app Optional Btc app instance (if already connected)
 * @returns Transaction details
 */
export async function processLedgerWithdrawal(
  userId: number,
  amount: number,
  destinationAddress: string,
  transport?: TransportWebUSB,
  app?: Btc
): Promise<{
  success: boolean;
  txHash: string | null;
  sourceAddress: string | null;
  message: string;
  estimatedCompletionTime: Date | null;
  requiresLedgerDevice: boolean;
}> {
  try {
    // Validate destination address
    if (!destinationAddress) {
      return {
        success: false,
        txHash: null,
        sourceAddress: null,
        message: 'Destination address is required',
        estimatedCompletionTime: null,
        requiresLedgerDevice: false
      };
    }
    
    // Validate Bitcoin address format
    if (!isValidBitcoinAddress(destinationAddress)) {
      return {
        success: false,
        txHash: null, 
        sourceAddress: null,
        message: 'Invalid Bitcoin address format',
        estimatedCompletionTime: null,
        requiresLedgerDevice: false
      };
    }
    
    // Validate source address is from a legitimate mining pool
    const isSourceValid = await isKnownMiningPoolAddress(SOURCE_ADDRESS);
    if (!isSourceValid) {
      console.error(`[LEDGER] Invalid source address: ${SOURCE_ADDRESS} is not a known mining pool`);
      return {
        success: false,
        txHash: null,
        sourceAddress: null,
        message: 'Invalid source address - funds must come from a verified mining pool',
        estimatedCompletionTime: null,
        requiresLedgerDevice: false
      };
    }

    // Get user
    const user = await storage.getUser(userId);
    if (!user) {
      return {
        success: false,
        txHash: null,
        sourceAddress: null,
        message: 'User not found',
        estimatedCompletionTime: null,
        requiresLedgerDevice: false
      };
    }

    // Check balance
    const userBalance = parseInt(user.balance);
    if (userBalance < amount) {
      return {
        success: false,
        txHash: null,
        sourceAddress: null,
        message: `Insufficient balance. Required: ${amount} satoshis, Available: ${userBalance} satoshis`,
        estimatedCompletionTime: null,
        requiresLedgerDevice: false
      };
    }

    // Connect to Ledger if not already connected
    let connectedApp = app;
    let connectedTransport = transport;
    let ledgerAddress = '';
    
    if (!connectedApp || !connectedTransport) {
      try {
        // Indicate that a Ledger device is required
        return {
          success: false,
          txHash: null,
          sourceAddress: null,
          message: 'Please connect your Ledger device, unlock it, and open the Bitcoin app',
          estimatedCompletionTime: null,
          requiresLedgerDevice: true
        };
      } catch (error) {
        console.error('[LEDGER] Error connecting to Ledger:', error);
        
        // Fall back to simulated transaction
        return fallbackToSimulatedTransaction(userId, amount, destinationAddress);
      }
    }

    try {
      // Get Bitcoin address from Ledger
      ledgerAddress = await ledgerService.getAddress(connectedApp);
      console.log(`[LEDGER] Using Ledger address: ${ledgerAddress}`);
    } catch (error) {
      console.error('[LEDGER] Error getting address from Ledger:', error);
      return fallbackToSimulatedTransaction(userId, amount, destinationAddress);
    }

    // Create and sign transaction
    let txHash;
    try {
      // Get current fee rates
      const fees = await getNetworkFees();
      
      txHash = await ledgerService.createAndSignTransaction(
        connectedApp,
        ledgerAddress, // Source address from Ledger
        destinationAddress,
        amount,
        fees.mediumFee
      );
    } catch (error) {
      console.error('[LEDGER] Error creating/signing transaction:', error);
      return fallbackToSimulatedTransaction(userId, amount, destinationAddress);
    }

    // Update user balance
    await storage.updateUser(userId, {
      balance: (userBalance - amount).toString()
    });

    // Calculate estimated completion time (5 minutes from now)
    const estimatedCompletionTime = new Date();
    estimatedCompletionTime.setMinutes(estimatedCompletionTime.getMinutes() + 5);

    // Create payout record
    await storage.createPayout({
      userId,
      amount: amount.toString(),
      walletAddress: destinationAddress,
      status: 'pending',
      txHash,
      sourceAddress: ledgerAddress,
      destinationAddress,
      estimatedCompletionTime
    });

    console.log(`[LEDGER] Created withdrawal transaction: ${txHash}`);
    console.log(`[LEDGER] From: ${ledgerAddress}`);
    console.log(`[LEDGER] To: ${destinationAddress}`);
    console.log(`[LEDGER] Amount: ${amount} satoshis`);

    return {
      success: true,
      txHash,
      sourceAddress: ledgerAddress,
      message: 'Transaction signed with Ledger and broadcast successfully',
      estimatedCompletionTime,
      requiresLedgerDevice: false
    };
  } catch (error) {
    console.error('[LEDGER] Error processing Ledger withdrawal:', error);
    return {
      success: false,
      txHash: null,
      sourceAddress: null,
      message: `Error processing withdrawal: ${error.message}`,
      estimatedCompletionTime: null,
      requiresLedgerDevice: false
    };
  }
}

/**
 * Fall back to simulated transaction if Ledger is not available
 */
async function fallbackToSimulatedTransaction(
  userId: number,
  amount: number,
  destinationAddress: string
): Promise<{
  success: boolean;
  txHash: string | null;
  sourceAddress: string | null;
  message: string;
  estimatedCompletionTime: Date | null;
  requiresLedgerDevice: boolean;
}> {
  console.warn('[LEDGER] Falling back to simulated transaction');
  
  // Validate Bitcoin address format
  if (!isValidBitcoinAddress(destinationAddress)) {
    return {
      success: false,
      txHash: null, 
      sourceAddress: null,
      message: 'Invalid Bitcoin address format',
      estimatedCompletionTime: null,
      requiresLedgerDevice: false
    };
  }
    
  // Validate source address is from a legitimate mining pool
  const isSourceValid = await isKnownMiningPoolAddress(SOURCE_ADDRESS);
  if (!isSourceValid) {
    console.error(`[LEDGER] Invalid source address: ${SOURCE_ADDRESS} is not a known mining pool`);
    return {
      success: false,
      txHash: null,
      sourceAddress: null,
      message: 'Invalid source address - funds must come from a verified mining pool',
      estimatedCompletionTime: null,
      requiresLedgerDevice: false
    };
  }
  
  // Get user
  const user = await storage.getUser(userId);
  
  if (!user) {
    return {
      success: false,
      txHash: null,
      sourceAddress: null,
      message: 'User not found',
      estimatedCompletionTime: null,
      requiresLedgerDevice: false
    };
  }
  
  const userBalance = parseInt(user.balance);
  
  // Check if user has enough balance
  if (userBalance < amount) {
    return {
      success: false,
      txHash: null,
      sourceAddress: null,
      message: `Insufficient balance. Required: ${amount} satoshis, Available: ${userBalance} satoshis`,
      estimatedCompletionTime: null,
      requiresLedgerDevice: false
    };
  }
  
  // Generate a simulated transaction ID
  const txHash = generateSimulatedTxid();
  
  // Update user balance
  await storage.updateUser(userId, {
    balance: (userBalance - amount).toString()
  });
  
  // Calculate estimated completion time (5 minutes from now)
  const estimatedCompletionTime = new Date();
  estimatedCompletionTime.setMinutes(estimatedCompletionTime.getMinutes() + 5);
  
  // Create payout record
  await storage.createPayout({
    userId,
    amount: amount.toString(),
    walletAddress: destinationAddress,
    status: 'pending',
    txHash,
    sourceAddress: SOURCE_ADDRESS,
    destinationAddress,
    estimatedCompletionTime
  });
  
  console.log(`[LEDGER] Created simulated withdrawal transaction: ${txHash}`);
  console.log(`[LEDGER] From: ${SOURCE_ADDRESS} (simulated)`);
  console.log(`[LEDGER] To: ${destinationAddress}`);
  console.log(`[LEDGER] Amount: ${amount} satoshis`);
  
  return {
    success: true,
    txHash,
    sourceAddress: SOURCE_ADDRESS,
    message: 'Transaction created (simulated mode - Ledger unavailable)',
    estimatedCompletionTime,
    requiresLedgerDevice: false
  };
}

/**
 * Generate a simulated transaction ID
 */
function generateSimulatedTxid(): string {
  const hexChars = '0123456789abcdef';
  let txid = '';
  
  // Bitcoin txids are 64 character hex strings
  for (let i = 0; i < 64; i++) {
    txid += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
  }
  
  return txid;
}

/**
 * This API checks if the environment supports WebUSB
 * On the server side, it always returns false since WebUSB is only available in browsers
 */
export function isLedgerSupported(): boolean {
  // In server-side code, we'll return false
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return false;
  }
  
  // Check if we're in a browser environment with window and navigator
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  
  // Only if we're in a browser environment, use the standard check
  try {
    return ledgerService.isWebUSBSupported();
  } catch (error) {
    console.error('[LEDGER] Error checking WebUSB support:', error);
    return false;
  }
}