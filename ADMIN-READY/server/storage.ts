import {
  users, type User, type InsertUser,
  devices, type Device, type InsertDevice,
  pools, type Pool, type InsertPool,
  miningStats, type MiningStats, type InsertMiningStats,
  payouts, type Payout, type InsertPayout,
  settings, type Settings, type InsertSettings,
  subscriptionPlans, type SubscriptionPlan, type InsertSubscriptionPlan,
  subscriptions, type Subscription, type InsertSubscription,
  payments, type Payment, type InsertPayment
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Device operations
  getDevices(userId: number): Promise<Device[]>;
  getDevice(id: number): Promise<Device | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDevice(id: number, device: Partial<InsertDevice>): Promise<Device>;
  deleteDevice(id: number): Promise<boolean>;
  updateDeviceHashRate(id: number, hashRate: number): Promise<Device>;
  
  // Mining pool operations
  getPools(): Promise<Pool[]>;
  getPool(id: number): Promise<Pool | undefined>;
  createPool(pool: InsertPool): Promise<Pool>;
  updatePool(id: number, pool: Partial<InsertPool>): Promise<Pool>;
  deletePool(id: number): Promise<boolean>;
  
  // Mining statistics
  getMiningStats(userId: number): Promise<MiningStats | undefined>;
  saveMiningStats(stats: InsertMiningStats): Promise<MiningStats>;
  getMiningHistory(userId: number, days: number): Promise<MiningStats[]>;
  
  // Payout operations
  getPayouts(userId: number): Promise<Payout[]>;
  getPayoutsByStatus(status: string): Promise<Payout[]>;
  createPayout(payout: InsertPayout): Promise<Payout>;
  updatePayout(id: number, payout: Partial<InsertPayout>): Promise<Payout>;
  
  // Settings operations
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;
  
  // Subscription Plan operations
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: number, plan: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan>;
  deleteSubscriptionPlan(id: number): Promise<boolean>;
  
  // User Subscription operations
  getUserSubscriptions(userId: number): Promise<Subscription[]>;
  getActiveUserSubscription(userId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<InsertSubscription>): Promise<Subscription>;
  cancelSubscription(id: number): Promise<Subscription>;
  
  // Payment operations
  getPayments(userId: number): Promise<Payment[]>;
  getPaymentsBySubscription(subscriptionId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  
  // Authorization operations
  hasActiveSubscription(userId: number): Promise<boolean>;
  getUserSubscriptionLevel(userId: number): Promise<string | undefined>;
  
  // Network Dashboard Operations
  getActiveMiningSessionsWithUsers(): Promise<any[]>;
  getActiveMiners(): Promise<any[]>;
  getTotalMiningRewards(): Promise<{btc: number, mpt: number, tera: number}>;
  getMiningRegionalDistribution(): Promise<any[]>;
  getBlockchainStats(): Promise<any>;
  cacheBlockchainStats(stats: any): Promise<void>;
  getMiningRewards(): Promise<any[]>;
  getMiners(): Promise<any[]>;
  getUsers(): Promise<any[]>;
  blockchainStatsCache?: any;
}

// Memory-based storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private devices: Map<number, Device>;
  private pools: Map<number, Pool>;
  private miningStats: Map<number, MiningStats>;
  private payouts: Map<number, Payout>;
  private settings: Settings | undefined;
  private subscriptionPlans: Map<number, SubscriptionPlan>;
  private subscriptions: Map<number, Subscription>;
  private payments: Map<number, Payment>;
  
  private currentIds: {
    users: number;
    devices: number;
    pools: number;
    miningStats: number;
    payouts: number;
    settings: number;
    subscriptionPlans: number;
    subscriptions: number;
    payments: number;
  };

  constructor() {
    this.users = new Map();
    this.devices = new Map();
    this.pools = new Map();
    this.miningStats = new Map();
    this.payouts = new Map();
    this.subscriptionPlans = new Map();
    this.subscriptions = new Map();
    this.payments = new Map();
    
    this.currentIds = {
      users: 1,
      devices: 1,
      pools: 1,
      miningStats: 1,
      payouts: 1,
      settings: 1,
      subscriptionPlans: 1,
      subscriptions: 1,
      payments: 1
    };
    
    // Initialize with some default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default settings
    const defaultSettings: Settings = {
      id: this.currentIds.settings++,
      miningEnabled: true,
      activePoolId: 7, // Set to Unmineable pool ID (based on the ordering)
      bitcoinPriceUsd: 60000,
      lastPriceUpdate: new Date(),
      walletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps"
    };
    this.settings = defaultSettings;
    
    // Create real mining pools
    const f2Pool: Pool = {
      id: this.currentIds.pools++,
      name: "F2Pool",
      url: "stratum+tcp://btc.f2pool.com:1314",
      username: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      password: "x",
      algorithm: "sha256",
      status: "active",
      fee: 2.5,
      priority: 1,
      lastBlockFound: new Date(),
      poolType: "standard",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps"
    };
    
    const slushPool: Pool = {
      id: this.currentIds.pools++,
      name: "Braiins Pool (Slush Pool)",
      url: "stratum+tcp://stratum.braiins.com:3333",
      username: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      password: "x",
      algorithm: "sha256",
      status: "standby",
      fee: "2.0",
      priority: 2,
      lastBlockFound: null,
      poolType: "standard",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps"
    };
    
    const moneroOceanPool: Pool = {
      id: this.currentIds.pools++,
      name: "Monero Ocean",
      url: "stratum+tcp://gulf.moneroocean.stream:10128",
      username: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      password: "x",
      algorithm: "randomx",
      status: "standby",
      fee: "0.8",
      priority: 3,
      lastBlockFound: null,
      poolType: "monero_ocean",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps"
    };
    
    const antPool: Pool = {
      id: this.currentIds.pools++,
      name: "AntPool",
      url: "stratum+tcp://stratum.antpool.com:3333",
      username: "yourWorkerName",
      password: "x",
      algorithm: "sha256",
      status: "standby",
      fee: 2.5,
      priority: 4,
      lastBlockFound: null,
      poolType: "standard",
      directBtcPayment: false,
      btcWalletAddress: null
    };
    
    const foundryUSA: Pool = {
      id: this.currentIds.pools++,
      name: "Foundry USA",
      url: "stratum+tcp://pool.foundry.com:3333",
      username: "yourUsername.worker",
      password: "x",
      algorithm: "sha256",
      status: "standby",
      fee: 2.0,
      priority: 5,
      lastBlockFound: null,
      poolType: "standard",
      directBtcPayment: false,
      btcWalletAddress: null
    };
    
    const niceHash: Pool = {
      id: this.currentIds.pools++,
      name: "NiceHash",
      url: "stratum+tcp://stratum.nicehash.com:3353",
      username: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      password: "x",
      algorithm: "sha256",
      status: "standby",
      fee: 3.0,
      priority: 6,
      lastBlockFound: null,
      poolType: "nicehash",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps"
    };
    
    // Main Unmineable pool
    const unMineable: Pool = {
      id: this.currentIds.pools++,
      name: "Unmineable", // Changed to match exactly what we're searching for
      url: "stratum+tcp://sha256.unmineable.com:3333", // SHA-256 algorithm endpoint for Bitcoin mining
      username: "BTC.bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps", // Just COIN.ADDRESS - worker name is optional
      password: "x", // Standard password as per documentation
      algorithm: "sha256", // Using SHA-256 for Bitcoin mining
      status: "active",
      fee: 1.0,
      priority: 1, // Set as highest priority
      lastBlockFound: null,
      poolType: "unmineable",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      miningKey: "1735896864" // Adding Mining Key support
    };
    
    // Unmineable US region pool
    const unMineableUS: Pool = {
      id: this.currentIds.pools++,
      name: "Unmineable US",
      url: "stratum+tcp://sha256-us.unmineable.com:3333", // US region SHA-256 server
      username: "BTC.bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps", // Just COIN.ADDRESS
      password: "x", 
      algorithm: "sha256",
      status: "active",
      fee: 1.0,
      priority: 2,
      lastBlockFound: null,
      poolType: "unmineable",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      miningKey: "1735896864" // Same Mining Key for all Unmineable pools
    };
    
    // Unmineable EU region pool
    const unMineableEU: Pool = {
      id: this.currentIds.pools++,
      name: "Unmineable EU",
      url: "stratum+tcp://rx-eu.unmineable.com:3333", // EU region RandomX server
      username: "BTC.bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps", // Just COIN.ADDRESS
      password: "x", 
      algorithm: "randomx",
      status: "active",
      fee: 1.0,
      priority: 3,
      lastBlockFound: null,
      poolType: "unmineable",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      miningKey: "1735896864" // Same Mining Key for all Unmineable pools
    };
    
    // Unmineable Asia region pool
    const unMineableAsia: Pool = {
      id: this.currentIds.pools++,
      name: "Unmineable Asia",
      url: "stratum+tcp://rx-asia.unmineable.com:3333", // Asia region RandomX server
      username: "BTC.bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps", // Just COIN.ADDRESS
      password: "x", 
      algorithm: "randomx",
      status: "active",
      fee: 1.0,
      priority: 4,
      lastBlockFound: null,
      poolType: "unmineable",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      miningKey: "1735896864" // Same Mining Key for all Unmineable pools
    };
    
    // GPU mining with Ethash algorithm
    const unMineableGPU: Pool = {
      id: this.currentIds.pools++,
      name: "Unmineable GPU",
      url: "stratum+tcp://ethash.unmineable.com:3333", // Ethash algorithm for GPU mining
      username: "BTC.bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps", // Just COIN.ADDRESS
      password: "x", 
      algorithm: "ethash",
      status: "active",
      fee: 1.0,
      priority: 5,
      lastBlockFound: null,
      poolType: "unmineable",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      miningKey: "1735896864" // Same Mining Key for all Unmineable pools
    };
    
    // Alternative TCP port for randomx
    const unMineableAlt: Pool = {
      id: this.currentIds.pools++,
      name: "Unmineable Alt",
      url: "stratum+tcp://rx.unmineable.com:13333", // Alternative TCP port 13333
      username: "BTC.bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps", // Just COIN.ADDRESS
      password: "x", 
      algorithm: "randomx",
      status: "active",
      fee: 1.0,
      priority: 6,
      lastBlockFound: null,
      poolType: "unmineable",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      miningKey: "1735896864" // Same Mining Key for all Unmineable pools
    };
    
    // TCP port 80 (good for restricted networks)
    const unMineablePort80: Pool = {
      id: this.currentIds.pools++,
      name: "Unmineable P80",
      url: "stratum+tcp://rx.unmineable.com:80", // Web server port 80
      username: "BTC.bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps", // Just COIN.ADDRESS
      password: "x", 
      algorithm: "randomx",
      status: "active",
      fee: 1.0,
      priority: 7,
      lastBlockFound: null,
      poolType: "unmineable",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      miningKey: "1735896864" // Same Mining Key for all Unmineable pools
    };
    
    // SSL connection pool (for secure mining)
    const unMineableSSL: Pool = {
      id: this.currentIds.pools++,
      name: "Unmineable SSL",
      url: "stratum+ssl://rx.unmineable.com:443", // SSL endpoint on port 443
      username: "BTC.bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps", // Just COIN.ADDRESS
      password: "x", 
      algorithm: "randomx",
      status: "active",
      fee: 1.0,
      priority: 6,
      lastBlockFound: null,
      poolType: "unmineable",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      miningKey: "1735896864" // Same Mining Key for all Unmineable pools
    };
    
    // Proxy compatible TCP port (for xmr-node-proxy)
    const unMineableProxyTCP: Pool = {
      id: this.currentIds.pools++,
      name: "Unmineable Proxy",
      url: "stratum+tcp://rx.unmineable.com:4445", // Proxy-compatible port 4445
      username: "BTC.bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps", // Just COIN.ADDRESS
      password: "x", 
      algorithm: "randomx",
      status: "active",
      fee: 1.0,
      priority: 8,
      lastBlockFound: null,
      poolType: "unmineable",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      miningKey: "1735896864" // Same Mining Key for all Unmineable pools
    };
    
    // Proxy compatible SSL port (for secure xmr-node-proxy)
    const unMineableProxySSL: Pool = {
      id: this.currentIds.pools++,
      name: "Unmineable Proxy SSL",
      url: "stratum+ssl://rx.unmineable.com:14445", // Secure proxy-compatible port 14445
      username: "BTC.bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps", // Just COIN.ADDRESS
      password: "x", 
      algorithm: "randomx",
      status: "active",
      fee: 1.0,
      priority: 9,
      lastBlockFound: null,
      poolType: "unmineable",
      directBtcPayment: true,
      btcWalletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      miningKey: "1735896864" // Same Mining Key for all Unmineable pools
    };
    
    // Add all pools to storage
    this.pools.set(f2Pool.id, f2Pool);
    this.pools.set(slushPool.id, slushPool);
    this.pools.set(moneroOceanPool.id, moneroOceanPool);
    this.pools.set(antPool.id, antPool);
    this.pools.set(foundryUSA.id, foundryUSA);
    this.pools.set(niceHash.id, niceHash);
    this.pools.set(unMineable.id, unMineable);
    this.pools.set(unMineableUS.id, unMineableUS);
    this.pools.set(unMineableEU.id, unMineableEU);
    this.pools.set(unMineableAsia.id, unMineableAsia);
    this.pools.set(unMineableGPU.id, unMineableGPU);
    this.pools.set(unMineableAlt.id, unMineableAlt);
    this.pools.set(unMineablePort80.id, unMineablePort80);
    this.pools.set(unMineableSSL.id, unMineableSSL);
    this.pools.set(unMineableProxyTCP.id, unMineableProxyTCP);
    this.pools.set(unMineableProxySSL.id, unMineableProxySSL);
    
    // Demo user removed - we're only using the admin account now
    
    // Create an admin user with real bitcoin wallet address
    const adminUser: User = {
      id: this.currentIds.users++,
      username: "admin",
      password: "admin123",
      walletAddress: "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps",
      balance: "50000",  // 0.0005 BTC (50,000 satoshis)
      payoutThreshold: "0.0005",  // Unmineable's minimum threshold
      payoutSchedule: "daily",
      autoPayout: true,
      createdAt: new Date()
    };
    this.users.set(adminUser.id, adminUser);
    
    // Create a demo device for the admin user
    const demoDevice: Device = {
      id: this.currentIds.devices++,
      userId: adminUser.id,
      name: "Cloud Modem #1",
      ipAddress: "192.168.1.100",
      type: "ZIG Modem",
      cpuAllocation: 80,
      ramAllocation: 70,
      status: "active",
      hashRate: "18.5",
      createdAt: new Date(),
      lastSeen: new Date()
    };
    this.devices.set(demoDevice.id, demoDevice);
    
    // Add some mining stats for the admin user
    const adminStats: MiningStats = {
      id: this.currentIds.miningStats++,
      userId: adminUser.id,
      timestamp: new Date(),
      totalHashRate: "18.5",
      estimatedEarnings: "0.00012",
      activeDevices: 1,
      powerConsumption: "0.8",
      hashRateHistory: [[Date.now() - 86400000, 16.2], [Date.now(), 18.5]]
    };
    this.miningStats.set(adminStats.id, adminStats);
    
    // Create subscription plans
    const basicPlan: SubscriptionPlan = {
      id: this.currentIds.subscriptionPlans++,
      name: "Basic Miner",
      description: "Entry-level mining subscription with 1 device",
      price: "9.99",
      interval: "month",
      features: ["1 Mining Device", "Basic Support", "Standard Mining Pool"],
      maxDevices: 1,
      maxHashRate: "20",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const proPlan: SubscriptionPlan = {
      id: this.currentIds.subscriptionPlans++,
      name: "Pro Miner",
      description: "Professional mining subscription with up to 3 devices",
      price: "24.99",
      interval: "month",
      features: ["3 Mining Devices", "Priority Support", "Premium Mining Pools", "Automatic Payout"],
      maxDevices: 3,
      maxHashRate: "75",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const enterprisePlan: SubscriptionPlan = {
      id: this.currentIds.subscriptionPlans++,
      name: "Enterprise Miner",
      description: "Enterprise-level mining subscription with unlimited devices",
      price: "99.99",
      interval: "month",
      features: ["Unlimited Mining Devices", "24/7 Support", "All Mining Pools", "Priority Payout", "Custom Hash Rate"],
      maxDevices: 100,
      maxHashRate: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.subscriptionPlans.set(basicPlan.id, basicPlan);
    this.subscriptionPlans.set(proPlan.id, proPlan);
    this.subscriptionPlans.set(enterprisePlan.id, enterprisePlan);
    
    // Create an active subscription for the admin user
    const adminSubscription: Subscription = {
      id: this.currentIds.subscriptions++,
      userId: adminUser.id,
      planId: proPlan.id,
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      cancelAtPeriodEnd: false,
      paymentMethod: "credit_card",
      paymentId: "test_payment_id",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.subscriptions.set(adminSubscription.id, adminSubscription);
    
    // Create a payment record for the admin's subscription
    const adminPayment: Payment = {
      id: this.currentIds.payments++,
      userId: adminUser.id,
      subscriptionId: adminSubscription.id,
      amount: proPlan.price,
      currency: "USD",
      status: "succeeded",
      paymentMethod: "credit_card",
      paymentId: "test_payment_id",
      receiptUrl: "https://example.com/receipt",
      createdAt: new Date()
    };
    
    this.payments.set(adminPayment.id, adminPayment);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    console.log(`[STORAGE] Updating user #${id}: ${JSON.stringify(userData)}`);
    console.log(`[STORAGE] Current user data: ${JSON.stringify(user)}`);
    
    // Specifically handle balance conversion to ensure it's stored properly
    if (userData.balance !== undefined) {
      console.log(`[STORAGE] Setting balance from ${user.balance} to ${userData.balance}`);
    }
    
    // Create a new user object with updated fields
    const updatedUser = { ...user, ...userData };
    console.log(`[STORAGE] Updated user object: ${JSON.stringify(updatedUser)}`);
    
    // Save to storage
    this.users.set(id, updatedUser);
    
    // Verify the update
    const savedUser = this.users.get(id);
    console.log(`[STORAGE] Verified saved user: ${JSON.stringify(savedUser)}`);
    
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Device operations
  async getDevices(userId: number): Promise<Device[]> {
    return Array.from(this.devices.values()).filter(
      (device) => device.userId === userId
    );
  }
  
  async getDevice(id: number): Promise<Device | undefined> {
    return this.devices.get(id);
  }
  
  async createDevice(insertDevice: InsertDevice): Promise<Device> {
    const id = this.currentIds.devices++;
    const device: Device = { 
      ...insertDevice, 
      id, 
      hashRate: 0, 
      createdAt: new Date(), 
      lastSeen: new Date() 
    };
    this.devices.set(id, device);
    return device;
  }
  
  async updateDevice(id: number, deviceData: Partial<InsertDevice>): Promise<Device> {
    const device = this.devices.get(id);
    if (!device) {
      throw new Error(`Device with id ${id} not found`);
    }
    
    const updatedDevice = { ...device, ...deviceData };
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }
  
  async deleteDevice(id: number): Promise<boolean> {
    return this.devices.delete(id);
  }
  
  async updateDeviceHashRate(id: number, hashRate: number): Promise<Device> {
    const device = this.devices.get(id);
    if (!device) {
      throw new Error(`Device with id ${id} not found`);
    }
    
    const updatedDevice = { 
      ...device, 
      hashRate, 
      lastSeen: new Date()
    };
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }
  
  // Mining pool operations
  async getPools(): Promise<Pool[]> {
    // Sort pools to prioritize Unmineable pools first, then by priority
    return Array.from(this.pools.values())
      .sort((a, b) => {
        // First sort by pool type (Unmineable pools first)
        if (a.poolType === 'unmineable' && b.poolType !== 'unmineable') return -1;
        if (a.poolType !== 'unmineable' && b.poolType === 'unmineable') return 1;
        
        // Then sort by priority within the same pool type
        return a.priority - b.priority;
      });
  }
  
  async getPool(id: number): Promise<Pool | undefined> {
    return this.pools.get(id);
  }
  
  async createPool(insertPool: InsertPool): Promise<Pool> {
    const id = this.currentIds.pools++;
    const pool: Pool = { 
      ...insertPool, 
      id, 
      lastBlockFound: null,
      poolType: insertPool.poolType || "standard",
      directBtcPayment: insertPool.directBtcPayment || false,
      btcWalletAddress: insertPool.btcWalletAddress || null
    };
    this.pools.set(id, pool);
    return pool;
  }
  
  async updatePool(id: number, poolData: Partial<InsertPool>): Promise<Pool> {
    const pool = this.pools.get(id);
    if (!pool) {
      throw new Error(`Pool with id ${id} not found`);
    }
    
    const updatedPool = { ...pool, ...poolData };
    this.pools.set(id, updatedPool);
    return updatedPool;
  }
  
  async deletePool(id: number): Promise<boolean> {
    return this.pools.delete(id);
  }
  
  // Mining statistics
  async getMiningStats(userId: number): Promise<MiningStats | undefined> {
    return Array.from(this.miningStats.values())
      .filter(stats => stats.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }
  
  async saveMiningStats(insertStats: InsertMiningStats): Promise<MiningStats> {
    const id = this.currentIds.miningStats++;
    const stats: MiningStats = { ...insertStats, id, timestamp: new Date() };
    this.miningStats.set(id, stats);
    return stats;
  }
  
  async getMiningHistory(userId: number, days: number): Promise<MiningStats[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.miningStats.values())
      .filter(stats => 
        stats.userId === userId && 
        stats.timestamp.getTime() > cutoffDate.getTime()
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  // Payout operations
  async getPayouts(userId: number): Promise<Payout[]> {
    return Array.from(this.payouts.values())
      .filter(payout => payout.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async getPayoutsByStatus(status: string): Promise<Payout[]> {
    return Array.from(this.payouts.values())
      .filter(payout => payout.status === status)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async createPayout(insertPayout: InsertPayout): Promise<Payout> {
    const id = this.currentIds.payouts++;
    const payout: Payout = { ...insertPayout, id, timestamp: new Date() };
    this.payouts.set(id, payout);
    return payout;
  }
  
  async updatePayout(id: number, payoutData: Partial<InsertPayout>): Promise<Payout> {
    const payout = this.payouts.get(id);
    if (!payout) {
      throw new Error(`Payout with id ${id} not found`);
    }
    
    const updatedPayout = { ...payout, ...payoutData };
    this.payouts.set(id, updatedPayout);
    return updatedPayout;
  }
  
  // Settings operations
  async getSettings(): Promise<Settings | undefined> {
    return this.settings;
  }
  
  async updateSettings(settingsData: Partial<InsertSettings>): Promise<Settings> {
    if (!this.settings) {
      throw new Error("Settings not initialized");
    }
    
    this.settings = { ...this.settings, ...settingsData };
    return this.settings;
  }
  
  // Subscription Plan operations
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values())
      .filter(plan => plan.isActive)
      .sort((a, b) => Number(a.price) - Number(b.price));
  }
  
  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.get(id);
  }
  
  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const id = this.currentIds.subscriptionPlans++;
    const subscriptionPlan: SubscriptionPlan = { 
      ...plan, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.subscriptionPlans.set(id, subscriptionPlan);
    return subscriptionPlan;
  }
  
  async updateSubscriptionPlan(id: number, planData: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan> {
    const plan = this.subscriptionPlans.get(id);
    if (!plan) {
      throw new Error(`Subscription plan with id ${id} not found`);
    }
    
    const updatedPlan = { 
      ...plan, 
      ...planData,
      updatedAt: new Date()
    };
    this.subscriptionPlans.set(id, updatedPlan);
    return updatedPlan;
  }
  
  async deleteSubscriptionPlan(id: number): Promise<boolean> {
    const plan = this.subscriptionPlans.get(id);
    if (!plan) {
      return false;
    }
    
    // Instead of deleting, mark as inactive
    plan.isActive = false;
    plan.updatedAt = new Date();
    this.subscriptionPlans.set(id, plan);
    return true;
  }
  
  // User Subscription operations
  async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values())
      .filter(subscription => subscription.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getActiveUserSubscription(userId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values())
      .find(subscription => 
        subscription.userId === userId && 
        subscription.status === "active" &&
        subscription.currentPeriodEnd > new Date()
      );
  }
  
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentIds.subscriptions++;
    const newSubscription: Subscription = { 
      ...subscription, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.subscriptions.set(id, newSubscription);
    return newSubscription;
  }
  
  async updateSubscription(id: number, subscriptionData: Partial<InsertSubscription>): Promise<Subscription> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) {
      throw new Error(`Subscription with id ${id} not found`);
    }
    
    const updatedSubscription = { 
      ...subscription, 
      ...subscriptionData,
      updatedAt: new Date()
    };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
  
  async cancelSubscription(id: number): Promise<Subscription> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) {
      throw new Error(`Subscription with id ${id} not found`);
    }
    
    const updatedSubscription = { 
      ...subscription, 
      cancelAtPeriodEnd: true,
      updatedAt: new Date()
    };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
  
  // Payment operations
  async getPayments(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getPaymentsBySubscription(subscriptionId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.subscriptionId === subscriptionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.currentIds.payments++;
    const newPayment: Payment = { 
      ...payment, 
      id,
      createdAt: new Date()
    };
    this.payments.set(id, newPayment);
    return newPayment;
  }
  
  // Authorization operations
  async hasActiveSubscription(userId: number): Promise<boolean> {
    const subscription = await this.getActiveUserSubscription(userId);
    return !!subscription;
  }
  
  async getUserSubscriptionLevel(userId: number): Promise<string | undefined> {
    const subscription = await this.getActiveUserSubscription(userId);
    if (!subscription) {
      return undefined;
    }
    
    const plan = await this.getSubscriptionPlan(subscription.planId);
    return plan?.name;
  }
}

export const storage = new MemStorage();
