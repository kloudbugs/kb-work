import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Rocket, 
  Droplets, 
  Sun, 
  Wind, 
  Zap, 
  AlertTriangle,
  TrendingUp,
  BarChart,
  Award,
  Gift,
  Shrub,
  Hammer,
  Info,
  RefreshCw
} from 'lucide-react';

import BeanAnimation from './BeanAnimation';

interface BeanPlant {
  id: string;
  type: 'coffee-bean' | 'super-bean' | 'baby-bean' | 'bean' | 'lady-bean';
  growthStage: number;
  lastWatered: Date;
  harvestValue: number;
  plantedOn: Date;
  growthRate: number;
  health: number;
  special: boolean;
  position: { x: number; y: number };
}

interface MiningStats {
  hashrate: number;
  earnings: number;
  uptime: number;
  beansGenerated: number;
}

interface RefuelStationProps {
  userName?: string;
  walletBalance?: number;
  className?: string;
  onGrowBean?: (value: number) => void;
  onHarvest?: (value: number) => void;
  userLevel?: number;
  miningStats?: MiningStats;
}

export const RefuelStation = ({
  userName = "Miner",
  walletBalance = 0,
  className = "",
  onGrowBean,
  onHarvest,
  userLevel = 1,
  miningStats = {
    hashrate: 0,
    earnings: 0,
    uptime: 0,
    beansGenerated: 0
  }
}: RefuelStationProps) => {
  // State for garden
  const [beans, setBeans] = useState<BeanPlant[]>([]);
  const [gardenSize, setGardenSize] = useState({ width: 600, height: 400 });
  const [totalHarvested, setTotalHarvested] = useState(0);
  const [lastHarvest, setLastHarvest] = useState(0);
  const [selectedBean, setSelectedBean] = useState<BeanPlant | null>(null);
  const [activeTab, setActiveTab] = useState("garden");
  const [waterLevel, setWaterLevel] = useState(100);
  const [sunLevel, setSunLevel] = useState(80);
  const [fertilizerLevel, setFertilizerLevel] = useState(50);
  const [selectedBeanType, setSelectedBeanType] = useState<'bean' | 'coffee-bean' | 'baby-bean'>('bean');
  const [isWateringActive, setIsWateringActive] = useState(false);
  const [wateringTarget, setWateringTarget] = useState<{x: number, y: number} | null>(null);
  const [showGrowthIndicator, setShowGrowthIndicator] = useState(false);
  const [growthIndicator, setGrowthIndicator] = useState({value: 0, x: 0, y: 0});
  const [lastAction, setLastAction] = useState("");
  const [showTutorial, setShowTutorial] = useState(true);
  const [notifications, setNotifications] = useState<{id: string, message: string, type: 'info' | 'success' | 'warning' | 'error'}[]>([]);
  
  // Garden ref for click position
  const gardenRef = useRef<HTMLDivElement>(null);
  
  // Resources decrease over time
  useEffect(() => {
    const interval = setInterval(() => {
      if (beans.length > 0) {
        setWaterLevel(prev => Math.max(0, prev - 0.5));
        setSunLevel(prev => Math.max(0, prev - 0.3));
        setFertilizerLevel(prev => Math.max(0, prev - 0.2));
      }
    }, 10000); // Every 10 seconds
    
    return () => clearInterval(interval);
  }, [beans]);
  
  // Auto-grow beans over time
  useEffect(() => {
    const growInterval = setInterval(() => {
      if (beans.length > 0 && waterLevel > 10 && sunLevel > 10) {
        setBeans(prevBeans => 
          prevBeans.map(bean => {
            if (bean.growthStage < 5 && bean.health > 30) {
              // Calculate growth based on resources and health
              const growthProbability = 
                (waterLevel / 100) * 0.4 + 
                (sunLevel / 100) * 0.3 + 
                (fertilizerLevel / 100) * 0.3 + 
                (bean.health / 100) * 0.2;
              
              // Random growth check with the calculated probability
              if (Math.random() < growthProbability * 0.2) {
                // Show growth indicator
                setGrowthIndicator({
                  value: bean.growthStage + 1,
                  x: bean.position.x,
                  y: bean.position.y
                });
                setShowGrowthIndicator(true);
                setTimeout(() => setShowGrowthIndicator(false), 1500);
                
                return {
                  ...bean,
                  growthStage: bean.growthStage + 1,
                  harvestValue: bean.harvestValue * 1.5 // Increase value with growth
                };
              }
            }
            return bean;
          })
        );
      }
    }, 15000); // Check for growth every 15 seconds
    
    return () => clearInterval(growInterval);
  }, [beans, waterLevel, sunLevel, fertilizerLevel]);
  
  // Water the garden
  const waterGarden = () => {
    if (waterLevel < 20) {
      addNotification('warning', 'Low water level! Add more water first.');
      return;
    }
    
    setIsWateringActive(true);
    setLastAction("Watering the garden...");
    
    // Decrease water level
    setWaterLevel(prev => Math.max(0, prev - 10));
    
    // Improve health of all beans
    setBeans(prevBeans => 
      prevBeans.map(bean => ({
        ...bean,
        health: Math.min(100, bean.health + 15),
        lastWatered: new Date()
      }))
    );
    
    // Show watering animation
    setTimeout(() => {
      setIsWateringActive(false);
    }, 3000);
  };
  
  // Add water to the tank
  const refillWater = () => {
    setWaterLevel(100);
    setLastAction("Refilled water tank to 100%");
    addNotification('success', 'Water tank refilled to 100%');
  };
  
  // Add sunlight
  const increaseSunlight = () => {
    setSunLevel(100);
    setLastAction("Increased sunlight to 100%");
    addNotification('success', 'Sunlight increased to maximum');
  };
  
  // Add fertilizer
  const addFertilizer = () => {
    setFertilizerLevel(100);
    setLastAction("Added fertilizer, level at 100%");
    addNotification('success', 'Fertilizer added to maximum level');
  };
  
  // Create a new bean
  const plantBean = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gardenRef.current) {
      // Get click position relative to garden
      const rect = gardenRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if position is already occupied
      const isOccupied = beans.some(bean => {
        const distance = Math.sqrt(
          Math.pow(bean.position.x - x, 2) + 
          Math.pow(bean.position.y - y, 2)
        );
        return distance < 50; // Minimum spacing between beans
      });
      
      if (isOccupied) {
        addNotification('warning', 'Beans need more space to grow properly!');
        return;
      }
      
      // Create new bean
      const newBean: BeanPlant = {
        id: `bean-${Date.now()}`,
        type: selectedBeanType,
        growthStage: 1,
        lastWatered: new Date(),
        harvestValue: selectedBeanType === 'super-bean' ? 20 : 
                    selectedBeanType === 'coffee-bean' ? 15 : 
                    selectedBeanType === 'baby-bean' ? 8 : 10,
        plantedOn: new Date(),
        growthRate: Math.random() * 0.3 + 0.7, // Random growth rate between 0.7 and 1.0
        health: 100,
        special: Math.random() > 0.9, // 10% chance of special bean
        position: { x, y }
      };
      
      setBeans(prevBeans => [...prevBeans, newBean]);
      setLastAction(`Planted a new ${selectedBeanType.replace('-', ' ')}`);
      addNotification('success', `New ${selectedBeanType.replace('-', ' ')} planted!`);
      
      // Trigger parent callback if provided
      if (onGrowBean) {
        onGrowBean(newBean.harvestValue * 0.1); // Small immediate reward for planting
      }
    }
  };
  
  // Harvest a fully grown bean
  const harvestBean = (beanId: string) => {
    const beanToHarvest = beans.find(b => b.id === beanId);
    
    if (beanToHarvest && beanToHarvest.growthStage >= 5) {
      // Calculate harvest value based on bean properties
      const baseValue = beanToHarvest.harvestValue;
      const healthBonus = beanToHarvest.health / 100; // 0-1 multiplier based on health
      const specialBonus = beanToHarvest.special ? 1.5 : 1; // 50% bonus for special beans
      
      // Final harvest value
      const harvestValue = Math.round(baseValue * healthBonus * specialBonus);
      
      // Update totals
      setTotalHarvested(prev => prev + harvestValue);
      setLastHarvest(harvestValue);
      
      // Remove the harvested bean
      setBeans(prevBeans => prevBeans.filter(b => b.id !== beanId));
      
      setLastAction(`Harvested a ${beanToHarvest.type.replace('-', ' ')} for ${harvestValue} satoshis!`);
      addNotification('success', `Harvested ${harvestValue} satoshis! ${beanToHarvest.special ? '✨ SPECIAL BEAN BONUS! ✨' : ''}`);
      
      // Trigger parent callback if provided
      if (onHarvest) {
        onHarvest(harvestValue);
      }
    } else {
      addNotification('warning', 'Bean not ready for harvest yet! It needs to reach growth stage 5.');
    }
  };
  
  // Handle bean selection
  const selectBean = (bean: BeanPlant) => {
    setSelectedBean(bean);
  };
  
  // Add a notification
  const addNotification = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    const newNotification = {
      id: `notification-${Date.now()}`,
      message,
      type
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 5)); // Keep only the most recent 5
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };
  
  // Calculate overall garden health
  const calculateGardenHealth = () => {
    if (beans.length === 0) return 100;
    
    const totalHealth = beans.reduce((sum, bean) => sum + bean.health, 0);
    return Math.round(totalHealth / beans.length);
  };
  
  return (
    <div className={`refuel-station-container ${className}`}>
      <Card className="w-full bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-lg overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                REFUEL STATION
              </CardTitle>
              <CardDescription className="text-gray-400">
                Grow, nurture, and harvest your bean assets
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-700">
                Level {userLevel}
              </Badge>
              <Badge variant="outline" className="bg-amber-900/30 text-amber-400 border-amber-700 flex items-center gap-1">
                <Zap className="h-3 w-3" /> 
                {walletBalance.toFixed(8)} BTC
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="w-full bg-slate-800/50">
              <TabsTrigger value="garden" className="flex-1">
                <Shrub className="h-4 w-4 mr-2" /> Bean Garden
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex-1">
                <BarChart className="h-4 w-4 mr-2" /> Mining Stats
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex-1">
                <Gift className="h-4 w-4 mr-2" /> Rewards
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {/* Garden Tab */}
              {activeTab === "garden" && (
                <motion.div
                  key="garden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-300 mb-1">Water Level</h3>
                      <div className="flex items-center gap-2">
                        <Droplets className={`h-4 w-4 ${waterLevel < 20 ? 'text-red-500' : 'text-blue-500'}`} />
                        <Progress value={waterLevel} className="h-2" />
                        <span className="text-xs text-gray-400">{waterLevel}%</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-300 mb-1">Sunlight</h3>
                      <div className="flex items-center gap-2">
                        <Sun className={`h-4 w-4 ${sunLevel < 20 ? 'text-red-500' : 'text-yellow-500'}`} />
                        <Progress value={sunLevel} className="h-2" />
                        <span className="text-xs text-gray-400">{sunLevel}%</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-300 mb-1">Fertilizer</h3>
                      <div className="flex items-center gap-2">
                        <Wind className={`h-4 w-4 ${fertilizerLevel < 20 ? 'text-red-500' : 'text-green-500'}`} />
                        <Progress value={fertilizerLevel} className="h-2" />
                        <span className="text-xs text-gray-400">{fertilizerLevel}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mb-4">
                    <Button onClick={waterGarden} variant="outline" className="flex-1">
                      <Droplets className="h-4 w-4 mr-2" /> Water Garden
                    </Button>
                    <Button onClick={refillWater} variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" /> Refill Water
                    </Button>
                    <Button onClick={increaseSunlight} variant="outline" className="flex-1">
                      <Sun className="h-4 w-4 mr-2" /> Add Sunlight
                    </Button>
                    <Button onClick={addFertilizer} variant="outline" className="flex-1">
                      <Wind className="h-4 w-4 mr-2" /> Add Fertilizer
                    </Button>
                  </div>
                  
                  <div className="flex gap-4 mb-6">
                    <div className="bg-slate-800/50 rounded-lg p-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Plant New Bean</h3>
                      <div className="flex gap-2 mb-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant={selectedBeanType === 'bean' ? 'default' : 'outline'} 
                                className="flex-1"
                                onClick={() => setSelectedBeanType('bean')}
                              >
                                <img src="/bean.png" alt="Bean" className="h-5 w-5 mr-1" />
                                Bean
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Standard bean (10 Satoshi value)
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant={selectedBeanType === 'coffee-bean' ? 'default' : 'outline'} 
                                className="flex-1"
                                onClick={() => setSelectedBeanType('coffee-bean')}
                              >
                                <img src="/coffee-bean.png" alt="Coffee Bean" className="h-5 w-5 mr-1" />
                                Coffee
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Coffee bean (15 Satoshi value)
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant={selectedBeanType === 'baby-bean' ? 'default' : 'outline'} 
                                className="flex-1"
                                onClick={() => setSelectedBeanType('baby-bean')}
                              >
                                <img src="/baby-bean.png" alt="Baby Bean" className="h-5 w-5 mr-1" />
                                Baby
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Fast-growing bean (8 Satoshi value)
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        Click in the garden area below to plant your beans. 
                        Water and care for them until they reach growth stage 5, then harvest!
                      </p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Garden Status</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-400">Total Beans</p>
                          <p className="text-lg font-medium text-white">{beans.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Garden Health</p>
                          <p className={`text-lg font-medium ${
                            calculateGardenHealth() > 75 ? 'text-green-400' : 
                            calculateGardenHealth() > 50 ? 'text-yellow-400' : 
                            'text-red-400'
                          }`}>
                            {calculateGardenHealth()}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Ready to Harvest</p>
                          <p className="text-lg font-medium text-white">
                            {beans.filter(b => b.growthStage >= 5).length}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Total Harvested</p>
                          <p className="text-lg font-medium text-white">{totalHarvested}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tutorial alert */}
                  {showTutorial && (
                    <Alert className="mb-4 bg-blue-900/20 border-blue-800">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertTitle>Welcome to your Refuel Station!</AlertTitle>
                      <AlertDescription className="text-sm text-gray-300">
                        Plant beans in the garden, water them, provide sunlight, and add fertilizer to help them grow. 
                        Once they reach growth stage 5, you can harvest them for satoshis!
                        <div className="mt-2">
                          <Button variant="outline" size="sm" onClick={() => setShowTutorial(false)}>
                            Got it
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Garden Area */}
                  <div 
                    ref={gardenRef}
                    className="relative w-full h-[400px] bg-slate-900/60 rounded-lg overflow-hidden border border-slate-700/50"
                    onClick={plantBean}
                    style={{
                      backgroundImage: 'url("/garden-bg.png")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Beans */}
                    {beans.map(bean => (
                      <div 
                        key={bean.id} 
                        className="absolute" 
                        style={{ left: bean.position.x - 25, top: bean.position.y - 25 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectBean(bean);
                          
                          // If fully grown, harvest on click
                          if (bean.growthStage >= 5) {
                            harvestBean(bean.id);
                          }
                        }}
                      >
                        <BeanAnimation 
                          type={bean.growthStage >= 5 ? 'bounce' : 'grow'} 
                          character={bean.type}
                          size="md"
                          speed="normal"
                          growthStage={bean.growthStage}
                          withGlow={bean.special || bean.growthStage >= 5}
                          interactive={true}
                        />
                        
                        {/* Health indicator */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10">
                          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                bean.health > 75 ? 'bg-green-500' : 
                                bean.health > 50 ? 'bg-yellow-500' : 
                                bean.health > 25 ? 'bg-orange-500' : 
                                'bg-red-500'
                              }`}
                              style={{ width: `${bean.health}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Growth stage indicator */}
                        {bean.growthStage < 5 && (
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900/80 rounded-full px-1.5 py-0.5 text-xs text-white">
                            {bean.growthStage}/5
                          </div>
                        )}
                        
                        {/* Harvest indicator */}
                        {bean.growthStage >= 5 && (
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-900/80 rounded-full px-1.5 py-0.5 text-xs text-white animate-pulse flex items-center">
                            <span className="mr-1">Harvest</span>
                            <Award className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Watering animation */}
                    {isWateringActive && (
                      <div className="absolute inset-0 bg-blue-500/10 animate-pulse">
                        {Array.from({ length: 20 }).map((_, idx) => (
                          <motion.div
                            key={`drop-${idx}`}
                            className="absolute w-1 h-2 bg-blue-400 rounded-full"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `-10px`,
                            }}
                            animate={{
                              y: ['0%', '2000%'],
                              opacity: [1, 0.7, 0],
                            }}
                            transition={{
                              duration: 2,
                              delay: Math.random() * 2,
                              repeat: Infinity,
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Growth indicator animation */}
                    <AnimatePresence>
                      {showGrowthIndicator && (
                        <motion.div
                          className="absolute bg-green-500 text-white text-xs px-2 py-1 rounded-full z-20"
                          style={{ left: growthIndicator.x, top: growthIndicator.y - 40 }}
                          initial={{ opacity: 0, y: 0, scale: 0.5 }}
                          animate={{ opacity: 1, y: -20, scale: 1 }}
                          exit={{ opacity: 0, y: -40, scale: 0.5 }}
                          transition={{ duration: 1 }}
                        >
                          Level {growthIndicator.value}!
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Empty state */}
                    {beans.length === 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                        <Shrub className="h-16 w-16 mb-3 opacity-30" />
                        <p className="text-center max-w-xs">
                          Your garden is empty! Click anywhere to plant your first bean.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Bean details panel */}
                  {selectedBean && (
                    <div className="mt-4 bg-slate-800/50 rounded-lg p-4">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-300">
                          Selected Bean Details
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedBean(null)}>
                          Close
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        <div>
                          <p className="text-xs text-gray-400">Type</p>
                          <p className="font-medium text-white capitalize">{selectedBean.type.replace('-', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Growth Stage</p>
                          <p className="font-medium text-white">{selectedBean.growthStage}/5</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Health</p>
                          <p className={`font-medium ${
                            selectedBean.health > 75 ? 'text-green-400' : 
                            selectedBean.health > 50 ? 'text-yellow-400' : 
                            'text-red-400'
                          }`}>{selectedBean.health}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Planted On</p>
                          <p className="font-medium text-white">{selectedBean.plantedOn.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Harvest Value</p>
                          <p className="font-medium text-white">{selectedBean.harvestValue.toFixed(0)} satoshis</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Special Bean</p>
                          <p className="font-medium text-white">{selectedBean.special ? 'Yes ✨' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Last Watered</p>
                          <p className="font-medium text-white">
                            {new Date(selectedBean.lastWatered).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Growth Rate</p>
                          <p className="font-medium text-white">{(selectedBean.growthRate * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                      {selectedBean.growthStage >= 5 && (
                        <div className="mt-3">
                          <Button 
                            className="w-full bg-green-700 hover:bg-green-800" 
                            onClick={() => harvestBean(selectedBean.id)}
                          >
                            <Award className="mr-2 h-4 w-4" /> Harvest Bean ({selectedBean.harvestValue.toFixed(0)} sats)
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Notifications */}
                  <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
                    <AnimatePresence>
                      {notifications.map(notification => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20, x: 20 }}
                          animate={{ opacity: 1, y: 0, x: 0 }}
                          exit={{ opacity: 0, x: 100 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert className={`
                            ${notification.type === 'success' ? 'bg-green-900/80 border-green-700' : ''}
                            ${notification.type === 'warning' ? 'bg-yellow-900/80 border-yellow-700' : ''}
                            ${notification.type === 'error' ? 'bg-red-900/80 border-red-700' : ''}
                            ${notification.type === 'info' ? 'bg-blue-900/80 border-blue-700' : ''}
                          `}>
                            {notification.type === 'success' && <Award className="h-4 w-4 text-green-400" />}
                            {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-400" />}
                            {notification.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                            {notification.type === 'info' && <Info className="h-4 w-4 text-blue-400" />}
                            <AlertDescription>{notification.message}</AlertDescription>
                          </Alert>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
              
              {/* Stats Tab */}
              {activeTab === "stats" && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Mining Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Current Hashrate</span>
                              <span className="font-medium text-white">{miningStats.hashrate.toFixed(2)} H/s</span>
                            </div>
                            <Progress value={miningStats.hashrate / 100} className="h-1 mt-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Miner Uptime</span>
                              <span className="font-medium text-white">{miningStats.uptime} minutes</span>
                            </div>
                            <Progress value={Math.min(miningStats.uptime / 6, 100)} className="h-1 mt-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Beans Generated</span>
                              <span className="font-medium text-white">{miningStats.beansGenerated}</span>
                            </div>
                            <Progress value={Math.min(miningStats.beansGenerated / 10, 100)} className="h-1 mt-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-slate-800/60 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Garden Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-700/30 rounded-lg p-3">
                            <div className="flex items-start">
                              <div className="bg-green-900/30 rounded-full p-2 mr-3">
                                <Shrub className="h-4 w-4 text-green-500" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Total Beans</p>
                                <p className="text-lg font-semibold text-white">{beans.length}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-slate-700/30 rounded-lg p-3">
                            <div className="flex items-start">
                              <div className="bg-amber-900/30 rounded-full p-2 mr-3">
                                <Award className="h-4 w-4 text-amber-500" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Total Harvested</p>
                                <p className="text-lg font-semibold text-white">{totalHarvested}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-slate-700/30 rounded-lg p-3">
                            <div className="flex items-start">
                              <div className="bg-indigo-900/30 rounded-full p-2 mr-3">
                                <TrendingUp className="h-4 w-4 text-indigo-500" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Growth Rate</p>
                                <p className="text-lg font-semibold text-white">
                                  {beans.length ? Math.round(beans.reduce((sum, bean) => sum + bean.growthRate, 0) / beans.length * 100) : 0}%
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-slate-700/30 rounded-lg p-3">
                            <div className="flex items-start">
                              <div className="bg-blue-900/30 rounded-full p-2 mr-3">
                                <Gift className="h-4 w-4 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Last Harvest</p>
                                <p className="text-lg font-semibold text-white">{lastHarvest}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-slate-800/60 border-slate-700/50 mb-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">Bean Growth Optimizer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="water-mix" className="text-sm">Water Mixture</Label>
                            <span className="text-xs text-gray-400">Optimal Mix: 70%</span>
                          </div>
                          <Slider 
                            id="water-mix"
                            defaultValue={[70]} 
                            max={100} 
                            step={5}
                            className="mb-4"
                          />
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="sunlight-exposure" className="text-sm">Sunlight Exposure</Label>
                            <span className="text-xs text-gray-400">Optimal Exposure: 85%</span>
                          </div>
                          <Slider 
                            id="sunlight-exposure"
                            defaultValue={[85]} 
                            max={100} 
                            step={5}
                            className="mb-4"
                          />
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="fertilizer-amount" className="text-sm">Fertilizer Amount</Label>
                            <span className="text-xs text-gray-400">Optimal Amount: 60%</span>
                          </div>
                          <Slider 
                            id="fertilizer-amount"
                            defaultValue={[60]} 
                            max={100} 
                            step={5}
                            className="mb-4"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <Button variant="outline" className="w-full">
                            <Hammer className="h-4 w-4 mr-2" />
                            Apply Optimization
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Rocket className="h-4 w-4 mr-2" />
                            Turbo Growth (24h)
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/60 border-slate-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">Bean Type Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <img src="/bean.png" alt="Standard Bean" className="w-8 h-8 mr-3" />
                            <span className="text-white">Standard Bean</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {beans.filter(b => b.type === 'bean').length} planted
                          </div>
                          <div className="text-sm text-gray-400">
                            {beans.filter(b => b.type === 'bean' && b.special).length} special
                          </div>
                        </div>
                        
                        <Separator className="bg-gray-800" />
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <img src="/coffee-bean.png" alt="Coffee Bean" className="w-8 h-8 mr-3" />
                            <span className="text-white">Coffee Bean</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {beans.filter(b => b.type === 'coffee-bean').length} planted
                          </div>
                          <div className="text-sm text-gray-400">
                            {beans.filter(b => b.type === 'coffee-bean' && b.special).length} special
                          </div>
                        </div>
                        
                        <Separator className="bg-gray-800" />
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <img src="/baby-bean.png" alt="Baby Bean" className="w-8 h-8 mr-3" />
                            <span className="text-white">Baby Bean</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {beans.filter(b => b.type === 'baby-bean').length} planted
                          </div>
                          <div className="text-sm text-gray-400">
                            {beans.filter(b => b.type === 'baby-bean' && b.special).length} special
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {/* Rewards Tab */}
              {activeTab === "rewards" && (
                <motion.div
                  key="rewards"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-gradient-to-br from-amber-900/30 to-amber-950/30 border-amber-800/50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-amber-300 text-lg font-medium">Satoshi Savings</h3>
                            <p className="text-gray-400 text-sm">Your harvested beans</p>
                          </div>
                          <div className="bg-amber-900/30 p-2 rounded-full">
                            <TrendingUp className="h-5 w-5 text-amber-400" />
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">{totalHarvested}</div>
                        <Progress value={Math.min(totalHarvested / 1000 * 100, 100)} className="h-1 mb-2" />
                        <p className="text-xs text-gray-400">
                          {Math.round(totalHarvested / 1000 * 100)}% towards next reward level
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-green-900/30 to-green-950/30 border-green-800/50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-green-300 text-lg font-medium">Mining Blockchain Tokens</h3>
                            <p className="text-gray-400 text-sm">From mining activities</p>
                          </div>
                          <div className="bg-green-900/30 p-2 rounded-full">
                            <Hammer className="h-5 w-5 text-green-400" />
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">{miningStats.beansGenerated}</div>
                        <Progress value={Math.min(miningStats.beansGenerated / 500 * 100, 100)} className="h-1 mb-2" />
                        <p className="text-xs text-gray-400">
                          {Math.round(miningStats.beansGenerated / 500 * 100)}% towards next mining level
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-blue-900/30 to-blue-950/30 border-blue-800/50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-blue-300 text-lg font-medium">Growing Power</h3>
                            <p className="text-gray-400 text-sm">Your gardening skill</p>
                          </div>
                          <div className="bg-blue-900/30 p-2 rounded-full">
                            <Zap className="h-5 w-5 text-blue-400" />
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">
                          {userLevel}
                        </div>
                        <Progress value={userLevel * 10} className="h-1 mb-2" />
                        <p className="text-xs text-gray-400">
                          Growing skills increase with each harvest
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-slate-800/60 border-slate-700/50 mb-6">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-md font-medium">Recent Harvests</CardTitle>
                        <Button variant="ghost" size="sm">View All</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {totalHarvested > 0 ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="bg-green-900/20 p-2 rounded-full mr-3">
                                <Award className="h-4 w-4 text-green-500" />
                              </div>
                              <div>
                                <p className="text-white text-sm">Standard Bean Harvest</p>
                                <p className="text-xs text-gray-400">Today, {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                              </div>
                            </div>
                            <div className="text-white font-medium">+{lastHarvest}</div>
                          </div>
                          
                          {/* Add more example harvests if there's been actual harvesting activity */}
                          {totalHarvested > lastHarvest && (
                            <>
                              <Separator className="bg-gray-800" />
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className="bg-amber-900/20 p-2 rounded-full mr-3">
                                    <Award className="h-4 w-4 text-amber-500" />
                                  </div>
                                  <div>
                                    <p className="text-white text-sm">Special Bean Harvest</p>
                                    <p className="text-xs text-gray-400">Today, {new Date(Date.now() - 3600000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                  </div>
                                </div>
                                <div className="text-white font-medium">+{Math.round(totalHarvested - lastHarvest)}</div>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p>No harvests yet! Plant and grow beans to start earning rewards.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/60 border-slate-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">Upcoming Rewards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <div className="bg-purple-900/30 p-2 rounded-full mr-3">
                                <Gift className="h-5 w-5 text-purple-500" />
                              </div>
                              <div>
                                <p className="text-white font-medium">Super Bean Unlocked</p>
                                <p className="text-sm text-gray-400">1,000 satoshis harvested</p>
                              </div>
                            </div>
                            <Badge variant="outline" className={totalHarvested >= 1000 ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-500"}>
                              {totalHarvested >= 1000 ? "Unlocked" : `${Math.round(totalHarvested / 1000 * 100)}%`}
                            </Badge>
                          </div>
                          <Progress value={Math.min(totalHarvested / 1000 * 100, 100)} className="h-1" />
                        </div>
                        
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <div className="bg-blue-900/30 p-2 rounded-full mr-3">
                                <Droplets className="h-5 w-5 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-white font-medium">Auto-Watering System</p>
                                <p className="text-sm text-gray-400">2,500 satoshis harvested</p>
                              </div>
                            </div>
                            <Badge variant="outline" className={totalHarvested >= 2500 ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-500"}>
                              {totalHarvested >= 2500 ? "Unlocked" : `${Math.round(totalHarvested / 2500 * 100)}%`}
                            </Badge>
                          </div>
                          <Progress value={Math.min(totalHarvested / 2500 * 100, 100)} className="h-1" />
                        </div>
                        
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <div className="bg-amber-900/30 p-2 rounded-full mr-3">
                                <Rocket className="h-5 w-5 text-amber-500" />
                              </div>
                              <div>
                                <p className="text-white font-medium">Growth Accelerator</p>
                                <p className="text-sm text-gray-400">5,000 satoshis harvested</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-gray-800 text-gray-500">
                              {Math.round(totalHarvested / 5000 * 100)}%
                            </Badge>
                          </div>
                          <Progress value={Math.min(totalHarvested / 5000 * 100, 100)} className="h-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Tabs>
        
        <CardFooter className="border-t border-gray-800 py-3 px-6">
          <div className="flex justify-between items-center w-full">
            <div className="text-xs text-gray-400">
              {lastAction ? `Last action: ${lastAction}` : 'Plant, grow, and harvest beans to earn satoshis'}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">Miner:</span>
              <span className="text-xs text-gray-300">{userName}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RefuelStation;