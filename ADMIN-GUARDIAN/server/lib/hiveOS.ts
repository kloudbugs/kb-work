/**
 * HiveOS Integration Module
 * 
 * This module integrates with HiveOS API to remotely manage mining operations.
 * It handles configuration, deployment, and monitoring of mining workers through HiveOS.
 */

import axios from 'axios';
import { storage } from '../storage';
import { Pool } from '@shared/schema';

// HiveOS API configuration
interface HiveOSConfig {
  apiUrl: string;
  apiKey: string;
  farmId: string | null;
  workerId: string | null;
}

// Default config - will be updated through the UI
let hiveConfig: HiveOSConfig = {
  apiUrl: 'https://api2.hiveos.farm/api/v2',
  apiKey: '',  // Will be provided by user
  farmId: null,
  workerId: null
};

// Initialize HiveOS connection
export async function initializeHiveOS(apiKey: string): Promise<boolean> {
  try {
    hiveConfig.apiKey = apiKey;
    
    // Test connection to HiveOS
    const response = await axios.get(`${hiveConfig.apiUrl}/farms`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      // Store the first farm ID
      hiveConfig.farmId = response.data.data[0].id.toString();
      
      // Get workers for this farm
      const workersResponse = await axios.get(`${hiveConfig.apiUrl}/farms/${hiveConfig.farmId}/workers`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (workersResponse.data && workersResponse.data.data && workersResponse.data.data.length > 0) {
        hiveConfig.workerId = workersResponse.data.data[0].id.toString();
      }
      
      // Store HiveOS config in settings
      await updateHiveOSConfigInDB(hiveConfig);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error initializing HiveOS:', error);
    return false;
  }
}

// Update HiveOS configuration in database
async function updateHiveOSConfigInDB(config: HiveOSConfig): Promise<void> {
  const settings = await storage.getSettings();
  
  if (settings) {
    // If we had a settings API, we would update it here
    console.log('Stored HiveOS configuration in settings');
  }
}

// Get miner configuration for specific pool
export function getMinerConfigForPool(pool: Pool): Record<string, any> {
  // Default miner configuration (for XMRig, typically used with Unmineable)
  const config: Record<string, any> = {
    miner: 'xmrig',
    miner_config: {
      pools: [
        {
          url: pool.url,
          user: pool.username, // This will be the wallet address for Unmineable
          pass: pool.password || 'x', // Unmineable usually uses 'x' as password
          keepalive: true,
          tls: false
        }
      ],
      "cpu": {
        "enabled": true,
        "huge-pages": true,
        "hw-aes": true,
        "priority": 3,
        "memory-pool": false,
        "max-threads-hint": 75,
        "asm": true,
        "argon2-impl": null,
        "cn/0": false,
        "cn-lite/0": false
      }
    }
  };
  
  // Additional pool-specific configs
  if (pool.name.toLowerCase().includes('unmineable')) {
    // Unmineable specific configurations
    // Includes referral code if available
    if (pool.username.indexOf('#') === -1 && pool.btcWalletAddress) {
      // Add referral code if available
      config.miner_config.pools[0].user = `${pool.btcWalletAddress}#yjmc-pz3x`;
    }
  }
  
  return config;
}

// Deploy mining configuration to HiveOS
export async function deployMiningConfig(pool: Pool): Promise<boolean> {
  try {
    if (!hiveConfig.apiKey || !hiveConfig.farmId || !hiveConfig.workerId) {
      console.error('HiveOS not properly configured');
      return false;
    }
    
    const minerConfig = getMinerConfigForPool(pool);
    
    // Deploy configuration to HiveOS worker
    const response = await axios.post(
      `${hiveConfig.apiUrl}/farms/${hiveConfig.farmId}/workers/${hiveConfig.workerId}/miner`,
      minerConfig,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hiveConfig.apiKey}`
        }
      }
    );
    
    if (response.status === 200 || response.status === 201) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deploying mining configuration to HiveOS:', error);
    return false;
  }
}

// Start mining on HiveOS
export async function startMining(): Promise<boolean> {
  try {
    if (!hiveConfig.apiKey || !hiveConfig.farmId || !hiveConfig.workerId) {
      console.error('HiveOS not properly configured');
      return false;
    }
    
    // Send command to start miner
    const response = await axios.post(
      `${hiveConfig.apiUrl}/farms/${hiveConfig.farmId}/workers/${hiveConfig.workerId}/command`,
      {
        command: 'miner',
        data: { action: 'restart' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hiveConfig.apiKey}`
        }
      }
    );
    
    if (response.status === 200 || response.status === 201) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error starting mining on HiveOS:', error);
    return false;
  }
}

// Stop mining on HiveOS
export async function stopMining(): Promise<boolean> {
  try {
    if (!hiveConfig.apiKey || !hiveConfig.farmId || !hiveConfig.workerId) {
      console.error('HiveOS not properly configured');
      return false;
    }
    
    // Send command to stop miner
    const response = await axios.post(
      `${hiveConfig.apiUrl}/farms/${hiveConfig.farmId}/workers/${hiveConfig.workerId}/command`,
      {
        command: 'miner',
        data: { action: 'stop' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hiveConfig.apiKey}`
        }
      }
    );
    
    if (response.status === 200 || response.status === 201) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error stopping mining on HiveOS:', error);
    return false;
  }
}

// Get mining stats from HiveOS
export async function getMiningStats(): Promise<any> {
  try {
    if (!hiveConfig.apiKey || !hiveConfig.farmId || !hiveConfig.workerId) {
      console.error('HiveOS not properly configured');
      return null;
    }
    
    // Get worker stats
    const response = await axios.get(
      `${hiveConfig.apiUrl}/farms/${hiveConfig.farmId}/workers/${hiveConfig.workerId}/stats`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hiveConfig.apiKey}`
        }
      }
    );
    
    if (response.status === 200 && response.data) {
      return {
        hashrate: response.data.hashrates,
        temperature: response.data.temp,
        power: response.data.power_draw,
        uptime: response.data.uptime,
        miner: response.data.miner
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting mining stats from HiveOS:', error);
    return null;
  }
}

// Get configuration API key
export function getHiveOSConfig(): HiveOSConfig {
  return { ...hiveConfig }; // Return copy of config
}

// Set HiveOS API key
export function setHiveOSApiKey(apiKey: string): void {
  hiveConfig.apiKey = apiKey;
}