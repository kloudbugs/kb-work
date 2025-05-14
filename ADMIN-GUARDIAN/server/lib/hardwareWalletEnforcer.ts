/**
 * Service that enforces and verifies hardware wallet addresses for admin users
 * This enhances security by ensuring admin withdrawals only go to verified hardware wallets
 */

// Export the secure hardware wallet address that should be used throughout the application
export const HARDWARE_WALLET_ADDRESS = 'bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps';
export class HardwareWalletEnforcer {
  private verifiedHardwareWallets: Map<string, string[]>;
  
  constructor() {
    this.verifiedHardwareWallets = new Map();
    
    // Initialize with the admin hardware wallet
    this.verifiedHardwareWallets.set('1', [
      'bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps' // Admin hardware wallet
    ]);
    
    console.log('Hardware wallet enforcer initialized with default admin address');
  }
  
  /**
   * Check if the given address is a verified hardware wallet for the specified user
   */
  isHardwareWalletAddress(address: string, userId: string = '1'): boolean {
    if (!this.verifiedHardwareWallets.has(userId)) {
      return false;
    }
    
    const userWallets = this.verifiedHardwareWallets.get(userId)!;
    return userWallets.includes(address);
  }
  
  /**
   * Add a verified hardware wallet for a user
   */
  addHardwareWallet(userId: string, address: string): void {
    if (!this.verifiedHardwareWallets.has(userId)) {
      this.verifiedHardwareWallets.set(userId, []);
    }
    
    const userWallets = this.verifiedHardwareWallets.get(userId)!;
    
    if (!userWallets.includes(address)) {
      userWallets.push(address);
      console.log(`Added hardware wallet ${address} for user ${userId}`);
    }
  }
  
  /**
   * Remove a hardware wallet for a user
   */
  removeHardwareWallet(userId: string, address: string): boolean {
    if (!this.verifiedHardwareWallets.has(userId)) {
      return false;
    }
    
    const userWallets = this.verifiedHardwareWallets.get(userId)!;
    const index = userWallets.indexOf(address);
    
    if (index !== -1) {
      userWallets.splice(index, 1);
      console.log(`Removed hardware wallet ${address} for user ${userId}`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Get all verified hardware wallets for a user
   */
  getHardwareWallets(userId: string): string[] {
    if (!this.verifiedHardwareWallets.has(userId)) {
      return [];
    }
    
    return [...this.verifiedHardwareWallets.get(userId)!];
  }
  
  /**
   * Enable or disable Ledger hardware wallet enforcement mode
   * When enabled, only verified Ledger addresses will be accepted for transactions
   */
  enableLedgerMode(enabled: boolean): void {
    console.log(`Ledger hardware wallet enforcement mode ${enabled ? 'enabled' : 'disabled'}`);
    // In a real implementation, this would change the enforcement behavior
    // For this demo, we're just logging the mode change
  }
  
  /**
   * Verify a hardware wallet address format
   * Note: This only checks the format, not if it's actually from a hardware device
   */
  isValidHardwareWalletFormat(address: string): boolean {
    // In a real implementation, this would have sophisticated checks for hardware wallet
    // address patterns (Ledger, Trezor, etc.)
    // For now, we'll just do a basic Bitcoin address format check
    
    // Regular expressions for different Bitcoin address formats
    const p2pkhRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/; // Legacy addresses start with 1 or 3
    const p2shRegex = /^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$/; // P2SH addresses start with 3
    const bech32Regex = /^(bc1)[a-z0-9]{8,87}$/; // Bech32 addresses start with bc1
    
    return p2pkhRegex.test(address) || p2shRegex.test(address) || bech32Regex.test(address);
  }
}