import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { ChatRoom } from '@/components/ui/ChatRoom';
import { SpaceCard } from '@/components/ui/space-card';
import { ElectricBorder } from '@/components/ui/ElectricBorder';

export default function ChatRoomPage() {
  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <MessageSquareText className="h-8 w-8 text-purple-400" />
          </motion.div>
          <div>
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Cosmic Chat Room
            </motion.h1>
            <motion.p 
              className="text-gray-400"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Connect with other miners in real-time
            </motion.p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-[calc(100vh-14rem)]"
          >
            <SpaceCard
              title="KLOUD BUGS COSMIC CHAT"
              glowColor="purple"
              className="h-full"
            >
              <div className="h-full p-1">
                <ChatRoom />
              </div>
            </SpaceCard>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}