import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Heart, 
  Sparkles, 
  Shield, 
  Globe, 
  Leaf, 
  BookOpen,
  LucideIcon,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Bell
} from 'lucide-react';
import { useLocation } from 'wouter';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardHeader } from './card';

export interface ImpactAlert {
  id: string;
  title: string;
  description: string;
  token: 'BTC' | 'MPT' | 'TERA' | 'KLOUDBUG';
  amount: string;
  impactType: 'social' | 'education' | 'environment' | 'health' | 'technology' | 'community';
  date: string;
  location?: string;
  imageUrl?: string;
}

interface ImpactAlertSystemProps {
  className?: string;
}

const SAMPLE_ALERTS: ImpactAlert[] = [
  {
    id: '1',
    title: 'TERA Funds Civil Rights Education Center',
    description: 'Mining rewards contributed $12,500 to establish a new Civil Rights education center in Atlanta, providing resources to over 500 students.',
    token: 'TERA',
    amount: '2,500 TERA',
    impactType: 'education',
    date: '2025-04-01',
    location: 'Atlanta, GA',
  },
  {
    id: '2',
    title: 'Community Technology Access Program',
    description: 'Mining rewards funded laptops and internet access for 25 underprivileged students to support their education.',
    token: 'MPT',
    amount: '1,750 MPT',
    impactType: 'technology',
    date: '2025-03-15',
    location: 'Chicago, IL',
  },
  {
    id: '3',
    title: 'Environmental Restoration Project',
    description: 'KLOUDBUG mining community sponsored the planting of 1,000 trees to offset carbon emissions from mining operations.',
    token: 'KLOUDBUG',
    amount: '500 KLOUDBUG',
    impactType: 'environment',
    date: '2025-02-28',
    location: 'Portland, OR',
  }
];

const getImpactIcon = (impactType: ImpactAlert['impactType']): LucideIcon => {
  switch (impactType) {
    case 'social': return Heart;
    case 'education': return BookOpen;
    case 'environment': return Leaf;
    case 'health': return Shield;
    case 'technology': return Sparkles;
    case 'community': return Globe;
    default: return Heart;
  }
};

const getTokenColor = (token: ImpactAlert['token']): string => {
  switch (token) {
    case 'BTC': return 'from-amber-500 to-amber-600';
    case 'MPT': return 'from-blue-500 to-blue-600';
    case 'TERA': return 'from-purple-500 to-purple-600';
    case 'KLOUDBUG': return 'from-teal-500 to-teal-600';
    default: return 'from-blue-500 to-blue-600';
  }
};

