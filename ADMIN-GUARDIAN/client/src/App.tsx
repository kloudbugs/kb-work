import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Devices from "@/pages/Devices";
import MiningPools from "@/pages/MiningPools";
import Wallet from "@/pages/Wallet";
import SpecialWallet from "@/pages/SpecialWallet";
import LedgerTransfer from "@/pages/LedgerTransfer";
import ChatRoomPage from "@/pages/ChatRoomPage";
import ScreenSharePage from "@/pages/ScreenSharePage";
import BroadcastViewPage from "@/pages/BroadcastViewPage";

import Settings from "@/pages/Settings";
import AdvancedMining from "@/pages/AdvancedMining";
import ASICMining from "@/pages/ASICMining";
import CloudMining from "@/pages/CloudMining";
import TokenAllocation from "@/pages/TokenAllocation";
import TeraTokenPage from "@/pages/TeraTokenPage";
import BitcoinMining from "@/pages/BitcoinMining";
import PuzzleMonitor from "@/pages/PuzzleMonitor";
import MiningCafe from "@/pages/MiningCafe";
import BrewStation from "@/pages/BrewStation";
import NetworkDashboard from "@/pages/NetworkDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import TeraStoryPage from "@/pages/TeraStoryPage";
import TeraLegacyPage from "@/pages/TeraLegacyPage";
import CleanTeraLegacyPage from "@/pages/CleanTeraLegacyPage";
import TeraEvidence from "@/pages/TeraEvidence";
import TeraLegacyRootsPage from "@/pages/TeraLegacyRootsPage";
import TeraLegacySeedsPage from "@/pages/TeraLegacySeedsPage";
import TeraMissionPage from "@/pages/TeraMissionPage";
import FamilyAccessPage from "@/pages/FamilyAccessPage";
import GuardianSystem from "@/pages/GuardianSystem";
import GuardianTraining from "@/pages/GuardianTraining";

// Website Components
import Home from "@/components/website/Home";
import MiningSubscription from "@/components/website/MiningSubscription";
import TokenInfo from "@/components/website/TokenInfo";
import WebsiteLogin from "@/components/website/Login";
import TokenEcosystem from "@/pages/TokenEcosystem";
import WelcomeAnimation from "@/components/ui/WelcomeAnimation";
import MiningIntroduction from "@/components/ui/MiningIntroduction";
import FamilyIntroduction from "@/components/ui/FamilyIntroduction";

// Broadcast Components
import { BroadcastProvider } from "@/context/BroadcastContext";
import { BroadcastOverlay } from "@/components/broadcast/BroadcastOverlay";

import ImpactAlertSystem from "@/components/ui/ImpactAlertSystem";
import LoadingExample from "@/pages/LoadingExample";
import MeteorExample from "@/pages/MeteorExample";
import VideoAnimationExample from "@/pages/VideoAnimationExample";
import CoinDemo from "@/pages/CoinDemo";

import AuthPage from "@/pages/auth-page";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [_, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"/>
      </div>
    );
  }

  return isAuthenticated ? <Component /> : null;
}

