import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import WebsiteLayout from "./WebsiteLayout";
import { 
  Bitcoin,
  ChevronRight, 
  CreditCard, 
  Key, 
  LockKeyhole, 
  Shield, 
  Star, 
  Wallet
} from "lucide-react";
import { NetworkNodesBackground } from "@/components/ui/NetworkNodesBackground";
import { useEffect, useState } from "react";

export default function Home() {
  // State to track if the miner image is loaded
  const [minerImageLoaded, setMinerImageLoaded] = useState(false);
  
  // Preload the miner image
  useEffect(() => {
    const img = new Image();
    img.src = "/images/cmpt-miner.png";
    img.onload = () => setMinerImageLoaded(true);
  }, []);

  return (
    <WebsiteLayout>
      <div className="relative">
        {/* Hero section - Enhanced with more visual elements */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-gray-900 to-black">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          
          {/* Enhanced glowing orbs for more depth */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              {/* Tagline above the orbital system - SUPER Fancy */}
              <div className="text-center mb-12 mt-6 px-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 font-extrabold tracking-widest uppercase" style={{ 
                  textShadow: '0 0 20px rgba(137, 78, 234, 0.8), 0 0 40px rgba(104, 58, 214, 0.5), 0 0 80px rgba(104, 58, 214, 0.3)',
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: '0.12em',
                  animation: 'pulse-glow 4s infinite',
                  transform: 'perspective(500px) translateZ(0px)'
                }}>
                  BLOCKCHAIN MINING FOR CIVIL RIGHTS & SOCIAL JUSTICE
                </h2>
                <div className="flex items-center justify-center my-3">
                  <div className="h-0.5 w-16 bg-gradient-to-r from-blue-500/60 to-transparent rounded-full"></div>
                  <div className="mx-4">
                    <span className="text-purple-400 text-2xl">•</span>
                  </div>
                  <div className="h-0.5 w-16 bg-gradient-to-l from-purple-500/60 to-transparent rounded-full"></div>
                </div>
                <h3 className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold tracking-widest uppercase mt-1" style={{ 
                  textShadow: '0 0 15px rgba(56, 189, 248, 0.6)',
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: '0.1em',
                  animation: 'pulse-glow 4s infinite 1s'
                }}>
                  Hashing Power with Purpose: Connecting Communities With Resources Through Lightning Fast Nodes That HEAR THE VOICE, FUND THE CHANGE, AND Heal The Soul
                </h3>
                <div className="mt-3 w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 mx-auto rounded-full opacity-60 animate-pulse"></div>
              </div>
              
              {/* Hero Orbital Animation System */}
              <div className="relative h-[550px] w-full max-w-[900px] mx-auto mb-6 -mt-10">
                {/* Orbital Rings */}
                <div className="absolute left-1/2 top-1/2 w-[420px] h-[420px] border border-purple-500/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-[spin_120s_linear_infinite] shadow-[0_0_15px_rgba(168,85,247,0.2)]"></div>
                
                {/* Left cryptocurrency orbit */}
                <div className="absolute left-[40%] top-1/2 w-[350px] h-[350px] border border-blue-500/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-[spin_100s_linear_infinite_reverse] shadow-[0_0_10px_rgba(59,130,246,0.2)]"></div>
                
                {/* Bitcoin - Left Orbit */}
                <div className="absolute left-[40%] top-1/2 w-[350px] h-[350px] animate-[spin_25s_linear_infinite_reverse]">
                  <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-28 h-28 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500/80 to-yellow-400/80 shadow-lg animate-[glow-pulse_3s_ease-in-out_infinite]">
                      <Bitcoin className="w-20 h-20 text-white animate-[pulse-slow_4s_ease-in-out_infinite]" />
                    </div>
                  </div>
                </div>
                
                {/* Right token orbit */}
                <div className="absolute left-[60%] top-1/2 w-[350px] h-[350px] border border-cyan-500/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-[spin_110s_linear_infinite] shadow-[0_0_15px_rgba(34,211,238,0.2)]"></div>
                
                {/* MPT Token - Right Orbit Position 1 */}
                <div className="absolute left-[60%] top-1/2 w-[350px] h-[350px] animate-[spin_18s_linear_infinite]">
                  <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-28 h-28 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600/80 to-indigo-600/80 shadow-lg animate-[glow-pulse_3s_ease-in-out_infinite]">
                      <img 
                        src="/logo1.png" 
                        alt="MPT Token" 
                        className="w-28 h-28 object-cover animate-[pulse-slow_4s_ease-in-out_infinite]"
                      />
                    </div>
                  </div>
                </div>
                
                {/* TERA Token - Right Orbit Position 2 */}
                <div className="absolute left-[60%] top-1/2 w-[350px] h-[350px] animate-[spin_18s_linear_infinite] [animation-delay:_-6s]">
                  <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-28 h-28 rounded-full flex items-center justify-center overflow-hidden shadow-lg bg-black/60 backdrop-blur-sm animate-[glow-pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '-1.5s' }}>
                      <img 
                        src="/tera-logo.png" 
                        alt="TERA Token" 
                        className="w-28 h-28 object-cover animate-[pulse-slow_4s_ease-in-out_infinite]" 
                        style={{ animationDelay: '-0.8s' }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Hardware Chip in center */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-40 h-40 rounded-md border-2 border-cyan-500/60 flex items-center justify-center overflow-hidden animate-[spin_15s_linear_infinite] shadow-[0_0_25px_rgba(34,211,238,0.5)]">
                    <div className="w-36 h-36 bg-gradient-to-br from-blue-900/90 to-cyan-900/90 flex items-center justify-center animate-[glow-pulse_5s_ease-in-out_infinite] relative">
                      {/* Hardware Chip SVG Design */}
                      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1.5 p-2 opacity-70">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`rounded-sm ${i % 3 === 0 ? 'bg-cyan-400/60' : 'bg-blue-400/40'} flex items-center justify-center`}
                          >
                            {i % 5 === 0 && <div className="w-1.5 h-1.5 rounded-full bg-cyan-200/90 animate-pulse"></div>}
                          </div>
                        ))}
                      </div>
                      
                      {/* Central processor */}
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-800 rounded-md border border-cyan-400/50 shadow-lg shadow-cyan-900/50 flex items-center justify-center z-10 animate-[pulse-slow_3s_ease-in-out_infinite]">
                        <svg viewBox="0 0 24 24" className="w-10 h-10 text-cyan-100" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9V4m0 0h8M8 4v5m8-5v5M8 9h8m-8 0v5m8-5v5m-8 5h8M3 13h18M3 17h18M3 21h18M3 9h18M3 5h18" />
                        </svg>
                      </div>
                      
                      {/* Connection traces */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-1 bg-cyan-400/30 absolute"></div>
                        <div className="w-1 h-24 bg-cyan-400/30 absolute"></div>
                        <div className="w-20 h-1 bg-cyan-400/30 absolute rotate-45"></div>
                        <div className="w-20 h-1 bg-cyan-400/30 absolute -rotate-45"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              

              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 mb-8 leading-tight tracking-tight drop-shadow-md relative" style={{ 
                textShadow: '0 0 20px rgba(148, 85, 255, 0.8)',
                fontFamily: "'Orbitron', sans-serif"
              }}>
                <span className="relative inline-block">
                  <span className="absolute -inset-1 w-full h-full bg-blue-600/20 blur-xl rounded-lg"></span>
                  <span className="relative">KLOUD-BUGS CAFE</span>
                </span>
                <span className="relative inline-block">
                  <span className="absolute -inset-1 w-full h-full bg-purple-600/20 blur-xl rounded-lg"></span>
                  <span className="relative"> PLATFORM</span>
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-white mb-4" style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em" }}>
                The Future of AI-Powered Bitcoin Mining
              </h2>
              <p className="text-xl font-medium text-blue-100 mb-8 max-w-3xl mx-auto" style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.3)' }}>
                Join the revolution in AI-powered blockchain mining with our innovative unified platform. 
                Mine Bitcoin more efficiently with our advanced neural networks and intelligent optimization algorithms that power our blockchain mining operations.
              </p>
              
              <div className="flex flex-col gap-6 max-w-3xl mx-auto mb-8 px-8 py-6 bg-gray-900/70 border border-blue-500/30 rounded-xl shadow-lg relative" style={{ backdropFilter: 'blur(12px)' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"></div>
                <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"></div>
                <div className="flex flex-row items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-900/80 to-indigo-900/80 p-3 rounded-lg border border-blue-500/20 shadow-md">
                    <svg className="h-6 w-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-300" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.05em' }}>ENHANCED QUANTUM-NEURAL ASIC ARCHITECTURE</h3>
                    <p className="text-blue-200 text-sm leading-relaxed font-medium">Our proprietary KBX-9000 mining architecture implements advanced neural network optimizations that dynamically adjust to blockchain complexity. This innovation delivers 37.5% higher hash rate efficiency while consuming 28% less power compared to conventional ASIC devices.</p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-900/80 to-violet-900/80 p-3 rounded-lg border border-purple-500/20 shadow-md">
                    <svg className="h-6 w-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.05em' }}>ENTERPRISE-GRADE SECURE WALLET INTEGRATION</h3>
                    <p className="text-purple-200 text-sm leading-relaxed font-medium">Our platform integrates with military-grade secure hardware wallet infrastructure. All mining proceeds are automatically transferred to the designated hardware wallet address utilizing multi-signature authentication and advanced cryptographic verification protocols.</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <Link href="/trial-signup">
                  <Button size="lg" className="relative px-12 py-6 text-lg font-bold group overflow-hidden">
                    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-r from-green-500 via-teal-500 to-green-500 group-hover:opacity-100"></span>
                    <span className="absolute top-0 left-0 w-full bg-gradient-to-r from-green-600 to-teal-600 h-full"></span>
                    <span className="relative text-white text-lg tracking-widest">
                      TRY IT FREE
                    </span>
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="bg-yellow-300 text-black text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                        24h
                      </div>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></span>
                  </Button>
                </Link>
                
                <Link href="/mining">
                  <Button size="lg" className="relative px-12 py-6 text-lg font-bold group overflow-hidden">
                    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 group-hover:opacity-100"></span>
                    <span className="absolute top-0 left-0 w-full bg-gradient-to-r from-blue-500 to-purple-600 h-full"></span>
                    <span className="relative text-white text-lg tracking-widest">
                      START BREWING NOW
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </WebsiteLayout>
  );
}
