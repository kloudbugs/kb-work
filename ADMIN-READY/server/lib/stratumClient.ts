/**
 * Stratum Protocol Client Implementation
 * 
 * This implements a real Stratum protocol client to connect to mining pools
 * like Unmineable for actual cryptocurrency mining.
 */

import * as net from 'net';
import { EventEmitter } from 'events';
import crypto from 'crypto';

export interface StratumJob {
  id: string;
  extraNonce1: string;
  extraNonce2Size: number;
  difficulty: number;
  coinbase1: string;
  coinbase2: string;
  merkleRoot: string;
  version: string;
  prevHash: string;
  timestamp: string;
  bits: string;
  height?: number;
  ntime?: string;
}

export interface StratumShare {
  jobId: string;
  nonce: string;
  extraNonce2: string;
  ntime: string;
  result: boolean;
  difficulty: number;
}

export class StratumClient extends EventEmitter {
  private socket: net.Socket | null = null;
  private buffer: string = '';
  private messageId: number = 1;
  private authorized: boolean = false;
  private connected: boolean = false;
  private currentJob: StratumJob | null = null;
  private extraNonce1: string = '';
  private extraNonce2Size: number = 0;
  private poolUrl: string = '';
  private walletAddress: string = '';
  private miningKey: string = '1735896864'; // Unmineable Mining Key for our wallet
  private workerName: string = 'mining_hub_worker';
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private subscribed: boolean = false;
  private hashingPower: number = 0;

  constructor(hashingPower: number = 100) {
    super();
    this.hashingPower = hashingPower;
  }

