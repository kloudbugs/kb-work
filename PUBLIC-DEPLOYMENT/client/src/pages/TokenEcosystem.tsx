import React, { useEffect, useRef, useState } from 'react';
import { Bitcoin, ArrowRight, Coins, Zap, MessageCircle, Users, FileText, Eye, ShieldCheck, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import WebsiteLayout from '@/components/website/WebsiteLayout';
import { motion, AnimatePresence } from 'framer-motion';

export default function TokenEcosystem() {
  // State for access granted animation
  const [showAccessGranted, setShowAccessGranted] = useState(true);
  
  // Walking bean component (for older sections)
  const WalkingBean = ({ 
    character, 
    direction = 'left-to-right', 
    delay = 0 
  }: { 
    character: 'bean' | 'lady-bean', 
    direction?: 'left-to-right' | 'right-to-left', 
    delay?: number 
  }) => {
    const characterImg = character === 'lady-bean' ? '/lady-bean.png' : '/logo1.png';
    
    // Animation variants for framer-motion
    const walkingAnimation = {
      initial: {
        x: direction === 'left-to-right' ? -100 : window.innerWidth + 100,
      },
      animate: {
        x: direction === 'left-to-right' ? window.innerWidth + 100 : -100,
        transition: {
          repeat: Infinity,
          duration: 20,
          ease: "linear",
          delay,
        }
      }
    };
    
    // Bobbing animation for walking effect
    const bobbingAnimation = {
      initial: { y: 0 },
      animate: {
        y: [-5, 5, -5],
        rotate: direction === 'left-to-right' ? [0, 5, 0, -5, 0] : [0, -5, 0, 5, 0],
        transition: {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }
      }
    };
    
    // Leg animation
    const legAnimation = {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 30, 0, -30, 0],
        transition: {
          repeat: Infinity,
          duration: 1.2,
          ease: "easeInOut",
        }
      }
    };
    
    return (
      <motion.div
        className="absolute bottom-32"
        style={{ 
          zIndex: 30,
          scaleX: direction === 'right-to-left' ? -1 : 1,
        }}
        initial="initial"
        animate="animate"
        variants={walkingAnimation}
      >
        <motion.div
          initial="initial"
          animate="animate"
          variants={bobbingAnimation}
        >
          {/* Character body */}
          <div className="relative w-20 h-32">
            <img 
              src={characterImg} 
              alt={character === 'lady-bean' ? "Lady Bean Character" : "KloudBugs Bean Character"} 
              className="w-20 object-contain absolute top-0"
            />
            
            {/* Left leg */}
            <motion.div 
              className="absolute bottom-0 left-3 w-3 h-12 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full"
              style={{ transformOrigin: 'top center' }}
              initial="initial"
              animate="animate"
              variants={legAnimation}
            />
            
            {/* Right leg */}
            <motion.div 
              className="absolute bottom-0 right-3 w-3 h-12 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full"
              style={{ 
                transformOrigin: 'top center',
              }}
              initial="initial"
              animate="animate"
              variants={legAnimation}
              transition={{ delay: 0.6 }}
            />
          </div>
        </motion.div>
      </motion.div>
    );
  };
  // Custom scene for beans walking across a planet
  const GalacticBeansScene = () => {
    // State variables for animations
    const [beansReachedMiddle, setBeansReachedMiddle] = useState(false);
    const [shuttleDoorsOpen, setShuttleDoorsOpen] = useState(true);
    const [shuttleTakingOff, setShuttleTakingOff] = useState(false);
    const [showBitcoinSpill, setShowBitcoinSpill] = useState(false);
    const [showAccessGranted, setShowAccessGranted] = useState(true);
    
    // Set up animation sequence
    useEffect(() => {
      // After 10 seconds, beans reach the middle
      const middleTimer = setTimeout(() => {
        setBeansReachedMiddle(true);
        // Show bitcoin spill
        setShowBitcoinSpill(true);
      }, 10000);
      
      // After 12 seconds, close shuttle doors
      const doorTimer = setTimeout(() => {
        setShuttleDoorsOpen(false);
      }, 12000);
      
      // After 14 seconds, take off
      const takeoffTimer = setTimeout(() => {
        setShuttleTakingOff(true);
      }, 14000);
      
      // After 18 seconds, reset the animation
      const resetTimer = setTimeout(() => {
        setBeansReachedMiddle(false);
        setShuttleDoorsOpen(true);
        setShuttleTakingOff(false);
        setShowBitcoinSpill(false);
      }, 18000);
      
      // Clean up timers
      return () => {
        clearTimeout(middleTimer);
        clearTimeout(doorTimer);
        clearTimeout(takeoffTimer);
        clearTimeout(resetTimer);
      };
    }, [beansReachedMiddle]);
    
    // Animation variants
    const leftBeanAnimation = {
      initial: { x: -100 },
      walking: { 
        x: '45%', 
        transition: { 
          duration: 10,
          ease: "linear"
        }
      }
    };
    
    const rightBeanAnimation = {
      initial: { x: '100vw' },
      walking: { 
        x: '55%', 
        transition: { 
          duration: 10,
          ease: "linear"
        }
      }
    };
    
    // Bobbing animation for walking effect
    const bobbingAnimation = {
      initial: { y: 0 },
      animate: {
        y: [-5, 5, -5],
        transition: {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }
      }
    };
    
    // Leg animation
    const legAnimation = {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 30, 0, -30, 0],
        transition: {
          repeat: Infinity,
          duration: 1.2,
          ease: "easeInOut",
        }
      }
    };
    
    // Shuttle door animations
    const leftDoorAnimation = {
      open: { x: 0 },
      closed: { 
        x: -30,
        transition: { 
          duration: 1,
          ease: "easeInOut"
        }
      }
    };
    
    const rightDoorAnimation = {
      open: { x: 0 },
      closed: { 
        x: 30,
        transition: { 
          duration: 1,
          ease: "easeInOut"
        }
      }
    };
    
    // Shuttle takeoff animation
    const shuttleAnimation = {
      grounded: { y: 0 },
      takeoff: { 
        y: -200,
        transition: { 
          duration: 3,
          ease: "easeInOut"
        }
      }
    };
    
    // Accesss Granted text animation
    const accessTextAnimation = {
      initial: { 
        scale: 0,
        opacity: 0 
      },
      animate: { 
        scale: [0, 1.2, 1],
        opacity: [0, 1, 1],
        transition: { 
          duration: 0.5,
          ease: "easeOut" 
        }
      },
      exit: {
        scale: [1, 1.1, 0],
        opacity: [1, 1, 0],
        transition: {
          duration: 0.3,
          ease: "easeIn"
        }
      }
    };
    
    // Generate Bitcoin tokens for spilling effect
    const bitcoinTokens = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 10 + 10, // 10-20px
      left: Math.random() * 80 + 10, // 10-90%
      delay: Math.random() * 2 // 0-2s
    }));
    
    return (
      <motion.div 
        className="relative w-full h-[300px] mt-16 mb-8 overflow-hidden"
        animate={shuttleTakingOff ? {
          // Apply screen shake animation when the shuttle is taking off
          transition: { 
            duration: 2, 
            ease: "easeInOut" 
          },
        } : {}}
        style={shuttleTakingOff ? { animation: 'screenShake 0.5s ease-in-out infinite' } : {}}
      >
        {/* Stars Background */}
        <div className="absolute inset-0 bg-gray-900">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `starTwinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        {/* TERA Token Planet */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[80%] h-[120px] overflow-hidden">
          <div className="absolute inset-0 rounded-[50%] bg-gray-800 overflow-hidden shadow-lg"
            style={{ boxShadow: '0 0 40px rgba(255, 255, 255, 0.2)' }}>
            {/* Planet texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 opacity-90"></div>
            
            {/* TERA logo overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <img 
                src="/tera-logo.png" 
                alt="TERA Token" 
                className="w-[80%] h-[80%] object-contain"
              />
            </div>
            
            {/* Craters */}
            <div className="absolute top-[10%] left-[10%] w-[8%] h-[15%] rounded-full bg-gray-900 opacity-70"></div>
            <div className="absolute top-[20%] left-[25%] w-[10%] h-[20%] rounded-full bg-gray-900 opacity-60"></div>
            <div className="absolute top-[15%] left-[45%] w-[7%] h-[12%] rounded-full bg-gray-900 opacity-80"></div>
            <div className="absolute top-[30%] left-[65%] w-[12%] h-[25%] rounded-full bg-gray-900 opacity-50"></div>
            <div className="absolute top-[10%] left-[80%] w-[6%] h-[10%] rounded-full bg-gray-900 opacity-75"></div>
          </div>
        </div>
        
        {/* Bean from left */}
        <motion.div
          className="absolute bottom-[130px] left-0"
          style={{ zIndex: 30 }}
          initial="initial"
          animate={beansReachedMiddle ? "reached" : "walking"}
          variants={leftBeanAnimation}
        >
          <motion.div
            initial="initial"
            animate="animate"
            variants={bobbingAnimation}
            style={{ originX: 0.5 }}
          >
            {/* Character body */}
            <div className="relative w-20 h-32">
              {/* Coffee cup and Bitcoin bag */}
              <div className="absolute -right-6 top-10 w-8 h-6 rounded-t-sm bg-gradient-to-b from-amber-600 to-amber-800 rotate-12 z-10"></div>
              <div className="absolute -left-10 top-12 w-10 h-14 bg-gradient-to-b from-amber-700 to-amber-900 rounded-md rotate-12">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-amber-700 rounded-full"></div>
                {/* Bitcoin spillage */}
                {showBitcoinSpill && bitcoinTokens.map(token => (
                  <motion.div 
                    key={`left-${token.id}`}
                    className="absolute rounded-full bg-yellow-500"
                    style={{ 
                      width: token.size, 
                      height: token.size,
                      left: `${token.left}%`,
                      top: '-10px',
                      zIndex: 20
                    }}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ 
                      y: 60, 
                      opacity: [0, 1, 0],
                      rotate: 360,
                      transition: { 
                        duration: 1.5, 
                        delay: token.delay,
                        repeat: 3,
                        repeatDelay: 0.5
                      }
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-[8px] font-bold">₿</div>
                  </motion.div>
                ))}
              </div>
              
              <img 
                src="/logo1.png" 
                alt="KloudBugs Bean Character" 
                className="w-20 object-contain absolute top-0"
              />
              
              {/* Left leg */}
              <motion.div 
                className="absolute bottom-0 left-3 w-3 h-12 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full"
                style={{ transformOrigin: 'top center' }}
                initial="initial"
                animate="animate"
                variants={legAnimation}
              />
              
              {/* Right leg */}
              <motion.div 
                className="absolute bottom-0 right-3 w-3 h-12 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full"
                style={{ transformOrigin: 'top center' }}
                initial="initial"
                animate="animate"
                variants={legAnimation}
                transition={{ delay: 0.6 }}
              />
              
              {/* Pointing arm to moon */}
              <motion.div 
                className="absolute top-8 right-2 w-2 h-10 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full origin-top"
                initial={{ rotate: -30 }}
                animate={{ rotate: [30, 15, 30], transition: { duration: 2, repeat: Infinity, repeatType: "reverse" } }}
              />
            </div>
          </motion.div>
        </motion.div>
        
        {/* Bean from right (lady bean) */}
        <motion.div
          className="absolute bottom-[130px] right-0"
          style={{ zIndex: 30 }}
          initial="initial"
          animate={beansReachedMiddle ? "reached" : "walking"}
          variants={rightBeanAnimation}
        >
          <motion.div
            initial="initial"
            animate="animate"
            variants={bobbingAnimation}
            style={{ originX: 0.5, scaleX: -1 }} // Flip horizontally
          >
            {/* Character body */}
            <div className="relative w-20 h-32">
              {/* Coffee cup and Bitcoin bag */}
              <div className="absolute -right-6 top-10 w-8 h-6 rounded-t-sm bg-gradient-to-b from-amber-600 to-amber-800 rotate-12 z-10"></div>
              <div className="absolute -left-10 top-12 w-10 h-14 bg-gradient-to-b from-amber-700 to-amber-900 rounded-md rotate-12">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-amber-700 rounded-full"></div>
                {/* Bitcoin spillage */}
                {showBitcoinSpill && bitcoinTokens.map(token => (
                  <motion.div 
                    key={`right-${token.id}`}
                    className="absolute rounded-full bg-yellow-500"
                    style={{ 
                      width: token.size, 
                      height: token.size,
                      left: `${token.left}%`,
                      top: '-10px',
                      zIndex: 20
                    }}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ 
                      y: 60, 
                      opacity: [0, 1, 0],
                      rotate: 360,
                      transition: { 
                        duration: 1.5, 
                        delay: token.delay + 0.5,
                        repeat: 3,
                        repeatDelay: 0.5
                      }
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-[8px] font-bold">₿</div>
                  </motion.div>
                ))}
              </div>
              
              <img 
                src="/lady-bean.png" 
                alt="Lady Bean Character" 
                className="w-20 object-contain absolute top-0"
              />
              
              {/* Left leg */}
              <motion.div 
                className="absolute bottom-0 left-3 w-3 h-12 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full"
                style={{ transformOrigin: 'top center' }}
                initial="initial"
                animate="animate"
                variants={legAnimation}
              />
              
              {/* Right leg */}
              <motion.div 
                className="absolute bottom-0 right-3 w-3 h-12 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full"
                style={{ transformOrigin: 'top center' }}
                initial="initial"
                animate="animate"
                variants={legAnimation}
                transition={{ delay: 0.6 }}
              />
              
              {/* Pointing arm to moon */}
              <motion.div 
                className="absolute top-8 right-2 w-2 h-10 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full origin-top"
                initial={{ rotate: -30 }}
                animate={{ rotate: [30, 15, 30], transition: { duration: 2, repeat: Infinity, repeatType: "reverse" } }}
              />
            </div>
          </motion.div>
        </motion.div>
        
        {/* Spaceship */}
        <motion.div 
          className="absolute bottom-[150px] left-1/2 transform -translate-x-1/2"
          style={{ zIndex: beansReachedMiddle ? 40 : 20 }}
          initial="grounded"
          animate={shuttleTakingOff ? "takeoff" : "grounded"}
          variants={shuttleAnimation}
        >
          {/* Main shuttle body */}
          <div className="relative w-64 h-40">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-32 bg-gradient-to-b from-gray-200 to-gray-400 rounded-t-2xl">
              {/* Shuttle windows */}
              <div className="absolute top-6 left-1/4 transform -translate-x-1/2 w-8 h-8 bg-blue-400 rounded-full opacity-80"></div>
              <div className="absolute top-6 right-1/4 transform translate-x-1/2 w-8 h-8 bg-blue-400 rounded-full opacity-80"></div>
              
              {/* KloudBugs logo */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-16 h-16">
                <img src="/logo1.png" alt="KloudBugs Logo" className="w-full h-full object-contain" />
              </div>
              
              {/* Shuttle doors */}
              <motion.div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-12 overflow-hidden"
              >
                <motion.div 
                  className="absolute bottom-0 left-0 w-1/2 h-full bg-gray-300"
                  initial="open"
                  animate={shuttleDoorsOpen ? "open" : "closed"}
                  variants={leftDoorAnimation}
                />
                <motion.div 
                  className="absolute bottom-0 right-0 w-1/2 h-full bg-gray-300"
                  initial="open"
                  animate={shuttleDoorsOpen ? "open" : "closed"}
                  variants={rightDoorAnimation}
                />
              </motion.div>
            </div>
            
            {/* Shuttle wings */}
            <div className="absolute bottom-8 left-0 w-16 h-8 bg-gradient-to-t from-gray-400 to-gray-300 rounded-l-lg"></div>
            <div className="absolute bottom-8 right-0 w-16 h-8 bg-gradient-to-t from-gray-400 to-gray-300 rounded-r-lg"></div>
            
            {/* Shuttle engines */}
            <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 w-8 h-12 bg-gray-500 rounded-b-lg">
              {shuttleTakingOff && (
                <>
                  {/* Fire/smoke effect */}
                  <motion.div 
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-b-full"
                    animate={{ 
                      height: [10, 20, 10], 
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  
                  {/* MPT tokens spurting out with exhaust */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={`left-mpt-${i}`}
                      className="absolute -bottom-4 left-1/2 w-5 h-5 rounded-full flex items-center justify-center bg-indigo-600"
                      style={{ zIndex: 5 }}
                      initial={{ y: 0, x: 0, opacity: 0, scale: 0.5 }}
                      animate={{
                        y: [0, 40 + i * 10],
                        x: [(i % 2 === 0 ? -5 : 5) * (i + 1), (i % 2 === 0 ? -15 : 15) * (i + 1)],
                        opacity: [0, 1, 0],
                        scale: [0.5, 0.8, 0.5],
                        rotate: [0, 180]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: i * 0.1
                      }}
                    >
                      <img src="/mpt-icon.png" alt="MPT Token" className="w-full h-full object-contain" />
                    </motion.div>
                  ))}
                </>
              )}
            </div>
            <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 w-8 h-12 bg-gray-500 rounded-b-lg">
              {shuttleTakingOff && (
                <>
                  {/* Fire/smoke effect */}
                  <motion.div 
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-b-full"
                    animate={{ 
                      height: [10, 20, 10], 
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  />
                  
                  {/* MPT tokens spurting out with exhaust */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={`right-mpt-${i}`}
                      className="absolute -bottom-4 left-1/2 w-5 h-5 rounded-full flex items-center justify-center bg-indigo-600"
                      style={{ zIndex: 5 }}
                      initial={{ y: 0, x: 0, opacity: 0, scale: 0.5 }}
                      animate={{
                        y: [0, 40 + i * 10],
                        x: [(i % 2 === 0 ? 5 : -5) * (i + 1), (i % 2 === 0 ? 15 : -15) * (i + 1)],
                        opacity: [0, 1, 0],
                        scale: [0.5, 0.8, 0.5],
                        rotate: [0, 180]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2 + 0.1,
                        repeat: Infinity,
                        repeatDelay: i * 0.1
                      }}
                    >
                      <img src="/mpt-icon.png" alt="MPT Token" className="w-full h-full object-contain" />
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Access granted text above scene */}
        <AnimatePresence>
          {showAccessGranted && (
            <motion.div 
              className="absolute top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={accessTextAnimation}
              onAnimationComplete={() => {
                setTimeout(() => setShowAccessGranted(false), 2000);
                // Re-show the text after a delay for continuous effect
                setTimeout(() => setShowAccessGranted(true), 8000);
              }}
            >
              <div className="text-xl text-green-400 font-bold tracking-wide rounded-md px-3 py-1 bg-black/50 backdrop-blur-sm">
                ACCESS GRANTED
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <WebsiteLayout>
      <div className="flex-1">
        {/* Hero Section with Token Overview */}
        <section className="pt-20 pb-24 bg-gradient-to-b from-black via-purple-950/20 to-black text-white">
          <div className="container mx-auto px-4 relative overflow-hidden">
            
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">KLOUD-BUGS</span> Token Ecosystem
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Discover our comprehensive token ecosystem supporting mining, social justice, and community growth
              </p>
            </div>

            {/* Orbital Animation for Token Display */}
            <div className="relative h-[500px] mb-16 overflow-hidden">
              {/* Orbital Rings */}
              <div className="absolute left-1/2 top-1/2 w-[450px] h-[450px] border border-purple-500/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-[spin_180s_linear_infinite] shadow-[0_0_20px_rgba(168,85,247,0.2)]"></div>
              <div className="absolute left-1/2 top-1/2 w-[350px] h-[350px] border border-blue-500/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-[spin_150s_linear_infinite_reverse] shadow-[0_0_15px_rgba(59,130,246,0.2)]"></div>
              <div className="absolute left-1/2 top-1/2 w-[250px] h-[250px] border border-cyan-500/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-[1px]"></div>
              
              {/* Center Hub */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="absolute inset-0 w-36 h-36 bg-gradient-to-r from-purple-600/50 to-blue-600/50 rounded-full blur-xl animate-pulse-slow"></div>
                <div className="relative w-32 h-32 mx-auto rounded-full flex items-center justify-center overflow-hidden border border-blue-500/30 bg-gradient-to-br from-blue-600/80 to-purple-600/80 animate-pulse-slow" style={{ boxShadow: '0 0 25px rgba(99, 102, 241, 0.6)' }}>
                  <img 
                    src="/logo1.png" 
                    alt="KLOUD-BUGS Platform" 
                    className="w-28 h-28 object-cover"
                  />
                </div>
                <p className="mt-3 text-center font-medium text-white text-lg" style={{ fontFamily: "'Audiowide', cursive", letterSpacing: "0.1em" }}>PLATFORM</p>
              </div>
              
              {/* MPT Token - Position 45 degrees */}
              <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] animate-[spin_35s_linear_infinite]">
                <div className="absolute top-[20px] right-[120px] transform -translate-y-1/2">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600/80 to-indigo-600/80 shadow-lg animate-[glow-pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '-1s' }}>
                    <img 
                      src="/logo1.png" 
                      alt="MPT Token" 
                      className="w-20 h-20 object-cover animate-[pulse-slow_4s_ease-in-out_infinite]" 
                      style={{ animationDelay: '-0.5s' }}
                    />
                  </div>
                  <p className="mt-1 text-center font-medium text-white text-sm">MPT</p>
                </div>
              </div>
              
              {/* TERA Token - Position 90 degrees */}
              <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] animate-[spin_35s_linear_infinite] [animation-delay:_-5s]">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden shadow-lg bg-black/60 backdrop-blur-sm animate-[glow-pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '-2s' }}>
                    <img 
                      src="/tera-logo.png" 
                      alt="TERA Token" 
                      className="w-20 h-20 object-cover animate-[pulse-slow_4s_ease-in-out_infinite]" 
                      style={{ animationDelay: '-1.5s' }}
                    />
                  </div>
                  <p className="mt-1 text-center font-medium text-white text-sm">TERA</p>
                </div>
              </div>
              
              {/* TRUTH Token - Position 135 degrees */}
              <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] animate-[spin_35s_linear_infinite] [animation-delay:_-10s]">
                <div className="absolute top-[20px] left-[120px] transform -translate-y-1/2">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-600/80 to-blue-600/80 shadow-lg animate-[glow-pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '-3s' }}>
                    <svg className="w-12 h-12 text-white animate-[pulse-slow_4s_ease-in-out_infinite]" style={{ animationDelay: '-2.5s' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="mt-1 text-center font-medium text-white text-sm">TRUTH</p>
                </div>
              </div>
              
              {/* VOICE Token - Position 180 degrees */}
              <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] animate-[spin_35s_linear_infinite] [animation-delay:_-15s]">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-600/80 to-teal-600/80 shadow-lg animate-[glow-pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '-0.5s' }}>
                    <svg className="w-12 h-12 text-white animate-[pulse-slow_4s_ease-in-out_infinite]" style={{ animationDelay: '-1s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <p className="mt-1 text-center font-medium text-white text-sm">VOICE</p>
                </div>
              </div>
              
              {/* LEGACY Token - Position 225 degrees */}
              <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] animate-[spin_35s_linear_infinite] [animation-delay:_-20s]">
                <div className="absolute bottom-[20px] right-[120px] transform translate-y-1/2">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-yellow-600/80 to-amber-600/80 shadow-lg animate-[glow-pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '-1.5s' }}>
                    <svg className="w-12 h-12 text-white animate-[pulse-slow_4s_ease-in-out_infinite]" style={{ animationDelay: '-2s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="mt-1 text-center font-medium text-white text-sm">LEGACY</p>
                </div>
              </div>
              
              {/* UNITY Token - Position 270 degrees */}
              <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] animate-[spin_35s_linear_infinite] [animation-delay:_-25s]">
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600/80 to-pink-600/80 shadow-lg animate-[glow-pulse_3s_ease-in-out_infinite]">
                    <svg className="w-12 h-12 text-white animate-[pulse-slow_4s_ease-in-out_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="mt-1 text-center font-medium text-white text-sm">UNITY</p>
                </div>
              </div>
              
              {/* WITNESS Token - Position 315 degrees */}
              <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] animate-[spin_35s_linear_infinite] [animation-delay:_-30s]">
                <div className="absolute top-[20px] right-[100px] transform translate-y-1/2">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600/80 to-indigo-600/80 shadow-lg animate-[glow-pulse_3s_ease-in-out_infinite]">
                    <svg className="w-12 h-12 text-white animate-[pulse-slow_4s_ease-in-out_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="mt-1 text-center font-medium text-white text-sm">WITNESS</p>
                </div>
              </div>
              
              {/* CIVIL Token - Position 330 degrees */}
              <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] animate-[spin_35s_linear_infinite] [animation-delay:_-33s]">
                <div className="absolute top-[10px] right-[140px] transform translate-y-1/2">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600/80 to-indigo-600/80 shadow-lg animate-[glow-pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '-2.5s' }}>
                    <svg className="w-12 h-12 text-white animate-[pulse-slow_4s_ease-in-out_infinite]" style={{ animationDelay: '-1.8s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="mt-1 text-center font-medium text-white text-sm">CIVIL</p>
                </div>
              </div>
              
              {/* JUSTICE Token - Position 345 degrees */}
              <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] animate-[spin_35s_linear_infinite] [animation-delay:_-35s]">
                <div className="absolute top-[15px] right-[80px] transform translate-y-1/2">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600/80 to-fuchsia-600/80 shadow-lg animate-[glow-pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '-3.5s' }}>
                    <svg className="w-12 h-12 text-white animate-[pulse-slow_4s_ease-in-out_infinite]" style={{ animationDelay: '-3s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3H7a2 2 0 0 0-2 2v16"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3h1a2 2 0 0 1 2 2v16"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 21h14"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7H5"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v14"></path>
                    </svg>
                  </div>
                  <p className="mt-1 text-center font-medium text-white text-sm">JUSTICE</p>
                </div>
              </div>
              
              {/* Bitcoin in the orbit */}
              <div className="absolute left-1/2 top-1/2 w-[450px] h-[450px] animate-[spin_45s_linear_infinite_reverse]">
                <div className="absolute bottom-[80px] right-[50px] transform translate-y-1/2">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500/80 to-yellow-400/80 shadow-lg animate-[glow-pulse_3s_ease-in-out_infinite]">
                    <Bitcoin className="w-12 h-12 text-white animate-[pulse-slow_4s_ease-in-out_infinite]" />
                  </div>
                  <p className="mt-1 text-center font-medium text-white text-sm">Bitcoin</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Token Section */}
        <section className="py-16 bg-gradient-to-r from-gray-900 to-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white" style={{ fontFamily: "'Exo 2', sans-serif" }}>
              Our Token <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Ecosystem</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {/* KLOUDBUGS Core Token */}
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:shadow-green-500/10 h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-600/20 to-teal-600/20 rounded-bl-full blur-xl"></div>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full flex-shrink-0 bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center shadow-lg">
                      <img src="/lady-bean.png" alt="KLOUDBUGS Core Token" className="w-14 h-14 object-cover" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">KLOUDBUGS Core Token</h3>
                      <p className="text-gray-300 mb-4">The official governance token of the KLOUDBUGS ecosystem</p>
                      <p className="text-gray-400 mb-6">
                        Our flagship token that powers the entire KLOUDBUGS platform. It combines the charm of our coffee bean character with the energy of our cannabis leaf design. This token grants governance rights, revenue sharing, and exclusive access to premium features across our ecosystem.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-black/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Total Supply</p>
                          <p className="text-white font-semibold">10,000,000 KBGT</p>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Initial Distribution</p>
                          <p className="text-white font-semibold">Community & Stakers</p>
                        </div>
                      </div>
                      <Link href="/kloudbugs-token">
                        <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                          Explore Core Token
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* MPT Token */}
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:shadow-purple-500/10 h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-bl-full blur-xl"></div>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                      <img src="/logo1.png" alt="MPT Token" className="w-14 h-14 object-cover" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Mining Power Token (MPT)</h3>
                      <p className="text-gray-300 mb-4">The foundation of our mining ecosystem</p>
                      <p className="text-gray-400 mb-6">
                        MPT represents your hashrate share in the KLOUD-BUGS MINING CAFE PLATFORM. Each token grants you mining power allocation and a proportional share of mining rewards. MPT token holders receive priority access to new mining features and exclusive platform benefits.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-black/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Total Supply</p>
                          <p className="text-white font-semibold">1,000,000 MPT</p>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Initial Distribution</p>
                          <p className="text-white font-semibold">Mining Subscribers</p>
                        </div>
                      </div>
                      <Link href="/token">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* TERA Token */}
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:shadow-yellow-500/10 h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-bl-full blur-xl"></div>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full flex-shrink-0 bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center shadow-lg">
                      <img src="/tera-logo.png" alt="TERA Token" className="w-14 h-14 object-cover" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">TERA Token</h3>
                      <p className="text-gray-300 mb-4">Supporting families seeking justice worldwide</p>
                      <p className="text-gray-400 mb-6">
                        Our Civil Rights token dedicated to helping families that need answers and assistance. TERA drives our social mission, with proceeds allocated to providing resources and support to families worldwide seeking justice. TERA represents our commitment to making a positive difference beyond cryptocurrency.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-black/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Social Impact</p>
                          <p className="text-white font-semibold">Justice Support</p>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Fund Allocation</p>
                          <p className="text-white font-semibold">Legal Aid & Resources</p>
                        </div>
                      </div>
                      <Link href="/tera-info">
                        <Button className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Social Justice Token Family */}
            <h3 className="text-2xl font-bold text-center mb-8 text-white">Social Justice Token Family</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {/* TRUTH Token */}
              <Card className="bg-gray-900 border-gray-700 hover:border-cyan-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">TRUTH Token</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Dedicated to supporting fact-finding missions and investigations to uncover truth in situations where facts have been obscured. TRUTH token helps fund transparency initiatives and independent research.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Utility</span>
                    <span className="text-cyan-400">Fact-finding Support</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* VOICE Token */}
              <Card className="bg-gray-900 border-gray-700 hover:border-green-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">VOICE Token</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Empowers marginalized communities by amplifying their messages and concerns. VOICE token supports advocacy programs, media access, and communication channels for those who often go unheard.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Utility</span>
                    <span className="text-green-400">Advocacy Support</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* LEGACY Token */}
              <Card className="bg-gray-900 border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">LEGACY Token</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Preserves the stories and histories of families affected by injustice, ensuring their experiences aren't forgotten. LEGACY token funds historical documentation, archiving, and educational initiatives.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Utility</span>
                    <span className="text-yellow-400">Historical Preservation</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* UNITY Token */}
              <Card className="bg-gray-900 border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">UNITY Token</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Builds bridges between diverse communities and organizations to create stronger alliances for change. UNITY token supports coalition building, collaborative projects, and community engagement initiatives.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Utility</span>
                    <span className="text-purple-400">Community Building</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* WITNESS Token */}
              <Card className="bg-gray-900 border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">WITNESS Token</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Supports those who come forward to share their experiences and testify about injustices they've witnessed. WITNESS token provides resources for witness protection, legal support, and testimony facilitation.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Utility</span>
                    <span className="text-blue-400">Testimony Support</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* CMPT Token */}
              <Card className="bg-gray-900 border-gray-700 hover:border-red-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">CMPT Token</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Civil Mining Power Token (CMPT) is based on a special algorithm created by the KLOUD-BUGS digital creation team, which is owned by LE LUXE LLC. It mines at the fastest cloud mining rate in the world. This token represents civil rights empowerment through blockchain technology. CMPT can be used to make Bitcoin or its own token for civil rights initiatives. Users can either mine it directly with our AI-powered mining system or create it themselves, giving flexibility and ownership in the process of supporting social justice.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Utility</span>
                    <span className="text-red-400">Mining & Creation</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* CIVIL Token */}
              <Card className="bg-gray-900 border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">CIVIL Token</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Focused specifically on civil rights initiatives, supporting legal advocacy, education about rights, and community organizing for civil rights causes. CIVIL token helps fund workshops, community education, and grassroots organizing.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Utility</span>
                    <span className="text-blue-400">Rights Advocacy</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* JUSTICE Token */}
              <Card className="bg-gray-900 border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                        <path d="M8 3H7a2 2 0 0 0-2 2v16"></path>
                        <path d="M12 3h1a2 2 0 0 1 2 2v16"></path>
                        <path d="M5 21h14"></path>
                        <path d="M19 7H5"></path>
                        <path d="M12 7v14"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">JUSTICE Token</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Focused on legal proceedings, supporting court cases, providing legal aid to families in need, and funding investigative work related to justice issues. JUSTICE token helps secure legal representation for those who cannot afford it.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Utility</span>
                    <span className="text-purple-400">Legal Support</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* KLOUD-BUGS Token */}
              <Card className="bg-gray-900 border-gray-700 hover:border-indigo-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">KLOUD-BUGS</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    The governance token of our platform, providing holders with voting rights on platform decisions and future development. Powers the mining cafe ecosystem and provides exclusive benefits to holders.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Utility</span>
                    <span className="text-indigo-400">Platform Governance</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Bitcoin Section */}
            <div className="bg-gradient-to-r from-orange-900/20 to-black p-8 rounded-xl border border-orange-900/30 mb-16">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/4 flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg">
                    <Bitcoin className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-2xl font-bold text-white mb-4">Bitcoin Integration</h3>
                  <p className="text-gray-300 mb-6">
                    At the heart of our ecosystem is Bitcoin - the primary mining output of our platform. All mining rewards are paid directly to your hardware wallet in Bitcoin, ensuring maximum security and true ownership of your assets.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/30 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Mining Rewards</p>
                      <p className="text-white font-semibold">Direct BTC Payments</p>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Wallet Security</p>
                      <p className="text-white font-semibold">Hardware Wallet Integration</p>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Puzzle Scanning</p>
                      <p className="text-white font-semibold">Lost Fund Recovery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Token Utility & Allocation */}
        <section className="py-16 bg-gradient-to-br from-black to-purple-950/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-white" style={{ fontFamily: "'Exo 2', sans-serif" }}>
              Token <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Utility & Allocation</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Token Utility */}
              <div>
                <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-purple-500 pl-4">Token Utility</h3>
                <div className="space-y-6">
                  <div className="bg-gray-900/70 p-6 rounded-lg border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
                    <h4 className="text-xl font-semibold text-white mb-4">Platform Governance</h4>
                    <p className="text-gray-400">
                      Token holders can participate in platform decisions, voting on new features, improvements, and strategic direction for the KLOUD-BUGS MINING CAFE PLATFORM.
                    </p>
                  </div>
                  
                  <div className="bg-gray-900/70 p-6 rounded-lg border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
                    <h4 className="text-xl font-semibold text-white mb-4">Mining Power Allocation</h4>
                    <p className="text-gray-400">
                      MPT tokens represent your share of mining power in our collective pool, determining your proportional mining rewards and platform benefits.
                    </p>
                  </div>
                  
                  <div className="bg-gray-900/70 p-6 rounded-lg border border-gray-800 hover:border-yellow-500/50 transition-all duration-300">
                    <h4 className="text-xl font-semibold text-white mb-4">Social Impact Funding</h4>
                    <p className="text-gray-400">
                      Our social justice token family (TERA, CIVIL, JUSTICE, CMPT, etc.) directs funds to specific causes and initiatives supporting families seeking justice worldwide, from civil rights education to legal representation.
                    </p>
                  </div>
                  
                  <div className="bg-gray-900/70 p-6 rounded-lg border border-gray-800 hover:border-red-500/50 transition-all duration-300">
                    <h4 className="text-xl font-semibold text-white mb-4">Civil Mining Power</h4>
                    <p className="text-gray-400">
                      The CMPT token, created by the KLOUD-BUGS digital creation team (owned by LE LUXE LLC), provides a dual approach with the fastest cloud mining rate in the world. Users can either mine it directly using our AI-powered mining system or create it themselves through our platform. This flexibility allows for greater participation in the civil rights empowerment ecosystem.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Token Allocation */}
              <div>
                <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-blue-500 pl-4">Token Allocation</h3>
                <div className="space-y-6">
                  <div className="bg-gray-900/70 p-6 rounded-lg border border-gray-800">
                    <h4 className="text-xl font-semibold text-white mb-4">MPT Distribution</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Mining Subscribers</span>
                        <span className="text-white font-medium">60%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-400">Platform Development</span>
                        <span className="text-white font-medium">25%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-400">Community Rewards</span>
                        <span className="text-white font-medium">15%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/70 p-6 rounded-lg border border-gray-800">
                    <h4 className="text-xl font-semibold text-white mb-4">TERA Social Impact Fund</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Legal Aid & Resources</span>
                        <span className="text-white font-medium">45%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-yellow-600 to-amber-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-400">Community Support</span>
                        <span className="text-white font-medium">35%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-400">Awareness Campaigns</span>
                        <span className="text-white font-medium">20%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-pink-600 to-purple-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-t border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Join Our Token Ecosystem
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Be part of a revolutionary platform that combines mining efficiency with social impact
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/mining">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8">
                  Subscribe to Mining Plans
                </Button>
              </Link>
              <Link href="/token">
                <Button variant="outline" size="lg" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                  Learn About Token Benefits
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </WebsiteLayout>
  );
}