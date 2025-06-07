import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlayIcon, Pause, PlusIcon } from "lucide-react";
import { useMining } from "@/contexts/mining-context";
import { useToast } from "@/hooks/use-toast";

export default function MiningControlPanel() {
  const { miningSettings, updateSettings, startMining, stopMining, miningStats } = useMining();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("pool");
  const isActive = miningStats?.isActive || false;
  
  const handleStartMining = () => {
    console.log("Starting mining...");
    startMining();
    toast({
      title: "Mining Started",
      description: "Your Aorus 15 is now mining Bitcoin",
    });
  };
  
  const handleStopMining = () => {
    stopMining();
    toast({
      title: "Mining Stopped",
      description: "Mining operations have been halted",
    });
  };
  
  const handleSettingChange = (field: string, value: string) => {
    updateSettings({ [field]: value });
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Mining Control</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="border-b border-neutral-200 w-full rounded-none bg-transparent mb-4">
            <TabsTrigger 
              value="pool" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent data-[state=inactive]:text-neutral-600"
            >
              Pool Mining
            </TabsTrigger>
            <TabsTrigger 
              value="solo" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent data-[state=inactive]:text-neutral-600"
            >
              Solo Mining
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pool" className="pt-2">
            <div className="mb-4">
              <Label className="block text-sm font-medium text-neutral-700 mb-1">Mining Pool</Label>
              <div className="flex">
                <Select 
                  value={miningSettings?.pool || "nicehash"} 
                  onValueChange={(value) => handleSettingChange("pool", value)}
                >
                  <SelectTrigger className="flex-grow bg-neutral-100 border border-neutral-300 rounded-lg py-2 px-3 text-neutral-800">
                    <SelectValue placeholder="Select Mining Pool" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nicehash">NiceHash</SelectItem>
                    <SelectItem value="ethermine">Ethermine</SelectItem>
                    <SelectItem value="f2pool">F2Pool</SelectItem>
                    <SelectItem value="binance">Binance Pool</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="ml-2 bg-neutral-100 border border-neutral-300 rounded-lg">
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mb-4">
              <Label className="block text-sm font-medium text-neutral-700 mb-1">Wallet Address</Label>
              <Input 
                type="text" 
                className="w-full bg-neutral-100 border border-neutral-300 rounded-lg py-2 px-3 text-neutral-800 font-mono text-sm" 
                value={miningSettings?.walletAddress || ""} 
                onChange={(e) => handleSettingChange("walletAddress", e.target.value)}
                placeholder="Enter your Bitcoin wallet address"
              />
            </div>
            
            <div className="mb-4">
              <Label className="block text-sm font-medium text-neutral-700 mb-1">Worker Name</Label>
              <Input 
                type="text" 
                className="w-full bg-neutral-100 border border-neutral-300 rounded-lg py-2 px-3 text-neutral-800" 
                value={miningSettings?.workerName || ""} 
                onChange={(e) => handleSettingChange("workerName", e.target.value)}
                placeholder="aorus15_worker1"
              />
            </div>
            
            <div className="mb-4">
              <Label className="block text-sm font-medium text-neutral-700 mb-1">Server Region</Label>
              <Select 
                value={miningSettings?.serverRegion || "us-east"} 
                onValueChange={(value) => handleSettingChange("serverRegion", value)}
              >
                <SelectTrigger className="w-full bg-neutral-100 border border-neutral-300 rounded-lg py-2 px-3 text-neutral-800">
                  <SelectValue placeholder="Select Server Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-east">US East</SelectItem>
                  <SelectItem value="us-west">US West</SelectItem>
                  <SelectItem value="eu">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="solo" className="pt-2">
            <div className="mb-4">
              <Label className="block text-sm font-medium text-neutral-700 mb-1">Bitcoin Node URL</Label>
              <Input 
                type="text" 
                className="w-full bg-neutral-100 border border-neutral-300 rounded-lg py-2 px-3 text-neutral-800" 
                placeholder="http://127.0.0.1:8332" 
              />
            </div>
            
            <div className="mb-4">
              <Label className="block text-sm font-medium text-neutral-700 mb-1">RPC Username</Label>
              <Input 
                type="text" 
                className="w-full bg-neutral-100 border border-neutral-300 rounded-lg py-2 px-3 text-neutral-800" 
                placeholder="bitcoinrpc" 
              />
            </div>
            
            <div className="mb-4">
              <Label className="block text-sm font-medium text-neutral-700 mb-1">RPC Password</Label>
              <Input 
                type="password" 
                className="w-full bg-neutral-100 border border-neutral-300 rounded-lg py-2 px-3 text-neutral-800" 
                placeholder="••••••••••••" 
              />
            </div>
            
            <div className="mb-4">
              <Label className="block text-sm font-medium text-neutral-700 mb-1">Wallet Address</Label>
              <Input 
                type="text" 
                className="w-full bg-neutral-100 border border-neutral-300 rounded-lg py-2 px-3 text-neutral-800 font-mono text-sm" 
                placeholder="Enter your Bitcoin wallet address" 
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Mining Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <span className="mr-3 text-sm font-medium text-neutral-700">Optimization</span>
            <Select 
              value={miningSettings?.optimization || "balanced"} 
              onValueChange={(value) => handleSettingChange("optimization", value)}
            >
              <SelectTrigger className="bg-neutral-100 border border-neutral-300 rounded-lg py-1 px-2 text-sm text-neutral-800">
                <SelectValue placeholder="Select Optimization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efficient">Efficient</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center">
            {!isActive ? (
              <Button onClick={handleStartMining} className="bg-success hover:bg-green-600 text-white">
                <PlayIcon className="h-4 w-4 mr-2" />
                Start Mining
              </Button>
            ) : (
              <Button onClick={handleStopMining} className="bg-error hover:bg-red-700 text-white">
                <Pause className="h-4 w-4 mr-2" />
                Stop Mining
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
