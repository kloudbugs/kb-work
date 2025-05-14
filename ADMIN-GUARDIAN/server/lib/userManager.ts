/**
 * User Manager
 * 
 * Provides utility functions for WebSocket server to access user information
 */
import { storage } from '../storage';

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<any | null> {
  try {
    const user = await storage.getUser(parseInt(userId, 10));
    if (!user) {
      console.log(`User not found: ${userId}`);
      return null;
    }
    
    return {
      id: user.id,
      username: user.username,
      role: user.role
    };
  } catch (error) {
    console.error(`Error getting user ${userId}:`, error);
    return null;
  }
}