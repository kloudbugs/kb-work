import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

export interface TRexConfig {
  algorithm: string;
  pool: string;
  wallet: string;
  worker: string;
  password: string;
  coin: string;
  intensity: number;
  gpus: string;
}

export interface TRexStats {
  isRunning: boolean;
  hashrate: number;
  accepted: number;
  rejected: number;
  uptime: number;
  temperature: number[];
  power: number[];
  pool: string;
  algorithm: string;
  gpuCount: number;
}

export class TRexWrapper extends EventEmitter {
  private process: ChildProcess | null = null;
  private isRunning = false;
  private stats: TRexStats;
  private startTime: number = 0;
  private configPath: string;

  constructor() {
    super();
    this.configPath = path.join(process.cwd(), 'miners', 'trex-config.json');
    this.stats = {
      isRunning: false,
      hashrate: 0,
      accepted: 0,
      rejected: 0,
      uptime: 0,
      temperature: [],
      power: [],
      pool: '',
      algorithm: '',
      gpuCount: 0
    };
    this.ensureMinersDirectory();
  }

  private ensureMinersDirectory(): void {
    const minersDir = path.join(process.cwd(), 'miners');
    if (!existsSync(minersDir)) {
      mkdirSync(minersDir, { recursive: true });
    }
  }

  public async startMining(config: TRexConfig): Promise<boolean> {
    if (this.isRunning) {
      console.log('T-Rex is already running');
      return true;
    }

    try {
      this.createConfig(config);
      this.startTime = Date.now();
      
      console.log(`🚀 Starting T-Rex miner for ${config.algorithm} (${config.coin})...`);
      
      // T-Rex command arguments
      const args = [
        '--config', this.configPath,
        '--no-color',
        '--api-bind-http', '127.0.0.1:4067'
      ];
      
      this.process = spawn('t-rex', args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.process.stdout?.on('data', (data) => {
        const output = data.toString();
        this.parseOutput(output);
        console.log(`T-Rex: ${output.trim()}`);
      });

      this.process.stderr?.on('data', (data) => {
        const error = data.toString();
        console.error(`T-Rex Error: ${error.trim()}`);
        this.emit('error', error);
      });

      this.process.on('close', (code) => {
        console.log(`T-Rex process exited with code ${code}`);
        this.isRunning = false;
        this.stats.isRunning = false;
        this.emit('stopped', { code });
      });

      this.process.on('error', (error) => {
        console.error('Failed to start T-Rex:', error);
        this.isRunning = false;
        this.stats.isRunning = false;
        this.emit('error', error);
      });

      this.isRunning = true;
      this.stats.isRunning = true;
      this.stats.pool = config.pool;
      this.stats.algorithm = config.algorithm;
      
      this.emit('started', config);
      this.startStatsUpdater();
      
      return true;
    } catch (error) {
      console.error('Error starting T-Rex:', error);
      return false;
    }
  }

  public stopMining(): boolean {
    if (!this.isRunning || !this.process) {
      console.log('T-Rex is not running');
      return true;
    }

    try {
      console.log('🛑 Stopping T-Rex...');
      this.process.kill('SIGTERM');
      
      setTimeout(() => {
        if (this.process && !this.process.killed) {
          this.process.kill('SIGKILL');
        }
      }, 5000);

      this.isRunning = false;
      this.stats.isRunning = false;
      this.emit('stopped', { manual: true });
      
      return true;
    } catch (error) {
      console.error('Error stopping T-Rex:', error);
      return false;
    }
  }

  public getStats(): TRexStats {
    if (this.isRunning && this.startTime > 0) {
      this.stats.uptime = Math.floor((Date.now() - this.startTime) / 1000);
    }
    return { ...this.stats };
  }

  private createConfig(config: TRexConfig): void {
    const trexConfig = {
      "pools": [
        {
          "user": config.wallet,
          "url": config.pool,
          "pass": config.password,
          "worker": config.worker
        }
      ],
      "algorithm": config.algorithm,
      "coin": config.coin,
      "intensity": config.intensity,
      "gpu-report-interval": 10,
      "log-path": "./miners/logs/",
      "validate-shares": true,
      "no-watchdog": false,
      "retries": 3,
      "retry-pause": 15,
      "timeout": 300,
      "nvml": true,
      "pci-indexing": false,
      "ab-indexing": false,
      "low-load": 0,
      "kernel": 0,
      "gpu-init-mode": 0,
      "daggen-mode": 0,
      "safe-dag": false,
      "worker": config.worker,
      "api-bind-http": "127.0.0.1:4067",
      "api-bind-telnet": "127.0.0.1:4068"
    };

    // Add GPU selection if specified
    if (config.gpus && config.gpus !== 'all') {
      trexConfig['gpu-report-interval'] = 10;
    }

    writeFileSync(this.configPath, JSON.stringify(trexConfig, null, 2));
    console.log(`✅ T-Rex config created: ${this.configPath}`);
  }

  private parseOutput(output: string): void {
    // Parse T-Rex output for statistics
    if (output.includes('GPU') && output.includes('MH/s')) {
      const hashrateMatch = output.match(/(\d+\.?\d*)\s*(H\/s|KH\/s|MH\/s|GH\/s)/);
      if (hashrateMatch) {
        let hashrate = parseFloat(hashrateMatch[1]);
        const unit = hashrateMatch[2];
        
        // Convert to H/s
        switch (unit) {
          case 'KH/s': hashrate *= 1000; break;
          case 'MH/s': hashrate *= 1000000; break;
          case 'GH/s': hashrate *= 1000000000; break;
        }
        
        this.stats.hashrate = hashrate;
      }
    }

    if (output.includes('Accepted:')) {
      const acceptedMatch = output.match(/Accepted:\s*(\d+)/);
      if (acceptedMatch) {
        this.stats.accepted = parseInt(acceptedMatch[1]);
      }
    }

    if (output.includes('Rejected:')) {
      const rejectedMatch = output.match(/Rejected:\s*(\d+)/);
      if (rejectedMatch) {
        this.stats.rejected = parseInt(rejectedMatch[1]);
      }
    }

    // Parse GPU temperatures
    if (output.includes('°C')) {
      const tempMatches = output.match(/(\d+)°C/g);
      if (tempMatches) {
        this.stats.temperature = tempMatches.map(temp => parseInt(temp.replace('°C', '')));
      }
    }

    // Parse power consumption
    if (output.includes('W')) {
      const powerMatches = output.match(/(\d+)W/g);
      if (powerMatches) {
        this.stats.power = powerMatches.map(power => parseInt(power.replace('W', '')));
      }
    }

    // Count GPUs
    if (output.includes('GPU') && output.includes('#')) {
      const gpuMatches = output.match(/GPU #\d+/g);
      if (gpuMatches) {
        this.stats.gpuCount = gpuMatches.length;
      }
    }

    // Emit events for important updates
    if (output.includes('Accepted')) {
      this.emit('share_accepted', {
        accepted: this.stats.accepted,
        rejected: this.stats.rejected,
        hashrate: this.stats.hashrate
      });
    }

    if (output.includes('New job')) {
      this.emit('new_job', {
        algorithm: this.stats.algorithm,
        pool: this.stats.pool
      });
    }

    if (output.includes('Connected to')) {
      this.emit('pool_connected', {
        pool: this.stats.pool
      });
    }
  }

  private startStatsUpdater(): void {
    const updateInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(updateInterval);
        return;
      }
      this.emit('stats_update', this.getStats());
    }, 5000);
  }

  // API methods for getting detailed stats via HTTP API
  public async getDetailedStats(): Promise<any> {
    if (!this.isRunning) {
      return null;
    }

    try {
      const response = await fetch('http://127.0.0.1:4067/summary');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('T-Rex API not available yet');
    }
    return null;
  }
}

export const trexMiner = new TRexWrapper();