import axios from 'axios';
// Import console logger instead of custom logger
import { BitcoinTransactionService } from './bitcoinTransactionService';
import { HardwareWalletEnforcer } from './hardwareWalletEnforcer';

// Singleton instance
let serviceInstance: RealWithdrawalService | null = null;

interface WithdrawalRequest {
  userId: string;
  amount: number;
  destination: string;
  transferType: 'mining_reward' | 'token_liquidity' | 'nft_transfer';
  notes: string;
}

interface WithdrawalResult {
  success: boolean;
  txid?: string;
  status?: string;
  error?: string;
  details?: any;
  txDetails?: any;
}

/**
 * Service for handling real Bitcoin withdrawals
 * This service interfaces with actual Bitcoin nodes for transaction creation and broadcasting
 */
// Service instance to be used by the application
let withdrawalServiceInstance: RealWithdrawalService | null = null;

// Function to initialize the real withdrawal service
export function initializeRealWithdrawalService(): RealWithdrawalService {
  if (!withdrawalServiceInstance) {
    withdrawalServiceInstance = new RealWithdrawalService();
  }
  return withdrawalServiceInstance;
}

// Function to process a withdrawal directly
export function processWithdrawal(request: WithdrawalRequest): Promise<WithdrawalResult> {
  if (!withdrawalServiceInstance) {
    withdrawalServiceInstance = new RealWithdrawalService();
  }
  return withdrawalServiceInstance.processRealWithdrawal(request);
}

// Function to enable Ledger wallet hardware enforcement mode
export function enableLedgerMode(enabled: boolean): void {
  if (!withdrawalServiceInstance) {
    withdrawalServiceInstance = new RealWithdrawalService();
  }
  withdrawalServiceInstance.hardwareWalletEnforcer.enableLedgerMode(enabled);
}

export class RealWithdrawalService {
  private bitcoinTransactionService: BitcoinTransactionService;
  private hardwareWalletEnforcer: HardwareWalletEnforcer;
  private pendingTransactions: Map<string, WithdrawalResult>;
  
  constructor() {
    this.bitcoinTransactionService = new BitcoinTransactionService();
    this.hardwareWalletEnforcer = new HardwareWalletEnforcer();
    this.pendingTransactions = new Map();
    
    console.log('[WITHDRAWAL] Initializing real withdrawal service');
    setInterval(() => this.checkPendingTransactions(), 60000); // Check every minute
    console.log('[WITHDRAWAL] Real withdrawal service initialized');
  }
  
  /**
   * Process a real Bitcoin withdrawal
   */
  async processRealWithdrawal(request: WithdrawalRequest): Promise<WithdrawalResult> {
    try {
      console.log(`[WITHDRAWAL] Processing real withdrawal of ${request.amount} satoshis to ${request.destination}`);
      
      // Verify destination is a valid Bitcoin address
      if (!this.isValidBitcoinAddress(request.destination)) {
        return {
          success: false,
          error: 'Invalid Bitcoin destination address',
          details: { address: request.destination }
        };
      }
      
      // For admin wallets, enforce hardware wallet destination
      if (request.userId === '1') { // Admin user
        if (!this.hardwareWalletEnforcer.isHardwareWalletAddress(request.destination)) {
          return {
            success: false,
            error: 'Admin withdrawals must go to verified hardware wallet addresses',
            details: {
              provided: request.destination,
              required: 'Hardware wallet address'
            }
          };
        }
      }
      
      // Prepare transaction data based on transfer type
      const txData = this.prepareTransactionData(request);
      
      // Create and sign the Bitcoin transaction
      const signedTx = await this.bitcoinTransactionService.createSignedTransaction(txData);
      
      if (!signedTx.success) {
        return {
          success: false,
          error: 'Failed to create signed transaction',
          details: signedTx.error
        };
      }
      
      // Broadcast the transaction to the Bitcoin network
      const broadcastResult = await this.broadcastTransaction(signedTx.txHex!);
      
      if (!broadcastResult.success) {
        return {
          success: false,
          error: 'Failed to broadcast transaction',
          details: broadcastResult.error
        };
      }
      
      // Store the transaction result
      const result: WithdrawalResult = {
        success: true,
        txid: broadcastResult.txid,
        status: 'pending',
        txDetails: {
          txid: broadcastResult.txid,
          amount: request.amount,
          destination: request.destination,
          fee: signedTx.fee,
          transferType: request.transferType,
          timestamp: new Date().toISOString()
        }
      };
      
      this.pendingTransactions.set(broadcastResult.txid!, result);
      
      return result;
    } catch (error: any) {
      console.error('Error in processRealWithdrawal:', error);
      return {
        success: false,
        error: error.message || 'Unknown error in withdrawal processing',
        details: error.stack
      };
    }
  }
  
