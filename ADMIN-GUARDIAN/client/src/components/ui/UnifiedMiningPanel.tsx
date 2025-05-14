import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { MiningControl } from './MiningControl';
import { MiningControlKnobs } from './MiningControlKnobs';
import MiningChart from './MiningChart';
/* MiningStatusPanel functionality has been moved to MiningControlKnobs */
import DeviceTable from './DeviceTable';
import { MinerCard } from './MinerCard';
import { MiningLog } from './MiningLog';
import { GlobeVisualization } from './GlobeVisualization';
import { useQuery } from '@tanstack/react-query';
import { useMining } from '@/contexts/MiningContext';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { 
  Sparkles, Cpu, RefreshCw, Move, Plus, MoreHorizontal,
  ChevronDown, ChevronUp, Maximize2, Minimize2, BarChart3,
  Server, Activity, Settings, Database, Layers, Zap,
  Globe, LineChart, PieChart, BarChart, Users, Lock, Wallet,
  DollarSign, Shield
} from 'lucide-react';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function UnifiedMiningPanel() {
  // Get mining context
  const miningContext = useMining();
  
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

  // Tabs for the unified control panel
  const [activeTab, setActiveTab] = useState('performance');
  
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
      
          {/* 3D Astronomical Digital Mining Performance Hub */}
          <div className="p-4">
            {/* Main 3D Container with Perspective */}
            <div className="relative perspective-1000">
              {/* Cosmic Background Animation */}
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
                    transformStyle: 'preserve-3d',
                    transform: 'rotateX(80deg) translateZ(-100px)',
                    perspective: '1000px'
                  }}
                />
                
                {/* Stellar Nebula Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20 mix-blend-overlay"></div>
              </div>
            
              <motion.div 
                className="flex flex-col md:flex-row gap-6 relative z-10"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Status Panel has been completely removed and integrated into the main control panel */}
                
                {/* 3D Chart - Takes remaining space */}
                <div className="flex-grow order-1 md:order-2 z-10 transform hover:translate-z-10 transition-transform duration-500">
                  <motion.div 
                    className="bg-black/40 backdrop-blur-sm rounded-lg border border-blue-500/30 p-3 shadow-lg shadow-blue-500/20 relative overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Inner Glowing Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 mix-blend-overlay"></div>
                    
                    {/* Digital Data Patterns */}
                    <div className="absolute inset-y-0 right-0 w-20 opacity-10">
                      <div className="h-full flex flex-col justify-between py-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <motion.div 
                            key={i}
                            className="h-1 bg-blue-400"
                            animate={{
                              width: [`${Math.random() * 50 + 10}%`, `${Math.random() * 70 + 30}%`, `${Math.random() * 50 + 10}%`]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: Math.random() * 3 + 2,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Holographic Title - Unified Performance & Control */}
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
                      
                      {/* Interactive Control Buttons */}
                      <div className="flex space-x-2">
                        <motion.button
                          className="w-7 h-7 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400 hover:bg-purple-800/60"
                          whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(147, 51, 234, 0.5)" }}
                          whileTap={{ scale: 0.95 }}
                          title="Refresh Data"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                            <path d="M21 3v5h-5"></path>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                            <path d="M3 21v-5h5"></path>
                          </svg>
                        </motion.button>
                        
                        <motion.button
                          className="w-7 h-7 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400 hover:bg-purple-800/60"
                          whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(147, 51, 234, 0.5)" }}
                          whileTap={{ scale: 0.95 }}
                          title="Maximize Panel"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <polyline points="9 21 3 21 3 15"></polyline>
                            <line x1="21" y1="3" x2="14" y2="10"></line>
                            <line x1="3" y1="21" x2="10" y2="14"></line>
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Unified Mining Performance & Control Panel */}
                    <div className="relative z-10">
                      <motion.div
                        className="relative bg-black/50 backdrop-blur-sm rounded-lg border-2 border-purple-500/40 p-4 shadow-lg shadow-purple-500/20 overflow-hidden"
                        whileHover={{ 
                          boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)",
                          borderColor: "rgba(147, 51, 234, 0.6)"
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {/* Cosmic accents */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <motion.div
                              key={`unified-star-${i}`}
                              className="absolute rounded-full bg-purple-500/70"
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
                        </div>
                        
                        {/* Enhanced glowing corner accents */}
                        {[
                          'top-0 left-0 border-t-2 border-l-2 w-8 h-8 rounded-tl-md',
                          'top-0 right-0 border-t-2 border-r-2 w-8 h-8 rounded-tr-md',
                          'bottom-0 left-0 border-b-2 border-l-2 w-8 h-8 rounded-bl-md',
                          'bottom-0 right-0 border-b-2 border-r-2 w-8 h-8 rounded-br-md'
                        ].map((position, i) => (
                          <motion.div
                            key={`unified-corner-${i}`}
                            className={`absolute ${position} border-purple-500`}
                            animate={{
                              opacity: [0.6, 1, 0.6],
                              boxShadow: [
                                'inset 0 0 8px rgba(147, 51, 234, 0.4)',
                                'inset 0 0 15px rgba(147, 51, 234, 0.7)',
                                'inset 0 0 8px rgba(147, 51, 234, 0.4)'
                              ]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.3
                            }}
                          />
                        ))}
                        
                        {/* Digital moving patterns for background */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none opacity-10"
                          style={{
                            background: `radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 70%)`,
                          }}
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.2, 0.1]
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 5
                          }}
                        />
                        
                        {/* Section title with cosmic effect */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            >
                              <Cpu className="h-4 w-4 text-purple-400" />
                            </motion.div>
                            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wide">
                              SECURE SYSTEM CONTROL
                            </h3>
                          </div>
                          
                          {/* Command Buttons - Smaller with cosmic effects */}
                          <div className="flex space-x-2">
                            <motion.button
                              className="w-6 h-6 rounded-full bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-400 hover:bg-purple-800/60"
                              whileHover={{ 
                                scale: 1.1, 
                                boxShadow: "0 0 10px rgba(147, 51, 234, 0.5)",
                                borderColor: "rgba(147, 51, 234, 0.7)"
                              }}
                              whileTap={{ scale: 0.95 }}
                              title="Refresh Data"
                            >
                              <RefreshCw className="h-3 w-3" />
                            </motion.button>
                            
                            <motion.button
                              className="w-6 h-6 rounded-full bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-400 hover:bg-purple-800/60"
                              whileHover={{ 
                                scale: 1.1, 
                                boxShadow: "0 0 10px rgba(147, 51, 234, 0.5)",
                                borderColor: "rgba(147, 51, 234, 0.7)"
                              }}
                              whileTap={{ scale: 0.95 }}
                              title="Configure"
                            >
                              <Plus className="h-3 w-3" />
                            </motion.button>
                            
                            <motion.button
                              className="w-6 h-6 rounded-full bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-400 hover:bg-purple-800/60"
                              whileHover={{ 
                                scale: 1.1, 
                                boxShadow: "0 0 10px rgba(147, 51, 234, 0.5)",
                                borderColor: "rgba(147, 51, 234, 0.7)"
                              }}
                              whileTap={{ scale: 0.95 }}
                              title="More Options"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </motion.button>
                          </div>
                        </div>
                        
                        {/* Enhanced Combined Content in a unified layout */}
                        <div className="w-full p-6">
                          {/* Unified Mining Control Panel */}
                          <div className="relative z-10 border-2 border-purple-500/50 rounded-lg p-4 bg-black/40 backdrop-blur-md shadow-lg shadow-purple-500/20 mb-6">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <motion.div 
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                  className="mr-2"
                                >
                                  <BarChart3 className="h-4 w-4 text-purple-400" />
                                </motion.div>
                                <span className="text-transparent text-sm font-medium bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 uppercase tracking-wide">
                                  MINING OPERATIONS
                                </span>
                              </div>
                              
                              {/* Status indicator */}
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.05, 1],
                                  opacity: [0.7, 1, 0.7]
                                }}
                                transition={{ 
                                  repeat: Infinity, 
                                  duration: 3
                                }}
                                className="text-xs bg-purple-900/40 border border-purple-500/40 rounded-full px-2 py-1"
                              >
                                <span className="text-purple-300">Status: </span>
                                <span className="text-cyan-300">Active</span>
                              </motion.div>
                            </div>
                            
                            {/* Stat cards in the style of DashboardHeader.tsx */}
                            <div className="flex flex-col lg:flex-row relative z-10 mb-4 bg-black/30 backdrop-blur-sm rounded-lg border border-indigo-500/20 overflow-hidden">
                              <div className="flex-1 flex flex-wrap lg:divide-x divide-blue-500/20">
                                {/* Hash Rate - Enhanced Panel */}
                                <motion.div 
                                  className="p-4 flex-1 min-w-[180px] relative group"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  {/* Holographic Corner Accents */}
                                  <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-cyan-500/50 rounded-tl-sm"></div>
                                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-cyan-500/50 rounded-br-sm"></div>
                                  
                                  <div className="flex items-center relative">
                                    <motion.div 
                                      className="flex-shrink-0 mr-4 bg-blue-900/30 p-2 rounded-full relative overflow-hidden"
                                      animate={{ 
                                        boxShadow: ['0 0 0px rgba(59, 130, 246, 0.5)', '0 0 15px rgba(59, 130, 246, 0.3)', '0 0 0px rgba(59, 130, 246, 0.5)']
                                      }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    >
                                      <motion.div 
                                        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 opacity-80"
                                        animate={{ 
                                          rotate: [0, 360],
                                          opacity: [0.2, 0.4, 0.2]
                                        }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                      />
                                      <Activity className="w-7 h-7 text-cyan-400 relative z-10" />
                                    </motion.div>
                                    
                                    <div>
                                      <div className="flex items-center">
                                        <motion.p 
                                          className="text-sm font-medium text-gray-200 flex items-center"
                                          animate={{ opacity: [0.8, 1, 0.8] }}
                                          transition={{ duration: 2, repeat: Infinity }}
                                        >
                                          HASH RATE
                                          <motion.span
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="ml-2 w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"
                                          />
                                        </motion.p>
                                      </div>
                                      <p className="text-lg font-mono font-semibold text-white bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                                        {miningContext.totalHashRate || "0 H/s"}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Digital Line Animation */}
                                  <motion.div 
                                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/0 via-cyan-500/50 to-blue-500/0"
                                    animate={{
                                      opacity: [0.3, 0.7, 0.3]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  />
                                </motion.div>
                                
                                {/* Earnings - Enhanced Panel */}
                                <motion.div 
                                  className="p-4 flex-1 min-w-[180px] relative group"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  {/* Holographic Corner Accents */}
                                  <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-purple-500/50 rounded-tl-sm"></div>
                                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-purple-500/50 rounded-br-sm"></div>
                                  
                                  <div className="flex items-center relative">
                                    <motion.div 
                                      className="flex-shrink-0 mr-4 bg-indigo-900/30 p-2 rounded-full relative overflow-hidden"
                                      animate={{ 
                                        boxShadow: ['0 0 0px rgba(99, 102, 241, 0.5)', '0 0 15px rgba(99, 102, 241, 0.3)', '0 0 0px rgba(99, 102, 241, 0.5)']
                                      }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    >
                                      <motion.div 
                                        className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-500/20 opacity-80"
                                        animate={{ 
                                          rotate: [0, 360],
                                          opacity: [0.2, 0.4, 0.2]
                                        }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                      />
                                      <DollarSign className="w-7 h-7 text-indigo-400 relative z-10" />
                                    </motion.div>
                                    
                                    <div>
                                      <div className="flex items-center">
                                        <motion.p 
                                          className="text-sm font-medium text-gray-200 flex items-center"
                                          animate={{ opacity: [0.8, 1, 0.8] }}
                                          transition={{ duration: 2, repeat: Infinity }}
                                        >
                                          ESTIMATED EARNINGS
                                          <motion.span
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="ml-2 w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block"
                                          />
                                        </motion.p>
                                      </div>
                                      <p className="text-lg font-mono font-semibold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                                        {(typeof miningContext.estimatedEarnings === 'number' ? miningContext.estimatedEarnings.toFixed(8) : "0.00000000")} <span className="text-sm font-normal text-gray-300">BTC/day</span>
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Digital Line Animation */}
                                  <motion.div 
                                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-indigo-500/0 via-purple-500/50 to-indigo-500/0"
                                    animate={{
                                      opacity: [0.3, 0.7, 0.3]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  />
                                </motion.div>
                                
                                {/* Active Devices - Enhanced Panel */}
                                <motion.div 
                                  className="p-4 flex-1 min-w-[180px] relative group"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  {/* Holographic Corner Accents */}
                                  <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-teal-500/50 rounded-tl-sm"></div>
                                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-teal-500/50 rounded-br-sm"></div>
                                  
                                  <div className="flex items-center relative">
                                    <motion.div 
                                      className="flex-shrink-0 mr-4 bg-teal-900/30 p-2 rounded-full relative overflow-hidden"
                                      animate={{ 
                                        boxShadow: ['0 0 0px rgba(20, 184, 166, 0.5)', '0 0 15px rgba(20, 184, 166, 0.3)', '0 0 0px rgba(20, 184, 166, 0.5)']
                                      }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    >
                                      <motion.div 
                                        className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-emerald-500/20 opacity-80"
                                        animate={{ 
                                          rotate: [0, 360],
                                          opacity: [0.2, 0.4, 0.2]
                                        }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                      />
                                      <Cpu className="w-7 h-7 text-teal-400 relative z-10" />
                                    </motion.div>
                                    
                                    <div>
                                      <div className="flex items-center">
                                        <motion.p 
                                          className="text-sm font-medium text-gray-200 flex items-center"
                                          animate={{ opacity: [0.8, 1, 0.8] }}
                                          transition={{ duration: 2, repeat: Infinity }}
                                        >
                                          ACTIVE DEVICES
                                          <motion.span
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="ml-2 w-1.5 h-1.5 rounded-full bg-teal-400 inline-block"
                                          />
                                        </motion.p>
                                      </div>
                                      <p className="text-lg font-mono font-semibold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                                        {miningContext.activeDevices || 0}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Digital Line Animation */}
                                  <motion.div 
                                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-teal-500/0 via-teal-500/50 to-teal-500/0"
                                    animate={{
                                      opacity: [0.3, 0.7, 0.3]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  />
                                </motion.div>
                              </div>
                            </div>
                            
                            {/* 2-Column layout for the main controls */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {/* Performance chart in first column */}
                              <div className="relative z-10 bg-black/30 rounded-lg p-3 shadow-inner shadow-blue-900/20">
                                <h5 className="text-xs font-medium text-blue-300 mb-2 flex items-center">
                                  <LineChart className="h-3 w-3 mr-1.5 text-blue-400" />
                                  <span>Performance Metrics</span>
                                </h5>
                                <div>
                                  <MiningChart />
                                </div>
                              </div>
                              
                              {/* Control section in second column */}
                              <div className="relative z-10 bg-black/30 rounded-lg p-3 shadow-inner shadow-cyan-900/20">
                                <h5 className="text-xs font-medium text-cyan-300 mb-2 flex items-center">
                                  <Cpu className="h-3 w-3 mr-1.5 text-cyan-400" />
                                  <span>Mining Controls</span>
                                </h5>
                                <div>
                                  <MiningControlKnobs />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            {/* Connected Devices Section - Digital styling */}
            <motion.div 
              className="border-t border-blue-500/30 pt-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center mb-4 justify-between">
                <div className="flex items-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="mr-2"
                  >
                    <Cpu className="h-6 w-6 text-cyan-400" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-blue-100 dark:text-cyan-300">
                    Connected Devices
                  </h3>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3
                    }}
                    className="ml-2 text-xs bg-blue-900/40 border border-blue-500/40 rounded-full px-2 py-1"
                  >
                    <span className="text-blue-300">Network Status: </span>
                    <span className="text-cyan-300">Active</span>
                  </motion.div>
                </div>
                
                {/* Interactive Controls */}
                <div className="flex space-x-2">
                  <motion.button
                    className="w-8 h-8 rounded-full bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-800/60"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Add New Device"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    className="w-8 h-8 rounded-full bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-800/60"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="More Options"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </motion.button>
                </div>
              </div>
              <motion.div 
                className="bg-black/40 backdrop-blur-sm rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10 overflow-hidden"
                whileHover={{ 
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
                  borderColor: "rgba(59, 130, 246, 0.4)"
                }}
              >
                <DeviceTable devices={devices || []} />
              </motion.div>
            </motion.div>
            
            {/* Mining Hardware Support */}
            {/* Tabs for different views */}
            <Tabs 
              defaultValue={activeTab} 
              onValueChange={setActiveTab}
              className="border-t border-blue-500/30 pt-6"
            >
              <TabsList 
                className="mb-4 bg-black/60 border border-blue-500/20 p-1 rounded-lg grid grid-cols-4"
              >
                <TabsTrigger 
                  value="performance" 
                  className="flex items-center gap-1.5 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500 data-[state=active]:shadow-[0_0_10px_rgba(59,130,246,0.3)] text-blue-300/70"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Performance</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="network" 
                  className="flex items-center gap-1.5 data-[state=active]:bg-indigo-600/20 data-[state=active]:text-indigo-400 data-[state=active]:border-indigo-500 data-[state=active]:shadow-[0_0_10px_rgba(99,102,241,0.3)] text-indigo-300/70"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Network</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="devices" 
                  className="flex items-center gap-1.5 data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500 data-[state=active]:shadow-[0_0_10px_rgba(6,182,212,0.3)] text-cyan-300/70"
                >
                  <Server className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Devices</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="earnings" 
                  className="flex items-center gap-1.5 data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400 data-[state=active]:border-green-500 data-[state=active]:shadow-[0_0_10px_rgba(34,197,94,0.3)] text-green-300/70"
                >
                  <Wallet className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Earnings</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Performance Tab */}
              <TabsContent value="performance" className="mt-0">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <MinerCard />
                </motion.div>
              </TabsContent>
              
              {/* Network Tab with Globe */}
              <TabsContent value="network" className="mt-0">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  {/* World Globe Visualization */}
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-indigo-500/30 p-4 h-[300px]">
                    <div className="flex items-center mb-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="mr-2"
                      >
                        <Globe className="h-4 w-4 text-indigo-400" />
                      </motion.div>
                      <h4 className="text-sm font-semibold text-indigo-300">GLOBAL MINING NETWORK</h4>
                      
                      <div className="ml-auto flex items-center space-x-3">
                        <div className="flex items-center">
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"
                            animate={{
                              opacity: [0.5, 1, 0.5],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: "easeInOut"
                            }}
                          />
                          <span className="text-xs text-indigo-300">8 Active Nodes</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Globe visualization */}
                    <div className="h-[240px] w-full">
                      <GlobeVisualization className="h-full w-full" />
                    </div>
                  </div>
                  
                  {/* Network Stats */}
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-indigo-500/30 p-4">
                    <h4 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center">
                      <Activity className="h-4 w-4 text-indigo-400 mr-2" />
                      NETWORK ACTIVITY
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Total Hashrate', value: '158.4 PH/s', change: '+2.3%' },
                        { label: 'Network Difficulty', value: '54.8 T', change: '+1.8%' },
                        { label: 'Block Time', value: '9.8 min', change: '-0.5%' },
                        { label: 'Active Miners', value: '29,333', change: '+4.1%' }
                      ].map((stat, index) => (
                        <div key={index} className="bg-black/50 rounded-lg p-3 border border-indigo-500/20">
                          <div className="text-xs text-indigo-300 mb-1">{stat.label}</div>
                          <div className="flex items-center justify-between">
                            <div className="text-base font-semibold text-white">{stat.value}</div>
                            <div className="text-xs px-1.5 py-0.5 rounded text-green-400 bg-green-900/30">
                              {stat.change}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
              
              {/* Devices Tab */}
              <TabsContent value="devices" className="mt-0">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center mb-3">
                    <Server className="h-4 w-4 text-cyan-400 mr-2" />
                    <h4 className="text-sm font-semibold text-cyan-300">CONNECTED MINING DEVICES</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto h-7 px-2 text-xs bg-cyan-950/30 border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Device
                    </Button>
                  </div>
                  
                  <div className="bg-black/40 border border-cyan-900/30 rounded-lg p-3 overflow-hidden">
                    <DeviceTable devices={devices || []} />
                  </div>
                </motion.div>
              </TabsContent>
              
              {/* Earnings Tab */}
              <TabsContent value="earnings" className="mt-0">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-green-500/30 p-4">
                    <h4 className="text-sm font-semibold text-green-300 mb-3 flex items-center">
                      <Lock className="h-4 w-4 text-green-400 mr-2" />
                      WALLET ACCESS
                    </h4>
                    
                    <div className="flex justify-center items-center p-3">
                      <div className="bg-black/50 rounded-lg p-3 border border-green-900/40 w-full text-center">
                        <div className="flex items-center justify-center mb-2">
                          <div className="h-3 w-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          <div className="text-sm font-semibold text-green-300">SECURE ACCESS AUTHORIZED</div>
                        </div>
                        <div className="text-xs text-green-400/70">Transfer & Management Controls Enabled</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-green-500/30 p-4">
                    <h4 className="text-sm font-semibold text-green-300 mb-3 flex items-center">
                      <BarChart3 className="h-4 w-4 text-green-400 mr-2" />
                      TERA TOKEN CONTRIBUTION
                    </h4>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between text-xs text-green-300/70">
                        <span>Social Justice Fund</span>
                        <span>0.0026 BTC (33%)</span>
                      </div>
                      <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '33%' }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}