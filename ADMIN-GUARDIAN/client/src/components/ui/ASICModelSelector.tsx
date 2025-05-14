import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Switch } from "./switch";
import { Label } from "./label";
import { Badge } from "./badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Info, Zap, Server, Circle, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ASICModel {
  type: string;
  name: string;
  hashrate: number;
}

interface ASICModelSelectorProps {
  onModelSelect?: (model: ASICModel) => void;
  selectedModel?: string;
}

export function ASICModelSelector({ onModelSelect, selectedModel }: ASICModelSelectorProps) {
  const [asicModels, setAsicModels] = useState<ASICModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manufacturerFilter, setManufacturerFilter] = useState<string>('all');
  const { toast } = useToast();

  // Load ASIC models from API
  useEffect(() => {
    const fetchASICModels = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('GET', '/api/mining/asic/types');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setAsicModels(data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Failed to load ASIC models:", error);
        setError("Failed to load ASIC models. Please try again later.");
        toast({
          title: "Error Loading ASIC Models",
          description: "Could not fetch the available ASIC models.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchASICModels();
  }, [toast]);

  // Filter ASIC models by manufacturer
  const filteredModels = manufacturerFilter === 'all'
    ? asicModels
    : asicModels.filter(model => model.type.toLowerCase().includes(manufacturerFilter));

  // Group models by manufacturer
  const manufacturers = Array.from(new Set(asicModels.map(model => {
    if (model.type.includes('antminer')) return 'antminer';
    if (model.type.includes('whatsminer')) return 'whatsminer';
    if (model.type.includes('avalon')) return 'avalon';
    if (model.type.includes('innosilicon')) return 'innosilicon';
    return 'other';
  })));

  const handleModelSelect = (model: ASICModel) => {
    if (onModelSelect) {
      onModelSelect(model);
    }
    
    toast({
      title: `${model.name} Selected`,
      description: `Mining configuration set for ${model.hashrate} TH/s performance.`,
    });
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loading ASIC Models...</CardTitle>
          <CardDescription>Please wait while we fetch available mining hardware.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive" />
            Error Loading ASIC Models
          </CardTitle>
          <CardDescription>We encountered a problem while fetching available mining hardware.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          ASIC Mining Hardware
        </CardTitle>
        <CardDescription>
          Select your preferred ASIC mining hardware for optimal performance.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setManufacturerFilter}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Models</TabsTrigger>
            {manufacturers.map(manufacturer => (
              <TabsTrigger key={manufacturer} value={manufacturer}>
                {manufacturer.charAt(0).toUpperCase() + manufacturer.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModels.map((model) => (
                <ModelCard 
                  key={model.type} 
                  model={model} 
                  isSelected={selectedModel === model.type}
                  onSelect={() => handleModelSelect(model)}
                />
              ))}
            </div>
          </TabsContent>
          
          {manufacturers.map(manufacturer => (
            <TabsContent key={manufacturer} value={manufacturer} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModels.map((model) => (
                  <ModelCard 
                    key={model.type} 
                    model={model} 
                    isSelected={selectedModel === model.type}
                    onSelect={() => handleModelSelect(model)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex items-center space-x-2">
          <Switch id="advanced-mode" />
          <Label htmlFor="advanced-mode">Advanced Configuration</Label>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
}

interface ModelCardProps {
  model: ASICModel;
  isSelected: boolean;
  onSelect: () => void;
}

function ModelCard({ model, isSelected, onSelect }: ModelCardProps) {
  // Performance category based on hashrate
  let performanceCategory: 'entry' | 'mid' | 'high' | 'ultra';
  if (model.hashrate < 30) performanceCategory = 'entry';
  else if (model.hashrate < 70) performanceCategory = 'mid';
  else if (model.hashrate < 120) performanceCategory = 'high';
  else performanceCategory = 'ultra';
  
  // Badge color based on performance
  const badgeVariant = {
    entry: 'secondary',
    mid: 'default',
    high: 'outline',
    ultra: 'destructive'
  }[performanceCategory] as 'secondary' | 'default' | 'outline' | 'destructive';
  
  // Performance label
  const performanceLabel = {
    entry: 'Entry Level',
    mid: 'Mid-Range',
    high: 'High Performance',
    ultra: 'Ultra Performance'
  }[performanceCategory];

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${isSelected ? 'border-primary ring-2 ring-primary ring-opacity-50' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          {model.name}
          {isSelected && <Circle className="h-4 w-4 fill-primary text-primary" />}
        </CardTitle>
        <CardDescription className="flex justify-between">
          <span>{model.type}</span>
          <Badge variant={badgeVariant}>{performanceLabel}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-lg font-semibold">
            <Zap className="h-5 w-5 text-yellow-500" />
            {model.hashrate} TH/s
          </div>
          <div className="text-muted-foreground text-sm">
            SHA-256 Algorithm
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={isSelected ? "default" : "outline"} 
          className="w-full"
          onClick={onSelect}
        >
          {isSelected ? "Selected" : "Select Model"}
        </Button>
      </CardFooter>
    </Card>
  );
}