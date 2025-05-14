/**
 * Communication System for Satoshi Beans Mining Platform
 * 
 * This file defines the data structures for the platform-wide communication system,
 * including announcements, notifications, and messaging capabilities.
 */

import { z } from 'zod';

/**
 * Announcement Priority Levels
 */
export enum AnnouncementPriority {
  LOW = 'low',           // Informational updates
  MEDIUM = 'medium',     // Important notices
  HIGH = 'high',         // Critical information
  URGENT = 'urgent'      // Emergency notifications
}

/**
 * Announcement Types
 */
export enum AnnouncementType {
  GENERAL = 'general',               // General platform announcements
  MAINTENANCE = 'maintenance',       // Platform maintenance notices
  FEATURE = 'feature',               // New feature announcements
  SECURITY = 'security',             // Security-related announcements
  CIVIL_RIGHTS = 'civil_rights',     // Civil rights initiative announcements
  VOTING = 'voting',                 // Voting-related announcements
  FINANCIAL = 'financial',           // Financial/fee updates
  USER_APPROVAL = 'user_approval'    // User approval announcements
}

/**
 * Announcement Visibility
 */
export enum AnnouncementVisibility {
  ALL = 'all',               // Visible to all users
  ADMINS = 'admins',         // Visible only to admins
  MINERS = 'miners',         // Visible only to miners
  APPROVED_USERS = 'approved' // Visible only to approved users
}

/**
 * Platform Announcement Schema
 */
export const platformAnnouncementSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  contentHtml: z.string().optional(),
  type: z.nativeEnum(AnnouncementType),
  priority: z.nativeEnum(AnnouncementPriority).default(AnnouncementPriority.MEDIUM),
  visibility: z.nativeEnum(AnnouncementVisibility).default(AnnouncementVisibility.ALL),
  
  createdBy: z.string().uuid(), // Admin who created the announcement
  publishDate: z.date(),        // When to publish the announcement
  expiryDate: z.date().optional(), // When the announcement expires
  
  requiresAcknowledgment: z.boolean().default(false), // Whether users need to acknowledge
  
  // For civil rights initiatives
  initiativeId: z.string().uuid().optional(), // Related initiative if applicable
  voteUrl: z.string().optional(),            // Link to voting page if applicable
  
  // For maintenance announcements
  maintenanceStartTime: z.date().optional(),
  maintenanceEndTime: z.date().optional(),
  affectedServices: z.array(z.string()).optional(),
  
  attachments: z.array(z.string()).optional(), // URLs to attached files
  externalLinks: z.array(z.string()).optional(), // External reference links
  
  published: z.boolean().default(false), // Whether announcement is live
  showInBanner: z.boolean().default(false), // Whether to show in site banner
  displayOnLogin: z.boolean().default(false), // Whether to show on login
  
  created: z.date(),
  updated: z.date()
});

export type PlatformAnnouncement = z.infer<typeof platformAnnouncementSchema>;

/**
 * User Acknowledgment Schema
 * Tracks which users have acknowledged announcements
 */
export const userAcknowledgmentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  announcementId: z.string().uuid(),
  acknowledged: z.boolean().default(false),
  acknowledgedDate: z.date().optional(),
  seen: z.boolean().default(false),
  seenDate: z.date().optional()
});

export type UserAcknowledgment = z.infer<typeof userAcknowledgmentSchema>;

/**
 * Notification Types
 */
export enum NotificationType {
  ANNOUNCEMENT = 'announcement',       // Platform announcement
  INITIATIVE = 'initiative',          // Civil rights initiative
  VOTING = 'voting',                  // Voting reminder
  ACCOUNT = 'account',                // Account-related notifications
  SECURITY = 'security',              // Security alerts
  MINING = 'mining',                  // Mining-related notifications
  FINANCIAL = 'financial',            // Financial transactions
  ADMIN_ACTION = 'admin_action'       // Admin actions
}

/**
 * User Notification Schema
 */
export const userNotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  message: z.string(),
  type: z.nativeEnum(NotificationType),
  
  // Related items
  relatedId: z.string().uuid().optional(), // ID of related item
  relatedType: z.string().optional(),      // Type of related item
  
  // Status tracking
  read: z.boolean().default(false),
  readAt: z.date().optional(),
  actionRequired: z.boolean().default(false),
  actionTaken: z.boolean().default(false),
  actionUrl: z.string().optional(),
  
  // Links and references
  iconUrl: z.string().optional(),
  linkUrl: z.string().optional(),
  
  created: z.date(),
  expires: z.date().optional()
});

export type UserNotification = z.infer<typeof userNotificationSchema>;

/**
 * Message Thread Schema
 * For direct communication between users and admins
 */
export const messageThreadSchema = z.object({
  id: z.string().uuid(),
  subject: z.string(),
  participants: z.array(z.string().uuid()), // User IDs
  
  // Status
  open: z.boolean().default(true),
  lastMessageDate: z.date(),
  lastMessageBy: z.string().uuid(),
  
  // Admin communication flags
  isAdminThread: z.boolean().default(false),
  assignedToAdminId: z.string().uuid().optional(),
  
  created: z.date(),
  updated: z.date()
});

export type MessageThread = z.infer<typeof messageThreadSchema>;

/**
 * Message Schema
 * Individual messages within a thread
 */
export const messageSchema = z.object({
  id: z.string().uuid(),
  threadId: z.string().uuid(),
  senderId: z.string().uuid(),
  content: z.string(),
  
  // Read status tracking
  readBy: z.array(z.object({
    userId: z.string().uuid(),
    readAt: z.date()
  })).optional(),
  
  // Attachments and references
  attachments: z.array(z.string()).optional(),
  
  created: z.date()
});

export type Message = z.infer<typeof messageSchema>;

/**
 * Notification Settings Schema
 * User preferences for notifications
 */
export const notificationSettingsSchema = z.object({
  userId: z.string().uuid(),
  
  // Email notification preferences
  emailNotifications: z.boolean().default(true),
  emailDigestFrequency: z.enum(['instant', 'daily', 'weekly', 'never']).default('daily'),
  
  // Notification types to receive
  receiveAnnouncementNotifications: z.boolean().default(true),
  receiveInitiativeNotifications: z.boolean().default(true),
  receiveVotingNotifications: z.boolean().default(true),
  receiveAccountNotifications: z.boolean().default(true),
  receiveSecurityNotifications: z.boolean().default(true),
  receiveMiningNotifications: z.boolean().default(true),
  receiveFinancialNotifications: z.boolean().default(true),
  
  // Communication preferences
  allowDirectMessages: z.boolean().default(true),
  allowAdminMessages: z.boolean().default(true),
  
  created: z.date(),
  updated: z.date()
});

export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;

/**
 * Communication Stats Schema
 * Platform-wide communication statistics
 */
export const communicationStatsSchema = z.object({
  totalAnnouncements: z.number().default(0),
  totalNotificationsSent: z.number().default(0),
  totalThreadsCreated: z.number().default(0),
  totalMessagesSent: z.number().default(0),
  activeThreads: z.number().default(0),
  unreadAdminMessages: z.number().default(0),
  
  // Acknowledgment statistics
  pendingAcknowledgments: z.number().default(0),
  acknowledgmentComplianceRate: z.number().default(0),
  
  lastUpdated: z.date()
});

export type CommunicationStats = z.infer<typeof communicationStatsSchema>;