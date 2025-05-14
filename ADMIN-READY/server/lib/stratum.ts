import { EventEmitter } from "events";
import * as net from "net";
import { Device, Pool, User } from "@shared/schema";

/**
 * Stratum Protocol Client
 * 
 * Implementation of the Stratum protocol for mining pools
 * https://en.bitcoin.it/wiki/Stratum_mining_protocol
 */
export class StratumClient extends EventEmitter {
  private socket: net.Socket | null = null;
  private connected: boolean = false;
  private authorized: boolean = false;
  private messageId: number = 1;
  private pendingRequests: Map<number, {
    method: string;
    params: any[];
    callback?: (error: any, result: any) => void;
  }> = new Map();
  
  constructor(
    private pool: Pool,
    private user: User,
    private device: Device
  ) {
    super();
  }
  
  /**
   * Connect to the mining pool
   */
  public async connect(): Promise<void> {
    // Already connected
    if (this.connected) {
      return;
    }
    
    // Parse pool URL
    const { host, port } = this.parsePoolUrl(this.pool.url);
    
    return new Promise((resolve, reject) => {
      try {
        // Create socket
        this.socket = net.createConnection({
          host,
          port: parseInt(port),
        });
        
        // Set encoding
        this.socket.setEncoding("utf-8");
        
        // Handle connection events
        this.socket.on("connect", () => {
          this.connected = true;
          this.emit("connected");
          
          // Subscribe to mining notifications
          this.subscribe();
          
          // Authorize user
          this.authorize();
          
          resolve();
        });
        
        // Handle data received from pool
        this.socket.on("data", (data: string) => {
          this.handleData(data);
        });
        
        // Handle socket errors
        this.socket.on("error", (error: Error) => {
          console.error("Stratum socket error:", error);
          this.emit("error", error);
          this.disconnect();
          reject(error);
        });
        
        // Handle socket close
        this.socket.on("close", () => {
          this.connected = false;
          this.authorized = false;
          this.emit("disconnected");
        });
        
      } catch (error) {
        console.error("Stratum connect error:", error);
        this.emit("error", error);
        reject(error);
      }
    });
  }
  
  /**
   * Disconnect from the mining pool
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
    
    this.connected = false;
    this.authorized = false;
  }
  
  /**
   * Check if client is connected
   */
  public isConnected(): boolean {
    return this.connected;
  }
  
  /**
   * Subscribe to mining notifications
   */
  private subscribe(): void {
    const params = [];
    
    this.sendRequest("mining.subscribe", params, (error, result) => {
      if (error) {
        console.error("Subscribe error:", error);
        this.emit("error", error);
        return;
      }
      
      console.log("Subscribed to mining notifications:", result);
    });
  }
  
  /**
   * Authorize user
   */
  private authorize(): void {
    // Format: "username.workername:password"
    // The ":" and password are optional in some pools
    const workerName = `${this.device.name}`;
    const username = this.pool.username || this.user.walletAddress;
    const password = this.pool.password || "x";
    
    const worker = `${username}.${workerName}`;
    
    this.sendRequest("mining.authorize", [worker, password], (error, result) => {
      if (error) {
        console.error("Authorize error:", error);
        this.emit("error", error);
        return;
      }
      
      if (result) {
        this.authorized = true;
        this.emit("authorized");
        console.log("Worker authorized:", worker);
      } else {
        console.error("Worker authorization failed:", worker);
        this.emit("error", new Error("Authorization failed"));
      }
    });
  }
  
  /**
   * Submit share to pool
   */
  public submitShare(jobId: string, extraNonce2: string, nonce: string, time: string, version: string): void {
    // Format depends on pool, but generally:
    // [worker_name, job_id, extranonce2, ntime, nonce]
    const workerName = `${this.pool.username || this.user.walletAddress}.${this.device.name}`;
    
    this.sendRequest("mining.submit", [workerName, jobId, extraNonce2, time, nonce], (error, result) => {
      if (error) {
        console.error("Share submission error:", error);
        this.emit("share:rejected", error.message);
        return;
      }
      
      if (result === true) {
        this.emit("share:accepted");
      } else {
        this.emit("share:rejected", "Unknown error");
      }
    });
  }
  
  /**
   * Send request to pool
   */
  private sendRequest(method: string, params: any[], callback?: (error: any, result: any) => void): void {
    if (!this.socket || !this.connected) {
      if (callback) {
        callback(new Error("Not connected"), null);
      }
      return;
    }
    
    const id = this.messageId++;
    
    const request = {
      id,
      method,
      params,
    };
    
    if (callback) {
      this.pendingRequests.set(id, { method, params, callback });
    }
    
    this.socket.write(JSON.stringify(request) + "\n");
  }
  
  /**
   * Handle data received from pool
   */
  private handleData(data: string): void {
    // Split data by newlines
    const messages = data.split("\n");
    
    for (const message of messages) {
      if (!message.trim()) {
        continue;
      }
      
      try {
        const response = JSON.parse(message);
        
        // Handle notification (no id)
        if (response.id === undefined || response.id === null) {
          this.handleNotification(response);
          continue;
        }
        
        // Handle response
        this.handleResponse(response);
        
      } catch (error) {
        console.error("Error parsing stratum message:", error, message);
      }
    }
  }
  
  /**
   * Handle notification from pool
   */
  private handleNotification(notification: any): void {
    const { method, params } = notification;
    
    if (!method) {
      return;
    }
    
    switch (method) {
      case "mining.notify":
        // New job notification
        this.emit("job", params);
        break;
        
      case "mining.set_difficulty":
        // Difficulty change
        const difficulty = params[0];
        this.emit("difficulty", difficulty);
        break;
        
      default:
        console.log("Unknown notification method:", method, params);
    }
  }
  
  /**
   * Handle response from pool
   */
  private handleResponse(response: any): void {
    const { id, result, error } = response;
    
    // Find pending request
    const request = this.pendingRequests.get(id);
    if (!request) {
      return;
    }
    
    // Call callback
    if (request.callback) {
      request.callback(error, result);
    }
    
    // Remove from pending requests
    this.pendingRequests.delete(id);
  }
  
  /**
   * Parse pool URL into host and port
   */
  private parsePoolUrl(url: string): { host: string; port: string } {
    // Default to stratum+tcp:// if no protocol specified
    if (!url.includes("://")) {
      url = `stratum+tcp://${url}`;
    }
    
    const urlObj = new URL(url);
    
    return {
      host: urlObj.hostname,
      port: urlObj.port || "3333", // Default stratum port
    };
  }
}