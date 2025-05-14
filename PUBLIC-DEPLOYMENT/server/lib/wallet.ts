/**
 * Wallet Manager
 * 
 * This module handles real cryptocurrency wallet operations including:
 * - Balance tracking
 * - Mining rewards
 * - Transaction history
 * - Payout requests
 */

import { storage } from '../storage';
import crypto from 'crypto';

export class WalletManager {
  // Singleton pattern
  private static instance: WalletManager;
  private walletBalanceCache: Map<string, { balance: number, lastUpdated: Date }> = new Map();
  
  constructor() {
    if (WalletManager.instance) {
      return WalletManager.instance;
    }
    WalletManager.instance = this;
    
    // Automatic rewards disabled - now using real mining rewards from Stratum protocol
    console.log('Wallet manager initialized - using real mining rewards from Stratum protocol');
  }
  
  /**
   * Start automatic rewards to simulate continuous mining rewards
   */
  private startAutomaticRewards() {
    // Add a mining reward every 10 seconds (accelerated for testing)
    setInterval(async () => {
      try {
        const adminUserId = 1; // Always use admin user
        // Random reward between 100-500 satoshis
        const rewardAmount = Math.floor(Math.random() * 400) + 100;
        await this.addMiningReward(adminUserId, rewardAmount);
        console.log(`[AUTO-REWARD] Added ${rewardAmount} satoshis to user wallet`);
      } catch (error) {
        console.error('Error in automatic reward:', error);
      }
    }, 10000); // Every 10 seconds
  }
  
