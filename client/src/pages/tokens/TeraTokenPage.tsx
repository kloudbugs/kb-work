import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Bitcoin, Award, ShieldAlert, Users, Gavel, Wallet, Coins, LineChart } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

// Import the token image directly
import teraTokenImage from '../assets/tokens/tera-token.png';
import electricOverlayImage from '../assets/electric-overlay.svg';

export function TeraTokenPage() {
  // Animation for random floating tokens
  const [tokens, setTokens] = useState<{id: number, x: number, y: number, scale: number, rotation: number, delay: number}[]>([]);
  
  useEffect(() => {
    // Create random tokens for the background
    const tokenCount = 15;
    const newTokens = Array.from({ length: tokenCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.5 + Math.random() * 0.5,
      rotation: Math.random() * 360,
      delay: Math.random() * 2
    }));
    setTokens(newTokens);
  }, []);

  // Content for the MainLayout
  const TeraTokenContent = (
    <div className="container mx-auto py-6 space-y-8">
      {/* Floating TERA tokens in background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {tokens.map((token) => (
          <motion.div
            key={token.id}
            className="absolute" 
            style={{ 
              left: `${token.x}%`, 
              top: `${token.y}%`,
              opacity: 0.15,
              zIndex: -1
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.05, 0.15, 0.05],
              rotate: [token.rotation, token.rotation + 20, token.rotation]
            }}
            transition={{
              duration: 5 + token.delay,
              repeat: Infinity, 
              ease: "easeInOut",
              delay: token.delay
            }}
          >
            <img 
              src={teraTokenImage} 
              alt="" 
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
              style={{ transform: `scale(${token.scale})` }}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Hero Section with Animated TERA Token */}
      <div className="relative mb-12 overflow-hidden rounded-xl bg-gradient-to-br from-purple-900/20 to-indigo-900/10 p-8">
        <motion.div 
          className="absolute -inset-px bg-gradient-to-r from-purple-800/40 to-fuchsia-700/30 rounded-xl blur-md"
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            scale: [0.98, 1.02, 0.98]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      
        <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="mb-8 md:mb-0 md:mr-8">
            <motion.h1 
              className="text-5xl md:text-7xl text-center relative z-20 tracking-wider"
              style={{
                fontFamily: "'Tangerine', 'Great Vibes', cursive, 'Playfair Display', serif",
                background: "linear-gradient(to right, #ffffff, #a855f7, #facc15)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                textShadow: "0 0 15px rgba(168, 85, 247, 0.7)",
                fontWeight: 900,
                fontStyle: "italic",
                letterSpacing: "0.05em",
                filter: "drop-shadow(0 0 10px rgba(250, 204, 21, 0.6))",
              }}
              initial={{ opacity: 0, y: -30, scale: 0.9, rotateX: 45 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                rotateX: 0,
                backgroundPosition: ["0% center", "200% center"],
                textShadow: [
                  "0 0 10px rgba(255, 255, 255, 0.6)", 
                  "0 0 20px rgba(168, 85, 247, 0.8)", 
                  "0 0 15px rgba(250, 204, 21, 0.7)"
                ] 
              }}
              transition={{ 
                duration: 2,
                backgroundPosition: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                },
                textShadow: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              TERA TOKEN
            </motion.h1>
            
            {/* Pure purple halo glow behind title */}
            <div 
              className="absolute inset-0 z-10 opacity-70 rounded-full blur-3xl mb-4"
              style={{
                background: "radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(168, 85, 247, 0.4) 30%, rgba(139, 92, 246, 0.3) 60%, rgba(0, 0, 0, 0) 80%)",
                transform: "translateY(40px)"
              }}
            />
            
            <div className="flex items-center mb-4">
              <motion.div 
                className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-600 text-white mr-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Gavel className="h-4 w-4" />
              </motion.div>
              <p className="text-lg font-medium">Supporting Social Justice Initiatives</p>
            </div>
            
            <p className="text-lg text-muted-foreground">
              Named after Tera Ann Harris, our token empowers communities by directing 33% of mining rewards 
              toward initiatives that promote legal accountability and justice.
            </p>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <motion.div 
                className="bg-gradient-to-r from-purple-700 to-fuchsia-600 px-3 py-1 rounded-full text-white text-sm font-medium inline-flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Award className="h-4 w-4 mr-1" />
                33% of Mining Rewards
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 rounded-full text-white text-sm font-medium inline-flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ShieldAlert className="h-4 w-4 mr-1" />
                Social Justice Focus
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1 rounded-full text-white text-sm font-medium inline-flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Users className="h-4 w-4 mr-1" />
                Community Governed
              </motion.div>
            </div>
          </div>
          
          <div className="relative">
            <motion.div 
              className="absolute -inset-4 bg-gradient-to-r from-purple-800/60 to-fuchsia-700/50 rounded-full blur-lg"
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
            
            <div className="relative">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-purple-700/30 to-fuchsia-500/30 rounded-full"
                animate={{ 
                  opacity: [0, 0.8, 0],
                  scale: [0.8, 1.2, 0.8],
                  rotate: [0, 360, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{
                  backgroundImage: `url(${electricOverlayImage})`,
                  backgroundSize: '200% 200%',
                  mixBlendMode: 'color-dodge'
                }}
              />
              
              <motion.img 
                src={teraTokenImage} 
                alt="TERA Token" 
                className="relative w-40 h-40 md:w-60 md:h-60 rounded-full"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              
              <motion.div 
                className="absolute inset-0 rounded-full"
                animate={{ 
                  boxShadow: [
                    '0 0 0px rgba(147, 51, 234, 0.5)', 
                    '0 0 30px rgba(147, 51, 234, 0.8)', 
                    '0 0 0px rgba(147, 51, 234, 0.5)'
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white px-4 py-1 rounded-full text-sm font-bold"
              animate={{ 
                y: [-2, 2, -2],
                boxShadow: [
                  '0 0 0px rgba(147, 51, 234, 0.5)', 
                  '0 0 10px rgba(147, 51, 234, 0.8)', 
                  '0 0 0px rgba(147, 51, 234, 0.5)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Bitcoin className="h-4 w-4 inline mr-1" />
              TERA
            </motion.div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
          <TabsTrigger value="acquisition">How to Acquire</TabsTrigger>
          <TabsTrigger value="mission">Mission & Purpose</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TERA Token Overview</CardTitle>
              <CardDescription>
                The TERA token powers the KLOUD-BUGS-MINING-CAFE ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-center bg-primary/10 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-primary mb-2">Current Price</h3>
                    <p className="text-3xl font-bold">$0.0421</p>
                    <p className="text-sm text-muted-foreground">+5.2% in 24h</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Supply Information</h3>
                    <div className="flex justify-between">
                      <span>Current Supply:</span>
                      <span className="font-semibold">42,000,000 TERA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Supply:</span>
                      <span className="font-semibold">100,000,000 TERA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Circulation Progress:</span>
                      <span className="font-semibold">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-primary">•</div>
                        <div>
                          <span className="font-medium">Social Impact:</span> Each transaction contributes to legal accountability initiatives
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-primary">•</div>
                        <div>
                          <span className="font-medium">Mining Rewards:</span> Earn TERA tokens through mining activity in our ecosystem
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-primary">•</div>
                        <div>
                          <span className="font-medium">Governance:</span> Token holders can vote on new initiatives and community proposals
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-primary">•</div>
                        <div>
                          <span className="font-medium">Exclusive Access:</span> Unlock premium features in the KLOUD-BUGS ecosystem
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-center p-4">
                    <Button className="w-full">Connect Wallet to Manage TERA</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>TERA for Mining</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use TERA tokens to boost mining rewards and unlock premium mining features.
                </p>
                <Button variant="outline" className="w-full mt-4">Learn More</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>TERA for Justice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Support legal accountability and social justice initiatives through TERA.
                </p>
                <Button variant="outline" className="w-full mt-4">View Impact</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>TERA Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Join our exclusive community of TERA holders and contribute to our mission.
                </p>
                <Button variant="outline" className="w-full mt-4">Join Community</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tokenomics" className="space-y-4">
          <Card className="relative overflow-hidden">
            {/* Background TERA token watermark */}
            <div className="absolute right-0 bottom-0 pointer-events-none">
              <motion.img 
                src={teraTokenImage} 
                alt="" 
                className="w-64 h-64 opacity-5"
                initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                animate={{ opacity: 0.05, scale: 1, rotate: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>
            
            <CardHeader>
              <div className="flex items-center">
                <CardTitle>TERA Token Tokenomics</CardTitle>
                <motion.div 
                  className="ml-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs rounded-full px-2 py-1 font-bold"
                  animate={{ 
                    boxShadow: [
                      '0 0 0px rgba(245, 158, 11, 0.5)', 
                      '0 0 10px rgba(245, 158, 11, 0.8)', 
                      '0 0 0px rgba(245, 158, 11, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  33% Mining Rewards
                </motion.div>
              </div>
              <CardDescription>
                Distribution and allocation of TERA tokens
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <motion.div 
                      className="mr-4 p-2 rounded-full bg-amber-100 dark:bg-amber-900/20"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <img 
                        src={teraTokenImage} 
                        alt="TERA token" 
                        className="w-10 h-10 rounded-full"
                      />
                    </motion.div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">
                      Token Allocation
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <motion.span 
                          className="font-semibold text-amber-500 flex items-center"
                          animate={{ x: [0, 2, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Bitcoin className="w-4 h-4 mr-1 inline" />
                          Mining Rewards Distribution
                        </motion.span>
                        <motion.span 
                          className="font-semibold text-amber-500"
                          animate={{ 
                            textShadow: [
                              '0 0 0px rgba(245, 158, 11, 0.3)', 
                              '0 0 5px rgba(245, 158, 11, 0.6)', 
                              '0 0 0px rgba(245, 158, 11, 0.3)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          33%
                        </motion.span>
                      </div>
                      <motion.div 
                        className="relative"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Progress value={33} className="h-2 bg-gray-200 dark:bg-gray-700" />
                        <motion.div 
                          className="absolute inset-0 overflow-hidden rounded-full"
                          animate={{ width: ["0%", "33%", "33%"] }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                          <div className="w-full h-full bg-gradient-to-r from-amber-500 to-yellow-400"></div>
                        </motion.div>
                      </motion.div>
                      <p className="text-xs text-muted-foreground mt-1">
                        33% of all mining rewards are automatically allocated to the TERA token ecosystem
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="flex items-center">
                          <Gavel className="w-4 h-4 mr-1 text-purple-500" />
                          Social Justice Initiatives
                        </span>
                        <span>25%</span>
                      </div>
                      <motion.div 
                        className="relative"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Progress value={25} className="h-2 bg-gray-200 dark:bg-gray-700" />
                      </motion.div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-blue-500" />
                          Ecosystem Development
                        </span>
                        <span>20%</span>
                      </div>
                      <motion.div 
                        className="relative"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <Progress value={20} className="h-2 bg-gray-200 dark:bg-gray-700" />
                      </motion.div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Team and Advisors</span>
                        <span>10%</span>
                      </div>
                      <motion.div 
                        className="relative"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <Progress value={10} className="h-2 bg-gray-200 dark:bg-gray-700" />
                      </motion.div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Strategic Partnerships</span>
                        <span>5%</span>
                      </div>
                      <motion.div 
                        className="relative"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <Progress value={5} className="h-2 bg-gray-200 dark:bg-gray-700" />
                      </motion.div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Reserve</span>
                        <span>5%</span>
                      </div>
                      <motion.div 
                        className="relative"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <Progress value={5} className="h-2 bg-gray-200 dark:bg-gray-700" />
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <motion.div 
                      className="mr-4 p-2 rounded-full bg-amber-100 dark:bg-amber-900/20"
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    >
                      <img 
                        src={teraTokenImage} 
                        alt="TERA token" 
                        className="w-10 h-10 rounded-full"
                      />
                    </motion.div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">
                      Release Schedule
                    </h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    TERA tokens are released gradually over a 5-year period to ensure sustainable growth and adoption.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Year 1 (Current)</span>
                        <span className="font-medium flex items-center">
                          <motion.img 
                            src={teraTokenImage} 
                            alt="TERA" 
                            className="w-4 h-4 mr-1"
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          42,000,000 TERA
                        </span>
                      </div>
                      <motion.div 
                        className="relative"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.7 }}
                      >
                        <Progress value={42} className="h-2 bg-gray-200 dark:bg-gray-700" />
                      </motion.div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Year 2</span>
                        <span className="flex items-center">
                          <motion.img 
                            src={teraTokenImage} 
                            alt="TERA" 
                            className="w-4 h-4 mr-1"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                          />
                          65,000,000 TERA
                        </span>
                      </div>
                      <motion.div 
                        className="relative"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                      >
                        <Progress value={65} className="h-2 bg-gray-200 dark:bg-gray-700" />
                      </motion.div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Year 3</span>
                        <span className="flex items-center">
                          <motion.img 
                            src={teraTokenImage} 
                            alt="TERA" 
                            className="w-4 h-4 mr-1"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                          />
                          80,000,000 TERA
                        </span>
                      </div>
                      <motion.div 
                        className="relative"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                      >
                        <Progress value={80} className="h-2 bg-gray-200 dark:bg-gray-700" />
                      </motion.div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Year 4</span>
                        <span className="flex items-center">
                          <motion.img 
                            src={teraTokenImage} 
                            alt="TERA" 
                            className="w-4 h-4 mr-1"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 }}
                          />
                          90,000,000 TERA
                        </span>
                      </div>
                      <motion.div 
                        className="relative"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                      >
                        <Progress value={90} className="h-2 bg-gray-200 dark:bg-gray-700" />
                      </motion.div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Year 5</span>
                        <span className="flex items-center">
                          <motion.img 
                            src={teraTokenImage} 
                            alt="TERA" 
                            className="w-4 h-4 mr-1"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}
                          />
                          100,000,000 TERA
                        </span>
                      </div>
                      <motion.div 
                        className="relative"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                      >
                        <Progress value={100} className="h-2 bg-gray-200 dark:bg-gray-700" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Animated TERA token allocation visual */}
              <div className="mt-8 relative h-40 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg p-4 overflow-hidden">
                <h4 className="text-lg font-medium mb-2">Token Allocation Visualization</h4>
                <div className="absolute inset-0 flex items-end">
                  <motion.div 
                    className="h-[33%] w-[33%] bg-gradient-to-t from-amber-500 to-yellow-400 relative rounded-t-md"
                    initial={{ height: 0 }}
                    animate={{ height: "33%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    <motion.div 
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="flex flex-col items-center">
                        <img src={teraTokenImage} alt="TERA" className="w-6 h-6" />
                        <span className="text-xs font-bold text-amber-500">33%</span>
                        <span className="text-[10px] text-gray-500">Mining</span>
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="h-[25%] w-[25%] bg-gradient-to-t from-purple-500 to-violet-500 relative rounded-t-md"
                    initial={{ height: 0 }}
                    animate={{ height: "25%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <motion.div 
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-purple-500">25%</span>
                        <span className="text-[10px] text-gray-500">Justice</span>
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="h-[20%] w-[20%] bg-gradient-to-t from-blue-500 to-cyan-500 relative rounded-t-md"
                    initial={{ height: 0 }}
                    animate={{ height: "20%" }}
                    transition={{ duration: 1, delay: 0.4 }}
                  >
                    <motion.div 
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-blue-500">20%</span>
                        <span className="text-[10px] text-gray-500">Ecosystem</span>
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="h-[10%] w-[10%] bg-gradient-to-t from-green-500 to-emerald-500 relative rounded-t-md"
                    initial={{ height: 0 }}
                    animate={{ height: "10%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <motion.div 
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-green-500">10%</span>
                        <span className="text-[10px] text-gray-500">Team</span>
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="h-[5%] w-[5%] bg-gradient-to-t from-red-500 to-orange-500 relative rounded-t-md"
                    initial={{ height: 0 }}
                    animate={{ height: "5%" }}
                    transition={{ duration: 1, delay: 0.6 }}
                  >
                    <motion.div 
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-red-500">5%</span>
                        <span className="text-[10px] text-gray-500">Partners</span>
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="h-[5%] w-[5%] bg-gradient-to-t from-gray-500 to-gray-400 relative rounded-t-md"
                    initial={{ height: 0 }}
                    animate={{ height: "5%" }}
                    transition={{ duration: 1, delay: 0.7 }}
                  >
                    <motion.div 
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-500">5%</span>
                        <span className="text-[10px] text-gray-500">Reserve</span>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="acquisition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How to Acquire TERA Tokens</CardTitle>
              <CardDescription>
                Different ways to obtain TERA tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Mining Rewards</h3>
                  <p className="mb-4">
                    Earn TERA tokens by participating in the KLOUD-BUGS-MINING-CAFE ecosystem.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-primary">•</div>
                      <div>Connect your mining hardware</div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-primary">•</div>
                      <div>Contribute hash power to the network</div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-primary">•</div>
                      <div>Receive TERA tokens as additional rewards</div>
                    </li>
                  </ul>
                  <Button className="w-full">Start Mining for TERA</Button>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Exclusive Distribution</h3>
                  <p className="mb-4">
                    TERA tokens are available to select members who align with our mission and values.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-primary">•</div>
                      <div>Apply for access to token distribution</div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-primary">•</div>
                      <div>Demonstrate alignment with social justice values</div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-primary">•</div>
                      <div>Become a contributor to our initiatives</div>
                    </li>
                  </ul>
                  <Button className="w-full">Apply for Access</Button>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Token Distribution Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        1
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold">Community Mining Phase</h4>
                        <p className="text-sm text-muted-foreground">Ongoing - Earn tokens through mining contributions</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        2
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold">Strategic Partner Distribution</h4>
                        <p className="text-sm text-muted-foreground">Q2 2025 - Allocation to strategic justice-focused partners</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        3
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold">Ecosystem Utility Expansion</h4>
                        <p className="text-sm text-muted-foreground">Q4 2025 - Expanded use cases across the KLOUD-BUGS platform</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        4
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold">Governance Implementation</h4>
                        <p className="text-sm text-muted-foreground">2026 - Full community governance and voting rights</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mission & Purpose</CardTitle>
              <CardDescription>
                The story and purpose behind the TERA token
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none dark:prose-invert">
                <h3>Named After Tera Ann Harris</h3>
                <p>
                  The TERA token is named in honor of Tera Ann Harris, a mother who was tragically killed through police violence. 
                  This token stands as a lasting tribute to her memory and as a vehicle for creating positive change.
                </p>
                
                <h3>Supporting Legal Accountability</h3>
                <p>
                  A significant portion of TERA token allocation is dedicated to funding legal initiatives that promote accountability 
                  in law enforcement and the justice system. By supporting these efforts, we aim to prevent similar tragedies and 
                  ensure justice for victims and their families.
                </p>
                
                <h3>Building a Community Around Values</h3>
                <p>
                  The TERA token brings together a community of individuals who share a commitment to social justice and equality. 
                  This isn't just a cryptocurrency—it's a movement powered by blockchain technology that enables collective action 
                  toward meaningful change.
                </p>
                
                <h3>Creating Lasting Impact</h3>
                <p>
                  Through the TERA token ecosystem, we're establishing sustainable funding mechanisms for civil rights organizations, 
                  legal defense funds, and community education programs. Our goal is to create lasting systemic change while honoring 
                  Tera's memory.
                </p>
                
                <blockquote>
                  "The TERA token transforms grief into action, channeling resources toward a more just society while creating 
                  a lasting memorial to Tera Ann Harris."
                </blockquote>
                
                <h3>Join the Movement</h3>
                <p>
                  By participating in the TERA token ecosystem—whether through mining, holding, or using the token—you're 
                  directly contributing to these important causes. Join us in building a more just and accountable society.
                </p>
              </div>
              
              <div className="flex justify-center">
                <Button className="px-8">Support Our Mission</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Render the component using MainLayout
  return (
    <MainLayout>
      {TeraTokenContent}
    </MainLayout>
  );
}

export default TeraTokenPage;