import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RobotAnimationProps {
  onComplete: () => void;
  username?: string;
}

export function RobotAnimation({ onComplete, username }: RobotAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<number>(0);
  const [messages, setMessages] = useState<string[]>([
    "Initializing KLOUD-BUGS system...",
    "Booting up mining protocols...",
    "Loading AI neural engine...",
    "Connecting to cosmic network...",
    "Synchronizing with blockchain...",
    "KLOUD-BUGS system online!"
  ]);
  const [currentMessage, setCurrentMessage] = useState<string>(messages[0]);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [robotEyes, setRobotEyes] = useState<boolean>(false);
  const [robotPowered, setRobotPowered] = useState<boolean>(false);
  const [robotMoving, setRobotMoving] = useState<boolean>(false);
  const [robotFully, setRobotFully] = useState<boolean>(false);
  const [particles, setParticles] = useState<any[]>([]);
  
  // Generate random particles for energy/power effect
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 0.5,
      color: [
        'rgba(0, 200, 255, 0.7)',
        'rgba(50, 120, 255, 0.6)',
        'rgba(100, 150, 255, 0.5)',
        'rgba(150, 200, 255, 0.4)'
      ][Math.floor(Math.random() * 4)]
    }));
    
    setParticles(newParticles);
  }, []);
  
  // Main animation sequence controller
  useEffect(() => {
    // Animation timeline
    const timeline = [
      { time: 0, action: () => setPhase(0), messageIndex: 0 },
      { time: 2000, action: () => setRobotEyes(true), messageIndex: 1 },
      { time: 3000, action: () => setRobotPowered(true), messageIndex: 2 },
      { time: 5000, action: () => setRobotMoving(true), messageIndex: 3 },
      { time: 7000, action: () => setRobotFully(true), messageIndex: 4 },
      { time: 8500, action: () => setPhase(1), messageIndex: 5 },
      { time: 10000, action: () => onComplete() }
    ];
    
    // Set up timers for each step in the timeline
    const timers = timeline.map(({ time, action, messageIndex }) => 
      setTimeout(() => {
        action();
        if (messageIndex !== undefined) {
          setCurrentMessage(messages[messageIndex]);
        }
      }, time)
    );
    
    // Animation for loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);
    
    // Clean up all timers
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      clearInterval(progressInterval);
    };
  }, [onComplete, messages]);
  
  // Canvas animation for energy particles
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation particles
    const particlesArray: any[] = [];
    for (let i = 0; i < 100; i++) {
      particlesArray.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        color: [
          `rgba(70, 50, 220, ${0.3 + Math.random() * 0.5})`,  // Deep purple
          `rgba(40, 80, 250, ${0.3 + Math.random() * 0.5})`,  // Blue
          `rgba(120, 50, 220, ${0.3 + Math.random() * 0.5})`, // Purple
          `rgba(20, 100, 220, ${0.3 + Math.random() * 0.5})`, // Blue-ish
          `rgba(100, 40, 180, ${0.3 + Math.random() * 0.5})`, // Purple-blue
        ][Math.floor(Math.random() * 5)]
      });
    }
    
    // Draw circuit lines in the background
    const drawCircuitLines = () => {
      ctx.strokeStyle = 'rgba(0, 100, 200, 0.2)';
      ctx.lineWidth = 1;
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        
        // Create randomized path
        let x = 0;
        while (x < canvas.width) {
          const length = Math.random() * 100 + 50;
          const height = Math.random() * 20 - 10;
          
          x += length;
          ctx.lineTo(x, y + height);
          
          // Sometimes add vertical connections
          if (Math.random() > 0.7) {
            const vertHeight = Math.random() * 50 + 20;
            const direction = Math.random() > 0.5 ? 1 : -1;
            
            ctx.lineTo(x, y + height + (vertHeight * direction));
            ctx.lineTo(x + 20, y + height + (vertHeight * direction));
            x += 20;
          }
        }
        
        ctx.stroke();
      }
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        
        // Create randomized path
        let y = 0;
        while (y < canvas.height) {
          const length = Math.random() * 100 + 50;
          const width = Math.random() * 20 - 10;
          
          y += length;
          ctx.lineTo(x + width, y);
          
          // Sometimes add horizontal connections
          if (Math.random() > 0.7) {
            const horizWidth = Math.random() * 50 + 20;
            const direction = Math.random() > 0.5 ? 1 : -1;
            
            ctx.lineTo(x + width + (horizWidth * direction), y);
            ctx.lineTo(x + width + (horizWidth * direction), y + 20);
            y += 20;
          }
        }
        
        ctx.stroke();
      }
    };
    
    let robotEyeIntensity = 0;
    let robotPowerLevel = 0;
    
    // Draw the robot
    const drawRobot = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const robotSize = Math.min(canvas.width, canvas.height) * 0.4;
      
      // Draw robot head
      ctx.save();
      ctx.translate(centerX, centerY - robotSize * 0.2);
      
      // Robot head
      ctx.fillStyle = 'rgba(20, 30, 40, 0.9)';
      ctx.strokeStyle = 'rgba(80, 70, 255, 0.8)'; // Blue-purple glow
      ctx.lineWidth = 3;
      
      // Head shape
      ctx.beginPath();
      ctx.rect(-robotSize * 0.25, -robotSize * 0.25, robotSize * 0.5, robotSize * 0.5);
      ctx.fill();
      ctx.stroke();
      
      // Eyes
      if (robotEyes) {
        // Animate eyes powering up
        if (robotEyeIntensity < 1) {
          robotEyeIntensity += 0.02;
        }
        
        // Left eye
        ctx.beginPath();
        ctx.arc(-robotSize * 0.1, -robotSize * 0.05, robotSize * 0.05, 0, Math.PI * 2);
        const leftEyeGradient = ctx.createRadialGradient(
          -robotSize * 0.1, -robotSize * 0.05, 0,
          -robotSize * 0.1, -robotSize * 0.05, robotSize * 0.1
        );
        leftEyeGradient.addColorStop(0, `rgba(100, 80, 255, ${robotEyeIntensity})`);
        leftEyeGradient.addColorStop(1, `rgba(50, 20, 150, ${robotEyeIntensity * 0.1})`);
        ctx.fillStyle = leftEyeGradient;
        ctx.fill();
        
        // Right eye
        ctx.beginPath();
        ctx.arc(robotSize * 0.1, -robotSize * 0.05, robotSize * 0.05, 0, Math.PI * 2);
        const rightEyeGradient = ctx.createRadialGradient(
          robotSize * 0.1, -robotSize * 0.05, 0,
          robotSize * 0.1, -robotSize * 0.05, robotSize * 0.1
        );
        rightEyeGradient.addColorStop(0, `rgba(100, 80, 255, ${robotEyeIntensity})`);
        rightEyeGradient.addColorStop(1, `rgba(50, 20, 150, ${robotEyeIntensity * 0.1})`);
        ctx.fillStyle = rightEyeGradient;
        ctx.fill();
      }
      
      // Mouth/grid
      ctx.beginPath();
      ctx.rect(-robotSize * 0.15, robotSize * 0.05, robotSize * 0.3, robotSize * 0.1);
      ctx.fillStyle = 'rgba(20, 20, 30, 0.9)';
      ctx.fill();
      ctx.stroke();
      
      // Mouth grille lines
      ctx.strokeStyle = 'rgba(0, 150, 255, 0.5)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(-robotSize * 0.15, robotSize * 0.05 + i * (robotSize * 0.02));
        ctx.lineTo(-robotSize * 0.15 + robotSize * 0.3, robotSize * 0.05 + i * (robotSize * 0.02));
        ctx.stroke();
      }
      
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(-robotSize * 0.15 + i * (robotSize * 0.075), robotSize * 0.05);
        ctx.lineTo(-robotSize * 0.15 + i * (robotSize * 0.075), robotSize * 0.05 + robotSize * 0.1);
        ctx.stroke();
      }
      
      // Robot body
      if (robotPowered) {
        // Animate power level
        if (robotPowerLevel < 1) {
          robotPowerLevel += 0.01;
        }
        
        // Neck
        ctx.beginPath();
        ctx.rect(-robotSize * 0.05, robotSize * 0.25, robotSize * 0.1, robotSize * 0.1);
        ctx.fillStyle = 'rgba(20, 30, 40, 0.9)';
        ctx.fill();
        ctx.stroke();
        
        // Body
        ctx.beginPath();
        ctx.rect(-robotSize * 0.3, robotSize * 0.35, robotSize * 0.6, robotSize * 0.4);
        ctx.fillStyle = 'rgba(20, 30, 40, 0.9)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 150, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Power core
        ctx.beginPath();
        ctx.arc(0, robotSize * 0.5, robotSize * 0.1, 0, Math.PI * 2);
        const powerGradient = ctx.createRadialGradient(
          0, robotSize * 0.5, 0,
          0, robotSize * 0.5, robotSize * 0.2
        );
        powerGradient.addColorStop(0, `rgba(130, 80, 255, ${robotPowerLevel})`);
        powerGradient.addColorStop(0.5, `rgba(80, 60, 200, ${robotPowerLevel * 0.5})`);
        powerGradient.addColorStop(1, `rgba(50, 40, 150, 0)`);
        ctx.fillStyle = powerGradient;
        ctx.fill();
        
        // Draw energy lines from core
        if (robotMoving) {
          ctx.strokeStyle = `rgba(120, 90, 255, ${robotPowerLevel * 0.7})`;
          ctx.lineWidth = 2;
          
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const length = robotSize * (0.2 + Math.sin(Date.now() / 500 + i) * 0.05);
            
            ctx.beginPath();
            ctx.moveTo(
              Math.cos(angle) * robotSize * 0.12,
              robotSize * 0.5 + Math.sin(angle) * robotSize * 0.12
            );
            ctx.lineTo(
              Math.cos(angle) * length,
              robotSize * 0.5 + Math.sin(angle) * length
            );
            ctx.stroke();
          }
        }
        
        // Arms
        if (robotMoving) {
          // Left arm
          const leftArmAngle = Math.sin(Date.now() / 1000) * 0.2;
          ctx.save();
          ctx.translate(-robotSize * 0.3, robotSize * 0.4);
          ctx.rotate(leftArmAngle);
          
          // Upper arm
          ctx.beginPath();
          ctx.rect(-robotSize * 0.1, 0, robotSize * 0.1, robotSize * 0.2);
          ctx.fillStyle = 'rgba(20, 30, 40, 0.9)';
          ctx.fill();
          ctx.stroke();
          
          // Lower arm
          ctx.save();
          ctx.translate(0, robotSize * 0.2);
          ctx.rotate(Math.sin(Date.now() / 800) * 0.3);
          ctx.beginPath();
          ctx.rect(-robotSize * 0.1, 0, robotSize * 0.1, robotSize * 0.2);
          ctx.fill();
          ctx.stroke();
          
          // Hand
          ctx.save();
          ctx.translate(0, robotSize * 0.2);
          ctx.beginPath();
          ctx.arc(-robotSize * 0.05, robotSize * 0.05, robotSize * 0.05, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
          
          ctx.restore();
          ctx.restore();
          
          // Right arm
          const rightArmAngle = -Math.sin(Date.now() / 1000) * 0.2;
          ctx.save();
          ctx.translate(robotSize * 0.3, robotSize * 0.4);
          ctx.rotate(rightArmAngle);
          
          // Upper arm
          ctx.beginPath();
          ctx.rect(0, 0, robotSize * 0.1, robotSize * 0.2);
          ctx.fillStyle = 'rgba(20, 30, 40, 0.9)';
          ctx.fill();
          ctx.stroke();
          
          // Lower arm
          ctx.save();
          ctx.translate(0, robotSize * 0.2);
          ctx.rotate(-Math.sin(Date.now() / 800) * 0.3);
          ctx.beginPath();
          ctx.rect(0, 0, robotSize * 0.1, robotSize * 0.2);
          ctx.fill();
          ctx.stroke();
          
          // Hand
          ctx.save();
          ctx.translate(0, robotSize * 0.2);
          ctx.beginPath();
          ctx.arc(robotSize * 0.05, robotSize * 0.05, robotSize * 0.05, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
          
          ctx.restore();
          ctx.restore();
        }
        
        // Legs
        if (robotFully) {
          // Left leg
          const leftLegAngle = Math.sin(Date.now() / 1200) * 0.1;
          ctx.save();
          ctx.translate(-robotSize * 0.15, robotSize * 0.75);
          ctx.rotate(leftLegAngle);
          
          // Upper leg
          ctx.beginPath();
          ctx.rect(-robotSize * 0.1, 0, robotSize * 0.2, robotSize * 0.25);
          ctx.fillStyle = 'rgba(20, 30, 40, 0.9)';
          ctx.fill();
          ctx.stroke();
          
          // Lower leg
          ctx.save();
          ctx.translate(0, robotSize * 0.25);
          ctx.rotate(Math.max(0, Math.sin(Date.now() / 900) * 0.2));
          ctx.beginPath();
          ctx.rect(-robotSize * 0.1, 0, robotSize * 0.2, robotSize * 0.25);
          ctx.fill();
          ctx.stroke();
          
          // Foot
          ctx.save();
          ctx.translate(0, robotSize * 0.25);
          ctx.beginPath();
          ctx.ellipse(0, 0, robotSize * 0.15, robotSize * 0.05, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
          
          ctx.restore();
          ctx.restore();
          
          // Right leg
          const rightLegAngle = -Math.sin(Date.now() / 1200) * 0.1;
          ctx.save();
          ctx.translate(robotSize * 0.15, robotSize * 0.75);
          ctx.rotate(rightLegAngle);
          
          // Upper leg
          ctx.beginPath();
          ctx.rect(-robotSize * 0.1, 0, robotSize * 0.2, robotSize * 0.25);
          ctx.fillStyle = 'rgba(20, 30, 40, 0.9)';
          ctx.fill();
          ctx.stroke();
          
          // Lower leg
          ctx.save();
          ctx.translate(0, robotSize * 0.25);
          ctx.rotate(Math.max(0, -Math.sin(Date.now() / 900) * 0.2));
          ctx.beginPath();
          ctx.rect(-robotSize * 0.1, 0, robotSize * 0.2, robotSize * 0.25);
          ctx.fill();
          ctx.stroke();
          
          // Foot
          ctx.save();
          ctx.translate(0, robotSize * 0.25);
          ctx.beginPath();
          ctx.ellipse(0, 0, robotSize * 0.15, robotSize * 0.05, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
          
          ctx.restore();
          ctx.restore();
        }
      }
      
      ctx.restore();
    };
    
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background with circuit pattern
      ctx.fillStyle = 'rgba(5, 10, 20, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw circuit background
      drawCircuitLines();
      
      // Update and draw particles
      particlesArray.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      // Draw robot
      drawRobot();
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black">
      {/* Background animation canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
      />
      
      {/* Loading progress UI */}
      <div className="absolute inset-x-0 bottom-20 z-20 flex flex-col items-center px-6">
        <div className="w-full max-w-lg bg-black/80 backdrop-blur-md p-6 rounded-lg border border-blue-500/30 shadow-2xl shadow-blue-500/20">
          <div className="flex items-center mb-4">
            <div className="relative mr-4 flex-shrink-0">
              <div className="w-10 h-10 rounded-full border-4 border-blue-500/30 animate-spin border-t-blue-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentMessage}
                  className="text-lg font-medium text-blue-400"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentMessage}
                </motion.p>
              </AnimatePresence>
              
              <p className="text-sm text-gray-400 mt-1">
                {username ? `Welcome back, ${username}` : 'Preparing system...'}
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}