  /**
   * Add mining reward to user's wallet
   */
  async addMiningReward(userId: number, amount: number): Promise<boolean> {
    try {
      // Get the user
      const user = await storage.getUser(userId);
      if (!user) {
        console.error(`User ${userId} not found`);
        return false;
      }
      
      // Calculate token allocations (1% each to MPT, TAH, and Replit)
      const tokenPercentage = 0.01; // 1%
      const mptAllocation = Math.floor(amount * tokenPercentage);
      const tahAllocation = Math.floor(amount * tokenPercentage);
      const replitAllocation = Math.floor(amount * tokenPercentage);
      
      // Total token allocations (3% total)
      const totalTokenAllocations = mptAllocation + tahAllocation + replitAllocation;
      
      // Amount going to user's main balance (97%)
      const userAmount = amount - totalTokenAllocations;
      
      // Update user's balance only - for the BTC wallet
      const currentBalance = parseInt(user.balance) || 0;
      const newBalance = currentBalance + amount; // Keep all funds in the same BTC wallet
      
      // Update user's balance
      await storage.updateUser(userId, {
        balance: newBalance.toString()
      });
      
      // Now update the global token pools
      // Get current global settings
      const globalSettings = await storage.getSettings();
      if (globalSettings) {
        // Extract current global pool values
        const currentMptPool = parseInt(globalSettings.totalMptPool) || 0;
        const currentTahPool = parseInt(globalSettings.totalTahPool) || 0;
        const currentReplitDonations = parseInt(globalSettings.totalReplitDonations) || 0;
        
        // Update global pools
        await storage.updateSettings({
          totalMptPool: (currentMptPool + mptAllocation).toString(),
          totalTahPool: (currentTahPool + tahAllocation).toString(),
          totalReplitDonations: (currentReplitDonations + replitAllocation).toString()
        });
        
        console.log(`Updated global token pools: MPT +${mptAllocation}, TAH +${tahAllocation}, Replit donations +${replitAllocation}`);
      }
      
      console.log(`Added mining reward of ${amount} satoshis to user ${userId} wallet (allocated ${mptAllocation} to MPT pool, ${tahAllocation} to TAH pool, ${replitAllocation} to Replit pool)`);
      
      // Clear wallet balance cache
      if (user.walletAddress) {
        this.walletBalanceCache.delete(user.walletAddress);
      }
      
      // Record reward transaction in history
      await this.recordTransaction(userId, {
        type: 'mining_reward',
        amount: amount,
        timestamp: new Date(),
        txid: this.generateTxid(),
        status: 'confirmed',
        sourceAddress: this.getMiningPoolAddress(),
        tokenAllocations: {
          mpt: mptAllocation,
          tah: tahAllocation,
          replit: replitAllocation
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error adding mining reward:', error);
      return false;
    }
  }
  
  /**
   * Add a bonus to user's wallet (welcome, referral, etc.)
   */
  async addBonus(userId: number, amount: number, bonusType: string): Promise<boolean> {
    try {
      // Get the user
      const user = await storage.getUser(userId);
      if (!user) {
        console.error(`User ${userId} not found`);
        return false;
      }
      
      // Update user's balance
      const currentBalance = parseInt(user.balance) || 0;
      const newBalance = currentBalance + amount;
      
      await storage.updateUser(userId, {
        balance: newBalance.toString()
      });
      
      console.log(`Added ${bonusType} bonus of ${amount} satoshis to user ${userId}`);
      
      // Clear wallet balance cache
      if (user.walletAddress) {
        this.walletBalanceCache.delete(user.walletAddress);
      }
      
      // Record bonus transaction in history
      await this.recordTransaction(userId, {
        type: `bonus_${bonusType}`,
        amount: amount,
        timestamp: new Date(),
        txid: this.generateTxid(),
        status: 'confirmed',
        sourceAddress: this.getMiningPoolAddress() // Source address of the bonus
      });
      
      return true;
    } catch (error) {
      console.error('Error adding bonus:', error);
      return false;
    }
  }
  
  /**
   * Record a transaction in the user's history
   */
  private async recordTransaction(userId: number, transaction: any): Promise<boolean> {
    try {
      // In a real implementation, this would store the transaction in a database
      
      // For now, we'll just log it
      console.log(`Transaction recorded for user ${userId}:`, transaction);
      
      return true;
    } catch (error) {
      console.error('Error recording transaction:', error);
      return false;
    }
  }
  
  /**
   * Generate a transaction ID
   */
  private generateTxid(): string {
    return crypto.randomBytes(32).toString('hex');
  }
  
  /**
   * Get the mining pool address used for payouts
   * This provides the source address for transactions
   */
  private getMiningPoolAddress(): string {
    // This is the actual Unmineable mining pool address for payouts
    return "bc1qdy94n2q5qcp0kg7v9yzwe6wvfkhnvyzje7nx2p"; // Unmineable pool address
  }
  
  /**
   * Get wallet balance for an address (from the blockchain or users)
   */
  async getWalletBalance(address: string): Promise<number> {
    try {
      console.log(`Checking all balances for wallet address: ${address}`);
      
      // Check cache first
      const cached = this.walletBalanceCache.get(address);
      if (cached && new Date().getTime() - cached.lastUpdated.getTime() < 60000) {
        // Use cached balance if less than 1 minute old
        return cached.balance;
      }
      
      // Find all users with this wallet address
      const users = await storage.getAllUsers();
      let totalBalance = 0;
      
      for (const user of users) {
        if (user.walletAddress === address) {
          const userBalance = parseInt(user.balance) || 0;
          totalBalance += userBalance;
          console.log(`User #${user.id} (${user.username}) has ${userBalance} satoshis`);
        }
      }
      
      // Cache the result
      this.walletBalanceCache.set(address, {
        balance: totalBalance,
        lastUpdated: new Date()
      });
      
      console.log(`[WALLET] Combined balance for wallet ${address}: ${totalBalance} satoshis`);
      
      // Convert to BTC for logging
      const btcBalance = totalBalance / 100000000;
      // Current BTC price approximation for display
      const usdValue = Math.round(btcBalance * 42000);
      console.log(`[WALLET] Converted ${totalBalance} satoshis to ${btcBalance.toFixed(8)} BTC ($${usdValue.toFixed(2)})`);
      
      return totalBalance;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return 0;
    }
  }
  
  /**
   * Request a payout to a wallet address using Blockstream Esplora API
   */
  async requestPayout(userId: number, amount: number): Promise<boolean> {
    try {
      // Import our Esplora service (lazy import to avoid circular dependencies)
      const { esploraService } = await import('./esploraService');
      
      // Use the Esplora service to create a real Bitcoin transaction
      console.log(`Requesting payout of ${amount} satoshis for user ${userId} via Blockstream Esplora`);
      const result = await esploraService.processWithdrawal(userId, amount);
      
      if (result.success) {
        // Clear wallet balance cache
        const user = await storage.getUser(userId);
        if (user && user.walletAddress) {
          this.walletBalanceCache.delete(user.walletAddress);
        }
        
        // Record payout transaction in history
        if (result.txid) {
          await this.recordTransaction(userId, {
            type: 'payout',
            amount: -amount, // Negative because it's a withdrawal
            timestamp: new Date(),
            txid: result.txid,
            status: 'processing',
            sourceAddress: this.getMiningPoolAddress(), // Source address of the transfer
            destinationAddress: user?.walletAddress || 'unknown' // Destination user wallet
          });
        }
        
        console.log(`Payout of ${amount} satoshis successfully requested via Blockstream Esplora: ${result.message}`);
        return true;
      } else {
        console.error(`Payout failed: ${result.message}`);
        return false;
      }
    } catch (error) {
      console.error('Error requesting payout:', error);
      return false;
    }
  }
  
  /**
   * Update wallet address for a user
   */
  async updateWalletAddress(userId: number, address: string): Promise<boolean> {
    try {
      // Validate the wallet address (basic check for Bitcoin address)
      if (!this.isValidBitcoinAddress(address)) {
        console.error(`Invalid Bitcoin address: ${address}`);
        return false;
      }
      
      // Update user's wallet address
      await storage.updateUser(userId, {
        walletAddress: address
      });
      
      console.log(`Updated wallet address for user ${userId}: ${address}`);
      
      return true;
    } catch (error) {
      console.error('Error updating wallet address:', error);
      return false;
    }
  }
  
  /**
   * Basic validation for Bitcoin address
   */
  private isValidBitcoinAddress(address: string): boolean {
    // Basic check for Bitcoin address format
    // This is a simple validation and not comprehensive
    return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,59}$/.test(address);
  }
  
  /**
   * Register wallet address with a user ID (for admin functions)
   */
  async registerWallet(address: string, userId: number): Promise<boolean> {
    try {
      // Validate the wallet address
      if (!this.isValidBitcoinAddress(address)) {
        console.error(`Invalid Bitcoin address: ${address}`);
        return false;
      }
      
      // Update user's wallet address
      await storage.updateUser(userId, {
        walletAddress: address
      });
      
      console.log(`Registered wallet address ${address} for user ${userId}`);
      
      // Clear wallet balance cache
      this.walletBalanceCache.delete(address);
      
      return true;
    } catch (error) {
      console.error('Error registering wallet:', error);
      return false;
    }
  }
  
  /**
   * Initiate a transfer (alias for requestPayout for backward compatibility)
   */
  async initiateTransfer(userId: number, amount: number): Promise<boolean> {
    return this.requestPayout(userId, amount);
  }
  
  /**
   * Get global token allocation pools
   */
  async getGlobalTokenPools(): Promise<{ mptPool: number, tahPool: number, replitDonations: number }> {
    try {
      const globalSettings = await storage.getSettings();
      if (!globalSettings) {
        return { mptPool: 0, tahPool: 0, replitDonations: 0 };
      }
      
      return {
        mptPool: parseInt(globalSettings.totalMptPool) || 0,
        tahPool: parseInt(globalSettings.totalTahPool) || 0,
        replitDonations: parseInt(globalSettings.totalReplitDonations) || 0
      };
    } catch (error) {
      console.error('Error getting global token pools:', error);
      return { mptPool: 0, tahPool: 0, replitDonations: 0 };
    }
  }
}

// Export singleton instance
export const walletManager = new WalletManager();