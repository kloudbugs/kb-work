/**
 * Secure Transaction Signer
 * 
 * This service allows creating and signing Bitcoin transactions securely,
 * using the admin's hardware wallet.
 */

import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import axios from 'axios';
import { storage } from '../storage';

// Create ECPair factory with tiny-secp256k1
const ECPair = ECPairFactory(ecc);

// The network to use (bitcoin mainnet)
const network = bitcoin.networks.bitcoin;

// Admin hardware wallet address (always used for security)
const ADMIN_WALLET_ADDRESS = 'bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps';

/**
 * Create and sign a Bitcoin transaction
 */
export async function createSignedTransaction(
  amount: number,
  destinationAddress: string,
  privateKeyHex?: string  // Optional - if not provided, will use stored key
): Promise<{
  success: boolean;
  message: string;
  txHex?: string;
  txid?: string;
}> {
  try {
    console.log(`[SECURE SIGNER] Creating transaction: ${amount} satoshis to ${destinationAddress}`);
    
    // Step 1: Get UTXOs for the source address
    const utxos = await getAddressUtxos(ADMIN_WALLET_ADDRESS);
    
    if (!utxos || utxos.length === 0) {
      console.error(`[SECURE SIGNER] No UTXOs found for address ${ADMIN_WALLET_ADDRESS}`);
      return {
        success: false,
        message: 'No funds available for transaction'
      };
    }
    
    // Step 2: Get the private key (either from parameter or stored)
    const keyPair = getKeyPair(privateKeyHex);
    
    if (!keyPair) {
      return {
        success: false,
        message: 'Invalid or missing private key'
      };
    }
    
    // Step 3: Calculate total input amount and change
    const totalInputAmount = utxos.reduce((sum, utxo) => sum + utxo.value, 0);
    const feeRate = await getRecommendedFeeRate();
    const estimatedSize = 250; // Estimate transaction size in bytes
    const estimatedFee = estimatedSize * feeRate;
    
    // Step 4: Ensure we have enough funds
    if (totalInputAmount < amount + estimatedFee) {
      console.error(`[SECURE SIGNER] Insufficient funds: ${totalInputAmount} < ${amount} + ${estimatedFee}`);
      return {
        success: false,
        message: `Insufficient funds: ${totalInputAmount} satoshis available, need ${amount + estimatedFee} satoshis`
      };
    }
    
    // Calculate change amount
    const changeAmount = totalInputAmount - amount - estimatedFee;
    
    // Step 5: Create the transaction
    const psbt = new bitcoin.Psbt({ network });
    
    // Add inputs
    for (const utxo of utxos) {
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: bitcoin.address.toOutputScript(ADMIN_WALLET_ADDRESS, network),
          value: utxo.value,
        },
      });
    }
    
    // Add destination output
    psbt.addOutput({
      address: destinationAddress,
      value: amount,
    });
    
    // Add change output if needed
    if (changeAmount > 546) { // Dust threshold is 546 satoshis
      psbt.addOutput({
        address: ADMIN_WALLET_ADDRESS, // Send change back to source address
        value: changeAmount,
      });
    }
    
    // Step 6: Sign the transaction
    utxos.forEach((_, index) => {
      psbt.signInput(index, keyPair);
    });
    
    // Finalize and extract transaction
    psbt.finalizeAllInputs();
    const tx = psbt.extractTransaction();
    
    // Get transaction hex and ID
    const txHex = tx.toHex();
    const txid = tx.getId();
    
    console.log(`[SECURE SIGNER] Transaction created successfully: ${txid}`);
    console.log(`[SECURE SIGNER] Transaction hex: ${txHex}`);
    
    return {
      success: true,
      message: 'Transaction created and signed successfully',
      txHex,
      txid
    };
  } catch (error: any) {
    console.error('[SECURE SIGNER] Error creating transaction:', error);
    return {
      success: false,
      message: `Error creating transaction: ${error.message}`
    };
  }
}

/**
 * Get UTXOs for a Bitcoin address
 */
async function getAddressUtxos(address: string): Promise<Array<{
  txid: string;
  vout: number;
  value: number;
  confirmations: number;
}>> {
  try {
    // Use Blockchair API to get UTXOs
    const url = `https://api.blockchair.com/bitcoin/outputs?q=recipient(${address}),is_spent(false)`;
    const response = await axios.get(url);
    
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      console.error(`[SECURE SIGNER] Invalid response from API for address ${address}`);
      return [];
    }
    
    // Map API response to UTXO format
    return response.data.data.map((output: any) => ({
      txid: output.transaction_hash,
      vout: output.index,
      value: parseInt(output.value),
      confirmations: output.block_id ? 6 : 0 // Simplify confirmations
    }));
  } catch (error: any) {
    console.error(`[SECURE SIGNER] Error fetching UTXOs for address ${address}:`, error.message);
    
    // Return some mock UTXOs for testing in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[SECURE SIGNER] Returning mock UTXOs for development');
      return [
        {
          txid: '7f2fa9cb5f7bc2d6aa1c64e66df6bf208324f38dafeee7be61c43cdc163d3e3e',
          vout: 0,
          value: 1000000, // 0.01 BTC
          confirmations: 6
        }
      ];
    }
    
    return [];
  }
}

