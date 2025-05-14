import { WebSocket } from "ws";
import { storage } from "../storage";
import { Device, Pool } from "@shared/schema";
import { EventEmitter } from "events";

// Enhanced worker client with optimization support
interface MiningWorker {
  deviceId: number;
  connection: WebSocket | null;
  hashRate: number;
  active: boolean;
  lastSeen: Date;
  // Optimization fields
  optimized: boolean;
  difficulty: number;
  nonceRange: [number, number];
  asicModel: string;
  threadCount: number;
  shareBooster: boolean;
  parallelMining: boolean;
}

export class MiningManager extends EventEmitter {
  private workers: Map<number, MiningWorker> = new Map();
  private miningEnabled: boolean = true;
  private activePoolId: number = 1;
  private secondaryPoolId: number | null = null;
  private dualMiningEnabled: boolean = false;
  private primaryPoolAllocation: number = 75; // Percentage allocation to primary pool
  private estimatedBtcPerMhs: number = 0.00000001; // BTC per MH/s per day (simplified)
  
  constructor() {
    super();
    this.initialize();
  }
  
  private async initialize() {
    // Load settings
    const settings = await storage.getSettings();
    if (settings) {
      this.miningEnabled = settings.miningEnabled;
      this.activePoolId = settings.activePoolId || 1;
      this.secondaryPoolId = settings.secondaryPoolId || null;
      this.dualMiningEnabled = settings.dualMiningEnabled || false;
      this.primaryPoolAllocation = settings.primaryPoolAllocation || 75;
    }
    
    // Update stats periodically
    setInterval(() => this.updateStats(), 60000); // Every minute
  }
  
  async registerWorker(deviceId: number, connection: WebSocket): Promise<void> {
    const device = await storage.getDevice(deviceId);
    if (!device) {
      throw new Error(`Device with id ${deviceId} not found`);
    }
    
    // Import miningOptimizer but handle import in a way that prevents circular dependencies
    const { miningOptimizer } = await import('./miningAlgorithms');
    
    // Determine optimal thread count based on device specs
    const threadCount = Math.max(1, Math.floor(device.cpuAllocation / 10));
    
    // Initialize worker with optimization features
    this.workers.set(deviceId, {
      deviceId,
      connection,
      hashRate: Number(device.hashRate) || 0,
      active: device.status === 'active',
      lastSeen: new Date(),
      // Initialize optimization fields
      optimized: true,
      difficulty: 1.0,
      nonceRange: [0, 0xFFFFFFFF],
      asicModel: 'antminer_s9', // Default model
      threadCount,
      shareBooster: true,
      parallelMining: threadCount > 1
    });
    
    // Initialize worker in the mining optimizer
    miningOptimizer.variableDifficultyAdjuster.registerDevice(deviceId, Number(device.hashRate) || 0);
    miningOptimizer.nonceDistributor.registerDevice(deviceId, Number(device.hashRate) || 0);
    
    // Update device status
    await storage.updateDevice(deviceId, { status: 'active' });
    
    // Send mining configuration
    this.sendMiningConfig(deviceId);
    
    console.log(`Registered worker for device ${deviceId} with optimizations enabled`);
  }
  
  async unregisterWorker(deviceId: number): Promise<void> {
    const worker = this.workers.get(deviceId);
    if (worker) {
      worker.connection = null;
      worker.active = false;
      await storage.updateDevice(deviceId, { status: 'inactive' });
    }
    
    this.workers.delete(deviceId);
  }
  
  async updateWorkerHashRate(deviceId: number, hashRate: number): Promise<void> {
    const worker = this.workers.get(deviceId);
    if (worker) {
      worker.hashRate = hashRate;
      worker.lastSeen = new Date();
      await storage.updateDeviceHashRate(deviceId, hashRate);
    }
  }
  
  async toggleMining(enabled: boolean): Promise<void> {
    this.miningEnabled = enabled;
    await storage.updateSettings({ miningEnabled: enabled });
    
    // Notify all workers
    this.broadcastMiningConfig();
  }
  
