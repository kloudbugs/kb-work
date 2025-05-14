import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoinAnimationProps {
  imagePath: string;
  altText: string;
  className?: string;
  onAnimationComplete?: () => void;
}

export default function CoinAnimation({
  imagePath,
  altText,
  className = '',
  onAnimationComplete
}: CoinAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [isFlipping, setIsFlipping] = useState(true);

  // Animation runs for 7 flips
  useEffect(() => {
    // Set a timer to end the animation after 3.5 seconds (7 flips)
    const timer = setTimeout(() => {
      setIsFlipping(false);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 3500);
    
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="w-full h-full relative"
            animate={{
              rotateY: isFlipping ? [0, 180, 360, 540, 720, 900, 1080, 1260, 1440, 1620, 1800, 1980, 2160, 2340, 2520] : 2520,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotateY: {
                duration: 3.5,
                ease: "easeOut",
              },
              scale: {
                duration: 3.5,
                times: [0, 0.5, 1]
              }
            }}
            onAnimationComplete={() => {
              setIsAnimating(false);
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Front of coin */}
            <motion.div
              className="absolute inset-0 backface-hidden rounded-full overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}

            >
              <img 
                src={imagePath} 
                alt={`${altText} - Front`} 
                className="w-full h-full object-cover rounded-full"
              />
            </motion.div>

            {/* Back of coin */}
            <motion.div
              className="absolute inset-0 backface-hidden rounded-full overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="w-full h-full bg-gradient-to-r from-amber-600/90 to-amber-400/90 rounded-full flex items-center justify-center">
                <svg 
                  className="w-3/5 h-3/5 text-white" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" 
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        )}

        {!isAnimating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: [
                "0 0 10px rgba(217, 119, 6, 0.4)",
                "0 0 20px rgba(217, 119, 6, 0.6)",
                "0 0 15px rgba(217, 119, 6, 0.5)",
              ]
            }}
            transition={{ 
              duration: 0.8,
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
            className="w-full h-full rounded-full overflow-hidden"
          >
            <img 
              src={imagePath} 
              alt={altText} 
              className="w-full h-full object-cover rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}