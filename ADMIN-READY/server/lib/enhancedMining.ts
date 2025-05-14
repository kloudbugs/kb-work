import { WebSocket } from "ws";
import { storage } from "../storage";
import { Device, Pool } from "@shared/schema";
import { StratumClient, createStratumClient } from "./stratum";
import { JobProcessor, createJobProcessor, MiningJob } from "./miningJob";

// Worker client with enhanced mining capabilities
interface MiningWorker {
  deviceId: number;
  connection: WebSocket | null;
  hashRate: number;
  active: boolean;
  lastSeen: Date;
  // New fields for job tracking
  currentJobId?: string;
  extraNonce2?: string;
  // Optimization fields
  parallelMining: boolean;      // Whether this worker can mine in parallel
  threadCount: number;          // Number of threads this worker can use
  difficultyBoost: number;      // Special difficulty adjustment factor for this worker
  shareBooster: boolean;        // Special functionality to boost share finding
  optimized: boolean;           // Whether optimizations are enabled
}

export class EnhancedMiningManager {
  private workers: Map<number, MiningWorker> = new Map();
  private miningEnabled: boolean = true;
  private activePoolId: number = 1;
  private estimatedBtcPerMhs: number = 0.00000001; // BTC per MH/s per day (simplified)
  
  // Stratum mining components
  private stratumClient: StratumClient | null = null;
  private jobProcessor: JobProcessor | null = null;
  private connectedToPool: boolean = false;
  private pendingShares: Map<string, {deviceId: number, time: number}> = new Map();
  private acceptedShares: number = 0;
  private rejectedShares: number = 0;
  
  constructor() {
    this.initialize();
  }
  
  private async initialize() {
    // Load settings
    const settings = await storage.getSettings();
    if (settings) {
      this.miningEnabled = settings.miningEnabled;
      this.activePoolId = settings.activePoolId || 1;
    }
    
    // Create job processor
    this.jobProcessor = createJobProcessor();
    
    // Connect to the active pool
    this.connectToPool();
    
    // Update stats periodically
    setInterval(() => this.updateStats(), 60000); // Every minute
    
    // Check for stale connections
    setInterval(() => this.checkStaleConnections(), 300000); // Every 5 minutes
  }
  
  private async checkStaleConnections() {
    const now = new Date();
    const staleTimeout = 10 * 60 * 1000; // 10 minutes
    
    for (const [deviceId, worker] of this.workers.entries()) {
      const timeSinceLastSeen = now.getTime() - worker.lastSeen.getTime();
      
      if (timeSinceLastSeen > staleTimeout) {
        console.log(`Device ${deviceId} connection is stale, marking as inactive`);
        worker.active = false;
        if (worker.connection) {
          try {
            worker.connection.close();
          } catch (error) {
            console.error(`Error closing connection for device ${deviceId}:`, error);
          }
          worker.connection = null;
        }
        
        await storage.updateDevice(deviceId, { status: 'inactive' });
      }
    }
  }
  
  private async connectToPool() {
    try {
      // Disconnect existing connection if any
      if (this.stratumClient) {
        this.stratumClient.disconnect();
      }
      
      // Get active pool info
      const pool = await storage.getPool(this.activePoolId);
      if (!pool) {
        console.error(`Pool with id ${this.activePoolId} not found`);
        this.connectedToPool = false;
        return;
      }
      
      // Create and connect stratum client
      this.stratumClient = createStratumClient();
      
      // Set up event listeners
      this.stratumClient.on('authorized', () => {
        console.log('Pool connection authorized');
        this.connectedToPool = true;
        
        // Broadcast updated config to workers
        this.broadcastMiningConfig();
      });
      
      this.stratumClient.on('job', (params) => {
        this.handleNewJob(params);
      });
      
      this.stratumClient.on('difficulty', (difficulty) => {
        console.log(`New difficulty: ${difficulty}`);
        if (this.jobProcessor) {
          this.jobProcessor.setDifficulty(difficulty);
        }
      });
      
      this.stratumClient.on('error', (error) => {
        console.error('Stratum client error:', error);
        this.connectedToPool = false;
      });
      
      this.stratumClient.on('disconnected', () => {
        console.log('Disconnected from pool');
        this.connectedToPool = false;
      });
      
      // Connect to the pool with ZigMiner worker name
      await this.stratumClient.connect(pool, 'zigminer');
      
    } catch (error) {
      console.error('Failed to connect to mining pool:', error);
      this.connectedToPool = false;
    }
  }
  
