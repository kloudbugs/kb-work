import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Ghost, 
  User, 
  Users,
  Cpu, 
  ToggleLeft, 
  ToggleRight, 
  Activity,
  Award,
  PlayCircle,
  Sparkles,
  StopCircle,
  Rocket,
  Send,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mining device models
const MINER_MODELS = [
  { id: 'antminer_s9', name: 'ASIC Antminer S9', hashrate: '14 TH/s' },
  { id: 'antminer_s19', name: 'ASIC Antminer S19', hashrate: '95 TH/s' },
  { id: 'antminer_s19_pro', name: 'ASIC Antminer S19 Pro', hashrate: '110 TH/s' },
  { id: 'whatsminer_m30s', name: 'Whatsminer M30S', hashrate: '90 TH/s' },
  { id: 'avalon_a1246', name: 'Avalon A1246', hashrate: '90 TH/s' },
  { id: 'avalon_a1366', name: 'Avalon A1366', hashrate: '120 TH/s' },
];

// Mining pools
const MINING_POOLS = [
  { id: 1, name: 'Unmineable', algorithm: 'RandomX' },
  { id: 2, name: 'NiceHash', algorithm: 'SCRYPT' },
  { id: 3, name: 'F2Pool', algorithm: 'SHA-256' },
  { id: 4, name: 'Poolin', algorithm: 'SHA-256' },
  { id: 5, name: 'AntPool', algorithm: 'SHA-256' },
  { id: 6, name: 'SlushPool', algorithm: 'SHA-256' },
  { id: 7, name: 'ViaBTC', algorithm: 'SHA-256' },
];

