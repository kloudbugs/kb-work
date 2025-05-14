/**
 * ASIC Miner Module
 * 
 * This module handles ASIC miner deployment, configuration, and management.
 * It prepares USB drives with mining software and configurations for popular ASIC hardware.
 */

import fs from 'fs';
import path from 'path';
import { storage } from '../storage';

// Supported ASIC miner types
export enum ASICType {
  ANTMINER_S9 = 'antminer_s9',
  ANTMINER_S17 = 'antminer_s17',
  ANTMINER_S19 = 'antminer_s19',
  ANTMINER_S19_PRO = 'antminer_s19_pro',
  ANTMINER_S19J_PRO = 'antminer_s19j_pro',
  ANTMINER_S19_XP = 'antminer_s19_xp',
  WHATSMINER_M20 = 'whatsminer_m20',
  WHATSMINER_M30 = 'whatsminer_m30',
  WHATSMINER_M30S_PLUS_PLUS = 'whatsminer_m30s++',
  WHATSMINER_M50 = 'whatsminer_m50',
  AVALON_A9 = 'avalon_a9',
  AVALON_A1246 = 'avalon_a1246',
  AVALON_A1366 = 'avalon_a1366',
  INNOSILICON_T3 = 'innosilicon_t3'
}

// Supported mining software
export enum MinerSoftware {
  CGMINER = 'cgminer',
  BFGMINER = 'bfgminer',
  ASICBOOST = 'asicboost',
  BRAIINS_OS = 'braiins_os'
}

// Interface for ASIC miner configuration
interface ASICConfig {
  minerType: ASICType;
  software: MinerSoftware;
  pool: any; // Pool information
  hashrate: number;
  powerConsumption: number;
  frequency: number;
  fanSpeed: number;
  overclockEnabled: boolean;
  walletAddress: string;
}

// ASIC miner hardware specifications
const ASIC_SPECS: Record<ASICType, {
  name: string;
  hashrate: number;
  power: number;
  algorithm: string;
  firmware: MinerSoftware;
}> = {
  [ASICType.ANTMINER_S9]: {
    name: 'Antminer S9',
    hashrate: 14,
    power: 1350,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.CGMINER
  },
  [ASICType.ANTMINER_S17]: {
    name: 'Antminer S17',
    hashrate: 56,
    power: 2520,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.CGMINER
  },
  [ASICType.ANTMINER_S19]: {
    name: 'Antminer S19',
    hashrate: 95,
    power: 3250,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.CGMINER
  },
  [ASICType.ANTMINER_S19_PRO]: {
    name: 'Antminer S19 Pro',
    hashrate: 110,
    power: 3250,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.BRAIINS_OS
  },
  [ASICType.ANTMINER_S19J_PRO]: {
    name: 'Antminer S19J Pro',
    hashrate: 104,
    power: 3068,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.BRAIINS_OS
  },
  [ASICType.ANTMINER_S19_XP]: {
    name: 'Antminer S19 XP',
    hashrate: 140,
    power: 3010,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.BRAIINS_OS
  },
  [ASICType.WHATSMINER_M20]: {
    name: 'Whatsminer M20',
    hashrate: 68,
    power: 3360,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.CGMINER
  },
  [ASICType.WHATSMINER_M30]: {
    name: 'Whatsminer M30',
    hashrate: 88,
    power: 3344,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.CGMINER
  },
  [ASICType.WHATSMINER_M30S_PLUS_PLUS]: {
    name: 'Whatsminer M30S++',
    hashrate: 112,
    power: 3472,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.CGMINER
  },
  [ASICType.WHATSMINER_M50]: {
    name: 'Whatsminer M50',
    hashrate: 126,
    power: 3276,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.CGMINER
  },
  [ASICType.AVALON_A9]: {
    name: 'Avalon A9',
    hashrate: 20,
    power: 1720,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.CGMINER
  },
  [ASICType.AVALON_A1246]: {
    name: 'Avalon A1246',
    hashrate: 90,
    power: 3420,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.CGMINER
  },
  [ASICType.AVALON_A1366]: {
    name: 'Avalon A1366',
    hashrate: 108,
    power: 3500,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.CGMINER
  },
  [ASICType.INNOSILICON_T3]: {
    name: 'Innosilicon T3',
    hashrate: 43,
    power: 2100,
    algorithm: 'SHA-256',
    firmware: MinerSoftware.CGMINER
  }
};

// Singleton instance 
class ASICMiner {
  private activeConfig: ASICConfig | null = null;
  private isInitialized: boolean = false;

  /**
   * Check if ASIC mining module is initialized
   */
  getIsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Check if any ASIC miner is configured
   */
  hasActiveConfig(): boolean {
    return this.activeConfig !== null;
  }

