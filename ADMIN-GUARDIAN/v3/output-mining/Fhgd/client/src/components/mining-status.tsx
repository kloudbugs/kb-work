import { FaTachometerAlt, FaBitcoin, FaBolt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface MiningStatusProps {
  isConnected: boolean;
  isMining: boolean;
  latestStats?: any;
  onStartMining: () => void;
  onStopMining: () => void;
}

export default function MiningStatus({ 
  isConnected, 
  isMining, 
  latestStats, 
  onStartMining, 
  onStopMining 
}: MiningStatusProps) {
  const statusColor = isMining && isConnected ? "success" : "error";
  const statusText = isMining && isConnected ? "Active" : "Inactive";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="mining-card p-6 hover:border-bitcoin transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-muted text-sm uppercase tracking-wide">Mining Status</h3>
          <div className={`w-3 h-3 rounded-full ${
            statusColor === 'success' ? 'bg-success pulse-success' : 'bg-error'
          }`} />
        </div>
        <div className={`text-2xl font-bold ${
          statusColor === 'success' ? 'text-success' : 'text-error'
        }`}>
          {statusText}
        </div>
        <div className="text-sm text-muted mt-1">
          {isConnected ? 'Connected to F2Pool' : 'Disconnected'}
        </div>
        <div className="mt-4">
          {isMining ? (
            <Button onClick={onStopMining} variant="destructive" size="sm">
              Stop Mining
            </Button>
          ) : (
            <Button onClick={onStartMining} className="bg-success hover:bg-success/80" size="sm">
              Start Mining
            </Button>
          )}
        </div>
      </div>

      <div className="mining-card p-6 hover:border-bitcoin transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-muted text-sm uppercase tracking-wide">Current Hashrate</h3>
          <FaTachometerAlt className="text-bitcoin" />
        </div>
        <div className="text-2xl font-bold">
          {latestStats?.hashrate?.toFixed(2) || '0.00'} TH/s
        </div>
        <div className="text-sm text-success mt-1">
          +12% from yesterday
        </div>
      </div>

      <div className="mining-card p-6 hover:border-bitcoin transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-muted text-sm uppercase tracking-wide">24h Earnings</h3>
          <FaBitcoin className="text-bitcoin" />
        </div>
        <div className="text-2xl font-bold">
          {latestStats?.earnings?.toFixed(8) || '0.00000000'} BTC
        </div>
        <div className="text-sm text-muted mt-1">
          ≈ ${((latestStats?.earnings || 0) * 45000).toFixed(2)} USD
        </div>
      </div>

      <div className="mining-card p-6 hover:border-bitcoin transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-muted text-sm uppercase tracking-wide">Power Efficiency</h3>
          <FaBolt className="text-bitcoin" />
        </div>
        <div className="text-2xl font-bold">
          {latestStats?.power ? Math.round((latestStats.hashrate / latestStats.power) * 1000) : 85}%
        </div>
        <div className="text-sm text-success mt-1">
          Optimal performance
        </div>
      </div>
    </div>
  );
}
