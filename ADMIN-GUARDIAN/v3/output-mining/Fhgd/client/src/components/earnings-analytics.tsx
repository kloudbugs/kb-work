import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EarningsAnalytics() {
  const [calculatorHashrate, setCalculatorHashrate] = useState(1.25);
  const [calculatorPower, setCalculatorPower] = useState(125);
  const [electricityCost, setElectricityCost] = useState(0.12);

  const { data: stats } = useQuery({
    queryKey: ['/api/mining/stats'],
  });

  const { data: bitcoinPrice } = useQuery({
    queryKey: ['/api/bitcoin/price'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Calculate earnings
  const todayEarnings = stats?.slice(-24).reduce((sum: number, stat: any) => sum + (stat.earnings || 0), 0) || 0;
  const weeklyEarnings = stats?.slice(-168).reduce((sum: number, stat: any) => sum + (stat.earnings || 0), 0) || 0;

  // Calculate profitability
  const dailyRevenue = calculatorHashrate * 0.00001 * (bitcoinPrice?.price || 45000);
  const dailyCost = (calculatorPower / 1000) * 24 * electricityCost;
  const calculatedProfit = dailyRevenue - dailyCost;

  return (
    <div className="mining-card p-6">
      <h3 className="text-lg font-semibold mb-6">Earnings Analytics</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-elevated rounded-lg">
            <div className="text-2xl font-bold text-success">
              {todayEarnings.toFixed(5)}
            </div>
            <div className="text-xs text-muted">Today (BTC)</div>
          </div>
          <div className="text-center p-4 bg-elevated rounded-lg">
            <div className="text-2xl font-bold text-bitcoin">
              {weeklyEarnings.toFixed(5)}
            </div>
            <div className="text-xs text-muted">This Week (BTC)</div>
          </div>
        </div>

        {/* Profitability Calculator */}
        <div className="border-t border-border pt-4">
          <h4 className="font-medium mb-3">Profitability Calculator</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="block text-xs text-muted mb-1">Hashrate (TH/s)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={calculatorHashrate}
                  onChange={(e) => setCalculatorHashrate(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm bg-elevated border-border"
                />
              </div>
              <div>
                <Label className="block text-xs text-muted mb-1">Power (W)</Label>
                <Input
                  type="number"
                  value={calculatorPower}
                  onChange={(e) => setCalculatorPower(parseInt(e.target.value) || 0)}
                  className="w-full text-sm bg-elevated border-border"
                />
              </div>
            </div>
            <div>
              <Label className="block text-xs text-muted mb-1">Electricity Cost ($/kWh)</Label>
              <Input
                type="number"
                step="0.01"
                value={electricityCost}
                onChange={(e) => setElectricityCost(parseFloat(e.target.value) || 0)}
                className="w-full text-sm bg-elevated border-border"
              />
            </div>
            <div className="p-3 bg-elevated rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Daily Profit:</span>
                <span className={`font-semibold ${
                  calculatedProfit > 0 ? 'text-success' : 'text-error'
                }`}>
                  ${calculatedProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
