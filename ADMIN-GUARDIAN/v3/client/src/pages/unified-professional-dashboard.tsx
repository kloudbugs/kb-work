import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useMining } from '@/contexts/mining-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Bot, 
  Zap, 
  Shield, 
  DollarSign, 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Settings,
  Play,
  Square,
  Ghost,
  Target,
  TrendingUp,
  Wallet,
  FaBitcoin,
  Server,
  BarChart3,
  Eye,
  ChevronRight,
  Coins,
  Users
} from 'lucide-react';
import { FaBitcoin, FaUser, FaSwimmingPool } from 'react-icons/fa';
import { formatCurrency, formatDate } from '@/lib/utils';

// Types for TERA Guardian system
interface TeraGuardian {
  id: number;
  name: string;
  role: string;
  status: string;
  aiLoadLevel: number;
  processingPower: number;
  capabilities: string[];
  accessLevel: string;
  lastUpdate: string;
}

interface MiningStats {
  hashrate: number;
  power: number;
  temperature: number;
  earnings: number;
  shares: number;
  ghostMinersActive: boolean;
  optimizationActive: boolean;
  difficulty: number;
  activeMiners: number;
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

export default function UnifiedProfessionalDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isConnected, startMining, stopMining } = useMining();
  const [activeTab, setActiveTab] = useState('overview');
  const [ghostMinersActive, setGhostMinersActive] = useState(false);
  const [optimizationActive, setOptimizationActive] = useState(false);

  // Real-time mining data query
  const { data: miningStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/mining/stats/realtime'],
    refetchInterval: 2000
  });

  // TERA Guardian system query
  const { data: guardians, isLoading: guardiansLoading } = useQuery({
    queryKey: ['/api/tera/guardians']
  });

  // Mining pools query
  const { data: pools, isLoading: poolsLoading } = useQuery({
    queryKey: ['/api/mining/pools']
  });

  // User profile and balance
  const { data: user } = useQuery({
    queryKey: ['/api/user/profile']
  });

  // Mining rewards query
  const { data: rewards } = useQuery({
    queryKey: ['/api/mining/rewards'],
    refetchInterval: 30000
  });

  // Mutations for mining operations
  const startMiningMutation = useMutation({
    mutationFn: () => apiRequest({ url: '/api/mining/start', method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      toast({ title: "Mining Started", description: "Successfully connected to F2Pool" });
    }
  });

  const stopMiningMutation = useMutation({
    mutationFn: () => apiRequest({ url: '/api/mining/stop', method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      toast({ title: "Mining Stopped", description: "Disconnected from mining pools" });
    }
  });

  // Ghost Feather system activation
  const activateGhostMinersMutation = useMutation({
    mutationFn: (count: number) => apiRequest({ 
      url: '/api/ghost/activate', 
      method: 'POST',
      data: { count, targetHashrate: count * 24.5 }
    }),
    onSuccess: () => {
      setGhostMinersActive(true);
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      toast({ title: "Ghost Feather Activated", description: "100 virtual miners are now active" });
    }
  });

  // TERA optimization system
  const startOptimizationMutation = useMutation({
    mutationFn: () => apiRequest({ 
      url: '/api/optimizer/start', 
      method: 'POST',
      data: { mode: 'aggressive', interval: 30 }
    }),
    onSuccess: () => {
      setOptimizationActive(true);
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      toast({ title: "TERA Optimization Started", description: "AI is optimizing mining performance" });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'standby': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'PLATFORM_OVERSEER': return <Shield className="w-5 h-5" />;
      case 'MINING_SPECIALIST': return <Cpu className="w-5 h-5" />;
      case 'SECURITY_SPECIALIST': return <Shield className="w-5 h-5" />;
      case 'FINANCE_SPECIALIST': return <DollarSign className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Professional Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaBitcoin className="text-orange-500 text-2xl" />
              <h1 className="text-xl font-bold">TERA Mining Platform</h1>
            </div>
            <Badge variant="outline" className="border-green-500 text-green-500">
              {isConnected ? 'Connected' : 'Offline'}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-slate-400">Total Balance</div>
              <div className="font-semibold text-orange-500">
                {user?.balance?.toFixed(8) || '0.00000000'} BTC
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">24h Earnings</div>
              <div className="font-semibold text-green-500">
                {formatCurrency(miningStats?.earnings * 24 || 0)}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 hover:border-slate-500"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-6 bg-slate-900">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="guardians">TERA Guardians</TabsTrigger>
            <TabsTrigger value="mining">Mining Control</TabsTrigger>
            <TabsTrigger value="pools">F2Pool & Pools</TabsTrigger>
            <TabsTrigger value="wallet">Wallet & Payouts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Mining Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">Mining Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-2xl font-bold ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                        {isConnected ? 'Active' : 'Stopped'}
                      </div>
                      <div className="text-sm text-slate-400">
                        {isConnected ? 'Connected to F2Pool' : 'Disconnected'}
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">Hashrate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">
                    {miningStats?.hashrate?.toFixed(2) || '0.00'} TH/s
                  </div>
                  <div className="text-sm text-slate-400">
                    {miningStats?.ghostMinersActive ? 'Ghost Feather Active' : 'Hardware Only'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">Power Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">
                    {miningStats?.power?.toFixed(0) || '0'}W
                  </div>
                  <div className="text-sm text-slate-400">
                    Temp: {miningStats?.temperature?.toFixed(1) || '0'}°C
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">Hourly Earnings</CardTitle>
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

            {/* Quick Actions */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>Quick Mining Controls</CardTitle>
                <CardDescription>Start mining, activate Ghost Feather system, or enable TERA optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => isConnected ? stopMiningMutation.mutate() : startMiningMutation.mutate()}
                    className={isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                    disabled={startMiningMutation.isPending || stopMiningMutation.isPending}
                  >
                    {isConnected ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isConnected ? 'Stop Mining' : 'Start Mining'}
                  </Button>

                  <Button
                    onClick={() => activateGhostMinersMutation.mutate(100)}
                    disabled={ghostMinersActive || activateGhostMinersMutation.isPending}
                    variant="outline"
                    className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                  >
                    <Ghost className="w-4 h-4 mr-2" />
                    {ghostMinersActive ? 'Ghost Feather Active' : 'Activate Ghost Feather'}
                  </Button>

                  <Button
                    onClick={() => startOptimizationMutation.mutate()}
                    disabled={optimizationActive || startOptimizationMutation.isPending}
                    variant="outline"
                    className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    {optimizationActive ? 'TERA Optimizing' : 'Start TERA AI'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Guardians Summary */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-blue-500" />
                  TERA Guardian Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {guardians?.slice(0, 4).map((guardian: TeraGuardian) => (
                    <div key={guardian.id} className="p-4 bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(guardian.role)}
                          <span className="font-medium text-sm">{guardian.name}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(guardian.status)}`} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">AI Load</span>
                          <span>{guardian.aiLoadLevel}%</span>
                        </div>
                        <Progress value={guardian.aiLoadLevel} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TERA Guardians Tab */}
          <TabsContent value="guardians" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-500" />
                  TERA Guardian AI System
                </CardTitle>
                <CardDescription>
                  Advanced AI entities managing your mining operations, security, and optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {guardians?.map((guardian: TeraGuardian) => (
                    <Card key={guardian.id} className="bg-slate-800 border-slate-600">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getRoleIcon(guardian.role)}
                            <div>
                              <CardTitle className="text-lg">{guardian.name}</CardTitle>
                              <CardDescription className="text-slate-400">
                                {guardian.role.replace('_', ' ')}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(guardian.status)} text-white`}>
                            {guardian.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-slate-400 mb-1">AI Load Level</div>
                            <div className="flex items-center space-x-2">
                              <Progress value={guardian.aiLoadLevel} className="flex-1" />
                              <span className="text-sm font-medium">{guardian.aiLoadLevel}%</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-400 mb-1">Processing Power</div>
                            <div className="flex items-center space-x-2">
                              <Progress value={guardian.processingPower} className="flex-1" />
                              <span className="text-sm font-medium">{guardian.processingPower}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-slate-400 mb-2">Capabilities</div>
                          <div className="flex flex-wrap gap-1">
                            {guardian.capabilities.map((capability, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {capability.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-xs text-slate-500">
                          Last Update: {formatDate(guardian.lastUpdate)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mining Control Tab */}
          <TabsContent value="mining" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mining Controls */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle>Mining Operations</CardTitle>
                    <CardDescription>Control your mining hardware and virtual systems</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        TERA Optimization
                      </Button>
                    </div>

                    <div className="p-4 bg-slate-800 rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center">
                        <Ghost className="w-4 h-4 mr-2 text-purple-500" />
                        Ghost Feather System
                      </h4>
                      <p className="text-sm text-slate-400 mb-3">
                        Deploy 100 virtual miners with 24.5 TH/s each for enhanced mining power
                      </p>
                      <Button
                        onClick={() => activateGhostMinersMutation.mutate(100)}
                        disabled={ghostMinersActive || activateGhostMinersMutation.isPending}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {ghostMinersActive ? 'Ghost Feather Active (2450 TH/s)' : 'Activate Ghost Feather'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mining Stats */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Live Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hashrate</span>
                      <span className="font-medium text-blue-500">
                        {miningStats?.hashrate?.toFixed(2) || '0.00'} TH/s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Power</span>
                      <span className="font-medium text-yellow-500">
                        {miningStats?.power?.toFixed(0) || '0'}W
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Temperature</span>
                      <span className="font-medium">
                        {miningStats?.temperature?.toFixed(1) || '0'}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Difficulty</span>
                      <span className="font-medium">
                        {miningStats?.difficulty?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Shares</span>
                      <span className="font-medium text-green-500">
                        {miningStats?.shares || 0}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Ghost Feather</span>
                        <Badge className={miningStats?.ghostMinersActive ? 'bg-purple-600' : 'bg-slate-600'}>
                          {miningStats?.ghostMinersActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">TERA AI</span>
                        <Badge className={miningStats?.optimizationActive ? 'bg-blue-600' : 'bg-slate-600'}>
                          {miningStats?.optimizationActive ? 'Optimizing' : 'Standby'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* F2Pool & Pools Tab */}
          <TabsContent value="pools" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaSwimmingPool className="w-5 h-5 mr-2 text-blue-500" />
                  Mining Pool Connections
                </CardTitle>
                <CardDescription>
                  Manage connections to F2Pool and other mining pools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pools?.map((pool: MiningPool) => (
                    <Card key={pool.id} className="bg-slate-800 border-slate-600">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
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
                        <div className="grid grid-cols-2 gap-4 text-sm">
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
                        <div className="mt-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">Uptime</span>
                            <span>{pool.uptime}%</span>
                          </div>
                          <Progress value={pool.uptime} className="h-1" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet & Payouts Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="w-5 h-5 mr-2 text-orange-500" />
                    Bitcoin Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <div className="text-sm text-slate-400 mb-1">Current Balance</div>
                      <div className="text-2xl font-bold text-orange-500">
                        {user?.balance?.toFixed(8) || '0.00000000'} BTC
                      </div>
                      <div className="text-sm text-slate-400">
                        ≈ {formatCurrency((user?.balance || 0) * 58500)}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <div className="text-sm text-slate-400 mb-1">Wallet Address</div>
                      <div className="font-mono text-sm bg-slate-700 p-2 rounded break-all">
                        bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6
                      </div>
                    </div>

                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Withdraw to External Wallet
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Recent Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {rewards?.slice(0, 5).map((reward: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                        <div>
                          <div className="font-medium">{reward.amount.toFixed(8)} BTC</div>
                          <div className="text-sm text-slate-400">
                            {formatDate(reward.timestamp)}
                          </div>
                        </div>
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          {reward.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                  Mining Analytics
                </CardTitle>
                <CardDescription>
                  Performance metrics and profitability analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Profitability</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Daily</span>
                        <span className="font-medium text-green-500">
                          {formatCurrency((miningStats?.earnings || 0) * 24)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Weekly</span>
                        <span className="font-medium text-green-500">
                          {formatCurrency((miningStats?.earnings || 0) * 24 * 7)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Monthly</span>
                        <span className="font-medium text-green-500">
                          {formatCurrency((miningStats?.earnings || 0) * 24 * 30)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Efficiency</span>
                        <span className="font-medium">95.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Uptime</span>
                        <span className="font-medium text-green-500">99.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avg Hashrate</span>
                        <span className="font-medium text-blue-500">
                          {miningStats?.hashrate?.toFixed(2) || '0.00'} TH/s
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">System Status</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active Guardians</span>
                        <span className="font-medium">
                          {guardians?.filter((g: TeraGuardian) => g.status === 'active').length || 0}/4
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pool Connections</span>
                        <span className="font-medium">
                          {pools?.filter((p: MiningPool) => p.isActive).length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">AI Optimization</span>
                        <span className={`font-medium ${optimizationActive ? 'text-green-500' : 'text-slate-400'}`}>
                          {optimizationActive ? 'Active' : 'Standby'}
                        </span>
                      </div>
                    </div>
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