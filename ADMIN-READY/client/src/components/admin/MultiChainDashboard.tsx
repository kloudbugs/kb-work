import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Bitcoin, 
  Waves, 
  Banknote, 
  HardDrive, 
  Gem,
  ArrowRightLeft, 
  TrendingUp, 
  BadgeDollarSign,
  Settings,
  Zap,
  PlusCircle,
  Trash,
  Upload,
  Download
} from 'lucide-react';

// Available blockchain types
type BlockchainType = 'bitcoin' | 'ethereum' | 'solana' | 'cardano' | 'polkadot' | 'custom';

// Chain configuration
interface ChainConfig {
  id: string;
  type: BlockchainType;
  name: string;
  symbol: string;
  icon: React.ReactNode;
  color: string;
  enabled: boolean;
  rewardConversion: number; // Multiplier for base mining rewards to this chain
  customRPC?: string; // For custom chains
  notes?: string;
}

// Integration settings
interface IntegrationSettings {
  autoConvert: boolean;
  defaultChain: string;
  minThreshold: number;
  gasStrategy: 'economic' | 'balanced' | 'fast';
  notifyOnConversion: boolean;
}

export function MultiChainDashboard() {
  const { toast } = useToast();
  const [chainConfigs, setChainConfigs] = useState<ChainConfig[]>([
    {
      id: 'bitcoin',
      type: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: <Bitcoin className="h-5 w-5" />,
      color: '#F7931A',
      enabled: true,
      rewardConversion: 1.0
    },
    {
      id: 'ethereum',
      type: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: <Gem className="h-5 w-5" />,
      color: '#627EEA',
      enabled: false,
      rewardConversion: 15.8
    },
    {
      id: 'solana',
      type: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      icon: <Zap className="h-5 w-5" />,
      color: '#14F195',
      enabled: false,
      rewardConversion: 320.5
    }
  ]);
  
  // Integration settings state
  const [settings, setSettings] = useState<IntegrationSettings>({
    autoConvert: false,
    defaultChain: 'bitcoin',
    minThreshold: 0.001,
    gasStrategy: 'balanced',
    notifyOnConversion: true
  });
  
  // UI states
  const [isAddingChain, setIsAddingChain] = useState(false);
  const [newChain, setNewChain] = useState<Partial<ChainConfig>>({
    type: 'custom',
    name: '',
    symbol: '',
    color: '#3B82F6',
    enabled: true,
    rewardConversion: 1.0
  });
  
  // Handle chain toggle
  const toggleChain = (chainId: string) => {
    setChainConfigs(prevConfigs => 
      prevConfigs.map(chain => 
        chain.id === chainId 
          ? { ...chain, enabled: !chain.enabled } 
          : chain
      )
    );
  };
  
  // Handle reward conversion change
  const updateRewardConversion = (chainId: string, value: number) => {
    setChainConfigs(prevConfigs => 
      prevConfigs.map(chain => 
        chain.id === chainId 
          ? { ...chain, rewardConversion: value } 
          : chain
      )
    );
  };
  
  // Handle chain deletion
  const deleteChain = (chainId: string) => {
    setChainConfigs(prevConfigs => prevConfigs.filter(chain => chain.id !== chainId));
    
    toast({
      title: "Chain Removed",
      description: "The blockchain configuration has been removed.",
      duration: 3000
    });
  };
  
  // Add new chain
  const addNewChain = () => {
    if (!newChain.name || !newChain.symbol) {
      toast({
        title: "Validation Error",
        description: "Chain name and symbol are required.",
        variant: "destructive",
        duration: 3000
      });
      return;
    }
    
    const chainId = newChain.name?.toLowerCase().replace(/\s+/g, '-') || 'custom-chain';
    
    const chainConfig: ChainConfig = {
      id: chainId,
      type: newChain.type as BlockchainType || 'custom',
      name: newChain.name || 'Custom Chain',
      symbol: newChain.symbol || 'CUSTOM',
      icon: <Settings className="h-5 w-5" />,
      color: newChain.color || '#3B82F6',
      enabled: newChain.enabled || true,
      rewardConversion: newChain.rewardConversion || 1.0,
      customRPC: newChain.type === 'custom' ? newChain.customRPC : undefined,
      notes: newChain.notes
    };
    
    setChainConfigs(prevConfigs => [...prevConfigs, chainConfig]);
    setIsAddingChain(false);
    setNewChain({
      type: 'custom',
      name: '',
      symbol: '',
      color: '#3B82F6',
      enabled: true,
      rewardConversion: 1.0
    });
    
    toast({
      title: "Chain Added",
      description: `${chainConfig.name} has been added to your configuration.`,
      duration: 3000
    });
  };
  
  // Update settings
  const updateSettings = (key: keyof IntegrationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  // Save all configurations
  const saveConfigurations = async () => {
    try {
      await apiRequest('/api/admin/chain-config', {
        method: 'POST',
        data: {
          chains: chainConfigs,
          settings: settings
        }
      });
      
      toast({
        title: "Configuration Saved",
        description: "Multi-chain settings have been updated successfully.",
        duration: 3000
      });
    } catch (error) {
      console.error('Failed to save chain configurations:', error);
      toast({
        title: "Save Failed",
        description: "Could not save your changes. Please try again.",
        variant: "destructive",
        duration: 5000
      });
    }
  };
  
  // Get chain icon
  const getChainIcon = (type: BlockchainType) => {
    switch (type) {
      case 'bitcoin': return <Bitcoin className="h-5 w-5" />;
      case 'ethereum': return <Gem className="h-5 w-5" />;
      case 'solana': return <Zap className="h-5 w-5" />;
      case 'cardano': return <HardDrive className="h-5 w-5" />;
      case 'polkadot': return <Waves className="h-5 w-5" />;
      default: return <Banknote className="h-5 w-5" />;
    }
  };
  
  return (
    <Card className="w-full shadow-md border-0 bg-gradient-to-br from-slate-900 to-slate-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <ArrowRightLeft className="h-6 w-6 text-blue-400" />
              Multi-Chain Mining Rewards
            </CardTitle>
            <CardDescription className="text-gray-400">
              Configure how mining rewards can be distributed across different blockchains
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              {chainConfigs.filter(c => c.enabled).length} Active Chains
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAddingChain(true)}
              className="border-green-500 text-green-400 hover:bg-green-500/20"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Chain
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="chains">
          <TabsList className="w-full mb-4 bg-slate-950">
            <TabsTrigger value="chains" className="flex-1 data-[state=active]:text-blue-400">
              <Bitcoin className="h-4 w-4 mr-2" /> Blockchain Configs
            </TabsTrigger>
            <TabsTrigger value="conversion" className="flex-1 data-[state=active]:text-blue-400">
              <ArrowRightLeft className="h-4 w-4 mr-2" /> Conversion Settings
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1 data-[state=active]:text-blue-400">
              <TrendingUp className="h-4 w-4 mr-2" /> Reward Simulation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chains" className="space-y-4">
            {isAddingChain ? (
              <Card className="bg-slate-850 border border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Add New Blockchain</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chain-type">Blockchain Type</Label>
                      <Select 
                        value={newChain.type} 
                        onValueChange={(value) => setNewChain({...newChain, type: value as BlockchainType})}
                      >
                        <SelectTrigger id="chain-type" className="bg-slate-900 border-slate-700">
                          <SelectValue placeholder="Select blockchain type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="bitcoin">Bitcoin</SelectItem>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                          <SelectItem value="solana">Solana</SelectItem>
                          <SelectItem value="cardano">Cardano</SelectItem>
                          <SelectItem value="polkadot">Polkadot</SelectItem>
                          <SelectItem value="custom">Custom Chain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chain-name">Chain Name</Label>
                      <Input 
                        id="chain-name" 
                        value={newChain.name} 
                        onChange={(e) => setNewChain({...newChain, name: e.target.value})}
                        placeholder="e.g. Solana"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chain-symbol">Token Symbol</Label>
                      <Input 
                        id="chain-symbol" 
                        value={newChain.symbol} 
                        onChange={(e) => setNewChain({...newChain, symbol: e.target.value})}
                        placeholder="e.g. SOL"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chain-color">Chain Color</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="chain-color" 
                          type="color"
                          value={newChain.color} 
                          onChange={(e) => setNewChain({...newChain, color: e.target.value})}
                          className="w-12 h-10 p-1 bg-slate-900 border-slate-700"
                        />
                        <Input 
                          value={newChain.color} 
                          onChange={(e) => setNewChain({...newChain, color: e.target.value})}
                          className="flex-1 bg-slate-900 border-slate-700"
                        />
                      </div>
                    </div>
                    
                    {newChain.type === 'custom' && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="chain-rpc">RPC Endpoint URL</Label>
                        <Input 
                          id="chain-rpc" 
                          value={newChain.customRPC} 
                          onChange={(e) => setNewChain({...newChain, customRPC: e.target.value})}
                          placeholder="https://example.com/rpc"
                          className="bg-slate-900 border-slate-700"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="chain-conversion">Reward Conversion Rate (Base mining reward × rate)</Label>
                      <div className="flex items-center space-x-4">
                        <Slider
                          id="chain-conversion"
                          value={[newChain.rewardConversion || 1.0]}
                          min={0.01}
                          max={1000}
                          step={0.01}
                          onValueChange={(values) => setNewChain({...newChain, rewardConversion: values[0]})}
                          className="flex-1"
                        />
                        <Input 
                          type="number"
                          value={newChain.rewardConversion} 
                          onChange={(e) => setNewChain({...newChain, rewardConversion: parseFloat(e.target.value) || 1.0})}
                          className="w-24 bg-slate-900 border-slate-700"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="chain-notes">Notes (Optional)</Label>
                      <Input 
                        id="chain-notes" 
                        value={newChain.notes} 
                        onChange={(e) => setNewChain({...newChain, notes: e.target.value})}
                        placeholder="Any additional notes about this chain configuration"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-700 pt-4 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingChain(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={addNewChain}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add Chain
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {chainConfigs.map((chain) => (
                  <Card 
                    key={chain.id} 
                    className={`bg-slate-850 border ${chain.enabled ? 'border-' + chain.color.replace('#', '') + '/30' : 'border-slate-700'}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="p-2 rounded-full" 
                            style={{ backgroundColor: chain.enabled ? `${chain.color}20` : 'transparent' }}
                          >
                            <div 
                              className="text-white"
                              style={{ color: chain.enabled ? chain.color : '#6B7280' }}
                            >
                              {chain.icon}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium text-white">{chain.name}</h3>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-gray-400">{chain.symbol}</span>
                              {chain.type === 'custom' && (
                                <Badge variant="outline" className="text-xs py-0 h-5 text-gray-400 border-gray-600">
                                  Custom
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-4 md:mt-0">
                          <div className="flex-1 md:w-64">
                            <div className="flex justify-between items-center mb-1 text-xs">
                              <span className="text-gray-400">Conversion Rate</span>
                              <span className="font-medium text-white">×{chain.rewardConversion.toFixed(2)}</span>
                            </div>
                            <div className="relative h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="absolute top-0 left-0 h-full rounded-full"
                                style={{ 
                                  width: `${Math.min(100, (chain.rewardConversion / 10) * 100)}%`,
                                  backgroundColor: chain.enabled ? chain.color : '#6B7280'
                                }}
                              />
                            </div>
                          </div>
                          
                          <Switch 
                            checked={chain.enabled}
                            onCheckedChange={() => toggleChain(chain.id)}
                            className={chain.enabled 
                              ? `bg-[${chain.color}] data-[state=checked]:bg-[${chain.color}]` 
                              : ''
                            }
                          />
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteChain(chain.id)}
                            className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {!isAddingChain && chainConfigs.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Banknote className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-medium text-white mb-1">No Blockchains Configured</h3>
                <p className="text-gray-500 mb-4">Add a blockchain to start configuring multi-chain rewards</p>
                <Button 
                  onClick={() => setIsAddingChain(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add First Chain
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="conversion" className="space-y-4">
            <Card className="bg-slate-850 border border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Conversion Settings</CardTitle>
                <CardDescription>Configure how mining rewards are converted between chains</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Automatic Conversion</Label>
                    <p className="text-xs text-gray-400">Automatically convert rewards to user's preferred chain</p>
                  </div>
                  <Switch 
                    checked={settings.autoConvert}
                    onCheckedChange={(checked) => updateSettings('autoConvert', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-chain">Default Chain</Label>
                  <Select 
                    value={settings.defaultChain} 
                    onValueChange={(value) => updateSettings('defaultChain', value)}
                    disabled={!settings.autoConvert}
                  >
                    <SelectTrigger id="default-chain" className="bg-slate-900 border-slate-700">
                      <SelectValue placeholder="Select default chain" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {chainConfigs.map(chain => (
                        <SelectItem key={chain.id} value={chain.id}>
                          <div className="flex items-center">
                            <div className="mr-2 text-white" style={{ color: chain.color }}>
                              {chain.icon}
                            </div>
                            {chain.name} ({chain.symbol})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min-threshold">Minimum Conversion Threshold</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="min-threshold" 
                      type="number"
                      value={settings.minThreshold} 
                      onChange={(e) => updateSettings('minThreshold', parseFloat(e.target.value) || 0)}
                      className="bg-slate-900 border-slate-700"
                      disabled={!settings.autoConvert}
                    />
                    <span className="text-gray-400">BTC</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Minimum amount required before conversion is triggered
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gas-strategy">Gas Strategy</Label>
                  <Select 
                    value={settings.gasStrategy} 
                    onValueChange={(value: 'economic' | 'balanced' | 'fast') => updateSettings('gasStrategy', value)}
                    disabled={!settings.autoConvert}
                  >
                    <SelectTrigger id="gas-strategy" className="bg-slate-900 border-slate-700">
                      <SelectValue placeholder="Select gas strategy" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="economic">Economic (Lowest fee)</SelectItem>
                      <SelectItem value="balanced">Balanced (Moderate fee)</SelectItem>
                      <SelectItem value="fast">Fast (Higher fee)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Determines transaction fee strategy for cross-chain transactions
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Conversion Notifications</Label>
                    <p className="text-xs text-gray-400">Notify users when conversions are processed</p>
                  </div>
                  <Switch 
                    checked={settings.notifyOnConversion}
                    onCheckedChange={(checked) => updateSettings('notifyOnConversion', checked)}
                    disabled={!settings.autoConvert}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-850 border border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Exchange Rate Providers</CardTitle>
                <CardDescription>Configure which services provide exchange rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-md">
                    <div className="flex items-center">
                      <BadgeDollarSign className="h-5 w-5 text-amber-400 mr-3" />
                      <div>
                        <div className="font-medium text-white">CoinGecko</div>
                        <div className="text-xs text-gray-400">Default exchange rate provider</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-md">
                    <div className="flex items-center">
                      <BadgeDollarSign className="h-5 w-5 text-blue-400 mr-3" />
                      <div>
                        <div className="font-medium text-white">CoinMarketCap</div>
                        <div className="text-xs text-gray-400">Secondary exchange rate provider</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30">
                      Disabled
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-md">
                    <div className="flex items-center">
                      <BadgeDollarSign className="h-5 w-5 text-purple-400 mr-3" />
                      <div>
                        <div className="font-medium text-white">Binance Exchange</div>
                        <div className="text-xs text-gray-400">Real-time exchange rate provider</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30">
                      Disabled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            <Card className="bg-slate-850 border border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Reward Conversion Simulation</CardTitle>
                <CardDescription>See how mining rewards would be distributed across chains</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-slate-900 rounded-lg">
                  <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-medium text-white mb-1">Base Mining Reward</h3>
                      <div className="flex items-center">
                        <Bitcoin className="h-5 w-5 text-amber-400 mr-2" />
                        <span className="text-2xl font-bold text-white">0.00125000 BTC</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Daily estimated reward</p>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button 
                        variant="outline" 
                        className="bg-slate-800 border-slate-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button 
                        variant="outline" 
                        className="bg-slate-800 border-slate-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {chainConfigs.filter(c => c.enabled).map(chain => (
                      <div key={chain.id} className="p-4 bg-slate-850 rounded-lg border border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div 
                              className="p-2 rounded-full mr-3" 
                              style={{ backgroundColor: `${chain.color}20` }}
                            >
                              <div 
                                className="text-white"
                                style={{ color: chain.color }}
                              >
                                {chain.icon}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{chain.name}</h4>
                              <div className="text-sm text-gray-400">Conversion Rate: ×{chain.rewardConversion.toFixed(2)}</div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">
                              {(0.00125 * chain.rewardConversion).toFixed(8)} {chain.symbol}
                            </div>
                            <div className="text-sm text-gray-400">
                              ≈ ${(0.00125 * chain.rewardConversion * (chain.id === 'bitcoin' ? 60000 : chain.id === 'ethereum' ? 3800 : 100)).toFixed(2)} USD
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="relative h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="absolute top-0 left-0 h-full rounded-full"
                              style={{ 
                                width: '100%',
                                backgroundColor: chain.color
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {chainConfigs.filter(c => c.enabled).length === 0 && (
                      <div className="text-center py-6 text-gray-400">
                        <ArrowRightLeft className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>Enable at least one blockchain to see conversion simulation</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-850 border border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">User Interface Preview</CardTitle>
                <CardDescription>How users will see the multi-chain options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <h3 className="text-md font-medium text-white mb-3">Mining Rewards Destination</h3>
                  
                  <div className="space-y-3">
                    {chainConfigs.filter(c => c.enabled).map(chain => (
                      <div 
                        key={chain.id} 
                        className="flex items-center justify-between p-3 rounded-md border-2 border-transparent hover:bg-slate-800 cursor-pointer transition-colors"
                        style={{ borderColor: chain.id === settings.defaultChain ? chain.color : 'transparent' }}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="p-1.5 rounded-full" 
                            style={{ backgroundColor: `${chain.color}20` }}
                          >
                            <div 
                              className="text-white"
                              style={{ color: chain.color }}
                            >
                              {chain.icon}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-white">{chain.name}</div>
                            <div className="text-xs text-gray-400">Receive as {chain.symbol}</div>
                          </div>
                        </div>
                        
                        {chain.id === settings.defaultChain && (
                          <Badge className="bg-blue-500">Default</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 italic">
                      This is a preview of how users will be able to select their preferred blockchain
                      for receiving mining rewards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t border-slate-700 pt-4 flex justify-between">
        <p className="text-sm text-gray-500">
          {chainConfigs.filter(c => c.enabled).length} of {chainConfigs.length} chains enabled
        </p>
        <Button 
          onClick={saveConfigurations}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Save Multi-Chain Configuration
        </Button>
      </CardFooter>
    </Card>
  );
}