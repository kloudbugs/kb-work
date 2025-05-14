import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Cloud, Activity, Cpu, Zap, Server, Package, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCloudProviders, configureCloudMining, getCloudMiningStatus, getAsicTypes } from '@/lib/miningClient';
import { Badge } from '@/components/ui/badge';

export function CloudMiningConfig() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');
  const [hashPowerAmount, setHashPowerAmount] = useState<number>(1);
  const [selectedAsicModel, setSelectedAsicModel] = useState<string>('');
  const [asicQuantity, setAsicQuantity] = useState<number>(1);
  const [contractDuration, setContractDuration] = useState<number>(30);

  // Fetch cloud mining providers
  const { data: providers, isLoading: isLoadingProviders } = useQuery({
    queryKey: ['/api/mining/cloud/providers'],
    queryFn: getCloudProviders
  });

  // Fetch cloud mining status
  const { data: cloudStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['/api/mining/cloud/status'],
    queryFn: getCloudMiningStatus,
    refetchInterval: 60000 // Refresh every minute
  });

  // Fetch ASIC miner types for cloud-based ASIC options
  const { data: asicTypes, isLoading: isLoadingAsicTypes } = useQuery({
    queryKey: ['/api/mining/asic/types'],
    queryFn: getAsicTypes
  });

  // Configuration mutation
  const configureCloudMutation = useMutation({
    mutationFn: (params: { provider: string, apiKey: string, apiSecret: string, hashPowerAmount: number }) => 
      configureCloudMining(params.provider, params.apiKey, params.apiSecret, params.hashPowerAmount),
    onSuccess: () => {
      toast({
        title: 'Cloud Mining Configured',
        description: 'Your cloud mining settings have been configured successfully.',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mining/cloud/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Configuration Failed',
        description: error.message || 'Could not configure cloud mining.',
        variant: 'destructive',
      });
    }
  });

  // Cloud ASIC mutation
  const configureCloudAsicMutation = useMutation({
    mutationFn: (params: { asicModel: string, quantity: number, duration: number }) => 
      configureCloudMining('virtualized_asic', 'cloud_asic', 'cloud_asic_secret', 
        // We convert from the specific ASIC model's hashrate to a total hashpower amount
        getSelectedAsicInfo().hashrate * params.quantity),
    onSuccess: () => {
      toast({
        title: 'Cloud ASIC Mining Configured',
        description: `Your virtual ${selectedAsicModel} miners have been deployed to the cloud.`,
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mining/cloud/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Cloud ASIC Deployment Failed',
        description: error.message || 'Could not configure cloud ASIC mining.',
        variant: 'destructive',
      });
    }
  });

  // Handle configuring generic cloud mining
  const handleConfigureCloud = () => {
    // Check if minimum fields are provided
    if (!selectedProvider || !hashPowerAmount) {
      toast({
        title: 'Provider and Hash Power Required',
        description: 'Please select a provider and set the hash power amount.',
        variant: 'destructive',
      });
      return;
    }
    
    // For providers other than Unmineable, API keys are required
    if (selectedProvider !== 'unmineable' && (!apiKey || !apiSecret)) {
      toast({
        title: 'API Credentials Required',
        description: `${selectedProvider} requires API credentials to configure mining.`,
        variant: 'destructive',
      });
      return;
    }

    configureCloudMutation.mutate({
      provider: selectedProvider,
      apiKey,
      apiSecret,
      hashPowerAmount
    });
  };

  // Handle configuring ASIC cloud mining
  const handleConfigureCloudAsic = () => {
    if (!selectedAsicModel || asicQuantity < 1 || contractDuration < 1) {
      toast({
        title: 'All Fields Required',
        description: 'Please select an ASIC model, quantity, and contract duration.',
        variant: 'destructive',
      });
      return;
    }

    configureCloudAsicMutation.mutate({
      asicModel: selectedAsicModel,
      quantity: asicQuantity,
      duration: contractDuration
    });
  };

  // Get information about the selected ASIC model
  const getSelectedAsicInfo = () => {
    if (!selectedAsicModel || !asicTypes) {
      return { name: 'Not selected', hashrate: 0, power: 0 };
    }
    
    const selectedAsic = asicTypes.find((asic: any) => asic.type === selectedAsicModel);
    if (!selectedAsic) {
      return { name: 'Not selected', hashrate: 0, power: 0 };
    }
    
    return {
      name: selectedAsic.name,
      hashrate: selectedAsic.hashrate,
      power: selectedAsic.powerConsumption || 3000
    };
  };

  // Calculate estimated earnings based on hash power
  const calculateEstimatedEarnings = (hashPower: number) => {
    // This is a simple estimation formula
    // In a real app, this would use current network difficulty and BTC price
    const dailyBtcPerTH = 0.000008; // Example: BTC per TH/s per day
    return hashPower * dailyBtcPerTH;
  };

  // Calculate monthly costs for cloud ASIC
  const calculateCloudAsicCosts = () => {
    const asicInfo = getSelectedAsicInfo();
    const powerCost = 0.00001; // BTC per kWh used
    const hostingCost = 0.00004; // BTC per TH/s daily for hosting
    
    const dailyPowerCost = (asicInfo.power / 1000) * 24 * powerCost * asicQuantity;
    const dailyHostingCost = asicInfo.hashrate * hostingCost * asicQuantity;
    const totalDailyCost = dailyPowerCost + dailyHostingCost;
    
    return {
      daily: totalDailyCost,
      monthly: totalDailyCost * 30,
      contract: totalDailyCost * contractDuration
    };
  };

  // Calculate cloud ASIC profits
  const calculateCloudAsicProfits = () => {
    const asicInfo = getSelectedAsicInfo();
    const dailyEarning = calculateEstimatedEarnings(asicInfo.hashrate * asicQuantity);
    const costs = calculateCloudAsicCosts();
    
    return {
      daily: dailyEarning - costs.daily,
      monthly: (dailyEarning * 30) - costs.monthly,
      contract: (dailyEarning * contractDuration) - costs.contract
    };
  };

  // Standard cloud mining earnings calculations
  const estimatedEarnings = calculateEstimatedEarnings(hashPowerAmount).toFixed(8);
  const estimatedMonthlyEarnings = (calculateEstimatedEarnings(hashPowerAmount) * 30).toFixed(8);

  // Get the minimum contract duration for the selected provider
  const getMinContractDuration = () => {
    if (!selectedProvider || !providers) return 1;
    const selectedProviderObj = providers.find((p: any) => p.id === selectedProvider);
    return selectedProviderObj?.minContract || 1;
  };

  const minContractDuration = getMinContractDuration();

  // Calculate cloud ASIC values
  const asicInfo = getSelectedAsicInfo();
  const asicCosts = calculateCloudAsicCosts();
  const asicProfits = calculateCloudAsicProfits();
  const totalHashpower = asicInfo.hashrate * asicQuantity;

  // Filter high-performance ASIC models for cloud deployment
  const highPerformanceAsics = asicTypes?.filter((model: any) => model.hashrate >= 100) || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cloud className="mr-2 h-5 w-5" />
          Cloud Mining Configuration
        </CardTitle>
        <CardDescription>
          Rent hash power from cloud mining providers or deploy virtual ASIC miners in the cloud
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Cloud Provider Status Information */}
        {cloudStatus && !isLoadingStatus && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Cloud Mining Status
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>Provider:</div>
              <div className="font-medium">{cloudStatus.provider || 'Not configured'}</div>
              
              <div>Active Power:</div>
              <div className="font-medium">{cloudStatus.activePower ? `${cloudStatus.activePower} TH/s` : 'None'}</div>
              
              <div>Status:</div>
              <div className="font-medium">
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                  cloudStatus.isActive ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                {cloudStatus.isActive ? 'Active' : 'Inactive'}
              </div>
              
              <div>Daily Earnings:</div>
              <div className="font-medium">{cloudStatus.dailyEarnings ? `${cloudStatus.dailyEarnings} BTC` : '0.00000000 BTC'}</div>
            </div>
          </div>
        )}

        <Tabs defaultValue="standard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard" className="flex items-center">
              <Cloud className="mr-2 h-4 w-4" />
              Standard Cloud Mining
            </TabsTrigger>
            <TabsTrigger value="asic" className="flex items-center">
              <Server className="mr-2 h-4 w-4" />
              Cloud ASIC Mining
            </TabsTrigger>
          </TabsList>

          {/* Standard Cloud Mining */}
          <TabsContent value="standard" className="space-y-6">
            {/* Provider Selection */}
            <div className="space-y-2">
              <Label htmlFor="cloud-provider">Cloud Mining Provider</Label>
              <Select 
                value={selectedProvider} 
                onValueChange={setSelectedProvider}
                disabled={isLoadingProviders || configureCloudMutation.isPending}
              >
                <SelectTrigger id="cloud-provider">
                  <SelectValue placeholder="Select cloud mining provider" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingProviders ? (
                    <div className="flex justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    providers?.map((provider: any) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name} (Min. Contract: {provider.minContract} days)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* API Credentials */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="api-key">API Key</Label>
                {selectedProvider === 'unmineable' && (
                  <span className="text-xs text-muted-foreground">(Optional for Unmineable)</span>
                )}
              </div>
              <Input
                id="api-key"
                placeholder={selectedProvider === 'unmineable' ? 
                  "Not required for Unmineable" : 
                  "Enter provider API key"
                }
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={configureCloudMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="api-secret">API Secret</Label>
                {selectedProvider === 'unmineable' && (
                  <span className="text-xs text-muted-foreground">(Optional for Unmineable)</span>
                )}
              </div>
              <Input
                id="api-secret"
                type="password"
                placeholder={selectedProvider === 'unmineable' ? 
                  "Not required for Unmineable" : 
                  "Enter provider API secret"
                }
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                disabled={configureCloudMutation.isPending}
              />
            </div>
            
            {selectedProvider && selectedProvider !== 'unmineable' && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                  <p className="text-amber-800 dark:text-amber-200 font-medium">
                    API Keys Required
                  </p>
                </div>
                <p className="text-xs mt-1 text-muted-foreground">
                  {selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)} 
                  {' '}requires API credentials for cloud mining setup. Please obtain them from your account.
                </p>
              </div>
            )}

            {/* Hash Power Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="hash-power">Hash Power (TH/s)</Label>
                <span className="text-sm font-medium">{hashPowerAmount} TH/s</span>
              </div>
              <Slider
                id="hash-power"
                min={1}
                max={100}
                step={1}
                value={[hashPowerAmount]}
                onValueChange={(value) => setHashPowerAmount(value[0])}
                disabled={configureCloudMutation.isPending}
              />
            </div>

            {/* Estimated Earnings */}
            {selectedProvider && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Estimated Earnings</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>Daily:</div>
                  <div className="font-medium">{estimatedEarnings} BTC</div>
                  
                  <div>Monthly:</div>
                  <div className="font-medium">{estimatedMonthlyEarnings} BTC</div>
                  
                  <div>Min. Contract:</div>
                  <div className="font-medium">{minContractDuration} days</div>
                </div>
                <p className="text-xs mt-2 text-gray-500">
                  Earnings are estimates based on current network difficulty and may vary.
                </p>
              </div>
            )}

            <Button
              className="w-full mt-6"
              onClick={handleConfigureCloud}
              disabled={
                !selectedProvider || 
                !hashPowerAmount || 
                (selectedProvider !== 'unmineable' && (!apiKey || !apiSecret)) || 
                configureCloudMutation.isPending
              }
            >
              {configureCloudMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Configure Standard Cloud Mining
            </Button>
          </TabsContent>

          {/* Cloud ASIC Mining */}
          <TabsContent value="asic" className="space-y-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg mb-2">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Virtual ASIC Cloud Mining
              </h4>
              <p className="text-sm text-muted-foreground mb-0">
                Deploy virtual ASIC miners in our secure cloud environment. No physical hardware needed - we handle all maintenance, cooling, and power management.
              </p>
            </div>

            {/* ASIC Model Selection */}
            <div className="space-y-2">
              <Label htmlFor="asic-model">ASIC Mining Hardware</Label>
              <Select 
                value={selectedAsicModel} 
                onValueChange={setSelectedAsicModel}
                disabled={isLoadingAsicTypes || configureCloudAsicMutation.isPending}
              >
                <SelectTrigger id="asic-model">
                  <SelectValue placeholder="Select ASIC model" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingAsicTypes ? (
                    <div className="flex justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    highPerformanceAsics.map((asic: any) => (
                      <SelectItem key={asic.type} value={asic.type}>
                        {asic.name} ({asic.hashrate} TH/s)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* ASIC Quantity */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="asic-quantity">Number of ASICs</Label>
                <span className="text-sm font-medium">{asicQuantity} unit{asicQuantity !== 1 ? 's' : ''}</span>
              </div>
              <Slider
                id="asic-quantity"
                min={1}
                max={10}
                step={1}
                value={[asicQuantity]}
                onValueChange={(value) => setAsicQuantity(value[0])}
                disabled={configureCloudAsicMutation.isPending}
              />
            </div>

            {/* Contract Duration */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="contract-duration">Contract Duration (Days)</Label>
                <span className="text-sm font-medium">{contractDuration} days</span>
              </div>
              <Slider
                id="contract-duration"
                min={30}
                max={365}
                step={30}
                value={[contractDuration]}
                onValueChange={(value) => setContractDuration(value[0])}
                disabled={configureCloudAsicMutation.isPending}
              />
            </div>

            {/* ASIC Details */}
            {selectedAsicModel && (
              <div className="mt-2 space-y-4">
                {/* Selected ASIC Info */}
                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/40">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">{asicInfo.name}</h4>
                    <Badge variant="outline" className="bg-primary-50 dark:bg-primary-900/20">
                      {asicInfo.hashrate} TH/s
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Cpu className="h-3 w-3 mr-1.5 text-muted-foreground" />
                      <span>Units:</span>
                    </div>
                    <div>{asicQuantity}</div>
                    
                    <div className="flex items-center">
                      <Zap className="h-3 w-3 mr-1.5 text-muted-foreground" />
                      <span>Power:</span>
                    </div>
                    <div>{asicInfo.power}W</div>
                    
                    <div className="flex items-center">
                      <Activity className="h-3 w-3 mr-1.5 text-muted-foreground" />
                      <span>Total Hashrate:</span>
                    </div>
                    <div>{totalHashpower} TH/s</div>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Costs */}
                  <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">Costs</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Daily:</span>
                        <span className="font-medium">{asicCosts.daily.toFixed(8)} BTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly:</span>
                        <span className="font-medium">{asicCosts.monthly.toFixed(8)} BTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Full Contract:</span>
                        <span className="font-medium">{asicCosts.contract.toFixed(8)} BTC</span>
                      </div>
                    </div>
                  </div>

                  {/* Profits */}
                  <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">Estimated Profits</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Daily:</span>
                        <span className="font-medium">{asicProfits.daily.toFixed(8)} BTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly:</span>
                        <span className="font-medium">{asicProfits.monthly.toFixed(8)} BTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Full Contract:</span>
                        <span className="font-medium">{asicProfits.contract.toFixed(8)} BTC</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  The above estimates are based on current Bitcoin network difficulty and may vary. Contract includes all maintenance, cooling, and power costs.
                </p>
              </div>
            )}

            <Button
              className="w-full mt-4"
              onClick={handleConfigureCloudAsic}
              disabled={!selectedAsicModel || configureCloudAsicMutation.isPending}
            >
              {configureCloudAsicMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deploy Virtual ASIC Miners
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}