export const ImpactAlertSystem: React.FC<ImpactAlertSystemProps> = ({ className = '' }) => {
  const [location] = useLocation();
  
  // Simulate a check for logged-in status
  // In a real app, this would come from your auth context
  const isLoggedIn = location.includes('/kloud') || location.includes('/mining') || location.includes('/cafe');
  
  const [currentAlert, setCurrentAlert] = useState<ImpactAlert | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMiniView, setIsMiniView] = useState(!isLoggedIn); // Show full view for logged-in users
  const [alertQueue, setAlertQueue] = useState<ImpactAlert[]>([]);
  
  // Simulation of receiving new impact alerts
  useEffect(() => {
    // Initially populate the queue with sample alerts
    setAlertQueue([...SAMPLE_ALERTS]);
    
    // Simulate receiving new alerts over time
    const interval = setInterval(() => {
      const randomAlert = SAMPLE_ALERTS[Math.floor(Math.random() * SAMPLE_ALERTS.length)];
      setAlertQueue(prev => [...prev, {...randomAlert, id: Date.now().toString()}]);
    }, 90000); // Add a new alert every 90 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Process the queue of alerts
  useEffect(() => {
    if (alertQueue.length > 0 && !isVisible) {
      const alert = alertQueue[0];
      const updatedQueue = alertQueue.slice(1);
      
      setCurrentAlert(alert);
      setIsVisible(true);
      
      // Hide alert after 15 seconds
      setTimeout(() => {
        setIsVisible(false);
        
        // Wait for exit animation to complete before processing next alert
        setTimeout(() => {
          setAlertQueue(updatedQueue);
        }, 1000);
      }, 15000);
    }
  }, [alertQueue, isVisible]);
  
  if (!currentAlert) return null;
  
  const ImpactIcon = getImpactIcon(currentAlert.impactType);
  const tokenColor = getTokenColor(currentAlert.token);
  
  // Function to expand from mini view (icon only) to full view
  const handleExpandFromMini = () => {
    setIsMiniView(false);
  };
  
  // Function to return to mini view
  const handleReturnToMini = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMiniView(true);
    setIsExpanded(false);
  };
  
  return (
    <div className={`fixed bottom-8 right-8 z-50 max-w-md ${className}`}>
      <AnimatePresence>
        {isVisible && isMiniView ? (
          // Mini view - just an icon with a pulse
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 20 
              } 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.5,
              transition: { 
                duration: 0.3
              } 
            }}
            onClick={handleExpandFromMini}
            className="cursor-pointer"
          >
            <div className="relative">
              <motion.div 
                className={`h-14 w-14 rounded-full bg-gradient-to-br ${tokenColor} flex items-center justify-center text-white shadow-lg`}
                animate={{ 
                  boxShadow: [
                    `0 0 8px rgba(0, 0, 0, 0.5)`,
                    `0 0 20px rgba(99, 102, 241, 0.6)`,
                    `0 0 8px rgba(0, 0, 0, 0.5)`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ scale: 1.1 }}
              >
                <ImpactIcon className="h-6 w-6" />
                
                {/* Notification indicator */}
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border border-black animate-pulse"></div>
                
                {/* Orbiting particles */}
                <motion.div
                  className="absolute h-2 w-2 rounded-full bg-white/80"
                  animate={{
                    x: [0, 16, 0, -16, 0],
                    y: [-16, 0, 16, 0, -16],
                    scale: [1, 1.2, 1, 0.8, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
              
              {/* Hint text */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-gray-400 whitespace-nowrap bg-gray-900/80 px-2 py-1 rounded">
                Click to view impact
              </div>
            </div>
          </motion.div>
        ) : isVisible && (
          // Full notification view
          <motion.div
            initial={{ y: 150, opacity: 0, scale: 0.7 }}
            animate={{ 
              y: 0, 
              opacity: 1, 
              scale: 1,
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              } 
            }}
            exit={{ 
              y: -200, 
              opacity: 0, 
              scale: 0.7,
              transition: { 
                duration: 0.5
              } 
            }}
          >
            <Card className={`border-none shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300 ${isExpanded ? 'w-96' : 'w-72'}`}>
              {/* Notification Header */}
              <CardHeader className="px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800 flex items-center justify-between cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${tokenColor} animate-pulse`}></div>
                  <h4 className="text-xs font-medium text-gray-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    IMPACT ALERT
                  </h4>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className={`bg-gradient-to-r ${tokenColor} text-white border-none px-1.5 py-0 text-[10px]`}>
                    {currentAlert.token}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                  >
                    {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                  </Button>
                </div>
              </CardHeader>
              
              {/* Rocket path animation below header */}
              <div className="relative h-2 bg-gradient-to-r from-black via-gray-800 to-black overflow-hidden">
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                  initial={{ x: "-10%" }}
                  animate={{ x: "110%" }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                >
                  <div className="relative">
                    <Rocket className="h-5 w-5 text-white rotate-90" />
                    <motion.div 
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-10 bg-gradient-to-t from-transparent to-orange-500 opacity-70"
                      animate={{ height: [8, 14, 8] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </div>
                </motion.div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-transparent to-transparent"></div>
              </div>
              
              <div className="relative">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black backdrop-blur-sm">
                  <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
                  <div className="absolute inset-0 stars-small"></div>
                </div>
                
                {/* Collapsible content area */}
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[300px]' : 'max-h-[120px]'}`}>
                  {/* Alert content */}
                  <CardContent className="relative z-10 p-3">
                    <div className="flex items-start space-x-3">
                      {/* Icon with orbital animation */}
                      <div className="relative flex-shrink-0">
                        <motion.div 
                          className={`h-10 w-10 rounded-full bg-gradient-to-br ${tokenColor} flex items-center justify-center text-white shadow-lg`}
                          animate={{ 
                            boxShadow: [
                              `0 0 8px rgba(0, 0, 0, 0.5)`,
                              `0 0 16px rgba(99, 102, 241, 0.6)`,
                              `0 0 8px rgba(0, 0, 0, 0.5)`
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <ImpactIcon className="h-5 w-5" />
                          
                          {/* Orbiting particles */}
                          <motion.div
                            className="absolute h-1.5 w-1.5 rounded-full bg-white/80"
                            animate={{
                              x: [0, 12, 0, -12, 0],
                              y: [-12, 0, 12, 0, -12],
                              scale: [1, 1.2, 1, 0.8, 1]
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                          
                          <motion.div
                            className="absolute h-1 w-1 rounded-full bg-white/80"
                            animate={{
                              x: [8, 0, -8, 0, 8],
                              y: [0, 8, 0, -8, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                        </motion.div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="font-bold text-base text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                            {currentAlert.title}
                          </h3>
                        </div>
                        
                        <p className="text-gray-300 text-xs mb-2">{currentAlert.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2 text-xs">
                            <span className="text-gray-400 text-[10px]">{currentAlert.date}</span>
                            {currentAlert.location && (
                              <span className="text-gray-400 text-[10px]">{currentAlert.location}</span>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-white">{currentAlert.amount}</div>
                        </div>
                        
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-gray-800">
                            <div className="text-[10px] text-gray-400 mb-2">
                              These funds are being used to directly support affected families through legal advocacy, community education, and investigative resources.
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[10px] h-7 text-gray-300 hover:text-white hover:bg-gray-800 px-2"
                                onClick={() => setIsVisible(false)}
                              >
                                Close
                              </Button>
                              <Button
                                size="sm"
                                className={`text-[10px] h-7 text-white bg-gradient-to-r ${tokenColor} border-none px-2`}
                                onClick={() => window.open(`/impact/${currentAlert.id}`, '_blank')}
                              >
                                Learn More
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
              
              {/* Show collapse/expand icon in non-expanded mode */}
              {!isExpanded && (
                <div 
                  className="flex justify-center py-1 cursor-pointer hover:bg-gray-800/50 text-gray-400 hover:text-white"
                  onClick={() => setIsExpanded(true)}
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              )}
              
              {/* Landing animation at the bottom */}
              <div className="relative h-2 bg-gradient-to-r from-black via-gray-800 to-black overflow-hidden">
                <motion.div
                  className="absolute right-0 bottom-1 rotate-180"
                  initial={{ y: "-100%" }}
                  animate={{ y: "0%" }}
                  transition={{ 
                    duration: 1.5, 
                    ease: "easeInOut",
                    delay: 3
                  }}
                >
                  <div className="relative">
                    <Rocket className="h-5 w-5 text-white rotate-90" />
                    <motion.div 
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-10 bg-gradient-to-t from-transparent to-orange-500 opacity-70"
                      animate={{ height: [8, 14, 8] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </div>
                </motion.div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-transparent to-transparent"></div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImpactAlertSystem;