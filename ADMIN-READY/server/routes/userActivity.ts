import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from '../storage';

// Define activity schemas
const activitySchema = z.object({
  userId: z.string().optional(), // Optional because we might track anonymous users
  sessionId: z.string(),
  action: z.string(),
  page: z.string().optional(),
  timestamp: z.date().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Create router
const router = Router();

/**
 * Record user activity
 * Authentication optional - will associate with user if logged in
 */
router.post('/users/activity', async (req: Request, res: Response) => {
  try {
    // Get user ID from session if available
    const userId = req.session?.userId;
    
    // Validate activity data
    const activityData = activitySchema.parse({
      ...req.body,
      userId: userId || req.body.userId,
      timestamp: new Date()
    });
    
    console.log(`[ACTIVITY] Recording activity: ${activityData.action} for ${userId ? `user ${userId}` : 'anonymous user'}`);
    
    // Store activity data
    try {
      // In a production app, we would store this in the database
      // For now, just log it
      console.log('[ACTIVITY] Activity recorded:', JSON.stringify(activityData));
      
      // We'll return success even if storage fails to avoid blocking the user experience
      return res.status(200).json({ 
        success: true,
        message: "Activity recorded successfully"
      });
    } catch (err) {
      console.error('[ACTIVITY] Error storing activity:', err);
      // Still return success to client to avoid blocking user experience
      return res.status(200).json({ 
        success: true,
        message: "Activity logging acknowledged"
      });
    }
  } catch (error) {
    console.error('[ACTIVITY] Error processing activity:', error);
    return res.status(400).json({ 
      success: false,
      message: "Invalid activity data"
    });
  }
});

/**
 * Get user activity history
 * Requires admin authentication
 */
router.get('/users/activity', async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    if (!req.session?.userId || req.session.isAdmin !== true) {
      return res.status(403).json({ message: "Administrator access required" });
    }
    
    // In a production app, we would retrieve this from the database
    // For now, just return an empty array
    return res.status(200).json({
      success: true,
      activities: []
    });
  } catch (error) {
    console.error('[ACTIVITY] Error retrieving activity log:', error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to retrieve activity log"
    });
  }
});

export const userActivityRoutes = router;