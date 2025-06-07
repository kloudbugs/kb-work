import React, { useState, ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
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
  CreditCard,
  Home,
  FileText,
  BookOpen,
  GraduationCap
} from 'lucide-react';

// Navigation Link Component for the main horizontal nav
function NavLink({ href, icon, text, current }: { href: string, icon: ReactNode, text: string, current: boolean }) {
  return (
    <Link href={href}>
      <a className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center whitespace-nowrap ${
        current 
          ? 'bg-cyber-gold/80 text-black' 
          : 'text-white hover:bg-space-purple/30'
      }`}>
        <span className="mr-1.5">{icon}</span>
        {text}
      </a>
    </Link>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({ href, icon, text, current, onClick }: { href: string, icon: ReactNode, text: string, current: boolean, onClick: () => void }) {
  return (
    <Link href={href}>
      <a 
        className={`flex items-center text-sm px-4 py-2.5 rounded-md ${
          current 
            ? 'bg-cyber-gold/80 text-black' 
            : 'text-white hover:bg-space-purple/20'
        }`}
        onClick={onClick}
      >
        <span className="mr-2">{icon}</span>
        {text}
      </a>
    </Link>
  );
}

export default function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
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
        
        {/* Main horizontal navigation bar */}
        <div className="mb-2 mt-4 flex justify-center">
          <div className="relative bg-gradient-to-r from-space-purple/10 via-black to-space-purple/10 rounded-lg p-1 shadow-lg border border-space-purple/20 w-full max-w-4xl">
            <div className="flex overflow-x-auto items-center justify-center space-x-2 py-1 px-2">
              {isAuthenticated ? (
                <>
                  <NavLink href="/dashboard" icon={<BarChart3 size={16} />} text="Dashboard" current={location === '/dashboard'} />
                  <NavLink href="/mining" icon={<Grid size={16} />} text="Mining" current={location.startsWith('/mining')} />
                  <NavLink href="/guardian" icon={<Shield size={16} />} text="Guardian" current={location === '/guardian'} />
                  <NavLink href="/bitcoin" icon={<Bitcoin size={16} />} text="Bitcoin" current={location === '/bitcoin'} />
                  <NavLink href="/transactions" icon={<CreditCard size={16} />} text="Transactions" current={location === '/transactions'} />
                  <NavLink href="/training" icon={<GraduationCap size={16} />} text="Training" current={location === '/training'} />
                  <NavLink href="/api-mining-documentation" icon={<BookOpen size={16} />} text="API" current={location === '/api-mining-documentation'} />
                  <NavLink href="/c12" icon={<Coffee size={16} />} text="Café" current={location.startsWith('/c12')} />
                  <NavLink href="/chat" icon={<MessagesSquare size={16} />} text="Chat" current={location === '/chat'} />
                  <NavLink href="/ai" icon={<Brain size={16} />} text="AI Hub" current={location === '/ai'} />
                </>
              ) : (
                <>
                  <NavLink href="/" icon={<Home size={16} />} text="Home" current={location === '/'} />
                  <NavLink href="/c12" icon={<Coffee size={16} />} text="Cosmic Café" current={location.startsWith('/c12')} />
                  <NavLink href="/c12/puzzles" icon={<FileText size={16} />} text="Puzzles" current={location === '/c12/puzzles'} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Controls Row */}
        <div className="flex items-center justify-between py-1">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-space-purple text-cyber-gold hover:bg-space-purple/20"
                >
                  <Menu className="h-5 w-5" />
                  <span className="ml-2">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-dark-matter border-r border-space-purple/30 w-72">
                <div className="py-4">
                  <div className="mb-4 text-lg font-orbitron text-cyber-gold">Navigation</div>
                  
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <MobileNavLink href="/dashboard" icon={<BarChart3 size={16} />} text="Dashboard" current={location === '/dashboard'} onClick={() => setMenuOpen(false)} />
                      <MobileNavLink href="/mining" icon={<Grid size={16} />} text="Mining Control" current={location.startsWith('/mining')} onClick={() => setMenuOpen(false)} />
                      <MobileNavLink href="/guardian" icon={<Shield size={16} />} text="Guardian Dashboard" current={location === '/guardian'} onClick={() => setMenuOpen(false)} />
                      <MobileNavLink href="/bitcoin" icon={<Bitcoin size={16} />} text="Bitcoin Tracker" current={location === '/bitcoin'} onClick={() => setMenuOpen(false)} />
                      <MobileNavLink href="/transactions" icon={<CreditCard size={16} />} text="Transactions" current={location === '/transactions'} onClick={() => setMenuOpen(false)} />
                      <MobileNavLink href="/training" icon={<GraduationCap size={16} />} text="Training Center" current={location === '/training'} onClick={() => setMenuOpen(false)} />
                      <MobileNavLink href="/api-mining-documentation" icon={<BookOpen size={16} />} text="API Documentation" current={location === '/api-mining-documentation'} onClick={() => setMenuOpen(false)} />
                      <MobileNavLink href="/c12" icon={<Coffee size={16} />} text="Cosmic Café" current={location.startsWith('/c12')} onClick={() => setMenuOpen(false)} />
                      <MobileNavLink href="/chat" icon={<MessagesSquare size={16} />} text="Chat Room" current={location === '/chat'} onClick={() => setMenuOpen(false)} />
                      <MobileNavLink href="/ai" icon={<Brain size={16} />} text="AI Hub" current={location === '/ai'} onClick={() => setMenuOpen(false)} />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <MobileNavLink href="/" icon={<Home size={16} />} text="Home" current={location === '/'} onClick={() => setMenuOpen(false)} />
                      <MobileNavLink href="/c12" icon={<Coffee size={16} />} text="Cosmic Café" current={location.startsWith('/c12')} onClick={() => setMenuOpen(false)} />
                      <MobileNavLink href="/login" icon={<LogOut size={16} />} text="Login" current={location === '/login'} onClick={() => setMenuOpen(false)} />
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* User Section */}
          <div className="flex items-center justify-end space-x-2">
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
    </div>
  );
}