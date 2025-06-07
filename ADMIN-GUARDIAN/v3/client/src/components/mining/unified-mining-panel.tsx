import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  RefreshCw, 
  Plus, 
  Server, 
  Zap, 
  Pause, 
  Edit, 
  Trash2, 
  Info, 
  AlertTriangle 
} from 'lucide-react';
// XMRig API removed - simplified version

export default function UnifiedMiningPanel() {
  const { toast } = useToast();
  
  // State for miners and stats
  const [miners, setMiners] = useState<{id: string; url: string; name: string; online: boolean}[]>([]);
  const [selectedMiner, setSelectedMiner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aggregatedStats, setAggregatedStats] = useState<{
    totalHashrate: number;
    totalShares: number;
    activeMiners: number;
    totalMiners: number;
  }>({
    totalHashrate: 0,
    totalShares: 0,
    activeMiners: 0,
    totalMiners: 0
  });
  
  // Selected miner details
  const [selectedMinerSummary, setSelectedMinerSummary] = useState<any>(null);
  const [selectedMinerConfig, setSelectedMinerConfig] = useState<any>(null);
  
  // Dialog states
  const [addMinerDialogOpen, setAddMinerDialogOpen] = useState(false);
  const [newMinerUrl, setNewMinerUrl] = useState('');
  const [newMinerName, setNewMinerName] = useState('');
  const [isAddingGhostMiners, setIsAddingGhostMiners] = useState(false);
  
  // Initialize XMRig API and load miners
  useEffect(() => {
    async function initializeMiners() {
      setIsLoading(true);
      try {
        // Temporary mock data while XMRig API is being restored
        const mockMiners = [
          { id: '1', name: 'TERA Guardian Rig 1', url: 'localhost:3333', online: true },
          { id: '2', name: 'TERA Guardian Rig 2', url: 'localhost:3334', online: true }
        ];
        setMiners(mockMiners);
        setAggregatedStats({ totalHashrate: 49.3, activeMiners: 2, totalShares: 1250, totalMiners: 2 });
      } catch (error) {
        console.error('Error initializing miners:', error);
        toast({
          title: "Error Loading Miners",
          description: "There was a problem connecting to your mining rigs. Please check your network.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    initializeMiners();
  }, []);
  
  // Refresh miners and stats
  const refreshMiners = async () => {
    setIsLoading(true);
    try {
      // Mock refresh for now
      const mockMiners = [
        { id: '1', name: 'TERA Guardian Rig 1', url: 'localhost:3333', online: true },
        { id: '2', name: 'TERA Guardian Rig 2', url: 'localhost:3334', online: true }
      ];
      setMiners(mockMiners);
      const newStats = { totalHashrate: 49.3, activeMiners: 2, totalShares: 1250, totalMiners: 2 };
      setAggregatedStats(newStats);
      
      toast({
        title: "Miners Refreshed",
        description: `Found ${newStats.activeMiners} active miners out of ${newStats.totalMiners} total rigs.`
      });
    } catch (error) {
      console.error('Error refreshing miners:', error);
      toast({
        title: "Refresh Failed",
        description: "There was a problem refreshing your miners. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load details for a selected miner
  const loadSelectedMinerDetails = async (minerId: string) => {
    try {
      // Get miner summary
      const summary = await XMRigAPI.getMinerSummary(minerId);
      setSelectedMinerSummary(summary);
      
      // Get miner config
      const config = await XMRigAPI.getMinerConfig(minerId);
      setSelectedMinerConfig(config);
    } catch (error) {
      console.error(`Error loading details for miner ${minerId}:`, error);
      setSelectedMinerSummary(null);
      setSelectedMinerConfig(null);
    }
  };
  
  // Handle miner selection
  const handleSelectMiner = async (minerId: string) => {
    setSelectedMiner(minerId);
    await loadSelectedMinerDetails(minerId);
  };
  
  // Add a new miner
  const handleAddMiner = async () => {
    if (!newMinerUrl || !newMinerName) {
      toast({
        title: "Missing Information",
        description: "Please provide both a URL and name for the miner.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const success = await XMRigAPI.addMiner(newMinerUrl, newMinerName);
      
      if (success) {
        toast({
          title: "Miner Added",
          description: `Successfully added miner "${newMinerName}".`
        });
      } else {
        toast({
          title: "Miner Added (Offline)",
          description: `Added "${newMinerName}" but couldn't connect to it. Check the URL and make sure the miner is running.`,
          variant: "default"
        });
      }
      
      // Reset form and close dialog
      setNewMinerUrl('');
      setNewMinerName('');
      setAddMinerDialogOpen(false);
      
      // Refresh miners
      await refreshMiners();
    } catch (error) {
      console.error('Error adding miner:', error);
      toast({
        title: "Failed to Add Miner",
        description: "There was an error adding the miner. Please check the URL and try again.",
        variant: "destructive"
      });
    }
  };
  
  // Ghost Feather special feature - Add 100 miners at once
  const handleAddGhostFeather = async () => {
    try {
      setIsAddingGhostMiners(true);
      
      toast({
        title: "Ghost Feather Activated",
        description: "Adding 100 mining rigs to your network...",
        duration: 3000,
      });
      
      // Use the special Ghost Feather API to add 100 rigs
      const minersAdded = await XMRigAPI.addGhostFeatherMiners();
      
      toast({
        title: "Mining Army Deployed",
        description: `Successfully added ${minersAdded} mining rigs to your network. All mining directed to your wallet.`,
        duration: 5000,
      });
      
      // Refresh miners to show the new fleet
      await refreshMiners();
    } catch (error) {
      console.error('Error adding Ghost Feather miners:', error);
      toast({
        title: "Ghost Feather Error",
        description: "There was a problem deploying your mining rigs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAddingGhostMiners(false);
    }
  };
  
  // Remove a miner
  const handleRemoveMiner = async (minerId: string) => {
    try {
      const success = XMRigAPI.removeMiner(minerId);
      
      if (success) {
        toast({
          title: "Miner Removed",
          description: "The mining rig has been removed from your dashboard."
        });
        
        // If this was the selected miner, clear selection
        if (selectedMiner === minerId) {
          setSelectedMiner(null);
          setSelectedMinerSummary(null);
          setSelectedMinerConfig(null);
        }
        
        // Refresh miners
        await refreshMiners();
      }
    } catch (error) {
      console.error(`Error removing miner ${minerId}:`, error);
      toast({
        title: "Failed to Remove Miner",
        description: "There was an error removing the miner. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Start mining on a specific rig
  const handleStartMining = async (minerId: string) => {
    try {
      const success = await XMRigAPI.startMining(minerId);
      
      if (success) {
        toast({
          title: "Mining Started",
          description: "Your mining rig is now active."
        });
        
        // Refresh miner details
        await loadSelectedMinerDetails(minerId);
      } else {
        toast({
          title: "Failed to Start Mining",
          description: "There was a problem starting the mining operation. Please check your rig.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error starting mining on ${minerId}:`, error);
      toast({
        title: "Start Mining Error",
        description: "There was an error communicating with your mining rig.",
        variant: "destructive"
      });
    }
  };
  
  // Stop mining on a specific rig
  const handleStopMining = async (minerId: string) => {
    try {
      const success = await XMRigAPI.stopMining(minerId);
      
      if (success) {
        toast({
          title: "Mining Stopped",
          description: "Your mining rig has been paused."
        });
        
        // Refresh miner details
        await loadSelectedMinerDetails(minerId);
      } else {
        toast({
          title: "Failed to Stop Mining",
          description: "There was a problem stopping the mining operation. Please check your rig.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error stopping mining on ${minerId}:`, error);
      toast({
        title: "Stop Mining Error",
        description: "There was an error communicating with your mining rig.",
        variant: "destructive"
      });
    }
  };
  
  // Format hashrate for display
  const formatHashrate = (hashrate: number): string => {
    if (hashrate >= 1000000000) {
      return `${(hashrate / 1000000000).toFixed(2)} GH/s`;
    } else if (hashrate >= 1000000) {
      return `${(hashrate / 1000000).toFixed(2)} MH/s`;
    } else if (hashrate >= 1000) {
      return `${(hashrate / 1000).toFixed(2)} kH/s`;
    } else {
      return `${hashrate.toFixed(2)} H/s`;
    }
  };
  
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Unified Mining Dashboard</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshMiners}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="flex flex-col p-4 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-sm text-muted-foreground">Total Hashrate</span>
              <div className="flex items-center mt-1">
                <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                <span className="text-xl font-bold">{formatHashrate(aggregatedStats.totalHashrate)}</span>
              </div>
            </div>
            
            <div className="flex flex-col p-4 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-sm text-muted-foreground">Active Miners</span>
              <div className="flex items-center mt-1">
                <Server className="h-5 w-5 mr-2 text-blue-500" />
                <span className="text-xl font-bold">{aggregatedStats.activeMiners} / {aggregatedStats.totalMiners}</span>
              </div>
            </div>
            
            <div className="flex flex-col p-4 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-sm text-muted-foreground">Total Shares</span>
              <div className="flex items-center mt-1">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                <span className="text-xl font-bold">{aggregatedStats.totalShares.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex justify-center items-center p-4 bg-slate-900/60 rounded-lg border border-slate-800">
              <div className="flex flex-col space-y-2">
                <Button onClick={() => setAddMinerDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mining Rig
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="text-xs bg-purple-900/50 hover:bg-purple-800"
                  onClick={() => handleAddGhostFeather()}
                  disabled={isAddingGhostMiners}
                >
                  <span className="mr-1">🪶</span> Ghost Feather (Add 100 Rigs)
                </Button>
              </div>
            </div>
          </div>
          
          {miners.length === 0 ? (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No Mining Rigs Found</AlertTitle>
              <AlertDescription>
                No XMRig mining rigs were detected on your network. 
                Add a mining rig manually or refresh to scan again.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Your Mining Rigs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {miners.map(miner => (
                  <Card 
                    key={miner.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedMiner === miner.id ? 'border-green-500' : 'border-slate-800'} ${!miner.online ? 'opacity-70' : ''}`}
                    onClick={() => handleSelectMiner(miner.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">{miner.name}</h4>
                        <div className={`w-3 h-3 rounded-full ${miner.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-1">{miner.url}</div>
                      
                      <div className="flex justify-between mt-4">
                        <div className="flex items-center">
                          <Server className="h-4 w-4 mr-1 text-blue-400" />
                          <span className="text-sm">{miner.online ? 'Online' : 'Offline'}</span>
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveMiner(miner.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Selected Miner Details */}
          {selectedMiner && selectedMinerSummary && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">Mining Rig Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Algorithm:</span>
                        <span className="font-medium">{selectedMinerSummary.algo || 'N/A'}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">Hashrate:</span>
                        <span className="font-medium">
                          {selectedMinerSummary.hashrate && selectedMinerSummary.hashrate.total && selectedMinerSummary.hashrate.total.length > 0
                            ? formatHashrate(selectedMinerSummary.hashrate.total[0] || 0)
                            : 'N/A'
                          }
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">Accepted Shares:</span>
                        <span className="font-medium">{selectedMinerSummary.results?.shares_good || 0}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">Mining Pool:</span>
                        <span className="font-medium">{selectedMinerSummary.connection?.pool || 'N/A'}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">Uptime:</span>
                        <span className="font-medium">
                          {selectedMinerSummary.uptime 
                            ? `${Math.floor(selectedMinerSummary.uptime / (60 * 60))}h ${Math.floor((selectedMinerSummary.uptime % (60 * 60)) / 60)}m`
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <div className="flex justify-between">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleStartMining(selectedMiner)}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Start Mining
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStopMining(selectedMiner)}
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Pause Mining
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedMinerConfig ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Pool:</span>
                          <span className="font-medium text-xs truncate max-w-[220px]">
                            {selectedMinerConfig.pools && selectedMinerConfig.pools[0]?.url || 'Not configured'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm">Wallet:</span>
                          <span className="font-medium text-xs truncate max-w-[220px]">
                            {selectedMinerConfig.pools && selectedMinerConfig.pools[0]?.user || 'Not configured'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm">CPU Mining:</span>
                          <span className="font-medium">
                            {selectedMinerConfig.cpu?.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm">GPU Mining:</span>
                          <span className="font-medium">
                            {(selectedMinerConfig.cuda?.enabled || selectedMinerConfig.opencl?.enabled) 
                              ? 'Enabled' 
                              : 'Disabled'
                            }
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm">Threads:</span>
                          <span className="font-medium">
                            {selectedMinerConfig.cpu?.["max-threads-hint"] || 'Auto'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Configuration data not available
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full"
                        disabled
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Configuration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Miner Dialog */}
      <Dialog open={addMinerDialogOpen} onOpenChange={setAddMinerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Mining Rig</DialogTitle>
            <DialogDescription>
              Add a new XMRig mining rig to your dashboard. Enter the URL and name below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="miner-url">XMRig API URL</Label>
              <Input
                id="miner-url"
                placeholder="http://192.168.1.100:18000"
                value={newMinerUrl}
                onChange={(e) => setNewMinerUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the full URL including port number where your XMRig API is accessible
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="miner-name">Rig Name</Label>
              <Input
                id="miner-name"
                placeholder="Main Desktop"
                value={newMinerName}
                onChange={(e) => setNewMinerName(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMinerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMiner}>
              Add Mining Rig
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}