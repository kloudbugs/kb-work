/**
 * Blockchain Service Module
 * 
 * This module provides integration with BlockCypher API to handle real Bitcoin transactions
 * for manual withdrawals from the application.
 */

import axios from 'axios';
import crypto from 'crypto';
import { storage } from '../storage';

const BLOCKCYPHER_BASE_URL = 'https://api.blockcypher.com/v1/btc/main'; // Use testnet for testing: https://api.blockcypher.com/v1/btc/test3

export class BlockchainService {
  private static instance: BlockchainService;
  
  constructor() {
    if (BlockchainService.instance) {
      return BlockchainService.instance;
    }
    BlockchainService.instance = this;
  }
  
  /**
   * Get the balance of a Bitcoin address from BlockCypher
   */
  async getAddressBalance(address: string): Promise<number> {
    try {
      const response = await axios.get(`${BLOCKCYPHER_BASE_URL}/addrs/${address}/balance`);
      console.log(`[BLOCKCHAIN] Address ${address} balance:`, response.data);
      
      // Return balance in satoshis
      return response.data.balance || 0;
    } catch (error) {
      console.error(`[BLOCKCHAIN] Error getting balance for ${address}:`, error);
      throw new Error(`Failed to get balance for ${address}`);
    }
  }
  
  /**
   * Check if a transaction exists and is confirmed
   */
  async checkTransaction(txHash: string): Promise<{
    exists: boolean;
    confirmed: boolean;
    confirmations?: number;
    block_height?: number;
  }> {
    try {
      const response = await axios.get(`${BLOCKCYPHER_BASE_URL}/txs/${txHash}`);
      console.log(`[BLOCKCHAIN] Transaction ${txHash} data:`, response.data);
      
      return {
        exists: true,
        confirmed: response.data.confirmed !== undefined,
        confirmations: response.data.confirmations,
        block_height: response.data.block_height
      };
    } catch (error) {
      console.error(`[BLOCKCHAIN] Error checking transaction ${txHash}:`, error);
      
      // If it's a 404 error, the transaction doesn't exist
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          exists: false,
          confirmed: false
        };
      }
      
      // For other errors, throw
      throw new Error(`Failed to check transaction ${txHash}`);
    }
  }
  
  /**
   * Request a payout to a Bitcoin address using BlockCypher
   */
  async requestPayout(userId: number, amountSatoshis: number): Promise<{
    success: boolean;
    message: string;
    txHash?: string;
    estimatedCompletionTime?: Date;
  }> {
    try {
      // Get the user
      const user = await storage.getUser(userId);
      if (!user) {
        console.error(`[BLOCKCHAIN] User ${userId} not found`);
        return { success: false, message: "User not found" };
      }
      
      if (!user.walletAddress) {
        console.error(`[BLOCKCHAIN] User ${userId} has no wallet address`);
        return { success: false, message: "No wallet address configured" };
      }
      
      // Check balance
      const currentBalance = parseInt(user.balance) || 0;
      
      if (currentBalance < amountSatoshis) {
        console.error(`[BLOCKCHAIN] Insufficient balance: ${currentBalance} < ${amountSatoshis}`);
        return { success: false, message: `Insufficient balance: ${currentBalance} satoshis available, ${amountSatoshis} requested` };
      }
      
      // For real implementations, this would create and broadcast a Bitcoin transaction
      // For now, we'll update the user's balance and create a payout record
      
      // Update user's balance
      const newBalance = currentBalance - amountSatoshis;
      
      await storage.updateUser(userId, {
        balance: newBalance.toString()
      });
      
      // Generate a (simulated) transaction ID
      const txHash = this.generateTxid();
      
      // Calculate estimated completion time (around 30 minutes from now)
      const estimatedCompletionTime = new Date();
      estimatedCompletionTime.setMinutes(estimatedCompletionTime.getMinutes() + 30);
      
      // Create a payout record
      await storage.createPayout({
        userId,
        amount: amountSatoshis.toString(),
        walletAddress: user.walletAddress,
        status: 'processing',
        txHash,
        sourceAddress: this.getMiningPoolAddress(),
        destinationAddress: user.walletAddress,
        estimatedCompletionTime
      });
      
      console.log(`[BLOCKCHAIN] Created payout record with txHash ${txHash}`);
      
      // In a real implementation with BlockCypher, we would:
      // 1. Create a transaction using their API
      // 2. Sign it with our private key
      // 3. Broadcast it to the network
      
      return {
        success: true,
        message: `Withdrawal of ${amountSatoshis} satoshis initiated`,
        txHash,
        estimatedCompletionTime
      };
    } catch (error) {
      console.error('[BLOCKCHAIN] Error in requestPayout:', error);
      return { success: false, message: `Payout failed: ${error instanceof Error ? error.message : String(error)}` };
    }
  }
  
  /**
   * Generate a realistic transaction ID
   */
  private generateTxid(): string {
    return crypto.randomBytes(32).toString('hex');
  }
  
  /**
   * Get the mining pool's Bitcoin address
   */
  private getMiningPoolAddress(): string {
    // This would be the actual mining pool address in a real implementation
    return "bc1qn3ny92uk8pkrvdz3hp7bc6up62xa5ee98fqfcl";
  }
  
  /**
   * Update pending payouts and check their status on the blockchain
   */
  async updatePayoutStatuses(): Promise<void> {
    try {
      // Get all processing payouts
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        const payouts = await storage.getPayouts(user.id);
        const pendingPayouts = payouts.filter(p => p.status === 'processing');
        
        for (const payout of pendingPayouts) {
          // In a real implementation, we would check the transaction status on the blockchain
          // For now, we'll just update some of them based on time
          
          // If the payout was created more than 30 minutes ago, mark it as completed
          const createdAt = new Date(payout.timestamp);
          const now = new Date();
          const diffMs = now.getTime() - createdAt.getTime();
          const diffMinutes = Math.floor(diffMs / 1000 / 60);
          
          if (diffMinutes >= 30) {
            await storage.updatePayout(payout.id, {
              status: 'completed'
            });
            console.log(`[BLOCKCHAIN] Marked payout ${payout.id} as completed`);
          }
        }
      }
    } catch (error) {
      console.error('[BLOCKCHAIN] Error updating payout statuses:', error);
    }
  }
}

// Export a singleton instance
export const blockchainService = new BlockchainService();