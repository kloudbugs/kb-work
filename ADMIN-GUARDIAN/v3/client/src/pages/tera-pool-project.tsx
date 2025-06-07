import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Server,
  Users,
  BarChart3,
  Settings,
  Globe,
  Shield,
  Coins,
  TrendingUp,
  Database,
  Activity,
  Zap,
  RefreshCw,
  ExternalLink,
  Copy,
  Play,
  Square
} from 'lucide-react';
import { FaSwimmingPool, FaBitcoin } from 'react-icons/fa';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PoolStats {
  totalHashrate: number;
  activeMiners: number;
  totalBlocks: number;
  totalPayout: number;
  poolFee: number;
  difficulty: number;
  networkHashrate: number;
  luck: number;
}

interface PoolMiner {
  id: string;
  address: string;
  hashrate: number;
  shares: number;
  lastSeen: string;
  earnings: number;
  status: 'active' | 'inactive';
}

export default function TeraPoolProject() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [poolRunning, setPoolRunning] = useState(false);

  // Pool statistics
  const [poolStats] = useState<PoolStats>({
    totalHashrate: 2847.5,
    activeMiners: 156,
    totalBlocks: 42,
    totalPayout: 12.58947263,
    poolFee: 1.0,
    difficulty: 73945821.45,
    networkHashrate: 568.2,
    luck: 103.7
  });

  // Active miners on TERA Pool
  const [miners] = useState<PoolMiner[]>([
    {
      id: 'miner-001',
      address: 'kloudbugs5.terapool001',
      hashrate: 110.5,
      shares: 15847,
      lastSeen: new Date(Date.now() - 300000).toISOString(),
      earnings: 0.00234567,
      status: 'active'
    },
    {
      id: 'miner-002', 
      address: 'bc1q9x8s4n2m3p7k5j8h9f2d6g4s1a3e7r9t0y8u6i',
      hashrate: 85.3,
      shares: 12456,
      lastSeen: new Date(Date.now() - 180000).toISOString(),
      earnings: 0.00198734,
      status: 'active'
    },
    {
      id: 'miner-003',
      address: 'bc1qw2e4r6t8y0u2i4o6p8a0s2d4f6g8h0j2k4l6n8',
      hashrate: 67.8,
      shares: 9823,
      lastSeen: new Date(Date.now() - 120000).toISOString(),
      earnings: 0.00156892,
      status: 'active'
    }
  ]);

  // Mining rental configurations from various services
  const [rentalConfigs] = useState([
    {
      service: 'NiceHash',
      algorithm: 'SHA-256',
      price: '0.0045 BTC/TH/day',
      availability: 'High',
      minOrder: '1 TH/s',
      maxOrder: '1000 TH/s'
    },
    {
      service: 'MiningRigRentals',
      algorithm: 'SHA-256', 
      price: '0.0042 BTC/TH/day',
      availability: 'Medium',
      minOrder: '5 TH/s',
      maxOrder: '500 TH/s'
    },
    {
      service: 'WestHash',
      algorithm: 'SHA-256',
      price: '0.0047 BTC/TH/day', 
      availability: 'Low',
      minOrder: '10 TH/s',
      maxOrder: '250 TH/s'
    }
  ]);

  const startPool = () => {
    setPoolRunning(true);
    toast({
      title: "TERA Pool Started",
      description: "Your mining pool is now accepting connections"
    });
  };

  const stopPool = () => {
    setPoolRunning(false);
    toast({
      title: "TERA Pool Stopped", 
      description: "Pool has been safely shut down"
    });
  };

  const copyPoolConfig = () => {
    const config = `# TERA Pool Configuration
stratum+tcp://pool.tera-mining.com:3333
Username: bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6.worker1
Password: x
Fee: ${poolStats.poolFee}%`;
    
    navigator.clipboard.writeText(config);
    toast({
      title: "Configuration Copied",
      description: "TERA Pool stratum configuration copied to clipboard"
    });
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaSwimmingPool className="text-blue-500 text-2xl" />
              <h1 className="text-xl font-bold">TERA Pool Project</h1>
            </div>
            <Badge variant="outline" className={`${poolRunning ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
              {poolRunning ? 'Pool Running' : 'Pool Stopped'}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-slate-400">Pool Hashrate</div>
              <div className="font-semibold text-blue-500">
                {poolStats.totalHashrate.toFixed(1)} TH/s
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Active Miners</div>
              <div className="font-semibold text-green-500">
                {poolStats.activeMiners}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6 bg-slate-900">
            <TabsTrigger value="overview">Pool Overview</TabsTrigger>
            <TabsTrigger value="miners">Active Miners</TabsTrigger>
            <TabsTrigger value="blocks">Blocks & Payouts</TabsTrigger>
            <TabsTrigger value="rentals">Mining Rentals</TabsTrigger>
            <TabsTrigger value="settings">Pool Settings</TabsTrigger>
          </TabsList>

          {/* Pool Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* Pool Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Total Hashrate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">
                    {poolStats.totalHashrate.toFixed(1)} TH/s
                  </div>
                  <div className="text-sm text-slate-400">
                    Network: {poolStats.networkHashrate.toFixed(1)} EH/s
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Active Miners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    {poolStats.activeMiners}
                  </div>
                  <div className="text-sm text-slate-400">
                    Online Now
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Blocks Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">
                    {poolStats.totalBlocks}
                  </div>
                  <div className="text-sm text-slate-400">
                    Luck: {poolStats.luck}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <FaBitcoin className="w-4 h-4 mr-2" />
                    Total Payouts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">
                    {poolStats.totalPayout.toFixed(8)}
                  </div>
                  <div className="text-sm text-slate-400">
                    BTC Distributed
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pool Control Panel */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="w-5 h-5 mr-2 text-blue-500" />
                  TERA Pool Control Panel
                </CardTitle>
                <CardDescription>
                  Manage your Bitcoin mining pool operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Pool Operations</h4>
                    <div className="space-y-3">
                      <Button
                        onClick={poolRunning ? stopPool : startPool}
                        className={poolRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                        size="lg"
                      >
                        {poolRunning ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {poolRunning ? 'Stop Pool' : 'Start Pool'}
                      </Button>
                      
                      <Button variant="outline" onClick={copyPoolConfig} className="w-full">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Pool Configuration
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Connection Details</h4>
                    <div className="space-y-2 bg-slate-800 p-4 rounded-lg">
                      <div className="text-sm">
                        <span className="text-slate-400">F2Pool Stratum:</span>
                        <div className="font-mono">stratum+tcp://btc.f2pool.com:3333</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Username:</span>
                        <div className="font-mono">kloudbugs5.worker_name</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Password:</span>
                        <div className="font-mono">123</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Pool Fee:</span>
                        <div className="font-mono">{poolStats.poolFee}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pool Statistics */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  Pool Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Mining Efficiency</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Pool Luck</span>
                        <span className={poolStats.luck > 100 ? 'text-green-500' : 'text-orange-500'}>
                          {poolStats.luck}%
                        </span>
                      </div>
                      <Progress value={Math.min(poolStats.luck, 150)} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Network Share</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Pool Share</span>
                        <span>{((poolStats.totalHashrate / (poolStats.networkHashrate * 1000)) * 100).toFixed(3)}%</span>
                      </div>
                      <Progress value={((poolStats.totalHashrate / (poolStats.networkHashrate * 1000)) * 100) * 10} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Profitability</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Daily Revenue</span>
                        <span className="text-green-500">{formatCurrency(poolStats.totalPayout * 0.1 * 58500)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Pool Fee Income</span>
                        <span className="text-blue-500">{formatCurrency(poolStats.totalPayout * 0.01 * 58500)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Miners */}
          <TabsContent value="miners" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-500" />
                  Active Miners on TERA Pool
                </CardTitle>
                <CardDescription>
                  Monitor all miners currently connected to your pool
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {miners.map((miner) => (
                    <Card key={miner.id} className="bg-slate-800 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${miner.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div>
                              <div className="font-mono text-sm">{miner.address}</div>
                              <div className="text-xs text-slate-400">
                                Last seen: {formatDate(miner.lastSeen)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-6 text-right">
                            <div>
                              <div className="text-sm text-slate-400">Hashrate</div>
                              <div className="font-medium">{miner.hashrate} TH/s</div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-400">Shares</div>
                              <div className="font-medium">{miner.shares.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-400">Earnings</div>
                              <div className="font-medium text-green-500">{miner.earnings.toFixed(8)} BTC</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mining Rentals */}
          <TabsContent value="rentals" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Mining Rental Integrations
                </CardTitle>
                <CardDescription>
                  Connect with mining rental services to boost your pool's hashrate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rentalConfigs.map((config, index) => (
                    <Card key={index} className="bg-slate-800 border-slate-600">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{config.service}</CardTitle>
                        <CardDescription>{config.algorithm}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Price</span>
                            <span className="font-medium">{config.price}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Availability</span>
                            <Badge className={
                              config.availability === 'High' ? 'bg-green-600' :
                              config.availability === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                            }>
                              {config.availability}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Min Order</span>
                            <span className="font-medium">{config.minOrder}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Max Order</span>
                            <span className="font-medium">{config.maxOrder}</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Connect {config.service}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rental API Configuration */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-500" />
                  API Configuration for Mining Rentals
                </CardTitle>
                <CardDescription>
                  Configure API connections for automated rental management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">NiceHash API</h4>
                    <div className="space-y-2">
                      <Label htmlFor="nicehash-key">API Key</Label>
                      <Input
                        id="nicehash-key"
                        type="password"
                        placeholder="Enter NiceHash API key"
                        className="bg-slate-800 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nicehash-secret">API Secret</Label>
                      <Input
                        id="nicehash-secret"
                        type="password"
                        placeholder="Enter NiceHash API secret"
                        className="bg-slate-800 border-slate-600"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      Test NiceHash Connection
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">MiningRigRentals API</h4>
                    <div className="space-y-2">
                      <Label htmlFor="mrr-key">API Key</Label>
                      <Input
                        id="mrr-key"
                        type="password"
                        placeholder="Enter MRR API key"
                        className="bg-slate-800 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mrr-secret">API Secret</Label>
                      <Input
                        id="mrr-secret"
                        type="password"
                        placeholder="Enter MRR API secret"
                        className="bg-slate-800 border-slate-600"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      Test MRR Connection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blocks & Payouts */}
          <TabsContent value="blocks" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2 text-orange-500" />
                  Block History & Payouts
                </CardTitle>
                <CardDescription>
                  Track blocks found and payout distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-800 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-500">{poolStats.totalBlocks}</div>
                      <div className="text-sm text-slate-400">Total Blocks Found</div>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-500">{poolStats.totalPayout.toFixed(8)}</div>
                      <div className="text-sm text-slate-400">BTC Distributed</div>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-500">{poolStats.luck}%</div>
                      <div className="text-sm text-slate-400">Pool Luck</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-slate-400 mb-4">Block history and detailed payout information will be displayed here</p>
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Block Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pool Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-500" />
                  Pool Configuration Settings
                </CardTitle>
                <CardDescription>
                  Configure your TERA mining pool parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Basic Settings</h4>
                    <div className="space-y-2">
                      <Label htmlFor="pool-fee">Pool Fee (%)</Label>
                      <Input
                        id="pool-fee"
                        type="number"
                        step="0.1"
                        value={poolStats.poolFee}
                        className="bg-slate-800 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min-difficulty">Minimum Difficulty</Label>
                      <Input
                        id="min-difficulty"
                        type="number"
                        value="1024"
                        className="bg-slate-800 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payout-threshold">Payout Threshold (BTC)</Label>
                      <Input
                        id="payout-threshold"
                        type="number"
                        step="0.00000001"
                        value="0.001"
                        className="bg-slate-800 border-slate-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Advanced Settings</h4>
                    <div className="space-y-2">
                      <Label htmlFor="vardiff-min">Variable Difficulty Min</Label>
                      <Input
                        id="vardiff-min"
                        type="number"
                        value="512"
                        className="bg-slate-800 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vardiff-max">Variable Difficulty Max</Label>
                      <Input
                        id="vardiff-max"
                        type="number"
                        value="16384"
                        className="bg-slate-800 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retarget-time">Retarget Time (seconds)</Label>
                      <Input
                        id="retarget-time"
                        type="number"
                        value="90"
                        className="bg-slate-800 border-slate-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Save Pool Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}