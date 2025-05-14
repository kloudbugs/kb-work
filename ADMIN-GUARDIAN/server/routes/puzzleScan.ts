/**
 * Puzzle Scan Routes
 * 
 * API endpoints for managing Bitcoin puzzle address scanning
 * and connections to the hardware wallet.
 */

import { Router, Request, Response } from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { HARDWARE_WALLET_ADDRESS } from '../lib/hardwareWalletEnforcer';

const execAsync = promisify(exec);
const router = Router();

// Constants
const PUZZLE_CONNECTION_FILE = path.join(process.cwd(), 'puzzles-connection.json');
const SCAN_RESULTS_FILE = path.join(process.cwd(), 'bitcoin-puzzle-scan-results.json');

// Helper to check if file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Get puzzle connection status and data
router.get('/puzzle-connection', async (req: Request, res: Response) => {
  try {
    // Check if connection file exists
    if (await fileExists(PUZZLE_CONNECTION_FILE)) {
      const data = await fs.readFile(PUZZLE_CONNECTION_FILE, 'utf8');
      const connectionData = JSON.parse(data);
      
      // Include the hardware wallet address in case it's missing
      if (!connectionData.hardware_wallet_address) {
        connectionData.hardware_wallet_address = HARDWARE_WALLET_ADDRESS;
      }
      
      res.json(connectionData);
    } else {
      // Return default structure if file doesn't exist
      res.json({
        hardware_wallet_address: HARDWARE_WALLET_ADDRESS,
        total_addresses_scanned: 0,
        total_balance_found: 0,
        connected_addresses: [],
        verification: {
          timestamp: new Date().toISOString(),
          connected: false,
          enforced: true
        }
      });
    }
  } catch (error: any) {
    console.error('[API] Error getting puzzle connection:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get puzzle connection data'
    });
  }
});

// Start a new puzzle scan
router.post('/start-puzzle-scan', async (req: Request, res: Response) => {
  try {
    // Extract options from request
    const { autoRedirect = true } = req.body;
    
    console.log('[API] Starting Bitcoin puzzle scan with autoRedirect:', autoRedirect);
    
    // Execute the scan script in background
    execAsync('tsx scan-all-bitcoin-puzzles.ts > puzzle-scan.log 2>&1 &')
      .then(() => {
        console.log('[API] Bitcoin puzzle scan completed');
      })
      .catch(err => {
        console.error('[API] Error during Bitcoin puzzle scan:', err);
      });
    
    // Immediately return success since scan runs in background
    res.json({
      success: true,
      message: 'Puzzle scan started in the background',
      scanId: Date.now().toString()
    });
  } catch (error: any) {
    console.error('[API] Error starting puzzle scan:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to start puzzle scan'
    });
  }
});

// Get scan status
router.get('/puzzle-scan-status', async (req: Request, res: Response) => {
  try {
    // Check if scan is running
    const isRunning = await checkIfScanIsRunning();
    
    // If scan is complete and results file exists, return results summary
    if (!isRunning && await fileExists(SCAN_RESULTS_FILE)) {
      const data = await fs.readFile(SCAN_RESULTS_FILE, 'utf8');
      const results = JSON.parse(data);
      
      // Calculate summary
      const addressesWithBalance = results.filter((addr: any) => addr.balance > 0);
      const totalBalance = addressesWithBalance.reduce(
        (sum: number, addr: any) => sum + addr.balance, 
        0
      );
      
      res.json({
        success: true,
        status: 'complete',
        lastScanTime: results.length > 0 ? results[results.length - 1].scanTime : null,
        totalScanned: results.length,
        addressesWithBalance: addressesWithBalance.length,
        totalBalance
      });
    } 
    // If scan is running, just return status
    else if (isRunning) {
      res.json({
        success: true,
        status: 'running'
      });
    } 
    // If no scan has been run yet
    else {
      res.json({
        success: true,
        status: 'none',
        message: 'No scan has been run yet'
      });
    }
  } catch (error: any) {
    console.error('[API] Error getting puzzle scan status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get puzzle scan status'
    });
  }
});

// Redirect funds from puzzle addresses to hardware wallet
router.post('/redirect-puzzle-funds', async (req: Request, res: Response) => {
  try {
    // Always use the hardware wallet address as destination
    const destinationAddress = HARDWARE_WALLET_ADDRESS;
    
    console.log('[API] Setting up redirection to hardware wallet:', destinationAddress);
    
    // Check if connection file exists
    if (await fileExists(PUZZLE_CONNECTION_FILE)) {
      // Load current connection data
      const data = await fs.readFile(PUZZLE_CONNECTION_FILE, 'utf8');
      const connectionData = JSON.parse(data);
      
      // Update verification
      connectionData.hardware_wallet_address = destinationAddress;
      connectionData.verification = {
        timestamp: new Date().toISOString(),
        connected: true,
        enforced: true
      };
      
      // Save updated connection data
      await fs.writeFile(PUZZLE_CONNECTION_FILE, JSON.stringify(connectionData, null, 2));
      
      res.json({
        success: true,
        message: 'Funds will be redirected to hardware wallet',
        destinationAddress
      });
    } else {
      // No connection established yet
      res.status(400).json({
        success: false,
        message: 'No puzzle addresses connected yet. Run a scan first.'
      });
    }
  } catch (error: any) {
    console.error('[API] Error setting up redirection:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to set up redirection'
    });
  }
});

// Helper to check if scan process is running
async function checkIfScanIsRunning(): Promise<boolean> {
  try {
    const { stdout } = await execAsync('ps aux | grep "scan-all-bitcoin-puzzles.ts" | grep -v grep');
    return stdout.trim().length > 0;
  } catch (error) {
    return false;
  }
}

export default router;