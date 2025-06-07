import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  Trash2
} from 'lucide-react';
import UmbrelNodeConnection from './umbrel-node-connection';

interface TeraWorker {
  id: string;
  name: string;
  poolUrl: string;
  port: number;
  username: string;
  password: string;
  workerName: string;
  status: 'connected' | 'disconnected' | 'error';
  hashrate: number;
  shares: {
    accepted: number;
    rejected: number;
  };
  lastSeen: string;
}

interface PoolConfig {
  name: string;
  url: string;
  port: number;
  type: 'f2pool' | 'braiins' | 'other';
}

const POOL_CONFIGS: PoolConfig[] = [
  { name: 'F2Pool Primary', url: 'stratum+tcp://btc.f2pool.com', port: 3333, type: 'f2pool' },
  { name: 'F2Pool Backup 1', url: 'stratum+tcp://btc.f2pool.com', port: 1314, type: 'f2pool' },
  { name: 'F2Pool Backup 2', url: 'stratum+tcp://btc.f2pool.com', port: 25, type: 'f2pool' },
  { name: 'F2Pool SSL', url: 'stratum+ssl://btcssl.f2pool.com', port: 1300, type: 'f2pool' },
  { name: 'F2Pool SSL Alt', url: 'stratum+ssl://btcssl.f2pool.com', port: 1301, type: 'f2pool' },
  { name: 'Braiins Pool V1', url: 'stratum+tcp://stratum.braiins.com', port: 3333, type: 'braiins' },
  { name: 'Braiins Pool V2', url: 'stratum2+tcp://v2.stratum.braiins.com/u95GEReVMjK6k5YqiSFNqqTnKU4ypU2Wm8awa6tmbmDmk1bWt', port: 3333, type: 'braiins' },
  { name: 'Umbrel Solo Mining', url: 'stratum+tcp://umbrel.local', port: 3333, type: 'other' },
  { name: 'Local Solo Node', url: 'stratum+tcp://127.0.0.1', port: 3333, type: 'other' }
];

