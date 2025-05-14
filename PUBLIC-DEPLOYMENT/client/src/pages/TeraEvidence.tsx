import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import PhotoBook from '@/components/ui/PhotoBook';
import MusicPlayer from '@/components/ui/MusicPlayer';

const TeraEvidence: React.FC = () => {
  // Photo collection for evidence
  const evidencePhotos = [
    // You will fill this in with your evidence images
    // Example format:
    // {
    //   src: "/images/evidence_image.jpeg",
    //   alt: "Description of evidence",
    //   caption: "Caption explaining the significance of this evidence"
    // },
  ];
  
  // Add more photo collections as needed

  return (
    <MainLayout>
      <div className="container mx-auto py-10 min-h-screen">
        {/* Music Player - Fixed Position */}
        <div className="fixed bottom-6 right-6 z-50 max-w-xs w-full transform transition-transform duration-300 hover:scale-105">
          <MusicPlayer 
            audioSrc="/music/tribute_song.mp3" 
            songTitle="No Weapon Formed Against Me Shall Prosper" 
            artistName="Fred Hammond" 
            autoPlay={false}
          />
        </div>
        
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
            Evidence Collection
          </motion.h1>
        </div>
        
        {/* Evidence Introduction */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12 p-6 bg-purple-900/30 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl text-center text-purple-100 mb-6" style={{ fontFamily: "'Tangerine', cursive", fontSize: "3rem" }}>
            Documentation & Evidence
          </h2>
          
          <div className="text-purple-100 space-y-4 leading-relaxed">
            <p>
              This page contains evidence related to Tera Ann Harris's case. Each piece has been carefully preserved to document the truth about her treatment and the circumstances surrounding her death.
            </p>
            
            <p>
              The evidence presented here contradicts the official narrative and demonstrates the need for accountability and justice.
            </p>
          </div>
        </motion.div>
        
        {/* Video Evidence Section */}
        <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl mb-12 bg-purple-900/50 p-6">
          <h2 className="text-center text-white mb-4 text-3xl" style={{ fontFamily: "'Dancing Script', cursive" }}>
            Video Documentation
          </h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-purple-300/40 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <video 
              className="w-full h-full object-cover" 
              controls
              poster="/images/IMG_9497.jpeg"
            >
              <source src="/videos/tera_tribute.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        
        {/* Inmate Letters Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12 p-6 bg-purple-900/30 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl text-center text-purple-100 mb-6" style={{ fontFamily: "'Tangerine', cursive", fontSize: "3rem" }}>
            Inmate Testimony
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* This section will be filled with inmate letters */}
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border-4 border-purple-500/40 shadow-lg">
              <p className="flex items-center justify-center h-full text-center p-4 bg-purple-900/70">
                Inmate witness testimony will be placed here
              </p>
            </div>
            
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border-4 border-purple-500/40 shadow-lg">
              <p className="flex items-center justify-center h-full text-center p-4 bg-purple-900/70">
                Additional inmate letters will be placed here
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Photo Evidence Section */}
        <motion.div 
          className="max-w-5xl mx-auto mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl text-center text-purple-100 mb-8" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "3.5rem" }}>
            Photo Evidence
          </h2>
          
          {/* Photo Book Component */}
          <div className="relative">
            <PhotoBook 
              images={evidencePhotos} 
              title="Evidence Collection" 
              coverColor="bg-gradient-to-br from-purple-900 via-purple-700 to-fuchsia-800"
            />
          </div>
        </motion.div>
        
        {/* Additional Evidence Sections */}
        {/* You can add more sections here as needed */}
        
      </div>
    </MainLayout>
  );
};

export default TeraEvidence;