import CloudMiningDashboard from "@/components/ui/CloudMiningDashboard";

export default function CloudMining() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Cloud Mining Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Configure and monitor your cloud mining operations
      </p>
      
      <CloudMiningDashboard />
    </div>
  );
}