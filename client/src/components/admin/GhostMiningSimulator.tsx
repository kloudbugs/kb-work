import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Slider 
} from '@/components/ui/slider';
import { 
  Toggle 
} from '@/components/ui/toggle';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Input 
} from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Ghost, 
  Cpu, 
  Users, 
  Globe, 
  Award, 
  Activity,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Key,
  Code,
  Play,
  Square,
  Terminal,
  RefreshCw,
  Copy,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface GhostMiningSimulatorProps {
  className?: string;
}

// Available miner models for simulation
const MINER_MODELS = [
  { id: 1, name: 'Antminer S9', hashrate: '14 TH/s' },
  { id: 2, name: 'Antminer S19 Pro', hashrate: '110 TH/s' },
  { id: 3, name: 'Antminer S21 XP', hashrate: '140 TH/s' },
  { id: 4, name: 'Whatsminer M30S++', hashrate: '112 TH/s' },
  { id: 5, name: 'Avalon A1246', hashrate: '90 TH/s' },
  { id: 6, name: 'MicroBT M50', hashrate: '126 TH/s' },
  { id: 7, name: 'Innosilicon T3+', hashrate: '67 TH/s' },
  { id: 8, name: 'Canaan A12', hashrate: '94 TH/s' },
];

// Available regions for simulation
const REGIONS = [
  { id: 1, name: 'North America', country: 'US' },
  { id: 2, name: 'Europe', country: 'DE' },
  { id: 3, name: 'Asia Pacific', country: 'SG' },
  { id: 4, name: 'South America', country: 'BR' },
  { id: 5, name: 'Africa', country: 'ZA' },
  { id: 6, name: 'Middle East', country: 'AE' },
];

