import React, { useState, useEffect } from 'react';
import { Scroll, Clock, Hash, Check, AlertCircle, RefreshCw, Users, Award, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import axios from 'axios';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'share' | 'connection' | 'reward' | 'error' | 'system';
  message: string;
  details?: string;
  hashrate?: number;
  shares?: number;
  difficulty?: number;
  status?: 'success' | 'warning' | 'error' | 'info';
}

const MiningLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  // Simulate fetching logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Try to fetch from API first
        const response = await axios.get('/api/mining/logs');
        if (response.data && Array.isArray(response.data)) {
          setLogs(response.data);
        } else {
          // If API fails or returns invalid data, use simulated data
          generateSimulatedLogs();
        }
      } catch (error) {
        console.error("Failed to fetch mining logs:", error);
        // Use simulated data as fallback
        generateSimulatedLogs();
      } finally {
        setLoading(false);
      }
    };

    const generateSimulatedLogs = () => {
      // Generate some sample log entries if API is not yet available
      const sampleLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 35000).toISOString(),
          type: 'share',
          message: 'Share accepted',
          details: 'Difficulty 2.5, worker: rig01',
          hashrate: 8750,
          shares: 1,
          difficulty: 2.5,
          status: 'success'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          type: 'connection',
          message: 'Connected to pool',
          details: 'stratum+tcp://kloudbug.mining.com:3333',
          status: 'info'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 180000).toISOString(),
          type: 'reward',
          message: 'Block reward received',
          details: '0.00012500 BTC',
          status: 'success'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 240000).toISOString(),
          type: 'error',
          message: 'Connection timeout',
          details: 'Attempting reconnect...',
          status: 'error'
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: 'system',
          message: 'GPU temperature high',
          details: 'GPU #2: 82°C',
          status: 'warning'
        },
        {
          id: '6',
          timestamp: new Date(Date.now() - 55000).toISOString(),
          type: 'share',
          message: 'Share accepted',
          details: 'Difficulty 2.8, worker: rig03',
          hashrate: 9150,
          shares: 1,
          difficulty: 2.8,
          status: 'success'
        },
        {
          id: '7',
          timestamp: new Date(Date.now() - 75000).toISOString(),
          type: 'share',
          message: 'Share rejected',
          details: 'Invalid solution, worker: rig02',
          status: 'error'
        },
        {
          id: '8',
          timestamp: new Date(Date.now() - 15000).toISOString(),
          type: 'connection',
          message: 'New miner connected',
          details: 'Worker: rig04',
          status: 'info'
        },
        {
          id: '9',
          timestamp: new Date(Date.now() - 6000).toISOString(),
          type: 'system',
          message: 'Mining service restarted',
          details: 'Scheduled maintenance complete',
          status: 'info'
        },
        {
          id: '10',
          timestamp: new Date(Date.now() - 450000).toISOString(),
          type: 'reward',
          message: 'Pool payout processed',
          details: '0.00035000 BTC transferred to wallet',
          status: 'success'
        }
      ];
      
      setLogs(sampleLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    };

    fetchLogs();

    // Set up a refresh interval
    const interval = setInterval(() => {
      fetchLogs();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.type === filter);

  // Get icon based on log type
  const getIcon = (type: string, status?: string) => {
    switch (type) {
      case 'share':
        return status === 'error' ? <AlertCircle className="h-4 w-4 text-red-500" /> : <Check className="h-4 w-4 text-green-500" />;
      case 'connection':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'reward':
        return <Award className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'system':
        return status === 'warning' 
          ? <AlertCircle className="h-4 w-4 text-yellow-500" /> 
          : <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <Scroll className="h-4 w-4" />;
    }
  };

  // Get background color based on log status
  const getLogBackground = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/10 border-red-500/30';
      case 'info':
      default:
        return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  // Format timestamps for better readability
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Format numbers with commas
  const formatNumber = (num?: number) => {
    if (num === undefined) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Card className="border border-slate-200/20 bg-black/40 backdrop-blur-xl shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Scroll className="h-5 w-5 text-indigo-400" />
            Mining Logs
          </CardTitle>
          <div className="flex gap-2">
            <Badge 
              onClick={() => setFilter('all')} 
              className={cn(
                "cursor-pointer hover:bg-slate-700", 
                filter === 'all' ? "bg-indigo-600" : "bg-slate-800"
              )}
            >
              All
            </Badge>
            <Badge 
              onClick={() => setFilter('share')} 
              className={cn(
                "cursor-pointer hover:bg-slate-700", 
                filter === 'share' ? "bg-indigo-600" : "bg-slate-800"
              )}
            >
              Shares
            </Badge>
            <Badge 
              onClick={() => setFilter('reward')} 
              className={cn(
                "cursor-pointer hover:bg-slate-700", 
                filter === 'reward' ? "bg-indigo-600" : "bg-slate-800"
              )}
            >
              Rewards
            </Badge>
            <Badge 
              onClick={() => setFilter('error')} 
              className={cn(
                "cursor-pointer hover:bg-slate-700", 
                filter === 'error' ? "bg-indigo-600" : "bg-slate-800"
              )}
            >
              Errors
            </Badge>
            <Badge 
              onClick={() => setFilter('system')} 
              className={cn(
                "cursor-pointer hover:bg-slate-700", 
                filter === 'system' ? "bg-indigo-600" : "bg-slate-800"
              )}
            >
              System
            </Badge>
            <Badge 
              onClick={() => setFilter('connection')} 
              className={cn(
                "cursor-pointer hover:bg-slate-700", 
                filter === 'connection' ? "bg-indigo-600" : "bg-slate-800"
              )}
            >
              Connection
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3">
            <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
            <p className="text-slate-400">Loading logs...</p>
          </div>
        ) : (
          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-2">
              {filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 gap-3">
                  <Scroll className="h-8 w-8 text-slate-400" />
                  <p className="text-slate-400">No logs found</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className={cn(
                      "p-3 rounded-md border flex items-start gap-3 text-sm",
                      getLogBackground(log.status)
                    )}
                  >
                    <div className="mt-0.5">{getIcon(log.type, log.status)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{log.message}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      {log.details && (
                        <p className="text-xs text-slate-300 mt-1">{log.details}</p>
                      )}
                      {log.hashrate && (
                        <div className="mt-2 flex gap-3 text-xs">
                          <span className="flex items-center gap-1 text-indigo-300">
                            <Hash className="h-3 w-3" />
                            {formatNumber(log.hashrate)} H/s
                          </span>
                          {log.difficulty && (
                            <span className="flex items-center gap-1 text-teal-300">
                              <ArrowUp className="h-3 w-3" />
                              Diff: {log.difficulty}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default MiningLogs;