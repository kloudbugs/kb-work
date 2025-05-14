import { EventEmitter } from "events";
import { StratumClient } from "./stratum";
import { User, Device, Pool, MiningStats, InsertMiningStats } from "@shared/schema";
import { storage } from "../storage";

interface MinerSession {
  client: StratumClient;
  device: Device;
  user: User;
  pool: Pool;
  hashRate: number;
  active: boolean;
  lastSeen: Date;
  accepted: number;
  rejected: number;
}

/**
 * Mining Manager - handles all mining connections and updates
 */
export class MiningManager extends EventEmitter {
  private sessions: Map<number, MinerSession> = new Map();
  private miningEnabled: boolean = true;
  private statsUpdateInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    super();
    this.initialize();
  }
  
  private async initialize() {
    // Load settings
    const settings = await storage.getSettings();
    if (settings) {
      this.miningEnabled = settings.miningEnabled;
    }
    
    // Set up stats update interval
    this.statsUpdateInterval = setInterval(() => this.updateStats(), 60 * 1000); // Every minute
  }
  
  /**
   * Register a new mining device
   */
  public async registerDevice(deviceId: number, userId: number): Promise<boolean> {
    try {
      // Get device, user and active pool
      const device = await storage.getDevice(deviceId);
      const user = await storage.getUser(userId);
      const settings = await storage.getSettings();
      
      if (!device || !user || !settings) {
        console.error("Missing device, user or settings");
        return false;
      }
      
      // Get active pool
      const poolId = settings.activePoolId || 1; // Default to pool ID 1 if not set
      const pool = await storage.getPool(poolId);
      if (!pool) {
        console.error("No active mining pool configured");
        return false;
      }
      
      // Create a new Stratum client for this device
      const client = new StratumClient(pool, user, device);
      
      // Set up event handlers
      client.on("connected", () => {
        console.log(`Device ${deviceId} connected to pool ${pool.name}`);
      });
      
      client.on("disconnected", () => {
        console.log(`Device ${deviceId} disconnected from pool ${pool.name}`);
      });
      
      client.on("error", (error) => {
        console.error(`Device ${deviceId} pool error:`, error);
      });
      
      client.on("authorized", () => {
        console.log(`Device ${deviceId} authorized with pool ${pool.name}`);
        
        // Mark device as active
        if (this.miningEnabled) {
          this.activateDevice(deviceId);
        }
      });
      
      client.on("job", (job) => {
        console.log(`Device ${deviceId} received new job from pool`);
      });
      
      client.on("share:accepted", () => {
        const session = this.sessions.get(deviceId);
        if (session) {
          session.accepted++;
          this.sessions.set(deviceId, session);
        }
        console.log(`Device ${deviceId} share accepted`);
      });
      
      client.on("share:rejected", (reason) => {
        const session = this.sessions.get(deviceId);
        if (session) {
          session.rejected++;
          this.sessions.set(deviceId, session);
        }
        console.log(`Device ${deviceId} share rejected: ${reason}`);
      });
      
      // Store the session
      this.sessions.set(deviceId, {
        client,
        device,
        user,
        pool,
        hashRate: 0,
        active: false,
        lastSeen: new Date(),
        accepted: 0,
        rejected: 0
      });
      
      // Connect to the pool if mining is enabled
      if (this.miningEnabled) {
        await client.connect();
      }
      
      return true;
    } catch (error) {
      console.error(`Error registering device ${deviceId}:`, error);
      return false;
    }
  }
  
  /**
   * Unregister a mining device
   */
  public async unregisterDevice(deviceId: number): Promise<boolean> {
    const session = this.sessions.get(deviceId);
    if (!session) {
      return false;
    }
    
    // Disconnect from pool
    session.client.disconnect();
    
    // Remove from sessions
    this.sessions.delete(deviceId);
    
    return true;
  }
  
  /**
   * Update device hash rate
   */
  public async updateDeviceHashRate(deviceId: number, hashRate: number): Promise<boolean> {
    const session = this.sessions.get(deviceId);
    if (!session) {
      return false;
    }
    
    // Update hash rate
    session.hashRate = hashRate;
    session.lastSeen = new Date();
    this.sessions.set(deviceId, session);
    
    // Update in storage
    await storage.updateDeviceHashRate(deviceId, hashRate);
    
    return true;
  }
  
  /**
   * Activate a device for mining
   */
  public async activateDevice(deviceId: number): Promise<boolean> {
    const session = this.sessions.get(deviceId);
    if (!session) {
      return false;
    }
    
    if (!session.active) {
      // Update status
      session.active = true;
      this.sessions.set(deviceId, session);
      
      // Update device in storage
      await storage.updateDevice(deviceId, { status: "active" });
      
      // Connect to pool if not already connected
      if (!session.client.isConnected()) {
        await session.client.connect();
      }
    }
    
    return true;
  }
  
  /**
   * Deactivate a device from mining
   */
  public async deactivateDevice(deviceId: number): Promise<boolean> {
    const session = this.sessions.get(deviceId);
    if (!session) {
      return false;
    }
    
    if (session.active) {
      // Update status
      session.active = false;
      this.sessions.set(deviceId, session);
      
      // Update device in storage
      await storage.updateDevice(deviceId, { status: "paused" });
      
      // Disconnect from pool
      session.client.disconnect();
    }
    
    return true;
  }
  
  /**
   * Enable or disable mining globally
   */
  public async toggleMining(enabled: boolean): Promise<boolean> {
    this.miningEnabled = enabled;
    
    // Update settings
    await storage.updateSettings({ miningEnabled: enabled });
    
    // Update all devices
    for (const entry of Array.from(this.sessions.entries())) {
      const [deviceId, session] = entry;
      if (enabled) {
        if (session.device.status === "active") {
          await this.activateDevice(deviceId);
        }
      } else {
        await this.deactivateDevice(deviceId);
      }
    }
    
    return true;
  }
  
  /**
   * Switch active mining pool
   */
  public async switchPool(poolId: number): Promise<boolean> {
    // Get the new pool
    const pool = await storage.getPool(poolId);
    if (!pool) {
      return false;
    }
    
    // Update settings
    await storage.updateSettings({ activePoolId: poolId });
    
    // Reconnect all devices to the new pool
    for (const entry of Array.from(this.sessions.entries())) {
      const [deviceId, session] = entry;
      
      // Disconnect from current pool
      session.client.disconnect();
      
      // Update pool in session
      session.pool = pool;
      
      // Create a new client with the new pool
      const newClient = new StratumClient(pool, session.user, session.device);
      session.client = newClient;
      this.sessions.set(deviceId, session);
      
      // Connect to new pool if device is active
      if (session.active && this.miningEnabled) {
        await newClient.connect();
      }
    }
    
    return true;
  }
  
  /**
   * Update mining statistics for all users
   */
  private async updateStats(): Promise<void> {
    // Group sessions by user
    const userStats: Map<number, {
      totalHashRate: number;
      activeDevices: number;
      powerConsumption: number;
    }> = new Map();
    
    // Calculate stats for each user
    for (const session of Array.from(this.sessions.values())) {
      if (session.active) {
        const userId = session.user.id;
        const stats = userStats.get(userId) || {
          totalHashRate: 0,
          activeDevices: 0,
          powerConsumption: 0
        };
        
        stats.totalHashRate += session.hashRate;
        stats.activeDevices += 1;
        
        // Estimate power consumption based on CPU allocation
        stats.powerConsumption += session.device.cpuAllocation / 100 * 0.1; // 0.1 kWh per 100% CPU
        
        userStats.set(userId, stats);
      }
    }
    
    // Save stats for each user
    for (const entry of Array.from(userStats.entries())) {
      const [userId, stats] = entry;
      // Calculate estimated earnings based on hashrate
      const estimatedEarnings = stats.totalHashRate * 0.00000001; // Simple calculation
      
      const statsData: InsertMiningStats = {
        userId,
        totalHashRate: stats.totalHashRate.toString(),
        estimatedEarnings: estimatedEarnings.toString(),
        activeDevices: stats.activeDevices,
        powerConsumption: stats.powerConsumption.toString(),
        hashRateHistory: []
      };
      
      await storage.saveMiningStats(statsData);
    }
  }
  
  /**
   * Get mining state 
   */
  public async getMiningState(): Promise<{
    miningEnabled: boolean;
    totalHashRate: number;
    activeDevices: number;
    estimatedEarnings: number;
  }> {
    let totalHashRate = 0;
    let activeDevices = 0;
    
    // Calculate totals
    for (const session of Array.from(this.sessions.values())) {
      if (session.active) {
        totalHashRate += session.hashRate;
        activeDevices += 1;
      }
    }
    
    // Calculate estimated earnings
    const estimatedEarnings = totalHashRate * 0.00000001; // Simple calculation
    
    return {
      miningEnabled: this.miningEnabled,
      totalHashRate,
      activeDevices,
      estimatedEarnings
    };
  }
}

export const miningManager = new MiningManager();