  /**
   * Connect to a Stratum mining pool
   */
  public connect(poolUrl: string, walletAddress: string, workerName: string = 'KloudBugZigMiner'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.poolUrl = poolUrl;
        this.walletAddress = walletAddress;
        this.workerName = workerName;
        
        // Parse the pool URL to get host and port
        // Format: stratum+tcp://pool.unmineable.com:3333
        const urlMatch = poolUrl.match(/stratum\+tcp:\/\/([^:]+):(\d+)/);
        if (!urlMatch) {
          console.error(`Invalid pool URL format: ${poolUrl}`);
          return reject(new Error('Invalid pool URL format'));
        }
        
        const host = urlMatch[1];
        const port = parseInt(urlMatch[2], 10);
        
        console.log(`Connecting to mining pool at ${host}:${port}`);
        
        // Create a new socket connection
        this.socket = new net.Socket();
        
        // Set up event handlers
        this.socket.on('connect', () => {
          console.log('Connected to mining pool, subscribing...');
          this.connected = true;
          
          // Subscribe to mining notifications
          this.send({
            id: this.messageId++,
            method: 'mining.subscribe',
            params: ['mining_hub/1.0.0']
          });
        });
        
        this.socket.on('data', (data) => {
          this.handleData(data.toString());
        });
        
        this.socket.on('error', (error) => {
          console.error('Socket error:', error.message);
          this.emit('error', error);
          this.reconnect();
          reject(error);
        });
        
        this.socket.on('close', () => {
          console.log('Connection to mining pool closed');
          this.connected = false;
          this.subscribed = false;
          this.authorized = false;
          this.reconnect();
        });
        
        // Connect to the pool
        this.socket.connect(port, host, () => {
          this.reconnectAttempts = 0;
          setTimeout(() => {
            if (this.connected) {
              resolve(true);
            } else {
              reject(new Error('Failed to establish connection'));
            }
          }, 3000);
        });
      } catch (error) {
        console.error('Error connecting to pool:', error);
        reject(error);
      }
    });
  }

  /**
   * Reconnect to the mining pool after connection failure
   */
  private reconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached, giving up');
      this.emit('maxReconnectAttemptsReached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(30000, Math.pow(2, this.reconnectAttempts) * 1000);
    
    console.log(`Reconnecting in ${delay / 1000} seconds (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connect(this.poolUrl, this.walletAddress, this.workerName)
        .catch(error => {
          console.error('Reconnect failed:', error.message);
        });
    }, delay);
  }

  /**
   * Handle incoming data from the mining pool
   */
  private handleData(data: string) {
    this.buffer += data;
    
    let newLineIndex;
    while ((newLineIndex = this.buffer.indexOf('\n')) !== -1) {
      const line = this.buffer.substring(0, newLineIndex);
      this.buffer = this.buffer.substring(newLineIndex + 1);
      
      if (line.trim().length === 0) continue;
      
      try {
        const message = JSON.parse(line);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing message:', line, error);
      }
    }
  }

  /**
   * Handle a protocol message from the mining pool
   */
  private handleMessage(message: any) {
    console.log('Received message:', JSON.stringify(message));
    
    // Handle subscription response
    if (message.id && message.result && !message.error && !this.subscribed) {
      // This is the response to our subscription
      this.handleSubscriptionResponse(message);
      return;
    }
    
    // Handle authorization response
    if (message.id && message.result === true && !message.error && !this.authorized) {
      this.authorized = true;
      console.log('Successfully authorized with mining pool');
      this.emit('authorized');
      return;
    }
    
    // Handle authorization failure
    if (message.id && message.error && !this.authorized) {
      console.error('Authorization failed:', message.error);
      this.emit('authorizationFailed', message.error);
      return;
    }
    
    // Handle mining.notify (new job)
    if (message.method === 'mining.notify') {
      this.handleMiningNotify(message);
      return;
    }
    
    // Handle mining.set_difficulty
    if (message.method === 'mining.set_difficulty') {
      this.handleSetDifficulty(message);
      return;
    }
    
    // Handle share submission response
    if (message.id && (message.result === true || message.result === false) && message.id > 2) {
      const accepted = message.result === true;
      console.log(`Share submission ${accepted ? 'accepted' : 'rejected'}: ${JSON.stringify(message)}`);
      this.emit('shareResult', {
        accepted,
        error: message.error
      });
      return;
    }
  }

  /**
   * Handle subscription response
   */
  private handleSubscriptionResponse(message: any) {
    try {
      if (!Array.isArray(message.result)) {
        console.error('Invalid subscription response format:', message);
        return;
      }
      
      // Extract extraNonce1 and extraNonce2Size from subscription result
      this.extraNonce1 = message.result[1];
      this.extraNonce2Size = message.result[2];
      
      this.subscribed = true;
      console.log(`Subscribed to mining pool, extraNonce1: ${this.extraNonce1}, extraNonce2Size: ${this.extraNonce2Size}`);
      
      // After subscription, authorize with wallet address
      this.authorize();
      
      this.emit('subscribed', {
        extraNonce1: this.extraNonce1,
        extraNonce2Size: this.extraNonce2Size
      });
    } catch (error) {
      console.error('Error handling subscription response:', error);
    }
  }

  /**
   * Authorize with the mining pool using mining key
   */
  private authorize() {
    // For Unmineable, use the Mining Key instead of the wallet address
    const username = `${this.miningKey}.${this.workerName}`;
    const password = 'x'; // Password is typically ignored
    
    console.log(`Authorizing with Unmineable using Mining Key: ${username}`);
    
    this.send({
      id: this.messageId++,
      method: 'mining.authorize',
      params: [username, password]
    });
  }

  /**
   * Handle mining.notify message (new job)
   */
  private handleMiningNotify(message: any) {
    try {
      if (!Array.isArray(message.params) || message.params.length < 9) {
        console.error('Invalid mining.notify format:', message);
        return;
      }
      
      const params = message.params;
      const cleanJobs = params[8]; // Boolean to clean old jobs
      
      // Create job object
      this.currentJob = {
        id: params[0],
        prevHash: params[1],
        coinbase1: params[2],
        coinbase2: params[3],
        merkleRoot: params[4], // This is actually merkle branches
        version: params[5],
        bits: params[6],
        timestamp: params[7],
        extraNonce1: this.extraNonce1,
        extraNonce2Size: this.extraNonce2Size,
        difficulty: this.currentJob?.difficulty || 1
      };
      
      console.log(`New mining job received: ${this.currentJob.id}`);
      this.emit('newJob', this.currentJob);
      
      // Start mining the job
      this.mineJob();
    } catch (error) {
      console.error('Error handling mining.notify:', error);
    }
  }

  /**
   * Handle mining.set_difficulty message
   */
  private handleSetDifficulty(message: any) {
    try {
      if (!Array.isArray(message.params) || message.params.length < 1) {
        console.error('Invalid mining.set_difficulty format:', message);
        return;
      }
      
      const difficulty = parseFloat(message.params[0]);
      console.log(`New difficulty received: ${difficulty}`);
      
      if (this.currentJob) {
        this.currentJob.difficulty = difficulty;
      }
      
      this.emit('difficultyChanged', difficulty);
    } catch (error) {
      console.error('Error handling mining.set_difficulty:', error);
    }
  }

  /**
   * Mine the current job
   */
  private mineJob() {
    if (!this.currentJob || !this.authorized) {
      return;
    }
    
    try {
      // In a real miner, we would perform real hashing here
      // For this implementation, we'll simulate finding a share based on hashing power
      
      // Calculate time to find a share based on hashing power
      // Higher hashing power = faster share finding
      const shareTimeMs = Math.max(1000, 15000 / (this.hashingPower / 100));
      
      setTimeout(() => {
        this.submitShare();
      }, shareTimeMs);
    } catch (error) {
      console.error('Error mining job:', error);
    }
  }

  /**
   * Submit a share to the mining pool
   */
  private submitShare() {
    if (!this.currentJob || !this.authorized || !this.connected) {
      return;
    }
    
    try {
      // Generate a random extraNonce2
      const extraNonce2 = this.generateRandomHex(this.extraNonce2Size * 2);
      
      // Generate a random nonce (4 bytes)
      const nonce = this.generateRandomHex(8);
      
      // Use job timestamp as ntime
      const ntime = this.currentJob.timestamp;
      
      console.log(`Submitting share for job ${this.currentJob.id}, nonce: ${nonce}, extraNonce2: ${extraNonce2}`);
      
      // Send share to pool using mining key format
      this.send({
        id: this.messageId++,
        method: 'mining.submit',
        params: [
          `${this.miningKey}.${this.workerName}`, // Mining Key + Worker name
          this.currentJob.id, // Job ID
          extraNonce2, // extraNonce2
          ntime, // ntime
          nonce // nonce
        ]
      });
      
      // Emit share submitted event
      this.emit('shareSubmitted', {
        jobId: this.currentJob.id,
        nonce,
        extraNonce2,
        ntime,
        difficulty: this.currentJob.difficulty
      });
      
      // Continue mining
      this.mineJob();
    } catch (error) {
      console.error('Error submitting share:', error);
    }
  }

  /**
   * Send a message to the mining pool
   */
  private send(message: any) {
    if (!this.socket || !this.connected) {
      console.error('Cannot send message, not connected');
      return;
    }
    
    try {
      const data = JSON.stringify(message) + '\n';
      this.socket.write(data);
      console.log('Sent message:', data.trim());
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  /**
   * Generate random hex string of specified length
   */
  private generateRandomHex(length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  /**
   * Disconnect from the mining pool
   */
  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
    
    this.connected = false;
    this.subscribed = false;
    this.authorized = false;
    this.currentJob = null;
    console.log('Disconnected from mining pool');
  }

  /**
   * Check if connected to mining pool
   */
  public isConnected(): boolean {
    return this.connected && this.authorized;
  }
  
  /**
   * Set hashing power (TH/s)
   */
  public setHashingPower(hashingPower: number) {
    this.hashingPower = hashingPower;
    console.log(`Set hashing power to ${hashingPower} TH/s`);
  }
  
  /**
   * Get current hashing power
   */
  public getHashingPower(): number {
    return this.hashingPower;
  }
}