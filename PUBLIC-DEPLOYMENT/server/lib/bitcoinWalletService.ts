/**
 * Bitcoin Wallet Service
 * 
 * This service provides functions to work with Bitcoin wallets,
 * particularly focused on special index wallets (index 0 and 1).
 */

import * as bitcoin from 'bitcoinjs-lib';
import * as crypto from 'crypto';
import * as bip32 from 'bip32';
import * as ecc from 'tiny-secp256k1';
import axios from 'axios';

// Initialize BIP32 factory with ECC
const bip32Factory = bip32.BIP32Factory(ecc);

// Bitcoin API endpoints
const BLOCKCHAIR_API = 'https://api.blockchair.com/bitcoin/dashboards/address/';
const BLOCKSTREAM_API = 'https://blockstream.info/api/address/';

// Define address info interface
export interface AddressInfo {
  index: number;
  path: string;
  addressType: string;
  address: string;
  pathIndex: number;
  balance: number;
  txCount: number;
}

/**
 * Generate a private key for a specific index
 */
export function generatePrivateKeyFromIndex(index: number): Buffer {
  // For indices 0 and 1, use the known values (1 and 2)
  if (index === 0) {
    return Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'hex');
  } else if (index === 1) {
    return Buffer.from('0000000000000000000000000000000000000000000000000000000000000002', 'hex');
  }
  
  // For other indices, create a deterministic key
  const indexHex = index.toString(16).padStart(64, '0');
  return Buffer.from(indexHex, 'hex');
}

/**
 * Create a seed from a private key
 */
export function createSeedFromPrivateKey(privateKey: Buffer): Buffer {
  const hash = crypto.createHash('sha512');
  hash.update(privateKey);
  return hash.digest();
}

/**
 * Get balance information for a Bitcoin address
 */
export async function getAddressBalance(address: string): Promise<{ balance: number, txCount: number }> {
  try {
    // Try Blockchair API first
    const response = await axios.get(`${BLOCKCHAIR_API}${address}`);
    if (response.data && response.data.data && response.data.data[address]) {
      const data = response.data.data[address];
      return {
        balance: data.address.balance / 100000000, // Convert satoshis to BTC
        txCount: data.address.transaction_count
      };
    }
  } catch (error) {
    // If Blockchair fails, try Blockstream API
    try {
      const balanceResponse = await axios.get(`${BLOCKSTREAM_API}${address}`);
      if (balanceResponse.data) {
        const data = balanceResponse.data;
        return {
          balance: (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000,
          txCount: data.chain_stats.tx_count
        };
      }
    } catch (blockstreamError) {
      console.log(`Error checking balance for address ${address}`);
    }
  }
  
  // Return zero if both APIs fail
  return { balance: 0, txCount: 0 };
}

/**
 * Generate direct addresses (non-BIP paths) from the private key
 */
export function generateDirectAddresses(index: number): AddressInfo[] {
  const addresses: AddressInfo[] = [];
  
  try {
    const privateKey = generatePrivateKeyFromIndex(index);
    
    // Create uncompressed key pair
    const keyPairUncompressed = bitcoin.ECPair.fromPrivateKey(privateKey, { compressed: false });
    const addressUncompressed = bitcoin.payments.p2pkh({
      pubkey: keyPairUncompressed.publicKey,
      network: bitcoin.networks.bitcoin
    }).address;
    
    if (addressUncompressed) {
      addresses.push({
        index,
        path: "direct/uncompressed",
        addressType: "Legacy Uncompressed (P2PKH)",
        address: addressUncompressed,
        pathIndex: 0,
        balance: 0,
        txCount: 0
      });
    }
    
    // Create compressed key pair
    const keyPairCompressed = bitcoin.ECPair.fromPrivateKey(privateKey, { compressed: true });
    const addressCompressed = bitcoin.payments.p2pkh({
      pubkey: keyPairCompressed.publicKey,
      network: bitcoin.networks.bitcoin
    }).address;
    
    if (addressCompressed) {
      addresses.push({
        index,
        path: "direct/compressed",
        addressType: "Legacy Compressed (P2PKH)",
        address: addressCompressed,
        pathIndex: 0,
        balance: 0,
        txCount: 0
      });
    }
    
    // SegWit wrapped (P2SH-P2WPKH)
    const addressSegwitWrapped = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({
        pubkey: keyPairCompressed.publicKey,
        network: bitcoin.networks.bitcoin
      }),
      network: bitcoin.networks.bitcoin
    }).address;
    
    if (addressSegwitWrapped) {
      addresses.push({
        index,
        path: "direct/segwit-wrapped",
        addressType: "SegWit Wrapped (P2SH-P2WPKH)",
        address: addressSegwitWrapped,
        pathIndex: 0,
        balance: 0,
        txCount: 0
      });
    }
    
    // Native SegWit (P2WPKH)
    const addressNativeSegwit = bitcoin.payments.p2wpkh({
      pubkey: keyPairCompressed.publicKey,
      network: bitcoin.networks.bitcoin
    }).address;
    
    if (addressNativeSegwit) {
      addresses.push({
        index,
        path: "direct/native-segwit",
        addressType: "Native SegWit (P2WPKH)",
        address: addressNativeSegwit,
        pathIndex: 0,
        balance: 0,
        txCount: 0
      });
    }
  } catch (error) {
    console.error(`Error generating direct addresses for index ${index}:`, error);
  }
  
  return addresses;
}

/**
 * Generate BIP32 derived addresses for a specific index and path
 */
