import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/auth-context';
import { 
  Shield, 
  BarChart3, 
  LogOut, 
  Bitcoin, 
  Grid, 
  Coffee, 
  MessagesSquare,
  Brain,
  Database,
  Settings,
  ChevronDown,
  Bot,
  CreditCard
} from 'lucide-react';

export default function TopNavbar() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="border-b border-space-purple/30 bg-dark-matter">
      <div className="container mx-auto px-4 py-2">
        {/* Title and tagline */}
        <div className="flex flex-col items-center justify-center text-center mb-2">
          <Link href="/dashboard">
            <span className="font-orbitron text-cyber-gold text-2xl tracking-wider cursor-pointer hover:text-cyan-400 transition-colors">KLOUD BUGS MINING COMMAND CENTER</span>
          </Link>
          <div className="text-cosmic-blue text-sm mt-1">Advanced AI-powered mining platform with TERA Guardian training</div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mt-3 bg-gradient-to-r from-space-purple/10 via-black to-space-purple/10 rounded-t-lg overflow-x-auto border-t border-x border-space-purple/20">
          <div className="flex flex-wrap">
            <NavTab 
              href="/dashboard" 
              label="Dashboard" 
              isActive={location === '/dashboard' || location === '/'} 
            />
            <NavTab 
              href="/mining" 
              label="Mining" 
              isActive={location === '/mining'} 
            />
            <NavTab 
              href="/mining-rigs" 
              label="Rigs" 
              isActive={location === '/mining-rigs'} 
            />
            <NavTab 
              href="/mining-farm-overview" 
              label="Farm" 
              isActive={location === '/mining-farm-overview'} 
            />
            <NavTab 
              href="/mining/config-generator" 
              label="Config" 
              isActive={location === '/mining/config-generator'} 
            />
            <NavTab 
              href="/mining-configurations" 
              label="Pools" 
              isActive={location === '/mining-configurations'} 
            />
            <NavTab 
              href="/mobile-mining" 
              label="Mobile" 
              isActive={location === '/mobile-mining'} 
            />
            <NavTab 
              href="/guardian" 
              label="Guardian" 
              isActive={location === '/guardian'} 
            />
            <NavTab 
              href="/guardian-control" 
              label="Control" 
              isActive={location === '/guardian-control'} 
            />
            <NavTab 
              href="/lama" 
              label="Lama" 
              isActive={location === '/lama'} 
            />
            <NavTab 
              href="/transactions" 
              label="Transactions" 
              isActive={location === '/transactions'} 
            />
            <NavTab 
              href="/api-dashboard" 
              label="API" 
              isActive={location === '/api-dashboard'} 
            />
            <NavTab 
              href="/training" 
              label="Training" 
              isActive={location === '/training'} 
            />
            <NavTab 
              href="/basic-demo" 
              label="Demo" 
              isActive={location === '/basic-demo'} 
            />
          </div>
        </div>
        
        {/* User section - simplified control menu */}
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="border-space-purple/30 bg-space-purple/10 text-cosmic-blue hover:bg-space-purple/20"
              >
                Mining Control <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-dark-matter border border-space-purple/30">
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <span className="flex items-center cursor-pointer text-white hover:bg-space-purple/20 hover:text-cyber-gold">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/api-dashboard">
                  <span className="flex items-center cursor-pointer text-white hover:bg-space-purple/20 hover:text-cyber-gold">
                    <Database className="h-4 w-4 mr-2" />
                    API Control
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/bitcoin">
                  <span className="flex items-center cursor-pointer text-white hover:bg-space-purple/20 hover:text-cyber-gold">
                    <Bitcoin className="h-4 w-4 mr-2" />
                    Bitcoin Tools
                  </span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

function NavTab({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link href={href}>
      <span className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer transition-all duration-200 ${
        isActive 
          ? 'border-cyber-gold text-cyber-gold shadow-[0_0_10px_var(--cyber-gold)]' 
          : 'border-transparent text-cosmic-blue hover:text-white hover:border-space-purple/50 hover:shadow-[0_0_5px_rgba(139,92,246,0.3)]'
      }`}>
        {label}
      </span>
    </Link>
  );
}