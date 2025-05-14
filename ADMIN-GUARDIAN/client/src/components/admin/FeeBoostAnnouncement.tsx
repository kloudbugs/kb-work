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
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronsUp, 
  Zap, 
  Shield, 
  Send,
  PercentIcon,
  CalendarIcon
} from 'lucide-react';

/**
 * This component allows admins to send announcements about the fee and boost system.
 * It provides a template for quickly sending messages about how user fees contribute
 * to the civil rights cause and the mining boost they receive in return.
 */
export function FeeBoostAnnouncement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for the announcement
  const [feePercent, setFeePercent] = useState(1.0);
  const [boostPercent, setBoostPercent] = useState(5.0);
  const [causeName, setCauseName] = useState('civil rights movement');
  const [includeWeeklySchedule, setIncludeWeeklySchedule] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  // Mutation to send the announcement
  const sendAnnouncement = useMutation({
    mutationFn: async (data: any) => {
      return axios.post('/api/admin/broadcasts', data);
    },
    onSuccess: () => {
      toast({
        title: "Announcement Sent",
        description: "Fee and boost information has been sent to all users.",
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
    let content = `We want to inform you about our platform's fee structure and the benefits you receive.\n\n`;
    
    content += `A small ${feePercent}% fee is applied to mining transactions. This fee directly supports our ${causeName} initiatives, helping to create real-world positive impact.\n\n`;
    
    content += `In return for your contribution, you receive a ${boostPercent}% boost to your mining rewards`;
    
    if (includeWeeklySchedule) {
      content += ` each week. The boost is automatically applied every Monday at 00:00 UTC and remains active for the entire week.`;
    } else {
      content += `.`;
    }
    
    content += `\n\nThank you for being part of our community and supporting important social causes through your mining activities.`;
    
    return content;
  };
  
  // Handle sending the announcement
  const handleSendAnnouncement = () => {
    setIsSending(true);
    
    const announcementData = {
      type: 'announcement',
      title: `Mining Fee and ${boostPercent}% Weekly Boost Information`,
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
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Fee &amp; Boost Announcement
        </CardTitle>
        <CardDescription>
          Inform users about transaction fees supporting the civil rights movement and their weekly mining boost.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="fee-percent" className="flex items-center">
              <PercentIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              Transaction Fee Percentage
            </Label>
            <span className="text-sm font-medium">{feePercent}%</span>
          </div>
          <Slider
            id="fee-percent"
            min={0.1}
            max={5}
            step={0.1}
            value={[feePercent]}
            onValueChange={(value) => setFeePercent(value[0])}
          />
          <p className="text-xs text-muted-foreground mt-1">
            The percentage of each transaction that supports the civil rights movement.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="boost-percent" className="flex items-center">
              <ChevronsUp className="h-4 w-4 mr-2 text-muted-foreground" />
              Mining Boost Percentage
            </Label>
            <span className="text-sm font-medium">{boostPercent}%</span>
          </div>
          <Slider
            id="boost-percent"
            min={1}
            max={15}
            step={0.5}
            value={[boostPercent]}
            onValueChange={(value) => setBoostPercent(value[0])}
          />
          <p className="text-xs text-muted-foreground mt-1">
            The percentage boost users receive on their mining rewards.
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
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="schedule-switch"
            checked={includeWeeklySchedule}
            onCheckedChange={setIncludeWeeklySchedule}
          />
          <Label htmlFor="schedule-switch" className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            Include Weekly Schedule Details
          </Label>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg mt-2">
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
          {isSending ? "Sending Announcement..." : "Send Fee & Boost Announcement"}
        </Button>
      </CardFooter>
    </Card>
  );
}