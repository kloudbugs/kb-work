import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CosmicSlideshowProps {
  className?: string;
}

export function CosmicSlideshow({ className = '' }: CosmicSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Array of image paths for the slideshow
  const cosmicImages = [
    '/attached_assets/4D8F4D50-6BB4-4CA8-B4FF-07639180B7CD.PNG',
    '/attached_assets/DE2097B5-8651-4353-A8B0-58F7193A6A35.PNG',
    '/attached_assets/044A1166-CCA9-4C68-A5B3-E726969CFF4E.PNG',
    '/attached_assets/B128FEDF-F7E0-49C9-9695-CBB0B18BC4A5.PNG',
  ];

  // Auto-advance the slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cosmicImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [cosmicImages.length]);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Starry background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(white,rgba(255,255,255,.2))]
                       opacity-[.15] blur-[2px]"
             style={{ backgroundSize: '3px 3px' }}>
        </div>
      </div>

      {/* Slideshow */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full"
          >
            <img
              src={cosmicImages[currentIndex]}
              alt={`Cosmic Image ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Cosmic overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent mix-blend-overlay"></div>
            
            {/* Glowing stars */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.7)',
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {cosmicImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}