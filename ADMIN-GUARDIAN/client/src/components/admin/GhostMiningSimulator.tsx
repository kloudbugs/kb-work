import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
import { 
  Ghost, 
  Cpu, 
  Users, 
  Globe, 
  Award, 
  Activity,
  ToggleLeft,
  ToggleRight,
  Sparkles
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
        <div className="space-y-6">
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          className={`${isGhostMiningActive ? 'bg-red-600 hover:bg-red-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}`}
          onClick={toggleGhostMining}
        >
          {isGhostMiningActive ? 'Stop Simulation' : 'Start Simulation'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default GhostMiningSimulator;