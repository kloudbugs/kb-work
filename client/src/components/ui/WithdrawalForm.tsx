import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Coins, CheckCircle, AlertTriangle, ArrowRightCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Define withdrawal form schema
const withdrawalSchema = z.object({
  amount: z.string()
    .refine(val => !isNaN(parseFloat(val)), {
      message: "Amount must be a valid number",
    })
    .refine(val => parseFloat(val) > 0, {
      message: "Amount must be greater than zero",
    }),
  walletAddress: z.string()
    .min(26, { message: "Bitcoin wallet address is too short" })
    .max(42, { message: "Bitcoin wallet address is too long" })
});

// Define props interface
interface WithdrawalFormProps {
  walletDetails: {
    user: {
      walletAddress: string;
      payoutThreshold: string;
      payoutSchedule: string;
      autoPayouts: boolean;
    };
    balance: number;
    balanceUSD: number;
    minimumBalance: number;
  };
}

export function WithdrawalForm({ walletDetails }: WithdrawalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawalStatus, setWithdrawalStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Initialize form
  const form = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: '',
      walletAddress: walletDetails.user.walletAddress || '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof withdrawalSchema>) => {
    // Check if balance is sufficient
    if (parseFloat(values.amount) > walletDetails.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    // Check if amount is greater than minimum balance
    if (parseFloat(values.amount) < walletDetails.minimumBalance) {
      toast({
        title: "Below Minimum Withdrawal",
        description: `Minimum withdrawal amount is ${walletDetails.minimumBalance} BTC`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest('/api/wallet/withdraw', {
        method: 'POST',
        body: JSON.stringify({
          amount: parseFloat(values.amount),
          destinationAddress: values.walletAddress,
        }),
      });

      if (response) {
        // Reset form
        form.reset({
          amount: '',
          walletAddress: values.walletAddress,
        });
        
        // Show success
        setWithdrawalStatus('success');
        toast({
          title: "Withdrawal Request Submitted",
          description: `${values.amount} BTC withdrawal request has been submitted`,
          variant: "default",
        });
        
        // Refetch wallet data
        queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
        queryClient.invalidateQueries({ queryKey: ['/api/payouts'] });
        
        // Reset status after a delay
        setTimeout(() => {
          setWithdrawalStatus('idle');
        }, 5000);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setWithdrawalStatus('error');
      
      toast({
        title: "Withdrawal Failed",
        description: error instanceof Error ? error.message : "There was an error processing your withdrawal",
        variant: "destructive",
      });
      
      // Reset status after a delay
      setTimeout(() => {
        setWithdrawalStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate max amount user can withdraw (considering the minimum balance)
  const maxWithdrawalAmount = Math.max(0, walletDetails.balance - walletDetails.minimumBalance).toFixed(8);

  // Handle "Max" button click
  const handleMaxAmount = () => {
    form.setValue('amount', maxWithdrawalAmount);
  };

  return (
    <div className="bg-black/70 backdrop-blur-lg rounded-md p-5">
      <div className="mb-4 flex items-center">
        <Coins className="w-5 h-5 mr-2 text-indigo-400" />
        <h2 className="text-xl font-semibold text-indigo-400">Withdrawal Request</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Available Balance Display */}
          <div className="bg-gray-900/50 p-3 rounded-md mb-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Available Balance:</span>
              <span className="text-indigo-300 font-mono">
                {walletDetails.balance.toFixed(8)} BTC
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">USD Value:</span>
              <span className="text-green-400">
                ${walletDetails.balanceUSD.toFixed(2)}
              </span>
            </div>
            
            {walletDetails.minimumBalance > 0 && (
              <div className="text-xs text-gray-500 mt-2 pb-1 border-t border-gray-800 pt-1">
                Min. Balance to Keep: {walletDetails.minimumBalance} BTC
              </div>
            )}
          </div>
          
          {/* Amount Field */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">
                  Amount (BTC)
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="0.00000000"
                      className="font-mono bg-gray-900/50 border-gray-700"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 py-0 h-7 text-xs bg-indigo-900/50 hover:bg-indigo-800"
                    onClick={handleMaxAmount}
                    disabled={isSubmitting}
                  >
                    Max
                  </Button>
                </div>
                <FormMessage />
                <div className="text-xs text-gray-500 mt-1">
                  Max Withdrawal: {maxWithdrawalAmount} BTC
                </div>
              </FormItem>
            )}
          />
          
          {/* Wallet Address Field */}
          <FormField
            control={form.control}
            name="walletAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">
                  Destination Bitcoin Address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter Bitcoin wallet address"
                    className="font-mono text-xs bg-gray-900/50 border-gray-700"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Warnings and Info */}
          <div className="bg-yellow-900/20 border border-yellow-900/30 rounded p-3 text-yellow-500 text-xs flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Important:</p>
              <p>Withdrawals are processed within 24-48 hours. Ensure your wallet address is correct as transactions cannot be reversed.</p>
            </div>
          </div>
          
          {/* Status Message */}
          {withdrawalStatus === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-900/20 border border-green-900/30 rounded p-3 text-green-500 text-xs flex items-start space-x-2"
            >
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Withdrawal Request Submitted</p>
                <p>Your withdrawal request has been successfully submitted for processing.</p>
              </div>
            </motion.div>
          )}
          
          {withdrawalStatus === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-900/30 rounded p-3 text-red-500 text-xs flex items-start space-x-2"
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Withdrawal Request Failed</p>
                <p>There was an error processing your withdrawal request. Please try again.</p>
              </div>
            </motion.div>
          )}
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ArrowRightCircle className="h-4 w-4" />
                <span>Request Withdrawal</span>
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}