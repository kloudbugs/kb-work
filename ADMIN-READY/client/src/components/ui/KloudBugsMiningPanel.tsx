import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { MiningControl } from './MiningControl';
import { MiningControlKnobs } from './MiningControlKnobs';
import MiningChart from './MiningChart';
import DeviceTable from './DeviceTable';
import { MinerCard } from './MinerCard';
import { MiningLog } from './MiningLog';
import { GlobeVisualization } from './GlobeVisualization';
import { useQuery } from '@tanstack/react-query';
import { useMining } from '@/contexts/MiningContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Cpu, RefreshCw, Move, Plus, MoreHorizontal,
  ChevronDown, ChevronUp, Maximize2, Minimize2, BarChart3,
  Server, Activity, Settings, Database, Layers, Zap,
  Globe, LineChart, PieChart, BarChart, Users, Shield, Wallet,
  DollarSign, Tv, MessageSquare as MessageSquareText
} from 'lucide-react';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Define the Device interface
interface Device {
  id: string | number;
  name: string;
  ipAddress?: string;
  type: string;
  status: string;
  cpuAllocation?: number;
  ramAllocation?: number;
  hashRate?: number;
  lastSeen?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  duration: number;
}

export default function KloudBugsMiningPanel() {
  // Get mining context
  const miningContext = useMining();
  
  // Track active tab
  const [activeTab, setActiveTab] = useState('broadcast');
  
  // Fetch the connected devices
  const { data: devices } = useQuery({
    queryKey: ['/api/devices'],
    queryFn: async () => {
      const response = await fetch('/api/devices');
      if (!response.ok) {
        throw new Error('Failed to fetch devices');
      }
      return response.json();
    },
  });

  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Generate random particle positions
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10
    }));
    setParticles(newParticles);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {/* Cosmic Space Background with Particles */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-blue-900/30 rounded-lg overflow-hidden z-0">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/70"
            animate={{
              x: [
                `${particle.x}%`, 
                `${particle.x + (Math.random() * 10 - 5)}%`,
                `${particle.x}%`
              ],
              y: [
                `${particle.y}%`, 
                `${particle.y + (Math.random() * 10 - 5)}%`,
                `${particle.y}%`
              ],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              repeat: Infinity,
              duration: particle.duration,
              ease: "linear"
            }}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
          />
        ))}
        
        {/* Grid lines for cyber effect */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(50, 138, 241, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(50, 138, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        />
      </div>
      
      {/* Enhanced cosmic border wrapper */}
      <div className="relative z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 via-indigo-500/50 to-purple-600/50 rounded-lg blur-md"></div>
        
        {/* Pulsing star effect */}
        <motion.div 
          className="absolute -inset-3 pointer-events-none"
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [0.98, 1.02, 0.98]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`cosmic-star-${i}`}
              className="absolute rounded-full bg-purple-500"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: 'blur(1px)'
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
        </motion.div>
          
        <Card className="bg-black/70 backdrop-blur-md border-2 border-purple-500/50 shadow-lg shadow-purple-500/30 rounded-lg overflow-hidden relative z-10">
          {/* Enhanced Digital Glow Top Border */}
          <motion.div 
            className="h-2 w-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600"
            animate={{
              backgroundPosition: ['0% 0%', '100% 0%'],
              boxShadow: [
                '0 0 5px rgba(147, 51, 234, 0.5)',
                '0 0 15px rgba(147, 51, 234, 0.8)',
                '0 0 5px rgba(147, 51, 234, 0.5)'
              ]
            }}
            transition={{
              backgroundPosition: {
                duration: 5,
                repeat: Infinity,
                ease: 'linear'
              },
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            style={{ backgroundSize: '200% 100%' }}
          />
      
          {/* SINGLE PANEL WITH ONE HEADER */}
          <div className="p-4">
            <div className="relative perspective-1000">
              {/* Background Effect */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 opacity-70"></div>
                
                {/* Distant Stars */}
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={`star-${i}`}
                    className="absolute rounded-full bg-white"
                    initial={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5 + 0.2,
                      scale: Math.random() * 0.5 + 0.2
                    }}
                    animate={{
                      opacity: [0.2, 0.7, 0.2],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: Math.random() * 4 + 2,
                      ease: "easeInOut"
                    }}
                    style={{
                      width: Math.random() * 2 + 1 + 'px',
                      height: Math.random() * 2 + 1 + 'px'
                    }}
                  />
                ))}
                
                {/* Digital Grid Universe */}
                <div 
                  className="absolute inset-0" 
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(50, 138, 241, 0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(50, 138, 241, 0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                />
                
                {/* Stellar Nebula Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20 mix-blend-overlay"></div>
              </div>
            
              <motion.div 
                className="flex flex-col gap-6 relative z-10"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {/* SINGLE MAIN CONTAINER */}
                <div className="w-full">
                  {/* SINGLE HEADER FOR THE COMMAND CENTER */}
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-blue-500/30 p-3 shadow-lg shadow-blue-500/20 relative overflow-hidden">
                    {/* Header with Title */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <motion.div
                          animate={{ 
                            y: [0, -2, 0], 
                            x: [0, 1, 0],
                            rotate: [0, 5, 0, -5, 0]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 3,
                            ease: "easeInOut" 
                          }}
                          className="mr-2"
                        >
                          <Sparkles className="h-5 w-5 text-purple-400" />
                        </motion.div>
                        <h3 className="text-base font-bold text-purple-300 tracking-wider relative">
                          <span>KLOUD BUGS MINING COMMAND CENTER</span>
                          <motion.span
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500 to-purple-500/0"
                            animate={{
                              opacity: [0.3, 0.8, 0.3],
                              width: ["70%", "100%", "70%"]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 3,
                              ease: "easeInOut"
                            }}
                            style={{ left: "50%", transform: "translateX(-50%)" }}
                          />
                        </h3>
                      </div>
                      
                      {/* Header Control Buttons */}
                      <div className="flex space-x-2">
                        <motion.button
                          className="w-7 h-7 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400 hover:bg-purple-800/60"
                          whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(147, 51, 234, 0.5)" }}
                          whileTap={{ scale: 0.95 }}
                          title="Refresh Data"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </motion.button>
                        
                        <motion.button
                          className="w-7 h-7 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400 hover:bg-purple-800/60"
                          whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(147, 51, 234, 0.5)" }}
                          whileTap={{ scale: 0.95 }}
                          title="Settings"
                        >
                          <Settings className="h-3.5 w-3.5" />
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Main Content Area */}
                    <div className="p-4 bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg">
                      {/* SECURE ACCESS STATUS */}
                      <div className="flex items-center space-x-3 mb-6 p-3 rounded-lg border border-green-500/30 bg-black/30">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 2 
                          }}
                        >
                          <Shield className="h-6 w-6 text-green-500" />
                        </motion.div>
                        <div>
                          <div className="text-sm font-medium text-green-400">SECURE MINING ACCESS AUTHORIZED</div>
                          <div className="text-xs text-green-300/70">Connection protected with quantum-resistant encryption</div>
                        </div>
                      </div>
                      
                      {/* Main dashboard content */}
                      <div className="w-full">
                        {/* Header with cosmic glow */}
                        <div className="relative bg-black/40 p-1 border border-blue-500/30 rounded-md mb-4 flex items-center justify-center">
                          <div className="flex items-center gap-1.5 text-blue-300 py-2 px-4">
                            <BarChart3 className="h-4 w-4" />
                            <span className="font-medium">KLOUD BUGS MINING DASHBOARD</span>
                          </div>
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-blue-800/0 via-blue-600/20 to-blue-800/0 rounded-sm opacity-40"
                            animate={{ 
                              backgroundPosition: ['0% 0%', '100% 0%'],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: 'linear'
                            }}
                            style={{ backgroundSize: '200% 100%' }}
                          />
                        </div>
                        
                        {/* Main dashboard content */}
                        <div className="space-y-4">
                          {/* Mining Dashboard */}
                          <div className="mt-2">
                            <MiningChart showHashrate={false} />
                          </div>
                          
                          {/* Wallet Balance and Mining Controls */}
                          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* WALLET BALANCE BOX */}
                            <div className="p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-purple-500/30 relative overflow-hidden">
                              {/* Cosmic Background Effects */}
                              <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/0 to-indigo-900/20 mix-blend-overlay"></div>
                                {/* Subtle grid lines */}
                                <div 
                                  className="absolute inset-0" 
                                  style={{
                                    backgroundImage: `
                                      linear-gradient(to right, rgba(139, 92, 246, 0.05) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
                                    `,
                                    backgroundSize: '20px 20px'
                                  }}
                                />
                              </div>
                              
                              <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    <Wallet className="h-5 w-5 text-purple-400" />
                                    <h3 className="text-purple-300 font-medium">Wallet Balance</h3>
                                  </div>
                                  <Button 
                                    size="sm"
                                    variant="ghost" 
                                    className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 p-1"
                                  >
                                    <RefreshCw className="h-3 w-3" />
                                    <span>Refresh</span>
                                  </Button>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 rounded-md bg-black/40 border border-purple-500/20 mb-3">
                                  <div>
                                    <div className="text-sm text-gray-400">Available Balance</div>
                                    <div className="text-xl font-bold text-purple-300">0.00050000 BTC</div>
                                    <div className="text-xs text-gray-500 mt-1">≈ $27.50 USD</div>
                                  </div>
                                  <div>
                                    <Button className="bg-purple-600 hover:bg-purple-500 text-white">
                                      Withdraw
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-xs">
                                  <div className="text-gray-500">Last updated: 3 min ago</div>
                                  <a href="/wallet" className="text-purple-400 hover:text-purple-300">View Details →</a>
                                </div>
                              </div>
                            </div>
                            
                            {/* MINING CONTROL BOX */}
                            <div className="p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-cyan-500/30 relative overflow-hidden">
                              {/* Cosmic Background Effects */}
                              <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black/0 to-cyan-900/20 mix-blend-overlay"></div>
                                {/* Subtle grid lines */}
                                <div 
                                  className="absolute inset-0" 
                                  style={{
                                    backgroundImage: `
                                      linear-gradient(to right, rgba(34, 211, 238, 0.05) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(34, 211, 238, 0.05) 1px, transparent 1px)
                                    `,
                                    backgroundSize: '20px 20px'
                                  }}
                                />
                              </div>
                              
                              <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    <Cpu className="h-5 w-5 text-cyan-400" />
                                    <h3 className="text-cyan-300 font-medium">Mining Controls</h3>
                                  </div>
                                  <div 
                                    className="px-2 py-1 text-xs bg-green-900/20 text-green-400 border border-green-500/30 rounded-full"
                                  >
                                    Online
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4">
                                  {/* Hashrate Allocation Slider */}
                                  <div className="p-3 rounded-md bg-black/30 border border-cyan-500/20">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="text-sm text-cyan-300">Hashrate Allocation</div>
                                      <div className="text-xs text-cyan-400">75%</div>
                                    </div>
                                    
                                    <div className="relative h-2 bg-black/50 rounded-full overflow-hidden mb-1">
                                      <div 
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
                                        style={{ width: '75%' }}
                                      />
                                    </div>
                                    
                                    <div className="flex justify-between text-xs text-gray-500">
                                      <div>Low</div>
                                      <div>High</div>
                                    </div>
                                  </div>
                                  
                                  {/* Mining Toggle */}
                                  <div className="p-3 rounded-md bg-black/30 border border-cyan-500/20">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm text-cyan-300">Mining Status</div>
                                        <div className="text-xs text-gray-500 mt-1">All connected devices</div>
                                      </div>
                                      
                                      <div className="relative">
                                        <motion.div 
                                          className="absolute -inset-1 bg-cyan-500/30 rounded-full blur-sm"
                                          animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.3, 0.6, 0.3]
                                          }}
                                          transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                          }}
                                        />
                                        <Button 
                                          className="bg-cyan-600 hover:bg-cyan-500 text-white"
                                          size="sm"
                                        >
                                          Active
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* System Status Box */}
                          <div className="mt-6 mx-auto max-w-3xl">
                            <div className="p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-blue-500/30">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Server className="h-5 w-5 text-blue-400" />
                                <h3 className="text-blue-300 font-medium">System Status Overview</h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div className="p-3 rounded-md bg-black/30 border border-blue-600/20">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Activity className="h-4 w-4 text-blue-400" />
                                    <span className="text-sm text-blue-300">Network Activity</span>
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-400">Stable</span>
                                    <span className="text-xs text-green-400">Online</span>
                                  </div>
                                </div>
                                <div className="p-3 rounded-md bg-black/30 border border-blue-600/20">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Shield className="h-4 w-4 text-blue-400" />
                                    <span className="text-sm text-blue-300">Security Status</span>
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-400">Encrypted</span>
                                    <span className="text-xs text-green-400">Protected</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}