/**
 * Secure Mining Settings
 * 
 * This module provides ONLY the mining address configuration with no private keys.
 * This is the ONLY file required for mining operations.
 */

// Mining address (this is the only thing needed for mining)
export const MINING_ADDRESS = 'bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps';

// Pool connections settings
export const MINING_POOLS = [
  {
    name: 'Unmineable',
    url: 'stratum+tcp://rx.unmineable.com:3333',
    worker: 'KLOUD-BUGS',
    algorithm: 'RandomX',
    fee: 0.75
  },
  {
    name: 'SlushPool',
    url: 'stratum+tcp://btc.slushpool.com:3333',
    worker: 'KLOUD-BUGS',
    algorithm: 'SHA-256',
    fee: 2.0
  },
  {
    name: 'F2Pool',
    url: 'stratum+tcp://btc.f2pool.com:3333',
    worker: 'KLOUD-BUGS',
    algorithm: 'SHA-256',
    fee: 2.5
  }
];

// Log security notice when this module is loaded
console.log('[SECURITY] Secure mining settings loaded - Only contains mining address');
console.log('[SECURITY] No private keys or wallet scanning functionality present');