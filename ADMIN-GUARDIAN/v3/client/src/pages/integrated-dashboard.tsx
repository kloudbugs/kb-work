import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import RealTimeMiningDashboard from '../components/mining/real-time-mining-dashboard';
import AIChatHub from '../components/ai/ai-chat-hub';
import UnifiedMiningPanel from '../components/mining/unified-mining-panel';

export default function IntegratedDashboard() {
  return (
    <div className="cosmic-background min-h-screen relative">
      {/* Stars animation overlay */}
      <div className="stars"></div>
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-cyber-gold glow-text">TERA MINING COMMAND CENTER</h1>
            <p className="text-cosmic-blue mt-1">All-in-one control for your AI-powered mining operations</p>
          </div>
          
          <div className="space-x-3">
            <a href="/c12/cafe" target="_blank" rel="noopener noreferrer">
              <button className="btn-cosmic">
                Visit Cosmic Café
              </button>
            </a>
            <a href="/c12/guardian" target="_blank" rel="noopener noreferrer">
              <button className="cosmic-action-btn px-4 py-2 inline-block">
                TERA Guardian
              </button>
            </a>
          </div>
        </div>
        
        {/* Cosmic divider */}
        <div className="cosmic-divider mb-6">
          <div className="cosmic-line"></div>
          <div className="cosmic-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bitcoin-icon">
              <path d="M11.767 19.089c4.924.868 9.593-2.235 10.461-7.159.868-4.924-2.235-9.593-7.159-10.461-4.924-.868-9.593 2.235-10.461 7.159-.868 4.924 2.235 9.593 7.159 10.461z"/>
              <path d="M15.5 10.5h-1a2 2 0 1 1 0-4h1.4a.6.6 0 0 1 .6.6v.4m-3 3v4m-3-8v8m11-4h-7"/>
            </svg>
          </div>
          <div className="cosmic-line"></div>
        </div>
      
        <Tabs defaultValue="mining" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-dark-matter/70 p-1 rounded-lg border-space-purple border">
            <TabsTrigger value="mining" className="font-orbitron text-lg py-3 data-[state=active]:bg-space-purple/30 data-[state=active]:text-cyber-gold data-[state=active]:shadow-[0_0_15px_var(--cyber-gold)]">⛏️ MINING OPERATIONS</TabsTrigger>
            <TabsTrigger value="training" className="font-orbitron text-lg py-3 data-[state=active]:bg-space-purple/30 data-[state=active]:text-cyber-gold data-[state=active]:shadow-[0_0_15px_var(--cyber-gold)]">🧠 GUARDIAN TRAINING</TabsTrigger>
          </TabsList>
          
          {/* Mining Operations Tab */}
          <TabsContent value="mining" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Real-Time Mining Dashboard */}
              <Card className="cosmic-card border-space-purple">
                <CardHeader className="bg-gradient-to-r from-stellar-blue to-space-purple border-b border-cyber-gold">
                  <CardTitle className="text-cyber-gold font-orbitron">Real-Time Mining Control</CardTitle>
                  <CardDescription className="text-star-white">Live mining operations and performance monitoring</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <RealTimeMiningDashboard />
                </CardContent>
              </Card>
              
              {/* API Mining Integration */}
              <Card className="cosmic-card border-space-purple">
                <CardHeader className="bg-gradient-to-r from-stellar-blue to-space-purple border-b border-cyber-gold">
                  <CardTitle className="text-cyber-gold font-orbitron">XMRig API Integration</CardTitle>
                  <CardDescription className="text-star-white">Connect to all your XMRig miners from one central dashboard</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <UnifiedMiningPanel />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Guardian Training Tab */}
          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 mb-6">
              {/* AI Control Hub */}
              <Card className="cosmic-card border-space-purple">
                <CardHeader className="bg-gradient-to-r from-stellar-blue to-space-purple border-b border-cyber-gold">
                  <CardTitle className="text-cyber-gold font-orbitron">AI Control Hub</CardTitle>
                  <CardDescription className="text-star-white">Interactive AI chat interface for advanced mining coordination</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[calc(50vh)]">
                    <AIChatHub />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TERA Guardian Training */}
              <Card className="cosmic-card border-space-purple hover:shadow-lg hover:shadow-space-purple/30 transition-shadow">
                <CardHeader className="bg-gradient-to-r from-stellar-blue to-space-purple border-b border-cyber-gold">
                  <CardTitle className="text-cyber-gold font-orbitron">TERA Guardian System</CardTitle>
                  <CardDescription className="text-star-white">Advanced AI coordination and mining optimization</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Master the TERA Guardian AI system for intelligent mining coordination and performance optimization.
                  </p>
                  <button onClick={() => window.open('/c12/guardian', '_blank')} className="cosmic-main-btn w-full">
                    <span>Launch Guardian Training</span>
                  </button>
                </CardContent>
              </Card>
              
              {/* Mining Training Center */}
              <Card className="cosmic-card border-space-purple hover:shadow-lg hover:shadow-space-purple/30 transition-shadow">
                <CardHeader className="bg-gradient-to-r from-stellar-blue to-space-purple border-b border-cyber-gold">
                  <CardTitle className="text-cyber-gold font-orbitron">Mining Training Center</CardTitle>
                  <CardDescription className="text-star-white">Learn advanced mining techniques and strategies</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive training modules covering mining optimization, pool selection, and profitability analysis.
                  </p>
                  <button onClick={() => window.open('/training-center', '_blank')} className="cosmic-main-btn w-full">
                    <span>Enter Training Center</span>
                  </button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
