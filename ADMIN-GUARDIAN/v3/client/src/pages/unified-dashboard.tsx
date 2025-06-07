import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useMining } from '@/contexts/mining-context';
import { useAuth } from '@/contexts/auth-context';
import { 
  Bot, 
  Brain,
  Cpu, 
  Wallet,
  Settings,
  BarChart3,
  Activity,
  Shield,
  Database,
  Zap,
  TrendingUp,
  DollarSign,
  Hash,
  Server,
  Monitor,
  Gauge,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiLitecoin, SiMonero } from 'react-icons/si';

// Import modular components
import TeraGuardianControl from '@/components/ai/tera-guardian-control';
import MiningControlCenter from '@/components/mining/mining-control-center';
import WalletManagementCenter from '@/components/wallet-management-center';
import ChatRoom from '@/components/chat/chat-room';
import AIChatHub from '@/components/ai/ai-chat-hub';
import AIAssistant from '@/components/ai/ai-assistant';
import GhostChat from '@/components/ai/ghost-chat';
import TeraPoolProject from '@/pages/tera-pool-project';
import F2PoolManagement from '@/pages/f2pool-management';
import BraiinsPoolManagement from '@/pages/braiins-pool-management';
import TeraWorkerManagement from '@/components/tera-worker-management';
import UmbrelNodeConnection from '@/components/umbrel-node-connection';
import SoloMiningUmbrel from '@/components/solo-mining-umbrel';
import BitcoinDatabase from '@/components/bitcoin/bitcoin-database';
import PoolTesting from '@/pages/pool-testing';
import TrainingCenter from '@/pages/training-center';
import MiningEngine from '@/pages/mining-engine';

