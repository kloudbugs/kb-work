import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Zap, Bitcoin } from 'lucide-react';
import satoshiMinerLogo from '@/assets/satoshi_miner_logo.png';
import teraLogo from '@/assets/tera-logo.png';

export function AppHeader() {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-black/20 backdrop-blur-sm rounded-lg shadow-lg relative transform perspective-1000 rotate-x-1 border-b-4 border-purple-600/50">
      {/* 3D coming-out-of-screen effect with glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/50 via-indigo-600/30 to-purple-600/50 rounded-lg blur-sm z-0 animate-pulse"></div>
      {/* Network nodes visualization in background with enhanced brightness */}
      <div className="absolute inset-0 rounded-lg z-10 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`node-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-purple-400 to-indigo-400"
            style={{
              width: Math.random() * 5 + 4 + 'px',
              height: Math.random() * 5 + 4 + 'px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(0.5px)'
            }}
            animate={{
              opacity: [0.5, 0.9, 0.5],
              scale: [1, 1.4, 1],
              boxShadow: [
                '0 0 5px rgba(139, 92, 246, 0.5)',
                '0 0 12px rgba(139, 92, 246, 0.9)',
                '0 0 5px rgba(139, 92, 246, 0.5)'
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 2 + Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Connection lines between nodes with increased glow */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`connection-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent"
            style={{
              width: `${30 + Math.random() * 50}%`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 70}%`,
              transform: `rotate(${Math.random() * 180}deg)`,
              transformOrigin: 'center',
              boxShadow: '0 0 4px rgba(139, 92, 246, 0.7)'
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              width: [`${30 + Math.random() * 50}%`, `${40 + Math.random() * 50}%`, `${30 + Math.random() * 50}%`]
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 4,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Larger energy nodes */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`energy-node-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-indigo-300 to-purple-300"
            style={{
              width: Math.random() * 8 + 6 + 'px',
              height: Math.random() * 8 + 6 + 'px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)'
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.5, 1],
              boxShadow: [
                '0 0 8px rgba(139, 92, 246, 0.6)',
                '0 0 15px rgba(139, 92, 246, 1)',
                '0 0 8px rgba(139, 92, 246, 0.6)'
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + Math.random() * 3,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>
      
      {/* Cosmic background effect */}
      <div className="absolute inset-0 rounded-lg overflow-hidden mix-blend-screen opacity-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`cosmic-star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 2 + Math.random() * 2,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      <div className="flex items-center space-x-3 relative z-20">
        <div className="relative w-16 h-16">
          {/* Bitcoin symbol with animation */}
          <motion.div 
            className="absolute -top-2 -right-2 z-20"
            animate={{ 
              rotate: [0, 15, 0, -15, 0],
              scale: [1, 1.2, 1, 1.2, 1],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 blur-sm opacity-70"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [0.8, 1.1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="relative bg-white dark:bg-gray-800 rounded-full p-1 border-2 border-amber-500"
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(245, 158, 11, 0.4)', 
                    '0 0 10px rgba(245, 158, 11, 0.7)', 
                    '0 0 0px rgba(245, 158, 11, 0.4)'
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Bitcoin className="h-6 w-6 text-amber-500" />
              </motion.div>
            </div>
          </motion.div>
          
          {/* Justice Mining logo */}
          <div className="w-16 h-16 overflow-hidden rounded-md relative">
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-purple-600/40 to-fuchsia-600/40 rounded-md blur-sm"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <img 
              src={satoshiMinerLogo} 
              alt="Satoshi Miner" 
              className="object-cover w-full h-full relative z-10"
            />
          </div>
        </div>
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 pb-1 relative" 
              style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}
              animate={{
                textShadow: [
                  "0 0 5px rgba(6, 182, 212, 0.3)",
                  "0 0 20px rgba(6, 182, 212, 0.7)",
                  "0 0 5px rgba(6, 182, 212, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              KLOUD BUGS MINING COMMAND CENTER
              
              {/* Digital circuit lines under text */}
              <motion.div 
                className="absolute -bottom-1 left-0 h-px w-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/70 via-teal-300/70 to-cyan-400/70"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 0%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: "200% 100%" }}
                />
              </motion.div>
              
              {/* Digital scan animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"
                initial={{ top: "-100%" }}
                animate={{ top: ["100%", "-100%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                style={{ height: "200%", pointerEvents: "none" }}
              />
            </motion.h1>
          </motion.div>
          <div className="flex items-center">
            <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              EMPOWERING CIVIL RIGHTS THROUGH BLOCKCHAIN
            </p>
            
            {/* Electric arrow pointing to TERA token */}
            <motion.div 
              className="relative h-5 ml-2 flex-1"
              initial={{ width: 0 }}
              animate={{ width: ['0%', '100%', '100%', '0%'] }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                times: [0, 0.4, 0.8, 1] 
              }}
            >
              {/* Main electric line */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-300 h-1 top-1/2 transform -translate-y-1/2"
                style={{ filter: "drop-shadow(0 0 2px #f59e0b)" }}
                animate={{ 
                  opacity: [0.6, 1, 0.6],
                  height: ["1px", "2px", "1px"],
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              
              {/* Energy particles along the line */}
              <motion.div 
                className="absolute inset-y-0 left-1/4 flex items-center justify-center"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity,
                  delay: 0.2,
                  ease: "easeInOut" 
                }}
              >
                <div className="h-1 w-1 rounded-full bg-yellow-300" 
                  style={{ filter: "drop-shadow(0 0 2px #f59e0b)" }} 
                />
              </motion.div>
              
              <motion.div 
                className="absolute inset-y-0 left-2/3 flex items-center justify-center"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity,
                  delay: 0.5,
                  ease: "easeInOut" 
                }}
              >
                <div className="h-1 w-1 rounded-full bg-yellow-300" 
                  style={{ filter: "drop-shadow(0 0 2px #f59e0b)" }} 
                />
              </motion.div>
              
              {/* Lightning bolt tip */}
              <motion.div 
                className="absolute right-0 top-1/2 transform -translate-y-1/2"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8],
                  filter: ["drop-shadow(0 0 1px #f59e0b)", "drop-shadow(0 0 3px #f59e0b)", "drop-shadow(0 0 1px #f59e0b)"]
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Zap className="h-5 w-5 text-yellow-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* TERA Token logo with explanation */}
      <Link href="/tera-token">
        <motion.div 
          className="flex items-center cursor-pointer group"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Label with animation */}
          <motion.div 
            className="mr-2 text-right hidden sm:block relative"
            whileHover={{ x: -5 }}
          >
            <motion.div 
              className="absolute -left-2 top-1/2 transform -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Zap className="h-4 w-4 text-amber-500" />
            </motion.div>
            <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-300 group-hover:from-amber-600 group-hover:to-yellow-400 transition-colors duration-300">
              TERA Token
            </p>
            <p className="text-xs text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
              33% of all mining rewards
            </p>
          </motion.div>
          
          {/* TERA Token logo with glow effect */}
          <div className="relative">
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full opacity-20 group-hover:opacity-40 blur-sm transition-opacity duration-300"
              animate={{ 
                scale: [0.85, 1, 0.85],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div 
              className="relative w-14 h-14 overflow-hidden rounded-full border-2 border-amber-500 group-hover:border-amber-400 transition-colors duration-300 z-10"
              animate={{ 
                boxShadow: [
                  '0 0 0px rgba(245, 158, 11, 0.5)', 
                  '0 0 15px rgba(245, 158, 11, 0.8)', 
                  '0 0 0px rgba(245, 158, 11, 0.5)'
                ] 
              }}
              whileHover={{
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.9)'
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src={teraLogo} 
                alt="TERA Token" 
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}