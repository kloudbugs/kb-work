import { Router, Request, Response } from 'express';
import { z } from 'zod';

// Initialize the router
const router = Router();

// MemStorage database for registrations (in a real app, this would connect to the database)
const pendingRegistrations: any[] = [];
const approvedUsers: any[] = [];
const deniedRegistrations: any[] = [];

// Admin middleware (ensure only admins can access these routes)
function requireAdmin(req: Request, res: Response, next: Function) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  
  return res.status(403).json({ message: 'Admin access required' });
}

// GET /api/admin/pending-registrations - Get all pending registrations
router.get('/pending-registrations', requireAdmin, (req: Request, res: Response) => {
  console.log('Admin fetching pending registrations');
  
  // Return all registrations, sorted by date (newest first)
  const allRegistrations = [
    ...pendingRegistrations.map(reg => ({ ...reg, status: 'pending' })),
    ...approvedUsers.map(user => ({ ...user, status: 'approved' })),
    ...deniedRegistrations.map(reg => ({ ...reg, status: 'denied' }))
  ].sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
  
  return res.json(allRegistrations);
});

// SYSTEM CONFIGURATION
const APPROVAL_SYSTEM_ENABLED = false; // Set to true to enable the approval system

// POST /api/admin/approve-user/:id - Approve a user registration
router.post('/approve-user/:id', requireAdmin, (req: Request, res: Response) => {
  if (!APPROVAL_SYSTEM_ENABLED) {
    console.log('User approval attempt blocked - system currently disabled');
    return res.status(503).json({
      success: false,
      message: 'User approval system is currently disabled'
    });
  }

  const userId = req.params.id;
  const registrationIndex = pendingRegistrations.findIndex(reg => reg.id === userId);
  
  if (registrationIndex === -1) {
    return res.status(404).json({ message: 'Registration not found' });
  }
  
  // Move registration from pending to approved
  const registration = pendingRegistrations[registrationIndex];
  approvedUsers.push({
    ...registration,
    isApproved: true,
    approvedAt: new Date().toISOString(),
    approvedBy: req.session?.username || 'admin'
  });
  
  // Remove from pending
  pendingRegistrations.splice(registrationIndex, 1);
  
  console.log(`Admin approved user registration: ${registration.username} (${registration.email})`);
  
  // In a real app, this would send an email notification to the user
  
  return res.json({ 
    success: true,
    message: 'User registration approved successfully'
  });
});

// POST /api/admin/deny-user/:id - Deny a user registration
router.post('/deny-user/:id', requireAdmin, (req: Request, res: Response) => {
  if (!APPROVAL_SYSTEM_ENABLED) {
    console.log('User denial attempt blocked - system currently disabled');
    return res.status(503).json({
      success: false,
      message: 'User approval system is currently disabled'
    });
  }
  
  const userId = req.params.id;
  const registrationIndex = pendingRegistrations.findIndex(reg => reg.id === userId);
  
  if (registrationIndex === -1) {
    return res.status(404).json({ message: 'Registration not found' });
  }
  
  // Move registration from pending to denied
  const registration = pendingRegistrations[registrationIndex];
  deniedRegistrations.push({
    ...registration,
    isDenied: true,
    deniedAt: new Date().toISOString(),
    deniedBy: req.session?.username || 'admin'
  });
  
  // Remove from pending
  pendingRegistrations.splice(registrationIndex, 1);
  
  console.log(`Admin denied user registration: ${registration.username} (${registration.email})`);
  
  // In a real app, this would send an email notification to the user
  
  return res.json({ 
    success: true,
    message: 'User registration denied successfully'
  });
});

export default router;