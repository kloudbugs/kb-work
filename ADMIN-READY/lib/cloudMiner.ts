/**
 * KLOUD BUGS Cloud Miner Configuration System
 * 
 * This module implements a specialized mining node that aggregates performance
 * from the entire platform. It serves as the foundation for the purchasable
 * KLOUD mining node that represents the platform itself.
 * 
 * SECURITY NOTICE: This file contains sensitive configuration that should
 * only be accessible to the platform owner.
 */

import * as crypto from 'crypto';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

// Unique identifier for this mining node
const CLOUD_MINER_ID = 'TERA-GUARDIAN-NODE-' + uuidv4().substring(0, 8);

// Performance metrics collection
interface PerformanceMetric {
  timestamp: Date;
  hashrate: number;
  source: string;
  contribution: number;
  efficiency: number;
}

// Node configuration - This structure can be modified only by the owner
interface CloudMinerConfig {
  name: string;
  description: string;
  enabled: boolean;
  ownerAccessKey: string;
  performanceMultiplier: number;
  algorithmVersion: number;
  powerOptimization: number;
  profitSharingPercentage: number;
  teraTokenGeneration: boolean;
  maximumHashrate: number;
  targetEfficiency: number;
  securityLevel: number;
  contributorLimit: number;
  autoOptimize: boolean;
  allowExternalNodes: boolean;
  encryptionLevel: string;
  rewardDistributionModel: string;
  priorityAccess: string[];
  secretAccessKey: string;
}

// Create a private encryption key based on a passphrase
function deriveEncryptionKey(passphrase: string): Buffer {
  return crypto.pbkdf2Sync(
    passphrase,
    'TERA-GUARDIAN-SALT-8675309', // Fixed salt for reproducibility
    10000,
    32,
    'sha256'
  );
}

