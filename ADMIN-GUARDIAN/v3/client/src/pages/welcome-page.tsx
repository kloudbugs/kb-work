import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// CSS will go in index.css

export default function WelcomePage() {
  const [loading, setLoading] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const { toast } = useToast();
  
  // Database scanning simulation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(scanInterval);
          
          setTimeout(() => {
            setLoading(false);
            setShowWelcome(true);
          }, 1000);
          
          return 100;
        }
        return newProgress;
      });
    }, 150);
    
    return () => clearInterval(scanInterval);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Address copied!",
        description: "Bitcoin address copied to clipboard"
      });
    });
  };
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-dark-matter flex flex-col items-center justify-center">
        <div className="stars-fast"></div>
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-orbitron text-cyber-gold mb-2 glow-text tracking-wider">SCANNING DATABASE</h2>
          <p className="text-cosmic-blue text-sm mb-6">Accessing Blockchain Records...</p>
          
          <div className="w-64 h-2 bg-dark-energy rounded-full overflow-hidden relative mb-2">
            <div 
              className="h-full bg-cyber-gold animate-pulse" 
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
          
          <p className="text-white text-xs font-mono">
            {scanProgress < 100 ? 'System Loading...' : 'Access Granted'}
          </p>
        </div>
        
        <div className="cyber-terminal w-80 h-40 overflow-hidden border border-space-purple rounded">
          <div className="p-3 font-mono text-xs text-cosmic-blue">
            <p>&gt; Initializing TERA Guardian System</p>
            <p>&gt; Accessing Blockchain Data</p>
            <p>&gt; Checking Mining Modules</p>
            <p>&gt; Running Security Protocols</p>
            <p>&gt; Configuring Wallet Connection</p>
            <p>&gt; Wallet Address: bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6</p>
            <p className="text-cyber-gold">&gt; System Ready - Welcome to KLOUD BUGS</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-dark-matter flex flex-col items-center justify-center">
      <div className="stars-fast"></div>
      
      <div className="logo-container cosmic-pulse mb-8">
        <div className="logo-inner">
          <div className="sparkle-container">
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            
            {/* Logo animation */}
            <div className="font-orbitron text-5xl text-cyber-gold glow-text tracking-widest logo-text">
              KLOUDBUGS
            </div>
          </div>
        </div>
      </div>
      
      <div className={`welcome-message mb-12 text-center ${showWelcome ? 'animate-fade-in' : 'opacity-0'}`}>
        <h2 className="text-3xl font-orbitron mb-4">
          <span className="text-cosmic-blue">WELCOME TO THE </span>
          <span className="text-cyber-gold glow-text">COSMIC CAFÉ</span>
        </h2>
        <p className="text-white mb-6">Where blockchain, cryptography, and community converge</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="cafe-card border border-space-purple bg-dark-energy/60 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-xl font-orbitron text-cyber-gold mb-4">Enter The Café</h3>
            <p className="text-white mb-6">Experience our cosmic space-themed café with a community of blockchain enthusiasts.</p>
            <Link href="/guardian">
              <Button className="bg-cyber-gold hover:bg-cyber-gold/80 text-black w-full">
                Enter Café
              </Button>
            </Link>
          </div>
          
          <div className="membership-card border border-space-purple bg-dark-energy/60 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-orbitron text-cosmic-blue">Premium Membership</h3>
              <Badge className="bg-cyber-gold text-black">SPECIAL OFFER</Badge>
            </div>
            <p className="text-white mb-6">Get access to premium mining features, enhanced AI guardians, and exclusive rewards.</p>
            <Link href="/mining">
              <Button className="bg-space-purple hover:bg-space-purple/80 text-white w-full">
                Access Mining System
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-10 bitcoin-donation text-center">
          <div className="donation-label mb-2 text-cosmic-blue">
            Support This Project
          </div>
          <div 
            className="donation-address cursor-pointer bg-dark-energy/40 rounded px-3 py-2 inline-block" 
            onClick={() => copyToClipboard('bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6')}
          >
            <span className="font-mono text-sm text-white">bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6</span>
            <span className="ml-2 text-cosmic-blue">📋</span>
          </div>
        </div>
      </div>
      
      <footer className="mt-auto py-4 text-center">
        <p className="text-space-purple text-sm">STARDATE: 2025.05.20</p>
      </footer>
    </div>
  );
}