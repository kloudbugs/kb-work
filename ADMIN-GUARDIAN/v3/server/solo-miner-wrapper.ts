import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import path from 'path';

export interface SoloMinerStats {
  isRunning: boolean;
  hashrate: number;
  blocksFound: number;
  uptime: number;
  walletAddress: string;
  currentHeight: number;
  difficulty: string;
  shares: number;
}

export class SoloMinerV2Wrapper extends EventEmitter {
  private process: ChildProcess | null = null;
  private isRunning = false;
  private stats: SoloMinerStats;
  private startTime: number = 0;
  private walletAddress: string = '';

  constructor() {
    super();
    this.stats = {
      isRunning: false,
      hashrate: 0,
      blocksFound: 0,
      uptime: 0,
      walletAddress: '',
      currentHeight: 0,
      difficulty: '0',
      shares: 0
    };
  }

  public async startMining(walletAddress: string): Promise<boolean> {
    if (this.isRunning) {
      console.log('Solo miner is already running');
      return true;
    }

    try {
      this.walletAddress = walletAddress;
      this.startTime = Date.now();
      
      // Update the wallet address in the Python script
      await this.updateWalletAddress(walletAddress);
      
      // Start the Python solo miner
      const scriptPath = path.join(process.cwd(), 'solo-miner', 'SoloMinerV2.py');
      console.log(`🚀 Starting SoloMinerV2 with wallet: ${walletAddress}`);
      
      this.process = spawn('python3', [scriptPath], {
        cwd: path.join(process.cwd(), 'solo-miner'),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.process.stdout?.on('data', (data) => {
        const output = data.toString();
        this.parseOutput(output);
        console.log(`Solo Miner: ${output.trim()}`);
      });

      this.process.stderr?.on('data', (data) => {
        const error = data.toString();
        console.error(`Solo Miner Error: ${error.trim()}`);
        this.emit('error', error);
      });

      this.process.on('close', (code) => {
        console.log(`Solo miner process exited with code ${code}`);
        this.isRunning = false;
        this.stats.isRunning = false;
        this.emit('stopped', { code });
      });

      this.process.on('error', (error) => {
        console.error('Failed to start solo miner:', error);
        this.isRunning = false;
        this.stats.isRunning = false;
        this.emit('error', error);
      });

      this.isRunning = true;
      this.stats.isRunning = true;
      this.stats.walletAddress = walletAddress;
      
      this.emit('started', { walletAddress });
      
      // Update stats every 5 seconds
      this.startStatsUpdater();
      
      return true;
    } catch (error) {
      console.error('Error starting solo miner:', error);
      return false;
    }
  }

  public stopMining(): boolean {
    if (!this.isRunning || !this.process) {
      console.log('Solo miner is not running');
      return true;
    }

    try {
      console.log('🛑 Stopping SoloMinerV2...');
      
      // Send SIGINT to gracefully stop the miner
      this.process.kill('SIGINT');
      
      // Force kill after 5 seconds if not stopped
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
      console.error('Error stopping solo miner:', error);
      return false;
    }
  }

  public getStats(): SoloMinerStats {
    if (this.isRunning && this.startTime > 0) {
      this.stats.uptime = Math.floor((Date.now() - this.startTime) / 1000);
    }
    return { ...this.stats };
  }

  private async updateWalletAddress(address: string): Promise<void> {
    try {
      const fs = await import('fs');
      const scriptPath = path.join(process.cwd(), 'solo-miner', 'SoloMinerV2.py');
      
      let content = fs.readFileSync(scriptPath, 'utf8');
      
      // Replace the wallet address in the Python script
      const addressRegex = /address = '[^']+'/;
      content = content.replace(addressRegex, `address = '${address}'`);
      
      fs.writeFileSync(scriptPath, content);
      console.log(`✅ Updated wallet address to: ${address}`);
    } catch (error) {
      console.error('Failed to update wallet address:', error);
    }
  }

  private parseOutput(output: string): void {
    // Parse mining output to extract stats
    if (output.includes('Working to solve block')) {
      const heightMatch = output.match(/height (\d+)/);
      if (heightMatch) {
        this.stats.currentHeight = parseInt(heightMatch[1]);
      }
    }

    if (output.includes('hashrate')) {
      const hashrateMatch = output.match(/(\d+\.?\d*)\s*(H\/s|KH\/s|MH\/s|GH\/s|TH\/s)/);
      if (hashrateMatch) {
        let hashrate = parseFloat(hashrateMatch[1]);
        const unit = hashrateMatch[2];
        
        // Convert to H/s
        switch (unit) {
          case 'KH/s': hashrate *= 1000; break;
          case 'MH/s': hashrate *= 1000000; break;
          case 'GH/s': hashrate *= 1000000000; break;
          case 'TH/s': hashrate *= 1000000000000; break;
        }
        
        this.stats.hashrate = hashrate;
      }
    }

    if (output.includes('Block found') || output.includes('WINNER')) {
      this.stats.blocksFound++;
      this.emit('block_found', {
        height: this.stats.currentHeight,
        wallet: this.stats.walletAddress,
        timestamp: new Date()
      });
    }

    if (output.includes('share accepted') || output.includes('Accepted')) {
      this.stats.shares++;
      this.emit('share_accepted', {
        shares: this.stats.shares,
        hashrate: this.stats.hashrate
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

// Export singleton instance
export const soloMinerV2 = new SoloMinerV2Wrapper();