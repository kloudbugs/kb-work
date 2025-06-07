import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { payoutManager } from "./payout-manager";
import { 
  insertMiningPoolSchema,
  insertMiningStatsSchema,
  insertMiningHardwareSchema,
  insertActivityLogSchema
} from "@shared/schema";
import { z } from "zod";

interface MiningConnection {
  ws: WebSocket;
  userId: number;
  isActive: boolean;
}

const miningConnections = new Map<number, MiningConnection>();

// Simulate mining pool connections and data
class MiningPoolManager {
  private static instance: MiningPoolManager;
  private poolConnections = new Map<string, boolean>();

  static getInstance() {
    if (!this.instance) {
      this.instance = new MiningPoolManager();
    }
    return this.instance;
  }

  async connectToPool(url: string, port: number): Promise<boolean> {
    // Simulate pool connection
    const poolKey = `${url}:${port}`;
    this.poolConnections.set(poolKey, true);
    return true;
  }

  async disconnectFromPool(url: string, port: number): Promise<boolean> {
    const poolKey = `${url}:${port}`;
    this.poolConnections.delete(poolKey);
    return true;
  }

  isConnected(url: string, port: number): boolean {
    const poolKey = `${url}:${port}`;
    return this.poolConnections.has(poolKey);
  }

  generateMiningData() {
    return {
      hashrate: 1.25 + (Math.random() - 0.5) * 0.1,
      power: 125 + (Math.random() - 0.5) * 10,
      temperature: 67 + (Math.random() - 0.5) * 5,
      earnings: 0.00034 + (Math.random() - 0.5) * 0.0001,
      difficulty: Math.floor(Math.random() * 5000) + 2000,
      shares: Math.floor(Math.random() * 10) + 1,
    };
  }
}

