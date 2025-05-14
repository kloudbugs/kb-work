import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  CloudLightning, 
  Zap, 
  BarChart3, 
  Clock, 
  Power, 
  Droplet, 
  Wallet,
  Check,
  ChevronRight,
  Info
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Pool {
  id: number;
  name: string;
  url: string;
  algorithm: string;
  fee: number;
}

interface CloudProvider {
  id: string;
  name: string;
  hashRate: number;
  price: number;
  availability: string;
}

interface MiningStats {
  totalHashRate: string;
  estimatedEarnings: string;
  activeDevices: number;
  powerConsumption: string;
  miningEnabled: boolean;
}

export default function CloudMiningDashboard() {
  const [activeTab, setActiveTab] = useState<string>("status");
  const [miningActive, setMiningActive] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedHashPower, setSelectedHashPower] = useState<number>(100);
  const { toast } = useToast();
  
  // Debug log whenever active tab changes
  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);

  // Fetch mining stats
  const { data: miningStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/mining/stats"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/mining/stats");
      return res.json() as Promise<MiningStats>;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch available pools
  const { data: poolsData, isLoading: poolsLoading } = useQuery({
    queryKey: ["/api/pools"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/pools");
      return res.json();
    }
  });

  // Default cloud providers to use if API returns empty data
  const defaultProviders: CloudProvider[] = [
    { 
      id: "nicehash", 
      name: "NiceHash", 
      hashRate: 100, 
      price: 0.0012, 
      availability: "high" 
    },
    { 
      id: "unmineable", 
      name: "Unmineable", 
      hashRate: 120, 
      price: 0.0010, 
      availability: "high" 
    },
    { 
      id: "genesis_mining", 
      name: "Genesis Mining", 
      hashRate: 200, 
      price: 0.0018, 
      availability: "low" 
    },
    { 
      id: "hashflare", 
      name: "HashFlare", 
      hashRate: 180, 
      price: 0.0016, 
      availability: "medium" 
    }
  ];

  // Fetch cloud providers
  const { data: providersData, isLoading: providersLoading } = useQuery({
    queryKey: ["/api/mining/cloud/providers"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/mining/cloud/providers");
        const data = await res.json();
        // Check if data is an empty object or not an array
        if (!data || typeof data !== 'object' || !Array.isArray(data) || data.length === 0) {
          console.log("Using default providers because API returned:", data);
          return defaultProviders;
        }
        return data;
      } catch (error) {
        console.log("Error fetching providers, using defaults:", error);
        return defaultProviders;
      }
    }
  });

  // Fetch cloud mining status
  const { data: cloudStatus } = useQuery({
    queryKey: ["/api/mining/cloud/status"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/mining/cloud/status");
        return await res.json();
      } catch (error) {
        console.error("Error fetching cloud status:", error);
        return null;
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Update mining status and provider from fetched data
  useEffect(() => {
    if (miningStats) {
      setMiningActive(miningStats.miningEnabled || false);
    }
    
    // If we have cloud status data, update the selected provider
    if (cloudStatus && cloudStatus.provider) {
      console.log("Setting provider from cloud status:", cloudStatus.provider);
      setSelectedProvider(cloudStatus.provider);
      
      if (cloudStatus.hashPowerAmount) {
        setSelectedHashPower(cloudStatus.hashPowerAmount);
      }
    }
  }, [miningStats, cloudStatus]);

  const toggleMining = async () => {
    try {
      const res = await apiRequest("POST", "/api/mining/toggle", {
        enabled: !miningActive
      });
      
      if (res.ok) {
        setMiningActive(!miningActive);
        toast({
          title: !miningActive ? "Mining Started" : "Mining Stopped",
          description: !miningActive
            ? "Your cloud mining operation is now running"
            : "Your cloud mining operation has been stopped",
        });
      } else {
        throw new Error("Failed to toggle mining");
      }
    } catch (error) {
      console.error("Error toggling mining:", error);
      toast({
        title: "Error",
        description: "Failed to toggle mining. Please try again.",
        variant: "destructive",
      });
    }
  };

  const configureCloudMining = async () => {
    if (!selectedProvider) {
      toast({
        title: "Selection Required",
        description: "Please select a cloud mining provider",
        variant: "destructive",
      });
      return;
    }

    // For demo purposes, use placeholder API credentials
    // In a production environment, these would be securely provided by the user
    const apiKey = "your-api-key";
    const apiSecret = "your-api-secret";

    try {
      // 1. First configure the cloud mining
      const res = await apiRequest("POST", "/api/mining/cloud/configure", {
        provider: selectedProvider,
        apiKey,
        apiSecret,
        hashPowerAmount: selectedHashPower
      });
      
      if (res.ok) {
        toast({
          title: "Cloud Mining Configured",
          description: `${selectedHashPower} TH/s of cloud mining power has been configured with ${selectedProvider}`,
        });
        
        // 2. For Unmineable, also start mining automatically
        if (selectedProvider === 'unmineable' && !miningActive) {
          try {
            // Start mining automatically
            const startRes = await apiRequest("POST", "/api/mining/toggle", {
              enabled: true
            });
            
            if (startRes.ok) {
              setMiningActive(true);
              toast({
                title: "Mining Started with Unmineable",
                description: "Your mining operation has been configured and started automatically",
              });
            }
          } catch (err) {
            console.error("Error starting mining:", err);
            // Still navigate to status tab even if starting fails
          }
        }
        
        // Always switch to status tab after configuration
        setActiveTab("status");
      } else {
        throw new Error("Failed to configure cloud mining");
      }
    } catch (error) {
      console.error("Error configuring cloud mining:", error);
      toast({
        title: "Configuration Error",
        description: "Failed to configure cloud mining. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Calculate estimated earnings based on hashpower and provider price
  const calculateEstimatedEarnings = (hashPower: number, providerPrice?: number): string => {
    const baseRate = providerPrice || 0.0014; // Default rate if provider price not available
    const dailyEarningsBTC = (hashPower * baseRate * 24);
    const dailyEarningsUSD = dailyEarningsBTC * 42000; // Assuming 1 BTC = $42,000
    
    return formatCurrency(dailyEarningsUSD);
  };

  // Calculate cost based on hashpower and provider price
  const calculateCost = (hashPower: number, providerPrice?: number): string => {
    const rate = providerPrice || 0.0014; // Default rate if provider price not available
    const dailyCost = (hashPower * rate * 24 * 0.8); // 80% of earnings goes to costs
    return formatCurrency(dailyCost);
  };

  // Selected provider details
  const selectedProviderDetails = selectedProvider 
    ? (providersData?.find((p: CloudProvider) => p.id === selectedProvider) || 
       defaultProviders.find(p => p.id === selectedProvider))
    : null;

  if (statsLoading && poolsLoading && providersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"/>
      </div>
    );
  }

  const pools = poolsData?.pools || [];
  
  // Ensure providers is always an array
  const providers = Array.isArray(providersData) ? providersData : defaultProviders;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="status">
            <BarChart3 className="h-4 w-4 mr-2" />
            Mining Status
          </TabsTrigger>
          <TabsTrigger value="configure">
            <CloudLightning className="h-4 w-4 mr-2" />
            Configure Cloud Mining
          </TabsTrigger>
          <TabsTrigger value="pools">
            <Droplet className="h-4 w-4 mr-2" />
            Mining Pools
          </TabsTrigger>
        </TabsList>
        
        {/* Mining Status Tab */}
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Cloud Mining Status</CardTitle>
              <CardDescription>
                Overview of your current cloud mining operation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card border rounded-lg p-4 flex flex-col">
                  <span className="text-muted-foreground text-sm">Total Hashrate</span>
                  <div className="flex items-center mt-1">
                    <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-xl font-bold">{miningStats?.totalHashRate || "0 TH/s"}</span>
                  </div>
                </div>
                
                <div className="bg-card border rounded-lg p-4 flex flex-col">
                  <span className="text-muted-foreground text-sm">Estimated Earnings (24h)</span>
                  <div className="flex items-center mt-1">
                    <Wallet className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-xl font-bold">${miningStats?.estimatedEarnings || "0.00"}</span>
                  </div>
                </div>
                
                <div className="bg-card border rounded-lg p-4 flex flex-col">
                  <span className="text-muted-foreground text-sm">Power Consumption</span>
                  <div className="flex items-center mt-1">
                    <Power className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-xl font-bold">{miningStats?.powerConsumption || "0 W"}</span>
                  </div>
                </div>
                
                <div className="bg-card border rounded-lg p-4 flex flex-col">
                  <span className="text-muted-foreground text-sm">Active Since</span>
                  <div className="flex items-center mt-1">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-xl font-bold">14h 32m</span>
                  </div>
                </div>
              </div>
              
              <Card className="border-dashed">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Mining Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Mining Status</h4>
                        <p className="text-sm text-muted-foreground">
                          {miningActive 
                            ? "Your mining operation is currently active" 
                            : "Your mining operation is currently inactive"}
                        </p>
                      </div>
                      
                      {/* Show different UI based on whether configuration is set */}
                      {selectedProvider ? (
                        <Button 
                          variant={miningActive ? "destructive" : "default"}
                          onClick={toggleMining}
                        >
                          {miningActive ? "Stop Mining" : "Start Mining"}
                        </Button>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <Button 
                            variant="default"
                            onClick={() => setActiveTab('configure')}
                            className="flex items-center bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            <span>Setup Config</span>
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                          <span className="text-xs text-amber-600 dark:text-amber-400">
                            Configuration required before mining
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium">Connected Pool</h4>
                        <span className="text-sm text-muted-foreground">
                          {/* Always prioritize Unmineable as the primary pool */}
                          {pools && pools.length > 0 
                            ? (pools.find((p: Pool) => p.name === 'Unmineable')?.name || pools[0].name)
                            : "Unmineable"}
                        </span>
                      </div>
                      <Progress value={miningActive ? 75 : 0} className="h-2" />
                    </div>
                    
                    {!selectedProvider && (
                      <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md">
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          Setup Required
                        </h4>
                        <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
                          Please configure your mining settings in the "Configure Cloud Mining" tab before starting mining operations.
                          This ensures you know exactly what you'll be mining and with which provider.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Configure Cloud Mining Tab */}
        <TabsContent value="configure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configure Cloud Mining</CardTitle>
              <CardDescription>
                Select your preferred cloud mining provider and hash power
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {providers.map((provider: CloudProvider) => (
                  <Card 
                    key={provider.id} 
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedProvider === provider.id ? 'border-primary ring-2 ring-primary ring-opacity-50' : ''
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between">
                        {provider.name}
                        {selectedProvider === provider.id && <Check className="h-4 w-4 text-primary" />}
                      </CardTitle>
                      <CardDescription>
                        <Badge variant={
                          provider.availability === 'high' ? 'default' : 
                          provider.availability === 'medium' ? 'secondary' : 'outline'
                        }>
                          {provider.availability === 'high' ? 'High Availability' : 
                           provider.availability === 'medium' ? 'Medium Availability' : 'Low Availability'}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span>{provider.hashRate} TH/s</span>
                        </div>
                        <div className="text-muted-foreground text-sm">
                          ${provider.price}/TH/hour
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {selectedProvider && (
                <Card className="mt-6 border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Configure Hash Power</CardTitle>
                    <CardDescription>
                      Adjust the amount of hash power you want to purchase
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span>Hash Power: {selectedHashPower} TH/s</span>
                        <span className="text-muted-foreground">
                          Daily Cost: {calculateCost(selectedHashPower, selectedProviderDetails?.price)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={selectedHashPower}
                        onChange={(e) => setSelectedHashPower(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>10 TH/s</span>
                        <span>250 TH/s</span>
                        <span>500 TH/s</span>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Estimated Daily Earnings</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="font-bold text-green-500">
                            {calculateEstimatedEarnings(selectedHashPower, selectedProviderDetails?.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cost</p>
                          <p className="font-bold text-red-500">
                            {calculateCost(selectedHashPower, selectedProviderDetails?.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Net Profit</p>
                          <p className="font-bold">
                            {formatCurrency(
                              parseFloat(calculateEstimatedEarnings(selectedHashPower, selectedProviderDetails?.price).replace('$', '')) - 
                              parseFloat(calculateCost(selectedHashPower, selectedProviderDetails?.price).replace('$', ''))
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Provider</p>
                          <p className="font-bold">{selectedProviderDetails?.name}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={configureCloudMining} className="w-full">
                      {selectedProvider === 'unmineable' 
                        ? 'Start Mining with Unmineable' 
                        : 'Purchase Hash Power'}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Mining Pools Tab */}
        <TabsContent value="pools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Mining Pools</CardTitle>
              <CardDescription>
                Choose from these mining pools to connect your cloud mining operation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pools && pools.length > 0 ? (
                  pools.map((pool: Pool) => (
                    <div key={pool.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent">
                      <div>
                        <h3 className="font-medium">{pool.name}</h3>
                        <p className="text-sm text-muted-foreground">{pool.url}</p>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-2">
                            {pool.algorithm}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Fee: {pool.fee}%
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            toast({
                              title: "Pool Set as Active",
                              description: `${pool.name} has been set as your active mining pool`,
                            });
                          }}
                        >
                          Use Pool
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            toast({
                              title: "Pool Stopped",
                              description: `Stopped using ${pool.name}`,
                              variant: "destructive"
                            });
                          }}
                        >
                          Stop Pool
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No mining pools available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}