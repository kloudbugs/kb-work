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
  Badge 
} from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Ghost, 
  User, 
  Cpu, 
  Eye, 
  PanelTop, 
  Monitor, 
  Smartphone, 
  Laptop, 
  Loader2, 
  UserCircle, 
  Settings, 
  LayoutDashboard, 
  Bitcoin, 
  Wallet, 
  CircleDollarSign, 
  Copy, 
  Zap, 
  HardDrive, 
  PlusCircle, 
  ChevronRight, 
  RefreshCw,
  UserPlus,
  Users,
  DollarSign,
  BadgeCheck,
  ArrowRight,
  Calendar,
  Map,
  PieChart,
  Database,
  BarChart3,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface GhostUserSimulatorProps {
  className?: string;
}

// User subscription plans
const SUBSCRIPTION_PLANS = [
  { id: 'free', name: 'Free Plan', description: 'Limited features, no mining', price: 0 },
  { id: 'basic', name: 'Basic Plan', description: '5 TH/s mining power', price: 9.99 },
  { id: 'standard', name: 'Standard Plan', description: '20 TH/s mining power', price: 29.99 },
  { id: 'premium', name: 'Premium Plan', description: '50 TH/s mining power', price: 49.99 },
  { id: 'enterprise', name: 'Enterprise Plan', description: '150 TH/s mining power', price: 149.99 },
];

// User device types
const DEVICE_TYPES = [
  { id: 'desktop', name: 'Desktop', icon: <Monitor className="h-4 w-4" /> },
  { id: 'laptop', name: 'Laptop', icon: <Laptop className="h-4 w-4" /> },
  { id: 'mobile', name: 'Mobile', icon: <Smartphone className="h-4 w-4" /> },
];

// Location options
const LOCATIONS = [
  { id: 'us', name: 'United States', code: 'US' },
  { id: 'uk', name: 'United Kingdom', code: 'UK' },
  { id: 'eu', name: 'European Union', code: 'EU' },
  { id: 'ca', name: 'Canada', code: 'CA' },
  { id: 'au', name: 'Australia', code: 'AU' },
  { id: 'jp', name: 'Japan', code: 'JP' },
  { id: 'sg', name: 'Singapore', code: 'SG' },
  { id: 'br', name: 'Brazil', code: 'BR' },
  { id: 'za', name: 'South Africa', code: 'ZA' },
  { id: 'in', name: 'India', code: 'IN' },
];

// User mining hardware
const MINING_HARDWARE = [
  { id: 'asic-s9', name: 'ASIC S9', hashrate: 14, power: 1400 },
  { id: 'asic-s17', name: 'ASIC S17', hashrate: 56, power: 2520 },
  { id: 'asic-s19', name: 'ASIC S19', hashrate: 95, power: 3250 },
  { id: 'asic-s19xl', name: 'ASIC S19 XL', hashrate: 140, power: 3010 },
  { id: 'asic-s21', name: 'ASIC S21', hashrate: 150, power: 3200 },
  { id: 'whatsminer-m30s', name: 'Whatsminer M30S', hashrate: 86, power: 3268 },
  { id: 'gpu-rig-6', name: 'GPU Rig (6x)', hashrate: 0.3, power: 1200 },
];

// Ghost user interface
interface GhostUser {
  id: string;
  username: string;
  email: string;
  subscriptionPlan: string;
  joinDate: Date;
  isActive: boolean;
  totalHashrate: number;
  hardwareWalletAddress: string;
  balance: number;
  deviceType: string;
  location: string;
  hardware: {
    id: string;
    quantity: number;
  }[];
  // Stats
  acceptedShares: number;
  rejectedShares: number;
  dailyEarnings: number;
  lifetimeEarnings: number;
  efficiency: number;
  uptime: number;
  lastActive: Date;
}

export function GhostUserSimulator({ className = '' }: GhostUserSimulatorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isSimulatorActive, setIsSimulatorActive] = useState(false);
  const [ghostUsers, setGhostUsers] = useState<GhostUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserPreview, setShowUserPreview] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [selectedDevice, setSelectedDevice] = useState('desktop');
  const [miningActive, setMiningActive] = useState(false);
  
  // New user form state
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPlan, setNewPlan] = useState(SUBSCRIPTION_PLANS[2].id); // Standard plan by default
  const [newLocation, setNewLocation] = useState(LOCATIONS[0].id);
  const [newDeviceType, setNewDeviceType] = useState(DEVICE_TYPES[0].id);
  const [newHardware, setNewHardware] = useState<{ id: string; quantity: number }[]>([
    { id: MINING_HARDWARE[2].id, quantity: 1 }
  ]);
  
  // Load ghost users from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('ghostUsers');
    const storedActive = localStorage.getItem('ghostSimulatorActive');
    
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        // Convert string dates back to Date objects
        const usersWithDates = parsedUsers.map((user: any) => ({
          ...user,
          joinDate: new Date(user.joinDate),
          lastActive: new Date(user.lastActive)
        }));
        setGhostUsers(usersWithDates);
        
        // If users exist, select the first one by default
        if (usersWithDates.length > 0) {
          setSelectedUserId(usersWithDates[0].id);
        }
      } catch (e) {
        console.error('Error parsing stored ghost users:', e);
      }
    }
    
    if (storedActive === 'true') {
      setIsSimulatorActive(true);
    }
  }, []);
  
  // Save users to localStorage when they change
  useEffect(() => {
    if (ghostUsers.length > 0) {
      localStorage.setItem('ghostUsers', JSON.stringify(ghostUsers));
    }
  }, [ghostUsers]);
  
  // Save simulator active state to localStorage
  useEffect(() => {
    localStorage.setItem('ghostSimulatorActive', isSimulatorActive.toString());
  }, [isSimulatorActive]);
  
  // Generate BTC address for ghost users
  const generateBtcAddress = (): string => {
    const prefix = Math.random() > 0.5 ? 'bc1q' : '1';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let address = prefix;
    
    // Generate random characters
    for (let i = 0; i < (prefix === 'bc1q' ? 38 : 33); i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return address;
  };
  
  // Calculate total hashrate for a user based on their hardware
  const calculateTotalHashrate = (hardware: { id: string; quantity: number }[]): number => {
    return hardware.reduce((total, item) => {
      const hardwareItem = MINING_HARDWARE.find(h => h.id === item.id);
      return total + (hardwareItem ? hardwareItem.hashrate * item.quantity : 0);
    }, 0);
  };
  
  // Create a new ghost user
  const createGhostUser = async () => {
    if (!newUsername.trim() || !newEmail.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a username and email for the ghost user.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsCreatingUser(true);
    
    try {
      // Call the server API to create a ghost admin
      const response = await fetch('/api/admin/ghost/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ghostName: newUsername,
          ghostUsername: newUsername.toLowerCase().replace(/\s+/g, '_'),
          ghostEmail: newEmail,
          permissions: ['view_users', 'view_mining', 'view_wallet']
        }),
        credentials: 'include'
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create ghost user');
      }
      
      // Generate stats for UI display
      const totalHashrate = calculateTotalHashrate(newHardware);
      const acceptedShares = Math.floor(Math.random() * 5000) + 1000;
      const rejectedShares = Math.floor(Math.random() * 50);
      const efficiency = 100 * (acceptedShares / (acceptedShares + rejectedShares));
      const dailyEarnings = totalHashrate * 0.00001;
      const lifetimeEarnings = dailyEarnings * (Math.floor(Math.random() * 100) + 10);
      const uptime = 95 + Math.random() * 5;
      
      // Create new user for local state
      const newUser: GhostUser = {
        id: result.ghostId,
        username: newUsername,
        email: newEmail,
        subscriptionPlan: newPlan,
        joinDate: new Date(),
        isActive: true,
        hardwareWalletAddress: generateBtcAddress(),
        balance: lifetimeEarnings * (Math.random() * 0.3 + 0.1), // 10-40% of lifetime earnings
        totalHashrate,
        deviceType: newDeviceType,
        location: newLocation,
        hardware: newHardware,
        acceptedShares,
        rejectedShares,
        dailyEarnings,
        lifetimeEarnings,
        efficiency,
        uptime,
        lastActive: new Date()
      };
      
      // Add to list of ghost users
      const updatedUsers = [...ghostUsers, newUser];
      setGhostUsers(updatedUsers);
      
      // Select the new user
      setSelectedUserId(newUser.id);
      
      // Reset form
      setNewUsername('');
      setNewEmail('');
      setNewPlan(SUBSCRIPTION_PLANS[2].id);
      setNewLocation(LOCATIONS[0].id);
      setNewDeviceType(DEVICE_TYPES[0].id);
      setNewHardware([{ id: MINING_HARDWARE[2].id, quantity: 1 }]);
      
      // Show success message
      toast({
        title: "Ghost User Created",
        description: `${newUsername} has been created with password: ${result.initialPassword}`,
        duration: 5000,
      });
    } catch (error: any) {
      console.error('Error creating ghost user:', error);
      toast({
        title: "Error Creating Ghost User",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsCreatingUser(false);
    }
  };
  
  // Add hardware to new user
  const addHardware = () => {
    // Find a hardware type not already added
    const unusedHardware = MINING_HARDWARE.find(h => 
      !newHardware.some(nh => nh.id === h.id)
    );
    
    if (unusedHardware) {
      setNewHardware([...newHardware, { id: unusedHardware.id, quantity: 1 }]);
    } else {
      // If all hardware types are already added, duplicate the first one
      setNewHardware([...newHardware, { id: MINING_HARDWARE[0].id, quantity: 1 }]);
    }
  };
  
  // Update hardware quantity
  const updateHardwareQuantity = (index: number, quantity: number) => {
    const updatedHardware = [...newHardware];
    updatedHardware[index].quantity = quantity;
    setNewHardware(updatedHardware);
  };
  
  // Remove hardware from new user
  const removeHardware = (index: number) => {
    setNewHardware(newHardware.filter((_, i) => i !== index));
  };
  
  // Toggle simulator active state
  const toggleSimulator = () => {
    const newState = !isSimulatorActive;
    setIsSimulatorActive(newState);
    
    // Update all users' isActive state
    if (newState) {
      // Activate all users
      setGhostUsers(prev => prev.map(user => ({ ...user, isActive: true, lastActive: new Date() })));
    }
    
    toast({
      title: newState ? "Ghost Simulator Activated" : "Ghost Simulator Deactivated",
      description: newState 
        ? "Ghost users are now active in the system." 
        : "Ghost users have been deactivated.",
      duration: 3000,
    });
    
    // Invalidate queries to update UI
    queryClient.invalidateQueries({ queryKey: ['/api/users'] });
  };
  
  // Get selected user
  const selectedUser = ghostUsers.find(user => user.id === selectedUserId);
  
  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format BTC amount
  const formatBTC = (amount: number): string => {
    return amount.toFixed(8);
  };
  
  // Format USD amount
  const formatUSD = (amount: number): string => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };
  
  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
  };
  
  // Format time ago
  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    
    return `${Math.floor(seconds)} seconds ago`;
  };
  
  return (
    <Card className={`w-full bg-gradient-to-br from-gray-900/80 to-purple-900/20 backdrop-blur-sm border border-purple-800/50 ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Ghost className="h-6 w-6 text-purple-400" />
              Ghost User Simulator
              {isSimulatorActive && (
                <Badge className="ml-2 bg-green-600 animate-pulse">Active</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Create and simulate real users to test and monitor the system without creating actual accounts.
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="text-xs h-8 border-purple-800"
              onClick={() => setShowUserPreview(!showUserPreview)}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              {showUserPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            
            <Button 
              className={`h-8 ${isSimulatorActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              onClick={toggleSimulator}
            >
              {isSimulatorActive ? 'Deactivate Simulator' : 'Activate Simulator'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Ghost Users List */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className={`${showUserPreview ? 'w-full md:w-1/3' : 'w-full'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Ghost Users</h3>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Ghost User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800">
                    <DialogHeader>
                      <DialogTitle>Create Ghost User</DialogTitle>
                      <DialogDescription>
                        Add a new simulated user to view their experience without creating a real account.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            placeholder="Enter username..."
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            placeholder="Enter email..."
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="plan">Subscription Plan</Label>
                          <Select value={newPlan} onValueChange={setNewPlan}>
                            <SelectTrigger id="plan" className="bg-gray-800 border-gray-700">
                              <SelectValue placeholder="Select plan" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {SUBSCRIPTION_PLANS.map(plan => (
                                <SelectItem key={plan.id} value={plan.id}>
                                  <div className="flex justify-between items-center w-full">
                                    <span>{plan.name}</span>
                                    <Badge>
                                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Select value={newLocation} onValueChange={setNewLocation}>
                            <SelectTrigger id="location" className="bg-gray-800 border-gray-700">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {LOCATIONS.map(location => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.name} ({location.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="device-type">Device Type</Label>
                        <Select value={newDeviceType} onValueChange={setNewDeviceType}>
                          <SelectTrigger id="device-type" className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select device type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {DEVICE_TYPES.map(device => (
                              <SelectItem key={device.id} value={device.id}>
                                <div className="flex items-center">
                                  {device.icon}
                                  <span className="ml-2">{device.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Mining Hardware</Label>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7"
                            onClick={addHardware}
                          >
                            <PlusCircle className="h-3.5 w-3.5 mr-1" />
                            Add Hardware
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {newHardware.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Select
                                value={item.id}
                                onValueChange={(value) => {
                                  const updated = [...newHardware];
                                  updated[index].id = value;
                                  setNewHardware(updated);
                                }}
                              >
                                <SelectTrigger className="bg-gray-800 border-gray-700 h-8">
                                  <SelectValue placeholder="Select hardware" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                  {MINING_HARDWARE.map(hardware => (
                                    <SelectItem key={hardware.id} value={hardware.id}>
                                      {hardware.name} ({hardware.hashrate} TH/s)
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              
                              <div className="flex items-center space-x-1">
                                <Label className="text-xs">Qty:</Label>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateHardwareQuantity(index, parseInt(e.target.value) || 1)}
                                  className="w-16 h-8 bg-gray-800 border-gray-700"
                                  min="1"
                                  max="100"
                                />
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                onClick={() => removeHardware(index)}
                                disabled={newHardware.length <= 1}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                          <span className="text-sm">Total Hashrate:</span>
                          <Badge className="bg-blue-600">{calculateTotalHashrate(newHardware)} TH/s</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="ghost">Cancel</Button>
                      <Button
                        onClick={createGhostUser}
                        disabled={isCreatingUser || !newUsername.trim() || !newEmail.trim()}
                      >
                        {isCreatingUser ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Ghost className="h-4 w-4 mr-2" />
                            Create Ghost User
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {ghostUsers.length === 0 ? (
                <div className="bg-gray-800/70 rounded-md border border-gray-700 p-6 text-center">
                  <Ghost className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                  <h3 className="text-lg font-medium text-gray-300">No Ghost Users</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    Create a ghost user to see the system from their perspective.
                  </p>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Ghost User
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {ghostUsers.map(user => (
                    <div
                      key={user.id}
                      className={`p-3 rounded-md border cursor-pointer transition-all ${
                        selectedUserId === user.id 
                          ? 'border-purple-500 bg-purple-900/20' 
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            selectedUserId === user.id ? 'bg-purple-900' : 'bg-gray-700'
                          }`}>
                            <UserCircle className="h-6 w-6 text-purple-300" />
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{user.username}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge className={`${user.isActive ? 'bg-green-600' : 'bg-gray-600'}`}>
                            {user.isActive ? 'Online' : 'Offline'}
                          </Badge>
                          <span className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(user.lastActive)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Plan:</span>
                          <span className="ml-1">{SUBSCRIPTION_PLANS.find(p => p.id === user.subscriptionPlan)?.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Hashrate:</span>
                          <span className="ml-1">{user.totalHashrate} TH/s</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Mining:</span>
                          <span className={`ml-1 ${user.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Balance:</span>
                          <span className="ml-1">{formatBTC(user.balance)} BTC</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-right">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUserId(user.id);
                            setShowUserPreview(true);
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Dashboard
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* User Dashboard Preview */}
            {showUserPreview && selectedUser && (
              <div className="w-full md:w-2/3 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <div className="p-3 border-b border-gray-800 flex items-center justify-between bg-gray-900">
                  <div className="flex items-center">
                    <UserCircle className="h-6 w-6 text-purple-300 mr-2" />
                    <span className="font-medium">{selectedUser.username}</span>
                    <span className="text-xs text-gray-400 ml-2">({selectedUser.email})</span>
                  </div>
                  
                  <div className="flex items-center">
                    {DEVICE_TYPES.find(d => d.id === selectedUser.deviceType)?.icon}
                    <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                      <SelectTrigger className="h-7 text-xs bg-gray-800 border-gray-700 ml-2 w-[110px]">
                        <SelectValue placeholder="Select device" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {DEVICE_TYPES.map(device => (
                          <SelectItem key={device.id} value={device.id}>
                            <div className="flex items-center">
                              {device.icon}
                              <span className="ml-2">{device.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="p-3 border-b border-gray-800 flex space-x-1 bg-gray-900">
                  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                    <TabsList className="bg-gray-800 w-full">
                      <TabsTrigger value="dashboard" className="flex-1 data-[state=active]:bg-primary">
                        <LayoutDashboard className="h-4 w-4 mr-1" />
                        Dashboard
                      </TabsTrigger>
                      <TabsTrigger value="mining" className="flex-1 data-[state=active]:bg-primary">
                        <Cpu className="h-4 w-4 mr-1" />
                        Mining
                      </TabsTrigger>
                      <TabsTrigger value="wallet" className="flex-1 data-[state=active]:bg-primary">
                        <Wallet className="h-4 w-4 mr-1" />
                        Wallet
                      </TabsTrigger>
                      <TabsTrigger value="reports" className="flex-1 data-[state=active]:bg-primary">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Reports
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="flex-1 data-[state=active]:bg-primary">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {/* Dashboard Tab Content */}
                <div className="p-4 max-h-[600px] overflow-y-auto">
                  <TabsContent value="dashboard" className="m-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
                        <div className="text-xs text-gray-400">Total Hashrate</div>
                        <div className="text-2xl font-bold mt-1">{selectedUser.totalHashrate} TH/s</div>
                        <div className="text-xs text-green-400 mt-1">+{Math.floor(Math.random() * 5)}% from yesterday</div>
                      </div>
                      
                      <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
                        <div className="text-xs text-gray-400">BTC Balance</div>
                        <div className="text-xl font-bold mt-1">{formatBTC(selectedUser.balance)} BTC</div>
                        <div className="text-xs text-gray-400 mt-1">≈ {formatUSD(selectedUser.balance * 68000)}</div>
                      </div>
                      
                      <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
                        <div className="text-xs text-gray-400">Daily Earnings</div>
                        <div className="text-xl font-bold mt-1">{formatBTC(selectedUser.dailyEarnings)} BTC</div>
                        <div className="text-xs text-gray-400 mt-1">≈ {formatUSD(selectedUser.dailyEarnings * 68000)}/day</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <HardDrive className="h-4 w-4 mr-2" />
                        Active Mining Hardware
                      </h3>
                      <div className="space-y-3">
                        {selectedUser.hardware.map((hw, index) => {
                          const hardwareItem = MINING_HARDWARE.find(h => h.id === hw.id);
                          if (!hardwareItem) return null;
                          
                          return (
                            <div key={index} className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{hardwareItem.name}</div>
                                <div className="text-xs text-gray-400">
                                  {hardwareItem.hashrate} TH/s, {hardwareItem.power}W
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Badge className="bg-blue-600 mr-2">
                                  {formatNumber(hardwareItem.hashrate * hw.quantity)} TH/s
                                </Badge>
                                <Badge className="bg-gray-700">
                                  Qty: {hw.quantity}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Mining Activity
                        </h3>
                        <div className="h-[180px]">
                          {/* Simple mock chart */}
                          <svg className="w-full h-full" viewBox="0 0 300 100">
                            <path
                              d="M0,80 L25,70 L50,75 L75,65 L100,60 L125,50 L150,55 L175,45 L200,40 L225,30 L250,35 L275,25 L300,20"
                              fill="none"
                              stroke="#8b5cf6"
                              strokeWidth="2"
                            />
                            <path
                              d="M0,80 L25,70 L50,75 L75,65 L100,60 L125,50 L150,55 L175,45 L200,40 L225,30 L250,35 L275,25 L300,20"
                              fill="url(#gradient)"
                              opacity="0.3"
                              strokeWidth="0"
                            />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <Map className="h-4 w-4 mr-2" />
                          Mining Stats
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Efficiency:</span>
                            <Badge className="bg-green-600">{selectedUser.efficiency.toFixed(2)}%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Uptime:</span>
                            <Badge className="bg-blue-600">{selectedUser.uptime.toFixed(1)}%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Shares:</span>
                            <div>
                              <Badge className="bg-green-600 mr-1">{formatNumber(selectedUser.acceptedShares)} Accepted</Badge>
                              <Badge className="bg-red-600">{formatNumber(selectedUser.rejectedShares)} Rejected</Badge>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Devices:</span>
                            <Badge className="bg-gray-600">{selectedUser.hardware.length} Active</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Mining Tab Content */}
                  <TabsContent value="mining" className="m-0 space-y-4">
                    <div className="flex items-center justify-between bg-gray-800 p-4 rounded-md border border-gray-700">
                      <div>
                        <h3 className="font-medium">Mining Status</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {miningActive ? 'Your miners are actively generating rewards' : 'Your miners are currently inactive'}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Label htmlFor="mining-toggle" className="mr-2">
                          {miningActive ? 'Active' : 'Inactive'}
                        </Label>
                        <Switch
                          id="mining-toggle"
                          checked={miningActive}
                          onCheckedChange={setMiningActive}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                        <h3 className="text-sm font-medium mb-3">Hardware Performance</h3>
                        <div className="space-y-3">
                          {selectedUser.hardware.map((hw, index) => {
                            const hardwareItem = MINING_HARDWARE.find(h => h.id === hw.id);
                            if (!hardwareItem) return null;
                            
                            const efficiency = 90 + Math.random() * 9;
                            const tempC = 60 + Math.random() * 20;
                            
                            return (
                              <div key={index} className="space-y-2">
                                <div className="flex justify-between">
                                  <span>{hardwareItem.name} #{index + 1}</span>
                                  <Badge className={tempC > 75 ? 'bg-red-600' : 'bg-blue-600'}>
                                    {tempC.toFixed(1)}°C
                                  </Badge>
                                </div>
                                <div className="relative h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className="absolute h-full bg-purple-600 rounded-full"
                                    style={{ width: `${efficiency}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                  <span>Efficiency: {efficiency.toFixed(1)}%</span>
                                  <span>{(hardwareItem.hashrate * (efficiency / 100)).toFixed(2)} TH/s</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                        <h3 className="text-sm font-medium mb-3">Mining Pool</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Current Pool:</span>
                            <Badge className="bg-blue-600">KloudBugs Mining Pool</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Connection:</span>
                            <Badge className="bg-green-600">Connected</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Workers:</span>
                            <span>{selectedUser.hardware.length} active</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Payout Method:</span>
                            <Badge className="bg-amber-600">PPS+</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Pool Fee:</span>
                            <span>1.5%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                      <h3 className="text-sm font-medium mb-3">Recent Activity</h3>
                      <div className="space-y-2">
                        {[...Array(5)].map((_, index) => {
                          const minutes = Math.floor(Math.random() * 60);
                          const shares = Math.floor(Math.random() * 10) + 1;
                          const isAccepted = Math.random() > 0.1;
                          
                          return (
                            <div key={index} className="flex justify-between items-center p-2 border-b border-gray-700 last:border-0">
                              <div className="flex items-center">
                                {isAccepted ? (
                                  <Badge className="bg-green-600 mr-2">Accepted</Badge>
                                ) : (
                                  <Badge className="bg-red-600 mr-2">Rejected</Badge>
                                )}
                                <span>{shares} shares submitted</span>
                              </div>
                              <span className="text-xs text-gray-400">{minutes} minutes ago</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Wallet Tab Content */}
                  <TabsContent value="wallet" className="m-0 space-y-4">
                    <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Bitcoin Wallet</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Your mining rewards are automatically sent to your hardware wallet.
                          </p>
                        </div>
                        <Badge className="bg-green-600">
                          <BadgeCheck className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-900 rounded-md border border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Hardware Wallet Address:</span>
                          <div className="flex items-center">
                            <span className="text-xs font-mono text-gray-300 mr-1 truncate max-w-[140px]">
                              {selectedUser.hardwareWalletAddress}
                            </span>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <Bitcoin className="h-4 w-4 mr-2" />
                          Bitcoin Balance
                        </h3>
                        <div className="flex items-center mt-3">
                          <div className="w-14 h-14 rounded-full bg-amber-600/20 flex items-center justify-center">
                            <Bitcoin className="h-7 w-7 text-amber-500" />
                          </div>
                          <div className="ml-3">
                            <div className="font-bold text-xl">{formatBTC(selectedUser.balance)} BTC</div>
                            <div className="text-sm text-gray-400">≈ {formatUSD(selectedUser.balance * 68000)}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <CircleDollarSign className="h-4 w-4 mr-2" />
                          Earnings Summary
                        </h3>
                        <div className="space-y-3 mt-2">
                          <div className="flex justify-between">
                            <span>Today's Earnings:</span>
                            <div className="font-medium">{formatBTC(selectedUser.dailyEarnings)} BTC</div>
                          </div>
                          <div className="flex justify-between">
                            <span>This Week:</span>
                            <div className="font-medium">{formatBTC(selectedUser.dailyEarnings * 7)} BTC</div>
                          </div>
                          <div className="flex justify-between">
                            <span>This Month:</span>
                            <div className="font-medium">{formatBTC(selectedUser.dailyEarnings * 30)} BTC</div>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Lifetime:</span>
                            <div className="font-medium">{formatBTC(selectedUser.lifetimeEarnings)} BTC</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                      <h3 className="text-sm font-medium mb-3">Transaction History</h3>
                      <div className="space-y-2">
                        {[...Array(5)].map((_, index) => {
                          const daysAgo = Math.floor(Math.random() * 14);
                          const amount = 0.00001 + Math.random() * 0.001;
                          
                          return (
                            <div key={index} className="flex justify-between items-center p-2 border-b border-gray-700 last:border-0">
                              <div className="flex items-center">
                                <Zap className="h-4 w-4 text-green-500 mr-2" />
                                <div>
                                  <div>Mining Reward</div>
                                  <div className="text-xs text-gray-400">{daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-green-500">+{formatBTC(amount)} BTC</div>
                                <div className="text-xs text-gray-400">≈ {formatUSD(amount * 68000)}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Reports Tab Content */}
                  <TabsContent value="reports" className="m-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Earnings Chart
                        </h3>
                        <div className="h-[200px]">
                          {/* Simple mock chart */}
                          <svg className="w-full h-full" viewBox="0 0 300 100">
                            <path
                              d="M0,70 L25,65 L50,68 L75,63 L100,58 L125,60 L150,55 L175,50 L200,45 L225,40 L250,42 L275,36 L300,30"
                              fill="none"
                              stroke="#22c55e"
                              strokeWidth="2"
                            />
                            <path
                              d="M0,70 L25,65 L50,68 L75,63 L100,58 L125,60 L150,55 L175,50 L200,45 L225,40 L250,42 L275,36 L300,30"
                              fill="url(#gradientGreen)"
                              opacity="0.3"
                              strokeWidth="0"
                            />
                            <defs>
                              <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Past 30 Days</span>
                          <span>Today</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <PieChart className="h-4 w-4 mr-2" />
                          Hardware Distribution
                        </h3>
                        <div className="h-[200px] flex items-center justify-center">
                          {/* Simple mock pie chart */}
                          <svg width="200" height="200" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="0" />
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="188.4" />
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="125.6" />
                          </svg>
                        </div>
                        <div className="flex justify-center space-x-4 mt-1">
                          {selectedUser.hardware.map((hw, index) => {
                            const hardwareItem = MINING_HARDWARE.find(h => h.id === hw.id);
                            if (!hardwareItem) return null;
                            
                            const colors = ['bg-purple-600', 'bg-blue-600', 'bg-green-600'];
                            
                            return (
                              <div key={index} className="flex items-center">
                                <div className={`h-3 w-3 rounded-full ${colors[index % colors.length]} mr-1`} />
                                <span className="text-xs">{hardwareItem.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        Mining Efficiency Report
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="text-left py-2 text-sm font-medium">Hardware</th>
                              <th className="text-left py-2 text-sm font-medium">Hashrate</th>
                              <th className="text-left py-2 text-sm font-medium">Power</th>
                              <th className="text-left py-2 text-sm font-medium">Efficiency</th>
                              <th className="text-left py-2 text-sm font-medium">Daily Reward</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedUser.hardware.map((hw, index) => {
                              const hardwareItem = MINING_HARDWARE.find(h => h.id === hw.id);
                              if (!hardwareItem) return null;
                              
                              const efficiency = (hardwareItem.hashrate / hardwareItem.power) * 1000;
                              const dailyReward = (hardwareItem.hashrate * 0.00001) * hw.quantity;
                              
                              return (
                                <tr key={index} className="border-b border-gray-700 last:border-b-0">
                                  <td className="py-2 text-sm">{hardwareItem.name} (x{hw.quantity})</td>
                                  <td className="py-2 text-sm">{hardwareItem.hashrate * hw.quantity} TH/s</td>
                                  <td className="py-2 text-sm">{hardwareItem.power * hw.quantity}W</td>
                                  <td className="py-2 text-sm">{efficiency.toFixed(2)} TH/kW</td>
                                  <td className="py-2 text-sm">{formatBTC(dailyReward)} BTC</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Settings Tab Content */}
                  <TabsContent value="settings" className="m-0 space-y-4">
                    <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                      <h3 className="text-sm font-medium mb-3">Account Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Username:</span>
                          <span>{selectedUser.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Email:</span>
                          <span>{selectedUser.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Member Since:</span>
                          <span>{formatDate(selectedUser.joinDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Subscription Plan:</span>
                          <Badge className="bg-blue-600">
                            {SUBSCRIPTION_PLANS.find(p => p.id === selectedUser.subscriptionPlan)?.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                      <h3 className="text-sm font-medium mb-3">Hardware Wallet</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-900 rounded-md border border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Wallet Address:</span>
                            <div className="flex items-center">
                              <span className="text-xs font-mono text-gray-300 mr-1 truncate max-w-[140px]">
                                {selectedUser.hardwareWalletAddress}
                              </span>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Button className="w-full" disabled>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Change Wallet Address
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                      <h3 className="text-sm font-medium mb-3">Notification Settings</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Email Notifications</span>
                          <Switch checked={true} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Mining Alerts</span>
                          <Switch checked={true} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Payment Notifications</span>
                          <Switch checked={true} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span>System Updates</span>
                          <Switch checked={false} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          <Ghost className="h-5 w-5 mr-2 text-purple-400" />
          <span className="text-sm text-gray-400">
            {ghostUsers.length} Ghost Users | {ghostUsers.filter(u => u.isActive).length} Active
          </span>
        </div>
        
        <Button 
          variant="outline" 
          className="border-purple-800"
          onClick={() => {
            // Update all ghost users' lastActive timestamp
            setGhostUsers(prev => prev.map(user => ({ ...user, lastActive: new Date() })));
            
            toast({
              title: "Ghost Users Updated",
              description: "All ghost users' activity timestamps have been refreshed.",
              duration: 3000,
            });
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Activity
        </Button>
      </CardFooter>
    </Card>
  );
}

export default GhostUserSimulator;