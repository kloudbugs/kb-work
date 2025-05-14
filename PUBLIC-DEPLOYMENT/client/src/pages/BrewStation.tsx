import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { Coffee, Cpu, Users, Zap, Server, Wrench, Bitcoin } from 'lucide-react';
import { motion } from 'framer-motion';
import { ElectricBorder, SpaceCard } from '@/components/ui/ElectricBorder';

export default function BrewStation() {
  const [, navigate] = useLocation();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="flex items-center justify-between mb-10 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated glow effect behind title */}
          <motion.div 
            className="absolute left-0 -top-4 w-72 h-16 bg-gradient-to-r from-amber-800/0 via-amber-800/30 to-amber-800/0 rounded-full blur-3xl z-0 pointer-events-none"
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
              width: ['15rem', '20rem', '15rem']
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-yellow-800 flex items-center"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <motion.div
                animate={{
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mr-3"
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(245, 158, 11, 0.3)',
                      '0 0 15px rgba(245, 158, 11, 0.7)',
                      '0 0 0px rgba(245, 158, 11, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="p-2 rounded-full bg-amber-900/50 border border-amber-500/30"
                >
                  <Coffee className="h-7 w-7 text-amber-400" />
                </motion.div>
              </motion.div>
              BREW STATION
            </h1>
            
            <motion.div
              className="w-48 h-1 mt-2 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: 192 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-amber-700 to-yellow-800"
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
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Devices - with ElectricBorder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ElectricBorder 
              cornerSize="md" 
              cornerAccentColor="border-yellow-500"
              edgeGlowColor="rgba(234, 179, 8, 0.6)"
              pulseGlow={true}
            >
              <Card 
                className="bg-black/70 backdrop-blur-lg border-none h-full cursor-pointer"
                onClick={() => navigate('/devices')}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="p-2 rounded-full bg-yellow-900/50 border border-yellow-500/30"
                      animate={{
                        boxShadow: [
                          '0 0 0px rgba(234, 179, 8, 0.3)',
                          '0 0 15px rgba(234, 179, 8, 0.7)',
                          '0 0 0px rgba(234, 179, 8, 0.3)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Cpu className="h-5 w-5 text-yellow-400" />
                    </motion.div>
                    
                    <div>
                      <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 text-xl">
                        MINING DEVICES
                      </CardTitle>
                      <CardDescription className="text-blue-300/70">
                        Configure and optimize all hardware
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-blue-100/80 text-sm">
                      Add, configure, and monitor your ASIC miners and other mining devices in one centralized dashboard.
                    </p>
                    
                    <div className="bg-blue-900/20 rounded-md p-3 border border-blue-900/30">
                      <motion.div 
                        className="flex items-center gap-2"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                          <Cpu className="h-4 w-4 text-blue-400" />
                        </motion.div>
                        <span className="text-xs text-blue-300/90">Manage high-performance mining hardware</span>
                      </motion.div>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 relative overflow-hidden group">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-cyan-400/30 to-blue-400/0 opacity-0 group-hover:opacity-100"
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
                      <span className="relative z-10 font-medium text-sm">OPEN DEVICES CONSOLE</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ElectricBorder>
          </motion.div>

          {/* Mining Pools - with ElectricBorder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ElectricBorder 
              cornerSize="md" 
              cornerAccentColor="border-purple-500"
              edgeGlowColor="rgba(168, 85, 247, 0.5)"
              pulseGlow={true}
            >
              <Card 
                className="bg-black/70 backdrop-blur-lg border-none h-full cursor-pointer"
                onClick={() => navigate('/pools')}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="p-2 rounded-full bg-purple-900/50 border border-purple-500/30"
                      animate={{
                        boxShadow: [
                          '0 0 0px rgba(168, 85, 247, 0.3)',
                          '0 0 10px rgba(168, 85, 247, 0.6)',
                          '0 0 0px rgba(168, 85, 247, 0.3)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Users className="h-5 w-5 text-purple-400" />
                    </motion.div>
                    
                    <div>
                      <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 text-xl">
                        MINING POOLS
                      </CardTitle>
                      <CardDescription className="text-purple-300/70">
                        Join high-performance mining pools
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-purple-100/80 text-sm">
                      Connect to the most profitable mining pools and monitor real-time performance metrics across all your devices.
                    </p>
                    
                    <div className="bg-purple-900/20 rounded-md p-3 border border-purple-900/30">
                      <motion.div 
                        className="flex items-center gap-2"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Users className="h-4 w-4 text-purple-400" />
                        </motion.div>
                        <span className="text-xs text-purple-300/90">Maximize rewards with community mining</span>
                      </motion.div>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 relative overflow-hidden group">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-pink-400/30 to-purple-400/0 opacity-0 group-hover:opacity-100"
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
                      <span className="relative z-10 font-medium text-sm">VIEW MINING POOLS</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ElectricBorder>
          </motion.div>

          {/* Bitcoin Mining - with ElectricBorder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ElectricBorder 
              cornerSize="md" 
              cornerAccentColor="border-amber-500"
              edgeGlowColor="rgba(245, 158, 11, 0.5)"
            >
              <Card 
                className="bg-black/70 backdrop-blur-lg border-none h-full cursor-pointer"
                onClick={() => navigate('/subscription-mining')}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
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
                      <div className="flex items-center -space-x-1 relative">
                        <Bitcoin className="text-amber-400" />
                        <motion.div
                          animate={{
                            opacity: [0.7, 1, 0.7],
                            scale: [0.9, 1.1, 0.9]
                          }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute" 
                          style={{ right: '-3px', top: '-3px' }}
                        >
                          <Zap className="h-3 w-3 text-yellow-300" />
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    <div>
                      <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 text-xl">
                        BITCOIN MINING
                      </CardTitle>
                      <CardDescription className="text-amber-300/70">
                        Mining with subscription services
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-amber-100/80 text-sm">
                      Start mining Bitcoin immediately with our subscription services. Maximize earnings with optimized configurations.
                    </p>
                    
                    <div className="bg-amber-900/20 rounded-md p-3 border border-amber-900/30">
                      <motion.div 
                        className="flex items-center gap-2"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <motion.div
                          animate={{ 
                            rotate: [0, 360],
                          }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                          <Bitcoin className="h-4 w-4 text-amber-400" />
                        </motion.div>
                        <span className="text-xs text-amber-300/90">Begin earning Bitcoin rewards instantly</span>
                      </motion.div>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 relative overflow-hidden group">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-yellow-400/30 to-amber-400/0 opacity-0 group-hover:opacity-100"
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
                      <span className="relative z-10 font-medium text-sm">START MINING NOW</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ElectricBorder>
          </motion.div>

          {/* ASIC Mining */}
          <Card 
            className="bg-gradient-to-br from-gray-900/80 to-green-900/20 backdrop-blur-sm border border-green-900/50 hover:shadow-lg hover:shadow-green-900/20 transition-all cursor-pointer"
            onClick={() => navigate('/asic-mining')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-6 w-6 text-green-400" />
                ASIC Mining
                <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-green-600 text-white">
                  New
                </span>
              </CardTitle>
              <CardDescription>
                Configure and optimize ASIC miners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Manage your ASIC mining hardware for maximum efficiency and profits.
              </p>
              <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                ASIC Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Advanced Mining */}
          <Card 
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/20 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg hover:shadow-gray-700/20 transition-all cursor-pointer"
            onClick={() => navigate('/advanced-mining')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-6 w-6 text-gray-400" />
                Advanced Mining
              </CardTitle>
              <CardDescription>
                Fine-tune your mining operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Access advanced mining settings and optimization tools.
              </p>
              <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900">
                Advanced Options
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}