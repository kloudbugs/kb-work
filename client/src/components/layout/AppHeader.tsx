import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Zap, Bitcoin } from 'lucide-react';
import satoshiMinerLogo from '@/assets/satoshi_miner_logo.png';
import teraLogo from '@/assets/tera-logo.png';

export function AppHeader() {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-black/20 backdrop-blur-sm rounded-lg shadow-lg relative transform perspective-1000 rotate-x-1 border-b-4 border-purple-600/50">
      {/* 3D coming-out-of-screen effect with enhanced cosmic glow */}
      <div className="absolute -inset-1 rounded-lg z-0 overflow-hidden">
        {/* Animated galactic border */}
        <motion.div 
          className="absolute inset-0 bg-gradient-conic from-purple-600 via-indigo-700 to-violet-600 opacity-70"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ filter: "blur(10px)" }}
        />
        
        {/* Pulsing energy field */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-indigo-600/50 to-transparent"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Animated nebula clusters */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`nebula-${i}`}
            className="absolute rounded-full opacity-50"
            style={{
              width: `${Math.random() * 30 + 20}%`,
              height: `${Math.random() * 30 + 20}%`,
              filter: 'blur(15px)',
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? 'rgba(139, 92, 246, 0.6)' : 'rgba(79, 70, 229, 0.6)'
              } 0%, transparent 70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
            animate={{
              x: [0, Math.random() * 20 - 10, 0],
              y: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
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
          {/* Bitcoin symbol with cosmic animation */}
          <motion.div 
            className="absolute -top-3 -right-3 z-20"
            animate={{ 
              rotate: [0, 15, 0, -15, 0],
              y: [0, -5, 0],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            {/* Orbital ring around Bitcoin */}
            <motion.div
              className="absolute -inset-2 rounded-full border border-amber-400/40"
              animate={{ 
                rotate: [0, 360],
                boxShadow: [
                  'inset 0 0 5px rgba(245, 158, 11, 0.3)', 
                  'inset 0 0 10px rgba(245, 158, 11, 0.6)', 
                  'inset 0 0 5px rgba(245, 158, 11, 0.3)'
                ],
              }}
              transition={{
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {/* Orbiting particle */}
              <motion.div
                className="absolute h-2 w-2 rounded-full bg-yellow-300 shadow-glow"
                style={{ 
                  top: '50%', 
                  left: '0%', 
                  transform: 'translateY(-50%)'
                }}
                animate={{
                  boxShadow: [
                    '0 0 5px rgba(253, 224, 71, 0.8)', 
                    '0 0 15px rgba(253, 224, 71, 1)', 
                    '0 0 5px rgba(253, 224, 71, 0.8)'
                  ],
                }}
                transition={{
                  boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
              />
            </motion.div>
            
            {/* Energy aura */}
            <motion.div
              className="absolute -inset-1 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(251, 191, 36, 0.7) 0%, rgba(251, 191, 36, 0) 70%)',
                filter: 'blur(6px)'
              }}
              animate={{
                opacity: [0.5, 0.9, 0.5],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* The Bitcoin icon with enhanced effects */}
            <motion.div
              className="relative bg-gradient-radial from-amber-600 to-amber-800 rounded-full p-2 border-2 border-amber-500 shadow-lg"
              animate={{
                boxShadow: [
                  '0 0 5px rgba(245, 158, 11, 0.5)', 
                  '0 0 20px rgba(245, 158, 11, 0.8)', 
                  '0 0 5px rgba(245, 158, 11, 0.5)'
                ],
                scale: [1, 1.1, 1],
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Bitcoin className="h-7 w-7 text-yellow-300" />
              </motion.div>
              
              {/* Glowing highlight */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/30 to-transparent"
                animate={{
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
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
              className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-blue-500 pb-1 relative tracking-wider"
              style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "2px" }}
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ 
                scale: [0.95, 1.02, 0.95],
                opacity: [0.7, 1, 0.7],
                textShadow: [
                  "0 0 8px rgba(168, 85, 247, 0.5), 0 0 15px rgba(99, 102, 241, 0.3)",
                  "0 0 25px rgba(168, 85, 247, 0.8), 0 0 40px rgba(99, 102, 241, 0.6)",
                  "0 0 8px rgba(168, 85, 247, 0.5), 0 0 15px rgba(99, 102, 241, 0.3)"
                ]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="relative z-10">
                KLOUD BUGS <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-purple-500">MINING</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">COMMAND</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-500">CENTER</span>
              </span>
              
              {/* Cosmic nebula background behind text */}
              <motion.div 
                className="absolute inset-0 -z-10 opacity-30 rounded-lg overflow-hidden"
                style={{ filter: "blur(8px)" }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-conic from-purple-800 via-violet-900 to-indigo-800"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              </motion.div>
              
              {/* Floating stars particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    filter: "blur(0.5px)",
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Glowing energy underline */}
              <motion.div 
                className="absolute -bottom-2 left-0 h-1 w-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              >
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-700 via-purple-500 to-blue-600"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 0%"],
                    boxShadow: [
                      "0 0 10px 2px rgba(168, 85, 247, 0.5), 0 0 4px 0px rgba(168, 85, 247, 0.5) inset",
                      "0 0 20px 4px rgba(168, 85, 247, 0.8), 0 0 8px 0px rgba(168, 85, 247, 0.8) inset",
                      "0 0 10px 2px rgba(168, 85, 247, 0.5), 0 0 4px 0px rgba(168, 85, 247, 0.5) inset"
                    ]
                  }}
                  transition={{
                    backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{ backgroundSize: "200% 100%" }}
                />
              </motion.div>
              
              {/* Orbital ring */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-full border-2 border-transparent opacity-30"
                style={{ 
                  background: "transparent",
                  transformStyle: "preserve-3d",
                  borderImageSource: "linear-gradient(90deg, transparent 50%, rgba(139, 92, 246, 0.5) 75%, transparent 100%)",
                  borderImageSlice: "1"
                }}
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 15, 
                  repeat: Infinity, 
                  ease: "linear"
                }}
              />
            </motion.h1>
          </motion.div>
          {/* Cosmic particles animation to replace the removed text */}
          <div className="flex-1 h-8 relative overflow-hidden">
            <motion.div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <motion.div 
                  key={`cosmic-particle-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    background: `rgba(${
                      Math.random() > 0.7 
                        ? '245, 158, 11' // amber
                        : Math.random() > 0.5 
                          ? '139, 92, 246' // purple
                          : '6, 182, 212' // cyan
                    }, ${Math.random() * 0.5 + 0.5})`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    boxShadow: `0 0 ${Math.random() * 4 + 2}px rgba(${
                      Math.random() > 0.7 
                        ? '245, 158, 11' // amber
                        : Math.random() > 0.5 
                          ? '139, 92, 246' // purple
                          : '6, 182, 212' // cyan
                    }, 0.8)`
                  }}
                  animate={{
                    x: [0, Math.random() * 30 - 15],
                    y: [0, Math.random() * 10 - 5],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* TERA Token logo with cosmic visualization */}
      <Link href="/tera-token">
        <motion.div 
          className="flex items-center cursor-pointer group"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Label with cosmic animation */}
          <motion.div 
            className="mr-3 text-right hidden sm:block relative"
            whileHover={{ x: -5 }}
          >
            <motion.div 
              className="absolute -left-3 top-1/2 transform -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ 
                rotate: [0, 15, 0, -15, 0],
                scale: [0.9, 1.2, 0.9],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <motion.div className="relative">
                <Zap className="h-5 w-5 text-amber-500" />
                <motion.div 
                  className="absolute inset-0 text-amber-300"
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Zap className="h-5 w-5" />
                </motion.div>
              </motion.div>
            </motion.div>
            
            <div className="space-y-1">
              <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300 group-hover:from-amber-300 group-hover:via-orange-400 group-hover:to-yellow-200 transition-colors duration-300">
                TERA TOKEN
              </p>
              <motion.p 
                className="text-xs text-blue-300 group-hover:text-blue-200 transition-colors duration-300"
                animate={{
                  textShadow: [
                    "0 0 2px rgba(59, 130, 246, 0.3)",
                    "0 0 8px rgba(59, 130, 246, 0.6)",
                    "0 0 2px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                33% of mining rewards
              </motion.p>
            </div>
          </motion.div>
          
          {/* TERA Token logo with cosmic effects */}
          <div className="relative">
            {/* Orbital ring */}
            <motion.div 
              className="absolute -inset-4 border border-amber-500/30 rounded-full"
              style={{ 
                transformStyle: "preserve-3d",
                transformOrigin: "center",
              }}
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ 
                duration: 12, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              {/* Orbiting particles */}
              {[...Array(4)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-amber-400"
                  style={{ 
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * 90}deg) translateX(calc(-50% + 24px)) translateY(-50%)`,
                    boxShadow: "0 0 6px 2px rgba(245, 158, 11, 0.5)"
                  }}
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
            
            {/* Pulsing glow background */}
            <motion.div 
              className="absolute -inset-2 bg-gradient-conic from-amber-500 via-yellow-500 to-amber-500 rounded-full opacity-20 group-hover:opacity-30 blur-md transition-opacity duration-300"
              animate={{ 
                scale: [0.85, 1.1, 0.85],
                opacity: [0.2, 0.4, 0.2],
                rotate: [0, 360],
              }}
              transition={{ 
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
            />
            
            {/* The token itself */}
            <motion.div 
              className="relative w-16 h-16 overflow-hidden rounded-full border-2 border-amber-500 group-hover:border-amber-400 transition-colors duration-300 z-10"
              animate={{ 
                boxShadow: [
                  '0 0 5px rgba(245, 158, 11, 0.5)', 
                  '0 0 20px rgba(245, 158, 11, 0.8)', 
                  '0 0 5px rgba(245, 158, 11, 0.5)'
                ],
                rotate: [0, 5, 0, -5, 0]
              }}
              whileHover={{
                boxShadow: '0 0 30px rgba(245, 158, 11, 0.9)'
              }}
              transition={{ 
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <img 
                src={teraLogo} 
                alt="TERA Token" 
                className="object-cover w-full h-full z-20"
              />
              
              {/* Scan line effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-300/20 to-transparent"
                initial={{ top: "-100%" }}
                animate={{ top: ["100%", "-100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                style={{ height: "200%", pointerEvents: "none" }}
              />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}