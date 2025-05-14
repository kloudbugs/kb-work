import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updatePayoutSettings, getMiningHistory, getPayouts } from '@/lib/miningClient';
import { formatHashRate, formatBtc, formatDate, timeAgo, shortenHash } from '@/lib/utils';
import { History, Clock, Download } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get tab from URL if available
  const searchParams = new URLSearchParams(window.location.search);
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'account');

  // Account settings
  const [walletAddress, setWalletAddress] = useState(user?.walletAddress || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Payout settings
  const [payoutThreshold, setPayoutThreshold] = useState(user?.payoutThreshold?.toString() || '0.001');
  const [payoutSchedule, setPayoutSchedule] = useState(user?.payoutSchedule || 'daily');
  const [autoPayouts, setAutoPayouts] = useState(user?.autoPayouts !== false);
  
  // Mining settings
  const [defaultCpuAllocation, setDefaultCpuAllocation] = useState(70);
  const [defaultRamAllocation, setDefaultRamAllocation] = useState(60);
  const [persistConfig, setPersistConfig] = useState(true);
  
  // History settings
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [historyType, setHistoryType] = useState<'performance' | 'payouts'>('performance');
  
  // Query for mining history
  const { data: historyData = [], isLoading: historyLoading } = useQuery({
    queryKey: ['/api/mining/history', timeRange],
    queryFn: () => getMiningHistory(timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : 30),
  });
  
  // Query for payout history
  const { data: payouts = [], isLoading: payoutsLoading } = useQuery({
    queryKey: ['/api/payouts'],
  });
  
  // Format data for chart
  const chartData = historyData.map((stat: any) => {
    const date = new Date(stat.timestamp);
    let timeLabel = '';
    
    // Format time label based on range
    if (timeRange === 'day') {
      timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === 'week') {
      timeLabel = date.toLocaleDateString([], { weekday: 'short', hour: '2-digit' });
    } else {
      timeLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    return {
      time: timeLabel,
      hashRate: Number(stat.totalHashRate) || 0,
      earnings: Number(stat.estimatedEarnings) || 0,
      activeDevices: Number(stat.activeDevices) || 0,
      power: Number(stat.powerConsumption) || 0,
    };
  });
  
  // Update payout settings
  const updatePayoutMutation = useMutation({
    mutationFn: () => updatePayoutSettings({
      threshold: parseFloat(payoutThreshold),
      schedule: payoutSchedule,
      autoPayout: autoPayouts,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      toast({
        title: "Settings Updated",
        description: "Your payout settings have been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  // Handle account form submission
  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Account Updated",
      description: "Your account settings have been saved",
    });
  };
  
  // Handle payout form submission
  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePayoutMutation.mutate();
  };
  
  // Handle mining settings form submission
  const handleMiningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Mining Settings Saved",
      description: "Your mining preferences have been updated",
    });
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your account, mining, and payout preferences
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>User Settings</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="mining">Mining</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <form onSubmit={handleAccountSubmit}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Account Information</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={user?.username || ''} 
                          disabled 
                        />
                        <p className="text-xs text-gray-500">
                          Username cannot be changed
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="wallet">Bitcoin Wallet Address</Label>
                        <Input 
                          id="wallet" 
                          value={walletAddress} 
                          onChange={(e) => setWalletAddress(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                          This is where your mining rewards will be sent
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                          id="currentPassword" 
                          type="password" 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full sm:w-auto">
                    Save Account Settings
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="payouts">
              <form onSubmit={handlePayoutSubmit}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Payout Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Automatic Payouts</Label>
                          <p className="text-sm text-gray-500">
                            Automatically process payouts when threshold is reached
                          </p>
                        </div>
                        <Switch 
                          checked={autoPayouts} 
                          onCheckedChange={setAutoPayouts}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="threshold">Minimum Payout Threshold</Label>
                        <div className="flex items-center">
                          <Input 
                            id="threshold"
                            type="text" 
                            value={payoutThreshold} 
                            onChange={(e) => setPayoutThreshold(e.target.value)}
                            className="w-36" 
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">BTC</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Minimum amount required for automatic payouts
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="schedule">Payout Schedule</Label>
                        <Select value={payoutSchedule} onValueChange={setPayoutSchedule}>
                          <SelectTrigger id="schedule">
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          How often to check for available payouts
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto"
                    disabled={updatePayoutMutation.isPending}
                  >
                    {updatePayoutMutation.isPending ? "Saving..." : "Save Payout Settings"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="mining">
              <form onSubmit={handleMiningSubmit}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Mining Preferences</h3>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Default Resource Allocation</Label>
                        <p className="text-sm text-gray-500 mb-4">
                          Set default resource usage for new devices
                        </p>
                        
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="cpu">CPU Allocation: {defaultCpuAllocation}%</Label>
                            </div>
                            <Slider 
                              id="cpu"
                              value={[defaultCpuAllocation]} 
                              onValueChange={(value) => setDefaultCpuAllocation(value[0])} 
                              max={100} 
                              step={5}
                            />
                            <p className="text-xs text-gray-500">
                              Percentage of CPU to allocate for mining
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="ram">RAM Allocation: {defaultRamAllocation}%</Label>
                            </div>
                            <Slider 
                              id="ram"
                              value={[defaultRamAllocation]} 
                              onValueChange={(value) => setDefaultRamAllocation(value[0])} 
                              max={100} 
                              step={5}
                            />
                            <p className="text-xs text-gray-500">
                              Percentage of RAM to allocate for mining
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Persistent Configuration</Label>
                          <p className="text-sm text-gray-500">
                            Keep mining configuration after device reboots
                          </p>
                        </div>
                        <Switch 
                          checked={persistConfig} 
                          onCheckedChange={setPersistConfig}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full sm:w-auto">
                    Save Mining Settings
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Mining History</h3>
                  
                  <div className="flex justify-between items-center mb-6">
                    <TabsList>
                      <TabsTrigger 
                        value="performance" 
                        onClick={() => setHistoryType('performance')}
                        className={historyType === 'performance' ? "bg-primary text-primary-foreground" : ""}
                      >
                        Performance
                      </TabsTrigger>
                      <TabsTrigger 
                        value="payouts" 
                        onClick={() => setHistoryType('payouts')}
                        className={historyType === 'payouts' ? "bg-primary text-primary-foreground" : ""}
                      >
                        Payouts
                      </TabsTrigger>
                    </TabsList>
                    
                    {historyType === 'performance' && (
                      <TabsList>
                        <TabsTrigger 
                          value="day" 
                          onClick={() => setTimeRange('day')}
                          className={timeRange === 'day' ? "bg-primary text-primary-foreground" : ""}
                        >
                          Day
                        </TabsTrigger>
                        <TabsTrigger 
                          value="week" 
                          onClick={() => setTimeRange('week')}
                          className={timeRange === 'week' ? "bg-primary text-primary-foreground" : ""}
                        >
                          Week
                        </TabsTrigger>
                        <TabsTrigger 
                          value="month" 
                          onClick={() => setTimeRange('month')}
                          className={timeRange === 'month' ? "bg-primary text-primary-foreground" : ""}
                        >
                          Month
                        </TabsTrigger>
                      </TabsList>
                    )}
                  </div>
                  
                  {historyType === 'performance' ? (
                    historyLoading ? (
                      <div className="text-center py-6 text-gray-500">
                        Loading mining history...
                      </div>
                    ) : chartData.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <h3 className="text-lg font-medium mb-2">No mining history available</h3>
                        <p className="text-sm max-w-md mx-auto">
                          Once you start mining, your performance data will be recorded here.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Hash Rate Chart */}
                        <div className="mt-4">
                          <h3 className="text-md font-medium mb-3">Hash Rate History</h3>
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={chartData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                                <YAxis 
                                  stroke="#6B7280" 
                                  fontSize={12}
                                  tickFormatter={(value) => `${value} MH/s`}
                                />
                                <Tooltip 
                                  formatter={(value, name) => {
                                    if (name === 'hashRate') {
                                      return [formatHashRate(Number(value)), 'Hash Rate'];
                                    }
                                    return [value, name];
                                  }}
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="hashRate" 
                                  stroke="#3B82F6" 
                                  fill="#3B82F6" 
                                  fillOpacity={0.2}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        {/* Earnings Chart */}
                        <div className="mt-10">
                          <h3 className="text-md font-medium mb-3">Earnings History</h3>
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={chartData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                                <YAxis 
                                  stroke="#6B7280" 
                                  fontSize={12}
                                  tickFormatter={(value) => `${value.toFixed(8)} BTC`}
                                />
                                <Tooltip 
                                  formatter={(value, name) => {
                                    if (name === 'earnings') {
                                      return [formatBtc(Number(value)), 'BTC'];
                                    }
                                    return [value, name];
                                  }}
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="earnings" 
                                  stroke="#10B981" 
                                  fill="#10B981" 
                                  fillOpacity={0.2}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </>
                    )
                  ) : (
                    payoutsLoading ? (
                      <div className="text-center py-6 text-gray-500">
                        Loading payout history...
                      </div>
                    ) : (payouts as any[]).length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <h3 className="text-lg font-medium mb-2">No payouts yet</h3>
                        <p className="text-sm max-w-md mx-auto">
                          Once you receive payouts, they will be recorded here.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Transaction</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Time</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(payouts as any[]).map((payout: any) => (
                              <TableRow key={payout.id}>
                                <TableCell>
                                  {formatDate(payout.timestamp)}
                                </TableCell>
                                <TableCell className="font-mono">
                                  {formatBtc(payout.amount)} BTC
                                </TableCell>
                                <TableCell className="font-mono">
                                  {payout.txHash ? (
                                    <a 
                                      href={`https://www.blockchain.com/btc/tx/${payout.txHash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline"
                                    >
                                      {shortenHash(payout.txHash)}
                                    </a>
                                  ) : (
                                    <span className="text-gray-500">Pending</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <span className={
                                    payout.status === 'completed' 
                                      ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                                      : payout.status === 'pending'
                                        ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                                        : "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
                                  }>
                                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {timeAgo(payout.timestamp)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="support">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Support</h3>
                  <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-primary">Email Support</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          For all support inquiries, please contact our team at:
                        </p>
                        <a 
                          href="mailto:admin@kloudbugscafe.com" 
                          className="inline-flex items-center text-primary hover:underline mt-2"
                        >
                          admin@kloudbugscafe.com
                        </a>
                      </div>
                      
                      <div className="pt-2">
                        <h4 className="font-medium text-primary">Support Hours</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Our support team is available Monday through Friday, 9AM to 5PM EST.
                          We typically respond to all inquiries within 24 hours.
                        </p>
                      </div>
                      
                      <div className="pt-2">
                        <h4 className="font-medium text-primary">Common Issues</h4>
                        <div className="space-y-3 mt-2">
                          <div className="border rounded-md p-3">
                            <h5 className="font-medium text-sm">Mining Connection Issues</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              If you are experiencing connection issues with your mining devices, please check your firewall settings and ensure ports 3333, 5555, and 7777 are open for outgoing connections.
                            </p>
                          </div>
                          
                          <div className="border rounded-md p-3">
                            <h5 className="font-medium text-sm">Payout Delays</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Bitcoin network congestion can sometimes cause payment delays. If your payout is pending for more than 24 hours, please contact our support team.
                            </p>
                          </div>
                          
                          <div className="border rounded-md p-3">
                            <h5 className="font-medium text-sm">Access Issues</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              If you're experiencing access issues, please try clearing your browser cache or using a different browser. If the issue persists, please contact our support team.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
}