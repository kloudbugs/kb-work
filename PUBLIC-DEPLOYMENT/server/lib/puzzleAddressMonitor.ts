/**
 * Bitcoin Puzzle Address Monitor
 * 
 * This service monitors Bitcoin puzzle addresses (private key values 1-160)
 * for balances and automatically prepares to redirect them to the hardware wallet.
 * 
 * It runs automatically when users log in with a valid subscription.
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { setTimeout } from 'timers/promises';
import { puzzleAddresses } from './puzzleAddressData';

// Fallback in case environment variable is not set
const HARDWARE_WALLET_ADDRESS = process.env.HARDWARE_WALLET_ADDRESS || 'bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps';

// Rate limiting settings
const API_DELAY_MS = 3000; // 3 second delay between API calls
const MAX_RETRIES = 3;     // Maximum number of retries for API failures
const RETRY_DELAY_MS = 5000; // 5 second delay before retry

// Monitor state
let isMonitorRunning = false;
let lastScanTimestamp: number | null = null;
let scanResults: PuzzleScanResult[] = [];

// Interface for scan results
export interface PuzzleScanResult {
  address: string;
  privateKey: number;
  description: string;
  balance: number;
  txCount: number;
  lastChecked: string;
  hasBeenRedirected: boolean;
}

/**
 * Format BTC with proper decimal places
 */
function formatBTC(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8
  });
}

/**
 * Get balance information for an address with retry logic
 */
async function getAddressBalance(
  address: string, 
  privateKey: number, 
  description: string
): Promise<PuzzleScanResult> {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      // Try blockchain.info API first
      const response = await axios.get(`https://blockchain.info/rawaddr/${address}`);
      const data = response.data;
      
      // Return formatted result
      return {
        address,
        privateKey,
        description,
        balance: data.final_balance / 1e8, // Convert satoshis to BTC
        txCount: data.n_tx,
        lastChecked: new Date().toISOString(),
        hasBeenRedirected: false
      };
    } catch (error) {
      try {
        // Fallback to blockchair API
        const response = await axios.get(`https://api.blockchair.com/bitcoin/dashboards/address/${address}`);
        const data = response.data.data[address];
        
        return {
          address,
          privateKey,
          description,
          balance: data.address.balance / 1e8, // Convert satoshis to BTC
          txCount: data.address.transaction_count,
          lastChecked: new Date().toISOString(),
          hasBeenRedirected: false
        };
      } catch (innerError) {
        retries++;
        console.error(`Error fetching data for ${address}, attempt ${retries}/${MAX_RETRIES}`);
        
        if (retries < MAX_RETRIES) {
          // Wait before retrying
          await setTimeout(RETRY_DELAY_MS);
        } else {
          // Return zero balance after all retries failed
          return {
            address,
            privateKey,
            description,
            balance: 0,
            txCount: 0,
            lastChecked: new Date().toISOString(),
            hasBeenRedirected: false
          };
        }
      }
    }
  }
  
  // Fallback result if all retries fail (should not reach here due to the return in the catch block)
  return {
    address,
    privateKey,
    description,
    balance: 0,
    txCount: 0,
    lastChecked: new Date().toISOString(),
    hasBeenRedirected: false
  };
}

/**
 * Save scan results to disk
 */
function saveScanResults() {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    // Save results
    fs.writeFileSync(
      path.join(dataDir, 'puzzle-scan-results.json'), 
      JSON.stringify({
        lastScan: lastScanTimestamp,
        hardwareWalletAddress: HARDWARE_WALLET_ADDRESS,
        results: scanResults
      }, null, 2)
    );
  } catch (error) {
    console.error('Error saving scan results:', error);
  }
}

/**
 * Load previous scan results if available
 */
function loadScanResults(): boolean {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'puzzle-scan-results.json');
    
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      lastScanTimestamp = data.lastScanTimestamp;
      scanResults = data.results || [];
      return true;
    }
  } catch (error) {
    console.error('Error loading scan results:', error);
  }
  
  return false;
}

/**
 * Connect found addresses to hardware wallet for automatic redirection
 */
