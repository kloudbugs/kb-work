import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enableDualMining, disableDualMining } from '@/lib/miningClient';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { SplitSquareVertical, Zap, Power } from 'lucide-react';

interface Pool {
  id: number;
  name: string;
  status: string;
}

interface DualMiningControlProps {
  pools: Pool[];
  isDualMiningActive?: boolean;
  primaryAllocation?: number;
  primaryPoolId?: number;
  secondaryPoolId?: number;
}

export function DualMiningControl({ pools, isDualMiningActive = false, primaryAllocation = 0.7, primaryPoolId, secondaryPoolId }: DualMiningControlProps) {
  const [selectedPrimaryPoolId, setSelectedPrimaryPoolId] = useState<number | null>(primaryPoolId || null);
  const [selectedSecondaryPoolId, setSelectedSecondaryPoolId] = useState<number | null>(secondaryPoolId || null);
  const [allocation, setAllocation] = useState<number>(primaryAllocation * 100);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const availablePools = pools.filter(pool => pool.id !== selectedSecondaryPoolId);
  const availableSecondaryPools = pools.filter(pool => pool.id !== selectedPrimaryPoolId);
  
  const enableDualMiningMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPrimaryPoolId || !selectedSecondaryPoolId) {
        throw new Error('Please select both primary and secondary mining pools');
      }
      return enableDualMining(selectedPrimaryPoolId, selectedSecondaryPoolId, allocation / 100);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pools'] });
      toast({
        title: "Dual Mining Enabled",
        description: `Mining operations split between pools (${allocation.toFixed(0)}% / ${(100 - allocation).toFixed(0)}%)`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Enable Dual Mining",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const disableDualMiningMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPrimaryPoolId) {
        throw new Error('Please select a primary mining pool');
      }
      return disableDualMining(selectedPrimaryPoolId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pools'] });
      toast({
        title: "Dual Mining Disabled",
        description: "Mining operations are now focused on a single pool",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Disable Dual Mining",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <SplitSquareVertical className="h-5 w-5 mr-2" />
          Dual Mining Configuration
        </CardTitle>
        <CardDescription>
          Split your mining resources between multiple pools for optimal performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center">
                <Zap className="h-4 w-4 mr-1 text-primary" />
                Primary Mining Pool ({allocation.toFixed(0)}%)
              </label>
              <Select
                value={selectedPrimaryPoolId?.toString() || ""}
                onValueChange={(value) => setSelectedPrimaryPoolId(parseInt(value))}
                disabled={enableDualMiningMutation.isPending || disableDualMiningMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select primary pool" />
                </SelectTrigger>
                <SelectContent>
                  {availablePools.map(pool => (
                    <SelectItem key={pool.id} value={pool.id.toString()}>
                      {pool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center">
                <Power className="h-4 w-4 mr-1 text-secondary" />
                Secondary Mining Pool ({(100 - allocation).toFixed(0)}%)
              </label>
              <Select
                value={selectedSecondaryPoolId?.toString() || ""}
                onValueChange={(value) => setSelectedSecondaryPoolId(parseInt(value))}
                disabled={enableDualMiningMutation.isPending || disableDualMiningMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select secondary pool" />
                </SelectTrigger>
                <SelectContent>
                  {availableSecondaryPools.map(pool => (
                    <SelectItem key={pool.id} value={pool.id.toString()}>
                      {pool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Resource Allocation
            </label>
            <div className="px-2">
              <Slider
                value={[allocation]}
                onValueChange={(values) => setAllocation(values[0])}
                min={10}
                max={90}
                step={5}
                disabled={enableDualMiningMutation.isPending || disableDualMiningMutation.isPending}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Primary: {allocation.toFixed(0)}%</span>
                <span>Secondary: {(100 - allocation).toFixed(0)}%</span>
              </div>
              
              {/* Visual allocation indicator */}
              <div className="allocation-bar mt-4">
                <div 
                  className="allocation-primary"
                  style={{
                    width: `${allocation}%`,
                    background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%)'
                  }}
                ></div>
                <div 
                  className="allocation-secondary" 
                  style={{
                    width: `${100 - allocation}%`,
                    background: 'linear-gradient(270deg, var(--secondary) 0%, var(--secondary-light) 100%)'
                  }}
                ></div>
              </div>
              
              <div className="flex justify-between mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-xs">{selectedPrimaryPoolId ? 
                    pools.find(p => p.id === selectedPrimaryPoolId)?.name : 'Primary Pool'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{selectedSecondaryPoolId ? 
                    pools.find(p => p.id === selectedSecondaryPoolId)?.name : 'Secondary Pool'}</span>
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                </div>
              </div>
              
              {isDualMiningActive && primaryPoolId && secondaryPoolId && (
                <div className="mt-4 p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-sm">
                  <div className="font-medium">Current Dual Mining Setup:</div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>{pools.find(p => p.id === primaryPoolId)?.name}: {(primaryAllocation * 100).toFixed(0)}%</span>
                    <span>{pools.find(p => p.id === secondaryPoolId)?.name}: {(100 - primaryAllocation * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isDualMiningActive ? (
          <Button
            variant="outline"
            onClick={() => disableDualMiningMutation.mutate()}
            disabled={disableDualMiningMutation.isPending || !selectedPrimaryPoolId}
          >
            {disableDualMiningMutation.isPending ? 'Disabling...' : 'Disable Dual Mining'}
          </Button>
        ) : (
          <Button
            onClick={() => enableDualMiningMutation.mutate()}
            disabled={enableDualMiningMutation.isPending || !selectedPrimaryPoolId || !selectedSecondaryPoolId}
          >
            {enableDualMiningMutation.isPending ? 'Enabling...' : 'Enable Dual Mining'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default DualMiningControl;