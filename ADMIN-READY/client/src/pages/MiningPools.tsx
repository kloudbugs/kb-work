import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PoolTable } from '@/components/ui/PoolTable';
import { DualMiningControl } from '@/components/ui/DualMiningControl';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getPools } from '@/lib/miningClient';
import { useMining } from '@/contexts/MiningContext';
import { PlusCircle } from 'lucide-react';
import { AddPoolDialog } from '@/components/dialogs/AddPoolDialog';

export default function MiningPools() {
  const [showAddPoolDialog, setShowAddPoolDialog] = useState(false);
  const { totalHashRate } = useMining();
  
  // Query for pools
  const { data: poolsData, isLoading } = useQuery({
    queryKey: ['/api/pools'],
  });
  
  const pools = poolsData?.pools || [];
  const isDualMiningActive = poolsData?.dualMining || false;
  const primaryPoolId = poolsData?.primaryPoolId || undefined;
  const secondaryPoolId = poolsData?.secondaryPoolId || undefined;
  const primaryAllocation = poolsData?.primaryAllocation || 0.7;

  return (
    <MainLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Mining Pools</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Configure and manage mining pool connections
          </p>
        </div>
        
        <Button 
          onClick={() => setShowAddPoolDialog(true)}
          className="flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Pool
        </Button>
      </div>
      
      {/* Dual Mining Control Section */}
      {pools.length >= 2 && (
        <DualMiningControl 
          pools={pools}
          isDualMiningActive={isDualMiningActive}
          primaryPoolId={primaryPoolId}
          secondaryPoolId={secondaryPoolId}
          primaryAllocation={primaryAllocation}
        />
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Mining Pool Configuration
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {isLoading 
                ? "Loading pools..." 
                : pools.length === 0 
                  ? "No mining pools configured yet" 
                  : isDualMiningActive
                    ? `Dual mining active: ${(primaryAllocation * 100).toFixed(0)}% / ${(100 - primaryAllocation * 100).toFixed(0)}% allocation`
                    : "Connected to top-performing mining pool"
              }
            </p>
            {isDualMiningActive && !isLoading && primaryPoolId && secondaryPoolId && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span className="inline-flex items-center">
                  <span className="w-2 h-2 rounded-full bg-primary mr-1"></span>
                  {pools.find((p: any) => p.id === primaryPoolId)?.name} ({(primaryAllocation * 100).toFixed(0)}%)
                </span>
                <span className="inline-block mx-1">+</span>
                <span className="inline-flex items-center">
                  <span className="w-2 h-2 rounded-full bg-secondary mr-1"></span>
                  {pools.find((p: any) => p.id === secondaryPoolId)?.name} ({(100 - primaryAllocation * 100).toFixed(0)}%)
                </span>
              </div>
            )}
          </div>
        </div>
        
        <PoolTable pools={pools} hashRate={totalHashRate} />
      </div>
      
      <AddPoolDialog 
        open={showAddPoolDialog} 
        onOpenChange={setShowAddPoolDialog} 
      />
    </MainLayout>
  );
}
