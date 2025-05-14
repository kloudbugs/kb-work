import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Info, ArrowUpRight, Calendar, Shield, ChevronsUp } from 'lucide-react';
import { formatBtc } from '@/lib/utils';

interface FeeBoostNotificationProps {
  className?: string;
  onDismiss?: () => void;
}

export function FeeBoostNotification({ 
  className = '', 
  onDismiss 
}: FeeBoostNotificationProps) {
  const [dismissed, setDismissed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Get the fee and boost data for the current user
  const { data: feeData, isLoading } = useQuery({
    queryKey: ['/api/user/fee-boost-info'],
    refetchOnWindowFocus: false,
  });
  
  // Load dismissed state from localStorage on mount
  useEffect(() => {
    const isDismissed = localStorage.getItem('feeBoostNotificationDismissed');
    if (isDismissed === 'true') {
      setDismissed(true);
    }
  }, []);
  
  // Handle dismiss action
  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('feeBoostNotificationDismissed', 'true');
    if (onDismiss) {
      onDismiss();
    }
  };
  
  // Reset dismissed state weekly
  useEffect(() => {
    // Check if it's been more than a week since the last reset
    const lastReset = localStorage.getItem('feeBoostNotificationLastReset');
    const now = new Date().getTime();
    
    if (!lastReset || now - parseInt(lastReset) > 7 * 24 * 60 * 60 * 1000) {
      // It's been more than a week, reset the dismissed state
      localStorage.setItem('feeBoostNotificationDismissed', 'false');
      localStorage.setItem('feeBoostNotificationLastReset', now.toString());
      setDismissed(false);
    }
  }, []);
  
  // If dismissed or loading, don't render
  if (dismissed || isLoading) {
    return null;
  }
  
  // Default values if data is not available
  const {
    currentFeePercent = 1.0,
    weeklyBoostPercent = 5.0, // 5% boost
    totalContributedSats = 0,
    nextBoostDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalContributors = 0,
    currentBoostActive = false,
    daysUntilNextBoost = 7,
    feeUsedForCause = "Civil rights movement support",
    boostMultiplier = 1.05
  } = feeData || {};
  
  // Calculate days until next boost
  const daysLeft = Math.max(0, daysUntilNextBoost);
  const boostProgress = ((7 - daysLeft) / 7) * 100;
  
  return (
    <Card className={`border border-primary/20 bg-secondary/10 overflow-hidden shadow-md relative ${className}`}>
      {/* Boost indicator */}
      {currentBoostActive && (
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
          <div className="bg-primary text-primary-foreground text-xs font-bold tracking-wider px-5 py-1 rotate-45 transform origin-bottom-right translate-y-5 shadow-sm">
            BOOSTED
          </div>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Mining Fee &amp; Weekly Boost
          </CardTitle>
          <Badge variant={currentBoostActive ? "default" : "outline"} className="ml-2">
            {currentBoostActive ? (
              <><ChevronsUp className="h-3 w-3 mr-1" /> Active Boost</>
            ) : (
              <><Calendar className="h-3 w-3 mr-1" /> Coming Soon</>
            )}
          </Badge>
        </div>
        <CardDescription>
          A small fee supports our civil rights initiatives with weekly mining boosts in return.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        {/* Main info */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-muted/50 p-3 rounded-md">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Current Fee</span>
              <span className="text-lg font-bold">{currentFeePercent}%</span>
            </div>
            <div className="flex items-center text-primary">
              <ArrowUpRight className="h-4 w-4 mr-1" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Weekly Boost</span>
              <span className="text-lg font-bold text-primary">+{weeklyBoostPercent}%</span>
            </div>
          </div>
          
          {/* Boost countdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Next boost in</span>
              <span className="text-sm font-medium">{daysLeft} days</span>
            </div>
            <Progress value={boostProgress} className="h-2" />
          </div>
          
          {/* Expanded details */}
          {showDetails && (
            <div className="space-y-3 bg-muted/30 p-3 rounded-md mt-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Total contributed</p>
                  <p className="font-medium">{formatBtc(totalContributedSats)} BTC</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contributors</p>
                  <p className="font-medium">{totalContributors.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Funds used for</p>
                <p className="font-medium">{feeUsedForCause}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Current mining multiplier</p>
                <p className="font-medium text-primary">×{boostMultiplier.toFixed(2)}</p>
              </div>
              <div className="pt-1">
                <p className="text-xs text-muted-foreground">
                  Every week you receive a {weeklyBoostPercent}% boost to your mining rewards
                  as a thank you for contributing to our cause through the small {currentFeePercent}% fee.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
        >
          <Info className="h-4 w-4 mr-2" />
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleDismiss}
        >
          Dismiss
        </Button>
      </CardFooter>
    </Card>
  );
}