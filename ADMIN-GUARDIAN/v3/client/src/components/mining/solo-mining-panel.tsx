import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Bitcoin, 
  Database, 
  Server, 
  CircuitBoard, 
  Cpu, 
  Clock, 
  Zap, 
  AlertCircle, 
  Link, 
  Share2, 
  CheckCircle2,
  PlayCircle,
  StopCircle, 
  RefreshCw 
} from 'lucide-react';

interface BlockInfo {
  height: number;
  hash: string;
  time: string;
  difficulty: number;
  txCount: number;
}

interface SoloMiningConfig {
  rpcUrl: string;
  rpcUsername: string;
  rpcPassword: string;
  walletAddress: string;
  miningThreads: number;
  maxMemoryUsage: number;
  autoRestartAfterError: boolean;
}

export function SoloMiningPanel() {
  const [miningActive, setMiningActive] = useState<boolean>(false);
  const [miningStats, setMiningStats] = useState({
    hashrate: 0,
    blocksFound: 0,
    uptime: "0h 0m 0s",
    lastBlockFound: "Never",
    difficulty: 61000000000000,
    networkHashrate: 550000000000000,
    estimatedTimeToFind: "1y 2m 15d"
  });
  
  const [blockTemplate, setBlockTemplate] = useState<any>(null);
  const [recentBlocks, setRecentBlocks] = useState<BlockInfo[]>([
    {
      height: 800524,
      hash: "00000000000000000003bf4a0a608b39e32b4e28f0b23ee539a016e4cf786317",
      time: "2025-05-20T09:12:35Z",
      difficulty: 61000000000000,
      txCount: 1824
    },
    {
      height: 800523,
      hash: "00000000000000000005128374db26b4e7e2d3aa10b3a7dc0e94e61618ff9d54",
      time: "2025-05-20T08:43:12Z",
      difficulty: 60987654123456,
      txCount: 2354
    },
    {
      height: 800522,
      hash: "000000000000000000029ef15dc38c87d3eee79b1faa9461b0c1eb0c0dce5234",
      time: "2025-05-20T08:21:45Z",
      difficulty: 60987654123456,
      txCount: 1943
    }
  ]);
  
  const [config, setConfig] = useState<SoloMiningConfig>({
    rpcUrl: "http://localhost:8332",
    rpcUsername: "bitcoinrpc",
    rpcPassword: "password",
    walletAddress: "bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6",
    miningThreads: 4,
    maxMemoryUsage: 4096,
    autoRestartAfterError: true
  });
  
  const [pendingRewards, setPendingRewards] = useState({
    confirmed: 0,
    unconfirmed: 0,
    immature: 12.5
  });
  
  const [hardwareList, setHardwareList] = useState<string[]>([
    "Aorus 15 Gigabyte Laptop",
    "Antminer S9 #1",
    "Antminer S9 #2",
    "Desktop Mining Rig"
  ]);
  
  const [selectedHardware, setSelectedHardware] = useState<string[]>(["Aorus 15 Gigabyte Laptop"]);
  const [customHashrateFactor, setCustomHashrateFactor] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const startSoloMining = async () => {
    setIsLoading(true);
    try {
      // This would be a real API call in production
      await apiRequest({
        url: '/api/mining/solo/start',
        method: 'POST',
        data: {
          config,
          hardware: selectedHardware
        }
      });
      
      setMiningActive(true);
      
      toast({
        title: "Solo Mining Started",
        description: `Mining started with ${selectedHardware.length} devices. Block rewards will go directly to your wallet.`,
        variant: "default",
      });
      
      // Update mining stats periodically
      updateMiningStats();
    } catch (error) {
      console.error("Failed to start solo mining:", error);
      toast({
        title: "Failed to Start Mining",
        description: "There was an error starting the solo mining operation. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopSoloMining = async () => {
    setIsLoading(true);
    try {
      // This would be a real API call in production
      await apiRequest({
        url: '/api/mining/solo/stop',
        method: 'POST'
      });
      
      setMiningActive(false);
      
      toast({
        title: "Solo Mining Stopped",
        description: "Mining operation has been stopped successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to stop solo mining:", error);
      toast({
        title: "Failed to Stop Mining",
        description: "There was an error stopping the solo mining operation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateMiningStats = () => {
    // In a real implementation, this would fetch actual stats from the backend
    // For demonstration, we'll update with slightly randomized values
    
    if (miningActive) {
      // Calculate base hashrate from selected hardware
      let baseHashrate = 0;
      if (selectedHardware.includes("Aorus 15 Gigabyte Laptop")) {
        baseHashrate += 35;
      }
      if (selectedHardware.includes("Antminer S9 #1")) {
        baseHashrate += 13500;
      }
      if (selectedHardware.includes("Antminer S9 #2")) {
        baseHashrate += 13200;
      }
      if (selectedHardware.includes("Desktop Mining Rig")) {
        baseHashrate += 120;
      }
      
      // Apply custom hashrate factor
      baseHashrate *= customHashrateFactor;
      
      // Add some random variation
      const hashrate = baseHashrate * (0.95 + Math.random() * 0.1);
      
      // Calculate estimated time to find a block
      const networkHashrate = 550000000000000; // 550 EH/s
      const difficulty = 61000000000000;
      const secondsPerBlock = (difficulty * 2**32) / hashrate;
      
      const days = Math.floor(secondsPerBlock / 86400);
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      const months = Math.floor(remainingDays / 30);
      const finalDays = remainingDays % 30;
      
      const estimatedTimeToFind = years > 0 
        ? `${years}y ${months}m ${finalDays}d`
        : months > 0 
          ? `${months}m ${finalDays}d`
          : `${finalDays}d`;
      
      // Update stats
      setMiningStats({
        hashrate,
        blocksFound: miningStats.blocksFound,
        uptime: "2h 15m 32s", // This would be calculated from the actual start time
        lastBlockFound: miningStats.lastBlockFound,
        difficulty,
        networkHashrate,
        estimatedTimeToFind
      });
    }
  };

  const simulateBlockFound = async () => {
    if (!miningActive) {
      toast({
        title: "Mining Not Active",
        description: "You need to start mining before simulating a block found.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // This would be a real API call in production
      await apiRequest({
        url: '/api/mining/solo/simulate-block-found',
        method: 'POST'
      });
      
      // Update stats
      setMiningStats({
        ...miningStats,
        blocksFound: miningStats.blocksFound + 1,
        lastBlockFound: new Date().toISOString()
      });
      
      // Add new block to the list
      const newBlock: BlockInfo = {
        height: recentBlocks[0].height + 1,
        hash: "0000000000000000" + Math.random().toString(16).substring(2, 18),
        time: new Date().toISOString(),
        difficulty: miningStats.difficulty,
        txCount: Math.floor(1000 + Math.random() * 2000)
      };
      
      setRecentBlocks([newBlock, ...recentBlocks.slice(0, -1)]);
      
      // Update pending rewards
      setPendingRewards({
        ...pendingRewards,
        immature: pendingRewards.immature + 6.25 // Current block reward
      });
      
      toast({
        title: "Block Found!",
        description: `Congratulations! You've found block #${newBlock.height} and earned 6.25 BTC (immature).`,
        variant: "default",
        duration: 5000,
      });
    } catch (error) {
      console.error("Failed to simulate block found:", error);
      toast({
        title: "Simulation Failed",
        description: "There was an error simulating the block found event.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async () => {
    setIsLoading(true);
    try {
      // This would be a real API call in production
      await apiRequest({
        url: '/api/mining/solo/config',
        method: 'PATCH',
        data: { config }
      });
      
      toast({
        title: "Configuration Updated",
        description: "Solo mining configuration has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update configuration:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the solo mining configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Solo Mining Control Center</h2>
          <p className="text-sm text-muted-foreground">Mine Bitcoin directly to your wallet with no pool fees</p>
        </div>
        <div className="space-x-2">
          {miningActive ? (
            <Button 
              onClick={stopSoloMining} 
              variant="destructive"
              disabled={isLoading}
              className="space-x-2"
            >
              <StopCircle className="h-4 w-4" />
              <span>Stop Mining</span>
            </Button>
          ) : (
            <Button 
              onClick={startSoloMining} 
              disabled={isLoading}
              className="space-x-2 bg-cyan-700 hover:bg-cyan-600 text-white"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Start Solo Mining</span>
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => updateMiningStats()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current hashrate card */}
        <Card className={miningActive ? 'border-cyber-gold' : ''}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Current Hashrate</CardTitle>
              <Zap className={`h-5 w-5 ${miningActive ? 'text-cyber-gold' : 'text-gray-400'}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {miningActive ? (
                <>
                  {miningStats.hashrate < 1000 
                    ? miningStats.hashrate.toFixed(2) 
                    : (miningStats.hashrate / 1000).toFixed(2)}
                  <span className="text-base font-normal ml-1">
                    {miningStats.hashrate < 1000 ? 'MH/s' : 'GH/s'}
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">Not mining</span>
              )}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {selectedHardware.length} device{selectedHardware.length !== 1 ? 's' : ''} selected
            </div>
          </CardContent>
        </Card>

        {/* Network difficulty card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Network Difficulty</CardTitle>
              <CircuitBoard className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(miningStats.difficulty / 1000000000000).toFixed(2)}
              <span className="text-base font-normal ml-1">T</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Estimated time to find a block: {miningStats.estimatedTimeToFind}
            </div>
          </CardContent>
        </Card>

        {/* Blocks found card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Blocks Found</CardTitle>
              <Bitcoin className="h-5 w-5 text-cyber-gold" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {miningStats.blocksFound}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Last found: {miningStats.lastBlockFound === "Never" 
                ? "Never" 
                : new Date(miningStats.lastBlockFound).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hardware">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="hardware">Hardware</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="hardware" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Mining Hardware</CardTitle>
              <CardDescription>
                Select the hardware to use for solo mining
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hardwareList.map(hardware => (
                <div key={hardware} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    {hardware.includes("Antminer") ? (
                      <Server className="h-5 w-5 mr-3 text-blue-500" />
                    ) : hardware.includes("Laptop") ? (
                      <Laptop className="h-5 w-5 mr-3 text-green-500" />
                    ) : (
                      <Cpu className="h-5 w-5 mr-3 text-purple-500" />
                    )}
                    <div>
                      <div className="font-medium">{hardware}</div>
                      <div className="text-xs text-muted-foreground">
                        {hardware.includes("Antminer") ? "ASIC Miner - SHA-256" : 
                         hardware.includes("Laptop") ? "CPU/GPU Mining - Ethash" :
                         "Multi-GPU Mining Rig - Ethash"}
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={selectedHardware.includes(hardware)} 
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedHardware([...selectedHardware, hardware]);
                      } else {
                        setSelectedHardware(selectedHardware.filter(h => h !== hardware));
                      }
                    }}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={() => setSelectedHardware([])}>
                Clear All
              </Button>
              <Button onClick={() => setSelectedHardware([...hardwareList])}>
                Select All
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Performance Multiplier</CardTitle>
              <CardDescription>
                Adjust the performance factor for testing purposes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Performance Factor: {customHashrateFactor.toFixed(1)}x</Label>
                </div>
                <Slider
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={[customHashrateFactor]}
                  onValueChange={(value) => setCustomHashrateFactor(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Adjust this slider to simulate different hashrate levels for testing. Values above 1x represent
                  overclocking or additional hardware, while values below 1x represent throttling.
                </p>
              </div>

              <div className="pt-2">
                <Button 
                  variant="outline" 
                  onClick={simulateBlockFound}
                  disabled={!miningActive || isLoading}
                  className="w-full space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Simulate Block Found (Testing Only)</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recently Found Blocks</CardTitle>
              <CardDescription>
                Latest blocks in the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBlocks.map(block => (
                  <div key={block.hash} className="border rounded-md p-4">
                    <div className="flex justify-between">
                      <div className="font-medium">Block #{block.height}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(block.time).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-2 text-xs font-mono text-muted-foreground overflow-hidden text-ellipsis">
                      {block.hash}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Transactions: </span>
                        {block.txCount}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Difficulty: </span>
                        {(block.difficulty / 1000000000000).toFixed(2)}T
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">
                View More in Block Explorer
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Mining Rewards</CardTitle>
              <CardDescription>
                Rewards from solo mining
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Confirmed</div>
                    <div className="text-xl font-bold">{pendingRewards.confirmed.toFixed(8)} BTC</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Unconfirmed</div>
                    <div className="text-xl font-bold">{pendingRewards.unconfirmed.toFixed(8)} BTC</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Immature</div>
                    <div className="text-xl font-bold">{pendingRewards.immature.toFixed(8)} BTC</div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Block rewards require 100 confirmations before they can be spent
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="w-full text-sm">
                <div className="flex justify-between mb-2">
                  <span>Mining to wallet:</span>
                  <span className="font-mono">{config.walletAddress.substring(0, 10)}...{config.walletAddress.substring(config.walletAddress.length - 6)}</span>
                </div>
                <div className="flex justify-center mt-2">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Link className="h-4 w-4 mr-2" />
                    View Wallet in Block Explorer
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Bitcoin Node Configuration</CardTitle>
              <CardDescription>
                Configure your Bitcoin node connection for solo mining
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rpcUrl">RPC URL</Label>
                  <Input 
                    id="rpcUrl" 
                    value={config.rpcUrl} 
                    onChange={(e) => setConfig({...config, rpcUrl: e.target.value})}
                    placeholder="http://localhost:8332" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rpcUsername">RPC Username</Label>
                    <Input 
                      id="rpcUsername" 
                      value={config.rpcUsername} 
                      onChange={(e) => setConfig({...config, rpcUsername: e.target.value})}
                      placeholder="bitcoinrpc" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rpcPassword">RPC Password</Label>
                    <Input 
                      id="rpcPassword" 
                      type="password" 
                      value={config.rpcPassword} 
                      onChange={(e) => setConfig({...config, rpcPassword: e.target.value})}
                      placeholder="password" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Mining Reward Address</Label>
                  <Input 
                    id="walletAddress" 
                    value={config.walletAddress} 
                    onChange={(e) => setConfig({...config, walletAddress: e.target.value})}
                    placeholder="Your Bitcoin address" 
                  />
                  <p className="text-xs text-muted-foreground">
                    All block rewards will be sent directly to this address
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Performance Settings</CardTitle>
              <CardDescription>
                Adjust mining performance parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="threads">Mining Threads: {config.miningThreads}</Label>
                </div>
                <Slider
                  id="threads"
                  min={1}
                  max={16}
                  step={1}
                  value={[config.miningThreads]}
                  onValueChange={(value) => setConfig({...config, miningThreads: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  Number of CPU threads to use for mining. Higher values may improve performance but will use more system resources.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="memory">Max Memory Usage: {config.maxMemoryUsage} MB</Label>
                </div>
                <Slider
                  id="memory"
                  min={1024}
                  max={8192}
                  step={1024}
                  value={[config.maxMemoryUsage]}
                  onValueChange={(value) => setConfig({...config, maxMemoryUsage: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum memory allocation for the mining process. Higher values may improve performance but will use more system resources.
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="autoRestart"
                  checked={config.autoRestartAfterError}
                  onCheckedChange={(checked) => setConfig({...config, autoRestartAfterError: checked})}
                />
                <Label htmlFor="autoRestart">Automatically restart mining after error</Label>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t flex justify-end">
              <Button 
                onClick={updateConfig}
                disabled={isLoading}
                className="space-x-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save Settings</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Custom Laptop icon since it's not in lucide-react core
function Laptop(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4" width="18" height="12" rx="2" ry="2"></rect>
      <line x1="2" y1="20" x2="22" y2="20"></line>
    </svg>
  );
}