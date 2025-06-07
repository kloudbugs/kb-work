import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMining } from "@/contexts/mining-context";
import { useState } from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PerformanceDashboard() {
  const { miningStats, performanceHistory } = useMining();
  const [timeRange, setTimeRange] = useState("24h");
  
  const hasData = performanceHistory && performanceHistory.length > 0;
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-neutral-900">Mining Performance</h2>
          <div className="flex">
            <Button
              variant="ghost"
              size="sm"
              className={`text-sm rounded-full px-3 py-1 ${timeRange === "24h" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-600"}`}
              onClick={() => setTimeRange("24h")}
            >
              24H
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`text-sm rounded-full px-3 py-1 mx-2 ${timeRange === "7d" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-600"}`}
              onClick={() => setTimeRange("7d")}
            >
              7D
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`text-sm rounded-full px-3 py-1 ${timeRange === "30d" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-600"}`}
              onClick={() => setTimeRange("30d")}
            >
              30D
            </Button>
          </div>
        </div>
        
        <div className="h-64 bg-neutral-100 rounded-lg mb-4">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceHistory}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#CFD8DC" />
                <XAxis dataKey="time" stroke="#90A4AE" />
                <YAxis stroke="#90A4AE" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="hashrate"
                  name="Hashrate (MH/s)"
                  stroke="#3949AB"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-chart-line text-6xl text-neutral-300 mb-2"></i>
                <p className="text-sm text-neutral-500">Performance history will appear here when mining begins</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-neutral-100 rounded-lg p-3">
            <span className="text-xs text-neutral-600 block">Avg. Hashrate</span>
            <span className="text-primary font-medium block">{miningStats?.avgHashrate?.toFixed(1) || "0.0"} MH/s</span>
          </div>
          <div className="bg-neutral-100 rounded-lg p-3">
            <span className="text-xs text-neutral-600 block">Accepted Shares</span>
            <span className="text-primary font-medium block">{miningStats?.acceptedShares || 0}</span>
          </div>
          <div className="bg-neutral-100 rounded-lg p-3">
            <span className="text-xs text-neutral-600 block">Rejected Shares</span>
            <span className="text-primary font-medium block">{miningStats?.rejectedShares || 0}</span>
          </div>
          <div className="bg-neutral-100 rounded-lg p-3">
            <span className="text-xs text-neutral-600 block">Success Rate</span>
            <span className="text-primary font-medium block">{miningStats?.successRate?.toFixed(1) || "0.0"}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
