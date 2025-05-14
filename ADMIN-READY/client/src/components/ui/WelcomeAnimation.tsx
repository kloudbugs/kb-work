import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Coffee, ChevronRightIcon, CupSoda, Lock, KeyRound, AlertTriangle, Bitcoin, DollarSign, Coins } from 'lucide-react';
// Import the bean child image
import BeanChildImage from '@/assets/bean-child.png';

interface WelcomeAnimationProps {
  onEnter: () => void;
}

export function WelcomeAnimation({ onEnter }: WelcomeAnimationProps) {
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [accessCodeDialogOpen, setAccessCodeDialogOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [accessError, setAccessError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Coffee bean animation setup and control
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Coffee bean particle system
    class CoffeeBean {
      x: number;
      y: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      color: string;
      speedX: number;
      speedY: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 20 + 10;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = 0.1 + Math.random() * 0.5;
        this.color = [
          'rgba(101, 67, 33, alpha)',  // Dark brown
          'rgba(139, 69, 19, alpha)',  // Saddle brown
          'rgba(160, 82, 45, alpha)',  // Sienna
          'rgba(165, 42, 42, alpha)',  // Brown
          'rgba(210, 105, 30, alpha)'  // Chocolate
        ][Math.floor(Math.random() * 5)].replace('alpha', this.opacity.toString());
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        
        // Wrap around screen edges
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw a coffee bean shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        // Bean outline shape
        ctx.ellipse(0, 0, this.size, this.size/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Center crease
        ctx.strokeStyle = 'rgba(40, 20, 10, ' + this.opacity * 1.5 + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-this.size/1.3, 0);
        ctx.bezierCurveTo(-this.size/2, this.size/3, this.size/2, this.size/3, this.size/1.3, 0);
        ctx.bezierCurveTo(this.size/2, -this.size/3, -this.size/2, -this.size/3, -this.size/1.3, 0);
        ctx.stroke();
        
        ctx.restore();
      }
    }
    
    const coffeeBeans: CoffeeBean[] = [];
    for (let i = 0; i < 50; i++) {
      coffeeBeans.push(new CoffeeBean());
    }
    
    // Steam particle system
    class SteamParticle {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      
      constructor(baseX: number) {
        this.x = baseX + (Math.random() - 0.5) * 40;
        this.y = canvas.height / 2 + 30;
        this.size = Math.random() * 8 + 2;
        this.opacity = 0.7;
        this.speed = Math.random() * 2 + 1;
      }
      
      update() {
        this.y -= this.speed;
        this.opacity -= 0.01;
        this.size += 0.05;
        
        if (this.y < canvas.height / 2 - 150 || this.opacity <= 0) {
          this.y = canvas.height / 2 + 30;
          this.opacity = 0.7;
          this.size = Math.random() * 8 + 2;
        }
      }
      
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Crypto currency symbols in the steam
    class CryptoParticle {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      cryptoType: string;
      rotation: number;
      rotationSpeed: number;
      
      constructor(baseX: number) {
        this.x = baseX + (Math.random() - 0.5) * 60;
        this.y = canvas.height / 2 + 10;
        this.size = Math.random() * 12 + 8;
        this.opacity = 0;
        this.speed = Math.random() * 1.5 + 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        
        // Randomly choose a cryptocurrency symbol
        const cryptoSymbols = ['₿', 'Ξ', '₮', 'Ł', '₽', '₳', 'Ð', '⟠', '₱'];
        this.cryptoType = cryptoSymbols[Math.floor(Math.random() * cryptoSymbols.length)];
      }
      
      update() {
        this.y -= this.speed;
        
        // Slowly fade in, then fade out
        if (this.y > canvas.height / 2 - 50) {
          this.opacity += 0.03;
        } else {
          this.opacity -= 0.01;
        }
        
        this.opacity = Math.min(0.9, Math.max(0, this.opacity));
        this.rotation += this.rotationSpeed;
        
        // Add a slight side movement
        this.x += Math.sin(this.y / 20) * 0.5;
        
        // Reset when out of view or faded out
        if (this.y < canvas.height / 2 - 200 || this.opacity <= 0) {
          this.y = canvas.height / 2 + 10;
          this.x = canvas.width / 2 + (Math.random() - 0.5) * 60;
          this.opacity = 0;
          this.size = Math.random() * 12 + 8;
        }
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Gold gradient colors for crypto symbols
        let goldColor = `rgba(255, 215, 0, ${this.opacity})`;
        if (this.cryptoType === '₿') { // Bitcoin gets golden color
          goldColor = `rgba(255, 215, 0, ${this.opacity})`;
        } else if (this.cryptoType === 'Ξ') { // Ethereum gets a blueish tint
          goldColor = `rgba(115, 192, 222, ${this.opacity})`;
        } else if (this.cryptoType === 'Ð') { // Dogecoin gets orangish tint
          goldColor = `rgba(255, 165, 0, ${this.opacity})`;
        }
        
        // Draw the crypto symbol with a glow effect
        ctx.shadowColor = goldColor;
        ctx.shadowBlur = 10;
        ctx.fillStyle = goldColor;
        ctx.font = `bold ${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.cryptoType, 0, 0);
        
        ctx.restore();
      }
    }
    
    const steamParticles: SteamParticle[] = [];
    for (let i = 0; i < 25; i++) { // Reduced number to make room for crypto particles
      steamParticles.push(new SteamParticle(canvas.width / 2));
    }
    
    // Create crypto particles
    const cryptoParticles: CryptoParticle[] = [];
    for (let i = 0; i < 10; i++) {
      cryptoParticles.push(new CryptoParticle(canvas.width / 2));
    }
    
    // Animation timing
    let animationStarted = false;
    let animationTimer: ReturnType<typeof setTimeout>;
    let animationFrameId: number;
    
    // Coffee cup animation
    const drawCoffeeCup = (progress: number = 1) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const cupSize = Math.min(canvas.width, canvas.height) * 0.22 * progress; // Increased cup size
      
      // Cup
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Add cup glow for visibility
      ctx.shadowColor = 'rgba(255, 165, 0, 0.5)';
      ctx.shadowBlur = 25;
      
      // Cup body - draw twice for stronger visibility
      ctx.beginPath();
      ctx.ellipse(0, 0, cupSize * 0.7, cupSize * 0.4, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139, 69, 19, ' + 0.95 * progress + ')';
      ctx.fill();
      ctx.strokeStyle = 'rgba(101, 67, 33, ' + 0.95 * progress + ')';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Handle
      ctx.beginPath();
      ctx.ellipse(cupSize * 0.9, 0, cupSize * 0.2, cupSize * 0.4, 0, Math.PI * 0.25, Math.PI * 1.75);
      ctx.strokeStyle = 'rgba(160, 82, 45, ' + 0.95 * progress + ')';
      ctx.lineWidth = cupSize * 0.08;
      ctx.stroke();
      
      // Remove shadow for coffee liquid
      ctx.shadowBlur = 0;
      
      // Coffee liquid
      ctx.beginPath();
      ctx.ellipse(0, 0, cupSize * 0.6, cupSize * 0.3, 0, 0, Math.PI * 2);
      const coffeeGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, cupSize * 0.6);
      coffeeGradient.addColorStop(0, 'rgba(80, 40, 20, ' + 0.9 * progress + ')');
      coffeeGradient.addColorStop(1, 'rgba(40, 20, 10, ' + 0.9 * progress + ')');
      ctx.fillStyle = coffeeGradient;
      ctx.fill();
      
      // Coffee surface highlight
      ctx.beginPath();
      ctx.ellipse(cupSize * -0.2, cupSize * -0.1, cupSize * 0.15, cupSize * 0.08, Math.PI/4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + 0.2 * progress + ')';
      ctx.fill();
      
      // Steam and crypto particles (when fully visible)
      if (progress >= 0.8) {
        // Regular steam particles
        for (const particle of steamParticles) {
          particle.update();
          particle.draw();
        }
        
        // Cryptocurrency symbols floating in the steam
        for (const crypto of cryptoParticles) {
          crypto.update();
          crypto.draw();
        }
      }
      
      ctx.restore();
    };
    
    // Start animation flow
    setTimeout(() => {
      animationStarted = true;
      
      // Show logo and enter button after animation
      setTimeout(() => {
        setShowLogo(true);
        setTimeout(() => {
          setShowEnterButton(true);
        }, 800);
      }, 3500);
    }, 1000);
    
    // Animation loop
    let progress = 0;
    let beansVisible = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dark background with coffee color gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 50,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(40, 20, 5, 1)'); // Dark brown
      gradient.addColorStop(1, 'rgba(15, 5, 0, 1)');  // Almost black
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Coffee beans animation
      if (animationStarted) {
        if (beansVisible < coffeeBeans.length) {
          beansVisible += 0.5;
        }
        
        for (let i = 0; i < beansVisible; i++) {
          coffeeBeans[i].update();
          coffeeBeans[i].draw();
        }
        
        // Progress cup animation
        if (progress < 1) {
          progress += 0.01;
        }
        
        drawCoffeeCup(progress);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(animationTimer);
    };
  }, []);
  
  // Handle opening the access code dialog
  const handleOpenAccessDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening access code dialog");
    setAccessCodeDialogOpen(true);
  };

  // Handle access code verification
  const handleAccessCodeSubmit = () => {
    // Simple access code - with more flexibility for case and formatting
    const userInput = accessCode.toLowerCase().trim();
    
    if (userInput === "tera-roots" || 
        userInput === "tera roots" || 
        userInput === "teraroots") {
      setAccessCodeDialogOpen(false);
      setAnimationComplete(true);
      onEnter();
    } else {
      setAccessError(true);
      setAttempts(attempts + 1);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Access Code Dialog - Outside of AnimatePresence to fix key issues */}
      <Dialog open={accessCodeDialogOpen} onOpenChange={setAccessCodeDialogOpen}>
        <DialogContent className="fixed left-0 right-0 md:absolute md:left-auto md:right-auto bg-gray-900 border-2 border-amber-500 shadow-lg shadow-amber-500/20 max-w-md animate-in fade-in-50 duration-300 zoom-in-95 z-[10000] top-[30%] sm:top-[35%] md:top-[70%] md:left-1/2 md:-translate-x-1/2 md:-translate-y-0 mx-auto scale-[0.85] sm:scale-90">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-amber-600 rounded-full p-4 shadow-lg shadow-amber-700/50 animate-bounce">
            <KeyRound className="h-8 w-8 text-white" />
          </div>
          
          <DialogHeader className="pt-4">
            <DialogTitle className="text-center text-amber-400 text-2xl font-bold pt-2">
              <span className="flex items-center justify-center gap-2">
                Secure Mining Access
              </span>
            </DialogTitle>
            <DialogDescription className="text-center text-amber-100 mt-2">
              Enter your access token to begin mining Satoshi Beans.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="relative">
                <div className="mb-2 flex items-center justify-center gap-2 text-amber-300 text-sm font-medium">
                  <Coffee className="h-4 w-4" />
                  <span>TOKEN REQUIRED</span>
                  <Coffee className="h-4 w-4" />
                </div>
                
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r from-amber-600/20 via-yellow-500/20 to-amber-600/20 rounded-md ${!accessError ? 'animate-pulse' : ''}`}></div>
                  <Input
                    type="text" 
                    placeholder="Enter Access Token"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      if (accessError) setAccessError(false);
                    }}
                    className={`bg-gray-800 border-2 ${accessError ? 'border-red-500' : 'border-amber-600'} text-amber-100 text-center tracking-wider text-lg py-6 relative z-10`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAccessCodeSubmit();
                      }
                    }}
                    autoFocus
                  />
                </div>
                
                {accessError && (
                  <div className="text-center text-red-500 text-sm mt-3 flex items-center justify-center gap-1 bg-red-900/20 py-2 rounded">
                    <AlertTriangle className="h-4 w-4" />
                    {attempts >= 3 
                      ? "Multiple failed attempts. Please contact support." 
                      : "Invalid access token. Please try again."}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-center pt-3">
              <Button 
                onClick={handleAccessCodeSubmit}
                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-8 py-6 text-lg shadow-lg shadow-amber-700/30 border border-amber-500/50"
              >
                <span className="flex items-center gap-2">
                  <Bitcoin className="h-5 w-5" />
                  Verify & Enter
                </span>
              </Button>
            </div>

            <div className="mt-6 p-3 bg-amber-950/30 rounded-lg border border-amber-900/50">
              <div className="flex items-center justify-center gap-2 text-amber-400 mb-1">
                <Coffee className="h-4 w-4" />
                <span className="text-sm font-semibold">HINT</span>
              </div>
              <p className="text-xs text-center text-amber-200/80">
                The access token is the name of our family foundation: "Tera-Roots"
              </p>
            </div>

            <div className="text-xs text-center text-gray-400 mt-2">
              <p>Authorized access only. All mining sessions are monitored and secured.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Welcome animation with AnimatePresence */}
      <AnimatePresence mode="wait">
        {!animationComplete && (
          <motion.div 
            key="welcome-animation"
            className="fixed inset-0 flex flex-col items-center justify-center z-[9999]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Coffee beans animation canvas */}
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 w-full h-full z-0"
            />
            
            {/* Logo only shown when showLogo is true */}
            {showLogo && (
              <motion.div 
                key="logo"
                className="z-20 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl px-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Two column layout with image on left */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-black/40 backdrop-blur-sm rounded-xl p-6 pt-12 md:p-6 border border-amber-800/30 mx-auto max-w-[95%] md:max-w-none">
                  
                  {/* LEFT COLUMN - Large Bean Child Image */}
                  <div className="w-full md:w-1/3 flex justify-center">
                    <div className="relative">
                      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-500 to-yellow-500 opacity-50 blur-lg animate-pulse"></div>
                      <div className="relative h-80 w-80 md:h-80 md:w-80 rounded-2xl overflow-hidden border-4 border-amber-500 shadow-lg shadow-amber-500/50 mx-auto">
                        <img 
                          src={BeanChildImage} 
                          alt="Bean Child"
                          className="w-full h-full object-contain"
                          style={{ 
                            objectPosition: "center 20%",
                            objectFit: "contain",
                            transform: "scale(1.25) translateY(-8%)" 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* RIGHT COLUMN - Text Content */}
                  <div className="w-full md:w-2/3 text-center md:text-left">
                    <h1 
                      className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 mb-2"
                      style={{ 
                        textShadow: '0 0 20px rgba(217, 119, 6, 0.8)',
                        fontFamily: "'Orbitron', sans-serif"
                      }}
                    >
                      SATOSHI BEAN MINING
                    </h1>
                    <h2
                      className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 mb-3"
                      style={{ 
                        textShadow: '0 0 15px rgba(130, 80, 255, 0.6)',
                        fontFamily: "'Orbitron', sans-serif"
                      }}
                    >
                      FOR CIVIL RIGHTS
                    </h2>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-1 mb-3">
                      <div className="w-10 h-10 relative">
                        <div className="absolute inset-0 bg-amber-600 rounded-full animate-ping opacity-30"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full text-amber-400 animate-pulse">
                          <path fill="currentColor" d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z" />
                        </svg>
                      </div>
                      <h2 className="text-lg md:text-2xl text-amber-200" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        Mining Beans for a Better Future
                      </h2>
                      <div className="w-10 h-10 relative">
                        <div className="absolute inset-0 bg-amber-600 rounded-full animate-ping opacity-30 animation-delay-500"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full text-amber-400 animate-pulse animation-delay-500">
                          <path fill="currentColor" d="M12,2C14.21,2 16,3.79 16,6H8C8,3.79 9.79,2 12,2M16,8H8V16A4,4 0 0,0 12,20A4,4 0 0,0 16,16V8M19,6V16A7,7 0 0,1 12,23A7,7 0 0,1 5,16V6A5,5 0 0,1 10,1A5,5 0 0,1 14,1A5,5 0 0,1 19,6Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2 max-w-md mx-auto md:mx-0 mb-3">
                      <div className="bg-gradient-to-r from-amber-900/40 via-amber-800/50 to-amber-900/40 p-3 rounded-lg border border-amber-700/30">
                        <p className="text-amber-200 text-sm font-medium">
                          Mine and earn <span className="font-bold text-amber-300">Satoshi Beans</span> secured by blockchain technology
                        </p>
                        <div className="mt-1 flex items-center justify-center md:justify-start gap-2">
                          <div className="w-5 h-5 text-amber-300">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M13.5,1.5C14.59,1.5 15.5,2.41 15.5,3.5C15.5,4.5 14.83,5.31 13.91,5.5C13.97,5.83 14,6.16 14,6.5C14,10.09 11.09,13 7.5,13C6.33,13 5.24,12.71 4.29,12.2L4.13,12.29L4.11,12.26C1.79,10.9 0.5,8.62 0.5,6.5C0.5,3.46 2.96,1 6,1C7.89,1 9.59,1.92 10.67,3.31C11.76,2.2 13.11,1.5 14.6,1.5H13.5M6,3C4.06,3 2.5,4.56 2.5,6.5C2.5,7.95 3.44,9.66 5.36,10.77L5.5,10.83L5.65,10.77C4.62,10 4,8.76 4,7.37C4,5.5 5.5,4 7.37,4H7.5C8.87,4 10.11,4.62 10.89,5.65L11,5.5V5.37C11,5.24 10.76,5.12 10.66,5.09L10.56,5.05L10.45,5C9.39,4.33 8.37,4 7.5,4C6.81,4 6.16,4.09 5.53,4.37C5.31,3.59 4.72,3 4,3H6M13.5,3.5C13.03,3.5 12.65,3.88 12.65,4.35C12.65,4.82 13.03,5.2 13.5,5.2C13.97,5.2 14.35,4.82 14.35,4.35C14.35,3.88 13.97,3.5 13.5,3.5M7.37,6C6.5,6 5.8,6.7 5.8,7.57C5.8,8.5 6.62,9.25 7.55,9.25C8.47,9.25 9.3,8.5 9.3,7.57C9.3,6.7 8.61,6 7.74,6H7.37M11.16,13.95C15.17,13.95 18.42,17.2 18.42,21.2C18.42,21.5 18.38,21.795 18.35,22.075C16.95,22.605 16.36,23.115 16.85,22.845L16.94,22.8C16.42,23.1 15.85,23.355 15.25,23.55C14.66,23.73 14.04,23.825 13.4,23.825C9.4,23.825 6.15,20.575 6.15,16.575C6.15,16.32 6.16,16.07 6.2,15.825C7.5,14.265 8.95,13.475 10.66,13.525L11.16,13.55V13.95Z" />
                            </svg>
                          </div>
                          <span className="text-xs text-amber-100">Each bean is linked to Satoshi's original blockchain work</span>
                          <div className="w-5 h-5 text-amber-300">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M11.5,1.5C10.41,1.5 9.5,2.41 9.5,3.5C9.5,4.5 10.17,5.31 11.09,5.5C11.03,5.83 11,6.16 11,6.5C11,10.09 13.91,13 17.5,13C18.67,13 19.76,12.71 20.71,12.2L20.87,12.29L20.89,12.26C23.21,10.9 24.5,8.62 24.5,6.5C24.5,3.46 22.04,1 19,1C17.11,1 15.41,1.92 14.33,3.31C13.24,2.2 11.89,1.5 10.4,1.5H11.5M19,3C20.94,3 22.5,4.56 22.5,6.5C22.5,7.95 21.56,9.66 19.64,10.77L19.5,10.83L19.35,10.77C20.38,10 21,8.76 21,7.37C21,5.5 19.5,4 17.63,4H17.5C16.13,4 14.89,4.62 14.11,5.65L14,5.5V5.37C14,5.24 14.24,5.12 14.34,5.09L14.44,5.05L14.55,5C15.61,4.33 16.63,4 17.5,4C18.19,4 18.84,4.09 19.47,4.37C19.69,3.59 20.28,3 21,3H19M11.5,3.5C11.97,3.5 12.35,3.88 12.35,4.35C12.35,4.82 11.97,5.2 11.5,5.2C11.03,5.2 10.65,4.82 10.65,4.35C10.65,3.88 11.03,3.5 11.5,3.5M17.63,6C18.5,6 19.2,6.7 19.2,7.57C19.2,8.5 18.38,9.25 17.45,9.25C16.53,9.25 15.7,8.5 15.7,7.57C15.7,6.7 16.39,6 17.26,6H17.63M12.84,13.95C8.83,13.95 5.58,17.2 5.58,21.2C5.58,21.5 5.62,21.795 5.65,22.075C7.05,22.605 7.64,23.115 7.15,22.845L7.06,22.8C7.58,23.1 8.15,23.355 8.75,23.55C9.34,23.73 9.96,23.825 10.6,23.825C14.6,23.825 17.85,20.575 17.85,16.575C17.85,16.32 17.84,16.07 17.8,15.825C16.5,14.265 15.05,13.475 13.34,13.525L12.84,13.55V13.95Z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h-1 w-48 mx-auto md:mx-0 bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-500 rounded-full opacity-80 animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Enter button with higher z-index positioned for both mobile and desktop */}
            {showEnterButton && (
              <motion.div 
                key="enter-button"
                className="absolute z-50 md:top-32 top-auto bottom-40 md:bottom-28 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.5,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                <div className="relative cursor-pointer" onClick={handleOpenAccessDialog}>
                  {/* Pulsing glow effect behind button */}
                  <div className="absolute inset-0 bg-amber-500/30 rounded-lg blur-xl animate-pulse"></div>
                  
                  {/* Main button with golden animation border */}
                  <Button 
                    type="button"
                    size="lg"
                    className="relative bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 px-10 py-7 text-white text-xl shadow-2xl shadow-amber-500/40 min-w-[240px] border-2 border-yellow-400/80 animate-border-pulse"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    <span className="flex items-center justify-center gap-3">
                      <Lock className="w-6 h-6 text-yellow-300 animate-pulse" />
                      ENTER MINING
                      <ChevronRightIcon className="w-6 h-6 text-yellow-300" />
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WelcomeAnimation;