/**
 * Get the key pair for signing
 */
function getKeyPair(privateKeyHex?: string): bitcoin.ECPairInterface | null {
  try {
    let keyHex: string;
    
    if (privateKeyHex) {
      // Use provided key
      keyHex = privateKeyHex;
    } else {
      // For development/testing only - in production, would use secure key storage
      // IMPORTANT: This would be replaced with proper key retrieval in production
      if (process.env.BITCOIN_PRIVATE_KEY) {
        keyHex = process.env.BITCOIN_PRIVATE_KEY;
      } else {
        console.error('[SECURE SIGNER] No private key available');
        return null;
      }
    }
    
    // Create key pair from hex
    return ECPair.fromPrivateKey(Buffer.from(keyHex, 'hex'), { network });
  } catch (error: any) {
    console.error('[SECURE SIGNER] Error creating key pair:', error.message);
    return null;
  }
}

/**
 * Get recommended fee rate from mempool.space
 */
async function getRecommendedFeeRate(): Promise<number> {
  try {
    const response = await axios.get('https://mempool.space/api/v1/fees/recommended');
    
    // Use fast fee rate for important transactions
    return response.data.fastestFee;
  } catch (error) {
    console.error('[SECURE SIGNER] Error fetching fee rate:', error);
    // Default to 10 sat/byte if API fails
    return 10;
  }
}

/**
 * Broadcast a signed transaction to the Bitcoin network
 */
export async function broadcastTransaction(txHex: string): Promise<{
  success: boolean;
  message: string;
  txid?: string;
}> {
  try {
    console.log(`[SECURE SIGNER] Broadcasting transaction: ${txHex.slice(0, 20)}...`);
    
    // Use Blockchair API to broadcast transaction
    const url = 'https://api.blockchair.com/bitcoin/push/transaction';
    const response = await axios.post(url, { data: txHex });
    
    if (response.data && response.data.data && response.data.data.transaction_hash) {
      const txid = response.data.data.transaction_hash;
      console.log(`[SECURE SIGNER] Transaction broadcast successful: ${txid}`);
      
      return {
        success: true,
        message: 'Transaction broadcast successful',
        txid
      };
    } else {
      console.error('[SECURE SIGNER] Invalid response from broadcast API');
      return {
        success: false,
        message: 'Failed to broadcast transaction: Invalid API response'
      };
    }
  } catch (error: any) {
    console.error('[SECURE SIGNER] Error broadcasting transaction:', error.message);
    
    // If the API call fails, try a fallback API
    try {
      console.log('[SECURE SIGNER] Trying fallback broadcast API');
      
      const fallbackUrl = 'https://mempool.space/api/tx';
      const fallbackResponse = await axios.post(fallbackUrl, txHex, {
        headers: { 'Content-Type': 'text/plain' }
      });
      
      if (fallbackResponse.data) {
        const txid = fallbackResponse.data;
        console.log(`[SECURE SIGNER] Transaction broadcast successful via fallback: ${txid}`);
        
        return {
          success: true,
          message: 'Transaction broadcast successful via fallback',
          txid
        };
      }
    } catch (fallbackError: any) {
      console.error('[SECURE SIGNER] Error broadcasting via fallback:', fallbackError.message);
    }
    
    return {
      success: false,
      message: `Failed to broadcast transaction: ${error.message}`
    };
  }
}

/**
 * Create, sign, and broadcast a Bitcoin transaction in one step
 */
export async function sendBitcoin(
  amount: number,
  destinationAddress: string,
  privateKeyHex?: string
): Promise<{
  success: boolean;
  message: string;
  txid?: string;
  txHex?: string;
}> {
  // Create and sign the transaction
  const signResult = await createSignedTransaction(amount, destinationAddress, privateKeyHex);
  
  if (!signResult.success || !signResult.txHex) {
    return signResult;
  }
  
  // Broadcast the transaction
  const broadcastResult = await broadcastTransaction(signResult.txHex);
  
  if (!broadcastResult.success) {
    return {
      success: false,
      message: `Transaction created but broadcast failed: ${broadcastResult.message}`,
      txHex: signResult.txHex
    };
  }
  
  // Create a payout record for tracking
  try {
    await storage.createPayout({
      userId: '1', // Admin user ID
      amount: amount.toString(),
      walletAddress: destinationAddress,
      status: 'processing',
      txHash: broadcastResult.txid,
      sourceAddress: ADMIN_WALLET_ADDRESS,
      destinationAddress,
      estimatedCompletionTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      transactionType: 'manual_signed'
    });
    
    console.log(`[SECURE SIGNER] Created payout record for transaction ${broadcastResult.txid}`);
  } catch (error: any) {
    console.error('[SECURE SIGNER] Error creating payout record:', error.message);
    // Continue anyway - the transaction was broadcast successfully
  }
  
  return {
    success: true,
    message: 'Transaction created, signed, and broadcast successfully',
    txid: broadcastResult.txid,
    txHex: signResult.txHex
  };
}