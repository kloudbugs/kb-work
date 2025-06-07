import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Bitcoin, 
  Building, 
  Server, 
  Cpu, 
  Globe, 
  AlertCircle,
  RefreshCw,
  Zap,
  ThermometerSun,
  Power,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  PieChart,
  LineChart,
  BadgeCheck,
  Cloud
} from 'lucide-react';

// Farm location interface
interface MiningLocation {
  id: string;
  name: string;
  address: string;
  country: string;
  totalRigs: number;
  activeRigs: number;
  totalHashrate: number;
  powerConsumption: number;
  efficiency: number;
  temperature: number;
  status: 'operational' | 'maintenance' | 'issue';
  costKwh: number;
}

// Mining rig overview interface
interface RigSummary {
  type: 'asic' | 'gpu' | 'cpu' | 'cloud';
  count: number;
  activeCount: number;
  totalHashrate: number;
  avgEfficiency: number;
}

// Profitability interface
interface Profitability {
  daily: {
    btc: number;
    usd: number;
  };
  weekly: {
    btc: number;
    usd: number;
  };
  monthly: {
    btc: number;
    usd: number;
  };
  yearlyProjected: {
    btc: number;
    usd: number;
  };
}

// Mining stats interface
interface MiningStats {
  accepted: number;
  rejected: number;
  stale: number;
  blockFound: number;
  uptime: string; // formatted uptime
}

