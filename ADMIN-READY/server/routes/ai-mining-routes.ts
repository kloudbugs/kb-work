/**
 * KLOUD BUGS MINING COMMAND CENTER - AI Mining Routes
 * 
 * This file contains API routes for the AI mining functionality, including
 * access to the TERA Guardian AI Mining Core and Cloud Miner.
 */

import { Router } from 'express';
import { 
  getAIMiningStatus, 
  getCloudMinerStatus, 
  getDeviceOptimization, 
  registerMiningDevice, 
  updateMiningDeviceState, 
  getTeraTokenGeneration,
  updateCloudMinerConfig,
  resetCloudMinerConfig,
  regenerateAccessKey
} from '../lib/miningController';

const router = Router();

// Get AI mining core status
router.get('/ai-mining/status', getAIMiningStatus);

// Get cloud miner status
router.get('/cloud-miner/status', getCloudMinerStatus);

// Get device optimization
router.get('/ai-mining/device/:deviceId/optimization', getDeviceOptimization);

// Register mining device
router.post('/ai-mining/device/register', registerMiningDevice);

// Update mining device state
router.post('/ai-mining/device/:deviceId/update', updateMiningDeviceState);

// Get TERA token generation rate
router.get('/tera-token/generation-rate', getTeraTokenGeneration);

// --- Admin/Owner Only Routes ---

// Update cloud miner configuration (ADMIN only)
router.post('/cloud-miner/config/update', updateCloudMinerConfig);

// Reset cloud miner configuration (OWNER only)
router.post('/cloud-miner/config/reset', resetCloudMinerConfig);

// Regenerate access key (OWNER only)
router.post('/cloud-miner/access-key/regenerate', regenerateAccessKey);

export default router;