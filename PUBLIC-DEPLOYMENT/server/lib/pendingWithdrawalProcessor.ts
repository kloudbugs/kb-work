/**
 * Pending Withdrawal Processor
 * 
 * This service automatically processes pending withdrawals by:
 * 1. Finding all pending withdrawal records
 * 2. Checking transaction status on the blockchain
 * 3. Updating status to completed/failed based on confirmation status
 */

import { storage } from '../storage';
import { isTransactionConfirmed } from './bitcoinBlockchairService';

/**
 * Update status of all pending transactions
 */
export async function processPendingWithdrawals(): Promise<void> {
  try {
    // Get all pending payouts
    const payouts = await storage.getPayoutsByStatus('pending');
    
    console.log(`[WITHDRAWAL] Processing ${payouts.length} pending transactions`);
    
    // For each pending payout, check its status and update accordingly
    for (const payout of payouts) {
      if (!payout.txHash) {
        console.log(`[WITHDRAWAL] Payout ${payout.id} has no transaction hash, marking as failed`);
        
        await storage.updatePayout(payout.id, {
          status: 'failed',
          failureReason: 'Missing transaction hash',
          completedAt: new Date()
        });
        
        // Return funds to user
        await returnFundsToUser(payout.userId, payout.amount);
        continue;
      }
      
      try {
        // Check transaction status on blockchain
        const txStatus = await isTransactionConfirmed(payout.txHash);
        
        if (txStatus.confirmed) {
          // Transaction is confirmed, mark as completed
          console.log(`[WITHDRAWAL] Transaction ${payout.txHash} confirmed with ${txStatus.confirmations} confirmations`);
          
          await storage.updatePayout(payout.id, {
            status: 'completed',
            completedAt: new Date()
          });
          
          console.log(`[WITHDRAWAL] Transaction ${payout.txHash} marked as completed`);
        } else if (txStatus.exists === false) {
          // Transaction does not exist on blockchain, likely rejected
          console.log(`[WITHDRAWAL] Transaction ${payout.txHash} not found on blockchain, marking as failed`);
          
          await storage.updatePayout(payout.id, {
            status: 'failed',
            failureReason: 'Transaction not found on blockchain',
            completedAt: new Date()
          });
          
          // Return funds to user
          await returnFundsToUser(payout.userId, payout.amount);
        } else {
          // Transaction exists but not yet confirmed, keep as pending
          console.log(`[WITHDRAWAL] Transaction ${payout.txHash} exists but not yet confirmed (${txStatus.confirmations} confirmations)`);
          
          // If transaction has been pending for more than 24 hours, mark it as failed
          const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          if (payout.timestamp && (new Date().getTime() - new Date(payout.timestamp).getTime() > oneDay)) {
            console.log(`[WITHDRAWAL] Transaction ${payout.txHash} has been pending for more than 24 hours, marking as failed`);
            
            await storage.updatePayout(payout.id, {
              status: 'failed',
              failureReason: 'Transaction stuck pending for more than 24 hours',
              completedAt: new Date()
            });
            
            // Return funds to user
            await returnFundsToUser(payout.userId, payout.amount);
          }
        }
      } catch (error: any) {
        console.error(`[WITHDRAWAL] Error checking transaction ${payout.txHash}:`, error.message || error);
      }
    }
    
    // Process withdrawals that are stuck in "processing" state for too long
    await processStuckWithdrawals();
  } catch (error: any) {
    console.error('[WITHDRAWAL] Error processing pending withdrawals:', error.message || error);
  }
}

/**
 * Handle withdrawals that got stuck in "processing" state
 */
