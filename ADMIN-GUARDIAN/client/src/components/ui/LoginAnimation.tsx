import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface LoginAnimationProps {
  onComplete: () => void;
  username?: string;
}

export function LoginAnimation({ onComplete, username: propUsername }: LoginAnimationProps) {
  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(10);
  const [username, setUsername] = useState(propUsername || '');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const { user } = useAuth();
  
  // Check if this is an admin login and reset any user tracking references
  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'admin' || username === 'admin') {
      setIsAdminLogin(true);
    }
  }, [user, username]);
  
  // Video-like animation effect with consistent frame rate and progress tracking
  useEffect(() => {
    const totalDuration = isAdminLogin ? 8000 : 8400;  // Total animation duration in ms
    const frameRate = 30;  // Frames per second for smooth video-like playback
    const interval = 1000 / frameRate;  // ms between frames
    const totalFrames = totalDuration / interval;
    
    // Animation frame handler
    let frame = 0;
    const animationInterval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setVideoProgress(progress);
      
      // Trigger steps at specific progress points
      if (isAdminLogin) {
        // Admin animation sequence with more advanced transitions
        if (progress >= 0.125 && step < 2) setStep(2); // Bean logo appears with special effect
        if (progress >= 0.25 && step < 3) setStep(3);  // Bean transforms with admin badge
        if (progress >= 0.375 && step < 4) setStep(4); // Bean enters advanced command center
        if (progress >= 0.5 && step < 5) setStep(5);   // Command center activation
        if (progress >= 0.625 && step < 6) setStep(6); // System access sequence
        if (progress >= 0.75 && step < 7) setStep(7);  // Admin control interface
        if (progress >= 0.875 && step < 8) setStep(8); // System connection
        if (progress >= 1) {
          clearInterval(animationInterval);
          onComplete();
        }
      } else {
        // Standard user animation sequence with smoother transitions
        if (progress >= 0.14 && step < 2) setStep(2);  // Bean logo appears
        if (progress >= 0.28 && step < 3) setStep(3);  // Bean puts on helmet
        if (progress >= 0.42 && step < 4) setStep(4);  // Bean gets in spaceship
        if (progress >= 0.56 && step < 5) setStep(5);  // Spaceship blast off
        if (progress >= 0.70 && step < 6) setStep(6);  // Hyperspace travel
        if (progress >= 0.85 && step < 7) setStep(7);  // Arrival at network
        if (progress >= 1) {
          clearInterval(animationInterval);
          onComplete();
        }
      }
    }, interval);
    
    // Cleanup function
    return () => clearInterval(animationInterval);
  }, [onComplete, isAdminLogin, step]);
  
  // Set countdown timer for account loading simulation
  useEffect(() => {
    // Only show countdown timer in later animation steps
    if (step >= 5) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdownInterval);
    }
  }, [step]);
  
  // Track username from URL or session if available
  useEffect(() => {
    if (user && user.username) {
      setUsername(user.username);
    } else {
      // Try to get username from sessionStorage as fallback
      const storedUsername = sessionStorage.getItem('lastUsername');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [user]);

  // Create galaxy particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 8 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 5 + 3,
    color: [
      'rgba(147, 51, 234, 0.7)',
      'rgba(79, 70, 229, 0.7)',
      'rgba(59, 130, 246, 0.7)',
      'rgba(16, 185, 129, 0.7)',
      'rgba(236, 72, 153, 0.7)'
    ][Math.floor(Math.random() * 5)]
  }));
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" 
        style={{ 
          background: 'linear-gradient(to bottom, #000000, #050520, #0a0a2a, #0f0f35)' 
        }}>
        {/* Stars background */}
        <div className="stars-small absolute inset-0"></div>
        <div className="stars-medium absolute inset-0"></div>
        <div className="stars-large absolute inset-0"></div>
        
        {/* Galaxy particles */}
        {step >= 3 && particles.map(particle => (
          <motion.div 
            key={particle.id}
            className="absolute rounded-full"
            style={{ 
              width: `${particle.size}px`, 
              height: `${particle.size}px`, 
              background: particle.color,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0, 1, 1.5, 0],
              x: [0, Math.random() * 100 - 50, Math.random() * 200 - 100],
              y: [0, Math.random() * 100 - 50, Math.random() * 200 - 100],
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: particle.duration, 
              delay: particle.delay,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        ))}
        
        {/* Bean character animation sequence */}
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
          {/* Step 1: Bean logo appears */}
          <AnimatePresence>
            {step >= 1 && step < 3 && (
              <motion.div 
                className="absolute z-30"
                initial={{ scale: 0.2, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ 
                      boxShadow: [
                        '0 0 20px rgba(79, 70, 229, 0.3)', 
                        '0 0 40px rgba(79, 70, 229, 0.6)', 
                        '0 0 20px rgba(79, 70, 229, 0.3)'
                      ] 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: '100%', height: '100%' }}
                  />
                  <img 
                    src="/logo1.png" 
                    alt="KLOUD-BUGS Bean Character" 
                    className="w-40 h-40 object-contain relative z-10"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Step 2: Bean puts on astronaut helmet */}
          <AnimatePresence>
            {step >= 2 && step < 4 && (
              <motion.div 
                className="absolute z-30"
                initial={step === 2 ? { scale: 1, opacity: 0, y: 0 } : { scale: 0.2, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="relative flex flex-col items-center">
                  {/* Bean with helmet animation */}
                  <div className="relative">
                    <img 
                      src="/logo1.png" 
                      alt="KLOUD-BUGS Bean Character" 
                      className="w-40 h-40 object-contain relative z-10"
                    />
                    
                    {/* Animated helmet appearing and settling on bean's head */}
                    <motion.div 
                      className="absolute top-0 left-0 w-full h-full z-20"
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                    >
                      <svg width="160" height="160" viewBox="0 0 160 160" className="absolute top-0 left-0" style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))' }}>
                        {/* Simplified astronaut helmet shape */}
                        <motion.path 
                          d="M80 20 C40 20, 30 60, 30 100 C30 130, 50 140, 80 140 C110 140, 130 130, 130 100 C130 60, 120 20, 80 20 Z" 
                          fill="none" 
                          stroke="rgba(59, 130, 246, 0.8)" 
                          strokeWidth="3"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2 }}
                        />
                        <motion.ellipse 
                          cx="80" 
                          cy="70" 
                          rx="40" 
                          ry="35" 
                          fill="rgba(59, 130, 246, 0.15)" 
                          stroke="rgba(59, 130, 246, 0.8)" 
                          strokeWidth="2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                        />
                      </svg>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <span 
                      className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600"
                      style={{ 
                        fontFamily: "'Orbitron', sans-serif",
                        textShadow: '0 0 15px rgba(137, 78, 234, 0.7)'
                      }}
                    >
                      PREPARING FOR LAUNCH
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Step 3: Bean enters spacecraft */}
          <AnimatePresence>
            {step >= 3 && step < 5 && (
              <motion.div 
                className="absolute z-30"
                initial={step === 3 ? { scale: 1, opacity: 0, y: 0 } : { scale: 0.2, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -30 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="relative flex flex-col items-center">
                  {/* Simple spaceship with bean character */}
                  <div className="relative w-64 h-64">
                    {/* Spaceship body */}
                    <motion.div 
                      className="absolute"
                      style={{
                        width: '180px',
                        height: '140px',
                        borderRadius: '80px 80px 20px 20px',
                        background: 'linear-gradient(135deg, #2c3e50, #1a1a2e)',
                        border: '2px solid rgba(59, 130, 246, 0.8)',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
                        overflow: 'hidden'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      {/* Window of the spaceship */}
                      <motion.div 
                        className="absolute"
                        style={{
                          width: '100px',
                          height: '60px',
                          borderRadius: '50px 50px 10px 10px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          border: '2px solid rgba(59, 130, 246, 0.8)',
                          left: '50%',
                          top: '30px',
                          transform: 'translateX(-50%)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      />
                      
                      {/* Bean sitting in spaceship */}
                      <motion.div
                        className="absolute"
                        style={{
                          left: '50%',
                          top: '40px',
                          transform: 'translateX(-50%)',
                          zIndex: 5
                        }}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      >
                        <img 
                          src="/logo1.png" 
                          alt="KLOUD-BUGS Bean Character" 
                          className="w-20 h-20 object-contain"
                        />
                      </motion.div>
                    </motion.div>
                    
                    {/* Spaceship wings */}
                    <motion.div 
                      className="absolute"
                      style={{
                        width: '240px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                        left: '50%',
                        top: '110px',
                        transform: 'translateX(-50%)',
                        boxShadow: '0 0 15px rgba(99, 102, 241, 0.8)'
                      }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    />
                    
                    {/* Thruster flames animation */}
                    <motion.div
                      className="absolute"
                      style={{
                        width: '60px',
                        height: '30px',
                        borderRadius: '0 0 30px 30px',
                        background: 'linear-gradient(to bottom, #f97316, #ef4444, #7c2d12)',
                        left: '50%',
                        bottom: '20px',
                        transform: 'translateX(-50%)',
                        filter: 'blur(5px)'
                      }}
                      animate={{ 
                        height: ['30px', '50px', '30px'],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 0.8, 
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                    />
                  </div>
                  
                  <motion.div 
                    className="mt-10 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <span 
                      className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600"
                      style={{ 
                        fontFamily: "'Orbitron', sans-serif",
                        textShadow: '0 0 15px rgba(137, 78, 234, 0.7)'
                      }}
                    >
                      INITIATING LAUNCH SEQUENCE
                    </span>
                    <motion.div 
                      className="mt-3 mx-auto h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Step 4: Spaceship blasts off */}
          <AnimatePresence>
            {step >= 4 && step < 6 && (
              <motion.div 
                className="absolute inset-0 z-30 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Blast off effect with flames and particles */}
                <motion.div
                  className="relative w-full max-w-md"
                  initial={{ y: 0 }}
                  animate={{ y: -500 }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  {/* Same spaceship from previous step */}
                  <div className="relative w-64 h-64 mx-auto">
                    {/* Spaceship body */}
                    <div 
                      className="absolute"
                      style={{
                        width: '180px',
                        height: '140px',
                        borderRadius: '80px 80px 20px 20px',
                        background: 'linear-gradient(135deg, #2c3e50, #1a1a2e)',
                        border: '2px solid rgba(59, 130, 246, 0.8)',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Window of the spaceship */}
                      <div 
                        className="absolute"
                        style={{
                          width: '100px',
                          height: '60px',
                          borderRadius: '50px 50px 10px 10px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          border: '2px solid rgba(59, 130, 246, 0.8)',
                          left: '50%',
                          top: '30px',
                          transform: 'translateX(-50%)',
                        }}
                      />
                      
                      {/* Bean sitting in spaceship */}
                      <div
                        className="absolute"
                        style={{
                          left: '50%',
                          top: '40px',
                          transform: 'translateX(-50%)',
                          zIndex: 5
                        }}
                      >
                        <img 
                          src="/logo1.png" 
                          alt="KLOUD-BUGS Bean Character" 
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                    </div>
                    
                    {/* Spaceship wings */}
                    <div 
                      className="absolute"
                      style={{
                        width: '240px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                        left: '50%',
                        top: '110px',
                        transform: 'translateX(-50%)',
                        boxShadow: '0 0 15px rgba(99, 102, 241, 0.8)'
                      }}
                    />
                    
                    {/* Enhanced thruster flames for blast off */}
                    <motion.div
                      className="absolute"
                      style={{
                        width: '100px',
                        height: '120px',
                        borderRadius: '0 0 50px 50px',
                        background: 'linear-gradient(to bottom, #f97316, #ef4444, #7c2d12)',
                        left: '50%',
                        bottom: '-100px',
                        transform: 'translateX(-50%)',
                        filter: 'blur(8px)'
                      }}
                      animate={{ 
                        height: ['120px', '200px', '150px'],
                        width: ['100px', '120px', '100px'],
                        opacity: [0.8, 1, 0.9]
                      }}
                      transition={{ 
                        duration: 0.5, 
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                    />
                  </div>
                </motion.div>
                
                {/* Blast text */}
                <motion.div 
                  className="absolute bottom-20 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h1 
                    className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600"
                    style={{ 
                      fontFamily: "'Orbitron', sans-serif",
                      textShadow: '0 0 20px rgba(137, 78, 234, 0.7)'
                    }}
                  >
                    BLAST OFF!
                  </h1>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Step 5-6: Hyperspace travel */}
          <AnimatePresence>
            {step >= 5 && step < 7 && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="absolute w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 70%, rgba(0, 0, 0, 0.8) 100%)'
                  }}
                />
                
                {/* Hyperspace streaks */}
                {Array.from({ length: 100 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-white rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      width: `${Math.random() * 2 + 1}px`,
                      height: `${Math.random() * 30 + 10}px`,
                      opacity: Math.random() * 0.7 + 0.3,
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      scaleX: 0.1,
                      opacity: 0
                    }}
                    animate={{ 
                      x: `${(Math.random() - 0.5) * window.innerWidth * 2}px`,
                      y: `${(Math.random() - 0.5) * window.innerHeight * 2}px`,
                      scaleX: [0.1, 15],
                      opacity: [0, 0.9, 0]
                    }}
                    transition={{ 
                      duration: Math.random() * 1.5 + 1, 
                      delay: Math.random() * 0.2,
                      ease: "linear",
                      repeat: 1,
                      repeatType: "loop"
                    }}
                  />
                ))}
                
                {/* Spaceship in the center */}
                <motion.div
                  className="relative w-48 h-48 z-50"
                  animate={{ 
                    rotate: [-5, 5, -5],
                    y: [-10, 10, -10]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {/* Simplified spaceship with glow effect */}
                  <div 
                    className="w-40 h-32 mx-auto"
                    style={{
                      borderRadius: '70px 70px 10px 10px',
                      background: 'linear-gradient(135deg, #2c3e50, #1a1a2e)',
                      border: '2px solid rgba(59, 130, 246, 0.8)',
                      boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Window with Bean visible */}
                    <div 
                      className="absolute"
                      style={{
                        width: '80px',
                        height: '50px',
                        borderRadius: '40px 40px 5px 5px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '2px solid rgba(59, 130, 246, 0.8)',
                        left: '50%',
                        top: '20px',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      <img 
                        src="/logo1.png" 
                        alt="KLOUD-BUGS Bean Character" 
                        className="w-16 h-16 object-contain absolute -top-3 left-1/2 transform -translate-x-1/2"
                      />
                    </div>
                  </div>
                  
                  {/* Small engine glow */}
                  <motion.div
                    className="absolute bottom-3 left-1/2 transform -translate-x-1/2"
                    style={{
                      width: '20px',
                      height: '10px',
                      borderRadius: '0 0 10px 10px',
                      background: 'linear-gradient(to bottom, #3b82f6, #8b5cf6)',
                      filter: 'blur(5px)'
                    }}
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  />
                </motion.div>
                
                {/* Text indicator */}
                <motion.div 
                  className="absolute bottom-20 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <h2 
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600"
                    style={{ 
                      fontFamily: "'Orbitron', sans-serif",
                      textShadow: '0 0 15px rgba(137, 78, 234, 0.7)'
                    }}
                  >
                    ENTERING KLOUD-BUGS NETWORK
                  </h2>
                  <motion.div 
                    className="mt-3 mx-auto h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Step 7: Final arrival at network */}
          <AnimatePresence>
            {step >= 7 && (
              <motion.div 
                className="absolute inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ 
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)' 
                  }}
                />
                
                {/* Network visualization - simplified nodes and connections */}
                <div className="relative w-full h-full overflow-hidden">
                  {/* Network nodes */}
                  {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${Math.random() * 20 + 10}px`,
                        height: `${Math.random() * 20 + 10}px`,
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        left: `${Math.random() * 80 + 10}%`,
                        top: `${Math.random() * 80 + 10}%`,
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)'
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: Math.random() * 0.5
                      }}
                    />
                  ))}
                  
                  {/* Bean with dashboard controls at the center */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <div className="relative">
                      <img 
                        src="/logo1.png" 
                        alt="KLOUD-BUGS Bean Character" 
                        className="w-32 h-32 object-contain relative z-10"
                      />
                      
                      {/* Holographic control panel around Bean */}
                      <motion.div
                        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-20 rounded-lg"
                        style={{
                          background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                          border: '1px solid rgba(59, 130, 246, 0.5)',
                          boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                          overflow: 'hidden'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                      >
                        {/* Simulated control buttons */}
                        <div className="flex justify-around items-center h-full px-4">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-8 h-8 rounded-full"
                              style={{
                                background: [
                                  'rgba(59, 130, 246, 0.7)',
                                  'rgba(139, 92, 246, 0.7)',
                                  'rgba(236, 72, 153, 0.7)',
                                  'rgba(16, 185, 129, 0.7)'
                                ][i],
                                boxShadow: `0 0 10px ${[
                                  'rgba(59, 130, 246, 0.8)',
                                  'rgba(139, 92, 246, 0.8)',
                                  'rgba(236, 72, 153, 0.8)',
                                  'rgba(16, 185, 129, 0.8)'
                                ][i]}`
                              }}
                              animate={{ 
                                scale: [1, 1.2, 1], 
                              }}
                              transition={{ 
                                duration: 1.5, 
                                delay: i * 0.2,
                                repeat: Infinity,
                                repeatType: 'reverse'
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div
                  className="absolute z-10 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                >
                  <h1 
                    className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600"
                    style={{ 
                      fontFamily: "'Orbitron', sans-serif",
                      textShadow: '0 0 30px rgba(137, 78, 234, 0.8)'
                    }}
                  >
                    ACCESS GRANTED
                  </h1>
                  <motion.p
                    className="mt-4 text-xl text-blue-200"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2 }}
                  >
                    Welcome to the KLOUD-BUGS mining network
                  </motion.p>
                  <motion.div 
                    className="mt-6 mx-auto h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "60%" }}
                    transition={{ duration: 0.8, delay: 1.8 }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatePresence>
  );
}

export default LoginAnimation;