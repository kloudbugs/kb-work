import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Settings, AlertTriangle, Info, Server, Wrench, ArrowRight, ArrowLeft, Home } from "lucide-react";
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
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Bitcoin Mining</h1>
          <p className="text-muted-foreground">
            Mine Bitcoin with your connected devices and earn rewards. 
            Monitor performance and optimize settings for maximum efficiency.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-blue-600/40 text-blue-400 hover:bg-blue-950/30 hover:text-blue-300"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 bg-indigo-950/30 border border-indigo-600/40 text-indigo-400 hover:bg-indigo-950/50 hover:text-indigo-300"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
      
      {/* No subscription alert as users pay before entering the app */}

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
                      <span className="font-medium text-sm">0.00045231 BTC</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">ASIC Mining Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pool-address">Stratum Address</Label>
                    <div className="flex">
                      <input 
                        id="pool-address" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value="stratum+tcp://btc.highpaypool.com:3333"
                        readOnly
                      />
                      <Button className="ml-2 px-3" variant="outline">
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="worker-name">Worker Name</Label>
                    <div className="flex">
                      <input 
                        id="worker-name" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value="YourBTCWallet.worker1"
                        readOnly
                      />
                      <Button className="ml-2 px-3" variant="outline">
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">ASIC Configuration Guide</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Follow these steps to connect your ASIC device to our mining pool:
                  </p>
                  <ol className="space-y-2 ml-5 text-sm list-decimal">
                    <li>Connect your ASIC miner to your network and power it on</li>
                    <li>Find your miner's IP address from your router or using an IP scanner</li>
                    <li>Access your miner's web interface by entering its IP in your browser</li>
                    <li>Navigate to the pool settings page</li>
                    <li>Enter the Stratum Address and Worker Name provided above</li>
                    <li>Save settings and restart your miner if required</li>
                  </ol>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>ASIC Mining Support</AlertTitle>
                  <AlertDescription>
                    For help with connecting your ASIC miner, please refer to our detailed setup guides in the Help Center or contact our mining support team.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="mr-2 h-5 w-5 text-primary" />
                  Advanced Mining Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mining-mode">Mining Mode</Label>
                    <select
                      id="mining-mode"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="auto">Auto (Recommended)</option>
                      <option value="efficiency">Efficiency Mode</option>
                      <option value="performance">Performance Mode</option>
                      <option value="custom">Custom Settings</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Auto mode automatically adjusts settings based on your hardware capabilities
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cpu-threads">CPU Threads</Label>
                    <div className="flex items-center space-x-2">
                      <input 
                        id="cpu-threads" 
                        type="range" 
                        min="1" 
                        max="16" 
                        value="4"
                        className="w-full" 
                      />
                      <span className="w-10 text-center">4</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Number of CPU threads to use for mining (higher values use more CPU resources)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gpu-intensity">GPU Intensity</Label>
                    <div className="flex items-center space-x-2">
                      <input 
                        id="gpu-intensity" 
                        type="range" 
                        min="1" 
                        max="10" 
                        value="7"
                        className="w-full" 
                      />
                      <span className="w-10 text-center">7</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      GPU mining intensity level (higher values may impact system performance)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="turbo-mode" className="text-base">
                        Turbo Mode
                      </Label>
                      <Switch id="turbo-mode" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Maximizes mining performance at the cost of higher power usage
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="power-saving" className="text-base">
                        Power Saving
                      </Label>
                      <Switch id="power-saving" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Reduces power consumption at the cost of slightly lower mining performance
                    </p>
                  </div>
                  
                  <Button className="w-full">
                    Apply Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-primary" />
                  Mining Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coin-algo">Mining Algorithm</Label>
                    <select
                      id="coin-algo"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="sha256">SHA-256 (Bitcoin)</option>
                      <option value="ethash">Ethash</option>
                      <option value="randomx">RandomX</option>
                      <option value="kawpow">KawPoW</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="custom-stratum">Custom Stratum URL (Optional)</Label>
                    <input 
                      id="custom-stratum" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="stratum+tcp://pool.example.com:3333"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="worker-name-advanced">Worker Name (Optional)</Label>
                    <input 
                      id="worker-name-advanced" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="worker1"
                    />
                  </div>
                  
                  <fieldset className="space-y-2 border rounded-md p-3">
                    <legend className="text-sm px-2">Dual Mining Configuration</legend>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="dual-mining" className="text-sm">
                          Enable Dual Mining
                        </Label>
                        <Switch id="dual-mining" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Mine two different coins simultaneously (requires compatible algorithms)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondary-coin">Secondary Coin</Label>
                      <select
                        id="secondary-coin"
                        disabled
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="eth">Ethereum</option>
                        <option value="ltc">Litecoin</option>
                        <option value="xmr">Monero</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resource-allocation">Resource Allocation</Label>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs">Primary</span>
                        <input 
                          id="resource-allocation" 
                          type="range" 
                          min="50" 
                          max="90" 
                          value="70"
                          disabled
                          className="w-full" 
                        />
                        <span className="text-xs">Secondary</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>70%</span>
                        <span>30%</span>
                      </div>
                    </div>
                  </fieldset>
                  
                  <Button className="w-full">
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Advanced Mining Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Network Difficulty</span>
                    <div className="text-xl font-medium">29.12T</div>
                    <span className="text-xs text-green-500">+3.4% (24h)</span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Block Reward</span>
                    <div className="text-xl font-medium">6.25 BTC</div>
                    <span className="text-xs text-muted-foreground">Next halving in 152,432 blocks</span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Your Network Share</span>
                    <div className="text-xl font-medium">0.000005%</div>
                    <span className="text-xs text-green-500">+0.0001% (24h)</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-sm font-medium mb-2">
                    Mining Efficiency
                  </div>
                  <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-primary"
                      style={{ width: '84%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">84% Efficient</span>
                    <span className="text-xs font-medium">0.85 kH/J</span>
                  </div>
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Optimization Available</AlertTitle>
                  <AlertDescription>
                    Our analysis shows that you could increase mining efficiency by approximately 12% by 
                    adjusting your current settings. Visit the optimization guide for details.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => navigate('/advanced-mining')}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Go to Advanced Mining Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Mining Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-start" className="text-base">
                      Auto-start Mining
                    </Label>
                    <Switch id="auto-start" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically start mining when you log in to the platform
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="minimize-mining" className="text-base">
                      Mine When Minimized
                    </Label>
                    <Switch id="minimize-mining" checked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Continue mining when the browser window is minimized
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="text-base">
                      Mining Notifications
                    </Label>
                    <Switch id="notifications" checked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about mining status changes and rewards
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payout-threshold">Minimum Payout Threshold</Label>
                  <select
                    id="payout-threshold"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="0.0005">0.0005 BTC (Default)</option>
                    <option value="0.001">0.001 BTC</option>
                    <option value="0.005">0.005 BTC</option>
                    <option value="0.01">0.01 BTC</option>
                  </select>
                  <p className="text-sm text-muted-foreground">
                    The minimum amount required for automatic payouts
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Bitcoin Wallet Address</Label>
                  <div className="flex">
                    <input 
                      id="wallet-address" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={user?.walletAddress || ""}
                      readOnly
                    />
                    <Button className="ml-2 px-3" variant="outline">
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your Bitcoin address for receiving mining rewards
                  </p>
                </div>
                
                <Button className="w-full">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Hardware Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cpu-usage">Maximum CPU Usage</Label>
                  <div className="flex items-center space-x-2">
                    <input 
                      id="cpu-usage" 
                      type="range" 
                      min="10" 
                      max="100" 
                      value="80"
                      className="w-full" 
                    />
                    <span className="w-12 text-center">80%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximum CPU resources dedicated to mining
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gpu-usage">Maximum GPU Usage</Label>
                  <div className="flex items-center space-x-2">
                    <input 
                      id="gpu-usage" 
                      type="range" 
                      min="10" 
                      max="100" 
                      value="90"
                      className="w-full" 
                    />
                    <span className="w-12 text-center">90%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximum GPU resources dedicated to mining
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gpu-mining" className="text-base">
                      Enable GPU Mining
                    </Label>
                    <Switch id="gpu-mining" checked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use GPU for mining (recommended for higher hash rates)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cpu-mining" className="text-base">
                      Enable CPU Mining
                    </Label>
                    <Switch id="cpu-mining" checked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use CPU for mining (can be combined with GPU mining)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temp-limit" className="text-base">
                      Temperature Limit Protection
                    </Label>
                    <Switch id="temp-limit" checked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically adjust mining intensity to keep hardware temperatures in safe range
                  </p>
                </div>
                
                <Button className="w-full">
                  Apply Hardware Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </MainLayout>
  );
}