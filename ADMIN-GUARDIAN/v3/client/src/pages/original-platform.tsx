import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export default function OriginalPlatform() {
  const { isAuthenticated, user } = useAuth();
  
  // Redirect to original platform if available
  useEffect(() => {
    // This is where we'll eventually redirect to the cloned original platform
    // For now, we'll just show the UI with links to access different parts
  }, []);
  
  // Function to launch original platform features
  const launchOriginalFeature = (path: string) => {
    window.open(`/platform${path}`, '_blank');
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>KLOUD BUGS | Original Platform</title>
        <meta name="description" content="KLOUD BUGS Original Mining Platform" />
      </Helmet>
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-cyber-gold mb-2">KLOUD BUGS Original Platform</h1>
        <p className="text-cosmic-blue text-lg">
          Access your complete mining and cosmic café experience
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <FeatureCard
          title="Mining Dashboard"
          description="Access your original mining control center with all features"
          icon="⛏️"
          onClick={() => launchOriginalFeature('/mining')}
          buttonText="Launch Mining Dashboard"
        />
        
        <FeatureCard
          title="Cosmic Café"
          description="Visit the space-themed café and brewery station"
          icon="☕"
          onClick={() => launchOriginalFeature('/cafe')}
          buttonText="Enter Cosmic Café"
        />
        
        <FeatureCard
          title="TERA Guardian"
          description="Monitor and control your security systems"
          icon="🛡️"
          onClick={() => launchOriginalFeature('/guardian')}
          buttonText="Access Guardian"
        />
        
        <FeatureCard
          title="Bitcoin Database"
          description="Explore the Bitcoin puzzles and database"
          icon="🔍"
          onClick={() => launchOriginalFeature('/bitcoin')}
          buttonText="Open Database"
        />
        
        <FeatureCard
          title="Transaction Verification"
          description="Track and verify your mining rewards and withdrawals"
          icon="💰"
          onClick={() => launchOriginalFeature('/transactions')}
          buttonText="View Transactions"
        />
        
        <FeatureCard
          title="Admin Panel"
          description="Administrative controls for your entire platform"
          icon="⚙️"
          onClick={() => launchOriginalFeature('/admin')}
          buttonText="Admin Access"
        />
      </div>
      
      <div className="bg-slate-900/50 p-6 rounded-lg border border-cosmic-blue/20 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-cosmic-blue">Platform Integration</h2>
        <p className="mb-4">
          Your original platform is fully integrated with our new mining features. You can seamlessly
          move between both systems while maintaining all your data and configurations.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="border-cosmic-blue/30 hover:bg-cosmic-blue/10"
            onClick={() => window.location.href = '/dashboard'}
          >
            View Enhanced Dashboard
          </Button>
          <Button
            variant="outline"
            className="border-cyber-gold/30 text-cyber-gold hover:bg-cyber-gold/10"
            onClick={() => window.location.href = '/training'}
          >
            Visit Training Center
          </Button>
        </div>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cosmic-blue mb-4">Mining Configuration</h2>
        <div className="bg-slate-900/50 p-4 rounded-lg inline-block">
          <p className="mb-2"><span className="font-bold">Wallet Address:</span> bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6</p>
          <p className="mb-2"><span className="font-bold">Mining Key:</span> 1784277766</p>
          <p className="mb-2"><span className="font-bold">Ghost Feather:</span> Enabled (100 rigs)</p>
          <p><span className="font-bold">Mining Profiles:</span> All Activated</p>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  buttonText: string;
}

function FeatureCard({ title, description, icon, onClick, buttonText }: FeatureCardProps) {
  return (
    <Card className="bg-slate-900/70 border-space-purple/20 hover:border-space-purple/50 transition-all">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <CardTitle className="text-cosmic-blue">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Content can be expanded with additional information if needed */}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={onClick}
          className="w-full border-space-purple/30 hover:border-cyber-gold hover:text-cyber-gold"
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}