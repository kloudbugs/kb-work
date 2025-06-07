import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import UnifiedDashboard from "@/pages/unified-dashboard";
import MiningRigs from "@/pages/mining-rigs";
import TeraPoolProject from "@/pages/tera-pool-project";
import F2PoolManagement from "@/pages/f2pool-management";
import BraiinsPoolManagement from "@/pages/braiins-pool-management";
import TrainingCenter from "@/pages/training-center";
import PoolTesting from "@/pages/pool-testing";
import MiningEngine from "@/pages/mining-engine";


import Navbar from "@/components/layout/navbar";
import { MiningProvider } from "@/contexts/mining-context";
import { AuthProvider } from "@/contexts/auth-context";
import ChatRoom from "@/components/chat/chat-room";
import AIChatHub from "@/components/ai/ai-chat-hub";
import BitcoinDatabase from "@/components/bitcoin/bitcoin-database";
import UmbrelMiningControl from "@/components/umbrel-mining-control";
import SoloMiningUmbrel from "@/components/solo-mining-umbrel";
import TeraWorkerManagement from "@/components/tera-worker-management";

function Router() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Switch>
        {/* Root redirects to dashboard */}
        <Route path="/">
          <Redirect to="/dashboard" />
        </Route>
        
        {/* MAIN DASHBOARD - TERA Mining Command Center */}
        <Route path="/dashboard">
          <UnifiedDashboard />
        </Route>
        
        {/* LEGACY DASHBOARD - Alternative interface */}
        <Route path="/old-dashboard">
          <Navbar />
          <Dashboard />
        </Route>
        
        {/* MINING RIGS - Dedicated rig monitoring */}
        <Route path="/rigs">
          <Navbar />
          <MiningRigs />
        </Route>
        
        {/* TERA POOL PROJECT - Your own mining pool */}
        <Route path="/pool">
          <TeraPoolProject />
        </Route>
        
        {/* F2POOL MANAGEMENT - Your F2Pool accounts */}
        <Route path="/f2pool">
          <F2PoolManagement />
        </Route>
        
        {/* BRAIINS POOL MANAGEMENT - Your Braiins Pool accounts */}
        <Route path="/braiins">
          <Navbar />
          <div className="container mx-auto px-4 py-6">
            <BraiinsPoolManagement />
          </div>
        </Route>
        
        {/* POOL TESTING - Test F2Pool and Braiins Pool connections */}
        <Route path="/test-pools">
          <Navbar />
          <div className="container mx-auto px-4 py-6">
            <PoolTesting />
          </div>
        </Route>
        
        {/* MINING ENGINE - Real stratum mining protocol implementation */}
        <Route path="/mining-engine">
          <Navbar />
          <MiningEngine />
        </Route>
        

        {/* All mining routes redirect to main dashboard */}
        <Route path="/mining">
          <Redirect to="/dashboard" />
        </Route>

        {/* All guardian routes redirect to main dashboard */}
        <Route path="/guardian">
          <Redirect to="/dashboard" />
        </Route>

        {/* Training Center */}
        <Route path="/training">
          <Navbar />
          <TrainingCenter />
        </Route>
        
        {/* Tera Worker Management */}
        <Route path="/workers">
          <Navbar />
          <div className="container mx-auto px-4 py-6">
            <TeraWorkerManagement />
          </div>
        </Route>
        
        {/* Umbrel Mining Control */}
        <Route path="/umbrel">
          <Navbar />
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Umbrel Mining Control</h1>
            <UmbrelMiningControl />
          </div>
        </Route>
        
        {/* Solo Mining with Umbrel */}
        <Route path="/solo">
          <Navbar />
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Solo Mining with Your Umbrel Node</h1>
            <SoloMiningUmbrel />
          </div>
        </Route>
        
        {/* Bitcoin Tools */}
        <Route path="/bitcoin">
          <Navbar />
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Bitcoin Tools</h1>
            <BitcoinDatabase />
          </div>
        </Route>
        
        {/* Chat Room */}
        <Route path="/chat">
          <Navbar />
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Chat Room</h1>
            <ChatRoom />
          </div>
        </Route>
        
        {/* AI Hub */}
        <Route path="/ai">
          <Navbar />
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">AI Hub</h1>
            <AIChatHub />
          </div>
        </Route>
        

        

        
        {/* Transactions redirect to main dashboard wallet tab */}
        <Route path="/transactions">
          <Redirect to="/dashboard" />
        </Route>
        
        {/* 404 - Not Found */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <MiningProvider>
            <Router />
            <Toaster />
          </MiningProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;