import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMining } from "@/contexts/mining-context";
import { formatDate } from "@/lib/utils";

export default function MiningRewards() {
  const { rewards } = useMining();
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Mining Rewards</h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-neutral-100">
              <TableRow>
                <TableHead className="font-medium text-neutral-700">Date</TableHead>
                <TableHead className="font-medium text-neutral-700">Type</TableHead>
                <TableHead className="font-medium text-neutral-700">Amount</TableHead>
                <TableHead className="font-medium text-neutral-700">Status</TableHead>
                <TableHead className="font-medium text-neutral-700">Transaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-neutral-200">
              {rewards && rewards.length > 0 ? (
                rewards.map((reward, index) => (
                  <TableRow key={index}>
                    <TableCell className="py-3 px-4 text-sm text-neutral-800">
                      {formatDate(reward.date)}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm text-neutral-800">
                      {reward.type}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm text-success font-medium">
                      {reward.amount.toFixed(5)} BTC
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      {reward.status === "confirmed" ? (
                        <span className="px-2 py-1 bg-green-100 text-success text-xs rounded-full">
                          Confirmed
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-warning text-xs rounded-full">
                          Pending
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm text-neutral-800 font-mono">
                      {reward.transactionId ? (
                        <a
                          href={`https://www.blockchain.com/btc/tx/${reward.transactionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {reward.transactionId.substring(0, 6)}...
                          {reward.transactionId.substring(reward.transactionId.length - 4)}
                        </a>
                      ) : (
                        "Pending"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-neutral-500">
                    No rewards yet. Start mining to earn Bitcoin.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
