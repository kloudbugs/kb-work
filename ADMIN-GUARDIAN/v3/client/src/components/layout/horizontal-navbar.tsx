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
import { useAuth } from '@/hooks/use-auth';
import { 
  Shield, 
  BarChart3, 
  LogOut, 
  Bitcoin, 
  Menu, 
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

export default function HorizontalNavbar() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="border-b border-space-purple/30 bg-dark-matter">
      <div className="container mx-auto px-4 py-4">
        {/* Title and tagline */}
        <div className="flex flex-col items-center justify-center text-center mb-4">
          <Link href={isAuthenticated ? '/dashboard' : '/'}>
            <a className="font-orbitron text-cyber-gold text-2xl tracking-wider">KLOUD BUGS MINING COMMAND CENTER</a>
          </Link>
          <div className="text-cosmic-blue text-sm mt-1">All-in-one control for your mining operations and cosmic café</div>
        </div>
        
        {/* Horizontal Navigation */}
        <div className="flex justify-center mb-3">
          <div className="overflow-x-auto w-full">
            <div className="inline-flex space-x-1 bg-gradient-to-r from-space-purple/10 via-black to-space-purple/10 p-2 rounded-lg border border-space-purple/20">
              {isAuthenticated ? (
                <>
                  <NavButton href="/dashboard" text="Dashboard" icon={<BarChart3 size={16} />} current={location === '/dashboard'} />
                  <NavButton href="/mining" text="Mining" icon={<Grid size={16} />} current={location.startsWith('/mining')} />
                  <NavButton href="/guardian" text="Guardian" icon={<Shield size={16} />} current={location === '/guardian'} />
                  <NavButton href="/bitcoin" text="Bitcoin" icon={<Bitcoin size={16} />} current={location === '/bitcoin'} />
                  <NavButton href="/transactions" text="Transactions" icon={<CreditCard size={16} />} current={location === '/transactions'} />
                  <NavButton href="/training" text="Training" icon={<Bot size={16} />} current={location === '/training'} />
                  <NavButton href="/api-mining-documentation" text="API Docs" icon={<Database size={16} />} current={location === '/api-mining-documentation'} />
                  <NavButton href="/c12" text="Café" icon={<Coffee size={16} />} current={location.startsWith('/c12')} />
                  <NavButton href="/chat" text="Chat" icon={<MessagesSquare size={16} />} current={location === '/chat'} />
                </>
              ) : (
                <>
                  <NavButton href="/" text="Home" current={location === '/'} />
                  <NavButton href="/c12" text="Café" icon={<Coffee size={16} />} current={location.startsWith('/c12')} />
                  <NavButton href="/c12/puzzles" text="Puzzles" current={location === '/c12/puzzles'} />
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* User Actions */}
        <div className="flex justify-end">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-cosmic-blue bg-space-purple/20 text-cosmic-blue hover:bg-space-purple/30"
                >
                  {user?.username || 'Account'} <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-dark-matter border border-space-purple/30">
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <a className="flex items-center cursor-pointer text-white hover:bg-space-purple/20 hover:text-cyber-gold">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-space-purple/20" />
                <DropdownMenuItem asChild>
                  <Link href="/logout">
                    <a className="flex items-center cursor-pointer text-white hover:bg-space-purple/20 hover:text-cyber-gold">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </a>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Link href="/login">
                <a className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-md text-white bg-space-purple hover:bg-space-purple/80">
                  Login
                </a>
              </Link>
              <Link href="/register">
                <a className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-md bg-cyber-gold text-dark-matter hover:bg-cyber-gold/80">
                  Register
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple navigation button component
function NavButton({ href, text, icon, current }: { href: string, text: string, icon?: React.ReactNode, current: boolean }) {
  return (
    <Link href={href}>
      <a className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
        current 
          ? 'bg-cyber-gold/80 text-black' 
          : 'text-white hover:bg-space-purple/30'
      }`}>
        {icon && <span className="mr-1.5">{icon}</span>}
        {text}
      </a>
    </Link>
  );
}