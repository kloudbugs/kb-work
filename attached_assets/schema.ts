import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const miningSubscriptions = pgTable("mining_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  email: text("email").notNull(),
  status: text("status").notNull().default("pending"), // pending, active, suspended, cancelled
  paymentId: text("payment_id"), // Stripe payment or subscription ID
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  tier: text("tier").notNull().default("basic"), // basic, premium, enterprise
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const miningCredentials = pgTable("mining_credentials", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").references(() => miningSubscriptions.id),
  username: text("mining_username").notNull(),
  password: text("mining_password").notNull(),
  platformUrl: text("platform_url").notNull(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  lastUsed: timestamp("last_used"),
  status: text("status").notNull().default("active"), // active, revoked
  emailSent: boolean("email_sent").default(false),
  emailSentAt: timestamp("email_sent_at"),
  notes: text("notes"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  isAdmin: true,
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
  name: true,
});

export const insertMiningSubscriptionSchema = createInsertSchema(miningSubscriptions).pick({
  userId: true,
  email: true,
  status: true,
  paymentId: true,
  tier: true,
  endDate: true,
});

export const insertMiningCredentialSchema = createInsertSchema(miningCredentials).pick({
  subscriptionId: true,
  username: true,
  password: true,
  platformUrl: true,
  status: true,
  notes: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

export type InsertMiningSubscription = z.infer<typeof insertMiningSubscriptionSchema>;
export type MiningSubscription = typeof miningSubscriptions.$inferSelect;

export type InsertMiningCredential = z.infer<typeof insertMiningCredentialSchema>;
export type MiningCredential = typeof miningCredentials.$inferSelect;
