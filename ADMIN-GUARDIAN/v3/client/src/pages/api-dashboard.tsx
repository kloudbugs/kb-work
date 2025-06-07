import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ApiDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('mining');
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mining status query
  const { data: miningStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/mining/stats'],
    enabled: activeTab === 'mining',
    refetchInterval: 5000
  });
  
  // Rewards query
  const { data: rewards, isLoading: rewardsLoading } = useQuery({
    queryKey: ['/api/mining/rewards'],
    enabled: activeTab === 'rewards',
    refetchInterval: 10000
  });
  
  // Withdrawal history query
  const { data: withdrawals, isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['/api/withdrawals/history'],
    enabled: activeTab === 'withdrawals'
  });
  
  // Execute API command
  const executeCommand = async (endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) => {
    setIsLoading(true);
    try {
      let response;
      
      if (method === 'GET') {
        response = await fetch(endpoint);
      } else {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data || {})
        });
      }
      
      const responseData = await response.json();
      setLastResponse(responseData);
      
      // Show success toast
      toast({
        title: 'API Command Executed',
        description: `Command to ${endpoint} completed successfully.`,
      });
      
      // Refresh relevant queries
      if (endpoint.includes('mining')) {
        queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
        queryClient.invalidateQueries({ queryKey: ['/api/mining/rewards'] });
      }
      
      if (endpoint.includes('withdraw')) {
        queryClient.invalidateQueries({ queryKey: ['/api/withdrawals/history'] });
        queryClient.invalidateQueries({ queryKey: ['/api/mining/rewards'] });
      }
      
      return responseData;
    } catch (error) {
      console.error('API command error:', error);
      setLastResponse({ error: 'Failed to execute command' });
      
      // Show error toast
      toast({
        title: 'API Command Failed',
        description: `Error executing command to ${endpoint}.`,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const apiCommands = {
    mining: [
      { name: 'Start Mining', description: 'Start mining operation with default settings', endpoint: '/api/mining/control', method: 'POST', data: { command: 'start' } },
      { name: 'Start Lama Mining', description: 'Start mining with Lama optimization', endpoint: '/api/mining/control', method: 'POST', data: { command: 'start', mode: 'lama' } },
      { name: 'Stop Mining', description: 'Stop all mining operations', endpoint: '/api/mining/control', method: 'POST', data: { command: 'stop' } },
      { name: 'Get Mining Stats', description: 'Get current mining statistics', endpoint: '/api/mining/stats', method: 'GET' },
      { name: 'Add 100 Ghost Rigs', description: 'Add 100 ghost feather mining rigs', endpoint: '/api/mining/ghostfeather', method: 'POST', data: { command: 'add', count: 100 } },
      { name: 'Optimize for Hardware', description: 'Optimize mining for your hardware', endpoint: '/api/mining/optimize', method: 'POST', data: { target: 'hardware' } }
    ],
    rewards: [
      { name: 'Get Mining Rewards', description: 'View all mining rewards', endpoint: '/api/mining/rewards', method: 'GET' },
      { name: 'Check Pending Rewards', description: 'Check pending mining rewards', endpoint: '/api/mining/rewards/pending', method: 'GET' },
      { name: 'Check Daily Estimate', description: 'Get estimated daily earnings', endpoint: '/api/mining/rewards/estimate', method: 'GET' }
    ],
    withdrawals: [
      { name: 'Process Withdrawal', description: 'Process a withdrawal to your wallet', endpoint: '/api/withdrawals/request', method: 'POST', data: { amount: 0.00123456 } },
      { name: 'Verify Withdrawal', description: 'Verify a pending withdrawal with TERA Guardian', endpoint: '/api/guardian/verify-withdrawal', method: 'POST', data: { amount: 0.00123456, address: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6', txid: `tx-${Date.now()}-${Math.floor(Math.random() * 100000)}` } },
      { name: 'Get Withdrawal History', description: 'View withdrawal transaction history', endpoint: '/api/withdrawals/history', method: 'GET' }
    ],
    pools: [
      { name: 'Connect to Unmineable', description: 'Connect to Unmineable pool', endpoint: '/api/mining/pool/connect', method: 'POST', data: { pool: 'unmineable', user: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6', referralCode: '1784277766' } },
      { name: 'Connect to NiceHash', description: 'Connect to NiceHash pool', endpoint: '/api/mining/pool/connect', method: 'POST', data: { pool: 'nicehash', user: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6' } },
      { name: 'Connect to MiningPoolHub', description: 'Connect to MiningPoolHub', endpoint: '/api/mining/pool/connect', method: 'POST', data: { pool: 'miningpoolhub', user: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6' } },
      { name: 'Get Connected Pools', description: 'Get list of connected mining pools', endpoint: '/api/mining/pools', method: 'GET' }
    ],
    guardian: [
      { name: 'Activate TERA Guardian', description: 'Activate TERA Guardian security system', endpoint: '/api/guardian/activate', method: 'POST', data: { securityLevel: 'high' } },
      { name: 'Guardian Status Check', description: 'Check TERA Guardian status', endpoint: '/api/guardian/status', method: 'GET' },
      { name: 'Verify Wallet Address', description: 'Verify Bitcoin wallet address', endpoint: '/api/guardian/verify-wallet', method: 'POST', data: { address: 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6' } }
    ]
  };
  
  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Mining API Dashboard | KLOUD BUGS</title>
        <meta name="description" content="One-click access to all mining API commands" />
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-cosmic-blue mb-2">Mining API Dashboard</h1>
        <p className="text-muted-foreground">One-click access to all mining API commands</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="mining">Mining</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              <TabsTrigger value="pools">Pools</TabsTrigger>
              <TabsTrigger value="guardian">Guardian</TabsTrigger>
            </TabsList>
            
            {Object.entries(apiCommands).map(([category, commands]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {commands.map((command, index) => (
                    <Card key={index} className="bg-slate-900/70 border-space-purple/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md text-cosmic-blue">
                          {command.name}
                        </CardTitle>
                        <CardDescription>{command.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-xs text-muted-foreground pb-2">
                        <p>Endpoint: {command.endpoint}</p>
                        <p>Method: {command.method}</p>
                        {command.data && (
                          <div className="mt-1">
                            <p>Data: {JSON.stringify(command.data)}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => executeCommand(command.endpoint, command.method, command.data)}
                          disabled={isLoading}
                        >
                          Execute
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        <div className="space-y-6">
          {/* Status Panel */}
          <Card className="bg-slate-900/70 border-space-purple/20">
            <CardHeader>
              <CardTitle className="text-cosmic-blue">API Response</CardTitle>
              <CardDescription>
                Last command result
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-auto">
              {isLoading ? (
                <div className="flex justify-center items-center p-4">
                  <div className="animate-spin h-6 w-6 border-t-2 border-blue-500 rounded-full"></div>
                </div>
              ) : lastResponse ? (
                <pre className="text-xs p-3 bg-slate-800/50 rounded-md overflow-auto">
                  {JSON.stringify(lastResponse, null, 2)}
                </pre>
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  No commands executed yet
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Current Status */}
          <Card className="bg-slate-900/70 border-space-purple/20">
            <CardHeader>
              <CardTitle className="text-cosmic-blue">Current Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mining Status */}
              <div>
                <h3 className="text-sm font-medium mb-2">Mining Status</h3>
                {statsLoading ? (
                  <div className="animate-pulse h-4 bg-slate-700 rounded w-20"></div>
                ) : (
                  <Badge variant={miningStats?.active ? "default" : "secondary"}>
                    {miningStats?.active ? "Active" : "Inactive"}
                  </Badge>
                )}
                
                {miningStats?.active && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Hashrate:</p>
                      <p className="text-sm">{miningStats?.hashrate?.toFixed(2)} MH/s</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Shares:</p>
                      <p className="text-sm">{miningStats?.shares} accepted</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Rewards Status */}
              <div>
                <h3 className="text-sm font-medium mb-2">Rewards</h3>
                {rewardsLoading ? (
                  <div className="animate-pulse h-4 bg-slate-700 rounded w-20"></div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Pending:</p>
                      <p className="text-sm">{rewards?.pending || "0.00000000"} BTC</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Today:</p>
                      <p className="text-sm">{rewards?.today || "0.00000000"} BTC</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Withdrawals Status */}
              <div>
                <h3 className="text-sm font-medium mb-2">Withdrawals</h3>
                {withdrawalsLoading ? (
                  <div className="animate-pulse h-4 bg-slate-700 rounded w-full"></div>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground">Last withdrawal:</p>
                    <p className="text-sm">
                      {withdrawals && withdrawals.length > 0
                        ? `${withdrawals[0].amount} BTC (${new Date(withdrawals[0].completed).toLocaleDateString()})`
                        : "No withdrawals yet"}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Ghost Feather */}
              <div>
                <h3 className="text-sm font-medium mb-2">Ghost Feather</h3>
                <Badge variant="outline" className="bg-cyber-gold/10 text-cyber-gold border-cyber-gold/20">
                  {miningStats?.ghostFeatherRigs || 100} Rigs Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}