import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Tv } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { SpaceCard } from '@/components/ui/space-card';
import { BroadcastContext } from '@/context/BroadcastContext';
import { ElectricBorder } from '@/components/ui/ElectricBorder';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function BroadcastViewPage() {
  const context = useContext(BroadcastContext);
  // Using our broadcast context values
  const isActive = context?.isBroadcasting || false;
  const adminName = "ADMIN"; // Default admin name since it's not in our context

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Tv className="h-8 w-8 text-cyan-400" />
          </motion.div>
          <div>
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Broadcast Viewer
            </motion.h1>
            <motion.p 
              className="text-gray-400"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Watch live broadcasts from the mining team
            </motion.p>
          </div>
        </div>
        
        {isActive ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-[calc(100vh-14rem)]"
          >
            <SpaceCard
              title={`LIVE BROADCAST FROM ${adminName?.toUpperCase() || 'ADMIN'}`}
              glowColor="blue"
              className="h-full"
            >
              <div className="flex items-center justify-center h-full p-6 text-center">
                <p className="text-gray-400 text-xl">
                  A broadcast is currently active. The broadcast overlay will appear automatically when content is shared.
                </p>
              </div>
            </SpaceCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SpaceCard
              title="NO ACTIVE BROADCAST"
              glowColor="blue"
              className="min-h-[400px]"
            >
              <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">
                <Alert className="bg-blue-900/30 border border-blue-500/30 max-w-xl">
                  <Tv className="h-5 w-5 text-blue-400" />
                  <AlertTitle className="text-blue-300">No Live Broadcast</AlertTitle>
                  <AlertDescription className="text-gray-400">
                    There is currently no active broadcast. When an administrator starts screen sharing,
                    you will be automatically notified and the broadcast will appear here.
                  </AlertDescription>
                </Alert>
                
                <p className="text-gray-500">
                  Broadcasts are used to share important updates, demonstrations, and mining guides.
                  Please check back later or wait for a notification.
                </p>
                
                <div className="relative w-24 h-24">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-500/10 border border-blue-500/20"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Tv className="h-12 w-12 text-blue-500/50" />
                  </motion.div>
                </div>
              </div>
            </SpaceCard>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}

export default BroadcastViewPage;