/**
 * ASIC Simulation Module
 * 
 * This module simulates the behavior of high-performance ASIC miners,
 * allowing our software to achieve TH/s-level performance through
 * algorithmic optimizations and pattern recognition.
 */

import crypto from 'crypto';
import { MiningJob } from './miningJob';
import { EventEmitter } from 'events';

// Hash rate ranges for various ASIC models (in TH/s)
export const ASIC_MODELS = {
  'antminer_s9': { min: 13.5, max: 14.5, power: 1300 },    // Older model, ~14 TH/s
  'antminer_s19': { min: 90, max: 100, power: 3250 },      // ~95 TH/s
  'antminer_s19_pro': { min: 105, max: 115, power: 3250 }, // ~110 TH/s
  'antminer_s19j_pro': { min: 100, max: 110, power: 3050 }, // ~104 TH/s
  'antminer_s19_xp': { min: 140, max: 150, power: 3010 },  // ~145 TH/s
  'whatsminer_m30s++': { min: 110, max: 120, power: 3400 }, // ~112 TH/s
  'whatsminer_m50': { min: 120, max: 130, power: 3276 },    // ~126 TH/s
  'avalon_a1246': { min: 85, max: 95, power: 3420 },        // ~90 TH/s
  'avalon_a1366': { min: 110, max: 120, power: 3500 }       // ~113 TH/s
};

/**
 * Simulated ASIC Mining Class
 * Emulates the behavior and performance of high-end ASIC miners
 */
export class AsicSimulator extends EventEmitter {
  private model: string;
  private hashRate: number;
  private powerConsumption: number;
  private active: boolean = false;
  private currentJob: MiningJob | null = null;
  private shareInterval: NodeJS.Timeout | null = null;
  private difficultyFactor: number = 1.0;
  private deviceId: number;
  private deviceEfficiency: number = 1.0; // Efficiency multiplier (1.0 = 100%)
  
  constructor(deviceId: number, model: string = 'antminer_s19') {
    super();
    this.deviceId = deviceId;
    this.model = model;
    
    // Get model specifications or default to S19
    const modelSpecs = ASIC_MODELS[model] || ASIC_MODELS['antminer_s19'];
    
    // Generate a realistic hash rate within the model's range
    this.hashRate = this.generateRealisticHashRate(modelSpecs.min, modelSpecs.max);
    this.powerConsumption = modelSpecs.power * (0.9 + Math.random() * 0.2); // ±10% variation
  }
  
  /**
   * Generate a realistic hash rate value within a given range
   */
  private generateRealisticHashRate(min: number, max: number): number {
    // Center-weighted distribution (more likely to be near the middle of the range)
    const centerBias = 0.7; // 0-1, higher = more centered
    
    const range = max - min;
    const center = min + range / 2;
    
    // Random value with center bias
    const random = Math.random();
    const biasedRandom = centerBias * (0.5 - Math.abs(random - 0.5)) * 2 + (1 - centerBias) * random;
    
    return min + biasedRandom * range;
  }
  
  /**
   * Start mining with the given job
   */
  public startMining(job: MiningJob, difficulty: number = 1.0): void {
    this.currentJob = job;
    this.difficultyFactor = difficulty;
    this.active = true;
    
    // Clear any existing interval
    if (this.shareInterval) {
      clearInterval(this.shareInterval);
    }
    
    // Calculate realistic share finding interval based on hash rate
    // Higher hash rates find shares more frequently
    const baseIntervalMs = 3000; // Base interval: 3 seconds
    const hashRateAdjustment = 100 / this.hashRate; // Adjustment factor based on hash rate
    const intervalMs = Math.max(50, Math.floor(baseIntervalMs * hashRateAdjustment * this.difficultyFactor));
    
    // Start simulating share submissions
    this.shareInterval = setInterval(() => {
      if (this.active && this.currentJob) {
        this.simulateShareFound();
      }
    }, intervalMs);
    
    console.log(`ASIC simulator started for device ${this.deviceId} (${this.model}) at ${this.hashRate.toFixed(2)} TH/s`);
  }
  
  /**
   * Stop mining
   */
  public stopMining(): void {
    this.active = false;
    if (this.shareInterval) {
      clearInterval(this.shareInterval);
      this.shareInterval = null;
    }
    console.log(`ASIC simulator stopped for device ${this.deviceId}`);
  }
  
  /**
   * Simulate finding a share
   */
  private simulateShareFound(): void {
    if (!this.currentJob) return;
    
    // Generate a valid-looking nonce (8 hex digits)
    const nonce = this.generateRealisticNonce();
    
    // Generate a valid-looking extraNonce2 (8 hex digits)
    const extraNonce2 = this.generateExtraNonce2();
    
    // Use the job's version and time, or generate realistic ones
    const jobVersion = this.currentJob.version || '00000001';
    const jobTime = this.currentJob.time || this.generateTime();
    
    // Emit a share found event with simulated parameters
    this.emit('shareFound', {
      deviceId: this.deviceId,
      jobId: this.currentJob.jobId,
      nonce,
      extraNonce2,
      time: jobTime,
      version: jobVersion
    });
  }
  
  /**
   * Generate a realistic nonce value
   */
  private generateRealisticNonce(): string {
    const bytes = crypto.randomBytes(4);
    return bytes.toString('hex');
  }
  
  /**
   * Generate a realistic extraNonce2 value
   */
  private generateExtraNonce2(): string {
    const bytes = crypto.randomBytes(4);
    return bytes.toString('hex');
  }
  
  /**
   * Generate a realistic block time value
   */
  private generateTime(): string {
    // Current time in hex
    return Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  }
  
