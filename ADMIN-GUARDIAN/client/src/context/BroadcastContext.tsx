import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BroadcastContextType {
  isBroadcasting: boolean;
  broadcastTitle: string;
  broadcastDescription: string;
  broadcastStartTime: Date | null;
  startBroadcast: (title: string, description: string) => void;
  stopBroadcast: () => void;
}

export const BroadcastContext = createContext<BroadcastContextType | undefined>(undefined);

export function BroadcastProvider({ children }: { children: ReactNode }) {
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastTitle, setBroadcastTitle] = useState<string>('');
  const [broadcastDescription, setBroadcastDescription] = useState<string>('');
  const [broadcastStartTime, setBroadcastStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Check on initial load if a broadcast is active (from localStorage)
  useEffect(() => {
    const storedBroadcastState = localStorage.getItem('broadcastState');
    if (storedBroadcastState) {
      try {
        const state = JSON.parse(storedBroadcastState);
        setIsBroadcasting(state.isBroadcasting);
        setBroadcastTitle(state.broadcastTitle || '');
        setBroadcastDescription(state.broadcastDescription || '');
        setBroadcastStartTime(state.broadcastStartTime ? new Date(state.broadcastStartTime) : null);
      } catch (error) {
        console.error('Error parsing broadcast state from localStorage:', error);
      }
    }
  }, []);

  // Update localStorage whenever the broadcast state changes
  useEffect(() => {
    localStorage.setItem('broadcastState', JSON.stringify({
      isBroadcasting,
      broadcastTitle,
      broadcastDescription,
      broadcastStartTime: broadcastStartTime ? broadcastStartTime.toISOString() : null
    }));
  }, [isBroadcasting, broadcastTitle, broadcastDescription, broadcastStartTime]);

  const startBroadcast = (title: string, description: string) => {
    setIsBroadcasting(true);
    setBroadcastTitle(title);
    setBroadcastDescription(description);
    setBroadcastStartTime(new Date());
    
    toast({
      title: "Exclusive Broadcast Mode Activated",
      description: "All other platform features are disabled while broadcasting.",
      variant: "default",
    });
  };
  
  const stopBroadcast = () => {
    setIsBroadcasting(false);
    setBroadcastTitle('');
    setBroadcastDescription('');
    setBroadcastStartTime(null);
    
    toast({
      title: "Broadcast Ended",
      description: "Normal platform functionality has been restored.",
      variant: "default",
    });
  };

  return (
    <BroadcastContext.Provider
      value={{
        isBroadcasting,
        broadcastTitle,
        broadcastDescription,
        broadcastStartTime,
        startBroadcast,
        stopBroadcast
      }}
    >
      {children}
    </BroadcastContext.Provider>
  );
}

export function useBroadcast() {
  const context = useContext(BroadcastContext);
  if (context === undefined) {
    throw new Error('useBroadcast must be used within a BroadcastProvider');
  }
  return context;
}