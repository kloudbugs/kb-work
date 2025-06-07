import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { Cloud, Server, AlertCircle, CheckCircle, RefreshCw, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CloudMiningService {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  hashrate: number;
  contract: {
    duration: string;
    expiresAt: string;
    price: number;
  };
  profitability: {
    daily: number;
    monthly: number;
  };
  lastPayout: {
    amount: number;
    timestamp: string;
  };
  apiKey?: string;
}

// Mock data for development - will be replaced with real API responses
const MOCK_CLOUD_SERVICES: CloudMiningService[] = [
  {
    id: 'nicehash1',
    name: 'NiceHash',
    status: 'active',
    hashrate: 23500,
    contract: {
      duration: '30 days',
      expiresAt: '2025-06-21',
      price: 0.023
    },
    profitability: {
      daily: 0.00008,
      monthly: 0.0024
    },
    lastPayout: {
      amount: 0.00012,
      timestamp: '2025-05-20T13:45:00Z'
    }
  },
  {
    id: 'unmineable1',
    name: 'Unmineable',
    status: 'active',
    hashrate: 18700,
    contract: {
      duration: '60 days',
      expiresAt: '2025-07-21',
      price: 0.034
    },
    profitability: {
      daily: 0.00006,
      monthly: 0.0018
    },
    lastPayout: {
      amount: 0.00009,
      timestamp: '2025-05-20T10:15:00Z'
    }
  },
  {
    id: 'mining-rig-rentals1',
    name: 'Mining Rig Rentals',
    status: 'inactive',
    hashrate: 0,
    contract: {
      duration: 'On-demand',
      expiresAt: 'N/A',
      price: 0.01
    },
    profitability: {
      daily: 0.0,
      monthly: 0.0
    },
    lastPayout: {
      amount: 0.00004,
      timestamp: '2025-05-15T22:30:00Z'
    }
  }
];

export function CloudMiningPanel() {
  const [cloudServices, setCloudServices] = useState<CloudMiningService[]>(MOCK_CLOUD_SERVICES);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState<boolean>(false);
  const [serviceToActivate, setServiceToActivate] = useState<string | null>(null);
  const { toast } = useToast();

  const activateService = async (serviceId: string) => {
    setIsLoading(true);
    try {
      const service = cloudServices.find(s => s.id === serviceId);
      
      if (!service?.apiKey) {
        setServiceToActivate(serviceId);
        setIsApiKeyDialogOpen(true);
        setIsLoading(false);
        return;
      }
      
      // API call would go here
      await apiRequest({
        url: '/api/mining/cloud/activate',
        method: 'POST',
        data: { serviceId, apiKey: service.apiKey }
      });
      
      // Update the local state
      setCloudServices(prev => prev.map(s => 
        s.id === serviceId ? { ...s, status: 'active' } : s
      ));
      
      toast({
        title: "Cloud Mining Activated",
        description: `${service.name} has been successfully activated.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to activate cloud mining service:", error);
      toast({
        title: "Activation Failed",
        description: "Unable to activate cloud mining service. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateService = async (serviceId: string) => {
    setIsLoading(true);
    try {
      const service = cloudServices.find(s => s.id === serviceId);
      
      // API call would go here
      await apiRequest({
        url: '/api/mining/cloud/deactivate',
        method: 'POST',
        data: { serviceId }
      });
      
      // Update the local state
      setCloudServices(prev => prev.map(s => 
        s.id === serviceId ? { ...s, status: 'inactive' } : s
      ));
      
      toast({
        title: "Cloud Mining Deactivated",
        description: `${service?.name} has been successfully deactivated.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to deactivate cloud mining service:", error);
      toast({
        title: "Deactivation Failed",
        description: "Unable to deactivate cloud mining service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = (serviceId: string) => {
    if (!apiKeyInput.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the local state with the API key
    setCloudServices(prev => prev.map(s => 
      s.id === serviceId ? { ...s, apiKey: apiKeyInput } : s
    ));
    
    setApiKeyInput('');
    setIsApiKeyDialogOpen(false);
    
    // Activate the service with the new API key
    activateService(serviceId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Cloud Mining Services</h2>
          <p className="text-sm text-muted-foreground">Connect to third-party cloud mining services</p>
        </div>
        <Button 
          size="sm" 
          onClick={() => {
            // This would refresh the cloud services from the API
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              toast({
                title: "Refreshed",
                description: "Cloud mining services have been refreshed.",
              });
            }, 1000);
          }}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cloudServices.map((service) => (
          <Card 
            key={service.id} 
            className={`${service.status === 'active' ? 'border-cyber-gold' : service.status === 'maintenance' ? 'border-amber-500' : ''}`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">{service.name}</CardTitle>
                <div className={`h-3 w-3 rounded-full ${
                  service.status === 'active' ? 'bg-green-500' : 
                  service.status === 'maintenance' ? 'bg-amber-500' : 'bg-gray-300'
                }`} />
              </div>
              <CardDescription>
                {service.status === 'active' ? 'Active - Mining in progress' : 
                 service.status === 'maintenance' ? 'Maintenance - Service temporarily unavailable' : 
                 'Inactive - Click to activate'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hashrate:</span>
                  <span className="font-medium">{service.hashrate.toLocaleString()} MH/s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Profit:</span>
                  <span className="font-medium">{service.profitability.daily.toFixed(8)} BTC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contract:</span>
                  <span className="font-medium">{service.contract.duration}</span>
                </div>
                {service.status === 'active' && (
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground mb-1">Mining Progress</div>
                    <Progress value={65} className="h-2" />
                    <div className="text-xs text-right mt-1">65% until next payout</div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {service.status === 'active' ? (
                <Button 
                  onClick={() => deactivateService(service.id)} 
                  variant="outline" 
                  size="sm"
                  className="w-full border-space-purple/30 text-cosmic-blue"
                  disabled={isLoading}
                >
                  Deactivate
                </Button>
              ) : service.status === 'maintenance' ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  disabled={true}
                >
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                  Under Maintenance
                </Button>
              ) : (
                <Button 
                  onClick={() => activateService(service.id)} 
                  size="sm"
                  className="w-full bg-cyan-700 hover:bg-cyan-600 text-white"
                  disabled={isLoading}
                >
                  <Cloud className="h-4 w-4 mr-2" />
                  Activate
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Add New Cloud Mining Service Card */}
      <Card className="border-dashed border-gray-300">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Add New Service</CardTitle>
          <CardDescription>Connect to a new cloud mining provider</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select>
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nicehash">NiceHash</SelectItem>
                  <SelectItem value="unmineable">Unmineable</SelectItem>
                  <SelectItem value="mining-rig-rentals">Mining Rig Rentals</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input id="apiKey" type="text" placeholder="Enter API key" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret (if required)</Label>
              <Input id="apiSecret" type="password" placeholder="Enter API secret" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Connect Service</Button>
        </CardFooter>
      </Card>
      
      {/* API Key Dialog - Simple implementation */}
      {isApiKeyDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>API Key Required</CardTitle>
              <CardDescription>
                Please enter your API key for {cloudServices.find(s => s.id === serviceToActivate)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKeyInput">API Key</Label>
                  <Input 
                    id="apiKeyInput" 
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Enter your API key" 
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Your API key is stored securely and never shared with third parties
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsApiKeyDialogOpen(false);
                  setApiKeyInput('');
                  setServiceToActivate(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => saveApiKey(serviceToActivate!)}
                disabled={!apiKeyInput.trim()}
              >
                Save & Activate
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}