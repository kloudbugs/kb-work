import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, Coffee, BarChart3, Shield, Lock, Cpu, Database, Bitcoin } from "lucide-react";
import BeanChildImage from '@assets/Snipaste_2025-04-11_12-33-12_1744400442824.png';

interface MiningIntroductionProps {
  onContinue: () => void;
}

export function MiningIntroduction({ onContinue }: MiningIntroductionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const totalSteps = 5;
  const autoProgressTimeRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto progress through steps with a delay
  useEffect(() => {
    if (currentStep < totalSteps - 1) {
      autoProgressTimeRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 4000); // 4 seconds per step
    } else if (currentStep === totalSteps - 1) {
      const timer = setTimeout(() => {
        setShowContinue(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
    
    return () => {
      if (autoProgressTimeRef.current) {
        clearTimeout(autoProgressTimeRef.current);
      }
    };
  }, [currentStep, totalSteps]);

  // Manual step navigation
  const goToStep = (step: number) => {
    if (autoProgressTimeRef.current) {
      clearTimeout(autoProgressTimeRef.current);
    }
    setCurrentStep(step);
    if (step === totalSteps - 1) {
      setShowContinue(true);
    } else {
      setShowContinue(false);
    }
  };
  
  // Steps content
  const steps = [
    {
      icon: <Coffee className="h-16 w-16 text-amber-400" />,
      title: "Welcome to Blockchain Mining",
      description: "You're about to join a revolutionary mining platform that combines blockchain technology with social impact."
    },
    {
      icon: <Cpu className="h-16 w-16 text-blue-500" />,
      title: "Powerful Mining Technology",
      description: "Our platform uses advanced algorithms to efficiently mine cryptocurrencies, distributing rewards fairly among participants."
    },
    {
      icon: <Database className="h-16 w-16 text-green-500" />,
      title: "Earn Blockchain Tokens",
      description: "Mine and collect Blockchain tokens - unique digital assets tied to Satoshi's original blockchain work, supporting civil rights initiatives."
    },
    {
      icon: <BarChart3 className="h-16 w-16 text-purple-500" />,
      title: "Track Your Impact",
      description: "Monitor your mining performance, earnings, and social impact through our intuitive dashboard and visualization tools."
    },
    {
      icon: <Shield className="h-16 w-16 text-red-500" />,
      title: "Secure & Transparent",
      description: "All mining operations and transactions are secured by blockchain technology, ensuring transparency and immutability."
    }
  ];
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-[9999] bg-gradient-to-b from-gray-900 to-teal-900 overflow-y-auto py-6 md:py-0">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Header and logo */}
      <div className="text-center mb-6 md:mb-10 relative z-10 px-4">
        <div className="flex flex-wrap items-center justify-center mb-2">
          <Bitcoin className="h-8 w-8 md:h-10 md:w-10 text-teal-500 mr-2" />
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-600">
            BLOCKCHAIN MINING
          </h1>
        </div>
        <p className="text-teal-200 text-base md:text-lg">Building a more equitable future through blockchain technology</p>
      </div>
      
      {/* Content carousel */}
      <div className="w-full max-w-4xl px-4 md:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/60 backdrop-blur-md rounded-xl p-4 md:p-8 border border-teal-700/30 shadow-xl"
          >
            <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6">
              {/* Bean Child Image - Left side on desktop, top on mobile */}
              <div className="md:w-1/3 w-full flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-teal-500 to-cyan-500 opacity-50 blur-lg animate-pulse"></div>
                  <div className="relative h-56 w-56 md:h-64 md:w-64 rounded-2xl overflow-hidden border-4 border-teal-500 shadow-lg shadow-teal-500/50 mx-auto">
                    <img 
                      src={BeanChildImage} 
                      alt="Bean Child"
                      className="w-full h-full object-contain"
                      style={{ 
                        objectPosition: "center 20%",
                        objectFit: "contain",
                        transform: "scale(1.2) translateY(-5%)" 
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Content - Right side on desktop, bottom on mobile */}
              <div className="md:w-2/3 w-full flex flex-col items-center md:items-start">
                <div className="mb-4 mt-2 md:mt-0 md:mb-6 bg-gray-800/80 p-3 rounded-full border border-gray-700/50 shadow-inner">
                  {steps[currentStep].icon}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-teal-300 mt-1 mb-2 md:mb-3">{steps[currentStep].title}</h2>
                <p className="text-gray-300 text-base md:text-lg max-w-2xl">{steps[currentStep].description}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Progress indicators */}
      <div className="flex space-x-2 mt-8">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => goToStep(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentStep ? 'bg-teal-500 w-6' : 'bg-gray-500 hover:bg-gray-400'
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Continue button */}
      <AnimatePresence>
        {showContinue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Button
              onClick={onContinue}
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-6 text-lg"
            >
              <span className="flex items-center gap-2">
                Begin Mining Journey
                <ChevronRightIcon className="h-5 w-5" />
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Skip button */}
      {!showContinue && (
        <button
          onClick={() => {
            goToStep(totalSteps - 1);
            setShowContinue(true);
          }}
          className="mt-8 text-gray-400 hover:text-teal-300 transition-colors text-sm"
        >
          Skip Introduction
        </button>
      )}
      
      {/* Background beans */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-teal-600/10 backdrop-blur-3xl"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default MiningIntroduction;