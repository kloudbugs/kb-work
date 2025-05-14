import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GhostMiningSimulator } from '@/components/admin/GhostMiningSimulator';
import { GhostUserSimulator } from '@/components/admin/GhostUserSimulator';
import GhostAccountManager from '@/components/admin/GhostAccountManager';
import SpecialWalletAccess from '@/components/admin/SpecialWalletAccess';
import { EmergencySystemController } from '@/components/admin/EmergencySystemController';
import { CampaignManager } from '@/components/admin/CampaignManager';
import { ActiveUserTracker } from '@/components/admin/ActiveUserTracker';
import { FeaturePermissionManager } from '@/components/admin/FeaturePermissionManager';
import { ChatAdminControl } from '@/components/admin/ChatAdminControl';
import { GhostChatSimulator } from '@/components/admin/GhostChatSimulator';
import { ScreenBroadcastControl } from '@/components/admin/ScreenBroadcastControl';
import { FamilyAccessNotifications } from '@/components/admin/FamilyAccessNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Hash, 
  Zap, 
  Award, 
  Users, 
  TrendingUp, 
  Power,
  Lightbulb,
  AlertTriangle,
  Gift,
  Ghost,
  Eye,
  Wallet,
  Key,
  Shield,
  Lock,
  MessageSquare,
  Cast
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';

