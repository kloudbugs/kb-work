import CoinbasePro from 'coinbase-pro';
import { storage } from './storage';
import { User } from '@shared/schema';

export class CoinbaseService {
  private coinbase: any;
  
  constructor() {
    // Initialize Coinbase Pro client with environment variables
    if (process.env.COINBASE_API_KEY && process.env.COINBASE_API_SECRET && process.env.COINBASE_PASSPHRASE) {
      this.coinbase = new CoinbasePro.AuthenticatedClient(
        process.env.COINBASE_API_KEY,
        process.env.COINBASE_API_SECRET,
        process.env.COINBASE_PASSPHRASE,
        'https://api.pro.coinbase.com' // Use production API
      );
    }
  }

  async processAutomaticBTCPayout(user: User, amount: number): Promise<string | null> {
    if (!this.coinbase || !user.walletAddress) {
      console.log('Coinbase API not configured or no BTC wallet address');
      return null;
    }

    try {
      // Execute real BTC withdrawal to user's wallet
      const withdrawal = await this.coinbase.withdraw({
        amount: amount.toString(),
        currency: 'BTC',
        crypto_address: user.walletAddress
      });

      // Log the real transaction
      await storage.createAutomaticPayout({
        amount,
        address: user.walletAddress,
        status: 'processing',
        transactionId: withdrawal.id,
        userId: user.id
      });

      await storage.createActivityLog({
        message: `Real BTC payout initiated: ${amount.toFixed(8)} BTC to ${user.walletAddress}`,
        status: 'success',
        userId: user.id
      });

      return withdrawal.id;
    } catch (error) {
      console.error('BTC payout failed:', error);
      
      await storage.createActivityLog({
        message: `BTC payout failed: ${error.message}`,
        status: 'error',
        userId: user.id
      });
      
      return null;
    }
  }

  async processAutomaticETHPayout(user: User, amount: number): Promise<string | null> {
    if (!this.coinbase || !user.ethAddress) {
      console.log('Coinbase API not configured or no ETH wallet address');
      return null;
    }

    try {
      // Execute real ETH withdrawal to user's wallet
      const withdrawal = await this.coinbase.withdraw({
        amount: amount.toString(),
        currency: 'ETH',
        crypto_address: user.ethAddress
      });

      // Log the real transaction
      await storage.createAutomaticPayout({
        amount,
        address: user.ethAddress,
        status: 'processing',
        transactionId: withdrawal.id,
        userId: user.id
      });

      await storage.createActivityLog({
        message: `Real ETH payout initiated: ${amount.toFixed(6)} ETH to ${user.ethAddress}`,
        status: 'success',
        userId: user.id
      });

      return withdrawal.id;
    } catch (error) {
      console.error('ETH payout failed:', error);
      
      await storage.createActivityLog({
        message: `ETH payout failed: ${error.message}`,
        status: 'error',
        userId: user.id
      });
      
      return null;
    }
  }

  async checkPayoutStatus(transactionId: string): Promise<string> {
    if (!this.coinbase) return 'unknown';

    try {
      const withdrawal = await this.coinbase.getWithdrawal(transactionId);
      return withdrawal.status; // 'pending', 'processing', 'completed', 'failed'
    } catch (error) {
      console.error('Error checking payout status:', error);
      return 'unknown';
    }
  }

  async getCurrentBTCPrice(): Promise<number> {
    try {
      const ticker = await this.coinbase.getProductTicker('BTC-USD');
      return parseFloat(ticker.price);
    } catch (error) {
      console.error('Error getting BTC price:', error);
      return 45000; // Fallback price
    }
  }

  async getCurrentETHPrice(): Promise<number> {
    try {
      const ticker = await this.coinbase.getProductTicker('ETH-USD');
      return parseFloat(ticker.price);
    } catch (error) {
      console.error('Error getting ETH price:', error);
      return 3000; // Fallback price
    }
  }
}

export const coinbaseService = new CoinbaseService();