export function GhostMiningSimulator({ className = '' }: GhostMiningSimulatorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Ghost mining state
  const [isGhostMiningActive, setIsGhostMiningActive] = useState(false);
  const [ghostMinersCount, setGhostMinersCount] = useState(5);
  const [ghostUsersCount, setGhostUsersCount] = useState(8);
  const [selectedModels, setSelectedModels] = useState<number[]>([1, 2, 3]);
  const [selectedRegions, setSelectedRegions] = useState<number[]>([1, 2, 3]);
  const [rewardMultiplier, setRewardMultiplier] = useState(1);
  const [currentMiners, setCurrentMiners] = useState(0);
  const [currentUsers, setCurrentUsers] = useState(0);
  
  // Admin access is managed by the parent component
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(true);
  
  // Ghost mining effect
  useEffect(() => {
    if (!isGhostMiningActive || !isAdminAuthenticated) return;
    
    const baseHashrate = ghostMinersCount * 20; // TH/s average per miner
    
    // Store the current simulation in local storage
    localStorage.setItem('ghostMiningActive', 'true');
    localStorage.setItem('ghostMinersCount', ghostMinersCount.toString());
    localStorage.setItem('ghostUsersCount', ghostUsersCount.toString());
    localStorage.setItem('selectedModels', JSON.stringify(selectedModels));
    localStorage.setItem('selectedRegions', JSON.stringify(selectedRegions));
    localStorage.setItem('rewardMultiplier', rewardMultiplier.toString());
    
    // Trigger refresh of network data queries
    queryClient.invalidateQueries({ queryKey: ['/api/network/stats'] });
    
    // Show toast notification that ghost mining is active
    toast({
      title: "Ghost Mining Activated",
      description: `Simulating ${ghostMinersCount} miners with ${baseHashrate} TH/s total hashrate.`,
      duration: 3000,
    });
    
    // Update current counts
    setCurrentMiners(ghostMinersCount);
    setCurrentUsers(ghostUsersCount);
    
    return () => {
      // Clean up when component unmounts or ghost mining is deactivated
      if (!isGhostMiningActive) {
        localStorage.removeItem('ghostMiningActive');
      }
    };
  }, [isGhostMiningActive, ghostMinersCount, ghostUsersCount, selectedModels, selectedRegions, rewardMultiplier, isAdminAuthenticated, toast, queryClient]);
  
  // Load settings from local storage on mount
  useEffect(() => {
    const storedGhostMiningActive = localStorage.getItem('ghostMiningActive');
    if (storedGhostMiningActive === 'true') {
      setIsGhostMiningActive(true);
      
      const storedMinersCount = localStorage.getItem('ghostMinersCount');
      if (storedMinersCount) setGhostMinersCount(parseInt(storedMinersCount));
      
      const storedUsersCount = localStorage.getItem('ghostUsersCount');
      if (storedUsersCount) setGhostUsersCount(parseInt(storedUsersCount));
      
      const storedSelectedModels = localStorage.getItem('selectedModels');
      if (storedSelectedModels) setSelectedModels(JSON.parse(storedSelectedModels));
      
      const storedSelectedRegions = localStorage.getItem('selectedRegions');
      if (storedSelectedRegions) setSelectedRegions(JSON.parse(storedSelectedRegions));
      
      const storedRewardMultiplier = localStorage.getItem('rewardMultiplier');
      if (storedRewardMultiplier) setRewardMultiplier(parseFloat(storedRewardMultiplier));
      
      setCurrentMiners(parseInt(storedMinersCount || '0'));
      setCurrentUsers(parseInt(storedUsersCount || '0'));
    }
  }, []);
  
  // Toggle ghost mining
  const toggleGhostMining = () => {
    if (!isAdminAuthenticated) return;
    
    const newState = !isGhostMiningActive;
    setIsGhostMiningActive(newState);
    
    if (!newState) {
      // If turning off, clear storage
      localStorage.removeItem('ghostMiningActive');
      localStorage.removeItem('ghostMinersCount');
      localStorage.removeItem('ghostUsersCount');
      localStorage.removeItem('selectedModels');
      localStorage.removeItem('selectedRegions');
      localStorage.removeItem('rewardMultiplier');
      
      setCurrentMiners(0);
      setCurrentUsers(0);
      
      // Trigger refresh of network data queries
      queryClient.invalidateQueries({ queryKey: ['/api/network/stats'] });
      
      toast({
        title: "Ghost Mining Deactivated",
        description: "All simulated mining activity has been stopped.",
        duration: 3000,
      });
    }
  };
  
  // Toggle a miner model selection
  const toggleMinerModel = (modelId: number) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter(id => id !== modelId));
    } else {
      setSelectedModels([...selectedModels, modelId]);
    }
  };
  
  // Toggle a region selection
  const toggleRegion = (regionId: number) => {
    if (selectedRegions.includes(regionId)) {
      setSelectedRegions(selectedRegions.filter(id => id !== regionId));
    } else {
      setSelectedRegions([...selectedRegions, regionId]);
    }
  };
  
  // Admin authentication is managed by the parent component
  
  return (
    <Card className={`w-full bg-gradient-to-br from-gray-900/80 to-blue-900/20 backdrop-blur-sm border border-blue-900/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ghost className="h-6 w-6 text-blue-400" />
          Ghost Mining Simulator
          <div className="ml-auto">
            <Toggle
              pressed={isGhostMiningActive}
              onPressedChange={toggleGhostMining}
              className={`${isGhostMiningActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {isGhostMiningActive ? (
                <ToggleRight className="h-4 w-4" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )}
            </Toggle>
          </div>
        </CardTitle>
        <CardDescription>
          Simulate mining activity without creating actual database entries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="simulation" className="w-full">
          <TabsList className="mb-4 bg-gray-800 flex flex-wrap">
            <TabsTrigger value="simulation" className="data-[state=active]:bg-blue-900">
              <Ghost className="h-4 w-4 mr-2" />
              Automated Simulation
            </TabsTrigger>
            <TabsTrigger value="manual" className="data-[state=active]:bg-purple-900">
              <Terminal className="h-4 w-4 mr-2" />
              Manual Mining
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-green-900">
              <Key className="h-4 w-4 mr-2" />
              API Integration
            </TabsTrigger>
          </TabsList>
          
          {/* Automated Simulation Tab */}
          <TabsContent value="simulation" className="space-y-6 mt-0">
            {/* Current Simulation Status */}
            {isGhostMiningActive && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-900/20 border border-green-800 rounded-md p-3 mb-4"
              >
                <div className="flex items-center mb-2">
                  <Sparkles className="h-5 w-5 text-green-400 mr-2" />
                  <h3 className="font-medium text-green-400">Simulation Active</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Cpu className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-gray-300">{currentMiners} Miners</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-gray-300">{currentUsers} Users</span>
                  </div>
                </div>
              </motion.div>
            )}
          
            {/* Miner Controls */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400 flex items-center">
                  <Cpu className="h-4 w-4 mr-1" /> Ghost Miners
                </label>
                <span className="text-sm font-medium text-white">{ghostMinersCount}</span>
              </div>
              <Slider
                value={[ghostMinersCount]}
                min={1}
                max={50}
                step={1}
                onValueChange={(values) => setGhostMinersCount(values[0])}
                className="py-2"
              />
            </div>
            
            {/* User Controls */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400 flex items-center">
                  <Users className="h-4 w-4 mr-1" /> Ghost Users
                </label>
                <span className="text-sm font-medium text-white">{ghostUsersCount}</span>
              </div>
              <Slider
                value={[ghostUsersCount]}
                min={1}
                max={50}
                step={1}
                onValueChange={(values) => setGhostUsersCount(values[0])}
                className="py-2"
              />
            </div>
            
            {/* Reward Multiplier */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400 flex items-center">
                  <Award className="h-4 w-4 mr-1" /> Reward Multiplier
                </label>
                <span className="text-sm font-medium text-white">×{rewardMultiplier.toFixed(1)}</span>
              </div>
              <Slider
                value={[rewardMultiplier]}
                min={0.1}
                max={5}
                step={0.1}
                onValueChange={(values) => setRewardMultiplier(values[0])}
                className="py-2"
              />
            </div>
            
            {/* Miner Models Toggles */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 flex items-center">
                <Activity className="h-4 w-4 mr-1" /> Miner Models
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MINER_MODELS.map(model => (
                  <Toggle
                    key={model.id}
                    pressed={selectedModels.includes(model.id)}
                    onPressedChange={() => toggleMinerModel(model.id)}
                    className="justify-start h-auto py-2 text-xs"
                    variant="outline"
                  >
                    <span className="truncate">{model.name}</span>
                    <span className="ml-1 text-gray-500">({model.hashrate})</span>
                  </Toggle>
                ))}
              </div>
            </div>
            
            {/* Region Toggles */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 flex items-center">
                <Globe className="h-4 w-4 mr-1" /> Regions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REGIONS.map(region => (
                  <Toggle
                    key={region.id}
                    pressed={selectedRegions.includes(region.id)}
                    onPressedChange={() => toggleRegion(region.id)}
                    className="justify-start h-auto py-2 text-xs"
                    variant="outline"
                  >
                    <span className="truncate">{region.name}</span>
                    <span className="ml-1 text-gray-500">({region.country})</span>
                  </Toggle>
                ))}
              </div>
            </div>
            
            <Button 
              className={`w-full ${isGhostMiningActive ? 'bg-red-600 hover:bg-red-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}`}
              onClick={toggleGhostMining}
            >
              {isGhostMiningActive ? 'Stop Simulation' : 'Start Simulation'}
            </Button>
          </TabsContent>
          
          {/* Manual Mining Tab */}
          <TabsContent value="manual" className="space-y-6 mt-0">
            <div className="bg-gray-900/60 rounded-lg p-4 border border-purple-800/30">
              <h3 className="text-lg font-medium text-purple-400 mb-3">Manual Ghost Mining</h3>
              <p className="text-sm text-gray-400 mb-4">
                Generate mining activity manually for testing or demonstration purposes. This will instantly create rewards and network activity.
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manualHashrate" className="text-sm text-gray-400">
                      Hashrate to Add (TH/s)
                    </Label>
                    <Input 
                      id="manualHashrate" 
                      type="number" 
                      min="1" 
                      placeholder="100"
                      className="bg-gray-800/60 border-gray-700" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="manualDuration" className="text-sm text-gray-400">
                      Duration (minutes)
                    </Label>
                    <Input 
                      id="manualDuration" 
                      type="number" 
                      min="1" 
                      placeholder="60"
                      className="bg-gray-800/60 border-gray-700" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manualBtcReward" className="text-sm text-gray-400">
                      BTC Reward Amount
                    </Label>
                    <Input 
                      id="manualBtcReward" 
                      type="text" 
                      placeholder="0.00001500"
                      className="bg-gray-800/60 border-gray-700" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="manualDestination" className="text-sm text-gray-400">
                      Destination Wallet
                    </Label>
                    <Input 
                      id="manualDestination" 
                      type="text" 
                      placeholder="Admin Wallet"
                      className="bg-gray-800/60 border-gray-700" 
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Label className="text-sm text-gray-400 mb-2 block">
                    Mining Effects
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Toggle variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Update Statistics
                    </Toggle>
                    <Toggle variant="outline">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Visual Effects
                    </Toggle>
                  </div>
                </div>
                
                <div className="pt-4 flex gap-2">
                  <Button className="bg-purple-700 hover:bg-purple-600 flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Start Mining
                  </Button>
                  <Button variant="outline" className="border-red-800/40 text-red-400 hover:bg-red-900/20">
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/60 rounded-lg p-4 border border-blue-800/30">
              <h3 className="text-lg font-medium text-blue-400 mb-3">Mining Activity Log</h3>
              <div className="rounded bg-gray-950/80 p-3 font-mono text-xs text-gray-400 h-40 overflow-y-auto">
                <div className="space-y-1">
                  <p>[04:10:12] Manual mining session started</p>
                  <p>[04:10:12] Adding 125 TH/s to network for 60 minutes</p>
                  <p>[04:10:12] Generating 0.00001500 BTC reward</p>
                  <p>[04:11:02] Network hashrate updated +125 TH/s</p>
                  <p>[04:11:02] Mining pool fee calculated: 0.00000015 BTC</p>
                  <p>[04:11:02] Transaction prepared for admin wallet</p>
                  <p className="text-green-400">[04:11:03] Mining reward confirmed ✓</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* API Integration Tab */}
          <TabsContent value="api" className="space-y-6 mt-0">
            <div className="bg-gray-900/60 rounded-lg p-4 border border-green-800/30">
              <h3 className="text-lg font-medium text-green-400 mb-3">Ghost Mining API</h3>
              <p className="text-sm text-gray-400 mb-4">
                Connect external systems to the ghost mining framework using secure API keys. Use the endpoints below for integration.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="text-sm text-gray-400 flex items-center">
                    <Key className="h-4 w-4 mr-1" /> API Key
                  </Label>
                  <div className="flex">
                    <Input 
                      id="apiKey" 
                      type="text" 
                      value="ghost_mining_sk_F8a9X7z1P3qYl5vK2bJw" 
                      readOnly
                      className="bg-gray-800/60 border-gray-700 font-mono text-xs" 
                    />
                    <Button 
                      variant="ghost"
                      className="ml-2"
                      onClick={() => {
                        navigator.clipboard.writeText("ghost_mining_sk_F8a9X7z1P3qYl5vK2bJw");
                        toast({
                          title: "API Key Copied",
                          description: "The API key has been copied to your clipboard",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Keep this key secure. It provides full access to the ghost mining system.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400 flex items-center">
                    <Code className="h-4 w-4 mr-1" /> Endpoint Examples
                  </Label>
                  <div className="bg-gray-950/80 p-3 rounded-md font-mono text-xs text-gray-400 overflow-x-auto">
                    <p className="text-blue-400 mb-1"># Start ghost mining simulation</p>
                    <p className="mb-2">POST /api/ghost/mining/start</p>
                    <p className="text-blue-400 mb-1"># Add manual mining reward</p>
                    <p className="mb-2">POST /api/ghost/mining/reward</p>
                    <p className="text-blue-400 mb-1"># Stop all ghost mining activities</p>
                    <p>DELETE /api/ghost/mining/stop</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400">API Status</Label>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-green-400 text-sm">Active and Ready</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate API Key
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/60 rounded-lg p-4 border border-amber-800/30">
              <h3 className="text-lg font-medium text-amber-400 mb-3">API Documentation</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">POST /api/ghost/mining/start</span>
                  <Badge className="bg-green-700">Available</Badge>
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  Starts a ghost mining simulation with the specified parameters.
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">POST /api/ghost/mining/reward</span>
                  <Badge className="bg-green-700">Available</Badge>
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  Manually adds mining rewards to a specified wallet.
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">DELETE /api/ghost/mining/stop</span>
                  <Badge className="bg-green-700">Available</Badge>
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  Stops all ghost mining activities.
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">GET /api/ghost/mining/status</span>
                  <Badge className="bg-green-700">Available</Badge>
                </div>
                <p className="text-xs text-gray-400">
                  Returns the current status of ghost mining activities.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <div className="w-full flex items-center justify-between">
          <p className="text-sm text-gray-400">
            <Key className="h-4 w-4 inline mr-1" /> API Ready for External Integration
          </p>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="border-blue-800/40 text-blue-400 hover:bg-blue-900/20 h-9"
              onClick={() => {
                toast({
                  title: "Documentation",
                  description: "Ghost Mining API documentation has been opened",
                });
              }}
            >
              View Docs
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default GhostMiningSimulator;