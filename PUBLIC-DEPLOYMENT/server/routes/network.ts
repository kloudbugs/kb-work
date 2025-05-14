import { Router, Request, Response } from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import { isAuthenticated } from '../middleware/auth';
import { storage } from '../storage';
import axios from 'axios';

const router = Router();
const networkClients = new Set<WebSocket>();

// Initialize WebSocket server for real-time network updates
export function initializeNetworkWebSocket(server: any) {
  const wss = new WebSocketServer({ noServer: true });
  
  // Handle upgrade for websocket connection
  server.on('upgrade', (request: any, socket: any, head: any) => {
    if (request.url === '/api/network/live') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });
  
  // Handle new connections
  wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected to network dashboard');
    networkClients.add(ws);
    
    ws.on('close', () => {
      console.log('Client disconnected from network dashboard');
      networkClients.delete(ws);
    });
    
    // Send initial data
    getNetworkStats().then(stats => {
      ws.send(JSON.stringify({
        type: 'stats',
        data: stats
      }));
    }).catch(err => {
      console.error('Error sending initial network stats:', err);
    });
  });
  
  // Setup periodic network updates every 10 seconds
  setInterval(() => {
    if (networkClients.size > 0) {
      getNetworkStats().then(stats => {
        const message = JSON.stringify({
          type: 'stats',
          data: stats
        });
        
        for (const client of networkClients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        }
      }).catch(err => {
        console.error('Error sending network stats update:', err);
      });
    }
  }, 10000); // 10 seconds interval
}

// Helper function to fetch real blockchain stats from external APIs
async function fetchBlockchainStats() {
  try {
    // Real data from blockchain.info
    const response = await axios.get('https://blockchain.info/stats?format=json');
    return {
      height: response.data.n_blocks_total,
      difficulty: (response.data.difficulty / 1e12).toFixed(2) + ' T',
      averageBlockTime: (response.data.minutes_between_blocks).toFixed(2) + ' min',
      lastUpdate: new Date().toLocaleTimeString()
    };
  } catch (error) {
    console.error('Error fetching blockchain stats:', error);
    // Return last cached data from our storage
    const cachedStats = await storage.getBlockchainStats();
    return cachedStats || {
      height: 0,
      difficulty: '0 T',
      averageBlockTime: '0 min',
      lastUpdate: 'N/A'
    };
  }
}

// Function to aggregate network stats from all sources
async function getNetworkStats() {
  // Get all active mining sessions
  const miningSessions = await storage.getActiveMiningSessionsWithUsers();
  
  // Get all connected miners
  const miners = await storage.getActiveMiners();
  
  // Get blockchain stats
  const blockchainStats = await fetchBlockchainStats();
  
  // Calculate total hashrate from all miners
  const totalHashrate = miners.reduce((total, miner) => {
    return total + (miner.hashrate || 0);
  }, 0);
  
  // Distribute miners by model
  const minerModelMap = new Map<string, { count: number, hashrate: number }>();
  miners.forEach(miner => {
    const modelName = miner.type || 'Unknown';
    if (!minerModelMap.has(modelName)) {
      minerModelMap.set(modelName, { count: 0, hashrate: 0 });
    }
    const current = minerModelMap.get(modelName)!;
    current.count += 1;
    current.hashrate += (miner.hashrate || 0);
    minerModelMap.set(modelName, current);
  });
  
  const minerModels = Array.from(minerModelMap.entries()).map(([name, stats]) => {
    return {
      name,
      count: stats.count,
      hashrate: `${(stats.hashrate).toFixed(2)} TH/s`,
      percentage: Math.round((stats.count / miners.length) * 100) || 0
    };
  }).sort((a, b) => b.count - a.count);
  
  // Get mining rewards
  const miningRewards = await storage.getTotalMiningRewards();
  
  // Get regional distribution (placeholder, would be real in production)
  const regions = await storage.getMiningRegionalDistribution();
  const globalMiningMap = regions.map(region => ({
    region: region.name,
    activeMiners: region.minerCount,
    hashrate: `${(region.hashrate).toFixed(2)} TH/s`,
    percentage: Math.round((region.hashrate / totalHashrate) * 100) || 0
  })).sort((a, b) => b.activeMiners - a.activeMiners);
  
  return {
    totalHashrate: `${totalHashrate.toFixed(2)} TH/s`,
    activeMiners: miners.length,
    connectedUsers: miningSessions.length,
    totalGenerated: {
      btc: miningRewards.btc.toFixed(8) + ' BTC',
      mpt: miningRewards.mpt.toFixed(2) + ' MPT',
      tera: miningRewards.tera.toFixed(2) + ' TERA'
    },
    blockchainStats,
    minerModels,
    globalMiningMap
  };
}

// Route to get network statistics - protected by authentication
router.get('/stats', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const stats = await getNetworkStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching network stats:', error);
    res.status(500).json({ message: 'Error fetching network statistics' });
  }
});

export default router;