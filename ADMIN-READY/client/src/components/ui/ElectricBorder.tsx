import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ElectricBorderProps {
  children: React.ReactNode;
  className?: string;
  cornerSize?: 'sm' | 'md' | 'lg';
  cornerAccentColor?: string;
  edgeGlowColor?: string;
  pulseEffect?: boolean;
  noiseBg?: boolean;
  animate?: boolean;
  centerGlow?: boolean;
}

export function ElectricBorder({
  children,
  className,
  cornerSize = 'md',
  cornerAccentColor = 'border-cyan-500',
  edgeGlowColor = 'rgba(6, 182, 212, 0.5)',
  pulseEffect = true,
  noiseBg = false,
  animate = true,
  centerGlow = false
}: ElectricBorderProps) {
  // Determine corner size
  const cornerSizeValue = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }[cornerSize];
  
  // Corner positions
  const corners = [
    'top-0 left-0 border-t-2 border-l-2 rounded-tl-md',
    'top-0 right-0 border-t-2 border-r-2 rounded-tr-md',
    'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-md',
    'bottom-0 right-0 border-b-2 border-r-2 rounded-br-md'
  ];

  return (
    <div className={cn("relative z-10", className)}>
      {/* Digital Grid Background */}
      {noiseBg && (
        <div className="absolute inset-0 z-0 overflow-hidden rounded-md">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-black/90 to-blue-950/80 opacity-80"></div>
          
          <div 
            className="absolute inset-0 opacity-20" 
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              transformStyle: 'preserve-3d',
              transform: 'rotateX(80deg) translateZ(-100px)',
              perspective: '1000px'
            }}
          />
        </div>
      )}
      
      {/* Optional Center Glow */}
      {centerGlow && (
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.2) 0%, transparent 70%)'
          }}
          animate={animate ? {
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          } : undefined}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Glowing Border Effect */}
      <motion.div 
        className="absolute inset-0 rounded-md pointer-events-none z-0"
        style={{ boxShadow: `0 0 0 1px ${edgeGlowColor}` }}
        animate={animate && pulseEffect ? { 
          boxShadow: [
            `0 0 0 1px ${edgeGlowColor}, 0 0 0px ${edgeGlowColor}`, 
            `0 0 0 1px ${edgeGlowColor.replace('0.5', '0.8')}, 0 0 15px ${edgeGlowColor.replace('0.5', '0.5')}`, 
            `0 0 0 1px ${edgeGlowColor}, 0 0 0px ${edgeGlowColor}`
          ] 
        } : undefined}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut"
        }}
      />
      
      {/* Corner Accents */}
      {corners.map((position, i) => (
        <motion.div
          key={`corner-${i}`}
          className={cn(`absolute ${position} ${cornerSizeValue} ${cornerAccentColor} z-20`)}
          animate={animate ? {
            opacity: [0.7, 1, 0.7],
            boxShadow: [
              `inset 0 0 5px ${edgeGlowColor}`,
              `inset 0 0 10px ${edgeGlowColor.replace('0.5', '0.6')}`,
              `inset 0 0 5px ${edgeGlowColor}`
            ]
          } : undefined}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4
          }}
        />
      ))}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export function SpaceCard({
  children,
  className,
  title,
  icon: Icon,
  glowColor = 'cyan'
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.FC<{ className?: string }>;
  glowColor?: 'cyan' | 'blue' | 'purple' | 'teal' | 'amber'
}) {
  // Define color schemes based on the glow color
  const colorMappings = {
    cyan: {
      borderColor: 'border-cyan-500/30',
      glowShadow: 'shadow-cyan-500/30',
      textColor: 'text-cyan-300',
      iconColor: 'text-cyan-400',
      glowColorRgba: 'rgba(6, 182, 212, 0.5)',
      scanlineColor: 'bg-cyan-400/20',
      cornerAccent: 'border-cyan-500',
      gradientFrom: 'from-cyan-500',
      gradientTo: 'to-blue-600'
    },
    blue: {
      borderColor: 'border-blue-500/30',
      glowShadow: 'shadow-blue-500/20',
      textColor: 'text-blue-300',
      iconColor: 'text-blue-400',
      glowColorRgba: 'rgba(59, 130, 246, 0.5)',
      scanlineColor: 'bg-blue-400/20',
      cornerAccent: 'border-blue-500',
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-indigo-500'
    },
    purple: {
      borderColor: 'border-purple-500/30',
      glowShadow: 'shadow-purple-500/20',
      textColor: 'text-purple-300',
      iconColor: 'text-purple-400',
      glowColorRgba: 'rgba(168, 85, 247, 0.5)',
      scanlineColor: 'bg-purple-400/20',
      cornerAccent: 'border-purple-500',
      gradientFrom: 'from-purple-600',
      gradientTo: 'to-violet-500'
    },
    teal: {
      borderColor: 'border-teal-500/30',
      glowShadow: 'shadow-teal-500/20',
      textColor: 'text-teal-300',
      iconColor: 'text-teal-400',
      glowColorRgba: 'rgba(20, 184, 166, 0.5)',
      scanlineColor: 'bg-teal-400/20',
      cornerAccent: 'border-teal-500',
      gradientFrom: 'from-teal-500',
      gradientTo: 'to-emerald-500'
    },
    amber: {
      borderColor: 'border-amber-500/30',
      glowShadow: 'shadow-amber-500/20',
      textColor: 'text-amber-300',
      iconColor: 'text-amber-400',
      glowColorRgba: 'rgba(245, 158, 11, 0.5)',
      scanlineColor: 'bg-amber-400/20',
      cornerAccent: 'border-amber-500',
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-orange-400'
    }
  };
  
  const colors = colorMappings[glowColor];
  
  return (
    <ElectricBorder 
      className={className}
      cornerAccentColor={colors.cornerAccent}
      edgeGlowColor={colors.glowColorRgba}
      cornerSize="md"
      noiseBg={true}
      centerGlow={true}
    >
      <div className={`bg-black/70 backdrop-blur-lg rounded-md border ${colors.borderColor} p-4 ${colors.glowShadow} h-full relative`}>
        {/* 3D Holographic Effect */}
        <div className="absolute inset-0 rounded-md opacity-10 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
        
        {/* Holographic Scanline Effect */}
        <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
          <motion.div 
            className={`absolute inset-x-0 h-1 ${colors.scanlineColor}`} 
            animate={{ 
              top: ['-10%', '110%']
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5, 
              ease: "linear"
            }}
          />
        </div>
        
        {/* Glowing top border */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} rounded-t-md`}></div>
        
        {/* Title with icon */}
        {(title || Icon) && (
          <div className="flex items-center justify-between mb-3 border-b border-blue-800/20 pb-2 relative">
            <h3 className={`text-sm font-bold ${colors.textColor} flex items-center`}>
              {Icon && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="mr-2"
                >
                  <Icon className={`h-4 w-4 ${colors.iconColor}`} />
                </motion.div>
              )}
              <span className="relative">
                {title}
                <span className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-${glowColor}-500 to-transparent`}></span>
              </span>
            </h3>
            
            {/* Animated pulse indicator */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
                boxShadow: [`0 0 5px ${colors.glowColorRgba}`, `0 0 10px ${colors.glowColorRgba.replace('0.5', '0.8')}`, `0 0 5px ${colors.glowColorRgba}`]
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
              className={`w-2 h-2 rounded-full bg-${glowColor}-400`}
            />
          </div>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </ElectricBorder>
  );
}