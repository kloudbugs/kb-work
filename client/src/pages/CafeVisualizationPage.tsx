import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/cosmic-theme.css";

// Import your component names as they are in the FRONTEND folder
const CafeVisualizationPage: React.FC = () => {
  const [_, navigate] = useLocation();
  const [currentStage, setCurrentStage] = useState<'scanning' | 'voice' | 'platform'>('scanning');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [voiceComplete, setVoiceComplete] = useState(false);
  
  // Simulate database scanning
  useEffect(() => {
    if (currentStage === 'scanning') {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            setScanComplete(true);
            setTimeout(() => {
              setCurrentStage('voice');
            }, 1000);
            return 100;
          }
          return newProgress;
        });
      }, 50); // Speed of the progress bar
      
      return () => clearInterval(interval);
    }
  }, [currentStage]);
  
  // Simulate voice welcome
  useEffect(() => {
    if (currentStage === 'voice') {
      // Simulate voice playback duration
      const voiceTimer = setTimeout(() => {
        setVoiceComplete(true);
        setTimeout(() => {
          setCurrentStage('platform');
          navigate("/visualization"); // Navigate to the full visualization page
        }, 1000);
      }, 5000); // Duration of simulated voice
      
      return () => clearTimeout(voiceTimer);
    }
  }, [currentStage, navigate]);
  
  // Render database scanning stage
  const renderScanningStage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-screen bg-black text-white p-8"
    >
      <div className="w-full max-w-lg">
        <h2 className="text-2xl mb-6 font-bold cosmic-gradient">Accessing Database</h2>
        
        <div className="mb-4 text-left">
          <div className="font-mono text-sm mb-2">Scanning system files...</div>
          
          {/* Terminal-like output */}
          <div className="bg-gray-900 rounded p-4 font-mono text-xs h-60 overflow-y-auto">
            <p className="text-green-400">$ initiating system scan</p>
            <p className="text-blue-400">{'>'} Accessing core modules</p>
            <p className="text-blue-400">{'>'} Verifying access credentials</p>
            <p className="text-blue-400">{'>'} Checking network connectivity</p>
            <p className="text-blue-400">{'>'} Loading mining configurations</p>
            <p className="text-blue-400">{'>'} Scanning blockchain records</p>
            <p className="text-blue-400">{'>'} Analyzing mining performance data</p>
            <p className="text-blue-400">{'>'} Preparing visualization modules</p>
            <p className="text-blue-400">{'>'} Loading user profiles</p>
            {scanProgress > 40 && <p className="text-yellow-400">{'>'} Loading voice synthesis module</p>}
            {scanProgress > 50 && <p className="text-yellow-400">{'>'} Preparing cosmic interface</p>}
            {scanProgress > 60 && <p className="text-yellow-400">{'>'} Loading asset libraries</p>}
            {scanProgress > 70 && <p className="text-yellow-400">{'>'} Connecting to mining network</p>}
            {scanProgress > 80 && <p className="text-yellow-400">{'>'} Validating platform integrity</p>}
            {scanProgress > 90 && <p className="text-green-400">{'>'} Database verification complete</p>}
            {scanProgress === 100 && <p className="text-green-400">{'>'} System ready</p>}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 h-2.5 rounded-full"
            style={{ width: `${scanProgress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Scan progress: {scanProgress}%</span>
          <span>{scanComplete ? "Complete" : "In progress..."}</span>
        </div>
      </div>
    </motion.div>
  );
  
  // Render voice welcome stage
  const renderVoiceStage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-screen bg-black text-white p-8"
    >
      <div className="text-center max-w-lg">
        <h2 className="text-3xl mb-8 font-bold cosmic-gradient">WELCOME TO KLOUDBUGS CAFE</h2>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: 1
          }}
          transition={{
            duration: 2,
            repeat: 2,
            repeatType: "reverse"
          }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
          
          <p className="text-lg font-medium">Hearing AI Voice Welcome...</p>
        </motion.div>
        
        <div className="space-y-4 mb-8">
          <p>
            "I AM ZIG. AN ENHANCED AI MINER. GUARDIAN OF THE COSMIC CORE."
          </p>
          <p>
            "WELCOME TO THE KLOUDBUGS COSMIC MINING PLATFORM."
          </p>
        </div>
        
        <div className="flex justify-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
          <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse delay-75"></div>
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
          <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse delay-200"></div>
        </div>
      </div>
    </motion.div>
  );
  
  // Render appropriate stage based on current state
  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {currentStage === 'scanning' && renderScanningStage()}
        {currentStage === 'voice' && renderVoiceStage()}
      </AnimatePresence>
    </div>
  );
};

export default CafeVisualizationPage;