/**
 * Ledger Hardware Wallet Integration Service
 * 
 * This service provides integration with Ledger hardware wallets
 * for signing Bitcoin transactions. It uses WebUSB to communicate
 * with the Ledger device and the Bitcoin app on the device to
 * sign transactions.
 */

// Using type-only imports to prevent module initialization at import time
import type TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import type Btc from '@ledgerhq/hw-app-btc';
import { getNetworkFees } from './bitcoinBlockchairService';
import axios from 'axios';

// Define Bitcoin network (mainnet)
const NETWORK = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bc',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
};

// Blockchair API endpoint
const BLOCKCHAIR_API_BASE = 'https://api.blockchair.com/bitcoin';

/**
 * Create a connection to a Ledger device
 * This must be called within a user-initiated action (like a click)
 * due to browser security restrictions
 */
export async function connectToLedger(): Promise<{ transport: TransportWebUSB, app: Btc }> {
  try {
    // Check if we're in a browser environment before trying to use WebUSB
    if (!isWebUSBSupported()) {
      throw new Error('WebUSB is not supported in this environment');
    }
    
    console.log('[LEDGER] Attempting to connect to Ledger device...');
    
    // Dynamically import the Ledger packages to avoid issues in Node.js environments
    const [TransportWebUSBModule, BtcModule] = await Promise.all([
      import('@ledgerhq/hw-transport-webusb'),
      import('@ledgerhq/hw-app-btc')
    ]);
    
    // Get the actual constructors
    const TransportWebUSB = TransportWebUSBModule.default;
    const Btc = BtcModule.default;
    
    const transport = await TransportWebUSB.create();
    const app = new Btc({ transport, currency: 'bitcoin' });
    
    // Test the connection by getting the app version
    const version = await app.getAppConfiguration();
    console.log(`[LEDGER] Connected to Bitcoin app v${version.version.major}.${version.version.minor}.${version.version.patch}`);
    
    return { transport, app };
  } catch (error) {
    console.error('[LEDGER] Failed to connect to Ledger:', error);
    throw new Error('Failed to connect to Ledger device. Please make sure your device is connected, unlocked, and has the Bitcoin app open.');
  }
}

/**
 * Get a Bitcoin address from the Ledger device
 * @param app Btc app instance
 * @param path BIP32 derivation path
 * @param verify Whether to display the address on the Ledger for verification
 */
export async function getAddress(app: Btc, path: string = "44'/0'/0'/0/0", verify: boolean = false): Promise<string> {
  try {
    const { bitcoinAddress } = await app.getWalletPublicKey(path, { verify });
    console.log(`[LEDGER] Retrieved address: ${bitcoinAddress}`);
    return bitcoinAddress;
  } catch (error) {
    console.error('[LEDGER] Failed to get address:', error);
    throw new Error('Failed to get Bitcoin address from Ledger. User may have cancelled the operation.');
  }
}

/**
 * Create and sign a Bitcoin transaction using the Ledger device
 * @param app Btc app instance
 * @param amount Amount to send in satoshis
 * @param destinationAddress Recipient's Bitcoin address
 * @param memo Optional transaction memo
 */