export default function TeraWorkerManagement() {
  const { toast } = useToast();
  const [workers, setWorkers] = useState<TeraWorker[]>([
    // F2Pool Workers (RIG-01)
    {
      id: 'tera-rig-01-w1',
      name: 'TERA-RIG-01-W1',
      poolUrl: 'stratum+tcp://btc.f2pool.com',
      port: 1314,
      username: 'kloudbugs5',
      password: '123',
      workerName: 'kloudbugs5.001',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    {
      id: 'tera-rig-01-w2',
      name: 'TERA-RIG-01-W2',
      poolUrl: 'stratum+tcp://btc.f2pool.com',
      port: 1314,
      username: 'kloudbugs5',
      password: '123',
      workerName: 'kloudbugs5.002',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    {
      id: 'tera-rig-01-w3',
      name: 'TERA-RIG-01-W3',
      poolUrl: 'stratum+tcp://btc.f2pool.com',
      port: 1314,
      username: 'kloudbugs5',
      password: '123',
      workerName: 'kloudbugs5.003',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    {
      id: 'tera-rig-01-w4',
      name: 'TERA-RIG-01-W4',
      poolUrl: 'stratum+tcp://btc.f2pool.com',
      port: 1314,
      username: 'kloudbugs5',
      password: '123',
      workerName: 'kloudbugs5.004',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    // F2Pool Workers (RIG-02)
    {
      id: 'tera-rig-02-w1',
      name: 'TERA-RIG-02-W1',
      poolUrl: 'stratum+tcp://btc.f2pool.com',
      port: 3333,
      username: 'kloudbugs5',
      password: '123',
      workerName: 'kloudbugs5.005',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    {
      id: 'tera-rig-02-w2',
      name: 'TERA-RIG-02-W2',
      poolUrl: 'stratum+tcp://btc.f2pool.com',
      port: 3333,
      username: 'kloudbugs5',
      password: '123',
      workerName: 'kloudbugs5.006',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    {
      id: 'tera-rig-02-w3',
      name: 'TERA-RIG-02-W3',
      poolUrl: 'stratum+tcp://btc.f2pool.com',
      port: 3333,
      username: 'kloudbugs5',
      password: '123',
      workerName: 'kloudbugs5.007',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    {
      id: 'tera-rig-02-w4',
      name: 'TERA-RIG-02-W4',
      poolUrl: 'stratum+tcp://btc.f2pool.com',
      port: 3333,
      username: 'kloudbugs5',
      password: '123',
      workerName: 'kloudbugs5.008',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    // Braiins Pool Workers (RIG-03)
    {
      id: 'tera-rig-03-w1',
      name: 'TERA-RIG-03-W1',
      poolUrl: 'stratum+tcp://stratum.braiins.com',
      port: 3333,
      username: 'kloudbugs5',
      password: 'anything123',
      workerName: 'kloudbugs5.Tera1',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    {
      id: 'tera-rig-03-w2',
      name: 'TERA-RIG-03-W2',
      poolUrl: 'stratum+tcp://stratum.braiins.com',
      port: 3333,
      username: 'kloudbugs5',
      password: 'anything123',
      workerName: 'kloudbugs5.Tera2',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    {
      id: 'tera-rig-03-w3',
      name: 'TERA-RIG-03-W3',
      poolUrl: 'stratum+tcp://stratum.braiins.com',
      port: 3333,
      username: 'kloudbugs5',
      password: 'anything123',
      workerName: 'kloudbugs5.Tera3',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    {
      id: 'tera-rig-03-w4',
      name: 'TERA-RIG-03-W4',
      poolUrl: 'stratum+tcp://stratum.braiins.com',
      port: 3333,
      username: 'kloudbugs5',
      password: 'anything123',
      workerName: 'kloudbugs5.Tera4',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    // Solo Mining Workers (RIG-04)
    {
      id: 'tera-rig-04-w1',
      name: 'TERA-RIG-04-W1',
      poolUrl: 'stratum+tcp://umbrel.local',
      port: 2018,
      username: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
      password: 'x',
      workerName: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6.solo1',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    {
      id: 'tera-rig-04-w2',
      name: 'TERA-RIG-04-W2',
      poolUrl: 'stratum+tcp://umbrel.local',
      port: 2018,
      username: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
      password: 'x',
      workerName: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6.solo2',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    {
      id: 'tera-rig-04-w3',
      name: 'TERA-RIG-04-W3',
      poolUrl: 'stratum+tcp://umbrel.local',
      port: 2018,
      username: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
      password: 'x',
      workerName: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6.solo3',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    },
    {
      id: 'tera-rig-04-w4',
      name: 'TERA-RIG-04-W4',
      poolUrl: 'stratum+tcp://umbrel.local',
      port: 2018,
      username: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
      password: 'x',
      workerName: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6.solo4',
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    }
  ]);

  const [selectedPool, setSelectedPool] = useState<string>('F2Pool Primary');
  const [newWorker, setNewWorker] = useState({
    name: '',
    username: 'kloudbugs5',
    password: '123',
    workerSuffix: ''
  });

  const getPoolConfig = (poolName: string) => {
    return POOL_CONFIGS.find(pool => pool.name === poolName) || POOL_CONFIGS[0];
  };

  const connectWorker = async (workerId: string) => {
    try {
      const worker = workers.find(w => w.id === workerId);
      if (!worker) return;

      // Simulate connection attempt
      setWorkers(prev => prev.map(w => 
        w.id === workerId 
          ? { ...w, status: 'connected' as const, lastSeen: new Date().toISOString() }
          : w
      ));

      toast({
        title: "Worker Connected",
        description: `${worker.name} successfully connected to ${worker.poolUrl}:${worker.port}`,
      });

      // Simulate mining data
      const interval = setInterval(() => {
        setWorkers(prev => prev.map(w => 
          w.id === workerId && w.status === 'connected'
            ? { 
                ...w, 
                hashrate: 24.5 + (Math.random() - 0.5) * 2,
                shares: {
                  accepted: w.shares.accepted + Math.floor(Math.random() * 3),
                  rejected: w.shares.rejected + Math.floor(Math.random() * 0.2)
                }
              }
            : w
        ));
      }, 5000);

      // Store interval ID for cleanup
      (window as any)[`worker-${workerId}-interval`] = interval;

    } catch (error) {
      setWorkers(prev => prev.map(w => 
        w.id === workerId 
          ? { ...w, status: 'error' as const }
          : w
      ));
      
      toast({
        title: "Connection Failed",
        description: "Failed to connect worker to mining pool",
        variant: "destructive"
      });
    }
  };

  const disconnectWorker = (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;

    // Clear mining simulation
    const interval = (window as any)[`worker-${workerId}-interval`];
    if (interval) {
      clearInterval(interval);
      delete (window as any)[`worker-${workerId}-interval`];
    }

    setWorkers(prev => prev.map(w => 
      w.id === workerId 
        ? { ...w, status: 'disconnected' as const, hashrate: 0 }
        : w
    ));

    toast({
      title: "Worker Disconnected",
      description: `${worker.name} has been disconnected from the mining pool`,
    });
  };

  const addWorker = () => {
    if (!newWorker.name || !newWorker.workerSuffix) {
      toast({
        title: "Missing Information",
        description: "Please fill in worker name and suffix",
        variant: "destructive"
      });
      return;
    }

    const poolConfig = getPoolConfig(selectedPool);
    const workerId = `tera-${Date.now()}`;
    
    // Auto-select password based on pool type
    const poolPassword = poolConfig.type === 'braiins' ? 'anything123' : '123';
    
    const worker: TeraWorker = {
      id: workerId,
      name: newWorker.name,
      poolUrl: poolConfig.url,
      port: poolConfig.port,
      username: newWorker.username,
      password: poolPassword,
      workerName: `${newWorker.username}.${newWorker.workerSuffix}`,
      status: 'disconnected',
      hashrate: 0,
      shares: { accepted: 0, rejected: 0 },
      lastSeen: new Date().toISOString()
    };

    setWorkers(prev => [...prev, worker]);
    setNewWorker({
      name: '',
      username: 'kloudbugs5',
      password: poolConfig.type === 'braiins' ? 'anything123' : '123',
      workerSuffix: ''
    });

    toast({
      title: "Worker Added",
      description: `${worker.name} has been added to your worker list`,
    });
  };

  const removeWorker = (workerId: string) => {
    disconnectWorker(workerId);
    setWorkers(prev => prev.filter(w => w.id !== workerId));
    
    toast({
      title: "Worker Removed",
      description: "Worker has been removed from your list",
    });
  };

  const copyWorkerConfig = (worker: TeraWorker) => {
    const config = `# ${worker.name} Configuration
Pool URL: ${worker.poolUrl}:${worker.port}
Username: ${worker.username}
Password: ${worker.password}
Worker: ${worker.workerName}`;

    navigator.clipboard.writeText(config);
    toast({
      title: "Configuration Copied",
      description: "Worker configuration copied to clipboard",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary"><Wifi className="w-3 h-3 mr-1" />Disconnected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tera Worker Management</h2>
          <p className="text-sm text-muted-foreground">Manage your mining workers for F2Pool and Braiins Pool</p>
        </div>
      </div>

      <Tabs defaultValue="workers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workers">Active Workers</TabsTrigger>
          <TabsTrigger value="add">Add Worker</TabsTrigger>
          <TabsTrigger value="pools">Pool Status</TabsTrigger>
          <TabsTrigger value="umbrel">Umbrel & Solo</TabsTrigger>
        </TabsList>

        <TabsContent value="workers" className="space-y-4">
          {workers.map((worker) => (
            <Card key={worker.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Server className="w-5 h-5 text-blue-500" />
                    <div>
                      <CardTitle className="text-lg">{worker.name}</CardTitle>
                      <CardDescription>{worker.workerName}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(worker.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Pool Connection</Label>
                    <div className="text-sm bg-muted p-2 rounded font-mono">
                      {worker.poolUrl}:{worker.port}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Username:</span> {worker.username}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Performance</Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 mr-1 text-orange-500" />
                        <span className="text-sm">{worker.hashrate.toFixed(2)} TH/s</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-green-600">{worker.shares.accepted}</span>/
                        <span className="text-red-600">{worker.shares.rejected}</span> shares
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
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
                    >
                      Connect
                    </Button>
                  )}
                  <Button 
                    onClick={() => copyWorkerConfig(worker)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Config
                  </Button>
                  <Button 
                    onClick={() => removeWorker(worker.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Tera Worker</CardTitle>
              <CardDescription>
                Configure a new worker for your mining pools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workerName">Worker Name</Label>
                  <Input
                    id="workerName"
                    placeholder="e.g., Tera2"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="poolSelect">Mining Pool</Label>
                  <Select value={selectedPool} onValueChange={setSelectedPool}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POOL_CONFIGS.map((pool) => (
                        <SelectItem key={pool.name} value={pool.name}>
                          {pool.name} ({pool.url}:{pool.port})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={newWorker.username}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    value={newWorker.password}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="workerSuffix">Worker Suffix</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{newWorker.username}.</span>
                    <Input
                      id="workerSuffix"
                      placeholder="Tera1"
                      value={newWorker.workerSuffix}
                      onChange={(e) => setNewWorker(prev => ({ ...prev, workerSuffix: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={addWorker} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Worker
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  F2Pool Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {POOL_CONFIGS.filter(p => p.type === 'f2pool').map((pool) => (
                  <div key={pool.name} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <div className="font-medium text-sm">{pool.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{pool.url}:{pool.port}</div>
                    </div>
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Braiins Pool Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {POOL_CONFIGS.filter(p => p.type === 'braiins').map((pool) => (
                  <div key={pool.name} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <div className="font-medium text-sm">{pool.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{pool.url}:{pool.port}</div>
                    </div>
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="umbrel" className="space-y-4">
          <UmbrelNodeConnection />
        </TabsContent>
      </Tabs>
    </div>
  );
}