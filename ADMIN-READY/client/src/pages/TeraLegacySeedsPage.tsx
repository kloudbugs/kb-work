import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import PhotoBook from '@/components/ui/PhotoBook';

const TeraLegacySeedsPage: React.FC = () => {
  // Photo collection for the Seeds photo book - Tera's legacy through her children
  const seedsPhotos = [
    {
      src: "/images/IMG_0550.jpeg",
      alt: "Tera's legacy",
      caption: "The seeds of love she planted continue to grow"
    },
    {
      src: "/images/20170604_004537_Original.jpeg",
      alt: "Family gathering",
      caption: "Her daughters carry forward her spirit and values"
    },
    {
      src: "/images/IMG_9513.jpeg",
      alt: "Family bonds",
      caption: "The unbreakable bonds between mother and daughters"
    },
    {
      src: "/images/IMG_9463.png",
      alt: "Growing legacy",
      caption: "Each child a beautiful seed of Tera's legacy"
    },
    {
      src: "/images/IMG_9464.png",
      alt: "Future generations",
      caption: "Her love continues to nourish new generations"
    },
    {
      src: "/images/IMG_9465.png",
      alt: "Seven daughters",
      caption: "Seven daughters, seven seeds of hope and change"
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
            Tera's Seeds
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
            Her Growing Legacy
          </h2>
          
          <div className="text-purple-100 space-y-4 leading-relaxed">
            <p>
              Tera Ann Harris planted seeds of love, compassion, and strength throughout her life. These seeds continue to grow and flourish in the lives of her seven beautiful daughters and all those touched by her presence.
            </p>
            
            <p>
              Like a garden that continues to bloom season after season, the seeds of Tera's influence extend beyond her immediate family, creating ripples of positive change in her community and beyond.
            </p>
            
            <p>
              Through the TERA token initiative, these seeds are now growing into a movement for justice and accountability—a living testament to how one person's life can plant the seeds of meaningful change for generations to come.
            </p>
          </div>
        </motion.div>
        
        {/* Photo Book - Seeds */}
        <motion.div 
          className="max-w-5xl mx-auto mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl text-center text-purple-100 mb-8" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "3.5rem" }}>
            Growing Legacy
          </h2>
          
          {/* Photo Book Component */}
          <PhotoBook photos={seedsPhotos} title="Seeds of Change" />
        </motion.div>
        
        {/* Token Section */}
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-16 bg-gradient-to-r from-purple-900/30 via-fuchsia-900/40 to-purple-900/30 rounded-lg p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-3xl text-white mb-6" style={{ fontFamily: "'Tangerine', cursive", fontSize: "3.5rem" }}>
            Seeds of Justice
          </h2>
          
          <div className="flex flex-col items-center justify-center">
            {/* Purple Token Circle */}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-800 via-purple-600 to-purple-900 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(126,34,206,0.7)]">
              {/* Token inner details */}
              <div className="absolute inset-2 rounded-full border-2 border-purple-300/40"></div>
              <div className="absolute inset-3 rounded-full border border-purple-200/20"></div>
              
              {/* Token glow effect */}
              <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-pulse"></div>
              
              {/* TERA text */}
              <div className="relative z-10 text-center">
                <div className="text-2xl font-bold bg-gradient-to-br from-white via-purple-200 to-yellow-100 text-transparent bg-clip-text">TERA</div>
                <div className="text-sm text-purple-200">TOKEN</div>
              </div>
              
              {/* Outer glow ring */}
              <div className="absolute -inset-1 rounded-full border border-purple-400/20 animate-ping opacity-30"></div>
            </div>
            
            <p className="text-lg text-purple-100 max-w-2xl mb-6">
              The TERA token represents the seeds of justice being planted today. Through this initiative, we nurture the growth of accountability and reform in the legal system.
            </p>
            
            {/* Growth stages illustration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-6">
              <div className="bg-purple-800/40 p-5 rounded-lg border border-purple-500/30 hover:bg-purple-700/40 transition-colors duration-300">
                <div className="text-3xl mb-2">🌱</div>
                <p className="text-purple-100">Awareness</p>
              </div>
              <div className="bg-purple-800/40 p-5 rounded-lg border border-purple-500/30 hover:bg-purple-700/40 transition-colors duration-300">
                <div className="text-3xl mb-2">🌿</div>
                <p className="text-purple-100">Advocacy</p>
              </div>
              <div className="bg-purple-800/40 p-5 rounded-lg border border-purple-500/30 hover:bg-purple-700/40 transition-colors duration-300">
                <div className="text-3xl mb-2">🌳</div>
                <p className="text-purple-100">Change</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Quote Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 px-4">
          <motion.div
            className="relative py-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="absolute top-0 left-0 text-purple-300/30 text-8xl" style={{ fontFamily: "'Pinyon Script', cursive" }}>"</div>
            <div className="absolute bottom-0 right-0 text-purple-300/30 text-8xl" style={{ fontFamily: "'Pinyon Script', cursive" }}>"</div>
            
            <p className="text-xl md:text-2xl text-purple-100 italic px-12">
              From the smallest seeds come the mightiest changes. Tera's legacy continues to grow in ways that transform lives and systems for generations to come.
            </p>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeraLegacySeedsPage;