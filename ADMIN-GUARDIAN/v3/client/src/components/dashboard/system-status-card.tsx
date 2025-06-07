import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMining } from "@/contexts/mining-context";

export default function SystemStatusCard() {
  const { hardwareStatus, laptopInfo } = useMining();
  
  // Default values in case data hasn't loaded yet
  const gpuTemp = hardwareStatus?.gpuTemp || 0;
  const gpuUtilization = hardwareStatus?.gpuUtilization || 0;
  const powerConsumption = hardwareStatus?.powerConsumption || 0;
  
  // Calculate percentages for progress bars
  const gpuTempPercentage = Math.min(100, (gpuTemp / 100) * 100);
  const gpuUtilizationPercentage = gpuUtilization;
  const powerConsumptionPercentage = Math.min(100, (powerConsumption / 200) * 100); // Assuming 200W max
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-neutral-900">System Status</h2>
          <div className="flex">
            {laptopInfo?.model && (
              <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full mr-2 flex items-center">
                <i className="fas fa-laptop-code mr-1 text-neutral-700"></i>
                <span>{laptopInfo.model}</span>
              </span>
            )}
            {laptopInfo?.gpu && (
              <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full flex items-center">
                <i className="fas fa-microchip mr-1 text-neutral-700"></i>
                <span>{laptopInfo.gpu}</span>
              </span>
            )}
          </div>
        </div>
        
        {(gpuTemp > 0 || gpuUtilization > 0 || powerConsumption > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-100 p-3 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-neutral-600 text-sm">GPU Temperature</span>
                <span className="text-primary font-medium text-sm">{gpuTemp}°C</span>
              </div>
              <Progress value={gpuTempPercentage} className="h-2 bg-neutral-200" />
            </div>
            
            <div className="bg-neutral-100 p-3 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-neutral-600 text-sm">GPU Utilization</span>
                <span className="text-primary font-medium text-sm">{gpuUtilization}%</span>
              </div>
              <Progress value={gpuUtilizationPercentage} className="h-2 bg-neutral-200" />
            </div>
            
            <div className="bg-neutral-100 p-3 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-neutral-600 text-sm">Power Consumption</span>
                <span className="text-primary font-medium text-sm">{powerConsumption}W</span>
              </div>
              <Progress value={powerConsumptionPercentage} className="h-2 bg-neutral-200" />
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            <p>Hardware monitoring data will appear here when mining is active</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
