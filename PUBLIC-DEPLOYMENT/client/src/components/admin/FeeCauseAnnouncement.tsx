import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Shield,
  Send,
  PercentIcon,
  InfoIcon
} from 'lucide-react';

/**
 * This component allows admins to send announcements about the transaction fee system
 * and how it contributes to the civil rights cause.
 */
export function FeeCauseAnnouncement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for the announcement
  const [feePercent, setFeePercent] = useState(1.0);
  const [causeName, setCauseName] = useState('civil rights movement');
  const [causeDescription, setCauseDescription] = useState('');
  const [includeImpactStats, setIncludeImpactStats] = useState(false);
  const [peopleHelped, setPeopleHelped] = useState(0);
  const [communitiesSupported, setCommunitiesSupported] = useState(0);
  const [isSending, setIsSending] = useState(false);
  
  // Mutation to send the announcement
  const sendAnnouncement = useMutation({
    mutationFn: async (data: any) => {
      return axios.post('/api/admin/broadcasts', data);
    },
    onSuccess: () => {
      toast({
        title: "Announcement Sent",
        description: "Fee contribution information has been sent to all users.",
        duration: 3000,
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/network/messages'] });
      
      setIsSending(false);
    },
    onError: () => {
      toast({
        title: "Error Sending Announcement",
        description: "There was a problem sending the announcement.",
        variant: "destructive",
        duration: 3000,
      });
      
      setIsSending(false);
    }
  });
  
  // Generate the announcement content
  const generateAnnouncementContent = () => {
    let content = `We want to inform you about how your subscription and mining activity are making a difference.\n\n`;
    
    content += `As part of your platform subscription, a portion of your membership fee is allocated to our ${causeName} initiatives. Additionally, a small ${feePercent}% fee from mining transactions further supports these important causes.\n\n`;
    
    if (causeDescription) {
      content += `${causeDescription}\n\n`;
    }
    
    if (includeImpactStats && (peopleHelped > 0 || communitiesSupported > 0)) {
      content += `Thanks to your subscriptions and mining contributions, we've been able to:\n`;
      
      if (peopleHelped > 0) {
        content += `- Help ${peopleHelped.toLocaleString()} people\n`;
      }
      
      if (communitiesSupported > 0) {
        content += `- Support ${communitiesSupported.toLocaleString()} communities\n`;
      }
      
      content += `\n`;
    }
    
    content += `Thank you for being a valued member of our platform and supporting important social causes through both your subscription and mining activities.`;
    
    return content;
  };
  
  // Handle sending the announcement
  const handleSendAnnouncement = () => {
    setIsSending(true);
    
    const announcementData = {
      type: 'announcement',
      title: `How Your Mining Supports the ${causeName}`,
      content: generateAnnouncementContent(),
      urgency: 'medium',
      duration: '604800', // 7 days in seconds
    };
    
    sendAnnouncement.mutate(announcementData);
  };
  
  return (
    <Card className="w-full border-primary/20 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          Subscription Contribution Announcement
        </CardTitle>
        <CardDescription>
          Inform users about how their subscription fees are supporting the civil rights movement.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="fee-percent" className="flex items-center">
              <PercentIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              Subscription Fee Percentage
            </Label>
            <span className="text-sm font-medium">{feePercent}%</span>
          </div>
          <Slider
            id="fee-percent"
            min={0.1}
            max={1.5}
            step={0.1}
            value={[feePercent]}
            onValueChange={(value) => setFeePercent(value[0])}
          />
          <p className="text-xs text-muted-foreground mt-1">
            The percentage of subscription fees that supports the civil rights movement.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cause-name" className="flex items-center">
            <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
            Cause Name
          </Label>
          <Input
            id="cause-name"
            value={causeName}
            onChange={(e) => setCauseName(e.target.value)}
            placeholder="e.g., civil rights movement"
          />
          <p className="text-xs text-muted-foreground mt-1">
            The name of the cause that the fees are supporting.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cause-description" className="flex items-center">
            <InfoIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            Cause Description (Optional)
          </Label>
          <Textarea
            id="cause-description"
            value={causeDescription}
            onChange={(e) => setCauseDescription(e.target.value)}
            placeholder="Provide more details about how the funds are being used..."
            rows={3}
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="impact-switch"
            checked={includeImpactStats}
            onCheckedChange={setIncludeImpactStats}
          />
          <Label htmlFor="impact-switch" className="flex items-center">
            Include Impact Statistics
          </Label>
        </div>
        
        {includeImpactStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="people-helped">People Helped</Label>
              <Input
                id="people-helped"
                type="number"
                min="0"
                value={peopleHelped}
                onChange={(e) => setPeopleHelped(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="communities-supported">Communities Supported</Label>
              <Input
                id="communities-supported"
                type="number"
                min="0"
                value={communitiesSupported}
                onChange={(e) => setCommunitiesSupported(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        )}
        
        <div className="bg-muted/30 p-4 rounded-lg mt-4">
          <h4 className="text-sm font-medium mb-2">Announcement Preview:</h4>
          <div className="text-sm whitespace-pre-line">
            {generateAnnouncementContent()}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSendAnnouncement}
          disabled={isSending}
        >
          <Send className="h-4 w-4 mr-2" />
          {isSending ? "Sending Announcement..." : "Send Fee Contribution Announcement"}
        </Button>
      </CardFooter>
    </Card>
  );
}