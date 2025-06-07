import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
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
  Wallet
} from 'lucide-react';

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

interface MiningData {
  hashrate: number;
  power: number;
  temperature: number;
  earnings: number;
  shares: number;
  ghostMinersActive: boolean;
  optimizationActive: boolean;
}

interface UserProfile {
  id: number;
  username: string;
  balance: number;
  walletAddress: string;
  ethAddress: string;
  ethBalance: number;
  withdrawalThreshold: number;
}

export default function TeraGuardianDashboard() {
  const [guardians, setGuardians] = useState<TeraGuardian[]>([]);
  const [miningData, setMiningData] = useState<MiningData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load initial data
    loadGuardians();
    loadUserProfile();
    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const loadGuardians = async () => {
    try {
      const response = await fetch('/api/tera-guardians');
      const data = await response.json();
      setGuardians(data);
    } catch (error) {
      console.error('Failed to load guardians:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const connectWebSocket = () => {
    const websocket = new WebSocket(`ws://${window.location.host}/ws`);
    
    websocket.onopen = () => {
      setIsConnected(true);
      // Authenticate with TERA Guardian
      websocket.send(JSON.stringify({
        type: 'authenticate',
        username: 'demo'
      }));
      
      toast({
        title: "TERA Guardian Connected",
        description: "AI coordination system online",
      });
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'guardian_status') {
        setGuardians(data.guardians);
      }
      
      if (data.type === 'mining_update') {
        setMiningData(data.data);
      }
      
      if (data.type === 'mining_started') {
        setIsMining(true);
        toast({
          title: "TERA Guardian Activated",
          description: data.message,
        });
      }
    };

    websocket.onclose = () => {
      setIsConnected(false);
      setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
    };

    setWs(websocket);
  };

  const startMining = () => {
    if (ws && isConnected) {
      ws.send(JSON.stringify({ type: 'start_mining' }));
    }
  };

  const stopMining = () => {
    if (ws && isConnected) {
      ws.send(JSON.stringify({ type: 'stop_mining' }));
      setIsMining(false);
    }
  };

  const activateGhostMiners = async () => {
    try {
      const response = await fetch('/api/ghost-miners/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 100 })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Ghost Feather System Activated",
          description: `${result.hashrate} TH/s additional hashrate deployed`,
        });
        
        if (ws && isConnected) {
          ws.send(JSON.stringify({ 
            type: 'activate_ghost_miners', 
            count: 100 
          }));
        }
      }
    } catch (error) {
      console.error('Failed to activate ghost miners:', error);
    }
  };

  const startOptimization = async () => {
    try {
      const response = await fetch('/api/tera-optimization/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "TERA Optimization Active",
          description: "AI is now optimizing mining performance",
        });
        
        if (ws && isConnected) {
          ws.send(JSON.stringify({ type: 'start_optimization' }));
        }
      }
    } catch (error) {
      console.error('Failed to start optimization:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'standby': return 'bg-yellow-500';
      case 'maintenance': return 'bg-orange-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />;
      case 'standby': return <Cpu className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      case 'offline': return <Wifi className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'PLATFORM_OVERSEER': return <Shield className="h-5 w-5" />;
      case 'MINING_SPECIALIST': return <HardDrive className="h-5 w-5" />;
      case 'SECURITY_SPECIALIST': return <Shield className="h-5 w-5" />;
      case 'FINANCE_SPECIALIST': return <DollarSign className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TERA Guardian Command Center
          </h1>
          <p className="text-muted-foreground">
            AI-Powered Cryptocurrency Mining Platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guardians">AI Guardians</TabsTrigger>
          <TabsTrigger value="mining">Mining Control</TabsTrigger>
          <TabsTrigger value="wallet">Wallet & Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Hashrate</p>
                    <p className="text-2xl font-bold">
                      {miningData ? `${miningData.hashrate.toFixed(2)} ${miningData.hashrate > 100 ? 'TH/s' : 'MH/s'}` : '0 MH/s'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Power</p>
                    <p className="text-2xl font-bold">
                      {miningData ? `${miningData.power.toFixed(0)}W` : '0W'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Balance</p>
                    <p className="text-2xl font-bold">
                      {userProfile ? `${userProfile.balance.toFixed(8)} BTC` : '0 BTC'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Shares</p>
                    <p className="text-2xl font-bold">
                      {miningData ? miningData.shares : '0'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mining Control Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Mining Control Panel
              </CardTitle>
              <CardDescription>
                Control your TERA Guardian mining operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                {!isMining ? (
                  <Button onClick={startMining} className="bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Start Mining
                  </Button>
                ) : (
                  <Button onClick={stopMining} variant="destructive">
                    <Square className="h-4 w-4 mr-2" />
                    Stop Mining
                  </Button>
                )}
                
                <Button onClick={activateGhostMiners} variant="outline">
                  <Ghost className="h-4 w-4 mr-2" />
                  Activate Ghost Feather (100 Miners)
                </Button>
                
                <Button onClick={startOptimization} variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Start TERA Optimization
                </Button>
              </div>

              {miningData && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ghost Feather System</span>
                      <Badge variant={miningData.ghostMinersActive ? "default" : "secondary"}>
                        {miningData.ghostMinersActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AI Optimization</span>
                      <Badge variant={miningData.optimizationActive ? "default" : "secondary"}>
                        {miningData.optimizationActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Temperature</span>
                      <span className="text-sm font-medium">{miningData.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Earnings Rate</span>
                      <span className="text-sm font-medium">{miningData.earnings.toFixed(8)} BTC/min</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guardians" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guardians.map((guardian) => (
              <Card key={guardian.id} className="relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-3 h-3 rounded-full m-3 ${getStatusColor(guardian.status)}`} />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getRoleIcon(guardian.role)}
                    {guardian.name}
                  </CardTitle>
                  <CardDescription>
                    {guardian.role.replace(/_/g, ' ')} • {guardian.accessLevel}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(guardian.status)}
                    <Badge variant={guardian.status === 'active' ? 'default' : 'secondary'}>
                      {guardian.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI Load Level</span>
                      <span>{guardian.aiLoadLevel.toFixed(1)}%</span>
                    </div>
                    <Progress value={guardian.aiLoadLevel} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Processing Power</span>
                      <span>{guardian.processingPower.toFixed(1)}%</span>
                    </div>
                    <Progress value={guardian.processingPower} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Capabilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {guardian.capabilities.map((capability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {capability.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mining" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ghost Feather System</CardTitle>
                <CardDescription>
                  Activate virtual miners that contribute real hashrate to your mining pool
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>• Creates 100 virtual mining rigs</p>
                  <p>• Combined hashrate: 2,450 TH/s</p>
                  <p>• All earnings go to your wallet</p>
                  <p>• Automatic pool optimization</p>
                </div>
                <Button onClick={activateGhostMiners} className="w-full">
                  <Ghost className="h-4 w-4 mr-2" />
                  Activate Ghost Feather System
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TERA Optimization</CardTitle>
                <CardDescription>
                  AI-powered mining optimization for maximum profitability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>• Automatic pool switching</p>
                  <p>• Difficulty adjustment</p>
                  <p>• 15% performance boost</p>
                  <p>• Real-time profit analysis</p>
                </div>
                <Button onClick={startOptimization} className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Start TERA Optimization
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Balances
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Bitcoin</p>
                        <p className="text-sm text-muted-foreground">Primary mining rewards</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{userProfile.balance.toFixed(8)} BTC</p>
                        <p className="text-sm text-muted-foreground">
                          ≈ ${(userProfile.balance * 45000).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Ethereum</p>
                        <p className="text-sm text-muted-foreground">Secondary rewards</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{userProfile.ethBalance.toFixed(6)} ETH</p>
                        <p className="text-sm text-muted-foreground">
                          ≈ ${(userProfile.ethBalance * 2500).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automatic Payouts</CardTitle>
                <CardDescription>
                  Configure automatic wallet payouts when thresholds are reached
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bitcoin Address</label>
                      <p className="text-sm font-mono bg-muted p-2 rounded">
                        {userProfile.walletAddress || 'Not configured'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Withdrawal Threshold</label>
                      <p className="text-sm">
                        {userProfile.withdrawalThreshold} BTC - Automatic payout when reached
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Progress to Next Payout</label>
                      <Progress 
                        value={(userProfile.balance / userProfile.withdrawalThreshold) * 100} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground">
                        {((userProfile.balance / userProfile.withdrawalThreshold) * 100).toFixed(1)}% of threshold reached
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}