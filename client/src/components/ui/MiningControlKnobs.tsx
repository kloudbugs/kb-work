import React, { useState } from 'react';
import { useMining } from '@/contexts/MiningContext';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Square, 
  Thermometer, 
  Zap, 
  Settings, 
  Cpu, 
  BarChart3,
  Power,
  Server,
  Sparkles,
  RefreshCw,
  Wallet,
  DollarSign,
  Bitcoin,
  Activity,
  TrendingUp,
  Shield
} from 'lucide-react';
import { MiningKnob } from './MiningKnob';
import { motion } from 'framer-motion';
import { MiningLog } from './MiningLog';
import { useQuery } from '@tanstack/react-query';

export function MiningControlKnobs() {
  const { 
    miningEnabled, 
    toggleMiningState, 
    isMiningToggleLoading,
    activeMiningPool,
    activeMiningWallet,
    isMiningReady
  } = useMining();

  // Fetch mining status
  const { data: miningStats } = useQuery({
    queryKey: ['/api/mining/stats'],
    refetchInterval: 3000,
  });
  
  // Fetch wallet info
  const { data: wallet } = useQuery({
    queryKey: ['/api/wallet'],
    refetchInterval: 5000,
  });

  // New state for knob controls
  const [powerLevel, setPowerLevel] = useState(75);
  const [tempLimit, setTempLimit] = useState(85);
  const [fanSpeed, setFanSpeed] = useState(60);
  
  // Check if we have required configuration to start mining
  // Either we need pool/wallet config OR the ASIC has been configured (which is tracked by isMiningReady)
  const isConfigured = (activeMiningPool && activeMiningWallet) || isMiningReady;
  
  // Special formatted values
  const formatPower = (value: number) => `${value}%`;
  const formatTemp = (value: number) => `${value}°C`;
  const formatFan = (value: number) => `${value}%`;

  return (
    <div className="w-full h-full relative">
      {/* Background Cosmic Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-blue-950/20 to-cyan-950/20 rounded-lg -z-10"></div>
      
      {/* Digital Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10 -z-10 rounded-lg" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px'
        }}
      />
      
      {/* Header with Holographic Title */}
      <div className="flex justify-between items-center relative mb-3">
        <div className="relative">
          <h3 className="text-sm font-bold text-blue-300 tracking-wide flex items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                repeat: Infinity, 
                duration: 8, 
                ease: "linear" 
              }}
              className="mr-2"
            >
              <Settings className="h-3.5 w-3.5 text-cyan-400" />
            </motion.div>
            MINING CONTROLS
            <motion.div 
              className="ml-2 w-1.5 h-1.5 rounded-full bg-cyan-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
            />
          </h3>
          
          {/* Glowing underline */}
          <motion.div 
            className="absolute -bottom-1 left-0 right-10 h-px bg-gradient-to-r from-blue-500/0 via-cyan-500 to-blue-500/0"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: "easeInOut" 
            }}
          />
        </div>
        
        {/* Status Indicator */}
        <motion.div 
          className={`
            text-xs px-2 py-0.5 rounded-full font-mono font-bold tracking-wider border
            backdrop-blur-sm relative overflow-hidden
            ${miningEnabled 
              ? 'bg-green-900/30 text-green-400 border-green-500/50 shadow-inner shadow-green-500/20'
              : 'bg-red-900/30 text-red-400 border-red-500/50 shadow-inner shadow-red-500/20'
            }
          `}
          animate={{
            boxShadow: miningEnabled 
              ? ['0 0 5px rgba(74, 222, 128, 0.2)', '0 0 10px rgba(74, 222, 128, 0.4)', '0 0 5px rgba(74, 222, 128, 0.2)']
              : ['0 0 5px rgba(248, 113, 113, 0.2)', '0 0 10px rgba(248, 113, 113, 0.4)', '0 0 5px rgba(248, 113, 113, 0.2)']
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2 
          }}
        >
          {miningEnabled ? 'ONLINE' : 'STANDBY'}
        </motion.div>
      </div>
      
      {/* System Status Line */}
      <div className="text-xs text-cyan-300/80 font-mono border-b border-cyan-800/30 pb-2 mb-3">
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ 
            repeat: Infinity, 
            duration: 4 
          }}
        >
          SYSTEM://{miningEnabled ? 'ACTIVE_MINING' : 'READY'} | CONFIG:{isConfigured ? 'VALID' : 'INCOMPLETE'}
        </motion.div>
      </div>
      
      {/* COSMIC MINING CONTROL - Renamed from KLOUD BUGS MINING COMMAND CENTER */}
      <div className="mb-4">
        <div className="p-4 bg-black/40 backdrop-blur-md rounded-lg border border-purple-500/40 relative overflow-hidden shadow-lg shadow-purple-500/10">
          {/* Cosmic stars background */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`cosmic-star-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  filter: 'blur(0.5px)',
                  opacity: Math.random() * 0.7 + 0.3
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + Math.random() * 3,
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
          
          {/* Nebula effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-800/5 to-cyan-900/10 mix-blend-screen"
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.05, 1] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 8,
              ease: "easeInOut"
            }}
          />
          
          {/* Header with enhanced cosmic effects */}
          <div className="flex items-center gap-2 mb-3 relative">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 10, ease: "linear" },
                scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
              }}
            >
              <Sparkles className="h-5 w-5 text-purple-400 drop-shadow-glow" />
            </motion.div>
            
            <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-400 tracking-wider">
              COSMIC MINING CONTROL
            </h3>
            
            {/* Multiple pulsing dots */}
            <div className="flex items-center gap-1 ml-1">
              {[0, 1, 2].map((idx) => (
                <motion.div 
                  key={`pulse-dot-${idx}`}
                  className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                    boxShadow: [
                      '0 0 2px rgba(168, 85, 247, 0.5)',
                      '0 0 4px rgba(168, 85, 247, 0.8)',
                      '0 0 2px rgba(168, 85, 247, 0.5)'
                    ]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                    delay: idx * 0.5
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Digital Grid lines with animation */}
          <motion.div 
            className="absolute inset-0 opacity-10" 
            animate={{
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut"
            }}
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(168, 85, 247, 0.5) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(168, 85, 247, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Animated energy pulse with enhanced effects */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-fuchsia-600/5 to-purple-600/10"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              backgroundPosition: ['0% 0%', '100% 0%']
            }}
            transition={{
              opacity: {
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              },
              backgroundPosition: {
                repeat: Infinity,
                duration: 8,
                ease: "linear"
              }
            }}
            style={{ backgroundSize: '200% 100%' }}
          />
          
          {/* Energy beams */}
          <div className="absolute inset-0 overflow-hidden">
            {[1, 2, 3].map((idx) => (
              <motion.div
                key={`energy-beam-${idx}`}
                className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                style={{
                  top: `${25 * idx}%`,
                  opacity: 0.6,
                  left: 0
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  width: ['0%', '100%', '0%']
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4 + idx,
                  ease: "easeInOut",
                  delay: idx * 0.5
                }}
              />
            ))}
          </div>
          
          {/* Command center content with enhanced cosmic styling */}
          <div className="relative z-10 p-3 bg-black/30 rounded-md border border-purple-500/30 mt-2 backdrop-blur-md">
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    background: `rgba(${Math.floor(Math.random() * 100 + 150)}, ${Math.floor(Math.random() * 50 + 50)}, ${Math.floor(Math.random() * 100 + 150)}, ${Math.random() * 0.5 + 0.3})`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    filter: 'blur(1px)'
                  }}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + Math.random() * 4,
                    ease: "easeInOut",
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
            
            {/* Rotating cosmic circular ring */}
            <motion.div
              className="absolute inset-0 border-2 border-dashed border-purple-500/10 rounded-md"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            />
            
            {/* Scanner line effect */}
            <motion.div
              className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-purple-400 to-transparent"
              style={{ left: '50%' }}
              animate={{ 
                left: ['0%', '100%', '0%'],
                opacity: [0, 0.7, 0] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 5,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </div>
      
      {/* System Logs with Control Knobs beneath - Borderless design */}
      <div className="grid grid-cols-1 gap-4">
        {/* System Logs - Enhanced with cosmic effects */}
        <div className="bg-black/40 rounded-lg p-3 border border-blue-500/20 shadow-lg shadow-blue-500/5 backdrop-blur-sm relative overflow-hidden">
          {/* Background cosmic effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-indigo-900/5 to-blue-900/10 mix-blend-screen"></div>
          
          {/* Digital grid backdrop */}
          <motion.div 
            className="absolute inset-0 opacity-5" 
            animate={{ opacity: [0.03, 0.08, 0.03] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '15px 15px'
            }}
          />
          
          {/* Animated energy flow */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/10 to-blue-600/5"
            animate={{
              opacity: [0.1, 0.2, 0.1],
              backgroundPosition: ['0% 0%', '100% 0%']
            }}
            transition={{
              opacity: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              backgroundPosition: { repeat: Infinity, duration: 10, ease: "linear" }
            }}
            style={{ backgroundSize: '200% 100%' }}
          />
          
          {/* Header with enhanced styling */}
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="flex items-center">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1] 
                }}
                transition={{ 
                  rotate: { repeat: Infinity, duration: 8, ease: "linear" },
                  scale: { repeat: Infinity, duration: 2, ease: "easeInOut" } 
                }}
                className="mr-2"
              >
                <Sparkles className="h-4 w-4 text-blue-400 drop-shadow-glow" />
              </motion.div>
              
              <h4 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-400 tracking-wider">
                COSMIC SYSTEM LOGS
              </h4>
              
              {/* Status indicator pulses */}
              <div className="flex space-x-1 ml-2">
                {[0, 1].map((idx) => (
                  <motion.div 
                    key={`system-pulse-${idx}`}
                    className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-400"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                      boxShadow: [
                        '0 0 2px rgba(59, 130, 246, 0.5)',
                        '0 0 4px rgba(59, 130, 246, 0.8)',
                        '0 0 2px rgba(59, 130, 246, 0.5)'
                      ]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                      delay: idx * 0.6
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Digital time counter with enhanced styling */}
            <div className="text-[10px] px-2 py-1 bg-blue-950/60 rounded border border-blue-500/20 backdrop-blur-sm shadow-inner shadow-blue-500/10">
              <motion.span 
                className="font-mono tracking-wider text-blue-300"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                {new Date().toLocaleTimeString('en-US', { hour12: false })}
              </motion.span>
            </div>
          </div>
          
          {/* Compact Mining Log with enhanced cosmic styling */}
          <div className="relative bg-black/60 rounded-md p-1.5 h-40 overflow-auto scrollbar-thin scrollbar-thumb-blue-900/40 scrollbar-track-transparent backdrop-blur-sm border border-blue-500/10">
            {/* Scanner effect */}
            <motion.div
              className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-blue-400 to-transparent"
              style={{ left: '50%' }}
              animate={{ 
                left: ['0%', '100%', '0%'],
                opacity: [0, 0.5, 0] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut"
              }}
            />
            
            <MiningLog compact={true} className="text-xs relative z-10" />
          </div>
        </div>
        

        
        {/* Control Knobs - Moved below logs and smaller size */}
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-cyan-300 flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 6, 
                  ease: "linear" 
                }}
                className="mr-1.5"
              >
                <Settings className="h-3 w-3 text-cyan-400" />
              </motion.div>
              CONTROL KNOBS
            </h4>
          </div>
          
          {/* Control Knobs in a row with cosmic effects */}
          <div className="relative flex flex-row items-center justify-between space-x-5 bg-black/30 rounded-md p-5 overflow-hidden">
            {/* Cosmic background for knobs */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-cyan-950/40 opacity-80"></div>
            
            {/* Digital grid effect */}
            <div 
              className="absolute inset-0 opacity-10" 
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '15px 15px'
              }}
            />
            
            {/* Animated energy lines */}
            <motion.div 
              className="absolute h-1/2 w-full left-0 top-0 opacity-30"
              style={{
                background: 'linear-gradient(to bottom, rgba(6, 182, 212, 0.1), transparent)'
              }}
              animate={{
                opacity: [0.2, 0.4, 0.2],
                y: ['-5%', '0%', '-5%']
              }}
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "easeInOut"
              }}
            />
            
            {/* Floating particles */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`knob-particle-${i}`}
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
            
            {/* Power Control with cosmic effects */}
            <div className="relative z-10 group">
              <motion.div
                className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(6, 182, 212, 0.1) 70%, transparent 100%)',
                  filter: 'blur(8px)'
                }}
              />
              <MiningKnob
                label="POWER"
                value={powerLevel}
                onChange={setPowerLevel}
                color="cyan"
                size="xs"
                icon={<Power />}
                valueFormatter={formatPower}
                disabled={!isConfigured || isMiningToggleLoading}
              />
            </div>
            
            {/* Temperature Limit with cosmic effects */}
            <div className="relative z-10 group">
              <motion.div
                className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.1) 70%, transparent 100%)',
                  filter: 'blur(8px)'
                }}
              />
              <MiningKnob
                label="TEMP"
                value={tempLimit}
                min={50}
                max={95}
                onChange={setTempLimit}
                color="red"
                size="xs"
                icon={<Thermometer />}
                valueFormatter={formatTemp}
                disabled={!isConfigured || isMiningToggleLoading}
              />
            </div>
            
            {/* Fan Speed with cosmic effects */}
            <div className="relative z-10 group">
              <motion.div
                className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.1) 70%, transparent 100%)',
                  filter: 'blur(8px)'
                }}
              />
              <MiningKnob
                label="FAN"
                value={fanSpeed}
                onChange={setFanSpeed}
                color="blue"
                size="xs"
                icon={<BarChart3 />}
                valueFormatter={formatFan}
                disabled={!isConfigured || isMiningToggleLoading}
              />
            </div>
            
            {/* Energy light rays */}
            <motion.div 
              className="absolute inset-0 opacity-10 z-0 overflow-hidden"
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`light-ray-${i}`}
                  className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  style={{
                    top: `${(i+1) * 25}%`, 
                    left: 0,
                    right: 0,
                    transformOrigin: 'center',
                    opacity: 0.7,
                  }}
                  animate={{ 
                    scaleX: [0.7, 1, 0.7],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 3 + i,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
        
        {/* Master Control Buttons */}
        <div className="flex justify-center space-x-4 mt-3">
          {/* Start Mining Button */}
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.98 }}
            className={`relative ${!miningEnabled && isConfigured ? '' : 'opacity-50'}`}
          >
            <Button 
              variant="default" 
              className={`
                relative overflow-hidden group transition-all rounded-full
                ${!miningEnabled && isConfigured 
                  ? 'bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white border border-green-500/50' 
                  : 'bg-gradient-to-r from-green-900/60 to-green-800/60 text-green-300/50 border border-green-800/30'
                }
                w-20 h-20
              `} 
              onClick={() => !miningEnabled && toggleMiningState()}
              disabled={isMiningToggleLoading || miningEnabled || !isConfigured}
              title={!isConfigured ? "Configure mining settings first" : "Start mining"}
            >
              {/* Center glow */}
              <motion.div
                className={`absolute inset-5 rounded-full bg-green-500/20 ${!miningEnabled && isConfigured ? '' : 'opacity-0'}`}
                animate={!miningEnabled && isConfigured ? {
                  boxShadow: [
                    '0 0 5px rgba(34, 197, 94, 0.3)',
                    '0 0 15px rgba(34, 197, 94, 0.5)',
                    '0 0 5px rgba(34, 197, 94, 0.3)'
                  ]
                } : {}}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2
                }}
              />
              
              {/* Rotating outer ring */}
              <motion.div
                className={`absolute inset-0 border-2 border-dashed border-green-500/30 rounded-full ${!miningEnabled && isConfigured ? '' : 'opacity-0'}`}
                animate={{ rotate: 360 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 15,
                  ease: "linear"
                }}
              />
              
              {/* Button content */}
              <motion.div 
                className="flex flex-col items-center justify-center relative z-10"
                animate={!miningEnabled && isConfigured ? { 
                  scale: [1, 1.03, 1] 
                } : {}}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                <Play className="h-8 w-8 mb-0.5" />
                <span className="font-mono tracking-wide text-[10px]">ACTIVATE</span>
              </motion.div>
            </Button>
          </motion.div>
          
          {/* Stop Mining Button */}
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.98 }}
            className={`relative ${miningEnabled ? '' : 'opacity-50'}`}
          >
            <Button 
              variant="destructive"
              className={`
                relative overflow-hidden group transition-all rounded-full
                ${miningEnabled 
                  ? 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white border border-red-500/50' 
                  : 'bg-gradient-to-r from-red-900/60 to-red-800/60 text-red-300/50 border border-red-800/30'
                }
                w-20 h-20
              `}
              onClick={() => miningEnabled && toggleMiningState()}
              disabled={isMiningToggleLoading || !miningEnabled}
            >
              {/* Center glow */}
              <motion.div
                className={`absolute inset-5 rounded-full bg-red-500/20 ${miningEnabled ? '' : 'opacity-0'}`}
                animate={miningEnabled ? {
                  boxShadow: [
                    '0 0 5px rgba(239, 68, 68, 0.3)',
                    '0 0 15px rgba(239, 68, 68, 0.5)',
                    '0 0 5px rgba(239, 68, 68, 0.3)'
                  ]
                } : {}}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2
                }}
              />
              
              {/* Rotating outer ring */}
              <motion.div
                className={`absolute inset-0 border-2 border-dashed border-red-500/30 rounded-full ${miningEnabled ? '' : 'opacity-0'}`}
                animate={{ rotate: 360 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 15,
                  ease: "linear"
                }}
              />
              
              {/* Button content */}
              <motion.div 
                className="flex flex-col items-center justify-center relative z-10"
                animate={miningEnabled ? { 
                  scale: [1, 1.03, 1] 
                } : {}}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                <Square className="h-8 w-8 mb-0.5" />
                <span className="font-mono tracking-wide text-[10px]">STOP</span>
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Configuration Note */}
      {!isConfigured && (
        <motion.div 
          className="mt-3 text-center px-3 py-1.5 bg-amber-950/30 border border-amber-700/30 rounded-md text-amber-300/80 text-xs mx-auto max-w-md"
          animate={{
            boxShadow: ['0 0 5px rgba(251, 191, 36, 0.1)', '0 0 10px rgba(251, 191, 36, 0.2)', '0 0 5px rgba(251, 191, 36, 0.1)']
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        >
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ 
                repeat: Infinity, 
                duration: 3, 
                ease: "easeInOut" 
              }}
              className="mr-2"
            >
              <Settings className="h-3 w-3" />
            </motion.div>
            MINING CONFIGURATION REQUIRED
          </div>
        </motion.div>
      )}
    </div>
  );
}