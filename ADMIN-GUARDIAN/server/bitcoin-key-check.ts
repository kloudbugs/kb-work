/**
 * Bitcoin Private Key Analysis Tool
 * 
 * This utility helps analyze a private key and attempts to derive
 * Bitcoin addresses from various formats.
 */

import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);

function analyzePrivateKey(privateKeyInput: string) {
  console.log(`\nAnalyzing private key: ${privateKeyInput.substring(0, 6)}...${privateKeyInput.substring(privateKeyInput.length - 4)}`);
  
  // Step 1: Basic format checking
  console.log("\n=== FORMAT ANALYSIS ===");
  
  // Check if it's a WIF (Wallet Import Format)
  const wifRegex = /^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/;
  const isWIF = wifRegex.test(privateKeyInput);
  console.log(`WIF format: ${isWIF ? 'LIKELY' : 'NO'}`);
  
  // Check if it's hex
  const hexRegex = /^(0x)?[0-9a-fA-F]{64}$/;
  const isHex = hexRegex.test(privateKeyInput);
  console.log(`HEX format: ${isHex ? 'YES' : 'NO'}`);
  
  // Check if it's base64
  const base64Regex = /^[A-Za-z0-9+/]{43}=$/;
  const isBase64 = base64Regex.test(privateKeyInput);
  console.log(`Base64 format: ${isBase64 ? 'LIKELY' : 'NO'}`);
  
  // Check if it's a number
  const isNumeric = /^\d+$/.test(privateKeyInput);
  console.log(`Numeric format: ${isNumeric ? 'YES' : 'NO'}`);
  
  // Check if it's JSON array format
  let isArray = false;
  try {
    if (privateKeyInput.startsWith('[') && privateKeyInput.endsWith(']')) {
      const arr = JSON.parse(privateKeyInput);
      isArray = Array.isArray(arr);
      if (isArray) {
        console.log(`Array format: YES (${arr.length} elements)`);
      }
    } else {
      console.log(`Array format: NO`);
    }
  } catch {
    console.log(`Array format: NO`);
  }
  
  // Step 2: Attempt various parsing methods
  console.log("\n=== CONVERSION ATTEMPTS ===");
  
  try {
    // 1. Try WIF directly
    try {
      console.log("\nAttempting WIF import...");
      const keyPair = ECPair.fromWIF(privateKeyInput, bitcoin.networks.bitcoin);
      console.log("SUCCESS: WIF imported successfully!");
      
      // Generate addresses
      const p2pkhAddress = bitcoin.payments.p2pkh({ 
        pubkey: keyPair.publicKey,
        network: bitcoin.networks.bitcoin
      }).address;
      
      console.log(`Legacy address: ${p2pkhAddress}`);
      return;
    } catch (e: any) {
      console.log(`WIF import failed: ${e.message}`);
    }
    
    // 2. Try as hex
    if (privateKeyInput.startsWith('0x')) {
      privateKeyInput = privateKeyInput.substring(2);
    }
    
    if (hexRegex.test(privateKeyInput)) {
      try {
        console.log("\nAttempting HEX import...");
        const privateKeyBuffer = Buffer.from(privateKeyInput, 'hex');
        const keyPair = ECPair.fromPrivateKey(privateKeyBuffer, { network: bitcoin.networks.bitcoin });
        console.log("SUCCESS: HEX imported successfully!");
        
        // Generate addresses
        const p2pkhAddress = bitcoin.payments.p2pkh({ 
          pubkey: keyPair.publicKey,
          network: bitcoin.networks.bitcoin
        }).address;
        
        console.log(`Legacy address: ${p2pkhAddress}`);
        return;
      } catch (e: any) {
        console.log(`HEX import failed: ${e.message}`);
      }
    }
    
    // 3. Try as base64
    if (isBase64) {
      try {
        console.log("\nAttempting Base64 import...");
        const privateKeyBuffer = Buffer.from(privateKeyInput, 'base64');
        const keyPair = ECPair.fromPrivateKey(privateKeyBuffer, { network: bitcoin.networks.bitcoin });
        console.log("SUCCESS: Base64 imported successfully!");
        
        // Generate addresses
        const p2pkhAddress = bitcoin.payments.p2pkh({ 
          pubkey: keyPair.publicKey,
          network: bitcoin.networks.bitcoin
        }).address;
        
        console.log(`Legacy address: ${p2pkhAddress}`);
        return;
      } catch (e: any) {
        console.log(`Base64 import failed: ${e.message}`);
      }
    }
    
    // 4. Try as numeric (convert to hex)
    if (isNumeric) {
      try {
        console.log("\nAttempting Numeric import...");
        const numericKey = BigInt(privateKeyInput);
        const hexKey = numericKey.toString(16).padStart(64, '0');
        console.log(`Converted to HEX: ${hexKey.substring(0, 6)}...${hexKey.substring(hexKey.length - 4)}`);
        
        const privateKeyBuffer = Buffer.from(hexKey, 'hex');
        const keyPair = ECPair.fromPrivateKey(privateKeyBuffer, { network: bitcoin.networks.bitcoin });
        console.log("SUCCESS: Numeric key imported successfully!");
        
        // Generate addresses
        const p2pkhAddress = bitcoin.payments.p2pkh({ 
          pubkey: keyPair.publicKey,
          network: bitcoin.networks.bitcoin
        }).address;
        
        console.log(`Legacy address: ${p2pkhAddress}`);
        return;
      } catch (e: any) {
        console.log(`Numeric import failed: ${e.message}`);
      }
    }
    
    // 5. Try as array format
    if (isArray) {
      try {
        console.log("\nAttempting Array import...");
        const keyArray = JSON.parse(privateKeyInput);
        if (Array.isArray(keyArray) && keyArray.every(n => typeof n === 'number' && n >= 0 && n <= 255)) {
          const privateKeyBuffer = Buffer.from(keyArray);
          const keyPair = ECPair.fromPrivateKey(privateKeyBuffer, { network: bitcoin.networks.bitcoin });
          console.log("SUCCESS: Array imported successfully!");
          
          // Generate addresses
          const p2pkhAddress = bitcoin.payments.p2pkh({ 
            pubkey: keyPair.publicKey,
            network: bitcoin.networks.bitcoin
          }).address;
          
          console.log(`Legacy address: ${p2pkhAddress}`);
          return;
        }
      } catch (e: any) {
        console.log(`Array import failed: ${e.message}`);
      }
    }
    
    // If all attempts failed
    console.log("\nAll import methods failed. Could not derive Bitcoin address from the provided key.");
    
  } catch (error: any) {
    console.error(`Error analyzing private key: ${error.message}`);
  }
}

// Get the key from environment
const privateKey = process.env.BITCOIN_PRIVATE_KEY;

if (!privateKey) {
  console.log('No Bitcoin private key found in environment variables');
} else {
  analyzePrivateKey(privateKey);
}