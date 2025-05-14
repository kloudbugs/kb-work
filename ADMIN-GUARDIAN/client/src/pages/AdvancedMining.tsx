import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainLayout } from '@/components/layout/MainLayout';
import { AsicMiningConfig } from '@/components/ui/AsicMiningConfig';
import { CloudMiningConfig } from '@/components/ui/CloudMiningConfig';
import { ASICModelComparison } from '@/components/ui/ASICModelComparison';
import { Wrench, Server, Cloud, Cpu } from 'lucide-react';

export default function AdvancedMining() {
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6 border-b pb-4">
          <Wrench className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Advanced Mining Options</h1>
        </div>

        <p className="text-muted-foreground mb-6">
          Configure advanced mining options including ASIC hardware integration and cloud mining services.
        </p>

        <Tabs defaultValue="asic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="asic" className="flex items-center">
              <Server className="h-4 w-4 mr-2" />
              ASIC Mining
            </TabsTrigger>
            <TabsTrigger value="th-models" className="flex items-center">
              <Cpu className="h-4 w-4 mr-2" />
              TH/s Models
            </TabsTrigger>
            <TabsTrigger value="cloud" className="flex items-center">
              <Cloud className="h-4 w-4 mr-2" />
              Cloud Mining
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="asic" className="space-y-4">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
              <div>
                <h2 className="text-xl font-semibold mb-4">ASIC Hardware Mining</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure and optimize your ASIC mining hardware. Generate USB configurations 
                  to quickly deploy mining software to your ASIC devices.
                </p>
                <AsicMiningConfig />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="th-models" className="space-y-4">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
              <div>
                <h2 className="text-xl font-semibold mb-4">High-Performance TH/s ASIC Models</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Compare the most powerful ASIC miners with terahash-level performance.
                  These models deliver the highest hashrates for maximum mining efficiency.
                </p>
                <ASICModelComparison />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cloud" className="space-y-4">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
              <div>
                <h2 className="text-xl font-semibold mb-4">Cloud Mining Services</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Rent hash power from cloud mining providers to mine Bitcoin without owning physical hardware.
                  Connect to services like NiceHash, Genesis Mining, and more.
                </p>
                <CloudMiningConfig />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}