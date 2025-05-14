import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Pause, Search, FileText, AlertCircle, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import "@/styles/welcome-animations.css";

// Define global variables to track audio state
let globalAudioInitialized = false;
let currentAudio: HTMLAudioElement | null = null;
let heartbeatAudio: HTMLAudioElement | null = null;
let flatlineAudio: HTMLAudioElement | null = null;
let voiceClipAudio: HTMLAudioElement | null = null;
let stayDownAudio: HTMLAudioElement | null = null;

// Create Web Audio API context for generating sounds if needed
let audioContext: AudioContext | null = null;

// Function to create a heartbeat sound (if file not available)
const createHeartbeatSound = () => {
  if (!audioContext) audioContext = new AudioContext();
  
  // Create oscillator for the "lub" sound
  const oscillator1 = audioContext.createOscillator();
  oscillator1.type = "sine";
  oscillator1.frequency.value = 60; // Low frequency for heartbeat
  
  // Create gain node for volume control
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0;
  
  // Connect nodes
  oscillator1.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Schedule the heartbeat pattern
  const now = audioContext.currentTime;
  
  // First beat (lub)
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(1, now + 0.05);
  gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
  
  // Second beat (dub) - slightly quieter
  gainNode.gain.linearRampToValueAtTime(0.7, now + 0.4);
  gainNode.gain.linearRampToValueAtTime(0, now + 0.6);
  
  // Start and stop oscillator
  oscillator1.start(now);
  oscillator1.stop(now + 1);
  
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), 1000);
  });
};

// Function to create a flatline sound (if file not available)
const createFlatlineSound = () => {
  if (!audioContext) audioContext = new AudioContext();
  
  // Create oscillator for the flatline beep
  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = 1000; // High frequency for the beep
  
  // Create gain node for volume control
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0;
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Schedule the flatline pattern (continuous beep)
  const now = audioContext.currentTime;
  
  // Single long beep
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.7, now + 0.05);
  gainNode.gain.linearRampToValueAtTime(0.7, now + 2.95);
  gainNode.gain.linearRampToValueAtTime(0, now + 3);
  
  // Start and stop oscillator
  oscillator.start(now);
  oscillator.stop(now + 3);
  
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), 3000);
  });
};

