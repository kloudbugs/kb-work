/**
 * Secure View-Only Wallet Module
 * 
 * This module provides a view-only wallet implementation 
 * with no private keys or scanning capabilities.
 */

// The mining address (read-only)
export const MINING_ADDRESS = 'bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps';

// View-only wallet interface
export interface ViewOnlyWallet {
  address: string;
  balance: number;
  label: string;
}

// Create a view-only wallet with no private key
export const createViewOnlyWallet = (): ViewOnlyWallet => {
  return {
    address: MINING_ADDRESS,
    balance: 0,
    label: 'KLOUD BUGS MINING POOL'
  };
};

// Wallet operations always return empty results
export const getTransactionHistory = async () => {
  return { transactions: [] };
};

// No scanning functionality
export const scanForTransactions = async () => {
  console.log('[SECURITY] Wallet scanning disabled - No private keys present');
  return { success: false, message: 'Scanning disabled in this environment' };
};

console.log('[SECURITY] Secure view-only wallet loaded - No private keys present');