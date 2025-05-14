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
  Button 
} from '@/components/ui/button';
import { 
  Input 
} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Label 
} from '@/components/ui/label';
import { 
  Switch 
} from '@/components/ui/switch';
import { 
  Slider 
} from '@/components/ui/slider';
import { 
  Badge 
} from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Cube,
  Glasses,
  Broadcast,
  Users,
  Zap,
  Grid,
  Loader2,
  Sparkles,
  Globe,
  Send,
  LayoutGrid,
  Layers,
  PanelTop,
  Upload,
  Server,
  PanelBottom,
  Lightbulb,
  BrainCircuit,
  MinusCircle,
  PlusCircle,
  Share2,
  Snowflake,
  Flame,
  Bookmark,
  RotateCw,
  BellRing
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface VRCommandCenterProps {
  className?: string;
}

// VR environment presets
const VR_ENVIRONMENTS = [
  { 
    id: 'cyber-command',
    name: 'Cyber Command Center', 
    description: 'Futuristic holographic command center with multiple data layers',
    preview: '/vr/cyber-command.jpg' 
  },
  { 
    id: 'neural-network',
    name: 'Neural Network', 
    description: 'Immersive 3D neural network visualization with synaptic connections',
    preview: '/vr/neural-network.jpg' 
  },
  { 
    id: 'quantum-realm',
    name: 'Quantum Realm', 
    description: 'Abstract quantum computing visualization with particles',
    preview: '/vr/quantum-realm.jpg' 
  },
  { 
    id: 'space-station',
    name: 'Orbital Space Station', 
    description: 'Advanced space station control room with Earth view',
    preview: '/vr/space-station.jpg' 
  },
  { 
    id: 'digital-ocean',
    name: 'Digital Ocean', 
    description: 'Underwater digital environment with data currents',
    preview: '/vr/digital-ocean.jpg' 
  },
  { 
    id: 'matrix-code',
    name: 'Matrix Codefall', 
    description: 'Matrix-style falling code with green digital rain',
    preview: '/vr/matrix-code.jpg' 
  },
  { 
    id: 'blockchain-city',
    name: 'Blockchain City', 
    description: '3D city made of blockchain blocks and transactions',
    preview: '/vr/blockchain-city.jpg' 
  },
  { 
    id: 'holodeck',
    name: 'Advanced Holodeck', 
    description: 'Star Trek inspired holographic environment with grid',
    preview: '/vr/holodeck.jpg' 
  }
];

// VR interaction modes
const INTERACTION_MODES = [
  { id: 'spectator', name: 'Spectator Mode', icon: <Glasses className="h-4 w-4" /> },
  { id: 'collaborative', name: 'Collaborative Mode', icon: <Users className="h-4 w-4" /> },
  { id: 'presenter', name: 'Presenter Mode', icon: <Broadcast className="h-4 w-4" /> },
  { id: 'advanced', name: 'Advanced Control Mode', icon: <BrainCircuit className="h-4 w-4" /> }
];

// VR display layouts
const DISPLAY_LAYOUTS = [
  { id: 'immersive', name: 'Full Immersive', icon: <Cube className="h-4 w-4" /> },
  { id: 'dashboard', name: 'Command Dashboard', icon: <PanelTop className="h-4 w-4" /> },
  { id: 'grid', name: 'Data Grid', icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'layers', name: 'Holographic Layers', icon: <Layers className="h-4 w-4" /> },
  { id: 'split', name: 'Multi-View Split', icon: <Grid className="h-4 w-4" /> }
];

// Data visualization modes
const DATA_MODES = [
  { id: 'realtime', name: 'Real-time Streaming', icon: <Zap className="h-4 w-4" /> },
  { id: 'historical', name: 'Historical Patterns', icon: <RotateCw className="h-4 w-4" /> },
  { id: 'predictive', name: 'Predictive Analysis', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'global', name: 'Global Network Map', icon: <Globe className="h-4 w-4" /> }
];

// VR special effects
const SPECIAL_EFFECTS = [
  { id: 'holograms', name: 'Holographic Projections', enabled: true },
  { id: 'particle-flows', name: 'Particle Data Flows', enabled: true },
  { id: 'voice-commands', name: 'Voice Command UI', enabled: false },
  { id: 'haptic-feedback', name: 'Haptic Feedback Simulation', enabled: false },
  { id: 'spatial-audio', name: 'Spatial Audio Environment', enabled: true },
  { id: 'neural-interface', name: 'Neural Interface Visuals', enabled: false },
  { id: 'time-dilation', name: 'Time Dilation Effects', enabled: false },
  { id: 'quantum-rendering', name: 'Quantum State Rendering', enabled: true }
];

