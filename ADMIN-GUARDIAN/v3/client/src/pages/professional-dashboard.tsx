import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RealWalletDashboard from "@/components/dashboard/real-wallet-dashboard";
import { 
  Bitcoin, 
  Settings, 
  Activity, 
  Wallet, 
  TrendingUp, 
  Play, 
  Square, 
  RefreshCw,
  Server,
  Zap,
  Monitor
} from 'lucide-react';

export default function ProfessionalDashboard() {
  const [miningStatus, setMiningStatus] = useState<'stopped' | 'running' | 'paused'>('stopped');
  const [selectedPool, setSelectedPool] = useState('');

  const pools = [
    { id: 'nicehash', name: 'NiceHash', fee: '2%', ping: '12ms' },
    { id: 'f2pool', name: 'F2Pool', fee: '2.5%', ping: '8ms' },
    { id: 'antpool', name: 'AntPool', fee: '1%', ping: '15ms' },
    { id: 'slushpool', name: 'Slush Pool', fee: '2%', ping: '10ms' }
  ];

  const toggleMining = () => {
    setMiningStatus(prev => prev === 'running' ? 'stopped' : 'running');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mining Control Center</h1>
              <p className="text-slate-600 dark:text-slate-300">Professional cryptocurrency mining management</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={miningStatus === 'running' ? 'default' : 'secondary'} className="px-3 py-1">
                <Activity className="h-3 w-3 mr-1" />
                {miningStatus === 'running' ? 'Active' : 'Inactive'}
              </Badge>
              <Button
                onClick={toggleMining}
                variant={miningStatus === 'running' ? 'destructive' : 'default'}
                className="gap-2"
              >
                {miningStatus === 'running' ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {miningStatus === 'running' ? 'Stop Mining' : 'Start Mining'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-800 p-1 shadow-sm">
            <TabsTrigger value="overview" className="gap-2">
              <Monitor className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="configuration" className="gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="wallet" className="gap-2">
              <Wallet className="h-4 w-4" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mining Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Mining Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Current Hashrate</span>
                      <span className="font-medium">0.00 TH/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Accepted Shares</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Pool</span>
                      <span className="font-medium">{selectedPool || 'Not selected'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hardware Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Hardware
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Temperature</span>
                      <span className="font-medium">-- °C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Power Draw</span>
                      <span className="font-medium">-- W</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Fan Speed</span>
                      <span className="font-medium">-- RPM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Earnings */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bitcoin className="h-4 w-4" />
                    Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Today</span>
                      <span className="font-medium">0.00000000 BTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">This Week</span>
                      <span className="font-medium">0.00000000 BTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Total</span>
                      <span className="font-medium">0.00000000 BTC</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Server className="h-5 w-5" />
                    <span>Pool Settings</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Wallet className="h-5 w-5" />
                    <span>Wallet Config</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Settings className="h-5 w-5" />
                    <span>Optimize</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <RefreshCw className="h-5 w-5" />
                    <span>Refresh Stats</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pool Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Mining Pool Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pool-select">Select Mining Pool</Label>
                    <Select value={selectedPool} onValueChange={setSelectedPool}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a mining pool" />
                      </SelectTrigger>
                      <SelectContent>
                        {pools.map(pool => (
                          <SelectItem key={pool.id} value={pool.id}>
                            {pool.name} (Fee: {pool.fee}, Ping: {pool.ping})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="worker-name">Worker Name</Label>
                    <Input 
                      id="worker-name" 
                      placeholder="mining-rig-01" 
                      defaultValue="kloud-bugs-miner"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wallet-address">Wallet Address</Label>
                    <Input 
                      id="wallet-address" 
                      placeholder="Bitcoin wallet address"
                      defaultValue="bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6"
                      className="font-mono text-sm"
                    />
                  </div>

                  <Button className="w-full">
                    Save Pool Configuration
                  </Button>
                </CardContent>
              </Card>

              {/* Hardware Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Hardware Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="power-limit">Power Limit (%)</Label>
                    <Input id="power-limit" type="number" placeholder="80" min="50" max="100" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temp-limit">Temperature Limit (°C)</Label>
                    <Input id="temp-limit" type="number" placeholder="85" min="60" max="95" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intensity">Mining Intensity</Label>
                    <Select defaultValue="balanced">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Energy Efficient)</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="high">High Performance</SelectItem>
                        <SelectItem value="extreme">Extreme (Max Hashrate)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    Apply Hardware Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet">
            <RealWalletDashboard />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics data will appear here when mining is active</p>
                  <p className="text-sm mt-2">Start mining to see performance charts and statistics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}