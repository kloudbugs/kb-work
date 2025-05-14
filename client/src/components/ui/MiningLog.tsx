import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMining } from '@/contexts/MiningContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Sparkles, Zap, Shield, Server, RefreshCw, Activity } from 'lucide-react';
import { SpaceCard } from '@/components/ui/space-card';

// Define a fixed number of log entries to avoid performance issues
const MAX_LOG_ENTRIES = 15;

// Initial logs for when mining is disabled
const disabledLogMessages: LogMessage[] = [
  { time: '00:00:00', message: 'Mining client initialized but inactive', type: 'system' },
  { time: '00:00:00', message: 'Waiting for mining to be enabled...', type: 'waiting' },
];

// Initial logs for when mining is first enabled
const initialLogMessages: LogMessage[] = [
  { time: '00:00:00', message: 'Mining client initialized', type: 'system' },
  { time: '00:00:00', message: 'Connecting to mining pool...', type: 'connecting' },
];

interface MiningLogProps {
  className?: string;
  compact?: boolean;
}

interface LogMessage {
  time: string;
  message: string;
  type?: 'system' | 'success' | 'error' | 'warning' | 'connecting' | 'waiting' | 'mining' | 'hashrate';
  highlight?: boolean;
}

export function MiningLog({ className, compact = true }: MiningLogProps) {
  const { miningEnabled, totalHashRate, activeMiningPool, activeMiningWallet, activeMiningDevice } = useMining();
  const [logs, setLogs] = useState<LogMessage[]>(miningEnabled ? initialLogMessages : disabledLogMessages);
  const [particles, setParticles] = useState<{x: number, y: number, size: number, duration: number}[]>([]);
  const [latestLogIndex, setLatestLogIndex] = useState<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Generate cosmic particles for background
  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 6 + 3
    }));
    setParticles(newParticles);
  }, []);
  
  // Auto-scroll to the latest log entry
  useEffect(() => {
    if (scrollRef.current && logs.length > 0) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [logs]);
  
  // Update logs when mining state changes
  useEffect(() => {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    if (miningEnabled) {
      // Make sure we're using the latest pool from context
      const poolName = activeMiningPool || 'Unmineable'; // Default to Unmineable if no pool is active
      
      const newLogs: LogMessage[] = [
        { time: currentTime, message: 'Mining activated', type: 'system', highlight: true },
        { time: currentTime, message: `Connecting to pool: ${poolName}`, type: 'connecting' },
        { time: currentTime, message: `Using wallet: ${activeMiningWallet ? `${activeMiningWallet.substring(0, 8)}...` : 'Default Wallet'}`, type: 'system' },
        activeMiningDevice 
          ? { time: currentTime, message: `Active device: ${activeMiningDevice}`, type: 'system' }
          : { time: currentTime, message: 'Using all available devices', type: 'system' },
        { time: currentTime, message: `Stratum connection established with ${poolName}`, type: 'success' },
        { time: currentTime, message: `Received mining job from ${poolName}`, type: 'mining' },
        { time: currentTime, message: 'Mining started successfully', type: 'success', highlight: true },
      ];
      
      setLogs(newLogs);
      setLatestLogIndex(newLogs.length - 1);
    } else {
      const newLogs: LogMessage[] = [
        { time: currentTime, message: 'Mining operations stopped', type: 'warning', highlight: true },
        { time: currentTime, message: 'Disconnected from mining pool', type: 'system' },
        { time: currentTime, message: 'Waiting for mining to be enabled...', type: 'waiting' },
      ];
      
      setLogs(newLogs);
      setLatestLogIndex(newLogs.length - 1);
    }
  }, [miningEnabled, activeMiningPool, activeMiningWallet, activeMiningDevice]);
  
  // Simulate receiving new log messages when mining is active
  useEffect(() => {
    if (!miningEnabled) return;
    
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
      const randomNum = Math.floor(Math.random() * 5);
      
      let message;
      let type: LogMessage['type'] = 'mining';
      let highlight = false;
      const hashValue = Math.floor(Math.random() * 1000000).toString(16);
      
      // Make sure we're using the latest pool from context
      const poolName = activeMiningPool || 'Unmineable'; // Default to Unmineable if no pool is active
      
      switch (randomNum) {
        case 0:
          message = `New mining job received from ${poolName}`;
          type = 'mining';
          break;
        case 1:
          message = `Share accepted by ${poolName}: ${hashValue}`;
          type = 'success';
          highlight = true;
          break;
        case 2:
          // Ensure we have a number value for the hash rate
          let numericHashRate = 1.5; // Default fallback value
          
          if (typeof totalHashRate === 'string') {
            numericHashRate = parseFloat(totalHashRate) || 1.5;
          } else if (typeof totalHashRate === 'number') {
            numericHashRate = totalHashRate;
          }
          
          message = `Current hashrate: ${numericHashRate.toFixed(2)} TH/s`;
          type = 'hashrate';
          break;
        case 3:
          message = `Mining on ${activeMiningDevice || 'default device'} to ${poolName}: ${hashValue}`;
          type = 'mining';
          break;
        default:
          message = `Mining to ${poolName}... current hash: ${hashValue}`;
          type = 'mining';
      }
      
      const newMessage = { time: currentTime, message, type, highlight };
      setLogs(prevLogs => {
        const newLogs = [...prevLogs, newMessage].slice(-MAX_LOG_ENTRIES);
        setLatestLogIndex(newLogs.length - 1);
        return newLogs;
      });
    }, 4000); // Update every 4 seconds
    
    return () => clearInterval(interval);
  }, [miningEnabled, totalHashRate, activeMiningPool, activeMiningDevice]);
  
  // Get the appropriate color and icon for each log type
  const getLogStyle = (type: LogMessage['type'] = 'system') => {
    switch (type) {
      case 'success':
        return {
          textColor: 'text-green-400',
          timeColor: 'text-green-500',
          iconComponent: <Sparkles className="h-3 w-3" />,
          glowColor: 'from-green-500/0 via-green-500/30 to-green-500/0'
        };
      case 'error':
        return {
          textColor: 'text-red-400',
          timeColor: 'text-red-500',
          iconComponent: <Shield className="h-3 w-3" />,
          glowColor: 'from-red-500/0 via-red-500/30 to-red-500/0'
        };
      case 'warning':
        return {
          textColor: 'text-amber-400',
          timeColor: 'text-amber-500',
          iconComponent: <Shield className="h-3 w-3" />,
          glowColor: 'from-amber-500/0 via-amber-500/30 to-amber-500/0'
        };
      case 'connecting':
        return {
          textColor: 'text-blue-400',
          timeColor: 'text-blue-500',
          iconComponent: <RefreshCw className="h-3 w-3" />,
          glowColor: 'from-blue-500/0 via-blue-500/30 to-blue-500/0'
        };
      case 'waiting':
        return {
          textColor: 'text-gray-400',
          timeColor: 'text-gray-500',
          iconComponent: <Terminal className="h-3 w-3" />,
          glowColor: 'from-gray-500/0 via-gray-500/30 to-gray-500/0'
        };
      case 'mining':
        return {
          textColor: 'text-purple-400',
          timeColor: 'text-purple-500',
          iconComponent: <Zap className="h-3 w-3" />,
          glowColor: 'from-purple-500/0 via-purple-500/30 to-purple-500/0'
        };
      case 'hashrate':
        return {
          textColor: 'text-cyan-400',
          timeColor: 'text-cyan-500',
          iconComponent: <Activity className="h-3 w-3" />,
          glowColor: 'from-cyan-500/0 via-cyan-500/30 to-cyan-500/0'
        };
      default:
        return {
          textColor: 'text-purple-300',
          timeColor: 'text-purple-500',
          iconComponent: <Server className="h-3 w-3" />,
          glowColor: 'from-purple-500/0 via-purple-500/30 to-purple-500/0'
        };
    }
  };
  
  // For the embedded view in the mining panel sidebar, we return a cosmic-enhanced version
  if (compact) {
    return (
      <div className={`${className} relative overflow-hidden rounded-lg`}>
        {/* Cosmic background with particles */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-950/10 to-indigo-950/20"
            animate={{ opacity: [0.7, 0.9, 0.7] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          
          {/* Grid lines */}
          <motion.div 
            className="absolute inset-0 opacity-10" 
            animate={{ opacity: [0.05, 0.1, 0.05] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(168, 85, 247, 0.5) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(168, 85, 247, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Cosmic particles */}
          {particles.map((particle, i) => (
            <motion.div
              key={`log-particle-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                filter: 'blur(0.5px)'
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: particle.duration,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
          
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
        
        {/* Enhanced Terminal header with KLOUD BUGS branding */}
        <div className="relative z-10 flex items-center mb-1 border-b border-purple-500/30 pb-1 px-2">
          <motion.div
            animate={{ 
              rotate: 360,
              boxShadow: [
                '0 0 0px rgba(139, 92, 246, 0)', 
                '0 0 5px rgba(139, 92, 246, 0.7)', 
                '0 0 0px rgba(139, 92, 246, 0)'
              ]
            }}
            transition={{ 
              rotate: { repeat: Infinity, duration: 10, ease: "linear" },
              boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }}
            className="mr-1 rounded-full"
          >
            <Terminal className="h-3 w-3 text-purple-400" />
          </motion.div>
          <motion.div 
            className="text-xs font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-wider"
            animate={{ 
              textShadow: [
                '0 0 3px rgba(168, 85, 247, 0.3)',
                '0 0 6px rgba(168, 85, 247, 0.6)',
                '0 0 3px rgba(168, 85, 247, 0.3)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            KLOUD BUGS MINING LOGS
          </motion.div>
          <motion.div
            className="ml-1 h-2 w-2 rounded-full bg-purple-500"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
              boxShadow: [
                '0 0 2px rgba(168, 85, 247, 0.5)',
                '0 0 5px rgba(168, 85, 247, 0.8)',
                '0 0 2px rgba(168, 85, 247, 0.5)'
              ]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: "easeInOut" 
            }}
          />
        </div>
        
        {/* Log entries */}
        <div 
          className="relative z-10 space-y-1 pr-1 pl-2 py-1 bg-black/50 rounded backdrop-blur-sm h-32 overflow-y-auto"
          ref={scrollRef}
        >
          <AnimatePresence initial={false}>
            {logs.map((log, index) => {
              const style = getLogStyle(log.type);
              return (
                <motion.div 
                  key={`${log.time}-${index}`} 
                  className={`text-xs font-mono ${style.textColor} relative ${log.highlight ? 'pl-2' : ''}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background glow for highlighted messages */}
                  {log.highlight && (
                    <motion.div 
                      className={`absolute inset-0 rounded bg-gradient-to-r ${style.glowColor}`}
                      animate={{ 
                        opacity: [0.1, 0.2, 0.1],
                        backgroundPosition: ['0% 0%', '100% 0%']
                      }}
                      transition={{ 
                        opacity: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                        backgroundPosition: { repeat: Infinity, duration: 8, ease: "linear" }
                      }}
                      style={{ backgroundSize: '200% 100%' }}
                    />
                  )}
                  
                  {/* Log entry content */}
                  <div className="flex items-center relative z-10">
                    {/* Type icon */}
                    <motion.div 
                      className={`mr-1 ${style.timeColor}`}
                      animate={
                        index === latestLogIndex ? 
                        { rotate: [0, 360], scale: [1, 1.1, 1] } : 
                        { rotate: 0 }
                      }
                      transition={{ 
                        rotate: { repeat: Infinity, duration: 10, ease: "linear" },
                        scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                      }}
                    >
                      {style.iconComponent}
                    </motion.div>
                    
                    {/* Timestamp */}
                    <span className={`${style.timeColor} mr-1 font-bold`}>[{log.time}]</span> 
                    
                    {/* Message with typing effect for the latest log */}
                    {index === latestLogIndex ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {log.message}
                      </motion.span>
                    ) : (
                      <span>{log.message}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  }
  
  // For standalone view, we return the full card with enhanced cosmic styling
  return (
    <SpaceCard 
      className={`${className} relative overflow-hidden`}
      glowColor="purple"
      hasCosmicBorder={true}
      hasStars={true}
      intensity="high"
    >
      {/* Cosmic background with animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-black/90 via-purple-950/30 to-indigo-950/40"
          animate={{ opacity: [0.7, 0.9, 0.7] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        
        {/* Grid lines */}
        <motion.div 
          className="absolute inset-0 opacity-10" 
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(168, 85, 247, 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(168, 85, 247, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Cosmic particles */}
        {particles.map((particle, i) => (
          <motion.div
            key={`log-card-particle-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              filter: 'blur(0.5px)'
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: particle.duration,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
        
        {/* Nebula effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-800/5 to-purple-900/10 mix-blend-screen"
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
        
        {/* Energy beams */}
        {[1, 2].map((idx) => (
          <motion.div
            key={`log-card-beam-${idx}`}
            className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            style={{
              top: `${30 * idx}%`,
              opacity: 0.6,
              left: 0
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              width: ['0%', '100%', '0%']
            }}
            transition={{
              repeat: Infinity,
              duration: 7 + idx,
              ease: "easeInOut",
              delay: idx * 1.5
            }}
          />
        ))}
      </div>
      
      {/* Card header with cosmic styling */}
      <CardHeader className="relative z-10 py-2 px-4 border-b border-purple-500/30 bg-black/50 backdrop-blur-md">
        <div className="flex items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="mr-2"
          >
            <Terminal className="h-4 w-4 text-purple-400" />
          </motion.div>
          <motion.div
            className="flex-1"
            animate={{ 
              textShadow: [
                '0 0 3px rgba(168, 85, 247, 0.3)',
                '0 0 6px rgba(168, 85, 247, 0.6)',
                '0 0 3px rgba(168, 85, 247, 0.3)'
              ] 
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <CardTitle className="text-sm text-purple-300 font-mono tracking-wider">
              COSMIC MINING OPERATION LOGS
            </CardTitle>
          </motion.div>
          
          {/* Status indicators */}
          <div className="flex space-x-2">
            <motion.div
              className="h-2 w-2 rounded-full bg-cyan-500"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 2px rgba(6, 182, 212, 0.5)',
                  '0 0 5px rgba(6, 182, 212, 0.8)',
                  '0 0 2px rgba(6, 182, 212, 0.5)'
                ]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "easeInOut",
                delay: 0
              }}
            />
            <motion.div
              className="h-2 w-2 rounded-full bg-purple-500"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 2px rgba(168, 85, 247, 0.5)',
                  '0 0 5px rgba(168, 85, 247, 0.8)',
                  '0 0 2px rgba(168, 85, 247, 0.5)'
                ]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <motion.div
              className="h-2 w-2 rounded-full bg-blue-500"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 2px rgba(59, 130, 246, 0.5)',
                  '0 0 5px rgba(59, 130, 246, 0.8)',
                  '0 0 2px rgba(59, 130, 246, 0.5)'
                ]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>
        </div>
      </CardHeader>
      
      {/* Card content with cosmic styling */}
      <CardContent className="relative z-10 py-2 px-4 backdrop-blur-sm">
        {/* Glowing scanner line */}
        <motion.div
          className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-purple-400 to-transparent z-10"
          style={{ left: '50%' }}
          animate={{ 
            left: ['0%', '100%', '0%'],
            opacity: [0, 0.5, 0] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 6,
            ease: "easeInOut"
          }}
        />
        
        <ScrollArea 
          className="h-56 pr-1"
          ref={scrollRef as any}
        >
          <AnimatePresence initial={false}>
            {logs.map((log, index) => {
              const style = getLogStyle(log.type);
              return (
                <motion.div 
                  key={`${log.time}-${index}`} 
                  className={`text-xs font-mono ${style.textColor} relative group py-1.5 border-b border-purple-500/10 ${log.highlight ? 'pl-2' : ''}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background glow for highlighted messages */}
                  {log.highlight && (
                    <motion.div 
                      className={`absolute inset-0 rounded bg-gradient-to-r ${style.glowColor}`}
                      animate={{ 
                        opacity: [0.1, 0.2, 0.1],
                        backgroundPosition: ['0% 0%', '100% 0%']
                      }}
                      transition={{ 
                        opacity: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                        backgroundPosition: { repeat: Infinity, duration: 8, ease: "linear" }
                      }}
                      style={{ backgroundSize: '200% 100%' }}
                    />
                  )}
                  
                  {/* Hover highlight effect */}
                  <motion.div 
                    className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors duration-300"
                    initial={false}
                    whileHover={{ opacity: 1 }}
                  />
                  
                  {/* Log entry content */}
                  <div className="flex items-center relative z-10">
                    {/* Type icon with rotation animation */}
                    <motion.div 
                      className={`mr-2 ${style.timeColor}`}
                      animate={
                        index === latestLogIndex ? 
                        { rotate: [0, 360], scale: [1, 1.1, 1] } : 
                        { rotate: 0 }
                      }
                      transition={{ 
                        rotate: { repeat: Infinity, duration: 10, ease: "linear" },
                        scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                      }}
                    >
                      {style.iconComponent}
                    </motion.div>
                    
                    {/* Timestamp */}
                    <span className={`${style.timeColor} mr-2 font-bold`}>[{log.time}]</span> 
                    
                    {/* Message with typing effect for the latest log */}
                    {index === latestLogIndex ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {log.message}
                      </motion.span>
                    ) : (
                      <span>{log.message}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </SpaceCard>
  );
}