export default function WelcomePage() {
  const [, navigate] = useLocation();
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Now starting at 0 for case file scanning page
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioSequencePhase, setAudioSequencePhase] = useState(0); // 0=none, 1=heartbeat, 2=flatline, 3=voice, 4=deep, 5=staydown
  const [caseFileFound, setCaseFileFound] = useState(false); // For case file scanning animation
  const [scanningComplete, setScanningComplete] = useState(false); // For case file scanning completion
  
  // Audio system initialization disabled as requested
  useEffect(() => {
    // Skip audio initialization - set the flag to true to prevent audio from playing
    globalAudioInitialized = true;
    
    // Return empty cleanup function
    return () => {};
  }, []);
  
  // Audio sequence disabled as requested
  useEffect(() => {
    // Do nothing - all audio disabled
    return () => {};
  }, [currentPage]);
  
  // Volume control effect - disabled
  useEffect(() => {
    // Do nothing - audio disabled
    return () => {};
  }, [volume]);
  
  // Toggle play/pause - disabled
  const togglePlayPause = () => {
    // Do nothing - audio disabled
  };
  
  // Handle animation sequence for just the 3 pages we're keeping
  useEffect(() => {
    // Show "Enter" button after 5 seconds on each page
    const timer = setTimeout(() => {
      setShowEnterButton(true);
    }, 5000);
    
    // Duration for each page (in milliseconds) - keeping only pages 0, 1, and 5
    const pageDurations = {
      0: 20000, // 20 seconds for Case File Scanning page
      1: 22000, // 22 seconds for HEAR THE VOICE page
      2: 20000  // 20 seconds for KLOUD BUGS loading page (previously page 5)
    };
    
    // Auto-redirect timing based on current page
    const redirectTimer = setTimeout(() => {
      if (currentPage < 2) {
        // Move to the next page
        setCurrentPage(currentPage + 1);
        setShowEnterButton(false); // Reset button for next page
        setCountdown(0); // Reset countdown for next page
      } else {
        // On the last page (2), prepare for exit
        navigate("/home");
      }
    }, pageDurations[currentPage as 0|1|2]); 
    
    // Setup countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev < 100) {
          return prev + 1;
        }
        return prev;
      });
    }, pageDurations[currentPage as 0|1|2] / 100); // Adjust interval based on page duration
    
    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [navigate, currentPage]);
  
  // Handle the enter button click for just our 3 pages
  const handleEnter = () => {
    if (currentPage < 2) {
      // Move to the next welcome page
      setCurrentPage(currentPage + 1);
      setShowEnterButton(false);
      
      // Reset the countdown for the next page
      setCountdown(0);
      
      // Show the "Enter" button again after a short delay
      setTimeout(() => {
        setShowEnterButton(true);
      }, 5000);
    } else {
      // We're on the last page, prepare for final exit
      setAnimationComplete(true);
      
      // Redirect after exit animation completes
      setTimeout(() => {
        // Audio storage disabled
        navigate("/home");
      }, 1000);
    }
  };
  
  // First welcome page content - Police vs Civil Rights Stats #1
  const renderFirstWelcomePage = () => (
    <motion.div
      key="welcome-page-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
    >
      {/* Cosmic Animation Background with darker red tone */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-full h-full bg-black">
          {/* Stars */}
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                opacity: Math.random(),
                animation: `twinkle ${2 + Math.random() * 7}s infinite`
              }}
            />
          ))}
          
          {/* Red-tinted Nebula Effect for civil rights theme */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(220, 38, 38, 0.5), transparent 70%), radial-gradient(circle at 70% 50%, rgba(79, 70, 229, 0.3), transparent 70%)'
            }}
          />
        </div>
      </div>
      
      <div className="z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-8"
        >
          <h1 
            className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"
            style={{ 
              textShadow: '0 0 30px rgba(220, 38, 38, 0.8)',
              fontFamily: "'Orbitron', sans-serif" 
            }}
          >
            THE CIVIL RIGHTS CRISIS
          </h1>
          
          <div className="w-48 h-1 bg-gradient-to-r from-red-500 via-purple-600 to-blue-500 mx-auto rounded-full opacity-60 animate-pulse mb-8"></div>
          
          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-8 relative max-w-lg mx-auto"
          >
            <div className="relative rounded-lg overflow-hidden border-2 border-red-500/40 shadow-lg shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-900/40 to-purple-900/40 z-10"></div>
              <img 
                src="/images/welcome/civil-rights-1.jpeg" 
                alt="Civil Rights Image" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-medium">Justice and Accountability</p>
              </div>
            </div>
          </motion.div>
          
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Stat Card 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 shadow-lg hover:shadow-red-500/20 transition-all"
            >
              <h3 className="text-2xl font-bold text-red-400 mb-2">1,000+</h3>
              <p className="text-gray-300">People killed by police annually in the United States</p>
            </motion.div>
            
            {/* Stat Card 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              <h3 className="text-2xl font-bold text-purple-400 mb-2">3x Higher</h3>
              <p className="text-gray-300">Black Americans are 3 times more likely to be killed during police encounters</p>
            </motion.div>
            
            {/* Stat Card 3 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <h3 className="text-2xl font-bold text-blue-400 mb-2">98.3%</h3>
              <p className="text-gray-300">Of excessive force incidents result in no charges against officers</p>
            </motion.div>
            
            {/* Stat Card 4 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-6 shadow-lg hover:shadow-indigo-500/20 transition-all"
            >
              <h3 className="text-2xl font-bold text-indigo-400 mb-2">$300 Million</h3>
              <p className="text-gray-300">Annual cost of civil rights settlements paid by major cities</p>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mb-8"
          >
            <div className="bg-black/60 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 shadow-lg max-w-2xl mx-auto">
              <p className="text-white/80 italic mb-2 text-left">
                "I need medical attention. I have been asking for help for days. No one is listening to me. 
                The pain is unbearable and I'm afraid something is seriously wrong."
              </p>
              <p className="text-white/70 text-right font-medium">
                — From Tera Ann Harris's last written letter, three days before her death
              </p>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            The civil rights crisis continues with limited accountability
          </motion.p>
        </motion.div>
        
        {/* Animated Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 22, ease: "linear" }}
          className="h-1 bg-gradient-to-r from-red-500 via-purple-600 to-blue-500 rounded-full mb-8 max-w-xs mx-auto"
        />
        
        {/* Enter Button */}
        {showEnterButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              onClick={handleEnter}
              className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 hover:scale-105 cosmic-button"
            >
              <span>Continue</span>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  // Second welcome page content - Police vs Civil Rights Stats #2
  const renderSecondWelcomePage = () => (
    <motion.div
      key="welcome-page-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
    >
      {/* Different cosmic background for second page */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-full h-full cosmic-bg">
          {/* More stars for second page */}
          {Array.from({ length: 300 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4}px`,
                height: `${Math.random() * 4}px`,
                opacity: Math.random(),
                animation: `twinkle ${2 + Math.random() * 7}s infinite`
              }}
            />
          ))}
          
          {/* Different nebula effect - blue-green for healing theme */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.5), transparent 70%), radial-gradient(circle at 60% 60%, rgba(6, 182, 212, 0.5), transparent 70%)'
            }}
          />
        </div>
      </div>
      
      <div className="z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-8"
        >
          <h1 
            className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500"
            style={{ 
              textShadow: '0 0 30px rgba(20, 184, 166, 0.8)',
              fontFamily: "'Orbitron', sans-serif" 
            }}
          >
            CREATING SYSTEMIC CHANGE
          </h1>
          
          <div className="w-48 h-1 bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-500 mx-auto rounded-full opacity-60 animate-pulse mb-8"></div>
          
          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-8 relative max-w-lg mx-auto"
          >
            <div className="relative rounded-lg overflow-hidden border-2 border-teal-500/40 shadow-lg shadow-teal-500/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/40 to-blue-900/40 z-10"></div>
              <img 
                src="/images/welcome/civil-rights-2.jpeg" 
                alt="Civil Rights Solutions" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-medium">Building Sustainable Solutions</p>
              </div>
            </div>
          </motion.div>
          
          {/* Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Solution Card 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-teal-500/30 rounded-lg p-6 shadow-lg hover:shadow-teal-500/20 transition-all"
            >
              <h3 className="text-2xl font-bold text-teal-400 mb-2">Transparency</h3>
              <p className="text-gray-300">Comprehensive databases to track police misconduct across jurisdictions</p>
            </motion.div>
            
            {/* Solution Card 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 shadow-lg hover:shadow-cyan-500/20 transition-all"
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-2">Accountability</h3>
              <p className="text-gray-300">Independent oversight commissions with real enforcement powers</p>
            </motion.div>
            
            {/* Solution Card 3 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <h3 className="text-2xl font-bold text-blue-400 mb-2">Community</h3>
              <p className="text-gray-300">Community-led initiatives with proper funding and institutional support</p>
            </motion.div>
            
            {/* Solution Card 4 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-emerald-500/30 rounded-lg p-6 shadow-lg hover:shadow-emerald-500/20 transition-all"
            >
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">Investment</h3>
              <p className="text-gray-300">Dedicated financial resources for victim support and systemic reform</p>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mb-8"
          >
            <div className="bg-black/60 backdrop-blur-sm border border-teal-500/30 rounded-lg p-4 shadow-lg max-w-2xl mx-auto">
              <p className="text-white/80 italic mb-2 text-left">
                "Please tell my family I love them. The staff here won't listen to me. 
                I can't breathe right and my chest hurts. If anything happens to me, 
                I want everyone to know it didn't have to be this way."
              </p>
              <p className="text-white/70 text-right font-medium">
                — From Tera Ann Harris's note to another inmate, found after her death
              </p>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            TERA Token funds initiatives for lasting civil rights protections
          </motion.p>
        </motion.div>
        
        {/* Animated Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 20, ease: "linear" }}
          className="h-1 bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-500 rounded-full mb-8 max-w-xs mx-auto"
        />
        
        {/* Enter Button */}
        {showEnterButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              onClick={handleEnter}
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 hover:scale-105 cosmic-button"
            >
              <span>Continue</span>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
  
  // Tera Ann Harris Story Page - inserted between civil rights pages and KLOUD BUGS
  const renderTeraStoriesPage = () => (
    <motion.div
      key="welcome-page-tera-story"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
    >
      {/* Dark crimson cosmic background for the painful truth */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-full h-full cosmic-bg">
          {/* Stars with red tint */}
          {Array.from({ length: 300 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4}px`,
                height: `${Math.random() * 4}px`,
                opacity: Math.random(),
                animation: `twinkle ${2 + Math.random() * 7}s infinite`,
                filter: 'drop-shadow(0 0 2px rgba(220, 38, 38, 0.8))'
              }}
            />
          ))}
          
          {/* Deep red nebula effect for the tragedy */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(220, 38, 38, 0.6), transparent 70%), radial-gradient(circle at 70% 50%, rgba(79, 70, 229, 0.2), transparent 70%)'
            }}
          />
        </div>
      </div>
      
      <div className="z-10 text-center px-4 max-w-4xl mx-auto overflow-y-auto max-h-screen py-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mb-6"
        >
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-orange-400"
            style={{ 
              textShadow: '0 0 30px rgba(220, 38, 38, 0.8)',
              fontFamily: "'Orbitron', sans-serif" 
            }}
          >
            TERA ANN HARRIS: VICTIM OF POLICE BRUTALITY
          </h1>
          
          <div className="w-48 h-1 bg-gradient-to-r from-red-500 via-red-600 to-orange-500 mx-auto rounded-full opacity-60 animate-pulse mb-6"></div>
          
          <h2 className="text-xl md:text-2xl text-white/90 font-medium mb-8">
            Days of Ignored Pleas for Medical Help at Multnomah County Jail
          </h2>
          
          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-6 flex flex-wrap md:flex-nowrap gap-4 justify-center"
          >
            {/* Jail Image */}
            <div className="relative rounded-lg overflow-hidden border-2 border-red-500/40 shadow-lg shadow-red-500/20 w-full md:w-1/2">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-900/60 to-purple-900/40 z-10"></div>
              <img 
                src="/images/welcome/multnomah-county-jail.jpeg" 
                alt="Multnomah County Jail" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <p className="text-white font-medium">Multnomah County Detention Center</p>
              </div>
            </div>
            
            {/* Sheriff's Office */}
            <div className="relative rounded-lg overflow-hidden border-2 border-red-500/40 shadow-lg shadow-red-500/20 w-full md:w-1/2">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-900/60 to-purple-900/40 z-10"></div>
              <img 
                src="/images/welcome/multnomah-sheriff.jpeg" 
                alt="Multnomah County Sheriff's Office" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <p className="text-white font-medium">Multnomah County Sheriff's Office</p>
              </div>
            </div>
          </motion.div>
          
          {/* Evidence Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Complaint Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-black/50 backdrop-blur-sm border border-red-500/40 rounded-lg p-5 shadow-lg hover:shadow-red-500/20 transition-all text-left"
            >
              <h3 className="text-xl font-bold text-red-400 mb-2">Ignored for Days</h3>
              <p className="text-gray-300">
                Tera Ann Harris repeatedly requested medical help for <span className="text-red-300 font-medium">days</span> before her death.
                Court documents state she complained of severe pain and medical distress, but as stated in case 3:22-cv-01739-MK, 
                "Multnomah County Health Department corrections health failed to treat Plaintiff with medical care" despite
                clear signs of distress and pain.
              </p>
            </motion.div>
            
            {/* Nursing Staff Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="bg-black/50 backdrop-blur-sm border border-red-500/40 rounded-lg p-5 shadow-lg hover:shadow-red-500/20 transition-all text-left"
            >
              <h3 className="text-xl font-bold text-red-400 mb-2">Nursing Staff Failures</h3>
              <p className="text-gray-300">
                The jail's nursing staff failed to properly evaluate Tera's condition or provide appropriate medical 
                intervention despite clear signs of medical emergency. Documentation shows inadequate medical assessments
                and failure to follow proper protocols for inmate healthcare.
              </p>
            </motion.div>
            
            {/* Officers Fired Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="bg-black/50 backdrop-blur-sm border border-red-500/40 rounded-lg p-5 shadow-lg hover:shadow-red-500/20 transition-all text-left"
            >
              <h3 className="text-xl font-bold text-red-400 mb-2">Officers Fired</h3>
              <p className="text-gray-300">
                Following Tera's death, multiple officers were fired for misconduct and failure to follow protocols.
                Internal investigations revealed systemic failures in the jail's response to medical emergencies
                and proper handling of inmate care responsibilities.
              </p>
            </motion.div>
            
            {/* Pattern of Deaths Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="bg-black/50 backdrop-blur-sm border border-red-500/40 rounded-lg p-5 shadow-lg hover:shadow-red-500/20 transition-all text-left"
            >
              <h3 className="text-xl font-bold text-red-400 mb-2">Pattern of Deaths</h3>
              <p className="text-gray-300">
                Tera's case is not isolated. Multnomah County jails have a disturbing history of in-custody deaths
                with similar patterns of ignored medical needs, inadequate care, and staff negligence. These facilities
                have become deadly for vulnerable inmates seeking help.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="bg-black/60 backdrop-blur-sm border border-red-500/30 rounded-lg p-5 shadow-lg mb-6 text-left"
          >
            <h3 className="text-xl font-bold text-white mb-2">News Reports Confirm:</h3>
            <ul className="list-disc pl-5 text-gray-300 space-y-2">
              <li>Multiple investigations found policy violations and failures in duty of care</li>
              <li>Medical staff failed to properly document or respond to Tera's deteriorating condition</li>
              <li>Officers failed to conduct required wellness checks despite her known medical distress</li>
              <li>The facility has a documented history of similar preventable deaths</li>
              <li>Whistleblowers have reported chronic understaffing and inadequate medical resources</li>
            </ul>
          </motion.div>
          
          {/* Lawsuit and Restraining Order Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="bg-black/70 backdrop-blur-md border border-red-500/50 rounded-lg p-5 shadow-lg mb-6"
          >
            <h3 className="text-2xl font-bold text-red-400 mb-3">$7.5 Million Lawsuit & Restraining Orders</h3>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <p className="text-white mb-4">
                  After days of complaining, the police used <span className="text-red-400 font-bold">excessive force</span>, 
                  <span className="text-red-400 font-bold"> segregated Tera</span> from others, and ultimately 
                  <span className="text-red-400 font-bold"> caused her death</span>. A $7.5 million lawsuit has been 
                  filed against the officers and staff responsible.
                </p>
                <p className="text-gray-300 mb-4">
                  The court has granted restraining orders against specific officers who were involved in Tera's 
                  mistreatment and death. Evidence shows a pattern of negligence and violation of civil rights in 
                  her detention and medical care.
                </p>
              </div>
              
              {/* Staff Photos */}
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div className="relative rounded-md overflow-hidden border border-red-500/30">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <img 
                    src="/images/welcome/officer-1.jpeg" 
                    alt="Officer Involved" 
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/welcome/civil-rights-1.jpeg";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
                    <p className="text-xs text-white">Officer J. Donovan</p>
                  </div>
                </div>
                
                <div className="relative rounded-md overflow-hidden border border-red-500/30">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <img 
                    src="/images/welcome/officer-2.jpeg" 
                    alt="Officer Involved" 
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/welcome/civil-rights-2.jpeg";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
                    <p className="text-xs text-white">Sgt. K. Williams</p>
                  </div>
                </div>
                
                <div className="relative rounded-md overflow-hidden border border-red-500/30 col-span-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <img 
                    src="/images/welcome/facility.jpeg" 
                    alt="Facility" 
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/welcome/multnomah-county-jail.jpeg";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
                    <p className="text-xs text-white">Detention Center Medical Ward</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="text-xl md:text-2xl text-white font-bold max-w-2xl mx-auto leading-relaxed"
          >
            The TERA Token honors her memory by fighting for accountability and justice
          </motion.p>
        </motion.div>
        
        {/* Animated Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 20, ease: "linear" }}
          className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full mb-6 max-w-xs mx-auto"
        />
        
        {/* Enter Button */}
        {showEnterButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <Button
              onClick={handleEnter}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 hover:scale-105 cosmic-button animate-pulse"
            >
              <span>Continue</span>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  // Third welcome page content - KLOUD BUGS
  const renderThirdWelcomePage = () => (
    <motion.div
      key="welcome-page-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
    >
      {/* Cosmic Animation Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-full h-full bg-black">
          {/* Stars */}
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                opacity: Math.random(),
                animation: `twinkle ${2 + Math.random() * 7}s infinite`
              }}
            />
          ))}
          
          {/* Nebula Effect */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(148, 0, 211, 0.6), transparent 60%), radial-gradient(circle at 70% 50%, rgba(0, 0, 255, 0.6), transparent 60%)'
            }}
          />
        </div>
      </div>
      
      <div className="z-10 text-center px-4">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-8"
        >
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-500"
            style={{ 
              textShadow: '0 0 30px rgba(148, 85, 255, 0.8)',
              fontFamily: "'Orbitron', sans-serif" 
            }}
          >
            KLOUD BUGS
          </h1>
          <div className="w-48 h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 mx-auto rounded-full opacity-60 animate-pulse mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-xl mx-auto leading-relaxed">
            BLOCKCHAIN MINING FOR CIVIL RIGHTS & SOCIAL JUSTICE
          </p>
        </motion.div>
        
        {/* Animated Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 20, ease: "linear" }}
          className="h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 rounded-full mb-8 max-w-xs mx-auto"
        />
        
        {/* Enter Button */}
        {showEnterButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              onClick={handleEnter}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 hover:scale-105 cosmic-button"
            >
              <span>Continue</span>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  // Fourth welcome page content - HEAR THE VOICE
  const renderFourthWelcomePage = () => (
    <motion.div
      key="welcome-page-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
    >
      {/* Different cosmic background for fourth page */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-full h-full cosmic-bg">
          {/* More stars for fourth page */}
          {Array.from({ length: 300 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4}px`,
                height: `${Math.random() * 4}px`,
                opacity: Math.random(),
                animation: `twinkle ${2 + Math.random() * 7}s infinite`
              }}
            />
          ))}
          
          {/* Different nebula effect */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 40% 40%, rgba(79, 70, 229, 0.6), transparent 70%), radial-gradient(circle at 60% 60%, rgba(236, 72, 153, 0.5), transparent 70%)'
            }}
          />
        </div>
      </div>
      
      <div className="z-10 text-center px-4">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-8"
        >
          {/* TERA Family Image with animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="mx-auto mb-6 relative"
          >
            <div className="mx-auto relative">
              {/* Family painting with decorative border */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
                {/* Outer glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-lg opacity-70 animate-pulse"></div>
                
                {/* Decorative borders */}
                <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-pink-500/40 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-purple-500/40"></div>
                
                {/* Image container with subtle gradient overlay */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 z-10"></div>
                  <img 
                    src="/tera-family-painting.png" 
                    alt="TERA Ann Harris and Family" 
                    className="w-full h-full object-cover rounded-full"
                    style={{ filter: "drop-shadow(0 0 10px rgba(236, 72, 153, 0.4))" }}
                    onError={(e) => {
                      console.log("Image failed to load, trying alternate source");
                      e.currentTarget.src = "/tera-mother-children.png"; // Fallback image
                    }}
                  />
                </div>
                
                {/* Caption below the image */}
                <div className="absolute -bottom-6 left-0 right-0 text-center">
                  <span className="px-4 py-1 bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                    THE FUTURE OF AI-POWERED BLOCKCHAIN MINING
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <h1 
            className="welcome-title text-5xl md:text-7xl font-bold mb-6"
          >
            HEAR THE VOICE
          </h1>
          <div className="w-48 h-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 mx-auto rounded-full opacity-60 animate-pulse mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-xl mx-auto leading-relaxed">
            FUND THE CHANGE • HEAL THE ROOTS
          </p>
        </motion.div>
        
        {/* Different style for progress bar - extended to 20 seconds */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 20, ease: "linear" }}
          className="h-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-full mb-8 max-w-xs mx-auto"
        />
        
        {/* Enter Button */}
        {showEnterButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <Button
              onClick={handleEnter}
              className="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 hover:scale-105 cosmic-button"
            >
              <span>Enter Cafe Membership</span>
            </Button>
            
            {/* Admin Login Link */}
            <a 
              href="/auth"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-300 flex items-center mt-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                  clipRule="evenodd" 
                />
              </svg>
              Admin Access
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
  
  // Case file scanning page - New simulation page
  const renderCaseFileScanningPage = () => (
    <motion.div
      key="case-file-scanning"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
    >
      <div className="computer-screen w-full max-w-4xl mx-auto rounded-lg p-5 h-[80vh]">
        <div className="scan-line"></div>
        <div className="text-green-500 text-sm mb-4 font-mono flex justify-between">
          <div>KLOUD BUGS SECURE TERMINAL v3.2.1</div>
          <div>USER: ADMIN-GUARDIAN</div>
        </div>
        
        <div className="border-b border-green-500/30 mb-4 pb-2">
          <div className="console-text text-green-500 font-mono mb-2">$ initiating case file scan</div>
          <div className="flex items-center text-green-400 font-mono text-sm mt-2">
            <Search className="mr-2 h-4 w-4 animate-pulse" />
            <span>SCANNING CIVIL RIGHTS VIOLATION DATABASE...</span>
          </div>
        </div>
        
        <div className="h-[60vh] overflow-auto text-gray-300 font-mono text-sm space-y-1 px-2">
          {/* Case files list with TERA ANN HARRIS highlighted */}
          <div className="case-file">
            <span className="text-green-400 mr-2">[FILE]</span> Parker v. Milwaukee County Sheriff - Medical Neglect (2022)
          </div>
          <div className="case-file">
            <span className="text-green-400 mr-2">[FILE]</span> Johnson v. California DOC - Excessive Force (2024)
          </div>
          <div className="case-file">
            <span className="text-green-400 mr-2">[FILE]</span> Williams v. Cook County - Deliberate Indifference (2023)
          </div>
          <div className="case-file">
            <span className="text-green-400 mr-2">[FILE]</span> Garcia v. Arizona Dept of Corrections - Denial of Medical Care (2024)
          </div>
          <div className="case-file highlight">
            <span className="text-red-400 mr-2 animate-pulse">[PRIORITY]</span> 
            <span className="case-file-highlight">TERA ANN HARRIS v. MULTNOMAH COUNTY DETENTION (PORTLAND, OR) - WRONGFUL DEATH (2023)</span>
          </div>
          <div className="case-file">
            <span className="text-green-400 mr-2">[FILE]</span> Miller v. Chicago Police Department - Excessive Force (2023)
          </div>
          <div className="case-file">
            <span className="text-green-400 mr-2">[FILE]</span> Thompson v. Florida DOC - Cruel and Unusual Punishment (2022)
          </div>
          <div className="case-file">
            <span className="text-green-400 mr-2">[FILE]</span> Robinson v. New York DOC - Medical Neglect (2024)
          </div>
          <div className="case-file">
            <span className="text-green-400 mr-2">[FILE]</span> Edwards v. Los Angeles County - Excessive Force (2023)
          </div>
          
          {/* Access confirmation message */}
          {caseFileFound && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-3 bg-red-900/20 border border-red-500/50 rounded"
            >
              <div className="font-bold text-red-400 flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                PRIORITY CASE FILE DETECTED
              </div>
              <div className="mt-2 text-gray-300">Opening file: TERA ANN HARRIS v. MULTNOMAH COUNTY DETENTION</div>
              <div className="mt-2 text-gray-300 flex items-center">
                <Lock className="mr-2 h-4 w-4 text-green-500" />
                <span>Access granted. Loading case evidence...</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: scanningComplete ? "100%" : "60%" }}
                  transition={{ duration: 2 }}
                  className="h-full bg-green-500"
                />
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Controls */}
        <div className="mt-4 flex justify-between items-center border-t border-green-500/30 pt-4">
          <div className="text-green-400 font-mono text-sm flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            <span>SECURITY LEVEL: ADMIN ACCESS</span>
          </div>
          
          {showEnterButton && (
            <div className="flex flex-col items-end space-y-2">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleEnter}
                className="px-4 py-2 bg-green-900/50 text-green-400 rounded border border-green-500/50 
                          hover:bg-green-700/50 transition-colors font-mono flex items-center"
              >
                <FileText className="mr-2 h-4 w-4" />
                {caseFileFound ? "ENTER CAFE MEMBERSHIP" : "SCAN DATABASE"}
              </motion.button>
              
              {/* Admin Access Link */}
              <a 
                href="/auth" 
                className="text-green-400/70 hover:text-green-400 text-xs font-mono transition-colors flex items-center"
              >
                <span className="mr-1">$</span>
                <span>admin:access</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Effect to handle the case file scanning animation sequence with sounds
  useEffect(() => {
    if (currentPage === 0) {
      // Play scanning sound as soon as we're on page 0
      try {
        // @ts-ignore - this function is defined in the script included in index.html
        window.playScanning?.();
        console.log("Playing scanning sound effect");
        
        // Play typing sound after 2 seconds
        setTimeout(() => {
          try {
            // @ts-ignore
            window.playTyping?.(5); // 5 seconds of typing sound
            console.log("Playing keyboard typing sound effect");
          } catch (err) {
            console.error("Failed to play typing sound:", err);
          }
        }, 2000);
      } catch (err) {
        console.error("Failed to play scanning sound:", err);
      }
      
      // Find the case after 8 seconds
      if (!caseFileFound) {
        const timer = setTimeout(() => {
          setCaseFileFound(true);
          
          // Play alert sound when case is found
          try {
            // @ts-ignore
            window.playFound?.();
            console.log("Playing case found alert sound");
          } catch (err) {
            console.error("Failed to play case found sound:", err);
          }
        }, 8000);
        
        // Complete the scan progress bar
        const completeTimer = setTimeout(() => {
          setScanningComplete(true);
        }, 12000);
        
        return () => {
          clearTimeout(timer);
          clearTimeout(completeTimer);
        };
      }
    }
  }, [currentPage, caseFileFound]);

  return (
    <AnimatePresence mode="wait">
      {!animationComplete && (
        <>
          {/* Render only the 3 pages we're keeping, based on currentPage state */}
          {currentPage === 0 && renderCaseFileScanningPage()} {/* Case file scanning page */}
          {currentPage === 1 && renderFourthWelcomePage()} {/* HEAR THE VOICE page */}
          {currentPage === 2 && renderThirdWelcomePage()} {/* KLOUD BUGS loading page */}
          
          {/* Music Player Controls removed as requested */}
        </>
      )}
    </AnimatePresence>
  );
}