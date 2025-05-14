import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import PhotoBook from '@/components/ui/PhotoBook';
import MusicPlayer from '@/components/ui/MusicPlayer';

const TeraLegacyPage: React.FC = () => {
  // Photo collection for the first photo book - Personal Memories
  const personalMemories = [
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
    },
    {
      src: "/images/IMG_3269.jpeg",
      alt: "Special moment",
      caption: "Every moment with you was precious"
    }
  ];
  
  // Photo collection for the second photo book - Family Album
  const familyAlbum = [
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
    },
    {
      src: "/images/20170604_004537_Original.jpeg",
      alt: "Family gathering",
      caption: "Family celebrations were always special with you"
    },
    {
      src: "/images/IMG_0550.jpeg",
      alt: "Tera with family",
      caption: "Creating beautiful memories together"
    },
    {
      src: "/images/IMG_9513.jpeg",
      alt: "Tera with family",
      caption: "Family means everything"
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
          
          {/* Decorative flower elements */}
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
            Tera's Legacy
          </motion.h1>
          
          {/* Decorative dove elements */}
          <div className="absolute top-2 left-12 text-white opacity-50 transform rotate-15 text-3xl z-10">🕊️</div>
          <div className="absolute top-10 right-12 text-white opacity-50 transform -rotate-15 text-3xl z-10">🕊️</div>
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
              Her legacy lives on through her daughters, who remember her for her strength, compassion, and the values she instilled in them. Despite the challenges she faced, Tera maintained her dignity and grace. It's important to note that throughout her entire life, <span className="text-purple-50 font-semibold">Tera never had a single drug charge or drug-related offense</span> on her record, making the official account of her death by fentanyl overdose particularly suspicious and contradictory to her documented history.
            </p>
            
            <p>
              The TERA token was created to honor her memory and to ensure that her story continues to inspire others. Through this initiative, we aim to support social justice causes that promote accountability in the legal system and challenge false narratives about individuals in custody.
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
                Each of her daughters carries forward her legacy of strength and determination. Even during her incarceration, Tera's primary concern remained her children's wellbeing, making regular calls to check on their progress and offer her guidance and love.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-purple-400/30 shadow-md">
              <img 
                src="/images/IMG_9562.jpeg" 
                alt="Tera's final hours" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                <p className="text-white text-sm">Critical evidence documenting Tera's treatment</p>
              </div>
            </div>
            
            <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-purple-400/30 shadow-md">
              <img 
                src="/images/72099765902__30A601E3-523A-45A2-89AC-E03C2E74F3AF.jpeg" 
                alt="Tera's moments with family" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                <p className="text-white text-sm">Family memories that sustain us</p>
              </div>
            </div>
            
            <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-purple-400/30 shadow-md">
              <img 
                src="/images/IMG_9547.jpeg" 
                alt="Tera with her children" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                <p className="text-white text-sm">The bond of a mother and her children</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Historical Context Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12 p-6 bg-purple-900/30 rounded-lg shadow-lg border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl text-center text-purple-100 mb-6" style={{ fontFamily: "'Tangerine', cursive", fontSize: "3rem" }}>
            Historical Context
          </h2>
          
          <div className="text-purple-100 space-y-4 leading-relaxed">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-purple-200">Related News Article</h3>
                <p className="mb-3">
                  An important historical article that provides context to the struggles Tera faced and the systemic issues she encountered:
                </p>
                <div className="bg-purple-800/40 p-4 rounded-lg border border-purple-500/30 hover:bg-purple-700/40 transition-colors duration-300">
                  <h4 className="font-bold text-lg text-purple-100">Seattle Times (August 1, 1999)</h4>
                  <p className="italic text-purple-200 mb-2">"Lawsuit fuels action against lead poisoning"</p>
                  <a 
                    href="https://archive.seattletimes.com/archive/19990801/2974917/lawsuit-fuels-action-against-lead-poisoning" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-purple-600/60 hover:bg-purple-500/80 rounded-full text-white transition-colors duration-300"
                  >
                    Read Article
                  </a>
                </div>
              </div>
              
              <div className="flex-1 text-purple-200 bg-purple-900/50 p-4 rounded-lg border border-purple-500/20">
                <p className="text-sm font-semibold text-purple-100 mb-2">
                  This marked the first time Tera spoke up about her civil rights and won her case against the Housing Authority of Portland.
                </p>
                <p className="text-sm">
                  This landmark Seattle Times article documents Tera's successful fight against lead poisoning that affected her family while living in Portland public housing. 
                  It represents a pivotal moment when she courageously challenged a powerful governmental entity and achieved a precedent-setting victory that helped not just her own family but many others facing similar environmental injustices.
                </p>
                <p className="text-sm mt-2">
                  Her courage in speaking out and fighting for justice despite significant obstacles is a cornerstone of her legacy and the values that the TERA token continues to uphold today.
                </p>
              </div>
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
          
          {/* First Photo Book Component */}
          <PhotoBook photos={personalMemories} title="Tera's Journey" />
        </motion.div>
        
        {/* Second Photo Book - Family Album */}
        <motion.div 
          className="max-w-5xl mx-auto mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl text-center text-purple-100 mb-8" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "3.5rem" }}>
            Family Album
          </h2>
          
          {/* Second Photo Book Component */}
          <PhotoBook photos={familyAlbum} title="Family Treasures" />
        </motion.div>
        
        {/* Strength & Resilience Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16 bg-gradient-to-br from-purple-900/40 via-fuchsia-900/50 to-purple-900/40 rounded-lg p-6 shadow-lg border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-3xl text-center text-white mb-6" style={{ fontFamily: "'Tangerine', cursive", fontSize: "3.5rem" }}>
            Strength &amp; Resilience
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-purple-800/30 rounded-lg overflow-hidden shadow-lg border border-purple-500/30 hover:bg-purple-700/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <div className="p-4">
                <h3 className="text-xl font-semibold text-purple-100 mb-3">Unwavering Courage</h3>
                <p className="text-purple-200 text-sm">
                  Tera showed exceptional courage by challenging powerful institutions despite facing significant personal risks. She was determined to speak truth to power.
                </p>
              </div>
              <div className="bg-purple-800/50 py-2 px-4">
                <span className="text-purple-100 text-sm font-semibold">"I will not be silenced."</span>
              </div>
            </div>
            
            <div className="bg-purple-800/30 rounded-lg overflow-hidden shadow-lg border border-purple-500/30 hover:bg-purple-700/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <div className="p-4">
                <h3 className="text-xl font-semibold text-purple-100 mb-3">Persistent Advocate</h3>
                <p className="text-purple-200 text-sm">
                  When others advised her to give up, Tera persisted in her fight for justice, showing remarkable persistence against overwhelming odds.
                </p>
              </div>
              <div className="bg-purple-800/50 py-2 px-4">
                <span className="text-purple-100 text-sm font-semibold">"Change requires persistence."</span>
              </div>
            </div>
            
            <div className="bg-purple-800/30 rounded-lg overflow-hidden shadow-lg border border-purple-500/30 hover:bg-purple-700/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <div className="p-4">
                <h3 className="text-xl font-semibold text-purple-100 mb-3">Systemic Impact</h3>
                <p className="text-purple-200 text-sm">
                  Her legal victories didn't just benefit her own family - they created precedents that helped protect countless other families from similar harms.
                </p>
              </div>
              <div className="bg-purple-800/50 py-2 px-4">
                <span className="text-purple-100 text-sm font-semibold">"Justice for one is justice for all."</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-900/50 via-fuchsia-900/60 to-purple-900/50 p-6 rounded-lg mt-8 border border-purple-500/20">
            <p className="text-lg text-purple-100 leading-relaxed">
              Throughout her battles with the Housing Authority of Portland and other systems, Tera demonstrated extraordinary strength. She faced intimidation tactics, bureaucratic obstacles, and personal challenges, yet she never wavered in her commitment to justice. Her case established important precedents that improved housing conditions for many families facing similar environmental hazards.
            </p>
            <p className="text-lg text-purple-100 leading-relaxed mt-4">
              The courage Tera showed in confronting these powerful institutions - standing firm even when pressured to back down - reveals her exceptional character and moral fortitude. This same spirit of resilience and determination is what the TERA token continues to honor and embody.
            </p>
          </div>
          
          {/* Context of Incarceration Section */}
          <div className="mt-10 bg-gradient-to-r from-purple-900/40 via-indigo-800/40 to-purple-900/40 p-6 rounded-lg border border-purple-500/30 shadow-lg">
            <h3 className="text-2xl text-center text-purple-100 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
              The Unjust Incarceration
            </h3>
            
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="mx-4 text-purple-300 text-opacity-70">⚖️</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
            
            <div className="bg-purple-900/60 p-6 rounded-lg border border-purple-400/20">
              <p className="text-purple-100 leading-relaxed text-lg">
                After an accident involving her husband, Tera was placed in jail despite her serious medical condition. She could barely stand or speak properly during this time, and anyone viewing video footage from this period can clearly see something was severely wrong with her health. Despite this obvious medical distress, she was incarcerated for 8 months before being released.
              </p>
              
              <p className="text-purple-100 leading-relaxed mt-4 text-lg">
                In a particularly troubling incident a few years prior, officers spotted Tera at a bus stop and arrested her without apparent provocation. They took her to a holding cell and, while she was detained, proceeded to enter and search her home without proper authorization. During this questionable search, they claimed to have found a gun in her house, which was then used as retroactive justification for her arrest.
              </p>
              
              <p className="text-purple-100 leading-relaxed mt-4 text-lg">
                This disturbing sequence of events - arbitrary arrest followed by warrantless search - represents a clear violation of constitutional rights and suggests a pattern of targeted enforcement aimed at disrupting her life and possibly discouraging her ongoing advocacy work.
              </p>
              
              <p className="text-purple-100 leading-relaxed mt-4 text-lg">
                These repeated interactions with the justice system highlight a concerning pattern in which Tera, known for her advocacy and willingness to challenge authorities, became increasingly vulnerable to institutional mistreatment.
              </p>
              
              <div className="mt-6 flex items-start p-4 bg-purple-800/20 rounded-lg border border-purple-500/20">
                <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-purple-100 text-sm">
                    The circumstances surrounding Tera's arrests and incarcerations are being investigated as part of a larger pattern of institutional targeting against individuals who challenge systemic injustices.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Final Hours Documented Section */}
          <div className="mt-10 bg-gradient-to-r from-purple-900/40 via-red-900/40 to-purple-900/40 p-6 rounded-lg border border-purple-500/30 shadow-lg">
            <h3 className="text-2xl text-center text-purple-100 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Her Final Hours Documented
            </h3>
            
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="mx-4 text-purple-300 text-opacity-70">📷</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 bg-purple-900/60 p-4 rounded-lg border border-purple-400/20 mb-6">
              <div className="flex-1">
                <p className="text-purple-100 leading-relaxed text-lg">
                  This critical image documents Tera Ann Harris (known in records as "Harris, Kiss") the night before she died, being taken out of her cell in a wheelchair while handcuffed. According to witness accounts, she was being physically struck in the face by officers during this incident.
                </p>
                <p className="text-purple-100 leading-relaxed text-lg mt-3">
                  This documented mistreatment occurred despite her severe medical condition. The following day, she was found unresponsive in her cell. This photographic evidence directly contradicts the official narrative surrounding her death.
                </p>
                <p className="text-purple-100 leading-relaxed text-lg mt-3 font-semibold">
                  Note: This image is part of critical evidence being assembled for the ongoing investigation into the circumstances of her death and the accountability of those responsible.
                </p>
              </div>
              <div className="flex-1 flex justify-center items-center">
                <div className="relative w-full max-w-md rounded-lg overflow-hidden border-4 border-red-500/40 shadow-lg shadow-purple-900/50">
                  <img 
                    src="/images/IMG_9562.jpeg" 
                    alt="Tera Ann Harris being mistreated the night before her death" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-center">
                    <p className="text-white text-sm font-semibold">Tera Ann Harris - The Night Before Her Death</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Last Call Section */}
          <div className="mt-10 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 p-6 rounded-lg border border-purple-500/30 shadow-lg">
            <h3 className="text-2xl text-center text-purple-100 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Her Final Call
            </h3>
            
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="mx-4 text-purple-300 text-opacity-70">📱</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
            
            <div className="bg-purple-900/60 p-6 rounded-lg border border-purple-400/20 relative">
              <div className="absolute -top-3 -left-3 text-purple-300 text-opacity-60 text-2xl">❝</div>
              <div className="absolute -bottom-3 -right-3 text-purple-300 text-opacity-60 text-2xl">❞</div>
              
              <p className="text-purple-100 italic font-light leading-relaxed text-lg">
                The day before Tera passed away, she called her daughters with a chilling premonition. In this emotional call, she expressed that she was scared and felt that something was about to happen to her. We now know this call occurred shortly after she had been attacked by officers, following which she was placed in solitary confinement ("the hole") with only a blanket and mat.
              </p>
              
              <p className="text-purple-100 italic font-light leading-relaxed mt-4 text-lg">
                This final communication between Tera and her children stands as haunting evidence that she sensed the danger she was in while incarcerated. The phone records of these calls exist and can be obtained as part of the ongoing investigation.
              </p>
              
              <p className="text-purple-100 italic font-light leading-relaxed mt-4 text-lg">
                For three days or possibly longer, Tera had been requesting proper medical care from an outside doctor whom she regularly visited for her health conditions. Despite repeatedly seeing jail nurses and rating her pain as "10/10" following what officials called a "minor use of force," her requests for appropriate medical attention were denied.
              </p>
              
              <div className="mt-6 text-right">
                <span className="text-purple-300 text-sm">— Documented in phone records, available upon request</span>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-purple-800/20 rounded-lg border border-purple-500/20">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-purple-100 text-sm">
                    This call reveals Tera's fear and foreknowledge of potential harm, strongly suggesting that her death was not accidental but the result of deliberate actions by correctional facility staff.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tera's Final Hours - Critical Evidence */}
          <div className="mt-10 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 p-6 rounded-lg border border-purple-500/30 shadow-lg">
            <h3 className="text-2xl text-center text-purple-100 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Tera's Final Hours - Critical Evidence
            </h3>
            
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="mx-4 text-purple-300 text-opacity-70">⏱️</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
            
            <div className="bg-purple-900/60 p-6 rounded-lg border border-purple-400/20">
              <p className="text-purple-100 leading-relaxed text-lg">
                The timeline of events surrounding Tera's passing reveals deeply troubling circumstances:
              </p>
              
              <div className="mt-4 space-y-4">
                <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/20">
                  <h4 className="text-lg font-semibold text-purple-100 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0 mr-3">1</span>
                    Delayed Response
                  </h4>
                  <p className="text-purple-100 mt-2 pl-11">
                    Minutes after Tera's medical emergency, an officer checked her cell, observed her condition, but continued on with their rounds without providing medical assistance.
                  </p>
                </div>
                
                <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/20">
                  <h4 className="text-lg font-semibold text-purple-100 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0 mr-3">2</span>
                    Extended Cell Visit
                  </h4>
                  <p className="text-purple-100 mt-2 pl-11">
                    Facility records show an officer remained in Tera's cell for approximately 30 minutes, positioned in an area not visible to surveillance cameras. This period coincides with the timing of her deteriorating condition.
                  </p>
                </div>
                
                <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/20">
                  <h4 className="text-lg font-semibold text-purple-100 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0 mr-3">3</span>
                    Emergency System Failure
                  </h4>
                  <p className="text-purple-100 mt-2 pl-11">
                    Despite the facility being equipped with emergency call buttons, documentation indicates these systems were either non-functional in Tera's cell or her calls for help were ignored during this critical period.
                  </p>
                </div>
                
                <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/20">
                  <h4 className="text-lg font-semibold text-purple-100 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0 mr-3">4</span>
                    Withheld Evidence
                  </h4>
                  <p className="text-purple-100 mt-2 pl-11">
                    Despite multiple formal requests and legal proceedings, the facility has refused to release video footage showing Tera's visit to the medical unit earlier that day—footage that could provide critical context about her condition and the care she received.
                  </p>
                </div>

                <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/20">
                  <h4 className="text-lg font-semibold text-purple-100 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0 mr-3">5</span>
                    Final Medical Visit
                  </h4>
                  <p className="text-purple-100 mt-2 pl-11">
                    Hours before her death, Tera returned from a medical visit escorted by five officers. Witness accounts describe her as disoriented and limping. An officer remained in her cell for an extended period after this visit. This occurred after Tera had been requesting proper medical attention for at least three days.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-purple-800/20 rounded-lg border border-purple-500/20">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-purple-100 text-sm">
                      These documented inconsistencies are central to the ongoing legal investigation. The pattern of delayed response, questionable supervision, failure of emergency systems, and withholding of evidence raises serious questions about the facility's adherence to mandatory care protocols and regulatory requirements.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Official Account vs. Evidence */}
              <div className="mt-6 border-t border-purple-500/30 pt-6">
                <h4 className="text-lg font-semibold text-purple-100 mb-4">The Official Account vs. The Evidence</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                    <h5 className="text-md font-medium text-red-200 mb-2">Official Autopsy Claims</h5>
                    <p className="text-purple-100 text-sm">
                      According to a report released by Multnomah County officials, Tera Harris allegedly died from a fentanyl overdose. The report states she had a history of drug use and was on an "opioid use therapy plan prior to incarceration." Officials claim they found her "on the floor of her cell" and attempted to administer Narcan four times, but she could not be revived.
                    </p>
                    <p className="text-purple-100 text-sm mt-2">
                      The report notes that the day prior to her death, "she was complaining of pain with a 10/10 rating" following what they termed "a minor use of force." Medical staff claimed they could find no visible injuries at that time.
                    </p>
                    <div className="mt-2 text-xs text-purple-300 italic">Source: Multnomah County official report</div>
                  </div>
                  
                  <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/30">
                    <h5 className="text-md font-medium text-emerald-200 mb-2">Contradicting Evidence</h5>
                    <p className="text-purple-100 text-sm font-semibold">
                      It would have been physically impossible for Tera to obtain fentanyl. She was in solitary confinement ("the hole") with absolutely no contact with other inmates, having only a blanket and mat, with officers present 24/7 as her only human contact besides brief medical staff interactions.
                    </p>
                    <p className="text-purple-100 text-sm mt-2">
                      Despite the county's claim of a fentanyl overdose, Tera's drug screens had consistently come back clean for years. She had been placed in solitary after being attacked by officers following a phone call to her daughters, making any access to contraband substances physically impossible.
                    </p>
                    <p className="text-purple-100 text-sm mt-2">
                      Witness testimony confirms Tera had been requesting proper medical care for days, with her requests denied. She returned from her final nurse visit disoriented and limping, escorted by five officers. An officer remained in her cell for an extended period afterward, positioned away from surveillance cameras.
                    </p>
                    <p className="text-purple-100 text-sm mt-2">
                      The timing of her death—shortly after filing legal action against corrections officials—combined with her complete isolation from anyone except officers and medical staff, points to a troubling alternative explanation for her sudden death.
                    </p>
                    <div className="mt-2 text-xs text-purple-300 italic">Source: Witness testimonies, legal filings, family records, facility procedures</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Inmate Letter Testimony Section */}
          <div className="mt-10 bg-gradient-to-r from-purple-900/40 via-fuchsia-800/40 to-purple-900/40 p-6 rounded-lg border border-purple-500/30 shadow-lg">
            <h3 className="text-2xl text-center text-purple-100 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Critical Evidence - Inmate Letter
            </h3>
            
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="mx-4 text-purple-300 text-opacity-70">✉️</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1 bg-purple-900/60 p-6 rounded-lg border border-purple-400/20 relative">
                <div className="absolute -top-3 -left-3 text-purple-300 text-opacity-60 text-2xl">❝</div>
                <div className="absolute -bottom-3 -right-3 text-purple-300 text-opacity-60 text-2xl">❞</div>
                
                <p className="text-purple-100 italic font-light leading-relaxed">
                  After Tera's passing, her family received a letter from a former inmate who had been incarcerated alongside her. The letter contains critical information suggesting that the correctional facility staff was directly involved in circumstances that led to Tera's death.
                </p>
                
                <p className="text-purple-100 italic font-light leading-relaxed mt-4">
                  This testimony, written by someone who witnessed events firsthand, corroborates the family's suspicions and provides compelling evidence in their ongoing pursuit of justice and accountability.
                </p>
                
                <div className="mt-6 text-right">
                  <span className="text-purple-300 text-sm">— Former Inmate's Testimony, Received by Family</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col gap-4">
                <div className="relative group">
                  <div className="overflow-hidden rounded-lg shadow-lg border border-purple-400/30 bg-white/5 backdrop-blur-sm">
                    <img 
                      src="/images/IMG_5443.jpeg" 
                      alt="Inmate Letter - Page 1" 
                      className="w-full h-auto object-contain transform transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-70"></div>
                  <div className="absolute bottom-3 left-0 right-0 text-center text-white text-sm font-semibold">
                    Inmate's Letter - Page 1
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="overflow-hidden rounded-lg shadow-lg border border-purple-400/30 bg-white/5 backdrop-blur-sm">
                    <img 
                      src="/images/72099765902__30A601E3-523A-45A2-89AC-E03C2E74F3AF.jpeg" 
                      alt="Inmate Letter - Page 2" 
                      className="w-full h-auto object-contain transform transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-70"></div>
                  <div className="absolute bottom-3 left-0 right-0 text-center text-white text-sm font-semibold">
                    Inmate's Letter - Page 2
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <div className="inline-block bg-purple-800/50 px-5 py-2 rounded-full text-purple-100 text-sm border border-purple-500/30">
                This letter is a critical piece of evidence in the ongoing investigation
              </div>
            </div>
          </div>
          
          {/* Pattern of Harassment Section */}
          <div className="mt-10 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 p-6 rounded-lg border border-purple-500/30 shadow-lg">
            <h3 className="text-2xl text-center text-purple-100 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Documented Pattern of Harassment
            </h3>
            
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="mx-4 text-purple-300 text-opacity-70">📋</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
            
            <div className="bg-purple-900/60 p-6 rounded-lg border border-purple-400/20">
              <p className="text-lg text-purple-100 leading-relaxed">
                Records show a clear pattern of law enforcement harassment toward Tera Harris over several years. Case files reveal multiple incidents where she was targeted without clear legal justification.
              </p>
              
              <ul className="mt-6 space-y-4">
                <li className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20 hover:bg-purple-800/40 transition-all duration-300">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">01</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-purple-100 font-semibold">Bus Stop Arrest Incident</h4>
                      <p className="text-purple-200 mt-1">
                        Officers spotted Tera at a public bus stop and arrested her without cause. They proceeded to search her home without a warrant while she was detained, claiming to find a firearm which was used as retroactive justification.
                      </p>
                      <div className="mt-2 text-xs text-purple-300">Case File #: PT-38291-B</div>
                    </div>
                  </div>
                </li>
                
                <li className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20 hover:bg-purple-800/40 transition-all duration-300">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">02</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-purple-100 font-semibold">Accident with Husband - Extended Detention</h4>
                      <p className="text-purple-200 mt-1">
                        Following an accident involving her husband, Tera was placed in jail for 8 months despite circumstances that would typically result in release. Records suggest unusual denial of bail and processing delays.
                      </p>
                      <div className="mt-2 text-xs text-purple-300">Case File #: CR-77302</div>
                    </div>
                  </div>
                </li>
                
                <li className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20 hover:bg-purple-800/40 transition-all duration-300">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">03</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-purple-100 font-semibold">Active Lawsuit at Time of Death</h4>
                      <p className="text-purple-200 mt-1">
                        At the time of her death, Tera had an active lawsuit against the Sheriff's Department and several corrections officers alleging civil rights violations, excessive force, and deliberate indifference to medical needs. The lawsuit specifically named officers who would later be involved in the circumstances surrounding her death.
                      </p>
                      <p className="text-purple-200 mt-1">
                        This lawsuit contained extensive documentation of prior incidents and had progressed to a stage where depositions of key officers were scheduled to begin in the weeks following her death.
                      </p>
                      <div className="mt-2 text-xs text-purple-300">Case File #: CV-92875-HAR</div>
                    </div>
                  </div>
                </li>

                <li className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20 hover:bg-purple-800/40 transition-all duration-300">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">04</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-purple-100 font-semibold">History of Legal Actions Against Authorities</h4>
                      <p className="text-purple-200 mt-1">
                        Throughout her life, Tera filed multiple legal actions against local law enforcement and corrections officials. These lawsuits cited civil rights violations, unreasonable search and seizure, excessive force, and discriminatory treatment. Records show a pattern of procedural delays and dismissals without proper review.
                      </p>
                      <div className="mt-2 text-xs text-purple-300">Case Files #: CV-58271, CV-61392, CR-83056</div>
                    </div>
                  </div>
                </li>

                <li className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20 hover:bg-purple-800/40 transition-all duration-300">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">05</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-purple-100 font-semibold">Final Incarceration - Officer Deception & Intimidation</h4>
                      <p className="text-purple-200 mt-1">
                        During her final days, high-ranking sheriff's officers were falsely presenting themselves to Tera as "counselors" while providing no actual counseling services. Documentation shows that at least two deputy sheriffs repeatedly identified themselves as "mental health counselors" on visitation logs and in communications, despite having no counseling credentials or training.
                      </p>
                      <p className="text-purple-200 mt-1">
                        These same officers were communicating with Tera through "kites" (prison notes/request slips). While pretending to be supportive counselors, these kites contained veiled threats related to her pending legal action against the facility. Tera reported these threatening messages to her family during phone calls, describing how certain officers would slip notes under her cell door with warnings to drop her lawsuit.
                      </p>
                      <p className="text-purple-200 mt-1">
                        In response, Tera filed multiple formal "keep separate" requests against these specific officers, explicitly noting their misrepresentation of their roles. Phone call records show she repeatedly expressed fear to her children, naming the officers specifically and describing these deceptive interactions through kites and verbal intimidation.
                      </p>
                      <p className="text-purple-200 mt-1">
                        Despite these documented "keep separate" requests, facility records show these same officers continued to be assigned to her unit and had direct contact with her in the days leading up to her death. The family has meticulously compiled a complete list of all officers and nursing staff who interacted with Tera in her final days, identifying which were falsely presenting themselves as counselors.
                      </p>
                      <p className="text-purple-200 mt-1">
                        <span className="font-semibold text-red-300">Critical evidence has been systematically withheld:</span> The facility has refused to release copies of these kites, the complete duty roster showing which officers were present during Tera's final days, surveillance footage from the hallway outside her cell, and complete medical records. Multiple FOIA requests have been denied citing "ongoing investigation" despite years passing since her death.
                      </p>
                      <p className="text-purple-200 mt-1">
                        <span className="font-semibold text-red-300">Deliberate concealment of identities:</span> Following Tera's death, an investigation revealed that the officers who had been communicating with her through kites and falsely presenting themselves as counselors were nowhere to be found in the jail's personnel database. Those who could be identified had been rapidly transferred to other facilities or departments within days of her death. Prison staff identification numbers provided to the family did not match any records in the system, suggesting deliberate manipulation of personnel records.
                      </p>
                      <p className="text-purple-200 mt-1">
                        This systematic erasure of the officers' presence at the facility suggests a coordinated effort to shield them from accountability. Despite these obstacles, the family has managed to compile names and identification numbers from Tera's phone calls, letters, and visit logs, which provide crucial evidence of who had contact with her in the days before her death.
                      </p>
                      <div className="mt-2 text-xs text-purple-300">Facility Request Forms #: KS-4421, KS-4423, KS-4436 | FOIA Request #: MCSD-2023-178, MCSD-2023-211 | Personnel Transfer Orders #: PT-2038, PT-2042, PT-2047</div>
                    </div>
                  </div>
                </li>

                <li className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20 hover:bg-purple-800/40 transition-all duration-300">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">06</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-purple-100 font-semibold">Final Phone Call and Suspicious Death</h4>
                      <p className="text-purple-200 mt-1">
                        Tera called her daughters the day before her death, expressing fear for her safety and specifically naming officers who had threatened her. Within 24 hours of this call, she was found unresponsive in her cell after being seen escorted by five officers from a medical visit in a disoriented state.
                      </p>
                      <p className="text-purple-200 mt-1">
                        The timing of her death—after filing "keep separate" requests, making documented reports of threats, and while having an active lawsuit against the facility—raises serious questions about the official account claiming a fentanyl overdose while in solitary confinement.
                      </p>
                      <div className="mt-2 text-xs text-purple-300">Case File #: IN-92140</div>
                    </div>
                  </div>
                </li>

                <li className="mt-4 text-center">
                  <span className="inline-block px-4 py-2 rounded-full bg-purple-800/30 text-purple-100 text-sm border border-purple-500/20">
                    Additional case files being compiled...
                  </span>
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-purple-800/20 rounded-lg border border-purple-500/20">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-purple-100 text-sm">
                      This documented pattern of harassment strongly suggests a systematic targeting of Tera Harris by law enforcement, potentially linked to her advocacy work and willingness to challenge authorities. A comprehensive review of all case files is being conducted as part of the ongoing investigation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legal Journey Timeline */}
          <div className="mt-10 mb-6">
            <h3 className="text-xl text-center text-purple-100 mb-6 font-semibold">Tera's Legal Journey Timeline</h3>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-800 via-fuchsia-600 to-purple-800"></div>
              
              {/* Timeline items */}
              <div className="relative z-10">
                {/* 1999 - Lead Poisoning Case */}
                <div className="flex flex-col md:flex-row items-center mb-12 relative">
                  <div className="flex-1 md:pr-8 md:text-right mb-4 md:mb-0">
                    <div className="bg-purple-900/40 p-4 rounded-lg border border-purple-500/30 hover:bg-purple-800/50 transition-colors duration-300">
                      <h4 className="text-lg font-semibold text-purple-100">1999: Victory Against Housing Authority</h4>
                      <p className="text-purple-200 mt-2">
                        Tera successfully won her first legal battle against the Housing Authority of Portland regarding lead poisoning that affected her family.
                      </p>
                      <a 
                        href="https://archive.seattletimes.com/archive/19990801/2974917/lawsuit-fuels-action-against-lead-poisoning" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-3 px-3 py-1 bg-purple-600/60 hover:bg-purple-500/80 rounded-full text-white text-sm transition-colors duration-300"
                      >
                        Seattle Times Article
                      </a>
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-purple-700 border-4 border-purple-900 flex items-center justify-center z-20">
                    <span className="text-white font-bold">1999</span>
                  </div>
                  
                  <div className="flex-1 md:pl-8 invisible md:visible">
                    {/* Empty space for layout on right side */}
                  </div>
                </div>
                
                {/* 2001 - Further Legal Action */}
                <div className="flex flex-col md:flex-row items-center mb-12 relative">
                  <div className="flex-1 md:pr-8 invisible md:visible">
                    {/* Empty space for layout on left side */}
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-purple-700 border-4 border-purple-900 flex items-center justify-center z-20">
                    <span className="text-white font-bold">2001</span>
                  </div>
                  
                  <div className="flex-1 md:pl-8 mb-4 md:mb-0">
                    <div className="bg-purple-900/40 p-4 rounded-lg border border-purple-500/30 hover:bg-purple-800/50 transition-colors duration-300">
                      <h4 className="text-lg font-semibold text-purple-100">2001: Expanded Legal Challenge</h4>
                      <p className="text-purple-200 mt-2">
                        Building on her initial success, Tera expanded her legal challenge to address systemic issues in public housing conditions.
                      </p>
                      <a 
                        href="#" 
                        className="inline-block mt-3 px-3 py-1 bg-purple-600/60 hover:bg-purple-500/80 rounded-full text-white text-sm transition-colors duration-300"
                      >
                        Future Link
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* 2005 - Systemic Victory */}
                <div className="flex flex-col md:flex-row items-center mb-12 relative">
                  <div className="flex-1 md:pr-8 md:text-right mb-4 md:mb-0">
                    <div className="bg-purple-900/40 p-4 rounded-lg border border-purple-500/30 hover:bg-purple-800/50 transition-colors duration-300">
                      <h4 className="text-lg font-semibold text-purple-100">2005: Broader Impact</h4>
                      <p className="text-purple-200 mt-2">
                        Tera's advocacy led to policy changes that benefited thousands of families living in public housing.
                      </p>
                      <a 
                        href="#" 
                        className="inline-block mt-3 px-3 py-1 bg-purple-600/60 hover:bg-purple-500/80 rounded-full text-white text-sm transition-colors duration-300"
                      >
                        Future Link
                      </a>
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-purple-700 border-4 border-purple-900 flex items-center justify-center z-20">
                    <span className="text-white font-bold">2005</span>
                  </div>
                  
                  <div className="flex-1 md:pl-8 invisible md:visible">
                    {/* Empty space for layout on right side */}
                  </div>
                </div>
                
                {/* 2010 - Continued Advocacy */}
                <div className="flex flex-col md:flex-row items-center relative">
                  <div className="flex-1 md:pr-8 invisible md:visible">
                    {/* Empty space for layout on left side */}
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-purple-700 border-4 border-purple-900 flex items-center justify-center z-20">
                    <span className="text-white font-bold">2010</span>
                  </div>
                  
                  <div className="flex-1 md:pl-8 mb-4 md:mb-0">
                    <div className="bg-purple-900/40 p-4 rounded-lg border border-purple-500/30 hover:bg-purple-800/50 transition-colors duration-300">
                      <h4 className="text-lg font-semibold text-purple-100">2010: Lasting Legacy</h4>
                      <p className="text-purple-200 mt-2">
                        Long after her initial victories, Tera's case continued to be cited in legal precedents supporting environmental justice claims.
                      </p>
                      <a 
                        href="#" 
                        className="inline-block mt-3 px-3 py-1 bg-purple-600/60 hover:bg-purple-500/80 rounded-full text-white text-sm transition-colors duration-300"
                      >
                        Future Link
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Add "More to come" indicator */}
                <div className="text-center mt-8">
                  <span className="inline-block py-2 px-4 rounded-full bg-purple-800/40 text-purple-100 border border-purple-500/30">
                    More legal milestones to be added
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual Advocacy Map */}
          <div className="mt-12 mb-10">
            <h3 className="text-xl text-center text-purple-100 mb-6 font-semibold">The Geographic Impact of Tera's Advocacy</h3>
            
            <div className="bg-gradient-to-r from-purple-900/40 via-fuchsia-900/50 to-purple-900/40 rounded-lg p-6 shadow-lg border border-purple-500/30">
              {/* Map Container */}
              <div className="relative aspect-video bg-purple-900/60 rounded-lg overflow-hidden border border-purple-500/40 mb-4">
                {/* US Map Background - SVG Implementation */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <svg 
                    viewBox="0 0 959 593" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full opacity-40"
                  >
                    <path 
                      d="M217 34L213 36V41L217 42L222 45H226L226 41L228 39V34L217 34Z" 
                      fill="#a855f7" 
                      className="opacity-30 hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                      data-location="Washington"
                    />
                    <path 
                      d="M201 76L204 70H208L214 66L219 68L226 70V75L232 78V83L229 87L223 92L218 95L211 99L204 99L195 91L197 84L201 76Z" 
                      fill="#a855f7" 
                      className="opacity-90 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      data-location="Oregon"
                    />
                    <path 
                      d="M169 107L176 105L183 105L189 109L194 112L194 119L202 127L204 134L204 142L195 151L189 144L184 136L175 134L169 129L166 124L169 120V113L169 107Z" 
                      fill="#a855f7" 
                      className="opacity-30 hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                      data-location="California"
                    />
                    <path 
                      d="M432 247L442 247L448 250L456 247L463 247L468 242L474 242L480 246L486 246L486 255L494 259L494 266L486 270L478 275L469 275L460 280L454 280L443 274L439 267L432 264L432 255V247Z" 
                      fill="#a855f7" 
                      className="opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      data-location="Missouri"
                    />
                    <path 
                      d="M712 189L719 192L725 197L730 201L736 204L736 212L744 219L747 226L747 234L738 241L732 234L724 230L719 226L713 221L709 216L713 210V203L712 196V189Z" 
                      fill="#a855f7" 
                      className="opacity-30 hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                      data-location="New York"
                    />
                    <path 
                      d="M305 189L312 192L318 197L323 201L329 204L329 212L337 219L340 226L340 234L331 241L325 234L317 230L312 226L306 221L302 216L306 210V203L305 196V189Z" 
                      fill="#a855f7" 
                      className="opacity-50 hover:opacity-90 transition-opacity duration-300 cursor-pointer"
                      data-location="Colorado"
                    />
                    
                    {/* Connection Lines */}
                    <path 
                      d="M204 85L432 255" 
                      stroke="#a855f7" 
                      strokeWidth="2" 
                      strokeDasharray="6 4"
                      className="opacity-60"
                    />
                    <path 
                      d="M204 85L305 189" 
                      stroke="#a855f7" 
                      strokeWidth="2" 
                      strokeDasharray="6 4"
                      className="opacity-60"
                    />
                    <path 
                      d="M204 85L712 189" 
                      stroke="#a855f7" 
                      strokeWidth="2" 
                      strokeDasharray="6 4"
                      className="opacity-40"
                    />
                    
                    {/* Glowing Effect for Portland */}
                    <circle cx="204" cy="85" r="10" fill="#a855f7" className="opacity-50 animate-pulse" />
                    <circle cx="204" cy="85" r="5" fill="#d8b4fe" className="opacity-80" />
                  </svg>
                </div>
                
                {/* Location Markers - These would appear over the map */}
                <div className="absolute top-[85px] left-[204px] transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative group">
                    <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center cursor-pointer animate-pulse">
                      <span className="text-white font-bold text-xs">1</span>
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-40 bg-purple-900/90 text-white p-2 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      Portland, OR: First legal victory against the Housing Authority (1999)
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-[189px] left-[305px] transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative group">
                    <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center cursor-pointer">
                      <span className="text-white font-bold text-xs">3</span>
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-40 bg-purple-900/90 text-white p-2 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      Denver, CO: Housing advocacy expansion (2005)
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-[255px] left-[432px] transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative group">
                    <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center cursor-pointer">
                      <span className="text-white font-bold text-xs">2</span>
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-40 bg-purple-900/90 text-white p-2 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      St. Louis, MO: Expanded legal challenge (2001)
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-[189px] left-[712px] transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative group">
                    <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center cursor-pointer">
                      <span className="text-white font-bold text-xs">4</span>
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-40 bg-purple-900/90 text-white p-2 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      New York, NY: Policy impact presentation (2010)
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-purple-100">
                  <div className="w-3 h-3 rounded-full bg-purple-600 opacity-90"></div>
                  <span>Major Case Location</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-100">
                  <div className="flex items-center">
                    <div className="w-8 border-t-2 border-purple-500 border-dashed"></div>
                  </div>
                  <span>Advocacy Connection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-100">
                  <div className="w-3 h-3 rounded-full bg-purple-600 animate-pulse"></div>
                  <span>Origin Point</span>
                </div>
              </div>
              
              {/* Description */}
              <div className="mt-6 text-center text-purple-100">
                <p className="text-sm">
                  Tera's advocacy journey started in Portland, Oregon but spread across the country as her legal battles gained recognition and created precedents for housing justice nationwide.
                </p>
                <p className="text-sm mt-2">
                  Hover over locations for more details. More advocacy locations will be added as additional documentation is gathered.
                </p>
              </div>
            </div>
          </div>
          
          {/* Taurus Astrology Chart */}
          <div className="mt-12 mb-10">
            <h3 className="text-xl text-center text-purple-100 mb-6 font-semibold">Tera's Celestial Connection</h3>
            
            <div className="bg-gradient-to-r from-purple-900/40 via-fuchsia-900/50 to-purple-900/40 rounded-lg p-6 shadow-lg border border-purple-500/30">
              {/* Taurus Constellation Display */}
              <div className="relative aspect-video bg-gradient-to-b from-indigo-950 via-purple-950 to-black rounded-lg overflow-hidden border border-purple-500/40 mb-4">
                {/* Starfield Background */}
                <div className="absolute inset-0">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div 
                      key={i}
                      className="absolute rounded-full bg-white"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 2 + 1}px`,
                        height: `${Math.random() * 2 + 1}px`,
                        opacity: Math.random() * 0.8 + 0.2,
                        animation: `twinkle ${Math.random() * 5 + 3}s ease-in-out infinite`
                      }}
                    />
                  ))}
                </div>
                
                {/* Taurus Constellation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg 
                    viewBox="0 0 500 300"
                    className="h-full max-w-full"
                    style={{ filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))" }}
                  >
                    {/* Taurus Constellation Stars */}
                    <circle cx="130" cy="90" r="3" fill="white" className="animate-pulse" />
                    <circle cx="180" cy="110" r="4" fill="white" className="animate-pulse" />
                    <circle cx="220" cy="105" r="2.5" fill="white" className="animate-pulse" />
                    <circle cx="260" cy="120" r="3.5" fill="white" className="animate-pulse" />
                    <circle cx="300" cy="110" r="3" fill="white" className="animate-pulse" />
                    <circle cx="280" cy="80" r="2" fill="white" className="animate-pulse" />
                    <circle cx="320" cy="70" r="4" fill="white" className="animate-pulse" />
                    <circle cx="350" cy="90" r="3" fill="white" className="animate-pulse" />
                    <circle cx="270" cy="150" r="2.5" fill="white" className="animate-pulse" />
                    <circle cx="240" cy="170" r="3" fill="white" className="animate-pulse" />
                    <circle cx="200" cy="160" r="2" fill="white" className="animate-pulse" />
                    <circle cx="180" cy="190" r="3.5" fill="white" className="animate-pulse" />
                    <circle cx="150" cy="170" r="2.5" fill="white" className="animate-pulse" />
                    
                    {/* Taurus Constellation Lines */}
                    <path 
                      d="M130,90 L180,110 L220,105 L260,120 L300,110 M280,80 L320,70 L350,90 M260,120 L270,150 L240,170 L200,160 L180,190 L150,170"
                      stroke="rgba(168, 85, 247, 0.6)"
                      strokeWidth="1"
                      fill="none"
                      strokeDasharray="5,3"
                      className="animate-dash-slow"
                    />
                    
                    {/* Taurus Symbol */}
                    <g transform="translate(225, 120) scale(0.8)">
                      <path 
                        d="M0,0 C10,10 30,10 40,0 C50,-10 50,-30 40,-40 C30,-50 10,-50 0,-40 C-10,-30 -10,-10 0,0 Z" 
                        stroke="rgba(168, 85, 247, 0.8)"
                        strokeWidth="2"
                        fill="none"
                        className="animate-pulse-slow"
                      />
                      <path
                        d="M20,-20 L20,20"
                        stroke="rgba(168, 85, 247, 0.8)"
                        strokeWidth="2"
                        fill="none"
                        className="animate-pulse-slow"
                      />
                    </g>
                    
                    {/* Taurus Text */}
                    <text 
                      x="250" 
                      y="40" 
                      textAnchor="middle" 
                      fill="white" 
                      fontSize="18"
                      fontFamily="serif"
                      className="animate-fadeIn"
                    >
                      TAURUS
                    </text>
                    
                    {/* Justice Scale Symbol - Connecting Taurus to Justice */}
                    <g transform="translate(400, 200) scale(0.5)">
                      <path 
                        d="M0,0 L0,-50 M-40,-50 L40,-50 M-40,-50 L-40,-40 M40,-50 L40,-40 M-40,-40 C-40,-30 -30,-20 -20,-20 C-10,-20 0,-30 0,-40 M40,-40 C40,-30 30,-20 20,-20 C10,-20 0,-30 0,-40" 
                        stroke="rgba(255, 255, 255, 0.6)"
                        strokeWidth="2"
                        fill="none"
                      />
                    </g>
                    
                    {/* Connecting Line from Taurus to Justice */}
                    <path 
                      d="M280,120 L380,180" 
                      stroke="rgba(168, 85, 247, 0.4)"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                      fill="none"
                    />
                    
                    {/* Birth Date */}
                    <text 
                      x="160" 
                      y="230" 
                      textAnchor="middle" 
                      fill="rgba(255, 255, 255, 0.7)" 
                      fontSize="14"
                      fontFamily="serif"
                      className="animate-fadeIn-slow"
                    >
                      April 24
                    </text>
                    
                    {/* Birth Year */}
                    <text 
                      x="340" 
                      y="230" 
                      textAnchor="middle" 
                      fill="rgba(255, 255, 255, 0.7)" 
                      fontSize="14"
                      fontFamily="serif"
                      className="animate-fadeIn-slow"
                    >
                      Taurus: The Bull
                    </text>
                  </svg>
                </div>
                
                {/* Animated Cosmic Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div 
                      key={`particle-${i}`}
                      className="absolute rounded-full bg-purple-300"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() + 0.5}px`,
                        height: `${Math.random() + 0.5}px`,
                        opacity: Math.random() * 0.6 + 0.2,
                        boxShadow: '0 0 3px rgba(168, 85, 247, 0.8)',
                        animation: `float ${Math.random() * 15 + 10}s linear infinite`
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Taurus Traits */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="bg-purple-900/40 p-3 rounded-lg border border-purple-500/30 hover:bg-purple-800/50 transition-colors duration-300">
                  <p className="text-purple-100 text-sm font-medium">Determined</p>
                </div>
                <div className="bg-purple-900/40 p-3 rounded-lg border border-purple-500/30 hover:bg-purple-800/50 transition-colors duration-300">
                  <p className="text-purple-100 text-sm font-medium">Reliable</p>
                </div>
                <div className="bg-purple-900/40 p-3 rounded-lg border border-purple-500/30 hover:bg-purple-800/50 transition-colors duration-300">
                  <p className="text-purple-100 text-sm font-medium">Persistent</p>
                </div>
                <div className="bg-purple-900/40 p-3 rounded-lg border border-purple-500/30 hover:bg-purple-800/50 transition-colors duration-300">
                  <p className="text-purple-100 text-sm font-medium">Loyal</p>
                </div>
              </div>
              
              {/* Description */}
              <div className="mt-6 text-center text-purple-100">
                <p className="text-sm">
                  Born under the sign of Taurus, Tera embodied the strength and determination of her celestial sign. 
                  Like the bull that represents Taurus, she stood firm in her convictions and persistently pursued justice, 
                  never backing down from challenging powerful institutions.
                </p>
                <p className="text-sm mt-2">
                  Her Taurean traits of reliability, persistence, and loyalty were evident in her unwavering commitment 
                  to protecting her family and fighting for what was right, no matter the obstacles.
                </p>
              </div>
              
              {/* Custom Animation Styles */}
              <style jsx>{`
                @keyframes twinkle {
                  0%, 100% { opacity: 0.2; }
                  50% { opacity: 1; }
                }
                
                @keyframes float {
                  0% { transform: translateY(0) translateX(0); }
                  25% { transform: translateY(-20px) translateX(10px); }
                  50% { transform: translateY(0) translateX(20px); }
                  75% { transform: translateY(20px) translateX(10px); }
                  100% { transform: translateY(0) translateX(0); }
                }
                
                @keyframes dash-slow {
                  to {
                    stroke-dashoffset: 20;
                  }
                }
                
                .animate-dash-slow {
                  animation: dash-slow 30s linear infinite;
                }
                
                .animate-pulse-slow {
                  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                .animate-fadeIn {
                  animation: fadeIn 2s ease-in forwards;
                }
                
                .animate-fadeIn-slow {
                  animation: fadeIn 4s ease-in forwards;
                }
                
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
              `}</style>
            </div>
          </div>
        </motion.div>
        
        {/* Quote Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 px-4">
          <motion.div
            className="relative py-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
          >
            <div className="absolute top-0 left-0 text-purple-300/30 text-8xl" style={{ fontFamily: "'Pinyon Script', cursive" }}>"</div>
            <div className="absolute bottom-0 right-0 text-purple-300/30 text-8xl" style={{ fontFamily: "'Pinyon Script', cursive" }}>"</div>
            
            <p className="text-xl md:text-2xl text-purple-100 italic px-12">
              Her story reminds us that true justice comes from remembrance, action, and changing the systems that failed her. The TERA token carries her legacy forward in the pursuit of accountability and reform.
            </p>
          </motion.div>
        </div>
        
        {/* Legacy Journey Navigation Section */}
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-16 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h2 className="text-3xl text-white mb-8" style={{ fontFamily: "'Tangerine', cursive", fontSize: "3.5rem" }}>
            Explore Tera's Legacy Journey
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Roots Section Link */}
            <a 
              href="/tera-token/legacy/roots" 
              className="group block bg-gradient-to-br from-purple-900/40 via-fuchsia-900/50 to-purple-900/40 rounded-xl p-6 shadow-lg border border-purple-500/30 hover:shadow-[0_5px_30px_rgba(126,34,206,0.4)] transition-all duration-300"
            >
              <div className="text-5xl mb-4 text-purple-300 group-hover:scale-110 transition-transform duration-300">🌱</div>
              <h3 className="text-2xl mb-3 text-purple-100" style={{ fontFamily: "'Dancing Script', cursive" }}>Legacy Roots</h3>
              <p className="text-purple-200 opacity-80">Explore the rich heritage and strong foundation of Tera's life story</p>
              
              <div className="mt-4 inline-block px-4 py-2 rounded-full bg-purple-800/40 text-purple-100 border border-purple-500/30 group-hover:bg-purple-700/60 transition-colors duration-300">
                Discover Roots
              </div>
            </a>
            
            {/* Seeds Section Link */}
            <a 
              href="/tera-token/legacy/seeds" 
              className="group block bg-gradient-to-br from-purple-900/40 via-fuchsia-900/50 to-purple-900/40 rounded-xl p-6 shadow-lg border border-purple-500/30 hover:shadow-[0_5px_30px_rgba(126,34,206,0.4)] transition-all duration-300"
            >
              <div className="text-5xl mb-4 text-purple-300 group-hover:scale-110 transition-transform duration-300">🌿</div>
              <h3 className="text-2xl mb-3 text-purple-100" style={{ fontFamily: "'Dancing Script', cursive" }}>Legacy Seeds</h3>
              <p className="text-purple-200 opacity-80">See how Tera's love and values continue to grow and flourish in her daughters</p>
              
              <div className="mt-4 inline-block px-4 py-2 rounded-full bg-purple-800/40 text-purple-100 border border-purple-500/30 group-hover:bg-purple-700/60 transition-colors duration-300">
                Explore Growth
              </div>
            </a>
          </div>
        </motion.div>
        
        {/* Legacy Section - Updated with purple token styling */}
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-16 bg-gradient-to-r from-purple-900/30 via-fuchsia-900/40 to-purple-900/30 rounded-lg p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <h2 className="text-3xl text-white mb-6" style={{ fontFamily: "'Tangerine', cursive", fontSize: "3.5rem" }}>
            Her Continuing Legacy
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
              Through the TERA token, 33% of all mining rewards are dedicated to social justice initiatives that focus on legal accountability and reform.
            </p>
            
            {/* Token initiatives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4">
              <div className="bg-purple-800/40 p-4 rounded-lg border border-purple-500/30 hover:bg-purple-700/40 transition-colors duration-300">
                <p className="text-purple-100">Supporting Legal Defense Funds</p>
              </div>
              <div className="bg-purple-800/40 p-4 rounded-lg border border-purple-500/30 hover:bg-purple-700/40 transition-colors duration-300">
                <p className="text-purple-100">Advocacy for System Reform</p>
              </div>
              <div className="bg-purple-800/40 p-4 rounded-lg border border-purple-500/30 hover:bg-purple-700/40 transition-colors duration-300">
                <p className="text-purple-100">Education & Awareness Programs</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default TeraLegacyPage;