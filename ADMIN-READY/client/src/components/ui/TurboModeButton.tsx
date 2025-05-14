import { Button } from "@/components/ui/button";
import { Zap, Power, AlertTriangle, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import { optimizeAllDevices, type OptimizationLevel } from '@/lib/miningClient';

interface ModeOption {
  id: string;
  name: string;
  description: string;
  hashRate: string;
  model: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
}

export function TurboModeButton() {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>("turbo");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const modeOptions: ModeOption[] = [
    {
      id: "low",
      name: "Eco Mode",
      description: "Energy-efficient mining with lower performance",
      hashRate: "13-14 TH/s",
      model: "Antminer S9",
      icon: <Power className="h-8 w-8" />,
      color: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      id: "medium",
      name: "Balanced Mode",
      description: "Optimal balance between performance and efficiency",
      hashRate: "90-100 TH/s",
      model: "Antminer S19",
      icon: <Zap className="h-8 w-8" />,
      color: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      id: "high",
      name: "Performance Mode",
      description: "High-performance mining with increased hash rates",
      hashRate: "120-130 TH/s",
      model: "Whatsminer M50",
      icon: <Zap className="h-8 w-8" />,
      color: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      id: "turbo",
      name: "Turbo Mode",
      description: "Maximum performance mining with top-tier ASIC simulation",
      hashRate: "140-150 TH/s",
      model: "Antminer S19 XP",
      icon: <Zap className="h-8 w-8" />,
      color: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-red-600 dark:text-red-400"
    }
  ];

  const applyOptimization = async () => {
    setIsLoading(true);
    try {
      // Use our updated optimizeAllDevices function which returns the parsed JSON response
      const data = await optimizeAllDevices(selectedMode as OptimizationLevel);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      // Also refresh wallet data to show updated balance after optimization rewards
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      
      // Add reward information to the toast notification
      const rewardMessage = data.rewardAdded 
        ? ` Mining reward of ${data.rewardAdded} satoshis added to your wallet!` 
        : '';
      
      toast({
        title: `${modeOptions.find(m => m.id === selectedMode)?.name} Activated!`,
        description: `Your devices are now mining at ${
          typeof data.totalHashRateTH === 'string' 
            ? parseFloat(data.totalHashRateTH).toFixed(2) 
            : (typeof data.totalHashRateTH === 'number' 
                ? data.totalHashRateTH.toFixed(2) 
                : '0.00')
        } TH/s with the ${data.asicModel} simulation.${rewardMessage}`,
        variant: "default",
      });
      
      setShowDialog(false);
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Could not apply the selected optimization mode",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setShowDialog(true)} 
        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
      >
        <Zap className="mr-2 h-4 w-4" />
        Turbo Mode
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Mining Optimization Center</DialogTitle>
            <DialogDescription>
              Select a mining optimization profile to enhance your mining performance
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {modeOptions.map((mode) => (
              <Card 
                key={mode.id} 
                className={`cursor-pointer transition-all ${
                  selectedMode === mode.id 
                    ? `border-2 ${mode.textColor} ring-2 ring-offset-2 ring-offset-background ${mode.textColor.replace('text', 'ring')}`
                    : 'border hover:border-primary'
                }`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <CardContent className="p-4 flex flex-col items-center space-y-3">
                  <div className={`p-3 rounded-full ${mode.color} ${mode.textColor}`}>
                    {mode.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold">{mode.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mode.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline" className={mode.textColor}>
                      {mode.hashRate}
                    </Badge>
                    <Badge variant="outline">
                      {mode.model}
                    </Badge>
                  </div>
                  {selectedMode === mode.id && (
                    <div className={`absolute top-2 right-2 ${mode.textColor}`}>
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedMode === "turbo" && (
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-md flex items-start gap-2 text-amber-600 dark:text-amber-400 text-sm">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Turbo Mode:</strong> Simulates maximum performance using top-tier ASIC miner characteristics. This mode maximizes mining rewards but may increase resource usage.
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={applyOptimization}
              className={`${selectedMode === 'turbo' ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Optimizing...
                </>
              ) : (
                <>Apply Optimization</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}