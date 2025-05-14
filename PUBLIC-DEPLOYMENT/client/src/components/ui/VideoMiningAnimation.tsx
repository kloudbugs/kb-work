import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoMiningAnimationProps {
  active?: boolean;
  logoImage?: string;
  showText?: boolean;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
  textColor?: string;
  variant?: 'cosmic' | 'orbit' | 'warp' | 'blast';
}

export const VideoMiningAnimation = ({
  active = true,
  logoImage = '/logo1.png', 
  showText = true,
  className = '',
  speed = 'normal',
  textColor = 'text-blue-400',
  variant = 'cosmic'
}: VideoMiningAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const [miningText, setMiningText] = useState('Mining Active...');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Set animation speed
  const speedFactor = speed === 'slow' ? 0.5 : speed === 'fast' ? 2 : 1;
  
  // Status messages
  const statusMessages = [
    'Mining Active...',
    'Processing blocks...',
    'Generating beans...',
    'Computing hashes...',
    'Securing network...',
    'KLOUD-BUGS Mining...'
  ];
  
  // Cycle through mining status messages
  useEffect(() => {
    if (!active || !showText) return;
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * statusMessages.length);
      setMiningText(statusMessages[randomIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [active, showText, statusMessages]);
  
  // Main animation
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Adjust canvas size based on container
    const resizeCanvas = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    const particleCount = variant === 'warp' ? 200 : 100;
    const particles: any[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 3 + 1;
      const speedX = (Math.random() - 0.5) * speedFactor;
      const speedY = (Math.random() - 0.5) * speedFactor;
      
      // Orbit variables
      let angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (canvas.width / 4) + 20;
      const orbitSpeed = (Math.random() * 0.02 + 0.01) * speedFactor;
      
      // For warp effect
      const distanceFromCenter = Math.sqrt(
        Math.pow(x - canvas.width / 2, 2) + 
        Math.pow(y - canvas.height / 2, 2)
      );
      const directionX = (x - canvas.width / 2) / distanceFromCenter;
      const directionY = (y - canvas.height / 2) / distanceFromCenter;
      
      particles.push({
        x,
        y,
        size,
        speedX: variant === 'warp' ? directionX * speedFactor : speedX,
        speedY: variant === 'warp' ? directionY * speedFactor : speedY,
        color: getRandomColor(variant),
        angle,
        radius,
        orbitSpeed,
        directionX,
        directionY,
        distanceFromCenter,
        trail: variant === 'warp' ? [] : undefined,
        maxTrailLength: Math.floor(Math.random() * 10) + 5
      });
    }
    
    // Add meteorites for cosmic variant
    const meteorites: any[] = [];
    
    if (variant === 'cosmic' || variant === 'blast') {
      for (let i = 0; i < 10; i++) {
        createMeteorite(meteorites, canvas);
      }
    }
    
    // Load logo if needed
    let logo: HTMLImageElement | null = null;
    
    if (logoImage) {
      logo = new Image();
      logo.src = logoImage;
    }
    
    // Animation loop
    let lastTime = 0;
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw based on variant
      if (variant === 'cosmic') {
        drawCosmic(ctx, particles, meteorites, canvas, deltaTime, speedFactor);
      } else if (variant === 'orbit') {
        drawOrbit(ctx, particles, canvas, logo);
      } else if (variant === 'warp') {
        drawWarp(ctx, particles, canvas, deltaTime, speedFactor);
      } else if (variant === 'blast') {
        drawBlast(ctx, particles, meteorites, canvas, deltaTime, speedFactor);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [active, variant, speedFactor, logoImage]);
  
  // Helper functions
  function getRandomColor(variant: string) {
    if (variant === 'cosmic') {
      const colors = ['rgba(70, 130, 255, 0.7)', 'rgba(200, 220, 255, 0.7)', 'rgba(140, 180, 255, 0.7)'];
      return colors[Math.floor(Math.random() * colors.length)];
    } else if (variant === 'orbit') {
      const colors = ['rgba(0, 200, 255, 0.7)', 'rgba(100, 255, 255, 0.7)', 'rgba(50, 150, 255, 0.7)'];
      return colors[Math.floor(Math.random() * colors.length)];
    } else if (variant === 'warp') {
      const colors = ['rgba(255, 255, 255, 0.7)', 'rgba(200, 200, 255, 0.7)', 'rgba(150, 150, 255, 0.7)'];
      return colors[Math.floor(Math.random() * colors.length)];
    } else if (variant === 'blast') {
      const colors = ['rgba(255, 200, 50, 0.7)', 'rgba(255, 150, 50, 0.7)', 'rgba(255, 100, 50, 0.7)'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    return 'rgba(255, 255, 255, 0.7)';
  }
  
  function createMeteorite(meteorites: any[], canvas: HTMLCanvasElement) {
    const x = Math.random() * canvas.width;
    const y = -100;
    const size = Math.random() * 6 + 3;
    const speedX = (Math.random() - 0.5) * 2;
    const speedY = Math.random() * 5 + 3;
    
    meteorites.push({
      x,
      y,
      size,
      speedX,
      speedY,
      color: 'rgba(255, 255, 255, 0.8)',
      trail: []
    });
  }
  
  function drawCosmic(
    ctx: CanvasRenderingContext2D, 
    particles: any[], 
    meteorites: any[], 
    canvas: HTMLCanvasElement, 
    deltaTime: number,
    speedFactor: number
  ) {
    // Draw stars
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Update position
      particle.x += particle.speedX * deltaTime * 0.1;
      particle.y += particle.speedY * deltaTime * 0.1;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
    });
    
    // Draw and update meteorites
    meteorites.forEach((meteorite, index) => {
      // Draw trail
      ctx.beginPath();
      ctx.moveTo(meteorite.x, meteorite.y);
      ctx.lineTo(meteorite.x - meteorite.speedX * 10, meteorite.y - meteorite.speedY * 10);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = meteorite.size / 2;
      ctx.stroke();
      
      // Draw meteorite
      ctx.beginPath();
      ctx.arc(meteorite.x, meteorite.y, meteorite.size, 0, Math.PI * 2);
      ctx.fillStyle = meteorite.color;
      ctx.fill();
      
      // Update position
      meteorite.x += meteorite.speedX * speedFactor;
      meteorite.y += meteorite.speedY * speedFactor;
      
      // Remove if off screen and create new one
      if (meteorite.y > canvas.height) {
        meteorites.splice(index, 1);
        createMeteorite(meteorites, canvas);
      }
    });
  }
  
  function drawOrbit(
    ctx: CanvasRenderingContext2D, 
    particles: any[], 
    canvas: HTMLCanvasElement,
    logo: HTMLImageElement | null
  ) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw orbit rings
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, 50 * i, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(100, 150, 255, ${0.3 - i * 0.05})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Draw logo in center if available
    if (logo) {
      const logoSize = 50;
      ctx.drawImage(
        logo,
        centerX - logoSize / 2,
        centerY - logoSize / 2,
        logoSize,
        logoSize
      );
    } else {
      // Draw center point
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 200, 255, 0.8)';
      ctx.fill();
    }
    
    // Draw and update orbital particles
    particles.forEach(particle => {
      // Update angle
      particle.angle += particle.orbitSpeed;
      
      // Calculate new position
      particle.x = centerX + Math.cos(particle.angle) * particle.radius;
      particle.y = centerY + Math.sin(particle.angle) * particle.radius;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });
  }
  
  function drawWarp(
    ctx: CanvasRenderingContext2D, 
    particles: any[], 
    canvas: HTMLCanvasElement, 
    deltaTime: number,
    speedFactor: number
  ) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw and update warp particles
    particles.forEach(particle => {
      // Add current position to trail
      if (particle.trail) {
        particle.trail.push({ x: particle.x, y: particle.y });
        
        // Limit trail length
        if (particle.trail.length > particle.maxTrailLength) {
          particle.trail.shift();
        }
        
        // Draw trail
        if (particle.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          
          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }
          
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = particle.size / 2;
          ctx.stroke();
        }
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Update position - move away from center
      const speed = (particle.distanceFromCenter * 0.01 + 0.5) * speedFactor;
      particle.x += particle.directionX * speed * deltaTime * 0.05;
      particle.y += particle.directionY * speed * deltaTime * 0.05;
      
      // Reset if off screen
      if (
        particle.x < -50 || 
        particle.x > canvas.width + 50 || 
        particle.y < -50 || 
        particle.y > canvas.height + 50
      ) {
        particle.x = centerX;
        particle.y = centerY;
        particle.trail = [];
        
        // Randomize direction slightly
        const angle = Math.random() * Math.PI * 2;
        particle.directionX = Math.cos(angle);
        particle.directionY = Math.sin(angle);
        particle.distanceFromCenter = 0;
      }
    });
  }
  
  function drawBlast(
    ctx: CanvasRenderingContext2D, 
    particles: any[], 
    meteorites: any[], 
    canvas: HTMLCanvasElement, 
    deltaTime: number,
    speedFactor: number
  ) {
    // Draw background radial gradient
    const grd = ctx.createRadialGradient(
      canvas.width / 2, 
      canvas.height / 2, 
      10, 
      canvas.width / 2, 
      canvas.height / 2, 
      canvas.width / 2
    );
    grd.addColorStop(0, "rgba(255, 100, 50, 0.2)");
    grd.addColorStop(1, "rgba(0, 0, 20, 0)");
    
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw particles
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Update position with pulsing effect
      const time = Date.now() * 0.001;
      const pulseSpeed = Math.sin(time) * 0.5 + 1;
      
      particle.x += particle.speedX * pulseSpeed * speedFactor;
      particle.y += particle.speedY * pulseSpeed * speedFactor;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
    });
    
    // Draw and update meteorites like cosmic, but with different colors
    meteorites.forEach((meteorite, index) => {
      // Draw trail
      ctx.beginPath();
      ctx.moveTo(meteorite.x, meteorite.y);
      ctx.lineTo(meteorite.x - meteorite.speedX * 15, meteorite.y - meteorite.speedY * 15);
      ctx.strokeStyle = 'rgba(255, 150, 0, 0.4)';
      ctx.lineWidth = meteorite.size / 1.5;
      ctx.stroke();
      
      // Draw meteorite
      ctx.beginPath();
      ctx.arc(meteorite.x, meteorite.y, meteorite.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 200, 50, 0.9)';
      ctx.fill();
      
      // Update position
      meteorite.x += meteorite.speedX * speedFactor;
      meteorite.y += meteorite.speedY * speedFactor;
      
      // Remove if off screen and create new one
      if (meteorite.y > canvas.height) {
        meteorites.splice(index, 1);
        createMeteorite(meteorites, canvas);
      }
    });
  }
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        backgroundColor: 'rgba(5, 10, 25, 0.95)',
        minHeight: '200px',
        borderRadius: '12px',
        boxShadow: '0 0 20px rgba(0, 100, 255, 0.2) inset'
      }}
      ref={containerRef}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10"
      />
      
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={miningText}
              className={`text-center font-mono ${textColor} font-bold tracking-wider`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ 
                textShadow: '0 0 10px rgba(0, 150, 255, 0.5), 0 0 20px rgba(0, 100, 255, 0.3)', 
                fontSize: '1.2rem'
              }}
            >
              {miningText}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default VideoMiningAnimation;