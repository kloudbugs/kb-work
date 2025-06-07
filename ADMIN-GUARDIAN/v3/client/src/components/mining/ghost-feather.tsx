import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  Server, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowUpRight,
  Zap,
  Activity,
  Copy,
  Cloud,
  HardDrive
} from 'lucide-react';
import { 
  Progress 
} from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export const GhostFeatherPanel: React.FC = () => {
  const [virtualRigs, setVirtualRigs] = useState<string[]>([]);
  const [isActivated, setIsActivated] = useState(false);
  const [simHashrate, setSimHashrate] = useState(0);
  const [simPower, setSimPower] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [creatingRigs, setCreatingRigs] = useState(false);
  const [rigCreationProgress, setRigCreationProgress] = useState(0);
  
  const rigTypes = [
    { 
      name: "Standard Worker", 
      hashrate: 0.3, // TH/s
      power: 1200, // watts
      count: 60
    },
    { 
      name: "High Performance", 
      hashrate: 0.8, // TH/s
      power: 2800, // watts
      count: 30
    },
    { 
      name: "Enterprise Mining Server", 
      hashrate: 1.5, // TH/s
      power: 3500, // watts
      count: 10
    }
  ];
  
  const activateGhostFeather = () => {
    setShowDialog(true);
  };
  
  const confirmActivation = () => {
    setCreatingRigs(true);
    setRigCreationProgress(0);
    
    // Simulate rig creation with progress
    const totalRigs = 100;
    let rigsCreated = 0;
    const newRigs: string[] = [];
    let totalHashrate = 0;
    let totalPower = 0;
    
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 5) + 1; // Create 1-5 rigs at a time
      for (let i = 0; i < increment && rigsCreated < totalRigs; i++) {
        const rigTypeIndex = Math.floor(Math.random() * rigTypes.length);
        const rigType = rigTypes[rigTypeIndex];
        const rigId = `ghost-rig-${(rigsCreated + 1).toString().padStart(3, '0')}`;
        
        newRigs.push(rigId);
        totalHashrate += rigType.hashrate;
        totalPower += rigType.power;
        rigsCreated++;
      }
      
      const progress = Math.floor((rigsCreated / totalRigs) * 100);
      setRigCreationProgress(progress);
      
      if (rigsCreated >= totalRigs) {
        clearInterval(interval);
        setCreatingRigs(false);
        setVirtualRigs(newRigs);
        setSimHashrate(totalHashrate);
        setSimPower(totalPower);
        setIsActivated(true);
        setTimeout(() => setShowDialog(false), 1000);
      }
    }, 100);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="mr-2 h-5 w-5 text-purple-500" />
            Ghost Feather Virtual Mining
          </CardTitle>
          <CardDescription>
            Create virtual mining rigs for testing without actual hardware
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {!isActivated ? (
              <div className="flex items-center justify-between">
                <div className="max-w-lg">
                  <h3 className="text-lg font-medium mb-2">Virtual Mining Farm Simulator</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ghost Feather creates 100 virtual mining rigs that simulate real mining behavior, allowing you to test
                    the TERA Guardian system, pool management, and profitability features without actual hardware.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {rigTypes.map((type, index) => (
                      <Card key={index} className="bg-black/5 border-0">
                        <CardContent className="pt-4">
                          <h4 className="font-medium mb-1">{type.name}</h4>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div className="flex justify-between">
                              <span>Hashrate:</span>
                              <span className="font-medium">{type.hashrate} TH/s</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Power:</span>
                              <span className="font-medium">{type.power} W</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Count:</span>
                              <span className="font-medium">{type.count} rigs</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Button 
                    onClick={activateGhostFeather}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-6 py-6 h-auto"
                  >
                    <div className="flex flex-col items-center">
                      <Zap className="h-6 w-6 mb-2" />
                      <span className="text-lg font-medium">Activate</span>
                      <span className="text-xs mt-1">Ghost Feather</span>
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Ghost Feather Activated</h3>
                    <p className="text-sm text-muted-foreground">
                      Virtual mining farm with 100 rigs is now operational
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      setIsActivated(false);
                      setVirtualRigs([]);
                      setSimHashrate(0);
                      setSimPower(0);
                    }}
                  >
                    Deactivate Ghost Feather
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Total Hashrate</h3>
                        <Activity className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div className="text-3xl font-bold text-indigo-700 mb-1">
                        {simHashrate.toFixed(2)} <span className="text-lg">TH/s</span>
                      </div>
                      <div className="text-xs text-indigo-600">
                        Equivalent to {Math.floor(simHashrate / 0.1)} Antminer S9 units
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Active Rigs</h3>
                        <Server className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="text-3xl font-bold text-emerald-700 mb-1">
                        {virtualRigs.length}
                      </div>
                      <div className="text-xs text-emerald-600">
                        {Math.floor(virtualRigs.length * 0.97)} online • {virtualRigs.length - Math.floor(virtualRigs.length * 0.97)} offline
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Power Consumption</h3>
                        <Zap className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="text-3xl font-bold text-amber-700 mb-1">
                        {(simPower / 1000).toFixed(2)} <span className="text-lg">kW</span>
                      </div>
                      <div className="text-xs text-amber-600">
                        Estimated ${((simPower / 1000) * 24 * 0.12).toFixed(2)} daily electricity cost
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Farm Overview</TabsTrigger>
                    <TabsTrigger value="mining">Mining Data</TabsTrigger>
                    <TabsTrigger value="logs">System Logs</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="pt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-medium mb-4">Virtual Mining Farm Status</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Network Connection</span>
                              <span className="text-sm text-emerald-600 font-medium flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-1" /> Connected
                              </span>
                            </div>
                            <Progress value={98} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">System Health</span>
                              <span className="text-sm text-emerald-600 font-medium flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-1" /> Good
                              </span>
                            </div>
                            <Progress value={94} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Pool Efficiency</span>
                              <span className="text-sm text-amber-600 font-medium flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" /> Optimizing
                              </span>
                            </div>
                            <Progress value={87} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">TERA Guardian Status</span>
                              <span className="text-sm text-emerald-600 font-medium flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-1" /> Active
                              </span>
                            </div>
                            <Progress value={100} className="h-2" />
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="text-sm font-medium mb-3">Rig Distribution</h4>
                          <div className="flex items-center gap-4">
                            {rigTypes.map((type, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <div className="w-16 bg-black/5 rounded-md p-2 mb-2 flex items-center justify-center">
                                  <HardDrive className={`h-8 w-8 ${
                                    index === 0 ? "text-blue-500" :
                                    index === 1 ? "text-purple-500" : "text-indigo-500"
                                  }`} />
                                </div>
                                <div className="text-xs font-medium">{type.count}</div>
                                <div className="text-xs text-muted-foreground">{type.name.split(' ')[0]}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="mining" className="pt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-medium mb-4">Virtual Mining Statistics</h3>
                        
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Pool</TableHead>
                              <TableHead>Algorithm</TableHead>
                              <TableHead>Rigs</TableHead>
                              <TableHead>Hashrate</TableHead>
                              <TableHead>24h Earnings</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Unmineable</TableCell>
                              <TableCell>RandomX</TableCell>
                              <TableCell>{Math.floor(virtualRigs.length * 0.4)}</TableCell>
                              <TableCell>{(simHashrate * 0.4).toFixed(2)} TH/s</TableCell>
                              <TableCell>0.00012500 BTC</TableCell>
                              <TableCell className="text-emerald-600">Active</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">NiceHash</TableCell>
                              <TableCell>SHA-256</TableCell>
                              <TableCell>{Math.floor(virtualRigs.length * 0.35)}</TableCell>
                              <TableCell>{(simHashrate * 0.35).toFixed(2)} TH/s</TableCell>
                              <TableCell>0.00010800 BTC</TableCell>
                              <TableCell className="text-emerald-600">Active</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">F2Pool</TableCell>
                              <TableCell>SHA-256</TableCell>
                              <TableCell>{Math.floor(virtualRigs.length * 0.15)}</TableCell>
                              <TableCell>{(simHashrate * 0.15).toFixed(2)} TH/s</TableCell>
                              <TableCell>0.00005200 BTC</TableCell>
                              <TableCell className="text-emerald-600">Active</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Braiins Pool</TableCell>
                              <TableCell>SHA-256</TableCell>
                              <TableCell>{Math.floor(virtualRigs.length * 0.1)}</TableCell>
                              <TableCell>{(simHashrate * 0.1).toFixed(2)} TH/s</TableCell>
                              <TableCell>0.00003100 BTC</TableCell>
                              <TableCell className="text-amber-600">Optimizing</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        
                        <div className="mt-6 bg-black/5 p-4 rounded-md">
                          <h4 className="text-sm font-medium mb-2">Mining Simulation Notes</h4>
                          <ul className="text-xs space-y-1 text-muted-foreground">
                            <li>• Virtual rigs simulate real mining behavior including variations in hashrate and occasional disconnections</li>
                            <li>• Earnings are calculated based on current network difficulty and exchange rates</li>
                            <li>• TERA Guardian automatically optimizes rig distribution across pools for maximum profitability</li>
                            <li>• Test withdrawal and transaction features without real blockchain transactions</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="logs" className="pt-4">
                    <Card>
                      <CardContent className="pt-6 pb-6">
                        <h3 className="font-medium mb-4">System Logs</h3>
                        
                        <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-md h-64 overflow-y-auto">
                          <div className="space-y-1">
                            <div>[{new Date().toISOString()}] Ghost Feather system initialized</div>
                            <div>[{new Date(Date.now() - 1000).toISOString()}] Creating virtual mining environment</div>
                            <div>[{new Date(Date.now() - 2000).toISOString()}] Provisioning 100 virtual mining rigs</div>
                            <div>[{new Date(Date.now() - 3000).toISOString()}] Connecting to mining pools</div>
                            <div>[{new Date(Date.now() - 4000).toISOString()}] Established connection to Unmineable pool</div>
                            <div>[{new Date(Date.now() - 5000).toISOString()}] Established connection to NiceHash pool</div>
                            <div>[{new Date(Date.now() - 6000).toISOString()}] Established connection to F2Pool</div>
                            <div>[{new Date(Date.now() - 7000).toISOString()}] Established connection to Braiins Pool</div>
                            <div>[{new Date(Date.now() - 8000).toISOString()}] TERA Guardian AI system detecting optimal configuration</div>
                            <div>[{new Date(Date.now() - 9000).toISOString()}] Calculating expected earnings based on {simHashrate.toFixed(2)} TH/s total hashrate</div>
                            <div>[{new Date(Date.now() - 10000).toISOString()}] Setting up simulated wallet monitoring for bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6</div>
                            <div>[{new Date(Date.now() - 11000).toISOString()}] Ghost Feather virtual mining system active and operational</div>
                            <div>[{new Date(Date.now() - 12000).toISOString()}] Monitoring all virtual rigs for stability and performance</div>
                            <div>[{new Date(Date.now() - 13000).toISOString()}] Alert: ghost-rig-047 showing reduced performance, auto-restarting</div>
                            <div>[{new Date(Date.now() - 14000).toISOString()}] ghost-rig-047 successfully restarted, performance normalized</div>
                            <div>[{new Date(Date.now() - 15000).toISOString()}] Optimizing distribution across pools based on profitability analysis</div>
                            <div>[{new Date(Date.now() - 16000).toISOString()}] Auto-switching 5 rigs from Braiins Pool to Unmineable for better returns</div>
                            <div>[{new Date(Date.now() - 17000).toISOString()}] Simulated mining rewards for current session: 0.00031600 BTC</div>
                            <div>[{new Date(Date.now() - 18000).toISOString()}] Next virtual payout scheduled when threshold of 0.0005 BTC is reached</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ghost Feather Activation</DialogTitle>
            <DialogDescription>
              Create 100 virtual mining rigs for testing purposes
            </DialogDescription>
          </DialogHeader>
          
          {creatingRigs ? (
            <div className="py-6">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-medium mb-2">Creating Virtual Mining Rigs</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we provision your virtual mining farm
                </p>
              </div>
              
              <div className="space-y-4">
                <Progress value={rigCreationProgress} className="h-2" />
                <div className="text-xs text-center text-muted-foreground">
                  {rigCreationProgress}% complete • {Math.floor(rigCreationProgress * 0.01 * 100)} of 100 rigs provisioned
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="py-4">
                <p className="mb-4">
                  Ghost Feather will create 100 virtual mining rigs that simulate real mining operations.
                  This allows you to test the TERA Guardian system and all mining features without actual hardware.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-black/5 p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-1">Total Hashrate</h4>
                    <p className="text-lg font-bold">~45 TH/s</p>
                  </div>
                  
                  <div className="bg-black/5 p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-1">Est. Daily Earnings</h4>
                    <p className="text-lg font-bold">~0.0003 BTC</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-3 rounded-md border border-amber-100 text-amber-800 text-sm">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0" />
                    <span>
                      This creates simulated mining activity only. No actual mining or blockchain transactions will occur.
                    </span>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="sm:justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmActivation}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  Activate Ghost Feather
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};