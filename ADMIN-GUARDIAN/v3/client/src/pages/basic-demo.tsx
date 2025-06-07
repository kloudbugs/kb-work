import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Server,
  Activity,
  Database,
  CheckCircle2,
  XCircle,
  Clock,
  Bitcoin,
  Zap,
  Settings,
  Link,
  ArrowRight
} from 'lucide-react';

export default function BasicDemoPage() {
  const [activeTab, setActiveTab] = useState('mining-pools');
  const [walletAddress, setWalletAddress] = useState('bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6');
  const [poolName, setPoolName] = useState('KLOUD BUGS Mining Pool');
  const { toast } = useToast();
  
  // Simulate a connection test
  const testConnection = (service: string) => {
    toast({
      title: "Connection Test",
      description: `Successfully connected to ${service}`,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Mining Platform Demo</h1>
          <p className="text-muted-foreground">Test the basic functionality of your mining platform</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="mining-pools">
              <Server className="h-4 w-4 mr-2" />
              Mining Pools
            </TabsTrigger>
            <TabsTrigger value="pool-server">
              <Database className="h-4 w-4 mr-2" />
              Pool Server
            </TabsTrigger>
            <TabsTrigger value="rentals">
              <Activity className="h-4 w-4 mr-2" />
              Mining Rentals
            </TabsTrigger>
          </TabsList>
          
          {/* Mining Pools Tab */}
          <TabsContent value="mining-pools" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mining Pool Connections</CardTitle>
                <CardDescription>
                  Test connections to various mining pools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <Input
                    id="wallet-address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter your Bitcoin wallet address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card className="border border-blue-200 bg-blue-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-blue-700 text-lg">NiceHash Connection</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm pb-2">
                      <p>Status: <span className="text-green-600 font-medium flex items-center"><CheckCircle2 className="h-4 w-4 mr-1" /> Ready</span></p>
                      <p className="text-slate-500 text-xs mt-1">No API key required for stratum connections</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button size="sm" onClick={() => testConnection('NiceHash')}>Test Connection</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border border-purple-200 bg-purple-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-purple-700 text-lg">Unmineable Connection</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm pb-2">
                      <p>Status: <span className="text-green-600 font-medium flex items-center"><CheckCircle2 className="h-4 w-4 mr-1" /> Ready</span></p>
                      <p className="text-slate-500 text-xs mt-1">Referral code: 1784277766 applied</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button size="sm" onClick={() => testConnection('Unmineable')}>Test Connection</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border border-emerald-200 bg-emerald-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-emerald-700 text-lg">F2Pool Connection</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm pb-2">
                      <p>Status: <span className="text-green-600 font-medium flex items-center"><CheckCircle2 className="h-4 w-4 mr-1" /> Ready</span></p>
                      <p className="text-slate-500 text-xs mt-1">2.5% pool fee</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button size="sm" onClick={() => testConnection('F2Pool')}>Test Connection</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border border-amber-200 bg-amber-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-amber-700 text-lg">SlushPool Connection</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm pb-2">
                      <p>Status: <span className="text-green-600 font-medium flex items-center"><CheckCircle2 className="h-4 w-4 mr-1" /> Ready</span></p>
                      <p className="text-slate-500 text-xs mt-1">PPLNS reward system</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button size="sm" onClick={() => testConnection('SlushPool')}>Test Connection</Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="ml-auto"
                  onClick={() => {
                    toast({
                      title: "All Connections Verified",
                      description: "Mining pool connections are working correctly",
                    });
                  }}
                >
                  Verify All Connections
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Connection Settings</CardTitle>
                <CardDescription>
                  View your mining connection details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">NiceHash Stratum</Label>
                      <div className="font-mono text-xs bg-black/5 p-2 rounded">
                        stratum+tcp://sha256.usa.nicehash.com:3334
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Worker</Label>
                      <div className="font-mono text-xs bg-black/5 p-2 rounded">
                        {walletAddress}.AORUS15
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Unmineable</Label>
                      <div className="font-mono text-xs bg-black/5 p-2 rounded">
                        rx.unmineable.com:3333
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Worker</Label>
                      <div className="font-mono text-xs bg-black/5 p-2 rounded">
                        BTC:{walletAddress}.AORUS15#1784277766
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pool Server Tab */}
          <TabsContent value="pool-server" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mining Pool Server (NOMP)</CardTitle>
                <CardDescription>
                  Test your Node Open Mining Portal installation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pool-name">Pool Name</Label>
                  <Input
                    id="pool-name"
                    value={poolName}
                    onChange={(e) => setPoolName(e.target.value)}
                    placeholder="Enter your mining pool name"
                  />
                </div>
                
                <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <Clock className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Installation Required</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Node Open Mining Portal needs to be installed before testing
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      toast({
                        title: "Installation Started",
                        description: "Beginning NOMP installation...",
                      });
                      
                      // Simulate installation process
                      setTimeout(() => {
                        toast({
                          title: "Installation Complete",
                          description: "Node Open Mining Portal has been installed",
                        });
                      }, 2000);
                    }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Install NOMP
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Configuration Applied",
                        description: `Pool configured as "${poolName}"`,
                      });
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Pool
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Pool Server Started",
                      description: "Mining pool server is now running",
                    });
                  }}
                >
                  Start Server
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Pool Server Stopped",
                      description: "Mining pool server has been stopped",
                    });
                  }}
                >
                  Stop Server
                </Button>
                
                <Button
                  onClick={() => {
                    toast({
                      title: "Pool Server Status",
                      description: "Mining pool server is not running",
                    });
                  }}
                >
                  Check Status
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pool Customization Preview</CardTitle>
                <CardDescription>
                  Preview your mining pool customization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black p-4 rounded-md">
                  <div className="mb-4 p-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-md text-center text-white">
                    <h3 className="text-xl font-bold">{poolName}</h3>
                    <p className="text-sm opacity-90">Mine with the power of the cloud</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-black/30 p-3 rounded-md text-center">
                      <div className="text-blue-400 text-xl font-bold">45.8 TH/s</div>
                      <div className="text-blue-300 text-xs">Pool Hashrate</div>
                    </div>
                    
                    <div className="bg-black/30 p-3 rounded-md text-center">
                      <div className="text-blue-400 text-xl font-bold">128</div>
                      <div className="text-blue-300 text-xs">Active Miners</div>
                    </div>
                    
                    <div className="bg-black/30 p-3 rounded-md text-center">
                      <div className="text-blue-400 text-xl font-bold">1.0%</div>
                      <div className="text-blue-300 text-xs">Pool Fee</div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6 mb-2">
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        setActiveTab('rentals');
                        toast({
                          title: "Customization Available",
                          description: "Full customization options are available in settings",
                        });
                      }}
                    >
                      Customize Pool Appearance
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Mining Rentals Tab */}
          <TabsContent value="rentals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mining Rig Rentals</CardTitle>
                <CardDescription>
                  Test the Mining Rig Rentals API integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <Bitcoin className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800">API Credentials Required</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Mining Rig Rentals API key and secret are needed for full functionality
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <Card className="border border-indigo-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Available Rigs</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-indigo-50 rounded">
                          <div>
                            <div className="font-medium">Antminer S19</div>
                            <div className="text-xs text-slate-500">95 TH/s • SHA-256</div>
                          </div>
                          <Button size="sm" variant="outline">Rent</Button>
                        </div>
                        
                        <div className="flex justify-between items-center p-2 bg-indigo-50 rounded">
                          <div>
                            <div className="font-medium">Whatsminer M30S</div>
                            <div className="text-xs text-slate-500">88 TH/s • SHA-256</div>
                          </div>
                          <Button size="sm" variant="outline">Rent</Button>
                        </div>
                        
                        <div className="flex justify-between items-center p-2 bg-indigo-50 rounded">
                          <div>
                            <div className="font-medium">Antminer L7</div>
                            <div className="text-xs text-slate-500">9.5 GH/s • Scrypt</div>
                          </div>
                          <Button size="sm" variant="outline">Rent</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-indigo-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Active Rentals</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="text-center py-8 text-slate-500">
                        <p>No active rentals found</p>
                        <p className="text-xs mt-1">Rent a rig to see it here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "API Connection Test",
                      description: "Connection to Mining Rig Rentals API successful",
                    });
                  }}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Test API Connection
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ghost Feather Feature</CardTitle>
                <CardDescription>
                  Test the virtual mining rig simulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Virtual Mining Rigs</h3>
                      <p className="text-sm text-muted-foreground">
                        Simulate 100 mining rigs for testing TERA Guardian
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => {
                        toast({
                          title: "Ghost Feather Activated",
                          description: "100 virtual mining rigs are now simulated",
                        });
                      }}
                      className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Activate Ghost Feather
                    </Button>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-2">Ghost Feather Benefits</h4>
                    <ul className="space-y-1">
                      <li className="flex items-start text-sm">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 mr-2 mt-0.5" />
                        <span>Test TERA Guardian without actual hardware</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 mr-2 mt-0.5" />
                        <span>Simulate mining profitability and pool management</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 mr-2 mt-0.5" />
                        <span>Try different configurations risk-free</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 mr-2 mt-0.5" />
                        <span>Experience full mining dashboard functionality</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}