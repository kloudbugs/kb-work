import { useEffect } from "react";
import { useMining } from "@/hooks/use-mining";
import MiningStatus from "@/components/mining-status";
import HashrateChart from "@/components/hashrate-chart";
import MiningPools from "@/components/mining-pools";
import HardwareControl from "@/components/hardware-control";
import WalletIntegration from "@/components/wallet-integration";
import EarningsAnalytics from "@/components/earnings-analytics";
import ActivityLog from "@/components/activity-log";
import PayoutQueue from "@/components/payout-queue";
import MobileNav from "@/components/mobile-nav";
import { FaBitcoin, FaUser } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { connectWebSocket, isConnected, startMining, stopMining, isMining } = useMining();

  const { data: user } = useQuery({
    queryKey: ['/api/user/profile'],
  });

  const { data: latestStats } = useQuery({
    queryKey: ['/api/mining/stats/latest'],
    refetchInterval: 5000,
  });

  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);

  return (
    <div className="bg-dark-bg text-white min-h-screen">
      {/* Navigation Header */}
      <header className="bg-card-bg border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaBitcoin className="text-bitcoin text-2xl" />
            <h1 className="text-xl font-bold">BitMiner Pro</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-bitcoin border-b-2 border-bitcoin pb-1">
              Dashboard
            </a>
            <a href="#" className="text-muted hover:text-white transition-colors">
              Mining Pools
            </a>
            <a href="#" className="text-muted hover:text-white transition-colors">
              Wallet
            </a>
            <a href="#" className="text-muted hover:text-white transition-colors">
              Analytics
            </a>
            <a href="#" className="text-muted hover:text-white transition-colors">
              Settings
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-muted">Total Balance</div>
              <div className="font-semibold text-success">
                {user?.balance?.toFixed(8) || '0.00000000'} BTC
              </div>
            </div>
            <div className="w-8 h-8 bg-bitcoin rounded-full flex items-center justify-center">
              <FaUser className="text-dark-bg text-sm" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Mining Status Overview */}
        <MiningStatus 
          isConnected={isConnected}
          isMining={isMining}
          latestStats={latestStats}
          onStartMining={startMining}
          onStopMining={stopMining}
        />

        {/* Real-time Mining Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HashrateChart />
          <MiningPools />
        </div>

        {/* Mining Hardware Control */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HardwareControl />
          </div>
          <div>
            {/* Mining Controls Panel will be integrated into HardwareControl */}
          </div>
        </div>

        {/* Wallet and Earnings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WalletIntegration user={user} />
          <PayoutQueue />
        </div>

        {/* Earnings Analytics */}
        <EarningsAnalytics />

        {/* Recent Activity and Logs */}
        <ActivityLog />
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