  /**
   * Initialize ASIC mining module
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing ASIC mining module with default configuration...');
      
      // Get the default pool (highest priority)
      const pools = await storage.getPools();
      const defaultPool = pools.find(pool => pool.priority === 1) || pools[0];
      
      if (!defaultPool) {
        console.warn('No mining pool available for initial ASIC configuration. The ASIC module is initialized without active config.');
        this.isInitialized = true;
        return true;
      }
      
      // Get default wallet address from settings
      const settings = await storage.getSettings();
      const walletAddress = settings?.walletAddress || '';
      
      // Set default ASIC configuration
      this.activeConfig = {
        minerType: ASICType.ANTMINER_S19, // Default to a popular model
        software: ASIC_SPECS[ASICType.ANTMINER_S19].firmware,
        pool: defaultPool,
        hashrate: ASIC_SPECS[ASICType.ANTMINER_S19].hashrate,
        powerConsumption: ASIC_SPECS[ASICType.ANTMINER_S19].power,
        frequency: 800, // Default frequency
        fanSpeed: 70,   // Default fan speed (%)
        overclockEnabled: false,
        walletAddress
      };
      
      this.isInitialized = true;
      console.log('ASIC mining module initialized successfully with default configuration');
      return true;
    } catch (error) {
      console.error('Error initializing ASIC mining module:', error);
      // Still mark as initialized to prevent repeated initialization attempts
      this.isInitialized = true;
      return false;
    }
  }

  /**
   * Generate configuration file for a specific ASIC miner
   */
  generateMinerConfig(minerType: ASICType, pool: any, walletAddress: string): string {
    const specs = ASIC_SPECS[minerType];
    const firmware = specs.firmware;
    
    // Common configuration parameters
    let user = pool.username;
    
    // Initialize configuration parameters
    const configParams = {
      url: pool.url,
      user: user,
      pass: pool.password || 'x',
      algo: pool.algorithm || 'sha256',
      api_listen: true,
      api_port: 4028,
      api_allow: 'W:0/0',
      freq: '800'
    };
    
    // For Unmineable pool, use the proper mining key format
    if (pool.url && pool.url.includes('unmineable.com')) {
      // Get the mining key from the pool settings or default to the wallet address format
      const miningKey = pool.miningKey || null;
      
      if (miningKey) {
        // If we have a mining key from Unmineable, use it directly (numeric format)
        // Format: "1735896864" (just the numeric key)
        configParams.user = miningKey;
        console.log(`Using Unmineable Mining Key format: user=${miningKey}, pass=x`);
      } else {
        // Fallback to BTC:wallet_address format if no mining key is available
        // Per latest Unmineable documentation:
        // URL: stratum+tcp://sha256.unmineable.com:3333
        // Worker: BTC:YOUR_ADDRESS (worker name is optional)
        // Password: x
        configParams.user = `BTC:${walletAddress}`;
        console.log(`Using Unmineable BTC:ADDRESS format: user=${configParams.user}, pass=x`);
      }
      
      // Standard password is "x"
      configParams.pass = "x";
    } else if (walletAddress) {
      // For other pools, append wallet address to username
      configParams.user = `${pool.username}.${walletAddress}`;
    }
    
    let configContent = '';
    
    switch (firmware) {
      case MinerSoftware.CGMINER:
        configContent = `{
  "pools": [
    {
      "url": "${configParams.url}",
      "user": "${configParams.user}",
      "pass": "${configParams.pass}"
    }
  ],
  "api-listen": true,
  "api-port": "${configParams.api_port}",
  "api-allow": "${configParams.api_allow}"
}`;
        break;
        
      case MinerSoftware.BRAIINS_OS:
        configContent = `
# Braiins OS+ configuration for ${specs.name}
[format]
version=1

[pool_group]
name=Default
quota=1

[pool_group.pool]
url=${configParams.url}
user=${configParams.user}
password=${configParams.pass}

[hash_chain_global]
asic_boost=true
frequency=${configParams.freq}
`;
        break;
        
      default:
        configContent = `# Configuration for ${specs.name}
pool=${configParams.url}
user=${configParams.user}
pass=${configParams.pass}
api_listen=true
api_port=${configParams.api_port}
`;
    }
    
    return configContent;
  }

  /**
   * Deploy mining configuration to virtual USB drive
   */
  async deployMinerConfig(minerType: ASICType, pool: any, walletAddress: string): Promise<boolean> {
    try {
      const config = this.generateMinerConfig(minerType, pool, walletAddress);
      
      // In a real implementation, this would write to a USB drive or download a file
      // For now, we just return true to simulate success
      
      console.log(`Successfully generated config for ${ASIC_SPECS[minerType].name}`);
      console.log(config);
      
      return true;
    } catch (error) {
      console.error('Error deploying miner config:', error);
      return false;
    }
  }

