import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Settings, AlertTriangle, Info, Server, Wrench, ArrowRight } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from '@/components/layout/MainLayout';
import { useLocation } from "wouter";

export default function BitcoinMining() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("mining");
  const [miningEnabled, setMiningEnabled] = useState(false);
  const [accessError, setAccessError] = useState(false);
  const [, navigate] = useLocation();

  // Query to get mining status
  const {
    data: miningStatus,
    isLoading: isLoadingStatus,
    refetch: refetchStatus
  } = useQuery({
    queryKey: ['/api/mining/status'],
    retry: 1,
    refetchInterval: 3000, // Poll every 3 seconds when page is open
  });

  // Query to get mining stats
  const {
    data: miningStats,
    isLoading: isLoadingStats,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['/api/mining/stats'],
    retry: 1,
    refetchInterval: 5000, // Poll every 5 seconds when page is open
  });

  // Query to get mining pools
  const { data: poolsData } = useQuery({
    queryKey: ['/api/pools'],
  });

  // Get active pool information
  const activePool = poolsData?.pools?.find(
    (pool: any) => pool.id === miningStatus?.activePoolId
  ) || poolsData?.pools?.[0];

  // Mutation to toggle mining
  const toggleMiningMutation = useMutation({
    mutationFn: (enabled: boolean) => {
      return apiRequest('/api/mining/toggle', 'POST', { 
        enabled, 
        poolId: activePool?.id 
      });
    },
    onSuccess: () => {
      refetchStatus();
      refetchStats();
      setAccessError(false);
      toast({
        title: miningEnabled ? "Mining stopped" : "Mining started",
        description: miningEnabled 
          ? "Mining has been stopped successfully" 
          : "Mining has started successfully",
      });
    },
    onError: (error: any) => {
      // Check if this is an access error
      if (error.response?.data?.accessRequired) {
        setAccessError(true);
        toast({
          title: "Access required",
          description: "You need proper access rights to use mining features",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Mining error",
          description: "There was an error toggling mining",
          variant: "destructive"
        });
      }
      // Reset state to match the server
      setMiningEnabled(!!miningStatus?.miningEnabled);
    }
  });

  // Update the local state when mining status changes
  React.useEffect(() => {
    if (miningStatus) {
      setMiningEnabled(!!miningStatus.miningEnabled);
    }
  }, [miningStatus]);

  // Toggle mining function
  const handleToggleMining = () => {
    const newState = !miningEnabled;
    setMiningEnabled(newState);
    toggleMiningMutation.mutate(newState);
  };

  // Format hash rate for display
  const formatHashRate = (hashRate: string | number | undefined) => {
    if (!hashRate) return "0 H/s";
    const rate = typeof hashRate === 'string' ? parseFloat(hashRate) : hashRate;
    
    if (rate >= 1000000000000) {
      return `${(rate / 1000000000000).toFixed(2)} TH/s`;
    } else if (rate >= 1000000000) {
      return `${(rate / 1000000000).toFixed(2)} GH/s`;
    } else if (rate >= 1000000) {
      return `${(rate / 1000000).toFixed(2)} MH/s`;
    } else if (rate >= 1000) {
      return `${(rate / 1000).toFixed(2)} KH/s`;
    } else {
      return `${rate.toFixed(2)} H/s`;
    }
  };

  // Format uptime in hours:minutes:seconds
  const formatUptime = (seconds: number) => {
    if (!seconds || seconds <= 0) return "00:00:00";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return [hours, minutes, secs]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  };

  // Calculate share acceptance rate
  const calculateAcceptanceRate = () => {
    if (!miningStatus?.totalShares?.submitted) return "0%";
    const accepted = miningStatus.totalShares.accepted || 0;
    const submitted = miningStatus.totalShares.submitted || 1; // Avoid division by zero
    return `${((accepted / submitted) * 100).toFixed(2)}%`;
  };
  
  // Calculate estimated earnings
  const calculateEstimatedEarnings = () => {
    if (!miningStats?.estimatedEarnings) return "0.00000000";
    const earnings = typeof miningStats.estimatedEarnings === 'string' 
      ? parseFloat(miningStats.estimatedEarnings)
      : miningStats.estimatedEarnings;
    return earnings.toFixed(8);
  };

  return (
    <MainLayout>
      <div className="flex flex-col w-full h-full p-8 space-y-8 overflow-y-auto">
      <div className="flex flex-col space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Bitcoin Mining</h1>
        <p className="text-muted-foreground">
          Mine Bitcoin with your connected devices and earn rewards. 
          Monitor performance and optimize settings for maximum efficiency.
        </p>
      </div>
      
      {/* Removed subscription error alert as users pay before entering the app */}

      <Tabs 
        defaultValue="mining" 
        className="w-full" 
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full max-w-xl grid-cols-4">
          <TabsTrigger value="mining">Mining</TabsTrigger>
          <TabsTrigger value="asic">
            <Server className="mr-2 h-4 w-4" />
            ASIC Mining
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Wrench className="mr-2 h-4 w-4" />
            Advanced Mining
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mining" className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mining Control Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-medium">
                  <Zap className="mr-2 h-5 w-5 text-primary" />
                  Mining Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mining-toggle" className="text-base">
                      Mining Status
                    </Label>
                    <div className="flex items-center gap-2">
                      <Switch 
                        id="mining-toggle" 
                        checked={miningEnabled}
                        disabled={toggleMiningMutation.isPending}
                        onCheckedChange={handleToggleMining}
                      />
                      <span className={miningEnabled ? "text-green-500" : "text-gray-500"}>
                        {miningEnabled ? "On" : "Off"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-medium ${miningEnabled ? "text-green-500" : "text-gray-500"}`}>
                        {miningEnabled ? "Mining in Progress" : "Idle"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mining Pool</span>
                      <span className="font-medium">{activePool?.name || "Default Pool"}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Wallet</span>
                      <span className="font-medium truncate max-w-[180px] hover:underline cursor-pointer">
                        {user?.walletAddress?.slice(0, 6)}...{user?.walletAddress?.slice(-6)}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={miningEnabled ? "destructive" : "default"}
                    disabled={toggleMiningMutation.isPending}
                    onClick={handleToggleMining}
                  >
                    {toggleMiningMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full" />
                        {miningEnabled ? "Stopping..." : "Starting..."}
                      </div>
                    ) : (
                      miningEnabled ? "Stop Mining" : "Start Mining"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Performance Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Current Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hash Rate</span>
                      <span className="font-medium">
                        {formatHashRate(miningStatus?.currentHashrate)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="font-medium">{formatUptime(miningStatus?.uptime)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shares</span>
                      <span className="font-medium">
                        {miningStatus?.totalShares?.accepted || 0}/{miningStatus?.totalShares?.submitted || 0}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Acceptance Rate</span>
                      <span className="font-medium">{calculateAcceptanceRate()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Share Acceptance</span>
                      <span className="font-medium">{calculateAcceptanceRate()}</span>
                    </div>
                    <Progress 
                      value={miningStatus?.totalShares?.submitted 
                        ? (miningStatus.totalShares.accepted / miningStatus.totalShares.submitted) * 100 
                        : 0
                      } 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Earnings Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Est. Daily Earnings</span>
                    <div className="flex items-end">
                      <span className="text-2xl font-bold">
                        {calculateEstimatedEarnings()}
                      </span>
                      <span className="ml-1 text-sm font-medium">BTC</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ≈ ${(parseFloat(calculateEstimatedEarnings()) * 60000).toFixed(2)} USD
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Mined</span>
                      <span className="font-medium">{miningStats?.totalMined || "0.00000000"} BTC</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Unpaid Balance</span>
                      <span className="font-medium">
                        {typeof user?.balance === 'string' 
                          ? (parseInt(user.balance) / 100000000).toFixed(8) 
                          : "0.00000000"
                        } BTC
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Payout</span>
                      <span className="font-medium">N/A</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" variant="outline" disabled={!miningEnabled}>
                    View Detailed Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Pool Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Mining Pool Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Pool Name</span>
                    <div className="font-medium">{activePool?.name || "Default Pool"}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Algorithm</span>
                    <div className="font-medium capitalize">{activePool?.algorithm || "SHA-256"}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Fee</span>
                    <div className="font-medium">{activePool?.fee || "1"}%</div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Server</span>
                    <div className="font-medium truncate" title={activePool?.url}>
                      {activePool?.url?.split("://")[1] || "Unknown"}
                    </div>
                  </div>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Pool Information</AlertTitle>
                  <AlertDescription>
                    This pool automatically pays out to your Bitcoin wallet once you reach the minimum threshold.
                    Current minimum payout: 0.0005 BTC.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="asic" className="space-y-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="mr-2 h-5 w-5 text-primary" />
                  ASIC Mining Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">ASIC Devices</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure and manage your ASIC mining devices directly within the platform.
                      Connect high-performance mining hardware for maximum returns.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-card rounded-lg p-4 border">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Antminer S19 Pro</h4>
                          <Badge className="bg-green-600">Active</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Hash Rate</span>
                            <span className="font-medium">110 TH/s</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Power</span>
                            <span className="font-medium">3250W</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Efficiency</span>
                            <span className="font-medium">29.5 J/TH</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-card rounded-lg p-4 border border-dashed flex flex-col items-center justify-center text-center">
                        <Server className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="font-medium">Add New ASIC Device</p>
                        <p className="text-xs text-muted-foreground mb-2">Connect additional mining hardware</p>
                        <Button size="sm" variant="outline" onClick={() => navigate('/asic-mining')}>
                          Configure
                        </Button>
                      </div>
                    </div>
                    
                    <Button className="w-full" onClick={() => navigate('/asic-mining')}>
                      <Server className="mr-2 h-4 w-4" />
                      Go to ASIC Mining Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ASIC Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Device Status</Label>
                    <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Operational</span>
                      <span className="font-medium">98.7% Uptime</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Total Hash Power</Label>
                      <span className="font-medium text-sm">110 TH/s</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Your ASIC miners are operating at 85% of maximum capacity
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Temperature</Label>
                      <span className="font-medium text-sm">62°C</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Estimated Earnings (24h)</Label>
                      <span className="font-medium text-sm">0.00095 BTC</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      ≈ $39.90 USD
                    </p>
                  </div>
                  
                  <Button className="w-full" variant="outline" onClick={() => navigate('/asic-mining')}>
                    View Detailed Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="mr-2 h-5 w-5 text-primary" />
                  Advanced Mining Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Real-Time Optimization Controls</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Advanced settings for professional miners. Fine-tune your mining operations for maximum efficiency and profitability.
                    </p>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Mining Algorithm</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" disabled={miningEnabled}>
                          <option value="sha256d">SHA-256d (Bitcoin)</option>
                          <option value="scrypt">Scrypt (Litecoin)</option>
                          <option value="ethash">Ethash (Ethereum)</option>
                          <option value="randomx">RandomX (Monero)</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Hash Mode</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" className="border-primary/50">Standard</Button>
                          <Button variant="outline">Eco</Button>
                          <Button variant="outline">Turbo</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Thermal Management</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Temperature Limit</span>
                              <span className="font-medium">75°C</span>
                            </div>
                            <input 
                              type="range" 
                              min="60" 
                              max="95" 
                              value="75" 
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Fan Speed</span>
                              <span className="font-medium">70%</span>
                            </div>
                            <input 
                              type="range" 
                              min="30" 
                              max="100" 
                              value="70" 
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="profit-switching">Profit Switching</Label>
                          <Switch id="profit-switching" defaultChecked />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Automatically switch to the most profitable algorithm
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button className="w-full" onClick={() => navigate('/advanced-mining')}>
                        <Wrench className="mr-2 h-4 w-4" />
                        Go to Advanced Mining
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 h-5 w-5 text-primary" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card rounded-lg p-4 border">
                      <h4 className="text-sm font-medium mb-1">Hash Efficiency</h4>
                      <div className="text-2xl font-bold">94.3%</div>
                      <div className="flex items-center text-xs text-green-500 mt-1">
                        <svg
                          className="h-3 w-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                        2.5% from last week
                      </div>
                    </div>
                    
                    <div className="bg-card rounded-lg p-4 border">
                      <h4 className="text-sm font-medium mb-1">Power Efficiency</h4>
                      <div className="text-2xl font-bold">31.5 <span className="text-sm">J/TH</span></div>
                      <div className="flex items-center text-xs text-green-500 mt-1">
                        <svg
                          className="h-3 w-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                        8.2% from last week
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Optimization Opportunities</h4>
                    
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-3">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-amber-800 dark:text-amber-300">Over-Voltage Detected</h5>
                          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                            Your mining devices may be running at higher voltage than needed. Consider reducing voltage for better efficiency.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-3">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-green-800 dark:text-green-300">Optimal Clock Speeds</h5>
                          <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                            Current clock speeds are in the optimal range for efficiency and performance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={() => navigate('/advanced-mining')}>
                    View Advanced Performance Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Mining Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Mining Pool</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={miningStatus?.activePoolId || (poolsData?.pools?.[0]?.id)}
                    disabled={miningEnabled}
                  >
                    {poolsData?.pools?.map((pool: any) => (
                      <option key={pool.id} value={pool.id}>
                        {pool.name} ({pool.algorithm}) - Fee: {pool.fee}%
                      </option>
                    ))}
                  </select>
                  {miningEnabled && (
                    <p className="text-xs text-muted-foreground">
                      Stop mining to change the mining pool
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-start">Auto-start Mining</Label>
                    <Switch id="auto-start" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Automatically start mining when you log in
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Mining Intensity</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <option value="low">Low (30% CPU)</option>
                    <option value="medium" selected>Medium (50% CPU)</option>
                    <option value="high">High (70% CPU)</option>
                    <option value="max">Maximum (90% CPU)</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Higher intensity increases earnings but uses more CPU and power
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Mining Notifications</Label>
                    <Switch id="notifications" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications about mining status changes and earnings
                  </p>
                </div>
                
                <Button className="w-full" disabled={miningEnabled}>
                  Save Settings
                </Button>
                {miningEnabled && (
                  <p className="text-xs text-center text-muted-foreground">
                    Stop mining to change settings
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Advanced Configuration</AlertTitle>
                  <AlertDescription>
                    These settings are for advanced users. Changing these values incorrectly 
                    may reduce mining performance or cause instability.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Thread Count</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" disabled={miningEnabled}>
                      <option value="1">1 Thread</option>
                      <option value="2" selected>2 Threads</option>
                      <option value="4">4 Threads</option>
                      <option value="8">8 Threads</option>
                      <option value="0">Auto (All Available)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Memory Usage</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" disabled={miningEnabled}>
                      <option value="1">1 GB</option>
                      <option value="2" selected>2 GB</option>
                      <option value="4">4 GB</option>
                      <option value="8">8 GB</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hardware-accel">Hardware Acceleration</Label>
                    <Switch id="hardware-accel" defaultChecked disabled={miningEnabled} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use hardware acceleration to improve mining performance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </MainLayout>
  );
}