import { InsertPool, Pool } from "@shared/schema";
import { storage } from "../storage";
import { miningManager } from "./mining";

export class PoolManager {
  constructor() {}
  
  // Get all configured pools
  async getPools(): Promise<Pool[]> {
    return storage.getPools();
  }
  
  // Get active pool
  async getActivePool(): Promise<Pool | null> {
    const settings = await storage.getSettings();
    if (!settings || !settings.activePoolId) return null;
    
    const pool = await storage.getPool(settings.activePoolId);
    return pool || null;
  }
  
  // Add a new mining pool configuration
  async addPool(poolData: InsertPool): Promise<Pool> {
    return storage.createPool(poolData);
  }
  
  // Update a pool configuration
  async updatePool(poolId: number, poolData: Partial<InsertPool>): Promise<Pool> {
    return storage.updatePool(poolId, poolData);
  }
  
  // Switch to a different mining pool with resource allocation
  async switchPool(poolId: number, resourceAllocation: number = 1.0, isSecondaryPool: boolean = false): Promise<Pool> {
    const pool = await storage.getPool(poolId);
    if (!pool) {
      throw new Error(`Pool with id ${poolId} not found`);
    }
    
    // Update the settings
    const settings = await storage.getSettings();
    let updatedSettings = {
      ...settings,
      activePoolId: poolId
    };
    
    // If this is part of dual mining setup
    if (isSecondaryPool) {
      updatedSettings = {
        ...updatedSettings,
        secondaryPoolId: poolId,
        dualMiningEnabled: true
      };
    } else {
      // If not secondary and resource allocation is not 100%, 
      // this is the primary pool in dual mining
      if (resourceAllocation < 1.0) {
        updatedSettings.dualMiningEnabled = true;
      } else {
        // Regular single-pool mining
        updatedSettings.dualMiningEnabled = false;
        updatedSettings.secondaryPoolId = null;
      }
    }
    
    // Update settings in storage
    await storage.updateSettings(updatedSettings);
    
    // Update the active pool in the mining manager with resource allocation
    await miningManager.switchPool(poolId, resourceAllocation, isSecondaryPool);
    
    return pool;
  }
  
  // Remove a pool configuration
  async removePool(poolId: number): Promise<boolean> {
    const settings = await storage.getSettings();
    
    // Can't remove the active pool
    if (settings && settings.activePoolId === poolId) {
      throw new Error(`Cannot remove active pool. Switch to another pool first.`);
    }
    
    return storage.deletePool(poolId);
  }
  
  // Get pool status info
  async getPoolStatus(poolId: number): Promise<{
    pool: Pool;
    isActive: boolean;
    hashRateContribution: number;
  }> {
    const pool = await storage.getPool(poolId);
    if (!pool) {
      throw new Error(`Pool with id ${poolId} not found`);
    }
    
    const settings = await storage.getSettings();
    const isActive = settings?.activePoolId === poolId;
    
    // In a real implementation, this would get data from the actual pool API
    // For now, we'll return simulated data
    const hashRateContribution = isActive ? 100 : 0;
    
    return {
      pool,
      isActive,
      hashRateContribution
    };
  }
}

// Create singleton instance
export const poolManager = new PoolManager();
