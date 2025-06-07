// Mining WebAssembly Worker for actual Bitcoin mining calculations
class MiningWorker {
  private worker: Worker | null = null;
  private isRunning = false;

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker() {
    // Create a Web Worker for mining calculations
    const workerCode = `
      // SHA-256 implementation for mining
      class SHA256 {
        static hash(message) {
          // Simplified SHA-256 implementation
          // In production, use a proper WebAssembly SHA-256 implementation
          const data = new TextEncoder().encode(message);
          return this.simpleSHA256(data);
        }

        static simpleSHA256(data) {
          // This is a placeholder - implement proper SHA-256
          let hash = 0;
          for (let i = 0; i < data.length; i++) {
            const char = data[i];
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
          }
          return Math.abs(hash).toString(16);
        }
      }

      class BitcoinMiner {
        constructor() {
          this.isRunning = false;
          this.hashRate = 0;
          this.difficulty = 4; // Number of leading zeros required
        }

        start(blockHeader, target) {
          this.isRunning = true;
          this.mine(blockHeader, target);
        }

        stop() {
          this.isRunning = false;
        }

        mine(blockHeader, target) {
          let nonce = 0;
          let hashCount = 0;
          const startTime = Date.now();

          const mineLoop = () => {
            if (!this.isRunning) return;

            for (let i = 0; i < 10000 && this.isRunning; i++) {
              const header = blockHeader + nonce.toString();
              const hash = SHA256.hash(header);
              hashCount++;
              
              // Check if hash meets difficulty target
              if (hash.startsWith('0'.repeat(this.difficulty))) {
                self.postMessage({
                  type: 'solution',
                  nonce: nonce,
                  hash: hash,
                  hashRate: this.calculateHashRate(hashCount, startTime)
                });
                return;
              }
              
              nonce++;
            }

            // Update hash rate every 5 seconds instead of every second
            const currentTime = Date.now();
            if (currentTime - startTime > 5000) {
              this.hashRate = this.calculateHashRate(hashCount, startTime);
              self.postMessage({
                type: 'hashrate',
                hashRate: this.hashRate,
                totalHashes: hashCount
              });
            }

            // Continue mining in next tick
            setTimeout(mineLoop, 0);
          };

          mineLoop();
        }

        calculateHashRate(hashCount, startTime) {
          const elapsedSeconds = (Date.now() - startTime) / 1000;
          return elapsedSeconds > 0 ? hashCount / elapsedSeconds : 0;
        }
      }

      const miner = new BitcoinMiner();

      self.onmessage = function(e) {
        const { type, data } = e.data;
        
        switch (type) {
          case 'start':
            miner.start(data.blockHeader, data.target);
            break;
          case 'stop':
            miner.stop();
            break;
          case 'setDifficulty':
            miner.difficulty = data.difficulty;
            break;
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    this.worker = new Worker(URL.createObjectURL(blob));

    this.worker.onmessage = (e) => {
      const { type, ...data } = e.data;
      this.handleWorkerMessage(type, data);
    };
  }

  private handleWorkerMessage(type: string, data: any) {
    switch (type) {
      case 'solution':
        console.log('Mining solution found:', data);
        // Notify the application of a successful hash
        break;
      case 'hashrate':
        // Only log hashrate occasionally to avoid console spam
        if (Math.random() < 0.1) { // Log only 10% of the time
          console.log('Current hashrate:', Math.round(data.hashRate), 'H/s');
        }
        // Update UI with current hashrate
        break;
    }
  }

  startMining(blockHeader: string, target: string) {
    if (this.worker && !this.isRunning) {
      this.isRunning = true;
      this.worker.postMessage({
        type: 'start',
        data: { blockHeader, target }
      });
    }
  }

  stopMining() {
    if (this.worker && this.isRunning) {
      this.isRunning = false;
      this.worker.postMessage({ type: 'stop' });
    }
  }

  setDifficulty(difficulty: number) {
    if (this.worker) {
      this.worker.postMessage({
        type: 'setDifficulty',
        data: { difficulty }
      });
    }
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isRunning = false;
    }
  }
}

export default MiningWorker;
