/**
 * SECURE Test Withdrawal Service
 * 
 * This is a secure implementation that DOES NOT actually perform any withdrawals or
 * connect to any external services. It is designed to provide the API interface 
 * expected by the application but does not actually perform any withdrawals.
 * 
 * All private key operations are completely DISABLED.
 */

// Interface for withdrawal requests (for API compatibility)
export interface WithdrawalRequest {
  address: string;
  amount: number;
  note?: string;
}

// Interface for withdrawal results (for API compatibility)
export interface WithdrawalResult {
  success: boolean;
  message: string;
  txHash?: string;
  amount?: number;
  fee?: number;
  sourceAddress?: string;
  destinationAddress?: string;
  timestamp?: number;
  estimatedCompletionTime?: number;
}

/**
 * Process a test withdrawal request - SECURE VERSION, DOES NOTHING
 * Returns a mock successful response for API compatibility
 */
export async function processTestWithdrawal(
  request: WithdrawalRequest
): Promise<WithdrawalResult> {
  console.log('[ADMIN-GUARDIAN] SECURE: Test withdrawal requested but disabled for security');
  console.log(`[ADMIN-GUARDIAN] Destination address: ${request.address}, Amount: ${request.amount}`);
  
  // Security notice
  console.log('[SECURITY NOTICE] Test withdrawals are DISABLED in ADMIN-GUARDIAN for security');
  console.log('[SECURITY NOTICE] This is an intentional security measure');
  
  // Return mock response for API compatibility
  return {
    success: true,
    message: "SECURE MODE: Test withdrawal simulated (no actual transaction occurred)",
    txHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    amount: request.amount,
    fee: 0,
    sourceAddress: "SECURE_TEST_SOURCE",
    destinationAddress: request.address,
    timestamp: Date.now(),
    estimatedCompletionTime: Date.now() + 1800000 // 30 minutes
  };
}

/**
 * Verify a test withdrawal request - SECURE VERSION, ALWAYS RETURNS TRUE
 * For API compatibility
 */
export function verifyTestWithdrawalRequest(
  request: WithdrawalRequest
): { valid: boolean; message?: string } {
  console.log('[ADMIN-GUARDIAN] SECURE: Test withdrawal verification requested but disabled for security');
  
  // Always return valid for API compatibility
  return {
    valid: true,
    message: "SECURE MODE: Verification simulated (no actual verification performed)"
  };
}

/**
 * Get test withdrawal status - SECURE VERSION
 * Returns mock status for API compatibility
 */
export async function getTestWithdrawalStatus(
  txHash: string
): Promise<WithdrawalResult> {
  console.log('[ADMIN-GUARDIAN] SECURE: Test withdrawal status requested but disabled for security');
  console.log(`[ADMIN-GUARDIAN] Transaction hash: ${txHash}`);
  
  // Return mock response for API compatibility
  return {
    success: true,
    message: "SECURE MODE: Transaction status simulated (no actual transaction exists)",
    txHash,
    amount: 0.00000001,
    fee: 0,
    sourceAddress: "SECURE_TEST_SOURCE",
    destinationAddress: "SECURE_TEST_DESTINATION",
    timestamp: Date.now() - 300000, // 5 minutes ago
    estimatedCompletionTime: Date.now() + 1500000 // 25 minutes remaining
  };
}