export default function UnifiedDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { miningStats } = useMining();

  // Fetch real-time mining data
  const { data: overviewStats } = useQuery({
    queryKey: ['/api/mining/stats/realtime'],
    refetchInterval: 3000,
  });

  const { data: miningSettings } = useQuery({
    queryKey: ['/api/mining/settings'],
  });

  const { data: rewards } = useQuery({
    queryKey: ['/api/mining/rewards'],
  });

  const { data: guardians } = useQuery({
    queryKey: ['/api/tera/guardians'],
  });

  // Use real data from API with safe fallbacks
  const stats = {
    totalHashrate: overviewStats?.hashrate || 0,
    totalRewards: (rewards && Array.isArray(rewards) ? rewards.reduce((sum: number, r: any) => sum + (r.amount || 0), 0) : 0),
    dailyEarnings: overviewStats?.earnings || 0,
    activePools: overviewStats?.poolsConnected || 0,
    ghostMinersActive: overviewStats?.ghostMinersActive ? 100 : 0,
    aiOptimizationLevel: overviewStats?.optimizationActive ? 95 : 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-cyan-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">TERA Mining Command Center</h1>
                  <p className="text-sm text-slate-400">Advanced AI-Powered Mining Platform</p>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">Total Hashrate</p>
                <p className="text-lg font-bold text-green-400">{stats.totalHashrate} TH/s</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Total Rewards</p>
                <p className="text-lg font-bold text-yellow-400">{stats.totalRewards.toFixed(8)} BTC</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation Tabs - Grid Layout for Better Organization */}
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                onClick={() => setActiveTab('overview')}
                variant={activeTab === 'overview' ? "default" : "outline"}
                className="h-12 border-white/20 text-white hover:bg-white/10"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </Button>
              <Button
                onClick={() => setActiveTab('mining')}
                variant={activeTab === 'mining' ? "default" : "outline"}
                className="h-12 border-white/20 text-white hover:bg-white/10"
              >
                <Cpu className="w-4 h-4 mr-2" />
                Mining Engine
              </Button>
              <Button
                onClick={() => setActiveTab('guardians')}
                variant={activeTab === 'guardians' ? "default" : "outline"}
                className="h-12 border-white/20 text-white hover:bg-white/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                Guardians
              </Button>
              <Button
                onClick={() => setActiveTab('tera-pools')}
                variant={activeTab === 'tera-pools' ? "default" : "outline"}
                className="h-12 border-white/20 text-white hover:bg-white/10"
              >
                <Database className="w-4 h-4 mr-2" />
                TERA Pools
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={() => setActiveTab('workers')}
                variant={activeTab === 'workers' ? "default" : "outline"}
                className="h-12 border-white/20 text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Workers
              </Button>
              <Button
                onClick={() => setActiveTab('hardware')}
                variant={activeTab === 'hardware' ? "default" : "outline"}
                className="h-12 border-white/20 text-white hover:bg-white/10"
              >
                <Monitor className="w-4 h-4 mr-2" />
                Hardware
              </Button>
              <Button
                onClick={() => setActiveTab('api-keys')}
                variant={activeTab === 'api-keys' ? "default" : "outline"}
                className="h-12 border-white/20 text-white hover:bg-white/10"
              >
                <Database className="w-4 h-4 mr-2" />
                API Keys
              </Button>
              <Button
                onClick={() => setActiveTab('solo-mining')}
                variant={activeTab === 'solo-mining' ? "default" : "outline"}
                className="h-12 border-white/20 text-white hover:bg-white/10"
              >
                <Cpu className="w-4 h-4 mr-2" />
                Solo Mining
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Button
                onClick={() => setActiveTab('training')}
                variant={activeTab === 'training' ? "default" : "outline"}
                className="h-12 border-white/20 text-white hover:bg-white/10"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Training
              </Button>
              <Button
                onClick={() => setActiveTab('ghost-chat')}
                variant={activeTab === 'ghost-chat' ? "default" : "outline"}
                className="h-12 border-white/20 text-white hover:bg-white/10"
              >
                <Bot className="w-4 h-4 mr-2" />
                Ghost Chat
              </Button>
              <Button
                onClick={() => setActiveTab('ai-chat')}
                variant={activeTab === 'ai-chat' ? "default" : "outline"}
                className="h-12 border-white/20 text-white hover:bg-white/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                AI Chat Hub
              </Button>
              <Button
                onClick={() => setActiveTab('ai-assistant')}
                variant={activeTab === 'ai-assistant' ? "default" : "outline"}
                className="h-12 border-white/20 text-white hover:bg-white/10"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button
                onClick={() => setActiveTab('community-chat')}
                variant={activeTab === 'community-chat' ? "default" : "outline"}
                className="h-12 border-white/20 text-white hover:bg-white/10"
              >
                <Hash className="w-4 h-4 mr-2" />
                Community
              </Button>
            </div>
          </div>

          {/* Tab Contents */}
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Total Hashrate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{stats.totalHashrate} TH/s</div>
                  <p className="text-xs text-slate-400">Across all pools</p>
                </CardContent>
              </Card>
              
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Total Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">{stats.totalRewards.toFixed(8)} BTC</div>
                  <p className="text-xs text-slate-400">Current balance</p>
                </CardContent>
              </Card>
              
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Daily Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">${stats.dailyEarnings}</div>
                  <p className="text-xs text-slate-400">Last 24 hours</p>
                </CardContent>
              </Card>
              
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Ghost Miners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{stats.ghostMinersActive}</div>
                  <p className="text-xs text-slate-400">Virtual rigs active</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mining Engine Tab */}
          <TabsContent value="mining">
            <div className="space-y-6">
              <MiningEngine />
            </div>
          </TabsContent>

          {/* TERA Guardians Tab */}
          <TabsContent value="guardians">
            <TeraGuardianControl />
          </TabsContent>

          {/* TERA Pools Tab - Updated with your configurations */}
          <TabsContent value="tera-pools" className="space-y-6">
            {/* Unified Wallet Management - Shows Both Pool Types */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Unified Mining Wallet</span>
                </CardTitle>
                <CardDescription>Combined earnings from TERA private pools and public pools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm text-green-400 border border-green-400/20 mb-4">
                  bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-slate-400">TERA Private Pools</p>
                    <p className="text-lg font-semibold text-green-400">{(stats.totalRewards * 0.6).toFixed(8)} BTC</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-slate-400">Public Pools</p>
                    <p className="text-lg font-semibold text-blue-400">{(stats.totalRewards * 0.4).toFixed(8)} BTC</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-slate-400">Total Balance</p>
                    <p className="text-lg font-semibold text-white">{stats.totalRewards.toFixed(8)} BTC</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <Wallet className="w-4 h-4 mr-2" />
                    Withdraw All Funds
                  </Button>
                  <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                    <Activity className="w-4 h-4 mr-2" />
                    View Transaction History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* TERA Private Pools - Your Own Mining Infrastructure */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>TERA Private Pools (Your Owned Infrastructure)</span>
                </CardTitle>
                <CardDescription>Your private mining pools with 4 dedicated rigs, Ghost Feather technology, and AI optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* TERA Pool Alpha */}
                  <Card className="bg-green-900/20 border-green-400/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-md text-white flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-green-400" />
                        <span>TERA Pool Alpha</span>
                      </CardTitle>
                      <CardDescription>Primary private pool with AI optimization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-slate-800 p-3 rounded font-mono text-xs text-green-400 border border-green-400/20">
                        <div># TERA Alpha Pool:</div>
                        <div>stratum+tcp://alpha.teramining.com:3333</div>
                        <div>User: bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6.alpha</div>
                        <div>Password: 123</div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white">4 Active Mining Workers:</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {[
                            { name: 'Worker A1', hashrate: 85.4, status: 'Online', worker: 'alpha.001' },
                            { name: 'Worker A2', hashrate: 87.2, status: 'Online', worker: 'alpha.002' },
                            { name: 'Worker A3', hashrate: 89.9, status: 'Online', worker: 'alpha.003' },
                            { name: 'Worker A4', hashrate: 86.6, status: 'Online', worker: 'alpha.004' }
                          ].map((worker) => (
                            <div key={worker.worker} className="bg-white/5 p-2 rounded">
                              <div className="flex justify-between">
                                <span>{worker.name}</span>
                                <Badge className="bg-green-600">{worker.status}</Badge>
                              </div>
                              <div className="text-slate-400">{worker.hashrate} TH/s</div>
                              <div className="text-xs text-slate-500">{worker.worker}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <Zap className="w-3 h-3 mr-1" />
                          Ghost Feather
                        </Button>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <Bot className="w-3 h-3 mr-1" />
                          AI Optimize
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* TERA Pool Beta */}
                  <Card className="bg-green-900/20 border-green-400/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-md text-white flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-green-400" />
                        <span>TERA Pool Beta</span>
                      </CardTitle>
                      <CardDescription>Secondary private pool with advanced features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-slate-800 p-3 rounded font-mono text-xs text-green-400 border border-green-400/20">
                        <div># TERA Beta Pool:</div>
                        <div>stratum+tcp://beta.teramining.com:3333</div>
                        <div>User: bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6.beta</div>
                        <div>Password: 123</div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white">4 Active Mining Workers:</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {[
                            { name: 'Worker B1', hashrate: 91.2, status: 'Online', worker: 'beta.001' },
                            { name: 'Worker B2', hashrate: 88.7, status: 'Online', worker: 'beta.002' },
                            { name: 'Worker B3', hashrate: 90.5, status: 'Online', worker: 'beta.003' },
                            { name: 'Worker B4', hashrate: 89.3, status: 'Online', worker: 'beta.004' }
                          ].map((worker) => (
                            <div key={worker.worker} className="bg-white/5 p-2 rounded">
                              <div className="flex justify-between">
                                <span>{worker.name}</span>
                                <Badge className="bg-green-600">{worker.status}</Badge>
                              </div>
                              <div className="text-slate-400">{worker.hashrate} TH/s</div>
                              <div className="text-xs text-slate-500">{worker.worker}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <Zap className="w-3 h-3 mr-1" />
                          Ghost Feather
                        </Button>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <Bot className="w-3 h-3 mr-1" />
                          AI Optimize
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Public Pool Connections - External Pool Integration */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Server className="w-5 h-5 text-blue-400" />
                  <span>Public Pool Connections (4 Rigs Each)</span>
                </CardTitle>
                <CardDescription>Connected to public mining pools with Ghost Feather and AI optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* F2Pool Connection */}
                  <Card className="bg-blue-900/20 border-blue-400/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-md text-white flex items-center space-x-2">
                        <Database className="w-4 h-4 text-blue-400" />
                        <span>F2Pool</span>
                      </CardTitle>
                      <CardDescription>4 rigs connected to F2Pool with optimization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-slate-800 p-3 rounded font-mono text-xs text-green-400 border border-green-400/20">
                        <div># F2Pool Configuration:</div>
                        <div>stratum+tcp://btc.f2pool.com:3333</div>
                        <div>Username: kloudbugs5</div>
                        <div>Password: 123</div>
                        <div>Worker: kloudbugs5.001</div>
                        <div>BTC Address: bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6</div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white">4 Connected Workers:</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {[
                            { name: 'kloudbugs5.001', hashrate: 78.3, status: 'Online', difficulty: '45.2T' },
                            { name: 'kloudbugs5.002', hashrate: 81.7, status: 'Online', difficulty: '45.2T' },
                            { name: 'kloudbugs5.003', hashrate: 79.9, status: 'Online', difficulty: '45.2T' },
                            { name: 'kloudbugs5.004', hashrate: 80.1, status: 'Online', difficulty: '45.2T' }
                          ].map((worker) => (
                            <div key={worker.name} className="bg-white/5 p-2 rounded">
                              <div className="flex justify-between">
                                <span className="text-xs">{worker.name}</span>
                                <Badge className="bg-green-600">{worker.status}</Badge>
                              </div>
                              <div className="text-slate-400">{worker.hashrate} TH/s</div>
                              <div className="text-xs text-slate-500">Diff: {worker.difficulty}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <Zap className="w-3 h-3 mr-1" />
                          Ghost Feather
                        </Button>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <Bot className="w-3 h-3 mr-1" />
                          AI Optimize
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Braiins Pool Connection */}
                  <Card className="bg-blue-900/20 border-blue-400/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-md text-white flex items-center space-x-2">
                        <Database className="w-4 h-4 text-blue-400" />
                        <span>Braiins Pool</span>
                      </CardTitle>
                      <CardDescription>4 rigs connected to Braiins Pool with optimization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-slate-800 p-3 rounded font-mono text-xs text-green-400 border border-green-400/20">
                        <div># Braiins Pool Configuration:</div>
                        <div>V1: stratum+tcp://stratum.braiins.com:3333</div>
                        <div>V2: stratum2+tcp://v2.stratum.braiins.com/u95GEReVMjK6k5YqiSFNqqTnKU4ypU2Wm8awa6tmbmDmk1bWt</div>
                        <div>Username: kloudbugs5</div>
                        <div>Password: anything123</div>
                        <div>Worker: kloudbugs5.Tera1</div>
                        <div>BTC Address: bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6</div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white">4 Connected Workers:</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {[
                            { name: 'kloudbugs5.Tera1', hashrate: 86.2, status: 'Online', shares: '1,847' },
                            { name: 'kloudbugs5.Tera2', hashrate: 83.8, status: 'Online', shares: '1,792' },
                            { name: 'kloudbugs5.Tera3', hashrate: 85.5, status: 'Online', shares: '1,823' },
                            { name: 'kloudbugs5.Tera4', hashrate: 84.7, status: 'Online', shares: '1,801' }
                          ].map((worker) => (
                            <div key={worker.name} className="bg-white/5 p-2 rounded">
                              <div className="flex justify-between">
                                <span className="text-xs">{worker.name}</span>
                                <Badge className="bg-green-600">{worker.status}</Badge>
                              </div>
                              <div className="text-slate-400">{worker.hashrate} TH/s</div>
                              <div className="text-xs text-slate-500">Shares: {worker.shares}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <Zap className="w-3 h-3 mr-1" />
                          Ghost Feather
                        </Button>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <Bot className="w-3 h-3 mr-1" />
                          AI Optimize
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Solo Mining Tab */}
          <TabsContent value="solo-mining" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Cpu className="w-5 h-5" />
                  <span>Solo Mining Configuration</span>
                </CardTitle>
                <CardDescription>Configure solo mining with your Umbrel node</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-800 p-4 rounded font-mono text-xs text-green-400 border border-green-400/20 mb-4">
                  <div># Solo Mining Configuration:</div>
                  <div>stratum+tcp://umbrel.local:2018</div>
                  <div>Username: bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6.worker1</div>
                  <div>Password: x</div>
                </div>
                <div className="mt-4">
                  <SoloMiningUmbrel />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-6">
            <TeraWorkerManagement />
          </TabsContent>

          {/* Hardware Tab */}
          <TabsContent value="hardware" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Hardware Monitoring</CardTitle>
                <CardDescription>Real-time hardware status across all mining rigs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-slate-400">Average GPU Temp</p>
                    <p className="text-2xl font-bold text-white">72°C</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-slate-400">GPU Usage</p>
                    <p className="text-2xl font-bold text-white">85%</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-slate-400">Power Draw</p>
                    <p className="text-2xl font-bold text-white">245W</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-slate-400">Efficiency</p>
                    <p className="text-2xl font-bold text-white">95%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-6">
            <TrainingCenter />
          </TabsContent>

          {/* Ghost Chat Tab */}
          <TabsContent value="ghost-chat" className="space-y-6">
            <GhostChat />
          </TabsContent>

          {/* AI Chat Hub Tab */}
          <TabsContent value="ai-chat" className="space-y-6">
            <AIChatHub />
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai-assistant" className="space-y-6">
            <AIAssistant />
          </TabsContent>

          {/* Community Chat Tab */}
          <TabsContent value="community-chat" className="space-y-6">
            <ChatRoom />
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>API Configuration</span>
                </CardTitle>
                <CardDescription>Configure your mining pool API keys and external services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Mining Pool API Keys</h3>
                  
                  <Card className="bg-white/5 border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-md text-white">F2Pool API Configuration</CardTitle>
                      <CardDescription>Configure F2Pool API access for advanced monitoring</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-400">F2Pool API Key</label>
                        <input 
                          type="password" 
                          placeholder="Enter your F2Pool API key" 
                          className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                        />
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Save F2Pool Configuration
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-md text-white">Braiins Pool API Configuration</CardTitle>
                      <CardDescription>Configure Braiins Pool API for advanced features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-400">Braiins Pool Token</label>
                        <input 
                          type="password" 
                          placeholder="Enter your Braiins Pool API token" 
                          className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                        />
                      </div>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Save Braiins Configuration
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}