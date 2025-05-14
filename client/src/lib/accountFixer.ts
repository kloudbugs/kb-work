import { apiRequest } from './queryClient';
import { queryClient } from './queryClient';
import { toast } from '@/hooks/use-toast';

/**
 * This is a one-time fix utility to ensure admin account has the mining balance
 * Delete this file after use.
 */
export async function fixAccounts() {
  try {
    // Call the API endpoint to fix accounts
    const response = await apiRequest('POST', '/api/admin/fix-accounts');
    const result = await response.json();
    
    if (result.success) {
      // Show success message
      toast({
        title: "Account Fixed",
        description: `Your balance has been updated: ${(result.adminBalance / 100000000).toFixed(8)} BTC`,
        variant: "default",
      });
      
      // Invalidate relevant queries to force refresh
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      
      return true;
    } else {
      toast({
        title: "Failed to Fix Account",
        description: result.message || "An error occurred",
        variant: "destructive",
      });
      return false;
    }
  } catch (error) {
    console.error('Error fixing accounts:', error);
    toast({
      title: "Error",
      description: "Failed to fix accounts. See console for details.",
      variant: "destructive",
    });
    return false;
  }
}

/**
 * Fix balance by adding a significant amount for testing withdrawal
 */
export async function fixBalance() {
  try {
    // Call the API endpoint to fix balance - adds 0.002 BTC (200,000 satoshis)
    const response = await apiRequest('POST', '/api/admin/fix-balance', {
      userId: 1,
      reason: "Testing withdrawal functionality"
    });
    const result = await response.json();
    
    if (result.success) {
      // Show success message
      toast({
        title: "Balance Fixed",
        description: `Added ${((result.compensationAmount || 50000) / 100000000).toFixed(8)} BTC to your wallet for testing`,
        variant: "default",
      });
      
      // Invalidate relevant queries to force refresh
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      
      return true;
    } else {
      toast({
        title: "Failed to Fix Balance",
        description: result.message || "An error occurred",
        variant: "destructive",
      });
      return false;
    }
  } catch (error) {
    console.error('Error fixing balance:', error);
    toast({
      title: "Error",
      description: "Failed to fix balance. See console for details.",
      variant: "destructive",
    });
    return false;
  }
}