export async function createAndSignTransaction(
  app: Btc,
  sourceAddress: string,
  destinationAddress: string,
  amount: number,
  feeRate?: number,
  path: string = "44'/0'/0'/0/0"
): Promise<string> {
  try {
    // Get current fee rate if not provided
    if (!feeRate) {
      const fees = await getNetworkFees();
      feeRate = fees.mediumFee;
      console.log(`[LEDGER] Using fee rate: ${feeRate} satoshis/byte`);
    }

    // Get UTXOs for the source address
    const utxosResponse = await axios.get(`${BLOCKCHAIR_API_BASE}/dashboards/address/${sourceAddress}`);
    const utxos = utxosResponse.data.data[sourceAddress].utxo;
    
    if (!utxos || utxos.length === 0) {
      throw new Error('No unspent outputs found for this address');
    }

    console.log(`[LEDGER] Found ${utxos.length} UTXOs for address ${sourceAddress}`);

    // Prepare inputs and outputs for the transaction
    const inputs = utxos.map((utxo: any) => ({
      txId: utxo.transaction_hash,
      outputIndex: utxo.index,
      amount: utxo.value,
      path
    }));

    // Calculate total input amount
    const totalInput = inputs.reduce((sum: number, input: any) => sum + input.amount, 0);
    
    // Estimate transaction size (simple estimation)
    const estimatedSize = inputs.length * 148 + 2 * 34 + 10;
    const fee = estimatedSize * feeRate;
    
    // Check if we have enough funds
    if (totalInput < amount + fee) {
      throw new Error(`Insufficient funds. Required: ${amount + fee}, Available: ${totalInput}`);
    }
    
    // Calculate change amount
    const change = totalInput - amount - fee;
    
    // Prepare outputs
    const outputs = [
      {
        address: destinationAddress,
        amount
      }
    ];
    
    // Add change output if needed
    if (change > 546) { // Dust threshold
      outputs.push({
        address: sourceAddress, // Send change back to source address
        amount: change
      });
    }
    
    console.log(`[LEDGER] Transaction details:
      Sending: ${amount} satoshis
      Fee: ${fee} satoshis
      Change: ${change} satoshis
      To: ${destinationAddress}
    `);

    // TODO: In a production environment, we would need to:
    // 1. Create the transaction hex
    // 2. Sign each input with the Ledger
    // 3. Combine signatures with the transaction
    // 4. Broadcast the transaction
    
    // For now, we'll use a simulated transaction
    // In real implementation, this would be replaced with actual Ledger signing
    const simulatedTxHex = '01000000...'; // This would be the actual transaction hex
    
    // Broadcast the transaction
    const txid = await broadcastTransaction(simulatedTxHex);
    
    return txid;
  } catch (error) {
    console.error('[LEDGER] Error creating/signing transaction:', error);
    throw error;
  }
}

/**
 * Broadcast a signed transaction to the Bitcoin network
 * @param txHex Signed transaction in hexadecimal format
 */
export async function broadcastTransaction(txHex: string): Promise<string> {
  try {
    const response = await axios.post(`${BLOCKCHAIR_API_BASE}/push/transaction`, {
      data: txHex
    });
    
    if (response.data && response.data.data && response.data.data.transaction_hash) {
      const txid = response.data.data.transaction_hash;
      console.log(`[LEDGER] Transaction broadcast successful. TXID: ${txid}`);
      return txid;
    }
    
    throw new Error('Failed to broadcast transaction');
  } catch (error) {
    console.error('[LEDGER] Error broadcasting transaction:', error);
    
    // Extract error message from Blockchair API response if available
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(`Broadcast failed: ${error.response.data.error}`);
    }
    
    throw error;
  }
}

/**
 * Check if WebUSB is supported in the current environment
 * This function is designed to be safe in both browser and Node.js environments
 */
export function isWebUSBSupported(): boolean {
  // In a Node.js environment, typeof window and navigator will be undefined
  return typeof window !== 'undefined' && typeof navigator !== 'undefined' && !!navigator && !!navigator.usb;
}

/**
 * Request device access (must be called in response to a user action)
 * This function is designed to work only in a browser environment
 */
export async function requestLedgerDevice(): Promise<boolean> {
  try {
    // Check for browser environment first
    if (!isWebUSBSupported()) {
      // This could be either a server environment or a browser without WebUSB
      if (typeof window === 'undefined') {
        console.error('[LEDGER] Cannot request device in a Node.js environment');
        return false;
      } else {
        throw new Error('WebUSB is not supported in this browser');
      }
    }
    
    // We've verified we're in a browser with WebUSB support
    // Dynamically import TransportWebUSB to avoid server-side issues
    const { default: TransportWebUSB } = await import('@ledgerhq/hw-transport-webusb');
    
    // Use the imported module to request a device
    await TransportWebUSB.requestDevice();
    
    return true;
  } catch (error) {
    console.error('[LEDGER] Error requesting device:', error);
    return false;
  }
}