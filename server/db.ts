/**
 * Database Connection
 * 
 * This file provides database connection functionality.
 */

export function getDb() {
  // Return a simple in-memory database instance
  return {
    query: async (sql: string, params: any[] = []) => {
      console.log(`[DB] Mock query: ${sql}`, params);
      return { rows: [] };
    }
  };
}