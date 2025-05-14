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
  Button 
} from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Input 
} from '@/components/ui/input';
import { 
  Label 
} from '@/components/ui/label';
import { 
  Switch 
} from '@/components/ui/switch';
import { 
  Badge 
} from '@/components/ui/badge';
import { 
  Zap, 
  Users, 
  Cpu, 
  Terminal,
  Rocket,
  Flame,
  ChevronRight,
  Share2,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface HashRateBoosterProps {
  className?: string;
}

// Mock user data for the selector
const MOCK_USERS = [
  { id: 'all', name: 'All Users' },
  { id: 'user1', name: 'Demo User' },
  { id: 'user2', name: 'John Doe' },
  { id: 'user3', name: 'Jane Smith' },
  { id: 'user4', name: 'Robert Johnson' },
  { id: 'user5', name: 'Sarah Williams' },
];

// Mining hardware options
const MINER_TYPES = [
  { id: 'all', name: 'All Miners' },
  { id: 'ghost', name: 'Ghost Miners' },
  { id: 'main', name: 'Main Miner' },
  { id: 'user', name: 'User Miners' },
];

export function HashRateBooster({ className = '' }: HashRateBoosterProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Boost settings state
  const [boostActive, setBoostActive] = useState(false);
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedMinerType, setSelectedMinerType] = useState('all');
  const [hashRateMultiplier, setHashRateMultiplier] = useState(1.0);
  const [rewardMultiplier, setRewardMultiplier] = useState(1.0);
  const [energyEfficiency, setEnergyEfficiency] = useState(1.0);
  const [customBoostDuration, setCustomBoostDuration] = useState(60); // minutes
  const [isBoostPermanent, setIsBoostPermanent] = useState(true);
  const [boostCountdown, setBoostCountdown] = useState<number | null>(null);
  const [powerboostEnabled, setPowerboostEnabled] = useState(false);
  const [powerboostLevel, setPowerboostLevel] = useState(1.0);
  const [cascadingEffect, setCascadingEffect] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('hashRateBoosterSettings');
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setBoostActive(parsedSettings.boostActive || false);
      setSelectedUser(parsedSettings.selectedUser || 'all');
      setSelectedMinerType(parsedSettings.selectedMinerType || 'all');
      setHashRateMultiplier(parsedSettings.hashRateMultiplier || 1.0);
      setRewardMultiplier(parsedSettings.rewardMultiplier || 1.0);
      setEnergyEfficiency(parsedSettings.energyEfficiency || 1.0);
      setCustomBoostDuration(parsedSettings.customBoostDuration || 60);
      setIsBoostPermanent(parsedSettings.isBoostPermanent !== undefined ? parsedSettings.isBoostPermanent : true);
      setPowerboostEnabled(parsedSettings.powerboostEnabled || false);
      setPowerboostLevel(parsedSettings.powerboostLevel || 1.0);
      setCascadingEffect(parsedSettings.cascadingEffect || false);
      
      // Restore countdown if a temporary boost is active
      if (parsedSettings.boostActive && !parsedSettings.isBoostPermanent) {
        const expirationTime = parsedSettings.expirationTime;
        if (expirationTime && expirationTime > Date.now()) {
          setBoostCountdown(Math.floor((expirationTime - Date.now()) / 1000));
        } else {
          // If expired, deactivate the boost
          setBoostActive(false);
        }
      }
    }
  }, []);

  // Countdown effect for temporary boosts
  useEffect(() => {
    if (!boostActive || isBoostPermanent || boostCountdown === null) return;
    
    const interval = setInterval(() => {
      setBoostCountdown(prevCountdown => {
        if (prevCountdown !== null && prevCountdown > 0) {
          return prevCountdown - 1;
        } else {
          // Boost time has expired
          clearInterval(interval);
          setBoostActive(false);
          setBoostCountdown(null);
          
          toast({
            title: "Boost Expired",
            description: "The temporary hashrate boost has expired.",
            duration: 3000,
          });
          
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['/api/network/stats'] });
          return null;
        }
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [boostActive, isBoostPermanent, boostCountdown, toast, queryClient]);

  // Persist boost settings when changes occur
  useEffect(() => {
    if (!boostActive) return;
    
    const settings = {
      boostActive,
      selectedUser,
      selectedMinerType,
      hashRateMultiplier,
      rewardMultiplier,
      energyEfficiency,
      customBoostDuration,
      isBoostPermanent,
      expirationTime: isBoostPermanent ? null : (Date.now() + customBoostDuration * 60 * 1000),
      powerboostEnabled,
      powerboostLevel,
      cascadingEffect
    };
    
    localStorage.setItem('hashRateBoosterSettings', JSON.stringify(settings));
    
    // Invalidate queries to update UI
    queryClient.invalidateQueries({ queryKey: ['/api/network/stats'] });
  }, [
    boostActive, 
    selectedUser, 
    selectedMinerType, 
    hashRateMultiplier, 
    rewardMultiplier, 
    energyEfficiency, 
    customBoostDuration, 
    isBoostPermanent,
    powerboostEnabled,
    powerboostLevel,
    cascadingEffect,
    queryClient
  ]);

  // Apply the boost settings
  const applyBoost = () => {
    const settings = {
      boostActive: true,
      selectedUser,
      selectedMinerType,
      hashRateMultiplier,
      rewardMultiplier,
      energyEfficiency,
      customBoostDuration,
      isBoostPermanent,
      expirationTime: isBoostPermanent ? null : (Date.now() + customBoostDuration * 60 * 1000),
      powerboostEnabled,
      powerboostLevel,
      cascadingEffect
    };
    
    localStorage.setItem('hashRateBoosterSettings', JSON.stringify(settings));
    setBoostActive(true);
    
    if (!isBoostPermanent) {
      setBoostCountdown(customBoostDuration * 60);
    }
    
    // Invalidate queries to update UI
    queryClient.invalidateQueries({ queryKey: ['/api/network/stats'] });
    
    toast({
      title: "Boost Applied",
      description: `Hashrate boost of ${hashRateMultiplier.toFixed(1)}x applied to ${
        selectedUser === 'all' ? 'all users' : MOCK_USERS.find(u => u.id === selectedUser)?.name
      } (${selectedMinerType === 'all' ? 'all miners' : MINER_TYPES.find(m => m.id === selectedMinerType)?.name}).`,
      duration: 3000,
    });
  };

  // Remove the boost
  const removeBoost = () => {
    setBoostActive(false);
    setBoostCountdown(null);
    localStorage.removeItem('hashRateBoosterSettings');
    
    // Invalidate queries to update UI
    queryClient.invalidateQueries({ queryKey: ['/api/network/stats'] });
    
    toast({
      title: "Boost Removed",
      description: "All hashrate boosts have been removed.",
      duration: 3000,
    });
  };

  // Format remaining time for countdown display
  const formatRemainingTime = (seconds: number | null) => {
    if (seconds === null) return '--:--:--';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate effective boost power
  const calculateEffectiveBoost = (): number => {
    let baseBoost = hashRateMultiplier;
    
    // Add power boost if enabled
    if (powerboostEnabled) {
      baseBoost *= (1 + (powerboostLevel - 1) * 0.5);
    }
    
    // Add cascading effect bonus
    if (cascadingEffect && selectedMinerType === 'all') {
      baseBoost *= 1.2; // 20% synergy bonus for boosting everything
    }
    
    return parseFloat(baseBoost.toFixed(2));
  };

  return (
    <Card className={`w-full bg-gradient-to-br from-gray-900/80 to-orange-900/20 backdrop-blur-sm border border-orange-800/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-400" />
          HashRate Booster
          {boostActive && (
            <Badge className="ml-2 bg-orange-600 animate-pulse">Boost Active</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Powerful controls to boost mining performance for individual miners or the entire network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current boost status */}
          {boostActive && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-700/50 rounded-md p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-orange-400 flex items-center">
                  <Rocket className="h-4 w-4 mr-2" />
                  Active Boost
                </h3>
                {!isBoostPermanent && boostCountdown !== null && (
                  <Badge className="bg-gray-800 text-orange-400 font-mono">
                    {formatRemainingTime(boostCountdown)}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Target:</span>
                    <span className="text-white">
                      {selectedUser === 'all' ? 'All Users' : MOCK_USERS.find(u => u.id === selectedUser)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Miner Type:</span>
                    <span className="text-white">
                      {selectedMinerType === 'all' ? 'All Miners' : MINER_TYPES.find(m => m.id === selectedMinerType)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Duration:</span>
                    <span className="text-white">{isBoostPermanent ? 'Permanent' : `${customBoostDuration} minutes`}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Hashrate Boost:</span>
                    <span className="text-white">×{hashRateMultiplier.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Reward Multiplier:</span>
                    <span className="text-white">×{rewardMultiplier.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Effective Boost:</span>
                    <span className="text-green-400 font-bold">×{calculateEffectiveBoost()}</span>
                  </div>
                </div>
              </div>
              
              <motion.div 
                className="w-full h-2 bg-gray-800 rounded-full mt-3 overflow-hidden"
                animate={{
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-orange-600 via-red-500 to-orange-600"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(100, calculateEffectiveBoost() * 33)}%` }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
            </motion.div>
          )}
          
          {/* Target selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-400 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Boost Target
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-select">User</Label>
                <Select 
                  value={selectedUser} 
                  onValueChange={setSelectedUser} 
                  disabled={boostActive}
                >
                  <SelectTrigger id="user-select" className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {MOCK_USERS.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="miner-type-select">Miner Type</Label>
                <Select 
                  value={selectedMinerType} 
                  onValueChange={setSelectedMinerType}
                  disabled={boostActive}
                >
                  <SelectTrigger id="miner-type-select" className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select miner type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {MINER_TYPES.map(minerType => (
                      <SelectItem key={minerType.id} value={minerType.id}>
                        {minerType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Boost parameters */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-400 flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Boost Parameters
            </h3>
            
            <div className="space-y-4">
              {/* HashRate Multiplier */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center" htmlFor="hashrate-boost">
                    <Cpu className="h-4 w-4 mr-1" />
                    HashRate Multiplier
                  </Label>
                  <span className="text-sm font-medium text-white">×{hashRateMultiplier.toFixed(1)}</span>
                </div>
                <Slider
                  id="hashrate-boost"
                  value={[hashRateMultiplier]}
                  min={1}
                  max={10}
                  step={0.1}
                  onValueChange={(values) => setHashRateMultiplier(values[0])}
                  disabled={boostActive}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Normal</span>
                  <span>5×</span>
                  <span>10×</span>
                </div>
              </div>
              
              {/* Reward Multiplier */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center" htmlFor="reward-boost">
                    <Terminal className="h-4 w-4 mr-1" />
                    Reward Multiplier
                  </Label>
                  <span className="text-sm font-medium text-white">×{rewardMultiplier.toFixed(1)}</span>
                </div>
                <Slider
                  id="reward-boost"
                  value={[rewardMultiplier]}
                  min={1}
                  max={5}
                  step={0.1}
                  onValueChange={(values) => setRewardMultiplier(values[0])}
                  disabled={boostActive}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Normal</span>
                  <span>2.5×</span>
                  <span>5×</span>
                </div>
              </div>
              
              {/* Energy Efficiency */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center" htmlFor="energy-efficiency">
                    <Zap className="h-4 w-4 mr-1" />
                    Energy Efficiency
                  </Label>
                  <span className="text-sm font-medium text-white">×{energyEfficiency.toFixed(1)}</span>
                </div>
                <Slider
                  id="energy-efficiency"
                  value={[energyEfficiency]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={(values) => setEnergyEfficiency(values[0])}
                  disabled={boostActive}
                  className="py-2"
                />
              </div>
            </div>
          </div>
          
          {/* Advanced settings */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-medium text-gray-400 flex items-center">
              <ChevronRight className="h-4 w-4 mr-2" />
              Advanced Settings
            </h3>
            
            <div className="space-y-4">
              {/* Duration settings */}
              <div className="flex items-center justify-between">
                <Label className="flex items-center" htmlFor="permanent-boost">
                  Permanent Boost
                </Label>
                <Switch
                  id="permanent-boost"
                  checked={isBoostPermanent}
                  onCheckedChange={setIsBoostPermanent}
                  disabled={boostActive}
                />
              </div>
              
              {!isBoostPermanent && (
                <div className="space-y-2 pl-6 border-l-2 border-gray-800">
                  <Label className="text-sm text-gray-400" htmlFor="boost-duration">
                    Duration (minutes)
                  </Label>
                  <Input
                    id="boost-duration"
                    type="number"
                    min={1}
                    max={1440} // 24 hours
                    value={customBoostDuration}
                    onChange={(e) => setCustomBoostDuration(parseInt(e.target.value) || 60)}
                    disabled={boostActive}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              )}
              
              {/* PowerBoost */}
              <div className="flex items-center justify-between">
                <Label className="flex items-center" htmlFor="powerboost-toggle">
                  <Rocket className="h-4 w-4 mr-2" />
                  PowerBoost Mode
                </Label>
                <Switch
                  id="powerboost-toggle"
                  checked={powerboostEnabled}
                  onCheckedChange={setPowerboostEnabled}
                  disabled={boostActive}
                />
              </div>
              
              {powerboostEnabled && (
                <div className="space-y-2 pl-6 border-l-2 border-gray-800">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-gray-400" htmlFor="powerboost-level">
                      PowerBoost Level
                    </Label>
                    <span className="text-sm font-medium text-orange-400">Level {powerboostLevel.toFixed(1)}</span>
                  </div>
                  <Slider
                    id="powerboost-level"
                    value={[powerboostLevel]}
                    min={1}
                    max={3}
                    step={0.1}
                    onValueChange={(values) => setPowerboostLevel(values[0])}
                    disabled={boostActive}
                    className="py-2"
                  />
                </div>
              )}
              
              {/* Cascading Effect */}
              <div className="flex items-center justify-between">
                <Label className="flex items-center" htmlFor="cascade-toggle">
                  <Share2 className="h-4 w-4 mr-2" />
                  Cascading Network Effect
                </Label>
                <Switch
                  id="cascade-toggle"
                  checked={cascadingEffect}
                  onCheckedChange={setCascadingEffect}
                  disabled={boostActive || selectedMinerType !== 'all'}
                />
              </div>
              
              {cascadingEffect && (
                <div className="pl-6 border-l-2 border-gray-800">
                  <p className="text-xs text-gray-500">
                    Cascading effect provides a 20% synergy bonus when boosting the entire network,
                    creating a ripple effect across all miners.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {boostActive ? (
          <Button
            variant="destructive"
            onClick={removeBoost}
            className="w-full"
          >
            Remove Boost
          </Button>
        ) : (
          <Button
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            onClick={applyBoost}
          >
            Apply Boost
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default HashRateBooster;