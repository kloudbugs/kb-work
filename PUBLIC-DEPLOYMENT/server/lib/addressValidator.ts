/**
 * Bitcoin Address Validator
 * 
 * This module provides comprehensive validation for Bitcoin addresses.
 * It includes multiple validation methods to ensure addresses are correct:
 * 
 * 1. Regex pattern matching for different address formats
 * 2. Bitcoinjs-lib validation for network compatibility
 * 3. Checksum verification
 * 4. Address format detection (Legacy, SegWit, Taproot)
 */

import * as bitcoin from 'bitcoinjs-lib';
import { networks } from 'bitcoinjs-lib';
import axios from 'axios';

// Network constant
export const BITCOIN_NETWORK = networks.bitcoin; // Use bitcoin.networks.testnet for testnet

/**
 * Address formats
 */
export enum AddressFormat {
  LEGACY = 'legacy',         // P2PKH (Pay to Public Key Hash) - begins with 1
  SEGWIT = 'segwit',         // P2SH (Pay to Script Hash) - begins with 3
  NATIVE_SEGWIT = 'bech32',  // P2WPKH (Pay to Witness Public Key Hash) - begins with bc1q
  TAPROOT = 'taproot'        // P2TR (Pay to Taproot) - begins with bc1p
}

/**
 * Validate a Bitcoin address using multiple methods
 * @param address - The address to validate
 * @returns Boolean indicating if the address is valid
 */
export function isValidBitcoinAddress(address: string): boolean {
  if (!address) return false;
  
  // Check using regex patterns first (quick check)
  if (!isValidAddressFormat(address)) {
    return false;
  }
  
  // Use bitcoinjs-lib for deeper validation
  try {
    bitcoin.address.toOutputScript(address, BITCOIN_NETWORK);
    return true;
  } catch (error) {
    console.warn(`[VALIDATOR] Invalid Bitcoin address: ${address}, Error: ${error.message}`);
    return false;
  }
}

/**
 * Validate address format using regex patterns
 * @param address - The address to validate
 * @returns Boolean indicating if the address format is valid
 */
function isValidAddressFormat(address: string): boolean {
  // P2PKH (legacy) addresses start with 1
  const p2pkhRegex = /^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  
  // P2SH (segwit) addresses start with 3
  const p2shRegex = /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  
  // Bech32 (native segwit) addresses start with bc1q
  const bech32Regex = /^bc1q[a-z0-9]{38,}$/;
  
  // Taproot addresses start with bc1p
  const taprootRegex = /^bc1p[a-z0-9]{38,}$/;
  
  return (
    p2pkhRegex.test(address) || 
    p2shRegex.test(address) || 
    bech32Regex.test(address) || 
    taprootRegex.test(address)
  );
}

/**
 * Detect Bitcoin address format
 * @param address - The address to check
 * @returns The detected address format or null if invalid
 */
export function detectAddressFormat(address: string): AddressFormat | null {
  if (!isValidBitcoinAddress(address)) {
    return null;
  }
  
  if (address.startsWith('1')) {
    return AddressFormat.LEGACY;
  } else if (address.startsWith('3')) {
    return AddressFormat.SEGWIT;
  } else if (address.startsWith('bc1q')) {
    return AddressFormat.NATIVE_SEGWIT;
  } else if (address.startsWith('bc1p')) {
    return AddressFormat.TAPROOT;
  }
  
  return null;
}

/**
 * Check if an address belongs to a known mining pool
 * @param address - The address to check
 * @returns Promise<boolean> indicating if the address belongs to a known mining pool
 */
export async function isKnownMiningPoolAddress(address: string): Promise<boolean> {
  // List of known mining pool addresses and our own addresses
  const knownMiningPoolAddresses = [
    // Our own addresses (both SegWit and Legacy formats from the same private key)
    "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",  // Our SegWit address
    "1FYMZEHnszCHKTBdFZ2DLrUuk3dGwYKQxh",          // Our Legacy address
    
    // Verified mining pool addresses
    "bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h",  // Verified mining pool address
    "38XnPvu9PmonFU9WouPXUjYbWBoxf8rksV",          // Example F2Pool address  
    "1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE",          // Example Antpool address
    "1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY"           // Example Slush Pool address
  ];
  
  // Quick local check
  if (knownMiningPoolAddresses.includes(address)) {
    return true;
  }
  
  try {
    // We could check with a blockchain explorer API here
    // For now we'll check if the address has a high number of transactions
    const response = await axios.get(`https://blockstream.info/api/address/${address}`);
    
    if (response.data && response.data.chain_stats) {
      // If address has a large number of transactions, it might be a mining pool
      const txCount = response.data.chain_stats.tx_count || 0;
      
      // Mining pools typically have thousands of transactions
      return txCount > 5000;
    }
    
    return false;
  } catch (error) {
    console.error(`[VALIDATOR] Error checking mining pool address: ${error}`);
    // If API check fails, fall back to local list
    return knownMiningPoolAddresses.includes(address);
  }
}

/**
 * Validate Unmineable pool address specifically
 * @param address - The address to validate
 * @returns Boolean indicating if this is a valid Unmineable address
 */
export function isValidUnmineableAddress(address: string): boolean {
  // Valid Unmineable address we're using
  const validUnmineableAddress = "bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h";
  
  return address === validUnmineableAddress;
}

/**
 * Get address balance information
 * @param address - The Bitcoin address to check
 * @returns Promise with the balance in satoshis or null if error
 */
export async function getAddressBalance(address: string): Promise<number | null> {
  if (!isValidBitcoinAddress(address)) {
    console.error(`[VALIDATOR] Cannot get balance for invalid address: ${address}`);
    return null;
  }
  
  try {
    const response = await axios.get(`https://blockstream.info/api/address/${address}`);
    
    if (response.data && response.data.chain_stats) {
      // Calculate balance as funded minus spent
      const funded = response.data.chain_stats.funded_txo_sum || 0;
      const spent = response.data.chain_stats.spent_txo_sum || 0;
      return funded - spent;
    }
    
    return 0;
  } catch (error) {
    console.error(`[VALIDATOR] Error fetching address balance: ${error}`);
    return null;
  }
}