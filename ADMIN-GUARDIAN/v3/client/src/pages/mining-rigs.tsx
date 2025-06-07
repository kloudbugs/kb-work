import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Server, 
  Cpu, 
  Thermometer, 
  Zap, 
  Activity,
  Settings,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  HardDrive
} from 'lucide-react';

interface MiningRig {
  id: string;
  name: string;
  type: 'ASIC' | 'GPU' | 'CPU';
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  hashrate: number;
  temperature: number;
  powerConsumption: number;
  uptime: string;
  efficiency: number;
  pool: string;
  worker: string;
}

export default function MiningRigsPage() {
  const [rigs, setRigs] = useState<MiningRig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize mining rigs data
    const initializeRigs = () => {
      const rigData: MiningRig[] = [
        {
          id: 'rig-001',
          name: 'TERA Mining Rig Alpha',
          type: 'ASIC',
          status: 'active',
          hashrate: 110.5,
          temperature: 65,
          powerConsumption: 3250,
          uptime: '15d 8h 32m',
          efficiency: 95.2,
          pool: 'NiceHash',
          worker: 'alpha-001'
        },
        {
          id: 'rig-002',
          name: 'TERA Mining Rig Beta',
          type: 'GPU',
          status: 'active',
          hashrate: 85.3,
          temperature: 72,
          powerConsumption: 1850,
          uptime: '12d 4h 15m',
          efficiency: 92.8,
          pool: 'Unmineable',
          worker: 'beta-002'
        },
        {
          id: 'rig-003',
          name: 'TERA Mining Rig Gamma',
          type: 'GPU',
          status: 'maintenance',
          hashrate: 0,
          temperature: 45,
          powerConsumption: 150,
          uptime: '0h 0m',
          efficiency: 0,
          pool: 'F2Pool',
          worker: 'gamma-003'
        },
        {
          id: 'rig-004',
          name: 'TERA Guardian CPU Cluster',
          type: 'CPU',
          status: 'active',
          hashrate: 25.7,
          temperature: 58,
          powerConsumption: 450,
          uptime: '8d 22h 45m',
          efficiency: 88.5,
          pool: 'SlushPool',
          worker: 'cpu-cluster-001'
        }
      ];
      
      setRigs(rigData);
      setIsLoading(false);
    };

    initializeRigs();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRigs(prev => prev.map(rig => ({
        ...rig,
        hashrate: rig.status === 'active' ? 
          Math.max(0, rig.hashrate + (Math.random() - 0.5) * 5) : rig.hashrate,
        temperature: rig.status === 'active' ? 
          Math.max(40, Math.min(85, rig.temperature + (Math.random() - 0.5) * 3)) : rig.temperature,
        powerConsumption: rig.status === 'active' ? 
          Math.max(100, rig.powerConsumption + (Math.random() - 0.5) * 50) : rig.powerConsumption
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'maintenance': return 'bg-orange-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4" />;
      case 'idle': return <Activity className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      case 'offline': return <AlertTriangle className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  const getRigTypeIcon = (type: string) => {
    switch (type) {
      case 'ASIC': return <HardDrive className="h-5 w-5" />;
      case 'GPU': return <Cpu className="h-5 w-5" />;
      case 'CPU': return <Server className="h-5 w-5" />;
      default: return <Server className="h-5 w-5" />;
    }
  };

  const getTotalStats = () => {
    const active = rigs.filter(r => r.status === 'active');
    return {
      totalHashrate: active.reduce((sum, r) => sum + r.hashrate, 0),
      totalPower: active.reduce((sum, r) => sum + r.powerConsumption, 0),
      avgEfficiency: active.length > 0 ? active.reduce((sum, r) => sum + r.efficiency, 0) / active.length : 0,
      activeRigs: active.length
    };
  };

  const stats = getTotalStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-cosmic-blue" />
        <span className="ml-2 text-lg">Loading Mining Rigs...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cosmic-blue to-cosmic-purple bg-clip-text text-transparent">
          Mining Rigs Monitor
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage your TERA Guardian mining hardware
        </p>
      </div>

      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hashrate</CardTitle>
              <Activity className="h-4 w-4 text-cosmic-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHashrate.toFixed(1)} TH/s</div>
              <p className="text-xs text-muted-foreground mt-2">
                Combined mining power
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Power Consumption</CardTitle>
              <Zap className="h-4 w-4 text-cyber-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPower.toFixed(0)}W</div>
              <p className="text-xs text-muted-foreground mt-2">
                Total power usage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgEfficiency.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-2">
                Average rig efficiency
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rigs</CardTitle>
              <Server className="h-4 w-4 text-cosmic-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeRigs}/{rigs.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Rigs online and mining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mining Rigs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rigs.map((rig) => (
            <Card key={rig.id} className="border-2 hover:border-cosmic-blue/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getRigTypeIcon(rig.type)}
                    <div>
                      <CardTitle className="text-lg">{rig.name}</CardTitle>
                      <CardDescription>{rig.type} Mining Rig • ID: {rig.id}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(rig.status)}
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(rig.status)} text-white`}
                    >
                      {rig.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Hashrate</span>
                      <span className="font-mono">{rig.hashrate.toFixed(1)} TH/s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Temperature</span>
                      <span className="font-mono flex items-center">
                        <Thermometer className="h-3 w-3 mr-1" />
                        {rig.temperature}°C
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Power</span>
                      <span className="font-mono">{rig.powerConsumption}W</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Efficiency</span>
                      <span className="font-mono">{rig.efficiency.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Temperature Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Temperature Status</span>
                    <span>{rig.temperature}°C / 85°C</span>
                  </div>
                  <Progress 
                    value={(rig.temperature / 85) * 100} 
                    className={`h-2 ${rig.temperature > 75 ? 'text-red-500' : 'text-green-500'}`} 
                  />
                </div>

                {/* Mining Details */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Pool</span>
                    <span className="font-medium">{rig.pool}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Worker</span>
                    <span className="font-mono">{rig.worker}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span className="font-mono">{rig.uptime}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Activity className="h-3 w-3 mr-1" />
                    Monitor
                  </Button>
                  <Button 
                    variant={rig.status === 'active' ? 'destructive' : 'default'} 
                    size="sm" 
                    className="flex-1"
                  >
                    {rig.status === 'active' ? 'Stop' : 'Start'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Mining Rigs Control Panel</span>
            </CardTitle>
            <CardDescription>
              Manage all your TERA Guardian mining rigs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh All</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Start All Rigs</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Emergency Stop</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Server className="h-4 w-4" />
                <span>Add New Rig</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}