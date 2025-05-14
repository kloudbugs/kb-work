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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Palette, 
  Image, 
  Sparkles,
  Box,
  Sun,
  Droplet,
  Loader2,
  Undo2,
  Check,
  DoorOpen,
  Star,
  CircleDot,
  Orbit,
  Copy,
  Grid,
  Boxes,
  Maximize,
  PanelLeft,
  Share2,
  Opacity,
  PaintBucket,
  CircleOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface VisualEnvironmentControllerProps {
  className?: string;
}

// Built-in environment themes
const ENVIRONMENT_THEMES = [
  { id: 'galaxy', name: 'Galaxy', icon: <Star className="h-4 w-4" />, preview: '/themes/galaxy-preview.jpg', description: 'Deep space with stars and nebulae' },
  { id: 'abstract', name: 'Abstract Flow', icon: <Orbit className="h-4 w-4" />, preview: '/themes/abstract-preview.jpg', description: 'Flowing abstract shapes and colors' },
  { id: 'desk', name: 'Office Desk', icon: <PanelLeft className="h-4 w-4" />, preview: '/themes/desk-preview.jpg', description: 'Modern office workspace view' },
  { id: 'circuits', name: 'Circuit Board', icon: <CircleDot className="h-4 w-4" />, preview: '/themes/circuit-preview.jpg', description: 'Digital circuit patterns' },
  { id: 'grid', name: 'Grid World', icon: <Grid className="h-4 w-4" />, preview: '/themes/grid-preview.jpg', description: 'Futuristic grid lines in 3D space' },
  { id: 'minimal', name: 'Minimal', icon: <Maximize className="h-4 w-4" />, preview: '/themes/minimal-preview.jpg', description: 'Clean, minimalist environment' },
  { id: 'datascape', name: 'Data Landscape', icon: <Boxes className="h-4 w-4" />, preview: '/themes/data-preview.jpg', description: '3D data visualization landscape' },
  { id: 'portal', name: 'Portal', icon: <DoorOpen className="h-4 w-4" />, preview: '/themes/portal-preview.jpg', description: 'Interdimensional portal visualization' },
  { id: 'none', name: 'No Background', icon: <CircleOff className="h-4 w-4" />, preview: '/themes/none-preview.jpg', description: 'No background, just network nodes' },
];

// Color palettes for solid background
const COLOR_PALETTES = [
  { id: 'dark', name: 'Dark Theme', colors: ['#111111', '#222222', '#333333', '#444444', '#1a1a2e'] },
  { id: 'blue', name: 'Blue Gradients', colors: ['#000033', '#001e3c', '#1a365d', '#0c4a6e', '#0c0c30'] },
  { id: 'purple', name: 'Purple Dreams', colors: ['#120724', '#240754', '#310a91', '#3b0764', '#4a044e'] },
  { id: 'green', name: 'Matrix Green', colors: ['#022c22', '#052e16', '#10311c', '#101e14', '#062115'] },
  { id: 'amber', name: 'Amber Tech', colors: ['#27200a', '#2b1c05', '#341a00', '#451a03', '#3f1905'] },
  { id: 'red', name: 'Red Atmosphere', colors: ['#2e0d0d', '#310e0e', '#3b0404', '#4b0f0f', '#350606'] },
  { id: 'mono', name: 'Monochrome', colors: ['#000000', '#111111', '#1a1a1a', '#222222', '#0a0a0a'] },
];

// Particle effect types
const PARTICLE_EFFECTS = [
  { id: 'stars', name: 'Stars', icon: <Star className="h-4 w-4" /> },
  { id: 'dots', name: 'Dots', icon: <CircleDot className="h-4 w-4" /> },
  { id: 'flow', name: 'Flowing Lines', icon: <Share2 className="h-4 w-4" /> },
  { id: 'bubbles', name: 'Bubbles', icon: <Circle className="h-4 w-4" /> },
  { id: 'dust', name: 'Cosmic Dust', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'glitch', name: 'Glitch', icon: <ZapOff className="h-4 w-4" /> },
  { id: 'none', name: 'None', icon: <CircleOff className="h-4 w-4" /> },
];

// Visual settings interface
interface VisualSettings {
  theme: string;
  customBackgroundUrl?: string;
  backgroundColor?: string;
  customColorHex?: string;
  particleEffect: string;
  particleDensity: number;
  particleSpeed: number;
  enableGlow: boolean;
  glowIntensity: number;
  enableBlur: boolean;
  blurAmount: number;
  enableReflections: boolean;
  reflectionOpacity: number;
  nodeSize: number;
  lineThickness: number;
  lineOpacity: number;
}

