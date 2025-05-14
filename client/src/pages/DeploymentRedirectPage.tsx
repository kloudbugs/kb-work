import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Rocket, Zap, Shield, Database } from 'lucide-react';

export default function DeploymentRedirectPage() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Welcome sequence steps
  const steps = [
    { title: "CONNECTING TO BLOCKCHAIN", duration: 3000 },
    { title: "INITIALIZING KLOUDBUGS NETWORK", duration: 3000 },
    { title: "PREPARING MINING ENVIRONMENT", duration: 3000 }
  ];
  
  // Handle the step progression
  useEffect(() => {
    if (currentStep >= steps.length) {
      // All steps completed, redirect to mining page
      setTimeout(() => {
        navigate('/mining');
      }, 1000);
      return;
    }
    
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setLoadingProgress(0); // Reset progress for next step
    }, steps[currentStep].duration);
    
    return () => clearTimeout(timer);
  }, [currentStep, navigate]);
  
  // Progress bar animation
  useEffect(() => {
    if (currentStep >= steps.length) return;
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + (100 / (steps[currentStep].duration / 100));
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [currentStep]);
  
  // Step icon mapping
  const getStepIcon = (step: number) => {
    switch (step) {
      case 0: return <Rocket className="h-10 w-10 text-blue-400" />;
      case 1: return <Zap className="h-10 w-10 text-purple-400" />;
      case 2: return <Shield className="h-10 w-10 text-cyan-400" />;
      default: return <Database className="h-10 w-10 text-indigo-400" />;
    }
  };
  
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Cosmic background with animated stars */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
        {/* Stars layer 1 */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(1.5px 1.5px, #ffffff 2%, transparent 12%)',
          backgroundSize: '50px 50px'
        }} />
        
        {/* Stars layer 2 */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(1px 1px, rgba(255,255,255,0.5) 1%, transparent 10%)',
          backgroundSize: '40px 40px',
          transform: 'rotate(15deg)'
        }} />
        
        {/* Animated nebula effects */}
        <motion.div
          className="absolute w-screen h-screen opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(76, 0, 255, 0.3), rgba(0, 0, 76, 0), rgba(0, 0, 0, 0))',
            filter: 'blur(20px)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-screen h-screen opacity-20"
          style={{
            background: 'radial-gradient(circle at 30% 60%, rgba(0, 100, 255, 0.4), rgba(0, 0, 76, 0), rgba(0, 0, 0, 0))',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.3
            }}
            animate={{
              y: [0, -(Math.random() * 100 + 50)],
              x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50],
              opacity: [Math.random() * 0.5 + 0.3, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </div>
      
      {/* Main logo and content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {currentStep < steps.length ? (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Logo with cosmic glow */}
              <div className="relative mb-12">
                <motion.div
                  className="absolute w-40 h-40 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(98, 0, 255, 0.4) 0%, rgba(0, 180, 255, 0.2) 40%, rgba(0, 0, 0, 0) 70%)',
                    filter: 'blur(15px)'
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* KLOUD BUGS logo */}
                <motion.div
                  className="relative flex items-center justify-center"
                  animate={{
                    rotateZ: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-blue-200 to-indigo-500"
                      style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    KLOUD BUGS
                  </h1>
                </motion.div>
              </div>
              
              {/* Current step display */}
              <div className="text-center mb-8">
                <div className="mb-6 flex justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="p-3 bg-gray-900/50 rounded-full border border-indigo-500/30"
                  >
                    {getStepIcon(currentStep)}
                  </motion.div>
                </div>
                
                <motion.h2
                  className="text-xl font-semibold text-indigo-300 mb-2"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {steps[currentStep].title}
                </motion.h2>
                
                <motion.p
                  className="text-gray-400 text-sm max-w-md px-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {currentStep === 0 && "Establishing secure connection to the blockchain network..."}
                  {currentStep === 1 && "Initializing KloudBugs mining environment and cosmic synchronization..."}
                  {currentStep === 2 && "Preparing mining algorithms for optimal performance..."}
                </motion.p>
              </div>
              
              {/* Progress bar */}
              <div className="w-80 h-1.5 bg-gray-800 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              
              {/* Step indicator */}
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? 'bg-indigo-500' : 
                      index < currentStep ? 'bg-indigo-800' : 'bg-gray-800'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="final-step"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mb-8"
              >
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  DEPLOYMENT COMPLETE
                </h1>
              </motion.div>
              
              <motion.p
                className="text-blue-300 text-lg mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                BLOCKCHAIN MINING FOR CIVIL RIGHTS & SOCIAL JUSTICE
              </motion.p>
              
              <motion.p
                className="text-gray-400 text-sm max-w-md mx-auto mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Redirecting to the mining dashboard...
              </motion.p>
              
              <motion.div
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="w-10 h-10 border-t-2 border-l-2 border-indigo-500 rounded-full mx-auto" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}