  private handleNewJob(params: any[]) {
    try {
      if (!this.jobProcessor) return;
      
      // Parse job params (format may vary slightly by pool)
      const job: MiningJob = {
        jobId: params[0],
        prevHash: params[1],
        coinBase1: params[2],
        coinBase2: params[3],
        merkleBranches: params[4],
        version: params[5],
        bits: params[6],
        time: params[7],
        cleanJobs: params[8] || false
      };
      
      console.log(`New job received: ${job.jobId}`);
      
      // Set the new job in the processor
      this.jobProcessor.setJob(job);
      
      // Broadcast the job to active workers
      this.broadcastJob(job);
      
    } catch (error) {
      console.error('Error handling new job:', error);
    }
  }
  
  private async broadcastJob(job: MiningJob) {
    if (!this.miningEnabled || !this.jobProcessor) return;
    
    const work = this.jobProcessor.generateWorkForMiner();
    if (!work) return;
    
    for (const [deviceId, worker] of this.workers.entries()) {
      if (worker.active && worker.connection) {
        try {
          // Apply worker-specific optimizations
          const minerTarget = work.target;
          let adjustedTarget = minerTarget;
          
          // If worker has difficulty boost enabled, adjust the target
          // to make it easier for this worker to find shares
          if (worker.optimized && worker.difficultyBoost < 1.0) {
            // Calculate an easier target based on the difficultyBoost
            // This makes it more likely for the worker to find shares
            const targetBuffer = Buffer.from(minerTarget, 'hex');
            const easyTargetBuffer = Buffer.alloc(targetBuffer.length);
            
            // Copy the target and adjust it to be a bit easier 
            // (bigger target value = easier to find shares)
            for (let i = 0; i < targetBuffer.length; i++) {
              // Apply a simple multiplier to each byte
              let newByte = Math.floor(targetBuffer[i] / worker.difficultyBoost);
              // Ensure we don't exceed 255
              easyTargetBuffer[i] = Math.min(newByte, 255);
            }
            
            adjustedTarget = easyTargetBuffer.toString('hex');
          }
          
          // Prepare job data with optimizations
          const jobData: any = {
            type: 'job',
            job_id: work.jobId,
            prev_hash: work.prevHash,
            coinbase1: work.coinBase1,
            coinbase2: work.coinBase2,
            merkle_branches: work.merkleBranches,
            version: work.version,
            bits: work.bits,
            time: work.time,
            extra_nonce1: work.extraNonce1,
            extra_nonce2_size: work.extraNonce2Size,
            target: adjustedTarget,
            clean_jobs: job.cleanJobs
          };
          
          // Add parallel mining configuration if supported
          if (worker.parallelMining) {
            jobData.parallel_mining = true;
            jobData.thread_count = worker.threadCount;
            jobData.share_booster = worker.shareBooster;
          }
          
          // Send work to client
          worker.connection.send(JSON.stringify(jobData));
          
          // Track current job for this worker
          worker.currentJobId = job.jobId;
          
        } catch (error) {
          console.error(`Error sending job to device ${deviceId}:`, error);
        }
      }
    }
  }
  
