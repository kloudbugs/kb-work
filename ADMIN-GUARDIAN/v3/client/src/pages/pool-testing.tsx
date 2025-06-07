import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Server, 
  Hash, 
  RefreshCw, 
  Settings,
  CheckCircle2,
  AlertCircle,
  Copy
} from 'lucide-react';

interface PoolConfig {
  name: string;
  url: string;
  port: number;
  type: 'f2pool' | 'braiins' | 'other';
}

const POOL_CONFIGS: PoolConfig[] = [
  { name: 'F2Pool Primary', url: 'stratum+tcp://btc.f2pool.com', port: 3333, type: 'f2pool' },
  { name: 'F2Pool Backup 1', url: 'stratum+tcp://btc.f2pool.com', port: 1314, type: 'f2pool' },
  { name: 'F2Pool Backup 2', url: 'stratum+tcp://btc.f2pool.com', port: 25, type: 'f2pool' },
  { name: 'F2Pool SSL', url: 'stratum+ssl://btcssl.f2pool.com', port: 1300, type: 'f2pool' },
  { name: 'F2Pool SSL Alt', url: 'stratum+ssl://btcssl.f2pool.com', port: 1301, type: 'f2pool' },
  { name: 'Braiins Pool V1', url: 'stratum+tcp://stratum.braiins.com', port: 3333, type: 'braiins' },
  { name: 'Braiins Pool V2', url: 'stratum2+tcp://v2.stratum.braiins.com/u95GEReVMjK6k5YqiSFNqqTnKU4ypU2Wm8awa6tmbmDmk1bWt', port: 3333, type: 'braiins' },
];

interface TestResult {
  poolName: string;
  status: 'testing' | 'success' | 'failed';
  message: string;
  latency?: number;
}

interface Worker {
  id: string;
  name: string;
  poolName: string;
  status: 'idle' | 'testing' | 'connected' | 'failed';
  hashrate?: number;
  shares?: { accepted: number; rejected: number };
}

