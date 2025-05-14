import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MiningKnobProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  color?: 'blue' | 'cyan' | 'green' | 'purple' | 'red';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function MiningKnob({
  label,
  value: initialValue,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  color = 'cyan',
  size = 'md',
  icon,
  disabled = false,
  showValue = true,
  valueFormatter = (v) => v.toString(),
  className
}: MiningKnobProps) {
  const [value, setValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  
  // Calculate rotation based on value
  const calculateRotation = (val: number) => {
    // Maps the value range to a 0-270 degree rotation (leaving 90 degrees dead zone)
    return ((val - min) / (max - min)) * 270 - 135;
  };
  
  const rotation = calculateRotation(value);
  
  // Color schemes for different states and knob types
  const colorSchemes = {
    blue: {
      knob: disabled 
        ? 'bg-blue-950 border-blue-800/50' 
        : 'bg-gradient-to-br from-blue-800 to-blue-950 border-blue-600',
      active: 'bg-blue-600',
      glow: 'from-blue-400/0 via-blue-500/10 to-blue-400/0',
      track: 'from-blue-900/40 to-blue-700/40',
      text: disabled ? 'text-blue-700' : 'text-blue-400'
    },
    cyan: {
      knob: disabled 
        ? 'bg-cyan-950 border-cyan-800/50' 
        : 'bg-gradient-to-br from-cyan-800 to-cyan-950 border-cyan-600',
      active: 'bg-cyan-600',
      glow: 'from-cyan-400/0 via-cyan-500/10 to-cyan-400/0',
      track: 'from-cyan-900/40 to-cyan-700/40', 
      text: disabled ? 'text-cyan-700' : 'text-cyan-400'
    },
    green: {
      knob: disabled 
        ? 'bg-green-950 border-green-800/50' 
        : 'bg-gradient-to-br from-green-800 to-green-950 border-green-600',
      active: 'bg-green-600',
      glow: 'from-green-400/0 via-green-500/10 to-green-400/0',
      track: 'from-green-900/40 to-green-700/40',
      text: disabled ? 'text-green-700' : 'text-green-400'
    },
    purple: {
      knob: disabled 
        ? 'bg-purple-950 border-purple-800/50' 
        : 'bg-gradient-to-br from-purple-800 to-purple-950 border-purple-600',
      active: 'bg-purple-600',
      glow: 'from-purple-400/0 via-purple-500/10 to-purple-400/0',
      track: 'from-purple-900/40 to-purple-700/40',
      text: disabled ? 'text-purple-700' : 'text-purple-400'
    },
    red: {
      knob: disabled 
        ? 'bg-red-950 border-red-800/50' 
        : 'bg-gradient-to-br from-red-800 to-red-950 border-red-600',
      active: 'bg-red-600',
      glow: 'from-red-400/0 via-red-500/10 to-red-400/0',
      track: 'from-red-900/40 to-red-700/40',
      text: disabled ? 'text-red-700' : 'text-red-400'
    }
  };
  
  // Size configurations
  const sizeConfig = {
    xs: {
      knobSize: 'w-10 h-10',
      indicatorSize: 'w-0.5 h-1.5',
      indicatorOffset: 'top-1',
      fontSize: 'text-[8px]',
      iconSize: 'w-2.5 h-2.5',
      padding: 'p-1.5'
    },
    sm: {
      knobSize: 'w-14 h-14',
      indicatorSize: 'w-0.5 h-2',
      indicatorOffset: 'top-1.5',
      fontSize: 'text-[10px]',
      iconSize: 'w-3.5 h-3.5',
      padding: 'p-2'
    },
    md: {
      knobSize: 'w-24 h-24',
      indicatorSize: 'w-1.5 h-3',
      indicatorOffset: 'top-3',
      fontSize: 'text-sm',
      iconSize: 'w-5 h-5',
      padding: 'p-4'
    },
    lg: {
      knobSize: 'w-32 h-32',
      indicatorSize: 'w-2 h-4',
      indicatorOffset: 'top-4',
      fontSize: 'text-base',
      iconSize: 'w-6 h-6',
      padding: 'p-5'
    }
  };
  
  // Handle circular input logic
  const handleDrag = (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent, info: any) => {
    if (disabled) return;
    
    const knobElement = event.currentTarget as HTMLElement;
    const rect = knobElement.getBoundingClientRect();
    
    // Calculate center of the knob
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Get position of mouse/touch
    let clientX, clientY;
    if ('clientX' in event) {
      // Mouse event
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event.touches && event.touches[0]) {
      // Touch event
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      return; // Unknown event type
    }
    
    // Calculate angle between center and touch/mouse position
    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    
    // Convert angle to a 0-360 range
    let normalizedAngle = (angle + 270) % 360;
    
    // Restrict to 270 degrees of movement (from -135 to +135 degrees)
    if (normalizedAngle > 270) {
      normalizedAngle = 0;
    }
    
    // Map the angle to value (0-270 degrees maps to min-max)
    const mappedValue = min + (normalizedAngle / 270) * (max - min);
    
    // Round to nearest step
    const steppedValue = Math.round(mappedValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    setValue(clampedValue);
    onChange?.(clampedValue);
  };
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Knob Label with cosmic glow */}
      <motion.div 
        className={cn(
          "text-center mb-2 font-medium uppercase tracking-wider relative",
          colorSchemes[color].text, 
          sizeConfig[size].fontSize
        )}
        animate={{ 
          textShadow: [
            `0 0 3px rgba(${color === 'purple' ? '168, 85, 247' : color === 'cyan' ? '6, 182, 212' : '59, 130, 246'}, 0.3)`,
            `0 0 6px rgba(${color === 'purple' ? '168, 85, 247' : color === 'cyan' ? '6, 182, 212' : '59, 130, 246'}, 0.6)`,
            `0 0 3px rgba(${color === 'purple' ? '168, 85, 247' : color === 'cyan' ? '6, 182, 212' : '59, 130, 246'}, 0.3)`
          ]
        }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        {/* Glowing underline */}
        <motion.div 
          className={cn(
            "absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r",
            color === 'purple' ? 'from-purple-500/0 via-purple-500/70 to-purple-500/0' :
            color === 'cyan' ? 'from-cyan-500/0 via-cyan-500/70 to-cyan-500/0' :
            'from-blue-500/0 via-blue-500/70 to-blue-500/0'
          )}
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            width: ['70%', '100%', '70%']
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
          style={{ left: "50%", transform: "translateX(-50%)" }}
        />
        {label}
      </motion.div>
      
      {/* The Knob with cosmic effects */}
      <motion.div 
        className={cn(
          "relative rounded-full shadow-lg cursor-pointer overflow-hidden", 
          "border-2 shadow-inner", 
          colorSchemes[color].knob,
          sizeConfig[size].knobSize,
          disabled ? "cursor-not-allowed opacity-70" : "cursor-grab",
          isDragging && !disabled ? "cursor-grabbing shadow-xl" : ""
        )}
        whileHover={!disabled ? { 
          scale: 1.05, 
          boxShadow: color === 'purple' ? 
            "0 0 15px rgba(168, 85, 247, 0.5)" : 
            color === 'cyan' ? 
              "0 0 15px rgba(6, 182, 212, 0.5)" : 
              "0 0 15px rgba(59, 130, 246, 0.5)" 
        } : {}}
        whileTap={!disabled ? { scale: 1.0, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)" } : {}}
        onMouseDown={() => !disabled && setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={(e) => isDragging && handleDrag(e, {})}
        onTouchStart={() => !disabled && setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={(e) => isDragging && handleDrag(e, {})}
      >
        {/* Cosmic background with stars */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`knob-star-${label}-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 2 + 0.5}px`,
                height: `${Math.random() * 2 + 0.5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: 'blur(0.2px)',
                opacity: Math.random() * 0.7 + 0.3
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 2 + Math.random() * 2,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        {/* Nebula effect */}
        <motion.div 
          className={cn(
            "absolute inset-0 mix-blend-screen",
            color === 'purple' ? 'bg-gradient-to-br from-purple-900/10 via-indigo-800/5 to-purple-900/10' :
            color === 'cyan' ? 'bg-gradient-to-br from-cyan-900/10 via-blue-800/5 to-cyan-900/10' :
            'bg-gradient-to-br from-blue-900/10 via-indigo-800/5 to-blue-900/10'
          )}
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.05, 1] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut"
          }}
        />
        
        {/* Knob Track Background */}
        <div 
          className={cn(
            "absolute inset-1.5 rounded-full overflow-hidden",
            disabled ? "opacity-30" : "opacity-90"
          )}
        >
          {/* Main background gradient */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-b", 
            colorSchemes[color].track
          )} />
          
          {/* Digital grid lines with animation */}
          <motion.div 
            className="absolute inset-0 opacity-20" 
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            style={{
              backgroundImage: `
                radial-gradient(circle, ${color === 'purple' ? 'rgba(168, 85, 247, 0.3)' : 
                                           color === 'cyan' ? 'rgba(6, 182, 212, 0.3)' : 
                                           'rgba(59, 130, 246, 0.3)'} 1px, transparent 1px)
              `,
              backgroundSize: '6px 6px'
            }}
          />
          
          {/* Animated energy flow */}
          <motion.div 
            className={cn(
              "absolute inset-0",
              color === 'purple' ? 'bg-gradient-to-r from-purple-600/10 via-indigo-600/20 to-purple-600/10' :
              color === 'cyan' ? 'bg-gradient-to-r from-cyan-600/10 via-blue-600/20 to-cyan-600/10' :
              'bg-gradient-to-r from-blue-600/10 via-indigo-600/20 to-blue-600/10'
            )}
            animate={{
              opacity: [0.2, 0.4, 0.2],
              backgroundPosition: ['0% 0%', '100% 0%']
            }}
            transition={{
              opacity: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              backgroundPosition: { repeat: Infinity, duration: 10, ease: "linear" }
            }}
            style={{ backgroundSize: '200% 100%' }}
          />
          
          {/* Shine effect with animation */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        </div>
        
        {/* Active value indicator with enhanced effects */}
        {showValue && value > min && (
          <div 
            className="absolute inset-2.5 rounded-full overflow-hidden"
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${value > (max - min) / 2 + min ? '100%' : '0%'} 0%, ${
                value > (max - min) / 2 + min ? '100% 100%' : '0% 100%'
              }, 50% 50%)`
            }}
          >
            <motion.div 
              className={cn(
                "absolute inset-0",
                colorSchemes[color].active
              )}
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                boxShadow: [
                  `inset 0 0 5px ${color === 'purple' ? 'rgba(168, 85, 247, 0.5)' : 
                                    color === 'cyan' ? 'rgba(6, 182, 212, 0.5)' : 
                                    'rgba(59, 130, 246, 0.5)'}`,
                  `inset 0 0 10px ${color === 'purple' ? 'rgba(168, 85, 247, 0.8)' : 
                                     color === 'cyan' ? 'rgba(6, 182, 212, 0.8)' : 
                                     'rgba(59, 130, 246, 0.8)'}`,
                  `inset 0 0 5px ${color === 'purple' ? 'rgba(168, 85, 247, 0.5)' : 
                                    color === 'cyan' ? 'rgba(6, 182, 212, 0.5)' : 
                                    'rgba(59, 130, 246, 0.5)'}`
                ]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            
            {/* Particle effects within active area */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`knob-particle-${label}-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  background: color === 'purple' ? `rgba(168, 85, 247, ${Math.random() * 0.5 + 0.3})` :
                              color === 'cyan' ? `rgba(6, 182, 212, ${Math.random() * 0.5 + 0.3})` :
                              `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.3})`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  filter: 'blur(1px)'
                }}
                animate={{
                  y: [0, -10, 0],
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
          </div>
        )}
        
        {/* Pointer indicator with enhanced glow */}
        <motion.div 
          className={cn(
            "absolute rounded-sm z-10",
            sizeConfig[size].indicatorSize,
            sizeConfig[size].indicatorOffset
          )}
          style={{ 
            left: '50%',
            marginLeft: '-2px',
            transformOrigin: '50% calc(50vh - 50%)',
            transform: `rotate(${rotation}deg)` 
          }}
          animate={{ 
            boxShadow: [
              `0 0 3px ${color === 'purple' ? 'rgba(168, 85, 247, 0.6)' : 
                          color === 'cyan' ? 'rgba(6, 182, 212, 0.6)' : 
                          'rgba(59, 130, 246, 0.6)'}`,
              `0 0 5px ${color === 'purple' ? 'rgba(168, 85, 247, 0.9)' : 
                          color === 'cyan' ? 'rgba(6, 182, 212, 0.9)' : 
                          'rgba(59, 130, 246, 0.9)'}`,
              `0 0 3px ${color === 'purple' ? 'rgba(168, 85, 247, 0.6)' : 
                          color === 'cyan' ? 'rgba(6, 182, 212, 0.6)' : 
                          'rgba(59, 130, 246, 0.6)'}`
            ]
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <motion.div 
            className={cn(
              "absolute inset-0 bg-gradient-to-r",
              color === 'purple' ? 'from-purple-400 via-white to-purple-400' :
              color === 'cyan' ? 'from-cyan-400 via-white to-cyan-400' :
              'from-blue-400 via-white to-blue-400'
            )}
            animate={{ 
              opacity: [0.8, 1, 0.8],
              backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
            }}
            transition={{ 
              opacity: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
              backgroundPosition: { repeat: Infinity, duration: 3, ease: "linear" }
            }}
            style={{ backgroundSize: '200% 100%' }}
          />
        </motion.div>
        
        {/* Central icon with pulsing glow */}
        {icon && (
          <motion.div 
            className={cn(
              "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10",
              colorSchemes[color].text,
              sizeConfig[size].iconSize
            )}
            animate={{
              scale: [1, 1.15, 1],
              filter: [
                `drop-shadow(0 0 1px ${color === 'purple' ? 'rgba(168, 85, 247, 0.5)' : 
                                         color === 'cyan' ? 'rgba(6, 182, 212, 0.5)' : 
                                         'rgba(59, 130, 246, 0.5)'})`,
                `drop-shadow(0 0 3px ${color === 'purple' ? 'rgba(168, 85, 247, 0.8)' : 
                                         color === 'cyan' ? 'rgba(6, 182, 212, 0.8)' : 
                                         'rgba(59, 130, 246, 0.8)'})`,
                `drop-shadow(0 0 1px ${color === 'purple' ? 'rgba(168, 85, 247, 0.5)' : 
                                         color === 'cyan' ? 'rgba(6, 182, 212, 0.5)' : 
                                         'rgba(59, 130, 246, 0.5)'})`
              ]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            {icon}
          </motion.div>
        )}
        
        {/* Enhanced glow effect */}
        <motion.div 
          className={cn(
            "absolute -inset-4 rounded-full opacity-0 z-0",
            color === 'purple' ? 'bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0' :
            color === 'cyan' ? 'bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0' :
            'bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0',
            disabled ? "opacity-0" : ""
          )}
          animate={!disabled ? { 
            opacity: isDragging ? [0.4, 0.7, 0.4] : [0.1, 0.3, 0.1],
            scale: [0.9, 1.05, 0.9]
          } : {}}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
        
        {/* Scanner line effect */}
        {!disabled && (
          <motion.div
            className={cn(
              "absolute h-full w-[1px] z-20",
              color === 'purple' ? 'bg-gradient-to-b from-transparent via-purple-400 to-transparent' :
              color === 'cyan' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent' :
              'bg-gradient-to-b from-transparent via-blue-400 to-transparent'
            )}
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
        )}
        
        {/* Inner shadow */}
        <div className="absolute inset-0 rounded-full shadow-inner" />
      </motion.div>
      
      {/* Value Display - Hide value display to make it more compact */}
      {!['xs', 'sm'].includes(size) && showValue && (
        <motion.div 
          className={cn(
            "mt-2 px-2.5 py-1 rounded-md bg-black/40 border border-gray-800 backdrop-blur-sm",
            colorSchemes[color].text,
            sizeConfig[size].fontSize
          )}
          animate={{ 
            boxShadow: isDragging && !disabled ? [
              "0 0 5px rgba(0,0,0,0.2)", 
              `0 0 8px ${color === 'cyan' ? 'rgba(34,211,238,0.4)' : 'rgba(59,130,246,0.4)'}`, 
              "0 0 5px rgba(0,0,0,0.2)"
            ] : "none"
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span className="font-mono">{valueFormatter(value)}</span>
        </motion.div>
      )}
    </div>
  );
}