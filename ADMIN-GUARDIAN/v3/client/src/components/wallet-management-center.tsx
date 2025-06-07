import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Wallet,
  TrendingUp,
  Send,
  Download,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
  ExternalLink,
  Settings
} from 'lucide-react';
import { FaBitcoin } from 'react-icons/fa';
import { formatCurrency, formatDate } from '@/lib/utils';
import WalletSetup from './wallet-setup';

interface MiningReward {
  id: number;
  amount: number;
  status: string;
  timestamp: string;
  pool: string;
  transactionId?: string;
}

export default function WalletManagementCenter() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mining rewards query
  const { data: rewards } = useQuery({
    queryKey: ['/api/mining/rewards'],
    refetchInterval: 30000
  });

  // User profile for balance
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user']
  });

  // F2Pool payout request mutation
  const requestPayoutMutation = useMutation({
    mutationFn: () =>
      apiRequest({
        url: '/api/f2pool/payout',
        method: 'POST'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining/rewards'] });
      toast({
        title: "Payout Requested",
        description: "F2Pool payout has been requested and will be processed within 24 hours"
      });
    }
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`
    });
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 bg-slate-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Wallet className="w-4 h-4 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('pools')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pools' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Pool Earnings
        </button>
        <button
          onClick={() => setActiveTab('ghost')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'ghost' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Eye className="w-4 h-4 inline mr-2" />
          Ghost Miners
        </button>
        <button
          onClick={() => setActiveTab('solo')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'solo' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <FaBitcoin className="w-4 h-4 inline mr-2" />
          Solo Mining
        </button>
        <button
          onClick={() => setActiveTab('setup')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'setup' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Hardware Wallet Setup
        </button>
      </div>

      {activeTab === 'setup' ? (
        <WalletSetup />
      ) : activeTab === 'pools' ? (
        // Pool Earnings Tab
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  F2Pool Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500 mb-2">0.00123456 BTC</div>
                <div className="text-slate-400">Last 30 days</div>
                <Button className="w-full mt-3" onClick={() => requestPayoutMutation.mutate()}>
                  Request Payout
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                  Braiins Pool Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500 mb-2">0.00087654 BTC</div>
                <div className="text-slate-400">Last 30 days</div>
                <Button variant="outline" className="w-full mt-3">
                  Request Payout
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  KB Pool Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500 mb-2">0.00234567 BTC</div>
                <div className="text-slate-400">Last 30 days</div>
                <Button variant="outline" className="w-full mt-3">
                  Auto-withdraw Active
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : activeTab === 'ghost' ? (
        // Ghost Miners Tab
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-purple-500" />
                Ghost Feather Miners Earnings
              </CardTitle>
              <CardDescription>Virtual mining fleet earnings and statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">87/100</div>
                  <div className="text-slate-400 text-sm">Active Ghosts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">8.7 GH/s</div>
                  <div className="text-slate-400 text-sm">Virtual Hashrate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">0.00045678 BTC</div>
                  <div className="text-slate-400 text-sm">Today's Earnings</div>
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">Ghost Mining Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Daily Virtual Mining:</span>
                    <span className="text-green-400">$24.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Weekly Projection:</span>
                    <span className="text-blue-400">$171.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Power Cost:</span>
                    <span className="text-purple-400">$0.00 (Virtual)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : activeTab === 'solo' ? (
        // Solo Mining Tab
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaBitcoin className="w-5 h-5 mr-2 text-orange-500" />
                Solo Mining Rewards
              </CardTitle>
              <CardDescription>Direct Bitcoin mining rewards and Umbrel node earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h4 className="text-orange-500 font-medium mb-2">Bitcoin Solo Mining</h4>
                  <div className="text-2xl font-bold text-orange-400 mb-1">0.00000000 BTC</div>
                  <div className="text-slate-400 text-sm">No blocks found yet</div>
                  <div className="text-xs text-slate-500 mt-2">Next block probability: 0.0001%</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h4 className="text-blue-500 font-medium mb-2">Umbrel Node Rewards</h4>
                  <div className="text-2xl font-bold text-blue-400 mb-1">0.00012345 BTC</div>
                  <div className="text-slate-400 text-sm">Transaction fees</div>
                  <div className="text-xs text-slate-500 mt-2">Node uptime: 99.8%</div>
                </div>
              </div>
              <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-500/20">
                <h4 className="text-amber-400 font-medium mb-2">Solo Mining Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">Current Difficulty:</div>
                    <div className="text-white font-mono">62.46 T</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Network Hashrate:</div>
                    <div className="text-white font-mono">512.4 EH/s</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaBitcoin className="w-5 h-5 mr-2 text-orange-500" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {((user as any)?.balance || 0).toFixed(8)} BTC
            </div>
            <div className="text-slate-400">
              ≈ {formatCurrency(((user as any)?.balance || 0) * 58500)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-500" />
              Pending Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500 mb-2">
              0.00001234 BTC
            </div>
            <div className="text-slate-400">
              From recent mining
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500 mb-2">
              {((rewards as any)?.reduce((acc: number, r: any) => acc + r.amount, 0) || 0).toFixed(8)} BTC
            </div>
            <div className="text-slate-400">
              Lifetime earnings
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Address & Controls */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-blue-500" />
            Bitcoin Wallet Address
          </CardTitle>
          <CardDescription>
            Your primary Bitcoin wallet for mining rewards and F2Pool withdrawals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm text-slate-400">Wallet Address</Label>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex-1 p-3 bg-slate-800 rounded-lg font-mono text-sm break-all">
                bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard('bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6', 'Wallet address')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm text-slate-400">Private Key</Label>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex-1 p-3 bg-slate-800 rounded-lg font-mono text-sm">
                {showPrivateKey ? 'L1aW4aubDFB7yfras2S1mN3bqg9nwySY8nkoLmJebSLD5BWv3ENZ' : '••••••••••••••••••••••••••••••••••••••••••••••••••'}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
              >
                {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              {showPrivateKey && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('L1aW4aubDFB7yfras2S1mN3bqg9nwySY8nkoLmJebSLD5BWv3ENZ', 'Private key')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={() => requestPayoutMutation.mutate()}
              disabled={requestPayoutMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Request F2Pool Payout
            </Button>
            
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Balance
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Mining Rewards */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Recent Mining Rewards
          </CardTitle>
          <CardDescription>
            Your latest mining rewards from F2Pool and other pools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(rewards as any)?.slice(0, 10).map((reward: MiningReward) => (
              <div key={reward.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    reward.status === 'confirmed' ? 'bg-green-500' : 
                    reward.status === 'pending' ? 'bg-yellow-500' : 'bg-slate-500'
                  }`} />
                  <div>
                    <div className="font-medium">{reward.amount.toFixed(8)} BTC</div>
                    <div className="text-sm text-slate-400">
                      {reward.pool} • {formatDate(reward.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={
                    reward.status === 'confirmed' ? 'bg-green-600' : 
                    reward.status === 'pending' ? 'bg-yellow-600' : 'bg-slate-600'
                  }>
                    {reward.status}
                  </Badge>
                  {reward.transactionId && (
                    <div className="text-xs text-slate-400 mt-1">
                      <ExternalLink className="w-3 h-3 inline mr-1" />
                      TX: {reward.transactionId.slice(0, 8)}...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </div>
      )}
    </div>
  );
}