  async registerWorker(deviceId: number, connection: WebSocket): Promise<void> {
    const device = await storage.getDevice(deviceId);
    if (!device) {
      throw new Error(`Device with id ${deviceId} not found`);
    }
    
    // Get CPU cores and device capabilities
    const cpuCores = device.cpuAllocation ? Math.max(2, Math.floor(device.cpuAllocation * 0.1)) : 4;
    
    // Use CPU cores count to determine thread count for parallel mining
    // Optimize based on device capabilities
    this.workers.set(deviceId, {
      deviceId,
      connection,
      hashRate: Number(device.hashRate) || 0,
      active: device.status === 'active',
      lastSeen: new Date(),
      // Enable optimizations to boost hashrate and share finding
      parallelMining: true,
      threadCount: cpuCores,
      difficultyBoost: 0.8,  // Slightly easier difficulty for faster share finding
      shareBooster: true,    // Enable share boosting algorithm
      optimized: true        // Enable general optimizations
    });
    
    // Update device status
    await storage.updateDevice(deviceId, { status: 'active' });
    
    // Send mining configuration
    this.sendMiningConfig(deviceId);
    
    // If connected to pool and we have a job, send it immediately
    if (this.connectedToPool && this.jobProcessor && connection.readyState === WebSocket.OPEN) {
      const work = this.jobProcessor.generateWorkForMiner();
      if (work) {
        const worker = this.workers.get(deviceId);
        if (worker) {
          // Apply worker-specific optimizations, similar to broadcastJob
          const minerTarget = work.target;
          let adjustedTarget = minerTarget;
          
          // Apply difficulty boost for faster share finding if enabled
          if (worker.optimized && worker.difficultyBoost < 1.0) {
            const targetBuffer = Buffer.from(minerTarget, 'hex');
            const easyTargetBuffer = Buffer.alloc(targetBuffer.length);
            
            for (let i = 0; i < targetBuffer.length; i++) {
              let newByte = Math.floor(targetBuffer[i] / worker.difficultyBoost);
              easyTargetBuffer[i] = Math.min(newByte, 255);
            }
            
            adjustedTarget = easyTargetBuffer.toString('hex');
          }
          
          // Prepare job data with all optimizations
          const jobData: any = {
            type: 'job',
            job_id: work.jobId,
            prev_hash: work.prevHash,
            coinbase1: work.coinBase1,
            coinbase2: work.coinBase2,
            merkle_branches: work.merkleBranches,
            version: work.version,
            bits: work.bits,
            time: work.time,
            extra_nonce1: work.extraNonce1,
            extra_nonce2_size: work.extraNonce2Size,
            target: adjustedTarget
          };
          
          // Include parallel mining configuration
          if (worker.parallelMining) {
            jobData.parallel_mining = true;
            jobData.thread_count = worker.threadCount;
            jobData.share_booster = worker.shareBooster;
          }
          
          // Send the optimized job to the worker
          connection.send(JSON.stringify(jobData));
          
          // Track current job for this worker
          worker.currentJobId = work.jobId;
        }
      }
    }
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
  
  async submitShare(deviceId: number, jobId: string, extraNonce2: string, nonce: string, timestamp: string, version: string): Promise<boolean> {
    const worker = this.workers.get(deviceId);
    if (!worker || worker.currentJobId !== jobId) {
      console.warn(`Invalid job ID for device ${deviceId}`);
      return false;
    }
    
    // Verify share locally first
    if (this.jobProcessor && !this.jobProcessor.validateShare(nonce, extraNonce2, timestamp, version)) {
      console.warn(`Share validation failed for device ${deviceId}`);
      this.rejectedShares++;
      return false;
    }
    
    try {
      // Store worker's extra nonce for tracking
      worker.extraNonce2 = extraNonce2;
      
      // Generate a unique ID for this share
      const shareId = `${jobId}:${deviceId}:${nonce}`;
      
      // Record pending share
      this.pendingShares.set(shareId, {
        deviceId,
        time: Date.now()
      });
      
      // Submit to pool
      if (this.stratumClient && this.stratumClient.isConnected() && this.stratumClient.isAuthorized()) {
        const result = await this.stratumClient.submitShare(jobId, nonce, timestamp);
        
        if (result) {
          this.acceptedShares++;
          console.log(`Share accepted for device ${deviceId}`);
        } else {
          this.rejectedShares++;
          console.warn(`Share rejected by pool for device ${deviceId}`);
        }
        
        // Remove from pending
        this.pendingShares.delete(shareId);
        return result;
      }
      
      console.warn('Cannot submit share: not connected to pool');
      this.pendingShares.delete(shareId);
      return false;
    } catch (error) {
      console.error(`Error submitting share for device ${deviceId}:`, error);
      return false;
    }
  }
  
  async toggleMining(enabled: boolean): Promise<void> {
    this.miningEnabled = enabled;
    await storage.updateSettings({ miningEnabled: enabled });
    
    // Notify all workers
    this.broadcastMiningConfig();
    
    // Connect or disconnect from pool
    if (enabled && !this.connectedToPool) {
      this.connectToPool();
    } else if (!enabled && this.stratumClient) {
      this.stratumClient.disconnect();
      this.connectedToPool = false;
    }
  }
  
  async switchPool(poolId: number): Promise<void> {
    const pool = await storage.getPool(poolId);
    if (!pool) {
      throw new Error(`Pool with id ${poolId} not found`);
    }
    
    this.activePoolId = poolId;
    await storage.updateSettings({ activePoolId: poolId });
    
    // Update pool statuses
    const pools = await storage.getPools();
    for (const p of pools) {
      const newStatus = p.id === poolId ? 'active' : 'standby';
      if (p.status !== newStatus) {
        await storage.updatePool(p.id, { status: newStatus });
      }
    }
    
    // Reconnect to the new pool
    this.connectToPool();
  }
  
  private async sendMiningConfig(deviceId: number): Promise<void> {
    const worker = this.workers.get(deviceId);
    if (!worker || !worker.connection) return;
    
    const device = await storage.getDevice(deviceId);
    if (!device) return;
    
    const pool = await storage.getPool(this.activePoolId);
    if (!pool) return;
    
    // Send mining configuration with optimizations
    worker.connection.send(JSON.stringify({
      type: 'config',
      mining_enabled: this.miningEnabled && worker.active,
      pool: {
        url: pool.url,
        username: pool.username,
        password: pool.password,
        algorithm: pool.algorithm,
        pool_type: pool.poolType,
        direct_btc_payment: pool.directBtcPayment
      },
      device: {
        cpu_allocation: device.cpuAllocation,
        ram_allocation: device.ramAllocation
      },
      optimizations: {
        enabled: worker.optimized,
        parallel_mining: worker.parallelMining,
        thread_count: worker.threadCount,
        share_booster: worker.shareBooster,
        difficulty_boost: worker.difficultyBoost
      }
    }));
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
    totalHashRate: number;
    activeDeviceCount: number;
    connectedToPool: boolean;
    acceptedShares: number;
    rejectedShares: number;
  }> {
    const totalHashRate = Array.from(this.workers.values())
      .reduce((sum, worker) => sum + worker.hashRate, 0);
    
    const activeDeviceCount = Array.from(this.workers.values())
      .filter(worker => worker.active).length;
    
    const pool = await storage.getPool(this.activePoolId);
    
    return {
      miningEnabled: this.miningEnabled,
      activePool: pool || null,
      totalHashRate,
      activeDeviceCount,
      connectedToPool: this.connectedToPool,
      acceptedShares: this.acceptedShares,
      rejectedShares: this.rejectedShares
    };
  }
  
  // Get stats about share submission for a particular user
  async getUserShareStats(userId: number): Promise<{
    acceptedShares: number;
    rejectedShares: number;
    pendingShares: number;
  }> {
    // In a real implementation, we would track shares by user
    // For now, return global stats
    return {
      acceptedShares: this.acceptedShares,
      rejectedShares: this.rejectedShares,
      pendingShares: this.pendingShares.size
    };
  }
}

// Create singleton instance
export const enhancedMiningManager = new EnhancedMiningManager();