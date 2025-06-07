import { storage } from './storage';
import { coinbaseService } from './coinbase-service';

export class PayoutManager {
  private static instance: PayoutManager;
  private payoutInterval: NodeJS.Timeout | null = null;

  static getInstance(): PayoutManager {
    if (!PayoutManager.instance) {
      PayoutManager.instance = new PayoutManager();
    }
    return PayoutManager.instance;
  }

  async startAutomaticPayouts() {
    // Check for automatic payouts every 30 seconds
    this.payoutInterval = setInterval(async () => {
      await this.processPayouts();
    }, 30000);

    console.log('✓ Automatic payout system started - checking every 30 seconds');
  }

  async processPayouts() {
    try {
      // Extract all users with wallet addresses from database
      const users = await this.getAllUsersWithWallets();
      
      for (const user of users) {
        await this.checkAndProcessUserPayouts(user);
      }
    } catch (error) {
      console.error('Error processing automatic payouts:', error);
    }
  }

  private async getAllUsersWithWallets() {
    // This would be a new method to extract users with BTC/ETH addresses
    const demoUser = await storage.getUserByUsername('demo');
    return demoUser ? [demoUser] : [];
  }

  private async checkAndProcessUserPayouts(user: any) {
    // Process BTC automatic payout
    if (user.walletAddress && user.balance >= (user.withdrawalThreshold || 0.001)) {
      console.log(`🚀 Processing automatic BTC payout for user ${user.username}`);
      console.log(`📍 BTC Address: ${user.walletAddress}`);
      console.log(`💰 Amount: ${user.balance.toFixed(8)} BTC`);
      
      const transactionId = await coinbaseService.processAutomaticBTCPayout(user, user.balance);
      
      if (transactionId) {
        // Reset balance after successful payout
        await storage.updateUser(user.id, { balance: 0 });
        
        console.log(`✅ BTC payout initiated - Transaction ID: ${transactionId}`);
        
        await storage.createActivityLog({
          message: `Automatic BTC payout: ${user.balance.toFixed(8)} BTC → ${user.walletAddress}`,
          status: 'success',
          userId: user.id
        });
      }
    }

    // Process ETH automatic payout
    if (user.ethAddress && user.ethBalance >= (user.payoutThreshold || 0.1)) {
      console.log(`🚀 Processing automatic ETH payout for user ${user.username}`);
      console.log(`📍 ETH Address: ${user.ethAddress}`);
      console.log(`💰 Amount: ${user.ethBalance.toFixed(6)} ETH`);
      
      const transactionId = await coinbaseService.processAutomaticETHPayout(user, user.ethBalance);
      
      if (transactionId) {
        // Reset ETH balance after successful payout
        await storage.updateUser(user.id, { ethBalance: 0 });
        
        console.log(`✅ ETH payout initiated - Transaction ID: ${transactionId}`);
        
        await storage.createActivityLog({
          message: `Automatic ETH payout: ${user.ethBalance.toFixed(6)} ETH → ${user.ethAddress}`,
          status: 'success',
          userId: user.id
        });
      }
    }
  }

  stopAutomaticPayouts() {
    if (this.payoutInterval) {
      clearInterval(this.payoutInterval);
      this.payoutInterval = null;
      console.log('⏹️ Automatic payout system stopped');
    }
  }
}

export const payoutManager = PayoutManager.getInstance();