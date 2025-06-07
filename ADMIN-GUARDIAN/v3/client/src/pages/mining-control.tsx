import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudMiningPanel } from "@/components/mining/cloud-mining-panel";
// Hardware mining panel removed - simplified version
import { Bitcoin, BookOpen, CloudCog, Cpu, HelpCircle, Settings } from 'lucide-react';

export default function MiningControlPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mining Control Center</h1>
          <p className="text-sm text-muted-foreground">Manage all your mining operations in one place</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="font-semibold text-sm">Your Bitcoin Address</div>
            <div className="text-xs text-muted-foreground">bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6</div>
          </div>
          <Bitcoin className="h-6 w-6 text-cyber-gold" />
        </div>
      </div>

      <Tabs defaultValue="hardware" className="space-y-6">
        <div className="bg-gradient-to-r from-space-purple/10 via-black to-space-purple/10 p-1 rounded-md">
          <TabsList className="grid grid-cols-2 h-12">
            <TabsTrigger value="hardware" className="space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-space-purple/30 data-[state=active]:to-cyber-gold/20">
              <Cpu className="h-4 w-4" />
              <span>Hardware Mining</span>
            </TabsTrigger>
            <TabsTrigger value="cloud" className="space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-space-purple/30 data-[state=active]:to-cyber-gold/20">
              <CloudCog className="h-4 w-4" />
              <span>Cloud Mining</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="hardware">
          <Card>
            <CardHeader>
              <CardTitle>Hardware Mining</CardTitle>
              <CardDescription>Configure your hardware mining settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Hardware mining panel has been simplified. Use the cloud mining tab for active mining operations.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cloud">
          <CloudMiningPanel />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-medium">
              <BookOpen className="h-5 w-5 mr-2 text-cosmic-blue" />
              Mining Guide
            </CardTitle>
            <CardDescription>Quick reference for optimizing your mining setup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Recommended Settings for Aorus 15 Gigabyte</h4>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Mining Algorithm: SHA-256 for Bitcoin</li>
                <li>Temperature Limit: 75°C maximum</li>
                <li>Fan Speed: 65-75% for optimal cooling</li>
                <li>Power Limit: 120-140W for balanced performance</li>
                <li>Mining Intensity: 70% to allow system usability</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Best Mining Pools</h4>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li><span className="font-medium">Unmineable</span>: Great for mining Bitcoin with your laptop or desktop PC</li>
                <li><span className="font-medium">NiceHash</span>: User-friendly for both cloud and hardware mining</li>
                <li><span className="font-medium">Mining Rig Rentals</span>: For renting additional mining power</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Withdrawal Process</h4>
              <p className="text-sm">All mining rewards automatically accumulate until they reach the threshold of 0.0005 BTC, then they're automatically sent to your wallet address with TERA Guardian verification.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-medium">
              <HelpCircle className="h-5 w-5 mr-2 text-cosmic-blue" />
              Mining Tips & Troubleshooting
            </CardTitle>
            <CardDescription>Optimize your mining performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Performance Optimization</h4>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Close resource-intensive applications when mining</li>
                <li>Ensure proper cooling, especially for laptops</li>
                <li>Update mining software and drivers regularly</li>
                <li>Use "Ghost Feather" for testing mining setup configurations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Common Issues</h4>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li><span className="font-medium">Low hashrate</span>: Check intensity settings and background processes</li>
                <li><span className="font-medium">Overheating</span>: Lower intensity, clean cooling vents, use cooling pad</li>
                <li><span className="font-medium">Rejected shares</span>: Check network connection, try a different pool</li>
                <li><span className="font-medium">Connection errors</span>: Verify API keys and pool credentials</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">API Integration</h4>
              <p className="text-sm">For advanced users, check the API dashboard for direct commands to control mining operations, add Ghost Feather rigs, or optimize hardware settings.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}