export function generateBIP32Addresses(
  index: number,
  path: string,
  addressType: string,
  count: number = 5
): AddressInfo[] {
  const addresses: AddressInfo[] = [];
  
  try {
    const privateKey = generatePrivateKeyFromIndex(index);
    const seed = createSeedFromPrivateKey(privateKey);
    
    // Create master node
    const master = bip32Factory.fromSeed(seed);
    
    // Derive account
    const account = master.derivePath(path);
    
    // Derive external chain (0)
    const chain = account.derive(0);
    
    // Generate addresses
    for (let i = 0; i < count; i++) {
      const child = chain.derive(i);
      let address: string | undefined;
      
      switch (addressType) {
        case "p2pkh":
          address = bitcoin.payments.p2pkh({ 
            pubkey: child.publicKey,
            network: bitcoin.networks.bitcoin
          }).address;
          break;
        case "p2sh-p2wpkh":
          address = bitcoin.payments.p2sh({ 
            redeem: bitcoin.payments.p2wpkh({ 
              pubkey: child.publicKey,
              network: bitcoin.networks.bitcoin 
            }),
            network: bitcoin.networks.bitcoin
          }).address;
          break;
        case "p2wpkh":
          address = bitcoin.payments.p2wpkh({ 
            pubkey: child.publicKey,
            network: bitcoin.networks.bitcoin 
          }).address;
          break;
        case "p2tr":
          address = bitcoin.payments.p2tr({ 
            internalPubkey: child.publicKey.slice(1, 33),
            network: bitcoin.networks.bitcoin 
          }).address;
          break;
      }
      
      if (address) {
        addresses.push({
          index,
          path: `${path}/0/${i}`,
          addressType,
          address,
          pathIndex: i,
          balance: 0,
          txCount: 0
        });
      }
    }
  } catch (error) {
    console.error(`Error generating BIP addresses for index ${index}, path ${path}:`, error);
  }
  
  return addresses;
}

/**
 * Scan wallet indices and paths for balances
 */
export async function scanWalletPaths(
  maxIndex: number = 5,
  maxAddressesPerPath: number = 5
): Promise<AddressInfo[]> {
  // Define derivation paths to check
  const derivationPaths = [
    { path: "m/44'/0'/0'", type: "p2pkh", name: "BIP44 (Legacy)" },
    { path: "m/49'/0'/0'", type: "p2sh-p2wpkh", name: "BIP49 (SegWit-compatible)" },
    { path: "m/84'/0'/0'", type: "p2wpkh", name: "BIP84 (Native SegWit)" },
    { path: "m/86'/0'/0'", type: "p2tr", name: "BIP86 (Taproot)" },
    { path: "m/0'/0'", type: "p2pkh", name: "BIP32 (Basic HD)" }
  ];
  
  const allAddresses: AddressInfo[] = [];
  
  // Generate addresses for each index
  for (let index = 0; index <= maxIndex; index++) {
    console.log(`Processing index ${index}...`);
    
    // Generate direct addresses (non-BIP paths)
    const directAddresses = generateDirectAddresses(index);
    allAddresses.push(...directAddresses);
    
    // Generate BIP path addresses
    for (const pathInfo of derivationPaths) {
      try {
        const pathAddresses = generateBIP32Addresses(
          index,
          pathInfo.path,
          pathInfo.type,
          maxAddressesPerPath
        );
        
        // Update address type with readable name
        pathAddresses.forEach(addr => {
          addr.addressType = pathInfo.name;
        });
        
        allAddresses.push(...pathAddresses);
      } catch (error) {
        console.error(`Error with path ${pathInfo.path} for index ${index}:`, error);
      }
    }
  }
  
  console.log(`Generated ${allAddresses.length} addresses to check balances for.`);
  
  // Check balances for all addresses
  const results: AddressInfo[] = [];
  
  for (const address of allAddresses) {
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const balanceInfo = await getAddressBalance(address.address);
      
      // Only include addresses with a balance
      if (balanceInfo.balance > 0) {
        results.push({
          ...address,
          balance: balanceInfo.balance,
          txCount: balanceInfo.txCount
        });
        
        console.log(`Found funds: ${address.address} has ${balanceInfo.balance} BTC`);
      }
    } catch (error) {
      console.error(`Error checking balance for ${address.address}:`, error);
    }
  }
  
  return results;
}

/**
 * Derive extended keys from a private key
 */
export function deriveExtendedKeys(index: number) {
  try {
    const privateKey = generatePrivateKeyFromIndex(index);
    const seed = createSeedFromPrivateKey(privateKey);
    
    // Create master node
    const master = bip32Factory.fromSeed(seed);
    
    // Derive paths
    const paths = [
      "m/44'/0'/0'",  // BIP44 (Legacy)
      "m/49'/0'/0'",  // BIP49 (SegWit-compatible)
      "m/84'/0'/0'",  // BIP84 (Native SegWit)
      "m/86'/0'/0'",  // BIP86 (Taproot)
      "m/0'/0'"       // BIP32 (Basic HD)
    ];
    
    const results: any[] = [];
    
    paths.forEach(path => {
      try {
        const derivedNode = master.derivePath(path);
        
        results.push({
          path,
          xpub: derivedNode.neutered().toBase58(),
          xpriv: derivedNode.toBase58()
        });
      } catch (error) {
        console.error(`Error deriving path ${path}:`, error);
      }
    });
    
    return results;
  } catch (error) {
    console.error('Error deriving extended keys:', error);
    return [];
  }
}