async function processStuckWithdrawals(): Promise<void> {
  try {
    // Get all processing payouts
    const processingPayouts = await storage.getPayoutsByStatus('processing');
    
    console.log(`[WITHDRAWAL] Checking ${processingPayouts.length} processing transactions for stuck status`);
    
    for (const payout of processingPayouts) {
      // If payout has been processing for more than 3 hours, consider it stuck
      const threeHours = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
      if (payout.timestamp && (new Date().getTime() - new Date(payout.timestamp).getTime() > threeHours)) {
        console.log(`[WITHDRAWAL] Transaction ${payout.id} has been processing for more than 3 hours, marking as failed`);
        
        await storage.updatePayout(payout.id, {
          status: 'failed',
          failureReason: 'Transaction stuck in processing state',
          completedAt: new Date()
        });
        
        // Return funds to user
        await returnFundsToUser(payout.userId, payout.amount);
      }
    }
  } catch (error: any) {
    console.error('[WITHDRAWAL] Error processing stuck withdrawals:', error.message || error);
  }
}

/**
 * Return funds to user when a withdrawal fails
 */
async function returnFundsToUser(userId: string | number, amount: string): Promise<void> {
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      console.error(`[WITHDRAWAL] Failed to return funds: User ${userId} not found`);
      return;
    }
    
    // Convert to numbers for addition
    const currentBalance = parseInt(user.balance || "0");
    const refundAmount = parseInt(amount);
    
    // Update user balance
    await storage.updateUser(userId, {
      balance: (currentBalance + refundAmount).toString()
    });
    
    console.log(`[WITHDRAWAL] Returned ${refundAmount} satoshis to user ${userId}`);
  } catch (error: any) {
    console.error(`[WITHDRAWAL] Error returning funds to user ${userId}:`, error.message || error);
  }
}

/**
 * Manually mark a transaction as completed (for admin use)
 */
export async function manuallyCompleteWithdrawal(payoutId: string | number): Promise<boolean> {
  try {
    await storage.updatePayout(payoutId, {
      status: 'completed',
      completedAt: new Date(),
      notes: 'Manually marked as completed by admin'
    });
    
    console.log(`[WITHDRAWAL] Payout ${payoutId} manually marked as completed`);
    return true;
  } catch (error: any) {
    console.error(`[WITHDRAWAL] Error manually completing payout ${payoutId}:`, error.message || error);
    return false;
  }
}

/**
 * Speed up all pending withdrawals (mark as completed)
 * This is a special function used for testing or when we know transactions will go through
 */
export async function speedUpAllWithdrawals(userId?: string | number): Promise<number> {
  try {
    let payouts;
    
    if (userId) {
      // Get pending payouts for specific user
      payouts = await storage.getPayouts(userId);
      payouts = payouts.filter(p => p.status === 'pending' || p.status === 'processing');
    } else {
      // Get all pending payouts
      const pendingPayouts = await storage.getPayoutsByStatus('pending');
      const processingPayouts = await storage.getPayoutsByStatus('processing');
      payouts = [...pendingPayouts, ...processingPayouts];
    }
    
    console.log(`[WITHDRAWAL] Speeding up ${payouts.length} withdrawals${userId ? ` for user ${userId}` : ''}`);
    
    let completedCount = 0;
    
    // Mark each payout as completed
    for (const payout of payouts) {
      await storage.updatePayout(payout.id, {
        status: 'completed',
        completedAt: new Date(),
        notes: 'Manually sped up by system'
      });
      
      completedCount++;
    }
    
    console.log(`[WITHDRAWAL] Successfully completed ${completedCount} withdrawals`);
    return completedCount;
  } catch (error: any) {
    console.error(`[WITHDRAWAL] Error speeding up withdrawals:`, error.message || error);
    return 0;
  }
}

// Start automatic processing on module import
setTimeout(() => {
  console.log('[WITHDRAWAL] Starting automatic withdrawal processor');
  
  // Process pending withdrawals every 5 minutes
  setInterval(processPendingWithdrawals, 5 * 60 * 1000);
  
  // Process immediately on startup
  processPendingWithdrawals();
}, 10000); // Delay by 10 seconds to let the server start up properly