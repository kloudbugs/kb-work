import { useQuery, useMutation } from "@tanstack/react-query";
import { FaSwimmingPool, FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function MiningPools() {
  const [showAddPool, setShowAddPool] = useState(false);
  const [poolName, setPoolName] = useState('');
  const [poolUrl, setPoolUrl] = useState('');
  const [poolPort, setPoolPort] = useState('');
  const { toast } = useToast();

  const { data: pools } = useQuery({
    queryKey: ['/api/mining/pools'],
  });

  const addPoolMutation = useMutation({
    mutationFn: async (poolData: any) => {
      return apiRequest('POST', '/api/mining/pools', poolData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining/pools'] });
      setShowAddPool(false);
      setPoolName('');
      setPoolUrl('');
      setPoolPort('');
      toast({
        title: "Pool Added",
        description: "Mining pool has been added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add mining pool",
        variant: "destructive",
      });
    },
  });

  const togglePoolMutation = useMutation({
    mutationFn: async ({ poolId, isActive }: { poolId: number; isActive: boolean }) => {
      return apiRequest('PATCH', `/api/mining/pools/${poolId}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining/pools'] });
    },
  });

  const handleAddPool = () => {
    if (!poolName || !poolUrl || !poolPort) return;
    
    addPoolMutation.mutate({
      name: poolName,
      url: poolUrl,
      port: parseInt(poolPort),
      isActive: false,
    });
  };

  return (
    <div className="mining-card p-6">
      <h3 className="text-lg font-semibold mb-6">Mining Pool Connection</h3>
      <div className="space-y-4">
        {pools?.map((pool: any) => (
          <div key={pool.id} className="flex items-center justify-between p-4 bg-elevated rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-bitcoin rounded-lg flex items-center justify-center">
                <FaSwimmingPool className="text-dark-bg" />
              </div>
              <div>
                <div className="font-medium">{pool.name}</div>
                <div className="text-sm text-muted">{pool.url}:{pool.port}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-semibold ${pool.isActive ? 'text-success' : 'text-muted'}`}>
                {pool.isActive ? 'Connected' : 'Inactive'}
              </div>
              <div className="text-xs text-muted">
                {pool.isActive ? 'Latency: 45ms' : 'Ready'}
              </div>
            </div>
          </div>
        ))}

        <Dialog open={showAddPool} onOpenChange={setShowAddPool}>
          <DialogTrigger asChild>
            <Button className="w-full bg-bitcoin hover:bg-bitcoin/80 text-dark-bg font-semibold">
              <FaPlus className="mr-2" />
              Add Mining Pool
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card-bg border-border text-white">
            <DialogHeader>
              <DialogTitle>Add Mining Pool</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="poolName">Pool Name</Label>
                <Input
                  id="poolName"
                  value={poolName}
                  onChange={(e) => setPoolName(e.target.value)}
                  placeholder="e.g., F2Pool"
                  className="bg-elevated border-border"
                />
              </div>
              <div>
                <Label htmlFor="poolUrl">Pool URL</Label>
                <Input
                  id="poolUrl"
                  value={poolUrl}
                  onChange={(e) => setPoolUrl(e.target.value)}
                  placeholder="e.g., stratum+tcp://btc.f2pool.com"
                  className="bg-elevated border-border"
                />
              </div>
              <div>
                <Label htmlFor="poolPort">Port</Label>
                <Input
                  id="poolPort"
                  type="number"
                  value={poolPort}
                  onChange={(e) => setPoolPort(e.target.value)}
                  placeholder="e.g., 1314"
                  className="bg-elevated border-border"
                />
              </div>
              <Button 
                onClick={handleAddPool}
                disabled={addPoolMutation.isPending}
                className="w-full bg-bitcoin hover:bg-bitcoin/80 text-dark-bg"
              >
                {addPoolMutation.isPending ? 'Adding...' : 'Add Pool'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
