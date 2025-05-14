import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";

import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "@/pages/Home";
import MiningSubscription from "@/pages/MiningSubscription";
import MPTToken from "@/pages/MPTToken";
import TAHInfo from "@/pages/TAHInfo";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/mining" component={MiningSubscription} />
            <Route path="/mpt-token" component={MPTToken} />
            <Route path="/tah-info" component={TAHInfo} />
            <Route path="/login" component={Login} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}