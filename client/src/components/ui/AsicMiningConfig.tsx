import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Server, Download, HardDrive, PackageOpen, CoinsIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAsicTypes, generateAsicUsbConfig, configureAsicMining, getPools, generateMultiMinerUsbConfig, getWalletDetails } from '@/lib/miningClient';
import { useAuth } from '@/contexts/AuthContext';

// Type for pool data
interface Pool {
  id: number;
  name: string;
  url: string;
  fee: number;
  username: string;
  password?: string;
  status: string;
  priority: number;
  algorithm: string;
}

// Define supported Unmineable address formats
enum UnmineableFormat {
  KEY_WORKER = 'key_worker',
  BTC_ADDRESS = 'btc_address'
}

export function AsicMiningConfig() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedAsicType, setSelectedAsicType] = useState<string>('');
  const [selectedPoolId, setSelectedPoolId] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [selectedMiners, setSelectedMiners] = useState<string[]>([]);
  const [unifiedMode, setUnifiedMode] = useState<boolean>(false);
  const [unmineableFormat, setUnmineableFormat] = useState<UnmineableFormat>(UnmineableFormat.KEY_WORKER);
  
  // Fetch wallet details to get the user's wallet address
  const { data: walletData } = useQuery({
    queryKey: ['/api/wallet'],
    queryFn: getWalletDetails,
    // Only fetch if the user is logged in
    enabled: !!user
  });
  
  // Initialize wallet address from user data or wallet API
  useEffect(() => {
    if (user?.walletAddress) {
      setWalletAddress(user.walletAddress);
    } else if (walletData?.walletAddress) {
      setWalletAddress(walletData.walletAddress);
    }
  }, [user, walletData]);

  // Fetch ASIC miner types
  const { data: asicTypes, isLoading: isLoadingAsicTypes } = useQuery({
    queryKey: ['/api/mining/asic/types'],
    queryFn: getAsicTypes
  });

  // Fetch mining pools
  const { data: poolsData, isLoading: isLoadingPools } = useQuery({
    queryKey: ['/api/pools'],
    queryFn: getPools
  });

  // Configure ASIC mining mutation
  const configureAsicMutation = useMutation({
    mutationFn: (asicType: string) => configureAsicMining(asicType),
    onSuccess: () => {
      toast({
        title: 'ASIC Mining Configured',
        description: 'Your ASIC mining settings have been configured successfully.',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Configuration Failed',
        description: error.message || 'Could not configure ASIC mining.',
        variant: 'destructive',
      });
    }
  });

  // Generate USB configuration mutation
  const generateUsbConfigMutation = useMutation({
    mutationFn: (params: { asicType: string, poolId: number, walletAddress: string }) => 
      generateAsicUsbConfig(params.asicType, params.poolId, params.walletAddress),
    onSuccess: () => {
      toast({
        title: 'USB Configuration Generated',
        description: 'Your ASIC mining USB configuration has been generated. Check your downloads folder.',
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'USB Generation Failed',
        description: error.message || 'Could not generate USB configuration.',
        variant: 'destructive',
      });
    }
  });
  
  // Generate multi-miner USB configuration mutation
  const generateMultiMinerUsbMutation = useMutation({
    mutationFn: (params: { minerTypes: string[], poolId: number, walletAddress: string }) => 
      generateMultiMinerUsbConfig(params.minerTypes, params.poolId, params.walletAddress),
    onSuccess: () => {
      toast({
        title: 'Multi-Miner Package Generated',
        description: 'Your unified USB package with multiple ASIC miner firmware has been generated.',
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Multi-Miner Package Failed',
        description: error.message || 'Could not generate unified multi-miner package.',
        variant: 'destructive',
      });
    }
  });

  // Get pools array from the response
  const pools = poolsData?.pools || [];

  // Handle configuring ASIC mining
  const handleConfigureAsic = () => {
    if (!selectedAsicType) {
      toast({
        title: 'Selection Required',
        description: 'Please select an ASIC miner type.',
        variant: 'destructive',
      });
      return;
    }

    configureAsicMutation.mutate(selectedAsicType);
  };

  // Helper to format wallet address for Unmineable if needed
  const getFormattedWalletAddress = (poolId: string, address: string): string => {
    const selectedPool = pools.find((p: Pool) => p.id.toString() === poolId);
    
    // If Unmineable is selected, format according to selection
    if (selectedPool?.name?.toLowerCase().includes('unmineable')) {
      if (unmineableFormat === UnmineableFormat.BTC_ADDRESS) {
        return `BTC:${address}`;
      }
      // Otherwise, the key.worker format will be applied server-side
    }
    
    // Return the regular wallet address
    return address;
  };

  // Handle generating USB configuration for a single miner
  const handleGenerateUsbConfig = () => {
    if (!selectedAsicType || !selectedPoolId || !walletAddress) {
      toast({
        title: 'All Fields Required',
        description: 'Please fill in all fields to generate the USB configuration.',
        variant: 'destructive',
      });
      return;
    }

    // Format wallet address for Unmineable if needed
    const formattedWalletAddress = getFormattedWalletAddress(selectedPoolId, walletAddress);

    generateUsbConfigMutation.mutate({
      asicType: selectedAsicType,
      poolId: parseInt(selectedPoolId),
      walletAddress: formattedWalletAddress
    });
  };
  
  // Handle generating unified multi-miner USB configuration
  const handleGenerateMultiMinerUsb = () => {
    if (selectedMiners.length === 0 || !selectedPoolId || !walletAddress) {
      toast({
        title: 'All Fields Required',
        description: 'Please select at least one miner type and fill in all fields to generate the unified USB package.',
        variant: 'destructive',
      });
      return;
    }

    // Format wallet address for Unmineable if needed
    const formattedWalletAddress = getFormattedWalletAddress(selectedPoolId, walletAddress);

    generateMultiMinerUsbMutation.mutate({
      minerTypes: selectedMiners,
      poolId: parseInt(selectedPoolId),
      walletAddress: formattedWalletAddress
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="mr-2 h-5 w-5" />
          ASIC Miner Configuration
        </CardTitle>
        <CardDescription>
          Configure your Bitcoin mining hardware and generate USB mining configurations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ASIC Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="asic-type">ASIC Miner Model</Label>
          <Select 
            value={selectedAsicType} 
            onValueChange={setSelectedAsicType}
            disabled={isLoadingAsicTypes || configureAsicMutation.isPending}
          >
            <SelectTrigger id="asic-type">
              <SelectValue placeholder="Select ASIC miner model" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingAsicTypes ? (
                <div className="flex justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                asicTypes?.map((asic: any) => (
                  <SelectItem key={asic.type} value={asic.type}>
                    {asic.name} ({asic.hashrate} TH/s)
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">USB Configuration Generator</h4>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="unified-mode" 
                checked={unifiedMode}
                onCheckedChange={(checked) => setUnifiedMode(checked as boolean)}
              />
              <Label htmlFor="unified-mode" className="text-sm cursor-pointer">
                Unified Multi-Miner Mode
              </Label>
            </div>
          </div>
          
          {unifiedMode ? (
            <>
              {/* Multi-Miner selection */}
              <div className="space-y-3 mb-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                <h5 className="font-medium text-sm flex items-center">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Select ASIC Miner Models
                </h5>
                <p className="text-xs text-muted-foreground mb-3">
                  Choose the ASIC miner models you want to include in your unified USB package. All selected miners will be configured to use the same pool and wallet.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {!isLoadingAsicTypes && asicTypes?.map((asic: any) => (
                    <div key={asic.type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`miner-${asic.type}`}
                        checked={selectedMiners.includes(asic.type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedMiners([...selectedMiners, asic.type]);
                          } else {
                            setSelectedMiners(selectedMiners.filter(miner => miner !== asic.type));
                          }
                        }}
                      />
                      <Label htmlFor={`miner-${asic.type}`} className="text-sm">
                        {asic.name} ({asic.hashrate} TH/s)
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {/* Mining Pool Selection */}
          <div className="space-y-2 mb-3">
            <Label htmlFor="pool-select">Mining Pool</Label>
            <Select 
              value={selectedPoolId} 
              onValueChange={setSelectedPoolId}
              disabled={isLoadingPools || generateUsbConfigMutation.isPending}
            >
              <SelectTrigger id="pool-select">
                <SelectValue placeholder="Select mining pool" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingPools ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  pools.map((pool: any) => (
                    <SelectItem key={pool.id} value={pool.id.toString()}>
                      {pool.name} (Fee: {pool.fee}%)
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Wallet Address Input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="wallet-address">Wallet Address</Label>
              {selectedPoolId && pools.find((p: Pool) => p.id.toString() === selectedPoolId)?.name?.toLowerCase().includes('unmineable') && (
                <span className="text-xs text-amber-600 font-medium">Unmineable Pool Selected</span>
              )}
            </div>
            <Input
              id="wallet-address"
              placeholder="Enter your BTC wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              disabled={generateUsbConfigMutation.isPending}
            />
            
            {selectedPoolId && pools.find((p: Pool) => p.id.toString() === selectedPoolId)?.name?.toLowerCase().includes('unmineable') ? (
              <div className="mt-2">
                <div className="space-y-2 mb-2">
                  <Label htmlFor="unmineable-format" className="text-sm font-medium text-amber-700 dark:text-amber-500">
                    Unmineable Mining Format
                  </Label>
                  <Select
                    value={unmineableFormat}
                    onValueChange={(value) => setUnmineableFormat(value as UnmineableFormat)}
                  >
                    <SelectTrigger id="unmineable-format" className="border-amber-200 dark:border-amber-800">
                      <SelectValue placeholder="Select mining format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UnmineableFormat.KEY_WORKER}>
                        Standard Mining Key (Recommended)
                      </SelectItem>
                      <SelectItem value={UnmineableFormat.BTC_ADDRESS}>
                        Direct BTC Address (Advanced)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md">
                  {unmineableFormat === UnmineableFormat.BTC_ADDRESS ? (
                    <div className="space-y-1">
                      <p className="text-xs text-amber-700 dark:text-amber-500 font-medium">
                        <b>BTC Mining with Unmineable:</b> Your wallet address will be used with Unmineable's BTC format.
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-500">
                        Mining directly to your Bitcoin address: <code className="bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">BTC:{walletAddress}.KLOUD-BUGS-MINING-CAFE</code>
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        This is an advanced option. Only use if you specifically want to mine directly to your wallet with Unmineable.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs text-amber-700 dark:text-amber-500">
                        <b>Important:</b> For Unmineable pool, the mining key format <code className="bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">1735896864.KLOUD-BUGS-MINING-CAFE</code> will be used automatically 
                        instead of your wallet address to ensure rewards are properly attributed.
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        This is the recommended option for most miners.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                This wallet address will be used in the mining configuration for your ASIC miner.
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 sm:flex-row sm:flex-wrap sm:space-y-0 sm:space-x-3">
        <Button
          className="w-full sm:w-auto"
          onClick={handleConfigureAsic}
          disabled={!selectedAsicType || configureAsicMutation.isPending}
        >
          {configureAsicMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Configure ASIC Mining
        </Button>
        
        {unifiedMode ? (
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            onClick={handleGenerateMultiMinerUsb}
            disabled={selectedMiners.length === 0 || !selectedPoolId || !walletAddress || generateMultiMinerUsbMutation.isPending}
          >
            {generateMultiMinerUsbMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PackageOpen className="mr-2 h-4 w-4" />
            )}
            Generate Unified Multi-Miner Package
          </Button>
        ) : (
          <Button
            className="w-full sm:w-auto"
            variant="secondary"
            onClick={handleGenerateUsbConfig}
            disabled={!selectedAsicType || !selectedPoolId || !walletAddress || generateUsbConfigMutation.isPending}
          >
            {generateUsbConfigMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Generate USB Config
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}