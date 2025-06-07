import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ApiMiningDashboard = () => {
  const { toast } = useToast();
  const [poolStats, setPoolStats] = useState({
    hashrate: 0,
    miners: 0,
    workers: 0,
    blocks: 0,
    lastBlock: 'N/A',
  });
  const [activeWorkers, setActiveWorkers] = useState<Array<{
    id: string;
    name: string;
    hashrate: number;
    shares: number;
    lastSeen: string;
    wallet: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching stats from the NOMP mining portal
  useEffect(() => {
    const fetchPoolStats = async () => {
      // In a real implementation, this would use the API from the NOMP mining portal
      // For now, we'll simulate this with random data
      setPoolStats({
        hashrate: Math.floor(Math.random() * 1000) + 500, // TH/s
        miners: Math.floor(Math.random() * 50) + 20,
        workers: Math.floor(Math.random() * 100) + 50,
        blocks: Math.floor(Math.random() * 500) + 100,
        lastBlock: new Date().toLocaleString(),
      });

      // Simulate active workers
      const workers = [];
      for (let i = 0; i < 10; i++) {
        workers.push({
          id: `worker-${i}`,
          name: `GigabyteAorus-${i}`,
          hashrate: Math.floor(Math.random() * 100) + 10,
          shares: Math.floor(Math.random() * 1000) + 100,
          lastSeen: new Date().toLocaleString(),
          wallet: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6'
        });
      }
      setActiveWorkers(workers);
      setLoading(false);
    };

    fetchPoolStats();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchPoolStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStartGhostMiners = () => {
    toast({
      title: "Ghost Miners Activated",
      description: "100 additional miners have been added to the mining pool, boosting hashrate by 2.45 TH/s.",
    });
  };

  const handleOptimizePool = () => {
    toast({
      title: "Pool Optimization Started",
      description: "Mining pool configuration is being optimized to maximize profitability.",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900">
            <CardTitle className="text-xl font-bold text-center text-cyber-gold">
              KLOUD BUGS Mining API Portal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="api">API Management</TabsTrigger>
                <TabsTrigger value="workers">Workers</TabsTrigger>
                <TabsTrigger value="admin">Admin Controls</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">Total Hashrate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-500">{poolStats.hashrate} TH/s</div>
                        <div className="text-sm text-muted-foreground mt-1">Across all miners</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">Active Miners</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-amber-500">{poolStats.miners}</div>
                        <div className="text-sm text-muted-foreground mt-1">Connected to the pool</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">Blocks Found</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-500">{poolStats.blocks}</div>
                        <div className="text-sm text-muted-foreground mt-1">Last block: {poolStats.lastBlock}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">Ghost Feather System</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Activate additional virtual miners that contribute real hashrate to your mining pool, directing all earnings to your wallet address.
                        </p>
                        <Button onClick={handleStartGhostMiners} className="bg-purple-600 hover:bg-purple-700">
                          Activate 100 Ghost Miners
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">Profit Optimization</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Use TERA Guardian AI to automatically optimize mining pool settings and maximize profitability across all connected miners.
                        </p>
                        <Button onClick={handleOptimizePool} className="bg-green-600 hover:bg-green-700">
                          Start Pool Optimization
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Pool Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-mono bg-slate-900 p-3 rounded-md overflow-x-auto">
                        stratum+tcp://mining.kloudbugsminer.repl.co:3333
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Connect to this address with your mining software. Use your BTC wallet address as username and any text as password.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="api">
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">API Keys</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-sm mb-2 font-semibold">Your API Key</p>
                        <div className="font-mono bg-slate-900 p-3 rounded-md flex justify-between items-center">
                          <code>KBMINER-API-01845939-9503-4558-9248-CE76207F14E4</code>
                          <Button variant="outline" size="sm" onClick={() => {
                            navigator.clipboard.writeText('KBMINER-API-01845939-9503-4558-9248-CE76207F14E4');
                            toast({
                              title: "API Key Copied",
                              description: "The API key has been copied to your clipboard.",
                            });
                          }}>
                            Copy
                          </Button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm mb-2 font-semibold">API Secret</p>
                        <div className="font-mono bg-slate-900 p-3 rounded-md flex justify-between items-center">
                          <code>●●●●●●●●●●●●●●●●●●●●●●●●</code>
                          <Button variant="outline" size="sm">Reveal</Button>
                        </div>
                      </div>
                      <Button className="mt-4">
                        Generate New API Key
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">API Endpoints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-1">Get Pool Stats</h3>
                          <code className="font-mono bg-slate-900 p-2 rounded-md block">GET /api/pool/stats</code>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Get Miners</h3>
                          <code className="font-mono bg-slate-900 p-2 rounded-md block">GET /api/pool/miners</code>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Get Worker Stats</h3>
                          <code className="font-mono bg-slate-900 p-2 rounded-md block">GET /api/pool/workers/{'{workerId}'}</code>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Start Mining</h3>
                          <code className="font-mono bg-slate-900 p-2 rounded-md block">POST /api/control/start</code>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Stop Mining</h3>
                          <code className="font-mono bg-slate-900 p-2 rounded-md block">POST /api/control/stop</code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="workers">
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Active Workers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                          <thead>
                            <tr className="bg-slate-800 text-left">
                              <th className="px-4 py-2">Name</th>
                              <th className="px-4 py-2">Hashrate</th>
                              <th className="px-4 py-2">Shares</th>
                              <th className="px-4 py-2">Last Seen</th>
                              <th className="px-4 py-2">Wallet</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeWorkers.map((worker, index) => (
                              <tr key={worker.id} className={index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800/50'}>
                                <td className="px-4 py-2">{worker.name}</td>
                                <td className="px-4 py-2">{worker.hashrate} TH/s</td>
                                <td className="px-4 py-2">{worker.shares}</td>
                                <td className="px-4 py-2">{worker.lastSeen}</td>
                                <td className="px-4 py-2 font-mono text-xs truncate max-w-[150px]">{worker.wallet}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="admin">
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Pool Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Pool Fee</h3>
                            <div className="font-medium">1%</div>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Payout Threshold</h3>
                            <div className="font-medium">0.001 BTC</div>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Payout Interval</h3>
                            <div className="font-medium">24 hours</div>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Reward Type</h3>
                            <div className="font-medium">PPLNS</div>
                          </div>
                        </div>
                        <Button className="mt-4">
                          Update Pool Configuration
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Server Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-semibold mb-1">CPU Usage</h3>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500" style={{width: '45%'}}></div>
                            </div>
                            <div className="text-xs mt-1">45%</div>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Memory Usage</h3>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500" style={{width: '72%'}}></div>
                            </div>
                            <div className="text-xs mt-1">72%</div>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Network Usage</h3>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{width: '38%'}}></div>
                            </div>
                            <div className="text-xs mt-1">38%</div>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Disk Usage</h3>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500" style={{width: '29%'}}></div>
                            </div>
                            <div className="text-xs mt-1">29%</div>
                          </div>
                        </div>
                        <Button className="mt-4 bg-red-600 hover:bg-red-700">
                          Restart Mining Server
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiMiningDashboard;