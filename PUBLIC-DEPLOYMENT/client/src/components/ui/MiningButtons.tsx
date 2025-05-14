import React from 'react';
import { Button } from '@/components/ui/button';
import { useMining } from '@/contexts/MiningContext';
import { cn } from '@/lib/utils';
import { Play, Square, Loader2 } from 'lucide-react';

interface MiningButtonsProps {
  className?: string;
  variant?: 'default' | 'outline' | 'large';
  showStatus?: boolean;
}

export function MiningButtons({ 
  className, 
  variant = 'default',
  showStatus = true 
}: MiningButtonsProps) {
  const { miningEnabled, toggleMiningState, isMiningToggleLoading } = useMining();

  const handleToggle = () => {
    if (!isMiningToggleLoading) {
      toggleMiningState();
    }
  };

  // Different styling options
  const isLarge = variant === 'large';
  const isOutline = variant === 'outline';
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {showStatus && (
        <div className="mb-2 flex items-center">
          <div 
            className={cn(
              "w-3 h-3 rounded-full mr-2", 
              miningEnabled ? "bg-green-500 animate-pulse" : "bg-red-500"
            )} 
          />
          <span className={cn(
            "text-sm font-medium",
            isLarge ? "text-base" : "text-sm"
          )}>
            Mining {miningEnabled ? "Active" : "Stopped"}
          </span>
        </div>
      )}
      
      <div className="flex space-x-2">
        {miningEnabled ? (
          <Button
            variant={isOutline ? "outline" : "destructive"}
            size={isLarge ? "lg" : "default"}
            className={cn(
              isLarge && "px-8 py-6 text-lg",
              "flex items-center"
            )}
            onClick={handleToggle}
            disabled={isMiningToggleLoading}
          >
            {isMiningToggleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Square className={cn("mr-2", isLarge ? "h-5 w-5" : "h-4 w-4")} />
            )}
            Stop Mining
          </Button>
        ) : (
          <Button
            variant={isOutline ? "outline" : "default"}
            size={isLarge ? "lg" : "default"}
            className={cn(
              isLarge && "px-8 py-6 text-lg",
              "flex items-center"
            )}
            onClick={handleToggle}
            disabled={isMiningToggleLoading}
          >
            {isMiningToggleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className={cn("mr-2", isLarge ? "h-5 w-5" : "h-4 w-4")} />
            )}
            Start Mining
          </Button>
        )}
      </div>
    </div>
  );
}

export default MiningButtons;