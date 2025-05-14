import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Cpu, Layers, Zap } from "lucide-react";
import kloudbugsLogo from '@/assets/kloudbugs_logo.png';
import { motion } from 'framer-motion';
import { SpaceCard, SpaceCardHeader, SpaceCardTitle, SpaceCardContent } from './space-card';

export function MinerCard() {
  return (
    <SpaceCard 
      glowColor="blue" 
      hasFloatingAnimation={true}
      className="border-dashed"
    >
      <SpaceCardHeader>
        <div className="flex items-center justify-between w-full">
          <SpaceCardTitle className="flex items-center">
            <Layers className="h-5 w-5 mr-2 text-blue-400" />
            Mining Hardware Support
          </SpaceCardTitle>
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800/50 flex items-center">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400 mr-1.5"
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              Connected
            </Badge>
          </motion.div>
        </div>
      </SpaceCardHeader>
      <SpaceCardContent>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 overflow-hidden rounded-md flex-shrink-0 bg-gray-800/50 p-1 border border-indigo-500/30 shadow-md shadow-indigo-900/20">
            <motion.img 
              src={kloudbugsLogo} 
              alt="KloudBugs Logo" 
              className="object-cover w-full h-full"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300 glow-text-blue">Premium Mining Hardware</h3>
            <p className="text-sm text-blue-200/70">
              Compatible with all popular Bitcoin ASIC miners
            </p>
            <div className="mt-2 flex items-center text-xs text-indigo-300">
              <Zap className="h-3 w-3 mr-1 text-teal-400" />
              <span>Bitmain Antminer S19 XP, Whatsminer M50S, Avalon A1366 and more</span>
            </div>
          </div>
        </div>
      </SpaceCardContent>
    </SpaceCard>
  );
}