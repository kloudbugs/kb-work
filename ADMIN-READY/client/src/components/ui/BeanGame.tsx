import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, CoffeeIcon, Droplet, TrendingUp, Leaf, Zap, Box, 
  Sparkles, GamepadIcon, Gamepad2, Star, Trophy, CpuIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BeanGameProps {
  onBeansEarned?: (amount: number) => void;
  initialBeans?: number;
}

export default function BeanGame({ onBeansEarned, initialBeans = 0 }: BeanGameProps) {
  const { toast } = useToast();
  const [beans, setBeans] = useState<number>(initialBeans);
  const [plants, setPlants] = useState<Array<{
    id: number;
    level: number;
    growthRate: number;
    beans: number;
    lastHarvested: Date;
    position: { x: number; y: number };
  }>>([]);
  const [activePlantId, setActivePlantId] = useState<number | null>(null);
  const [waterLevel, setWaterLevel] = useState<number>(100);
  const [isWatering, setIsWatering] = useState<boolean>(false);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [miningActive, setMiningActive] = useState<boolean>(false);
  const [miningProgress, setMiningProgress] = useState<number>(0);
  const [miningRate, setMiningRate] = useState<number>(1); // Beans per 10 seconds
  
  // Start the game
  const startGame = () => {
    if (gameActive) return;
    
    // Create initial plant
    if (plants.length === 0) {
      createNewPlant();
    }
    
    setGameActive(true);
    toast({
      title: "Bean Game Started!",
      description: "Care for your bean plants to earn mining rewards!",
      duration: 3000,
    });
  };
  
  // Create a new bean plant
  const createNewPlant = () => {
    if (beans < 10) {
      toast({
        title: "Not enough beans!",
        description: "You need 10 beans to plant a new one.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Spend 10 beans to create a new plant
    setBeans(prev => prev - 10);
    
    // Random position
    const newPosition = {
      x: Math.floor(Math.random() * 80) + 10, // 10-90%
      y: Math.floor(Math.random() * 40) + 30, // 30-70%
    };
    
    // Create plant
    const newPlant = {
      id: Date.now(),
      level: 1,
      growthRate: 1,
      beans: 0,
      lastHarvested: new Date(),
      position: newPosition,
    };
    
    setPlants(prev => [...prev, newPlant]);
    setActivePlantId(newPlant.id);
    
    toast({
      title: "New Plant Created!",
      description: "Your bean plant is growing. Care for it to increase yields!",
      duration: 3000,
    });
  };
  
  // Water the active plant
  const waterPlant = () => {
    if (!activePlantId || waterLevel < 20) return;
    
    // Use water
    setWaterLevel(prev => Math.max(0, prev - 20));
    
    // Animate watering
    setIsWatering(true);
    setTimeout(() => setIsWatering(false), 1000);
    
    // Improve plant growth rate
    setPlants(prev => 
      prev.map(plant => 
        plant.id === activePlantId
          ? { ...plant, growthRate: plant.growthRate * 1.1 }
          : plant
      )
    );
    
    toast({
      title: "Plant Watered!",
      description: "Growth rate increased!",
      duration: 2000,
    });
  };
  
  // Harvest beans from active plant
  const harvestPlant = () => {
    if (!activePlantId) return;
    
    const activePlant = plants.find(p => p.id === activePlantId);
    if (!activePlant || activePlant.beans < 1) return;
    
    // Harvest beans
    const harvestedBeans = Math.floor(activePlant.beans);
    setBeans(prev => prev + harvestedBeans);
    
    // Reset plant beans
    setPlants(prev => 
      prev.map(plant => 
        plant.id === activePlantId
          ? { ...plant, beans: 0, lastHarvested: new Date() }
          : plant
      )
    );
    
    // Notify about harvest
    toast({
      title: "Beans Harvested!",
      description: `You collected ${harvestedBeans} beans!`,
      duration: 3000,
    });
    
    // Callback if provided
    if (onBeansEarned) {
      onBeansEarned(harvestedBeans);
    }
  };
  
  // Upgrade the active plant
  const upgradePlant = () => {
    if (!activePlantId) return;
    
    const activePlant = plants.find(p => p.id === activePlantId);
    if (!activePlant) return;
    
    const upgradeCost = activePlant.level * 25; // Each level costs more
    
    if (beans < upgradeCost) {
      toast({
        title: "Not enough beans!",
        description: `You need ${upgradeCost} beans to upgrade this plant.`,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Spend beans for upgrade
    setBeans(prev => prev - upgradeCost);
    
    // Upgrade plant
    setPlants(prev => 
      prev.map(plant => 
        plant.id === activePlantId
          ? { 
              ...plant, 
              level: plant.level + 1,
              growthRate: plant.growthRate * 1.5 // 50% boost per level
            }
          : plant
      )
    );
    
    toast({
      title: "Plant Upgraded!",
      description: `Plant is now level ${activePlant.level + 1}! Growth rate increased by 50%!`,
      duration: 3000,
    });
  };
  
  // Toggle mining mode
  const toggleMining = () => {
    if (miningActive) {
      setMiningActive(false);
      setMiningProgress(0);
      
      toast({
        title: "Mining Stopped",
        description: "Bean mining has been paused.",
        duration: 2000,
      });
    } else {
      setMiningActive(true);
      
      toast({
        title: "Mining Started!",
        description: "Your plants are now mining beans!",
        duration: 2000,
      });
    }
  };
  
  // Game loop - grow plants and handle mining
  useEffect(() => {
    if (!gameActive) return;
    
    // Water regeneration
    const waterTimer = setInterval(() => {
      setWaterLevel(prev => Math.min(100, prev + 2));
    }, 5000);
    
    // Plant growth
    const growthTimer = setInterval(() => {
      if (plants.length > 0) {
        setPlants(prev => 
          prev.map(plant => {
            // Calculate growth since last update
            const beanGrowth = (plant.growthRate / 10) * (plant.level * 0.5);
            return {
              ...plant,
              beans: plant.beans + beanGrowth
            };
          })
        );
      }
    }, 1000);
    
    // Mining progress
    let miningTimer: NodeJS.Timeout;
    if (miningActive) {
      miningTimer = setInterval(() => {
        setMiningProgress(prev => {
          if (prev >= 100) {
            // Complete a mining cycle
            const totalPlantLevels = plants.reduce((sum, plant) => sum + plant.level, 0);
            const minedBeans = Math.max(1, Math.floor(miningRate * (1 + totalPlantLevels * 0.1)));
            
            setBeans(prevBeans => prevBeans + minedBeans);
            
            if (onBeansEarned) {
              onBeansEarned(minedBeans);
            }
            
            return 0; // Reset progress
          }
          return prev + 1;
        });
      }, 100); // Update progress bar more frequently for smoothness
    }
    
    return () => {
      clearInterval(waterTimer);
      clearInterval(growthTimer);
      if (miningTimer) clearInterval(miningTimer);
    };
  }, [gameActive, plants, miningActive, miningRate, onBeansEarned]);
  
  // Calculate mining rate based on plants
  useEffect(() => {
    if (plants.length > 0) {
      const totalGrowthRate = plants.reduce((sum, plant) => sum + plant.growthRate, 0);
      const totalLevels = plants.reduce((sum, plant) => sum + plant.level, 0);
      
      // Base rate + bonus from plants
      const newRate = 1 + (totalGrowthRate * 0.1) + (totalLevels * 0.2);
      setMiningRate(parseFloat(newRate.toFixed(2)));
    } else {
      setMiningRate(1);
    }
  }, [plants]);
  
  // Render plant UI
  const renderPlant = (plant: typeof plants[0]) => {
    const isActive = plant.id === activePlantId;
    const plantSize = 30 + (plant.level * 5); // Size increases with level
    
    return (
      <motion.div
        key={plant.id}
        className={`absolute cursor-pointer ${isActive ? 'z-20' : 'z-10'}`}
        style={{
          left: `${plant.position.x}%`,
          top: `${plant.position.y}%`,
        }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setActivePlantId(plant.id)}
      >
        <div className={`relative ${isActive ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-amber-950' : ''}`}
             style={{ width: `${plantSize}px`, height: `${plantSize}px` }}>
          {/* Bean plant visualization */}
          <div className="absolute bottom-0 w-full flex flex-col items-center">
            {/* Plant stem */}
            <div className="w-2 h-8 bg-green-700 rounded-full"></div>
            
            {/* Bean pod - size based on level */}
            <div className={`w-${4 + plant.level} h-${6 + plant.level} rounded-b-full rounded-t-lg bg-amber-600 relative`}>
              {/* Bean level indicator */}
              <div className="absolute -top-4 -right-4 w-6 h-6 rounded-full bg-amber-800 flex items-center justify-center text-white text-xs font-bold">
                {plant.level}
              </div>
            </div>
          </div>
          
          {/* Beans ready indicator */}
          {plant.beans >= 1 && (
            <motion.div 
              className="absolute -top-2 -right-2 bg-yellow-400 rounded-full px-1 text-xs font-bold"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {Math.floor(plant.beans)}
            </motion.div>
          )}
          
          {/* Water animation */}
          {isWatering && isActive && (
            <motion.div
              className="absolute -top-5 left-1/2 transform -translate-x-1/2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 20, opacity: [0, 1, 0] }}
              transition={{ duration: 1 }}
            >
              <Droplet className="text-blue-400 h-6 w-6" />
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };
  
  return (
    <Card className="overflow-hidden border-2 border-amber-800/30 bg-gradient-to-br from-amber-950/80 to-amber-900/50 shadow-lg">
      <CardHeader className="bg-amber-900/30 border-b border-amber-800/30">
        <CardTitle className="flex items-center text-amber-100">
          <Gamepad2 className="h-5 w-5 mr-2 text-amber-400" />
          BEAN GROWING GAME
        </CardTitle>
        <CardDescription className="text-amber-200/70">
          Grow beans, play, and earn mining rewards
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Game stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 bg-amber-900/20 rounded-lg">
            <span className="text-xs text-amber-200/70">Beans</span>
            <span className="text-lg font-medium text-amber-100">{Math.floor(beans)}</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-amber-900/20 rounded-lg">
            <span className="text-xs text-amber-200/70">Plants</span>
            <span className="text-lg font-medium text-amber-100">{plants.length}</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-amber-900/20 rounded-lg">
            <span className="text-xs text-amber-200/70">Mine Rate</span>
            <span className="text-lg font-medium text-amber-100">{miningRate}/s</span>
          </div>
        </div>
        
        {/* Water level */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-amber-200/70 mb-1">
            <span>Water</span>
            <span>{waterLevel}%</span>
          </div>
          <Progress value={waterLevel} className="h-2 bg-amber-950"
            style={{
              '--theme-primary': 'rgb(59 130 246)', // blue-500
            } as React.CSSProperties}
          />
        </div>
        
        {/* Game area */}
        {gameActive ? (
          <div className="relative w-full h-40 bg-gradient-to-b from-amber-950 to-amber-900 rounded-lg border border-amber-800/30 overflow-hidden mb-4">
            {/* Garden plot background */}
            <div className="absolute inset-0 bg-amber-950 opacity-50"></div>
            
            {/* Plants */}
            {plants.map(plant => renderPlant(plant))}
            
            {/* Mining animation when active */}
            {miningActive && (
              <>
                {/* Random sparkles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, Math.random() * 20 - 10],
                      y: [0, Math.random() * 20 - 10],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  >
                    <Sparkles className="text-yellow-400 h-3 w-3" />
                  </motion.div>
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-gradient-to-b from-amber-950 to-amber-900 rounded-lg border border-amber-800/30 mb-4">
            <Button onClick={startGame} className="bg-amber-600 hover:bg-amber-700">
              Start Bean Game
            </Button>
          </div>
        )}
        
        {/* Mining progress */}
        {miningActive && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-amber-200/70 mb-1">
              <span>Mining Progress</span>
              <span>{miningProgress}%</span>
            </div>
            <Progress value={miningProgress} className="h-2 bg-amber-950"
              style={{
                '--theme-primary': 'rgb(217 119 6)', // amber-600
              } as React.CSSProperties}
            />
          </div>
        )}
        
        {/* Plant controls - only show when game is active */}
        {gameActive && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button 
              variant="outline" 
              onClick={createNewPlant}
              className="border-amber-600 text-amber-200 hover:bg-amber-900/30"
              disabled={beans < 10}
            >
              <Leaf className="h-4 w-4 mr-2" />
              Plant Bean (10)
            </Button>
            
            <Button 
              variant={miningActive ? "destructive" : "outline"} 
              onClick={toggleMining}
              className={miningActive ? 
                "bg-red-700 hover:bg-red-800 text-white" : 
                "border-amber-600 text-amber-200 hover:bg-amber-900/30"
              }
              disabled={plants.length === 0}
            >
              <CpuIcon className="h-4 w-4 mr-2" />
              {miningActive ? "Stop Mining" : "Start Mining"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={waterPlant}
              className="border-blue-600 text-blue-200 hover:bg-blue-900/30"
              disabled={!activePlantId || waterLevel < 20}
            >
              <Droplet className="h-4 w-4 mr-2" />
              Water Plant
            </Button>
            
            <Button 
              variant="outline" 
              onClick={harvestPlant}
              className="border-green-600 text-green-200 hover:bg-green-900/30"
              disabled={!activePlantId || (activePlantId && plants.find(p => p.id === activePlantId)?.beans || 0) < 1}
            >
              <Box className="h-4 w-4 mr-2" />
              Harvest
            </Button>
            
            {activePlantId && (
              <Button 
                variant="outline" 
                onClick={upgradePlant}
                className="border-purple-600 text-purple-200 hover:bg-purple-900/30 col-span-2"
                disabled={beans < (plants.find(p => p.id === activePlantId)?.level || 1) * 25}
              >
                <Star className="h-4 w-4 mr-2" />
                Upgrade Plant ({(plants.find(p => p.id === activePlantId)?.level || 1) * 25} beans)
              </Button>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-amber-900/30 border-t border-amber-800/30 p-4">
        <div className="w-full text-center text-xs text-amber-200/70">
          {gameActive ? (
            <>Tip: Water plants regularly and upgrade them to increase mining yields!</>
          ) : (
            <>Start growing bean plants to earn mining rewards!</>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}