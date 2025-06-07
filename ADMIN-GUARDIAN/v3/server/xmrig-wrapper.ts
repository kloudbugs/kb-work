import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

export interface XMRigConfig {
  pool: string;
  user: string;
  pass: string;
  coin: string;
  threads: number;
  cpu: boolean;
  opencl: boolean;
  cuda: boolean;
}

export interface XMRigStats {
  isRunning: boolean;
  hashrate: number;
  accepted: number;
  rejected: number;
  uptime: number;
  difficulty: number;
  pool: string;
  coin: string;
}

export class XMRigWrapper extends EventEmitter {
  private process: ChildProcess | null = null;
  private isRunning = false;
  private stats: XMRigStats;
  private startTime: number = 0;
  private configPath: string;

  constructor() {
    super();
    this.configPath = path.join(process.cwd(), 'miners', 'xmrig-config.json');
    this.stats = {
      isRunning: false,
      hashrate: 0,
      accepted: 0,
      rejected: 0,
      uptime: 0,
      difficulty: 0,
      pool: '',
      coin: ''
    };
    this.ensureMinersDirectory();
  }

  private ensureMinersDirectory(): void {
    const minersDir = path.join(process.cwd(), 'miners');
    if (!existsSync(minersDir)) {
      mkdirSync(minersDir, { recursive: true });
    }
  }

  public async startMining(config: XMRigConfig): Promise<boolean> {
    if (this.isRunning) {
      console.log('XMRig is already running');
      return true;
    }

    try {
      this.createConfig(config);
      this.startTime = Date.now();
      
      console.log(`🚀 Starting XMRig for ${config.coin} mining...`);
      
      // XMRig command with config file
      const args = [
        '--config', this.configPath,
        '--no-color',
        '--print-time=60'
      ];
      
      this.process = spawn('xmrig', args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.process.stdout?.on('data', (data) => {
        const output = data.toString();
        this.parseOutput(output);
        console.log(`XMRig: ${output.trim()}`);
      });

      this.process.stderr?.on('data', (data) => {
        const error = data.toString();
        console.error(`XMRig Error: ${error.trim()}`);
        this.emit('error', error);
      });

      this.process.on('close', (code) => {
        console.log(`XMRig process exited with code ${code}`);
        this.isRunning = false;
        this.stats.isRunning = false;
        this.emit('stopped', { code });
      });

      this.process.on('error', (error) => {
        console.error('Failed to start XMRig:', error);
        this.isRunning = false;
        this.stats.isRunning = false;
        this.emit('error', error);
      });

      this.isRunning = true;
      this.stats.isRunning = true;
      this.stats.pool = config.pool;
      this.stats.coin = config.coin;
      
      this.emit('started', config);
      this.startStatsUpdater();
      
      return true;
    } catch (error) {
      console.error('Error starting XMRig:', error);
      return false;
    }
  }

  public stopMining(): boolean {
    if (!this.isRunning || !this.process) {
      console.log('XMRig is not running');
      return true;
    }

    try {
      console.log('🛑 Stopping XMRig...');
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
      console.error('Error stopping XMRig:', error);
      return false;
    }
  }

  public getStats(): XMRigStats {
    if (this.isRunning && this.startTime > 0) {
      this.stats.uptime = Math.floor((Date.now() - this.startTime) / 1000);
    }
    return { ...this.stats };
  }

  private createConfig(config: XMRigConfig): void {
    const xmrigConfig = {
      "api": {
        "id": null,
        "worker-id": null
      },
      "http": {
        "enabled": false,
        "host": "127.0.0.1",
        "port": 0,
        "access-token": null,
        "restricted": true
      },
      "autosave": true,
      "background": false,
      "colors": true,
      "title": true,
      "randomx": {
        "init": -1,
        "init-avx2": -1,
        "mode": "auto",
        "1gb-pages": false,
        "rdmsr": true,
        "wrmsr": true,
        "cache_qos": false,
        "numa": true,
        "scratchpad_prefetch_mode": 1
      },
      "cpu": {
        "enabled": config.cpu,
        "huge-pages": true,
        "huge-pages-jit": false,
        "hw-aes": null,
        "priority": null,
        "memory-pool": false,
        "yield": true,
        "max-threads-hint": 100,
        "asm": true,
        "argon2-impl": null,
        "astrobwt-max-size": 550,
        "astrobwt-avx2": false,
        "cn/0": false,
        "cn-lite/0": false
      },
      "opencl": {
        "enabled": config.opencl,
        "cache": true,
        "loader": null,
        "platform": "AMD",
        "adl": true,
        "cn/0": false,
        "cn-lite/0": false
      },
      "cuda": {
        "enabled": config.cuda,
        "loader": null,
        "nvml": true,
        "cn/0": false,
        "cn-lite/0": false
      },
      "donate-level": 1,
      "donate-over-proxy": 1,
      "log-file": null,
      "pools": [
        {
          "algo": null,
          "coin": config.coin,
          "url": config.pool,
          "user": config.user,
          "pass": config.pass,
          "rig-id": null,
          "nicehash": false,
          "keepalive": false,
          "enabled": true,
          "tls": false,
          "tls-fingerprint": null,
          "daemon": false,
          "socks5": null,
          "self-select": null,
          "submit-to-origin": false
        }
      ],
      "print-time": 60,
      "health-print-time": 60,
      "dmi": true,
      "retries": 5,
      "retry-pause": 5,
      "syslog": false,
      "tls": {
        "enabled": false,
        "protocols": null,
        "cert": null,
        "cert_key": null,
        "ciphers": null,
        "ciphersuites": null,
        "dhparam": null
      },
      "user-agent": null,
      "verbose": 0,
      "watch": true,
      "pause-on-battery": false,
      "pause-on-active": false
    };

    writeFileSync(this.configPath, JSON.stringify(xmrigConfig, null, 2));
    console.log(`✅ XMRig config created: ${this.configPath}`);
  }

  private parseOutput(output: string): void {
    // Parse XMRig output for statistics
    if (output.includes('speed')) {
      const hashrateMatch = output.match(/speed.*?(\d+\.?\d*)\s*(H\/s|KH\/s)/);
      if (hashrateMatch) {
        let hashrate = parseFloat(hashrateMatch[1]);
        if (hashrateMatch[2] === 'KH/s') {
          hashrate *= 1000;
        }
        this.stats.hashrate = hashrate;
      }
    }

    if (output.includes('accepted')) {
      const acceptedMatch = output.match(/accepted\s+(\d+)/);
      if (acceptedMatch) {
        this.stats.accepted = parseInt(acceptedMatch[1]);
      }
    }

    if (output.includes('rejected')) {
      const rejectedMatch = output.match(/rejected\s+(\d+)/);
      if (rejectedMatch) {
        this.stats.rejected = parseInt(rejectedMatch[1]);
      }
    }

    if (output.includes('diff')) {
      const diffMatch = output.match(/diff\s+(\d+)/);
      if (diffMatch) {
        this.stats.difficulty = parseInt(diffMatch[1]);
      }
    }

    // Emit events for important updates
    if (output.includes('accepted')) {
      this.emit('share_accepted', {
        accepted: this.stats.accepted,
        rejected: this.stats.rejected
      });
    }

    if (output.includes('new job')) {
      this.emit('new_job', {
        difficulty: this.stats.difficulty
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
}

export const xmrigMiner = new XMRigWrapper();