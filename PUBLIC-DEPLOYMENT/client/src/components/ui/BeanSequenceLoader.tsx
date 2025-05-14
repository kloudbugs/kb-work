import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define props for our loader component
interface BeanSequenceLoaderProps {
  isLoading?: boolean;
  onComplete?: () => void;
  className?: string;
  frames?: string[]; // Array of image URLs for animation sequence
  frameCount?: number; // Number of frames if using numbered sequence
  frameDelay?: number; // Delay between frames in milliseconds
  repeat?: number | 'infinite'; // How many times to repeat animation
  size?: 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: string;
  withText?: boolean;
  text?: string;
  character?: 'bean' | 'lady-bean' | 'baby-bean' | 'coffee-bean' | 'super-bean';
  withMeteors?: boolean;
  meteorCount?: number;
  withStars?: boolean;
  starCount?: number;
  withCosmic?: boolean;
}

export const BeanSequenceLoader = ({
  isLoading = true,
  onComplete,
  className = '',
  frames,
  frameCount = 8, // Default to 8 frames if not specified
  frameDelay = 100, // Default 100ms between frames
  repeat = 'infinite',
  size = 'md',
  backgroundColor = 'rgba(0, 0, 0, 0.7)',
  withText = true,
  text = 'Loading...',
  character = 'bean',
  withMeteors = true,
  meteorCount = 6,
  withStars = true,
  starCount = 40,
  withCosmic = true
}: BeanSequenceLoaderProps) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  
  // Generate frames if not provided
  const animationFrames = frames || Array.from({ length: frameCount }, (_, i) => 
    `/loading/${character}-frame-${i + 1}.png`
  );
  
  // Map size to actual dimensions
  const sizeMap = {
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 200, height: 200 },
    xl: { width: 300, height: 300 },
  };
  
  // Fallback frames for testing - simple bean coming to life sequence
  const fallbackFrames = [
    "/bean.png",
    "/bean.png",
    "/bean.png",
    "/bean.png",
    "/lady-bean.png",
    "/lady-bean.png",
    "/baby-bean.png",
    "/coffee-bean.png"
  ];
  
  // Use fallback frames if the custom frames don't exist
  const frameSet = animationFrames.length > 0 ? animationFrames : fallbackFrames;
  
  // Run the animation
  useEffect(() => {
    if (!isLoading || animationComplete) {
      return;
    }
    
    const animationInterval = setInterval(() => {
      setCurrentFrame(prev => {
        // If we're at the last frame
        if (prev >= frameSet.length - 1) {
          // Check if we need to repeat
          if (repeat === 'infinite') {
            return 0; // Reset to first frame
          } else if (typeof repeat === 'number' && repeatCount < repeat - 1) {
            setRepeatCount(prev => prev + 1);
            return 0; // Reset to first frame
          } else {
            // Animation is complete
            clearInterval(animationInterval);
            setAnimationComplete(true);
            if (onComplete) {
              onComplete();
            }
            return prev;
          }
        }
        return prev + 1;
      });
    }, frameDelay);
    
    return () => clearInterval(animationInterval);
  }, [isLoading, animationComplete, frameSet.length, frameDelay, repeat, repeatCount, onComplete]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.2
      }
    },
    exit: { 
      opacity: 0,
      y: -10,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <AnimatePresence>
      {isLoading && !animationComplete && (
        <motion.div
          className={`fixed inset-0 flex flex-col items-center justify-center z-50 ${className}`}
          style={{ backgroundColor }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Cosmic background with stars */}
          {withStars && (
            <div className="absolute inset-0 overflow-hidden">
              {/* Stars background */}
              {Array.from({ length: starCount }).map((_, i) => {
                const size = Math.random() * 3 + 1;
                const opacity = Math.random() * 0.7 + 0.3;
                const animationDuration = Math.random() * 3 + 2;
                
                return (
                  <motion.div
                    key={`star-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: size,
                      height: size,
                      backgroundColor: `rgba(255, 255, 255, ${opacity})`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      boxShadow: `0 0 ${size}px rgba(255, 255, 255, ${opacity})`
                    }}
                    animate={{
                      opacity: [opacity, opacity * 1.5, opacity],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: animationDuration,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                );
              })}
              
              {/* Cosmic dust clouds */}
              {withCosmic && (
                <>
                  <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 to-transparent" />
                  <motion.div
                    className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-900/5 to-purple-900/5 blur-3xl"
                    style={{ left: '30%', top: '20%' }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity
                    }}
                  />
                  <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-900/5 to-violet-900/5 blur-3xl"
                    style={{ left: '10%', top: '60%' }}
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                      duration: 18,
                      repeat: Infinity,
                      delay: 2
                    }}
                  />
                </>
              )}
            </div>
          )}
          
          {/* Meteors */}
          {withMeteors && (
            <>
              {Array.from({ length: meteorCount }).map((_, i) => {
                const size = Math.random() * 40 + 60;
                const angle = Math.random() * 30 + 20; // Angle in degrees (20-50)
                const startX = Math.random() * 100; // Start position (0-100%)
                const duration = Math.random() * 2 + 1; // 1-3 seconds
                const delay = Math.random() * 10; // 0-10 seconds delay
                
                return (
                  <motion.div
                    key={`meteor-${i}`}
                    className="absolute"
                    style={{
                      width: 2,
                      height: size,
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.8))',
                      left: `${startX}%`,
                      top: '-10%',
                      transform: `rotate(${angle}deg)`,
                      borderRadius: '100px',
                      zIndex: 1
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
                      repeatDelay: 5 + Math.random() * 10
                    }}
                  />
                );
              })}
            </>
          )}
          
          {/* The image sequence container */}
          <div 
            className="relative flex items-center justify-center overflow-hidden rounded-full z-10"
            style={{ width: sizeMap[size].width, height: sizeMap[size].height }}
          >
            {/* Glowing background effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full animate-pulse-slow blur-lg"
            />
            
            {/* Cosmic rings around the bean (Saturn-like) */}
            {withCosmic && (
              <>
                <motion.div
                  className="absolute w-[130%] h-[20px] bg-gradient-to-r from-purple-500/10 via-blue-500/20 to-purple-500/10 blur-sm"
                  style={{ 
                    borderRadius: '100%',
                    transform: 'rotateX(75deg)'
                  }}
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="absolute w-[120%] h-[15px] bg-gradient-to-r from-cyan-500/10 via-blue-500/20 to-cyan-500/10 blur-sm"
                  style={{ 
                    borderRadius: '100%',
                    transform: 'rotateX(75deg) rotateY(15deg)'
                  }}
                  animate={{
                    rotate: -360
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </>
            )}
            
            {/* Current frame image */}
            <motion.img
              src={frameSet[currentFrame]}
              alt={`Loading animation frame ${currentFrame + 1}`}
              className="relative z-10"
              style={{ width: sizeMap[size].width * 0.8, height: sizeMap[size].height * 0.8 }}
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ 
                scale: [0.8, 1, 0.8],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Particles / sparkles around the image */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 bg-white rounded-full z-0"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, (Math.random() - 0.5) * 100],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
          
          {/* Loading text */}
          {withText && (
            <motion.div
              className="mt-6 text-white text-xl font-medium relative z-10"
              variants={textVariants}
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <motion.span
                animate={{
                  textShadow: [
                    '0 0 5px rgba(99, 102, 241, 0.5)',
                    '0 0 20px rgba(99, 102, 241, 0.8)',
                    '0 0 5px rgba(99, 102, 241, 0.5)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                {text}
              </motion.span>
            </motion.div>
          )}
          
          {/* Frame counter for debugging */}
          {/* <div className="absolute bottom-4 right-4 text-white text-xs">
            Frame: {currentFrame + 1}/{frameSet.length}
          </div> */}
          
          {/* Cosmic flash effect on frame change */}
          <AnimatePresence>
            {currentFrame === 0 && withCosmic && (
              <motion.div
                className="absolute inset-0 bg-blue-500/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BeanSequenceLoader;