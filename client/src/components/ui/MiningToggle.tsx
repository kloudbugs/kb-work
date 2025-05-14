import React from 'react';
import { Switch } from '@/components/ui/switch';
import { useMining } from '@/contexts/MiningContext';
import { cn } from '@/lib/utils';

interface MiningToggleProps {
  label?: boolean;
  className?: string;
}

export function MiningToggle({ label = true, className }: MiningToggleProps) {
  const { miningEnabled, toggleMiningState } = useMining();

  return (
    <div className={cn("flex items-center", className)}>
      {label && (
        <span className="text-sm font-medium mr-3">Mining Status:</span>
      )}
      <Switch
        checked={miningEnabled}
        onCheckedChange={toggleMiningState}
        className={cn(
          miningEnabled 
            ? "bg-secondary" 
            : "bg-gray-300 dark:bg-gray-600"
        )}
      />
    </div>
  );
}

export default MiningToggle;
