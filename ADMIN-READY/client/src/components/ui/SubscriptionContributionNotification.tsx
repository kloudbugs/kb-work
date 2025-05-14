import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Heart, 
  ExternalLink
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface SubscriptionContributionNotificationProps {
  className?: string;
  onLearnMore?: () => void;
  onDismiss?: () => void;
}

export function SubscriptionContributionNotification({ 
  className = '',
  onLearnMore,
  onDismiss
}: SubscriptionContributionNotificationProps) {
  // In a real app, these would come from API data
  const subscriptionData = {
    contributionPercent: 0.5, // 0.5% instead of higher percentage
    totalContributorsCount: 142,
    peopleHelpedCount: 37,
    communitiesSupportedCount: 5,
    nextUpdateDate: '2025-05-01',
    causeName: 'civil rights movement'
  };
  
  return (
    <Card className={`w-full overflow-hidden shadow-md ${className}`}>
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          <CardTitle className="text-lg">Your Subscription Supports a Cause</CardTitle>
        </div>
        <CardDescription>
          A small portion of your subscription helps fund important social initiatives
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Contribution from subscription</span>
            <span className="font-medium">{subscriptionData.contributionPercent}%</span>
          </div>
          <Progress value={subscriptionData.contributionPercent * 20} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {subscriptionData.contributionPercent}% of your subscription fee supports the {subscriptionData.causeName}
          </p>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Contributors</p>
            <p className="text-lg font-semibold">{subscriptionData.totalContributorsCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">People Helped</p>
            <p className="text-lg font-semibold">{subscriptionData.peopleHelpedCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Communities</p>
            <p className="text-lg font-semibold">{subscriptionData.communitiesSupportedCount}</p>
          </div>
        </div>
        
        <div className="pt-2 flex justify-end">
          <Button 
            variant="link" 
            size="sm" 
            className="text-xs p-0 h-auto"
            onClick={onLearnMore}
          >
            Learn more about our social impact
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}