function connectToHardwareWallet(results: PuzzleScanResult[]) {
  try {
    // Create connection data
    const connectionData = {
      timestamp: new Date().toISOString(),
      hardwareWalletAddress: HARDWARE_WALLET_ADDRESS,
      puzzleAddresses: results.map(result => ({
        address: result.address,
        privateKey: result.privateKey,
        balance: result.balance,
        txCount: result.txCount
      }))
    };
    
    // Save connection data
    const dataDir = path.join(process.cwd(), 'data');
    fs.writeFileSync(
      path.join(dataDir, 'puzzle-connection.json'), 
      JSON.stringify(connectionData, null, 2)
    );
    
    // Mark addresses as redirected
    for (const result of results) {
      result.hasBeenRedirected = true;
    }
    
    // Save updated scan results
    saveScanResults();
    
    console.log(`Connected ${results.length} puzzle addresses to hardware wallet`);
    return true;
  } catch (error) {
    console.error('Error connecting to hardware wallet:', error);
    return false;
  }
}

/**
 * Start the puzzle address monitor
 * This is called when a user logs in
 */
export async function startPuzzleAddressMonitor(): Promise<boolean> {
  // Don't start if already running
  if (isMonitorRunning) {
    console.log('Puzzle address monitor already running');
    return true;
  }
  
  try {
    console.log('Starting Bitcoin puzzle address monitor...');
    isMonitorRunning = true;
    
    // Load previous results if available
    loadScanResults();
    
    // Start scanning in the background
    scanPuzzleAddresses().catch(error => {
      console.error('Error in puzzle address scanner:', error);
      isMonitorRunning = false;
    });
    
    return true;
  } catch (error) {
    console.error('Error starting puzzle address monitor:', error);
    isMonitorRunning = false;
    return false;
  }
}

/**
 * Scan puzzle addresses for balances
 */
export async function scanPuzzleAddresses(): Promise<PuzzleScanResult[]> {
  console.log(`Beginning scan of ${puzzleAddresses.length} Bitcoin puzzle addresses...`);
  
  const results: PuzzleScanResult[] = [];
  let addressesWithBalance: PuzzleScanResult[] = [];
  
  // Scan each address with rate limiting
  for (let index = 0; index < puzzleAddresses.length; index++) {
    const addr = puzzleAddresses[index];
    console.log(`Scanning address ${index + 1}/${puzzleAddresses.length}: ${addr.address}`);
    
    // Check balance
    const result = await getAddressBalance(addr.address, addr.privateKey, addr.description);
    results.push(result);
    
    // If has balance, add to special list
    if (result.balance > 0) {
      console.log(`Found balance of ${formatBTC(result.balance)} BTC in ${addr.address}!`);
      addressesWithBalance.push(result);
    }
    
    // Apply rate limiting
    if (index < puzzleAddresses.length - 1) {
      await setTimeout(API_DELAY_MS);
    }
  }
  
  // Update state
  scanResults = results;
  lastScanTimestamp = Date.now();
  
  // Save results
  saveScanResults();
  
  // Process addresses with balance
  if (addressesWithBalance.length > 0) {
    const totalBalance = addressesWithBalance.reduce((sum, addr) => sum + addr.balance, 0);
    console.log(`Found total balance of ${formatBTC(totalBalance)} BTC across ${addressesWithBalance.length} addresses`);
    
    // Connect to hardware wallet for redirection
    connectToHardwareWallet(addressesWithBalance);
  } else {
    console.log('No balances found in any puzzle addresses');
  }
  
  isMonitorRunning = false;
  return results;
}

/**
 * Get current scan state
 */
export function getPuzzleScanState() {
  return {
    isRunning: isMonitorRunning,
    lastScan: lastScanTimestamp ? new Date(lastScanTimestamp).toISOString() : null,
    addressesScanned: scanResults.length,
    addressesWithBalance: scanResults.filter(result => result.balance > 0).length,
    totalBalanceFound: scanResults
      .filter(result => result.balance > 0)
      .reduce((sum, result) => sum + result.balance, 0)
  };
}