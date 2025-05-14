import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import PhotoBook from '@/components/ui/PhotoBook';
import MusicPlayer from '@/components/ui/MusicPlayer';

const TeraEvidence: React.FC = () => {
  // Photo collection for evidence
  const evidencePhotos = [
    {
      src: "/images/tera/tera-black-eye.jpeg",
      alt: "Tera Ann Harris with black eye injury sustained in detention",
      caption: "Physical evidence of injuries sustained during detention - black eye visible and documented"
    },
    {
      src: "/images/tera/tera-injured.jpeg",
      alt: "Tera Ann Harris with injuries while in detention",
      caption: "Facial injuries sustained while in police custody, documented several days before her death"
    },
    {
      src: "/images/tera/tera-terminal.jpeg",
      alt: "Computer terminal showing Tera's medical data discrepancies",
      caption: "Medical records terminal showing discrepancies between reported medical checks and actual events"
    },
    {
      src: "/attached_assets/IMG_9588.jpeg",
      alt: "Tera Ann Harris in detention facility",
      caption: "From detention footage - direct image access from uploaded assets"
    },
    {
      src: "/attached_assets/IMG_3627.png",
      alt: "Computer terminal evidence",
      caption: "Computer terminal showing discrepancies - direct asset access"
    },
  ];
  
  // Medical records evidence collection
  const medicalRecordsEvidence = [
    {
      title: "Timing Discrepancies",
      description: "Medical checks were reportedly conducted at times when video evidence shows no staff entered Tera's cell"
    },
    {
      title: "Retroactive Documentation",
      description: "Records were entered after the fact, when Tera was already in medical distress"
    },
    {
      title: "Missing Assessments",
      description: "Critical medical assessments that should have been performed are absent from the records"
    },
    {
      title: "Falsified Reports",
      description: "Entries claiming 'normal vital signs' during periods when surveillance footage shows Tera was in distress"
    },
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
        
        {/* Medical Records Evidence Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16 p-8 bg-purple-900/40 rounded-lg shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-3xl text-center text-purple-100 mb-8" style={{ fontFamily: "'Dancing Script', cursive", fontSize: "3.5rem" }}>
            Medical Records Analysis
          </h2>
          
          <div className="mb-10">
            <div className="relative rounded-lg overflow-hidden shadow-lg mb-6">
              <img 
                src="/attached_assets/b67e40103484545.5f4e52ffb1d0f (1).png" 
                alt="Computer terminal showing Tera's medical data discrepancies" 
                className="w-full h-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 via-purple-900/60 to-transparent p-6">
                <h3 className="text-2xl font-semibold text-white mb-2">Computer Terminal Evidence</h3>
                <p className="text-purple-100">
                  Medical records terminal displaying critical discrepancies in Tera's case. These records have been secured as evidence through legal discovery.
                </p>
              </div>
            </div>
            
            <div className="bg-red-900/30 border-l-4 border-red-400 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-red-200 mb-4">Critical Findings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {medicalRecordsEvidence.map((evidence, index) => (
                  <div key={index} className="bg-purple-950/50 p-5 rounded-lg shadow border border-purple-500/30">
                    <h4 className="text-lg font-bold text-red-300 mb-2">{evidence.title}</h4>
                    <p className="text-purple-100">{evidence.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-black/30 rounded-lg">
                <p className="text-white italic">
                  "The computer terminal records show evidence of retroactive documentation and falsification. Timestamps reveal medical checks were recorded during periods when surveillance footage confirms no staff entered the cell." 
                  <span className="block mt-2 text-sm text-gray-300">— Expert Witness Statement</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium transform transition-transform hover:scale-105 shadow-lg hover:shadow-purple-500/30">
              Download Full Medical Records Analysis
            </button>
          </div>
        </motion.div>
        
        {/* Additional Evidence Sections */}
        <motion.div 
          className="max-w-4xl mx-auto mb-20 p-8 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg shadow-xl border border-purple-500/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl text-center text-purple-100 mb-8" style={{ fontFamily: "'Tangerine', cursive", fontSize: "3.5rem" }}>
            Physical Injuries Documentation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="relative rounded-lg overflow-hidden shadow-lg border-2 border-purple-500/30">
              <img 
                src="/images/tera/tera-black-eye.jpeg" 
                alt="Tera Ann Harris with black eye injury sustained in detention" 
                className="w-full h-auto object-cover aspect-[4/5]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 to-transparent p-4">
                <h3 className="text-lg font-semibold text-white">Black Eye Injury</h3>
                <p className="text-purple-100 text-sm">Documented during detention, contradicting official reports</p>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden shadow-lg border-2 border-purple-500/30">
              <img 
                src="/images/tera/tera-injured.jpeg" 
                alt="Tera Ann Harris with facial injuries while in detention" 
                className="w-full h-auto object-cover aspect-[4/5]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 to-transparent p-4">
                <h3 className="text-lg font-semibold text-white">Facial Injuries</h3>
                <p className="text-purple-100 text-sm">Multiple facial injuries documented days before her death</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Forensic Analysis</h3>
            <p className="text-purple-100 mb-4">
              Independent forensic analysis confirms these injuries are consistent with physical altercations and not self-inflicted as claimed in official reports. The pattern of bruising indicates multiple impact points that could not have occurred from a single fall.
            </p>
            <p className="text-purple-100">
              These injuries were not properly treated or documented in the official medical records, contributing to the deterioration of Tera's condition in the days leading up to her death.
            </p>
          </div>
        </motion.div>
        
      </div>
    </MainLayout>
  );
};

export default TeraEvidence;