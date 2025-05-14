import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AddDeviceDialog } from '@/components/dialogs/AddDeviceDialog';
import { NetworkNodesBackground } from '@/components/ui/NetworkNodesBackground';
import teraLogo from '@/assets/tera-logo.png';
import satoshiMinerLogo from '@/assets/satoshi_miner_logo.png';
import kloudbugsLogo from '@/assets/kloudbugs_logo.png';
import {
  Home,
  Cpu,
  Users,
  Wallet,
  Settings as SettingsIcon,
  X,
  Zap,
  Wrench,
  Server,
  CoinsIcon,
  Key,
  Bitcoin,
  Coffee,
  Activity,
  Shield,
  Ghost,
  Tv,
  MessageSquareText
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  className?: string;
}

export function Sidebar({ sidebarOpen, setSidebarOpen, className }: SidebarProps) {
  const [location] = useLocation();
  const [showAddDeviceDialog, setShowAddDeviceDialog] = React.useState(false);
  const [hoveredParent, setHoveredParent] = React.useState<string | null>(null);
  
  const navItems = [
    { 
      href: '/', 
      label: 'Dashboard', 
      icon: ({ className }: { className?: string }) => (
        <Home className={`${className || ''} text-purple-500`} />
      ),
      textColor: 'text-purple-500',
      badgeColor: 'bg-purple-500'
    },
    {
      href: '/tera-token',
      label: 'TERA Token',
      icon: ({ className }: { className?: string }) => (
        <div className="relative">
          {/* Gold glow effect */}
          <motion.div 
            className="absolute -inset-1.5 rounded-full opacity-70 blur-md"
            style={{
              background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, rgba(218,165,32,0.4) 70%, rgba(184,134,11,0.2) 100%)'
            }}
            animate={{ 
              scale: [0.9, 1.1, 0.9],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          {/* 3D embossed coin effect */}
          <motion.div
            style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #f5bc00 40%, #e6a700 60%, #cc8f00 80%, #ffd700 100%)',
              borderRadius: '50%',
              padding: '2px',
              boxShadow: 'inset 0 0 4px rgba(255,255,255,0.8), 0 0 2px rgba(0,0,0,0.5), 0 4px 4px -2px rgba(0,0,0,0.4)'
            }}
            animate={{ 
              boxShadow: [
                'inset 0 0 4px rgba(255,255,255,0.8), 0 0 2px rgba(0,0,0,0.5), 0 4px 4px -2px rgba(0,0,0,0.4)', 
                'inset 0 0 8px rgba(255,255,255,0.9), 0 0 4px rgba(0,0,0,0.7), 0 6px 6px -3px rgba(0,0,0,0.5)', 
                'inset 0 0 4px rgba(255,255,255,0.8), 0 0 2px rgba(0,0,0,0.5), 0 4px 4px -2px rgba(0,0,0,0.4)'
              ],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative flex items-center justify-center"
          >
            <Bitcoin className={`${className || ''} text-amber-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]`} 
              style={{
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))'
              }}
            />
          </motion.div>
          
          {/* Specular highlight */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full rounded-full overflow-hidden pointer-events-none"
            animate={{
              opacity: [0.4, 0.7, 0.4],
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 50%)',
              mixBlendMode: 'overlay'
            }}
          />
        </div>
      ),
      badge: 'Justice',
      textColor: 'bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]',
      badgeColor: 'bg-gradient-to-r from-amber-600 to-yellow-500'
    },
    {
      href: '/tera-token/legacy',
      label: 'Legacy',
      icon: ({ className }: { className?: string }) => (
        <div className="flex items-center -space-x-1 relative">
          <Bitcoin className={`${className || ''} text-amber-500`} />
        </div>
      ),
      badge: 'Family',
      textColor: 'text-amber-500',
      badgeColor: 'bg-amber-500',
      parent: '/tera-token'
    },
    {
      href: '/tera-token/story',
      label: 'Story',
      icon: ({ className }: { className?: string }) => (
        <div className="flex items-center -space-x-1 relative">
          <Bitcoin className={`${className || ''} text-amber-500`} />
        </div>
      ),
      textColor: 'text-amber-500',
      badgeColor: 'bg-amber-500',
      parent: '/tera-token'
    },
    {
      href: '/tera-token/mission',
      label: 'Mission',
      icon: ({ className }: { className?: string }) => (
        <div className="flex items-center -space-x-1 relative">
          <Bitcoin className={`${className || ''} text-amber-500`} />
        </div>
      ),
      textColor: 'text-amber-500',
      badgeColor: 'bg-amber-500',
      parent: '/tera-token'
    },
    {
      href: '/mining-cafe',
      label: 'Mining Cafe',
      icon: ({ className }: { className?: string }) => (
        <Coffee className={`${className || ''} text-purple-500`} />
      ),
      badge: 'New',
      textColor: 'text-purple-500',
      badgeColor: 'bg-purple-500'
    },
    {
      href: '/brew-station',
      label: 'Brew Station',
      icon: ({ className }: { className?: string }) => (
        <div className="flex items-center -space-x-1 relative">
          <Coffee className={`${className || ''} text-amber-500`} />
          <Zap 
            className={`${className || ''} text-green-400 absolute`} 
            style={{ transform: 'scale(0.7)', right: '-2px', top: '-2px' }} 
          />
        </div>
      ),
      badge: 'Brew',
      textColor: 'text-purple-500',
      badgeColor: 'bg-purple-500',
      parent: '/mining-cafe'
    },
    { 
      href: '/wallet', 
      label: 'Cosmic Wallet', 
      icon: ({ className }: { className?: string }) => (
        <div className="relative">
          <motion.div 
            className="absolute -inset-1 rounded-full bg-green-500/30 blur-md"
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <Wallet className={`${className || ''} text-green-500`} />
        </div>
      ),
      textColor: 'text-green-500',
      badge: '$',
      badgeColor: 'bg-green-500',
      parent: '/mining-cafe'
    },
    { 
      href: '/devices', 
      label: 'Devices', 
      icon: Cpu,
      parent: '/mining-cafe'
    },
    { 
      href: '/pools', 
      label: 'Mining Pools', 
      icon: Users,
      parent: '/mining-cafe'
    },
    {
      href: '/bitcoin-mining',
      label: 'Bitcoin Mining',
      icon: ({ className }: { className?: string }) => (
        <div className="flex items-center -space-x-1 relative">
          <Bitcoin className={`${className || ''} text-amber-500`} />
          <Zap 
            className={`${className || ''} text-yellow-400 absolute`} 
            style={{ transform: 'scale(0.7)', right: '-2px', top: '-2px' }} 
          />
        </div>
      ),
      badge: 'Premium',
      parent: '/mining-cafe'
    },
    // ASIC and Advanced Mining are now tabs within Bitcoin Mining page
    { 
      href: '/token-allocation', 
      label: 'Token Allocation', 
      icon: ({ className }: { className?: string }) => (
        <CoinsIcon className={`${className || ''} text-orange-500`} />
      ),
      badge: 'New',
      textColor: 'text-orange-500',
      badgeColor: 'bg-orange-500',
      parent: '/tera-token'
    },
    {
      href: '/broadcast',
      label: 'Broadcast',
      icon: ({ className }: { className?: string }) => (
        <Tv className={`${className || ''} text-blue-500`} />
      ),
      textColor: 'text-blue-500',
      badgeColor: 'bg-blue-500'
    },
    {
      href: '/chat',
      label: 'Chat Room',
      icon: ({ className }: { className?: string }) => (
        <MessageSquareText className={`${className || ''} text-purple-500`} />
      ),
      textColor: 'text-purple-500',
      badgeColor: 'bg-purple-500'
    },
    { 
      href: '/settings', 
      label: 'Settings', 
      icon: ({ className }: { className?: string }) => (
        <SettingsIcon className={`${className || ''} text-black dark:text-white`} />
      ),
      textColor: 'text-black dark:text-white'
    },
    {
      href: '/admin-dashboard',
      label: 'Admin Controls',
      icon: ({ className }: { className?: string }) => (
        <Shield className={`${className || ''} text-red-500`} />
      ),
      badge: 'Admin',
      badgeColor: 'bg-red-500'
    },
    {
      href: '/network-dashboard',
      label: 'Network Stats',
      icon: ({ className }: { className?: string }) => (
        <Activity className={`${className || ''} text-red-500`} />
      ),
      badge: 'Live',
      parent: '/admin-dashboard'
    },
    {
      href: '/admin-dashboard?tab=ghost-mining',
      label: 'Ghost Mining',
      icon: ({ className }: { className?: string }) => (
        <Ghost className={`${className || ''} text-red-500`} />
      ),
      parent: '/admin-dashboard'
    },
    { 
      href: '/special-wallet', 
      label: 'Special Wallet', 
      icon: ({ className }: { className?: string }) => (
        <Key className={`${className || ''} text-red-500`} />
      ),
      badge: 'Secure',
      parent: '/admin-dashboard'
    },
  ];
  
  const isActive = (href: string) => {
    if (href === '/' && location === '/') {
      return true;
    }
    return location.startsWith(href) && href !== '/';
  };
  
  return (
    <>
      <motion.div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-52 backdrop-blur-lg bg-black/80 shadow-lg transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 overflow-hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
        initial={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)' }}
        animate={{ 
          boxShadow: ['0 0 20px rgba(6, 182, 212, 0.2)', '0 0 30px rgba(6, 182, 212, 0.4)', '0 0 20px rgba(6, 182, 212, 0.2)']
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 5,
          ease: "easeInOut"
        }}
      >
        {/* Cosmic Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Stellar Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/90 via-black/95 to-blue-950/90 opacity-90"></div>
          
          {/* Digital Grid */}
          <div 
            className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          ></div>
          
          {/* Animated Scanlines */}
          <motion.div className="absolute inset-0 opacity-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`scanline-${i}`}
                className="absolute inset-x-0 h-px bg-cyan-400"
                style={{ top: `${i * 12.5}%` }}
                animate={{ 
                  opacity: [0.1, 0.3, 0.1],
                  scaleY: [1, 1.5, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3 + i * 0.5,
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
          
          {/* Floating Particles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`sidebar-particle-${i}`}
              className="absolute rounded-full bg-cyan-500/30"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: 'blur(1px)'
              }}
              animate={{
                opacity: [0.1, 0.5, 0.1],
                y: [0, -10, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 4 + Math.random() * 6,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Cosmic Energy Lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`energy-line-${i}`}
              className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
              style={{
                top: `${15 + i * 20}%`,
                left: 0,
                transformOrigin: 'center',
                transform: 'scaleX(0.8)'
              }}
              animate={{
                opacity: [0.1, 0.4, 0.1],
                scaleX: [0.8, 1, 0.8],
                filter: ['blur(0px)', 'blur(1px)', 'blur(0px)']
              }}
              transition={{
                repeat: Infinity,
                duration: 6 + i,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Digital Data Pulse */}
          <motion.div 
            className="absolute bottom-0 left-0 w-full h-36 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(8, 145, 178, 0.1), transparent)'
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              height: ['30%', '40%', '30%']
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="flex flex-col h-full relative z-10">
          {/* Logos with enhanced effects */}
          <div className="flex items-center justify-between p-4 border-b border-cyan-800/30 bg-black/60 relative">
            {/* Network nodes animation behind logos */}
            <div className="absolute inset-0 overflow-hidden" id="logo-nodes-container">
              <NetworkNodesBackground 
                nodeCount={12} 
                parentSelector="#logo-nodes-container" 
                nodeColor="rgba(6, 182, 212, 0.7)"
                connectionColor="rgba(6, 182, 212, 0.3)"
              />
            </div>
            
            <div className="flex items-center space-x-2 relative z-10">
              {/* Original logo with cosmic magnification effect */}
              <div className="w-12 h-12 flex items-center justify-center relative group">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="z-10"
                >
                  <img 
                    src={kloudbugsLogo} 
                    alt="KLOUDBUGSZIGMINER" 
                    className="w-10 h-10 object-contain cursor-pointer"
                  />
                </motion.div>
                
                {/* Magnified image that appears on hover */}
                <div className="absolute left-0 top-0 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-all duration-300 transform -translate-y-full scale-0 group-hover:scale-100 origin-bottom-left">
                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Cosmic backdrop */}
                    <motion.div 
                      className="absolute -inset-4 bg-gradient-to-r from-blue-600/40 via-cyan-500/40 to-blue-600/40 rounded-lg blur-md"
                      animate={{ 
                        opacity: [0.4, 0.8, 0.4],
                        scale: [0.98, 1.02, 0.98] 
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Electric border */}
                    <div className="relative p-1 bg-black/80 backdrop-blur-lg rounded-lg border border-cyan-500/30 shadow-xl">
                      <img 
                        src={kloudbugsLogo} 
                        alt="KLOUDBUGSZIGMINER"
                        className="w-32 h-32 object-contain rounded-lg" 
                      />
                      
                      {/* Caption */}
                      <div className="absolute bottom-2 left-0 right-0 text-center">
                        <p className="text-xs font-bold text-cyan-400 bg-black/60 mx-2 rounded-full py-1 px-2">
                          KLOUDBUGSZIGMINER
                        </p>
                      </div>
                      
                      {/* Corner accents */}
                      {['top-0 left-0 border-t-2 border-l-2 rounded-tl-lg', 
                        'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg', 
                        'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg', 
                        'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg'
                      ].map((position, i) => (
                        <motion.div
                          key={`corner-${i}`}
                          className={`absolute ${position} w-3 h-3 border-cyan-400 z-20`}
                          animate={{
                            opacity: [0.6, 1, 0.6],
                            boxShadow: [
                              'inset 0 0 3px rgba(6, 182, 212, 0.3)',
                              'inset 0 0 6px rgba(6, 182, 212, 0.6)',
                              'inset 0 0 3px rgba(6, 182, 212, 0.3)'
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* TERA Token logo with cosmic magnification effect */}
              <div className="w-12 h-12 flex items-center justify-center relative group">
                <motion.div className="relative w-10 h-10 z-10">
                  <motion.div 
                    className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full opacity-20 blur-sm"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.img 
                    src={teraLogo} 
                    alt="TERA Token" 
                    className="w-full h-full object-contain rounded-full cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  />
                </motion.div>
                
                {/* Magnified image that appears on hover */}
                <div className="absolute left-0 top-0 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-all duration-300 transform -translate-y-full scale-0 group-hover:scale-100 origin-bottom-left">
                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Cosmic backdrop */}
                    <motion.div 
                      className="absolute -inset-4 bg-gradient-to-r from-amber-500/40 via-yellow-400/40 to-amber-500/40 rounded-lg blur-md"
                      animate={{ 
                        opacity: [0.4, 0.8, 0.4],
                        scale: [0.98, 1.02, 0.98] 
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Electric border */}
                    <div className="relative p-1 bg-black/80 backdrop-blur-lg rounded-lg border border-amber-500/30 shadow-xl">
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          boxShadow: [
                            '0 0 5px rgba(245, 158, 11, 0.5)', 
                            '0 0 20px rgba(245, 158, 11, 0.8)', 
                            '0 0 5px rgba(245, 158, 11, 0.5)'
                          ]
                        }}
                        transition={{ 
                          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="rounded-full"
                      >
                        <img 
                          src={teraLogo} 
                          alt="TERA Token"
                          className="w-32 h-32 object-contain rounded-full" 
                        />
                      </motion.div>
                      
                      {/* Caption */}
                      <div className="absolute bottom-2 left-0 right-0 text-center">
                        <p className="text-xs font-bold text-amber-400 bg-black/60 mx-2 rounded-full py-1 px-2">
                          TERA TOKEN
                        </p>
                      </div>
                      
                      {/* Corner accents */}
                      {['top-0 left-0 border-t-2 border-l-2 rounded-tl-lg', 
                        'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg', 
                        'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg', 
                        'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg'
                      ].map((position, i) => (
                        <motion.div
                          key={`corner-tera-${i}`}
                          className={`absolute ${position} w-3 h-3 border-amber-400 z-20`}
                          animate={{
                            opacity: [0.6, 1, 0.6],
                            boxShadow: [
                              'inset 0 0 3px rgba(245, 158, 11, 0.3)',
                              'inset 0 0 6px rgba(245, 158, 11, 0.6)',
                              'inset 0 0 3px rgba(245, 158, 11, 0.3)'
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Justice Mining logo with cosmic magnification effect */}
              <div className="w-12 h-12 flex items-center justify-center relative group">
                <motion.div className="relative w-10 h-10 z-10">
                  <motion.div 
                    className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full opacity-30 blur-sm"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.img 
                    src={satoshiMinerLogo} 
                    alt="Satoshi Bean Miner" 
                    className="w-full h-full object-contain cursor-pointer rounded-full overflow-hidden"
                    animate={{ 
                      boxShadow: [
                        '0 0 0px rgba(147, 51, 234, 0.5)', 
                        '0 0 12px rgba(192, 38, 211, 0.8)', 
                        '0 0 0px rgba(147, 51, 234, 0.5)'
                      ] 
                    }}
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
                
                {/* Magnified image that appears on hover */}
                <div className="absolute left-0 top-0 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-all duration-300 transform -translate-y-full scale-0 group-hover:scale-100 origin-bottom-left">
                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Cosmic backdrop */}
                    <motion.div 
                      className="absolute -inset-4 bg-gradient-to-r from-purple-600/40 via-fuchsia-500/40 to-purple-600/40 rounded-lg blur-md"
                      animate={{ 
                        opacity: [0.4, 0.8, 0.4],
                        scale: [0.98, 1.02, 0.98] 
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Digital scan effect */}
                    <motion.div
                      className="absolute inset-0 overflow-hidden rounded-lg"
                      style={{ zIndex: 15 }}
                    >
                      <motion.div 
                        className="absolute w-full h-2 bg-purple-400/40 blur-sm"
                        initial={{ top: "-10%" }}
                        animate={{ top: "110%" }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 1
                        }}
                      />
                    </motion.div>
                    
                    {/* Electric border */}
                    <div className="relative p-1 bg-black/80 backdrop-blur-lg rounded-lg border border-purple-500/30 shadow-xl">
                      <img 
                        src={satoshiMinerLogo} 
                        alt="Satoshi Bean Miner"
                        className="w-32 h-32 object-contain" 
                      />
                      
                      {/* Caption */}
                      <div className="absolute bottom-2 left-0 right-0 text-center">
                        <p className="text-xs font-bold text-purple-400 bg-black/60 mx-2 rounded-full py-1 px-2">
                          JUSTICE MINING
                        </p>
                      </div>
                      
                      {/* Corner accents */}
                      {['top-0 left-0 border-t-2 border-l-2 rounded-tl-lg', 
                        'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg', 
                        'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg', 
                        'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg'
                      ].map((position, i) => (
                        <motion.div
                          key={`corner-justice-${i}`}
                          className={`absolute ${position} w-3 h-3 border-purple-400 z-20`}
                          animate={{
                            opacity: [0.6, 1, 0.6],
                            boxShadow: [
                              'inset 0 0 3px rgba(147, 51, 234, 0.3)',
                              'inset 0 0 6px rgba(147, 51, 234, 0.6)',
                              'inset 0 0 3px rgba(147, 51, 234, 0.3)'
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation with cosmic effects */}
          <nav className="flex-1 overflow-y-auto py-4 relative">
            {/* Animated pulse behind active menu item */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className="absolute w-full h-10 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 pointer-events-none"
                style={{ 
                  top: `calc(${navItems.findIndex(item => isActive(item.href)) * 56 + 32}px)`  
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
            </div>
            
            <ul className="relative z-10">
              {navItems
                .filter(item => !item.parent) // Show all top-level menu items
                .map((item, index) => {
                  // Find child items for the current parent
                  const children = navItems.filter(child => child.parent === item.href);
                  const hasChildren = children.length > 0;
                  const isCurrentActive = isActive(item.href) || children.some(child => isActive(child.href));
                  
                  return (
                    <React.Fragment key={item.href}>
                      <motion.li 
                        className="px-3 py-2"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        onMouseEnter={() => hasChildren && setHoveredParent(item.href)}
                        onMouseLeave={() => setHoveredParent(null)}
                      >
                        <Link 
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm font-medium rounded-md relative overflow-hidden group",
                            isCurrentActive
                              ? "bg-cyan-900/30 text-cyan-100 backdrop-blur-md border border-cyan-500/30" 
                              : "text-gray-400 hover:text-gray-100 hover:bg-cyan-900/10 hover:border hover:border-cyan-500/10"
                          )}
                        >
                          {isCurrentActive && (
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-r from-cyan-950/0 via-cyan-900/30 to-cyan-950/0"
                              animate={{
                                backgroundPosition: ['0% 0%', '100% 0%'],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 3,
                                ease: "linear"
                              }}
                              style={{
                                backgroundSize: '200% 100%',
                              }}
                            />
                          )}
                          
                          <div className="relative z-10 flex items-center w-full">
                            <item.icon className="h-5 w-5 mr-3" />
                            <span 
                              className={`flex-grow ${
                                item.href === '/admin-dashboard' ? 'text-red-500 font-bold' : 
                                item.href === '/wallet' ? 'text-green-500 font-medium' : 
                                item.href === '/tera-token' ? 'text-orange-500 font-medium' : 
                                item.href === '/token-allocation' ? 'text-orange-500 font-medium' : 
                                item.href === '/mining-cafe' ? 'text-purple-500 font-medium' : 
                                item.href === '/' ? 'text-purple-500 font-medium' : 
                                item.href === '/dashboard' ? 'text-purple-500 font-medium' : 
                                item.href === '/brew-station' ? 'text-purple-500 font-medium' :
                                item.href === '/settings' ? 'text-purple-500 font-medium' : ''
                              }`} 
                              style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em" }}
                            >
                              {item.label}
                            </span>
                            
                            {item.badge && (
                              item.href === '/tera-token' ? (
                                <motion.span
                                  className="px-1.5 py-0.5 text-xs rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-white"
                                  animate={{ 
                                    boxShadow: [
                                      '0 0 0px rgba(249, 115, 22, 0.5)', 
                                      '0 0 5px rgba(249, 115, 22, 0.8)', 
                                      '0 0 0px rgba(249, 115, 22, 0.5)'
                                    ],
                                    scale: [1, 1.05, 1]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                  {item.badge}
                                </motion.span>
                              ) : item.href === '/admin-dashboard' ? (
                                <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white">
                                  {item.badge}
                                </span>
                              ) : item.href === '/mining-cafe' ? (
                                <span className="px-1.5 py-0.5 text-xs rounded-full bg-purple-500 text-white">
                                  {item.badge}
                                </span>
                              ) : item.href === '/wallet' ? (
                                <motion.span
                                  className="px-1.5 py-0.5 text-xs rounded-full bg-gradient-to-r from-green-500 to-green-400 text-white"
                                  animate={{ 
                                    boxShadow: [
                                      '0 0 0px rgba(34, 197, 94, 0.5)', 
                                      '0 0 5px rgba(34, 197, 94, 0.8)', 
                                      '0 0 0px rgba(34, 197, 94, 0.5)'
                                    ],
                                    scale: [1, 1.1, 1]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                  style={{ fontWeight: 'bold', fontSize: '14px' }}
                                >
                                  {item.badge}
                                </motion.span>
                              ) : item.href === '/token-allocation' ? (
                                <motion.span
                                  className="px-1.5 py-0.5 text-xs rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-white"
                                  animate={{ 
                                    boxShadow: [
                                      '0 0 0px rgba(249, 115, 22, 0.5)', 
                                      '0 0 5px rgba(249, 115, 22, 0.8)', 
                                      '0 0 0px rgba(249, 115, 22, 0.5)'
                                    ],
                                    scale: [1, 1.05, 1]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                  {item.badge}
                                </motion.span>
                              ) : (
                                <span className="px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground">
                                  {item.badge}
                                </span>
                              )
                            )}
                          </div>
                        </Link>
                      </motion.li>
                      
                      {/* Render children if any */}
                      {hasChildren && (isActive(item.href) || children.some(child => isActive(child.href)) || hoveredParent === item.href) && (
                        <motion.div 
                          className={`ml-7 border-l-2 pl-3 my-1 ${
                            item.href === '/admin-dashboard' ? 'border-red-500' : 
                            item.href === '/wallet' ? 'border-green-500' :
                            item.href === '/tera-token' ? 'border-orange-500' :
                            item.href === '/token-allocation' ? 'border-orange-500' :
                            item.href === '/mining-cafe' ? 'border-purple-500' :
                            item.href === '/' ? 'border-purple-500' :
                            item.href === '/brew-station' ? 'border-purple-500' :
                            item.href === '/settings' ? 'border-purple-500' :
                            'border-gray-700'
                          }`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          {children.map((child, childIndex) => (
                            <motion.li 
                              key={child.href} 
                              className="py-1"
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: childIndex * 0.05, duration: 0.2 }}
                            >
                              <Link 
                                href={child.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm font-medium rounded-md relative overflow-hidden group",
                                  isActive(child.href)
                                    ? "bg-cyan-900/20 text-cyan-100 backdrop-blur-sm border border-cyan-500/20" 
                                    : "text-gray-500 hover:text-cyan-100 hover:bg-cyan-900/10 hover:border hover:border-cyan-500/10 dark:text-gray-400"
                                )}
                              >
                                {isActive(child.href) && (
                                  <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-cyan-950/0 via-cyan-900/30 to-cyan-950/0"
                                    animate={{
                                      backgroundPosition: ['0% 0%', '100% 0%'],
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 3,
                                      ease: "linear"
                                    }}
                                    style={{
                                      backgroundSize: '200% 100%',
                                    }}
                                  />
                                )}
                                
                                <div className="relative z-10 flex items-center w-full">
                                  <child.icon className="h-4 w-4 mr-2" />
                                  <span 
                                    className={`flex-grow text-sm ${
                                      child.parent === '/admin-dashboard' ? 'text-red-500' : 
                                      child.parent === '/wallet' ? 'text-green-500' :
                                      child.parent === '/tera-token' ? 'text-orange-500' :
                                      child.parent === '/mining-cafe' ? 'text-purple-500' :
                                      child.parent === '/brew-station' ? 'text-amber-500' :
                                      ''
                                    }`} 
                                    style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em" }}
                                  >
                                    {child.label}
                                  </span>
                                  
                                  {child.badge && (
                                    <span 
                                      className={`px-1.5 py-0.5 text-xs rounded-full ${
                                        child.parent === '/admin-dashboard' ? 'bg-red-500 text-white' : 
                                        child.parent === '/wallet' ? 'bg-green-500 text-white' :
                                        child.parent === '/tera-token' ? 'bg-orange-500 text-white' :
                                        child.parent === '/mining-cafe' ? 'bg-purple-500 text-white' :
                                        child.parent === '/brew-station' ? 'bg-amber-500 text-white' :
                                        'bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground'
                                      }`}
                                    >
                                      {child.badge}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            </motion.li>
                          ))}
                        </motion.div>
                      )}
                    </React.Fragment>
                  );
                })}
            </ul>
          </nav>

          {/* Quick Actions with cosmic effects */}
          <motion.div 
            className="p-4 border-t border-cyan-800/30 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated background effects */}
              <motion.div 
                className="absolute -inset-1 rounded-md opacity-75"
                style={{
                  background: 'linear-gradient(90deg, rgba(8,145,178,0) 0%, rgba(8,145,178,0.4) 50%, rgba(8,145,178,0) 100%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['0% center', '200% center'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Corner accents */}
              {['top-0 left-0 border-t-2 border-l-2 rounded-tl-md', 
                'top-0 right-0 border-t-2 border-r-2 rounded-tr-md', 
                'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-md', 
                'bottom-0 right-0 border-b-2 border-r-2 rounded-br-md'
              ].map((position, i) => (
                <motion.div
                  key={`add-button-corner-${i}`}
                  className={`absolute ${position} w-3 h-3 border-cyan-400 z-20`}
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    boxShadow: [
                      'inset 0 0 3px rgba(6, 182, 212, 0.3)',
                      'inset 0 0 6px rgba(6, 182, 212, 0.6)',
                      'inset 0 0 3px rgba(6, 182, 212, 0.3)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3
                  }}
                />
              ))}
              
              <Button 
                className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500 text-white relative backdrop-blur-sm border border-cyan-500/30 z-10"
                onClick={() => setShowAddDeviceDialog(true)}
                style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em" }}
              >
                <motion.div 
                  animate={{ 
                    textShadow: ['0 0 0px rgba(6, 182, 212, 0.5)', '0 0 5px rgba(6, 182, 212, 0.8)', '0 0 0px rgba(6, 182, 212, 0.5)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 180, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="mr-2"
                  >
                    <Cpu className="h-5 w-5 text-cyan-300" />
                  </motion.div>
                  ADD NEW DEVICE
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      <AddDeviceDialog 
        open={showAddDeviceDialog} 
        onOpenChange={setShowAddDeviceDialog} 
      />
    </>
  );
}

export default Sidebar;