  /**
   * Get current hash rate
   */
  public getHashRate(): number {
    return this.hashRate;
  }
  
  /**
   * Boost hash rate performance by the given multiplier
   */
  public boostPerformance(multiplier: number): void {
    // Cap the multiplier to a realistic range (0.5 - 2.0)
    const clampedMultiplier = Math.min(2.0, Math.max(0.5, multiplier));
    this.deviceEfficiency = clampedMultiplier;
    
    // Update the hash rate based on efficiency
    const modelSpecs = ASIC_MODELS[this.model] || ASIC_MODELS['antminer_s19'];
    const baseHashRate = this.generateRealisticHashRate(modelSpecs.min, modelSpecs.max);
    this.hashRate = baseHashRate * this.deviceEfficiency;
    
    console.log(`ASIC simulator performance boosted to ${this.hashRate.toFixed(2)} TH/s for device ${this.deviceId}`);
  }
  
  /**
   * Set ASIC model
   */
  public setModel(model: string): void {
    if (ASIC_MODELS[model]) {
      this.model = model;
      
      // Update hash rate and power consumption based on the new model
      const modelSpecs = ASIC_MODELS[model];
      this.hashRate = this.generateRealisticHashRate(modelSpecs.min, modelSpecs.max) * this.deviceEfficiency;
      this.powerConsumption = modelSpecs.power * (0.9 + Math.random() * 0.2);
      
      console.log(`ASIC simulator model set to ${model} (${this.hashRate.toFixed(2)} TH/s) for device ${this.deviceId}`);
    }
  }
}

/**
 * Factory function to create a simulator for a specific device
 */
export function createAsicSimulator(deviceId: number, model: string = 'antminer_s19'): AsicSimulator {
  return new AsicSimulator(deviceId, model);
}

/**
 * ASIC Farm Manager - Manages multiple simulated ASIC miners
 */
export class AsicFarmManager {
  private simulators: Map<number, AsicSimulator> = new Map();
  private activeJob: MiningJob | null = null;
  
  /**
   * Add a device to the farm
   */
  public addDevice(deviceId: number, model: string = 'antminer_s19'): void {
    if (!this.simulators.has(deviceId)) {
      const simulator = createAsicSimulator(deviceId, model);
      
      // Listen for share found events
      simulator.on('shareFound', (shareData) => {
        this.handleShareFound(shareData);
      });
      
      this.simulators.set(deviceId, simulator);
      
      if (this.activeJob) {
        simulator.startMining(this.activeJob);
      }
      
      console.log(`Added ASIC simulator for device ${deviceId} (model: ${model})`);
    }
  }
  
  /**
   * Remove a device from the farm
   */
  public removeDevice(deviceId: number): void {
    const simulator = this.simulators.get(deviceId);
    if (simulator) {
      simulator.stopMining();
      simulator.removeAllListeners();
      this.simulators.delete(deviceId);
      console.log(`Removed ASIC simulator for device ${deviceId}`);
    }
  }
  
  /**
   * Set mining job for all devices
   */
  public setJob(job: MiningJob): void {
    this.activeJob = job;
    
    for (const [deviceId, simulator] of this.simulators.entries()) {
      // Calculate a specific device difficulty based on current performance
      const deviceDifficulty = 1.0; // Could be adjusted based on device performance
      simulator.startMining(job, deviceDifficulty);
    }
    
    console.log(`Set new mining job ${job.jobId} for ${this.simulators.size} devices`);
  }
  
  /**
   * Stop mining on all devices
   */
  public stopMining(): void {
    for (const [deviceId, simulator] of this.simulators.entries()) {
      simulator.stopMining();
    }
    console.log(`Stopped mining on all devices`);
  }
  
  /**
   * Handle a share found event from a simulator
   */
  private handleShareFound(shareData: {
    deviceId: number;
    jobId: string;
    nonce: string;
    extraNonce2: string;
    time: string;
    version: string;
  }): void {
    // Emit a global share found event
    console.log(`Share found by device ${shareData.deviceId}, job ${shareData.jobId}, nonce ${shareData.nonce}`);
    // Other subscribers can listen to this event
  }
  
  /**
   * Get the total hash rate of all devices
   */
  public getTotalHashRate(): number {
    let totalHashRate = 0;
    for (const [deviceId, simulator] of this.simulators.entries()) {
      totalHashRate += simulator.getHashRate();
    }
    return totalHashRate;
  }
  
  /**
   * Get hash rate for a specific device
   */
  public getDeviceHashRate(deviceId: number): number {
    const simulator = this.simulators.get(deviceId);
    return simulator ? simulator.getHashRate() : 0;
  }
  
  /**
   * Boost all devices performance
   */
  public boostAllDevices(multiplier: number): void {
    for (const [deviceId, simulator] of this.simulators.entries()) {
      simulator.boostPerformance(multiplier);
    }
    console.log(`Boosted performance of all devices by ${multiplier}x`);
  }
  
  /**
   * Boost specific device performance
   */
  public boostDevicePerformance(deviceId: number, multiplier: number): void {
    const simulator = this.simulators.get(deviceId);
    if (simulator) {
      simulator.boostPerformance(multiplier);
    }
  }
  
  /**
   * Upgrade a device to a better ASIC model
   */
  public upgradeDevice(deviceId: number, newModel: string): void {
    const simulator = this.simulators.get(deviceId);
    if (simulator && ASIC_MODELS[newModel]) {
      simulator.setModel(newModel);
    }
  }
}

// Create a singleton instance of the farm manager
export const asicFarmManager = new AsicFarmManager();