  /**
   * Generate complete ASIC mining USB package
   */
  async generateMiningUSB(minerType: ASICType, pool: any, walletAddress: string): Promise<boolean> {
    try {
      // In a real implementation, this would prepare a complete USB package with mining software and config
      
      const success = await this.deployMinerConfig(minerType, pool, walletAddress);
      if (!success) {
        return false;
      }
      
      console.log(`Generated mining USB package for ${ASIC_SPECS[minerType].name}`);
      return true;
    } catch (error) {
      console.error('Error generating mining USB package:', error);
      return false;
    }
  }

  /**
   * Get information about an ASIC miner type
   */
  getASICInfo(minerType: ASICType): any {
    const specs = ASIC_SPECS[minerType];
    return {
      type: minerType,
      name: specs.name,
      hashrate: specs.hashrate,
      powerConsumption: specs.power,
      algorithm: specs.algorithm,
      firmware: specs.firmware
    };
  }

  /**
   * List all supported ASIC miners
   */
  listSupportedMiners(): Array<{ type: string, name: string, hashrate: number }> {
    return Object.entries(ASIC_SPECS).map(([type, specs]) => ({
      type,
      name: specs.name,
      hashrate: specs.hashrate
    }));
  }

  /**
   * Generate unified multi-miner USB package with configurations for multiple ASIC miners
   */
  async generateMultiMinerUSB(minerTypes: string[], pool: any, walletAddress: string): Promise<boolean> {
    try {
      // In a real implementation, this would prepare a unified package with configs for multiple miners
      
      console.log(`Generating multi-miner USB package for ${minerTypes.length} miner types`);
      
      // For Unmineable, handle the format based on wallet address
      if (pool.url && pool.url.includes('unmineable.com')) {
        // Per latest Unmineable documentation for SHA-256 miners:
        // Format: BTC:wallet_address (worker name is optional)
        console.log(`Using Unmineable SHA-256 format: user=BTC:${walletAddress}, pass=x for all ASIC miners`);
      }
      
      for (const minerType of minerTypes) {
        const success = await this.deployMinerConfig(minerType as ASICType, pool, walletAddress);
        if (!success) {
          console.error(`Failed to generate config for ${minerType}`);
          // Continue with other configs even if one fails
        }
      }
      
      console.log('Generated unified multi-miner USB package');
      return true;
    } catch (error) {
      console.error('Error generating multi-miner USB package:', error);
      return false;
    }
  }

  /**
   * Configure an ASIC miner
   */
  async configureASICMiner(minerType: ASICType): Promise<boolean> {
    try {
      // Get the default pool (highest priority)
      const pools = await storage.getPools();
      const defaultPool = pools.find(pool => pool.priority === 1) || pools[0];
      
      if (!defaultPool) {
        console.error('No mining pool available for ASIC configuration');
        return false;
      }
      
      // Get user's wallet address
      const settings = await storage.getSettings();
      const walletAddress = settings?.walletAddress || '';
      
      // For Unmineable, log that we're using the correct mining key format
      if (defaultPool.url && defaultPool.url.includes('unmineable.com')) {
        // Check if we have a mining key (numeric value)
        const miningKey = defaultPool.miningKey || null;
        
        if (miningKey) {
          // If we have a mining key from Unmineable, use it directly (numeric format)
          console.log(`ASIC miner will use Unmineable Mining Key format: user=${miningKey}, pass=x`);
        } else {
          // Fallback to BTC:wallet_address format if no mining key is available
          // Per latest Unmineable documentation for SHA-256 miners:
          // URL: stratum+tcp://sha256.unmineable.com:3333
          // Worker: BTC:YOUR_ADDRESS (worker name is optional)
          // Password: x
          console.log(`ASIC miner will use Unmineable SHA-256 format: user=BTC:${walletAddress}, pass=x`);
        }
      }
      
      this.activeConfig = {
        minerType,
        software: ASIC_SPECS[minerType].firmware,
        pool: defaultPool,
        hashrate: ASIC_SPECS[minerType].hashrate,
        powerConsumption: ASIC_SPECS[minerType].power,
        frequency: 800, // Default frequency
        fanSpeed: 70,   // Default fan speed (%)
        overclockEnabled: false,
        walletAddress
      };
      
      // Make sure to set isInitialized to true when configuring ASIC miner
      this.isInitialized = true;
      
      console.log(`Configured ASIC miner: ${ASIC_SPECS[minerType].name}`);
      return true;
    } catch (error) {
      console.error('Error configuring ASIC miner:', error);
      return false;
    }
  }
}

// Export as a singleton
export const asicMiner = new ASICMiner();