// Interface for VR settings
interface VRSettings {
  environment: string;
  interactionMode: string;
  displayLayout: string;
  dataMode: string;
  effects: {
    [key: string]: boolean;
  };
  userCapacity: number;
  performanceLevel: number;
  renderQuality: number;
  activeUsers: number;
  dataDensity: number;
  broadcastActive: boolean;
  customModelUrl?: string;
}

export function VRCommandCenter({ className = '' }: VRCommandCenterProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Default VR settings
  const defaultSettings: VRSettings = {
    environment: 'cyber-command',
    interactionMode: 'spectator',
    displayLayout: 'immersive',
    dataMode: 'realtime',
    effects: SPECIAL_EFFECTS.reduce((acc, effect) => ({
      ...acc,
      [effect.id]: effect.enabled
    }), {}),
    userCapacity: 100,
    performanceLevel: 80,
    renderQuality: 90,
    activeUsers: 0,
    dataDensity: 75,
    broadcastActive: false,
    customModelUrl: ''
  };
  
  // State
  const [settings, setSettings] = useState<VRSettings>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('environment');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [currentBandwidth, setCurrentBandwidth] = useState(0);
  const [pinnedDataPoints, setPinnedDataPoints] = useState<string[]>([]);
  
  // Mock data for active users simulation
  const simulateActiveUsers = () => {
    const baseUsers = Math.floor(Math.random() * 15) + 5;
    setSettings(prev => ({
      ...prev,
      activeUsers: prev.broadcastActive ? baseUsers : 0
    }));
  };
  
  // Mock data for bandwidth simulation
  const simulateBandwidth = () => {
    const maxBandwidth = 200; // Mbps
    setCurrentBandwidth(settings.broadcastActive ? 
      Math.floor(Math.random() * maxBandwidth * (settings.activeUsers / 20 + 0.5)) : 0);
  };
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('vrCommandCenterSettings');
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(parsedSettings);
      } catch (e) {
        console.error('Error parsing stored VR settings:', e);
      }
    }
    
    // Initialize with a starting animation
    setIsInitialized(true);
    
    // Start the simulation interval for active users and bandwidth
    const userInterval = setInterval(simulateActiveUsers, 5000);
    const bandwidthInterval = setInterval(simulateBandwidth, 3000);
    
    return () => {
      clearInterval(userInterval);
      clearInterval(bandwidthInterval);
    };
  }, []);
  
  // Update simulation when settings change
  useEffect(() => {
    simulateActiveUsers();
    simulateBandwidth();
  }, [settings.broadcastActive]);
  
  // Toggle VR broadcast
  const toggleBroadcast = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setSettings(prev => {
        const newState = { ...prev, broadcastActive: !prev.broadcastActive };
        
        // Store in localStorage
        localStorage.setItem('vrCommandCenterSettings', JSON.stringify(newState));
        
        return newState;
      });
      
      // Update connection status
      setConnectionStatus(settings.broadcastActive ? 'disconnected' : 'connected');
      
      // Show toast
      toast({
        title: settings.broadcastActive ? "VR Broadcast Stopped" : "VR Broadcast Started",
        description: settings.broadcastActive ? 
          "The VR command center is no longer being broadcasted." : 
          "VR command center is now being broadcasted to all users.",
        duration: 3000,
      });
      
      setIsLoading(false);
      
      // Update UI
      queryClient.invalidateQueries({ queryKey: ['/api/network/vr'] });
    }, 2000);
  };
  
  // Change environment
  const changeEnvironment = (envId: string) => {
    setSettings(prev => ({
      ...prev,
      environment: envId
    }));
  };
  
  // Toggle an effect
  const toggleEffect = (effectId: string) => {
    setSettings(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [effectId]: !prev.effects[effectId]
      }
    }));
  };
  
  // Save settings
  const saveSettings = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Store in localStorage
      localStorage.setItem('vrCommandCenterSettings', JSON.stringify(settings));
      
      // Show toast
      toast({
        title: "VR Settings Saved",
        description: "Your VR command center settings have been saved and applied.",
        duration: 3000,
      });
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Handle pin data point
  const handlePinDataPoint = (dataPoint: string) => {
    if (pinnedDataPoints.includes(dataPoint)) {
      setPinnedDataPoints(prev => prev.filter(dp => dp !== dataPoint));
    } else {
      setPinnedDataPoints(prev => [...prev, dataPoint]);
    }
  };
  
  // Count active effects
  const countActiveEffects = () => {
    return Object.values(settings.effects).filter(Boolean).length;
  };
  
  return (
    <Card className={`w-full bg-gradient-to-br from-gray-900/80 to-indigo-900/20 backdrop-blur-sm border border-indigo-800/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Glasses className="h-6 w-6 text-blue-400" />
          VR Command Center
          {settings.broadcastActive && (
            <Badge className="ml-2 bg-green-600 animate-pulse">
              <Broadcast className="h-3 w-3 mr-1" />
              Live
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Create an immersive VR environment that connects all users in real-time through a futuristic interface.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status panel */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-800/50 border border-gray-700">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <span className="text-sm">Status</span>
                </div>
                <Badge className={`${connectionStatus === 'connected' ? 'bg-green-900' : 'bg-gray-700'}`}>
                  {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border border-gray-700">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-400" />
                  <span className="text-sm">Active Users</span>
                </div>
                <Badge className="bg-blue-900">
                  {settings.activeUsers}
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border border-gray-700">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="text-sm">Bandwidth</span>
                </div>
                <Badge className="bg-yellow-900">
                  {currentBandwidth} Mbps
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border border-gray-700">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                  <span className="text-sm">Effects</span>
                </div>
                <Badge className="bg-purple-900">
                  {countActiveEffects()} Active
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
          
          <Tabs defaultValue="environment" value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-4 mb-4 bg-gray-800">
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="data">Data Visualization</TabsTrigger>
              <TabsTrigger value="effects">Special Effects</TabsTrigger>
            </TabsList>
            
            {/* Environment Tab */}
            <TabsContent value="environment" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-medium text-gray-300">VR Environment</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {VR_ENVIRONMENTS.map(env => (
                    <div 
                      key={env.id}
                      className={`rounded-md overflow-hidden border cursor-pointer transition-all ${
                        settings.environment === env.id 
                          ? 'border-blue-500 ring-2 ring-blue-500/30 scale-[1.02]' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => changeEnvironment(env.id)}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <div className="bg-gray-800 w-full h-full flex items-center justify-center">
                          {env.id === 'cyber-command' && <PanelTop className="h-6 w-6 text-blue-400" />}
                          {env.id === 'neural-network' && <BrainCircuit className="h-6 w-6 text-purple-400" />}
                          {env.id === 'quantum-realm' && <Sparkles className="h-6 w-6 text-cyan-400" />}
                          {env.id === 'space-station' && <Globe className="h-6 w-6 text-green-400" />}
                          {env.id === 'digital-ocean' && <Snowflake className="h-6 w-6 text-blue-400" />}
                          {env.id === 'matrix-code' && <Server className="h-6 w-6 text-green-400" />}
                          {env.id === 'blockchain-city' && <Cube className="h-6 w-6 text-amber-400" />}
                          {env.id === 'holodeck' && <Grid className="h-6 w-6 text-yellow-400" />}
                        </div>
                        
                        {settings.environment === env.id && (
                          <div className="absolute bottom-2 right-2 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckIcon className="h-3 w-3 text-black" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-gray-800">
                        <p className="text-sm font-medium truncate">{env.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-2 h-8">{env.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 space-y-3">
                  <h4 className="text-sm font-medium text-gray-300">Custom 3D Environment</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      placeholder="Enter URL to custom 3D model or scene..."
                      value={settings.customModelUrl || ''}
                      onChange={(e) => setSettings({...settings, customModelUrl: e.target.value})}
                      className="flex-1 bg-gray-800 border-gray-700"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="sm:w-auto w-full"
                      disabled={!settings.customModelUrl}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Supports glTF/GLB, OBJ, or USDZ 3D model formats
                  </p>
                </div>
                
                <div className="pt-2 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="render-quality">Render Quality</Label>
                    <span className="text-sm text-gray-400">{settings.renderQuality}%</span>
                  </div>
                  <Slider
                    id="render-quality"
                    value={[settings.renderQuality]}
                    min={30}
                    max={100}
                    step={1}
                    onValueChange={(values) => setSettings({...settings, renderQuality: values[0]})}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Performance</span>
                    <span>Balanced</span>
                    <span>Quality</span>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            {/* Controls Tab */}
            <TabsContent value="controls" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-medium text-gray-300">User Interaction Mode</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INTERACTION_MODES.map(mode => (
                    <div 
                      key={mode.id}
                      className={`p-3 rounded-md border cursor-pointer transition-all ${
                        settings.interactionMode === mode.id 
                          ? 'border-indigo-500 bg-indigo-900/20' 
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                      }`}
                      onClick={() => setSettings({...settings, interactionMode: mode.id})}
                    >
                      <div className="flex items-center">
                        <div className={`h-8 w-8 mr-3 rounded-full flex items-center justify-center ${
                          settings.interactionMode === mode.id 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {mode.icon}
                        </div>
                        <div>
                          <p className="font-medium">{mode.name}</p>
                          <p className="text-xs text-gray-400">
                            {mode.id === 'spectator' && 'View-only mode with guided experience'}
                            {mode.id === 'collaborative' && 'Users can interact with each other'}
                            {mode.id === 'presenter' && 'Admin controls all user viewpoints'}
                            {mode.id === 'advanced' && 'Full control over all VR parameters'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 space-y-3">
                  <h3 className="text-sm font-medium text-gray-300">Display Layout</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {DISPLAY_LAYOUTS.map(layout => (
                      <Button
                        key={layout.id}
                        variant={settings.displayLayout === layout.id ? "default" : "outline"}
                        className={`h-auto py-3 justify-start ${
                          settings.displayLayout === layout.id
                            ? 'bg-blue-900 hover:bg-blue-800 text-white'
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                        onClick={() => setSettings({...settings, displayLayout: layout.id})}
                      >
                        <div className="flex flex-col items-center w-full">
                          {layout.icon}
                          <span className="mt-1 text-xs">{layout.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="user-capacity">User Capacity</Label>
                    <span className="text-sm text-gray-400">{settings.userCapacity} users</span>
                  </div>
                  <Slider
                    id="user-capacity"
                    value={[settings.userCapacity]}
                    min={10}
                    max={500}
                    step={10}
                    onValueChange={(values) => setSettings({...settings, userCapacity: values[0]})}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10</span>
                    <span>100</span>
                    <span>500</span>
                  </div>
                </div>
                
                <div className="pt-2 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="performance-level">Performance Level</Label>
                    <span className="text-sm text-gray-400">{settings.performanceLevel}%</span>
                  </div>
                  <Slider
                    id="performance-level"
                    value={[settings.performanceLevel]}
                    min={30}
                    max={100}
                    step={1}
                    onValueChange={(values) => setSettings({...settings, performanceLevel: values[0]})}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Economy</span>
                    <span>Balanced</span>
                    <span>Maximum</span>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            {/* Data Visualization Tab */}
            <TabsContent value="data" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-medium text-gray-300">Data Visualization Mode</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DATA_MODES.map(mode => (
                    <Button
                      key={mode.id}
                      variant={settings.dataMode === mode.id ? "default" : "outline"}
                      className={`h-auto py-3 justify-start ${
                        settings.dataMode === mode.id
                          ? 'bg-purple-900 hover:bg-purple-800 text-white'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      onClick={() => setSettings({...settings, dataMode: mode.id})}
                    >
                      <div className="flex items-center">
                        {mode.icon}
                        <span className="ml-2">{mode.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
                
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="data-density" className="flex items-center">
                      <Share2 className="h-4 w-4 mr-2" />
                      Data Density
                    </Label>
                    <span className="text-sm text-gray-400">{settings.dataDensity}%</span>
                  </div>
                  <Slider
                    id="data-density"
                    value={[settings.dataDensity]}
                    min={10}
                    max={100}
                    step={1}
                    onValueChange={(values) => setSettings({...settings, dataDensity: values[0]})}
                    className="py-2"
                  />
                </div>
                
                <div className="pt-4 space-y-3">
                  <h3 className="text-sm font-medium text-gray-300 flex items-center">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Pinned Data Points
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['Mining Hashrate', 'Token Distribution', 'User Activity', 'Network Latency', 'Transaction Volume', 'Energy Efficiency'].map(dataPoint => (
                      <div
                        key={dataPoint}
                        className={`p-2 rounded-md border cursor-pointer flex items-center justify-between ${
                          pinnedDataPoints.includes(dataPoint)
                            ? 'border-green-500 bg-green-900/20'
                            : 'border-gray-700 bg-gray-800/50'
                        }`}
                        onClick={() => handlePinDataPoint(dataPoint)}
                      >
                        <span className="text-sm">{dataPoint}</span>
                        {pinnedDataPoints.includes(dataPoint) ? (
                          <MinusCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <PlusCircle className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-400">
                    Pinned data points will be prominently displayed in the VR environment for all users.
                  </p>
                </div>
              </motion.div>
            </TabsContent>
            
            {/* Special Effects Tab */}
            <TabsContent value="effects" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-medium text-gray-300 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Special Effects
                </h3>
                
                <div className="space-y-2">
                  {SPECIAL_EFFECTS.map(effect => (
                    <div
                      key={effect.id}
                      className={`p-3 rounded-md border flex items-center justify-between ${
                        settings.effects[effect.id] 
                          ? 'border-blue-500 bg-blue-900/10' 
                          : 'border-gray-700 bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center">
                        {effect.id === 'holograms' && <Layers className="h-4 w-4 mr-2 text-cyan-400" />}
                        {effect.id === 'particle-flows' && <Share2 className="h-4 w-4 mr-2 text-blue-400" />}
                        {effect.id === 'voice-commands' && <BellRing className="h-4 w-4 mr-2 text-yellow-400" />}
                        {effect.id === 'haptic-feedback' && <Zap className="h-4 w-4 mr-2 text-amber-400" />}
                        {effect.id === 'spatial-audio' && <Globe className="h-4 w-4 mr-2 text-green-400" />}
                        {effect.id === 'neural-interface' && <BrainCircuit className="h-4 w-4 mr-2 text-purple-400" />}
                        {effect.id === 'time-dilation' && <RotateCw className="h-4 w-4 mr-2 text-pink-400" />}
                        {effect.id === 'quantum-rendering' && <Sparkles className="h-4 w-4 mr-2 text-indigo-400" />}
                        <span>{effect.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                      </div>
                      <Switch
                        checked={settings.effects[effect.id] || false}
                        onCheckedChange={() => toggleEffect(effect.id)}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 bg-gray-800/50 p-4 rounded-md border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 flex items-center mb-3">
                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-400" />
                    Effect Combinations
                  </h4>
                  
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-600 border-gray-600 w-full justify-start text-sm"
                      onClick={() => {
                        setSettings(prev => ({
                          ...prev,
                          effects: {
                            ...prev.effects,
                            'holograms': true,
                            'particle-flows': true,
                            'spatial-audio': true,
                            'quantum-rendering': true,
                            'voice-commands': false,
                            'haptic-feedback': false,
                            'neural-interface': false,
                            'time-dilation': false
                          }
                        }));
                      }}
                    >
                      <Flame className="h-4 w-4 mr-2 text-orange-400" />
                      High Performance Bundle
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-600 border-gray-600 w-full justify-start text-sm"
                      onClick={() => {
                        setSettings(prev => ({
                          ...prev,
                          effects: {
                            'holograms': true,
                            'particle-flows': true,
                            'spatial-audio': true,
                            'quantum-rendering': true,
                            'voice-commands': true,
                            'haptic-feedback': true,
                            'neural-interface': true,
                            'time-dilation': true
                          }
                        }));
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-2 text-blue-400" />
                      Full Immersion Suite
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-600 border-gray-600 w-full justify-start text-sm"
                      onClick={() => {
                        setSettings(prev => ({
                          ...prev,
                          effects: {
                            'holograms': true,
                            'particle-flows': true,
                            'spatial-audio': false,
                            'quantum-rendering': false,
                            'voice-commands': false,
                            'haptic-feedback': false,
                            'neural-interface': false,
                            'time-dilation': false
                          }
                        }));
                      }}
                    >
                      <Snowflake className="h-4 w-4 mr-2 text-cyan-400" />
                      Minimal Visual Only
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
          
          {/* Broadcast controls always visible at bottom */}
          <div className="pt-2">
            <div className="bg-gradient-to-r from-gray-900/90 to-indigo-900/30 rounded-md border border-indigo-900/50 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Broadcast className="h-5 w-5 mr-2 text-indigo-400" />
                    VR Network Broadcast
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {settings.broadcastActive 
                      ? `Broadcasting to ${settings.activeUsers} users at ${currentBandwidth} Mbps`
                      : 'Start broadcasting the VR environment to all connected users'}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={saveSettings}
                    className="border-indigo-800"
                    disabled={isLoading}
                  >
                    Save Settings
                  </Button>
                  
                  <Button
                    className={`${settings.broadcastActive 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'}`}
                    onClick={toggleBroadcast}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : settings.broadcastActive ? (
                      <>
                        Stop Broadcast
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Start Broadcast
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper icon component
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

export default VRCommandCenter;