// Encrypt the configuration for storage
function encryptConfig(config: CloudMinerConfig, passphrase: string): string {
  const key = deriveEncryptionKey(passphrase);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(JSON.stringify(config), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

// Decrypt the configuration 
function decryptConfig(encryptedData: string, passphrase: string): CloudMinerConfig | null {
  try {
    const [ivHex, encryptedHex] = encryptedData.split(':');
    const key = deriveEncryptionKey(passphrase);
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted) as CloudMinerConfig;
  } catch (error) {
    console.error('Failed to decrypt cloud miner configuration');
    return null;
  }
}

// Default cloud miner configuration
const DEFAULT_CONFIG: CloudMinerConfig = {
  name: 'TERA Guardian Aggregated Mining Node',
  description: 'Unified mining node representing the collective performance of the KLOUD BUGS platform',
  enabled: true,
  ownerAccessKey: crypto.randomBytes(32).toString('hex'),
  performanceMultiplier: 1.0,
  algorithmVersion: 1,
  powerOptimization: 0.85,
  profitSharingPercentage: 5.0,
  teraTokenGeneration: true,
  maximumHashrate: 100000, // H/s
  targetEfficiency: 0.92,
  securityLevel: 3,
  contributorLimit: 1000,
  autoOptimize: true,
  allowExternalNodes: false,
  encryptionLevel: 'AES-256',
  rewardDistributionModel: 'proportional',
  priorityAccess: ['TERA-Guardian'],
  secretAccessKey: crypto.randomBytes(64).toString('hex')
};

class CloudMiner extends EventEmitter {
  private config: CloudMinerConfig;
  private encryptedConfig: string;
  private metrics: PerformanceMetric[] = [];
  private aggregatedHashrate: number = 0;
  private contributors: Set<string> = new Set();
  private isRunning: boolean = false;
  private lastOptimization: Date = new Date();
  private accessPassphrase: string;
  
  constructor(passphrase: string) {
    super();
    this.accessPassphrase = passphrase;
    
    // Try to load existing configuration or create default
    try {
      const fs = require('fs');
      if (fs.existsSync('./cloud-miner-config.enc')) {
        const encryptedData = fs.readFileSync('./cloud-miner-config.enc', 'utf8');
        const decrypted = decryptConfig(encryptedData, passphrase);
        
        if (decrypted) {
          this.config = decrypted;
          this.encryptedConfig = encryptedData;
          console.log('[CLOUD-MINER] Existing configuration loaded successfully');
        } else {
          this.config = { ...DEFAULT_CONFIG };
          this.encryptedConfig = encryptConfig(this.config, passphrase);
          console.log('[CLOUD-MINER] Failed to load configuration, using defaults');
        }
      } else {
        this.config = { ...DEFAULT_CONFIG };
        this.encryptedConfig = encryptConfig(this.config, passphrase);
        console.log('[CLOUD-MINER] No configuration found, using defaults');
      }
    } catch (error) {
      this.config = { ...DEFAULT_CONFIG };
      this.encryptedConfig = encryptConfig(this.config, passphrase);
      console.log('[CLOUD-MINER] Error loading configuration, using defaults');
    }
  }
  
  // Start the cloud miner
  public start(): boolean {
    if (!this.config.enabled) {
      console.log('[CLOUD-MINER] Cannot start: cloud miner is disabled in configuration');
      return false;
    }
    
    if (this.isRunning) {
      console.log('[CLOUD-MINER] Cloud miner is already running');
      return true;
    }
    
    this.isRunning = true;
    console.log(`[CLOUD-MINER] Started TERA Guardian Cloud Miner (${CLOUD_MINER_ID})`);
    console.log(`[CLOUD-MINER] Target efficiency: ${this.config.targetEfficiency * 100}%`);
    console.log(`[CLOUD-MINER] Performance multiplier: ${this.config.performanceMultiplier}x`);
    
    // Schedule performance optimization
    setInterval(() => this.optimizePerformance(), 3600000); // Every hour
    
    // Schedule metrics aggregation
    setInterval(() => this.aggregateMetrics(), 60000); // Every minute
    
    this.emit('started', {
      id: CLOUD_MINER_ID,
      timestamp: new Date(),
      config: {
        name: this.config.name,
        performanceMultiplier: this.config.performanceMultiplier,
        maximumHashrate: this.config.maximumHashrate
      }
    });
    
    return true;
  }
  
  // Stop the cloud miner
  public stop(): boolean {
    if (!this.isRunning) {
      console.log('[CLOUD-MINER] Cloud miner is not running');
      return true;
    }
    
    this.isRunning = false;
    console.log(`[CLOUD-MINER] Stopped TERA Guardian Cloud Miner (${CLOUD_MINER_ID})`);
    
    this.emit('stopped', {
      id: CLOUD_MINER_ID,
      timestamp: new Date()
    });
    
    return true;
  }
  
  // Report performance metrics from a mining node
  public reportPerformance(source: string, hashrate: number, efficiency: number): boolean {
    if (!this.isRunning) {
      return false;
    }
    
    // Calculate contribution based on hashrate and platform's performance multiplier
    const contribution = hashrate * efficiency * this.config.performanceMultiplier;
    
    // Add to metrics collection
    this.metrics.push({
      timestamp: new Date(),
      hashrate,
      source,
      contribution,
      efficiency
    });
    
    // Limit metrics collection size
    if (this.metrics.length > 10000) {
      this.metrics = this.metrics.slice(-5000);
    }
    
    // Add source to contributors if new
    this.contributors.add(source);
    
    // Check contributor limit
    if (this.contributors.size > this.config.contributorLimit) {
      console.log(`[CLOUD-MINER] Warning: Contributor limit exceeded (${this.contributors.size}/${this.config.contributorLimit})`);
    }
    
    return true;
  }
  
  // Aggregate all metrics into a single hashrate value
  private aggregateMetrics(): void {
    if (this.metrics.length === 0) {
      this.aggregatedHashrate = 0;
      return;
    }
    
    // Get metrics from last 5 minutes
    const recentTime = new Date(Date.now() - 5 * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp >= recentTime);
    
    if (recentMetrics.length === 0) {
      return;
    }
    
    // Calculate total contribution
    const totalContribution = recentMetrics.reduce((sum, metric) => sum + metric.contribution, 0);
    
    // Calculate average efficiency
    const avgEfficiency = recentMetrics.reduce((sum, metric) => sum + metric.efficiency, 0) / recentMetrics.length;
    
    // Update aggregated hashrate with platform multiplier
    this.aggregatedHashrate = totalContribution;
    
    // Cap at maximum hashrate if needed
    if (this.aggregatedHashrate > this.config.maximumHashrate) {
      this.aggregatedHashrate = this.config.maximumHashrate;
    }
    
    console.log(`[CLOUD-MINER] Aggregated Hashrate: ${this.aggregatedHashrate.toFixed(2)} H/s from ${this.contributors.size} contributors`);
    console.log(`[CLOUD-MINER] Average Efficiency: ${(avgEfficiency * 100).toFixed(2)}%`);
    
    this.emit('metrics', {
      id: CLOUD_MINER_ID,
      timestamp: new Date(),
      hashrate: this.aggregatedHashrate,
      contributors: this.contributors.size,
      efficiency: avgEfficiency
    });
  }
  
  // Optimize the miner performance based on collected metrics
  private optimizePerformance(): void {
    if (!this.config.autoOptimize || this.metrics.length === 0) {
      return;
    }
    
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    // Only optimize if enough time has passed
    if (this.lastOptimization > hourAgo) {
      return;
    }
    
    // Calculate average efficiency
    const recentMetrics = this.metrics.filter(m => m.timestamp >= hourAgo);
    
    if (recentMetrics.length < 10) {
      console.log('[CLOUD-MINER] Not enough metrics for optimization');
      return;
    }
    
    const avgEfficiency = recentMetrics.reduce((sum, metric) => sum + metric.efficiency, 0) / recentMetrics.length;
    
    // If efficiency is below target, adjust performance multiplier
    if (avgEfficiency < this.config.targetEfficiency) {
      const oldMultiplier = this.config.performanceMultiplier;
      this.config.performanceMultiplier *= 0.95; // Reduce by 5%
      console.log(`[CLOUD-MINER] Reducing performance multiplier: ${oldMultiplier.toFixed(2)} -> ${this.config.performanceMultiplier.toFixed(2)}`);
    } 
    // If efficiency is well above target, increase performance
    else if (avgEfficiency > this.config.targetEfficiency + 0.05) {
      const oldMultiplier = this.config.performanceMultiplier;
      this.config.performanceMultiplier *= 1.03; // Increase by 3%
      console.log(`[CLOUD-MINER] Increasing performance multiplier: ${oldMultiplier.toFixed(2)} -> ${this.config.performanceMultiplier.toFixed(2)}`);
    }
    
    this.lastOptimization = new Date();
    
    // Save the updated configuration
    this.saveConfig();
    
    this.emit('optimization', {
      id: CLOUD_MINER_ID,
      timestamp: new Date(),
      newMultiplier: this.config.performanceMultiplier,
      efficiency: avgEfficiency
    });
  }
  
  // Get current cloud miner status - limited info for general use
  public getStatus(): any {
    return {
      id: CLOUD_MINER_ID,
      name: this.config.name,
      description: this.config.description,
      running: this.isRunning,
      hashrate: this.aggregatedHashrate,
      contributors: this.contributors.size,
      algorithmVersion: this.config.algorithmVersion,
      teraTokenGeneration: this.config.teraTokenGeneration
    };
  }
  
  // Get full configuration - requires owner access key
  public getFullConfig(accessKey: string): CloudMinerConfig | null {
    if (accessKey !== this.config.ownerAccessKey) {
      console.log('[CLOUD-MINER] Invalid access key provided for configuration access');
      return null;
    }
    
    return { ...this.config };
  }
  
  // Update configuration - requires owner access key
  public updateConfig(accessKey: string, newConfig: Partial<CloudMinerConfig>): boolean {
    if (accessKey !== this.config.ownerAccessKey) {
      console.log('[CLOUD-MINER] Invalid access key provided for configuration update');
      return false;
    }
    
    // Update config with new values
    Object.assign(this.config, newConfig);
    
    // Don't allow modifying the access key through this method
    this.config.ownerAccessKey = accessKey;
    
    console.log('[CLOUD-MINER] Configuration updated successfully');
    this.saveConfig();
    
    return true;
  }
  
  // Reset to default configuration - requires owner access key
  public resetConfig(accessKey: string): boolean {
    if (accessKey !== this.config.ownerAccessKey) {
      console.log('[CLOUD-MINER] Invalid access key provided for configuration reset');
      return false;
    }
    
    const oldAccessKey = this.config.ownerAccessKey;
    this.config = { ...DEFAULT_CONFIG };
    this.config.ownerAccessKey = oldAccessKey; // Preserve the access key
    
    console.log('[CLOUD-MINER] Configuration reset to defaults');
    this.saveConfig();
    
    return true;
  }
  
  // Save the current configuration to an encrypted file
  private saveConfig(): void {
    try {
      const fs = require('fs');
      this.encryptedConfig = encryptConfig(this.config, this.accessPassphrase);
      fs.writeFileSync('./cloud-miner-config.enc', this.encryptedConfig);
      console.log('[CLOUD-MINER] Configuration saved successfully');
    } catch (error) {
      console.error('[CLOUD-MINER] Failed to save configuration:', error);
    }
  }
  
  // Get the current owner access key
  public getOwnerAccessKey(passphrase: string): string | null {
    if (passphrase !== this.accessPassphrase) {
      console.log('[CLOUD-MINER] Invalid passphrase provided for access key retrieval');
      return null;
    }
    
    return this.config.ownerAccessKey;
  }
  
  // Generate a new access key - requires current access key and passphrase
  public regenerateAccessKey(currentKey: string, passphrase: string): string | null {
    if (currentKey !== this.config.ownerAccessKey || passphrase !== this.accessPassphrase) {
      console.log('[CLOUD-MINER] Invalid credentials provided for access key regeneration');
      return null;
    }
    
    this.config.ownerAccessKey = crypto.randomBytes(32).toString('hex');
    this.saveConfig();
    
    console.log('[CLOUD-MINER] Owner access key regenerated successfully');
    return this.config.ownerAccessKey;
  }
  
  // Get aggregated hashrate
  public getHashrate(): number {
    return this.aggregatedHashrate;
  }
  
  // Get TERA token generation rate based on hashrate
  public getTeraTokenGenerationRate(): number {
    if (!this.config.teraTokenGeneration || !this.isRunning) {
      return 0;
    }
    
    // Convert hashrate to TERA tokens per day using a logarithmic scale
    // This creates diminishing returns at higher hashrates
    return Math.log10(1 + this.aggregatedHashrate / 1000) * this.config.performanceMultiplier;
  }
}

// Create a singleton instance with a secret passphrase
// This passphrase is required to access the full configuration
const cloudMiner = new CloudMiner('TERA-GUARDIAN-SECRET-PASSPHRASE-20250415');

export default cloudMiner;