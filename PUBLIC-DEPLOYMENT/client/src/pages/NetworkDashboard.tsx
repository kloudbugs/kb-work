import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Users, 
  Cpu, 
  Wallet,
  Bitcoin, 
  Globe, 
  Timer, 
  Server, 
  Zap,
  AlertTriangle,
  Sparkles,
  Star
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

// Network stats interface
interface NetworkStats {
  totalHashrate: string;
  activeMiners: number;
  connectedUsers: number;
  totalGenerated: {
    btc: string;
    mpt: string;
    tera: string;
  };
  blockchainStats: {
    height: number;
    difficulty: string;
    averageBlockTime: string;
    lastUpdate: string;
  };
  minerModels: {
    name: string;
    count: number;
    hashrate: string;
    percentage: number;
  }[];
  globalMiningMap: {
    region: string;
    activeMiners: number;
    hashrate: string;
    percentage: number;
  }[];
}

// Authentication state interface
interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
    walletConnected: boolean;
  } | null;
}

export default function NetworkDashboard() {
  const [, setLocation] = useLocation();
  
  // Get authenticated state from API
  const { data: authState } = useQuery<AuthState>({
    queryKey: ['/api/auth/user'],
    placeholderData: {
      isAuthenticated: false,
      user: null
    },
    refetchInterval: 10000 // Check auth state every 10 seconds
  });
  
  // Network stats query with real data
  const { data: networkStats, isLoading, error } = useQuery<NetworkStats>({
    queryKey: ['/api/mining/stats'],
    enabled: !!authState?.isAuthenticated,
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
    placeholderData: {
      totalHashrate: "0 TH/s",
      activeMiners: 0,
      connectedUsers: 0,
      totalGenerated: {
        btc: "0.00000000",
        mpt: "0",
        tera: "0"
      },
      blockchainStats: {
        height: 0,
        difficulty: "0",
        averageBlockTime: "0 min",
        lastUpdate: new Date().toISOString()
      },
      minerModels: [],
      globalMiningMap: []
    }
  });
  
  // Establish WebSocket connection for real-time updates when authenticated
  useEffect(() => {
    if (!authState?.isAuthenticated) return;
    
    // Connect to WebSocket for real-time updates
    const socket = new WebSocket(
      window.location.protocol === 'https:' 
        ? `wss://${window.location.host}/api/mining/live` 
        : `ws://${window.location.host}/api/mining/live`
    );
    
    socket.onmessage = (event) => {
      // Handle real-time updates here
      console.log('Received network update:', event.data);
      // Update will be handled by react-query refetch
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return () => {
      socket.close();
    };
  }, [authState?.isAuthenticated]);
  
  // If not authenticated, show login prompt
  if (!authState?.isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <Card className="border-dashed border-2 border-gray-700 bg-gray-900/50">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <AlertTriangle className="h-16 w-16 text-amber-500" />
                <h2 className="text-2xl font-bold text-white">Authentication Required</h2>
                <p className="text-gray-400 max-w-md">
                  The Network Dashboard is only available to authenticated users.
                  Please login to access real-time mining statistics.
                </p>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => setLocation('/login')}
                >
                  Login to Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  // If authenticated but wallet not connected
  if (authState.isAuthenticated && !authState.user?.walletConnected) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <Card className="border-dashed border-2 border-gray-700 bg-gray-900/50">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <Wallet className="h-16 w-16 text-blue-500" />
                <h2 className="text-2xl font-bold text-white">Wallet Connection Required</h2>
                <p className="text-gray-400 max-w-md">
                  The Network Dashboard requires a connected wallet to access real-time
                  mining statistics and participate in the KLOUD-BUG-ZIP-MINER network.
                </p>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => setLocation('/wallet')}
                >
                  Connect Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  // If error loading network stats
  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <Card className="border-dashed border-2 border-gray-700 bg-gray-900/50">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <AlertTriangle className="h-16 w-16 text-red-500" />
                <h2 className="text-2xl font-bold text-white">Network Data Error</h2>
                <p className="text-gray-400 max-w-md">
                  There was a problem loading the network statistics.
                  Please try again later or contact support if the problem persists.
                </p>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="relative min-h-screen">
        {/* Midnight Galaxy Background */}
        <div className="absolute inset-0 bg-black overflow-hidden">
          {/* Stars layer */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-900 to-black"></div>
          
          {/* Star particles */}
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
          <div className="stars-large"></div>
          
          {/* Nebula clouds */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-800/30 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
          
          {/* Cosmic Mining Network Visualization */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* User Entry Points - Animated glowing dots */}
            <motion.div 
              className="absolute h-3 w-3 rounded-full bg-blue-500 z-10"
              style={{ 
                boxShadow: "0 0 15px 5px rgba(59, 130, 246, 0.5), 0 0 30px 10px rgba(59, 130, 246, 0.3)",
                top: "30%", 
                left: "20%" 
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div 
              className="absolute h-4 w-4 rounded-full bg-purple-500 z-10"
              style={{ 
                boxShadow: "0 0 15px 5px rgba(147, 51, 234, 0.5), 0 0 30px 10px rgba(147, 51, 234, 0.3)",
                top: "25%", 
                left: "70%" 
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            <motion.div 
              className="absolute h-3 w-3 rounded-full bg-teal-500 z-10"
              style={{ 
                boxShadow: "0 0 15px 5px rgba(20, 184, 166, 0.5), 0 0 30px 10px rgba(20, 184, 166, 0.3)",
                top: "65%", 
                left: "35%" 
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            
            {/* Mining Hardware Selection Point */}
            <motion.div 
              className="absolute h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 z-10"
              style={{ 
                boxShadow: "0 0 20px 8px rgba(99, 102, 241, 0.4), 0 0 40px 15px rgba(99, 102, 241, 0.2)",
                top: "40%", 
                left: "50%",
                transform: "translate(-50%, -50%)" 
              }}
              animate={{
                boxShadow: [
                  "0 0 20px 8px rgba(99, 102, 241, 0.4), 0 0 40px 15px rgba(99, 102, 241, 0.2)",
                  "0 0 30px 12px rgba(99, 102, 241, 0.6), 0 0 50px 20px rgba(99, 102, 241, 0.3)",
                  "0 0 20px 8px rgba(99, 102, 241, 0.4), 0 0 40px 15px rgba(99, 102, 241, 0.2)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50"
                animate={{
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* Connection Lines - Animate from user points to central hub */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Line from User 1 to Hub */}
              <motion.path 
                d="M20% 30% Q 35% 35%, 50% 40%" 
                stroke="rgba(59, 130, 246, 0.5)" 
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1,
                  opacity: [0, 0.8, 0.4]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Line from User 2 to Hub */}
              <motion.path 
                d="M70% 25% Q 60% 30%, 50% 40%" 
                stroke="rgba(147, 51, 234, 0.5)" 
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1,
                  opacity: [0, 0.8, 0.4]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5
                }}
              />
              
              {/* Line from User 3 to Hub */}
              <motion.path 
                d="M35% 65% Q 40% 55%, 50% 40%" 
                stroke="rgba(20, 184, 166, 0.5)" 
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1,
                  opacity: [0, 0.8, 0.4]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1
                }}
              />
              
              {/* Line from Hub to Blockchain */}
              <motion.path 
                d="M50% 40% Q 70% 75%, 85% 75%" 
                stroke="rgba(234, 179, 8, 0.6)" 
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1,
                  opacity: [0, 0.9, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Lines from Hub to Tokens */}
              <motion.path 
                d="M50% 40% Q 35% 15%, 20% 15%" 
                stroke="rgba(217, 119, 6, 0.6)" 
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1,
                  opacity: [0, 0.8, 0.4]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.2
                }}
              />
              
              <motion.path 
                d="M50% 40% Q 40% 10%, 30% 10%" 
                stroke="rgba(192, 132, 252, 0.6)" 
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1,
                  opacity: [0, 0.8, 0.4]
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5
                }}
              />
            </svg>
            
            {/* Blockchain Node */}
            <motion.div 
              className="absolute h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 z-10"
              style={{ 
                boxShadow: "0 0 15px 5px rgba(245, 158, 11, 0.4), 0 0 30px 10px rgba(245, 158, 11, 0.2)",
                top: "75%", 
                left: "85%",
                transform: "translate(-50%, -50%)" 
              }}
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 15px 5px rgba(245, 158, 11, 0.4), 0 0 30px 10px rgba(245, 158, 11, 0.2)",
                  "0 0 25px 8px rgba(245, 158, 11, 0.6), 0 0 40px 15px rgba(245, 158, 11, 0.3)",
                  "0 0 15px 5px rgba(245, 158, 11, 0.4), 0 0 30px 10px rgba(245, 158, 11, 0.2)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Token Orbs */}
            <motion.div 
              className="absolute h-8 w-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 z-10"
              style={{ 
                boxShadow: "0 0 15px 5px rgba(217, 119, 6, 0.4), 0 0 30px 10px rgba(217, 119, 6, 0.2)",
                top: "15%", 
                left: "20%",
                transform: "translate(-50%, -50%)" 
              }}
              animate={{
                scale: [1, 1.3, 1],
                boxShadow: [
                  "0 0 15px 5px rgba(217, 119, 6, 0.4), 0 0 30px 10px rgba(217, 119, 6, 0.2)",
                  "0 0 25px 8px rgba(217, 119, 6, 0.6), 0 0 40px 15px rgba(217, 119, 6, 0.3)",
                  "0 0 15px 5px rgba(217, 119, 6, 0.4), 0 0 30px 10px rgba(217, 119, 6, 0.2)"
                ]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div 
              className="absolute h-10 w-10 rounded-full bg-gradient-to-br from-purple-300 to-purple-600 z-10"
              style={{ 
                boxShadow: "0 0 15px 5px rgba(192, 132, 252, 0.4), 0 0 30px 10px rgba(192, 132, 252, 0.2)",
                top: "10%", 
                left: "30%",
                transform: "translate(-50%, -50%)" 
              }}
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 15px 5px rgba(192, 132, 252, 0.4), 0 0 30px 10px rgba(192, 132, 252, 0.2)",
                  "0 0 25px 8px rgba(192, 132, 252, 0.6), 0 0 40px 15px rgba(192, 132, 252, 0.3)",
                  "0 0 15px 5px rgba(192, 132, 252, 0.4), 0 0 30px 10px rgba(192, 132, 252, 0.2)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </div>
        </div>
        
        <div className="container relative mx-auto px-4 py-8 z-10">
          {/* Animated Header with Glow Effect */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-12 text-center"
          >
            <h1 
              className="text-5xl font-bold mb-3 text-white tracking-wider" 
              style={{ 
                fontFamily: "'Orbitron', sans-serif",
                textShadow: "0 0 10px rgba(111, 62, 240, 0.8), 0 0 20px rgba(111, 62, 240, 0.5), 0 0 30px rgba(111, 62, 240, 0.3)" 
              }}
            >
              KLOUDBUGZIGMINER NETWORK
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-blue-300 mb-4">Real-time visualization of the global mining network</p>
              <div className="h-1 w-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto"></div>
            </div>
          </motion.div>
        
          {/* Animated Stats Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Global Stats Overview with Cosmic Glow Effect */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Hashrate */}
              <motion.div 
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card className="bg-gradient-to-br from-gray-900/80 to-blue-900/30 backdrop-blur-sm border border-blue-900/50 shadow-lg transition-all duration-200 group-hover:shadow-blue-700/20 group-hover:shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-800/5 opacity-80"></div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition duration-300 rounded-lg blur"></div>
                  
                  <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-md flex items-center text-blue-400">
                      <Zap className="h-5 w-5 mr-2 text-blue-400" />
                      Network Hashrate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {isLoading ? (
                      <Skeleton className="h-8 w-32 bg-gray-700/50" />
                    ) : (
                      <div className="text-3xl font-bold text-white" style={{ textShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}>
                        {networkStats?.totalHashrate || '0 TH/s'}
                      </div>
                    )}
                    <p className="text-sm text-blue-300/80 mt-1">Combined mining power</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Active Miners */}
              <motion.div 
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card className="bg-gradient-to-br from-gray-900/80 to-purple-900/30 backdrop-blur-sm border border-purple-900/50 shadow-lg transition-all duration-200 group-hover:shadow-purple-700/20 group-hover:shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-800/5 opacity-80"></div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition duration-300 rounded-lg blur"></div>
                  
                  <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-md flex items-center text-purple-400">
                      <Cpu className="h-5 w-5 mr-2 text-purple-400" />
                      Active Miners
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {isLoading ? (
                      <Skeleton className="h-8 w-24 bg-gray-700/50" />
                    ) : (
                      <div className="text-3xl font-bold text-white" style={{ textShadow: "0 0 10px rgba(147, 51, 234, 0.5)" }}>
                        {networkStats?.activeMiners || 0}
                      </div>
                    )}
                    <p className="text-sm text-purple-300/80 mt-1">KloudBugZigMiner units online</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Connected Users */}
              <motion.div 
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card className="bg-gradient-to-br from-gray-900/80 to-teal-900/30 backdrop-blur-sm border border-teal-900/50 shadow-lg transition-all duration-200 group-hover:shadow-teal-700/20 group-hover:shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-teal-800/5 opacity-80"></div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-20 transition duration-300 rounded-lg blur"></div>
                  
                  <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-md flex items-center text-teal-400">
                      <Users className="h-5 w-5 mr-2 text-teal-400" />
                      Connected Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {isLoading ? (
                      <Skeleton className="h-8 w-24 bg-gray-700/50" />
                    ) : (
                      <div className="text-3xl font-bold text-white" style={{ textShadow: "0 0 10px rgba(20, 184, 166, 0.5)" }}>
                        {networkStats?.connectedUsers || 0}
                      </div>
                    )}
                    <p className="text-sm text-teal-300/80 mt-1">Active in the network</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Total Generated */}
              <motion.div 
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card className="bg-gradient-to-br from-gray-900/80 to-amber-900/30 backdrop-blur-sm border border-amber-900/50 shadow-lg transition-all duration-200 group-hover:shadow-amber-700/20 group-hover:shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-amber-800/5 opacity-80"></div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-20 transition duration-300 rounded-lg blur"></div>
                  
                  <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-md flex items-center text-amber-400">
                      <Bitcoin className="h-5 w-5 mr-2 text-amber-400" />
                      Total Generated
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {isLoading ? (
                      <Skeleton className="h-8 w-32 bg-gray-700/50" />
                    ) : (
                      <div className="text-3xl font-bold text-white" style={{ textShadow: "0 0 10px rgba(245, 158, 11, 0.5)" }}>
                        {networkStats?.totalGenerated?.btc || '0 BTC'}
                      </div>
                    )}
                    <div className="flex text-xs mt-1 space-x-2">
                      <span className="text-purple-300">{networkStats?.totalGenerated?.mpt || '0'} MPT</span>
                      <span className="text-teal-300">{networkStats?.totalGenerated?.tera || '0'} TERA</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Blockchain Stats Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <motion.div 
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className="lg:col-span-2 group"
              >
                <Card className="bg-gradient-to-br from-gray-900/80 to-indigo-900/20 backdrop-blur-sm border border-indigo-900/50 shadow-lg transition-all duration-200 group-hover:shadow-indigo-700/20 group-hover:shadow-lg overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-indigo-800/5 opacity-80"></div>
                  
                  <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-xl flex items-center text-white">
                      <Activity className="h-5 w-5 mr-2 text-indigo-400" />
                      Hardware Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-indigo-300 mb-3">Miner Models</h3>
                        
                        {isLoading ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-40 bg-gray-700/50" />
                                <Skeleton className="h-2 w-full bg-gray-700/50" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3 pr-4">
                            {networkStats?.minerModels?.map((model, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-300">{model.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-indigo-900/50 text-indigo-200 hover:bg-indigo-800">
                                      {model.count}
                                    </Badge>
                                    <span className="text-xs text-indigo-300">{model.hashrate}</span>
                                  </div>
                                </div>
                                <Progress 
                                  value={model.percentage} 
                                  className="h-1.5 bg-gray-800" 
                                  indicatorClassName="bg-gradient-to-r from-indigo-500 to-blue-500"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-indigo-300 mb-3">Global Distribution</h3>
                        
                        {isLoading ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-40 bg-gray-700/50" />
                                <Skeleton className="h-2 w-full bg-gray-700/50" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3 pr-4">
                            {networkStats?.globalMiningMap?.map((region, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-300">{region.region}</span>
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-indigo-900/50 text-indigo-200 hover:bg-indigo-800">
                                      {region.activeMiners}
                                    </Badge>
                                    <span className="text-xs text-indigo-300">{region.hashrate}</span>
                                  </div>
                                </div>
                                <Progress 
                                  value={region.percentage} 
                                  className="h-1.5 bg-gray-800" 
                                  indicatorClassName="bg-gradient-to-r from-blue-500 to-teal-500"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card className="bg-gradient-to-br from-gray-900/80 to-amber-900/20 backdrop-blur-sm border border-amber-900/50 shadow-lg transition-all duration-200 group-hover:shadow-amber-700/20 group-hover:shadow-lg overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-amber-800/5 opacity-80"></div>
                  
                  <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-xl flex items-center text-white">
                      <Server className="h-5 w-5 mr-2 text-amber-400" />
                      Blockchain Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="space-y-1">
                            <Skeleton className="h-4 w-24 bg-gray-700/50" />
                            <Skeleton className="h-6 w-32 bg-gray-700/50" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-amber-300/80 text-sm flex items-center">
                            <Globe className="h-4 w-4 mr-1 inline" />
                            Block Height
                          </p>
                          <p className="text-2xl font-bold text-white" style={{ textShadow: "0 0 10px rgba(245, 158, 11, 0.3)" }}>
                            {networkStats?.blockchainStats?.height?.toLocaleString() || '0'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-amber-300/80 text-sm flex items-center">
                            <Sparkles className="h-4 w-4 mr-1 inline" />
                            Difficulty
                          </p>
                          <p className="text-xl font-bold text-white">
                            {networkStats?.blockchainStats?.difficulty || '0'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-amber-300/80 text-sm flex items-center">
                            <Timer className="h-4 w-4 mr-1 inline" />
                            Average Block Time
                          </p>
                          <p className="text-xl font-bold text-white">
                            {networkStats?.blockchainStats?.averageBlockTime || '0 minutes'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-amber-300/80 text-sm">Last Updated</p>
                          <p className="text-sm text-gray-400">
                            {networkStats?.blockchainStats?.lastUpdate || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Call to Action */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-purple-900/20 backdrop-blur-sm border border-purple-900/50 shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-800/5 opacity-80"></div>
              <motion.div 
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-80"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: '200% 100%' }}
              />
              
              <CardContent className="py-10 relative z-10 text-center">
                <Star className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  Join the KloudBugZigMiner Network
                </h2>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Connect your hardware to our network or purchase a KloudBugZigMiner unit to 
                  become part of the distributed mining ecosystem.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => setLocation('/subscription-mining')}
                  >
                    Subscribe to Mining
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-400 hover:bg-purple-900/20"
                    onClick={() => setLocation('/mining-config')}
                  >
                    Configure Mining
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}