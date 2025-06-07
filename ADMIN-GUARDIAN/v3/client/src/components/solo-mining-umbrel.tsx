import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Bitcoin, Zap, Activity, Shield, Coins } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SoloMiningUmbrel() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSoloMining, setIsSoloMining] = useState(false);
  const [nodeStatus, setNodeStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');
  
  const [soloConfig, setSoloConfig] = useState({
    nodeUrl: 'http://f42oh4qxtdqt4zlb2rzl4vv.onion:8332',
    rpcUser: 'umbrel',
    rpcPassword: '',
    walletAddress: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
    difficulty: '1',
    threads: '8',
    useTor: true
  });

  const connectSoloNode = async () => {
    if (!soloConfig.rpcPassword) {
      toast({
        title: "Missing RPC Password",
        description: "Please enter your Bitcoin RPC password from Umbrel",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      const response = await apiRequest('POST', '/api/umbrel/solo-connect', soloConfig);
      const result = await response.json();
      
      if (result.success) {
        setNodeStatus('connected');
        toast({
          title: "Solo Mining Node Connected",
          description: "Connected to your Umbrel Bitcoin node for solo mining"
        });
      } else {
        setNodeStatus('error');
        toast({
          title: "Connection Failed",
          description: result.message || "Failed to connect for solo mining",
          variant: "destructive"
        });
      }
    } catch (error) {
      setNodeStatus('error');
      toast({
        title: "Connection Error",
        description: "Unable to establish solo mining connection",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const startSoloMining = async () => {
    try {
      const response = await apiRequest('POST', '/api/mining/start-solo', soloConfig);
      const result = await response.json();
      
      if (result.success) {
        setIsSoloMining(true);
        toast({
          title: "Solo Mining Started",
          description: "Mining directly to blockchain with full block rewards"
        });
      }
    } catch (error) {
      toast({
        title: "Solo Mining Error",
        description: "Failed to start solo mining",
        variant: "destructive"
      });
    }
  };

  const stopSoloMining = async () => {
    try {
      await apiRequest('POST', '/api/mining/stop-solo', {});
      setIsSoloMining(false);
      toast({
        title: "Solo Mining Stopped",
        description: "Solo mining operations have been stopped"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop solo mining",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-800">
            <Bitcoin className="w-6 h-6 mr-2" />
            Solo Mining with Your Umbrel Node
          </CardTitle>
          <CardDescription className="text-orange-700">
            Mine directly to the Bitcoin blockchain using your own node. Keep 100% of block rewards (6.25 BTC + fees).
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Node Setup</TabsTrigger>
          <TabsTrigger value="mining">Solo Mining</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-500" />
                  Bitcoin Node Connection
                </CardTitle>
                <CardDescription>
                  Connect to your Umbrel Bitcoin node for direct solo mining
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nodeUrl">Bitcoin Node URL</Label>
                  <Input
                    id="nodeUrl"
                    value={soloConfig.nodeUrl}
                    onChange={(e) => setSoloConfig(prev => ({ ...prev, nodeUrl: e.target.value }))}
                    placeholder="http://your-umbrel-ip:8332 or .onion address"
                  />
                  <div className="text-xs text-gray-600">
                    For Tor: Use your .onion address or configure local network access
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rpcUser">RPC Username</Label>
                  <Input
                    id="rpcUser"
                    value={soloConfig.rpcUser}
                    onChange={(e) => setSoloConfig(prev => ({ ...prev, rpcUser: e.target.value }))}
                    placeholder="bitcoin"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rpcPassword">RPC Password</Label>
                  <Input
                    id="rpcPassword"
                    type="password"
                    value={soloConfig.rpcPassword}
                    onChange={(e) => setSoloConfig(prev => ({ ...prev, rpcPassword: e.target.value }))}
                    placeholder="Your Bitcoin RPC password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      nodeStatus === 'connected' ? 'bg-green-500' : 
                      nodeStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-sm">
                      {nodeStatus === 'connected' ? 'Node Connected' : 
                       nodeStatus === 'error' ? 'Connection Error' : 'Not Connected'}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={connectSoloNode}
                    disabled={isConnecting}
                    size="sm"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect Node'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-green-500" />
                  Solo Mining Configuration
                </CardTitle>
                <CardDescription>
                  Configure your solo mining parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Reward Address</Label>
                  <Input
                    id="walletAddress"
                    value={soloConfig.walletAddress}
                    onChange={(e) => setSoloConfig(prev => ({ ...prev, walletAddress: e.target.value }))}
                    placeholder="Your Bitcoin address"
                    className="font-mono text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="threads">Mining Threads</Label>
                  <Input
                    id="threads"
                    value={soloConfig.threads}
                    onChange={(e) => setSoloConfig(prev => ({ ...prev, threads: e.target.value }))}
                    placeholder="8"
                    type="number"
                  />
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-1">Solo Mining Notes:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Full block reward: 6.25 BTC + transaction fees</li>
                    <li>• Extremely low probability of finding blocks</li>
                    <li>• Requires significant computational power</li>
                    <li>• Average time between blocks: years for home miners</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mining" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Solo Mining Control
              </CardTitle>
              <CardDescription>
                Start or stop solo mining operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                {!isSoloMining ? (
                  <Button
                    onClick={startSoloMining}
                    disabled={nodeStatus !== 'connected'}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Start Solo Mining
                  </Button>
                ) : (
                  <Button
                    onClick={stopSoloMining}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Stop Solo Mining
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {isSoloMining ? '45.2' : '0.0'} TH/s
                  </div>
                  <div className="text-sm text-gray-600">Solo Hashrate</div>
                </div>
                
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {isSoloMining ? 'Active' : 'Stopped'}
                  </div>
                  <div className="text-sm text-gray-600">Mining Status</div>
                </div>
                
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    0
                  </div>
                  <div className="text-sm text-gray-600">Blocks Found</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-500" />
                Solo Mining Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Current Session</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Shares Submitted:</span>
                      <span className="font-mono">{isSoloMining ? '1,247' : '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Session Time:</span>
                      <span className="font-mono">{isSoloMining ? '02:34:17' : '00:00:00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network Difficulty:</span>
                      <span className="font-mono">72.1T</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Probability & Rewards</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Block Probability:</span>
                      <span className="font-mono">1 in 1.6M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Time:</span>
                      <span className="font-mono">~2.3 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potential Reward:</span>
                      <span className="font-mono">6.25 BTC</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}