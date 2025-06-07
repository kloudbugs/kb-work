import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';

export default function C12IntegrationPage() {
  const { user } = useAuth();

  const launchC12App = (path: string) => {
    window.open(`/c12${path}`, '_blank');
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Helmet>
        <title>KLOUD BUGS CAFÉ | C12 Integration</title>
        <meta name="description" content="KLOUD BUGS Mining Platform C12 Integration" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-cosmic-blue">C12 Platform Integration</h1>
      
      <Tabs defaultValue="cafe" className="w-full">
        <TabsList className="mb-4 bg-slate-900">
          <TabsTrigger value="cafe">Cosmic Café</TabsTrigger>
          <TabsTrigger value="mining">Mining Features</TabsTrigger>
          <TabsTrigger value="guardian">TERA Guardian</TabsTrigger>
          <TabsTrigger value="puzzles">Bitcoin Puzzles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cafe" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard 
              title="KLOUD BUGS Café"
              description="Enter the cosmic space-themed café for out-of-this-world coffee experiences"
              actionLabel="Visit Café"
              onAction={() => launchC12App('/cafe')}
              icon="☕"
            />
            
            <FeatureCard 
              title="Brew Station"
              description="Create and customize your cosmic coffee blends"
              actionLabel="Brew Coffee"
              onAction={() => launchC12App('/brew-station')}
              icon="🚀"
            />
            
            <FeatureCard 
              title="Animated Welcome"
              description="Experience the original KLOUD BUGS animated welcome"
              actionLabel="View Welcome"
              onAction={() => launchC12App('/welcome')}
              icon="✨"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="mining" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard 
              title="Original Mining Dashboard"
              description="Access the original C12 mining control panel"
              actionLabel="Open Dashboard"
              onAction={() => launchC12App('/mining')}
              icon="⛏️"
            />
            
            <FeatureCard 
              title="Mining Stats Viewer"
              description="View detailed statistics from your original C12 mining operation"
              actionLabel="View Stats"
              onAction={() => launchC12App('/mining/stats')}
              icon="📊"
            />
            
            <FeatureCard 
              title="Hardware Monitor"
              description="Monitor your mining hardware performance from the C12 system"
              actionLabel="Open Monitor"
              onAction={() => launchC12App('/mining/hardware')}
              icon="🖥️"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="guardian" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard 
              title="TERA Guardian Dashboard"
              description="Access the original TERA Guardian security system"
              actionLabel="Launch Guardian"
              onAction={() => launchC12App('/guardian')}
              icon="🛡️"
            />
            
            <FeatureCard 
              title="Security Settings"
              description="Configure security settings for your mining operation"
              actionLabel="Security Settings"
              onAction={() => launchC12App('/guardian/settings')}
              icon="🔒"
            />
            
            <FeatureCard 
              title="Activity Logs"
              description="View security logs and activity reports"
              actionLabel="View Logs"
              onAction={() => launchC12App('/guardian/logs')}
              icon="📝"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="puzzles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard 
              title="Bitcoin Puzzles"
              description="Test your cryptographic skills with blockchain puzzles"
              actionLabel="Open Puzzles"
              onAction={() => launchC12App('/puzzles')}
              icon="🧩"
            />
            
            <FeatureCard 
              title="Bitcoin Lottery"
              description="Try your luck with Bitcoin private keys"
              actionLabel="Play Lottery"
              onAction={() => launchC12App('/lottery')}
              icon="🎰"
            />
            
            <FeatureCard 
              title="Puzzle Library"
              description="Browse the comprehensive collection of crypto puzzles"
              actionLabel="View Library"
              onAction={() => launchC12App('/puzzle-list')}
              icon="📚"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-space-purple/20">
        <h2 className="text-xl font-semibold mb-2 text-cosmic-blue">Integration Notes</h2>
        <p className="text-muted-foreground mb-2">
          The C12 platform is integrated with the new mining dashboard while preserving all original functionality.
          You can access both systems seamlessly and all mining configurations are shared between platforms.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button 
            variant="outline" 
            className="border-space-purple/30 hover:bg-space-purple/20"
            onClick={() => window.location.href = '/dashboard'}
          >
            Return to New Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            className="border-cyber-gold/30 text-cyber-gold hover:bg-cyber-gold/10"
            onClick={() => window.location.href = '/c12'}
          >
            Open Full C12 Platform
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon: string;
}

function FeatureCard({ title, description, actionLabel, onAction, icon }: FeatureCardProps) {
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
          onClick={onAction}
          className="w-full border-space-purple/30 hover:border-cyber-gold hover:text-cyber-gold"
        >
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}