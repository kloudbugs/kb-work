import React, { useRef, useEffect, useState } from 'react';
import { useBroadcast } from '@/context/BroadcastContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Cast, Radio, Eye, Volume2, VolumeX, X } from 'lucide-react';

export function BroadcastOverlay() {
  const { isBroadcasting, broadcastTitle, broadcastDescription, broadcastStartTime, stopBroadcast } = useBroadcast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Only show overlay when broadcasting is active
  if (!isBroadcasting) return null;
  
  // Update elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBroadcasting && broadcastStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - broadcastStartTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBroadcasting, broadcastStartTime]);
  
  // Simulate viewer count
  useEffect(() => {
    if (isBroadcasting) {
      // Start with a random base number of viewers
      setViewerCount(Math.floor(Math.random() * 8) + 5);
      
      // Update randomly every 5 seconds
      const interval = setInterval(() => {
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          return Math.max(1, prev + change);
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isBroadcasting]);
  
  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (hrs > 0) parts.push(hrs.toString().padStart(2, '0'));
    parts.push(mins.toString().padStart(2, '0'));
    parts.push(secs.toString().padStart(2, '0'));
    
    return parts.length === 3 ? parts.join(':') : `${parts[0]}:${parts[1]}`;
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-95">
      <div className="max-w-5xl w-full h-full md:h-auto md:max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between text-white">
          <div className="flex items-center">
            <motion.div 
              className="h-3 w-3 rounded-full bg-red-500 mr-2"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [0.95, 1.05, 0.95]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="font-bold">LIVE BROADCAST</span>
            <Badge className="ml-3 bg-gray-800 text-gray-200">{formatTime(elapsedTime)}</Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-md">
              <Eye className="h-4 w-4 text-blue-400" />
              <span className="text-sm">{viewerCount}</span>
            </div>
            
            {/* Admin can stop the broadcast */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-white hover:bg-red-900/20"
              onClick={stopBroadcast}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Main broadcast content */}
        <div className="flex-1 bg-gray-900 relative">
          <video 
            ref={videoRef} 
            autoPlay 
            className="w-full h-full object-contain"
          />
          
          {/* If no video source is available, show placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Cast className="h-20 w-20 mx-auto mb-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-white mb-2">{broadcastTitle || "Live Broadcast"}</h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                {broadcastDescription || "An admin is sharing their screen with all platform users. All other functionality is disabled until the broadcast ends."}
              </p>
            </div>
          </div>
          
          {/* Broadcast controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full" 
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-blue-400" />
                  )}
                </Button>
                
                <Badge className="bg-blue-900/40 text-blue-200">
                  KLOUD BUGS MINING COMMAND CENTER
                </Badge>
              </div>
              
              <div>
                <Badge className="bg-orange-600">EXCLUSIVE MODE</Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-4 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            This is an exclusive broadcast. All other platform features are disabled until the broadcast ends.
          </p>
        </div>
      </div>
    </div>
  );
}