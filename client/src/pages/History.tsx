import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getMiningHistory, getPayouts } from '@/lib/miningClient';
import { formatHashRate, formatBtc, formatDate, timeAgo, shortenHash } from '@/lib/utils';

export default function History() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'performance' | 'payouts'>('performance');
  
  // Query for mining history
  const { data: historyData = [], isLoading: historyLoading } = useQuery({
    queryKey: ['/api/mining/history', timeRange],
    queryFn: () => getMiningHistory(timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : 30),
  });
  
  // Query for payout history
  const { data: payouts = [], isLoading: payoutsLoading } = useQuery({
    queryKey: ['/api/payouts'],
  });
  
  // Format data for chart
  const chartData = historyData.map((stat: any) => {
    const date = new Date(stat.timestamp);
    let timeLabel = '';
    
    // Format time label based on range
    if (timeRange === 'day') {
      timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === 'week') {
      timeLabel = date.toLocaleDateString([], { weekday: 'short', hour: '2-digit' });
    } else {
      timeLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    return {
      time: timeLabel,
      hashRate: Number(stat.totalHashRate) || 0,
      earnings: Number(stat.estimatedEarnings) || 0,
      activeDevices: Number(stat.activeDevices) || 0,
      power: Number(stat.powerConsumption) || 0,
    };
  });

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Mining History</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          View historical performance and payout records
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Mining History</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="payouts">Payouts</TabsTrigger>
              </TabsList>
            
              {activeTab === 'performance' && (
                <TabsList>
                  <TabsTrigger 
                    value="day" 
                    onClick={() => setTimeRange('day')}
                    className={timeRange === 'day' ? "bg-primary text-primary-foreground" : ""}
                  >
                    Day
                  </TabsTrigger>
                  <TabsTrigger 
                    value="week" 
                    onClick={() => setTimeRange('week')}
                    className={timeRange === 'week' ? "bg-primary text-primary-foreground" : ""}
                  >
                    Week
                  </TabsTrigger>
                  <TabsTrigger 
                    value="month" 
                    onClick={() => setTimeRange('month')}
                    className={timeRange === 'month' ? "bg-primary text-primary-foreground" : ""}
                  >
                    Month
                  </TabsTrigger>
                </TabsList>
              )}
            </div>
            
            <TabsContent value="performance">
              {historyLoading ? (
                <div className="text-center py-6 text-gray-500">
                  Loading mining history...
                </div>
              ) : chartData.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <h3 className="text-lg font-medium mb-2">No mining history available</h3>
                  <p className="text-sm max-w-md mx-auto">
                    Once you start mining, your performance data will be recorded here.
                  </p>
                </div>
              ) : (
                <>
                  {/* Hash Rate Chart */}
                  <div className="mt-4">
                    <h3 className="text-md font-medium mb-3">Hash Rate History</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                          <YAxis 
                            stroke="#6B7280" 
                            fontSize={12}
                            tickFormatter={(value) => `${value} MH/s`}
                          />
                          <Tooltip 
                            formatter={(value, name) => {
                              if (name === 'hashRate') {
                                return [formatHashRate(Number(value)), 'Hash Rate'];
                              }
                              return [value, name];
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="hashRate" 
                            stroke="#3B82F6" 
                            fill="#3B82F6" 
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Earnings Chart */}
                  <div className="mt-10">
                    <h3 className="text-md font-medium mb-3">Earnings History</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                          <YAxis 
                            stroke="#6B7280" 
                            fontSize={12}
                            tickFormatter={(value) => `${value.toFixed(8)} BTC`}
                          />
                          <Tooltip 
                            formatter={(value, name) => {
                              if (name === 'earnings') {
                                return [formatBtc(Number(value)), 'BTC'];
                              }
                              return [value, name];
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="earnings" 
                            stroke="#10B981" 
                            fill="#10B981" 
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Active Devices */}
                  <div className="mt-10">
                    <h3 className="text-md font-medium mb-3">Active Devices</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                          <YAxis 
                            stroke="#6B7280" 
                            fontSize={12}
                            allowDecimals={false}
                          />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="activeDevices" 
                            stroke="#6366F1" 
                            fill="#6366F1" 
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="payouts">
              {payoutsLoading ? (
                <div className="text-center py-6 text-gray-500">
                  Loading payout history...
                </div>
              ) : (payouts as any[]).length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <h3 className="text-lg font-medium mb-2">No payouts yet</h3>
                  <p className="text-sm max-w-md mx-auto">
                    Once you receive payouts, they will be recorded here.
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(payouts as any[]).map((payout: any) => (
                        <TableRow key={payout.id}>
                          <TableCell>
                            {formatDate(payout.timestamp)}
                          </TableCell>
                          <TableCell className="font-mono">
                            {formatBtc(payout.amount)} BTC
                          </TableCell>
                          <TableCell className="font-mono">
                            {payout.txHash ? (
                              <a 
                                href={`https://www.blockchain.com/btc/tx/${payout.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {shortenHash(payout.txHash)}
                              </a>
                            ) : (
                              <span className="text-gray-500">Pending</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={
                              payout.status === 'completed' 
                                ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                                : payout.status === 'pending'
                                  ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                                  : "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
                            }>
                              {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {timeAgo(payout.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
