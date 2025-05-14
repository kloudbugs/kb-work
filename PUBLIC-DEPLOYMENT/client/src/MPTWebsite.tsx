import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Router, Switch, useLocation } from "wouter";

import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/components/website/Home";
import MiningSubscription from "@/components/website/MiningSubscription";
import TokenInfo from "@/components/website/TokenInfo";
import TeraInfo from "@/components/website/TeraInfo";
import Login from "@/components/website/Login";
import NotFound from "@/pages/not-found";

// Check if we're in the website context or mining portal context
const isWebsiteRoute = () => {
  const pathname = window.location.pathname;
  return [
    '/',
    '/mining',
    '/token',
    '/tera-info',
    '/login'
  ].includes(pathname);
};

export default function MPTWebsite() {
  const [location] = useLocation();
  
  // If path is /dashboard or auth routes, let the mining app handle it
  if (location === '/dashboard' || location.startsWith('/auth')) {
    return null;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/mining" component={MiningSubscription} />
            <Route path="/token" component={TokenInfo} />
            <Route path="/tera-info" component={TeraInfo} />
            <Route path="/login" component={Login} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}