// Overview dashboard page
export default function MiningFarmOverviewPage() {
  const [locations, setLocations] = useState<MiningLocation[]>([
    {
      id: 'loc-1',
      name: 'Home Office',
      address: '123 Main St, Anytown',
      country: 'United States',
      totalRigs: 1,
      activeRigs: 1,
      totalHashrate: 35,
      powerConsumption: 120,
      efficiency: 0.29,
      temperature: 68,
      status: 'operational',
      costKwh: 0.12
    },
    {
      id: 'loc-2',
      name: 'Mining Farm Alpha',
      address: '456 Mining Way, Cryptoville',
      country: 'United States',
      totalRigs: 2,
      activeRigs: 1,
      totalHashrate: 13500,
      powerConsumption: 1350,
      efficiency: 10,
      temperature: 72,
      status: 'issue',
      costKwh: 0.08
    }
  ]);

  const [rigSummary, setRigSummary] = useState<RigSummary[]>([
    {
      type: 'asic',
      count: 2,
      activeCount: 1,
      totalHashrate: 13500,
      avgEfficiency: 10
    },
    {
      type: 'gpu',
      count: 0,
      activeCount: 0,
      totalHashrate: 0,
      avgEfficiency: 0
    },
    {
      type: 'cpu',
      count: 1,
      activeCount: 1,
      totalHashrate: 35,
      avgEfficiency: 0.29
    },
    {
      type: 'cloud',
      count: 3,
      activeCount: 2,
      totalHashrate: 42200,
      avgEfficiency: 0 // Not applicable for cloud mining
    }
  ]);

  const [profitability, setProfitability] = useState<Profitability>({
    daily: {
      btc: 0.00063,
      usd: 36.9
    },
    weekly: {
      btc: 0.00441,
      usd: 258.3
    },
    monthly: {
      btc: 0.0189,
      usd: 1107
    },
    yearlyProjected: {
      btc: 0.2268,
      usd: 13284
    }
  });

  const [miningStats, setMiningStats] = useState<MiningStats>({
    accepted: 14568,
    rejected: 42,
    stale: 23,
    blockFound: 0,
    uptime: '5d 12h 34m'
  });

  const [btcPrice, setBtcPrice] = useState<number>(58500);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  // Refresh all dashboard data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would make API calls to fetch the data
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, we would update the state with data from the API
      
      toast({
        title: "Dashboard Refreshed",
        description: "Mining farm data has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing the dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total farm stats
  const totalStats = {
    totalRigs: locations.reduce((sum, loc) => sum + loc.totalRigs, 0) + rigSummary.find(r => r.type === 'cloud')?.count || 0,
    activeRigs: locations.reduce((sum, loc) => sum + loc.activeRigs, 0) + rigSummary.find(r => r.type === 'cloud')?.activeCount || 0,
    totalHashrate: locations.reduce((sum, loc) => sum + loc.totalHashrate, 0) + (rigSummary.find(r => r.type === 'cloud')?.totalHashrate || 0),
    totalPower: locations.reduce((sum, loc) => sum + loc.powerConsumption, 0),
    avgEfficiency: locations.reduce((sum, loc) => sum + (loc.efficiency * loc.activeRigs), 0) / 
                   (locations.reduce((sum, loc) => sum + loc.activeRigs, 0) || 1)
  };

  // Format hashrate
  const formatHashrate = (hashrate: number) => {
    if (hashrate >= 1000000) {
      return `${(hashrate / 1000000).toFixed(2)} PH/s`;
    } else if (hashrate >= 1000) {
      return `${(hashrate / 1000).toFixed(2)} TH/s`;
    } else {
      return `${hashrate.toFixed(2)} GH/s`;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-500';
      case 'maintenance':
        return 'text-amber-500';
      case 'issue':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mining Farm Overview</h1>
          <p className="text-sm text-muted-foreground">Comprehensive view of all your mining operations</p>
        </div>
        <Button 
          onClick={refreshData}
          disabled={isLoading}
          className="bg-cyan-700 hover:bg-cyan-600 text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Dashboard
        </Button>
      </div>

      {/* Top statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hashrate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatHashrate(totalStats.totalHashrate)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {totalStats.activeRigs} active devices
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${profitability.daily.usd.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {profitability.daily.btc.toFixed(8)} BTC
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.avgEfficiency.toFixed(2)} <span className="text-sm font-normal">MH/W</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {totalStats.totalPower}W total consumption
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bitcoin Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${btcPrice.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-green-500 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              2.4% in 24h
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="locations">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="distribution">Hardware</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* Locations tab */}
            <TabsContent value="locations" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {locations.map(location => (
                  <Card key={location.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Building className="h-5 w-5 mr-2 text-cyber-gold" />
                          <CardTitle>{location.name}</CardTitle>
                        </div>
                        <div className={`flex items-center ${getStatusColor(location.status)}`}>
                          <span className="h-2 w-2 rounded-full bg-current mr-2"></span>
                          <span className="text-sm capitalize">{location.status}</span>
                        </div>
                      </div>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {location.address}, {location.country}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Server className="h-3 w-3 mr-1" />
                            Rigs
                          </div>
                          <div className="text-sm font-semibold">
                            {location.activeRigs}/{location.totalRigs}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Zap className="h-3 w-3 mr-1" />
                            Hashrate
                          </div>
                          <div className="text-sm font-semibold">
                            {formatHashrate(location.totalHashrate)}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Power className="h-3 w-3 mr-1" />
                            Power
                          </div>
                          <div className="text-sm font-semibold">
                            {location.powerConsumption}W
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground flex items-center">
                            <ThermometerSun className="h-3 w-3 mr-1" />
                            Temperature
                          </div>
                          <div className="text-sm font-semibold">
                            {location.temperature}°C
                          </div>
                        </div>
                      </div>

                      {location.status === 'issue' && (
                        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-md text-xs">
                          <div className="flex items-center">
                            <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                            <span>Alert: Temperature warning on Antminer S9 #2. One device is offline.</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
                        <div>Electricity: ${location.costKwh.toFixed(2)}/kWh</div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}

                {/* Cloud services card */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Cloud className="h-5 w-5 mr-2 text-blue-500" />
                        <CardTitle>Cloud Mining Services</CardTitle>
                      </div>
                      <div className="flex items-center text-green-500">
                        <span className="h-2 w-2 rounded-full bg-current mr-2"></span>
                        <span className="text-sm">Operational</span>
                      </div>
                    </div>
                    <CardDescription>
                      NiceHash, Unmineable, Mining Rig Rentals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          Services
                        </div>
                        <div className="text-sm font-semibold">
                          {rigSummary.find(r => r.type === 'cloud')?.activeCount}/{rigSummary.find(r => r.type === 'cloud')?.count}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          Hashrate
                        </div>
                        <div className="text-sm font-semibold">
                          {formatHashrate(rigSummary.find(r => r.type === 'cloud')?.totalHashrate || 0)}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Daily Cost
                        </div>
                        <div className="text-sm font-semibold">
                          $12.50
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Bitcoin className="h-3 w-3 mr-1" />
                          Daily Profit
                        </div>
                        <div className="text-sm font-semibold">
                          $18.25
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
                      <div>Contract renewal: 21 days remaining</div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Hardware distribution tab */}
            <TabsContent value="distribution" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Hardware Distribution</CardTitle>
                  <CardDescription>
                    Overview of your mining hardware by type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Distribution by Type</h4>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-center h-48">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Hardware Distribution Chart</div>
                          <div className="text-xs text-muted-foreground mt-1">(Visualization would appear here)</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Hardware Details</h4>
                      <div className="space-y-3">
                        {rigSummary.map(rig => (
                          <div key={rig.type} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {rig.type === 'asic' ? (
                                <Server className="h-5 w-5 mr-3 text-blue-500" />
                              ) : rig.type === 'gpu' ? (
                                <Cpu className="h-5 w-5 mr-3 text-purple-500" />
                              ) : rig.type === 'cpu' ? (
                                <Cpu className="h-5 w-5 mr-3 text-green-500" />
                              ) : (
                                <Cloud className="h-5 w-5 mr-3 text-cyan-500" />
                              )}
                              <div>
                                <div className="font-medium capitalize">{rig.type} Miners</div>
                                <div className="text-xs text-muted-foreground">
                                  {rig.activeCount} active out of {rig.count}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatHashrate(rig.totalHashrate)}</div>
                              {rig.type !== 'cloud' && (
                                <div className="text-xs text-muted-foreground">
                                  {rig.avgEfficiency.toFixed(2)} MH/W
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Hardware by Algorithm</CardTitle>
                    <CardDescription>
                      Mining power distribution by algorithm
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <Bitcoin className="h-5 w-5 mr-3 text-cyber-gold" />
                          <div>
                            <div className="font-medium">SHA-256</div>
                            <div className="text-xs text-muted-foreground">Bitcoin</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatHashrate(13500)}</div>
                          <div className="text-xs text-muted-foreground">2 devices</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <Bitcoin className="h-5 w-5 mr-3 text-blue-500" />
                          <div>
                            <div className="font-medium">Ethash</div>
                            <div className="text-xs text-muted-foreground">Ethereum</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatHashrate(35)}</div>
                          <div className="text-xs text-muted-foreground">1 device</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <Bitcoin className="h-5 w-5 mr-3 text-green-500" />
                          <div>
                            <div className="font-medium">SHA-256 (Cloud)</div>
                            <div className="text-xs text-muted-foreground">Bitcoin</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatHashrate(42200)}</div>
                          <div className="text-xs text-muted-foreground">3 services</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Hardware Health</CardTitle>
                    <CardDescription>
                      Operational status of your mining devices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Temperature Range</div>
                        <div className="flex items-center">
                          <ThermometerSun className="h-4 w-4 mr-2 text-green-500" />
                          <span>62°C - 78°C</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Power Efficiency</div>
                        <div className="flex items-center">
                          <Power className="h-4 w-4 mr-2 text-amber-500" />
                          <span>1470W Total</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Hardware Alerts</div>
                      <div className="space-y-2">
                        <div className="p-2 rounded-md bg-red-500/10 border border-red-500/30 text-xs">
                          <div className="flex items-start">
                            <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                            <div>
                              <div className="font-medium text-red-500">High Temperature Warning</div>
                              <p>Antminer S9 #2 temperature exceeds recommended range (82°C)</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-xs">
                          <div className="flex items-start">
                            <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                            <div>
                              <div className="font-medium text-amber-500">Maintenance Due</div>
                              <p>Antminer S9 #1 is due for fan cleaning (90 days since last maintenance)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance tab */}
            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Mining Performance</CardTitle>
                  <CardDescription>
                    Real-time performance metrics and statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Hashrate History (24h)</h4>
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Hashrate Chart</div>
                        <div className="text-xs text-muted-foreground mt-1">(Visualization would appear here)</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Accepted Shares</div>
                        <div className="text-lg font-semibold">{miningStats.accepted.toLocaleString()}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Rejected Shares</div>
                        <div className="text-lg font-semibold">{miningStats.rejected.toLocaleString()}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Stale Shares</div>
                        <div className="text-lg font-semibold">{miningStats.stale.toLocaleString()}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Acceptance Rate</div>
                        <div className="text-lg font-semibold">
                          {(miningStats.accepted / (miningStats.accepted + miningStats.rejected + miningStats.stale) * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Mining Stats</h4>
                        <div className="text-xs text-muted-foreground">
                          Uptime: {miningStats.uptime}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <BadgeCheck className="h-5 w-5 mr-2 text-green-500" />
                            <div className="text-sm">Pool Connection Status</div>
                          </div>
                          <div className="text-sm font-medium">Connected (3 pools)</div>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <Bitcoin className="h-5 w-5 mr-2 text-cyber-gold" />
                            <div className="text-sm">Blocks Found</div>
                          </div>
                          <div className="text-sm font-medium">{miningStats.blockFound} (Solo mining)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Profitability</CardTitle>
              <CardDescription>
                Expected mining earnings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily</span>
                  <span className="font-medium">${profitability.daily.usd.toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {profitability.daily.btc.toFixed(8)} BTC
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekly</span>
                  <span className="font-medium">${profitability.weekly.usd.toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {profitability.weekly.btc.toFixed(8)} BTC
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly</span>
                  <span className="font-medium">${profitability.monthly.usd.toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {profitability.monthly.btc.toFixed(8)} BTC
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Yearly (projected)</span>
                  <span className="font-medium">${profitability.yearlyProjected.usd.toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {profitability.yearlyProjected.btc.toFixed(8)} BTC
                </div>
              </div>

              <div className="pt-2 border-t text-xs text-muted-foreground">
                <div className="flex justify-between mb-1">
                  <span>Power cost (monthly)</span>
                  <span>-$111.36</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Cloud mining fees (monthly)</span>
                  <span>-$375.00</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Net profit (monthly)</span>
                  <span className="text-green-500">${(profitability.monthly.usd - 111.36 - 375).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full text-xs">
                <TrendingUp className="h-3 w-3 mr-2" />
                View Detailed Profitability
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Wallet</CardTitle>
              <CardDescription>
                Mining rewards and payouts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Wallet Address</div>
                <div className="text-sm font-mono break-all">bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6</div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Pending Balance</div>
                  <div className="text-lg font-semibold">0.00084532 BTC</div>
                  <div className="text-xs text-muted-foreground">≈ $49.45</div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Payout Threshold</div>
                  <div className="text-sm">0.0005 BTC</div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-2">Recent Transactions</div>
                <div className="space-y-2">
                  <div className="text-xs p-2 border rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">Withdrawal</span>
                      <span>2025-05-18</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground truncate max-w-[120px]">tx48a72e...</span>
                      <span className="font-medium">0.00123 BTC</span>
                    </div>
                  </div>

                  <div className="text-xs p-2 border rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">Withdrawal</span>
                      <span>2025-05-10</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground truncate max-w-[120px]">tx93b51f...</span>
                      <span className="font-medium">0.00211 BTC</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full bg-cyber-gold hover:bg-cyber-gold/80 text-dark-matter">
                <Bitcoin className="h-4 w-4 mr-2" />
                Request Withdrawal
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}