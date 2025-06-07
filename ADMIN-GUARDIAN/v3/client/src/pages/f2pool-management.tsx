import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { 
  Server,
  Users,
  BarChart3,
  Settings,
  Globe,
  Coins,
  TrendingUp,
  Activity,
  Zap,
  RefreshCw,
  ExternalLink,
  Copy,
  Play,
  Square,
  Plus
} from 'lucide-react';
import { FaSwimmingPool, FaBitcoin } from 'react-icons/fa';
import { formatCurrency, formatDate } from '@/lib/utils';

interface F2PoolAccount {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  hashrate: number;
  workers: number;
  earnings24h: number;
  totalEarnings: number;
  lastActive: string;
  coin: string;
}

interface F2PoolWorker {
  id: string;
  name: string;
  account: string;
  hashrate: number;
  shares: number;
  lastSeen: string;
  status: 'online' | 'offline';
}

export default function F2PoolManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('accounts');

  // Your main F2Pool mining account
  const [f2poolAccounts] = useState<F2PoolAccount[]>([
    {
      id: 'kloudbugs5',
      name: 'kloudbugs5',
      status: 'active',
      hashrate: 263.6,
      workers: 4,
      earnings24h: 0.00125234,
      totalEarnings: 0.08731456,
      lastActive: new Date(Date.now() - 180000).toISOString(),
      coin: 'BTC'
    }
  ]);

  // Workers connected to your kloudbugs5 account
  const [f2poolWorkers] = useState<F2PoolWorker[]>([
    {
      id: 'worker-001',
      name: 'kloudbugs5.rig001',
      account: 'kloudbugs5',
      hashrate: 75.2,
      shares: 18547,
      lastSeen: new Date(Date.now() - 120000).toISOString(),
      status: 'online'
    },
    {
      id: 'worker-002',
      name: 'kloudbugs5.rig002',
      account: 'kloudbugs5',
      hashrate: 68.4,
      shares: 16823,
      lastSeen: new Date(Date.now() - 180000).toISOString(),
      status: 'online'
    },
    {
      id: 'worker-003',
      name: 'kloudbugs5.rig003',
      account: 'kloudbugs5',
      hashrate: 58.7,
      shares: 14256,
      lastSeen: new Date(Date.now() - 240000).toISOString(),
      status: 'online'
    },
    {
      id: 'worker-004',
      name: 'kloudbugs5.rig004',
      account: 'kloudbugs5',
      hashrate: 61.3,
      shares: 15789,
      lastSeen: new Date(Date.now() - 300000).toISOString(),
      status: 'online'
    }
  ]);

  const copyF2PoolConfig = (account: F2PoolAccount) => {
    const config = `# F2Pool Configuration for ${account.name}
Stratum URL: stratum+tcp://btc.f2pool.com:3333
Username: ${account.name}.worker_name
Password: 123
Coin: ${account.coin}`;
    
    navigator.clipboard.writeText(config);
    toast({
      title: "F2Pool Config Copied",
      description: `Configuration for ${account.name} copied to clipboard`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'inactive': return 'bg-slate-600';
      case 'suspended': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  const getTotalStats = () => {
    const activeAccounts = f2poolAccounts.filter(acc => acc.status === 'active');
    return {
      totalHashrate: activeAccounts.reduce((sum, acc) => sum + acc.hashrate, 0),
      totalWorkers: activeAccounts.reduce((sum, acc) => sum + acc.workers, 0),
      totalEarnings24h: activeAccounts.reduce((sum, acc) => sum + acc.earnings24h, 0),
      activeAccounts: activeAccounts.length
    };
  };

  const stats = getTotalStats();

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaSwimmingPool className="text-blue-500 text-2xl" />
              <h1 className="text-xl font-bold">F2Pool Management</h1>
            </div>
            <Badge variant="outline" className="border-blue-500 text-blue-500">
              {stats.activeAccounts} Active Accounts
            </Badge>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-slate-400">Total Hashrate</div>
              <div className="font-semibold text-blue-500">
                {stats.totalHashrate.toFixed(1)} TH/s
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">24h Earnings</div>
              <div className="font-semibold text-green-500">
                {stats.totalEarnings24h.toFixed(8)} BTC
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 hover:border-slate-500"
              onClick={() => window.open('https://www.f2pool.com/', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              F2Pool Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-slate-900">
            <TabsTrigger value="accounts">Mining Accounts</TabsTrigger>
            <TabsTrigger value="workers">Active Workers</TabsTrigger>
            <TabsTrigger value="earnings">Earnings & Payouts</TabsTrigger>
            <TabsTrigger value="settings">Pool Settings</TabsTrigger>
          </TabsList>

          {/* Mining Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Active Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    {stats.activeAccounts}
                  </div>
                  <div className="text-sm text-slate-400">
                    of {f2poolAccounts.length} total
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Total Hashrate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">
                    {stats.totalHashrate.toFixed(1)} TH/s
                  </div>
                  <div className="text-sm text-slate-400">
                    Combined power
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Active Workers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-500">
                    {stats.totalWorkers}
                  </div>
                  <div className="text-sm text-slate-400">
                    Mining now
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <FaBitcoin className="w-4 h-4 mr-2" />
                    24h Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">
                    {stats.totalEarnings24h.toFixed(8)}
                  </div>
                  <div className="text-sm text-slate-400">
                    BTC earned
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* F2Pool Accounts List */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  Your F2Pool Mining Accounts
                </CardTitle>
                <CardDescription>
                  Manage your F2Pool mining accounts and their configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {f2poolAccounts.map((account) => (
                    <Card key={account.id} className="bg-slate-800 border-slate-600">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(account.status)}`}>
                              <Server className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{account.name}</CardTitle>
                              <CardDescription>F2Pool Account • {account.coin}</CardDescription>
                            </div>
                          </div>
                          <Badge className={getStatusColor(account.status)}>
                            {account.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Hashrate</span>
                            <div className="font-medium">{account.hashrate} TH/s</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Workers</span>
                            <div className="font-medium">{account.workers}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">24h Earnings</span>
                            <div className="font-medium text-green-500">{account.earnings24h.toFixed(8)} {account.coin}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Total Earned</span>
                            <div className="font-medium">{account.totalEarnings.toFixed(8)} {account.coin}</div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-slate-400">
                          Last Active: {formatDate(account.lastActive)}
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button
                            onClick={() => copyF2PoolConfig(account)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy Config
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://www.f2pool.com/mining-user/${account.name}`, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View on F2Pool
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-slate-800 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Plus className="w-4 h-4 mr-2 text-green-500" />
                    Add New Mining Account
                  </h4>
                  <p className="text-sm text-slate-400 mb-3">
                    Create a new F2Pool mining account to organize your workers
                  </p>
                  <Button
                    onClick={() => window.open('https://www.f2pool.com/mining-user/add', '_blank')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Mining Account on F2Pool
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Workers Tab */}
          <TabsContent value="workers" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  Active Workers on F2Pool
                </CardTitle>
                <CardDescription>
                  Monitor all workers currently mining on your F2Pool accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {f2poolWorkers.map((worker) => (
                    <Card key={worker.id} className="bg-slate-800 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${worker.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div>
                              <div className="font-medium">{worker.name}</div>
                              <div className="text-sm text-slate-400">
                                Account: {worker.account} • Last seen: {formatDate(worker.lastSeen)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-6 text-right">
                            <div>
                              <div className="text-sm text-slate-400">Hashrate</div>
                              <div className="font-medium">{worker.hashrate} TH/s</div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-400">Shares</div>
                              <div className="font-medium text-green-500">{worker.shares.toLocaleString()}</div>
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

          {/* Earnings & Payouts Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  F2Pool Earnings & Payouts
                </CardTitle>
                <CardDescription>
                  Track your earnings and payout history from F2Pool
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-500">{stats.totalEarnings24h.toFixed(8)}</div>
                    <div className="text-sm text-slate-400">24h Earnings (BTC)</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {f2poolAccounts.reduce((sum, acc) => sum + acc.totalEarnings, 0).toFixed(8)}
                    </div>
                    <div className="text-sm text-slate-400">Total Earned (BTC)</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {formatCurrency(stats.totalEarnings24h * 58500)}
                    </div>
                    <div className="text-sm text-slate-400">24h USD Value</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-slate-400 mb-4">Detailed earnings and payout history</p>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://www.f2pool.com/earnings', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Earnings on F2Pool
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pool Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-500" />
                  F2Pool Connection Settings
                </CardTitle>
                <CardDescription>
                  Configure your F2Pool mining connections and worker settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Bitcoin (BTC) Mining</h4>
                    <div className="space-y-2 bg-slate-800 p-4 rounded-lg">
                      <div className="text-sm">
                        <span className="text-slate-400">Stratum URL:</span>
                        <div className="font-mono">stratum+tcp://btc.f2pool.com:3333</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Backup URL:</span>
                        <div className="font-mono">stratum+tcp://btc.f2pool.com:25</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Username Format:</span>
                        <div className="font-mono">account_name.worker_name</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Password:</span>
                        <div className="font-mono">x (any value)</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Ethereum (ETH) Mining</h4>
                    <div className="space-y-2 bg-slate-800 p-4 rounded-lg">
                      <div className="text-sm">
                        <span className="text-slate-400">Stratum URL:</span>
                        <div className="font-mono">stratum+tcp://eth.f2pool.com:6688</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Backup URL:</span>
                        <div className="font-mono">stratum+tcp://eth.f2pool.com:8008</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Username Format:</span>
                        <div className="font-mono">account_name.worker_name</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Password:</span>
                        <div className="font-mono">x (any value)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700">
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => window.open('https://www.f2pool.com/help', '_blank')}
                      variant="outline"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      F2Pool Help Center
                    </Button>
                    
                    <Button
                      onClick={() => window.open('https://www.f2pool.com/mining-user', '_blank')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage on F2Pool
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