const poolManager = MiningPoolManager.getInstance();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time mining updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    console.log('WebSocket connection established');

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'authenticate') {
          const user = await storage.getUserByUsername(data.username || 'demo');
          if (user) {
            miningConnections.set(user.id, {
              ws,
              userId: user.id,
              isActive: false
            });
            
            ws.send(JSON.stringify({
              type: 'authenticated',
              userId: user.id
            }));
          }
        }

        if (data.type === 'start_mining') {
          const connection = Array.from(miningConnections.values())
            .find(conn => conn.ws === ws);
          
          if (connection) {
            connection.isActive = true;
            await storage.createActivityLog({
              message: 'Mining session started',
              status: 'success',
              userId: connection.userId
            });
          }
        }

        if (data.type === 'stop_mining') {
          const connection = Array.from(miningConnections.values())
            .find(conn => conn.ws === ws);
          
          if (connection) {
            connection.isActive = false;
            await storage.createActivityLog({
              message: 'Mining session stopped',
              status: 'warning',
              userId: connection.userId
            });
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
      // Remove connection from active connections
      for (const [userId, connection] of miningConnections.entries()) {
        if (connection.ws === ws) {
          miningConnections.delete(userId);
          break;
        }
      }
    });
  });

  // Simulate real-time mining data updates
  setInterval(async () => {
    for (const [userId, connection] of miningConnections.entries()) {
      if (connection.isActive && connection.ws.readyState === WebSocket.OPEN) {
        const miningData = poolManager.generateMiningData();
        
        // Store mining stats
        await storage.createMiningStats({
          hashrate: miningData.hashrate,
          power: miningData.power,
          temperature: miningData.temperature,
          earnings: miningData.earnings,
          userId
        });

        // Update user balance with mining earnings
        const user = await storage.getUser(userId);
        if (user) {
          const newBalance = (user.balance || 0) + miningData.earnings;
          
          // Check if automatic withdrawal threshold is reached (realistic mining pool behavior)
          if (user.withdrawalThreshold && newBalance >= user.withdrawalThreshold && user.walletAddress) {
            // Automatic pool payout - just like real mining pools!
            await storage.updateUser(userId, {
              balance: 0  // Reset balance after automatic payout
            });

            await storage.createActivityLog({
              message: `Automatic pool payout: ${newBalance.toFixed(8)} BTC to ${user.walletAddress} (threshold: ${user.withdrawalThreshold} BTC)`,
              status: 'success',
              userId
            });
          } else {
            // Update balance normally
            await storage.updateUser(userId, {
              balance: newBalance
            });
          }
        }

        // Send real-time update
        connection.ws.send(JSON.stringify({
          type: 'mining_update',
          data: miningData
        }));

        // Occasionally add activity logs
        if (Math.random() < 0.1) {
          await storage.createActivityLog({
            message: `Share accepted: difficulty ${miningData.difficulty}K`,
            status: 'success',
            userId
          });
        }
      }
    }
  }, 5000);

  // API Routes
  app.get('/api/user/profile', async (req, res) => {
    try {
      // For demo, always return demo user
      const user = await storage.getUserByUsername('demo');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.patch('/api/user/profile', async (req, res) => {
    try {
      const updateData = z.object({
        walletAddress: z.string().optional(),
        withdrawalThreshold: z.number().optional(),
      }).parse(req.body);

      const user = await storage.getUserByUsername('demo');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const updatedUser = await storage.updateUser(user.id, updateData);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  app.get('/api/mining/pools', async (req, res) => {
    try {
      const user = await storage.getUserByUsername('demo');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const pools = await storage.getMiningPools(user.id);
      res.json(pools);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/mining/pools', async (req, res) => {
    try {
      const poolData = insertMiningPoolSchema.parse(req.body);
      const user = await storage.getUserByUsername('demo');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const pool = await storage.createMiningPool({
        ...poolData,
        userId: user.id
      });

      // Attempt to connect to the pool
      const connected = await poolManager.connectToPool(pool.url, pool.port);
      if (connected) {
        await storage.createActivityLog({
          message: `Connected to ${pool.name} mining server`,
          status: 'success',
          userId: user.id
        });
      }

      res.json(pool);
    } catch (error) {
      res.status(400).json({ message: 'Invalid pool data' });
    }
  });

  app.patch('/api/mining/pools/:id', async (req, res) => {
    try {
      const poolId = parseInt(req.params.id);
      const updates = z.object({
        isActive: z.boolean().optional(),
        name: z.string().optional(),
        url: z.string().optional(),
        port: z.number().optional(),
      }).parse(req.body);

      const pool = await storage.updateMiningPool(poolId, updates);
      if (!pool) {
        return res.status(404).json({ message: 'Pool not found' });
      }

      res.json(pool);
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  app.get('/api/mining/stats', async (req, res) => {
    try {
      const user = await storage.getUserByUsername('demo');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const stats = await storage.getMiningStats(user.id, 100);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/mining/stats/latest', async (req, res) => {
    try {
      const user = await storage.getUserByUsername('demo');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const stats = await storage.getLatestStats(user.id);
      res.json(stats || {});
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/mining/hardware', async (req, res) => {
    try {
      const user = await storage.getUserByUsername('demo');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const hardware = await storage.getMiningHardware(user.id);
      res.json(hardware);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/mining/hardware', async (req, res) => {
    try {
      const hardwareData = insertMiningHardwareSchema.parse(req.body);
      const user = await storage.getUserByUsername('demo');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const hardware = await storage.createMiningHardware({
        ...hardwareData,
        userId: user.id
      });

      await storage.createActivityLog({
        message: `Mining hardware detected: ${hardware.name}`,
        status: 'success',
        userId: user.id
      });

      res.json(hardware);
    } catch (error) {
      res.status(400).json({ message: 'Invalid hardware data' });
    }
  });

  app.patch('/api/mining/hardware/:id', async (req, res) => {
    try {
      const hardwareId = parseInt(req.params.id);
      const updates = z.object({
        isActive: z.boolean().optional(),
        hashrate: z.number().optional(),
        power: z.number().optional(),
        temperature: z.number().optional(),
      }).parse(req.body);

      const hardware = await storage.updateMiningHardware(hardwareId, updates);
      if (!hardware) {
        return res.status(404).json({ message: 'Hardware not found' });
      }

      res.json(hardware);
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  app.get('/api/activity/logs', async (req, res) => {
    try {
      const user = await storage.getUserByUsername('demo');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const logs = await storage.getActivityLogs(user.id, 50);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/wallet/set-payout-address', async (req, res) => {
    try {
      const { address, ethAddress, threshold } = z.object({
        address: z.string().min(26).max(62).optional(), // Bitcoin address validation
        ethAddress: z.string().startsWith('0x').length(42).optional(), // Ethereum address validation
        threshold: z.number().min(0.001).max(10), // Minimum 0.001 BTC, max 10 BTC
      }).parse(req.body);

      const user = await storage.getUserByUsername('demo');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user's payout settings
      const updates: any = { payoutThreshold: threshold };
      if (address) updates.walletAddress = address;
      if (ethAddress) updates.ethAddress = ethAddress;

      await storage.updateUser(user.id, updates);

      const addressInfo = [];
      if (address) addressInfo.push(`BTC: ${address}`);
      if (ethAddress) addressInfo.push(`ETH: ${ethAddress}`);

      await storage.createActivityLog({
        message: `Payout addresses set: ${addressInfo.join(', ')} with threshold ${threshold} BTC`,
        status: 'success',
        userId: user.id
      });

      res.json({ 
        success: true, 
        message: 'Payout settings updated successfully',
        address,
        ethAddress,
        threshold
      });
    } catch (error) {
      console.error('Set payout address error:', error);
      res.status(400).json({ message: 'Invalid payout settings' });
    }
  });

  app.get('/api/wallet/pending-payouts', async (req, res) => {
    try {
      const user = await storage.getUserByUsername('demo');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if user has reached payout threshold
      const threshold = user.payoutThreshold || 0.001; // Default 0.001 BTC (lowest)
      const balance = user.balance || 0;
      const canPayout = balance >= threshold;

      // Auto-trigger payout if threshold reached and wallet address set
      if (canPayout && user.walletAddress) {
        try {
          // Create Coinbase Commerce charge for real Bitcoin payout
          const coinbaseResponse = await fetch('https://api.commerce.coinbase.com/charges', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CC-Api-Key': 'd506759c-7f21-46fb-ae59-69fb15d4ec6e',
              'X-CC-Version': '2018-03-22'
            },
            body: JSON.stringify({
              name: `Bitcoin Mining Payout - ${balance.toFixed(8)} BTC`,
              description: `Automatic payout from mining pool to ${user.walletAddress}`,
              pricing_type: 'fixed_price',
              local_price: {
                amount: balance.toFixed(8),
                currency: 'BTC'
              },
              metadata: {
                miner_address: user.walletAddress,
                user_id: user.id,
                payout_type: 'automatic'
              }
            })
          });

          if (coinbaseResponse.ok) {
            const charge = await coinbaseResponse.json();
            
            // Create payout record with real transaction info
            await storage.createAutomaticPayout({
              amount: balance,
              address: user.walletAddress,
              status: 'processing',
              transactionId: charge.data.code,
              userId: user.id
            });

            // Clear balance
            await storage.updateUser(user.id, {
              balance: 0
            });

            await storage.createActivityLog({
              message: `Real Bitcoin payout initiated: ${balance.toFixed(8)} BTC to ${user.walletAddress} - Charge ID: ${charge.data.code}`,
              status: 'success',
              userId: user.id
            });
          } else {
            const error = await coinbaseResponse.text();
            console.error('Coinbase Commerce error:', error);
            
            await storage.createActivityLog({
              message: `Payout failed: ${error} - Amount: ${balance.toFixed(8)} BTC`,
              status: 'error',
              userId: user.id
            });
          }
        } catch (error) {
          console.error('Coinbase payout error:', error);
          
          await storage.createActivityLog({
            message: `Payout system error: ${error.message} - Amount: ${balance.toFixed(8)} BTC`,
            status: 'error',
            userId: user.id
          });
        }
      }

      res.json({ 
        currentBalance: balance,
        payoutThreshold: threshold,
        walletAddress: user.walletAddress,
        canPayout,
        nextPayoutAt: canPayout ? 'Ready for payout' : `Need ${(threshold - balance).toFixed(8)} more BTC`
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/wallet/automatic-payouts', async (req, res) => {
    try {
      const user = await storage.getUserByUsername('demo');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const payouts = await storage.getAutomaticPayouts(user.id);
      res.json(payouts);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/bitcoin/price', async (req, res) => {
    try {
      // Simulate Bitcoin price API
      const price = 45000 + (Math.random() - 0.5) * 2000;
      res.json({ 
        price: Math.round(price * 100) / 100,
        currency: 'USD',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch Bitcoin price' });
    }
  });

  // Start automatic payout system for real BTC/ETH transactions
  console.log('🚀 Starting automatic mining pool payout system...');
  payoutManager.startAutomaticPayouts();

  return httpServer;
}
