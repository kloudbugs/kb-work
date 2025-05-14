/**
 * Bitcoin Private Key to Address Derivation
 * 
 * This utility derives the Bitcoin address from a private key.
 * It supports multiple address formats.
 */

import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);

/**
 * Derive all possible Bitcoin address formats from a private key
 * @param privateKeyInput Private key in various formats (WIF, hex, etc)
 * @returns Object containing various Bitcoin address formats
 */
export function deriveAddressesFromPrivateKey(privateKeyInput: string) {
  try {
    let keyPair;
    
    // Try different approaches to handle the private key
    try {
      // First, try to parse as WIF (most common format)
      keyPair = ECPair.fromWIF(privateKeyInput, bitcoin.networks.bitcoin);
    } catch (wifError: any) {
      try {
        // If the key is array-like (e.g., '[1,2,3...]'), parse it
        if (privateKeyInput.startsWith('[') && privateKeyInput.endsWith(']')) {
          try {
            console.log('Detected array-format private key, parsing...');
            const keyArray = JSON.parse(privateKeyInput);
            if (Array.isArray(keyArray) && keyArray.every(n => typeof n === 'number' && n >= 0 && n <= 255)) {
              const privateKeyBuffer = Buffer.from(keyArray);
              keyPair = ECPair.fromPrivateKey(privateKeyBuffer, { network: bitcoin.networks.bitcoin });
              console.log('Successfully parsed array-format private key');
            } else {
              throw new Error('Invalid array format for private key');
            }
          } catch (arrayError: any) {
            console.error('Failed to parse array-format private key:', arrayError.message);
            throw arrayError;
          }
        } 
        // If not WIF, try to parse as hex
        else {
          if (privateKeyInput.startsWith('0x')) {
            privateKeyInput = privateKeyInput.substring(2);
          }
          
          // Ensure hex is valid
          if (!/^[0-9a-fA-F]{64}$/.test(privateKeyInput)) {
            throw new Error('Invalid hex format for private key');
          }
          
          const privateKeyBuffer = Buffer.from(privateKeyInput, 'hex');
          keyPair = ECPair.fromPrivateKey(privateKeyBuffer, { network: bitcoin.networks.bitcoin });
        }
      } catch (hexError: any) {
        console.error('Error parsing private key:', hexError.message);
        throw new Error(`Unable to parse private key: ${wifError.message}`);
      }
    }
    
    // Derive P2PKH legacy address (starts with 1)
    const p2pkhAddress = bitcoin.payments.p2pkh({ 
      pubkey: keyPair.publicKey,
      network: bitcoin.networks.bitcoin
    }).address;
    
    // Derive P2SH wrapped SegWit address (starts with 3)
    const p2shAddress = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({ 
        pubkey: keyPair.publicKey,
        network: bitcoin.networks.bitcoin
      }),
      network: bitcoin.networks.bitcoin
    }).address;
    
    // Derive Native SegWit address (starts with bc1q)
    const p2wpkhAddress = bitcoin.payments.p2wpkh({
      pubkey: keyPair.publicKey,
      network: bitcoin.networks.bitcoin
    }).address;
    
    // Try to derive Taproot address (starts with bc1p) - may not be supported in all bitcoinjs-lib versions
    let taprootAddress = null;
    try {
      if (bitcoin.payments.p2tr) {
        taprootAddress = bitcoin.payments.p2tr({
          internalPubkey: keyPair.publicKey.slice(1, 33),
          network: bitcoin.networks.bitcoin
        }).address;
      }
    } catch (e) {
      // Taproot not supported in this version, ignore
    }
    
    return {
      legacy: p2pkhAddress,
      segwitP2SH: p2shAddress,
      segwitNative: p2wpkhAddress,
      taproot: taprootAddress,
      // The default address to use (Native SegWit is recommended for most modern wallets)
      default: p2wpkhAddress
    };
  } catch (error: any) {
    console.error(`Error deriving addresses: ${error.message || error}`);
    throw new Error(`Failed to derive address: ${error.message}`);
  }
}

/**
 * Display Bitcoin address derived from the private key in the environment
 */
export function displayPrivateKeyAddress() {
  try {
    const privateKey = process.env.BITCOIN_PRIVATE_KEY;
    if (!privateKey) {
      console.log('No Bitcoin private key found in environment variables');
      return null;
    }
    
    console.log('Attempting to derive Bitcoin addresses from private key...');
    
    // Try to handle various private key formats
    let cleanPrivateKey = privateKey.trim();
    
    // Check if it's a raw number (convert to hex)
    if (/^\d+$/.test(cleanPrivateKey)) {
      console.log('Detected numeric private key, converting to hex');
      const numericKey = BigInt(cleanPrivateKey);
      cleanPrivateKey = numericKey.toString(16).padStart(64, '0');
    }
    
    const addresses = deriveAddressesFromPrivateKey(cleanPrivateKey);
    
    console.log('\n=== Bitcoin Addresses Derived From Your Private Key ===');
    console.log(`Legacy Address (P2PKH):         ${addresses.legacy}`);
    console.log(`SegWit Address (P2SH-P2WPKH):   ${addresses.segwitP2SH}`);
    console.log(`Native SegWit (P2WPKH):         ${addresses.segwitNative}`);
    
    if (addresses.taproot) {
      console.log(`Taproot Address (P2TR):        ${addresses.taproot}`);
    }
    
    console.log('=====================================================\n');
    
    return addresses;
  } catch (error: any) {
    console.error(`Error displaying private key address: ${error.message || error}`);
    return null;
  }
}