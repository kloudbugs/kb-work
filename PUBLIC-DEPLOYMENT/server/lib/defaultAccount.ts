/**
 * Default Account
 * 
 * This module provides a default login account for development and testing.
 */

import bcrypt from 'bcryptjs';
import { UserRole } from '../../shared/schema';

// Default login credentials
export const DEFAULT_USERNAME = 'admin';
export const DEFAULT_PASSWORD = 'admin123';
export const DEFAULT_EMAIL = 'admin@example.com';

// Add a default user to the database when the server starts
export function createDefaultAccount(storage: any) {
  // Check if the default account exists
  const existingUser = storage.getUserByUsername(DEFAULT_USERNAME);
  
  if (!existingUser) {
    // Create the default user with admin privileges
    const defaultUser = {
      username: DEFAULT_USERNAME,
      email: DEFAULT_EMAIL,
      passwordHash: bcrypt.hashSync(DEFAULT_PASSWORD, 10),
      role: 'ADMIN' as UserRole,
      hardwareWalletAddress: 'bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps',
      // Add necessary subscription
      subscriptionActive: true
    };
    
    // Add the user and log it
    storage.createUser(defaultUser);
    console.log(`Default account created: ${DEFAULT_USERNAME} (password: ${DEFAULT_PASSWORD})`);
    
    // Add a subscription for this user
    const userId = storage.getUserByUsername(DEFAULT_USERNAME)?.id;
    if (userId) {
      storage.addSubscription({
        userId,
        planId: 1,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year subscription
        status: 'ACTIVE',
        autoRenew: true
      });
      console.log(`Added active subscription for default account`);
    }
  }
}