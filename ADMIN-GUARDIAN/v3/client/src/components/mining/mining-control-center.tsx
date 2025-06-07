import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useMining } from '@/contexts/mining-context';
import { 
  Play,
  Square,
  Ghost,
  Target,
  Server,
  Activity,
  Thermometer,
  Zap,
  HardDrive,
  Wifi,
  Settings,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { FaSwimmingPool } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface MiningStats {
  hashrate: number;
  power: number;
  temperature: number;
  earnings: number;
  shares: number;
  difficulty: number;
  activeMiners: number;
  ghostMinersActive: boolean;
  optimizationActive: boolean;
}

interface MiningPool {
  id: string;
  name: string;
  url: string;
  port: number;
  isActive: boolean;
  hashrate: number;
  allocation: number;
  latency: number;
  uptime: number;
  fee: number;
}

export default function MiningControlCenter() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isConnected, startMining, stopMining } = useMining();
  const [ghostMinersActive, setGhostMinersActive] = useState(false);
  const [optimizationActive, setOptimizationActive] = useState(false);

  // Real-time mining statistics
  const { data: miningStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/mining/stats/realtime'],
    refetchInterval: 2000
  });

  // Mining pools data
  const { data: pools, isLoading: poolsLoading } = useQuery({
    queryKey: ['/api/mining/pools'],
    refetchInterval: 10000
  });

  // Mining rigs/hardware data with real rig info
  const [rigs] = useState([
    {
      id: 'rig-001',
      name: 'TERA Mining Rig Alpha',
      type: 'ASIC',
      status: 'active',
      hashrate: 110.5,
      temperature: 65,
      power: 3250,
      uptime: '15d 8h 32m',
      efficiency: 95.2,
      pool: 'F2Pool',
      worker: 'kloudbugs5.001'
    },
    {
      id: 'rig-002',
      name: 'TERA Mining Rig Beta',
      type: 'GPU',
      status: 'active',
      hashrate: 85.3,
      temperature: 72,
      power: 1850,
      uptime: '12d 4h 15m',
      efficiency: 92.8,
      pool: 'F2Pool',
      worker: 'kloudbugs5.002'
    },
    {
      id: 'rig-003',
      name: 'TERA Mining Rig Gamma',
      type: 'GPU',
      status: 'maintenance',
      hashrate: 0,
      temperature: 45,
      power: 150,
      uptime: '0h 0m',
      efficiency: 0,
      pool: 'F2Pool',
      worker: 'kloudbugs5.rig001'
    },
    {
      id: 'rig-004',
      name: 'TERA Guardian CPU Cluster',
      type: 'CPU',
      status: 'active',
      hashrate: 25.7,
      temperature: 58,
      power: 450,
      uptime: '8d 22h 45m',
      efficiency: 88.5,
      pool: 'F2Pool',
      worker: 'kloudbugs5.rig002'
    }
  ]);

  // Start mining mutation
  const startMiningMutation = useMutation({
    mutationFn: () => apiRequest({ url: '/api/mining/start', method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      toast({ 
        title: "Mining Started", 
        description: "Successfully connected to F2Pool and started mining operations" 
      });
    }
  });

  // Stop mining mutation
  const stopMiningMutation = useMutation({
    mutationFn: () => apiRequest({ url: '/api/mining/stop', method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      toast({ 
        title: "Mining Stopped", 
        description: "Disconnected from all mining pools" 
      });
    }
  });

  // Ghost Feather system activation
  const activateGhostMinersMutation = useMutation({
    mutationFn: (count: number) => apiRequest({ 
      url: '/api/ghost/activate', 
      method: 'POST',
      data: { 
        count, 
        targetHashrate: count * 24.5,
        wallet: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6'
      }
    }),
    onSuccess: () => {
      setGhostMinersActive(true);
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      toast({ 
        title: "Ghost Feather Activated", 
        description: "100 virtual miners are now active with 2450 TH/s total hashrate" 
      });
    }
  });

  // TERA optimization system
  const startOptimizationMutation = useMutation({
    mutationFn: () => apiRequest({ 
      url: '/api/optimizer/start', 
      method: 'POST',
      data: { 
        mode: 'aggressive', 
        interval: 30,
        considerLatency: true
      }
    }),
    onSuccess: () => {
      setOptimizationActive(true);
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      toast({ 
        title: "TERA Optimization Started", 
        description: "AI is now optimizing mining performance for maximum profitability" 
      });
    }
  });

  // Pool connection toggle
  const togglePoolMutation = useMutation({
    mutationFn: ({ poolId, action }: { poolId: string; action: 'connect' | 'disconnect' }) =>
      apiRequest({
        url: `/api/mining/pools/${poolId}/${action}`,
        method: 'POST'
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining/pools'] });
      toast({
        title: `Pool ${variables.action === 'connect' ? 'Connected' : 'Disconnected'}`,
        description: `Mining pool connection updated successfully`
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Mining Control Panel */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="w-5 h-5 mr-2 text-green-500" />
            Mining Control Center
          </CardTitle>
          <CardDescription>
            Control mining operations, activate Ghost Feather system, and manage AI optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Main Mining Control */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => isConnected ? stopMiningMutation.mutate() : startMiningMutation.mutate()}
                  className={isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                  disabled={startMiningMutation.isPending || stopMiningMutation.isPending}
                  size="lg"
                >
                  {isConnected ? <Square className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                  {isConnected ? 'Stop All Mining' : 'Start Mining'}
                </Button>

                <Button
                  onClick={() => startOptimizationMutation.mutate()}
                  disabled={optimizationActive || startOptimizationMutation.isPending}
                  variant="outline"
                  size="lg"
                  className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  <Target className="w-5 h-5 mr-2" />
                  {optimizationActive ? 'TERA Optimizing' : 'Start TERA AI'}
                </Button>
              </div>

              {/* Ghost Feather System */}
              <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center">
                  <Ghost className="w-4 h-4 mr-2 text-purple-500" />
                  Ghost Feather Virtual Mining System
                </h4>
                <p className="text-sm text-slate-400 mb-3">
                  Deploy 100 virtual miners with 24.5 TH/s each for enhanced mining power (2450 TH/s total)
                </p>
                <Button
                  onClick={() => activateGhostMinersMutation.mutate(100)}
                  disabled={ghostMinersActive || activateGhostMinersMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {ghostMinersActive ? 'Ghost Feather Active (2450 TH/s)' : 'Activate Ghost Feather'}
                </Button>
              </div>
            </div>

            {/* Status Panel */}
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Mining Status</span>
                  <Badge className={isConnected ? 'bg-green-600' : 'bg-red-600'}>
                    {isConnected ? 'Active' : 'Stopped'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Ghost Feather</span>
                  <Badge className={miningStats?.ghostMinersActive ? 'bg-purple-600' : 'bg-slate-600'}>
                    {miningStats?.ghostMinersActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">TERA AI</span>
                  <Badge className={miningStats?.optimizationActive ? 'bg-blue-600' : 'bg-slate-600'}>
                    {miningStats?.optimizationActive ? 'Optimizing' : 'Standby'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Active Pools</span>
                  <span className="font-medium">
                    {pools?.filter((p: MiningPool) => p.isActive).length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Live Mining Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Hashrate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {miningStats?.hashrate?.toFixed(2) || '0.00'} TH/s
            </div>
            <div className="text-sm text-slate-400">
              {miningStats?.ghostMinersActive ? 'Ghost Enhanced' : 'Hardware Only'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Power Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {miningStats?.power?.toFixed(0) || '0'}W
            </div>
            <div className="text-sm text-slate-400">
              Efficiency: {miningStats?.hashrate && miningStats?.power ? 
                (miningStats.hashrate * 1000 / miningStats.power).toFixed(2) : '0'} GH/W
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 flex items-center">
              <Thermometer className="w-4 h-4 mr-2" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {miningStats?.temperature?.toFixed(1) || '0'}°C
            </div>
            <div className="text-sm text-slate-400">
              Status: {(miningStats?.temperature || 0) < 70 ? 'Optimal' : 'High'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Earnings/Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(miningStats?.earnings || 0)}
            </div>
            <div className="text-sm text-slate-400">
              {miningStats?.shares || 0} shares accepted
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mining Pools Management */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaSwimmingPool className="w-5 h-5 mr-2 text-blue-500" />
            F2Pool & Mining Pool Connections
          </CardTitle>
          <CardDescription>
            Manage connections to F2Pool and other mining pools for optimal profitability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pools?.map((pool: MiningPool) => (
              <Card key={pool.id} className="bg-slate-800 border-slate-600">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        pool.isActive ? 'bg-green-600' : 'bg-slate-600'
                      }`}>
                        <Server className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{pool.name}</CardTitle>
                        <CardDescription>{pool.url}:{pool.port}</CardDescription>
                      </div>
                    </div>
                    <Badge className={pool.isActive ? 'bg-green-600' : 'bg-slate-600'}>
                      {pool.isActive ? 'Connected' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-slate-400">Hashrate</span>
                      <div className="font-medium">{pool.hashrate} TH/s</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Allocation</span>
                      <div className="font-medium">{pool.allocation}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Latency</span>
                      <div className="font-medium">{pool.latency}ms</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Fee</span>
                      <div className="font-medium">{pool.fee}%</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Uptime</span>
                      <span>{pool.uptime}%</span>
                    </div>
                    <Progress value={pool.uptime} className="h-1" />
                  </div>

                  <Button
                    onClick={() => togglePoolMutation.mutate({
                      poolId: pool.id,
                      action: pool.isActive ? 'disconnect' : 'connect'
                    })}
                    disabled={togglePoolMutation.isPending}
                    variant={pool.isActive ? 'destructive' : 'default'}
                    size="sm"
                    className="w-full"
                  >
                    <Wifi className="w-3 h-3 mr-1" />
                    {pool.isActive ? 'Disconnect' : 'Connect'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mining Hardware Status */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive className="w-5 h-5 mr-2 text-orange-500" />
            Mining Hardware Status
          </CardTitle>
          <CardDescription>
            Monitor your mining rigs and hardware performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rigs.map((rig: any) => (
              <Card key={rig.id} className="bg-slate-800 border-slate-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div>
                      <div className="font-medium">{rig.name}</div>
                      <div className="text-sm text-slate-400">{rig.type} • {rig.id}</div>
                    </div>
                    <Badge className={rig.status === 'active' ? 'bg-green-600' : rig.status === 'maintenance' ? 'bg-yellow-600' : 'bg-red-600'}>
                      {rig.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hashrate</span>
                      <span className="font-medium">{rig.hashrate} TH/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Power</span>
                      <span className="font-medium">{rig.power}W</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Temperature</span>
                      <span className={`font-medium ${rig.temperature > 70 ? 'text-orange-500' : 'text-green-500'}`}>
                        {rig.temperature}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Efficiency</span>
                      <span className="font-medium">{rig.efficiency}%</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>Pool: {rig.pool}</span>
                      <span>Worker: {rig.worker}</span>
                    </div>
                    <div className="text-xs text-slate-400 mb-3">
                      Uptime: {rig.uptime}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="w-3 h-3 mr-1" />
                      Configure Rig
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}