function Router() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  const [showWebsite, setShowWebsite] = useState(true);
  const [_, navigate] = useLocation();
  
  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (isAuthenticated && user?.isAdmin && location !== '/admin-dashboard') {
      navigate('/admin-dashboard');
    }
  }, [isAuthenticated, user, location, navigate]);
  
  // Check if we're on a website route or mining portal route
  useEffect(() => {
    const publicRoutes = ['/', '/mining', '/token', '/login', '/token-ecosystem', '/mining-cafe', '/loading-example', '/meteor-example', '/video-animation', '/coin-demo', '/family-access'];
    const isPublicRoute = publicRoutes.includes(location);
    
    // If user is going to the auth page or admin dashboard, show portal
    if (location === '/auth' || location === '/auth/login' || location === '/admin-dashboard') {
      setShowWebsite(false);
      return;
    }
    
    // For public routes, always show the website
    if (isPublicRoute) {
      setShowWebsite(true);
      return;
    }
    
    // For authenticated users on protected routes, show the portal
    if (isAuthenticated && !isPublicRoute) {
      setShowWebsite(false);
      return;
    }
    
    // Default to website
    setShowWebsite(true);
  }, [location, isAuthenticated]);
  
  // If we should show the website
  if (showWebsite) {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/mining" component={MiningSubscription} />
        <Route path="/token" component={TokenInfo} />
        <Route path="/token-ecosystem" component={TokenEcosystem} />
        <Route path="/family-access" component={FamilyAccessPage} />
        <Route path="/tera-token/legacy" component={CleanTeraLegacyPage} />
        <Route path="/tera-token/legacy/detailed" component={TeraLegacyPage} />
        <Route path="/tera-token/legacy/roots" component={TeraLegacyRootsPage} />
        <Route path="/tera-token/legacy/seeds" component={TeraLegacySeedsPage} />
        <Route path="/tera-token/story" component={TeraStoryPage} />
        <Route path="/tera-evidence" component={TeraEvidence} />

        <Route path="/mining-cafe" component={MiningCafe} />
        <Route path="/loading-example" component={LoadingExample} />
        <Route path="/meteor-example" component={MeteorExample} />
        <Route path="/video-animation" component={VideoAnimationExample} />
        <Route path="/coin-demo" component={CoinDemo} />
        <Route path="/login" component={WebsiteLogin} />
        <Route component={NotFound} />
      </Switch>
    );
  }
  
  // Otherwise show the mining portal
  return (
    <Switch>
      <Route path="/auth/login" component={AuthPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/broadcast">
        <ProtectedRoute component={BroadcastViewPage} />
      </Route>
      <Route path="/chat">
        <ProtectedRoute component={ChatRoomPage} />
      </Route>
      <Route path="/devices">
        <ProtectedRoute component={Devices} />
      </Route>
      <Route path="/pools">
        <ProtectedRoute component={MiningPools} />
      </Route>
      <Route path="/wallet">
        <ProtectedRoute component={Wallet} />
      </Route>
      <Route path="/special-wallet">
        <ProtectedRoute component={SpecialWallet} />
      </Route>
      <Route path="/ledger-transfer">
        <ProtectedRoute component={LedgerTransfer} />
      </Route>
      <Route path="/history">
        {() => {
          window.location.href = "/settings?tab=history";
          return null;
        }}
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>
      <Route path="/advanced-mining">
        <ProtectedRoute component={AdvancedMining} />
      </Route>
      <Route path="/asic-mining">
        <ProtectedRoute component={ASICMining} />
      </Route>
      <Route path="/cloud-mining">
        <ProtectedRoute component={CloudMining} />
      </Route>
      <Route path="/token-allocation">
        <ProtectedRoute component={TokenAllocation} />
      </Route>
      <Route path="/tera-token">
        <ProtectedRoute component={TeraTokenPage} />
      </Route>
      <Route path="/tera-token/legacy">
        <ProtectedRoute component={CleanTeraLegacyPage} />
      </Route>
      <Route path="/tera-token/legacy/detailed">
        <ProtectedRoute component={TeraLegacyPage} />
      </Route>
      <Route path="/tera-token/legacy/roots">
        <ProtectedRoute component={TeraLegacyRootsPage} />
      </Route>
      <Route path="/tera-token/legacy/seeds">
        <ProtectedRoute component={TeraLegacySeedsPage} />
      </Route>
      <Route path="/tera-token/story">
        <ProtectedRoute component={TeraStoryPage} />
      </Route>
      <Route path="/tera-evidence">
        <ProtectedRoute component={TeraEvidence} />
      </Route>
      <Route path="/tera-token/mission">
        <ProtectedRoute component={TeraMissionPage} />
      </Route>
      <Route path="/bitcoin-mining">
        <ProtectedRoute component={BitcoinMining} />
      </Route>
      <Route path="/puzzle-monitor">
        <ProtectedRoute component={PuzzleMonitor} />
      </Route>
      <Route path="/mining-cafe">
        <ProtectedRoute component={MiningCafe} />
      </Route>
      <Route path="/brew-station">
        <ProtectedRoute component={BrewStation} />
      </Route>
      <Route path="/admin-dashboard">
        <ProtectedRoute component={AdminDashboard} />
      </Route>
      <Route path="/network-dashboard">
        <ProtectedRoute component={NetworkDashboard} />
      </Route>
      <Route path="/admin-dashboard/guardian-system">
        <ProtectedRoute component={GuardianSystem} />
      </Route>
      <Route path="/admin-dashboard/guardian-training">
        <ProtectedRoute component={GuardianTraining} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isAuthenticated } = useAuth();
  const [showFamilyIntroduction, setShowFamilyIntroduction] = useState(true);
  
  // Removed welcome animation per user request
  
  if (showFamilyIntroduction) {
    return <FamilyIntroduction onContinue={() => setShowFamilyIntroduction(false)} />;
  }
  
  return (
    <BroadcastProvider>
      <>
        <Router />
        <Toaster />
        {isAuthenticated && <ImpactAlertSystem />}
        <BroadcastOverlay />
      </>
    </BroadcastProvider>
  );
}

export default App;