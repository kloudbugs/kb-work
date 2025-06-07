import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Server, 
  ThermometerSun, 
  Fan, 
  Power, 
  Hash, 
  RefreshCw, 
  Terminal, 
  Settings,
  Wifi,
  AlertCircle,
  Link2,
  CheckCircle2
} from 'lucide-react';

interface AntminerDevice {
  id: string;
  name: string;
  ipAddress: string;
  username: string;
  password: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  firmwareVersion: string;
  model: string;
  lastSeen: string;
  location: string;
}

interface AntminerStatus {
  hashrate: {
    total: number;
    chain1: number;
    chain2: number;
    chain3: number;
  };
  temperature: {
    ambient: number;
    chip: number[];
  };
  fanSpeed: number[];
  powerUsage: number;
  uptime: number;
  pools: {
    url: string;
    worker: string;
    status: string;
    accepted: number;
    rejected: number;
    lastShare?: string;
  }[];
  errors?: string[];
}

interface MiningPool {
  name: string;
  url: string;
  port: number;
}

const MINING_POOLS: MiningPool[] = [
  { name: 'F2Pool Primary', url: 'stratum+tcp://btc.f2pool.com', port: 3333 },
  { name: 'F2Pool Backup 1', url: 'stratum+tcp://btc.f2pool.com', port: 1314 },
  { name: 'F2Pool Backup 2', url: 'stratum+tcp://btc.f2pool.com', port: 25 },
  { name: 'F2Pool SSL', url: 'stratum+ssl://btcssl.f2pool.com', port: 1300 },
  { name: 'F2Pool SSL Alt', url: 'stratum+ssl://btcssl.f2pool.com', port: 1301 },
  { name: 'Braiins Pool V1', url: 'stratum+tcp://stratum.braiins.com', port: 3333 },
  { name: 'Braiins Pool V2', url: 'stratum2+tcp://v2.stratum.braiins.com/u95GEReVMjK6k5YqiSFNqqTnKU4ypU2Wm8awa6tmbmDmk1bWt', port: 3333 },
  { name: 'Slush Pool', url: 'stratum+tcp://us-east.stratum.slushpool.com', port: 3333 },
  { name: 'NiceHash', url: 'stratum+tcp://sha256.usa.nicehash.com', port: 3334 },
  { name: 'Solo Mining', url: 'stratum+tcp://127.0.0.1', port: 3333 }
];

