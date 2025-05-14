import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { ScreenShare } from '@/components/ui/ScreenShare';
import { ElectricBorder } from '@/components/ui/ElectricBorder';
import { Card } from '@/components/ui/card';
import { Monitor, Users } from 'lucide-react';

export default function ScreenSharePage() {
  // Track user activity for the screen sharing features
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
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>COSMIC SCREEN SHARING</h1>
          <p className="text-xl text-gray-400">Share your mining setup with fellow cosmic miners</p>
        </div>
        
        {/* Screen Sharing Container */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <ElectricBorder 
            cornerSize="md" 
            cornerAccentColor="border-cyan-500"
            edgeGlowColor="rgba(8, 145, 178, 0.6)"
          >
            <Card className="bg-black/70 backdrop-blur-lg border-none p-6 shadow-xl">
              <motion.div 
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="p-2 rounded-full bg-cyan-900/50 border border-cyan-500/30"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(8, 145, 178, 0.3)',
                      '0 0 10px rgba(8, 145, 178, 0.6)',
                      '0 0 0px rgba(8, 145, 178, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Monitor className="w-5 h-5 text-cyan-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">VISUAL TRANSMISSION PORTAL</h2>
              </motion.div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Welcome to the Cosmic Screen Sharing portal where mining experts can share their setups, troubleshoot issues, and showcase mining strategies in real-time.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <motion.div 
                    className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg px-4 py-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <h3 className="text-cyan-400 font-semibold mb-1">Share Your Mining Setup</h3>
                    <p className="text-gray-400 text-sm">Let others see your mining rigs, configurations, and real-time performance.</p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-blue-900/20 border border-blue-700/30 rounded-lg px-4 py-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-blue-400 font-semibold mb-1">Get Expert Assistance</h3>
                    <p className="text-gray-400 text-sm">Get real-time assistance from expert miners by sharing your screen.</p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-purple-900/20 border border-purple-700/30 rounded-lg px-4 py-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h3 className="text-purple-400 font-semibold mb-1">Learn New Techniques</h3>
                    <p className="text-gray-400 text-sm">Watch and learn advanced mining techniques from experienced miners.</p>
                  </motion.div>
                </div>
              </div>
              
              <motion.div
                className="border-t border-cyan-900/30 pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="h-[600px]">
                  <ScreenShare />
                </div>
              </motion.div>
            </Card>
          </ElectricBorder>
        </div>
        
        {/* Space Theme Background Elements */}
        <motion.div 
          className="fixed pointer-events-none -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5 }}
          style={{ 
            width: '100%', 
            height: '100%', 
            top: 0, 
            left: 0,
            background: 'radial-gradient(circle at center, rgba(16, 24, 39, 0) 0%, rgba(16, 24, 39, 0.8) 100%)',
          }}
        >
          {/* Animated stars and cosmic elements could be added here */}
        </motion.div>
      </div>
    </MainLayout>
  );
}