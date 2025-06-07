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
      href: '/ai-mining',
      label: 'AI MINING',
      icon: ({ className }: { className?: string }) => (
        <Coffee className={`${className || ''} text-purple-500`} />
      ),
      badge: 'New',
      textColor: 'text-purple-500',
      badgeColor: 'bg-purple-500'
    },
    {
      href: '/ai-mining/unified-dashboard',
      label: 'Unified Dashboard',
      icon: ({ className }: { className?: string }) => (
        <Shield className={`${className || ''} text-purple-500`} />
      ),
      parent: '/ai-mining',
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
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto bg-black/80 backdrop-blur-lg border-r border-cyan-800/30 shadow-lg',
          className
        )}
      >
        <div className="flex flex-col h-full relative z-10">
          {/* Logos with enhanced effects */}
          <div className="flex items-center justify-between p-4 border-b border-cyan-800/30 bg-black/60 relative">
            {/* Network nodes animation behind logos */}
            <div className="absolute inset-0 overflow-hidden" id="logo-nodes-container">
              <NetworkNodesBackground />
            </div>
            
            {/* Logos */}
            <div className="flex space-x-4 z-10">
              <img src={kloudbugsLogo} alt="KLOUDBUGSZIGMINER" className="w-32 h-32 object-contain rounded-lg" />
              <img src={teraLogo} alt="TERA Token" className="w-32 h-32 object-contain rounded-lg" />
              <img src={satoshiMinerLogo} alt="Satoshi Bean Miner" className="w-32 h-32 object-contain rounded-lg" />
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
                              ) : (
                                <span 
                                  className={`px-1.5 py-0.5 text-xs rounded-full ${item.badgeColor}`}
                                >
                                  {item.badge}
                                </span>
                              )
                            )}
                          </div>
                        </Link>
                      </motion.li>
                      
                      {hasChildren && hoveredParent === item.href && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="ml-6 border-l border-cyan-800/30"
                        >
                          {children.map((child) => (
                            <Link 
                              key={child.href}
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
                                <span 
                                  className={`flex-grow text-sm ${
                                    child.parent === '/admin-dashboard' ? 'text-red-500' : 
                                    child.parent === '/wallet' ? 'text-green-500' :
                                    child.parent === '/tera-token' ? 'text-orange-500' :
                                    child.parent === '/mining-cafe' ? 'text-purple-500' :
                                    child.parent === '/brew-station' ? 'text-amber-500' :
                                    ''
                                  }`}
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
                className="w-full"
                onClick={() => setShowAddDeviceDialog(true)}
              >
                ADD NEW DEVICE
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
