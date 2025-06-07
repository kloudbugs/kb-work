import express, { type Request, Response } from "express";
import session from "express-session";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session setup
app.use(session({
  secret: 'tera-guardian-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// TERA Guardian Authentication
const users = [
  { id: 1, username: 'admin', password: 'admin123', isAdmin: true }
];

let currentUser: any = null;

// Auth routes
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    currentUser = user;
    res.json({ success: true, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  currentUser = null;
  res.json({ success: true });
});

app.get('/api/auth/user', (req: Request, res: Response) => {
  if (currentUser) {
    res.json({ id: currentUser.id, username: currentUser.username, isAdmin: currentUser.isAdmin });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// TERA Guardian API routes
app.get('/api/tera/guardians', (req: Request, res: Response) => {
  const guardians = [
    {
      id: 'tera-01',
      name: 'TERA Guardian Alpha',
      status: 'active',
      aiLoadLevel: 78,
      processingPower: 92,
      uptime: '24h 15m',
      activeModules: ['Mining Optimizer', 'Security Monitor', 'Performance Analytics']
    },
    {
      id: 'tera-02', 
      name: 'TERA Guardian Beta',
      status: 'active',
      aiLoadLevel: 65,
      processingPower: 88,
      uptime: '18h 42m',
      activeModules: ['Pool Management', 'Hardware Monitor', 'Profit Optimizer']
    }
  ];
  res.json(guardians);
});

// Mining Rigs API
app.get('/api/mining/rigs', (req: Request, res: Response) => {
  const rigs = [
    {
      id: 'rig-001',
      name: 'TERA Mining Rig Alpha',
      type: 'ASIC',
      status: 'active',
      hashrate: 110.5,
      temperature: 65,
      powerConsumption: 3250,
      uptime: '15d 8h 32m',
      efficiency: 95.2,
      pool: 'NiceHash',
      worker: 'alpha-001'
    },
    {
      id: 'rig-002',
      name: 'TERA Mining Rig Beta',
      type: 'GPU',
      status: 'active',
      hashrate: 85.3,
      temperature: 72,
      powerConsumption: 1850,
      uptime: '12d 4h 15m',
      efficiency: 92.8,
      pool: 'Unmineable',
      worker: 'beta-002'
    }
  ];
  res.json(rigs);
});

// Mining Pools API
app.get('/api/mining/pools', (req: Request, res: Response) => {
  const pools = [
    {
      id: 'nicehash',
      name: 'NiceHash',
      algorithm: 'SHA-256',
      url: 'stratum+tcp://sha256.auto.nicehash.com',
      port: 3334,
      fee: 2.0,
      hashrate: 125.8,
      miners: 45231,
      luck: 98.5,
      profitability: 105.2,
      status: 'connected',
      ping: 45,
      region: 'US-East'
    },
    {
      id: 'unmineable',
      name: 'Unmineable',
      algorithm: 'RandomX',
      url: 'rx.unmineable.com',
      port: 3333,
      fee: 1.0,
      hashrate: 89.4,
      miners: 23156,
      luck: 102.3,
      profitability: 108.7,
      status: 'connected',
      ping: 52,
      region: 'EU-West'
    }
  ];
  res.json(pools);
});

// Training modules API
app.get('/api/training/modules', (req: Request, res: Response) => {
  const modules = [
    {
      id: 'mining-basics',
      title: 'Mining Fundamentals',
      description: 'Learn the basics of cryptocurrency mining, algorithms, and pool concepts',
      difficulty: 'Beginner',
      duration: '45 min',
      progress: 100,
      status: 'completed',
      category: 'mining'
    },
    {
      id: 'pool-optimization',
      title: 'Pool Selection & Optimization', 
      description: 'Master the art of choosing the right mining pools for maximum profitability',
      difficulty: 'Intermediate',
      duration: '1h 30min',
      progress: 100,
      status: 'completed',
      category: 'optimization'
    },
    {
      id: 'hardware-tuning',
      title: 'Hardware Tuning & Overclocking',
      description: 'Optimize your mining hardware for peak performance and efficiency',
      difficulty: 'Advanced',
      duration: '2h 15min',
      progress: 75,
      status: 'in-progress',
      category: 'optimization'
    },
    {
      id: 'ai-integration',
      title: 'AI-Powered Mining Strategies',
      description: 'Leverage TERA Guardian AI for automated mining optimization',
      difficulty: 'Expert',
      duration: '2h 45min',
      progress: 0,
      status: 'available',
      category: 'advanced'
    }
  ];
  res.json(modules);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 TERA Guardian Platform running on port ${PORT}`);
});