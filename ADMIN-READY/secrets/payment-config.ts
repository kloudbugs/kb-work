/**
 * ADMIN-READY - Payment Configuration
 * 
 * This file contains the payment address configuration template for the platform.
 * It is designed to be updated with your payment address when you set up the system.
 * 
 * SECURITY NOTICE: Once configured with actual payment addresses, this file
 * contains sensitive payment information and should never be exposed in public deployments.
 */

interface PaymentConfiguration {
  // Main payment address for all platform transactions
  primaryBitcoinAddress: string;
  
  // Payment addresses for different platform services
  serviceAddresses: {
    miningRewards: string;
    subscriptionPayments: string;
    tokenPurchases: string;
    donations: string;
  };
  
  // Options for payment processing
  paymentOptions: {
    minimumConfirmations: number;
    automaticPayoutThreshold: number;
    allowManualPayout: boolean;
    payoutFeeLevel: 'low' | 'medium' | 'high';
  };
}

/**
 * IMPORTANT: This is a template for payment configuration
 * Update these addresses with your own Bitcoin addresses before using
 */
export const paymentConfig: PaymentConfiguration = {
  // Primary Bitcoin address for platform funds - UPDATE THIS WITH YOUR ADDRESS
  primaryBitcoinAddress: "",
  
  // Service-specific payment addresses - UPDATE THESE WITH YOUR ADDRESSES
  serviceAddresses: {
    miningRewards: "",
    subscriptionPayments: "",
    tokenPurchases: "",
    donations: ""
  },
  
  // Payment processing configuration
  paymentOptions: {
    minimumConfirmations: 3,
    automaticPayoutThreshold: 0.01, // BTC
    allowManualPayout: true,
    payoutFeeLevel: 'medium'
  }
};

/**
 * Validate that a payment is being sent to an authorized address
 * This helps prevent unauthorized changes to payment destinations
 */
export function validatePaymentAddress(address: string): boolean {
  // Check if any address is configured
  if (!paymentConfig.primaryBitcoinAddress) {
    console.warn("No primary Bitcoin address configured");
    return false;
  }
  
  // List of all authorized payment addresses
  const authorizedAddresses = [
    paymentConfig.primaryBitcoinAddress,
    ...Object.values(paymentConfig.serviceAddresses).filter(a => a)
  ];
  
  return authorizedAddresses.includes(address);
}

/**
 * Get payment address for a specific service type
 */
export function getPaymentAddress(serviceType: keyof typeof paymentConfig.serviceAddresses): string {
  const address = paymentConfig.serviceAddresses[serviceType];
  
  if (!address) {
    console.warn(`No address configured for service: ${serviceType}`);
    return paymentConfig.primaryBitcoinAddress || "";
  }
  
  return address;
}

/**
 * SECURITY NOTICE:
 * This function should ONLY be used in the actual transaction signing process
 * and should NEVER be exposed through public APIs.
 */
export function getPrimaryPaymentAddress(): string {
  // Check if address is configured
  if (!paymentConfig.primaryBitcoinAddress) {
    console.warn("No primary payment address configured");
    return "";
  }
  
  // Log access to primary payment address for security auditing
  console.log(`[SECURITY] Primary payment address accessed at ${new Date().toISOString()}`);
  return paymentConfig.primaryBitcoinAddress;
}

/**
 * Initialize payment configuration with your addresses
 * @param primaryAddress Your main Bitcoin address
 * @param useMainAddressForAll If true, uses the primary address for all services
 */
export function initializePaymentConfig(primaryAddress: string, useMainAddressForAll: boolean = true): void {
  // Update primary address
  paymentConfig.primaryBitcoinAddress = primaryAddress;
  
  // If using main address for all services
  if (useMainAddressForAll) {
    paymentConfig.serviceAddresses = {
      miningRewards: primaryAddress,
      subscriptionPayments: primaryAddress,
      tokenPurchases: primaryAddress,
      donations: primaryAddress
    };
  }
  
  console.log(`Payment configuration initialized with address: ${primaryAddress}`);
}