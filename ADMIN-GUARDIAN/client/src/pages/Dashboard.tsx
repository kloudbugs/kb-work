import React, { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { useMining } from '@/contexts/MiningContext';
import KloudBugsMiningPanel from '@/components/ui/KloudBugsMiningPanel';
import { motion } from 'framer-motion';
import { SpaceCard } from '@/components/ui/space-card';
import { Activity, BarChart3, Cpu, Zap, Tv, MessageSquareText, Users } from 'lucide-react';
import { BroadcastContext } from '@/context/BroadcastContext';
import { ChatRoom } from '@/components/ui/ChatRoom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Dashboard() {
  const { 
    totalHashRate, 
    estimatedEarnings, 
    activeDevices, 
    powerConsumption 
  } = useMining();
  
  // State for active tab - setting default to 'broadcast'
  const [activeTab, setActiveTab] = useState<'broadcast' | 'chat'>('broadcast');
  
  // Get broadcast context
  const broadcastContext = useContext(BroadcastContext);
  const isActiveBroadcast = broadcastContext?.isBroadcasting || false;
  
  // Function to handle tab change
  const handleTabChange = (tab: 'broadcast' | 'chat') => {
    setActiveTab(tab);
    // Wait a bit for animation then scroll into view if needed
    setTimeout(() => {
      const element = document.getElementById(tab === 'broadcast' ? 'broadcast-content' : 'chat-content');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };
  
  // Query for wallet details
  const { data: wallet } = useQuery({
    queryKey: ['/api/wallet'],
    select: (data: any) => {
      // Ensure data has the right shape for WalletCard
      return {
        user: {
          walletAddress: data?.user?.walletAddress || '',
          payoutThreshold: data?.user?.payoutThreshold || '0.001',
          payoutSchedule: data?.user?.payoutSchedule || 'daily',
          autoPayouts: data?.user?.autoPayouts || true
        },
        balance: typeof data?.balance === 'string' ? parseFloat(data.balance) : (data?.balance || 0),
        balanceUSD: typeof data?.balanceUSD === 'string' ? parseFloat(data.balanceUSD) : (data?.balanceUSD || 0),
        minimumPayout: data?.minimumPayout || '0.005',
        networkFee: data?.networkFee || '0.000012'
      };
    }
  });
  
  return (
    <MainLayout>
      {/* Mining Panel */}
      <div className="mb-6">
        <KloudBugsMiningPanel />
      </div>
      
      {/* Cosmic Communication Hub */}
      <div className="mb-6">
        {/* Cosmic Tab Navigation */}
        <div className="relative p-0.5 mb-4 rounded-md overflow-hidden">
          {/* Animated cosmic background glow */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-cyan-900/50 rounded-md blur-md"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 0%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{ backgroundSize: '200% 100%' }}
          />
          
          {/* Tab container with glass effect */}
          <div 
            className="relative flex bg-black/60 backdrop-blur-sm border border-purple-900/40 rounded-md overflow-hidden z-10"
            role="tablist"
            aria-label="Communication Channels"
          >
            {/* Broadcast Button with cosmic effects */}
            <Button 
              id="broadcast-tab"
              variant="ghost" 
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-none relative cursor-pointer
                ${activeTab === 'broadcast' 
                  ? 'text-cyan-300 bg-cyan-900/30' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-cyan-900/10'}
              `}
              onClick={() => handleTabChange('broadcast')}
              aria-selected={activeTab === 'broadcast'}
              role="tab"
              aria-controls="broadcast-content"
              tabIndex={0}
            >
              {/* Active indicator - top cosmic glow */}
              {activeTab === 'broadcast' && (
                <motion.div 
                  className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-400 to-cyan-500/0"
                  animate={{
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              {/* Icon wrapper with glow effect */}
              <div className="relative">
                {activeTab === 'broadcast' && (
                  <motion.div 
                    className="absolute -inset-1 bg-cyan-500/30 rounded-full blur-md"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
                <Tv className={`h-4 w-4 ${activeTab === 'broadcast' ? 'text-cyan-300' : ''}`} />
              </div>
              
              {/* Text with subtle animation when active */}
              <span className="font-medium">
                {activeTab === 'broadcast' ? (
                  <motion.span
                    animate={{ 
                      textShadow: [
                        '0 0 0px rgba(34, 211, 238, 0)',
                        '0 0 4px rgba(34, 211, 238, 0.5)',
                        '0 0 0px rgba(34, 211, 238, 0)'
                      ] 
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Broadcast Channel
                  </motion.span>
                ) : (
                  <span>Broadcast Channel</span>
                )}
              </span>
              
              {/* Bottom border glow when active */}
              {activeTab === 'broadcast' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/30 via-cyan-400 to-cyan-500/30"
                  animate={{
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </Button>
            
            {/* Chat Button with cosmic effects */}
            <Button 
              id="chat-tab"
              variant="ghost" 
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-none relative cursor-pointer
                ${activeTab === 'chat' 
                  ? 'text-purple-300 bg-purple-900/30' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-purple-900/10'}
              `}
              onClick={() => handleTabChange('chat')}
              aria-selected={activeTab === 'chat'}
              role="tab"
              aria-controls="chat-content"
              tabIndex={0}
            >
              {/* Active indicator - top cosmic glow */}
              {activeTab === 'chat' && (
                <motion.div 
                  className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500 to-purple-500/0"
                  animate={{
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              {/* Icon wrapper with glow effect */}
              <div className="relative">
                {activeTab === 'chat' && (
                  <motion.div 
                    className="absolute -inset-1 bg-purple-500/30 rounded-full blur-md"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
                <MessageSquareText className={`h-4 w-4 ${activeTab === 'chat' ? 'text-purple-300' : ''}`} />
              </div>
              
              {/* Text with subtle animation when active */}
              <span className="font-medium">
                {activeTab === 'chat' ? (
                  <motion.span
                    animate={{ 
                      textShadow: [
                        '0 0 0px rgba(168, 85, 247, 0)',
                        '0 0 4px rgba(168, 85, 247, 0.5)',
                        '0 0 0px rgba(168, 85, 247, 0)'
                      ] 
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Chat Room
                  </motion.span>
                ) : (
                  <span>Chat Room</span>
                )}
              </span>
              
              {/* Bottom border glow when active */}
              {activeTab === 'chat' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/30 via-purple-400 to-purple-500/30"
                  animate={{
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </Button>
          </div>
        </div>
        
        {/* Broadcast Content Panel */}
        <div 
          id="broadcast-content" 
          role="tabpanel"
          aria-labelledby="broadcast-tab"
          className={`${activeTab !== 'broadcast' ? 'hidden' : ''}`}
        >
          <SpaceCard
            title="KLOUD BUGS BROADCAST CHANNEL"
            glowColor="cyan"
            className="min-h-[400px]"
          >
            {isActiveBroadcast ? (
              <div className="flex items-center justify-center h-full p-6 text-center">
                <p className="text-gray-400 text-xl">
                  A broadcast is currently active. The broadcast overlay will appear automatically when content is shared.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">
                <Alert className="bg-cyan-900/20 border border-cyan-500/30 max-w-xl">
                  <Tv className="h-5 w-5 text-cyan-400" />
                  <AlertTitle className="text-cyan-300">No Live Broadcast</AlertTitle>
                  <AlertDescription className="text-gray-400">
                    There is currently no active broadcast. When an administrator starts screen sharing,
                    you will be automatically notified and the broadcast will appear here.
                  </AlertDescription>
                </Alert>
                
                <div className="relative w-24 h-24">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-cyan-500/10 border border-cyan-500/20"
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
                    <Tv className="h-12 w-12 text-cyan-500/50" />
                  </motion.div>
                </div>
              </div>
            )}
          </SpaceCard>
        </div>
        
        {/* Chat Room Content Panel */}
        <div 
          id="chat-content" 
          role="tabpanel"
          aria-labelledby="chat-tab"
          className={`${activeTab !== 'chat' ? 'hidden' : ''}`}
        >
          <SpaceCard
            title="KLOUD BUGS COSMIC CHAT"
            glowColor="purple"
            className="min-h-[400px]"
          >
            <div className="h-[400px] p-1">
              <ChatRoom />
            </div>
          </SpaceCard>
        </div>
      </div>
    </MainLayout>
  );
}