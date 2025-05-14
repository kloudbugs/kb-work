import CloudMiningDashboard from "@/components/ui/CloudMiningDashboard";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Server, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

export default function CloudMining() {
  const [, setLocation] = useLocation();

  const navigateToDashboard = () => {
    setLocation("/dashboard");
  };

  const navigateToDeployMining = () => {
    setLocation("/deploy-mining");
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cloud Mining Dashboard</h1>
            <p className="text-muted-foreground">
              Configure and monitor your cloud mining operations
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-blue-600/40 text-blue-400 hover:bg-blue-950/30 hover:text-blue-300"
              onClick={navigateToDashboard}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 bg-indigo-950/30 border border-indigo-600/40 text-indigo-400 hover:bg-indigo-950/50 hover:text-indigo-300"
              onClick={navigateToDashboard}
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
        
        <CloudMiningDashboard />
        
        <div className="flex justify-end mt-6">
          <Button
            onClick={navigateToDeployMining}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6"
          >
            <Server className="mr-2 h-4 w-4" />
            Deploy Mining
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}