// Network Boost System - Controls the boost multiplier that the main miner provides to all users
function NetworkBoostSystem() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for network boost settings
  const [boostMultiplier, setBoostMultiplier] = React.useState(1.0);
  const [autoScale, setAutoScale] = React.useState(true);
  const [minThreshold, setMinThreshold] = React.useState(100); // TH/s
  const [maxBoost, setMaxBoost] = React.useState(2.5);
  const [isBoostActive, setIsBoostActive] = React.useState(false);
  
  // Mock API call to update boost settings
  const updateBoostSettings = async (settings: any) => {
    // This would be a real API call in production
    console.log('Updating boost settings:', settings);
    localStorage.setItem('networkBoostSettings', JSON.stringify(settings));
    return settings;
  };
  
  // Mutation to update settings
  const mutation = useMutation({
    mutationFn: updateBoostSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/network/stats'] });
      toast({
        title: "Boost Settings Updated",
        description: "Network boost settings have been successfully updated.",
        duration: 3000,
      });
    },
  });
  
  // Load settings from localStorage on mount
  React.useEffect(() => {
    const storedSettings = localStorage.getItem('networkBoostSettings');
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      setBoostMultiplier(settings.boostMultiplier || 1.0);
      setAutoScale(settings.autoScale || true);
      setMinThreshold(settings.minThreshold || 100);
      setMaxBoost(settings.maxBoost || 2.5);
      setIsBoostActive(settings.isBoostActive || false);
    }
  }, []);
  
  // Save settings
  const saveSettings = () => {
    const settings = {
      boostMultiplier,
      autoScale,
      minThreshold,
      maxBoost,
      isBoostActive
    };
    
    mutation.mutate(settings);
  };
  
  // Toggle boost active state
  const toggleBoostActive = () => {
    setIsBoostActive(!isBoostActive);
  };
  
  return (
    <Card className="w-full bg-gradient-to-br from-gray-900/80 to-purple-900/20 backdrop-blur-sm border border-purple-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-purple-400" />
          Main Miner Network Boost
          <Badge className={`ml-2 ${isBoostActive ? 'bg-green-600' : 'bg-gray-600'}`}>
            {isBoostActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Configure how the main mining node boosts performance for all users in the network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Boost Visualization */}
          <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-800/40">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-white">Current Boost Power</h3>
              <Badge className="bg-purple-600">{(boostMultiplier * 100).toFixed(0)}%</Badge>
            </div>
            
            <div className="relative h-3 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                style={{ width: `${Math.min(100, boostMultiplier * 50)}%` }}
                animate={{
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-800/70 p-3 rounded-md">
                <div className="flex items-center mb-1">
                  <Hash className="h-4 w-4 mr-1 text-blue-400" />
                  <span className="text-sm text-gray-300">Hashrate Boost</span>
                </div>
                <span className="text-lg font-bold text-white">+{((boostMultiplier - 1) * 100).toFixed(0)}%</span>
              </div>
              
              <div className="bg-gray-800/70 p-3 rounded-md">
                <div className="flex items-center mb-1">
                  <Award className="h-4 w-4 mr-1 text-amber-400" />
                  <span className="text-sm text-gray-300">Reward Boost</span>
                </div>
                <span className="text-lg font-bold text-white">+{((boostMultiplier - 1) * 100).toFixed(0)}%</span>
              </div>
              
              <div className="bg-gray-800/70 p-3 rounded-md">
                <div className="flex items-center mb-1">
                  <Users className="h-4 w-4 mr-1 text-green-400" />
                  <span className="text-sm text-gray-300">Network Effect</span>
                </div>
                <span className="text-lg font-bold text-white">Strong</span>
              </div>
            </div>
          </div>
          
          {/* Boost Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center" htmlFor="boost-toggle">
                <Power className="h-4 w-4 mr-2" />
                Enable Network Boost
              </Label>
              <Switch 
                id="boost-toggle" 
                checked={isBoostActive}
                onCheckedChange={toggleBoostActive}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="flex items-center" htmlFor="boost-multiplier">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Boost Multiplier
                </Label>
                <span className="text-sm font-medium text-white">×{boostMultiplier.toFixed(1)}</span>
              </div>
              <Slider
                id="boost-multiplier"
                value={[boostMultiplier]}
                min={1}
                max={3}
                step={0.1}
                disabled={autoScale}
                onValueChange={(values) => setBoostMultiplier(values[0])}
                className="py-2"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="flex items-center" htmlFor="auto-scale">
                <Lightbulb className="h-4 w-4 mr-2" />
                Auto-Scale Boost
              </Label>
              <Switch 
                id="auto-scale" 
                checked={autoScale}
                onCheckedChange={setAutoScale}
              />
            </div>
            
            {autoScale && (
              <div className="pl-6 space-y-4 border-l-2 border-gray-800">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400" htmlFor="min-threshold">
                    Minimum Hashrate Threshold (TH/s)
                  </Label>
                  <Input
                    id="min-threshold"
                    type="number"
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(parseInt(e.target.value) || 0)}
                    className="bg-gray-800 border-gray-700"
                  />
                  <p className="text-xs text-gray-500">
                    The minimum hashrate your main miner needs to start providing network boost.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400" htmlFor="max-boost">
                    Maximum Boost Multiplier
                  </Label>
                  <Input
                    id="max-boost"
                    type="number"
                    step="0.1"
                    value={maxBoost}
                    onChange={(e) => setMaxBoost(parseFloat(e.target.value) || 1)}
                    className="bg-gray-800 border-gray-700"
                  />
                  <p className="text-xs text-gray-500">
                    The maximum boost multiplier that can be applied to the network.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <div className="px-6 pb-6">
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          onClick={saveSettings}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saving...' : 'Save Boost Settings'}
        </Button>
      </div>
    </Card>
  );
}

// User Preview Mode Component
function UserPreviewMode() {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [, navigate] = useLocation();
  
  const handleTogglePreview = () => {
    if (isActive) {
      // Exit preview mode and return to admin dashboard
      setIsActive(false);
      toast({
        title: "Exited Preview Mode",
        description: "You are now back in admin view.",
        variant: "default"
      });
    } else {
      // Enter preview mode
      setIsActive(true);
      toast({
        title: "Entered User Preview Mode",
        description: "You are now viewing the platform as a regular user would see it.",
        variant: "default"
      });
      // Navigate to the regular user dashboard
      navigate('/dashboard');
      
      // Set a session flag to indicate preview mode
      sessionStorage.setItem('adminPreviewMode', 'true');
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-gray-900/80 backdrop-blur-sm border border-amber-600/50 shadow-lg shadow-amber-900/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-amber-400 font-medium">User View Preview</h3>
              <p className="text-xs text-gray-400">
                {isActive ? "Currently viewing as a regular user" : "See what regular users experience"}
              </p>
            </div>
            <Button 
              variant={isActive ? "destructive" : "default"}
              className={isActive ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"}
              onClick={handleTogglePreview}
            >
              {isActive ? "Exit Preview" : "Enter Preview"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Add state to track if user preview is active
  const [userPreviewActive, setUserPreviewActive] = useState(false);
  
  const { toast } = useToast();

  // Check if we already have an authenticated admin session
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const userData = await response.json();
          if (userData.role === 'ADMIN') {
            setIsAdminAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  // Function to verify admin password
  const verifyAdminPassword = () => {
    setAuthError(null);
    
    // Simple check for demo purposes - in production, this would be a server API call
    if (adminUsername === 'admin' && adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      toast({
        title: "Admin Authentication Successful",
        description: "You now have access to all admin functions.",
        variant: "default",
      });
    } else {
      setAuthError('Invalid username or password');
      toast({
        title: "Authentication Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
  };
  
  // If not admin authenticated, show login form
  if (!isAdminAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Admin Authentication</h1>
            <Badge className="bg-red-600">Admin Only</Badge>
          </div>
          
          <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900/80 to-blue-900/20 backdrop-blur-sm border border-blue-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-400" />
                Admin Authentication
              </CardTitle>
              <CardDescription>
                Please authenticate to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {authError && (
                  <Alert variant="destructive">
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Username</label>
                  <Input 
                    type="text" 
                    placeholder="Enter username" 
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Password</label>
                  <Input 
                    type="password" 
                    placeholder="Enter password" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        verifyAdminPassword();
                      }
                    }}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={verifyAdminPassword}
              >
                Authenticate
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10"
              onClick={() => {
                setIsAdminAuthenticated(false);
                setAdminUsername('');
                setAdminPassword('');
                toast({
                  title: "Logged Out",
                  description: "You have been logged out of the admin dashboard.",
                  variant: "default",
                });
              }}
            >
              <Lock className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button
              variant="outline" 
              className={`border-amber-500 ${userPreviewActive ? 'bg-amber-500/20 text-amber-300' : 'text-amber-500 hover:bg-amber-500/10'}`}
              onClick={() => {
                setUserPreviewActive(!userPreviewActive);
                if (userPreviewActive) {
                  sessionStorage.removeItem('adminPreviewMode');
                } else {
                  sessionStorage.setItem('adminPreviewMode', 'true');
                }
                window.location.href = userPreviewActive ? '/admin-dashboard' : '/dashboard';
              }}
            >
              {userPreviewActive ? 'Exit User Preview' : 'Preview User View'}
            </Button>
            <Badge className="bg-red-600">Admin Only</Badge>
          </div>
        </div>
        
        <Tabs defaultValue="ghost-users" className="w-full">
          <TabsList className="mb-4 bg-gray-800 flex flex-wrap">
            <TabsTrigger value="ghost-users" className="data-[state=active]:bg-purple-900">
              <Ghost className="h-4 w-4 mr-2" />
              Ghost Users
            </TabsTrigger>
            <TabsTrigger value="ghost-mining" className="data-[state=active]:bg-purple-900">
              <Zap className="h-4 w-4 mr-2" />
              Ghost Mining
            </TabsTrigger>
            <TabsTrigger value="network-boost" className="data-[state=active]:bg-blue-900">
              <Hash className="h-4 w-4 mr-2" />
              Network Boost
            </TabsTrigger>
            <TabsTrigger value="special-wallet" className="data-[state=active]:bg-green-900">
              <Wallet className="h-4 w-4 mr-2" />
              Special Wallet
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-amber-900">
              <Gift className="h-4 w-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="emergency" className="data-[state=active]:bg-red-900">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Controls
            </TabsTrigger>
            <TabsTrigger value="ghost-chat" className="data-[state=active]:bg-teal-900">
              <Ghost className="h-4 w-4 mr-2" />
              Ghost Chat
            </TabsTrigger>
            <TabsTrigger value="chat-admin" className="data-[state=active]:bg-cyan-900">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat Admin
            </TabsTrigger>
            <TabsTrigger value="screen-broadcast" className="data-[state=active]:bg-orange-900">
              <Cast className="h-4 w-4 mr-2" />
              Screen Broadcast
            </TabsTrigger>
            <TabsTrigger value="family-access" className="data-[state=active]:bg-purple-900">
              <Users className="h-4 w-4 mr-2" />
              Family Access
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ghost-users" className="mt-0">
            <GhostAccountManager />
          </TabsContent>
          
          <TabsContent value="ghost-mining" className="mt-0">
            <GhostMiningSimulator />
          </TabsContent>
          
          <TabsContent value="network-boost" className="mt-0">
            <NetworkBoostSystem />
          </TabsContent>
          
          <TabsContent value="special-wallet" className="mt-0">
            <Card className="w-full bg-gradient-to-br from-gray-900/80 to-green-900/20 backdrop-blur-sm border border-green-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-6 w-6 text-green-400" />
                  Special Wallet Access
                </CardTitle>
                <CardDescription>
                  Access the special index 0 wallet functions with password protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpecialWalletAccess />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="campaigns" className="mt-0">
            <CampaignManager />
          </TabsContent>
          
          <TabsContent value="emergency" className="mt-0">
            <EmergencySystemController />
          </TabsContent>

          <TabsContent value="ghost-chat" className="mt-0">
            <Card className="w-full bg-gradient-to-br from-gray-900/80 to-teal-900/20 backdrop-blur-sm border border-teal-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ghost className="h-6 w-6 text-teal-400" />
                  Ghost Chat Simulator
                </CardTitle>
                <CardDescription>
                  Simulate realistic chat activity with AI-powered ghost users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GhostChatSimulator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat-admin" className="mt-0">
            <Card className="w-full bg-gradient-to-br from-gray-900/80 to-cyan-900/20 backdrop-blur-sm border border-cyan-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-cyan-400" />
                  Chat Administration
                </CardTitle>
                <CardDescription>
                  Manage and moderate the Mining Cafe chat platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatAdminControl />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="screen-broadcast" className="mt-0">
            <Card className="w-full bg-gradient-to-br from-gray-900/80 to-orange-900/20 backdrop-blur-sm border border-orange-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cast className="h-6 w-6 text-orange-400" />
                  Screen Broadcast Control
                </CardTitle>
                <CardDescription>
                  Broadcast your screen to all platform users with exclusive mode
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScreenBroadcastControl />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="family-access" className="mt-0">
            <Card className="w-full bg-gradient-to-br from-gray-900/80 to-purple-900/20 backdrop-blur-sm border border-purple-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-purple-400" />
                  Family Access Notifications
                </CardTitle>
                <CardDescription>
                  Monitor when family members access the platform using the "Tera-Token" code or direct login
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FamilyAccessNotifications />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <Card className="w-full bg-gradient-to-br from-gray-900/80 to-gray-800/30 backdrop-blur-sm border border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-gray-400" />
                  Admin Settings
                </CardTitle>
                <CardDescription>
                  Configure global admin settings and permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Additional admin settings will be implemented in the future.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}