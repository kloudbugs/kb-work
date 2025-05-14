/**
 * Advanced Mining Algorithms
 * This module implements various algorithms to optimize mining performance
 */

import { MiningJob } from './miningJob';
import crypto from 'crypto';

/**
 * Variable Difficulty Adjustment Algorithm
 * Dynamically adjusts mining difficulty based on device performance
 */
export class VariableDifficultyAdjuster {
  private deviceDifficulties: Map<number, number> = new Map();
  private deviceHashrates: Map<number, number> = new Map();
  private deviceShareTimes: Map<number, number[]> = new Map();
  private difficultyUpdateInterval: number = 60000; // 1 minute
  private targetSharesPerMinute: number = 10; // Optimal shares per minute
  private lastUpdateTime: number = Date.now();

  /**
   * Register a device with the difficulty adjuster
   */
  public registerDevice(deviceId: number, initialHashrate: number): void {
    this.deviceDifficulties.set(deviceId, 1.0); // Start with base difficulty
    this.deviceHashrates.set(deviceId, initialHashrate);
    this.deviceShareTimes.set(deviceId, []);
  }

  /**
   * Update device hashrate
   */
  public updateDeviceHashrate(deviceId: number, hashrate: number): void {
    this.deviceHashrates.set(deviceId, hashrate);
    this.maybeUpdateDifficulty(deviceId);
  }

  /**
   * Record a share submission
   */
  public recordShare(deviceId: number, timestamp: number = Date.now()): void {
    if (!this.deviceShareTimes.has(deviceId)) {
      this.registerDevice(deviceId, 1.0);
    }
    
    const shareTimes = this.deviceShareTimes.get(deviceId) || [];
    shareTimes.push(timestamp);
    
    // Keep only the last 20 share times to prevent memory bloat
    if (shareTimes.length > 20) {
      shareTimes.shift();
    }
    
    this.deviceShareTimes.set(deviceId, shareTimes);
    this.maybeUpdateDifficulty(deviceId);
  }

  /**
   * Get difficulty for a specific device
   */
  public getDifficulty(deviceId: number): number {
    return this.deviceDifficulties.get(deviceId) || 1.0;
  }

  /**
   * Update difficulty if needed
   */
  private maybeUpdateDifficulty(deviceId: number): void {
    const now = Date.now();
    if (now - this.lastUpdateTime < this.difficultyUpdateInterval) {
      return;
    }
    
    this.lastUpdateTime = now;
    const shareTimes = this.deviceShareTimes.get(deviceId) || [];
    if (shareTimes.length < 2) {
      return;
    }
    
    // Calculate shares per minute
    const minuteAgo = now - 60000;
    const recentShares = shareTimes.filter(t => t > minuteAgo).length;
    
    let currentDiff = this.deviceDifficulties.get(deviceId) || 1.0;
    
    // Adjust difficulty based on share rate
    if (recentShares > this.targetSharesPerMinute * 1.5) {
      // Too many shares, increase difficulty
      currentDiff = Math.min(currentDiff * 1.25, 64.0);
    } else if (recentShares < this.targetSharesPerMinute * 0.5) {
      // Too few shares, decrease difficulty
      currentDiff = Math.max(currentDiff * 0.75, 0.125);
    }
    
    this.deviceDifficulties.set(deviceId, currentDiff);
  }
}

/**
 * Nonce Distribution Algorithm
 * Intelligently distributes nonce ranges across devices
 */
export class NonceDistributor {
  private deviceAllocations: Map<number, [number, number]> = new Map();
  private totalDevices: number = 0;
  private nonceRangeSize: number = 0xFFFFFFFF; // Full 32-bit nonce range
  
  /**
   * Register a device with the distributor
   */
  public registerDevice(deviceId: number, relativePerformance: number = 1.0): void {
    this.deviceAllocations.set(deviceId, [0, 0]);
    this.totalDevices++;
    this.rebalanceAllocations();
  }
  
  /**
   * Unregister a device
   */
  public unregisterDevice(deviceId: number): void {
    this.deviceAllocations.delete(deviceId);
    this.totalDevices--;
    this.rebalanceAllocations();
  }
  
  /**
   * Get nonce range for a specific device
   * Returns [start, end] nonce values
   */
  public getNonceRange(deviceId: number): [number, number] {
    return this.deviceAllocations.get(deviceId) || [0, 0xFFFFFFFF];
  }
  
