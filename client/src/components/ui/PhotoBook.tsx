import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Photo {
  src: string;
  alt: string;
  caption?: string;
}

interface PhotoBookProps {
  images?: Photo[];
  photos?: Photo[];
  title?: string;
  coverColor?: string;
}

const PhotoBook: React.FC<PhotoBookProps> = ({ images, photos, title = "Tera's Memory Book", coverColor }) => {
  // Handle both images and photos props for backward compatibility
  const photoItems = images || photos || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isOpen, setIsOpen] = useState(false);

  // Auto-open the book after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const nextPage = () => {
    if (flipping || currentIndex >= photoItems.length - 1) return;
    setFlipDirection('next');
    setFlipping(true);
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setFlipping(false);
    }, 300);
  };

  const prevPage = () => {
    if (flipping || currentIndex <= 0) return;
    setFlipDirection('prev');
    setFlipping(true);
    setTimeout(() => {
      setCurrentIndex(currentIndex - 1);
      setFlipping(false);
    }, 300);
  };

  const bookVariants = {
    closed: {
      rotateY: 0,
      rotateX: 10,
      scale: 0.95,
      translateY: -20,
    },
    open: {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      translateY: 0,
      transition: {
        duration: 1.2,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const pageVariants = {
    enter: (direction: 'next' | 'prev') => ({
      rotateY: direction === 'next' ? 90 : -90,
      opacity: 0,
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
      scale: 0.95,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      scale: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 20
      },
    },
    exit: (direction: 'next' | 'prev') => ({
      rotateY: direction === 'next' ? -90 : 90,
      opacity: 0,
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    }),
  };

  if (!photoItems || photoItems.length === 0) {
    return null;
  }

  const photo = photoItems[currentIndex];

  return (
    <motion.div 
      className="relative max-w-2xl mx-auto mb-12"
      variants={bookVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
    >
      {/* Decorative elements around the book */}
      <div className="absolute -top-10 -left-16 text-purple-300 opacity-30 transform rotate-15 text-6xl z-0">✿</div>
      <div className="absolute -bottom-10 -right-16 text-pink-300 opacity-30 transform -rotate-15 text-6xl z-0">✿</div>
      
      {/* Book shadow */}
      <div className="absolute top-4 -bottom-8 left-8 right-8 bg-black/50 rounded-2xl blur-xl -z-10"></div>
      
      {/* Book cover styling */}
      <div className="relative flex flex-col items-center justify-center bg-gradient-to-r from-purple-900/40 via-purple-800/60 to-purple-900/40 rounded-xl p-4 pb-6 shadow-[0_10px_40px_rgba(88,28,135,0.4)]">
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/il_fullxfull.4332995241_al1f.avif')] bg-cover bg-center opacity-10 blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/70 to-purple-900/80 rounded-xl"></div>
        </div>
        
        {/* Book spine and edge details */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-purple-900 to-purple-800 rounded-l-xl"></div>
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-purple-900 to-purple-800 opacity-70 rounded-r-xl"></div>
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-r from-purple-800/50 to-transparent"></div>
        
        {/* Gold leaf page edges */}
        <div className="absolute right-0 top-[12%] bottom-[12%] w-1 bg-gradient-to-r from-amber-200/60 to-yellow-400/80"></div>
        
        {/* Embossed cover pattern */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/il_fullxfull.4332995241_al1f.avif')] bg-repeat opacity-5"></div>
        </div>
        
        {/* Navigation arrows with improved styling */}
        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10">
          <button 
            onClick={prevPage} 
            disabled={currentIndex === 0 || flipping}
            className={`p-2 bg-purple-700/50 rounded-full shadow-lg hover:bg-purple-600/50 transition-all ${
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:scale-110'
            }`}
            aria-label="Previous page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
        
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 z-10">
          <button 
            onClick={nextPage} 
            disabled={currentIndex === photoItems.length - 1 || flipping}
            className={`p-2 bg-purple-700/50 rounded-full shadow-lg hover:bg-purple-600/50 transition-all ${
              currentIndex === photoItems.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:scale-110'
            }`}
            aria-label="Next page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
        
        {/* Book title with fancy styling */}
        <div className="text-white text-2xl mb-4 z-10 border-b border-purple-300/30 w-full text-center pb-2"
             style={{ 
               fontFamily: "'Great Vibes', 'Dancing Script', cursive",
               textShadow: "0 2px 4px rgba(0,0,0,0.3)"
             }}>
          <span className="relative">
            {title}
            <div className="absolute -top-3 -left-4 text-purple-300/40 text-sm">✿</div>
            <div className="absolute -bottom-2 -right-4 text-purple-300/40 text-sm">✿</div>
          </span>
        </div>
        
        {/* Photo page with 3D effects */}
        <div className="perspective-1000 w-full max-w-xl mx-auto" style={{ perspective: '1000px' }}>
          <AnimatePresence initial={false} custom={flipDirection} mode="wait">
            <motion.div
              key={currentIndex}
              custom={flipDirection}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full aspect-[4/3] relative rounded-lg overflow-hidden shadow-2xl transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                {/* Photo */}
                <img 
                  src={photo.src} 
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
                
                {/* Page corner curl effect */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-white/20 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-6 h-6 rounded-bl-lg shadow-[-2px_2px_3px_rgba(0,0,0,0.3)] pointer-events-none"></div>
                
                {/* Page edge effects */}
                <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/40 to-transparent"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]"></div>
                
                {/* Subtle texture overlay */}
                <div className="absolute inset-0 bg-[url('/images/il_fullxfull.4332995241_al1f.avif')] bg-cover opacity-5 mix-blend-overlay"></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Caption with decorative elements */}
        <div className="relative mt-6 px-8 pt-2 text-white text-center z-10 italic">
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-purple-300/40 text-sm">❝</div>
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-purple-300/40 text-sm">❞</div>
          <p className="text-lg" style={{ fontFamily: "'Dancing Script', cursive", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
            {photo.caption}
          </p>
        </div>
        
        {/* Page indicator with decorative styling */}
        <div className="mt-3 px-4 py-1 bg-purple-800/40 rounded-full border border-purple-500/30 text-white/80 text-sm z-10">
          {currentIndex + 1} / {photoItems.length}
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoBook;