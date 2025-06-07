# BTCPay Server Setup Guide for Bitcoin Mining App

## Quick Setup Instructions

Your Bitcoin mining application is now ready for BTCPay Server integration! Follow these steps to enable real Bitcoin withdrawals:

### Step 1: Set Up BTCPay Server
1. Visit: https://btcpayserver.org/
2. Choose deployment option:
   - **Easiest**: Use hosted BTCPay (like btcpay.kukks.org)
   - **Self-hosted**: Deploy on your own server

### Step 2: Create Store
1. Login to your BTCPay Server
2. Create a new store
3. Configure Bitcoin wallet
4. Note your Store ID (found in store settings)

### Step 3: Generate API Key
1. Go to Account → Manage → API Keys
2. Create new API key with permissions:
   - `btcpay.store.canmodifyinvoices`
   - `btcpay.store.canviewinvoices`
3. Copy the API key (starts with letters/numbers)

### Step 4: Configure Environment Variables
Add these to your mining app environment:

```
BTCPAY_SERVER_URL=https://your-btcpay-server.com
BTCPAY_API_KEY=your_api_key_here
BTCPAY_STORE_ID=your_store_id_here
```

### Step 5: Test Real Bitcoin Withdrawals
1. Mine some Bitcoin in your app
2. Click "Withdraw Earnings" 
3. BTCPay Server will process real Bitcoin payment
4. Funds sent directly to your wallet: bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6

## Benefits of BTCPay Server
- ✅ No transaction fees
- ✅ Direct Bitcoin payments
- ✅ Full control over your funds
- ✅ Open source and secure
- ✅ Instant payment notifications

## Current Status
Your app will show simulated withdrawals until BTCPay Server is configured. Once set up, all withdrawals become real Bitcoin transactions!