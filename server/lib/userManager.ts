/**
 * User Manager
 * 
 * This file provides basic user management functionality.
 * SECURITY: No private keys or wallet scanning capabilities.
 */

// Basic user types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// In-memory user storage
const users: Map<string, User> = new Map();

// Get user by ID
export const getUserById = (id: string): User | undefined => {
  return users.get(id);
};

// Get user by username
export const getUserByUsername = (username: string): User | undefined => {
  for (const user of users.values()) {
    if (user.username === username) {
      return user;
    }
  }
  return undefined;
};

// Add or update user
export const updateUser = (user: User): User => {
  users.set(user.id, user);
  return user;
};

// Remove user
export const removeUser = (id: string): boolean => {
  return users.delete(id);
};

// Get all users
export const getAllUsers = (): User[] => {
  return Array.from(users.values());
};

console.log('[SECURITY] User manager initialized - No private keys or wallets');