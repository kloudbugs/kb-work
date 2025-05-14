import React, { useState } from 'react';
import { useMining } from '@/contexts/MiningContext';
import { Button } from '@/components/ui/button';
import { Play, Square, Loader2, Zap, Info, ChevronRight, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { MiningLog } from './MiningLog';
import { TurboModeButton } from './TurboModeButton';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import CloudMiningDashboard from './CloudMiningDashboard';
import { motion, AnimatePresence } from 'framer-motion';

export function MiningControl() {
  const { 
    miningEnabled, 
    toggleMiningState, 
    isMiningToggleLoading,
    activeMiningPool,
    activeMiningWallet,
    isMiningReady
  } = useMining();
  
  // State for cloud mining configuration view
  const [showCloudConfig, setShowCloudConfig] = useState(false);
  
  // Toggle cloud config visibility
  const toggleCloudConfig = () => {
    setShowCloudConfig(!showCloudConfig);
  };

  // Check if we have required configuration to start mining
  // Either we need pool/wallet config OR the ASIC has been configured (which is tracked by isMiningReady)
  const isConfigured = (activeMiningPool && activeMiningWallet) || isMiningReady;

  return (
    <div className="flex flex-col space-y-4 relative">
      {/* Background Cosmic Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-indigo-950/30 to-blue-950/40 rounded-lg -z-10"></div>
      
      {/* Digital Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10 -z-10" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px'
        }}
      ></div>
      
      {/* Header with Holographic Title */}
      <div className="flex justify-between items-center relative">
        <div className="relative">
          <h3 className="text-lg font-bold text-blue-300 tracking-wide flex items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                repeat: Infinity, 
                duration: 8, 
                ease: "linear" 
              }}
              className="mr-2"
            >
              <Zap className="h-5 w-5 text-cyan-400" />
            </motion.div>
            MINING COMMAND CENTER
            <motion.div 
              className="ml-2 w-2 h-2 rounded-full bg-cyan-500"
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
            text-xs px-3 py-1 rounded-full font-mono font-bold tracking-wider border
            backdrop-blur-sm relative overflow-hidden
            ${miningEnabled 
              ? 'bg-green-900/30 text-green-400 border-green-500/50 shadow-inner shadow-green-500/20'
              : 'bg-red-900/30 text-red-400 border-red-500/50 shadow-inner shadow-red-500/20'
            }
          `}
          animate={{
            boxShadow: miningEnabled 
              ? ['0 0 5px rgba(34, 197, 94, 0.3)', '0 0 10px rgba(34, 197, 94, 0.5)', '0 0 5px rgba(34, 197, 94, 0.3)']
              : ['0 0 5px rgba(239, 68, 68, 0.3)', '0 0 10px rgba(239, 68, 68, 0.5)', '0 0 5px rgba(239, 68, 68, 0.3)']
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        >
          {/* Animated scanline effect */}
          <motion.div 
            className="absolute inset-0 opacity-30 bg-gradient-to-b from-white to-transparent"
            animate={{ top: ['-100%', '200%'] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "linear" 
            }}
          />
          
          {miningEnabled ? 'ONLINE' : 'STANDBY'}
        </motion.div>
      </div>
      
      {/* System Status Line */}
      <div className="text-xs text-cyan-300/80 font-mono border-b border-cyan-800/30 pb-2">
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ 
            repeat: Infinity, 
            duration: 4 
          }}
        >
          SYSTEM://{miningEnabled ? 'ACTIVE_MINING' : 'READY'} | {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </motion.div>
      </div>
      
      {/* Configuration Status Messages */}
      {!isConfigured && !miningEnabled && (
        <motion.div 
          className="p-3 mb-1 bg-amber-950/30 border border-amber-700/30 rounded-md relative overflow-hidden"
          animate={{
            boxShadow: ['0 0 5px rgba(251, 191, 36, 0.1)', '0 0 10px rgba(251, 191, 36, 0.2)', '0 0 5px rgba(251, 191, 36, 0.1)']
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        >
          {/* Diagonal pattern overlay */}
          <div 
            className="absolute inset-0 opacity-5" 
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #fbbf24, #fbbf24 5px, transparent 5px, transparent 25px)`,
            }}
          />
          
          <h4 className="text-sm font-bold text-amber-400 flex items-center">
            <motion.div
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ 
                repeat: Infinity, 
                duration: 3, 
                ease: "easeInOut" 
              }}
              className="mr-2"
            >
              <Info className="h-4 w-4" />
            </motion.div>
            SETUP REQUIRED
          </h4>
          <p className="text-xs text-amber-300/80 mt-1 font-mono">
            SELECT_POOL_AND_WALLET_ADDRESS_BEFORE_INITIATING_MINING_SEQUENCE
          </p>
          <div className="flex justify-end mt-2">
            <Link to="/asic-mining">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center text-xs bg-amber-900/30 text-amber-300 border-amber-600/50 
                  hover:bg-amber-900/50 hover:text-amber-200"
              >
                INITIALIZE MINING CONFIG
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
      
      {isMiningReady && !miningEnabled && (
        <motion.div 
          className="p-3 mb-1 bg-green-950/30 border border-green-700/30 rounded-md relative overflow-hidden"
          animate={{
            boxShadow: ['0 0 5px rgba(34, 197, 94, 0.1)', '0 0 10px rgba(34, 197, 94, 0.2)', '0 0 5px rgba(34, 197, 94, 0.1)']
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        >
          {/* Holographic scanline effect */}
          <motion.div 
            className="absolute inset-0 opacity-5 bg-gradient-to-b from-green-400 to-transparent"
            animate={{ top: ['-100%', '200%'] }}
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: "linear" 
            }}
          />
          
          <h4 className="text-sm font-bold text-green-400 flex items-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                ease: "easeInOut" 
              }}
              className="mr-2"
            >
              <Info className="h-4 w-4" />
            </motion.div>
            KLOUD-BUGS MINING CAFE ONLINE
          </h4>
          <p className="text-xs text-green-300/80 mt-1 font-mono">
            CONFIGURATION COMPLETE :: READY TO INITIATE MINING SEQUENCE
          </p>
        </motion.div>
      )}
      
      {/* Mining Control Buttons - 3D Cosmic Style */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        {/* Start Mining Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="default" 
            className={`
              w-full relative overflow-hidden group transition-all
              ${!miningEnabled && isConfigured 
                ? 'bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white border border-green-500/50' 
                : 'bg-gradient-to-r from-green-900/60 to-green-800/60 text-green-300/50 border border-green-800/30'
              }
            `} 
            onClick={() => !miningEnabled && toggleMiningState()}
            disabled={isMiningToggleLoading || miningEnabled || !isConfigured}
            title={!isConfigured ? "Configure mining settings first" : "Start mining"}
          >
            {/* Glowing background effect for enabled button */}
            {!miningEnabled && isConfigured && (
              <motion.div 
                className="absolute inset-0 bg-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
            )}
            
            {/* Button shine effect */}
            {!miningEnabled && isConfigured && (
              <motion.div 
                className="absolute inset-0 opacity-30 overflow-hidden"
                initial={{ left: '-100%' }}
                animate={{ left: ['100%'] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
              >
                <div className="w-20 h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-30" />
              </motion.div>
            )}
            
            <motion.div 
              className="flex items-center justify-center"
              animate={!miningEnabled && isConfigured ? { 
                scale: [1, 1.03, 1] 
              } : {}}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            >
              <Play className="mr-2 h-4 w-4" />
              <span className="font-mono tracking-wide">ACTIVATE MINING</span>
            </motion.div>
          </Button>
        </motion.div>
        
        {/* Stop Mining Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="destructive"
            className={`
              w-full relative overflow-hidden group
              ${miningEnabled 
                ? 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white border border-red-500/50' 
                : 'bg-gradient-to-r from-red-900/60 to-red-800/60 text-red-300/50 border border-red-800/30'
              }
            `}
            onClick={() => miningEnabled && toggleMiningState()}
            disabled={isMiningToggleLoading || !miningEnabled}
          >
            {/* Glowing background effect for enabled button */}
            {miningEnabled && (
              <motion.div 
                className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
            )}
            
            {/* Button shine effect */}
            {miningEnabled && (
              <motion.div 
                className="absolute inset-0 opacity-30 overflow-hidden"
                initial={{ left: '-100%' }}
                animate={{ left: ['100%'] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
              >
                <div className="w-20 h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-30" />
              </motion.div>
            )}
            
            <motion.div 
              className="flex items-center justify-center"
              animate={miningEnabled ? { 
                scale: [1, 1.03, 1] 
              } : {}}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            >
              <Square className="mr-2 h-4 w-4" />
              <span className="font-mono tracking-wide">SUSPEND MINING</span>
            </motion.div>
          </Button>
        </motion.div>
        
        {/* Configure Button - Holographic Style */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="col-span-1 mt-1"
        >
          <Button 
            variant="outline"
            onClick={toggleCloudConfig}
            className={`
              w-full relative overflow-hidden border backdrop-blur-sm
              ${showCloudConfig 
                ? 'bg-cyan-900/20 text-cyan-300 border-cyan-500/50 hover:bg-cyan-800/30' 
                : 'bg-blue-900/20 text-blue-300 border-blue-500/30 hover:bg-blue-800/30'
              }
            `}
          >
            {/* Animated holographic background */}
            <motion.div 
              className="absolute inset-0 opacity-10"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${showCloudConfig ? 'rgba(34, 211, 238, 0.4)' : 'rgba(59, 130, 246, 0.4)'} 0%, transparent 70%)`
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            />
            
            {/* Scanline effect */}
            <motion.div 
              className="absolute inset-0 opacity-20 overflow-hidden"
              animate={{}}
            >
              <motion.div
                className="absolute inset-x-0 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
                animate={{ top: ['-10%', '110%'] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear"
                }}
              />
            </motion.div>
            
            {/* Button content */}
            <motion.div 
              className="flex items-center justify-center z-10"
              animate={{
                textShadow: showCloudConfig 
                  ? ['0 0 3px rgba(34, 211, 238, 0)', '0 0 6px rgba(34, 211, 238, 0.5)', '0 0 3px rgba(34, 211, 238, 0)']
                  : ['0 0 3px rgba(59, 130, 246, 0)', '0 0 6px rgba(59, 130, 246, 0.5)', '0 0 3px rgba(59, 130, 246, 0)']
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span className="font-mono tracking-wide">CONFIGURE</span>
              {showCloudConfig ? (
                <ChevronUp className="ml-1 h-3 w-3 inline" />
              ) : (
                <ChevronDown className="ml-1 h-3 w-3 inline" />
              )}
            </motion.div>
            
            {/* Animated border effect */}
            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500/30 via-cyan-400 to-cyan-500/30" 
              initial={{ width: "0%" }}
              animate={{ 
                width: showCloudConfig ? "100%" : "0%",
              }}
              transition={{ duration: 0.3 }}
            />
          </Button>
        </motion.div>
        
        {/* Turbo Mode Button */}
        <div className="col-span-1 mt-1">
          <TurboModeButton />
        </div>
        
        {/* Loading Indicator (shows when toggle is in progress) */}
        {isMiningToggleLoading && (
          <motion.div 
            className="col-span-2 flex justify-center mt-2"
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "easeInOut"
            }}
          >
            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            <span className="ml-2 text-xs font-mono text-cyan-300">PROCESSING COMMAND...</span>
          </motion.div>
        )}
      </div>
      
      {/* Cloud Mining Configuration Panel */}
      <AnimatePresence>
        {showCloudConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="bg-black/70 backdrop-blur-lg rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/20 p-4 relative">
              {/* 3D Holographic Effect */}
              <div className="absolute inset-0 rounded-lg opacity-10 bg-gradient-to-b from-cyan-400/20 to-transparent pointer-events-none"></div>
              
              {/* Holographic Scanline Effect */}
              <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                <motion.div 
                  className="absolute inset-x-0 h-1 bg-cyan-400/20" 
                  animate={{ 
                    top: ['-10%', '110%']
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2.5, 
                    ease: "linear"
                  }}
                />
              </div>
              
              {/* Glowing top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-lg"></div>
              
              <div className="flex items-center mb-4 relative z-10">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 10,
                    ease: "linear"
                  }}
                  className="mr-2"
                >
                  <Settings className="h-5 w-5 text-cyan-400" />
                </motion.div>
                <h3 className="text-md font-semibold text-cyan-300 font-mono tracking-wider">
                  CLOUD MINING CONFIGURATION
                </h3>
                <motion.div
                  className="ml-auto"
                  whileHover={{ scale: 1.1 }}
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-cyan-300 hover:text-cyan-100 hover:bg-cyan-800/30"
                    onClick={toggleCloudConfig}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
              
              {/* The actual cloud mining dashboard */}
              <CloudMiningDashboard />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Status Text - Digital Style */}
      <div className="text-xs font-mono text-cyan-300/80 mt-1 p-2 bg-black/40 rounded border border-cyan-900/30">
        <motion.div
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        >
          <span className="text-cyan-400">STATUS:</span> {miningEnabled 
            ? "MINING_ACTIVE • GENERATING_REVENUE • ALL_SYSTEMS_NOMINAL" 
            : "SYSTEM_IDLE • REVENUE_GENERATION_PAUSED • AWAITING_COMMAND"}
          
          {isConfigured && !miningEnabled && (
            <p className="text-green-400 mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5 align-middle"></span>
              READY_TO_DEPLOY • INITIATE_SEQUENCE_WITH_ACTIVATE_MINING
            </p>
          )}
        </motion.div>
      </div>
      
      {/* We remove the compact mining log from here since it's now in the sidebar */}
    </div>
  );
}