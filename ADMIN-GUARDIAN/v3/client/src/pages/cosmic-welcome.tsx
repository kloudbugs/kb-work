import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import '../styles/welcome.css';

export default function CosmicWelcome() {
  const [loading, setLoading] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Simulate database scanning
  useEffect(() => {
    const messages = [
      '> Initializing TERA Guardian System...',
      '> Establishing secure connection...',
      '> Scanning blockchain data...',
      '> Verifying miners...',
      '> Accessing KLOUD BUGS database...',
      '> Loading cosmic café protocols...',
      '> Checking wallet: bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6...',
      '> System ready - Welcome to KLOUD BUGS'
    ];
    
    let currentLine = 0;
    
    const terminalInterval = setInterval(() => {
      if (currentLine < messages.length) {
        setTerminalLines(prev => [...prev, messages[currentLine]]);
        currentLine++;
        
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      } else {
        clearInterval(terminalInterval);
      }
    }, 800);
    
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        const increment = Math.random() * 10;
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          clearInterval(scanInterval);
          
          // Play welcome sound if available
          try {
            const audio = new Audio('/welcome.mp3');
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Audio playback failed:', e));
          } catch (e) {
            console.log('Audio not available');
          }
          
          // Complete loading after a short delay
          setTimeout(() => {
            setLoading(false);
          }, 1500);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
    
    return () => {
      clearInterval(scanInterval);
      clearInterval(terminalInterval);
    };
  }, []);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Address copied!",
        description: "Bitcoin address copied to clipboard"
      });
    }).catch(e => {
      console.error('Failed to copy:', e);
    });
  };
  
  if (loading) {
    return (
      <div className="welcome-container">
        <div className="stars"></div>
        <div className="welcome-content">
          <div className="coffee-bean"></div>
          <div className="coffee-bean"></div>
          <div className="coffee-bean"></div>
          
          <h1 className="kloudbugs-logo mb-12">KLOUDBUGS</h1>
          
          <div className="scanner-container">
            <h2 className="text-center font-orbitron text-cosmic-blue mb-4">SYSTEM INITIALIZATION</h2>
            
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${Math.min(scanProgress, 100)}%` }}
              ></div>
            </div>
            
            <p className="text-center text-white text-sm mb-4">
              {scanProgress < 100 ? `Scanning... ${Math.floor(scanProgress)}%` : 'Access Granted'}
            </p>
            
            <div className="terminal-container" ref={terminalRef}>
              {terminalLines.map((line, index) => (
                <p 
                  key={index} 
                  className={`terminal-line ${index === terminalLines.length - 1 ? 'success' : ''}`}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="welcome-container">
      <div className="stars"></div>
      
      <div className="welcome-content">
        <div className="coffee-bean"></div>
        <div className="coffee-bean"></div>
        <div className="coffee-bean"></div>
        
        <div className="logo-container">
          <div className="logo-inner">
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            
            <h1 className="kloudbugs-logo">KLOUDBUGS</h1>
          </div>
        </div>
        
        <div className="welcome-message">
          <h2 className="cafe-text">WELCOME TO THE COSMIC CAFÉ</h2>
          <p className="cafe-tagline">Where blockchain, cryptography, and community converge</p>
        </div>
        
        <div className="entry-options">
          <div className="cosmic-card">
            <h3 className="text-cyber-gold">Enter The Café</h3>
            <p>
              Experience our cosmic space-themed café with a community of crypto enthusiasts.
              Explore our blockchain puzzles and connect with like-minded individuals.
            </p>
            <a href="http://localhost:5001/cafe" className="cosmic-button">Enter Café</a>
          </div>
          
          <div className="cosmic-card">
            <h3 className="text-cosmic-blue">Mining System</h3>
            <p>
              Access our advanced Bitcoin mining system with TERA Guardian AI optimization.
              Track your rewards, monitor performance, and maximize your mining efficiency.
            </p>
            <a href="/" className="cosmic-button alt">Access Mining System</a>
          </div>
        </div>
        
        <div className="donation-container">
          <div className="donation-label">Support This Project</div>
          <div 
            className="donation-address"
            onClick={() => copyToClipboard("bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6")}
          >
            bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6
            <i className="ml-2">📋</i>
          </div>
          <p className="text-sm text-space-purple mt-2">STARDATE: 2025.05.20</p>
        </div>
      </div>
    </div>
  );
}