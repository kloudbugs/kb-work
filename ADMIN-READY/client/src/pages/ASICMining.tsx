import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { MainLayout } from '@/components/layout/MainLayout';

import { ASICModelSelector } from "@/components/ui/ASICModelSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Check, Download, Home, Info, Settings, Shield, Upload, Zap } from "lucide-react";

interface ASICModel {
  type: string;
  name: string;
  hashrate: number;
}

interface Pool {
  id: number;
  name: string;
  url: string;
  algorithm: string;
  priority: number;
}

interface MiningConfig {
  asicType: string;
  poolId: number;
  walletAddress: string;
  frequency?: number;
  fanSpeed?: number;
  overclockEnabled?: boolean;
}

export default function ASICMining() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState<ASICModel | null>(null);
  const [selectedTab, setSelectedTab] = useState("configure");
  const [configureSuccess, setConfigureSuccess] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [configType, setConfigType] = useState<"single" | "multi">("single");

  const { data: pools = [] } = useQuery<Pool[]>({
    queryKey: ['/api/pools'],
    select: (data: any) => data.pools || [],
  });

  // Default values from the authenticated user
  const defaultValues = {
    asicType: "",
    poolId: 0,
    walletAddress: user?.walletAddress || "bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps", // Default Bitcoin wallet address
    frequency: 800,
    fanSpeed: 70,
    overclockEnabled: false
  };

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<MiningConfig>({
    defaultValues
  });

  // Update form when model is selected
  useEffect(() => {
    if (selectedModel) {
      setValue("asicType", selectedModel.type);
    }
  }, [selectedModel, setValue]);

  // ASIC configuration mutation
  const configMutation = useMutation({
    mutationFn: async (data: MiningConfig) => {
      const res = await apiRequest("POST", "/api/mining/asic/configure", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "ASIC Miner Configured",
        description: `Your ${selectedModel?.name} has been configured successfully.`,
      });
      setConfigureSuccess(true);
      
      // Invalidate all relevant queries to refresh mining context
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pools'] });
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
    },
    onError: (error: any) => {
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to configure ASIC miner. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Generate USB package mutation
  const generateUSBMutation = useMutation({
    mutationFn: async (data: MiningConfig) => {
      const res = await apiRequest("POST", "/api/mining/asic/generate-usb", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "USB Package Generated",
        description: `Mining configuration package for ${selectedModel?.name} is ready for download.`,
      });
      setGenerateSuccess(true);
      
      // Invalidate queries to refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pools'] });
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        goToHome();
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate USB package. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Generate multi-miner USB package mutation
  const generateMultiUSBMutation = useMutation({
    mutationFn: async (data: { minerTypes: string[], poolId: number, walletAddress: string }) => {
      const res = await apiRequest("POST", "/api/mining/asic/generate-multi-usb", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Multi-Miner Package Generated",
        description: "Unified mining configuration package for multiple ASIC miners is ready for download.",
      });
      setGenerateSuccess(true);
      
      // Invalidate queries to refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ['/api/mining/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pools'] });
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        goToHome();
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate multi-miner package. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onModelSelect = (model: ASICModel) => {
    setSelectedModel(model);
  };

  const onSubmitConfigure = (data: MiningConfig) => {
    configMutation.mutate(data);
  };

  const onSubmitGenerateUSB = (data: MiningConfig) => {
    generateUSBMutation.mutate(data);
  };

  const onSubmitGenerateMultiUSB = (data: MiningConfig) => {
    // Selected models for multi-miner package
    const minerTypes = ["antminer_s19", "whatsminer_m30", "avalon_a1246"];
    
    generateMultiUSBMutation.mutate({
      minerTypes,
      poolId: data.poolId,
      walletAddress: data.walletAddress
    });
  };
  
  const [, setLocation] = useLocation();
  
  const goToHome = () => {
    setLocation("/");
  };

  return (
    <MainLayout>
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">ASIC Mining Setup</h1>
        <Button 
          variant="outline" 
          onClick={goToHome}
          className="flex items-center gap-2"
        >
          <Home size={16} />
          Home
        </Button>
      </div>
      <p className="text-muted-foreground">
        Configure and deploy high-performance ASIC miners for Bitcoin mining. 
        Select your hardware model, mining pool, and generate configuration packages.
      </p>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hardware">
            <Zap className="mr-2 h-4 w-4" />
            Hardware Selection
          </TabsTrigger>
          <TabsTrigger value="configure">
            <Settings className="mr-2 h-4 w-4" />
            Miner Configuration
          </TabsTrigger>
          <TabsTrigger value="deploy">
            <Upload className="mr-2 h-4 w-4" />
            Deployment
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="hardware" className="mt-6">
          <ASICModelSelector onModelSelect={onModelSelect} selectedModel={selectedModel?.type} />
        </TabsContent>
        
        <TabsContent value="configure" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ASIC Miner Configuration</CardTitle>
              <CardDescription>
                Configure your ASIC miner settings for optimal performance and connect to a mining pool.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmitConfigure)}>
              <CardContent className="space-y-4">
                {selectedModel ? (
                  <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Selected Hardware: {selectedModel.name}</AlertTitle>
                    <AlertDescription>
                      Hash Rate: {selectedModel.hashrate} TH/s
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="mb-4" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Hardware Selected</AlertTitle>
                    <AlertDescription>
                      Please select an ASIC miner model in the Hardware Selection tab.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="poolId">Mining Pool</Label>
                  <Select 
                    defaultValue="" 
                    onValueChange={(value) => setValue("poolId", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mining pool" />
                    </SelectTrigger>
                    <SelectContent>
                      {pools.map((pool) => (
                        <SelectItem key={pool.id} value={pool.id.toString()}>
                          {pool.name} - {pool.algorithm}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.poolId && <p className="text-sm text-destructive">Mining pool is required</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Wallet Address</Label>
                  <Input
                    id="walletAddress"
                    placeholder="Enter your Bitcoin wallet address"
                    {...register("walletAddress", { required: true })}
                  />
                  {errors.walletAddress && <p className="text-sm text-destructive">Wallet address is required</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="frequency">Frequency (MHz)</Label>
                    <span className="text-muted-foreground">{register("frequency").value} MHz</span>
                  </div>
                  <Slider
                    id="frequency"
                    min={600}
                    max={1200}
                    step={25}
                    defaultValue={[800]}
                    onValueChange={(value) => setValue("frequency", value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="fanSpeed">Fan Speed (%)</Label>
                    <span className="text-muted-foreground">{register("fanSpeed").value}%</span>
                  </div>
                  <Slider
                    id="fanSpeed"
                    min={40}
                    max={100}
                    step={5}
                    defaultValue={[70]}
                    onValueChange={(value) => setValue("fanSpeed", value[0])}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="overclockEnabled"
                    checked={register("overclockEnabled").value}
                    onCheckedChange={(checked) => setValue("overclockEnabled", checked)}
                  />
                  <Label htmlFor="overclockEnabled">Enable Overclocking (Advanced)</Label>
                </div>

                {configureSuccess && (
                  <Alert className="mb-4">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Configuration Successful</AlertTitle>
                    <AlertDescription>
                      Your ASIC miner has been configured successfully. Your mining dashboard is ready.
                    </AlertDescription>
                  </Alert>
                )}
                
                {configureSuccess && (
                  <div className="flex justify-center mt-4">
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={goToHome}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={!selectedModel || configMutation.isPending}
                  className="w-full"
                >
                  {configMutation.isPending ? "Configuring..." : "Configure Miner"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="deploy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Miner Deployment</CardTitle>
              <CardDescription>
                Generate configuration packages for your ASIC miners to deploy on physical hardware.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(configType === "single" ? onSubmitGenerateUSB : onSubmitGenerateMultiUSB)}>
              <CardContent className="space-y-4">
                <Tabs defaultValue="single" onValueChange={(value) => setConfigType(value as "single" | "multi")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single">Single Miner</TabsTrigger>
                    <TabsTrigger value="multi">Multi-Miner Package</TabsTrigger>
                  </TabsList>
                  <TabsContent value="single" className="space-y-4 mt-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Single Miner Configuration</AlertTitle>
                      <AlertDescription>
                        Generate a configuration package for a single ASIC miner model.
                      </AlertDescription>
                    </Alert>
                    
                    {selectedModel ? (
                      <Alert variant="default">
                        <Shield className="h-4 w-4" />
                        <AlertTitle>Selected Hardware: {selectedModel.name}</AlertTitle>
                        <AlertDescription>
                          Hash Rate: {selectedModel.hashrate} TH/s
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Hardware Selected</AlertTitle>
                        <AlertDescription>
                          Please select an ASIC miner model in the Hardware Selection tab.
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="multi" className="space-y-4 mt-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Multi-Miner Package</AlertTitle>
                      <AlertDescription>
                        Generate a unified configuration package for multiple ASIC models.
                        This will create configurations for Antminer S19, Whatsminer M30, and Avalon A1246.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>

                <div className="space-y-2">
                  <Label htmlFor="poolId">Mining Pool</Label>
                  <Select 
                    defaultValue="" 
                    onValueChange={(value) => setValue("poolId", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mining pool" />
                    </SelectTrigger>
                    <SelectContent>
                      {pools.map((pool) => (
                        <SelectItem key={pool.id} value={pool.id.toString()}>
                          {pool.name} - {pool.algorithm}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.poolId && <p className="text-sm text-destructive">Mining pool is required</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Wallet Address</Label>
                  <Input
                    id="walletAddress"
                    placeholder="Enter your Bitcoin wallet address"
                    {...register("walletAddress", { required: true })}
                  />
                  {errors.walletAddress && <p className="text-sm text-destructive">Wallet address is required</p>}
                </div>

                {generateSuccess && (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertTitle>Package Generated Successfully</AlertTitle>
                    <AlertDescription>
                      Your mining configuration package is ready. Click the download button below to get your files.
                      <div className="mt-2">
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm"
                          onClick={goToHome}
                        >
                          Return to Dashboard
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  disabled={(configType === "single" && !selectedModel) || 
                           generateUSBMutation.isPending || 
                           generateMultiUSBMutation.isPending}
                  className="w-full"
                >
                  {(generateUSBMutation.isPending || generateMultiUSBMutation.isPending) ? 
                    "Generating..." : 
                    "Generate Configuration Package"}
                </Button>
                
                {generateSuccess && (
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center"
                    onClick={() => {
                      toast({
                        title: "Download Started",
                        description: "Your configuration package download has started.",
                      });
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Configuration Package
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </MainLayout>
  );
}