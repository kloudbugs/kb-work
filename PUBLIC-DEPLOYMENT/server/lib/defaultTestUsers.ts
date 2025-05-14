/**
 * Default Test Users
 * 
 * This module provides default test users for development and testing.
 * In production, these would be replaced with actual user accounts.
 */

import bcrypt from 'bcryptjs';
import { UserRole } from '../../shared/schema';

export interface TestUser {
  id: string;
  username: string;
  email: string;
  password: string; // Plain text for testing
  passwordHash: string;
  role: UserRole;
  hardwareWalletAddress: string;
  hasActiveSubscription: boolean;
}

export const defaultTestUsers: TestUser[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123', // Plain text for easy login during testing
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'ADMIN',
    hardwareWalletAddress: 'bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps',
    hasActiveSubscription: true
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: 'user123', // Plain text for easy login during testing
    passwordHash: bcrypt.hashSync('user123', 10),
    role: 'USER',
    hardwareWalletAddress: 'bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps',
    hasActiveSubscription: true
  },
  {
    id: '3',
    username: 'test',
    email: 'test@example.com',
    password: 'test123', // Plain text for easy login during testing
    passwordHash: bcrypt.hashSync('test123', 10), 
    role: 'USER',
    hardwareWalletAddress: 'bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps',
    hasActiveSubscription: false
  }
];

export function getTestUserById(id: string): TestUser | undefined {
  return defaultTestUsers.find(user => user.id === id);
}

export function getTestUserByUsername(username: string): TestUser | undefined {
  return defaultTestUsers.find(user => user.username === username);
}

export function getTestUserByEmail(email: string): TestUser | undefined {
  return defaultTestUsers.find(user => user.email === email);
}