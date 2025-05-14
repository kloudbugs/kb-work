import { createRoot } from "react-dom/client";
import { Route, Router, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import VisualizationPage from "./pages/VisualizationPage";
import "./index.css";

// Create a client for React Query
const queryClient = new QueryClient();

// Create root and render app with routing
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <Switch>
        <Route path="/" component={WelcomePage} />
        <Route path="/home" component={HomePage} />
        <Route path="/visualization" component={VisualizationPage} />
      </Switch>
    </Router>
  </QueryClientProvider>
);