export default function SingleGhostController() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // States for the test ghost account
  const [accountName, setAccountName] = useState('Test Ghost Miner');
  const [isActive, setIsActive] = useState(false);
  const [isSoloMiner, setIsSoloMiner] = useState(false);
  const [numberOfUsers, setNumberOfUsers] = useState(10);
  const [maxUserCount, setMaxUserCount] = useState(500);
  const [customUserCount, setCustomUserCount] = useState('');
  const [totalHashrate, setTotalHashrate] = useState(100);
  const [selectedModel, setSelectedModel] = useState(MINER_MODELS[0].id);
  const [selectedPool, setSelectedPool] = useState(MINING_POOLS[0].id);
  const [simulationMultiplier, setSimulationMultiplier] = useState(1);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Save ghost account state to localStorage
  useEffect(() => {
    if (isActive) {
      const ghostData = {
        accountName,
        numberOfUsers,
        totalHashrate,
        selectedModel,
        selectedPool,
        simulationMultiplier,
        isActive: true,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('singleGhostAccount', JSON.stringify(ghostData));
      
      // Trigger refresh of mining stats
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/network/stats'] });
    }
  }, [isActive, accountName, numberOfUsers, totalHashrate, selectedModel, selectedPool, simulationMultiplier, queryClient]);
  
  // Load ghost account state from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('singleGhostAccount');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.isActive) {
        setAccountName(parsedData.accountName);
        setNumberOfUsers(parsedData.numberOfUsers);
        setTotalHashrate(parsedData.totalHashrate);
        setSelectedModel(parsedData.selectedModel);
        setSelectedPool(parsedData.selectedPool);
        setSimulationMultiplier(parsedData.simulationMultiplier);
        setIsActive(true);
      }
    }
  }, []);
  
  // Create a single ghost account
  const createGhostAccountMutation = useMutation({
    mutationFn: (data: any) => 
      fetch('/api/ghost-users/create-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      }).then(res => {
        if (!res.ok) throw new Error('Failed to deploy test ghost account');
        return res.json();
      }),
    onSuccess: (response) => {
      toast({
        title: 'Test Ghost Account Deployed',
        description: `Successfully deployed test ghost account with ${numberOfUsers} simulated users.`
      });
      
      // Set the active state to true
      setIsActive(true);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to deploy test ghost account',
        variant: 'destructive'
      });
    }
  });
  
  // Stop the ghost account simulation
  const stopGhostAccountMutation = useMutation({
    mutationFn: () => 
      fetch('/api/ghost-users/stop-test', {
        method: 'POST',
        credentials: 'include'
      }).then(res => {
        if (!res.ok) throw new Error('Failed to stop test ghost account');
        return res.json();
      }),
    onSuccess: () => {
      toast({
        title: 'Test Ghost Account Stopped',
        description: 'Successfully stopped test ghost account simulation.'
      });
      
      // Remove from localStorage and set active state to false
      localStorage.removeItem('singleGhostAccount');
      setIsActive(false);
      
      // Refresh mining stats
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/network/stats'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to stop test ghost account',
        variant: 'destructive'
      });
    }
  });
  
  // Deploy the ghost account simulation
  const deployGhostAccount = () => {
    if (!accountName) {
      toast({
        title: 'Validation Error',
        description: 'Account name is required',
        variant: 'destructive'
      });
      return;
    }
    
    createGhostAccountMutation.mutate({
      name: accountName,
      userCount: isSoloMiner ? 1 : numberOfUsers,
      hashrate: totalHashrate,
      model: selectedModel,
      poolId: selectedPool,
      multiplier: simulationMultiplier,
      isSoloMiner,
      useRealMiningMode: !isDemoMode,
      maxCustomUserCount: maxUserCount
    });
  };
  
  // Verify admin password
  const verifyAdminPassword = () => {
    // In a real system, this would be a secure API call
    // For simplicity, we're using the standard admin password
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      toast({
        title: "Admin Access Granted",
        description: "You can now control ghost account deployment.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Admin Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  // If not admin authenticated, show login form
  if (!isAdminAuthenticated) {
    return (
      <Card className="w-full bg-gradient-to-br from-gray-900/80 to-purple-900/20 backdrop-blur-sm border border-purple-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ghost className="h-6 w-6 text-purple-400" />
            Test Ghost Account Deployment
          </CardTitle>
          <CardDescription>
            Admin access required to deploy test ghost accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-400">Admin Password</Label>
              <Input 
                type="password" 
                placeholder="Enter admin password" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={verifyAdminPassword}
          >
            Authenticate
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full bg-gradient-to-br from-gray-900/80 to-purple-900/20 backdrop-blur-sm border border-purple-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ghost className="h-6 w-6 text-purple-400" />
          Test Ghost Account
          {isActive && (
            <Badge className="ml-2 bg-green-600">ACTIVE</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Deploy a single ghost account to simulate mining activity for multiple users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Active Simulation Status */}
          {isActive && (
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
                  {isSoloMiner ? (
                    <>
                      <User className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-gray-300">Solo Miner</span>
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-gray-300">{numberOfUsers} Simulated Users</span>
                    </>
                  )}
                </div>
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-gray-300">{totalHashrate} TH/s Total</span>
                </div>
                <div className="flex items-center">
                  <Cpu className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-gray-300">
                    {MINER_MODELS.find(m => m.id === selectedModel)?.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-gray-300">
                    {MINING_POOLS.find(p => p.id === selectedPool)?.name}
                  </span>
                </div>
                <div className="flex items-center col-span-2 mt-1 pt-1 border-t border-gray-700">
                  <Zap className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-gray-300">
                    {isDemoMode ? "Demo Mode (Visual only)" : "Real Mode (Affects wallet balance)"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Account Name */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Ghost Account Name</Label>
            <Input 
              placeholder="Test Ghost Account" 
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              disabled={isActive}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          {/* Solo Miner Switch */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-gray-400 flex items-center">
                <User className="h-4 w-4 mr-1" /> Solo Miner Mode
              </Label>
              <Switch 
                checked={isSoloMiner}
                onCheckedChange={setIsSoloMiner}
                disabled={isActive}
              />
            </div>
            <p className="text-xs text-gray-500">
              {isSoloMiner 
                ? "Simulate a single miner instead of multiple users" 
                : "Simulate multiple mining users in your network"
              }
            </p>
          </div>
          
          {/* Demo/Real Mode Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-gray-400 flex items-center">
                <Zap className="h-4 w-4 mr-1" /> Demo Mode
              </Label>
              <Switch 
                checked={isDemoMode}
                onCheckedChange={setIsDemoMode}
                disabled={isActive}
              />
            </div>
            <p className="text-xs text-gray-500">
              {isDemoMode 
                ? "Visualize business flow without affecting real mining rewards" 
                : "Real rewards go to the wallet balance"
              }
            </p>
          </div>
          
          {/* Number of Users Settings */}
          {!isSoloMiner && (
            <div className="space-y-3 border-t border-gray-800 pt-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm text-gray-400 flex items-center">
                  <Users className="h-4 w-4 mr-1" /> Number of Simulated Users
                </Label>
                <span className="text-sm font-medium text-white">{numberOfUsers}</span>
              </div>
              
              {/* Custom User Count Control */}
              <div className="flex gap-2 mb-2">
                <Input
                  type="number"
                  placeholder="Custom count"
                  value={customUserCount}
                  onChange={(e) => setCustomUserCount(e.target.value)}
                  className="w-1/3 bg-gray-800 border-gray-700"
                  disabled={isActive}
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isActive || !customUserCount}
                  onClick={() => {
                    const count = parseInt(customUserCount);
                    if (!isNaN(count) && count > 0) {
                      setNumberOfUsers(count);
                      setMaxUserCount(Math.max(count, maxUserCount));
                      setCustomUserCount('');
                    }
                  }}
                  className="flex-1"
                >
                  Set Custom Count
                </Button>
              </div>
              
              {/* Slider */}
              <Slider
                value={[numberOfUsers]}
                min={1}
                max={maxUserCount}
                step={1}
                onValueChange={(values) => setNumberOfUsers(values[0])}
                disabled={isActive}
                className="py-2"
              />
              
              <div className="flex items-center gap-2 mt-2">
                <Label className="text-xs text-gray-500">Quick Set:</Label>
                <div className="flex flex-wrap gap-1">
                  {[1, 5, 10, 25, 50, 100, 200, 500].map(num => (
                    <Button 
                      key={num}
                      variant="outline" 
                      size="sm"
                      disabled={isActive}
                      className="text-xs h-6 px-2 py-0"
                      onClick={() => setNumberOfUsers(num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Total Hashrate Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-gray-400 flex items-center">
                <Activity className="h-4 w-4 mr-1" /> Total Hashrate (TH/s)
              </Label>
              <span className="text-sm font-medium text-white">{totalHashrate} TH/s</span>
            </div>
            <Slider
              value={[totalHashrate]}
              min={10}
              max={1000}
              step={10}
              onValueChange={(values) => setTotalHashrate(values[0])}
              disabled={isActive}
              className="py-2"
            />
          </div>
          
          {/* Miner Model Selector */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-400 flex items-center">
              <Cpu className="h-4 w-4 mr-1" /> Miner Model
            </Label>
            <Select 
              value={selectedModel} 
              onValueChange={setSelectedModel}
              disabled={isActive}
            >
              <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select a miner model" />
              </SelectTrigger>
              <SelectContent>
                {MINER_MODELS.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name} ({model.hashrate})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Mining Pool Selector */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-400 flex items-center">
              <Award className="h-4 w-4 mr-1" /> Mining Pool
            </Label>
            <Select 
              value={selectedPool.toString()} 
              onValueChange={(value) => setSelectedPool(parseInt(value))}
              disabled={isActive}
            >
              <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select a mining pool" />
              </SelectTrigger>
              <SelectContent>
                {MINING_POOLS.map(pool => (
                  <SelectItem key={pool.id} value={pool.id.toString()}>
                    {pool.name} ({pool.algorithm})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Simulation Multiplier */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-gray-400 flex items-center">
                <Sparkles className="h-4 w-4 mr-1" /> Reward Multiplier
              </Label>
              <span className="text-sm font-medium text-white">×{simulationMultiplier.toFixed(1)}</span>
            </div>
            <Slider
              value={[simulationMultiplier]}
              min={0.1}
              max={5}
              step={0.1}
              onValueChange={(values) => setSimulationMultiplier(values[0])}
              disabled={isActive}
              className="py-2"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            setIsAdminAuthenticated(false);
            setAdminPassword('');
          }}
        >
          Log Out
        </Button>
        {isActive ? (
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={() => stopGhostAccountMutation.mutate()}
            disabled={stopGhostAccountMutation.isPending}
          >
            <StopCircle className="h-4 w-4 mr-2" />
            {stopGhostAccountMutation.isPending ? 'Stopping...' : 'Stop Simulation'}
          </Button>
        ) : (
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={deployGhostAccount}
            disabled={createGhostAccountMutation.isPending}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            {createGhostAccountMutation.isPending ? 'Deploying...' : 'Deploy Test Account'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}