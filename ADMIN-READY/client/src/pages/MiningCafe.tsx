import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Bitcoin, Coffee, Book, Users, Coins, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ElectricBorder, SpaceCard } from '@/components/ui/ElectricBorder';
import { ChatRoom } from '@/components/ui/ChatRoom';
import { ScreenShare } from '@/components/ui/ScreenShare';

export default function MiningCafe() {
  const [, setLocation] = useLocation();
  
  // Track user activity for the cafe features
  useEffect(() => {
    // Function to track user activity
    const trackActivity = async () => {
      try {
        await fetch('/api/activity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}) // Server will get username from session
        });
      } catch (error) {
        console.warn("Failed to track activity:", error);
      }
    };
    
    // Track activity on initial load
    trackActivity();
    
    // Track activity every 60 seconds to maintain active status
    const intervalId = setInterval(trackActivity, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Define the mining stats type
  interface MiningStats {
    totalHashRate: string;
    estimatedEarnings: { 
      daily: string;
      monthly: string;
    }
  }

  // Default mining stats
  const defaultStats: MiningStats = {
    totalHashRate: '0 TH/s',
    estimatedEarnings: { 
      daily: '0.00000000',
      monthly: '0.00000000'
    }
  };

  // Query mining stats with proper typing
  const { data: fetchedStats } = useQuery<MiningStats>({ 
    queryKey: ['/api/mining/stats'],
    placeholderData: defaultStats
  });
  
  // Use fetched data or default to our placeholder data
  const miningStats = fetchedStats || defaultStats;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>KLOUD-BUGS MINING CAFE</h1>
          <p className="text-xl text-gray-400">A social hub for miners and token holders</p>
        </div>

        {/* Cosmic Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mining Stats Card with Electric Border */}
          <ElectricBorder 
            cornerSize="md" 
            cornerAccentColor="border-teal-500"
            edgeGlowColor="rgba(20, 184, 166, 0.6)"
          >
            <Card className="bg-black/70 backdrop-blur-lg border-none p-6 shadow-xl">
              <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="p-2 rounded-full bg-teal-900/50 border border-teal-500/30"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(20, 184, 166, 0.3)',
                      '0 0 10px rgba(20, 184, 166, 0.6)',
                      '0 0 0px rgba(20, 184, 166, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Zap className="w-5 h-5 text-purple-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">MINING STATS</h2>
              </motion.div>
              
              <div className="space-y-5">
                <motion.div 
                  className="flex justify-between items-center border-b border-purple-900/30 pb-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <span className="text-purple-300/70 font-medium flex items-center">
                    <motion.span 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="inline-block mr-2"
                    >
                      ⚙️
                    </motion.span>
                    Hashrate
                  </span>
                  <motion.span 
                    className="text-purple-100 font-mono font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {miningStats?.totalHashRate || '0 TH/s'}
                  </motion.span>
                </motion.div>
                
                <motion.div 
                  className="flex justify-between items-center border-b border-teal-900/30 pb-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <span className="text-teal-300/70 font-medium flex items-center">
                    <motion.span 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-block mr-2"
                    >
                      🔄
                    </motion.span>
                    Daily Earnings
                  </span>
                  <motion.span 
                    className="text-teal-100 font-mono font-semibold"
                    animate={{
                      textShadow: miningStats?.estimatedEarnings?.daily !== '0.00000000' ? 
                        ['0 0 0px rgba(20, 184, 166, 0)', '0 0 5px rgba(20, 184, 166, 0.7)', '0 0 0px rgba(20, 184, 166, 0)'] : 
                        []
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {miningStats?.estimatedEarnings?.daily || '0.00000000'} BTC
                  </motion.span>
                </motion.div>
                
                <motion.div 
                  className="flex justify-between items-center border-b border-teal-900/30 pb-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <span className="text-teal-300/70 font-medium flex items-center">
                    <motion.span 
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-block mr-2"
                    >
                      📅
                    </motion.span>
                    Monthly Projection
                  </span>
                  <motion.span 
                    className="text-teal-100 font-mono font-semibold"
                    animate={{
                      textShadow: miningStats?.estimatedEarnings?.monthly !== '0.00000000' ? 
                        ['0 0 0px rgba(20, 184, 166, 0)', '0 0 5px rgba(20, 184, 166, 0.7)', '0 0 0px rgba(20, 184, 166, 0)'] : 
                        []
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {miningStats?.estimatedEarnings?.monthly || '0.00000000'} BTC
                  </motion.span>
                </motion.div>
                
                <motion.div
                  className="pt-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Button 
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold"
                    onClick={() => setLocation('/mining')}
                  >
                    <motion.div 
                      className="flex items-center justify-center w-full"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      MANAGE MINING
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
            </Card>
          </ElectricBorder>

          {/* Center Feature Area - Orbital Token Display */}
          <div className="lg:col-span-1 flex flex-col justify-center items-center">
            {/* Orbital Animation Container */}
            <div className="relative h-[350px] w-full overflow-hidden">
              {/* Center platform ring */}
              <div className="absolute left-1/2 top-1/2 w-[340px] h-[340px] border border-purple-500/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-[spin_120s_linear_infinite] shadow-[0_0_15px_rgba(168,85,247,0.2)]"></div>
              
              {/* Center platform logo */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="absolute inset-0 w-36 h-36 bg-gradient-to-r from-purple-600/50 to-blue-600/50 rounded-full blur-xl animate-pulse-slow"></div>
                <div className="relative w-32 h-32 mx-auto rounded-full flex items-center justify-center overflow-hidden shadow-lg border border-blue-500/30 bg-gradient-to-br from-blue-600/80 to-purple-600/80 animate-pulse-slow" style={{ boxShadow: '0 0 25px rgba(99, 102, 241, 0.6)' }}>
                  <img 
                    src="/logo1.png" 
                    alt="KLOUD-BUGS Platform" 
                    className="w-28 h-28 object-cover"
                  />
                </div>
                <p className="mt-3 text-center font-medium text-white text-lg" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.1em" }}>CAFE</p>
              </div>
              
              {/* Bitcoin Token - Position 1 */}
              <div className="absolute left-1/2 top-1/2 w-[300px] h-[300px] animate-[spin_28s_linear_infinite]">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500/80 to-yellow-400/80 shadow-lg animate-[glow-pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '0s' }}>
                    <Bitcoin className="w-10 h-10 text-white animate-[pulse-slow_4s_ease-in-out_infinite]" style={{ animationDelay: '-0.5s' }} />
                  </div>
                  <p className="mt-1 text-center font-medium text-white text-sm">BTC</p>
                </div>
              </div>
              
              {/* MPT Token - Position 2 */}
              <div className="absolute left-1/2 top-1/2 w-[300px] h-[300px] animate-[spin_30s_linear_infinite] [animation-delay:_-10s]">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600/80 to-indigo-600/80 shadow-lg animate-[glow-pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '-1s' }}>
                    <img 
                      src="/logo1.png" 
                      alt="MPT Token" 
                      className="w-16 h-16 object-cover animate-[pulse-slow_4s_ease-in-out_infinite]" 
                      style={{ animationDelay: '-0.5s' }}
                    />
                  </div>
                  <p className="mt-1 text-center font-medium text-white text-sm">MPT</p>
                </div>
              </div>
              
              {/* TERA Token - Position 3 */}
              <div className="absolute left-1/2 top-1/2 w-[300px] h-[300px] animate-[spin_25s_linear_infinite] [animation-delay:_-5s]">
                <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative w-20 h-20">
                    {/* Animated glow effect */}
                    <motion.div 
                      className="absolute -inset-2 bg-gradient-to-r from-amber-500/40 to-yellow-400/40 rounded-full blur-md z-0"
                      animate={{ 
                        opacity: [0.4, 0.8, 0.4],
                        scale: [0.95, 1.05, 0.95] 
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />
                    
                    <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden shadow-lg backdrop-blur-sm relative z-10 border-2 border-amber-500/30">
                      <motion.img 
                        src="/tokens/tera-token.png" 
                        alt="TERA Token - Civil Rights Initiative" 
                        className="w-20 h-20 object-cover" 
                        animate={{ 
                          scale: [0.95, 1, 0.95],
                          boxShadow: [
                            '0 0 0px rgba(245, 158, 11, 0.5)', 
                            '0 0 15px rgba(245, 158, 11, 0.8)', 
                            '0 0 0px rgba(245, 158, 11, 0.5)'
                          ] 
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                  <div className="mt-1 text-center">
                    <motion.p 
                      className="font-bold text-sm bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent"
                      animate={{ 
                        textShadow: [
                          '0 0 0px rgba(245, 158, 11, 0.5)', 
                          '0 0 5px rgba(245, 158, 11, 0.8)', 
                          '0 0 0px rgba(245, 158, 11, 0.5)'
                        ] 
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      TERA
                    </motion.p>
                    <motion.div
                      animate={{ y: [0, -1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <p className="text-xs text-white font-medium">Social Justice</p>
                    </motion.div>
                  </div>
                </div>
              </div>
              

            </div>
            
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>CORE TOKENS</h2>
              <p className="text-gray-400">Powering our mining ecosystem</p>
            </div>
          </div>
          
          {/* Civil Rights Initiative Card */}
          <ElectricBorder 
            cornerSize="md" 
            cornerAccentColor="border-amber-500"
            edgeGlowColor="rgba(245, 158, 11, 0.6)"
          >
            <Card className="bg-black/70 backdrop-blur-lg border-none p-6 shadow-xl h-full">
              <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="p-2 rounded-full bg-amber-900/50 border border-amber-500/30"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(245, 158, 11, 0.3)',
                      '0 0 10px rgba(245, 158, 11, 0.6)',
                      '0 0 0px rgba(245, 158, 11, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Coins className="w-5 h-5 text-amber-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>SOCIAL JUSTICE</h2>
              </motion.div>
              
              <div className="flex flex-col h-full">
                <div className="relative rounded-lg overflow-hidden mb-4">
                  {/* Holo-frame effect */}
                  <div className="absolute inset-0 p-[2px] rounded-lg z-0">
                    <div className="absolute inset-0 rounded-lg" 
                      style={{ 
                        background: 'linear-gradient(45deg, rgba(251, 191, 36, 0) 0%, rgba(251, 191, 36, 0.3) 50%, rgba(251, 191, 36, 0) 100%)',
                        backgroundSize: '200% 200%',
                        animation: 'gradient-shift 3s ease infinite'
                      }} 
                    />
                  </div>
                  
                  {/* Animated glow effect */}
                  <motion.div 
                    className="absolute -inset-2 bg-gradient-to-r from-amber-500/40 to-yellow-400/40 rounded-xl blur-md z-0"
                    animate={{ 
                      opacity: [0.4, 0.8, 0.4],
                      scale: [0.98, 1.02, 0.98] 
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  />
                  
                  {/* Electric effect overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-yellow-300/20 z-10 opacity-0"
                    animate={{ 
                      opacity: [0, 0.8, 0],
                      backgroundPosition: ['0% 0%', '100% 100%'] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeOut" 
                    }}
                    style={{
                      backgroundImage: 'url("/electric-overlay.svg")',
                      backgroundSize: '200% 200%',
                      mixBlendMode: 'color-dodge'
                    }}
                  />
                  
                  <img 
                    src="/tokens/tera-token.png" 
                    alt="Mother and Children - TERA Token Civil Rights Theme" 
                    className="w-full h-auto rounded-lg relative z-10"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent pointer-events-none z-20"></div>
                  
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 p-4 z-30"
                    animate={{ y: [2, -2, 2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <motion.span 
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold"
                      animate={{ 
                        boxShadow: [
                          '0 0 0px rgba(245, 158, 11, 0.5)', 
                          '0 0 10px rgba(245, 158, 11, 0.8)', 
                          '0 0 0px rgba(245, 158, 11, 0.5)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      TERA Token Mission
                    </motion.span>
                  </motion.div>
                </div>
                
                <motion.p 
                  className="text-amber-100/80 mb-4 flex-grow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Our TERA token supports families worldwide who need help and answers. A portion of all mining rewards is directed to our social justice mission.
                </motion.p>
                
                <motion.div
                  className="mt-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold"
                    onClick={() => setLocation('/tera-info')}
                  >
                    <motion.div 
                      className="flex items-center justify-center w-full"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      LEARN ABOUT TERA
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
            </Card>
          </ElectricBorder>
        </div>
        
        {/* Community & Cafe Features */}
        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-8 text-center"
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                scale: [0.95, 1.05, 0.95]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-[400px] h-[100px] bg-gradient-to-r from-cyan-900/0 via-cyan-700/30 to-cyan-900/0 rounded-full blur-[40px]" />
            </motion.div>
            
            <h2 
              className="text-3xl font-bold relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400" 
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              MINING CAFE FEATURES
            </h2>
            
            <motion.div
              className="w-32 h-1 mx-auto mt-3 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: 'linear' 
                }}
                style={{ backgroundSize: '200% 100%' }}
              />
            </motion.div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[
              {
                title: "Community Mining",
                description: "Join forces with other ASIC miner operators to increase your collective hashrate and earn more consistent rewards through our community mining pools.",
                icon: Users,
                color: "blue",
                action: "Join Pool →"
              },
              {
                title: "Token Staking",
                description: "Stake your MPT and TERA tokens to earn additional rewards and gain governance rights in platform decisions and development direction.",
                icon: Coins,
                color: "purple",
                action: "Stake Now →"
              },
              {
                title: "Social Impact",
                description: "Contribute to our social justice initiatives through mining. Your participation helps fund legal resources, community support, and family assistance.",
                icon: Coins,
                color: "cyan",
                action: "Learn More →"
              },
              {
                title: "Education Center",
                description: "Access our library of resources on mining best practices, token economics, and blockchain technology to help you maximize your mining effectiveness.",
                icon: Book,
                color: "teal",
                action: "Explore Resources →"
              },
              {
                title: "Hardware Optimization",
                description: "Get expert advice on optimizing your ASIC mining hardware for maximum efficiency and longevity, with specialized settings for different models.",
                icon: Zap,
                color: "amber",
                action: "Optimize Now →"
              },
              {
                title: "Secure Wallet Integration",
                description: "Connect your hardware wallet for the most secure mining experience, ensuring all your mining rewards go directly to your secure storage.",
                icon: Bitcoin,
                color: "purple",
                action: "Connect Wallet →"
              }
            ].map((feature, i) => (
              <motion.div
                key={`feature-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <SpaceCard 
                  glowColor={feature.color as "blue" | "purple" | "cyan" | "teal" | "amber"} 
                  className="h-full"
                >
                  <motion.div 
                    className="flex items-center gap-3 mb-4"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <motion.div 
                      className={`p-2 rounded-full bg-${feature.color}-900/50 border border-${feature.color}-500/30`}
                      animate={{
                        boxShadow: [
                          `0 0 0px rgba(var(--${feature.color}-rgb), 0.3)`,
                          `0 0 10px rgba(var(--${feature.color}-rgb), 0.6)`,
                          `0 0 0px rgba(var(--${feature.color}-rgb), 0.3)`
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <feature.icon className={`w-5 h-5 text-${feature.color}-400`} />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  </motion.div>
                  
                  <p className="text-gray-300 mb-4">
                    {feature.description}
                  </p>
                  
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="mt-auto"
                  >
                    <Button 
                      variant="link" 
                      className={`text-${feature.color}-400 p-0 hover:text-${feature.color}-300 font-semibold`}
                    >
                      {feature.action}
                    </Button>
                  </motion.div>
                </SpaceCard>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Chat and Screen Sharing Features */}
        <div className="mt-16 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-8 text-center"
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                scale: [0.95, 1.05, 0.95]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-[600px] h-16 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-purple-600/0 rounded-full blur-xl"></div>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold relative z-10" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                COSMIC COMMUNICATIONS
              </span>
            </h2>
            <p className="text-gray-400 text-lg mt-2 relative z-10">Connect with miners across the galaxy in real-time</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Chat Room */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col h-[600px]"
            >
              <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Cosmic Chat Room
              </h3>
              <div className="flex-1">
                <ChatRoom />
              </div>
            </motion.div>
            
            {/* Screen Sharing */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col h-[600px]"
            >
              <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Cosmic Screen Sharing
              </h3>
              <div className="flex-1">
                <ScreenShare />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-20 relative">
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ 
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/20 to-blue-900/10 rounded-xl blur-[80px]" />
          </motion.div>
          
          <ElectricBorder
            className="p-8 rounded-xl"
            cornerSize="lg"
            cornerAccentColor="border-purple-500"
            edgeGlowColor="rgba(168, 85, 247, 0.6)"
          >
            <div className="text-center relative z-10">
              <motion.h2 
                className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400" 
                style={{ fontFamily: "'Orbitron', sans-serif" }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                JOIN THE MINING REVOLUTION
              </motion.h2>
              
              <motion.p 
                className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Become part of our growing community of Bitcoin miners who are supporting both blockchain innovation and social justice initiatives using our platform.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 relative overflow-hidden group"
                  onClick={() => setLocation('/subscription-mining')}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/30 to-blue-400/0 opacity-0 group-hover:opacity-100"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 0%'],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: '200% 100%',
                    }}
                  />
                  <span className="relative z-10 flex items-center font-medium">
                    <Zap className="w-5 h-5 mr-2" />
                    START MINING NOW
                  </span>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-900/20 relative overflow-hidden group"
                  onClick={() => setLocation('/token-allocation')}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 0%'],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: '200% 100%',
                    }}
                  />
                  <span className="relative z-10 flex items-center font-medium">
                    <Coins className="w-5 h-5 mr-2" />
                    EXPLORE TOKEN ECOSYSTEM
                  </span>
                </Button>
              </motion.div>
            </div>
          </ElectricBorder>
        </div>
      </div>
    </MainLayout>
  );
}