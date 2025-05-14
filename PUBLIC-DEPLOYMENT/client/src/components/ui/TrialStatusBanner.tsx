import React from 'react';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';

interface TrialStatusBannerProps {
  daysLeft?: number;
  isExpired?: boolean;
  accumulatedBalance?: string;
  onUpgrade?: () => void;
  className?: string;
}

export function TrialStatusBanner({
  daysLeft = 7,
  isExpired = false,
  accumulatedBalance = "0.000",
  onUpgrade,
  className = ''
}: TrialStatusBannerProps) {
  return (
    <Alert 
      variant={isExpired ? "destructive" : "default"}
      className={`${className} relative overflow-hidden border-l-4 ${isExpired ? 'border-l-destructive' : 'border-l-primary'}`}
    >
      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-primary/10"></div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            {isExpired ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <Clock className="h-4 w-4 text-primary" />
            )}
            <AlertTitle className="text-base font-medium">
              {isExpired ? 'Free Trial Expired' : 'Free Trial Period'}
            </AlertTitle>
            {!isExpired && (
              <Badge variant="outline" className="ml-2 bg-primary/10">
                {daysLeft} days left
              </Badge>
            )}
          </div>
          <AlertDescription className="mt-2 text-sm">
            {isExpired ? (
              <>
                Your free trial has ended. Subscribe now to continue mining and to access 
                your accumulated balance of <strong>{accumulatedBalance} BTC</strong>.
              </>
            ) : (
              <>
                You have been approved for the free trial period. Mining is active, but withdrawals 
                are locked until you subscribe. Current balance: <strong>{accumulatedBalance} BTC</strong>
              </>
            )}
          </AlertDescription>
        </div>
        
        <Button 
          className="mt-3 sm:mt-0 whitespace-nowrap"
          variant={isExpired ? "destructive" : "default"}
          onClick={onUpgrade}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          {isExpired ? 'Subscribe Now' : 'Upgrade Account'}
        </Button>
      </div>
      
      {!isExpired && (
        <div className="mt-2 text-xs text-muted-foreground">
          <Link href="/subscription-plans" className="underline hover:text-primary transition-colors">
            View subscription options
          </Link> to access your earnings and unlock premium features.
        </div>
      )}
    </Alert>
  );
}