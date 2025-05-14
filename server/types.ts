/**
 * Custom type definitions for the application
 */

import session from "express-session";

// Extend Express session with our custom properties
declare module "express-session" {
  interface SessionData {
    userId?: string | number;
    isAdmin?: boolean;
    hasActiveSubscription?: boolean;
    walletAddress?: string;
    asicConfigured?: boolean;
    ledgerConnected?: boolean;
    twoFactorEnabled?: boolean;
    twoFactorAuthenticated?: boolean;
    needsTwoFactor?: boolean;
    tempLoginCompleted?: boolean;
  }
}

// User roles
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}