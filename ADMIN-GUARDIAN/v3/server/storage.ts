import {
  type User,
  type InsertUser,
  type MiningSettings,
  type InsertMiningSettings,
  type MiningReward,
  type InsertMiningReward,
} from "@shared/schema";

// Simple storage interface for TERA Guardian AI System
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  getMiningSettings(userId: number): Promise<MiningSettings | undefined>;
  createDefaultMiningSettings(userId: number): Promise<MiningSettings>;
  updateMiningSettings(userId: number, settings: Partial<InsertMiningSettings>): Promise<MiningSettings>;
  
  getMiningRewards(userId: number): Promise<MiningReward[]>;
  createMiningReward(reward: InsertMiningReward): Promise<MiningReward>;
  updateMiningReward(rewardId: number, updates: Partial<MiningReward>): Promise<MiningReward>;

  // TERA Guardian AI System - Mining Operations
  getMiningPools(userId: number): Promise<any[]>;
  createMiningPool(pool: any): Promise<any>;
  updateMiningPool(poolId: number, updates: any): Promise<any>;

  getMiningStats(userId: number, limit?: number): Promise<any[]>;
  createMiningStats(stats: any): Promise<any>;
  getLatestStats(userId: number): Promise<any>;

  getMiningHardware(userId: number): Promise<any[]>;
  createMiningHardware(hardware: any): Promise<any>;
  updateMiningHardware(hardwareId: number, updates: any): Promise<any>;

  getActivityLogs(userId: number, limit?: number): Promise<any[]>;
  createActivityLog(log: any): Promise<any>;

  createAutomaticPayout(payout: any): Promise<any>;

  // TERA Guardian AI Entities
  getTeraGuardians(): Promise<any[]>;
  createTeraGuardian(guardian: any): Promise<any>;
  updateTeraGuardian(guardianId: number, updates: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private miningSettings: Map<number, MiningSettings>;
  private miningRewards: MiningReward[];
  private miningPools: Map<number, any[]>;
  private miningStats: Map<number, any[]>;
  private miningHardware: Map<number, any[]>;
  private activityLogs: Map<number, any[]>;
  private automaticPayouts: any[];
  private teraGuardians: any[];
  currentId: number;
  currentSettingsId: number;
  currentRewardId: number;
  currentPoolId: number;
  currentStatsId: number;
  currentHardwareId: number;
  currentLogId: number;
  currentPayoutId: number;
  currentGuardianId: number;

  constructor() {
    this.users = new Map();
    this.miningSettings = new Map();
    this.miningRewards = [];
    this.miningPools = new Map();
    this.miningStats = new Map();
    this.miningHardware = new Map();
    this.activityLogs = new Map();
    this.automaticPayouts = [];
    this.teraGuardians = [];
    this.currentId = 1;
    this.currentSettingsId = 1;
    this.currentRewardId = 1;
    this.currentPoolId = 1;
    this.currentStatsId = 1;
    this.currentHardwareId = 1;
    this.currentLogId = 1;
    this.currentPayoutId = 1;
    this.currentGuardianId = 1;

    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize teramining user account
    const teraminingUser: User = {
      id: 1,
      username: "teramining",
      password: "123",
      balance: 0.00234567,
      walletAddress: "", // Hardware wallet address - to be configured
      ethAddress: "", // Hardware wallet ETH address - to be configured
      ethBalance: 0.15,
      withdrawalThreshold: 0.001,
      payoutThreshold: 0.1,
    };

    this.users.set(1, teraminingUser);

    // Initialize TERA Guardian AI system
    const guardians = [
      {
        id: 1,
        name: "TERA Guardian Core",
        role: "PLATFORM_OVERSEER",
        status: "active",
        aiLoadLevel: 85.2,
        processingPower: 92.1,
        capabilities: ["mining_optimization", "security_monitoring", "reward_calculation", "transaction_verification", "fraud_detection"],
        accessLevel: "OWNER",
        lastUpdate: new Date(),
      },
      {
        id: 2,
        name: "TeraMiner",
        role: "MINING_SPECIALIST",
        status: "active",
        aiLoadLevel: 78.5,
        processingPower: 88.3,
        capabilities: ["hardware_optimization", "power_management", "difficulty_adjustment", "hashrate_prediction"],
        accessLevel: "ADMIN",
        lastUpdate: new Date(),
      },
      {
        id: 3,
        name: "TeraSecure",
        role: "SECURITY_SPECIALIST",
        status: "active",
        aiLoadLevel: 65.8,
        processingPower: 75.2,
        capabilities: ["threat_detection", "vulnerability_scanning", "access_control", "audit_logging"],
        accessLevel: "ADMIN",
        lastUpdate: new Date(),
      },
      {
        id: 4,
        name: "TeraExchange",
        role: "FINANCE_SPECIALIST",
        status: "standby",
        aiLoadLevel: 45.3,
        processingPower: 55.7,
        capabilities: ["market_analysis", "exchange_rate_tracking", "profit_calculation", "payment_processing"],
        accessLevel: "ADMIN",
        lastUpdate: new Date(),
      },
    ];

    this.teraGuardians = guardians;

    // Initialize 4 TERA rigs - each dedicated to different pool types
    const hardware = [
      {
        id: 1,
        name: "TERA-RIG-01",
        type: "TERA",
        hashrate: 75.5,
        power: 2800,
        temperature: 65,
        isActive: true,
        poolType: "regular",
        assignedPools: ["NiceHash", "F2Pool", "Ethermine", "Flexpool"],
        userId: 1,
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "TERA-RIG-02",
        type: "TERA",
        hashrate: 78.2,
        power: 2750,
        temperature: 67,
        isActive: true,
        poolType: "node",
        assignedPools: ["Umbrel Node", "Bitcoin Core Node"],
        userId: 1,
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "TERA-RIG-03",
        type: "TERA",
        hashrate: 82.1,
        power: 2900,
        temperature: 63,
        isActive: true,
        poolType: "solo",
        assignedPools: ["Solo Mining BTC", "Solo Mining ETH"],
        userId: 1,
        createdAt: new Date(),
      },
      {
        id: 4,
        name: "TERA-RIG-04",
        type: "TERA",
        hashrate: 76.8,
        power: 2650,
        temperature: 69,
        isActive: true,
        poolType: "personal",
        assignedPools: ["TERA Personal Pool"],
        userId: 1,
        createdAt: new Date(),
      },
    ];

    this.miningHardware.set(1, hardware);

    // Initialize mining pools with 4 Tera rigs active across all pool types
    const pools = [
      {
        id: 1,
        name: "NiceHash",
        url: "stratum+tcp://daggerhashimoto.usa.nicehash.com",
        port: 3353,
        type: "regular",
        isActive: true,
        activeWorkers: 1,
        assignedRig: "TERA-RIG-01",
        userId: 1,
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "F2Pool",
        url: "stratum+tcp://btc.f2pool.com",
        port: 1314,
        type: "regular",
        isActive: true,
        activeWorkers: 1,
        assignedRig: "TERA-RIG-01",
        userId: 1,
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "Umbrel Node",
        url: "localhost",
        port: 8332,
        type: "node",
        isActive: true,
        activeWorkers: 1,
        assignedRig: "TERA-RIG-02",
        userId: 1,
        createdAt: new Date(),
      },
      {
        id: 4,
        name: "Solo Mining BTC",
        url: "solo.ckpool.org",
        port: 3333,
        type: "solo",
        isActive: true,
        activeWorkers: 1,
        assignedRig: "TERA-RIG-03",
        userId: 1,
        createdAt: new Date(),
      },
      {
        id: 5,
        name: "TERA Personal Pool",
        url: "pool.teramining.ai",
        port: 4444,
        type: "personal",
        isActive: true,
        activeWorkers: 1,
        assignedRig: "TERA-RIG-04",
        userId: 1,
        createdAt: new Date(),
      },
    ];

    this.miningPools.set(1, pools);

    // Initialize activity logs
    const logs = [
      {
        id: 1,
        message: "TERA Guardian system initialized",
        status: "success",
        userId: 1,
        timestamp: new Date(),
      },
      {
        id: 2,
        message: "Mining hardware detected: 4 TERA rigs active",
        status: "success",
        userId: 1,
        timestamp: new Date(),
      },
      {
        id: 3,
        message: "TERA-RIG-01 connected to regular pools",
        status: "success",
        userId: 1,
        timestamp: new Date(),
      },
      {
        id: 4,
        message: "TERA-RIG-02 connected to node mining",
        status: "success",
        userId: 1,
        timestamp: new Date(),
      },
      {
        id: 5,
        message: "TERA-RIG-03 connected to solo mining",
        status: "success",
        userId: 1,
        timestamp: new Date(),
      },
      {
        id: 6,
        message: "TERA-RIG-04 connected to personal pool",
        status: "success",
        userId: 1,
        timestamp: new Date(),
      },
    ];

    this.activityLogs.set(1, logs);

    // Initialize mining settings for teramining5 with F2Pool connection
    const defaultSettings: MiningSettings = {
      id: 1,
      userId: 1,
      algorithm: "SHA-256",
      poolUrl: "stratum+tcp://btc.f2pool.com",
      poolPort: 1314,
      walletAddress: "", // Hardware wallet address - will be configured
      intensity: 85,
      threads: 8,
      maxTemp: 80,
      autoPause: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.miningSettings.set(1, defaultSettings);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      balance: 0,
      walletAddress: null,
      ethAddress: null,
      ethBalance: 0,
      withdrawalThreshold: 0.001,
      payoutThreshold: 0.1,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getMiningSettings(userId: number): Promise<MiningSettings | undefined> {
    return this.miningSettings.get(userId);
  }

  async createDefaultMiningSettings(userId: number): Promise<MiningSettings> {
    const id = this.currentSettingsId++;
    const settings: MiningSettings = {
      id,
      userId,
      algorithm: "SHA-256",
      poolUrl: "stratum+tcp://stratum.slushpool.com",
      poolPort: 4444,
      walletAddress: null,
      intensity: 80,
      threads: 4,
      maxTemp: 85,
      autoPause: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.miningSettings.set(userId, settings);
    return settings;
  }

  async updateMiningSettings(userId: number, updatedSettings: Partial<InsertMiningSettings>): Promise<MiningSettings> {
    const settings = this.miningSettings.get(userId);
    if (!settings) {
      throw new Error('Settings not found');
    }

    const newSettings: MiningSettings = {
      ...settings,
      ...updatedSettings,
      updatedAt: new Date(),
    };

    this.miningSettings.set(userId, newSettings);
    return newSettings;
  }

  async getMiningRewards(userId: number): Promise<MiningReward[]> {
    return this.miningRewards.filter(reward => reward.userId === userId);
  }

  async createMiningReward(reward: InsertMiningReward): Promise<MiningReward> {
    const id = this.currentRewardId++;
    const newReward: MiningReward = {
      ...reward,
      id,
      createdAt: new Date(),
    };

    this.miningRewards.push(newReward);
    return newReward;
  }

  async updateMiningReward(rewardId: number, updates: Partial<MiningReward>): Promise<MiningReward> {
    const rewardIndex = this.miningRewards.findIndex(r => r.id === rewardId);
    if (rewardIndex === -1) {
      throw new Error('Reward not found');
    }

    this.miningRewards[rewardIndex] = { ...this.miningRewards[rewardIndex], ...updates };
    return this.miningRewards[rewardIndex];
  }

  // TERA Guardian AI System Methods
  async getMiningPools(userId: number): Promise<any[]> {
    return this.miningPools.get(userId) || [];
  }

  async createMiningPool(pool: any): Promise<any> {
    const id = this.currentPoolId++;
    const newPool = { ...pool, id, createdAt: new Date() };
    
    const userPools = this.miningPools.get(pool.userId) || [];
    userPools.push(newPool);
    this.miningPools.set(pool.userId, userPools);
    
    return newPool;
  }

  async updateMiningPool(poolId: number, updates: any): Promise<any> {
    for (const [userId, pools] of this.miningPools.entries()) {
      const poolIndex = pools.findIndex(p => p.id === poolId);
      if (poolIndex !== -1) {
        pools[poolIndex] = { ...pools[poolIndex], ...updates };
        return pools[poolIndex];
      }
    }
    return undefined;
  }

  async getMiningStats(userId: number, limit = 100): Promise<any[]> {
    const stats = this.miningStats.get(userId) || [];
    return stats.slice(-limit);
  }

  async createMiningStats(stats: any): Promise<any> {
    const id = this.currentStatsId++;
    const newStats = { ...stats, id, timestamp: new Date() };
    
    const userStats = this.miningStats.get(stats.userId) || [];
    userStats.push(newStats);
    this.miningStats.set(stats.userId, userStats);
    
    return newStats;
  }

  async getLatestStats(userId: number): Promise<any> {
    const stats = this.miningStats.get(userId) || [];
    return stats[stats.length - 1];
  }

  async getMiningHardware(userId: number): Promise<any[]> {
    return this.miningHardware.get(userId) || [];
  }

  async createMiningHardware(hardware: any): Promise<any> {
    const id = this.currentHardwareId++;
    const newHardware = { ...hardware, id, createdAt: new Date() };
    
    const userHardware = this.miningHardware.get(hardware.userId) || [];
    userHardware.push(newHardware);
    this.miningHardware.set(hardware.userId, userHardware);
    
    return newHardware;
  }

  async updateMiningHardware(hardwareId: number, updates: any): Promise<any> {
    for (const [userId, hardware] of this.miningHardware.entries()) {
      const hardwareIndex = hardware.findIndex(h => h.id === hardwareId);
      if (hardwareIndex !== -1) {
        hardware[hardwareIndex] = { ...hardware[hardwareIndex], ...updates };
        return hardware[hardwareIndex];
      }
    }
    return undefined;
  }

  async getActivityLogs(userId: number, limit = 50): Promise<any[]> {
    const logs = this.activityLogs.get(userId) || [];
    return logs.slice(-limit);
  }

  async createActivityLog(log: any): Promise<any> {
    const id = this.currentLogId++;
    const newLog = { ...log, id, timestamp: new Date() };
    
    const userLogs = this.activityLogs.get(log.userId) || [];
    userLogs.push(newLog);
    this.activityLogs.set(log.userId, userLogs);
    
    return newLog;
  }

  async createAutomaticPayout(payout: any): Promise<any> {
    const id = this.currentPayoutId++;
    const newPayout = { ...payout, id, createdAt: new Date() };
    
    this.automaticPayouts.push(newPayout);
    return newPayout;
  }

  async getTeraGuardians(): Promise<any[]> {
    return this.teraGuardians;
  }

  async createTeraGuardian(guardian: any): Promise<any> {
    const id = this.currentGuardianId++;
    const newGuardian = { ...guardian, id, lastUpdate: new Date() };
    
    this.teraGuardians.push(newGuardian);
    return newGuardian;
  }

  async updateTeraGuardian(guardianId: number, updates: any): Promise<any> {
    const guardianIndex = this.teraGuardians.findIndex(g => g.id === guardianId);
    if (guardianIndex !== -1) {
      this.teraGuardians[guardianIndex] = { 
        ...this.teraGuardians[guardianIndex], 
        ...updates, 
        lastUpdate: new Date() 
      };
      return this.teraGuardians[guardianIndex];
    }
    throw new Error('Guardian not found');
  }
}

export const storage = new MemStorage();