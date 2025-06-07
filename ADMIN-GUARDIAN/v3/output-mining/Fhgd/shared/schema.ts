import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  ethAddress: text("eth_address"),
  payoutThreshold: real("payout_threshold").default(0.001),
  withdrawalThreshold: real("withdrawal_threshold").default(0.001),
  balance: real("balance").default(0),
  ethBalance: real("eth_balance").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const miningPools = pgTable("mining_pools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  port: integer("port").notNull(),
  isActive: boolean("is_active").default(false),
  userId: integer("user_id").references(() => users.id),
});

export const miningStats = pgTable("mining_stats", {
  id: serial("id").primaryKey(),
  hashrate: real("hashrate").notNull(),
  power: real("power").notNull(),
  temperature: real("temperature"),
  earnings: real("earnings").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
  userId: integer("user_id").references(() => users.id),
});

export const miningHardware = pgTable("mining_hardware", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'cpu' | 'gpu'
  hashrate: real("hashrate").notNull(),
  power: real("power").notNull(),
  temperature: real("temperature"),
  isActive: boolean("is_active").default(false),
  userId: integer("user_id").references(() => users.id),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  status: text("status").notNull(), // 'success' | 'warning' | 'error'
  timestamp: timestamp("timestamp").defaultNow(),
  userId: integer("user_id").references(() => users.id),
});

export const automaticPayouts = pgTable("automatic_payouts", {
  id: serial("id").primaryKey(),
  amount: real("amount").notNull(),
  address: text("address").notNull(),
  status: text("status").notNull(), // 'pending' | 'processing' | 'completed' | 'failed'
  transactionId: text("transaction_id"),
  timestamp: timestamp("timestamp").defaultNow(),
  userId: integer("user_id").references(() => users.id),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMiningPoolSchema = createInsertSchema(miningPools).omit({
  id: true,
});

export const insertMiningStatsSchema = createInsertSchema(miningStats).omit({
  id: true,
  timestamp: true,
});

export const insertMiningHardwareSchema = createInsertSchema(miningHardware).omit({
  id: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true,
});

export const insertAutomaticPayoutSchema = createInsertSchema(automaticPayouts).omit({
  id: true,
  timestamp: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MiningPool = typeof miningPools.$inferSelect;
export type InsertMiningPool = z.infer<typeof insertMiningPoolSchema>;
export type MiningStats = typeof miningStats.$inferSelect;
export type InsertMiningStats = z.infer<typeof insertMiningStatsSchema>;
export type MiningHardware = typeof miningHardware.$inferSelect;
export type InsertMiningHardware = z.infer<typeof insertMiningHardwareSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type AutomaticPayout = typeof automaticPayouts.$inferSelect;
export type InsertAutomaticPayout = z.infer<typeof insertAutomaticPayoutSchema>;
