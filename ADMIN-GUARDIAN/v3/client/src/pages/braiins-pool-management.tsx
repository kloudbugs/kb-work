import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Server, 
  Hash, 
  RefreshCw, 
  Settings,
  Wifi,
  AlertCircle,
  CheckCircle2,
  Copy,
  Plus,
  Trash2,
  Activity,
  DollarSign,
  Zap,
  Shield
} from 'lucide-react';

interface BraiinsWorker {
  id: string;
  name: string;
  url: string;
  port: number;
  username: string;
  password: string;
  status: 'connected' | 'disconnected' | 'error';
  hashrate: number;
  efficiency: number;
  shares: {
    accepted: number;
    rejected: number;
  };
  lastSeen: string;
  earnings: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

interface BraiinsPool {
  name: string;
  url: string;
  port: number;
  protocol: 'V1' | 'V2';
  fee: number;
  description: string;
}

const BRAIINS_POOLS: BraiinsPool[] = [
  {
    name: 'Braiins Pool V1',
    url: 'stratum+tcp://stratum.braiins.com',
    port: 3333,
    protocol: 'V1',
    fee: 2.5,
    description: 'Standard Stratum V1 protocol with PPLNS rewards'
  },
  {
    name: 'Braiins Pool V2',
    url: 'stratum2+tcp://v2.stratum.braiins.com/u95GEReVMjK6k5YqiSFNqqTnKU4ypU2Wm8awa6tmbmDmk1bWt',
    port: 3333,
    protocol: 'V2',
    fee: 2.0,
    description: 'Advanced Stratum V2 protocol with enhanced security and efficiency'
  },
  {
    name: 'Braiins Pool EU',
    url: 'stratum+tcp://eu.stratum.braiins.com',
    port: 3333,
    protocol: 'V1',
    fee: 2.5,
    description: 'European server for reduced latency'
  },
  {
    name: 'Braiins Pool US',
    url: 'stratum+tcp://us-east.stratum.braiins.com',
    port: 3333,
    protocol: 'V1',
    fee: 2.5,
    description: 'US East server for American miners'
  }
];

export default function BraiinsPoolManagement() {
  const [workers, setWorkers] = useState<BraiinsWorker[]>([
    {
      id: 'braiins-1',
      name: 'Tera Worker 1',
      url: 'stratum+tcp://stratum.braiins.com',
      port: 3333,
      username: 'kloudbugs5',
      password: 'anything123',
      status: 'connected',
      hashrate: 28.5,
      efficiency: 98.2,
      shares: { accepted: 1456, rejected: 23 },
      lastSeen: new Date().toISOString(),
      earnings: { daily: 0.00085, weekly: 0.00595, monthly: 0.02550 }
    },
    {
      id: 'braiins-2',
      name: 'Tera Worker 2',
      url: 'stratum2+tcp://v2.stratum.braiins.com/u95GEReVMjK6k5YqiSFNqqTnKU4ypU2Wm8awa6tmbmDmk1bWt',
      port: 3333,
      username: 'kloudbugs5',
      password: 'anything123',
      status: 'connected',
      hashrate: 31.2,
      efficiency: 99.1,
      shares: { accepted: 1789, rejected: 15 },
      lastSeen: new Date().toISOString(),
      earnings: { daily: 0.00093, weekly: 0.00651, monthly: 0.02790 }
    }
  ]);

  const [selectedPool, setSelectedPool] = useState<string>('Braiins Pool V1');
  const [newWorker, setNewWorker] = useState({
    name: '',
    username: 'kloudbugs5',
    password: 'anything123'
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [poolStats, setPoolStats] = useState({
    totalHashrate: 0,
    totalWorkers: 0,
    efficiency: 0,
    dailyEarnings: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    // Calculate pool statistics
    const totalHashrate = workers.reduce((sum, worker) => sum + worker.hashrate, 0);
    const totalWorkers = workers.filter(w => w.status === 'connected').length;
    const avgEfficiency = workers.length > 0 
      ? workers.reduce((sum, worker) => sum + worker.efficiency, 0) / workers.length
      : 0;
    const dailyEarnings = workers.reduce((sum, worker) => sum + worker.earnings.daily, 0);

    setPoolStats({
      totalHashrate,
      totalWorkers,
      efficiency: avgEfficiency,
      dailyEarnings
    });

    // Simulate real-time updates
    const interval = setInterval(() => {
      setWorkers(prev => prev.map(worker => ({
        ...worker,
        hashrate: worker.hashrate + (Math.random() - 0.5) * 2,
        efficiency: Math.min(100, Math.max(95, worker.efficiency + (Math.random() - 0.5) * 0.5)),
        shares: {
          accepted: worker.shares.accepted + Math.floor(Math.random() * 3),
          rejected: worker.shares.rejected + (Math.random() < 0.1 ? 1 : 0)
        }
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [workers.length]);

  const addWorker = () => {
    if (!newWorker.name) {
      toast({
        title: "Missing Information",
        description: "Please provide a worker name",
        variant: "destructive"
      });
      return;
    }

    const selectedPoolConfig = BRAIINS_POOLS.find(p => p.name === selectedPool) || BRAIINS_POOLS[0];
    
    const worker: BraiinsWorker = {
      id: `braiins-${Date.now()}`,
      name: newWorker.name,
      url: selectedPoolConfig.url,
      port: selectedPoolConfig.port,
      username: newWorker.username,
      password: newWorker.password,
      status: 'disconnected',
      hashrate: 0,
      efficiency: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString(),
      earnings: { daily: 0, weekly: 0, monthly: 0 }
    };

    setWorkers(prev => [...prev, worker]);
    setNewWorker({ name: '', username: 'kloudbugs5', password: 'anything123' });

    toast({
      title: "Worker Added",
      description: `${worker.name} has been added to Braiins Pool`,
    });
  };

  const connectWorker = async (workerId: string) => {
    setIsLoading(true);
    try {
      setWorkers(prev => prev.map(w => 
        w.id === workerId 
          ? { 
              ...w, 
              status: 'connected', 
              hashrate: 25 + Math.random() * 10,
              efficiency: 95 + Math.random() * 4,
              lastSeen: new Date().toISOString() 
            }
          : w
      ));

      toast({
        title: "Worker Connected",
        description: "Successfully connected to Braiins Pool",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect worker to Braiins Pool",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWorker = (workerId: string) => {
    setWorkers(prev => prev.map(w => 
      w.id === workerId 
        ? { ...w, status: 'disconnected', hashrate: 0, efficiency: 0 }
        : w
    ));

    toast({
      title: "Worker Disconnected",
      description: "Worker has been disconnected from Braiins Pool",
    });
  };

  const removeWorker = (workerId: string) => {
    setWorkers(prev => prev.filter(w => w.id !== workerId));
    toast({
      title: "Worker Removed",
      description: "Worker has been removed from your Braiins Pool setup",
    });
  };

  const copyWorkerConfig = (worker: BraiinsWorker) => {
    const config = `Braiins Pool Configuration:
URL: ${worker.url}:${worker.port}
Username: ${worker.username}
Password: ${worker.password}
Worker: ${worker.username}.${worker.name}`;

    navigator.clipboard.writeText(config);
    toast({
      title: "Configuration Copied",
      description: "Worker configuration copied to clipboard",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="outline" className="text-gray-500">Disconnected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Shield className="w-8 h-8 mr-3 text-orange-500" />
            Braiins Pool Management
          </h2>
          <p className="text-muted-foreground">Manage your Braiins Pool workers and monitor performance</p>
        </div>
        <Button 
          onClick={() => window.open('https://pool.braiins.com', '_blank')}
          variant="outline"
          className="border-orange-500 text-orange-500 hover:bg-orange-50"
        >
          <Server className="w-4 h-4 mr-2" />
          Visit Braiins Pool
        </Button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hashrate</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{poolStats.totalHashrate.toFixed(1)} TH/s</div>
            <p className="text-xs text-muted-foreground">
              Across {poolStats.totalWorkers} active workers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pool Efficiency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{poolStats.efficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average efficiency rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{poolStats.dailyEarnings.toFixed(6)} BTC</div>
            <p className="text-xs text-muted-foreground">
              Estimated daily revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pool Fee</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.0%</div>
            <p className="text-xs text-muted-foreground">
              Stratum V2 protocol
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workers">Workers</TabsTrigger>
          <TabsTrigger value="pools">Pool Settings</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        {/* Workers Tab */}
        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Worker</CardTitle>
              <CardDescription>
                Connect a new mining worker to Braiins Pool
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workerName">Worker Name</Label>
                  <Input
                    id="workerName"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                    placeholder="Tera3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={newWorker.username}
                    onChange={(e) => setNewWorker({...newWorker, username: e.target.value})}
                    placeholder="kloudbugs5"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    value={newWorker.password}
                    onChange={(e) => setNewWorker({...newWorker, password: e.target.value})}
                    placeholder="anything123"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pool">Braiins Pool</Label>
                  <Select value={selectedPool} onValueChange={setSelectedPool}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BRAIINS_POOLS.map((pool) => (
                        <SelectItem key={pool.name} value={pool.name}>
                          {pool.name} ({pool.protocol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={addWorker} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Worker
              </Button>
            </CardFooter>
          </Card>

          {/* Workers List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {workers.map((worker) => (
              <Card key={worker.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{worker.name}</CardTitle>
                    {getStatusBadge(worker.status)}
                  </div>
                  <CardDescription>
                    {worker.url}:{worker.port}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Hashrate</Label>
                      <div className="text-xl font-bold">{worker.hashrate.toFixed(1)} TH/s</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Efficiency</Label>
                      <div className="text-xl font-bold">{worker.efficiency.toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Share Acceptance Rate</Label>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={(worker.shares.accepted / (worker.shares.accepted + worker.shares.rejected)) * 100} 
                        className="flex-1" 
                      />
                      <span className="text-sm">
                        {((worker.shares.accepted / (worker.shares.accepted + worker.shares.rejected)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <Label className="text-xs text-muted-foreground">Daily</Label>
                      <div className="font-medium">{worker.earnings.daily.toFixed(6)} BTC</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Weekly</Label>
                      <div className="font-medium">{worker.earnings.weekly.toFixed(6)} BTC</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Monthly</Label>
                      <div className="font-medium">{worker.earnings.monthly.toFixed(5)} BTC</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    {worker.status === 'connected' ? (
                      <Button 
                        onClick={() => disconnectWorker(worker.id)}
                        variant="outline"
                        size="sm"
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => connectWorker(worker.id)}
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={isLoading}
                      >
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Connect'}
                      </Button>
                    )}
                    <Button 
                      onClick={() => copyWorkerConfig(worker)}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={() => removeWorker(worker.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pool Settings Tab */}
        <TabsContent value="pools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-orange-500" />
                Braiins Pool Connection Settings
              </CardTitle>
              <CardDescription>
                Configure your Braiins Pool mining connections and protocols
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BRAIINS_POOLS.map((pool) => (
                  <div key={pool.name} className="space-y-4">
                    <h4 className="font-medium flex items-center">
                      {pool.name}
                      <Badge variant="outline" className="ml-2">{pool.protocol}</Badge>
                    </h4>
                    <div className="space-y-2 bg-slate-800 p-4 rounded-lg">
                      <div className="text-sm">
                        <span className="text-slate-400">Stratum URL:</span>
                        <div className="font-mono">{pool.url}:{pool.port}</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Username:</span>
                        <div className="font-mono">kloudbugs5</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Password:</span>
                        <div className="font-mono">anything123</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Worker Format:</span>
                        <div className="font-mono">kloudbugs5.worker_name</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Pool Fee:</span>
                        <div className="font-mono">{pool.fee}%</div>
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        {pool.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>
                Track your Braiins Pool mining rewards and payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <Label className="text-sm text-muted-foreground">Total Daily</Label>
                    <div className="text-2xl font-bold">{poolStats.dailyEarnings.toFixed(6)} BTC</div>
                    <div className="text-sm text-muted-foreground">≈ ${(poolStats.dailyEarnings * 45000).toFixed(2)} USD</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Label className="text-sm text-muted-foreground">Total Weekly</Label>
                    <div className="text-2xl font-bold">{(poolStats.dailyEarnings * 7).toFixed(5)} BTC</div>
                    <div className="text-sm text-muted-foreground">≈ ${(poolStats.dailyEarnings * 7 * 45000).toFixed(2)} USD</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Label className="text-sm text-muted-foreground">Total Monthly</Label>
                    <div className="text-2xl font-bold">{(poolStats.dailyEarnings * 30).toFixed(4)} BTC</div>
                    <div className="text-sm text-muted-foreground">≈ ${(poolStats.dailyEarnings * 30 * 45000).toFixed(2)} USD</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">Braiins Pool Features</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• PPLNS reward system with transparent calculations</li>
                    <li>• Stratum V2 protocol support for enhanced efficiency</li>
                    <li>• Regular payouts with low minimum threshold</li>
                    <li>• Real-time monitoring and detailed statistics</li>
                    <li>• 24/7 customer support and technical assistance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}