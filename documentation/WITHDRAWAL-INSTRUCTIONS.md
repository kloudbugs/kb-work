# Bitcoin Withdrawal Management Guide

This guide explains how to check, manage, and troubleshoot Bitcoin withdrawals in your mining platform.

## Checking Pending Withdrawals

### Method 1: Using the API

The system has an API endpoint that returns all pending withdrawals:

```bash
# Get all pending withdrawals
curl http://localhost:5000/api/payouts/pending

# Get pending withdrawals for a specific user
curl http://localhost:5000/api/payouts/pending?userId=1
```

### Method 2: Using the Database

You can check the database directly for pending withdrawals:

```typescript
// Get all pending withdrawals
const pendingWithdrawals = await storage.getPayoutsByStatus('pending');
console.log(`There are ${pendingWithdrawals.length} pending withdrawals`);

// Get pending withdrawals for a specific user
const userPayouts = await storage.getPayouts(userId);
const userPendingWithdrawals = userPayouts.filter(payout => 
  payout.status === 'pending' || payout.status === 'processing'
);
console.log(`User ${userId} has ${userPendingWithdrawals.length} pending withdrawals`);
```

## Speeding Up Withdrawals

Sometimes withdrawals might get stuck due to network congestion. You can speed them up using the API:

```bash
# Speed up all pending withdrawals
curl -X POST http://localhost:5000/api/payouts/speed-up

# Speed up withdrawals for a specific user
curl -X POST http://localhost:5000/api/payouts/speed-up?userId=1
```

## Manually Completing a Withdrawal

If you know a transaction has gone through but it's still showing as pending in your system:

```bash
# Mark a specific withdrawal as completed
curl -X POST http://localhost:5000/api/payouts/123/complete
```

## Troubleshooting Withdrawals

### 1. Check Transaction Status on the Blockchain

You can verify if a transaction exists on the blockchain:

```typescript
import { isTransactionConfirmed } from './server/lib/bitcoinBlockchairService';

async function checkTransaction(txHash) {
  const status = await isTransactionConfirmed(txHash);
  console.log(`Transaction status: ${JSON.stringify(status)}`);
  
  if (status.confirmed) {
    console.log(`Transaction is confirmed with ${status.confirmations} confirmations`);
  } else if (!status.exists) {
    console.log(`Transaction does not exist on the blockchain`);
  } else {
    console.log(`Transaction exists but not yet confirmed (${status.confirmations} confirmations)`);
  }
}
```

### 2. Return Funds from Failed Withdrawals

If a withdrawal fails, you might need to return the funds to the user:

```typescript
async function returnFundsToUser(userId, amount) {
  const user = await storage.getUser(userId);
  
  // Parse balance and amount
  const currentBalance = parseInt(user.balance || "0");
  const refundAmount = parseInt(amount);
  
  // Update user balance
  await storage.updateUser(userId, {
    balance: (currentBalance + refundAmount).toString()
  });
  
  console.log(`Returned ${refundAmount} satoshis to user ${userId}`);
}
```

## Common Withdrawal Issues

1. **Transaction not broadcasting**: Check if the transaction was properly signed and broadcast to the network.
2. **Low fees**: Transactions with low fees might get stuck. Consider using the speed-up function.
3. **Invalid destination address**: Ensure the withdrawal address is valid for the Bitcoin network.
4. **Network congestion**: During high network activity, transactions may take longer to confirm.

## Viewing Withdrawal Logs

The platform logs all withdrawal activities. You can view them in the server logs:

```bash
# View all withdrawal-related logs
grep "\[WITHDRAWAL\]" server.log

# View all logs for a specific transaction
grep "tx_hash_here" server.log
```

## Important Code Locations

- `server/lib/pendingWithdrawalProcessor.ts` - Main service that processes pending withdrawals
- `server/lib/bitcoinBlockchairService.ts` - Service for checking transaction status on the blockchain
- `server/routes.ts` - Contains API endpoints for managing withdrawals (around line 2150-2250)
- `shared/schema.ts` - Database schema definitions including the payout schema (for withdrawals)

Remember that all withdrawals are routed through the admin wallet address (`bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps`) for security reasons.