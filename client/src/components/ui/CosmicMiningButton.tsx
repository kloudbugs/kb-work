import React, { useState } from 'react';
import { useMining } from '@/contexts/MiningContext';
import { cn } from '@/lib/utils';
import { Power, ZapOff } from 'lucide-react';

interface CosmicMiningButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CosmicMiningButton({ className, size = 'md' }: CosmicMiningButtonProps) {
  const { miningEnabled, toggleMiningState, isMiningToggleLoading } = useMining();
  const [isHovering, setIsHovering] = useState(false);

  // Determine size classes
  const buttonSizeClass = {
    sm: 'h-9 text-sm px-3',
    md: 'h-11 text-base px-5',
    lg: 'h-14 text-lg px-8'
  }[size];

  // Icon size based on button size
  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  }[size];

  return (
    <button
      onClick={toggleMiningState}
      disabled={isMiningToggleLoading}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "relative overflow-hidden rounded-lg font-medium transition-all duration-300",
        buttonSizeClass,
        miningEnabled
          ? "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700"
          : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600",
        isMiningToggleLoading && "opacity-70 cursor-not-allowed",
        className
      )}
    >
      {/* Background effects */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          "absolute w-full h-full",
          miningEnabled 
            ? "bg-gradient-to-r from-red-600/20 to-rose-700/20"
            : "bg-gradient-to-r from-emerald-600/20 to-cyan-600/20"
        )}></div>
        
        {isHovering && (
          <>
            <div className="absolute top-0 left-0 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: "200ms" }}></div>
          </>
        )}
        
        {/* Particle effects */}
        {miningEnabled && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i}
                className="absolute bg-white/20 rounded-full w-1 h-1 animate-ping-slow"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${1.5 + Math.random() * 2}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="relative flex items-center justify-center space-x-2">
        {miningEnabled ? (
          <>
            <ZapOff size={iconSize} className="mr-2" />
            <span>Stop Mining</span>
          </>
        ) : (
          <>
            <Power size={iconSize} className="mr-2" />
            <span>Start Mining</span>
          </>
        )}
      </div>
      
      {/* Bottom glow */}
      <div className={cn(
        "absolute bottom-0 left-0 h-[2px] w-full",
        miningEnabled 
          ? "bg-gradient-to-r from-transparent via-rose-400 to-transparent"
          : "bg-gradient-to-r from-transparent via-cyan-300 to-transparent", 
        "opacity-70"
      )}></div>
    </button>
  );
}

export default CosmicMiningButton;