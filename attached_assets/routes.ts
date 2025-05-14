import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import Stripe from "stripe";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required environment variable: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

// Subscription plan prices - stored as constants for easy reference
// These IDs need to be created in Stripe dashboard and replaced here
const SUBSCRIPTION_PRICES = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || "price_placeholder_monthly", // $49.99/month
  yearly: process.env.STRIPE_YEARLY_PRICE_ID || "price_placeholder_yearly"     // $250/year
};

// Active civil rights cases supported by TERA Token
const CIVIL_RIGHTS_CASES = [
  {
    id: "equal-education",
    name: "Equal Educational Access Initiative",
    description: "Supporting legal action to ensure equal access to quality education in underserved communities.",
    fundingGoal: 100000
  }
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Add newsletter subscription endpoint
  app.post("/api/subscribe", async (req, res) => {
    try {
      const data = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.addSubscriber(data);
      res.status(201).json({ success: true, message: "Subscription successful", data: subscriber });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: validationError.message 
        });
      } else if (error instanceof Error && error.message.includes("duplicate")) {
        res.status(409).json({ 
          success: false, 
          message: "Email already subscribed" 
        });
      } else {
        console.error("Subscription error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Token metrics endpoint
  app.get("/api/token-metrics", (_req, res) => {
    const metrics = {
      currentPrice: "$0.00012",
      priceChange: "+5.3%",
      marketCap: "$42,300,000",
      marketCapChange: "+2.8%",
      volume: "$2,845,620",
      volumeChange: "-1.2%",
      supply: "86.5B",
      totalSupply: "100B",
      priceHistory: [
        { date: "2023-01", price: 0.00004 },
        { date: "2023-02", price: 0.00006 },
        { date: "2023-03", price: 0.00005 },
        { date: "2023-04", price: 0.00007 },
        { date: "2023-05", price: 0.00011 },
        { date: "2023-06", price: 0.00008 },
        { date: "2023-07", price: 0.00010 },
        { date: "2023-08", price: 0.00012 },
        { date: "2023-09", price: 0.00009 },
        { date: "2023-10", price: 0.00011 },
        { date: "2023-11", price: 0.00013 },
        { date: "2023-12", price: 0.00012 }
      ],
      exchanges: [
        { name: "Binance", volume: "$1.2M", color: "#F0B90B" },
        { name: "Coinbase", volume: "$896K", color: "#1652F0" },
        { name: "Uniswap", volume: "$543K", color: "#627EEA" },
        { name: "PancakeSwap", volume: "$245K", color: "#E84142" }
      ]
    };
    
    res.json(metrics);
  });

  // Create payment intent for token purchase
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, tokenAmount, walletAddress } = req.body;
      
      if (!amount || amount < 10) {
        return res.status(400).json({ error: "Minimum purchase amount is $10" });
      }
      
      // Validate wallet address
      if (!walletAddress || walletAddress.trim() === '') {
        return res.status(400).json({ error: "Wallet address is required" });
      }
      
      // Basic Solana wallet address validation
      if (walletAddress.length < 32 || walletAddress.length > 50) {
        return res.status(400).json({ error: "Invalid wallet address length" });
      }
      
      // Simple regex for base58 characters
      if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(walletAddress)) {
        return res.status(400).json({ error: "Invalid wallet address format" });
      }

      // Calculate fee breakdown
      const networkFeePercentage = 0.05; // 5% for network fees
      const creationFeePercentage = 0.15; // 15% for token creation costs
      const liquidityPoolPercentage = 0.30; // 30% for initial liquidity
      const replitFeePercentage = 0.01; // 1% to Replit
      const teraFeePercentage = 0.10; // 10% to TERA token for civil rights initiatives
      const profitPercentage = 0.39; // 39% profit (reduced to accommodate TERA and Replit fees)
      
      const networkFee = amount * networkFeePercentage;
      const creationFee = amount * creationFeePercentage;
      const liquidityPool = amount * liquidityPoolPercentage;
      const replitFee = amount * replitFeePercentage;
      const teraFee = amount * teraFeePercentage;
      const profit = amount * profitPercentage;

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          tokenAmount,
          tokenName: "MPT",
          tokenCreator: "KLOUD BUGS",
          tokenCompany: "LE LUXE LLC",
          tokenLaunchDate: "2025-04-24",
          walletAddress,
          networkFee: networkFee.toFixed(2),
          creationFee: creationFee.toFixed(2),
          liquidityPool: liquidityPool.toFixed(2),
          replitFee: replitFee.toFixed(2),
          teraFee: teraFee.toFixed(2),
          profit: profit.toFixed(2),
          timestamp: new Date().toISOString()
        },
        description: `Purchase of ${tokenAmount} MPT tokens for wallet ${walletAddress}`,
      });

      // Send publishable key and PaymentIntent details to client
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        error: { message: error.message || "An error occurred while processing your payment." } 
      });
    }
  });

  // Webhook handler for Stripe events
  app.post("/api/webhook", async (req, res) => {
    const payload = req.body;
    let event;

    try {
      // Verify webhook signature
      const signature = req.headers['stripe-signature'] as string;
      // Note: in production, you would use a webhook secret
      event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Extract the fee breakdown from metadata
        const { 
          tokenAmount, 
          tokenName,
          walletAddress,
          networkFee,
          creationFee,
          liquidityPool,
          replitFee,
          teraFee,
          profit 
        } = paymentIntent.metadata || {};
        
        console.log(`PaymentIntent for ${paymentIntent.amount / 100} USD was successful!`);
        console.log(`Processed purchase of ${tokenAmount} ${tokenName} tokens`);
        console.log(`Wallet Address: ${walletAddress}`);
        console.log(`Fee breakdown: Network: $${networkFee}, Creation: $${creationFee}, Liquidity: $${liquidityPool}, Replit: $${replitFee}, TERA: $${teraFee}, Profit: $${profit}`);
        
        // In a production implementation, you would:
        // 1. Allocate funds according to the fee structure
        // 2. Initiate token creation process using the Solana web3.js library
        // 3. Set up the token with proper parameters (name, symbol, decimals)
        // 4. Record the wallet address, transaction details in your database
        // 5. Send confirmation email to the customer with transaction details
        
        // Sample pseudocode for Solana token creation:
        /*
        // This would typically be in a separate worker process
        async function createSolanaToken(paymentIntentId, tokenAmount, walletAddress, networkFee, creationFee, liquidityPool) {
          // 1. Connect to Solana network
          const connection = new solanaWeb3.Connection(...);
          
          // 2. Use funds from creationFee to pay for token creation
          const mintAccount = await createMintAccount(connection, creationFee);
          
          // 3. Set up token parameters
          await setupToken(mintAccount, "MPT", "MPT Token by KLOUD BUGS", 9);
          
          // 4. Use liquidityPool funds to set up initial trading pools
          await setupLiquidityPool(mintAccount, liquidityPool);
          
          // 5. Transfer tokens to customer wallet
          await transferTokens(mintAccount, walletAddress, tokenAmount);
          
          // 6. Record transaction in database for tracking and customer support
          await recordTransaction({
            paymentIntentId,
            walletAddress,
            tokenAmount,
            networkFee,
            creationFee,
            liquidityPool,
            timestamp: new Date()
          });
          
          // 7. Send confirmation email to customer with transaction details
          await sendConfirmationEmail(customerEmail, {
            tokenAmount,
            walletAddress,
            transactionId: mintAccount.toString()
          });
        }
        */
        
        // For demo purposes, we're just logging the event
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  });
  
  // Create subscription endpoint for mining service
  app.post("/api/create-subscription", async (req, res) => {
    try {
      const { plan } = req.body;
      
      if (!plan || !['monthly', 'yearly'].includes(plan)) {
        return res.status(400).json({ error: "Valid subscription plan is required (monthly or yearly)" });
      }

      // Get the appropriate price ID based on the selected plan
      const priceId = plan === 'monthly' ? SUBSCRIPTION_PRICES.monthly : SUBSCRIPTION_PRICES.yearly;
      
      // Determine the amount based on the plan for metadata
      const amount = plan === 'monthly' ? 49.99 : 250.00;
      
      // For a real implementation, you would:
      // 1. Create or retrieve the customer in Stripe
      // 2. Attach a payment method to the customer
      // 3. Create a subscription
      
      // For now, we'll create a payment intent that will handle the initial payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          subscriptionPlan: plan,
          subscriptionType: "mining",
          productName: "MPT Mining Subscription",
          companyName: "KLOUD BUGS (LE LUXE LLC)",
          civilRightsContribution: "10%", // TERA token allocation
          userRevenue: "74%",
          platformMaintenance: "15%",
          replitContribution: "1%",
          timestamp: new Date().toISOString()
        },
        description: `${plan === 'monthly' ? 'Monthly' : 'Annual'} Mining Subscription for MPT Tokens`,
      });

      // Send publishable key and PaymentIntent details to client
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ 
        error: { message: error.message || "An error occurred while processing your subscription." } 
      });
    }
  });

  // Handle subscription webhook events
  app.post("/api/subscription-webhook", async (req, res) => {
    const payload = req.body;
    let event;

    try {
      // Verify webhook signature
      const signature = req.headers['stripe-signature'] as string;
      event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET || '');
    } catch (err: any) {
      console.error(`Subscription webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle subscription events
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful subscription payment
        const paymentIntent = event.data.object;
        const { 
          subscriptionPlan, 
          subscriptionType,
          civilRightsContribution,
          userRevenue,
          platformMaintenance,
          replitContribution
        } = paymentIntent.metadata || {};
        
        console.log(`Subscription payment for ${paymentIntent.amount / 100} USD was successful!`);
        console.log(`Plan: ${subscriptionPlan}, Type: ${subscriptionType}`);
        console.log(`Allocation: ${civilRightsContribution} to civil rights, ${userRevenue} to user, ${platformMaintenance} for platform, ${replitContribution} to Replit`);
        
        // In production, you would:
        // 1. Create a user account or update an existing one
        // 2. Activate the subscription in your database
        // 3. Set up mining access for the user
        // 4. Send a confirmation email with access details
        break;
        
      case 'customer.subscription.created':
        // Handle new subscription creation
        console.log('New subscription created');
        break;
        
      case 'customer.subscription.updated':
        // Handle subscription updates (upgrades, downgrades)
        console.log('Subscription updated');
        break;
        
      case 'customer.subscription.deleted':
        // Handle subscription cancellations
        console.log('Subscription cancelled');
        break;
        
      default:
        console.log(`Unhandled subscription event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  });

  // Create payment intent for TERA Token contribution
  app.post("/api/create-tera-token", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount < 25) {
        return res.status(400).json({ error: "Minimum contribution amount is $25" });
      }
      
      const civilRightsCase = CIVIL_RIGHTS_CASES[0]; // Using the first case for demo
      
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          tokenType: "TERA",
          caseId: civilRightsCase.id,
          caseName: civilRightsCase.name,
          contributionType: "civil_rights_case",
          fundAllocation: "99% to legal fund, 1% to Replit",
          timestamp: new Date().toISOString()
        },
        description: `TERA Token contribution of $${amount} to support "${civilRightsCase.name}"`,
      });

      // Send payment intent details to client
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating TERA Token payment intent:", error);
      res.status(500).json({ 
        error: { message: error.message || "An error occurred while processing your contribution." } 
      });
    }
  });

  // Webhook handler for TERA Token payments
  app.post("/api/tera-webhook", async (req, res) => {
    const payload = req.body;
    let event;

    try {
      // Verify webhook signature
      const signature = req.headers['stripe-signature'] as string;
      event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_TERA_WEBHOOK_SECRET || '');
    } catch (err: any) {
      console.error(`TERA webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Extract the case details from metadata
        const { 
          caseId, 
          caseName,
          contributionType,
          fundAllocation 
        } = paymentIntent.metadata || {};
        
        console.log(`TERA Token payment for ${paymentIntent.amount / 100} USD was successful!`);
        console.log(`Case: ${caseName} (${caseId})`);
        console.log(`Contribution Type: ${contributionType}`);
        console.log(`Fund Allocation: ${fundAllocation}`);
        
        // In a production implementation, you would:
        // 1. Allocate 100% of the funds to the specified civil rights case
        // 2. Update the funding progress of the case in the database
        // 3. Record the contribution details for reporting and transparency
        // 4. Send a confirmation email to the contributor with the details
        
        break;
      default:
        console.log(`Unhandled TERA token event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  });

  const httpServer = createServer(app);

  return httpServer;
}
