import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle, ExternalLink } from 'lucide-react';

// Define payout interface
interface Payout {
  id: number;
  userId: number;
  amount: string | number;
  txHash: string | null;
  walletAddress: string;
  timestamp: string | Date;
  status: string;
  sourceAddress?: string;
  destinationAddress?: string;
  estimatedCompletionTime?: string | Date;
}

interface WithdrawalHistoryProps {
  payouts: Payout[];
  isLoading: boolean;
}

export function WithdrawalHistory({ payouts, isLoading }: WithdrawalHistoryProps) {
  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-green-900/30 text-green-400 text-xs">
            <Check className="h-3 w-3" />
            <span>Completed</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-yellow-900/30 text-yellow-400 text-xs">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs">
            <Clock className="h-3 w-3" />
            <span>Processing</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-red-900/30 text-red-400 text-xs">
            <AlertCircle className="h-3 w-3" />
            <span>Failed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-900/30 text-gray-400 text-xs">
            <span>{status}</span>
          </div>
        );
    }
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp: string | Date) => {
    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Function to truncate string with ellipsis
  const truncate = (str: string, maxLength: number = 12) => {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return `${str.substring(0, maxLength / 2)}...${str.substring(str.length - maxLength / 2)}`;
  };

  // Function to generate block explorer link
  const getBlockExplorerLink = (txHash: string) => {
    return `https://www.blockchain.com/explorer/transactions/btc/${txHash}`;
  };

  return (
    <div className="bg-black/70 backdrop-blur-lg rounded-md p-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-cyan-400 mb-1">Withdrawal History</h2>
        <p className="text-gray-400 text-sm">Track your recent withdrawal requests and their status</p>
      </div>
      
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-800">
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Amount</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton loading state
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`} className="border-b border-gray-800">
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                </TableRow>
              ))
            ) : payouts.length > 0 ? (
              // Actual data
              payouts.map((payout, index) => (
                <motion.tr 
                  key={payout.id || `payout-${index}`}
                  className="border-b border-gray-800 hover:bg-gray-900/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell className="text-gray-300 text-sm">
                    {formatTimestamp(payout.timestamp)}
                  </TableCell>
                  <TableCell className="font-mono text-cyan-300 text-sm">
                    {typeof payout.amount === 'string' ? payout.amount : payout.amount.toFixed(8)} BTC
                  </TableCell>
                  <TableCell>
                    {renderStatusBadge(payout.status)}
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm">
                    {payout.txHash ? (
                      <a 
                        href={getBlockExplorerLink(payout.txHash)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        <span>{truncate(payout.txHash, 16)}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              // No data state
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  <p>No withdrawal records found</p>
                  <p className="text-sm mt-1">Your completed and pending withdrawals will appear here</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Additional information section */}
      <div className="mt-4 text-xs text-gray-500 border-t border-gray-800 pt-4">
        <ul className="space-y-1">
          <li>• Withdrawal requests are processed within 24-48 hours.</li>
          <li>• The minimum withdrawal amount is 0.0005 BTC.</li>
          <li>• Transaction IDs are provided once the withdrawal has been processed.</li>
        </ul>
      </div>
    </div>
  );
}