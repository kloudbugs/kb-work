import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, CoffeeIcon, Droplet, TrendingUp, Leaf, Zap, Box, 
  Sparkles, GamepadIcon, GemIcon, Star, Trophy, Gamepad2Icon, CpuIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatNumber } from '@/lib/utils';

interface BrewStationProps {
  userId?: string;
  onBrewComplete?: (beans: number) => void;
}

export default function BrewStation({ userId, onBrewComplete }: BrewStationProps) {
  const { toast } = useToast();
  const [beansCount, setBeansCount] = useState<number>(0);
  const [brewProgress, setBrewProgress] = useState<number>(0);
  const [isBrewing, setIsBrewing] = useState<boolean>(false);
  const [brewSpeed, setBrewSpeed] = useState<number>(1); // 1 bean per second by default
  const [nextBeanIn, setNextBeanIn] = useState<number>(0);
  const [beanAnimation, setBeanAnimation] = useState<boolean>(false);
  
  // Fetch user wallet/beans data
  const { data: walletData, isLoading, refetch } = useQuery({
    queryKey: ['/api/wallet'],
    refetchInterval: 10000, // Refresh every 10 seconds
    retry: false,
    onSuccess: (data) => {
      // Convert satoshis to beans (1:1 ratio for simplicity)
      if (data?.balance) {
        const beans = typeof data.balance === 'string' 
          ? parseFloat(data.balance) 
          : data.balance;
        
        setBeansCount(Math.floor(beans));
      }
    },
    onError: () => {
      // Use default beans if API fails
      console.log('Using default beans count (API error)');
      // We'll use the existing beans count
    }
  });
  
  // Start brewing effect
  const startBrewing = () => {
    if (isBrewing) return;
    
    setIsBrewing(true);
    setBrewProgress(0);
    
    toast({
      title: "Brewing started",
      description: "Your beans are brewing. Watch them grow!",
      duration: 3000,
    });
  };
  
  // Stop brewing
  const stopBrewing = () => {
    if (!isBrewing) return;
    
    setIsBrewing(false);
    setBrewProgress(0);
    
    toast({
      title: "Brewing paused",
      description: "Your bean brewing is now paused.",
      duration: 3000,
    });
  };
  
  // Brewing timer effect
  useEffect(() => {
    let brewTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;
    
    if (isBrewing) {
      // Update the progress bar
      progressTimer = setInterval(() => {
        setBrewProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
        
        setNextBeanIn(prev => {
          if (prev <= 0) return 100;
          return prev - 1;
        });
      }, 10); // Update every 10ms for smooth animation
      
      // Add a bean when cycle completes
      brewTimer = setInterval(() => {
        // Add a bean
        setBeansCount(prev => prev + 1);
        
        // Trigger bean animation
        setBeanAnimation(true);
        setTimeout(() => setBeanAnimation(false), 500);
        
        // Reset progress
        setBrewProgress(0);
        setNextBeanIn(100);
        
        // Call the completion callback if provided
        if (onBrewComplete) {
          onBrewComplete(1); // 1 bean brewed
        }
      }, 1000 / brewSpeed); // Speed factor
    }
    
    return () => {
      clearInterval(brewTimer);
      clearInterval(progressTimer);
    };
  }, [isBrewing, brewSpeed, onBrewComplete]);
  
  // Brew speed boost (special animation feature)
  const boostBrewSpeed = () => {
    // Temporarily boost brewing speed
    const originalSpeed = brewSpeed;
    setBrewSpeed(prev => prev * 2);
    
    toast({
      title: "Brewing Boosted!",
      description: "Brewing at 2x speed for the next 10 seconds!",
      duration: 3000,
    });
    
    // Reset after 10 seconds
    setTimeout(() => {
      setBrewSpeed(originalSpeed);
      
      toast({
        title: "Brew boost ended",
        description: "Brewing speed returned to normal",
        duration: 3000,
      });
    }, 10000);
  };
  
  const collectBeans = () => {
    // Collect all beans animation
    setBeanAnimation(true);
    setTimeout(() => setBeanAnimation(false), 800);
    
    toast({
      title: "Beans Collected!",
      description: `${beansCount} beans added to your wallet`,
      duration: 3000,
    });
  };
  
  return (
    <Card className="overflow-hidden border-2 border-amber-800/30 bg-gradient-to-br from-amber-950/80 to-amber-900/50 shadow-lg">
      <CardHeader className="bg-amber-900/30 border-b border-amber-800/30">
        <CardTitle className="flex items-center text-amber-100">
          <Coffee className="h-5 w-5 mr-2 text-amber-400" />
          BREW STATION
        </CardTitle>
        <CardDescription className="text-amber-200/70">
          Convert mining rewards into BEANS
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex flex-col items-center mb-4">
          {/* Bean counter with animation */}
          <div className="relative mb-4 w-full flex justify-center">
            <div className="flex items-center justify-center p-4 bg-amber-900/20 rounded-full h-32 w-32 border-2 border-amber-700/30">
              <div className="text-center">
                <span className="text-2xl font-bold text-amber-100">{formatNumber(beansCount)}</span>
                <p className="text-xs mt-1 text-amber-200/70">BEANS</p>
              </div>
            </div>
            
            {/* Animated bean when brewing */}
            <AnimatePresence>
              {beanAnimation && (
                <motion.div
                  initial={{ scale: 0.5, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: -20, opacity: 1 }}
                  exit={{ scale: 0.5, y: -40, opacity: 0 }}
                  className="absolute top-1/2 transform -translate-y-1/2"
                >
                  <div className="bg-amber-600 w-8 h-10 rounded-b-full rounded-t-lg flex items-center justify-center">
                    <div className="bg-amber-800 w-6 h-8 rounded-b-full rounded-t-lg"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Brewing visualization */}
          <div className="w-full mb-4">
            {isBrewing && (
              <>
                <div className="flex justify-between mb-1 text-xs text-amber-200/70">
                  <span>Brewing Progress</span>
                  <span>{brewProgress}%</span>
                </div>
                <Progress value={brewProgress} className="h-2 bg-amber-950" 
                  style={{
                    '--theme-primary': 'rgb(217 119 6)', // amber-600
                  } as React.CSSProperties}
                />
              </>
            )}
          </div>
          
          {/* Brewing info */}
          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            <div className="flex flex-col items-center p-3 bg-amber-900/20 rounded-lg">
              <TrendingUp className="h-4 w-4 mb-1 text-amber-400" />
              <span className="text-xs text-amber-200/70">Rate</span>
              <span className="text-sm font-medium text-amber-100">{brewSpeed.toFixed(1)} beans/s</span>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-amber-900/20 rounded-lg">
              <Droplet className="h-4 w-4 mb-1 text-amber-400" />
              <span className="text-xs text-amber-200/70">Quality</span>
              <span className="text-sm font-medium text-amber-100">Premium</span>
            </div>
          </div>
          
          {/* Brewing controls */}
          <div className="flex gap-2 justify-center w-full">
            {!isBrewing ? (
              <Button 
                variant="default" 
                onClick={startBrewing}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <CoffeeIcon className="h-4 w-4 mr-2" />
                Start Brewing
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={stopBrewing}
                className="border-amber-600 text-amber-200 hover:bg-amber-900/30"
              >
                Pause Brewing
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={boostBrewSpeed}
              className="border-amber-600 text-amber-200 hover:bg-amber-900/30"
              disabled={!isBrewing}
            >
              <Zap className="h-4 w-4 mr-2" />
              Boost
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-amber-900/30 border-t border-amber-800/30 p-4">
        <Button 
          variant="default" 
          onClick={collectBeans}
          className="w-full bg-amber-700 hover:bg-amber-800 text-white"
          disabled={beansCount === 0}
        >
          <Box className="h-4 w-4 mr-2" />
          Collect {beansCount} Beans
        </Button>
      </CardFooter>
    </Card>
  );
}