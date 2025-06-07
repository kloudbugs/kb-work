import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'wouter';
import { 
  Activity, 
  Zap, 
  Server, 
  Network, 
  Settings, 
  Play, 
  Square, 
  CheckCircle, 
  XCircle,
  Monitor,
  Globe,
  Target,
  TrendingUp,
  Menu,
  Home,
  Pickaxe,
  Brain,
  MessageSquare,
  Coins,
  BarChart3
} from 'lucide-react';

interface MinerStats {
  workerId: string;
  connected: boolean;
  hashrate: number;
  difficulty: number;
  sharesSubmitted: number;
  sharesAccepted: number;
  sharesRejected: number;
  acceptanceRate: number;
  poolUrl: string;
  poolPort: number;
  poolType: string;
  isActive: boolean;
}

interface EngineStatus {
  isRunning: boolean;
  totalWorkers: number;
  activeWorkers: number;
  totalHashrate: number;
  totalShares: number;
  totalRejected: number;
  avgAcceptanceRate: number;
}

export default function MiningEnginePage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [engineRunning, setEngineRunning] = useState(false);
  const [workerStatus, setWorkerStatus] = useState<Record<string, MinerStats>>({});
  const [engineStatus, setEngineStatus] = useState<EngineStatus | null>(null);
  const [poolConfigs, setPoolConfigs] = useState({
    'TERA-RIG-01-W1': { url: 'btc.f2pool.com', port: 1314, username: 'kloudbugs5.001', password: '123' },
    'TERA-RIG-01-W2': { url: 'btc.f2pool.com', port: 1314, username: 'kloudbugs5.002', password: '123' },
    'TERA-RIG-01-W3': { url: 'btc.f2pool.com', port: 1314, username: 'kloudbugs5.003', password: '123' },
    'TERA-RIG-01-W4': { url: 'btc.f2pool.com', port: 1314, username: 'kloudbugs5.004', password: '123' },
    
    'TERA-RIG-02-W1': { url: 'btc.f2pool.com', port: 3333, username: 'kloudbugs5.005', password: '123' },
    'TERA-RIG-02-W2': { url: 'btc.f2pool.com', port: 3333, username: 'kloudbugs5.006', password: '123' },
    'TERA-RIG-02-W3': { url: 'btc.f2pool.com', port: 3333, username: 'kloudbugs5.007', password: '123' },
    'TERA-RIG-02-W4': { url: 'btc.f2pool.com', port: 3333, username: 'kloudbugs5.008', password: '123' },
    
    'TERA-RIG-03-W1': { url: 'stratum.braiins.com', port: 3333, username: 'kloudbugs5.Tera1', password: 'anything123' },
    'TERA-RIG-03-W2': { url: 'stratum.braiins.com', port: 3333, username: 'kloudbugs5.Tera2', password: 'anything123' },
    'TERA-RIG-03-W3': { url: 'stratum.braiins.com', port: 3333, username: 'kloudbugs5.Tera3', password: 'anything123' },
    'TERA-RIG-03-W4': { url: 'stratum.braiins.com', port: 3333, username: 'kloudbugs5.Tera4', password: 'anything123' },
    
    'TERA-RIG-04-W1': { url: 'umbrel.local', port: 2018, username: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6.solo1', password: 'x' },
    'TERA-RIG-04-W2': { url: 'umbrel.local', port: 2018, username: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6.solo2', password: 'x' },
    'TERA-RIG-04-W3': { url: 'umbrel.local', port: 2018, username: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6.solo3', password: 'x' },
    'TERA-RIG-04-W4': { url: 'umbrel.local', port: 2018, username: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6.solo4', password: 'x' }
  });

  // Fetch mining engine status
  const { data: miningData } = useQuery({
    queryKey: ['/api/mining/stats/realtime'],
    refetchInterval: 3000
  });

  // Fetch hardware information
  const { data: hardwareData } = useQuery({
    queryKey: ['/api/mining/hardware'],
    refetchInterval: 5000
  });

  useEffect(() => {
    if (miningData) {
      const data = miningData as any;
      setEngineRunning(data?.isRunning || false);
      
      if (data?.teraRigs && Array.isArray(data.teraRigs)) {
        const statusMap: Record<string, MinerStats> = {};
        data.teraRigs.forEach((rig: any) => {
          statusMap[rig.id] = {
            workerId: rig.id,
            connected: rig.status === 'active',
            hashrate: rig.hashrate || 0,
            difficulty: data?.difficulty || 1000000,
            sharesSubmitted: (rig.sharesAccepted || 0) + (rig.sharesRejected || 0),
            sharesAccepted: rig.sharesAccepted || 0,
            sharesRejected: rig.sharesRejected || 0,
            acceptanceRate: rig.acceptanceRate || 0,
            poolUrl: poolConfigs[rig.id as keyof typeof poolConfigs]?.url || '',
            poolPort: poolConfigs[rig.id as keyof typeof poolConfigs]?.port || 0,
            poolType: rig.poolType || 'unknown',
            isActive: rig.status === 'active'
          };
        });
        setWorkerStatus(statusMap);
      }
      
      setEngineStatus({
        isRunning: data?.isRunning || false,
        totalWorkers: data?.activeWorkers || 4,
        activeWorkers: data?.activeWorkers || 0,
        totalHashrate: data?.hashrate || 0,
        totalShares: data?.shares || 0,
        totalRejected: data?.teraRigs ? data.teraRigs.reduce((sum: number, rig: any) => sum + (rig.sharesRejected || 0), 0) : 0,
        avgAcceptanceRate: data?.teraRigs && data.teraRigs.length > 0 ? 
          data.teraRigs.reduce((sum: number, rig: any) => sum + (rig.acceptanceRate || 0), 0) / data.teraRigs.length : 0
      });
    }
  }, [miningData]);

  const startMiningEngine = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/mining/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setEngineRunning(true);
      }
    } catch (error) {
      console.error('Failed to start mining engine:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const stopMiningEngine = async () => {
    try {
      const response = await fetch('/api/mining/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setEngineRunning(false);
      }
    } catch (error) {
      console.error('Failed to stop mining engine:', error);
    }
  };

  const updatePoolConfig = (rigId: string, field: string, value: string | number) => {
    setPoolConfigs(prev => ({
      ...prev,
      [rigId]: {
        ...prev[rigId as keyof typeof poolConfigs],
        [field]: value
      }
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Navigation Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">Kloudbugs Mining Command Center</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start">
                    <Home className="w-4 h-4 mr-3" />
                    Main Dashboard
                  </Button>
                </Link>
                <Link href="/mining-engine">
                  <Button variant="ghost" className="w-full justify-start bg-muted">
                    <Pickaxe className="w-4 h-4 mr-3" />
                    TERA Mining Engine
                  </Button>
                </Link>
                <Link href="/rigs">
                  <Button variant="ghost" className="w-full justify-start">
                    <Server className="w-4 h-4 mr-3" />
                    Mining Rigs
                  </Button>
                </Link>
                <Link href="/pool">
                  <Button variant="ghost" className="w-full justify-start">
                    <Network className="w-4 h-4 mr-3" />
                    TERA Pool Project
                  </Button>
                </Link>
                <Link href="/f2pool">
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-3" />
                    F2Pool Management
                  </Button>
                </Link>
                <Link href="/braiins">
                  <Button variant="ghost" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-3" />
                    Braiins Pool
                  </Button>
                </Link>
                <Link href="/umbrel">
                  <Button variant="ghost" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-3" />
                    Umbrel Mining
                  </Button>
                </Link>
                <Link href="/solo">
                  <Button variant="ghost" className="w-full justify-start">
                    <Coins className="w-4 h-4 mr-3" />
                    Solo Mining
                  </Button>
                </Link>
                <Link href="/ai">
                  <Button variant="ghost" className="w-full justify-start">
                    <Brain className="w-4 h-4 mr-3" />
                    AI Hub
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="ghost" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-3" />
                    Chat Room
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          
          <div>
            <h1 className="text-3xl font-bold">TERA Mining Engine</h1>
            <p className="text-muted-foreground">Real stratum mining protocol implementation</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={engineRunning ? stopMiningEngine : startMiningEngine}
            disabled={isConnecting}
            variant={engineRunning ? "destructive" : "default"}
            size="lg"
          >
            {engineRunning ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Stop Engine
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Engine
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Engine Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Engine Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={engineRunning ? "default" : "secondary"}>
                {engineRunning ? "RUNNING" : "STOPPED"}
              </Badge>
              {engineRunning && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Server className="w-4 h-4 mr-2" />
              Active Rigs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engineStatus?.activeWorkers || 0}/{engineStatus?.totalWorkers || 4}
            </div>
            <p className="text-xs text-muted-foreground">Connected to pools</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Total Hashrate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(engineStatus?.totalHashrate || 0).toFixed(1)} TH/s
            </div>
            <p className="text-xs text-muted-foreground">Combined power</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Share Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(engineStatus?.avgAcceptanceRate || 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Acceptance rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Rig Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(workerStatus).map(([rigId, stats]) => (
          <Card key={rigId} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Monitor className="w-5 h-5 mr-2" />
                  {rigId}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={stats.connected ? "default" : "secondary"}>
                    {stats.poolType.toUpperCase()}
                  </Badge>
                  {stats.connected ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Hashrate</Label>
                  <p className="text-lg font-semibold">{stats.hashrate.toFixed(1)} TH/s</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Shares</Label>
                  <p className="text-lg font-semibold text-green-600">
                    {stats.sharesAccepted}
                    <span className="text-sm text-red-600 ml-1">
                      /{stats.sharesRejected}
                    </span>
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <Label htmlFor={`pool-${rigId}`} className="text-sm">Pool URL</Label>
                  <Input
                    id={`pool-${rigId}`}
                    value={poolConfigs[rigId as keyof typeof poolConfigs]?.url || ''}
                    onChange={(e) => updatePoolConfig(rigId, 'url', e.target.value)}
                    placeholder="pool.example.com"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`port-${rigId}`} className="text-sm">Port</Label>
                    <Input
                      id={`port-${rigId}`}
                      type="number"
                      value={poolConfigs[rigId as keyof typeof poolConfigs]?.port || ''}
                      onChange={(e) => updatePoolConfig(rigId, 'port', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Status</Label>
                    <div className="flex items-center mt-1 px-3 py-2 bg-muted rounded-md">
                      <div className={`w-2 h-2 rounded-full mr-2 ${stats.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm">{stats.connected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pool:</span>
                  <span className="font-mono">{stats.poolUrl}:{stats.poolPort}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span>{stats.difficulty.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accept Rate:</span>
                  <span className="text-green-600">{stats.acceptanceRate.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mining Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Engine Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Hardware</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Rigs:</span>
                  <span>4 TERA Units</span>
                </div>
                <div className="flex justify-between">
                  <span>Combined Power:</span>
                  <span>{(engineStatus?.totalHashrate || 0).toFixed(1)} TH/s</span>
                </div>
                <div className="flex justify-between">
                  <span>Algorithm:</span>
                  <span>SHA-256</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Network</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Protocol:</span>
                  <span>Stratum V1</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Pools:</span>
                  <span>{engineStatus?.activeWorkers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Retry Logic:</span>
                  <span>Enabled</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Shares:</span>
                  <span>{engineStatus?.totalShares || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rejected:</span>
                  <span className="text-red-600">{engineStatus?.totalRejected || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Efficiency:</span>
                  <span className="text-green-600">{(engineStatus?.avgAcceptanceRate || 0).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}