import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import PhotoBook from '@/components/ui/PhotoBook';
import MusicPlayer from '@/components/ui/MusicPlayer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const CleanTeraLegacyPage: React.FC = () => {
  // Essential photos of Tera for the memorial
  const teraMemories = [
    {
      src: "/images/IMG_9497.jpeg",
      alt: "Tera Ann Harris",
      caption: "Forever in our hearts - Tera Ann Harris"
    },
    {
      src: "/images/IMG_9546.jpeg",
      alt: "Tera's special moments",
      caption: "A beautiful soul that touched so many lives"
    },
    {
      src: "/images/IMG_8526.jpeg",
      alt: "Smiling together",
      caption: "Your smile brightened our lives every day"
    },
    {
      src: "/images/IMG_9500.jpeg",
      alt: "Family memories",
      caption: "Her love continues to guide us"
    }
  ];
  
  // Family photos
  const familyMoments = [
    {
      src: "/images/IMG_9547.jpeg",
      alt: "Family bonds",
      caption: "The love between a mother and her daughters is eternal"
    },
    {
      src: "/images/IMG_9548.jpeg",
      alt: "Precious memories",
      caption: "These memories will forever be treasured"
    },
    {
      src: "/images/IMG_9555.jpeg",
      alt: "Family legacy",
      caption: "Your legacy lives on through the lives you touched"
    }
  ];

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
            Tera's Legacy
          </motion.h1>
        </div>
        
        {/* Video tribute */}
        <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl mb-12 bg-purple-900/50 p-6">
          <h2 className="text-center text-white mb-4 text-3xl" style={{ fontFamily: "'Dancing Script', cursive" }}>
            A Beautiful Tribute to Tera Ann Harris
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
        
        {/* Life Story Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12 p-6 bg-purple-900/30 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl text-center text-purple-100 mb-6" style={{ fontFamily: "'Tangerine', cursive", fontSize: "3rem" }}>
            Her Story
          </h2>
          
          <div className="text-purple-100 space-y-4 leading-relaxed">
            <p>
              Tera Ann Harris was a devoted mother of seven daughters, all of whom she proudly supported through college education. Her life was marked by her unconditional love for her family and her unwavering spirit in the face of adversity.
            </p>
            
            <p>
              Her legacy lives on through her daughters, who remember her for her strength, compassion, and the values she instilled in them. Despite the challenges she faced, Tera maintained her dignity and grace.
            </p>
            
            <p>
              The TERA token was created to honor her memory and to ensure that her story continues to inspire others. Through this initiative, we aim to support social justice causes that promote accountability in the legal system.
            </p>
          </div>
        </motion.div>
        
        {/* Tera and Her Children Special Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12 p-6 bg-gradient-to-r from-purple-900/30 via-fuchsia-900/40 to-purple-900/30 rounded-lg shadow-lg border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl text-center text-purple-100 mb-6" style={{ fontFamily: "'Tangerine', cursive", fontSize: "3rem" }}>
            Tera and Her Seven Daughters
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border-4 border-purple-500/40 shadow-lg">
                <img 
                  src="/images/IMG_5443.jpeg" 
                  alt="Tera with her daughters" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                  <p className="text-white text-lg font-medium">Tera with her beloved daughters</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 text-purple-100">
              <p className="mb-4 leading-relaxed text-lg">
                Tera's greatest pride was her seven daughters, all of whom she ensured received a college education despite the challenges she faced. She instilled in them values of perseverance, dignity, and the courage to stand up for what's right.
              </p>
              <p className="leading-relaxed text-lg">
                Each of her daughters carries forward her legacy of strength and determination. Even during her most difficult times, Tera's primary concern remained her children's wellbeing, making regular calls to check on their progress and offer her guidance and love.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Photo Gallery Section - Personal Memories Photo Book */}
        <motion.div 
          className="max-w-5xl mx-auto mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl text-center text-purple-100 mb-8" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "3.5rem" }}>
            Personal Memories
          </h2>
          
          {/* Photo Book Component */}
          <div className="relative">
            <PhotoBook 
              images={teraMemories} 
              title="Memories of Tera" 
              coverColor="bg-gradient-to-br from-purple-900 via-purple-700 to-fuchsia-800"
            />
          </div>
        </motion.div>
        
        {/* Family Album Section */}
        <motion.div 
          className="max-w-5xl mx-auto mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-3xl text-center text-purple-100 mb-8" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "3.5rem" }}>
            Family Album
          </h2>
          
          {/* Photo Book Component */}
          <div className="relative">
            <PhotoBook 
              images={familyMoments} 
              title="Family Moments" 
              coverColor="bg-gradient-to-br from-fuchsia-900 via-purple-700 to-purple-800"
            />
          </div>
        </motion.div>
        
        {/* Evidence Link Button */}
        <div className="w-full max-w-md mx-auto text-center my-16">
          <Link href="/tera-evidence">
            <Button
              className="bg-purple-700 hover:bg-purple-600 text-white py-3 px-8 rounded-full text-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
            >
              View Complete Documentation & Evidence
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default CleanTeraLegacyPage;