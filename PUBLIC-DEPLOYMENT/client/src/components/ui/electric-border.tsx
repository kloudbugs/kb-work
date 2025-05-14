import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ElectricBorderProps {
  children: React.ReactNode;
  className?: string;
  cornerSize?: 'sm' | 'md' | 'lg';
  cornerAccentColor?: string;
  edgeGlowColor?: string;
  noiseBg?: boolean;
  centerGlow?: boolean;
  pulseGlow?: boolean;
}

export function ElectricBorder({
  children,
  className,
  cornerSize = 'md',
  cornerAccentColor = 'border-purple-500',
  edgeGlowColor = 'rgba(139, 92, 246, 0.5)'
}: ElectricBorderProps) {
  // Determine corner size based on prop
  const cornerSizeValue = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  }[cornerSize];
  
  return (
    <div className={cn("relative", className)}>
      {/* Top-left corner */}
      <div 
        className={`absolute top-0 left-0 ${cornerAccentColor}`}
        style={{
          width: '1px',
          height: '50%',
          boxShadow: `0 0 8px ${edgeGlowColor}`
        }}
      />
      <div 
        className={`absolute top-0 left-0 ${cornerAccentColor}`}
        style={{
          width: '50%',
          height: '1px',
          boxShadow: `0 0 8px ${edgeGlowColor}`
        }}
      />
      <motion.div 
        className={`absolute top-0 left-0 ${cornerSizeValue} border-t border-l ${cornerAccentColor}`}
        animate={{
          boxShadow: [
            `0 0 4px ${edgeGlowColor}`,
            `0 0 8px ${edgeGlowColor}`,
            `0 0 4px ${edgeGlowColor}`
          ]
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }}
      />
      
      {/* Top-right corner */}
      <div 
        className={`absolute top-0 right-0 ${cornerAccentColor}`}
        style={{
          width: '1px',
          height: '50%',
          boxShadow: `0 0 8px ${edgeGlowColor}`
        }}
      />
      <div 
        className={`absolute top-0 right-0 ${cornerAccentColor}`}
        style={{
          width: '50%',
          height: '1px',
          boxShadow: `0 0 8px ${edgeGlowColor}`
        }}
      />
      <motion.div 
        className={`absolute top-0 right-0 ${cornerSizeValue} border-t border-r ${cornerAccentColor}`}
        animate={{
          boxShadow: [
            `0 0 4px ${edgeGlowColor}`,
            `0 0 8px ${edgeGlowColor}`,
            `0 0 4px ${edgeGlowColor}`
          ]
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      {/* Bottom-left corner */}
      <div 
        className={`absolute bottom-0 left-0 ${cornerAccentColor}`}
        style={{
          width: '1px',
          height: '50%',
          boxShadow: `0 0 8px ${edgeGlowColor}`
        }}
      />
      <div 
        className={`absolute bottom-0 left-0 ${cornerAccentColor}`}
        style={{
          width: '50%',
          height: '1px',
          boxShadow: `0 0 8px ${edgeGlowColor}`
        }}
      />
      <motion.div 
        className={`absolute bottom-0 left-0 ${cornerSizeValue} border-b border-l ${cornerAccentColor}`}
        animate={{
          boxShadow: [
            `0 0 4px ${edgeGlowColor}`,
            `0 0 8px ${edgeGlowColor}`,
            `0 0 4px ${edgeGlowColor}`
          ]
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Bottom-right corner */}
      <div 
        className={`absolute bottom-0 right-0 ${cornerAccentColor}`}
        style={{
          width: '1px',
          height: '50%',
          boxShadow: `0 0 8px ${edgeGlowColor}`
        }}
      />
      <div 
        className={`absolute bottom-0 right-0 ${cornerAccentColor}`}
        style={{
          width: '50%',
          height: '1px',
          boxShadow: `0 0 8px ${edgeGlowColor}`
        }}
      />
      <motion.div 
        className={`absolute bottom-0 right-0 ${cornerSizeValue} border-b border-r ${cornerAccentColor}`}
        animate={{
          boxShadow: [
            `0 0 4px ${edgeGlowColor}`,
            `0 0 8px ${edgeGlowColor}`,
            `0 0 4px ${edgeGlowColor}`
          ]
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
      
      {/* The content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default ElectricBorder;