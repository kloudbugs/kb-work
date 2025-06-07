import { useQuery } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function ActivityLog() {
  const { data: logs } = useQuery({
    queryKey: ['/api/activity/logs'],
    refetchInterval: 5000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-success';
      case 'warning':
        return 'bg-bitcoin';
      case 'error':
        return 'bg-error';
      default:
        return 'bg-muted';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="mining-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Mining Activity Log</h3>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted hover:text-white"
        >
          <FaTrash className="mr-1" />
          Clear Logs
        </Button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {logs?.map((log: any) => (
          <div key={log.id} className="flex items-center justify-between p-3 bg-elevated rounded text-sm">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(log.status)}`} />
              <span>{log.message}</span>
            </div>
            <span className="text-muted text-xs">
              {formatTime(log.timestamp)}
            </span>
          </div>
        ))}
        
        {(!logs || logs.length === 0) && (
          <div className="text-center text-muted py-8">
            No activity logs yet. Start mining to see activity.
          </div>
        )}
      </div>
    </div>
  );
}
