import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import MainLayout from '@/components/layout/MainLayout';
import MusicControlPanel from '@/components/admin/MusicControlPanel';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Copy,
  MessageCircle,
  Cast,
  Building,
  ArrowUpRight,
  CreditCard,
  Calendar,
  History,
  ExternalLink,
  Loader2,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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



interface AdminDashboardProps {
  section?: string;
}

export default function AdminDashboard({ section = 'main' }: AdminDashboardProps) {
  // Admin is automatically authenticated through the platform login
  // No need for additional authentication logic
  
  const [, setLocation] = useLocation();
  
  // No user preview mode
  
  // State for wallet data
  const [personalWalletData, setPersonalWalletData] = useState({
    address: 'bc1qg9xemo98e0ecnh3g8quk9ysxztj8t3mpvwa78f',
    balance: 0.00823742,
    balanceUSD: 204.95,
    canWithdrawToCustomAddress: true
  });
  
  // State for withdrawals
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  
  // State for platform withdrawals
  const [platformWithdrawAmount, setPlatformWithdrawAmount] = useState('');
  const [isProcessingPlatformWithdrawal, setIsProcessingPlatformWithdrawal] = useState(false);
  
  // Mock platform transactions data
  const platformTransactions = [
    {
      id: 1,
      type: 'fee',
      description: 'Pool Fee Revenue',
      amount: '0.00215',
      amountUSD: '53.75',
      date: '2025-05-01'
    },
    {
      id: 2,
      type: 'subscription',
      description: 'Premium Subscription',
      amount: '0.00089',
      amountUSD: '22.25',
      date: '2025-04-29'
    },
    {
      id: 3,
      type: 'fee',
      description: 'Pool Fee Revenue',
      amount: '0.00198',
      amountUSD: '49.50',
      date: '2025-04-27'
    },
    {
      id: 4,
      type: 'withdrawal',
      description: 'Admin Withdrawal',
      amount: '0.00450',
      amountUSD: '112.50',
      date: '2025-04-25'
    },
    {
      id: 5,
      type: 'subscription',
      description: 'Premium Subscription',
      amount: '0.00105',
      amountUSD: '26.25',
      date: '2025-04-23'
    }
  ];
  
  // State for payouts
  const [payouts, setPayouts] = useState<Array<any>>([]);
  
  const { toast } = useToast();
  
  // Fetch wallet and payout data
  useEffect(() => {
    // Fetch payouts data
    fetch('/api/payouts')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setPayouts(data);
        }
      })
      .catch(err => {
        console.error('Error fetching payouts:', err);
      });
    
    // Fetch wallet data
    fetch('/api/wallet')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setPersonalWalletData({
            address: data.address || 'bc1qg9xemo98e0ecnh3g8quk9ysxztj8t3mpvwa78f',
            balance: data.balance || 0,
            balanceUSD: data.balanceUSD || 0,
            canWithdrawToCustomAddress: data.canWithdrawToCustomAddress || true
          });
        }
      })
      .catch(err => {
        console.error('Error fetching wallet data:', err);
      });
  }, []);
  
  // Handle withdrawal
  const handleWithdrawal = () => {
    if (!withdrawAmount || !withdrawAddress) return;
    
    setIsProcessingWithdrawal(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessingWithdrawal(false);
      toast({
        title: "Withdrawal Initiated",
        description: `${withdrawAmount} BTC will be sent to ${withdrawAddress.substring(0, 8)}...`,
      });
      
      // Reset form
      setWithdrawAmount('');
      setWithdrawAddress('');
    }, 2000);
  };
  
  // Handle platform withdrawal
  const handlePlatformWithdrawal = () => {
    if (!platformWithdrawAmount) return;
    
    setIsProcessingPlatformWithdrawal(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessingPlatformWithdrawal(false);
      toast({
        title: "Platform Withdrawal Initiated",
        description: `${platformWithdrawAmount} BTC will be sent to admin address`,
      });
      
      // Reset form
      setPlatformWithdrawAmount('');
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {section === 'ghost' || section === 'main' ? 'Ghost Functions' : 
               section === 'platform' ? 'Platform Tools' : 
               section === 'wallet' ? 'Admin Wallet' : 
               'System Controls'}
            </h1>
            <p className="text-gray-400">
              {section === 'ghost' || section === 'main' ? 'Control ghost accounts, mining operations, and network simulation.' : 
               section === 'platform' ? 'Manage platform tools, campaigns, and user interactions.' : 
               section === 'wallet' ? 'Access your admin wallet and manage platform earnings.' : 
               'Configure system settings and emergency controls.'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-red-600">Admin Only</Badge>
          </div>
        </div>
        
        {/* Admin Dashboard Page Selection */}
        <Card className="mb-6 bg-gray-900/60 border-gray-800">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-2">
              {/* Guardians Section - Added Above Admin Controls */}
              <Button 
                variant={section === 'guardians' ? "default" : "outline"}
                className={section === 'guardians' ? "bg-amber-700 hover:bg-amber-600" : "border-amber-700 text-amber-400 hover:bg-amber-900/20"}
                onClick={() => setLocation('/guardians')}
              >
                <Crown className="h-4 w-4 mr-2 text-yellow-400" />
                Guardians
              </Button>
              
              <Button 
                variant={section === 'ghost' || section === 'main' ? "default" : "outline"}
                className={section === 'ghost' || section === 'main' ? "bg-purple-800 hover:bg-purple-700" : "border-purple-800 text-purple-400 hover:bg-purple-900/20"}
                onClick={() => setLocation('/admin-dashboard/ghost')}
              >
                <Ghost className="h-4 w-4 mr-2" />
                Ghost Functions
              </Button>
              
              <Button 
                variant={section === 'platform' ? "default" : "outline"}
                className={section === 'platform' ? "bg-blue-800 hover:bg-blue-700" : "border-blue-800 text-blue-400 hover:bg-blue-900/20"}
                onClick={() => setLocation('/admin-dashboard/platform')}
              >
                <Zap className="h-4 w-4 mr-2" />
                Platform Tools
              </Button>
              
              <Button 
                variant={section === 'wallet' ? "default" : "outline"}
                className={section === 'wallet' ? "bg-green-800 hover:bg-green-700" : "border-green-800 text-green-400 hover:bg-green-900/20"}
                onClick={() => setLocation('/admin-dashboard/wallet')}
              >
                <Wallet className="h-4 w-4 mr-2" />
                My Wallet
              </Button>
              
              <Button 
                variant={section === 'system' ? "default" : "outline"}
                className={section === 'system' ? "bg-red-800 hover:bg-red-700" : "border-red-800 text-red-400 hover:bg-red-900/20"}
                onClick={() => setLocation('/admin-dashboard/system')}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                System Controls
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Ghost Functions Section */}
        {(section === 'ghost' || section === 'main') && (
          <Tabs defaultValue="ghost-users" className="w-full">
            <TabsList className="mb-4 bg-gray-800 flex flex-wrap gap-1">
              <div className="flex items-center pl-2 pr-4 border-r border-gray-700">
                <span className="text-xs font-semibold text-purple-400 whitespace-nowrap">GHOST FUNCTIONS:</span>
              </div>
              
              {/* Ghost Functions Tabs */}
              <TabsTrigger value="ghost-users" className="data-[state=active]:bg-purple-900">
                <Ghost className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="ghost-mining" className="data-[state=active]:bg-purple-900">
                <Zap className="h-4 w-4 mr-2" />
                Mining
              </TabsTrigger>
              <TabsTrigger value="network-boost" className="data-[state=active]:bg-blue-900">
                <Hash className="h-4 w-4 mr-2" />
                Network
              </TabsTrigger>
              <TabsTrigger value="special-wallet" className="data-[state=active]:bg-green-900">
                <Key className="h-4 w-4 mr-2" />
                Special Wallet
              </TabsTrigger>
              <TabsTrigger value="ghost-chat" className="data-[state=active]:bg-teal-900">
                <Ghost className="h-4 w-4 mr-2" />
                Ghost Chat
              </TabsTrigger>
              <TabsTrigger value="chat-admin" className="data-[state=active]:bg-cyan-900">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat Admin
              </TabsTrigger>
            </TabsList>
            
            {/* Ghost Functions Tab Content */}
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
              <SpecialWalletAccess />
            </TabsContent>
            
            <TabsContent value="ghost-chat" className="mt-0">
              <GhostChatSimulator />
            </TabsContent>
            
            <TabsContent value="chat-admin" className="mt-0">
              <ChatAdminControl />
            </TabsContent>
          </Tabs>
        )}
        
        {/* Platform Tools Section */}
        {section === 'platform' && (
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="mb-4 bg-gray-800 flex flex-wrap gap-1">
              <div className="flex items-center pl-2 pr-4 border-r border-gray-700">
                <span className="text-xs font-semibold text-blue-400 whitespace-nowrap">PLATFORM TOOLS:</span>
              </div>
              
              {/* Platform Tools Tabs */}
              <TabsTrigger value="campaigns" className="data-[state=active]:bg-amber-900">
                <Gift className="h-4 w-4 mr-2" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="screen-broadcast" className="data-[state=active]:bg-orange-900">
                <Cast className="h-4 w-4 mr-2" />
                Screen Broadcast
              </TabsTrigger>
              <TabsTrigger value="music-control" className="data-[state=active]:bg-pink-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
                Music Control
              </TabsTrigger>
              <TabsTrigger value="family-access" className="data-[state=active]:bg-indigo-900">
                <Users className="h-4 w-4 mr-2" />
                Family Access
              </TabsTrigger>
            </TabsList>
            
            {/* Platform Tools Tab Content */}
            <TabsContent value="campaigns" className="mt-0">
              <CampaignManager />
            </TabsContent>
            
            <TabsContent value="screen-broadcast" className="mt-0">
              <ScreenBroadcastControl />
            </TabsContent>
            
            <TabsContent value="music-control" className="mt-0">
              <MusicControlPanel />
            </TabsContent>
            
            <TabsContent value="family-access" className="mt-0">
              <FamilyAccessNotifications />
            </TabsContent>
          </Tabs>
        )}
        
        {/* System Controls Section */}
        {section === 'system' && (
          <Tabs defaultValue="emergency" className="w-full">
            <TabsList className="mb-4 bg-gray-800 flex flex-wrap gap-1">
              <div className="flex items-center pl-2 pr-4 border-r border-gray-700">
                <span className="text-xs font-semibold text-red-400 whitespace-nowrap">SYSTEM CONTROLS:</span>
              </div>
              
              {/* System Tabs */}
              <TabsTrigger value="emergency" className="data-[state=active]:bg-red-900">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Controls
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            {/* System Controls Tab Content */}
            <TabsContent value="emergency" className="mt-0">
              <EmergencySystemController />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Permissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FeaturePermissionManager />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Active User Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ActiveUserTracker />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        {/* Admin Wallet Section */}
        {section === 'wallet' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Wallet Card */}
            <Card className="w-full bg-gradient-to-br from-gray-900/80 to-green-900/20 backdrop-blur-sm border border-green-800/50 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-6 w-6 text-green-400" />
                  Personal Wallet
                </CardTitle>
                <CardDescription>
                  Your personal wallet details and balance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-900/60 rounded-lg p-4 border border-green-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-green-400">Current Balance</h3>
                    <Badge className="bg-green-700 text-white px-3">
                      {personalWalletData.balance.toFixed(8)} BTC
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2 text-sm text-gray-400">
                    <span>Est. Value</span>
                    <span className="font-medium text-white">${personalWalletData.balanceUSD.toFixed(2)} USD</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Wallet Address</span>
                      <div className="flex items-center gap-1">
                        <input 
                          type="text" 
                          value={personalWalletData.address} 
                          readOnly 
                          className="bg-black/30 border border-green-800/20 rounded px-2 py-1 text-sm text-green-300 w-32 lg:w-48 font-mono"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                          onClick={() => {
                            navigator.clipboard.writeText(personalWalletData.address);
                            toast({
                              title: "Address Copied",
                              description: "Wallet address has been copied to clipboard",
                            });
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="withdrawAmount" className="text-sm text-gray-400">Withdraw Amount (BTC)</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="withdrawAmount" 
                        value={withdrawAmount} 
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="bg-black/30 border border-green-800/20 text-white"
                        placeholder="0.00000000"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-green-800/20 text-green-400 hover:bg-green-900/20"
                        onClick={() => setWithdrawAmount(personalWalletData.balance.toString())}
                      >
                        MAX
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="withdrawAddress" className="text-sm text-gray-400">Destination Address</Label>
                    <Input 
                      id="withdrawAddress" 
                      value={withdrawAddress} 
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      className="bg-black/30 border border-green-800/20 text-white"
                      placeholder="Enter BTC address"
                    />
                  </div>
                  <Button 
                    className="w-full bg-green-700 hover:bg-green-600 text-white"
                    disabled={isProcessingWithdrawal || !withdrawAmount || !withdrawAddress || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > personalWalletData.balance}
                    onClick={handleWithdrawal}
                  >
                    {isProcessingWithdrawal ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Withdraw Funds'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Platform Earnings Card */}
            <Card className="w-full bg-gradient-to-br from-gray-900/80 to-indigo-900/20 backdrop-blur-sm border border-indigo-800/50 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-6 w-6 text-indigo-400" />
                  Platform Earnings
                </CardTitle>
                <CardDescription>
                  Total platform earnings and withdrawal records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/60 rounded-lg p-4 border border-indigo-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-indigo-400">Total Pool Fee Earnings</h3>
                      <Badge className="bg-indigo-700 text-white px-3">
                        0.02573294 BTC
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2 text-sm text-gray-400">
                      <span>Est. Value</span>
                      <span className="font-medium text-white">$617.59 USD</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Current Period</span>
                      <span>72% of Previous</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/60 rounded-lg p-4 border border-purple-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-purple-400">User Subscription Revenue</h3>
                      <Badge className="bg-purple-700 text-white px-3">
                        0.04981105 BTC
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2 text-sm text-gray-400">
                      <span>Est. Value</span>
                      <span className="font-medium text-white">$1,195.57 USD</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full" style={{ width: '118%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Current Period</span>
                      <span>118% of Previous</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900/60 rounded-lg p-4 border border-blue-800/30">
                  <h3 className="text-lg font-medium text-blue-400 mb-4">Recent Platform Transactions</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {platformTransactions.map(tx => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-blue-900/20">
                        <div className="flex items-center gap-3">
                          {tx.type === 'fee' ? (
                            <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center">
                              <Hash className="h-4 w-4 text-blue-400" />
                            </div>
                          ) : tx.type === 'subscription' ? (
                            <div className="h-8 w-8 rounded-full bg-purple-900/50 flex items-center justify-center">
                              <CreditCard className="h-4 w-4 text-purple-400" />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-green-900/50 flex items-center justify-center">
                              <ArrowUpRight className="h-4 w-4 text-green-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-200">{tx.description}</p>
                            <p className="text-xs text-gray-500">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${tx.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'}`}>
                            {tx.type === 'withdrawal' ? '-' : '+'}{tx.amount} BTC
                          </p>
                          <p className="text-xs text-gray-500">${tx.amountUSD} USD</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-md font-medium text-gray-300 mb-3">Platform Withdrawal</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="platformWithdrawAmount" className="text-sm text-gray-400">Withdraw Amount (BTC)</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="platformWithdrawAmount" 
                            value={platformWithdrawAmount} 
                            onChange={(e) => setPlatformWithdrawAmount(e.target.value)}
                            className="bg-black/30 border border-blue-800/20 text-white"
                            placeholder="0.00000000"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-blue-800/20 text-blue-400 hover:bg-blue-900/20"
                            onClick={() => setPlatformWithdrawAmount("0.01000000")}
                          >
                            SET
                          </Button>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-blue-700 hover:bg-blue-600 text-white"
                        disabled={isProcessingPlatformWithdrawal || !platformWithdrawAmount || parseFloat(platformWithdrawAmount) <= 0}
                        onClick={handlePlatformWithdrawal}
                      >
                        {isProcessingPlatformWithdrawal ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Withdraw to Admin Address'
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-gray-300 mb-3">Revenue Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Total Revenue (30 days)</span>
                        <span className="font-medium text-white">0.08619753 BTC</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Withdrawal Requests</span>
                        <span className="font-medium text-white">23 pending</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Active Subscriptions</span>
                        <span className="font-medium text-white">127 users</span>
                      </div>
                      <div className="mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-gray-800 text-gray-400 hover:bg-gray-800/30"
                          onClick={() => setLocation('/admin-dashboard/platform')}
                        >
                          View Detailed Reports
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Payouts */}
            <Card className="lg:col-span-3 bg-gradient-to-br from-gray-900/80 to-gray-800/20 backdrop-blur-sm border border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-6 w-6 text-blue-400" />
                  Recent Payouts
                </CardTitle>
                <CardDescription>
                  History of recent platform and personal wallet transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payouts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-900/50">
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Amount</TableHead>
                        <TableHead className="text-gray-400">Destination</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400">Transaction Hash</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payouts.map((payout) => (
                        <TableRow key={payout.id} className="hover:bg-gray-900/50 border-gray-800/50">
                          <TableCell className="font-medium">
                            {new Date(payout.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-green-400 font-medium">
                            {payout.amount} BTC
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate font-mono text-xs">
                            {payout.destinationAddress}
                          </TableCell>
                          <TableCell>
                            <Badge variant={payout.status === 'completed' ? 'outline' : 'secondary'} 
                                  className={payout.status === 'completed' ? 'border-green-500 text-green-400' : 'border-amber-500 text-amber-400'}>
                              {payout.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate font-mono text-xs">
                            <a href={`https://www.blockchain.com/explorer/transactions/btc/${payout.txHash}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline flex items-center gap-1">
                              {payout.txHash.substring(0, 18)}...
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Calendar className="h-10 w-10 text-gray-500 mb-3" />
                    <p className="text-gray-500">No payouts found in your history</p>
                    <p className="text-gray-600 text-sm mt-1">
                      Once you perform withdrawals, they will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}