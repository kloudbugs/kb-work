import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { MiningToggle } from '@/components/ui/MiningToggle';
import MiningLogs from '@/components/ui/MiningLogs';
import { CosmicMiningButton } from '@/components/ui/CosmicMiningButton';
import { 
  Activity, 
  Layers, 
  Cpu, 
  BarChart3, 
  Database, 
  Clock, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Wallet, 
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Radio,
  Server,
  Globe2,
  Network,
  Scroll
} from 'lucide-react';

export default function MiningPage() {
  const [tab, setTab] = useState('overview');
  const [miningEnabled, setMiningEnabled] = useState(true);
  
  // Fetch mining stats
  const { data: miningStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/mining/stats'],
    refetchInterval: 5000,
  });

  // Fetch wallet information
  const { data: walletInfo } = useQuery({
    queryKey: ['/api/wallet'],
  });
  
  // Fetch rewards information
  const { data: rewardsInfo, isLoading: rewardsLoading } = useQuery({
    queryKey: ['/api/mining/rewards'],
    refetchInterval: 30000,
  });
  
  // Mining toggle handled by MiningToggle component through MiningContext
  
  // Simulated mining data for display purposes
  const networkNodes = 1243;
  const totalMiners = miningStats?.activeMiners || 3;
  const hashrate = miningStats?.hashRate || 8500;
  const nodeStatus = 'Operational';
  const yourContribution = 12.4;
  const difficulty = 48.2;
  const totalRewards = walletInfo?.balance || '0.00135';
  
  return (
    <MainLayout>
      <div className="w-full min-h-screen p-6 space-y-8">
        <PageHeader />
        
        <Tabs defaultValue="overview" className="w-full" onValueChange={setTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-4 h-auto gap-0.5 bg-gray-900/50 p-1 mb-6">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-b data-[state=active]:from-indigo-900 data-[state=active]:to-gray-900"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden md:inline">Network Overview</span>
              <span className="md:hidden">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="nodes" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-b data-[state=active]:from-indigo-900 data-[state=active]:to-gray-900"
            >
              <Server className="h-4 w-4" />
              <span className="hidden md:inline">Nodes</span>
              <span className="md:hidden">Nodes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="logs" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-b data-[state=active]:from-indigo-900 data-[state=active]:to-gray-900"
            >
              <Scroll className="h-4 w-4" />
              <span className="hidden md:inline">Mining Logs</span>
              <span className="md:hidden">Logs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="rewards"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-b data-[state=active]:from-indigo-900 data-[state=active]:to-gray-900"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden md:inline">Rewards</span>
              <span className="md:hidden">Rewards</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="grid gap-6">
            <TabsContent value="overview" className="mt-0 space-y-6">
              {/* Mining Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                  title="Network Nodes" 
                  value={networkNodes.toLocaleString()} 
                  description="Active nodes across the network"
                  icon={<Globe className="h-8 w-8 text-indigo-400" />}
                  trend={{
                    value: 5.2,
                    direction: 'up',
                    label: 'from last hour'
                  }}
                />
                
                <StatsCard 
                  title="Active Miners" 
                  value={totalMiners.toLocaleString()} 
                  description="Mining participants online"
                  icon={<Cpu className="h-8 w-8 text-purple-400" />}
                  trend={{
                    value: 2.8,
                    direction: 'up',
                    label: 'from last hour'
                  }}
                />
                
                <StatsCard 
                  title="Network Hashrate" 
                  value={`${(hashrate / 1000).toFixed(2)} KH/s`} 
                  description="Total hashing power"
                  icon={<Zap className="h-8 w-8 text-blue-400" />}
                  trend={{
                    value: 1.5,
                    direction: 'up',
                    label: 'from last hour'
                  }}
                />
                
                <StatsCard 
                  title="Network Status" 
                  value={nodeStatus} 
                  description="System operational status"
                  icon={<Activity className="h-8 w-8 text-emerald-400" />}
                  valueClassName="text-emerald-400"
                />
              </div>
              
              {/* Mining control and performance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-950 border-indigo-900/50 shadow-xl overflow-hidden">
                  <CardHeader className="flex flex-col space-y-1 border-b border-gray-800">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                        Network Mining Performance
                      </span>
                      <Badge variant="outline" className="bg-indigo-900/30 border-indigo-400/30 text-indigo-300">
                        Live Data
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Real-time performance metrics and distribution across the network
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Network diagram would go here in a real implementation */}
                      <div className="h-48 relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg overflow-hidden flex items-center justify-center group">
                        <div className="absolute inset-0">
                          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                          
                          {/* Data visualization elements - simplified for this example */}
                          <div className="relative h-full w-full">
                            {/* Center node */}
                            <motion.div 
                              className="absolute w-24 h-24 rounded-full bg-indigo-900/50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-indigo-500/40 flex items-center justify-center text-center"
                              animate={{
                                boxShadow: [
                                  '0 0 10px rgba(79, 70, 229, 0.2)',
                                  '0 0 20px rgba(79, 70, 229, 0.4)',
                                  '0 0 10px rgba(79, 70, 229, 0.2)',
                                ],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            >
                              <div>
                                <Network className="h-6 w-6 mx-auto mb-1 text-indigo-400" />
                                <p className="text-xs font-medium text-indigo-300">Central Node</p>
                              </div>
                            </motion.div>
                            
                            {/* Generate random nodes around the center */}
                            {Array.from({ length: 12 }).map((_, i) => {
                              const angle = (Math.PI * 2 * i) / 12;
                              const dist = 70 + Math.random() * 30;
                              const x = Math.cos(angle) * dist;
                              const y = Math.sin(angle) * dist;
                              const size = 8 + Math.random() * 8;
                              
                              return (
                                <motion.div
                                  key={i}
                                  className="absolute rounded-full bg-blue-500/40 border border-blue-500/30"
                                  style={{
                                    width: size,
                                    height: size,
                                    left: `calc(50% + ${x}px)`,
                                    top: `calc(50% + ${y}px)`,
                                  }}
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.7, 1, 0.7],
                                  }}
                                  transition={{
                                    duration: 2 + Math.random() * 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: Math.random() * 2,
                                  }}
                                />
                              );
                            })}
                            
                            {/* Connection lines */}
                            {Array.from({ length: 8 }).map((_, i) => {
                              const angle = (Math.PI * 2 * i) / 8;
                              const length = 70 + Math.random() * 30;
                              
                              return (
                                <motion.div
                                  key={`line-${i}`}
                                  className="absolute bg-indigo-500/30 h-0.5 left-1/2 top-1/2"
                                  style={{
                                    width: length,
                                    transformOrigin: '0 0',
                                    transform: `rotate(${angle}rad)`,
                                  }}
                                  animate={{
                                    opacity: [0.2, 0.5, 0.2],
                                  }}
                                  transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: Math.random(),
                                  }}
                                />
                              );
                            })}
                            
                            {/* Data packet animations */}
                            {Array.from({ length: 5 }).map((_, i) => {
                              const angle = (Math.PI * 2 * i) / 5;
                              const length = 70;
                              
                              return (
                                <motion.div
                                  key={`packet-${i}`}
                                  className="absolute w-2 h-2 rounded-full bg-cyan-400 left-1/2 top-1/2"
                                  animate={{
                                    x: [0, Math.cos(angle) * length],
                                    y: [0, Math.sin(angle) * length],
                                    opacity: [1, 0],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="text-center z-10">
                          <p className="text-gray-400 text-xs">Interactive network visualization</p>
                          <p className="text-gray-500 text-xs mt-1">Click to expand</p>
                        </div>
                      </div>
                      
                      {/* Performance metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Your Contribution</span>
                            <span className="text-white font-medium">{yourContribution}%</span>
                          </div>
                          <Progress value={yourContribution} className="h-2 bg-gray-800" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Network Difficulty</span>
                            <span className="text-white font-medium">{difficulty}T</span>
                          </div>
                          <Progress value={difficulty} max={100} className="h-2 bg-gray-800" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Uptime</span>
                            <span className="text-white font-medium">99.8%</span>
                          </div>
                          <Progress value={99.8} className="h-2 bg-gray-800" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Mining control card */}
                <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-indigo-900/50 shadow-xl overflow-hidden">
                  <CardHeader className="border-b border-gray-800">
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                      Mining Control
                    </CardTitle>
                    <CardDescription>
                      Manage your mining participation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-white font-medium">Mining Status</h4>
                        <p className="text-gray-400 text-sm">Global network contribution</p>
                      </div>
                      <MiningToggle />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400 text-sm">Allocation</span>
                          <span className="text-white text-sm font-medium">80%</span>
                        </div>
                        <Slider defaultValue={[80]} max={100} step={5} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400 text-sm">Priority</span>
                          <span className="text-white text-sm font-medium">Medium</span>
                        </div>
                        <Slider defaultValue={[50]} max={100} step={25} />
                      </div>
                    </div>
                    
                    <Separator className="bg-gray-800" />
                    
                    <div className="pt-2">
                      <h4 className="text-white font-medium mb-3">Current Rewards</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-indigo-300">{totalRewards} BTC</p>
                          <p className="text-gray-400 text-sm">Mining reward balance</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-indigo-600/50 text-indigo-400 hover:bg-indigo-900/30 hover:text-indigo-300">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="nodes" className="mt-0">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-indigo-900/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                    Network Nodes
                  </CardTitle>
                  <CardDescription>
                    View and manage connected nodes across the network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">The node details will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="logs" className="mt-0">
              <MiningLogs />
            </TabsContent>
            
            <TabsContent value="rewards" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mining Rewards Summary */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-950 border-indigo-900/50 shadow-xl">
                  <CardHeader className="border-b border-gray-800">
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                      Mining Rewards
                    </CardTitle>
                    <CardDescription>
                      View your mining earnings and distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {rewardsLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="h-8 w-8 rounded-full border-2 border-blue-500/50 border-t-blue-500 animate-spin"></div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Bitcoin Earnings */}
                        <div className="space-y-4">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-indigo-500/30 rounded-lg blur-sm opacity-75"></div>
                            <h3 className="relative px-4 py-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 flex items-center">
                              <span className="relative">
                                Bitcoin Earnings
                                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-blue-500/0 via-indigo-500/50 to-purple-500/0"></div>
                              </span>
                              <div className="ml-2 h-4 w-4 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-70 animate-pulse"></div>
                            </h3>
                          </div>
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="flex flex-col space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Total Mined</span>
                                <span className="text-white font-bold">{rewardsInfo?.totalMined || totalRewards} BTC</span>
                              </div>
                              <Separator className="bg-gray-700" />
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Your Share (65%)</span>
                                <span className="text-white font-semibold">{rewardsInfo?.userShare || (parseFloat(totalRewards) * 0.65).toFixed(8)} BTC</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">TERA Contribution (35%)</span>
                                <span className="text-purple-400 font-semibold">{rewardsInfo?.teraShare || (parseFloat(totalRewards) * 0.35).toFixed(8)} BTC</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Distribution visualization */}
                        <div className="space-y-4">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-indigo-500/20 to-purple-500/30 rounded-lg blur-sm opacity-75"></div>
                            <h3 className="relative px-4 py-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 flex items-center">
                              <span className="relative">
                                Reward Distribution
                                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-blue-500/0 via-indigo-500/50 to-purple-500/0"></div>
                              </span>
                              <div className="ml-2 h-4 w-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 opacity-70 animate-pulse"></div>
                            </h3>
                          </div>
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="relative pt-1">
                              <div className="flex flex-col mb-2">
                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-semibold text-gray-400">
                                    Your Share
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs font-semibold text-blue-400">65%</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex h-4 mb-4 overflow-hidden rounded-full bg-gray-700">
                                <div
                                  style={{ width: "65%" }}
                                  className="flex flex-col justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center text-xs"
                                ></div>
                                <div
                                  style={{ width: "35%" }}
                                  className="flex flex-col justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center text-xs"
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-400">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mr-1"></div>
                                  <span>Your Mining Rewards</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mr-1"></div>
                                  <span>TERA Token Fund</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Impact statement */}
                        <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-900/10">
                          <div className="flex items-start">
                            <div className="bg-purple-900/50 rounded-full p-2 mr-3">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#d8b4fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="#d8b4fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="#d8b4fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-purple-300 font-semibold text-sm mb-1">Your Impact Through TERA</h4>
                              <p className="text-gray-400 text-xs">
                                35% of all mining rewards are directed to the TERA Fund, dedicated to fighting for justice and 
                                accountability in our legal system. Your contributions have helped fund critical civil rights 
                                initiatives and legal support for those in need.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Recent transactions history */}
                        <div className="space-y-4">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 via-cyan-500/20 to-blue-500/30 rounded-lg blur-sm opacity-75"></div>
                            <h3 className="relative px-4 py-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-cyan-300 to-blue-400 flex items-center">
                              <span className="relative">
                                Recent Transactions
                                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-green-500/0 via-cyan-500/50 to-blue-500/0"></div>
                              </span>
                              <div className="ml-2 h-4 w-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-70 animate-pulse"></div>
                            </h3>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-700">
                              <thead className="bg-gray-800/80">
                                <tr>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Type
                                  </th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Amount
                                  </th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-700 bg-gray-800/20">
                                {(rewardsInfo?.transactions || [
                                  { date: '2025-05-01', type: 'Mining Reward', amount: '0.00032', status: 'Completed' },
                                  { date: '2025-04-28', type: 'Mining Reward', amount: '0.00028', status: 'Completed' },
                                  { date: '2025-04-25', type: 'Mining Reward', amount: '0.00041', status: 'Completed' }
                                ]).map((tx, idx) => (
                                  <tr key={idx} className="hover:bg-gray-700/20">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                      {tx.date}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                      {tx.type}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                      {tx.amount} BTC
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/20 text-green-400">
                                        {tx.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Withdrawal Card */}
                <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-indigo-900/50 shadow-xl h-fit">
                  <CardHeader className="border-b border-gray-800">
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                      Withdraw Rewards
                    </CardTitle>
                    <CardDescription>
                      Request a withdrawal to the admin wallet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-indigo-500/20 to-purple-500/30 rounded-lg blur-sm opacity-60"></div>
                          <div className="relative px-4 py-2">
                            <h3 className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-300">Available for Withdrawal</h3>
                            <div className="text-2xl font-bold text-white mt-1 flex items-center">
                              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                                {rewardsInfo?.availableForWithdrawal || (parseFloat(totalRewards) * 0.65).toFixed(8)} BTC
                              </span>
                              <span className="ml-2 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/30">
                        <div className="text-sm text-gray-400 mb-4">
                          <p>Withdrawals will be sent to the admin's wallet and processed within 24 hours.</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Minimum withdrawal</span>
                            <span className="text-white">0.0005 BTC</span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Processing time</span>
                            <span className="text-white">24 hours</span>
                          </div>
                          
                          <Separator className="bg-gray-700" />
                          
                          <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                            <Button className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/60 to-indigo-600/60 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
                              <span className="relative flex items-center justify-center">
                                <Wallet className="h-4 w-4 mr-2" />
                                Request Withdrawal
                              </span>
                            </Button>
                          </div>
                          
                          <p className="text-xs text-gray-500 text-center mt-2">
                            Note: All withdrawals are subject to review by the administrator.
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-900/10">
                        <div className="flex items-start">
                          <div className="bg-amber-900/50 rounded-full p-2 mr-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-amber-300 font-semibold text-sm mb-1">Important Notice</h4>
                            <p className="text-gray-400 text-xs">
                              To ensure security and compliance, all withdrawals are sent to the admin's wallet for processing.
                              Direct wallet withdrawals are only available to admin accounts.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
      <div>
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-blue-400 to-indigo-500 animate-gradient-x pb-1">
            Mining Dashboard
          </h1>
          <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 via-blue-500 to-indigo-500 rounded-full opacity-80 animate-pulse"></div>
          <div className="absolute -bottom-2 left-0 w-[70%] h-[1px] bg-gradient-to-r from-blue-500/40 to-transparent rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-10 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: "500ms" }}></div>
        </div>
        <p className="text-gray-400 relative z-10 mt-2 pl-1">
          <span className="inline-block relative">
            <span className="absolute -left-3 top-1/2 w-1 h-1 bg-blue-400 rounded-full animate-ping-slow"></span>
            BLOCKCHAIN MINING FOR CIVIL RIGHTS & SOCIAL JUSTICE
          </span>
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <CosmicMiningButton className="shadow-lg shadow-indigo-900/20" />
        <Button variant="outline" className="h-9 border-indigo-900/50 bg-indigo-900/20 text-indigo-300 hover:bg-indigo-900/40">
          <Radio className="mr-2 h-4 w-4" />
          Network Status
        </Button>
        <Button variant="default" className="h-9 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700">
          <Layers className="mr-2 h-4 w-4" />
          View Mining Pools
        </Button>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  valueClassName?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label: string;
  };
}

function StatsCard({ title, value, description, icon, valueClassName = "text-white", trend }: StatsCardProps) {
  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-indigo-900/50 shadow-xl overflow-hidden relative group">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="absolute top-0 right-0 h-16 w-16 -mt-8 -mr-8 bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
            
            {trend && (
              <div className="flex items-center space-x-1">
                {trend.direction === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-400" />
                )}
                <span className={`text-xs ${trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trend.value}%
                </span>
                <span className="text-xs text-gray-500">{trend.label}</span>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          
          <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-gray-800/50 border border-gray-700/50">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}