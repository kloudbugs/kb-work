import { EventEmitter } from 'events';
import { Socket, createConnection } from 'net';
import { Pool } from '@shared/schema';

// Stratum protocol message types
interface StratumMessage {
  id: number;
  method?: string;
  params?: any[];
  result?: any;
  error?: any;
}

/**
 * Stratum protocol client implementation for mining pool communication
 * Supports both Bitcoin and Monero mining protocols
 */
export class StratumClient extends EventEmitter {
  private socket: Socket | null = null;
  private buffer: string = '';
  private messageId: number = 1;
  private pool: Pool;
  private authorized: boolean = false;
  private subscribed: boolean = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private pendingRequests: Map<number, { resolve: Function; reject: Function }> = new Map();
  private jobId: string | null = null;
  private btcWalletAddress: string | null = null;
  
  constructor(pool: Pool, btcWalletAddress: string | null = null) {
    super();
    this.pool = pool;
    this.btcWalletAddress = btcWalletAddress || null;
  }
  
  /**
   * Connect to the mining pool using the Stratum protocol
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.destroy();
        this.socket = null;
      }
      
      const poolUrl = new URL(this.pool.url.replace('stratum+tcp://', 'tcp://'));
      const host = poolUrl.hostname;
      const port = parseInt(poolUrl.port || '3333', 10);
      
      this.socket = createConnection({
        host,
        port,
      });
      
      this.socket.on('connect', () => {
        console.log(`Connected to mining pool: ${this.pool.name}`);
        this.reconnectAttempts = 0;
        // After connection is established, subscribe to mining notifications
        this.subscribe().then(() => {
          // After subscription, authorize with the pool using credentials
          return this.authorize();
        }).then(() => {
          resolve();
        }).catch(reject);
      });
      
      this.socket.on('data', (data) => {
        this.handleData(data.toString());
      });
      
      this.socket.on('error', (err) => {
        console.error(`Stratum socket error: ${err.message}`);
        this.emit('error', err);
        reject(err);
      });
      
      this.socket.on('close', () => {
        console.log('Connection to mining pool closed');
        this.subscribed = false;
        this.authorized = false;
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts));
          console.log(`Attempting to reconnect in ${delay / 1000} seconds...`);
          
          this.reconnectTimeout = setTimeout(() => {
            this.connect().catch((err) => {
              console.error(`Reconnection failed: ${err.message}`);
            });
          }, delay);
        } else {
          this.emit('max-reconnect');
        }
      });
    });
  }
  
  /**
   * Handle incoming data from the mining pool
   */
  private handleData(data: string): void {
    this.buffer += data;
    
    // Stratum protocol uses JSON-RPC with newline delimiters
    let newLineIndex: number;
    while ((newLineIndex = this.buffer.indexOf('\\n')) !== -1) {
      const line = this.buffer.substring(0, newLineIndex);
      this.buffer = this.buffer.substring(newLineIndex + 1);
      
      if (line.trim().length === 0) continue;
      
      try {
        const message: StratumMessage = JSON.parse(line);
        this.handleMessage(message);
      } catch (err) {
        console.error(`Failed to parse stratum message: ${line}`);
      }
    }
  }
  