  /**
   * Check the status of a Bitcoin transaction
   */
  async checkTransactionStatus(txid: string): Promise<any> {
    try {
      // Check if we have this transaction in our pending map
      if (this.pendingTransactions.has(txid)) {
        return this.pendingTransactions.get(txid);
      }
      
      // Otherwise, check the blockchain
      const status = await this.bitcoinTransactionService.getTransactionStatus(txid);
      return status;
    } catch (error: any) {
      console.error('Error checking transaction status:', error);
      return {
        success: false,
        error: 'Failed to check transaction status',
        details: error.message
      };
    }
  }
  
  /**
   * Periodically check pending transactions for status updates
   */
  private async checkPendingTransactions() {
    console.debug('[WITHDRAWAL] Checking pending transactions for status updates');
    
    for (const [txid, tx] of this.pendingTransactions.entries()) {
      if (tx.status === 'confirmed' || tx.status === 'failed') {
        continue; // Skip already confirmed or failed transactions
      }
      
      try {
        const status = await this.bitcoinTransactionService.getTransactionStatus(txid);
        
        if (status.confirmations && status.confirmations >= 1) {
          tx.status = 'confirmed';
          console.info(`Transaction ${txid} is now confirmed with ${status.confirmations} confirmations`);
        }
        
        // If more than 6 hours have passed without confirmation, mark as potentially failed
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
        const txTime = new Date(tx.txDetails?.timestamp);
        
        if (tx.status === 'pending' && txTime < sixHoursAgo) {
          tx.status = 'stuck';
          console.warn(`Transaction ${txid} appears to be stuck in the mempool`);
        }
      } catch (error) {
        console.error(`Error updating status for transaction ${txid}:`, error);
      }
    }
  }
  
  /**
   * Validate Bitcoin address format
   */
  private isValidBitcoinAddress(address: string): boolean {
    // Regular expressions for different Bitcoin address formats
    const p2pkhRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/; // Legacy addresses start with 1 or 3
    const p2shRegex = /^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$/; // P2SH addresses start with 3
    const bech32Regex = /^(bc1)[a-z0-9]{8,87}$/; // Bech32 addresses start with bc1
    
    return p2pkhRegex.test(address) || p2shRegex.test(address) || bech32Regex.test(address);
  }
  
  /**
   * Prepare transaction data based on withdrawal request
   */
  private prepareTransactionData(request: WithdrawalRequest): any {
    const baseData = {
      amount: request.amount,
      destination: request.destination,
      transferType: request.transferType,
      feeRate: 'normal'  // Can be 'low', 'normal', 'high'
    };
    
    // Add specific data based on transfer type
    switch(request.transferType) {
      case 'mining_reward':
        return {
          ...baseData,
          source: 'mining_pool',
          poolId: 'admin_pool',
          memo: `Mining reward withdrawal - ${request.notes}`
        };
        
      case 'token_liquidity':
        return {
          ...baseData,
          tokenContract: '0xBitcoinToken',
          liquiditySource: 'platform_exchange',
          memo: `Token liquidity withdrawal - ${request.notes}`
        };
        
      case 'nft_transfer':
        return {
          ...baseData,
          nftId: 'platform_nft_001',
          collectionId: 'platform_collection',
          memo: `NFT transfer - ${request.notes}`
        };
        
      default:
        return baseData;
    }
  }
  
  /**
   * Broadcast a signed transaction to the Bitcoin network
   */
  private async broadcastTransaction(txHex: string): Promise<{ success: boolean; txid?: string; error?: string }> {
    try {
      // Attempt to broadcast via multiple services for redundancy
      const services = [
        { name: 'Blockstream', url: 'https://blockstream.info/api/tx' },
        { name: 'BlockCypher', url: 'https://api.blockcypher.com/v1/btc/main/txs/push' }
      ];
      
      // Development mode - simulate successful broadcast
      if (process.env.NODE_ENV !== 'production') {
        // Generate a realistic transaction ID (hash)
        const simulatedTxid = Array(64).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)).join('');
        
        console.info(`[DEV MODE] Simulating successful transaction broadcast with txid: ${simulatedTxid}`);
        
        return {
          success: true,
          txid: simulatedTxid
        };
      }
      
      // Production mode - try to broadcast via actual services
      for (const service of services) {
        try {
          let response;
          
          if (service.name === 'Blockstream') {
            response = await axios.post(service.url, txHex);
            return { success: true, txid: response.data };
          } else if (service.name === 'BlockCypher') {
            response = await axios.post(service.url, { tx: txHex });
            return { success: true, txid: response.data.tx.hash };
          }
        } catch (error) {
          console.warn(`Failed to broadcast via ${service.name}:`, error);
          // Continue to next service
        }
      }
      
      // All services failed
      return {
        success: false,
        error: 'Failed to broadcast transaction through any available service'
      };
    } catch (error: any) {
      console.error('Error in broadcastTransaction:', error);
      return {
        success: false,
        error: error.message || 'Unknown error broadcasting transaction'
      };
    }
  }
}