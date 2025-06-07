import { Card, CardContent } from "@/components/ui/card";
import { useMining } from "@/contexts/mining-context";
import { formatCurrency } from "@/lib/utils";

export default function MiningProfitability() {
  const { miningStats, profitability, optimalCoins } = useMining();
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Mining Profitability</h2>
        
        <div className="bg-neutral-100 rounded-lg p-4 mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-neutral-600 text-sm">Current Hashrate</span>
            <span className="text-primary font-medium text-sm">{miningStats?.hashrate?.toFixed(1) || "0.0"} MH/s</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-neutral-600 text-sm">Network Difficulty</span>
            <span className="text-primary font-medium text-sm">{miningStats?.difficulty?.toFixed(1) || "0.0"} TH</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-neutral-600 text-sm">Power Cost</span>
            <span className="text-primary font-medium text-sm">${profitability?.powerCost?.toFixed(2) || "0.00"}/kWh</span>
          </div>
          <div className="h-px bg-neutral-300 mb-3"></div>
          <div className="flex justify-between font-medium">
            <span className="text-neutral-800">Est. Daily Earning</span>
            <span className="text-success">{formatCurrency(profitability?.dailyEarning || 0)}</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-2">Earning Forecast</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-neutral-100 rounded-lg p-2 text-center">
              <span className="text-xs text-neutral-600 block">Daily</span>
              <span className="text-primary font-medium text-sm block">{formatCurrency(profitability?.dailyEarning || 0)}</span>
            </div>
            <div className="bg-neutral-100 rounded-lg p-2 text-center">
              <span className="text-xs text-neutral-600 block">Weekly</span>
              <span className="text-primary font-medium text-sm block">{formatCurrency(profitability?.weeklyEarning || 0)}</span>
            </div>
            <div className="bg-neutral-100 rounded-lg p-2 text-center">
              <span className="text-xs text-neutral-600 block">Monthly</span>
              <span className="text-primary font-medium text-sm block">{formatCurrency(profitability?.monthlyEarning || 0)}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Optimal Coins to Mine</h3>
            <div className="space-y-2">
              {optimalCoins?.map((coin, index) => (
                <div key={index} className="bg-neutral-100 rounded-lg p-2 flex justify-between items-center">
                  <div className="flex items-center">
                    {coin.symbol === 'BTC' && <i className="fab fa-bitcoin text-orange-500 mr-2"></i>}
                    {coin.symbol === 'ETH' && <i className="fab fa-ethereum text-purple-500 mr-2"></i>}
                    {!['BTC', 'ETH'].includes(coin.symbol) && <i className="fas fa-coins text-blue-500 mr-2"></i>}
                    <span className="text-neutral-800 text-sm">{coin.name}</span>
                  </div>
                  <span className={`text-sm ${coin.change >= 0 ? 'text-success' : 'text-error'}`}>
                    {coin.change >= 0 ? '+' : ''}{coin.change}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
