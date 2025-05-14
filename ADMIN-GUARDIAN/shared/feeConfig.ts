/**
 * Fee Configuration for the Satoshi Beans Mining Platform
 * 
 * This file defines the fee structure for the platform,
 * including transaction fees that support the civil rights movement.
 */

import { z } from 'zod';

/**
 * Fee Type Enum
 */
export enum FeeType {
  TRANSACTION = 'transaction', // Fee on transactions
  WITHDRAWAL = 'withdrawal',   // Fee on withdrawals
  MINING = 'mining'            // Fee on mining rewards
}

/**
 * Fee Structure Schema
 */
export const feeStructureSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  feeType: z.nativeEnum(FeeType),
  percentageFee: z.number().min(0).max(100), // Percentage fee (0-100%)
  flatFee: z.number().min(0),                // Flat fee in satoshis
  minimumFee: z.number().min(0),            // Minimum fee in satoshis
  maximumFee: z.number().optional(),        // Maximum fee in satoshis (optional)
  active: z.boolean().default(true),
  created: z.date(),
  updated: z.date()
});

export type FeeStructure = z.infer<typeof feeStructureSchema>;

/**
 * Fee Transaction Schema
 * Records each fee collected
 */
export const feeTransactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  sourceTransactionId: z.string(), // Original transaction ID
  feeStructureId: z.string().uuid(), // Associated fee structure
  amount: z.number(),              // Amount in satoshis
  percentage: z.number().optional(), // Percentage used for calculation
  timestamp: z.date(),
  description: z.string().optional(),
  movementContribution: z.boolean().default(true) // Indicates if this fee contributes to the civil rights movement
});

export type FeeTransaction = z.infer<typeof feeTransactionSchema>;

/**
 * Movement Fund Schema
 * Tracks the civil rights movement fund balance
 */
export const movementFundSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  balance: z.number(), // Balance in satoshis
  totalContributions: z.number(), // Total lifetime contributions
  contributionsThisMonth: z.number(),
  contributionsThisYear: z.number(),
  lastContributionDate: z.date().optional(),
  created: z.date(),
  updated: z.date()
});

export type MovementFund = z.infer<typeof movementFundSchema>;

/**
 * Movement Fund Initiative Status
 */
export enum InitiativeStatus {
  PROPOSED = 'proposed',       // Initially proposed, pending community notice
  ANNOUNCED = 'announced',     // Announced to community for feedback
  VOTING = 'voting',           // Active voting period
  APPROVED = 'approved',       // Approved by community
  REJECTED = 'rejected',       // Rejected by community
  IN_PROGRESS = 'in_progress', // Funds being used for initiative
  COMPLETED = 'completed',     // Initiative is completed
  CANCELLED = 'cancelled'      // Initiative was cancelled
}

/**
 * Movement Fund Initiative Schema
 * Proposed initiatives for civil rights causes
 */
export const movementInitiativeSchema = z.object({
  id: z.string().uuid(),
  fundId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  detailedProposal: z.string(),
  requestedAmount: z.number(), // Amount in satoshis
  destinationAddress: z.string().optional(), // Bitcoin address (if applicable)
  recipient: z.string(),
  recipientDescription: z.string(),
  externalLinks: z.array(z.string()).optional(),
  proposedBy: z.string().uuid(), // User ID who proposed
  status: z.nativeEnum(InitiativeStatus).default(InitiativeStatus.PROPOSED),
  
  // Vote tracking
  votingStartDate: z.date().optional(),
  votingEndDate: z.date().optional(),
  yesVotes: z.number().default(0),
  noVotes: z.number().default(0),
  abstainVotes: z.number().default(0),
  
  // Timeline tracking
  announcementDate: z.date().optional(),
  approvalDate: z.date().optional(),
  completionDate: z.date().optional(),
  
  // Transparency data
  proposalDocumentUrl: z.string().optional(),
  progressUpdates: z.array(z.object({
    date: z.date(),
    update: z.string(),
    attachments: z.array(z.string()).optional()
  })).optional(),
  
  created: z.date(),
  updated: z.date()
});

export type MovementInitiative = z.infer<typeof movementInitiativeSchema>;

/**
 * User Vote Schema
 * Records individual user votes on initiatives
 */
export const userVoteSchema = z.object({
  id: z.string().uuid(),
  initiativeId: z.string().uuid(),
  userId: z.string().uuid(),
  vote: z.enum(['yes', 'no', 'abstain']),
  comment: z.string().optional(),
  timestamp: z.date()
});

export type UserVote = z.infer<typeof userVoteSchema>;

/**
 * Movement Fund Withdrawal Schema
 * Tracks withdrawals from the movement fund
 */
export const movementFundWithdrawalSchema = z.object({
  id: z.string().uuid(),
  fundId: z.string().uuid(),
  initiativeId: z.string().uuid(), // Associated initiative 
  amount: z.number(), // Amount in satoshis
  destinationAddress: z.string(), // Bitcoin address
  purpose: z.string(), // Purpose of withdrawal
  
  // Community approval tracking
  communityNotified: z.boolean().default(false),
  communityApproved: z.boolean().default(false),
  approvalVotingUrl: z.string().optional(),
  votingEndDate: z.date().optional(),
  approvalPercentage: z.number().optional(),
  minimumVoteThreshold: z.number().default(10), // Minimum percentage of users who must vote
  
  approvedBy: z.string().uuid(), // Admin ID who approved
  txHash: z.string().nullable().optional(), // Blockchain transaction hash
  status: z.enum(['proposed', 'voting', 'approved', 'rejected', 'processing', 'completed', 'failed']).default('proposed'),
  
  // Proof of usage
  proofDocuments: z.array(z.string()).optional(),
  outcomeReport: z.string().optional(),
  
  timestamp: z.date(),
  notes: z.string().optional()
});

export type MovementFundWithdrawal = z.infer<typeof movementFundWithdrawalSchema>;

/**
 * Default Fee Configurations
 */
export const DEFAULT_TRANSACTION_FEE_PERCENT = 1.0; // 1% of transaction value
export const DEFAULT_WITHDRAWAL_FEE_PERCENT = 0.5; // 0.5% of withdrawal amount
export const DEFAULT_MINIMUM_FEE_SATOSHIS = 1000; // Minimum 1000 satoshis (approx. $0.30)
export const DEFAULT_MINING_FEE_PERCENT = 2.0; // 2% of mining rewards

/**
 * Calculate fee for a transaction
 * 
 * @param amount - Transaction amount in satoshis
 * @param feeStructure - Fee structure to use
 * @returns Calculated fee amount in satoshis
 */
export function calculateFee(
  amount: number,
  feeStructure: FeeStructure
): number {
  // Calculate percentage fee
  let fee = Math.floor(amount * (feeStructure.percentageFee / 100));
  
  // Add flat fee if applicable
  if (feeStructure.flatFee > 0) {
    fee += feeStructure.flatFee;
  }
  
  // Apply minimum fee
  if (fee < feeStructure.minimumFee) {
    fee = feeStructure.minimumFee;
  }
  
  // Apply maximum fee if specified
  if (feeStructure.maximumFee !== undefined && fee > feeStructure.maximumFee) {
    fee = feeStructure.maximumFee;
  }
  
  return fee;
}