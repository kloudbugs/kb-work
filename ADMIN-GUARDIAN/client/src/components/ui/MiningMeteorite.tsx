import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface MiningMeteoriteProps {
  active?: boolean;
  miningRate?: number;
  className?: string;
  customImage?: string;
  showMiner?: boolean;
  onAnimationComplete?: () => void;
  meteorCount?: number;
  meteorSize?: number;
  meteorSpeed?: 'slow' | 'medium' | 'fast';
  withText?: boolean;
  textColor?: string;
  backgroundColor?: string;
  pulseLight?: boolean;
  minerSize?: 'sm' | 'md' | 'lg' | 'xl';
  orbitCount?: number;
  particleCount?: number;
  enableWarpEffect?: boolean;
  glowIntensity?: 'low' | 'medium' | 'high';
  enableCosmicDust?: boolean;
  satoshiParticles?: boolean;
}

export const MiningMeteorite = ({
  active = true,
  miningRate = 1.0,
  className = '',
  customImage = '/logo1.png',
  showMiner = true,
  onAnimationComplete,
  meteorCount = 6,
  meteorSize = 3,
  meteorSpeed = 'medium',
  withText = true,
  textColor = 'text-blue-400',
  backgroundColor = 'rgba(0, 0, 0, 0.8)',
  pulseLight = true,
  minerSize = 'md',
  orbitCount = 3,
  particleCount = 15,
  enableWarpEffect = false,
  glowIntensity = 'medium',
  enableCosmicDust = true,
  satoshiParticles = false
}: MiningMeteoriteProps) => {
  const [miningStatus, setMiningStatus] = useState<string[]>([
    'Scanning blockchain...',
    'Connecting to mining pool...',
    'Initializing mining hardware...',
    'Starting hash computations...',
    'Mining active!',
    'Harvesting digital beans...',
    'Converting energy to satoshis...',
    'Securing the network...'
  ]);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [showStatus, setShowStatus] = useState(true);
  
  const minerSizeMap = {
    sm: { width: 60, height: 60 },
    md: { width: 100, height: 100 },
    lg: { width: 150, height: 150 },
    xl: { width: 200, height: 200 }
  };
  
  // Speed mapping
  const speedMap = {
    slow: { duration: [2.5, 3.5], delay: 2 },
    medium: { duration: [1.5, 2.5], delay: 1 },
    fast: { duration: [0.8, 1.5], delay: 0.5 }
  };
  
  // Cycle through mining status messages
  useEffect(() => {
    if (!active) return;
    
    const interval = setInterval(() => {
      setShowStatus(false);
      setTimeout(() => {
        setCurrentStatus(prev => (prev + 1) % miningStatus.length);
        setShowStatus(true);
      }, 500);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [active, miningStatus]);
  
  // Animation controls and refs
  const warpAnimationControls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle warp speed effect
  useEffect(() => {
    if (enableWarpEffect && active) {
      // Sequence to create warping stars effect
      const sequence = async () => {
        await warpAnimationControls.start({
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.5, 1],
          transition: { duration: 3, ease: "easeInOut" }
        });
        sequence();
      };
      
      sequence();
    }
    
    return () => {
      warpAnimationControls.stop();
    };
  }, [enableWarpEffect, active, warpAnimationControls]);
  
  // Glow colors and intensities
  const glowColors = {
    blue: { color: 'rgba(30, 144, 255, VAR)', shadowColor: '0 0 15px rgba(30, 144, 255, VAR), 0 0 30px rgba(30, 144, 255, VAR_LOW)' },
    green: { color: 'rgba(50, 205, 50, VAR)', shadowColor: '0 0 15px rgba(50, 205, 50, VAR), 0 0 30px rgba(50, 205, 50, VAR_LOW)' },
    purple: { color: 'rgba(147, 112, 219, VAR)', shadowColor: '0 0 15px rgba(147, 112, 219, VAR), 0 0 30px rgba(147, 112, 219, VAR_LOW)' },
    cyan: { color: 'rgba(0, 255, 255, VAR)', shadowColor: '0 0 15px rgba(0, 255, 255, VAR), 0 0 30px rgba(0, 255, 255, VAR_LOW)' }
  };
  
  const glowIntensityMap = {
    low: { base: 0.3, high: 0.5 },
    medium: { base: 0.5, high: 0.7 },
    high: { base: 0.7, high: 0.9 }
  };
  
  // Randomly select glow color
  const getRandomGlowColor = () => {
    const colors = Object.values(glowColors);
    const randomIndex = Math.floor(Math.random() * colors.length);
    const color = colors[randomIndex];
    const intensity = glowIntensityMap[glowIntensity];
    
    return {
      color: color.color.replace('VAR', intensity.base.toString()),
      shadowColor: color.shadowColor
        .replace('VAR', intensity.high.toString())
        .replace('VAR_LOW', intensity.base.toString())
    };
  };
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        backgroundColor: backgroundColor,
        minHeight: '200px',
        borderRadius: '12px'
      }}
      ref={containerRef}
    >
      {/* Enhanced cosmic background with dynamic stars */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Static stars */}
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 2 + 1;
          const glowColor = getRandomGlowColor();
          
          return (
            <motion.div
              key={`star-${i}`}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                backgroundColor: 'white',
                boxShadow: `0 0 ${size}px rgba(255, 255, 255, 0.8)`
              }}
              animate={active ? {
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.2, 1]
              } : {}}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          );
        })}
        
        {/* Warp speed effect - only show when enabled */}
        {enableWarpEffect && active && (
          <motion.div 
            className="absolute inset-0 z-10"
            animate={warpAnimationControls}
          >
            {Array.from({ length: 20 }).map((_, i) => {
              const size = Math.random() * 1 + 0.5;
              const angle = Math.random() * 360;
              const distance = 30 + Math.random() * 40;
              
              return (
                <motion.div
                  key={`warp-${i}`}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${size}px`,
                    height: `${size * 5}px`,
                    left: '50%',
                    top: '50%',
                    opacity: 0.7,
                    boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    rotate: angle
                  }}
                  animate={{
                    x: `${Math.cos(angle * Math.PI / 180) * distance}vw`,
                    y: `${Math.sin(angle * Math.PI / 180) * distance}vh`,
                    opacity: [0.2, 0.8, 0.2],
                    height: [`${size}px`, `${size * 20}px`]
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                    delay: Math.random() * 2
                  }}
                />
              );
            })}
          </motion.div>
        )}
        
        {/* Cosmic dust particles */}
        {enableCosmicDust && active && (
          <>
            {Array.from({ length: particleCount }).map((_, i) => {
              const size = Math.random() * 2 + 1;
              const glowColor = getRandomGlowColor();
              
              return (
                <motion.div
                  key={`dust-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: glowColor.color,
                    boxShadow: glowColor.shadowColor,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    zIndex: 2
                  }}
                  animate={{
                    x: [
                      Math.random() * 20 - 10, 
                      Math.random() * 20 - 10, 
                      Math.random() * 20 - 10
                    ],
                    y: [
                      Math.random() * 20 - 10, 
                      Math.random() * 20 - 10, 
                      Math.random() * 20 - 10
                    ],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 5 + Math.random() * 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    times: [0, 0.5, 1],
                    delay: Math.random() * 2
                  }}
                />
              );
            })}
          </>
        )}
        
        {/* Satoshi symbol particles - only when enabled */}
        {satoshiParticles && active && (
          <>
            {Array.from({ length: Math.min(5, particleCount / 3) }).map((_, i) => {
              const glowColor = getRandomGlowColor();
              
              return (
                <motion.div
                  key={`satoshi-${i}`}
                  className="absolute text-xs font-bold"
                  style={{
                    left: `${Math.random() * 90 + 5}%`,
                    top: `${Math.random() * 90 + 5}%`,
                    zIndex: 3,
                    color: glowColor.color,
                    textShadow: glowColor.shadowColor
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 5
                  }}
                >
                  ₿
                </motion.div>
              );
            })}
          </>
        )}
      </div>
      
      {/* Orbital rings around center when orbitCount > 0 */}
      {active && orbitCount > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          {Array.from({ length: orbitCount }).map((_, i) => {
            const size = 120 + i * 40;
            const glowColor = getRandomGlowColor();
            const rotationDirection = i % 2 === 0 ? 1 : -1;
            
            return (
              <motion.div
                key={`orbit-${i}`}
                className="absolute rounded-full border"
                style={{
                  width: size,
                  height: size,
                  borderColor: glowColor.color,
                  borderWidth: 1,
                  boxShadow: glowColor.shadowColor
                }}
                animate={{
                  rotate: [0, 360 * rotationDirection]
                }}
                transition={{
                  duration: 10 + i * 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {/* Orbital objects */}
                <motion.div
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: glowColor.color,
                    boxShadow: glowColor.shadowColor,
                    top: '0%',
                    left: '50%',
                    marginLeft: -6,
                    marginTop: -6
                  }}
                  animate={{
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      )}
      
      {/* Enhanced meteors with glowing tails */}
      {active && (
        <>
          {Array.from({ length: meteorCount }).map((_, i) => {
            const size = Math.random() * meteorSize + meteorSize;
            const angle = Math.random() * 30 + 30; // 30-60 degrees
            const startX = Math.random() * 100;
            const duration = speedMap[meteorSpeed].duration[0] + 
                     Math.random() * (speedMap[meteorSpeed].duration[1] - speedMap[meteorSpeed].duration[0]);
            const delay = Math.random() * speedMap[meteorSpeed].delay;
            const glowColor = getRandomGlowColor();
            
            return (
              <motion.div
                key={`meteor-${i}`}
                className="absolute"
                style={{
                  width: 2,
                  height: size,
                  background: `linear-gradient(to bottom, rgba(255,255,255,0), ${glowColor.color})`,
                  boxShadow: glowColor.shadowColor,
                  left: `${startX}%`,
                  top: '-10%',
                  transform: `rotate(${angle}deg)`,
                  zIndex: 5
                }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: size * 3,
                  y: size * 3,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                  repeatDelay: 2 + Math.random() * 5
                }}
              />
            );
          })}
          
          {/* Add some cosmic flares - random bursts of light */}
          {Array.from({ length: Math.ceil(meteorCount / 3) }).map((_, i) => {
            const glowColor = getRandomGlowColor();
            
            return (
              <motion.div
                key={`flare-${i}`}
                className="absolute rounded-full z-10"
                style={{
                  width: 2,
                  height: 2,
                  backgroundColor: 'white',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  scale: [1, 15, 1],
                  opacity: [0, 0.7, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 5 + Math.random() * 10,
                  repeatDelay: 8 + Math.random() * 15
                }}
              />
            );
          })}
        </>
      )}
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 h-full min-h-[200px]">
        {/* Mining rate indicator */}
        {showMiner && (
          <div className="relative mb-4">
            {pulseLight && (
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-500"
                initial={{ opacity: 0.2, scale: 0.8 }}
                animate={{ 
                  opacity: [0.2, 0.5, 0.2],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ filter: 'blur(10px)' }}
              />
            )}
            <motion.div
              className="relative"
              animate={active ? { 
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              } : {}}
              transition={active ? { 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              } : {}}
              style={{ 
                width: minerSizeMap[minerSize].width, 
                height: minerSizeMap[minerSize].height 
              }}
            >
              <img 
                src={customImage} 
                alt="Mining Hardware" 
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>
        )}
        
        {/* Status text */}
        {withText && (
          <AnimatePresence mode="wait">
            {showStatus && (
              <motion.div
                key={`status-${currentStatus}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`text-center font-mono ${textColor}`}
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {miningStatus[currentStatus]}
              </motion.div>
            )}
          </AnimatePresence>
        )}
        
        {/* Mining rate display */}
        {active && (
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="text-xs text-gray-400 mb-1">Mining Rate</div>
            <div className="flex items-center justify-center space-x-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={`rate-${i}`}
                  className={`h-3 w-1 rounded-sm ${i < Math.floor(miningRate * 10) ? 'bg-green-500' : 'bg-gray-600'}`}
                  initial={{ height: 3 }}
                  animate={{ height: Math.random() * 6 + 6 }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MiningMeteorite;