import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import PhotoBook from '@/components/ui/PhotoBook';

const TeraLegacyRootsPage: React.FC = () => {
  // Photo collection for the Roots photo book - Tera's ancestry and heritage
  const rootsPhotos = [
    {
      src: "/images/IMG_9497.jpeg",
      alt: "Tera Ann Harris",
      caption: "Tera Ann Harris - Our family's strong foundation"
    },
    {
      src: "/images/IMG_8526.jpeg",
      alt: "Family roots",
      caption: "The roots of our family tree run deep"
    },
    {
      src: "/images/IMG_9500.jpeg",
      alt: "Ancestral connection",
      caption: "Connecting generations through love and memory"
    },
    {
      src: "/images/IMG_3269.jpeg",
      alt: "Heritage",
      caption: "Her heritage lives on through all of us"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-10 min-h-screen">
        {/* Title */}
        <div className="relative mb-16 mt-8">
          {/* Background flower image */}
          <div 
            className="absolute inset-0 z-0 rounded-xl overflow-hidden opacity-30"
            style={{
              backgroundImage: "url('/images/il_fullxfull.4332995241_al1f.avif')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "blur(2px) brightness(1.2)",
              transform: "scale(1.1)",
            }}
          />
          
          {/* Decorative elements */}
          <div className="absolute -top-16 left-1/4 text-purple-300 opacity-60 transform rotate-15 text-5xl z-10">✿</div>
          <div className="absolute -top-12 right-1/4 text-pink-300 opacity-60 transform -rotate-15 text-5xl z-10">✿</div>
          <div className="absolute -bottom-12 left-1/3 text-purple-300 opacity-60 transform rotate-45 text-5xl z-10">✿</div>
          <div className="absolute -bottom-16 right-1/3 text-pink-300 opacity-60 transform -rotate-45 text-5xl z-10">✿</div>
          
          {/* Main title with calligraphy styling */}
          <motion.h1 
            className="text-6xl md:text-8xl text-center relative z-20"
            style={{
              fontFamily: "'Pinyon Script', 'Tangerine', 'Great Vibes', 'Dancing Script', cursive",
              background: "linear-gradient(to right, #ff9cee, #a78bfa, #c026d3, #9d4edd, #e0aaff)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "0 0 25px rgba(192, 38, 211, 0.9), 0 0 30px rgba(255, 255, 255, 0.4)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              transform: "rotate(-2deg)",
              padding: "50px 20px",
              lineHeight: 1.2,
              textDecoration: "underline",
              textDecorationStyle: "wavy",
              textDecorationColor: "rgba(192, 38, 211, 0.4)",
              textDecorationThickness: "1px",
              textUnderlineOffset: "15px",
            }}
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1,
              backgroundPosition: ["0% center", "200% center"]
            }}
            transition={{ 
              duration: 1.8,
              backgroundPosition: {
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          >
            Tera's Roots
          </motion.h1>
          
          {/* Decorative dove elements */}
          <div className="absolute top-2 left-12 text-white opacity-50 transform rotate-15 text-3xl z-10">🕊️</div>
          <div className="absolute top-10 right-12 text-white opacity-50 transform -rotate-15 text-3xl z-10">🕊️</div>
        </div>
        
        {/* Story Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12 p-6 bg-purple-900/30 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl text-center text-purple-100 mb-6" style={{ fontFamily: "'Tangerine', cursive", fontSize: "3rem" }}>
            Her Heritage
          </h2>
          
          <div className="text-purple-100 space-y-4 leading-relaxed">
            <p>
              The story of Tera Ann Harris is rooted in a rich heritage of strength, resilience, and deep family bonds. These roots have provided the foundation for a remarkable life and a legacy that continues to impact countless lives today.
            </p>
            
            <p>
              Tera's roots are reflected in her unfailing commitment to her seven daughters, instilling in them values of love, dignity and perseverance through both words and actions.
            </p>
            
            <p>
              Though no longer physically with us, Tera's roots remain firmly planted in our hearts, providing strength and guidance as we carry her memory forward through the TERA token and the pursuit of justice in her name.
            </p>
          </div>
        </motion.div>
        
        {/* Photo Book - Roots */}
        <motion.div 
          className="max-w-5xl mx-auto mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl text-center text-purple-100 mb-8" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "3.5rem" }}>
            Family Heritage
          </h2>
          
          {/* Photo Book Component */}
          <PhotoBook photos={rootsPhotos} title="Our Family Roots" />
        </motion.div>
        
        {/* Quote Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 px-4">
          <motion.div
            className="relative py-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="absolute top-0 left-0 text-purple-300/30 text-8xl" style={{ fontFamily: "'Pinyon Script', cursive" }}>"</div>
            <div className="absolute bottom-0 right-0 text-purple-300/30 text-8xl" style={{ fontFamily: "'Pinyon Script', cursive" }}>"</div>
            
            <p className="text-xl md:text-2xl text-purple-100 italic px-12">
              The strongest roots are not those which keep us in place, but those which allow us to grow and reach toward the sky while remaining connected to what matters most.
            </p>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeraLegacyRootsPage;