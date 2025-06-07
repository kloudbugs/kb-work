import { TeraTokenReward } from './lib/teraTokenService';

export class MemStorage {
  private users: Map<number, any>;
  private payouts: any[];
  private teraTokenRewards: TeraTokenReward[];

  constructor() {
    this.users = new Map();
    this.payouts = [];
    this.teraTokenRewards = [];
  }

  // Existing methods
  async getUser(userId: number) {
    return this.users.get(userId);
  }

  async updateUser(userId: number, data: any) {
    const user = this.users.get(userId);
    if (user) {
      Object.assign(user, data);
    }
    return user;
  }

  async createPayout(data: any) {
    this.payouts.push(data);
    return data;
  }

  // New Tera token methods
  async createTeraTokenReward(reward: TeraTokenReward) {
    this.teraTokenRewards.push(reward);
    return reward;
  }

  async getTeraTokenRewards(userId: number): Promise<TeraTokenReward[]> {
    return this.teraTokenRewards.filter(reward => reward.userId === userId);
  }

  async getAllTeraTokenRewards(): Promise<TeraTokenReward[]> {
    return [...this.teraTokenRewards];
  }
}

export const storage = new MemStorage();
