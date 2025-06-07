import { useQuery, useMutation } from "@tanstack/react-query";
import { FaMicrochip, FaPlus, FaPowerOff, FaPlay, FaPause } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMining } from "@/hooks/use-mining";

export default function HardwareControl() {
  const [miningIntensity, setMiningIntensity] = useState([70]);
  const [workerName, setWorkerName] = useState('worker_001');
  const [autoRestart, setAutoRestart] = useState(true);
  const { isMining, startMining, stopMining } = useMining();

  const { data: hardware } = useQuery({
    queryKey: ['/api/mining/hardware'],
  });

  const toggleHardwareMutation = useMutation({
    mutationFn: async ({ hardwareId, isActive }: { hardwareId: number; isActive: boolean }) => {
      return apiRequest('PATCH', `/api/mining/hardware/${hardwareId}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining/hardware'] });
    },
  });

  const detectGPUMutation = useMutation({
    mutationFn: async () => {
      // Simulate GPU detection
      return apiRequest('POST', '/api/mining/hardware', {
        name: 'GPU Mining (RTX 4090)',
        type: 'gpu',
        hashrate: 850.5,
        power: 450,
        temperature: 72,
        isActive: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining/hardware'] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Hardware Status */}
      <div className="mining-card p-6">
        <h3 className="text-lg font-semibold mb-6">Mining Hardware</h3>
        <div className="space-y-4">
          {hardware?.map((device: any) => (
            <div key={device.id} className="flex items-center justify-between p-4 bg-elevated rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-bitcoin rounded-lg flex items-center justify-center">
                  <FaMicrochip className="text-dark-bg text-lg" />
                </div>
                <div>
                  <div className="font-medium">{device.name}</div>
                  <div className="text-sm text-muted">{device.type.toUpperCase()} Mining</div>
                  <div className="text-xs text-success">{device.hashrate} MH/s</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-muted">Temperature</div>
                  <div className="font-semibold">{device.temperature}°C</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted">Power</div>
                  <div className="font-semibold">{device.power}W</div>
                </div>
                <Button
                  size="sm"
                  className={`w-12 h-12 rounded-lg ${
                    device.isActive 
                      ? 'bg-success hover:bg-success/80' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  onClick={() => toggleHardwareMutation.mutate({
                    hardwareId: device.id,
                    isActive: !device.isActive
                  })}
                >
                  <FaPowerOff className="text-white" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between p-4 bg-elevated rounded-lg border-2 border-dashed border-border">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                <FaPlus className="text-gray-400" />
              </div>
              <div>
                <div className="font-medium text-muted">Add GPU Mining</div>
                <div className="text-sm text-muted">Connect compatible graphics cards</div>
              </div>
            </div>
            <Button 
              onClick={() => detectGPUMutation.mutate()}
              disabled={detectGPUMutation.isPending}
              className="bg-bitcoin hover:bg-bitcoin/80 text-dark-bg font-semibold"
            >
              {detectGPUMutation.isPending ? 'Detecting...' : 'Detect GPU'}
            </Button>
          </div>
        </div>
      </div>

      {/* Mining Controls */}
      <div className="mining-card p-6">
        <h3 className="text-lg font-semibold mb-6">Mining Controls</h3>
        <div className="space-y-6">
          <div className="text-center">
            <Button
              size="lg"
              className={`w-20 h-20 rounded-full text-2xl mb-4 ${
                isMining 
                  ? 'bg-error hover:bg-error/80' 
                  : 'bg-success hover:bg-success/80'
              }`}
              onClick={isMining ? stopMining : startMining}
            >
              {isMining ? <FaPause className="text-white" /> : <FaPlay className="text-white" />}
            </Button>
            <div className="text-sm text-muted">
              Click to {isMining ? 'pause' : 'start'} mining
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="block text-sm text-muted mb-2">Mining Intensity</Label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted">Low</span>
                <Slider
                  value={miningIntensity}
                  onValueChange={setMiningIntensity}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted">High</span>
              </div>
              <div className="text-xs text-center text-muted mt-1">
                Current: {miningIntensity[0]}%
              </div>
            </div>

            <div>
              <Label className="block text-sm text-muted mb-2">Worker Name</Label>
              <Input
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                className="bg-elevated border-border"
              />
            </div>

            <div>
              <Label className="block text-sm text-muted mb-2">Auto-restart on disconnect</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={autoRestart}
                  onCheckedChange={(checked) => setAutoRestart(checked as boolean)}
                />
                <span className="text-sm">Enable auto-restart</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
