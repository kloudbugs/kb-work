import { 
  users, 
  miningPools, 
  miningStats, 
  miningHardware, 
  activityLogs,
  automaticPayouts,
  type User, 
  type InsertUser,
  type MiningPool,
  type InsertMiningPool,
  type MiningStats,
  type InsertMiningStats,
  type MiningHardware,
  type InsertMiningHardware,
  type ActivityLog,
  type InsertActivityLog,
  type AutomaticPayout,
  type InsertAutomaticPayout
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Mining pool methods
  getMiningPools(userId: number): Promise<MiningPool[]>;
  createMiningPool(pool: InsertMiningPool): Promise<MiningPool>;
  updateMiningPool(id: number, updates: Partial<MiningPool>): Promise<MiningPool | undefined>;
  deleteMiningPool(id: number): Promise<boolean>;

  // Mining stats methods
  getMiningStats(userId: number, limit?: number): Promise<MiningStats[]>;
  createMiningStats(stats: InsertMiningStats): Promise<MiningStats>;
  getLatestStats(userId: number): Promise<MiningStats | undefined>;

  // Mining hardware methods
  getMiningHardware(userId: number): Promise<MiningHardware[]>;
  createMiningHardware(hardware: InsertMiningHardware): Promise<MiningHardware>;
  updateMiningHardware(id: number, updates: Partial<MiningHardware>): Promise<MiningHardware | undefined>;
  deleteMiningHardware(id: number): Promise<boolean>;

  // Activity log methods
  getActivityLogs(userId: number, limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;

  // Automatic payout methods
  getAutomaticPayouts(userId: number, limit?: number): Promise<AutomaticPayout[]>;
  createAutomaticPayout(payout: InsertAutomaticPayout): Promise<AutomaticPayout>;
}

export class PostgresStorage implements IStorage {
  constructor() {
    // Initialize database with demo data if needed
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    try {
      // Check if demo user already exists
      const existingUser = await this.getUserByUsername("demo");
      if (!existingUser) {
        // Create demo user
        await this.createUser({
          username: "demo",
          password: "demo123",
          walletAddress: "bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6",
          withdrawalThreshold: 0.001,
          balance: 0.00000000,
        });

        const user = await this.getUserByUsername("demo");
        if (user) {
          // Create demo mining pool
          await this.createMiningPool({
            name: "F2Pool",
            url: "stratum+tcp://btc.f2pool.com",
            port: 1314,
            isActive: true,
            userId: user.id,
          });

          // Create demo hardware
          await this.createMiningHardware({
            name: "CPU Mining (8 cores)",
            type: "cpu",
            hashrate: 145.2,
            power: 125,
            temperature: 67,
            isActive: true,
            userId: user.id,
          });
        }
      }
    } catch (error) {
      console.log('Demo data already initialized or database not ready yet');
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    try {
      const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  async getMiningPools(userId: number): Promise<MiningPool[]> {
    try {
      const result = await db.select().from(miningPools).where(eq(miningPools.userId, userId));
      return result;
    } catch (error) {
      console.error('Error getting mining pools:', error);
      return [];
    }
  }

  async createMiningPool(pool: InsertMiningPool): Promise<MiningPool> {
    try {
      const result = await db.insert(miningPools).values(pool).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating mining pool:', error);
      throw error;
    }
  }

  async updateMiningPool(id: number, updates: Partial<MiningPool>): Promise<MiningPool | undefined> {
    try {
      const result = await db.update(miningPools).set(updates).where(eq(miningPools.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Error updating mining pool:', error);
      return undefined;
    }
  }

  async deleteMiningPool(id: number): Promise<boolean> {
    try {
      await db.delete(miningPools).where(eq(miningPools.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting mining pool:', error);
      return false;
    }
  }

  async getMiningStats(userId: number, limit = 100): Promise<MiningStats[]> {
    try {
      const result = await db.select().from(miningStats)
        .where(eq(miningStats.userId, userId))
        .orderBy(desc(miningStats.timestamp))
        .limit(limit);
      return result;
    } catch (error) {
      console.error('Error getting mining stats:', error);
      return [];
    }
  }

  async createMiningStats(stats: InsertMiningStats): Promise<MiningStats> {
    try {
      const result = await db.insert(miningStats).values(stats).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating mining stats:', error);
      throw error;
    }
  }

  async getLatestStats(userId: number): Promise<MiningStats | undefined> {
    try {
      const result = await db.select().from(miningStats)
        .where(eq(miningStats.userId, userId))
        .orderBy(desc(miningStats.timestamp))
        .limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting latest stats:', error);
      return undefined;
    }
  }

  async getMiningHardware(userId: number): Promise<MiningHardware[]> {
    try {
      const result = await db.select().from(miningHardware).where(eq(miningHardware.userId, userId));
      return result;
    } catch (error) {
      console.error('Error getting mining hardware:', error);
      return [];
    }
  }

  async createMiningHardware(hardware: InsertMiningHardware): Promise<MiningHardware> {
    try {
      const result = await db.insert(miningHardware).values(hardware).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating mining hardware:', error);
      throw error;
    }
  }

  async updateMiningHardware(id: number, updates: Partial<MiningHardware>): Promise<MiningHardware | undefined> {
    try {
      const result = await db.update(miningHardware).set(updates).where(eq(miningHardware.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Error updating mining hardware:', error);
      return undefined;
    }
  }

  async deleteMiningHardware(id: number): Promise<boolean> {
    try {
      await db.delete(miningHardware).where(eq(miningHardware.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting mining hardware:', error);
      return false;
    }
  }

  async getActivityLogs(userId: number, limit = 50): Promise<ActivityLog[]> {
    try {
      const result = await db.select().from(activityLogs)
        .where(eq(activityLogs.userId, userId))
        .orderBy(desc(activityLogs.timestamp))
        .limit(limit);
      return result;
    } catch (error) {
      console.error('Error getting activity logs:', error);
      return [];
    }
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    try {
      const result = await db.insert(activityLogs).values(log).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating activity log:', error);
      throw error;
    }
  }

  async getAutomaticPayouts(userId: number, limit = 20): Promise<AutomaticPayout[]> {
    try {
      return await db
        .select()
        .from(automaticPayouts)
        .where(eq(automaticPayouts.userId, userId))
        .orderBy(desc(automaticPayouts.timestamp))
        .limit(limit);
    } catch (error) {
      console.error('Error getting automatic payouts:', error);
      return [];
    }
  }

  async createAutomaticPayout(payout: InsertAutomaticPayout): Promise<AutomaticPayout> {
    try {
      const [newPayout] = await db.insert(automaticPayouts).values(payout).returning();
      return newPayout;
    } catch (error) {
      console.error('Error creating automatic payout:', error);
      throw error;
    }
  }
}

export const storage = new PostgresStorage();