// Icon component for Circle that lucide-react doesn't have
function Circle({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  );
}

// Icon component for ZapOff that lucide-react doesn't have
function ZapOff({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="12.41 6.75 13 2 10.57 4.92"></polyline>
      <polyline points="18.57 12.91 21 10 15.66 10"></polyline>
      <polyline points="8 8 3 14 12 14 11 22 16 16"></polyline>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );
}

export function VisualEnvironmentController({ className = '' }: VisualEnvironmentControllerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Default settings
  const defaultSettings: VisualSettings = {
    theme: 'galaxy',
    customBackgroundUrl: '',
    backgroundColor: '#000033',
    customColorHex: '#000000',
    particleEffect: 'stars',
    particleDensity: 50,
    particleSpeed: 50,
    enableGlow: true,
    glowIntensity: 70,
    enableBlur: true,
    blurAmount: 30,
    enableReflections: true,
    reflectionOpacity: 30,
    nodeSize: 100,
    lineThickness: 100,
    lineOpacity: 80
  };
  
  // State
  const [currentTab, setCurrentTab] = useState('theme');
  const [settings, setSettings] = useState<VisualSettings>(defaultSettings);
  const [originalSettings, setOriginalSettings] = useState<VisualSettings>(defaultSettings);
  const [isApplying, setIsApplying] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTES[0].colors[0]);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('visualEnvironmentSettings');
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(parsedSettings);
        setOriginalSettings(parsedSettings);
      } catch (e) {
        console.error('Error parsing stored visual settings:', e);
      }
    }
  }, []);
  
  // Handle theme selection
  const selectTheme = (themeId: string) => {
    setSettings({
      ...settings,
      theme: themeId,
      // If selecting 'none', turn off certain effects by default
      enableGlow: themeId === 'none' ? false : settings.enableGlow,
      enableBlur: themeId === 'none' ? false : settings.enableBlur,
      enableReflections: themeId === 'none' ? false : settings.enableReflections,
    });
  };
  
  // Handle solid color selection
  const selectColor = (color: string) => {
    setSelectedColor(color);
    setSettings({
      ...settings,
      theme: 'solid',
      backgroundColor: color
    });
  };
  
  // Handle custom color input
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      customColorHex: e.target.value,
      theme: 'solid',
      backgroundColor: e.target.value
    });
  };
  
  // Handle custom background URL
  const handleCustomBackgroundUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      customBackgroundUrl: e.target.value,
      theme: 'custom'
    });
  };
  
  // Handle particle effect selection
  const selectParticleEffect = (effectId: string) => {
    setSettings({
      ...settings,
      particleEffect: effectId
    });
  };
  
  // Apply visual settings to the entire network
  const applySettings = () => {
    setIsApplying(true);
    
    // Store settings in localStorage
    localStorage.setItem('visualEnvironmentSettings', JSON.stringify(settings));
    
    // Simulate API call delay
    setTimeout(() => {
      setIsApplying(false);
      setOriginalSettings(settings);
      
      // Show toast notification
      toast({
        title: "Visual Environment Updated",
        description: "Your changes have been applied to the network visualization.",
        duration: 3000,
      });
      
      // Update UI by invalidating queries
      queryClient.invalidateQueries({ queryKey: ['/api/network/visual'] });
    }, 1500);
  };
  
  // Reset settings to default
  const resetToDefault = () => {
    setSettings(defaultSettings);
    
    toast({
      title: "Reset to Default",
      description: "Visual settings have been reset to default values.",
      duration: 3000,
    });
  };
  
  // Reset settings to last applied
  const resetToOriginal = () => {
    setSettings(originalSettings);
    
    toast({
      title: "Changes Discarded",
      description: "Visual settings have been reverted to the last applied values.",
      duration: 3000,
    });
  };
  
  // Helper function to determine if settings were changed
  const hasChanges = (): boolean => {
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  };
  
  // Generate CSS for background preview
  const generatePreviewStyle = (): React.CSSProperties => {
    if (settings.theme === 'solid') {
      return { backgroundColor: settings.backgroundColor || '#000000' };
    } else if (settings.theme === 'custom' && settings.customBackgroundUrl) {
      return { 
        backgroundImage: `url(${settings.customBackgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    } else {
      const theme = ENVIRONMENT_THEMES.find(t => t.id === settings.theme);
      if (theme && theme.preview) {
        return { 
          backgroundImage: `url(${theme.preview})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      }
      return { backgroundColor: '#000000' };
    }
  };
  
  return (
    <Card className={`w-full bg-gradient-to-br from-gray-900/80 to-cyan-900/20 backdrop-blur-sm border border-cyan-800/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-cyan-400" />
          Visual Environment Controller
          {hasChanges() && (
            <Badge className="ml-2 bg-amber-600">Unsaved Changes</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Customize the visual environment of the network visualization for all users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="theme" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-3 bg-gray-800">
            <TabsTrigger value="theme">Background</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="nodes">Nodes & Links</TabsTrigger>
          </TabsList>
          
          {/* Background Tab */}
          <TabsContent value="theme" className="space-y-6 pt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-300">Environment Theme</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ENVIRONMENT_THEMES.map(theme => (
                  <div 
                    key={theme.id}
                    className={`rounded-md overflow-hidden border transition-all cursor-pointer ${
                      settings.theme === theme.id 
                        ? 'border-cyan-500 ring-2 ring-cyan-500/30 scale-[1.02]' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => selectTheme(theme.id)}
                  >
                    <div className="aspect-video relative">
                      {theme.preview ? (
                        <img 
                          src={theme.preview} 
                          alt={theme.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          {theme.icon}
                        </div>
                      )}
                      
                      {settings.theme === theme.id && (
                        <div className="absolute top-2 right-2 h-5 w-5 bg-cyan-500 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-black" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-gray-800">
                      <div className="flex items-center text-sm">
                        {theme.icon}
                        <span className="ml-1.5">{theme.name}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{theme.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 space-y-4">
                <h3 className="text-sm font-medium text-gray-300">Solid Color Background</h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-2">
                    {COLOR_PALETTES.map(palette => (
                      <div key={palette.id} className="space-y-2">
                        <p className="text-xs text-gray-400 text-center">{palette.name}</p>
                        <div className="flex flex-col items-center space-y-2">
                          {palette.colors.map(color => (
                            <div
                              key={color}
                              className={`h-8 w-8 rounded-full cursor-pointer transition-all ${
                                selectedColor === color && settings.theme === 'solid'
                                  ? 'ring-2 ring-white scale-110'
                                  : 'hover:scale-105'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => selectColor(color)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3 items-center pt-2">
                    <Label htmlFor="custom-color" className="whitespace-nowrap">Custom Color:</Label>
                    <div 
                      className="h-8 w-8 rounded-md border border-gray-700"
                      style={{ backgroundColor: settings.customColorHex || '#000000' }}
                    />
                    <Input
                      id="custom-color"
                      type="color"
                      value={settings.customColorHex || '#000000'}
                      onChange={handleCustomColorChange}
                      className="w-auto h-8 bg-gray-800 border-gray-700"
                    />
                    <Badge className="ml-auto">
                      {settings.customColorHex || '#000000'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Custom Background Image</h3>
                <div className="space-y-3">
                  <Input
                    id="custom-bg-url"
                    placeholder="Enter image URL..."
                    value={settings.customBackgroundUrl || ''}
                    onChange={handleCustomBackgroundUrl}
                    className="bg-gray-800 border-gray-700"
                  />
                  <p className="text-xs text-gray-400">
                    Enter a direct link to an image (JPG, PNG, WebP). For best results, use high-resolution images.
                  </p>
                </div>
              </div>
              
              {/* Background Preview */}
              {(settings.theme === 'solid' || settings.theme === 'custom' || settings.theme !== 'none') && (
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Background Preview</h3>
                  <div 
                    className="aspect-video rounded-md overflow-hidden"
                    style={generatePreviewStyle()}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {settings.theme === 'solid' && (
                        <Badge className="bg-black/50 backdrop-blur-sm">
                          Solid Color: {settings.backgroundColor || '#000000'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Effects Tab */}
          <TabsContent value="effects" className="space-y-6 pt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-300">Particle Effects</h3>
              
              <div className="space-y-3">
                <Label>Particle Type</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {PARTICLE_EFFECTS.map(effect => (
                    <Button
                      key={effect.id}
                      variant={settings.particleEffect === effect.id ? "default" : "outline"}
                      className={`h-auto py-3 justify-start ${
                        settings.particleEffect === effect.id
                          ? 'bg-cyan-800 hover:bg-cyan-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      onClick={() => selectParticleEffect(effect.id)}
                    >
                      <div className="flex items-center">
                        {effect.icon}
                        <span className="ml-2">{effect.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
                
                {settings.particleEffect !== 'none' && (
                  <div className="space-y-4 pt-3">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="particle-density">Particle Density</Label>
                        <span className="text-sm text-gray-400">{settings.particleDensity}%</span>
                      </div>
                      <Slider
                        id="particle-density"
                        value={[settings.particleDensity]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => setSettings({...settings, particleDensity: values[0]})}
                        className="py-2"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="particle-speed">Particle Speed</Label>
                        <span className="text-sm text-gray-400">{settings.particleSpeed}%</span>
                      </div>
                      <Slider
                        id="particle-speed"
                        value={[settings.particleSpeed]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => setSettings({...settings, particleSpeed: values[0]})}
                        className="py-2"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4 space-y-4">
                <h3 className="text-sm font-medium text-gray-300">Visual Effects</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-glow" className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Enable Glow Effect
                      </Label>
                      <Switch
                        id="enable-glow"
                        checked={settings.enableGlow}
                        onCheckedChange={(checked) => setSettings({...settings, enableGlow: checked})}
                      />
                    </div>
                    
                    {settings.enableGlow && (
                      <div className="space-y-2 pl-6 border-l-2 border-gray-800">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="glow-intensity">Glow Intensity</Label>
                          <span className="text-sm text-gray-400">{settings.glowIntensity}%</span>
                        </div>
                        <Slider
                          id="glow-intensity"
                          value={[settings.glowIntensity]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(values) => setSettings({...settings, glowIntensity: values[0]})}
                          className="py-2"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-blur" className="flex items-center">
                        <Droplet className="h-4 w-4 mr-2" />
                        Enable Blur Effect
                      </Label>
                      <Switch
                        id="enable-blur"
                        checked={settings.enableBlur}
                        onCheckedChange={(checked) => setSettings({...settings, enableBlur: checked})}
                      />
                    </div>
                    
                    {settings.enableBlur && (
                      <div className="space-y-2 pl-6 border-l-2 border-gray-800">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="blur-amount">Blur Amount</Label>
                          <span className="text-sm text-gray-400">{settings.blurAmount}%</span>
                        </div>
                        <Slider
                          id="blur-amount"
                          value={[settings.blurAmount]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(values) => setSettings({...settings, blurAmount: values[0]})}
                          className="py-2"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-reflections" className="flex items-center">
                        <Copy className="h-4 w-4 mr-2" />
                        Enable Reflections
                      </Label>
                      <Switch
                        id="enable-reflections"
                        checked={settings.enableReflections}
                        onCheckedChange={(checked) => setSettings({...settings, enableReflections: checked})}
                      />
                    </div>
                    
                    {settings.enableReflections && (
                      <div className="space-y-2 pl-6 border-l-2 border-gray-800">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="reflection-opacity">Reflection Opacity</Label>
                          <span className="text-sm text-gray-400">{settings.reflectionOpacity}%</span>
                        </div>
                        <Slider
                          id="reflection-opacity"
                          value={[settings.reflectionOpacity]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(values) => setSettings({...settings, reflectionOpacity: values[0]})}
                          className="py-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Nodes & Links Tab */}
          <TabsContent value="nodes" className="space-y-6 pt-4">
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-gray-300">Network Node Appearance</h3>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="node-size" className="flex items-center">
                      <Box className="h-4 w-4 mr-2" />
                      Node Size
                    </Label>
                    <span className="text-sm text-gray-400">{settings.nodeSize}%</span>
                  </div>
                  <Slider
                    id="node-size"
                    value={[settings.nodeSize]}
                    min={50}
                    max={200}
                    step={1}
                    onValueChange={(values) => setSettings({...settings, nodeSize: values[0]})}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Small</span>
                    <span>Default</span>
                    <span>Large</span>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="line-thickness" className="flex items-center">
                      <PaintBucket className="h-4 w-4 mr-2" />
                      Connection Line Thickness
                    </Label>
                    <span className="text-sm text-gray-400">{settings.lineThickness}%</span>
                  </div>
                  <Slider
                    id="line-thickness"
                    value={[settings.lineThickness]}
                    min={10}
                    max={200}
                    step={1}
                    onValueChange={(values) => setSettings({...settings, lineThickness: values[0]})}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Thin</span>
                    <span>Default</span>
                    <span>Thick</span>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="line-opacity" className="flex items-center">
                      <Opacity className="h-4 w-4 mr-2" />
                      Connection Line Opacity
                    </Label>
                    <span className="text-sm text-gray-400">{settings.lineOpacity}%</span>
                  </div>
                  <Slider
                    id="line-opacity"
                    value={[settings.lineOpacity]}
                    min={10}
                    max={100}
                    step={1}
                    onValueChange={(values) => setSettings({...settings, lineOpacity: values[0]})}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Transparent</span>
                    <span>Default</span>
                    <span>Solid</span>
                  </div>
                </div>
              </div>
              
              {/* Preview illustration (simplified visualization) */}
              <div className="pt-3">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Appearance Preview</h3>
                <div 
                  className="aspect-video rounded-md overflow-hidden bg-gray-900 relative border border-gray-800"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-4/5 h-4/5">
                      {/* Simulated nodes */}
                      <div 
                        className="absolute left-[20%] top-[30%] rounded-full bg-blue-500"
                        style={{
                          width: `${Math.max(6, 20 * settings.nodeSize / 100)}px`,
                          height: `${Math.max(6, 20 * settings.nodeSize / 100)}px`,
                          boxShadow: settings.enableGlow 
                            ? `0 0 ${settings.glowIntensity / 5}px ${settings.glowIntensity / 10}px rgba(59, 130, 246, ${settings.glowIntensity / 100})` 
                            : 'none'
                        }}
                      />
                      <div 
                        className="absolute left-[70%] top-[40%] rounded-full bg-purple-500"
                        style={{
                          width: `${Math.max(6, 24 * settings.nodeSize / 100)}px`,
                          height: `${Math.max(6, 24 * settings.nodeSize / 100)}px`,
                          boxShadow: settings.enableGlow 
                            ? `0 0 ${settings.glowIntensity / 5}px ${settings.glowIntensity / 10}px rgba(168, 85, 247, ${settings.glowIntensity / 100})` 
                            : 'none'
                        }}
                      />
                      <div 
                        className="absolute left-[50%] top-[70%] rounded-full bg-green-500"
                        style={{
                          width: `${Math.max(6, 18 * settings.nodeSize / 100)}px`,
                          height: `${Math.max(6, 18 * settings.nodeSize / 100)}px`,
                          boxShadow: settings.enableGlow 
                            ? `0 0 ${settings.glowIntensity / 5}px ${settings.glowIntensity / 10}px rgba(34, 197, 94, ${settings.glowIntensity / 100})` 
                            : 'none'
                        }}
                      />
                      
                      {/* Simulated connection lines */}
                      <svg
                        className="absolute inset-0 w-full h-full"
                        style={{
                          filter: settings.enableBlur ? `blur(${settings.blurAmount / 100}px)` : 'none',
                          opacity: settings.lineOpacity / 100
                        }}
                      >
                        <line 
                          x1="20%" y1="30%" x2="70%" y2="40%" 
                          stroke="rgba(147, 197, 253, 0.8)"
                          strokeWidth={Math.max(1, 2 * settings.lineThickness / 100)}
                        />
                        <line 
                          x1="70%" y1="40%" x2="50%" y2="70%" 
                          stroke="rgba(216, 180, 254, 0.8)"
                          strokeWidth={Math.max(1, 2 * settings.lineThickness / 100)}
                        />
                        <line 
                          x1="50%" y1="70%" x2="20%" y2="30%" 
                          stroke="rgba(110, 231, 183, 0.8)"
                          strokeWidth={Math.max(1, 2 * settings.lineThickness / 100)}
                        />
                      </svg>
                      
                      {/* Reflections if enabled */}
                      {settings.enableReflections && (
                        <div 
                          className="absolute inset-0 w-full h-full"
                          style={{
                            backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)',
                            opacity: settings.reflectionOpacity / 100,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={resetToDefault}
          >
            Reset All
          </Button>
          
          {hasChanges() && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={resetToOriginal}
            >
              <Undo2 className="h-4 w-4 mr-2" />
              Discard
            </Button>
          )}
        </div>
        
        <Button 
          className="w-full sm:w-auto sm:flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          onClick={applySettings}
          disabled={isApplying || !hasChanges()}
        >
          {isApplying ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Applying...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Apply Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default VisualEnvironmentController;