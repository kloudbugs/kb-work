import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface SpaceCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  glowColor?: 'blue' | 'purple' | 'teal' | 'amber' | 'cyan';
  hasHoverEffect?: boolean;
  hasFloatingAnimation?: boolean;
  animationDelay?: number;
  hasStars?: boolean;
  hasCosmicBorder?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export const SpaceCard = ({
  children,
  className,
  title,
  glowColor = 'blue',
  hasHoverEffect = true,
  hasFloatingAnimation = false,
  animationDelay = 0,
  hasStars = false,
  hasCosmicBorder = false,
  intensity = 'medium'
}: SpaceCardProps) => {
  // Define glow styles based on the color and intensity
  const getGlowStyle = () => {
    const intensityMap = {
      low: {
        blue: 'shadow-blue-400/20 border-blue-500/30 hover:border-blue-500/40',
        purple: 'shadow-purple-400/20 border-purple-500/30 hover:border-purple-500/40',
        teal: 'shadow-teal-400/20 border-teal-500/30 hover:border-teal-500/40',
        amber: 'shadow-amber-400/20 border-amber-500/30 hover:border-amber-500/40',
        cyan: 'shadow-cyan-400/20 border-cyan-500/30 hover:border-cyan-500/40',
      },
      medium: {
        blue: 'shadow-blue-400/30 border-blue-500/40 hover:border-blue-500/60',
        purple: 'shadow-purple-400/30 border-purple-500/40 hover:border-purple-500/60',
        teal: 'shadow-teal-400/30 border-teal-500/40 hover:border-teal-500/60',
        amber: 'shadow-amber-400/30 border-amber-500/40 hover:border-amber-500/60',
        cyan: 'shadow-cyan-400/30 border-cyan-500/40 hover:border-cyan-500/60',
      },
      high: {
        blue: 'shadow-blue-400/50 border-blue-500/50 hover:border-blue-500/80',
        purple: 'shadow-purple-400/50 border-purple-500/50 hover:border-purple-500/80',
        teal: 'shadow-teal-400/50 border-teal-500/50 hover:border-teal-500/80',
        amber: 'shadow-amber-400/50 border-amber-500/50 hover:border-amber-500/80',
        cyan: 'shadow-cyan-400/50 border-cyan-500/50 hover:border-cyan-500/80',
      }
    };
    
    return intensityMap[intensity][glowColor];
  };

  // Apply floating animation if enabled
  const floatAnimation = hasFloatingAnimation ? {
    y: [0, -8, 0],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
      delay: animationDelay
    }
  } : {};
  
  // Determine card background based on effects
  const cardBg = hasCosmicBorder 
    ? 'bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90'
    : 'backdrop-blur-md bg-gray-900/70';

  return (
    <motion.div
      className={cn(
        cardBg,
        'border rounded-lg overflow-hidden relative',
        getGlowStyle(),
        hasHoverEffect ? 'transition-all duration-300 hover:shadow-lg' : '',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        ...floatAnimation
      }}
      whileHover={hasHoverEffect ? { 
        scale: 1.01,
        boxShadow: `0 0 20px var(--cosmic-glow-${glowColor === 'blue' ? 'blue' : 
                                            glowColor === 'purple' ? 'purple' : 
                                            glowColor === 'teal' ? 'cyan' : 
                                            glowColor === 'cyan' ? 'cyan' : 'amber'})`
      } : {}}
    >
      {/* Cosmic border effect */}
      {hasCosmicBorder && (
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{ 
            boxShadow: [
              `inset 0 0 5px var(--cosmic-glow-${glowColor === 'blue' ? 'blue' : 
                                        glowColor === 'purple' ? 'purple' : 
                                        glowColor === 'teal' ? 'cyan' : 
                                        glowColor === 'cyan' ? 'cyan' : 'amber'})`,
              `inset 0 0 15px var(--cosmic-glow-${glowColor === 'blue' ? 'blue' : 
                                         glowColor === 'purple' ? 'purple' : 
                                         glowColor === 'teal' ? 'cyan' : 
                                         glowColor === 'cyan' ? 'cyan' : 'amber'})`,
              `inset 0 0 5px var(--cosmic-glow-${glowColor === 'blue' ? 'blue' : 
                                        glowColor === 'purple' ? 'purple' : 
                                        glowColor === 'teal' ? 'cyan' : 
                                        glowColor === 'cyan' ? 'cyan' : 'amber'})`
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      
      {/* Tiny star background effect */}
      {hasStars && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
        </div>
      )}
      
      {/* Title bar if title is provided */}
      {title && (
        <div className={`border-b px-4 py-3 bg-gradient-to-r ${
          glowColor === 'blue' ? 'from-blue-950/60 via-gray-900/60 to-gray-900/60 border-blue-500/20' : 
          glowColor === 'purple' ? 'from-purple-950/60 via-gray-900/60 to-gray-900/60 border-purple-500/20' : 
          glowColor === 'teal' ? 'from-teal-950/60 via-gray-900/60 to-gray-900/60 border-teal-500/20' : 
          glowColor === 'cyan' ? 'from-cyan-950/60 via-gray-900/60 to-gray-900/60 border-cyan-500/20' : 
          'from-amber-950/60 via-gray-900/60 to-gray-900/60 border-amber-500/20'
        }`}>
          <SpaceCardTitle glowColor={glowColor}>{title}</SpaceCardTitle>
        </div>
      )}
      
      {children}
    </motion.div>
  );
};

export const SpaceCardHeader = ({
  children,
  className,
  glowColor = 'blue'
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'teal' | 'amber' | 'cyan';
}) => {
  const gradientColors = {
    blue: 'from-blue-950/60 via-gray-900/60 to-gray-900/60',
    purple: 'from-purple-950/60 via-gray-900/60 to-gray-900/60',
    teal: 'from-teal-950/60 via-gray-900/60 to-gray-900/60',
    amber: 'from-amber-950/60 via-gray-900/60 to-gray-900/60',
    cyan: 'from-cyan-950/60 via-gray-900/60 to-gray-900/60',
  };

  return (
    <motion.div 
      className={cn(
        'border-b px-4 py-3 flex items-center justify-between bg-gradient-to-r',
        gradientColors[glowColor],
        glowColor === 'blue' ? 'border-blue-500/20' : 
        glowColor === 'purple' ? 'border-purple-500/20' : 
        glowColor === 'teal' ? 'border-teal-500/20' : 
        glowColor === 'cyan' ? 'border-cyan-500/20' : 
        'border-amber-500/20',
        className
      )}
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export const SpaceCardTitle = ({
  children,
  className,
  glowColor = 'blue'
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'teal' | 'amber' | 'cyan';
}) => {
  const gradientColors = {
    blue: 'from-blue-300 to-purple-300',
    purple: 'from-purple-300 to-blue-300',
    teal: 'from-teal-300 to-blue-300',
    amber: 'from-amber-300 to-orange-300',
    cyan: 'from-cyan-300 to-blue-300',
  };

  const glowTextClass = {
    blue: 'glow-text-blue',
    purple: 'glow-text-purple', 
    teal: 'glow-text-teal',
    amber: 'glow-text-amber',
    cyan: 'glow-text-blue',
  };

  return (
    <motion.h3 
      className={cn(
        'text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r',
        gradientColors[glowColor],
        glowTextClass[glowColor],
        className
      )}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {children}
    </motion.h3>
  );
};

export const SpaceCardContent = ({
  children,
  className,
  hasMeteors = false
}: {
  children: React.ReactNode;
  className?: string;
  hasMeteors?: boolean;
}) => {
  return (
    <div className={cn('p-4 relative', className)}>
      {/* Optional shooting stars effect */}
      {hasMeteors && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`meteor-${i}`}
              className="absolute w-[2px] h-[2px] bg-white"
              style={{
                top: `${Math.random() * 50}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)',
              }}
              initial={{ 
                opacity: 0, 
                x: 0, 
                y: 0,
                scale: 1,
              }}
              animate={{ 
                opacity: [0, 1, 0],
                x: ['0%', '100px'],
                y: ['0%', '100px'],
                scale: [1, 0.1],
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 2 + Math.random() * 5,
                repeat: Infinity,
                repeatDelay: Math.random() * 10 + 5
              }}
            />
          ))}
        </div>
      )}
      {children}
    </div>
  );
};

export const SpaceCardFooter = ({
  children,
  className,
  glowColor = 'blue'
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'teal' | 'amber' | 'cyan';
}) => {
  const gradientColors = {
    blue: 'from-gray-900/60 via-gray-900/60 to-blue-950/60',
    purple: 'from-gray-900/60 via-gray-900/60 to-purple-950/60',
    teal: 'from-gray-900/60 via-gray-900/60 to-teal-950/60',
    amber: 'from-gray-900/60 via-gray-900/60 to-amber-950/60',
    cyan: 'from-gray-900/60 via-gray-900/60 to-cyan-950/60',
  };

  return (
    <motion.div 
      className={cn(
        'border-t px-4 py-3 bg-gradient-to-r',
        gradientColors[glowColor],
        glowColor === 'blue' ? 'border-blue-500/20' : 
        glowColor === 'purple' ? 'border-purple-500/20' : 
        glowColor === 'teal' ? 'border-teal-500/20' : 
        glowColor === 'cyan' ? 'border-cyan-500/20' : 
        'border-amber-500/20',
        className
      )}
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export const SpaceValue = ({
  label,
  value,
  icon,
  valueColor = 'blue',
  className
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  valueColor?: 'blue' | 'purple' | 'teal' | 'amber' | 'green' | 'red';
  className?: string;
}) => {
  const colorStyles = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    teal: 'text-teal-400',
    amber: 'text-amber-400',
    green: 'text-green-400',
    red: 'text-red-400',
  };

  return (
    <div className={cn('flex flex-col space-y-1', className)}>
      <div className="text-xs text-gray-400 flex items-center">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </div>
      <div className={cn('text-lg font-semibold font-mono', colorStyles[valueColor])}>
        {value}
      </div>
    </div>
  );
};