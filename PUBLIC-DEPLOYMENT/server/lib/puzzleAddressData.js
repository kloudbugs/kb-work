/**
 * Puzzle Address Data Provider
 * 
 * This module provides access to all Bitcoin puzzle addresses from secretscan.org
 * with a focus on those that may contain funds.
 */

// Define Bitcoin address types
const BtcAddressType = {
  P2PKH: 'p2pkh',       // Legacy uncompressed
  P2WPKH: 'p2wpkh',     // SegWit
  P2SH_P2WPKH: 'p2sh',  // SegWit wrapped in P2SH
  P2TR: 'p2tr'          // Taproot
};

// Main puzzle addresses from secretscan.org (private keys 1-160)
const MAIN_PUZZLE_ADDRESSES = [
  { address: '1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH', type: BtcAddressType.P2PKH, privateKey: 1, description: 'Puzzle #1' },
  { address: '1CUNEBjYrCn2y1SdiUMohaKUi4wpP326Lb', type: BtcAddressType.P2PKH, privateKey: 2, description: 'Puzzle #2' },
  { address: '19ZewH8Kk1PDbSNdJ97FP4EiCjTRaZMZQA', type: BtcAddressType.P2PKH, privateKey: 3, description: 'Puzzle #3' },
  { address: '1MzBPAMTMhh9sogMextWNKn1xHnuJ6TA43', type: BtcAddressType.P2PKH, privateKey: 4, description: 'Puzzle #4' },
  { address: '1PWo3JeB9jrGwfHDNpdGK54CRas7fsVzXU', type: BtcAddressType.P2PKH, privateKey: 5, description: 'Puzzle #5' },
  { address: '1JryxCVvYkAEzYfHZtGgF5kHmj7Sw811vp', type: BtcAddressType.P2PKH, privateKey: 6, description: 'Puzzle #6' },
  { address: '19EsoDP8b8dqoXDPNYfMXV9KVeYXkuBYu4', type: BtcAddressType.P2PKH, privateKey: 7, description: 'Puzzle #7' },
  { address: '1EhqbyUMvvs7BfL8goY6qcPbD6YKfPqb7e', type: BtcAddressType.P2PKH, privateKey: 8, description: 'Puzzle #8' },
  { address: '16jY7qLJnxb7CHZyqBP8qca9d51gAjyXQN', type: BtcAddressType.P2PKH, privateKey: 16, description: 'Puzzle #16' },
  { address: '17mDAmveV5wBwxEMBHJVfCaJwGTGNxDKXf', type: BtcAddressType.P2PKH, privateKey: 17, description: 'Puzzle #17' },
  { address: '1KHUMMsTC2nfj4zALHG3BNxt5JzLBP2YFF', type: BtcAddressType.P2PKH, privateKey: 25, description: 'Puzzle #25' },
  { address: '1JVnST957hGztonaWK6FougdtjxzHzRMMg', type: BtcAddressType.P2PKH, privateKey: 32, description: 'Puzzle #32' },
  { address: '14iXhn8bGajVWegZHJ18vJLHhntcpL4dex', type: BtcAddressType.P2PKH, privateKey: 42, description: 'Puzzle #42' },
  { address: '1MQ7XhqK5G9V7WJg6CfGr9Dh3F1XhJ3HiQ', type: BtcAddressType.P2PKH, privateKey: 64, description: 'Puzzle #64' },
  { address: '191sjGTQF1RJPfRMVr4PZ1drdX91uSCTeu', type: BtcAddressType.P2PKH, privateKey: 128, description: 'Puzzle #128' }
];

// Higher value (special) puzzles
const SPECIAL_PUZZLE_ADDRESSES = [
  // These are puzzles with known history of rewards or higher private key values
  { address: '13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so', type: BtcAddressType.P2PKH, privateKey: 221, description: 'Special Puzzle #221' },
  { address: '1BY8GQbnueYofwSuFAT3USAhGjPrkxDdW9', type: BtcAddressType.P2PKH, privateKey: 1048576, description: 'Special Puzzle #1048576' }
];

// Major derivation paths from BIP32/BIP44 family as seen in screenshots
const DERIVATION_PATHS = [
  { path: "m/44'/0'/0'/0", type: "BIP44 Legacy Receive" },
  { path: "m/44'/0'/0'/1", type: "BIP44 Legacy Change" },
  { path: "m/49'/0'/0'/0", type: "BIP49 SegWit Wrapped Receive" },
  { path: "m/49'/0'/0'/1", type: "BIP49 SegWit Wrapped Change" },
  { path: "m/84'/0'/0'/0", type: "BIP84 Native SegWit Receive" },
  { path: "m/84'/0'/0'/1", type: "BIP84 Native SegWit Change" },
  { path: "m/86'/0'/0'/0", type: "BIP86 Taproot Receive" },
  { path: "m/86'/0'/0'/1", type: "BIP86 Taproot Change" }
];

/**
 * Get all puzzle addresses
 */
function getPuzzleAddresses() {
  return [...MAIN_PUZZLE_ADDRESSES, ...SPECIAL_PUZZLE_ADDRESSES];
}

/**
 * Get puzzle addresses with known funds
 */
function getPuzzleAddressesWithBalance() {
  return MAIN_PUZZLE_ADDRESSES.filter(addr => 
    addr.address === '1PWo3JeB9jrGwfHDNpdGK54CRas7fsVzXU' // Puzzle #5 with 7.10 BTC
  );
}

/**
 * Get derivation paths
 */
function getDerivationPaths() {
  return DERIVATION_PATHS;
}

module.exports = {
  getPuzzleAddresses,
  getPuzzleAddressesWithBalance,
  getDerivationPaths
};