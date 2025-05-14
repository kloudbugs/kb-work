import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Bitcoin, Check, ChevronRight, Cloud, Coffee, Cpu, 
  Database, Edit, Globe, Home, Power, Rocket, Server, Settings, 
  Shield, Users, Wallet, Zap 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function DeployMining() {
  const [, navigate] = useLocation();
  const [deploying, setDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentStep, setDeploymentStep] = useState(0);
  const { toast } = useToast();
  
  const steps = [
    "Validating Configuration",
    "Setting Up Mining Environment",
    "Connecting to Mining Pools",
    "Initializing Hardware",
    "Optimizing Performance",
    "Starting Mining Operations"
  ];
  
  // Fetch mining stats
  const { data: miningStats } = useQuery({
    queryKey: ['/api/mining/stats'],
    placeholderData: {
      hashRate: 0,
      activeMiners: 0,
      totalMiners: 0,
      networkDifficulty: '0',
      blockReward: '0',
      estimatedEarnings: {
        daily: '0.00000000',
        weekly: '0.00000000',
        monthly: '0.00000000'
      }
    }
  });
  
  // Fetch cloud mining status
  const { data: cloudStatus } = useQuery({
    queryKey: ['/api/mining/cloud/status'],
    placeholderData: {
      active: false,
      instances: 0,
      totalHashRate: '0 TH/s',
      costPerDay: '$0.00',
      credits: '0.00',
      estimatedProfit: '0.00000000'
    }
  });
  
  // Fetch mining pools
  const { data: poolsData } = useQuery({
    queryKey: ['/api/pools'],
    placeholderData: {
      pools: []
    }
  });
  
  // Initialize configs from various mining areas
  const [configs, setConfigs] = useState({
    // Bitcoin Mining Configuration
    bitcoin: {
      enabled: false,
      pool: "Unknown Pool",
      hashrate: "0 GH/s",
      algorithm: "SHA-256",
      workers: 0
    },
    // Cloud Mining Configuration
    cloud: {
      enabled: cloudStatus?.active || false,
      instances: cloudStatus?.instances || 0,
      hashPower: cloudStatus?.totalHashRate || "0 TH/s",
      costPerDay: cloudStatus?.costPerDay || "$0.00",
      credits: cloudStatus?.credits || "0.00"
    },
    // ASIC Mining Configuration
    asic: {
      enabled: false,
      devices: 0,
      model: "Unknown",
      efficiency: "0 J/TH",
      power: "0W"
    },
    // General Mining Configuration
    general: {
      estimatedRevenue: miningStats?.estimatedEarnings?.daily || "0.00000000 BTC / day",
      fee: poolsData?.pools?.length > 0 ? `${poolsData.pools[0].fee}%` : "2%",
      payoutThreshold: "0.005 BTC",
      walletAddress: "Awaiting Configuration"
    }
  });

  // Update configs when cloud status changes
  useEffect(() => {
    if (cloudStatus) {
      setConfigs(prev => ({
        ...prev,
        cloud: {
          ...prev.cloud,
          enabled: cloudStatus.active || false,
          instances: cloudStatus.instances || 0,
          hashPower: cloudStatus.totalHashRate || "0 TH/s",
          costPerDay: cloudStatus.costPerDay || "$0.00",
          credits: cloudStatus.credits || "0.00"
        }
      }));
    }
  }, [cloudStatus]);

  // Update configs when mining stats change
  useEffect(() => {
    if (miningStats) {
      setConfigs(prev => ({
        ...prev,
        general: {
          ...prev.general,
          estimatedRevenue: miningStats.estimatedEarnings?.daily 
            ? `${miningStats.estimatedEarnings.daily} BTC / day` 
            : "0.00000000 BTC / day"
        },
        bitcoin: {
          ...prev.bitcoin,
          enabled: miningStats.activeMiners > 0,
          workers: miningStats.activeMiners || 0,
          hashrate: `${(miningStats.hashRate / 1000).toFixed(2)} GH/s`
        }
      }));
    }
  }, [miningStats]);

  // Update configs when pools data changes
  useEffect(() => {
    if (poolsData && poolsData.pools && poolsData.pools.length > 0) {
      const activePool = poolsData.pools[0]; // Assume first pool is active
      setConfigs(prev => ({
        ...prev,
        general: {
          ...prev.general,
          fee: `${activePool.fee || 2}%`
        },
        bitcoin: {
          ...prev.bitcoin,
          pool: activePool.name || "Unknown Pool"
        }
      }));
    }
  }, [poolsData]);
  
  // Get wallet info
  const { data: walletData } = useQuery({
    queryKey: ['/api/wallet'],
    placeholderData: {
      address: 'Not configured',
      balance: '0.00000000'
    }
  });

  // Update wallet address when wallet data changes
  useEffect(() => {
    if (walletData && walletData.address) {
      setConfigs(prev => ({
        ...prev,
        general: {
          ...prev.general,
          walletAddress: walletData.address
        }
      }));
    }
  }, [walletData]);
  
  const handleDeploy = () => {
    setDeploying(true);
    
    // Simulating deployment process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 3;
      setDeploymentProgress(progress);
      
      // Update step
      setDeploymentStep(Math.min(Math.floor(progress / 20), steps.length - 1));
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Show success message
        toast({
          title: "Mining Deployment Successful",
          description: "Your mining operation has been successfully deployed and is now active.",
          duration: 5000,
        });
        
        // Redirect to the deployment redirect page with welcome animation
        setTimeout(() => {
          navigate('/deployment-redirect');
        }, 1000);
      }
    }, 200);
    
    return () => clearInterval(interval);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Deploy Mining</h1>
            <p className="text-muted-foreground">
              Review your configuration and deploy your mining setup
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-blue-600/40 text-blue-400 hover:bg-blue-950/30 hover:text-blue-300"
              onClick={() => navigate("/mining-cafe")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Mining Cafe
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 bg-indigo-950/30 border border-indigo-600/40 text-indigo-400 hover:bg-indigo-950/50 hover:text-indigo-300"
              onClick={() => navigate("/dashboard")}
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Configuration Summary */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Settings className="mr-2 h-5 w-5 text-blue-400" />
                  Mining Configuration
                </CardTitle>
                <CardDescription>
                  Review your mining setup before deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Bitcoin Mining Section */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Bitcoin className="h-5 w-5 mr-2 text-amber-500" />
                      <h3 className="text-lg font-medium">Bitcoin Mining Configuration</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-amber-400" />
                            <span className="text-sm text-muted-foreground">Mining Pool</span>
                          </div>
                          <div className="font-semibold">{configs.bitcoin.pool}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-amber-400" />
                            <span className="text-sm text-muted-foreground">Hashrate</span>
                          </div>
                          <div className="font-semibold">{configs.bitcoin.hashrate}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-amber-400" />
                            <span className="text-sm text-muted-foreground">Algorithm</span>
                          </div>
                          <div className="font-semibold">{configs.bitcoin.algorithm}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Cpu className="h-4 w-4 mr-2 text-amber-400" />
                            <span className="text-sm text-muted-foreground">Active Workers</span>
                          </div>
                          <div className="font-semibold">{configs.bitcoin.workers}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 pl-7">
                      <Badge className={`px-3 py-1 ${configs.bitcoin.enabled 
                        ? 'bg-green-600/20 text-green-500 border border-green-600/30' 
                        : 'bg-yellow-600/20 text-yellow-500 border border-yellow-600/30'}`}>
                        {configs.bitcoin.enabled 
                          ? <><Check className="h-3 w-3 mr-1" /> Enabled</> 
                          : 'Not Configured'}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Cloud Mining Section */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Cloud className="h-5 w-5 mr-2 text-blue-500" />
                      <h3 className="text-lg font-medium">Cloud Mining Configuration</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Server className="h-4 w-4 mr-2 text-blue-400" />
                            <span className="text-sm text-muted-foreground">Instances</span>
                          </div>
                          <div className="font-semibold">{configs.cloud.instances}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-blue-400" />
                            <span className="text-sm text-muted-foreground">Hash Power</span>
                          </div>
                          <div className="font-semibold">{configs.cloud.hashPower}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Database className="h-4 w-4 mr-2 text-blue-400" />
                            <span className="text-sm text-muted-foreground">Cost Per Day</span>
                          </div>
                          <div className="font-semibold">{configs.cloud.costPerDay}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Database className="h-4 w-4 mr-2 text-blue-400" />
                            <span className="text-sm text-muted-foreground">Available Credits</span>
                          </div>
                          <div className="font-semibold">{configs.cloud.credits}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 pl-7">
                      <Badge className={`px-3 py-1 ${configs.cloud.enabled 
                        ? 'bg-green-600/20 text-green-500 border border-green-600/30' 
                        : 'bg-yellow-600/20 text-yellow-500 border border-yellow-600/30'}`}>
                        {configs.cloud.enabled 
                          ? <><Check className="h-3 w-3 mr-1" /> Enabled</> 
                          : 'Not Configured'}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Cafe Mining Section */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Coffee className="h-5 w-5 mr-2 text-purple-500" />
                      <h3 className="text-lg font-medium">Mining Cafe Configuration</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Database className="h-4 w-4 mr-2 text-green-400" />
                            <span className="text-sm text-muted-foreground">Estimated Revenue</span>
                          </div>
                          <div className="font-semibold">{configs.general.estimatedRevenue}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-purple-400" />
                            <span className="text-sm text-muted-foreground">Pool Fee</span>
                          </div>
                          <div className="font-semibold">{configs.general.fee}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Database className="h-4 w-4 mr-2 text-purple-400" />
                            <span className="text-sm text-muted-foreground">Payout Threshold</span>
                          </div>
                          <div className="font-semibold">{configs.general.payoutThreshold}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Wallet className="h-4 w-4 mr-2 text-purple-400" />
                            <span className="text-sm text-muted-foreground">Wallet Address</span>
                          </div>
                          <div className="font-medium text-xs truncate max-w-[200px]">
                            {configs.general.walletAddress}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <Alert className="bg-blue-950/30 border-blue-800/50">
                    <Globe className="h-4 w-4 text-blue-400" />
                    <AlertTitle>Mining Network Information</AlertTitle>
                    <AlertDescription className="text-gray-300">
                      Your mining operations will be synchronized across our global network. 
                      All earnings will be automatically credited to your account wallet.
                      You can monitor performance and make adjustments at any time.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardFooter className="pt-4 pb-6 flex justify-end">
                <Button 
                  variant="outline"
                  onClick={() => navigate("/mining-cafe")}
                  className="mr-2"
                >
                  Edit Configuration
                </Button>
                
                <Button 
                  onClick={handleDeploy}
                  disabled={deploying}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8"
                >
                  {deploying ? "Deploying..." : "Deploy Mining"}
                  {!deploying && <Rocket className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Status Panel */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-gray-900/80 to-green-900/20 border-green-900/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Rocket className="mr-2 h-5 w-5 text-green-400" />
                    Deployment Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!deploying ? (
                    <div className="text-center py-8">
                      <div className="relative mb-6">
                        <Rocket className="h-16 w-16 text-green-500 mx-auto" />
                        <motion.div
                          className="absolute inset-0 rounded-full bg-green-500/20"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5] 
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-green-300 mb-2">Ready to Deploy</h3>
                      <p className="text-gray-400 mb-6">
                        Your mining configuration is ready to be deployed. Click the Deploy button to start mining.
                      </p>
                      <Button 
                        onClick={handleDeploy}
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                      >
                        Deploy Now
                        <Rocket className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-green-300">Deploying Mining</h3>
                            <Badge className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5">
                              {deploymentProgress}%
                            </Badge>
                          </div>
                          <Progress 
                            value={deploymentProgress}
                            className="h-2 bg-gray-800/60 [&>div]:bg-gradient-to-r [&>div]:from-green-600 [&>div]:to-emerald-600"
                          />
                        </div>
                        
                        <div className="space-y-4">
                          {steps.map((step, index) => (
                            <div 
                              key={index}
                              className={`flex items-center ${index <= deploymentStep ? 'text-white' : 'text-gray-500'}`}
                            >
                              <div className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 ${
                                index < deploymentStep 
                                  ? 'bg-green-600 text-white' 
                                  : index === deploymentStep 
                                    ? 'bg-green-600 text-white border border-green-400 animate-pulse' 
                                    : 'bg-gray-800 text-gray-500 border border-gray-700'
                              }`}>
                                {index < deploymentStep ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <span className="text-xs">{index + 1}</span>
                                )}
                              </div>
                              <span className={`text-sm ${
                                index < deploymentStep 
                                  ? 'text-green-400' 
                                  : index === deploymentStep 
                                    ? 'text-green-300' 
                                    : 'text-gray-500'
                              }`}>
                                {step}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        {deploymentProgress >= 100 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-4 p-4 bg-green-900/20 border border-green-900/40 rounded-md"
                          >
                            <div className="flex items-center mb-2">
                              <Check className="h-5 w-5 text-green-500 mr-2" />
                              <h3 className="text-lg font-bold text-green-400">Deployment Complete</h3>
                            </div>
                            <p className="text-gray-300 text-sm">
                              Your mining operation has been successfully deployed and is now active. Redirecting to dashboard...
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}