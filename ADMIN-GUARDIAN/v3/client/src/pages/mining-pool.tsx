import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Waves, 
  Zap, 
  TrendingUp, 
  DollarSign,
  Users,
  Settings,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Globe
} from 'lucide-react';

interface MiningPool {
  id: string;
  name: string;
  algorithm: string;
  url: string;
  port: number;
  fee: number;
  hashrate: number;
  miners: number;
  luck: number;
  profitability: number;
  status: 'connected' | 'disconnected' | 'maintenance';
  ping: number;
  region: string;
}

export default function MiningPoolPage() {
  const [pools, setPools] = useState<MiningPool[]>([]);
  const [activePool, setActivePool] = useState<string>('nicehash');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize mining pools data
    const initializePools = () => {
      const poolData: MiningPool[] = [
        {
          id: 'nicehash',
          name: 'NiceHash',
          algorithm: 'SHA-256',
          url: 'stratum+tcp://sha256.auto.nicehash.com',
          port: 3334,
          fee: 2.0,
          hashrate: 125.8,
          miners: 45231,
          luck: 98.5,
          profitability: 105.2,
          status: 'connected',
          ping: 45,
          region: 'US-East'
        },
        {
          id: 'unmineable',
          name: 'Unmineable',
          algorithm: 'RandomX',
          url: 'rx.unmineable.com',
          port: 3333,
          fee: 1.0,
          hashrate: 89.4,
          miners: 23156,
          luck: 102.3,
          profitability: 108.7,
          status: 'connected',
          ping: 52,
          region: 'EU-West'
        },
        {
          id: 'f2pool',
          name: 'F2Pool',
          algorithm: 'SHA-256',
          url: 'stratum+tcp://btc.f2pool.com',
          port: 1314,
          fee: 2.5,
          hashrate: 234.7,
          miners: 89742,
          luck: 95.8,
          profitability: 102.1,
          status: 'connected',
          ping: 78,
          region: 'Asia'
        },
        {
          id: 'slushpool',
          name: 'SlushPool',
          algorithm: 'SHA-256',
          url: 'stratum+tcp://eu.stratum.slushpool.com',
          port: 4444,
          fee: 2.0,
          hashrate: 156.3,
          miners: 34567,
          luck: 100.7,
          profitability: 103.8,
          status: 'maintenance',
          ping: 35,
          region: 'EU-Central'
        },
        {
          id: 'antpool',
          name: 'AntPool',
          algorithm: 'SHA-256',
          url: 'stratum+tcp://stratum.antpool.com',
          port: 3333,
          fee: 2.5,
          hashrate: 298.1,
          miners: 67890,
          luck: 97.2,
          profitability: 101.5,
          status: 'connected',
          ping: 89,
          region: 'Asia'
        }
      ];
      
      setPools(poolData);
      setIsLoading(false);
    };

    initializePools();
    
    // Simulate real-time pool updates
    const interval = setInterval(() => {
      setPools(prev => prev.map(pool => ({
        ...pool,
        hashrate: Math.max(50, pool.hashrate + (Math.random() - 0.5) * 10),
        miners: Math.max(1000, pool.miners + Math.floor((Math.random() - 0.5) * 100)),
        luck: Math.max(80, Math.min(120, pool.luck + (Math.random() - 0.5) * 5)),
        profitability: Math.max(90, Math.min(120, pool.profitability + (Math.random() - 0.5) * 3)),
        ping: Math.max(20, Math.min(150, pool.ping + (Math.random() - 0.5) * 10))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle2 className="h-4 w-4" />;
      case 'disconnected': return <AlertTriangle className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getProfitabilityColor = (profitability: number) => {
    if (profitability >= 105) return 'text-green-500';
    if (profitability >= 100) return 'text-yellow-500';
    return 'text-red-500';
  };

  const connectedPools = pools.filter(p => p.status === 'connected');
  const totalHashrate = connectedPools.reduce((sum, p) => sum + p.hashrate, 0);
  const avgProfitability = connectedPools.length > 0 ? 
    connectedPools.reduce((sum, p) => sum + p.profitability, 0) / connectedPools.length : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-cosmic-blue" />
        <span className="ml-2 text-lg">Loading Mining Pools...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cosmic-blue to-cosmic-purple bg-clip-text text-transparent">
          Mining Pool Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage your TERA Guardian mining pool connections
        </p>
      </div>

      <div className="space-y-6">
        {/* Pool Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Pools</CardTitle>
              <Waves className="h-4 w-4 text-cosmic-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{connectedPools.length}/{pools.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Active pool connections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hashrate</CardTitle>
              <Zap className="h-4 w-4 text-cyber-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHashrate.toFixed(1)} TH/s</div>
              <p className="text-xs text-muted-foreground mt-2">
                Combined pool hashrate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Profitability</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getProfitabilityColor(avgProfitability)}`}>
                {avgProfitability.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Average pool profitability
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Pool</CardTitle>
              <DollarSign className="h-4 w-4 text-cosmic-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pools.find(p => p.id === activePool)?.name || 'None'}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Currently mining on
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pool Management Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Pool Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pools.map((pool) => (
                <Card key={pool.id} className={`border-2 transition-colors ${
                  activePool === pool.id ? 'border-cosmic-blue' : 'hover:border-cosmic-blue/50'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Waves className="h-5 w-5 text-cosmic-blue" />
                        <div>
                          <CardTitle className="text-lg">{pool.name}</CardTitle>
                          <CardDescription>{pool.algorithm} • {pool.region}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(pool.status)}
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(pool.status)} text-white`}
                        >
                          {pool.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Pool Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Hashrate</span>
                          <span className="font-mono">{pool.hashrate.toFixed(1)} TH/s</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Miners</span>
                          <span className="font-mono">{pool.miners.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Fee</span>
                          <span className="font-mono">{pool.fee}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Luck</span>
                          <span className="font-mono">{pool.luck.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Profitability</span>
                          <span className={`font-mono ${getProfitabilityColor(pool.profitability)}`}>
                            {pool.profitability.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Ping</span>
                          <span className="font-mono">{pool.ping}ms</span>
                        </div>
                      </div>
                    </div>

                    {/* Connection Details */}
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>URL</span>
                        <span className="font-mono text-xs">{pool.url}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Port</span>
                        <span className="font-mono">{pool.port}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant={activePool === pool.id ? 'default' : 'outline'} 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setActivePool(pool.id)}
                        disabled={pool.status !== 'connected'}
                      >
                        {activePool === pool.id ? 'Active' : 'Select'}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pool Performance Comparison</CardTitle>
                <CardDescription>Compare profitability and performance across all pools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pools.map((pool) => (
                    <div key={pool.id} className="flex items-center space-x-4">
                      <div className="w-24 text-sm font-medium">{pool.name}</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Profitability</span>
                          <span className={getProfitabilityColor(pool.profitability)}>
                            {pool.profitability.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={pool.profitability} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pool Configuration</CardTitle>
                <CardDescription>Manage your mining pool settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4" />
                      <span>Refresh All Pools</span>
                    </Button>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Waves className="h-4 w-4" />
                      <span>Add New Pool</span>
                    </Button>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Auto-Switch Pools</span>
                    </Button>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Pool Preferences</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}