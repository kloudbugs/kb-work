import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useMining } from '@/contexts/mining-context';
import { 
  Bot, 
  Cpu, 
  Wallet,
  Settings,
  BarChart3,
  Activity,
  Shield
} from 'lucide-react';
import { FaBitcoin, FaUser } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

// Import our modular components
import TeraGuardianControl from '@/components/ai/tera-guardian-control';
import MiningControlCenter from '@/components/mining/mining-control-center';
import WalletManagementCenter from '@/components/wallet-management-center';

export default function ModularProfessionalDashboard() {
  const { isConnected } = useMining();
  const [activeModule, setActiveModule] = useState('overview');

  // User profile and balance
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user']
  });

  // Real-time mining stats for overview
  const { data: miningStats } = useQuery({
    queryKey: ['/api/mining/stats/realtime'],
    refetchInterval: 2000
  });

  // TERA Guardian system status
  const { data: guardians } = useQuery({
    queryKey: ['/api/tera/guardians']
  });

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Professional Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaBitcoin className="text-orange-500 text-2xl" />
              <h1 className="text-xl font-bold">TERA Mining Platform</h1>
            </div>
            <Badge variant="outline" className={`${isConnected ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
              {isConnected ? 'Connected' : 'Offline'}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-slate-400">Total Balance</div>
              <div className="font-semibold text-orange-500">
                {((user as any)?.balance || 0).toFixed(8)} BTC
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">24h Earnings</div>
              <div className="font-semibold text-green-500">
                {formatCurrency(((miningStats as any)?.earnings || 0) * 24)}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 hover:border-slate-500"
              onClick={() => window.location.href = '/f2pool'}
            >
              <Settings className="w-4 h-4 mr-2" />
              F2Pool
            </Button>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <FaUser className="text-slate-950 text-sm" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-slate-900">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="guardians" className="flex items-center space-x-2">
              <Bot className="w-4 h-4" />
              <span>TERA Guardians</span>
            </TabsTrigger>
            <TabsTrigger value="mining" className="flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span>Mining Control</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center space-x-2">
              <Wallet className="w-4 h-4" />
              <span>Wallet & Payouts</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - System Status Summary */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Mining Status */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Mining Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                    {isConnected ? 'Active' : 'Stopped'}
                  </div>
                  <div className="text-sm text-slate-400">
                    {isConnected ? 'Connected to F2Pool' : 'Disconnected'}
                  </div>
                </CardContent>
              </Card>

              {/* Hashrate */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Current Hashrate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">
                    {((miningStats as any)?.hashrate || 0).toFixed(2)} TH/s
                  </div>
                  <div className="text-sm text-slate-400">
                    {(miningStats as any)?.ghostMinersActive ? 'Ghost Enhanced' : 'Hardware Only'}
                  </div>
                </CardContent>
              </Card>

              {/* TERA Guardians */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Active Guardians
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-500">
                    {(guardians as any)?.filter((g: any) => g.status === 'active').length || 0}/4
                  </div>
                  <div className="text-sm text-slate-400">
                    AI Systems Online
                  </div>
                </CardContent>
              </Card>

              {/* Wallet Balance */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <FaBitcoin className="w-4 h-4 mr-2" />
                    Wallet Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">
                    {((user as any)?.balance || 0).toFixed(8)}
                  </div>
                  <div className="text-sm text-slate-400">
                    BTC Available
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer" 
                    onClick={() => setActiveModule('guardians')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-blue-500" />
                    TERA Guardian AI System
                  </CardTitle>
                  <CardDescription>
                    Manage your AI guardians, start optimization, and access training modules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Active Guardians</span>
                      <span>{(guardians as any)?.filter((g: any) => g.status === 'active').length || 0}/4</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">AI Load Average</span>
                      <span>{(guardians as any)?.reduce((acc: number, g: any) => acc + g.aiLoadLevel, 0) / ((guardians as any)?.length || 1) || 0}%</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Manage AI System
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                    onClick={() => setActiveModule('mining')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cpu className="w-5 h-5 mr-2 text-green-500" />
                    Mining Control Center
                  </CardTitle>
                  <CardDescription>
                    Control mining operations, manage pools, and activate Ghost Feather system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Current Hashrate</span>
                      <span>{((miningStats as any)?.hashrate || 0).toFixed(2)} TH/s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Mining Status</span>
                      <span className={isConnected ? 'text-green-500' : 'text-red-500'}>
                        {isConnected ? 'Active' : 'Stopped'}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Control Mining
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                    onClick={() => setActiveModule('wallet')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="w-5 h-5 mr-2 text-orange-500" />
                    Wallet & Payouts
                  </CardTitle>
                  <CardDescription>
                    Manage Bitcoin wallet, request F2Pool payouts, and track earnings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Available Balance</span>
                      <span>{((user as any)?.balance || 0).toFixed(8)} BTC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">USD Value</span>
                      <span>{formatCurrency(((user as any)?.balance || 0) * 58500)}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Manage Wallet
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* System Status Summary */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-500" />
                  System Status Overview
                </CardTitle>
                <CardDescription>
                  Complete status of your TERA mining platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-300">Mining Operations</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Status</span>
                        <Badge className={isConnected ? 'bg-green-600' : 'bg-red-600'}>
                          {isConnected ? 'Active' : 'Stopped'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Hashrate</span>
                        <span>{((miningStats as any)?.hashrate || 0).toFixed(2)} TH/s</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Power</span>
                        <span>{((miningStats as any)?.power || 0).toFixed(0)}W</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-300">AI Guardians</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Active</span>
                        <span>{(guardians as any)?.filter((g: any) => g.status === 'active').length || 0}/4</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Load Avg</span>
                        <span>{(guardians as any)?.reduce((acc: number, g: any) => acc + g.aiLoadLevel, 0) / ((guardians as any)?.length || 1) || 0}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Optimization</span>
                        <Badge className={(miningStats as any)?.optimizationActive ? 'bg-blue-600' : 'bg-slate-600'}>
                          {(miningStats as any)?.optimizationActive ? 'Active' : 'Standby'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-300">Ghost Feather</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Status</span>
                        <Badge className={(miningStats as any)?.ghostMinersActive ? 'bg-purple-600' : 'bg-slate-600'}>
                          {(miningStats as any)?.ghostMinersActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Virtual Miners</span>
                        <span>{(miningStats as any)?.ghostMinersActive ? '100' : '0'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Virtual Hashrate</span>
                        <span>{(miningStats as any)?.ghostMinersActive ? '2450 TH/s' : '0 TH/s'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-300">Wallet & Earnings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Balance</span>
                        <span>{((user as any)?.balance || 0).toFixed(8)} BTC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Hourly Rate</span>
                        <span>{formatCurrency(((miningStats as any)?.earnings || 0))}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">F2Pool Status</span>
                        <Badge className={isConnected ? 'bg-blue-600' : 'bg-slate-600'}>
                          {isConnected ? 'Connected' : 'Offline'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TERA Guardians Module */}
          <TabsContent value="guardians">
            <TeraGuardianControl />
          </TabsContent>

          {/* Mining Control Module */}
          <TabsContent value="mining">
            <MiningControlCenter />
          </TabsContent>

          {/* Wallet Management Module */}
          <TabsContent value="wallet">
            <WalletManagementCenter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}