  async switchPool(poolId: number, resourceAllocation: number = 1.0, isSecondaryPool: boolean = false): Promise<void> {
    const pool = await storage.getPool(poolId);
    if (!pool) {
      throw new Error(`Pool with id ${poolId} not found`);
    }
    
    // Determine what we're switching
    if (isSecondaryPool) {
      // We're setting/changing the secondary pool
      this.secondaryPoolId = poolId;
      this.dualMiningEnabled = true;
      this.primaryPoolAllocation = 100 - Math.min(Math.max(Math.round(resourceAllocation * 100), 10), 90);
      
      await storage.updateSettings({ 
        secondaryPoolId: poolId,
        dualMiningEnabled: true,
        primaryPoolAllocation: this.primaryPoolAllocation
      });
      
      console.log(`Secondary pool set to ${pool.name} with ${100 - this.primaryPoolAllocation}% resource allocation`);
    } else {
      // We're setting/changing the primary pool
      this.activePoolId = poolId;
      
      // If resourceAllocation is less than 1.0, we're in dual mining mode
      if (resourceAllocation < 1.0) {
        this.dualMiningEnabled = true;
        this.primaryPoolAllocation = Math.min(Math.max(Math.round(resourceAllocation * 100), 10), 90);
        
        await storage.updateSettings({ 
          activePoolId: poolId,
          dualMiningEnabled: true,
          primaryPoolAllocation: this.primaryPoolAllocation
        });
        
        console.log(`Primary pool set to ${pool.name} with ${this.primaryPoolAllocation}% resource allocation`);
      } else {
        // Single pool mode
        this.dualMiningEnabled = false;
        this.secondaryPoolId = null;
        this.primaryPoolAllocation = 100;
        
        await storage.updateSettings({ 
          activePoolId: poolId,
          dualMiningEnabled: false,
          secondaryPoolId: null,
          primaryPoolAllocation: 100
        });
        
        console.log(`Mining set to single pool mode with ${pool.name}`);
      }
    }
    
    // Update pool statuses
    const pools = await storage.getPools();
    for (const p of pools) {
      let newStatus = 'standby';
      
      if (p.id === this.activePoolId) {
        newStatus = 'active';
      } else if (this.dualMiningEnabled && p.id === this.secondaryPoolId) {
        newStatus = 'active_secondary';
      }
      
      if (p.status !== newStatus) {
        await storage.updatePool(p.id, { status: newStatus });
      }
    }
    
    // Emit event
    this.emit('poolChanged', {
      primaryPoolId: this.activePoolId,
      secondaryPoolId: this.secondaryPoolId,
      dualMiningEnabled: this.dualMiningEnabled,
      primaryPoolAllocation: this.primaryPoolAllocation
    });
    
    // Notify all workers
    this.broadcastMiningConfig();
  }
  
  private async sendMiningConfig(deviceId: number): Promise<void> {
    const worker = this.workers.get(deviceId);
    if (!worker || !worker.connection) return;
    
    const device = await storage.getDevice(deviceId);
    if (!device) return;
    
    const primaryPool = await storage.getPool(this.activePoolId);
    if (!primaryPool) return;
    
    // Configuration object with primary pool
    const configData: any = {
      type: 'config',
      mining_enabled: this.miningEnabled && worker.active,
      dual_mining: this.dualMiningEnabled,
      pool: {
        url: primaryPool.url,
        username: primaryPool.username,
        password: primaryPool.password,
        algorithm: primaryPool.algorithm,
        allocation: this.dualMiningEnabled ? this.primaryPoolAllocation / 100 : 1.0
      },
      device: {
        cpu_allocation: device.cpuAllocation,
        ram_allocation: device.ramAllocation
      }
    };
    
    // If dual mining is enabled, add secondary pool information
    if (this.dualMiningEnabled && this.secondaryPoolId) {
      const secondaryPool = await storage.getPool(this.secondaryPoolId);
      if (secondaryPool) {
        configData.secondary_pool = {
          url: secondaryPool.url,
          username: secondaryPool.username,
          password: secondaryPool.password,
          algorithm: secondaryPool.algorithm,
          allocation: (100 - this.primaryPoolAllocation) / 100
        };
      }
    }
    
    // Send mining configuration
    worker.connection.send(JSON.stringify(configData));
  }
  
  private async broadcastMiningConfig(): Promise<void> {
    for (const [deviceId] of this.workers) {
      await this.sendMiningConfig(deviceId);
    }
  }
  
