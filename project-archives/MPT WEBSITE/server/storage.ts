import { users, type User, type InsertUser, type InsertSubscriber, type Subscriber, subscribers } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscribers(): Promise<Subscriber[]>;
}

import { db } from "./db";
import { eq } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async addSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    try {
      const [subscriber] = await db
        .insert(subscribers)
        .values(insertSubscriber)
        .returning();
      return subscriber;
    } catch (error) {
      // Check if it's a unique constraint violation
      if (error instanceof Error && error.message.includes("duplicate key value")) {
        throw new Error("Email already registered");
      }
      throw error;
    }
  }

  async getSubscribers(): Promise<Subscriber[]> {
    return db.select().from(subscribers);
  }
}

export const storage = new DatabaseStorage();