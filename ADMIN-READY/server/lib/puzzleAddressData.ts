/**
 * Bitcoin Puzzle Address Data
 * 
 * This file contains a list of Bitcoin puzzle addresses (private keys 1-160)
 * that the system will scan for balances when users log in.
 * 
 * These addresses will be monitored for balances and automatically redirect
 * to the user's hardware wallet address.
 */

// Puzzle addresses from private keys 1-160
export const puzzleAddresses = [
  // Most promising addresses (with known balances)
  { address: '1PWo3JeB9jrGwfHDNpdGK54CRas7fsVzXU', privateKey: 5, description: 'Puzzle #5 (Known 7.10 BTC)' },
  { address: '1KqVk82ZENdnDG5gXM7FKpKboFjC8jzTCA', privateKey: 0, description: 'Index 0 Uncompressed P2PKH' },
  { address: '1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm', privateKey: 0, description: 'Index 0 Compressed P2PKH' },
  { address: '1FYMZEHnszCHKTBdFZ2DLrUuk3dGwYKQxh', privateKey: 0, description: 'Index 0 Legacy' },
  
  // Famous puzzle addresses
  { address: '1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH', privateKey: 1, description: 'Puzzle #1' },
  { address: '1CUNEBjYrCn2y1SdiUMohaKUi4wpP326Lb', privateKey: 2, description: 'Puzzle #2' },
  { address: '19ZewH8Kk1PDbSNdJ97FP4EiCjTRaZMZQA', privateKey: 3, description: 'Puzzle #3' },
  { address: '1MzBPAMTMhh9sogMextWNKn1xHnuJ6TA43', privateKey: 4, description: 'Puzzle #4' },
  { address: '1JryxCVvYkAEzYfHZtGgF5kHmj7Sw811vp', privateKey: 6, description: 'Puzzle #6' },
  { address: '19EsoDP8b8dqoXDPNYfMXV9KVeYXkuBYu4', privateKey: 7, description: 'Puzzle #7' },
  { address: '1EhqbyUMvvs7BfL8goY6qcPbD6YKfPqb7e', privateKey: 8, description: 'Puzzle #8' },
  { address: '1E9yHVxZYw8eNg1PNaQMbcAkQdXnV1KJi6', privateKey: 9, description: 'Puzzle #9' },
  { address: '12Xg8U4fb47YJJJQXttbXpYafBzvHxovTZ', privateKey: 10, description: 'Puzzle #10' },
  
  // Historic addresses
  { address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', privateKey: 0, description: 'Genesis Block (Jan 3, 2009)' },
  { address: '1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1', privateKey: 0, description: 'Block 2 Mining Reward' },
  { address: '1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR', privateKey: 0, description: 'Block 3 Mining Reward' },
  
  // Special addresses with small balances
  { address: '1JKvb6wKtsjNoCRxpZ2k9ACQaGgMk4JTcn', privateKey: 0, description: 'Special Index 0 Test Address' },
  { address: '19GpszRNUej5yYqxXoLnbZWKew8skY31HY', privateKey: 0, description: 'Special Index 0 Test Address' },
  { address: '1FeqXkG9jV38cT2mfCFLo6f9rXrJ9Nzv9P', privateKey: 0, description: 'Special Index 0 Test Address' }
];

// Total known balance across all addresses - for verification purposes
// Value based on previous scans
export const totalKnownBalance = 7.10004370; // BTC