  private async updateStats(): Promise<void> {
    // Get all users with devices
    const devices = Array.from(this.workers.values());
    if (devices.length === 0) return;
    
    // Group devices by user
    const devicesByUser = new Map<number, Device[]>();
    for (const worker of devices) {
      const device = await storage.getDevice(worker.deviceId);
      if (device && device.userId) {
        if (!devicesByUser.has(device.userId)) {
          devicesByUser.set(device.userId, []);
        }
        devicesByUser.get(device.userId)!.push(device);
      }
    }
    
    // Update stats for each user
    for (const [userId, userDevices] of devicesByUser) {
      const activeDevices = userDevices.filter(d => d.status === 'active').length;
      const totalHashRate = userDevices.reduce((sum, d) => sum + Number(d.hashRate), 0);
      
      // Estimate power consumption (simplified)
      const powerConsumption = userDevices.reduce((sum, d) => {
        // Rough estimate based on hash rate
        return sum + (Number(d.hashRate) * 0.01);
      }, 0);
      
      // Estimate earnings
      const estimatedEarnings = totalHashRate * this.estimatedBtcPerMhs;
      
      // Get previous stats to update history
      const prevStats = await storage.getMiningStats(userId);
      let hashRateHistory: [string, number][] = [];
      
      if (prevStats && prevStats.hashRateHistory) {
        hashRateHistory = prevStats.hashRateHistory as [string, number][];
      }
      
      // Add current data point
      hashRateHistory.push([new Date().toISOString(), totalHashRate]);
      
      // Keep only the last 1000 data points
      if (hashRateHistory.length > 1000) {
        hashRateHistory = hashRateHistory.slice(hashRateHistory.length - 1000);
      }
      
      // Update the user's wallet with mining rewards if mining is active
      if (this.miningEnabled && totalHashRate > 0) {
        try {
          // Get user
          const user = await storage.getUser(userId as number);
          if (user) {
            // Calculate reward based on hash rate - simplified for demo
            // In a real implementation, this would be based on actual shares submitted
            // Accumulate a small amount every minute (1/60th of hourly rate)
            const miningReward = (totalHashRate * this.estimatedBtcPerMhs) / 60;
            
            // Only add reward if there's an actual amount
            if (miningReward > 0) {
              // Add mining reward to user's balance
              const currentBalance = parseFloat(user.balance || "0") || 0;
              const newBalance = currentBalance + miningReward;
              
              // Update user balance
              await storage.updateUser(userId as number, { 
                balance: newBalance.toString() 
              });
              
              console.log(`Mining reward added for user ${userId}: ${miningReward} BTC (new balance: ${newBalance})`);
            }
          }
        } catch (error) {
          console.error(`Failed to update wallet balance for user ${userId}:`, error);
        }
      }
      
      // Save updated stats
      await storage.saveMiningStats({
        userId,
        totalHashRate,
        estimatedEarnings,
        activeDevices,
        powerConsumption,
        hashRateHistory
      });
    }
  }
  
  // Returns current mining state for all devices
  async getMiningState(): Promise<{
    miningEnabled: boolean;
    activePool: Pool | null;
    secondaryPool: Pool | null;
    dualMiningEnabled: boolean;
    primaryPoolAllocation: number;
    totalHashRate: number;
    activeDeviceCount: number;
  }> {
    const totalHashRate = Array.from(this.workers.values())
      .reduce((sum, worker) => sum + worker.hashRate, 0);
    
    const activeDeviceCount = Array.from(this.workers.values())
      .filter(worker => worker.active).length;
    
    const primaryPool = await storage.getPool(this.activePoolId);
    
    let secondaryPool = null;
    if (this.dualMiningEnabled && this.secondaryPoolId) {
      secondaryPool = await storage.getPool(this.secondaryPoolId);
    }
    
    return {
      miningEnabled: this.miningEnabled,
      activePool: primaryPool || null,
      secondaryPool,
      dualMiningEnabled: this.dualMiningEnabled,
      primaryPoolAllocation: this.primaryPoolAllocation,
      totalHashRate,
      activeDeviceCount
    };
  }
}

// Create singleton instance
export const miningManager = new MiningManager();
