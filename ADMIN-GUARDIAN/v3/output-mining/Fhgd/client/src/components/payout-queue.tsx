import { useQuery } from "@tanstack/react-query";
import { FaBitcoin, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

export default function PayoutQueue() {
  const { data: payouts = [] } = useQuery({
    queryKey: ['/api/wallet/automatic-payouts'],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'processing':
        return <FaBitcoin className="text-blue-500 animate-spin" />;
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'failed':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'processing':
        return 'bg-blue-500/20 text-blue-500';
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      case 'failed':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  if (!payouts.length) {
    return (
      <div className="mining-card p-6">
        <h3 className="text-lg font-semibold mb-4">Automatic Payout Queue</h3>
        <div className="text-center py-8">
          <FaBitcoin className="mx-auto text-4xl text-bitcoin/50 mb-4" />
          <p className="text-muted">No automatic payouts yet</p>
          <p className="text-sm text-muted/70">Start mining to see payouts here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mining-card p-6">
      <h3 className="text-lg font-semibold mb-4">Automatic Payout Queue</h3>
      <div className="space-y-3">
        {payouts.map((payout: any) => (
          <div key={payout.id} className="p-4 bg-elevated rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(payout.status)}
                <span className="font-medium">{payout.amount?.toFixed(8)} BTC</span>
              </div>
              <Badge className={getStatusColor(payout.status)}>
                {payout.status.toUpperCase()}
              </Badge>
            </div>
            <div className="text-sm text-muted space-y-1">
              <div className="font-mono text-xs break-all">
                To: {payout.address}
              </div>
              {payout.transactionId && (
                <div className="font-mono text-xs">
                  TX: {payout.transactionId}
                </div>
              )}
              <div className="text-xs">
                {new Date(payout.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}