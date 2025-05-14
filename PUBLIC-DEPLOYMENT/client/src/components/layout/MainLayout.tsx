import React, { useState, useEffect } from 'react';
import { MiningProvider } from '@/contexts/MiningContext';
import { Sidebar } from './Sidebar';
import MiningToggle from '@/components/ui/MiningToggle';
import { Button } from '@/components/ui/button';
import { Menu, User, Moon, Sun, Eye, ArrowLeft, Bitcoin } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/lib/miningClient';
import { useLocation } from 'wouter';
import { AppHeader } from './AppHeader';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  useEffect(() => {
    // Set dark mode class on document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);
  
  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Check for admin preview mode
  useEffect(() => {
    const previewMode = sessionStorage.getItem('adminPreviewMode') === 'true';
    setIsPreviewMode(previewMode);
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: String(error),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="relative">
      {/* Fixed SATOSHI BEAN MINING Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-indigo-700/50">
        <div className="px-4 sm:px-6 lg:px-8 py-2">
          <div className="backdrop-blur-md bg-gray-900/70 border border-indigo-500/50 rounded-lg shadow-lg overflow-hidden">
            <div className="px-3 py-2 flex items-center justify-center">
              <Bitcoin className="h-5 w-5 mr-2 text-amber-500" />
              <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 glow-text-amber">
                SATOSHI BEAN MINING FOR CIVIL RIGHTS
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <MiningProvider>
        <div className="flex h-screen pt-12 overflow-hidden bg-gradient-to-b from-[var(--space-bg-dark)] to-[var(--space-bg-darker)]">
          {/* Star background effect */}
          <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
            <div className="stars-small"></div>
            <div className="stars-medium"></div>
            <div className="stars-large"></div>
          </div>
          
          <Sidebar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
          />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative z-10">
            
            <header className="backdrop-blur-md bg-gray-900/80 border-b border-indigo-900/50 shadow-lg shadow-purple-900/20 z-10">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="lg:hidden text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                      onClick={() => setSidebarOpen(true)}
                    >
                      <Menu className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Mining Status Toggle */}
                    <MiningToggle />
                    
                    {/* Dark Mode Toggle */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setDarkMode(!darkMode)}
                      aria-label="Toggle dark mode"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                    >
                      {darkMode ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </Button>
                    
                    {/* User Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                        >
                          <div className="h-8 w-8 rounded-full bg-indigo-800/60 border border-indigo-500/50 flex items-center justify-center text-blue-300 shadow-md shadow-blue-900/20">
                            <User className="h-5 w-5" />
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900/90 backdrop-blur-md border border-indigo-800/50">
                        <DropdownMenuItem onClick={() => navigate('/settings')} className="text-blue-300 focus:text-white focus:bg-indigo-900/80">
                          Your Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/settings')} className="text-blue-300 focus:text-white focus:bg-indigo-900/80">
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-white focus:bg-red-900/80">
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </header>
            
            {/* Preview Mode Banner */}
            {isPreviewMode && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white px-4 py-2 border-b border-purple-500/50 shadow-lg shadow-purple-900/20"
              >
                <div className="container mx-auto flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <Eye className="h-5 w-5 text-blue-300" />
                      <motion.div 
                        className="absolute inset-0 rounded-full bg-blue-400" 
                        initial={{ scale: 1, opacity: 0.3 }}
                        animate={{ scale: 1.6, opacity: 0 }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          ease: "easeOut" 
                        }}
                      />
                    </div>
                    <span className="font-medium text-blue-300">ADMIN PREVIEW MODE</span>
                    <span className="ml-2 text-sm text-gray-300">Viewing platform as a regular KloudBugs miner</span>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-blue-900/50 text-blue-300 hover:bg-blue-800/70 border border-blue-500/50 backdrop-blur-sm"
                    onClick={() => {
                      sessionStorage.removeItem('adminPreviewMode');
                      setIsPreviewMode(false);
                      navigate('/admin');
                      toast({
                        title: "Exited Preview Mode",
                        description: "Returning to admin command center",
                        variant: "default"
                      });
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Return to Command Center
                  </Button>
                </div>
              </motion.div>
            )}
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto backdrop-blur-sm bg-transparent p-4 sm:p-6 lg:p-8">
              <div className="space-theme-container max-w-7xl mx-auto">
                <AppHeader />
                
                {/* Content with enhanced 3D cosmic holographic styles - Wider with expanded purple borders */}
                <div className="cosmic-content relative z-10 perspective-1000 p-3 mx-2 lg:mx-4">
                  {/* Cosmic Backdrop Effect - A glowing frame around the content */}
                  <div className="absolute inset-0 -z-10 rounded-xl overflow-hidden border-[3px] border-purple-500/80">
                    {/* Stellar nebula background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-black/90 to-blue-950/80 opacity-80"></div>
                    
                    {/* Digital grid overlay */}
                    <div 
                      className="absolute inset-0 opacity-20" 
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px',
                        transformStyle: 'preserve-3d',
                        transform: 'rotateX(80deg) translateZ(-100px)',
                        perspective: '1000px'
                      }}
                    />
                    
                    {/* Glowing radial effect */}
                    <motion.div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.2) 0%, transparent 70%)'
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.7, 0.5]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 10,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Animated glitchy scanlines */}
                    <motion.div 
                      className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none"
                      animate={{}}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                          key={`scanline-${i}`}
                          className="absolute inset-x-0 h-px bg-cyan-400/50"
                          style={{ top: `${i * 20}%` }}
                          animate={{ 
                            opacity: [0.2, 0.8, 0.2],
                            scaleY: [1, 2, 1],
                            filter: ['blur(0px)', 'blur(1px)', 'blur(0px)']
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 3 + i,
                            ease: "easeInOut",
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                  
                  {/* Glowing Borders - Purple Edge Highlight Effect - Enhanced glow */}
                  <motion.div 
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ boxShadow: '0 0 0 2px rgba(147, 51, 234, 0.8), 0 0 15px rgba(147, 51, 234, 0.6)', zIndex: 1 }}
                    animate={{ 
                      boxShadow: [
                        '0 0 0 2px rgba(147, 51, 234, 0.8), 0 0 10px rgba(147, 51, 234, 0.4)', 
                        '0 0 0 3px rgba(147, 51, 234, 0.9), 0 0 25px rgba(147, 51, 234, 0.7)', 
                        '0 0 0 2px rgba(147, 51, 234, 0.8), 0 0 10px rgba(147, 51, 234, 0.4)'
                      ] 
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Corner Accents for Futuristic Edge Effect - Purple Theme */}
                  {[
                    'top-0 left-0 border-t-2 border-l-2 rounded-tl-xl', 
                    'top-0 right-0 border-t-2 border-r-2 rounded-tr-xl', 
                    'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl', 
                    'bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl'
                  ].map((position, i) => (
                    <motion.div
                      key={`corner-${i}`}
                      className={`absolute ${position} w-16 h-16 border-purple-500 z-20`}
                      animate={{
                        opacity: [0.7, 1, 0.7],
                        boxShadow: [
                          'inset 0 0 5px rgba(147, 51, 234, 0.3)',
                          'inset 0 0 15px rgba(147, 51, 234, 0.6)',
                          'inset 0 0 5px rgba(147, 51, 234, 0.3)'
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5
                      }}
                    />
                  ))}
                  
                  {/* Main content with subtle 3D transformations */}
                  <motion.div 
                    className="relative z-10 p-4"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ 
                      z: [0, 5, 0] 
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 10,
                      ease: "easeInOut"
                    }}
                  >
                    {children}
                  </motion.div>
                </div>
                
                {/* Enhanced animated space elements in the background */}
                <div className="cosmic-elements absolute inset-0 z-0 pointer-events-none overflow-hidden">
                  {/* Celestial bodies - planets, stars, etc. */}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div 
                      key={`planet-${i}`}
                      className={`absolute w-${Math.floor(Math.random() * 8) + 2} h-${Math.floor(Math.random() * 8) + 2} rounded-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 shadow-lg shadow-purple-500/10`}
                      style={{
                        top: `${Math.random() * 80}%`,
                        left: `${Math.random() * 90}%`,
                        transformStyle: 'preserve-3d'
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.3, 0.7, 0.3],
                        rotate: [0, 360],
                        z: [-20, 20, -20]
                      }}
                      transition={{
                        duration: 8 + i * 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  
                  {/* Floating Stars */}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={`star-${i}`}
                      className="absolute rounded-full bg-white"
                      style={{
                        width: `${Math.random() * 2 + 1}px`,
                        height: `${Math.random() * 2 + 1}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
                        transformStyle: 'preserve-3d',
                        transform: `translateZ(${Math.random() * 50}px)`
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.8, 0.3],
                        filter: ['blur(0px)', 'blur(1px)', 'blur(0px)']
                      }}
                      transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  
                  {/* Digital Data Streams */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={`datastream-${i}`}
                      className="absolute w-px bg-gradient-to-b from-blue-500/0 via-cyan-500/60 to-blue-500/0"
                      style={{
                        height: `${Math.random() * 20 + 10}%`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 80}%`,
                        transformStyle: 'preserve-3d'
                      }}
                      animate={{
                        opacity: [0.2, 0.6, 0.2],
                        height: [`${Math.random() * 20 + 10}%`, `${Math.random() * 30 + 15}%`, `${Math.random() * 20 + 10}%`],
                        filter: ['blur(0px)', 'blur(1px)', 'blur(0px)']
                      }}
                      transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  
                  {/* Floating Holographic Particles */}
                  {Array.from({ length: 15 }).map((_, i) => {
                    const size = Math.random() * 6 + 2;
                    return (
                      <motion.div
                        key={`holo-particle-${i}`}
                        className="absolute rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/10"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          transformStyle: 'preserve-3d',
                          boxShadow: '0 0 8px rgba(6, 182, 212, 0.3)'
                        }}
                        animate={{
                          y: [0, -30, 0],
                          x: [0, Math.random() * 20 - 10, 0],
                          opacity: [0.1, 0.6, 0.1],
                          scale: [1, 1.2, 1],
                          z: [-10, 30, -10]
                        }}
                        transition={{
                          duration: 10 + i,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    );
                  })}
                  
                  {/* Cosmic Energy Pulses */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      opacity: [0, 0.03, 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 8,
                      ease: "easeInOut"
                    }}
                  >
                    <div 
                      className="w-full h-full"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.4) 0%, transparent 70%)'
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </MiningProvider>
    </div>
  );
}

export default MainLayout;
