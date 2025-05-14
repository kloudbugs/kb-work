import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ElectricBorder } from '@/components/ui/electric-border';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import {
  Zap,
  Server,
  CpuIcon,
  Settings,
  Flame,
  Users,
  CheckCircle,
  ChevronRight,
  Check,
  Loader2,
  Rocket,
  Coffee
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MiningSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  
  // Mining configuration state
  const [config, setConfig] = useState({
    hardware: {
      type: 'cpu', // cpu, gpu, asic
      cpuThreads: 4,
      gpuIntensity: 50,
      asicModel: 'antminer-s9',
      powerLimit: 80
    },
    pool: {
      id: '',
      url: '',
      username: '',
      password: 'x',
      algorithm: 'sha256'
    },
    settings: {
      autoStart: true,
      lowPowerMode: false,
      optimizationLevel: 'balanced', // efficiency, balanced, performance
      enableLogging: true,
      maxTemperature: 80,
      fanSpeed: 70
    }
  });
  
  // Fetch mining pools
  const { data: poolsData } = useQuery({
    queryKey: ['/api/pools'],
  });
  
  // Handle step navigation
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Update configuration
  const updateHardwareConfig = (field: string, value: any) => {
    setConfig({
      ...config,
      hardware: {
        ...config.hardware,
        [field]: value
      }
    });
  };
  
  const updatePoolConfig = (field: string, value: any) => {
    setConfig({
      ...config,
      pool: {
        ...config.pool,
        [field]: value
      }
    });
  };
  
  const updateSettings = (field: string, value: any) => {
    setConfig({
      ...config,
      settings: {
        ...config.settings,
        [field]: value
      }
    });
  };
  
  // Deploy mining configuration
  const deployMining = async () => {
    setIsDeploying(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Mining Deployed Successfully",
        description: "Your mining configuration has been deployed and is now active.",
        variant: "success",
      });
      
      // Navigate to mining dashboard
      setLocation('/network-dashboard');
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: "Unable to deploy mining configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };
  
  // Progress percentage for the stepper
  const progressPercentage = (currentStep / 4) * 100;
  
  return (
    <MainLayout>
      {/* Brew Station Header */}
      <div className="relative mb-8 overflow-hidden rounded-xl">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-amber-800/30 to-indigo-900/40 z-0"></div>
        <div className="absolute inset-0 bg-[url('/src/assets/cosmic-background.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        
        {/* Dynamic particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-amber-400"
              style={{ 
                width: Math.random() * 4 + 2, 
                height: Math.random() * 4 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2
              }}
              animate={{
                y: [Math.random() * -20, Math.random() * 20],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-500/20 to-amber-600/0"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundSize: '200% 200%' }}
        />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:space-x-6">
            {/* Cosmic Coffee Icon with orbit */}
            <div className="relative mb-4 md:mb-0">
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 0 4px rgba(251, 191, 36, 0.1)',
                    '0 0 0 8px rgba(251, 191, 36, 0.05)',
                    '0 0 0 4px rgba(251, 191, 36, 0.1)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 360 }}
                transition={{ 
                  duration: 30, 
                  repeat: Infinity, 
                  ease: "linear",
                  opacity: { duration: 0.5, ease: "easeOut" },
                  scale: { duration: 0.5, ease: "easeOut" }
                }}
                className="absolute w-24 h-24 rounded-full border border-amber-500/20"
              />
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 bg-gradient-to-br from-amber-600 to-amber-800 p-4 rounded-full"
              >
                <Coffee className="h-12 w-12 text-amber-100" />
              </motion.div>
              
              {/* Orbiting particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`orbit-particle-${i}`}
                  className="absolute w-2 h-2 bg-amber-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: Math.cos(Math.PI * 2 / 3 * i) * 40,
                    y: Math.sin(Math.PI * 2 / 3 * i) * 40,
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                />
              ))}
            </div>
            
            <div className="text-center md:text-left">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                BREW STATION
              </motion.h1>
              
              <motion.p
                className="text-amber-200/90 mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                The cosmic laboratory where mining configurations are brewed to perfection
              </motion.p>
              
              {/* Decorative line */}
              <motion.div 
                className="h-0.5 w-0 bg-gradient-to-r from-amber-600/0 via-amber-500 to-amber-600/0 mt-3 mx-auto md:mx-0"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            
            <div className="ml-auto mt-4 md:mt-0">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/mining-cafe')}
                className="text-amber-200 hover:text-white hover:bg-amber-800/30 border border-amber-500/30 hover:border-amber-400"
              >
                Back to Mining Cafe
              </Button>
            </div>
          </div>
        </div>
        
        {/* Glowing bottom border */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-900/0 via-amber-500 to-amber-900/0"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            backgroundPosition: ['0%', '100%']
          }}
          transition={{ 
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" }
          }}
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              MINING SETUP WIZARD
            </h2>
            <p className="text-gray-400">Configure your mining setup in a few simple steps</p>
          </div>
          
          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="relative">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4].map((step) => (
                  <div 
                    key={step} 
                    className={`flex flex-col items-center ${step <= currentStep ? 'text-blue-400' : 'text-gray-500'}`}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        step < currentStep ? 'bg-blue-900 text-white' : 
                        step === currentStep ? 'bg-blue-600 text-white border-2 border-blue-400' : 
                        'bg-gray-800 text-gray-500 border border-gray-700'
                      }`}
                    >
                      {step < currentStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span>{step}</span>
                      )}
                    </div>
                    <span className="text-sm">
                      {step === 1 && 'Hardware'}
                      {step === 2 && 'Pool'}
                      {step === 3 && 'Settings'}
                      {step === 4 && 'Deploy'}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="relative w-full h-2 bg-gray-800 rounded-full mt-2 mb-8">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Step Content */}
          <ElectricBorder
            className="rounded-xl overflow-hidden"
            cornerSize="md"
            cornerAccentColor="border-blue-500"
            edgeGlowColor="rgba(59, 130, 246, 0.5)"
          >
            {/* Hardware Configuration - Step 1 */}
            {currentStep === 1 && (
              <div className="bg-gray-950 p-6 min-h-[500px]">
                <div className="flex items-center mb-6">
                  <Server className="w-6 h-6 text-blue-400 mr-2" />
                  <h2 className="text-2xl font-bold">Hardware Configuration</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Hardware Type Selection */}
                  <div className="mb-6">
                    <Label htmlFor="hardware-type" className="mb-2 block">Hardware Type</Label>
                    <RadioGroup 
                      defaultValue={config.hardware.type}
                      onValueChange={(value) => updateHardwareConfig('type', value)}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div>
                        <RadioGroupItem 
                          value="cpu" 
                          id="cpu" 
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor="cpu"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-gray-800 bg-gray-900 p-4 hover:bg-gray-800 hover:border-blue-500 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-950/30 [&:has([data-state=checked])]:border-blue-500"
                        >
                          <CpuIcon className="mb-3 h-6 w-6 text-blue-400" />
                          <div className="mb-2 text-lg font-medium">CPU Mining</div>
                          <p className="text-sm text-gray-400">Use your computer's processor for mining operations.</p>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem 
                          value="gpu" 
                          id="gpu" 
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor="gpu"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-gray-800 bg-gray-900 p-4 hover:bg-gray-800 hover:border-blue-500 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-950/30"
                        >
                          <Zap className="mb-3 h-6 w-6 text-purple-400" />
                          <div className="mb-2 text-lg font-medium">GPU Mining</div>
                          <p className="text-sm text-gray-400">Leverage your graphics card for higher mining performance.</p>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem 
                          value="asic" 
                          id="asic" 
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor="asic"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-gray-800 bg-gray-900 p-4 hover:bg-gray-800 hover:border-blue-500 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-950/30"
                        >
                          <Server className="mb-3 h-6 w-6 text-cyan-400" />
                          <div className="mb-2 text-lg font-medium">ASIC Mining</div>
                          <p className="text-sm text-gray-400">Connect specialized ASIC hardware for maximum efficiency.</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Hardware Specific Settings */}
                  <div className="mb-6 border border-gray-800 rounded-lg p-4 bg-gray-900/50">
                    {config.hardware.type === 'cpu' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium mb-4">CPU Configuration</h3>
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label htmlFor="cpu-threads">CPU Threads: {config.hardware.cpuThreads}</Label>
                            <span className="text-gray-400 text-sm">Current: {config.hardware.cpuThreads}</span>
                          </div>
                          <Slider
                            id="cpu-threads"
                            min={1}
                            max={32}
                            step={1}
                            value={[config.hardware.cpuThreads]}
                            onValueChange={(value) => updateHardwareConfig('cpuThreads', value[0])}
                            className="my-4"
                          />
                          <p className="text-sm text-gray-400">Higher thread counts increase mining power but consume more system resources.</p>
                        </div>
                      </div>
                    )}
                    
                    {config.hardware.type === 'gpu' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium mb-4">GPU Configuration</h3>
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label htmlFor="gpu-intensity">GPU Intensity: {config.hardware.gpuIntensity}%</Label>
                            <span className="text-gray-400 text-sm">Higher = More Heat</span>
                          </div>
                          <Slider
                            id="gpu-intensity"
                            min={1}
                            max={100}
                            step={1}
                            value={[config.hardware.gpuIntensity]}
                            onValueChange={(value) => updateHardwareConfig('gpuIntensity', value[0])}
                            className="my-4"
                          />
                          <p className="text-sm text-gray-400">Controls how intensively your GPU will be used. Higher values increase heat generation.</p>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label htmlFor="power-limit">Power Limit: {config.hardware.powerLimit}%</Label>
                            <span className="text-gray-400 text-sm">Lower = More Efficiency</span>
                          </div>
                          <Slider
                            id="power-limit"
                            min={50}
                            max={100}
                            step={1}
                            value={[config.hardware.powerLimit]}
                            onValueChange={(value) => updateHardwareConfig('powerLimit', value[0])}
                            className="my-4"
                          />
                          <p className="text-sm text-gray-400">Limits power consumption. Lower values improve efficiency at the cost of some performance.</p>
                        </div>
                      </div>
                    )}
                    
                    {config.hardware.type === 'asic' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium mb-4">ASIC Configuration</h3>
                        <div>
                          <Label htmlFor="asic-model" className="mb-2 block">ASIC Model</Label>
                          <Select 
                            value={config.hardware.asicModel}
                            onValueChange={(value) => updateHardwareConfig('asicModel', value)}
                          >
                            <SelectTrigger id="asic-model" className="bg-gray-800 border-gray-700">
                              <SelectValue placeholder="Select ASIC model" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="antminer-s9">Antminer S9</SelectItem>
                              <SelectItem value="antminer-s17">Antminer S17</SelectItem>
                              <SelectItem value="antminer-s19">Antminer S19</SelectItem>
                              <SelectItem value="whatsminer-m30s">Whatsminer M30S</SelectItem>
                              <SelectItem value="avalon-1246">Avalon 1246</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-gray-400 mt-2">Selecting the correct model ensures optimal mining parameters are applied.</p>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label htmlFor="fan-speed">Fan Speed: {config.settings.fanSpeed}%</Label>
                            <span className="text-gray-400 text-sm">Higher = More Cooling</span>
                          </div>
                          <Slider
                            id="fan-speed"
                            min={40}
                            max={100}
                            step={1}
                            value={[config.settings.fanSpeed]}
                            onValueChange={(value) => updateSettings('fanSpeed', value[0])}
                            className="my-4"
                          />
                          <p className="text-sm text-gray-400">Controls the ASIC cooling fan speed. Higher values improve cooling but increase noise.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Pool Configuration - Step 2 */}
            {currentStep === 2 && (
              <div className="bg-gray-950 p-6 min-h-[500px]">
                <div className="flex items-center mb-6">
                  <Users className="w-6 h-6 text-blue-400 mr-2" />
                  <h2 className="text-2xl font-bold">Pool Configuration</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Pool Selection */}
                  <div className="mb-6">
                    <Label htmlFor="pool-selection" className="mb-2 block">Select Mining Pool</Label>
                    <Select 
                      value={config.pool.id}
                      onValueChange={(value) => {
                        const selectedPool = poolsData?.pools?.find(pool => pool.id.toString() === value);
                        if (selectedPool) {
                          updatePoolConfig('id', value);
                          updatePoolConfig('url', selectedPool.url);
                          updatePoolConfig('algorithm', selectedPool.algorithm || 'sha256');
                        }
                      }}
                    >
                      <SelectTrigger id="pool-selection" className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select mining pool" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {poolsData?.pools?.map(pool => (
                          <SelectItem key={pool.id} value={pool.id.toString()}>
                            {pool.name}
                          </SelectItem>
                        )) || (
                          <SelectItem value="loading" disabled>
                            Loading pools...
                          </SelectItem>
                        )}
                        <SelectItem value="custom">Custom Pool</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-400 mt-2">Join a mining pool to combine resources with other miners and receive more regular payouts.</p>
                  </div>
                  
                  {/* Custom Pool Entry */}
                  {config.pool.id === 'custom' && (
                    <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50 mb-6">
                      <h3 className="text-lg font-medium mb-4">Custom Pool Configuration</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="pool-url" className="mb-2 block">Pool URL</Label>
                          <Input
                            id="pool-url"
                            placeholder="stratum+tcp://pool.example.com:3333"
                            value={config.pool.url}
                            onChange={(e) => updatePoolConfig('url', e.target.value)}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pool-algorithm" className="mb-2 block">Mining Algorithm</Label>
                          <Select 
                            value={config.pool.algorithm}
                            onValueChange={(value) => updatePoolConfig('algorithm', value)}
                          >
                            <SelectTrigger id="pool-algorithm" className="bg-gray-800 border-gray-700">
                              <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="sha256">SHA-256 (Bitcoin)</SelectItem>
                              <SelectItem value="ethash">Ethash (Ethereum)</SelectItem>
                              <SelectItem value="randomx">RandomX (Monero)</SelectItem>
                              <SelectItem value="kawpow">KawPow (Ravencoin)</SelectItem>
                              <SelectItem value="autolykos2">Autolykos2 (Ergo)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Pool Credentials */}
                  <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
                    <h3 className="text-lg font-medium mb-4">Mining Credentials</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="pool-username" className="mb-2 block">Username/Wallet</Label>
                        <Input
                          id="pool-username"
                          placeholder="Enter your wallet address or username"
                          value={config.pool.username}
                          onChange={(e) => updatePoolConfig('username', e.target.value)}
                          className="bg-gray-800 border-gray-700"
                        />
                        <p className="text-sm text-gray-400 mt-2">Usually your wallet address where you'll receive mining rewards, or your pool username.</p>
                      </div>
                      <div>
                        <Label htmlFor="pool-password" className="mb-2 block">Password (Optional)</Label>
                        <Input
                          id="pool-password"
                          placeholder="Usually 'x' or worker name"
                          value={config.pool.password}
                          onChange={(e) => updatePoolConfig('password', e.target.value)}
                          className="bg-gray-800 border-gray-700"
                        />
                        <p className="text-sm text-gray-400 mt-2">Many pools use 'x' as default password or your worker name.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Advanced Settings - Step 3 */}
            {currentStep === 3 && (
              <div className="bg-gray-950 p-6 min-h-[500px]">
                <div className="flex items-center mb-6">
                  <Settings className="w-6 h-6 text-blue-400 mr-2" />
                  <h2 className="text-2xl font-bold">Advanced Settings</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Basic Settings */}
                  <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50 mb-6">
                    <h3 className="text-lg font-medium mb-4">Basic Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-start" className="text-base font-medium">Auto-start Mining</Label>
                          <p className="text-sm text-gray-400">Automatically start mining when system boots</p>
                        </div>
                        <Switch
                          id="auto-start"
                          checked={config.settings.autoStart}
                          onCheckedChange={(checked) => updateSettings('autoStart', checked)}
                        />
                      </div>
                      <Separator className="bg-gray-800" />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="low-power" className="text-base font-medium">Low Power Mode</Label>
                          <p className="text-sm text-gray-400">Reduce power consumption at the cost of hashrate</p>
                        </div>
                        <Switch
                          id="low-power"
                          checked={config.settings.lowPowerMode}
                          onCheckedChange={(checked) => updateSettings('lowPowerMode', checked)}
                        />
                      </div>
                      <Separator className="bg-gray-800" />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enable-logging" className="text-base font-medium">Enable Detailed Logging</Label>
                          <p className="text-sm text-gray-400">Record detailed mining activity for troubleshooting</p>
                        </div>
                        <Switch
                          id="enable-logging"
                          checked={config.settings.enableLogging}
                          onCheckedChange={(checked) => updateSettings('enableLogging', checked)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Settings */}
                  <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
                    <h3 className="text-lg font-medium mb-4">Performance Tuning</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="optimization" className="mb-2 block">Optimization Profile</Label>
                        <RadioGroup 
                          defaultValue={config.settings.optimizationLevel}
                          onValueChange={(value) => updateSettings('optimizationLevel', value)}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <div>
                            <RadioGroupItem 
                              value="efficiency" 
                              id="efficiency" 
                              className="peer sr-only" 
                            />
                            <Label
                              htmlFor="efficiency"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-gray-800 bg-gray-900 p-4 hover:bg-gray-800 hover:border-green-500 peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-950/30 [&:has([data-state=checked])]:border-green-500"
                            >
                              <div className="mb-2 text-lg font-medium text-green-400">Efficiency</div>
                              <p className="text-sm text-gray-400 text-center">Optimize for power efficiency and temperature</p>
                            </Label>
                          </div>
                          
                          <div>
                            <RadioGroupItem 
                              value="balanced" 
                              id="balanced" 
                              className="peer sr-only" 
                            />
                            <Label
                              htmlFor="balanced"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-gray-800 bg-gray-900 p-4 hover:bg-gray-800 hover:border-blue-500 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-950/30"
                            >
                              <div className="mb-2 text-lg font-medium text-blue-400">Balanced</div>
                              <p className="text-sm text-gray-400 text-center">Balance between performance and efficiency</p>
                            </Label>
                          </div>
                          
                          <div>
                            <RadioGroupItem 
                              value="performance" 
                              id="performance" 
                              className="peer sr-only" 
                            />
                            <Label
                              htmlFor="performance"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-gray-800 bg-gray-900 p-4 hover:bg-gray-800 hover:border-red-500 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-950/30"
                            >
                              <div className="mb-2 text-lg font-medium text-red-400">Performance</div>
                              <p className="text-sm text-gray-400 text-center">Maximum hashrate at the cost of efficiency</p>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      {/* Temperature Limit */}
                      <div className="mt-6">
                        <div className="flex justify-between mb-2">
                          <Label htmlFor="max-temp">Maximum Temperature: {config.settings.maxTemperature}°C</Label>
                          <span className="text-gray-400 text-sm">Miner will throttle above this</span>
                        </div>
                        <Slider
                          id="max-temp"
                          min={60}
                          max={90}
                          step={1}
                          value={[config.settings.maxTemperature]}
                          onValueChange={(value) => updateSettings('maxTemperature', value[0])}
                          className="my-4"
                        />
                        <p className="text-sm text-gray-400">Mining will be throttled when hardware exceeds this temperature to prevent damage.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Deployment - Step 4 */}
            {currentStep === 4 && (
              <div className="bg-gray-950 p-6 min-h-[500px]">
                <div className="flex items-center mb-6">
                  <Rocket className="w-6 h-6 text-blue-400 mr-2" />
                  <h2 className="text-2xl font-bold">Deploy Mining Configuration</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <motion.div
                      className="inline-block p-3 rounded-full bg-blue-900/50 border border-blue-500/30 mb-4"
                      animate={{
                        boxShadow: [
                          '0 0 0px rgba(59, 130, 246, 0.3)',
                          '0 0 20px rgba(59, 130, 246, 0.6)',
                          '0 0 0px rgba(59, 130, 246, 0.3)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <CheckCircle className="w-12 h-12 text-blue-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2">Configuration Complete</h3>
                    <p className="text-gray-400">Your mining configuration is ready to be deployed</p>
                  </div>
                  
                  {/* Configuration Summary */}
                  <div className="border border-gray-800 rounded-lg p-5 bg-gray-900/50 mb-6">
                    <h3 className="text-lg font-medium mb-4">Configuration Summary</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-blue-400 font-medium flex items-center">
                          <Server className="w-4 h-4 mr-2" />
                          Hardware Configuration
                        </h4>
                        <div className="ml-6 mt-2 text-gray-300">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-400">Type:</div>
                            <div className="text-white capitalize">{config.hardware.type}</div>
                            
                            {config.hardware.type === 'cpu' && (
                              <>
                                <div className="text-gray-400">CPU Threads:</div>
                                <div className="text-white">{config.hardware.cpuThreads}</div>
                              </>
                            )}
                            
                            {config.hardware.type === 'gpu' && (
                              <>
                                <div className="text-gray-400">GPU Intensity:</div>
                                <div className="text-white">{config.hardware.gpuIntensity}%</div>
                                <div className="text-gray-400">Power Limit:</div>
                                <div className="text-white">{config.hardware.powerLimit}%</div>
                              </>
                            )}
                            
                            {config.hardware.type === 'asic' && (
                              <>
                                <div className="text-gray-400">ASIC Model:</div>
                                <div className="text-white">{config.hardware.asicModel}</div>
                                <div className="text-gray-400">Fan Speed:</div>
                                <div className="text-white">{config.settings.fanSpeed}%</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="bg-gray-800" />
                      
                      <div>
                        <h4 className="text-blue-400 font-medium flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Pool Configuration
                        </h4>
                        <div className="ml-6 mt-2 text-gray-300">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-400">Pool:</div>
                            <div className="text-white">
                              {poolsData?.pools?.find(p => p.id.toString() === config.pool.id)?.name || 'Custom Pool'}
                            </div>
                            <div className="text-gray-400">URL:</div>
                            <div className="text-white overflow-hidden text-ellipsis">{config.pool.url || 'Not set'}</div>
                            <div className="text-gray-400">Algorithm:</div>
                            <div className="text-white capitalize">{config.pool.algorithm}</div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="bg-gray-800" />
                      
                      <div>
                        <h4 className="text-blue-400 font-medium flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Advanced Settings
                        </h4>
                        <div className="ml-6 mt-2 text-gray-300">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-400">Auto-start:</div>
                            <div className="text-white">{config.settings.autoStart ? 'Enabled' : 'Disabled'}</div>
                            <div className="text-gray-400">Low Power Mode:</div>
                            <div className="text-white">{config.settings.lowPowerMode ? 'Enabled' : 'Disabled'}</div>
                            <div className="text-gray-400">Optimization:</div>
                            <div className="text-white capitalize">{config.settings.optimizationLevel}</div>
                            <div className="text-gray-400">Max Temperature:</div>
                            <div className="text-white">{config.settings.maxTemperature}°C</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Deployment Notice */}
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-blue-300 mb-6">
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <Flame className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-blue-300 text-md font-medium">Ready to Start Mining</h3>
                        <p className="mt-1 text-sm">
                          Once deployed, your mining configuration will be active. You can monitor your mining activity on the Network Dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ElectricBorder>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={prevStep}
              variant="outline"
              disabled={currentStep === 1}
              className={currentStep === 1 ? 'opacity-50' : 'border-blue-500/50 text-blue-300 hover:bg-blue-900/20'}
            >
              Previous Step
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={deployMining}
                disabled={isDeploying}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    Deploy Mining
                    <Rocket className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}