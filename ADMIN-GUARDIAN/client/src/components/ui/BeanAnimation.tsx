import { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

// Animation types
type BeanAnimationType = 
  | 'walk' 
  | 'grow' 
  | 'jump' 
  | 'dance' 
  | 'spin' 
  | 'bounce' 
  | 'shake' 
  | 'explode' 
  | 'gather' 
  | 'plant';

type BeanCharacter = 'bean' | 'lady-bean' | 'baby-bean' | 'coffee-bean' | 'super-bean';

interface BeanAnimationProps {
  type: BeanAnimationType;
  character?: BeanCharacter;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'left-to-right' | 'right-to-left' | 'bottom-to-top' | 'top-to-bottom' | 'circular';
  repeat?: number | 'infinite';
  delay?: number;
  onComplete?: () => void;
  className?: string;
  startPosition?: { x: number, y: number };
  endPosition?: { x: number, y: number };
  withTrail?: boolean;
  withGlow?: boolean;
  interactive?: boolean;
  growthStage?: number;
}

export const BeanAnimation = ({
  type = 'walk',
  character = 'bean',
  size = 'md',
  speed = 'normal',
  direction = 'left-to-right',
  repeat = 'infinite',
  delay = 0,
  onComplete,
  className = '',
  startPosition,
  endPosition,
  withTrail = false,
  withGlow = false,
  interactive = false,
  growthStage = 1
}: BeanAnimationProps) => {
  const controls = useAnimation();
  const [clickCount, setClickCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [trails, setTrails] = useState<{id: number, x: number, y: number}[]>([]);
  
  // Convert size to pixel values
  const sizeMap = {
    sm: { width: 30, height: 30 },
    md: { width: 50, height: 50 },
    lg: { width: 80, height: 80 },
    xl: { width: 120, height: 120 },
  };
  
  // Convert speed to duration values
  const speedMap = {
    slow: 4,
    normal: 2,
    fast: 1,
  };

  // Determine animation variants based on type
  const getAnimationVariants = () => {
    const duration = speedMap[speed];
    
    switch (type) {
      case 'walk':
        return {
          initial: { 
            x: direction === 'left-to-right' ? -100 : direction === 'right-to-left' ? 100 : 0,
            y: direction === 'bottom-to-top' ? 100 : direction === 'top-to-bottom' ? -100 : 0,
            opacity: 0.8,
            scale: 0.8,
          },
          animate: {
            x: direction === 'left-to-right' ? 1000 : direction === 'right-to-left' ? -1000 : 0,
            y: direction === 'bottom-to-top' ? -100 : direction === 'top-to-bottom' ? 100 : 0,
            opacity: 1,
            scale: 1,
            transition: {
              x: { duration: duration * 5, ease: "linear", repeat: repeat === 'infinite' ? Infinity : repeat, delay },
              y: { duration: duration * 5, ease: "linear", repeat: repeat === 'infinite' ? Infinity : repeat, delay },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 }
            }
          },
          hover: {
            scale: 1.1,
            transition: { duration: 0.2 }
          },
          tap: {
            scale: 0.9,
            transition: { duration: 0.1 }
          }
        };
        
      case 'grow':
        return {
          initial: { scale: 0.2, opacity: 0.7 },
          animate: { 
            scale: [0.2, 0.4, 0.6, 0.8, 1][growthStage - 1] || 0.2,
            opacity: 1,
            transition: { 
              duration: duration * 2, 
              ease: "easeOut"
            }
          },
          hover: {
            scale: ((growthStage * 0.2) + 0.1) || 0.3,
            boxShadow: "0px 0px 8px rgba(255,255,255,0.5)",
            transition: { duration: 0.3 }
          },
          tap: {
            scale: ((growthStage * 0.2) - 0.05) || 0.15,
            transition: { duration: 0.1 }
          }
        };
        
      case 'jump':
        return {
          initial: { y: 0, scale: 1 },
          animate: { 
            y: [0, -30, 0], 
            scale: [1, 1.1, 1],
            transition: { 
              duration: duration, 
              repeat: repeat === 'infinite' ? Infinity : repeat,
              repeatDelay: 0.5,
              delay 
            } 
          },
          hover: {
            y: -10,
            transition: { duration: 0.2 }
          },
          tap: {
            y: -40,
            transition: { duration: 0.3, type: "spring", stiffness: 400, damping: 10 }
          }
        };
        
      case 'dance':
        return {
          initial: { rotate: 0, scale: 1 },
          animate: { 
            rotate: [0, 5, -5, 5, 0], 
            y: [0, -5, 0, -5, 0],
            transition: { 
              duration: duration * 1.5, 
              repeat: repeat === 'infinite' ? Infinity : repeat, 
              delay 
            } 
          },
          hover: {
            rotate: 5,
            scale: 1.1,
            transition: { duration: 0.2 }
          },
          tap: {
            rotate: -5,
            scale: 0.9,
            transition: { duration: 0.1 }
          }
        };
      
      case 'spin':
        return {
          initial: { rotate: 0, scale: 1 },
          animate: { 
            rotate: 360, 
            transition: { 
              duration: duration * 2, 
              repeat: repeat === 'infinite' ? Infinity : repeat, 
              ease: "linear", 
              delay 
            } 
          },
          hover: {
            scale: 1.1,
            transition: { duration: 0.2 }
          },
          tap: {
            scale: 0.9,
            transition: { duration: 0.1 }
          }
        };
      
      case 'bounce':
        return {
          initial: { y: 0, scale: 1 },
          animate: { 
            y: [0, -15, 0, -8, 0], 
            scale: [1, 1.1, 1, 1.05, 1],
            transition: { 
              duration: duration, 
              repeat: repeat === 'infinite' ? Infinity : repeat,
              delay 
            } 
          },
          hover: {
            y: -5,
            scale: 1.1,
            transition: { duration: 0.2 }
          },
          tap: {
            y: 10,
            scale: 0.8,
            transition: { duration: 0.3, type: "spring" }
          }
        };
      
      case 'shake':
        return {
          initial: { x: 0 },
          animate: { 
            x: [0, -5, 5, -5, 5, 0], 
            transition: { 
              duration: duration / 2, 
              repeat: repeat === 'infinite' ? Infinity : repeat,
              delay 
            } 
          },
          hover: {
            scale: 1.05,
            transition: { duration: 0.2 }
          },
          tap: {
            scale: 0.95,
            transition: { duration: 0.1 }
          }
        };
      
      case 'explode':
        return {
          initial: { scale: 1, opacity: 1 },
          animate: { 
            scale: [1, 1.5, 2], 
            opacity: [1, 0.7, 0],
            transition: { 
              duration: duration, 
              delay 
            } 
          },
          hover: {
            scale: 1.1,
            transition: { duration: 0.2 }
          },
          tap: {
            scale: 1.5,
            opacity: 0.5,
            transition: { duration: 0.3 }
          }
        };
      
      case 'gather':
        return {
          initial: { 
            x: direction === 'left-to-right' ? -50 : direction === 'right-to-left' ? 50 : 0,
            y: direction === 'bottom-to-top' ? 50 : direction === 'top-to-bottom' ? -50 : 0,
            opacity: 0.8,
            scale: 0.8,
          },
          animate: { 
            x: 0, 
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { 
              duration: duration, 
              delay 
            } 
          },
          hover: {
            scale: 1.1,
            transition: { duration: 0.2 }
          },
          tap: {
            scale: 0.9,
            transition: { duration: 0.1 }
          }
        };
      
      case 'plant':
        return {
          initial: { y: -20, opacity: 0, scale: 0.5 },
          animate: { 
            y: 0, 
            opacity: 1,
            scale: growthStage * 0.2 || 0.2,
            transition: { 
              duration: duration, 
              delay 
            } 
          },
          hover: {
            y: -5,
            scale: (growthStage * 0.2) + 0.05 || 0.25,
            transition: { duration: 0.2 }
          },
          tap: {
            y: 0,
            scale: (growthStage * 0.2) - 0.05 || 0.15,
            transition: { duration: 0.1 }
          }
        };
        
      default:
        return {
          initial: { opacity: 0 },
          animate: { 
            opacity: 1,
            transition: { duration: 0.5, delay } 
          },
          hover: {
            scale: 1.1,
            transition: { duration: 0.2 }
          },
          tap: {
            scale: 0.9,
            transition: { duration: 0.1 }
          }
        };
    }
  };

  const variants = getAnimationVariants();
  
  // Additional styling based on growth stage for plant and grow animations
  const getGrowthStyles = () => {
    if (type === 'grow' || type === 'plant') {
      // Different colors/effects based on growth stage
      switch(growthStage) {
        case 1: return { filter: 'brightness(0.8)' };
        case 2: return { filter: 'brightness(0.9)' };
        case 3: return { filter: 'brightness(1.0)' };
        case 4: return { filter: 'brightness(1.1)' };
        case 5: return { filter: 'brightness(1.2)' };
        default: return {};
      }
    }
    return {};
  };
  
  // Effect to start animation
  useEffect(() => {
    controls.start('animate');
    
    // Create trail effect if enabled
    if (withTrail && (type === 'walk' || type === 'jump')) {
      const interval = setInterval(() => {
        setTrails(prevTrails => {
          // Get current position
          const newTrail = {
            id: Date.now(),
            x: Math.random() * 20 - 10, // Random offset
            y: Math.random() * 20 - 10  // Random offset
          };
          
          // Keep only the 5 most recent trails
          const updatedTrails = [...prevTrails, newTrail].slice(-5);
          return updatedTrails;
        });
      }, 300); // Add a new trail every 300ms
      
      return () => clearInterval(interval);
    }
  }, [controls, type, withTrail]);
  
  // Handle click events for interactive beans
  const handleClick = () => {
    if (!interactive) return;
    
    setClickCount(prev => prev + 1);
    
    // Different interactions based on bean type
    switch(type) {
      case 'grow':
      case 'plant':
        // Water/nurture the bean
        controls.start({
          scale: ((growthStage * 0.2) + 0.1) || 0.3,
          transition: { duration: 0.3 }
        });
        setTimeout(() => {
          controls.start('animate');
        }, 300);
        break;
        
      case 'jump':
        controls.start({
          y: -40,
          transition: { duration: 0.5, type: "spring", stiffness: 400, damping: 10 }
        });
        setTimeout(() => {
          controls.start('animate');
        }, 500);
        break;
        
      case 'dance':
        controls.start({
          rotate: [0, 10, -10, 10, -10, 0],
          y: [0, -10, 0, -10, 0],
          transition: { duration: 1 }
        });
        setTimeout(() => {
          controls.start('animate');
        }, 1000);
        break;
        
      default:
        controls.start({
          scale: [1, 1.2, 1],
          transition: { duration: 0.5 }
        });
        setTimeout(() => {
          controls.start('animate');
        }, 500);
    }
    
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <div className={`relative ${className}`} style={{ width: sizeMap[size].width, height: sizeMap[size].height }}>
      {/* Trails if enabled */}
      {withTrail && trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          className="absolute rounded-full"
          style={{
            width: sizeMap[size].width * 0.3,
            height: sizeMap[size].height * 0.3,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            left: trail.x,
            bottom: trail.y,
            zIndex: 0
          }}
          initial={{ opacity: 0.7, scale: 0.7 }}
          animate={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 1 }}
        />
      ))}
      
      {/* The main bean animation */}
      <motion.div
        className={`relative z-10 ${interactive ? 'cursor-pointer' : ''}`}
        initial="initial"
        animate={controls}
        variants={variants}
        onHoverStart={() => interactive && setIsHovered(true)}
        onHoverEnd={() => interactive && setIsHovered(false)}
        onClick={handleClick}
        style={{
          width: sizeMap[size].width,
          height: sizeMap[size].height,
          ...getGrowthStyles(),
          ...(withGlow ? { 
            filter: `drop-shadow(0 0 ${isHovered ? '8px' : '4px'} rgba(255, 255, 255, ${isHovered ? '0.8' : '0.4'}))`
          } : {})
        }}
      >
        <img 
          src={`/${character}.png`} 
          alt={`${character} animation`}
          className="w-full h-full object-contain"
          style={{
            transform: direction === 'right-to-left' ? 'scaleX(-1)' : 'none',
          }}
        />
        
        {/* Grow indicator for plant/grow animations */}
        {(type === 'grow' || type === 'plant') && growthStage < 5 && interactive && (
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-white bg-green-600 px-1 rounded">
            {growthStage}/5
          </div>
        )}
        
        {/* Click counter for interactive beans */}
        {interactive && clickCount > 0 && (
          <motion.div
            className="absolute -top-6 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            {clickCount}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BeanAnimation;