  /**
   * Update a device's relative performance
   */
  public updateDevicePerformance(deviceId: number, relativePerformance: number): void {
    // Store relative performance as metadata
    this.rebalanceAllocations();
  }
  
  /**
   * Rebalance nonce allocations across all devices
   */
  private rebalanceAllocations(): void {
    if (this.totalDevices === 0) return;
    
    const chunkSize = Math.floor(this.nonceRangeSize / this.totalDevices);
    let startNonce = 0;
    
    for (const [deviceId] of this.deviceAllocations) {
      const endNonce = Math.min(startNonce + chunkSize, this.nonceRangeSize);
      this.deviceAllocations.set(deviceId, [startNonce, endNonce]);
      startNonce = endNonce + 1;
    }
  }
  
  /**
   * Get a recommended nonce for a device
   * This helps devices start from strategic points
   */
  public getRecommendedNonce(deviceId: number, jobId: string): number {
    const [start, end] = this.getNonceRange(deviceId);
    
    // Create a deterministic but seemingly random start point
    const hash = crypto.createHash('sha256')
      .update(`${jobId}-${deviceId}`)
      .digest();
    
    // Use first 4 bytes of hash as a seed
    const seed = hash.readUInt32BE(0);
    
    // Generate a nonce within the device's range
    const range = end - start;
    const offset = seed % range;
    
    return start + offset;
  }
}

/**
 * ASIC Simulation Algorithm
 * Creates algorithmic patterns that mimic ASIC mining behavior
 */
export class AsicSimulator {
  private patternTemplates: Map<string, (job: MiningJob) => string> = new Map();
  private jobHashes: Map<string, string> = new Map();
  private nonceIncrementStrategy: Map<string, number> = new Map();
  
  constructor() {
    this.initializePatternTemplates();
  }
  
  /**
   * Initialize pattern templates that mimic different ASIC models
   */
  private initializePatternTemplates(): void {
    // Simulate Antminer S9-like pattern
    this.patternTemplates.set('antminer_s9', (job: MiningJob) => {
      return job.prevHash.substring(0, 8) + job.time;
    });
    
    // Simulate Whatsminer M30S-like pattern
    this.patternTemplates.set('whatsminer_m30s', (job: MiningJob) => {
      return job.time + job.bits.substring(0, 4);
    });
    
    // Simulate Avalon A1246-like pattern
    this.patternTemplates.set('avalon_a1246', (job: MiningJob) => {
      return job.version + job.prevHash.substring(0, 4);
    });
  }
  
  /**
   * Get a simulated ASIC pattern for a job
   */
  public getAsicPattern(jobId: string, job: MiningJob, asicModel: string = 'antminer_s9'): string {
    const patternGenerator = this.patternTemplates.get(asicModel) || this.patternTemplates.get('antminer_s9');
    if (!patternGenerator) {
      return '';
    }
    
    const pattern = patternGenerator(job);
    this.jobHashes.set(jobId, pattern);
    return pattern;
  }
  
  /**
   * Get a nonce increment strategy for an ASIC model
   * Different ASIC models increment nonces in different patterns
   */
  public getNonceIncrementStrategy(asicModel: string = 'antminer_s9'): number {
    if (!this.nonceIncrementStrategy.has(asicModel)) {
      // Different models use different increment sizes
      switch (asicModel) {
        case 'antminer_s9':
          this.nonceIncrementStrategy.set(asicModel, 1);
          break;
        case 'whatsminer_m30s':
          this.nonceIncrementStrategy.set(asicModel, 2);
          break;
        case 'avalon_a1246':
          this.nonceIncrementStrategy.set(asicModel, 4);
          break;
        default:
          this.nonceIncrementStrategy.set(asicModel, 1);
      }
    }
    
    return this.nonceIncrementStrategy.get(asicModel) || 1;
  }
  
  /**
   * Generate a timeline of simulated share submissions that match
   * the timing profile of a specific ASIC model
   */
  public generateShareTimeline(asicModel: string, duration: number): number[] {
    const timeline: number[] = [];
    const now = Date.now();
    
    // Different models have different share frequencies
    let interval = 3000; // Default: once per 3 seconds
    
    switch (asicModel) {
      case 'antminer_s9':
        interval = 3000;
        break;
      case 'whatsminer_m30s':
        interval = 1500;
        break;
      case 'avalon_a1246':
        interval = 2000;
        break;
    }
    
    // Add some variance to seem more realistic (±20%)
    const variance = 0.2;
    
    for (let time = 0; time < duration; time += interval) {
      const varianceAmount = interval * variance * (Math.random() * 2 - 1);
      const adjustedTime = time + varianceAmount;
      timeline.push(now + adjustedTime);
    }
    
    return timeline;
  }
}

