import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAsicTypes } from '@/lib/miningClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Cpu, Zap, Gauge, Fan, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ASICModelComparison() {
  const { toast } = useToast();
  const { data: asicTypes, isLoading } = useQuery({
    queryKey: ['/api/mining/asic/types'],
    queryFn: getAsicTypes
  });

  // Get only top TH/s models (more than 100 TH/s)
  const topModels = asicTypes?.filter((model: any) => 
    model.hashrate >= 100
  ).sort((a: any, b: any) => b.hashrate - a.hashrate);

  // Helper function to calculate efficiency (TH/s per watt)
  const calculateEfficiency = (hashrate: number, power: number) => {
    if (!power) return 0;
    return (hashrate / power).toFixed(4);
  };

  // Compare models
  const handleCompare = (model: any) => {
    const efficiency = model.powerConsumption ? 
      calculateEfficiency(model.hashrate, model.powerConsumption) : 
      'N/A';
    
    toast({
      title: `${model.name} Details`,
      description: `Hashrate: ${model.hashrate} TH/s, Power: ${model.powerConsumption}W, Efficiency: ${efficiency} TH/s per watt`,
      variant: 'default',
    });
  };

  // For display purposes, we'll define power values if they're not available in the API response
  const getPowerConsumption = (model: any) => {
    if (model.powerConsumption) return model.powerConsumption;
    
    // Default power consumption values based on model type
    const defaultPower: {[key: string]: number} = {
      'antminer_s19_xp': 3010,
      'antminer_s19_pro': 3250,
      'antminer_s19j_pro': 3050,
      'whatsminer_m50': 3276,
      'whatsminer_m30s++': 3400,
      'avalon_a1366': 3500,
      'avalon_a1246': 3420
    };
    
    return defaultPower[model.type] || 3200; // Default fallback
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cpu className="h-5 w-5 mr-2 text-primary" />
          High Performance ASIC Model Comparison
        </CardTitle>
        <CardDescription>
          Compare the most powerful ASIC miners with TH/s-level performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : topModels && topModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topModels.map((model: any) => {
              const power = getPowerConsumption(model);
              const efficiency = calculateEfficiency(model.hashrate, power);
              
              return (
                <Card key={model.type} className="flex flex-col h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{model.name}</CardTitle>
                        <CardDescription>{model.type.replace(/_/g, ' ')}</CardDescription>
                      </div>
                      <Badge variant={model.hashrate > 140 ? "destructive" : (model.hashrate > 110 ? "default" : "secondary")}>
                        {model.hashrate} TH/s
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 mr-2 text-amber-500" />
                          <span className="text-sm">{power}W</span>
                        </div>
                        <div className="flex items-center">
                          <Gauge className="h-4 w-4 mr-2 text-emerald-500" />
                          <span className="text-sm">{efficiency} TH/W</span>
                        </div>
                        <div className="flex items-center">
                          <Fan className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-sm">Cooling: High</span>
                        </div>
                        <div className="flex items-center">
                          <Terminal className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="text-sm">Advanced</span>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-4">
                          {model.hashrate > 130 
                            ? "Industry-leading performance with optimized power efficiency." 
                            : "High-performance mining hardware for professional operations."}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleCompare(model)}
                        >
                          Compare
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            No high-performance ASIC models found. Try refreshing or check your connection.
          </div>
        )}
      </CardContent>
    </Card>
  );
}