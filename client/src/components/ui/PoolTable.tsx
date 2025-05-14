import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { switchPool, deletePool } from '@/lib/miningClient';
import { useToast } from '@/hooks/use-toast';
import { formatHashRate, timeAgo } from '@/lib/utils';
import { Search, Zap, Activity, Server } from 'lucide-react';

interface Pool {
  id: number;
  name: string;
  url: string;
  fee: number;
  status: string;
  lastBlockFound: string | null;
  
  // Dual mining related properties
  isDualMining?: boolean;
  isPrimary?: boolean;
  allocation?: number;
}

interface PoolTableProps {
  pools: Pool[];
  hashRate: number;
  className?: string;
}

export function PoolTable({ pools, hashRate, className }: PoolTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const getPoolIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('f2pool')) {
      return <Zap className="h-6 w-6 text-green-500" />;
    } else if (lowerName.includes('slush')) {
      return <Search className="h-6 w-6 text-blue-500" />;
    } else if (lowerName.includes('ant')) {
      return <Activity className="h-6 w-6 text-red-500" />;
    } else {
      return <Server className="h-6 w-6 text-indigo-500" />;
    }
  };
  
  const switchMutation = useMutation({
    mutationFn: switchPool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pools'] });
      toast({
        title: "Pool Switched",
        description: "Mining operations have been switched to the selected pool",
      });
    },
    onError: (error) => {
      toast({
        title: "Switch Failed",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: deletePool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pools'] });
      toast({
        title: "Pool Removed",
        description: "The mining pool has been removed from configuration",
      });
    },
    onError: (error) => {
      toast({
        title: "Remove Failed",
        description: String(error),
        variant: "destructive",
      });
    }
  });

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pool Name</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead>Hashrate Contribution</TableHead>
              <TableHead>Fees</TableHead>
              <TableHead>Last Block Found</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No mining pools configured
                </TableCell>
              </TableRow>
            ) : (
              pools.map((pool) => (
                <TableRow 
                  key={pool.id} 
                  className={`
                    ${pool.status === 'standby' ? 'bg-gray-50 dark:bg-gray-700 bg-opacity-50' : ''}
                    ${pool.isDualMining ? 'dual-mining-active' : ''}
                  `}
                >
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center">
                        {getPoolIcon(pool.name)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{pool.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {pool.status === 'active' && !pool.isDualMining ? 'Primary Connection' : 
                           pool.status === 'active' && pool.isDualMining && pool.isPrimary ? 'Primary (Dual Mining)' :
                           pool.status === 'active' && pool.isDualMining && !pool.isPrimary ? 'Secondary (Dual Mining)' :
                           'Backup Connection'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {pool.status === 'active' && !pool.isDualMining ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">
                        Connected
                      </span>
                    ) : pool.status === 'active' && pool.isDualMining ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100">
                        Dual Mining
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300">
                        Standby
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {pool.status === 'active' && !pool.isDualMining ? '100%' : 
                       pool.status === 'active' && pool.isDualMining && pool.isPrimary ? 
                       `${((pool.allocation || 0) * 100).toFixed(0)}%` : 
                       pool.status === 'active' && pool.isDualMining && !pool.isPrimary ? 
                       `${((pool.allocation || 0) * 100).toFixed(0)}%` : '0%'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {pool.status === 'active' && !pool.isDualMining ? 
                        formatHashRate(hashRate) : 
                        pool.status === 'active' && pool.isDualMining ? 
                        formatHashRate(hashRate * (pool.allocation || 0)) : 
                        '0.0 MH/s'}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                    {pool.fee}%
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                    {pool.lastBlockFound ? timeAgo(pool.lastBlockFound) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {pool.status !== 'active' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => switchMutation.mutate(pool.id)}
                        disabled={switchMutation.isPending}
                      >
                        Switch to this Pool
                      </Button>
                    ) : null}
                    
                    {pool.status !== 'active' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to remove this pool?')) {
                            deleteMutation.mutate(pool.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="ml-2"
                      >
                        Remove
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default PoolTable;
