import React, { useRef, useEffect, useState } from 'react';

interface VideoMiningAnimationProps {
  active?: boolean;
  variant?: 'cosmic' | 'orbit' | 'warp' | 'blast';
  logoImage?: string;
  showText?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
  textColor?: string;
  className?: string;
}

const VideoMiningAnimation: React.FC<VideoMiningAnimationProps> = ({
  active = true,
  variant = 'cosmic',
  logoImage = '/logo1.png',
  showText = true,
  speed = 'normal',
  textColor = 'text-blue-400',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const logoRef = useRef<HTMLImageElement | null>(null);
  
  // Create logo image object
  useEffect(() => {
    const img = new Image();
    img.src = logoImage;
    img.onload = () => {
      logoRef.current = img;
      setLogoLoaded(true);
    };
    return () => {
      logoRef.current = null;
    };
  }, [logoImage]);
  
  // Speed multiplier based on prop
  const getSpeedMultiplier = () => {
    switch (speed) {
      case 'slow': return 0.5;
      case 'fast': return 2;
      default: return 1;
    }
  };

  // Canvas animation
  useEffect(() => {
    if (!canvasRef.current || !active || !logoLoaded || !logoRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation parameters
    const speedMultiplier = getSpeedMultiplier();
    
    // Particle class for cosmic and orbit variants
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        
        // Different speed ranges based on variant
        if (variant === 'cosmic') {
          this.speedX = (Math.random() - 0.5) * 2 * speedMultiplier;
          this.speedY = (Math.random() - 0.5) * 2 * speedMultiplier;
        } else if (variant === 'orbit') {
          // For orbit, particles move in more circular patterns
          this.speedX = (Math.random() - 0.5) * 3 * speedMultiplier;
          this.speedY = (Math.random() - 0.5) * 3 * speedMultiplier;
        } else if (variant === 'warp') {
          // For warp, particles move outward from center
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const angle = Math.atan2(this.y - centerY, this.x - centerX);
          const speed = (Math.random() * 2 + 1) * speedMultiplier;
          this.speedX = Math.cos(angle) * speed;
          this.speedY = Math.sin(angle) * speed;
        } else if (variant === 'blast') {
          // For blast, particles move in a more explosive pattern
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const angle = Math.atan2(this.y - centerY, this.x - centerX);
          const distance = Math.sqrt(Math.pow(this.x - centerX, 2) + Math.pow(this.y - centerY, 2));
          const speed = (Math.random() * 3 + 2) * speedMultiplier * (distance / 100);
          this.speedX = Math.cos(angle) * speed;
          this.speedY = Math.sin(angle) * speed;
        }
        
        // Different colors based on variant
        if (variant === 'cosmic') {
          const colors = ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC'];
          this.color = colors[Math.floor(Math.random() * colors.length)];
        } else if (variant === 'orbit') {
          const colors = ['#8B5CF6', '#A855F7', '#D946EF', '#EC4899'];
          this.color = colors[Math.floor(Math.random() * colors.length)];
        } else if (variant === 'warp') {
          const colors = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];
          this.color = colors[Math.floor(Math.random() * colors.length)];
        } else if (variant === 'blast') {
          const colors = ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'];
          this.color = colors[Math.floor(Math.random() * colors.length)];
        }
      }
      
      update(canvas: HTMLCanvasElement) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounds checking
        if (variant === 'warp' || variant === 'blast') {
          // For warp and blast, particles that go off-screen are reset to center
          if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
          }
        } else {
          // For cosmic and orbit, particles wrap around the screen
          if (this.x < 0) this.x = canvas.width;
          if (this.x > canvas.width) this.x = 0;
          if (this.y < 0) this.y = canvas.height;
          if (this.y > canvas.height) this.y = 0;
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles
    const particleCount = variant === 'blast' ? 200 : 100;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas));
    }
    
    // Animation variables
    let rotation = 0;
    let scale = 1;
    let textOpacity = 0;
    let hue = 0;
    
    // Animate function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update(canvas);
        particle.draw(ctx);
      });
      
      // Draw logo in center
      if (logoRef.current) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const logoSize = Math.min(canvas.width, canvas.height) * 0.2; // 20% of smaller dimension
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Different animations based on variant
        if (variant === 'cosmic') {
          rotation += 0.005 * speedMultiplier;
          ctx.rotate(rotation);
          scale = 1 + Math.sin(Date.now() * 0.001 * speedMultiplier) * 0.1;
          ctx.scale(scale, scale);
        } else if (variant === 'orbit') {
          rotation += 0.01 * speedMultiplier;
          ctx.rotate(rotation);
          const orbitSize = Math.sin(Date.now() * 0.002 * speedMultiplier) * 20;
          ctx.translate(orbitSize, orbitSize);
        } else if (variant === 'warp') {
          scale = 1 + Math.sin(Date.now() * 0.002 * speedMultiplier) * 0.2;
          ctx.scale(scale, scale);
          // Add a pulsing effect
          const pulseSize = 1 + Math.sin(Date.now() * 0.003 * speedMultiplier) * 0.1;
          ctx.scale(pulseSize, pulseSize);
        } else if (variant === 'blast') {
          rotation += 0.02 * speedMultiplier;
          ctx.rotate(rotation);
          // Add a bouncing effect
          const bounce = Math.abs(Math.sin(Date.now() * 0.004 * speedMultiplier)) * 10;
          ctx.translate(0, bounce);
        }
        
        ctx.drawImage(
          logoRef.current, 
          -logoSize / 2, 
          -logoSize / 2, 
          logoSize, 
          logoSize
        );
        ctx.restore();
        
        // Draw text below logo
        if (showText) {
          ctx.save();
          
          // Fade in text
          textOpacity = Math.min(1, textOpacity + 0.01 * speedMultiplier);
          
          // Different text styles based on variant
          if (variant === 'cosmic') {
            ctx.fillStyle = `rgba(79, 70, 229, ${textOpacity})`;
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('MINING IN PROGRESS', centerX, centerY + logoSize / 2 + 40);
            
            ctx.font = '16px Arial';
            ctx.fillText('Scanning blockchain...', centerX, centerY + logoSize / 2 + 70);
          } else if (variant === 'orbit') {
            ctx.fillStyle = `rgba(139, 92, 246, ${textOpacity})`;
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('ORBITAL MINING', centerX, centerY + logoSize / 2 + 40);
            
            ctx.font = '16px Arial';
            ctx.fillText('Harvesting stellar data...', centerX, centerY + logoSize / 2 + 70);
          } else if (variant === 'warp') {
            hue = (hue + 0.5 * speedMultiplier) % 360;
            ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${textOpacity})`;
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('WARP DRIVE MINING', centerX, centerY + logoSize / 2 + 40);
            
            ctx.font = '16px Arial';
            ctx.fillText('Accelerating particles...', centerX, centerY + logoSize / 2 + 70);
          } else if (variant === 'blast') {
            ctx.fillStyle = `rgba(245, 158, 11, ${textOpacity})`;
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('BLAST MINING', centerX, centerY + logoSize / 2 + 40);
            
            ctx.font = '16px Arial';
            ctx.fillText('Energizing crypto matter...', centerX, centerY + logoSize / 2 + 70);
          }
          
          ctx.restore();
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [active, variant, logoLoaded, speed, showText]);

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      {!active && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
          <p className="text-lg font-medium">Animation Paused</p>
        </div>
      )}
    </div>
  );
};

export default VideoMiningAnimation;