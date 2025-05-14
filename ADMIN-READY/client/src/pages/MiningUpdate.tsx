import React from 'react';
import WebsiteLayout from '@/components/website/WebsiteLayout';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define types for our API responses
interface MiningStats {
  totalHashrate?: number;
  activeMiners?: number;
  totalRewards?: number;
  networkDifficulty?: number;
}

interface Pool {
  id: number;
  name: string;
  url: string;
}

interface PoolsData {
  pools?: Pool[];
}

const MiningUpdate = () => {
  // Fetch mining stats
  const { data: miningStats, isLoading } = useQuery<MiningStats>({
    queryKey: ['/api/mining/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch pool information
  const { data: poolsData } = useQuery<PoolsData>({
    queryKey: ['/api/pools'],
  });

  return (
    <WebsiteLayout>
      <div className="min-h-screen bg-black py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600" style={{ 
              textShadow: '0 0 15px rgba(137, 78, 234, 0.8), 0 0 30px rgba(104, 58, 214, 0.6)',
              fontFamily: "'Orbitron', sans-serif"
            }}>
              MINING STATISTICS UPDATE
            </h1>
            <p className="text-blue-300 max-w-2xl mx-auto">
              Live statistics from our mining operations and the pools we connect to
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Hashrate */}
            <Card className="bg-gray-900/80 border border-blue-900/40 shadow-lg shadow-blue-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 text-lg">Total Hashrate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {isLoading ? (
                    <div className="h-6 w-24 bg-gray-800 rounded animate-pulse"></div>
                  ) : (
                    miningStats?.totalHashrate ? `${(miningStats.totalHashrate / 1000).toFixed(2)} KH/s` : 'Not available'
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-1">Combined mining power</p>
              </CardContent>
            </Card>

            {/* Active Miners */}
            <Card className="bg-gray-900/80 border border-blue-900/40 shadow-lg shadow-blue-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 text-lg">Active Miners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {isLoading ? (
                    <div className="h-6 w-16 bg-gray-800 rounded animate-pulse"></div>
                  ) : (
                    miningStats?.activeMiners || '0'
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-1">Devices currently mining</p>
              </CardContent>
            </Card>

            {/* Mining Pool */}
            <Card className="bg-gray-900/80 border border-blue-900/40 shadow-lg shadow-blue-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 text-lg">Primary Mining Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-white">
                  {poolsData?.pools?.[0]?.name || 'Unmineable'}
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  {poolsData?.pools?.[0]?.url || 'rx.unmineable.com:3333'}
                </p>
              </CardContent>
            </Card>

            {/* Mining Rewards */}
            <Card className="bg-gray-900/80 border border-blue-900/40 shadow-lg shadow-blue-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 text-lg">Mining Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {isLoading ? (
                    <div className="h-6 w-28 bg-gray-800 rounded animate-pulse"></div>
                  ) : (
                    miningStats?.totalRewards ? `${miningStats.totalRewards.toFixed(8)} BTC` : '0.00000000 BTC'
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-1">Total rewards earned</p>
              </CardContent>
            </Card>

            {/* Network Difficulty */}
            <Card className="bg-gray-900/80 border border-blue-900/40 shadow-lg shadow-blue-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 text-lg">Network Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {isLoading ? (
                    <div className="h-6 w-28 bg-gray-800 rounded animate-pulse"></div>
                  ) : (
                    miningStats?.networkDifficulty ? `${(miningStats.networkDifficulty / 1e12).toFixed(2)}T` : 'N/A'
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-1">Current Bitcoin difficulty</p>
              </CardContent>
            </Card>

            {/* Mining Algorithm */}
            <Card className="bg-gray-900/80 border border-blue-900/40 shadow-lg shadow-blue-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 text-lg">Mining Algorithm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  RandomX
                </div>
                <p className="text-gray-400 text-sm mt-1">CPU-based proof-of-work</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-800">
            <p className="text-center text-gray-400 text-sm">
              Mining target: <span className="text-blue-300 font-mono">bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps</span>
            </p>
            <p className="text-center text-gray-400 text-sm mt-2">
              All mining rewards help fund civil rights activities and community support programs
            </p>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default MiningUpdate;