  /**
   * Handle a Stratum protocol message
   */
  private handleMessage(message: StratumMessage): void {
    // Handle responses to our requests
    if (typeof message.id === 'number' && this.pendingRequests.has(message.id)) {
      const { resolve, reject } = this.pendingRequests.get(message.id)!;
      this.pendingRequests.delete(message.id);
      
      if (message.error) {
        reject(new Error(message.error));
      } else {
        resolve(message.result);
      }
      return;
    }
    
    // Handle method calls from the server
    if (message.method) {
      switch (message.method) {
        case 'mining.notify':
          // New mining job notification
          if (message.params && message.params.length > 0) {
            this.jobId = message.params[0];
            this.emit('job', {
              jobId: this.jobId,
              data: message.params
            });
          }
          break;
          
        case 'mining.set_difficulty':
          // Server setting new difficulty
          if (message.params && message.params.length > 0) {
            const difficulty = message.params[0];
            this.emit('difficulty', difficulty);
          }
          break;
          
        case 'client.reconnect':
          // Server requesting reconnection
          this.socket?.end();
          break;
          
        case 'client.get_version':
          // Server requesting version information
          this.sendMessage({
            id: this.messageId++,
            method: 'client.version',
            params: ['ZigMiner/1.0.0', 'Stratum/1.0.0']
          });
          break;
          
        case 'client.show_message':
          // Server sending a message
          if (message.params && message.params.length > 0) {
            console.log(`Message from pool: ${message.params[0]}`);
            this.emit('message', message.params[0]);
          }
          break;
          
        default:
          console.log(`Unknown stratum method: ${message.method}`);
      }
    }
  }
  
  /**
   * Send a message to the mining pool
   */
  private sendMessage(message: StratumMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || this.socket.destroyed) {
        reject(new Error('Socket not connected'));
        return;
      }
      
      this.pendingRequests.set(message.id, { resolve, reject });
      
      const data = JSON.stringify(message) + '\\n';
      this.socket.write(data, (err) => {
        if (err) {
          this.pendingRequests.delete(message.id);
          reject(err);
        }
      });
    });
  }
  
  /**
   * Subscribe to mining notifications from the pool
   */
  private subscribe(): Promise<any> {
    // Handle different subscription methods based on pool type
    let method = 'mining.subscribe';
    let params: any[] = ['ZigMiner/1.0.0'];
    
    if (this.pool.algorithm.toLowerCase() === 'randomx') {
      // Monero-compatible pools use different subscription method
      method = 'mining.subscribe';
      params = [];
    }
    
    return this.sendMessage({
      id: this.messageId++,
      method,
      params
    }).then(result => {
      this.subscribed = true;
      this.emit('subscribed', result);
      return result;
    });
  }
  
  /**
   * Authorize with the mining pool using credentials
   */
  private authorize(): Promise<any> {
    // For pools that support direct BTC payment, replace username with BTC wallet if configured
    let username = this.pool.username;
    
    if (this.pool.directBtcPayment && this.pool.poolType === 'monero_ocean' && this.btcWalletAddress) {
      // Format for Monero Ocean with BTC payout: btc=WALLET_ADDRESS
      username = `btc=${this.btcWalletAddress}`;
    } else if (this.pool.directBtcPayment && this.btcWalletAddress) {
      // Use BTC wallet as username for direct payment
      username = this.btcWalletAddress;
    }
    
    return this.sendMessage({
      id: this.messageId++,
      method: 'mining.authorize',
      params: [username, this.pool.password]
    }).then(result => {
      this.authorized = true;
      this.emit('authorized', result);
      return result;
    });
  }
  
  /**
   * Submit a solution (share) to the mining pool
   */
  public submitShare(jobId: string, nonce: string, result: string): Promise<any> {
    // Different pools have different share submission formats
    let method = 'mining.submit';
    let params: any[] = [];
    
    if (this.pool.algorithm.toLowerCase() === 'randomx') {
      // Monero-compatible format
      const worker = this.pool.username;
      params = [worker, jobId, nonce, result];
    } else {
      // Bitcoin-compatible format
      const worker = this.pool.username;
      params = [worker, jobId, 'extraNonce2', 'nTime', nonce];
    }
    
    return this.sendMessage({
      id: this.messageId++,
      method,
      params
    }).then(result => {
      this.emit('share-accepted', { jobId, nonce, result });
      return result;
    }).catch(error => {
      this.emit('share-rejected', { jobId, nonce, error });
      throw error;
    });
  }
  
  /**
   * Close the connection to the mining pool
   */
  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
    
    this.subscribed = false;
    this.authorized = false;
  }
  
  /**
   * Check if client is connected to the pool
   */
  public isConnected(): boolean {
    return !!this.socket && !this.socket.destroyed && this.subscribed && this.authorized;
  }
}