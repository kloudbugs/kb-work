import { useQuery } from "@tanstack/react-query";
import { FaChartLine } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function HashrateChart() {
  const [timeframe, setTimeframe] = useState('24H');

  const { data: stats } = useQuery({
    queryKey: ['/api/mining/stats'],
    refetchInterval: 10000,
  });

  // Generate chart data from stats
  const chartData = stats?.slice(-24).map((stat: any, index: number) => ({
    time: new Date(stat.timestamp).getHours(),
    hashrate: stat.hashrate,
  })) || [];

  return (
    <div className="mining-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Hashrate Performance</h3>
        <div className="flex space-x-2">
          {['24H', '7D', '30D'].map((period) => (
            <Button
              key={period}
              size="sm"
              variant={timeframe === period ? "default" : "ghost"}
              className={timeframe === period ? "bg-bitcoin text-dark-bg" : "text-muted"}
              onClick={() => setTimeframe(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Simplified chart visualization */}
      <div className="h-64 bg-elevated rounded-lg flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bitcoin-gradient opacity-20"></div>
        <div className="text-center z-10">
          <FaChartLine className="text-4xl text-bitcoin mb-2 mx-auto" />
          <div className="text-muted">Real-time Hashrate Chart</div>
          <div className="text-xs text-muted mt-1">
            Current: {chartData[chartData.length - 1]?.hashrate?.toFixed(2) || '0.00'} TH/s
          </div>
          {chartData.length > 0 && (
            <div className="mt-4 flex justify-center space-x-4 text-xs">
              <div>Min: {Math.min(...chartData.map(d => d.hashrate)).toFixed(2)} TH/s</div>
              <div>Max: {Math.max(...chartData.map(d => d.hashrate)).toFixed(2)} TH/s</div>
              <div>Avg: {(chartData.reduce((sum, d) => sum + d.hashrate, 0) / chartData.length).toFixed(2)} TH/s</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