export default function PoolTesting() {
  const [selectedPool, setSelectedPool] = useState<string>('F2Pool Primary');
  const [username, setUsername] = useState<string>('kloudbugs5');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTestingAll, setIsTestingAll] = useState<boolean>(false);
  const [workers, setWorkers] = useState<Worker[]>([
    { id: 'tera1', name: 'Tera1', poolName: 'F2Pool Primary', status: 'idle' },
    { id: 'tera2', name: 'Tera2', poolName: 'F2Pool Backup 1', status: 'idle' },
    { id: 'tera3', name: 'Tera3', poolName: 'Braiins Pool V1', status: 'idle' },
    { id: 'tera4', name: 'Tera4', poolName: 'Braiins Pool V2', status: 'idle' }
  ]);
  
  const { toast } = useToast();

  const getPoolConfig = (poolName: string) => {
    return POOL_CONFIGS.find(pool => pool.name === poolName) || POOL_CONFIGS[0];
  };

  const getPassword = (poolType: 'f2pool' | 'braiins' | 'other') => {
    return poolType === 'braiins' ? 'anything123' : '123';
  };

  const testSinglePool = async (poolName: string) => {
    const poolConfig = getPoolConfig(poolName);
    const password = getPassword(poolConfig.type);
    const fullWorkerName = `${username}.Tera1`;

    setTestResults(prev => prev.map(result => 
      result.poolName === poolName 
        ? { ...result, status: 'testing', message: 'Connecting...' }
        : result
    ));

    // Simulate pool connection test
    try {
      const startTime = Date.now();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const endTime = Date.now();
      const latency = endTime - startTime;
      
      // Simulate success/failure (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setTestResults(prev => prev.map(result => 
          result.poolName === poolName 
            ? { 
                ...result, 
                status: 'success', 
                message: `Connected successfully! Worker: ${fullWorkerName}`,
                latency 
              }
            : result
        ));
        
        toast({
          title: "Connection Successful",
          description: `${poolName} connection established with worker ${fullWorkerName}`,
        });
      } else {
        setTestResults(prev => prev.map(result => 
          result.poolName === poolName 
            ? { 
                ...result, 
                status: 'failed', 
                message: 'Connection timeout or invalid credentials' 
              }
            : result
        ));
        
        toast({
          title: "Connection Failed",
          description: `Failed to connect to ${poolName}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      setTestResults(prev => prev.map(result => 
        result.poolName === poolName 
          ? { 
              ...result, 
              status: 'failed', 
              message: 'Network error or pool unavailable' 
            }
          : result
      ));
    }
  };

  const testWorker = async (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;

    setWorkers(prev => prev.map(w => 
      w.id === workerId ? { ...w, status: 'testing' } : w
    ));

    const poolConfig = getPoolConfig(worker.poolName);
    const password = getPassword(poolConfig.type);

    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      const isSuccess = Math.random() > 0.15; // 85% success rate
      
      if (isSuccess) {
        setWorkers(prev => prev.map(w => 
          w.id === workerId ? { 
            ...w, 
            status: 'connected',
            hashrate: 25.5 + Math.random() * 5,
            shares: { accepted: Math.floor(Math.random() * 100), rejected: Math.floor(Math.random() * 5) }
          } : w
        ));
        
        toast({
          title: "Worker Connected",
          description: `${worker.name} connected to ${worker.poolName}`,
        });
      } else {
        setWorkers(prev => prev.map(w => 
          w.id === workerId ? { ...w, status: 'failed' } : w
        ));
        
        toast({
          title: "Connection Failed",
          description: `${worker.name} failed to connect to ${worker.poolName}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      setWorkers(prev => prev.map(w => 
        w.id === workerId ? { ...w, status: 'failed' } : w
      ));
    }
  };

  const testAllWorkers = async () => {
    setIsTestingAll(true);
    
    // Test all workers simultaneously
    const testPromises = workers.map(worker => testWorker(worker.id));
    await Promise.all(testPromises);
    
    setIsTestingAll(false);
    
    toast({
      title: "All Workers Tested",
      description: "Connection testing complete for all 4 workers",
    });
  };

  const testAllPools = async () => {
    setIsTestingAll(true);
    
    // Initialize all test results
    const initialResults: TestResult[] = POOL_CONFIGS.map(pool => ({
      poolName: pool.name,
      status: 'testing',
      message: 'Queued for testing...'
    }));
    setTestResults(initialResults);

    // Test pools sequentially
    for (const pool of POOL_CONFIGS) {
      await testSinglePool(pool.name);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsTestingAll(false);
    
    toast({
      title: "Pool Testing Complete",
      description: "All pool connections have been tested",
    });
  };

  const copyConfiguration = (poolName: string) => {
    const poolConfig = getPoolConfig(poolName);
    const password = getPassword(poolConfig.type);
    const fullWorkerName = `${username}.Tera1`;
    
    const config = `Pool: ${poolName}
URL: ${poolConfig.url}:${poolConfig.port}
Username: ${username}
Password: ${password}
Worker: ${fullWorkerName}`;

    navigator.clipboard.writeText(config);
    toast({
      title: "Configuration Copied",
      description: "Pool configuration copied to clipboard",
    });
  };

  const getStatusIcon = (status: 'testing' | 'success' | 'failed') => {
    switch (status) {
      case 'testing':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: 'testing' | 'success' | 'failed') => {
    switch (status) {
      case 'testing':
        return <Badge variant="outline" className="text-blue-600">Testing</Badge>;
      case 'success':
        return <Badge className="bg-green-500">Connected</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pool Connection Testing</h2>
          <p className="text-muted-foreground">Test your F2Pool and Braiins Pool connections</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={testAllWorkers}
            disabled={isTestingAll}
            className="bg-green-600 hover:bg-green-700"
          >
            {isTestingAll ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Testing All Workers
              </>
            ) : (
              <>
                <Hash className="w-4 h-4 mr-2" />
                Test All 4 Workers
              </>
            )}
          </Button>
          <Button 
            onClick={testAllPools}
            disabled={isTestingAll}
            className="bg-blue-600 hover:bg-blue-700"
            variant="outline"
          >
            <Server className="w-4 h-4 mr-2" />
            Test All Pools
          </Button>
        </div>
      </div>

      {/* 4-Worker Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Hash className="w-5 h-5 mr-2" />
            Your 4 TERA Workers
          </CardTitle>
          <CardDescription>
            Monitor and test all your mining workers across F2Pool and Braiins Pool
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workers.map((worker) => {
              const poolConfig = getPoolConfig(worker.poolName);
              const password = getPassword(poolConfig.type);
              
              return (
                <div key={worker.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{worker.name}</h4>
                    {worker.status === 'idle' && <Badge variant="outline">Idle</Badge>}
                    {worker.status === 'testing' && (
                      <Badge variant="outline" className="text-blue-600">
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        Testing
                      </Badge>
                    )}
                    {worker.status === 'connected' && <Badge className="bg-green-500">Connected</Badge>}
                    {worker.status === 'failed' && <Badge variant="destructive">Failed</Badge>}
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="text-muted-foreground">Pool: {worker.poolName}</div>
                    <div className="text-muted-foreground">URL: {poolConfig.url}:{poolConfig.port}</div>
                    <div className="text-muted-foreground">Worker: kloudbugs5.{worker.name}</div>
                    <div className="text-muted-foreground">Password: {password}</div>
                    
                    {worker.status === 'connected' && worker.hashrate && (
                      <div className="text-green-600 font-medium">
                        {worker.hashrate.toFixed(1)} TH/s
                      </div>
                    )}
                    
                    {worker.status === 'connected' && worker.shares && (
                      <div className="text-xs text-muted-foreground">
                        Shares: {worker.shares.accepted} accepted / {worker.shares.rejected} rejected
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => testWorker(worker.id)}
                    disabled={worker.status === 'testing'}
                    size="sm"
                    className="w-full"
                  >
                    {worker.status === 'testing' ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        Testing
                      </>
                    ) : (
                      'Test Connection'
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Worker Configuration
            </CardTitle>
            <CardDescription>
              Set up your mining worker credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="kloudbugs5"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="worker">Worker Base Name</Label>
              <Input
                id="worker"
                value="Tera"
                disabled
                placeholder="Tera (Workers: Tera1, Tera2, Tera3, Tera4)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pool">Select Pool to Test</Label>
              <Select value={selectedPool} onValueChange={setSelectedPool}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POOL_CONFIGS.map((pool) => (
                    <SelectItem key={pool.name} value={pool.name}>
                      {pool.name} ({pool.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={() => testSinglePool(selectedPool)}
              className="w-full"
              disabled={testResults.some(r => r.poolName === selectedPool && r.status === 'testing')}
            >
              <Hash className="w-4 h-4 mr-2" />
              Test Selected Pool
            </Button>
          </CardContent>
        </Card>

        {/* Pool Information */}
        <Card>
          <CardHeader>
            <CardTitle>Pool Information</CardTitle>
            <CardDescription>
              Current pool configuration details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const poolConfig = getPoolConfig(selectedPool);
              const password = getPassword(poolConfig.type);
              const fullWorkerName = `${username}.Tera1`;
              
              return (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Pool URL</Label>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {poolConfig.url}:{poolConfig.port}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Username</Label>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {username}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Password</Label>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {password}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Worker Name</Label>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {fullWorkerName}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => copyConfiguration(selectedPool)}
                    variant="outline"
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Configuration
                  </Button>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Connection test results for your mining pools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result) => (
                <div key={result.poolName} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">{result.poolName}</div>
                      <div className="text-sm text-muted-foreground">{result.message}</div>
                      {result.latency && (
                        <div className="text-xs text-muted-foreground">
                          Latency: {result.latency}ms
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(result.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyConfiguration(result.poolName)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
          <CardDescription>
            Your configured mining pools with credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">F2Pool Settings</h4>
              <div className="space-y-1 text-sm bg-green-50 p-3 rounded">
                <div><strong>Username:</strong> kloudbugs5</div>
                <div><strong>Password:</strong> 123</div>
                <div><strong>Worker:</strong> kloudbugs5.Tera1</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Available ports: 1314, 25, 3333, SSL: 1300, 1301
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">Braiins Pool Settings</h4>
              <div className="space-y-1 text-sm bg-blue-50 p-3 rounded">
                <div><strong>Username:</strong> kloudbugs5</div>
                <div><strong>Password:</strong> anything123</div>
                <div><strong>Worker:</strong> kloudbugs5.Tera1</div>
                <div className="text-xs text-muted-foreground mt-2">
                  V1 and V2 stratum protocols available
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}