export function AntminerControlPanel() {
  const [antminers, setAntminers] = useState<AntminerDevice[]>([
    {
      id: 'ant-1',
      name: 'Antminer S9 #1',
      ipAddress: '192.168.1.100',
      username: 'admin',
      password: 'admin',
      status: 'online',
      firmwareVersion: 'Bitmain Antminer S9 v2.0',
      model: 'Antminer S9',
      lastSeen: new Date().toISOString(),
      location: 'Mining Farm'
    },
    {
      id: 'ant-2',
      name: 'Antminer S9 #2',
      ipAddress: '192.168.1.101',
      username: 'admin',
      password: 'admin',
      status: 'warning',
      firmwareVersion: 'Bitmain Antminer S9 v2.0',
      model: 'Antminer S9',
      lastSeen: new Date().toISOString(),
      location: 'Mining Farm'
    }
  ]);
  
  const [selectedMiner, setSelectedMiner] = useState<string | null>('ant-1');
  const [minerStatus, setMinerStatus] = useState<AntminerStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  const [newMiner, setNewMiner] = useState<Partial<AntminerDevice>>({
    name: '',
    ipAddress: '',
    username: 'admin',
    password: 'admin',
    model: 'Antminer S9',
    location: 'Mining Farm'
  });
  
  const [selectedPool, setSelectedPool] = useState<MiningPool>(MINING_POOLS[0]);
  const [workerName, setWorkerName] = useState<string>('kloudbugs5.Tera1');
  const [passwordPool, setPasswordPool] = useState<string>('123');
  
  const { toast } = useToast();
  
  // Fetch miner status on selection change
  useEffect(() => {
    if (selectedMiner) {
      fetchMinerStatus(selectedMiner);
    }
  }, [selectedMiner]);
  
  // Fetch status for the selected miner
  const fetchMinerStatus = async (minerId: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // const response = await apiRequest.get(`/api/mining/antminer/${minerId}/status`);
      // setMinerStatus(response.data);
      
      // For demonstration, generate realistic-looking data
      const miner = antminers.find(m => m.id === minerId);
      
      if (!miner) {
        throw new Error('Miner not found');
      }
      
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const status: AntminerStatus = {
        hashrate: {
          total: 13500 + Math.random() * 500,
          chain1: 4500 + Math.random() * 200,
          chain2: 4500 + Math.random() * 200,
          chain3: 4500 + Math.random() * 200
        },
        temperature: {
          ambient: 35 + Math.random() * 5,
          chip: Array.from({ length: 3 }, () => 65 + Math.random() * 10)
        },
        fanSpeed: [
          Math.floor(2000 + Math.random() * 1000),
          Math.floor(2000 + Math.random() * 1000)
        ],
        powerUsage: 1300 + Math.random() * 100,
        uptime: Math.floor(Math.random() * 86400),
        pools: [
          {
            url: 'stratum+tcp://us-east.stratum.slushpool.com:3333',
            worker: 'worker1',
            status: 'Alive',
            accepted: Math.floor(10000 + Math.random() * 5000),
            rejected: Math.floor(Math.random() * 100),
            lastShare: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString()
          },
          {
            url: 'stratum+tcp://pool.f2pool.com:3333',
            worker: 'worker1',
            status: 'Alive',
            accepted: 0,
            rejected: 0
          }
        ]
      };
      
      // Add errors for miners with warning status
      if (miner.status === 'warning') {
        status.errors = ['Temperature on ASIC 2 approaching critical level'];
      } else if (miner.status === 'error') {
        status.errors = ['Fan 2 failure detected', 'Connection to pool intermittent'];
      }
      
      setMinerStatus(status);
    } catch (error) {
      console.error('Failed to fetch miner status:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch miner status. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a new Antminer
  const addAntminer = async () => {
    if (!newMiner.name || !newMiner.ipAddress) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a name and IP address for the miner.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // await apiRequest.post('/api/mining/antminer', newMiner);
      
      // For demonstration, add to local state
      const newMinerId = `ant-${Date.now()}`;
      const newMinerComplete: AntminerDevice = {
        id: newMinerId,
        name: newMiner.name!,
        ipAddress: newMiner.ipAddress!,
        username: newMiner.username || 'admin',
        password: newMiner.password || 'admin',
        status: 'offline',
        firmwareVersion: 'Unknown',
        model: newMiner.model || 'Antminer S9',
        lastSeen: new Date().toISOString(),
        location: newMiner.location || 'Mining Farm'
      };
      
      setAntminers([...antminers, newMinerComplete]);
      setSelectedMiner(newMinerId);
      setIsAdding(false);
      setNewMiner({
        name: '',
        ipAddress: '',
        username: 'admin',
        password: 'admin',
        model: 'Antminer S9',
        location: 'Mining Farm'
      });
      
      toast({
        title: 'Antminer Added',
        description: `${newMinerComplete.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Failed to add Antminer:', error);
      toast({
        title: 'Error',
        description: 'Failed to add Antminer. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update an existing Antminer
  const updateAntminer = async () => {
    if (!selectedMiner) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // await apiRequest.patch(`/api/mining/antminer/${selectedMiner}`, newMiner);
      
      // For demonstration, update local state
      const updatedAntminers = antminers.map(miner => 
        miner.id === selectedMiner
          ? { ...miner, ...newMiner }
          : miner
      );
      
      setAntminers(updatedAntminers);
      setIsEditing(false);
      
      toast({
        title: 'Antminer Updated',
        description: `${newMiner.name} has been updated successfully.`,
      });
    } catch (error) {
      console.error('Failed to update Antminer:', error);
      toast({
        title: 'Error',
        description: 'Failed to update Antminer. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remove an Antminer
  const removeAntminer = async (minerId: string) => {
    if (!minerId) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // await apiRequest.delete(`/api/mining/antminer/${minerId}`);
      
      // For demonstration, update local state
      const updatedAntminers = antminers.filter(miner => miner.id !== minerId);
      setAntminers(updatedAntminers);
      
      if (selectedMiner === minerId) {
        setSelectedMiner(updatedAntminers.length > 0 ? updatedAntminers[0].id : null);
      }
      
      toast({
        title: 'Antminer Removed',
        description: 'The Antminer has been removed successfully.',
      });
    } catch (error) {
      console.error('Failed to remove Antminer:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove Antminer. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Change mining pool
  const changePool = async () => {
    if (!selectedMiner || !minerStatus) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // await apiRequest.post(`/api/mining/antminer/${selectedMiner}/pool`, {
      //   poolUrl: `${selectedPool.url}:${selectedPool.port}`,
      //   worker: workerName,
      //   password: passwordPool
      // });
      
      // For demonstration, update local state
      const updatedStatus = { ...minerStatus };
      updatedStatus.pools[0] = {
        url: `${selectedPool.url}:${selectedPool.port}`,
        worker: workerName,
        status: 'Alive',
        accepted: 0,
        rejected: 0
      };
      
      setMinerStatus(updatedStatus);
      
      toast({
        title: 'Pool Changed',
        description: `Mining pool changed to ${selectedPool.name} successfully.`,
      });
    } catch (error) {
      console.error('Failed to change pool:', error);
      toast({
        title: 'Error',
        description: 'Failed to change mining pool. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Restart miner
  const restartMiner = async () => {
    if (!selectedMiner) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // await apiRequest.post(`/api/mining/antminer/${selectedMiner}/restart`);
      
      toast({
        title: 'Restarting',
        description: 'The Antminer is restarting. This may take a few minutes.',
      });
      
      // Simulate restart process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update status to reflect restart
      const currentMiner = antminers.find(m => m.id === selectedMiner);
      if (currentMiner) {
        const updatedAntminers = antminers.map(miner => 
          miner.id === selectedMiner
            ? { ...miner, lastSeen: new Date().toISOString() }
            : miner
        );
        setAntminers(updatedAntminers);
      }
      
      // Fetch fresh status after "restart"
      fetchMinerStatus(selectedMiner);
      
      toast({
        title: 'Restart Complete',
        description: 'The Antminer has been restarted successfully.',
      });
    } catch (error) {
      console.error('Failed to restart Antminer:', error);
      toast({
        title: 'Error',
        description: 'Failed to restart Antminer. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Start editing miner
  const startEditing = () => {
    if (!selectedMiner) return;
    
    const miner = antminers.find(m => m.id === selectedMiner);
    if (!miner) return;
    
    setNewMiner({
      name: miner.name,
      ipAddress: miner.ipAddress,
      username: miner.username,
      password: miner.password,
      model: miner.model,
      location: miner.location
    });
    
    setIsEditing(true);
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="text-gray-500">Offline</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Format uptime
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };
  
  // Render
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Antminer Control Center</h2>
          <p className="text-sm text-muted-foreground">Manage your Antminer S9 ASIC mining devices</p>
        </div>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-cyan-700 hover:bg-cyan-600 text-white"
        >
          <Server className="h-4 w-4 mr-2" />
          Add Antminer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Miners list */}
        <div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Antminers</h3>
            
            {antminers.length === 0 ? (
              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <Server className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Antminers Found</h3>
                    <p className="text-sm text-muted-foreground">
                      Add your first Antminer to get started
                    </p>
                    <Button 
                      onClick={() => setIsAdding(true)}
                      className="mt-4"
                    >
                      Add Antminer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {antminers.map(miner => (
                  <Card 
                    key={miner.id} 
                    className={`cursor-pointer transition-all hover:border-space-purple/20 ${selectedMiner === miner.id ? 'border-cyber-gold' : ''}`}
                    onClick={() => setSelectedMiner(miner.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{miner.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{miner.ipAddress}</div>
                          <div className="text-xs text-muted-foreground">{miner.model}</div>
                        </div>
                        <div className="flex flex-col items-end">
                          {getStatusBadge(miner.status)}
                          <div className="text-xs text-muted-foreground mt-1">
                            {miner.location}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Miner details and control */}
        <div className="md:col-span-2">
          {isAdding ? (
            <Card>
              <CardHeader>
                <CardTitle>Add New Antminer</CardTitle>
                <CardDescription>
                  Enter the details of your Antminer device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Miner Name</Label>
                  <Input 
                    id="name" 
                    value={newMiner.name} 
                    onChange={(e) => setNewMiner({...newMiner, name: e.target.value})} 
                    placeholder="My Antminer S9" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ipAddress">IP Address</Label>
                  <Input 
                    id="ipAddress" 
                    value={newMiner.ipAddress} 
                    onChange={(e) => setNewMiner({...newMiner, ipAddress: e.target.value})} 
                    placeholder="192.168.1.100" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={newMiner.username} 
                      onChange={(e) => setNewMiner({...newMiner, username: e.target.value})} 
                      placeholder="admin" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={newMiner.password} 
                      onChange={(e) => setNewMiner({...newMiner, password: e.target.value})} 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Select 
                      value={newMiner.model} 
                      onValueChange={(value) => setNewMiner({...newMiner, model: value})}
                    >
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Antminer S9">Antminer S9</SelectItem>
                        <SelectItem value="Antminer S9i">Antminer S9i</SelectItem>
                        <SelectItem value="Antminer S9j">Antminer S9j</SelectItem>
                        <SelectItem value="Antminer S17">Antminer S17</SelectItem>
                        <SelectItem value="Antminer S17 Pro">Antminer S17 Pro</SelectItem>
                        <SelectItem value="Antminer S19">Antminer S19</SelectItem>
                        <SelectItem value="Antminer S19 Pro">Antminer S19 Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      value={newMiner.location} 
                      onChange={(e) => setNewMiner({...newMiner, location: e.target.value})} 
                      placeholder="Mining Farm" 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={addAntminer}
                  disabled={isLoading}
                >
                  <Server className="h-4 w-4 mr-2" />
                  Add Antminer
                </Button>
              </CardFooter>
            </Card>
          ) : isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Antminer</CardTitle>
                <CardDescription>
                  Update the details of your Antminer device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Miner Name</Label>
                  <Input 
                    id="edit-name" 
                    value={newMiner.name} 
                    onChange={(e) => setNewMiner({...newMiner, name: e.target.value})} 
                    placeholder="My Antminer S9" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-ipAddress">IP Address</Label>
                  <Input 
                    id="edit-ipAddress" 
                    value={newMiner.ipAddress} 
                    onChange={(e) => setNewMiner({...newMiner, ipAddress: e.target.value})} 
                    placeholder="192.168.1.100" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-username">Username</Label>
                    <Input 
                      id="edit-username" 
                      value={newMiner.username} 
                      onChange={(e) => setNewMiner({...newMiner, username: e.target.value})} 
                      placeholder="admin" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-password">Password</Label>
                    <Input 
                      id="edit-password" 
                      type="password" 
                      value={newMiner.password} 
                      onChange={(e) => setNewMiner({...newMiner, password: e.target.value})} 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-model">Model</Label>
                    <Select 
                      value={newMiner.model} 
                      onValueChange={(value) => setNewMiner({...newMiner, model: value})}
                    >
                      <SelectTrigger id="edit-model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Antminer S9">Antminer S9</SelectItem>
                        <SelectItem value="Antminer S9i">Antminer S9i</SelectItem>
                        <SelectItem value="Antminer S9j">Antminer S9j</SelectItem>
                        <SelectItem value="Antminer S17">Antminer S17</SelectItem>
                        <SelectItem value="Antminer S17 Pro">Antminer S17 Pro</SelectItem>
                        <SelectItem value="Antminer S19">Antminer S19</SelectItem>
                        <SelectItem value="Antminer S19 Pro">Antminer S19 Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-location">Location</Label>
                    <Input 
                      id="edit-location" 
                      value={newMiner.location} 
                      onChange={(e) => setNewMiner({...newMiner, location: e.target.value})} 
                      placeholder="Mining Farm" 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={updateAntminer}
                  disabled={isLoading}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          ) : selectedMiner && minerStatus ? (
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="pool">Pool Settings</TabsTrigger>
                <TabsTrigger value="hardware">Hardware</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium">Performance Overview</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => fetchMinerStatus(selectedMiner)}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Hash className="h-4 w-4 mr-1" />
                          Hashrate
                        </div>
                        <div className="text-xl font-bold">
                          {(minerStatus.hashrate.total / 1000).toFixed(2)} TH/s
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground flex items-center">
                          <ThermometerSun className="h-4 w-4 mr-1" />
                          Temperature
                        </div>
                        <div className={`text-xl font-bold ${
                          Math.max(...minerStatus.temperature.chip) > 80 ? 'text-red-500' :
                          Math.max(...minerStatus.temperature.chip) > 70 ? 'text-amber-500' :
                          'text-green-500'
                        }`}>
                          {Math.max(...minerStatus.temperature.chip).toFixed(1)}°C
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Fan className="h-4 w-4 mr-1" />
                          Fan Speed
                        </div>
                        <div className="text-xl font-bold">
                          {Math.max(...minerStatus.fanSpeed)} RPM
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Power className="h-4 w-4 mr-1" />
                          Power
                        </div>
                        <div className="text-xl font-bold">
                          {minerStatus.powerUsage.toFixed(0)} W
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="text-sm font-medium">Hashrate Distribution</div>
                          <div className="text-xs text-muted-foreground">3 ASIC Chains</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Chain 1</div>
                            <Progress value={(minerStatus.hashrate.chain1 / minerStatus.hashrate.total) * 100} className="h-2" />
                            <div className="text-xs">{(minerStatus.hashrate.chain1 / 1000).toFixed(2)} TH/s</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Chain 2</div>
                            <Progress value={(minerStatus.hashrate.chain2 / minerStatus.hashrate.total) * 100} className="h-2" />
                            <div className="text-xs">{(minerStatus.hashrate.chain2 / 1000).toFixed(2)} TH/s</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Chain 3</div>
                            <Progress value={(minerStatus.hashrate.chain3 / minerStatus.hashrate.total) * 100} className="h-2" />
                            <div className="text-xs">{(minerStatus.hashrate.chain3 / 1000).toFixed(2)} TH/s</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Uptime</div>
                          <div className="text-sm">{formatUptime(minerStatus.uptime)}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Accepted Shares</div>
                          <div className="text-sm">{minerStatus.pools[0].accepted.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    
                    {minerStatus.errors && minerStatus.errors.length > 0 && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          <div>
                            <div className="font-medium text-red-500">Issues Detected</div>
                            <ul className="text-sm mt-1 space-y-1">
                              {minerStatus.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button variant="outline" onClick={startEditing}>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Miner
                    </Button>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                        onClick={() => removeAntminer(selectedMiner)}
                      >
                        Remove
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={restartMiner}
                        disabled={isLoading}
                      >
                        Restart Miner
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="pool" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Mining Pool Configuration</CardTitle>
                    <CardDescription>
                      Configure which pool your Antminer mines to
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pool">Mining Pool</Label>
                      <Select 
                        value={selectedPool.name} 
                        onValueChange={(value) => {
                          const pool = MINING_POOLS.find(p => p.name === value);
                          if (pool) {
                            setSelectedPool(pool);
                          }
                        }}
                      >
                        <SelectTrigger id="pool">
                          <SelectValue placeholder="Select mining pool" />
                        </SelectTrigger>
                        <SelectContent>
                          {MINING_POOLS.map(pool => (
                            <SelectItem key={pool.name} value={pool.name}>{pool.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="worker">Worker Name</Label>
                        <Input 
                          id="worker" 
                          value={workerName} 
                          onChange={(e) => setWorkerName(e.target.value)} 
                          placeholder="worker1" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          value={passwordPool} 
                          onChange={(e) => setPasswordPool(e.target.value)} 
                          placeholder="x" 
                        />
                      </div>
                    </div>
                    
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md p-3">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                        <div className="text-sm">
                          <span className="font-medium">Important:</span> Changing the mining pool will restart your Antminer. Mining will be interrupted for a few minutes.
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Current Pool</div>
                      <div className="border rounded-md p-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">URL: </span>
                            <span className="font-mono text-xs">{minerStatus.pools[0].url}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Worker: </span>
                            <span className="font-mono text-xs">{minerStatus.pools[0].worker}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status: </span>
                            <span className={minerStatus.pools[0].status === 'Alive' ? 'text-green-500' : 'text-red-500'}>
                              {minerStatus.pools[0].status}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Shares: </span>
                            <span>{minerStatus.pools[0].accepted} accepted / {minerStatus.pools[0].rejected} rejected</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-end">
                    <Button 
                      onClick={changePool}
                      disabled={isLoading}
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Change Mining Pool
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="hardware" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Hardware Information</CardTitle>
                    <CardDescription>
                      Detailed hardware information and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <div className="text-sm">
                          {antminers.find(m => m.id === selectedMiner)?.model}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Firmware Version</Label>
                        <div className="text-sm">
                          {antminers.find(m => m.id === selectedMiner)?.firmwareVersion}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Temperature Details</Label>
                      <div className="border rounded-md p-3">
                        <div className="grid grid-cols-4 gap-2">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Ambient</div>
                            <div className="text-sm font-medium">{minerStatus.temperature.ambient.toFixed(1)}°C</div>
                          </div>
                          
                          {minerStatus.temperature.chip.map((temp, index) => (
                            <div key={index} className="space-y-1">
                              <div className="text-xs text-muted-foreground">Chip {index + 1}</div>
                              <div className={`text-sm font-medium ${
                                temp > 80 ? 'text-red-500' :
                                temp > 70 ? 'text-amber-500' :
                                'text-green-500'
                              }`}>
                                {temp.toFixed(1)}°C
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Fan Control</Label>
                      <div className="border rounded-md p-3">
                        <div className="grid grid-cols-2 gap-4">
                          {minerStatus.fanSpeed.map((speed, index) => (
                            <div key={index}>
                              <div className="flex justify-between mb-1">
                                <div className="text-xs text-muted-foreground">Fan {index + 1}</div>
                                <div className="text-xs">{speed} RPM</div>
                              </div>
                              <Progress 
                                value={(speed / 6000) * 100} 
                                className="h-2"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Network Settings</Label>
                      <div className="border rounded-md p-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">IP Address: </span>
                            <span>{antminers.find(m => m.id === selectedMiner)?.ipAddress}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">MAC Address: </span>
                            <span>XX:XX:XX:XX:XX:XX</span>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center mt-2">
                              <Wifi className="h-4 w-4 text-green-500 mr-2" />
                              <span>Connected to network</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="logs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">System Logs</CardTitle>
                    <CardDescription>
                      View system logs and error messages
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black/90 text-green-400 font-mono text-xs p-4 rounded-md h-64 overflow-y-auto">
                      <div>[2025-05-20 09:34:12] System started</div>
                      <div>[2025-05-20 09:34:15] Chain 1: 84 chips found</div>
                      <div>[2025-05-20 09:34:16] Chain 2: 84 chips found</div>
                      <div>[2025-05-20 09:34:17] Chain 3: 84 chips found</div>
                      <div>[2025-05-20 09:34:20] Stratum connection established with us-east.stratum.slushpool.com:3333</div>
                      <div>[2025-05-20 09:34:22] Mining started</div>
                      <div>[2025-05-20 09:35:01] Share accepted: 1/1 (100%)</div>
                      <div>[2025-05-20 09:35:34] Share accepted: 2/2 (100%)</div>
                      <div>[2025-05-20 09:36:12] Share accepted: 3/3 (100%)</div>
                      <div>[2025-05-20 09:37:05] Share accepted: 4/4 (100%)</div>
                      <div>[2025-05-20 09:37:48] Share accepted: 5/5 (100%)</div>
                      <div>[2025-05-20 09:38:23] Share accepted: 6/6 (100%)</div>
                      <div>[2025-05-20 09:39:10] Share accepted: 7/7 (100%)</div>
                      <div>[2025-05-20 09:40:01] Share rejected: 7/8 (87.5%), reason: high-work</div>
                      <div>[2025-05-20 09:40:45] Share accepted: 8/9 (88.9%)</div>
                      <div>[2025-05-20 09:41:22] Temperature warning: Chip 2 ASIC 15 temperature 76°C (threshold: 75°C)</div>
                      <div>[2025-05-20 09:41:30] Increasing fan speed to 80%</div>
                      <div>[2025-05-20 09:42:12] Temperature normalized: Chip 2 ASIC 15 temperature 72°C</div>
                      <div>[2025-05-20 09:42:55] Share accepted: 9/10 (90.0%)</div>
                      <div>[2025-05-20 09:43:40] Share accepted: 10/11 (90.9%)</div>
                    </div>
                    
                    <div className="mt-4 border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Kernel Log</div>
                        <Button variant="outline" size="sm">
                          <Terminal className="h-4 w-4 mr-2" />
                          View Full Log
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="py-6">
                <div className="text-center">
                  <Server className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Miner Selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a miner from the list or add a new one
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}