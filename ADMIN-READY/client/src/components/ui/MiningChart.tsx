import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getMiningHistory } from '@/lib/miningClient';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  ReferenceLine,
  Label
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronUp, ChevronDown, Cpu, PieChart, TrendingUp, Clock3 } from 'lucide-react';
import { formatHashRate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface MiningChartProps {
  className?: string;
  showHashrate?: boolean;
}

export function MiningChart({ className, showHashrate = true }: MiningChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [expanded, setExpanded] = useState(false);
  const [activeDot, setActiveDot] = useState<{x: number, y: number, value: number} | null>(null);
  const [particles, setParticles] = useState<{x: number, y: number, size: number, speed: number, alpha: number, color: string}[]>([]);
  const [activeTab, setActiveTab] = useState<'hashrate' | 'earnings' | 'yearly'>('hashrate');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Generate cosmic particles for the chart background
  useEffect(() => {
    const newParticles = Array.from({length: 30}, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 1 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      color: ['#3B82F6', '#10B981', '#8B5CF6', '#60A5FA', '#A78BFA'][Math.floor(Math.random() * 5)]
    }));
    setParticles(newParticles);
  }, []);
  
  // Animation for particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y > 100 ? 0 : particle.y + particle.speed * 0.2,
        alpha: Math.sin(Date.now() / 1000 * particle.speed) * 0.2 + 0.3
      })));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/mining/history', timeRange],
    queryFn: () => getMiningHistory(timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : 30),
  });
  
  // Generate dot pulse effect when data point is active
  useEffect(() => {
    if (activeDot) {
      const timeout = setTimeout(() => {
        setActiveDot(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [activeDot]);
  
  const chartData = useMemo(() => {
    if (!data || !data.length) {
      // Generate sample data when no data is available
      // This ensures the UI still looks good while waiting for real data
      const now = new Date();
      const sampleData = Array.from({length: 12}, (_, i) => {
        const date = new Date(now.getTime() - (11 - i) * 3600000);
        const baseHashRate = Math.random() * 5 + 1;
        return {
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hashRate: baseHashRate,
          earnings: baseHashRate * 0.00004,
          projectedYearly: baseHashRate * 0.00004 * 365,
        };
      });
      return sampleData;
    }
    
    // Format data for the chart
    return data.map((stat: any) => {
      const date = new Date(stat.timestamp);
      let timeLabel = '';
      
      // Format time label based on range
      if (timeRange === 'day') {
        timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (timeRange === 'week') {
        timeLabel = date.toLocaleDateString([], { weekday: 'short', hour: '2-digit' });
      } else {
        timeLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
      
      const hashRate = Number(stat.totalHashRate) || 0;
      const earnings = Number(stat.estimatedEarnings) || 0;
      
      return {
        time: timeLabel,
        hashRate: hashRate,
        earnings: earnings,
        projectedYearly: earnings * (365 / (timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : 30)),
      };
    });
  }, [data, timeRange]);

  // Calculate chart summary stats
  const chartSummary = useMemo(() => {
    if (!chartData.length) return { avg: 0, max: 0, trend: 'neutral' };
    
    const values = chartData.map(d => 
      activeTab === 'hashrate' 
        ? d.hashRate 
        : activeTab === 'earnings' 
          ? d.earnings 
          : d.projectedYearly
    );
    
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    
    // Calculate trend (up, down, neutral)
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    let trend = 'neutral';
    if (secondAvg > firstAvg * 1.05) trend = 'up';
    else if (secondAvg < firstAvg * 0.95) trend = 'down';
    
    return { avg, max, trend };
  }, [chartData, activeTab]);
  
  // Determine the chart theme colors based on active tab
  const chartColors = useMemo(() => {
    if (activeTab === 'hashrate') {
      return {
        primary: '#3B82F6', // Blue
        secondary: '#93C5FD',
        gradient: ['rgba(59, 130, 246, 0.5)', 'rgba(59, 130, 246, 0.1)'],
        accentLight: 'rgba(59, 130, 246, 0.2)',
        accentBright: 'rgba(59, 130, 246, 1)',
      };
    } else if (activeTab === 'earnings') {
      return {
        primary: '#10B981', // Green
        secondary: '#6EE7B7',
        gradient: ['rgba(16, 185, 129, 0.5)', 'rgba(16, 185, 129, 0.1)'],
        accentLight: 'rgba(16, 185, 129, 0.2)',
        accentBright: 'rgba(16, 185, 129, 1)',
      };
    } else {
      return {
        primary: '#8B5CF6', // Purple
        secondary: '#C4B5FD',
        gradient: ['rgba(139, 92, 246, 0.5)', 'rgba(139, 92, 246, 0.1)'],
        accentLight: 'rgba(139, 92, 246, 0.2)',
        accentBright: 'rgba(139, 92, 246, 1)',
      };
    }
  }, [activeTab]);
  
  const formatValue = (value: number) => {
    if (activeTab === 'hashrate') {
      return formatHashRate(value);
    } else if (activeTab === 'earnings') {
      return `${value.toFixed(8)} BTC`;
    } else {
      return `${value.toFixed(6)} BTC`;
    }
  };
  
  const handleMouseMove = (e: any) => {
    if (e.activePayload && e.activePayload.length) {
      setShowTooltip(true);
      setTooltipData({
        time: e.activePayload[0].payload.time,
        value: e.activePayload[0].value,
      });
      setTooltipPosition({ x: e.chartX, y: e.chartY });
    } else {
      setShowTooltip(false);
    }
  };
  
  return (
    <div className={cn("p-0.5 relative", className)}>
      {/* Enhanced 3D effect with cosmic border and shadow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-900/70 via-purple-900/70 to-indigo-900/70 shadow-lg transform perspective-1000 -rotate-x-1"></div>
      
      {/* Cosmic background animation */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        {/* Distant stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`chart-star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: 'blur(0.5px)'
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 2 + Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Digital grid universe */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(50, 138, 241, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(50, 138, 241, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>
      
      {/* Inner content with enhanced glass effect */}
      <div className="relative rounded-xl bg-black/80 backdrop-blur-md overflow-hidden z-10 p-4 border border-purple-500/30">
        {/* Header with enhanced cosmic styling */}
        <div className="flex items-center justify-between mb-6">
          <motion.h3 
            className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center"
            animate={{
              textShadow: [
                '0 0 5px rgba(139, 92, 246, 0.3)',
                '0 0 10px rgba(139, 92, 246, 0.5)',
                '0 0 5px rgba(139, 92, 246, 0.3)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="mr-2"
            >
              <PieChart className="h-5 w-5 text-purple-400" />
            </motion.div>
            KLOUD BUGS MINING STATISTICS
          </motion.h3>
          
          <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-0.5">
            <button 
              onClick={() => setActiveTab('hashrate')}
              className={cn(
                "px-3 py-1 text-xs rounded-md transition-all duration-200",
                activeTab === 'hashrate' 
                  ? "bg-blue-500 text-white shadow-md" 
                  : "text-slate-300 hover:text-white"
              )}
            >
              <motion.div 
                initial={false}
                animate={{ scale: activeTab === 'hashrate' ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.5, repeat: activeTab === 'hashrate' ? Infinity : 0, repeatDelay: 2 }}
                className="flex items-center"
              >
                <TrendingUp className="mr-1 h-3 w-3" />
                Hashrate
              </motion.div>
            </button>
            
            <button 
              onClick={() => setActiveTab('earnings')}
              className={cn(
                "px-3 py-1 text-xs rounded-md transition-all duration-200",
                activeTab === 'earnings' 
                  ? "bg-green-500 text-white shadow-md" 
                  : "text-slate-300 hover:text-white"
              )}
            >
              <motion.div 
                initial={false}
                animate={{ scale: activeTab === 'earnings' ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.5, repeat: activeTab === 'earnings' ? Infinity : 0, repeatDelay: 2 }}
                className="flex items-center"
              >
                <Cpu className="mr-1 h-3 w-3" />
                Earnings
              </motion.div>
            </button>
            
            <button 
              onClick={() => setActiveTab('yearly')}
              className={cn(
                "px-3 py-1 text-xs rounded-md transition-all duration-200",
                activeTab === 'yearly' 
                  ? "bg-purple-500 text-white shadow-md" 
                  : "text-slate-300 hover:text-white"
              )}
            >
              <motion.div 
                initial={false}
                animate={{ scale: activeTab === 'yearly' ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.5, repeat: activeTab === 'yearly' ? Infinity : 0, repeatDelay: 2 }}
                className="flex items-center"
              >
                <Clock3 className="mr-1 h-3 w-3" />
                Yearly
              </motion.div>
            </button>
          </div>
          
          <div className="flex space-x-2 items-center">
            <button 
              onClick={() => setTimeRange('day')}
              className={cn(
                "text-xs px-2 py-1 rounded transition-colors",
                timeRange === 'day' 
                  ? "text-white bg-slate-700" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              1D
            </button>
            <button 
              onClick={() => setTimeRange('week')}
              className={cn(
                "text-xs px-2 py-1 rounded transition-colors",
                timeRange === 'week' 
                  ? "text-white bg-slate-700" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              1W
            </button>
            <button 
              onClick={() => setTimeRange('month')}
              className={cn(
                "text-xs px-2 py-1 rounded transition-colors",
                timeRange === 'month' 
                  ? "text-white bg-slate-700" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              1M
            </button>
          </div>
        </div>
        
        {/* Main Chart */}
        <div className="mt-4 relative">
          {/* Summary info cards with enhanced cosmic effects */}
          <div className="flex mb-4 space-x-4">
            <motion.div 
              className="relative bg-black/70 rounded-xl p-3 flex-1 backdrop-blur-md border border-purple-500/40 shadow-lg shadow-purple-500/10 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Cosmic background effects */}
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={`stat-star-1-${i}`}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${Math.random() * 2 + 1}px`,
                      height: `${Math.random() * 2 + 1}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      filter: 'blur(0.5px)',
                      opacity: Math.random() * 0.7 + 0.3
                    }}
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2 + Math.random() * 3,
                      ease: "easeInOut",
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
              
              {/* Nebula effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-800/5 to-purple-900/10 mix-blend-screen"
                animate={{ 
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.05, 1] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 8,
                  ease: "easeInOut"
                }}
              />

              {/* Digital grid lines with animation */}
              <motion.div 
                className="absolute inset-0 opacity-10" 
                animate={{ opacity: [0.05, 0.15, 0.05] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(168, 85, 247, 0.5) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(168, 85, 247, 0.5) 1px, transparent 1px)
                  `,
                  backgroundSize: '15px 15px'
                }}
              />
              
              {/* Scanner line effect */}
              <motion.div
                className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-purple-400 to-transparent"
                style={{ left: '50%' }}
                animate={{ 
                  left: ['0%', '100%', '0%'],
                  opacity: [0, 0.7, 0] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut"
                }}
              />
              
              {/* Content with glow effect */}
              <div className="relative z-10">
                <div className="text-purple-300 text-xs mb-1 flex items-center">
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="mr-1"
                  >
                    ✧
                  </motion.span>
                  Income
                </div>
                <motion.div 
                  className="text-white font-semibold flex items-baseline"
                  animate={{ 
                    textShadow: [
                      '0 0 3px rgba(168, 85, 247, 0.3)',
                      '0 0 6px rgba(168, 85, 247, 0.6)',
                      '0 0 3px rgba(168, 85, 247, 0.3)'
                    ] 
                  }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <span className="text-lg mr-1 text-purple-300">$</span>
                  <span className="text-2xl">
                    {activeTab === 'yearly' ? '1799' : '17.99'}
                  </span>
                </motion.div>
                
                {/* Enhanced visualization with cosmic effect */}
                <div 
                  className="mt-2 h-12 overflow-hidden rounded-lg relative"
                  style={{
                    background: `linear-gradient(180deg, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0.05) 100%)`
                  }}
                >
                  {/* Energy beams */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[1, 2].map((idx) => (
                      <motion.div
                        key={`energy-beam-stat-1-${idx}`}
                        className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                        style={{
                          top: `${40 * idx}%`,
                          opacity: 0.6,
                          left: 0
                        }}
                        animate={{
                          opacity: [0.3, 0.7, 0.3],
                          width: ['0%', '100%', '0%']
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3 + idx,
                          ease: "easeInOut",
                          delay: idx * 0.5
                        }}
                      />
                    ))}
                  </div>
                  
                  <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full relative z-10">
                    <motion.path
                      d="M0 30 L0 20 C10 15, 20 25, 30 20 C40 15, 50 10, 60 15 C70 20, 80 25, 90 15 L100 10 L100 30 Z"
                      fill="url(#purpleGradient1)"
                      fillOpacity="0.4"
                      animate={{ 
                        y: [0, -1, 0],
                        fillOpacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.path
                      d="M0 20 C10 15, 20 25, 30 20 C40 15, 50 10, 60 15 C70 20, 80 25, 90 15 L100 10"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="1.5"
                      strokeOpacity="0.8"
                      animate={{ 
                        strokeDashoffset: [0, 100], 
                        strokeOpacity: [0.8, 1, 0.8] 
                      }}
                      transition={{ 
                        strokeDashoffset: { repeat: Infinity, duration: 10, ease: "linear" },
                        strokeOpacity: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                      }}
                      style={{ strokeDasharray: 100 }}
                    />
                    <defs>
                      <linearGradient id="purpleGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Floating particles */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={`particle-stat-1-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: `${Math.random() * 3 + 1}px`,
                        height: `${Math.random() * 3 + 1}px`,
                        background: `rgba(${Math.floor(Math.random() * 100 + 150)}, ${Math.floor(Math.random() * 50 + 50)}, ${Math.floor(Math.random() * 100 + 150)}, ${Math.random() * 0.5 + 0.3})`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        filter: 'blur(1px)'
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3 + Math.random() * 4,
                        ease: "easeInOut",
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative bg-black/70 rounded-xl p-3 flex-1 backdrop-blur-md border border-cyan-500/40 shadow-lg shadow-cyan-500/10 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Cosmic background effects */}
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={`stat-star-2-${i}`}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${Math.random() * 2 + 1}px`,
                      height: `${Math.random() * 2 + 1}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      filter: 'blur(0.5px)',
                      opacity: Math.random() * 0.7 + 0.3
                    }}
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2 + Math.random() * 3,
                      ease: "easeInOut",
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
              
              {/* Nebula effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-blue-800/5 to-cyan-900/10 mix-blend-screen"
                animate={{ 
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.05, 1] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 8,
                  ease: "easeInOut"
                }}
              />

              {/* Digital grid lines with animation */}
              <motion.div 
                className="absolute inset-0 opacity-10" 
                animate={{ opacity: [0.05, 0.15, 0.05] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(6, 182, 212, 0.5) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(6, 182, 212, 0.5) 1px, transparent 1px)
                  `,
                  backgroundSize: '15px 15px'
                }}
              />
              
              {/* Scanner line effect */}
              <motion.div
                className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
                style={{ left: '50%' }}
                animate={{ 
                  left: ['0%', '100%', '0%'],
                  opacity: [0, 0.7, 0] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut"
                }}
              />
              
              {/* Content with glow effect */}
              <div className="relative z-10">
                <div className="text-cyan-300 text-xs mb-1 flex items-center">
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="mr-1"
                  >
                    ✧
                  </motion.span>
                  Outcome
                </div>
                <motion.div 
                  className="text-white font-semibold flex items-baseline"
                  animate={{ 
                    textShadow: [
                      '0 0 3px rgba(6, 182, 212, 0.3)',
                      '0 0 6px rgba(6, 182, 212, 0.6)',
                      '0 0 3px rgba(6, 182, 212, 0.3)'
                    ] 
                  }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <span className="text-lg mr-1 text-cyan-300">$</span>
                  <span className="text-2xl">
                    {activeTab === 'yearly' ? '1249' : '12.49'}
                  </span>
                </motion.div>
                
                {/* Enhanced visualization with cosmic effect */}
                <div 
                  className="mt-2 h-12 overflow-hidden rounded-lg relative"
                  style={{
                    background: `linear-gradient(180deg, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0.05) 100%)`
                  }}
                >
                  {/* Energy beams */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[1, 2].map((idx) => (
                      <motion.div
                        key={`energy-beam-stat-2-${idx}`}
                        className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                        style={{
                          top: `${40 * idx}%`,
                          opacity: 0.6,
                          left: 0
                        }}
                        animate={{
                          opacity: [0.3, 0.7, 0.3],
                          width: ['0%', '100%', '0%']
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3 + idx,
                          ease: "easeInOut",
                          delay: idx * 0.5
                        }}
                      />
                    ))}
                  </div>
                  
                  <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full relative z-10">
                    <motion.path
                      d="M0 15 C10 10, 20 5, 30 10 C40 15, 50 20, 60 15 C70 10, 80 15, 90 10 L100 5 L100 30 L0 30 Z"
                      fill="url(#cyanGradient1)"
                      fillOpacity="0.4"
                      animate={{ 
                        y: [0, -1, 0],
                        fillOpacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.path
                      d="M0 15 C10 10, 20 5, 30 10 C40 15, 50 20, 60 15 C70 10, 80 15, 90 10 L100 5"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeOpacity="0.8"
                      animate={{ 
                        strokeDashoffset: [0, 100], 
                        strokeOpacity: [0.8, 1, 0.8] 
                      }}
                      transition={{ 
                        strokeDashoffset: { repeat: Infinity, duration: 10, ease: "linear" },
                        strokeOpacity: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                      }}
                      style={{ strokeDasharray: 100 }}
                    />
                    <defs>
                      <linearGradient id="cyanGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Floating particles */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={`particle-stat-2-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: `${Math.random() * 3 + 1}px`,
                        height: `${Math.random() * 3 + 1}px`,
                        background: `rgba(${Math.floor(Math.random() * 50 + 50)}, ${Math.floor(Math.random() * 100 + 150)}, ${Math.floor(Math.random() * 100 + 150)}, ${Math.random() * 0.5 + 0.3})`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        filter: 'blur(1px)'
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3 + Math.random() * 4,
                        ease: "easeInOut",
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Main chart area */}
          <motion.div 
            className="relative h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <motion.div 
                  className="text-slate-400 flex items-center"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Sparkles className="mr-2 h-5 w-5 text-blue-400" />
                  Loading chart data...
                </motion.div>
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="rgba(148, 163, 184, 0.1)" 
                    vertical={false}
                  />
                  
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(148, 163, 184, 0.5)" 
                    fontSize={11}
                    tickMargin={10}
                    axisLine={{ stroke: 'rgba(148, 163, 184, 0.1)' }}
                    tickLine={{ stroke: 'rgba(148, 163, 184, 0.1)' }}
                  />
                  
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.5)" 
                    fontSize={11}
                    tickMargin={10}
                    axisLine={{ stroke: 'rgba(148, 163, 184, 0.1)' }}
                    tickLine={{ stroke: 'rgba(148, 163, 184, 0.1)' }}
                    tickFormatter={(value) => {
                      if (activeTab === 'hashrate') return `${value} MH/s`;
                      if (value < 0.001) return value.toExponential(1);
                      return value.toFixed(4);
                    }}
                    domain={['auto', 'auto']}
                  />
                  
                  <Tooltip 
                    cursor={{ stroke: chartColors.primary, strokeWidth: 1, strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderColor: chartColors.primary,
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      backdropFilter: 'blur(8px)'
                    }}
                    formatter={(value, name) => {
                      return [formatValue(Number(value)), activeTab.charAt(0).toUpperCase() + activeTab.slice(1)];
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                    itemStyle={{ color: chartColors.primary }}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey={
                      activeTab === 'hashrate' 
                        ? 'hashRate' 
                        : activeTab === 'earnings' 
                          ? 'earnings' 
                          : 'projectedYearly'
                    }
                    stroke={chartColors.primary}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorGradient)"
                    activeDot={(props: any) => {
                      const { cx, cy, value } = props;
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={5} fill={chartColors.primary} />
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={9}
                            fill="transparent"
                            stroke={chartColors.primary}
                            strokeWidth={1.5}
                            strokeOpacity={0.4}
                          />
                          <motion.circle 
                            cx={cx} 
                            cy={cy} 
                            r={15}
                            initial={{ r: 5 }}
                            animate={{ r: 15, opacity: [0.7, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            fill="transparent"
                            stroke={chartColors.primary}
                            strokeWidth={1}
                            strokeOpacity={0.3}
                          />
                        </g>
                      );
                    }}
                  />
                  
                  {/* Average line */}
                  <ReferenceLine 
                    y={chartSummary.avg} 
                    stroke={chartColors.primary}
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  >
                    <Label 
                      value="AVG" 
                      position="left" 
                      style={{ 
                        fill: chartColors.primary, 
                        fontSize: 10,
                        fontWeight: 'bold'
                      }}
                    />
                  </ReferenceLine>
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-400">No mining data available yet</p>
              </div>
            )}
          </motion.div>
          
          {/* Performance trend indicators */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <motion.div 
              className="bg-slate-800/40 rounded-lg p-3 backdrop-blur border border-slate-700/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-slate-400 text-xs flex items-center">
                <span className="flex-1">This Month</span>
                <span className="text-right text-xs">Jul - Aug</span>
              </div>
              <div className="mt-2">
                <svg viewBox="0 0 100 20" className="w-full h-5">
                  <path
                    d="M0 10 L10 8 L20 12 L30 9 L40 11 L50 8 L60 10 L70 7 L80 9 L90 6 L100 8"
                    fill="none"
                    stroke={chartColors.primary}
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800/40 rounded-lg p-3 backdrop-blur border border-slate-700/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-slate-400 text-xs flex items-center">
                <span className="flex-1">This Year</span>
                <span className="text-right text-xs">2025 - 2026</span>
              </div>
              <div className="mt-2">
                <svg viewBox="0 0 100 20" className="w-full h-5">
                  <path
                    d="M0 10 L10 12 L20 8 L30 13 L40 5 L50 10 L60 8 L70 15 L80 12 L90 5 L100 8"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800/40 rounded-lg p-3 backdrop-blur border border-slate-700/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-slate-400 text-xs flex items-center">
                <span className="flex-1">All Income</span>
                <span className="text-right text-xs">2017 - 2025</span>
              </div>
              <div className="mt-2">
                <svg viewBox="0 0 100 20" className="w-full h-5">
                  <path
                    d="M0 15 L10 14 L20 13 L30 10 L40 11 L50 8 L60 9 L70 7 L80 5 L90 6 L100 4"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Cosmic particles in the background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle, i) => (
            <motion.div
              key={`chart-particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: particle.alpha,
                filter: 'blur(1px)'
              }}
              animate={{
                opacity: [particle.alpha, particle.alpha * 2, particle.alpha],
                scale: [1, 1.2, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 2 + Math.random() * 2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MiningChart;
