/**
 * Communications API Routes
 * 
 * These routes handle project updates, announcements, and other communications
 * with users about the civil rights movement and platform updates.
 */

import express from 'express';
import { storage } from '../storage';
import { v4 as uuidv4 } from 'uuid';
import { isAdmin, isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Get all project updates (public)
router.get('/project-updates', async (req, res) => {
  try {
    const updates = await storage.getProjectUpdates();
    res.json(updates);
  } catch (error) {
    console.error('Error fetching project updates:', error);
    res.status(500).json({ message: 'Error fetching project updates' });
  }
});

// Get specific project update by ID (public)
router.get('/project-updates/:id', async (req, res) => {
  try {
    const update = await storage.getProjectUpdate(req.params.id);
    if (!update) {
      return res.status(404).json({ message: 'Project update not found' });
    }
    res.json(update);
  } catch (error) {
    console.error('Error fetching project update:', error);
    res.status(500).json({ message: 'Error fetching project update' });
  }
});

// Create a new project update (admin only)
router.post('/project-updates', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newUpdate = {
      id: uuidv4(),
      title,
      content,
      category,
      imageUrl,
      date: new Date().toISOString(),
      contributionTotal: req.body.contributionTotal || 0,
      contributorsCount: req.body.contributorsCount || 0,
      createdBy: req.session.user.id
    };
    
    await storage.createProjectUpdate(newUpdate);
    
    // Create a notification for all users about this update
    const notification = {
      id: uuidv4(),
      title: `New ${category} Update: ${title}`,
      message: `There's a new update about our civil rights movement project.`,
      type: 'civil_rights',
      created: new Date(),
      actionRequired: false,
      actionUrl: `/project-updates/${newUpdate.id}`,
      read: false
    };
    
    await storage.createGlobalNotification(notification);
    
    res.status(201).json(newUpdate);
  } catch (error) {
    console.error('Error creating project update:', error);
    res.status(500).json({ message: 'Error creating project update' });
  }
});

// Update a project update (admin only)
router.put('/project-updates/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;
    const updateId = req.params.id;
    
    const existingUpdate = await storage.getProjectUpdate(updateId);
    if (!existingUpdate) {
      return res.status(404).json({ message: 'Project update not found' });
    }
    
    const updatedUpdate = {
      ...existingUpdate,
      title: title || existingUpdate.title,
      content: content || existingUpdate.content,
      category: category || existingUpdate.category,
      imageUrl: imageUrl || existingUpdate.imageUrl,
      contributionTotal: req.body.contributionTotal || existingUpdate.contributionTotal,
      contributorsCount: req.body.contributorsCount || existingUpdate.contributorsCount,
      updatedAt: new Date().toISOString()
    };
    
    await storage.updateProjectUpdate(updateId, updatedUpdate);
    
    res.json(updatedUpdate);
  } catch (error) {
    console.error('Error updating project update:', error);
    res.status(500).json({ message: 'Error updating project update' });
  }
});

// Delete a project update (admin only)
router.delete('/project-updates/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const updateId = req.params.id;
    
    const existingUpdate = await storage.getProjectUpdate(updateId);
    if (!existingUpdate) {
      return res.status(404).json({ message: 'Project update not found' });
    }
    
    await storage.deleteProjectUpdate(updateId);
    
    res.json({ message: 'Project update deleted successfully' });
  } catch (error) {
    console.error('Error deleting project update:', error);
    res.status(500).json({ message: 'Error deleting project update' });
  }
});

// Get movement fund stats (public)
router.get('/movement-fund/stats', async (req, res) => {
  try {
    const stats = await storage.getMovementFundStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching movement fund stats:', error);
    res.status(500).json({ message: 'Error fetching movement fund stats' });
  }
});

// Create a network-wide broadcast message (admin only)
router.post('/broadcasts', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { type, title, content, urgency, link, duration } = req.body;
    
    if (!title || !content || !type || !urgency) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newBroadcast = {
      id: uuidv4(),
      type,
      title,
      content,
      urgency,
      link,
      sentAt: new Date().toISOString(),
      duration: duration || '60', // Default to 1 minute
      active: true,
      createdBy: req.session.user.id
    };
    
    await storage.createBroadcast(newBroadcast);
    
    res.status(201).json(newBroadcast);
  } catch (error) {
    console.error('Error creating broadcast:', error);
    res.status(500).json({ message: 'Error creating broadcast' });
  }
});

// Get all active broadcasts
router.get('/broadcasts/active', async (req, res) => {
  try {
    const broadcasts = await storage.getActiveBroadcasts();
    res.json(broadcasts);
  } catch (error) {
    console.error('Error fetching active broadcasts:', error);
    res.status(500).json({ message: 'Error fetching active broadcasts' });
  }
});

// Toggle broadcast active status (admin only)
router.put('/broadcasts/:id/toggle', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const broadcastId = req.params.id;
    
    const existingBroadcast = await storage.getBroadcast(broadcastId);
    if (!existingBroadcast) {
      return res.status(404).json({ message: 'Broadcast not found' });
    }
    
    const updatedBroadcast = {
      ...existingBroadcast,
      active: !existingBroadcast.active
    };
    
    await storage.updateBroadcast(broadcastId, updatedBroadcast);
    
    res.json(updatedBroadcast);
  } catch (error) {
    console.error('Error toggling broadcast status:', error);
    res.status(500).json({ message: 'Error toggling broadcast status' });
  }
});

// Get recent broadcasts for admin dashboard
router.get('/broadcasts/recent', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const broadcasts = await storage.getRecentBroadcasts(10); // Get 10 most recent
    res.json(broadcasts);
  } catch (error) {
    console.error('Error fetching recent broadcasts:', error);
    res.status(500).json({ message: 'Error fetching recent broadcasts' });
  }
});

export default router;