import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Textarea 
} from '@/components/ui/textarea';
import { 
  Input 
} from '@/components/ui/input';
import { 
  Label 
} from '@/components/ui/label';
import { 
  Badge 
} from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BroadcastIcon, 
  Radio, 
  Megaphone, 
  Link, 
  MessageSquare, 
  Target, 
  Laugh, 
  Calendar, 
  Sparkles,
  Globe,
  Clock,
  Send,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface NetworkBroadcasterProps {
  className?: string;
}

// Message type options
const MESSAGE_TYPES = [
  { id: 'announcement', name: 'Announcement', icon: <Megaphone className="h-4 w-4" /> },
  { id: 'goal', name: 'Daily Goal', icon: <Target className="h-4 w-4" /> },
  { id: 'joke', name: 'Joke', icon: <Laugh className="h-4 w-4" /> },
  { id: 'link', name: 'Link or Resource', icon: <Link className="h-4 w-4" /> },
  { id: 'event', name: 'Upcoming Event', icon: <Calendar className="h-4 w-4" /> },
  { id: 'alert', name: 'System Alert', icon: <AlertTriangle className="h-4 w-4" /> },
  { id: 'info', name: 'Information', icon: <Info className="h-4 w-4" /> },
];

// Urgency levels
const URGENCY_LEVELS = [
  { id: 'low', name: 'Low', color: 'bg-blue-600' },
  { id: 'medium', name: 'Medium', color: 'bg-yellow-600' },
  { id: 'high', name: 'High', color: 'bg-orange-600' },
  { id: 'critical', name: 'Critical', color: 'bg-red-600' },
];

// Display durations
const DISPLAY_DURATIONS = [
  { id: '10', name: '10 seconds' },
  { id: '30', name: '30 seconds' },
  { id: '60', name: '1 minute' },
  { id: '300', name: '5 minutes' },
  { id: '900', name: '15 minutes' },
  { id: '1800', name: '30 minutes' },
  { id: '3600', name: '1 hour' },
  { id: '86400', name: '24 hours' },
  { id: 'permanent', name: 'Permanent (until dismissed)' },
];

// Recently sent messages (mock)
type BroadcastMessage = {
  id: string;
  type: string;
  title: string;
  content: string;
  urgency: string;
  link?: string;
  sentAt: Date;
  duration: string;
  active: boolean;
};

// Example joke templates
const JOKE_TEMPLATES = [
  "Why don't miners ever get lost? They always follow the hash marks!",
  "What do you call a cryptocurrency that sneezes? A-choo-in!",
  "Why did the Bitcoin miner go to therapy? He had too many unresolved blocks!",
  "What's a miner's favorite dance? The block chain!",
  "Why was the blockchain so cool? Because it had so many fans processing transactions!",
  "What did the Bitcoin say to the altcoin? 'This town ain't big enough for the both of us!'",
  "How does a miner say goodbye? 'Hash you later!'",
  "Why don't miners take vacations? They can't stop looking for blocks!",
  "What's a miner's favorite game? Minesweeper, of course!",
  "Why was the crypto wallet always calm? Because it was very secure!"
];