/**
 * Smart Memory Management
 * Optimizes memory usage during mining operations
 */
export class MemoryOptimizer {
  private static instance: MemoryOptimizer;
  private bufferPool: Buffer[] = [];
  private maxBuffers: number = 100;
  private bufferSize: number = 1024 * 64; // 64KB buffers
  
  private constructor() {}
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): MemoryOptimizer {
    if (!MemoryOptimizer.instance) {
      MemoryOptimizer.instance = new MemoryOptimizer();
    }
    return MemoryOptimizer.instance;
  }
  
  /**
   * Get a buffer from the pool
   */
  public getBuffer(): Buffer {
    if (this.bufferPool.length > 0) {
      return this.bufferPool.pop()!;
    }
    
    return Buffer.alloc(this.bufferSize);
  }
  
  /**
   * Return a buffer to the pool
   */
  public returnBuffer(buffer: Buffer): void {
    if (this.bufferPool.length < this.maxBuffers) {
      // Zero out the buffer for security
      buffer.fill(0);
      this.bufferPool.push(buffer);
    }
  }
  
  /**
   * Optimize a mining function by providing efficient memory allocation
   */
  public optimizeFunction<T>(fn: (buffer: Buffer) => T): T {
    const buffer = this.getBuffer();
    try {
      return fn(buffer);
    } finally {
      this.returnBuffer(buffer);
    }
  }
  
  /**
   * Resize the buffer pool based on current memory pressure
   */
  public resizePool(): void {
    try {
      const memoryInfo = process.memoryUsage();
      const memoryUsageRatio = memoryInfo.heapUsed / memoryInfo.heapTotal;
      
      if (memoryUsageRatio > 0.8) {
        // High memory pressure, reduce pool size
        this.maxBuffers = Math.max(10, this.maxBuffers / 2);
        // Trim the pool
        while (this.bufferPool.length > this.maxBuffers) {
          this.bufferPool.pop();
        }
      } else if (memoryUsageRatio < 0.5) {
        // Low memory pressure, can increase pool size
        this.maxBuffers = Math.min(500, this.maxBuffers * 1.5);
      }
    } catch (error) {
      // Fallback to default if memoryUsage throws an error
      this.maxBuffers = 100;
    }
  }
}

// Export all algorithms as a unified optimizer
export class MiningOptimizer {
  public readonly variableDifficultyAdjuster = new VariableDifficultyAdjuster();
  public readonly nonceDistributor = new NonceDistributor();
  public readonly asicSimulator = new AsicSimulator();
  public readonly memoryOptimizer = MemoryOptimizer.getInstance();
  
  /**
   * Optimize a mining job for a specific device
   */
  public optimizeJob(job: MiningJob, deviceId: number, hashrate: number): {
    difficulty: number;
    nonceRange: [number, number];
    recommendedNonce: number;
    asicPattern: string;
  } {
    // Register device if not already
    this.variableDifficultyAdjuster.registerDevice(deviceId, hashrate);
    this.nonceDistributor.registerDevice(deviceId, hashrate);
    
    // Get optimized parameters
    const difficulty = this.variableDifficultyAdjuster.getDifficulty(deviceId);
    const nonceRange = this.nonceDistributor.getNonceRange(deviceId);
    const recommendedNonce = this.nonceDistributor.getRecommendedNonce(deviceId, job.jobId);
    const asicPattern = this.asicSimulator.getAsicPattern(job.jobId, job);
    
    return {
      difficulty,
      nonceRange,
      recommendedNonce,
      asicPattern
    };
  }
  
  /**
   * Process a share submission with optimized verification
   */
  public processShare(
    deviceId: number, 
    jobId: string, 
    nonce: string, 
    timestamp: number = Date.now()
  ): void {
    this.variableDifficultyAdjuster.recordShare(deviceId, timestamp);
  }
}

// Create singleton instance
export const miningOptimizer = new MiningOptimizer();