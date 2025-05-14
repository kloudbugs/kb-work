/**
 * Hardware Wallet Verification Service
 * 
 * This service provides a simple security mechanism that verifies
 * sensitive operations (admin access, withdrawals, etc.) by detecting
 * if your hardware wallet is connected.
 */

interface HardwareWalletInfo {
  connected: boolean;
  deviceModel: string | null;
  firmwareVersion: string | null;
  path: string | null;
  lastDetected: Date;
}

export class HardwareWalletVerification {
  private static instance: HardwareWalletVerification;
  
  // In-memory cache of detected hardware wallets
  private detectedWallets: Map<string, HardwareWalletInfo> = new Map();
  
  // The trusted wallet ID (in a real implementation, this would be stored securely)
  private trustedWalletId: string = 'bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps';
  
  private constructor() {
    // Private constructor to enforce singleton pattern
    console.log('[HARDWARE] Hardware wallet verification service initialized');
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): HardwareWalletVerification {
    if (!HardwareWalletVerification.instance) {
      HardwareWalletVerification.instance = new HardwareWalletVerification();
    }
    return HardwareWalletVerification.instance;
  }
  
  /**
   * Register a hardware wallet detection
   * 
   * @param walletAddress - The Bitcoin address associated with the hardware wallet
   * @param deviceInfo - Information about the detected hardware wallet
   */
  public registerWalletDetection(
    walletAddress: string,
    deviceInfo: {
      deviceModel: string;
      firmwareVersion: string;
      path: string;
    }
  ): void {
    this.detectedWallets.set(walletAddress, {
      connected: true,
      deviceModel: deviceInfo.deviceModel,
      firmwareVersion: deviceInfo.firmwareVersion,
      path: deviceInfo.path,
      lastDetected: new Date()
    });
    
    console.log(`[HARDWARE] Registered hardware wallet detection for ${walletAddress}`);
  }
  
  /**
   * Unregister a hardware wallet detection
   * 
   * @param walletAddress - The Bitcoin address to unregister
   */
  public unregisterWalletDetection(walletAddress: string): void {
    if (this.detectedWallets.has(walletAddress)) {
      this.detectedWallets.delete(walletAddress);
      console.log(`[HARDWARE] Unregistered hardware wallet for ${walletAddress}`);
    }
  }
  
  /**
   * Check if the trusted hardware wallet is connected
   * 
   * @returns True if the trusted hardware wallet is connected
   */
  public isTrustedWalletConnected(): boolean {
    const walletInfo = this.detectedWallets.get(this.trustedWalletId);
    
    if (!walletInfo) {
      return false;
    }
    
    // Consider the wallet connected if it was detected in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return walletInfo.connected && walletInfo.lastDetected > fiveMinutesAgo;
  }
  
  /**
   * Simulate hardware wallet detection (for testing/demo purposes)
   * 
   * In a real implementation, this would use actual USB/WebUSB detection
   */
  public simulateWalletDetection(): void {
    this.registerWalletDetection(
      this.trustedWalletId,
      {
        deviceModel: 'Ledger Nano S',
        firmwareVersion: '2.1.0',
        path: 'm/84\'/0\'/0\'/0/0'
      }
    );
  }
  
  /**
   * Get details about the currently detected trusted wallet
   * 
   * @returns Information about the trusted wallet or null if not detected
   */
  public getTrustedWalletInfo(): HardwareWalletInfo | null {
    const walletInfo = this.detectedWallets.get(this.trustedWalletId);
    return walletInfo || null;
  }
  
  /**
   * Verify a sensitive operation by checking if the trusted wallet is connected
   * 
   * @param operationType - Type of operation being verified
   * @returns Result of verification attempt
   */
  public verifyOperation(
    operationType: 'admin_access' | 'withdrawal' | 'settings_change'
  ): {
    verified: boolean;
    message: string;
    walletInfo?: HardwareWalletInfo;
  } {
    const isConnected = this.isTrustedWalletConnected();
    
    if (!isConnected) {
      return {
        verified: false,
        message: `Hardware wallet verification failed for ${operationType}. Please connect your hardware wallet.`
      };
    }
    
    const walletInfo = this.getTrustedWalletInfo();
    
    return {
      verified: true,
      message: `Hardware wallet verification successful for ${operationType}`,
      walletInfo: walletInfo || undefined
    };
  }
}