// Example goal templates
const GOAL_TEMPLATES = [
  "Today's goal: Let's collectively reach 1000 TH/s network hashrate!",
  "Challenge: Everyone add at least one new mining device today",
  "Goal of the day: Improve energy efficiency across all mining operations by 5%",
  "Today's mission: Help three new miners get started with their first rig",
  "Target: Increase your personal mining rewards by 10% through optimization",
  "Today's focus: Update all mining software to the latest versions",
  "Daily challenge: Try using a mining pool you haven't used before",
  "Community goal: Submit at least one improvement idea to the suggestion box",
  "Collective target: Let's reach 100 active users today!",
  "Special objective: Register your hardware wallet for more secure payments"
];

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export function NetworkBroadcaster({ className = '' }: NetworkBroadcasterProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Message state
  const [messageType, setMessageType] = useState('announcement');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messageLink, setMessageLink] = useState('');
  const [messageUrgency, setMessageUrgency] = useState('medium');
  const [displayDuration, setDisplayDuration] = useState('60');
  const [isSending, setIsSending] = useState(false);
  const [recentMessages, setRecentMessages] = useState<BroadcastMessage[]>([]);
  
  // Template generator state
  const [templateType, setTemplateType] = useState('joke');
  
  // Load previous messages from localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem('networkBroadcasterMessages');
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        // Convert string dates back to Date objects
        const messages = parsedMessages.map((msg: any) => ({
          ...msg,
          sentAt: new Date(msg.sentAt)
        }));
        setRecentMessages(messages);
      } catch (e) {
        console.error('Error parsing stored messages:', e);
      }
    }
  }, []);
  
  // Check for expired messages and remove them
  useEffect(() => {
    const interval = setInterval(() => {
      setRecentMessages(prevMessages => {
        const now = new Date();
        const updatedMessages = prevMessages.map(msg => {
          if (msg.duration === 'permanent' || !msg.active) return msg;
          
          const expirationTime = new Date(msg.sentAt);
          expirationTime.setSeconds(expirationTime.getSeconds() + parseInt(msg.duration));
          
          if (now > expirationTime) {
            return { ...msg, active: false };
          }
          return msg;
        });
        
        localStorage.setItem('networkBroadcasterMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Send the message to all users
  const broadcastMessage = () => {
    if (!messageTitle.trim() || !messageContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide both a title and content for your message.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsSending(true);
    
    // Create the message object
    const newMessage: BroadcastMessage = {
      id: generateId(),
      type: messageType,
      title: messageTitle,
      content: messageContent,
      urgency: messageUrgency,
      link: messageLink || undefined,
      sentAt: new Date(),
      duration: displayDuration,
      active: true
    };
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Update recent messages
      const updatedMessages = [newMessage, ...recentMessages].slice(0, 10); // Keep only 10 most recent
      setRecentMessages(updatedMessages);
      
      // Save to localStorage
      localStorage.setItem('networkBroadcasterMessages', JSON.stringify(updatedMessages));
      
      // Simulate broadcasting to all connected users
      // In a real app, this would send to a WebSocket or similar
      console.log('Broadcasting message to all users:', newMessage);
      
      // Reset form
      setMessageTitle('');
      setMessageContent('');
      setMessageLink('');
      setIsSending(false);
      
      // Show success toast
      toast({
        title: "Message Broadcasted",
        description: "Your message has been sent to all users in the network.",
        duration: 3000,
      });
      
      // Update UI by invalidating queries
      queryClient.invalidateQueries({ queryKey: ['/api/network/messages'] });
    }, 1500);
  };
  
  // Generate a template message
  const generateTemplate = () => {
    if (templateType === 'joke') {
      const randomJoke = JOKE_TEMPLATES[Math.floor(Math.random() * JOKE_TEMPLATES.length)];
      setMessageType('joke');
      setMessageTitle('Daily Mining Joke');
      setMessageContent(randomJoke);
      setMessageUrgency('low');
    } else if (templateType === 'goal') {
      const randomGoal = GOAL_TEMPLATES[Math.floor(Math.random() * GOAL_TEMPLATES.length)];
      setMessageType('goal');
      setMessageTitle('Today\'s Mining Goal');
      setMessageContent(randomGoal);
      setMessageUrgency('medium');
    }
  };
  
  // Toggle the active status of a message
  const toggleMessageActive = (id: string) => {
    setRecentMessages(prev => {
      const updated = prev.map(msg => 
        msg.id === id ? { ...msg, active: !msg.active } : msg
      );
      localStorage.setItem('networkBroadcasterMessages', JSON.stringify(updated));
      return updated;
    });
    
    // Invalidate queries to update UI
    queryClient.invalidateQueries({ queryKey: ['/api/network/messages'] });
  };
  
  // Calculate time ago for display
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    
    return `${Math.floor(seconds)} seconds ago`;
  };
  
  return (
    <Card className={`w-full bg-gradient-to-br from-gray-900/80 to-indigo-900/20 backdrop-blur-sm border border-indigo-800/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="h-6 w-6 text-indigo-400" />
          Network Broadcaster
        </CardTitle>
        <CardDescription>
          Send messages, announcements, jokes, or resources to all users across the network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Message composition */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <Label htmlFor="message-type">Message Type</Label>
                <Select value={messageType} onValueChange={setMessageType}>
                  <SelectTrigger id="message-type" className="bg-gray-800 border-gray-700 mt-1">
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {MESSAGE_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id} className="flex items-center">
                        <div className="flex items-center">
                          {type.icon}
                          <span className="ml-2">{type.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/2">
                <Label htmlFor="message-urgency">Urgency Level</Label>
                <Select value={messageUrgency} onValueChange={setMessageUrgency}>
                  <SelectTrigger id="message-urgency" className="bg-gray-800 border-gray-700 mt-1">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {URGENCY_LEVELS.map(level => (
                      <SelectItem key={level.id} value={level.id}>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${level.color} mr-2`}></div>
                          <span>{level.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="message-title">Message Title</Label>
              <Input
                id="message-title"
                placeholder="Enter a title for your message"
                value={messageTitle}
                onChange={(e) => setMessageTitle(e.target.value)}
                className="bg-gray-800 border-gray-700 mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="message-content">Message Content</Label>
              <Textarea
                id="message-content"
                placeholder="Type your message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="bg-gray-800 border-gray-700 min-h-[120px] mt-1"
              />
            </div>
            
            {messageType === 'link' && (
              <div>
                <Label htmlFor="message-link">Link URL</Label>
                <Input
                  id="message-link"
                  placeholder="https://..."
                  value={messageLink}
                  onChange={(e) => setMessageLink(e.target.value)}
                  className="bg-gray-800 border-gray-700 mt-1"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="display-duration">Display Duration</Label>
              <Select value={displayDuration} onValueChange={setDisplayDuration}>
                <SelectTrigger id="display-duration" className="bg-gray-800 border-gray-700 mt-1">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {DISPLAY_DURATIONS.map(duration => (
                    <SelectItem key={duration.id} value={duration.id}>
                      {duration.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Template generator */}
            <div className="bg-gray-800/50 rounded-md p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                  Quick Template Generator
                </h3>
                <Select value={templateType} onValueChange={setTemplateType}>
                  <SelectTrigger className="h-8 bg-gray-700 border-gray-600 text-xs w-[110px]">
                    <SelectValue placeholder="Template type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="joke">Joke</SelectItem>
                    <SelectItem value="goal">Daily Goal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                className="w-full mt-1 bg-gray-700 hover:bg-gray-600"
                onClick={generateTemplate}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate {templateType === 'joke' ? 'Random Joke' : 'Daily Goal'}
              </Button>
            </div>
          </div>
          
          {/* Preview */}
          {(messageTitle || messageContent) && (
            <div className="bg-gray-800/70 rounded-md p-4 border border-gray-700">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Message Preview</h3>
              <div className="p-3 rounded-md bg-gray-900 border border-gray-800">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    {MESSAGE_TYPES.find(t => t.id === messageType)?.icon}
                    <span className="ml-1 font-medium text-white">{messageTitle || 'Untitled Message'}</span>
                  </div>
                  <Badge className={`${URGENCY_LEVELS.find(u => u.id === messageUrgency)?.color}`}>
                    {URGENCY_LEVELS.find(u => u.id === messageUrgency)?.name}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300 mt-2 whitespace-pre-line">
                  {messageContent || 'No content yet...'}
                </p>
                {messageType === 'link' && messageLink && (
                  <div className="mt-2 text-sm">
                    <a href="#" className="text-blue-400 hover:underline flex items-center">
                      <Link className="h-3 w-3 mr-1" />
                      {messageLink}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Recent messages */}
          {recentMessages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Recent Broadcasts
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {recentMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`p-3 rounded-md ${msg.active ? 'bg-gray-800/70' : 'bg-gray-900/30'} border ${msg.active ? 'border-gray-700' : 'border-gray-800'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        {MESSAGE_TYPES.find(t => t.id === msg.type)?.icon}
                        <span className={`font-medium ${msg.active ? 'text-white' : 'text-gray-400'}`}>
                          {msg.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          {timeAgo(msg.sentAt)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${URGENCY_LEVELS.find(u => u.id === msg.urgency)?.color} ${!msg.active && 'opacity-50'}`}>
                          {URGENCY_LEVELS.find(u => u.id === msg.urgency)?.name}
                        </Badge>
                        <button 
                          onClick={() => toggleMessageActive(msg.id)}
                          className="text-gray-400 hover:text-gray-200"
                        >
                          {msg.active ? 
                            <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                            <XCircle className="h-4 w-4 text-gray-500" />
                          }
                        </button>
                      </div>
                    </div>
                    <p className={`text-xs ${msg.active ? 'text-gray-300' : 'text-gray-500'} line-clamp-1`}>
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          onClick={broadcastMessage}
          disabled={isSending || !messageTitle || !messageContent}
        >
          {isSending ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Broadcast to All Users
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default NetworkBroadcaster;