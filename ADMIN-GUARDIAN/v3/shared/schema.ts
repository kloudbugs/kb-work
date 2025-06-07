import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  balance: doublePrecision("balance").default(0),
  walletAddress: text("wallet_address"),
  ethAddress: text("eth_address"),
  ethBalance: doublePrecision("eth_balance").default(0),
  withdrawalThreshold: doublePrecision("withdrawal_threshold").default(0.001),
  payoutThreshold: doublePrecision("payout_threshold").default(0.1),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const miningSettings = pgTable("mining_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  algorithm: text("algorithm").default("cryptonight"),
  poolUrl: text("pool_url").default("pool.xmr.pt"),
  poolPort: integer("pool_port").default(9999),
  walletAddress: text("wallet_address"),
  intensity: integer("intensity").default(80),
  threads: integer("threads").default(4),
  maxTemp: integer("max_temp").default(85),
  autoPause: boolean("auto_pause").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMiningSettingsSchema = createInsertSchema(miningSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMiningSettings = z.infer<typeof insertMiningSettingsSchema>;
export type MiningSettings = typeof miningSettings.$inferSelect;

export const miningRewards = pgTable("mining_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  currency: text("currency").notNull(),
  txHash: text("tx_hash"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMiningRewardSchema = createInsertSchema(miningRewards).omit({
  id: true,
  createdAt: true,
});

export type InsertMiningReward = z.infer<typeof insertMiningRewardSchema>;
export type MiningReward = typeof miningRewards.$inferSelect;

// TERA Guardian AI System Tables
export const miningPools = pgTable("mining_pools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  port: integer("port").notNull(),
  isActive: boolean("is_active").default(false),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const miningPoolStats = pgTable("mining_pool_stats", {
  id: serial("id").primaryKey(),
  hashrate: doublePrecision("hashrate").notNull(),
  power: doublePrecision("power").notNull(),
  temperature: doublePrecision("temperature").notNull(),
  earnings: doublePrecision("earnings").notNull(),
  userId: integer("user_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const miningHardware = pgTable("mining_hardware", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "CPU", "GPU", "ASIC"
  hashrate: doublePrecision("hashrate").notNull(),
  power: doublePrecision("power").notNull(),
  temperature: doublePrecision("temperature").default(0),
  isActive: boolean("is_active").default(false),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  status: text("status").notNull(), // "success", "warning", "error"
  userId: integer("user_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const automaticPayouts = pgTable("automatic_payouts", {
  id: serial("id").primaryKey(),
  amount: doublePrecision("amount").notNull(),
  address: text("address").notNull(),
  status: text("status").notNull(), // "pending", "processing", "completed", "failed"
  transactionId: text("transaction_id"),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// TERA Guardian AI Coordination
export const teraGuardians = pgTable("tera_guardians", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull(), // "active", "standby", "maintenance", "offline"
  aiLoadLevel: doublePrecision("ai_load_level").default(0),
  processingPower: doublePrecision("processing_power").default(0),
  capabilities: text("capabilities").array(),
  accessLevel: text("access_level").notNull(),
  lastUpdate: timestamp("last_update").defaultNow(),
});

// Insert schemas
export const insertMiningPoolSchema = createInsertSchema(miningPools).omit({
  id: true,
  createdAt: true,
});

export const insertMiningPoolStatsSchema = createInsertSchema(miningPoolStats).omit({
  id: true,
  timestamp: true,
});

export const insertMiningHardwareSchema = createInsertSchema(miningHardware).omit({
  id: true,
  createdAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true,
});

export const insertAutomaticPayoutSchema = createInsertSchema(automaticPayouts).omit({
  id: true,
  createdAt: true,
});

export const insertTeraGuardianSchema = createInsertSchema(teraGuardians).omit({
  id: true,
  lastUpdate: true,
});

// Types
export type InsertMiningPool = z.infer<typeof insertMiningPoolSchema>;
export type MiningPool = typeof miningPools.$inferSelect;

export type InsertMiningPoolStats = z.infer<typeof insertMiningPoolStatsSchema>;
export type MiningPoolStats = typeof miningPoolStats.$inferSelect;

export type InsertMiningHardware = z.infer<typeof insertMiningHardwareSchema>;
export type MiningHardware = typeof miningHardware.$inferSelect;

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

export type InsertAutomaticPayout = z.infer<typeof insertAutomaticPayoutSchema>;
export type AutomaticPayout = typeof automaticPayouts.$inferSelect;

export type InsertTeraGuardian = z.infer<typeof insertTeraGuardianSchema>;
export type TeraGuardian = typeof teraGuardians.$inferSelect;

// Mining System Types
export type HardwareStatus = {
  gpuTemp: number;
  gpuUtilization: number;
  powerConsumption: number;
  fans: number[];
};

export type MiningStats = {
  hashrate: number;
  avgHashrate: number;
  acceptedShares: number;
  rejectedShares: number;
  difficulty: number;
  successRate: number;
  isActive: boolean;
};

export type MiningProfitability = {
  dailyEarning: number;
  weeklyEarning: number;
  monthlyEarning: number;
  powerCost: number;
};

export type MiningStatusUpdate = {
  hardwareStatus: HardwareStatus;
  miningStats: MiningStats;
  profitability: MiningProfitability;
  timestamp: number;
};

export type LaptopInfo = {
  model: string;
  gpu: string;
  cpuCores: number;
  memory: number;
};

export type MiningCommand = {
  command: 'start' | 'stop' | 'updateSettings';
  settings?: Partial<MiningSettings>;
};

export type OptimalCoins = {
  name: string;
  symbol: string;
  profitability: number;
  change: number;
}