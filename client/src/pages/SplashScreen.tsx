import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

export default function SplashScreen() {
  const [, navigate] = useLocation();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (progress >= 100) {
      const redirectTimer = setTimeout(() => {
        navigate('/dashboard');
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [progress, navigate]);
  
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars layer 1 */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(1.5px 1.5px, #ffffff 2%, transparent 12%)',
          backgroundSize: '50px 50px'
        }} />
        
        {/* Stars layer 2 */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(1px 1px, rgba(255,255,255,0.5) 1%, transparent 10%)',
          backgroundSize: '40px 40px',
          transform: 'rotate(15deg)'
        }} />
        
        {/* Animated nebula */}
        <motion.div
          className="absolute w-screen h-screen opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(76, 0, 255, 0.3), rgba(0, 0, 76, 0), rgba(0, 0, 0, 0))',
            filter: 'blur(20px)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-screen h-screen opacity-20"
          style={{
            background: 'radial-gradient(circle at 30% 60%, rgba(0, 100, 255, 0.4), rgba(0, 0, 76, 0), rgba(0, 0, 0, 0))',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo container with cosmic glow */}
        <motion.div
          className="relative flex items-center justify-center mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Cosmic glow behind logo */}
          <motion.div
            className="absolute w-60 h-60 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(98, 0, 255, 0.4) 0%, rgba(0, 180, 255, 0.2) 40%, rgba(0, 0, 0, 0) 70%)',
              filter: 'blur(15px)'
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Logo */}
          <motion.div
            className="relative flex items-center justify-center"
            animate={{
              rotateZ: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-blue-200 to-indigo-500"
              style={{ textShadow: '0 0 20px rgba(148, 0, 255, 0.5)' }}
            >
              KLOUD BUGS
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Mining title */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold text-white mb-1">
            Mining Command Center
          </h1>
          <p className="text-blue-300 text-lg opacity-75">
            Initializing secure mining environment
          </p>
        </motion.div>
        
        {/* Loading progress */}
        <motion.div
          className="w-80 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {/* Cosmic progress bar */}
          <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden relative mb-2">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
              style={{ width: `${progress}%` }}
              initial={{ width: "0%" }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Glow effect on progress bar */}
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full bg-white"
              style={{ 
                width: '8px',
                filter: 'blur(4px)',
                opacity: 0.8,
                left: `calc(${progress}% - 4px)`
              }}
              initial={{ left: "0%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Percentage text */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>Initializing mining services</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </motion.div>
        
        {/* System messages */}
        <motion.div
          className="text-gray-400 text-sm w-80 h-16 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {progress < 30 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              Establishing secure connection...
            </motion.div>
          )}
          
          {progress >= 30 && progress < 60 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              Loading mining algorithms...
            </motion.div>
          )}
          
          {progress >= 60 && progress < 90 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              Synchronizing with mining nodes...
            </motion.div>
          )}
          
          {progress >= 90 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              Mining environment ready!
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Animated particles */}
      <ParticleEffect />
    </div>
  );
}

function ParticleEffect() {
  // Create a bunch of particles that float upward
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <Particle key={i} />
      ))}
    </div>
  );
}

function Particle() {
  const startX = Math.random() * 100; // random position across width
  const startY = 110 + (Math.random() * 20); // start below the screen
  const size = 1 + Math.random() * 3; // random size between 1 and 4px
  const duration = 10 + Math.random() * 20; // random duration
  
  return (
    <motion.div
      className="absolute rounded-full bg-blue-400"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: 0.3 + Math.random() * 0.5
      }}
      animate={{
        y: [0, -window.innerHeight * 1.5],
        x: [0, (Math.random() - 0.5) * 200]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}