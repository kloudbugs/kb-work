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
  Input 
} from '@/components/ui/input';
import { 
  Label 
} from '@/components/ui/label';
import { 
  Switch 
} from '@/components/ui/switch';
import { 
  Textarea 
} from '@/components/ui/textarea';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon,
  Gift, 
  Rocket, 
  Clock, 
  Users, 
  Target, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  PlusCircle, 
  Settings, 
  Calendar as CalendarFull, 
  ArrowRight, 
  Check, 
  Award, 
  Sparkles, 
  Timer, 
  Megaphone, 
  Sun, 
  MoveDown, 
  Bitcoin, 
  Radio as Broadcast, 
  Wallet, 
  Gem, 
  Crown, 
  Star,
  ListFilter,
  Check as CheckIcon,
  Loader2,
  Trash2,
  Edit,
  Play,
  Pause,
  Coins,
  PartyPopper,
  Network,
  Zap,
  BarChart3,
  Filter,
  X,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

interface CampaignManagerProps {
  className?: string;
}

// Campaign types
const CAMPAIGN_TYPES = [
  { id: 'airdrop', name: 'Token Airdrop', icon: <Gift className="h-4 w-4" />, color: 'bg-green-600' },
  { id: 'mining-boost', name: 'Mining Boost', icon: <Zap className="h-4 w-4" />, color: 'bg-yellow-600' },
  { id: 'rewards-multiplier', name: 'Rewards Multiplier', icon: <Crown className="h-4 w-4" />, color: 'bg-amber-600' },
  { id: 'token-sale', name: 'TERA Token Sale', icon: <Coins className="h-4 w-4" />, color: 'bg-pink-600' },
  { id: 'special-event', name: 'Special Event', icon: <PartyPopper className="h-4 w-4" />, color: 'bg-purple-600' },
  { id: 'network-event', name: 'Network Event', icon: <Network className="h-4 w-4" />, color: 'bg-blue-600' },
];

// Distribution methods
const DISTRIBUTION_METHODS = [
  { id: 'all-users', name: 'All Active Users', description: 'Distribute to all currently active users' },
  { id: 'subscription-tier', name: 'Subscription Tier', description: 'Distribute based on subscription tier' },
  { id: 'mining-power', name: 'Mining Power', description: 'Distribute proportional to mining power' },
  { id: 'random-lottery', name: 'Random Lottery', description: 'Random selection of users' },
  { id: 'staking-amount', name: 'Staking Amount', description: 'Based on amount of tokens staked' },
];

// Tokens for airdrops
const TOKENS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: <Bitcoin className="h-4 w-4" /> },
  { id: 'mpt', name: 'MPT Token', symbol: 'MPT', icon: <Gem className="h-4 w-4" /> },
  { id: 'tera', name: 'TERA Token', symbol: 'TERA', icon: <Star className="h-4 w-4" /> },
];

// Subscription tiers
const SUBSCRIPTION_TIERS = [
  { id: 'free', name: 'Free Plan' },
  { id: 'basic', name: 'Basic Plan' },
  { id: 'standard', name: 'Standard Plan' },
  { id: 'premium', name: 'Premium Plan' },
  { id: 'enterprise', name: 'Enterprise Plan' },
];

// Campaign interface
interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused' | 'cancelled';
  description: string;
  startDate: Date;
  endDate: Date | null;
  distributionMethod: string;
  targetAudience: string[];
  rewardDetails: {
    token?: string;
    amount?: number;
    multiplier?: number;
    customField?: string;
  };
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
  lastUpdated: Date;
  stats?: {
    participants: number;
    totalDistributed: number;
    completionRate: number;
  };
}

export function CampaignManager({ className = '' }: CampaignManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Campaign state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);
  
  // New campaign form state
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignType, setCampaignType] = useState(CAMPAIGN_TYPES[0].id);
  const [campaignDescription, setCampaignDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [distributionMethod, setDistributionMethod] = useState(DISTRIBUTION_METHODS[0].id);
  const [targetAudience, setTargetAudience] = useState<string[]>([SUBSCRIPTION_TIERS[2].id, SUBSCRIPTION_TIERS[3].id, SUBSCRIPTION_TIERS[4].id]);
  const [rewardToken, setRewardToken] = useState(TOKENS[2].id); // TERA by default
  const [rewardAmount, setRewardAmount] = useState(100);
  const [rewardMultiplier, setRewardMultiplier] = useState(2);
  const [customRewardField, setCustomRewardField] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Calendar view
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');
  
  // Load campaigns from localStorage on mount
  useEffect(() => {
    const storedCampaigns = localStorage.getItem('campaigns');
    if (storedCampaigns) {
      try {
        const parsedCampaigns = JSON.parse(storedCampaigns);
        // Convert string dates back to Date objects
        const campaignsWithDates = parsedCampaigns.map((campaign: any) => ({
          ...campaign,
          startDate: new Date(campaign.startDate),
          endDate: campaign.endDate ? new Date(campaign.endDate) : null,
          createdAt: new Date(campaign.createdAt),
          lastUpdated: new Date(campaign.lastUpdated)
        }));
        setCampaigns(campaignsWithDates);
        
        // If campaigns exist, select the first active/upcoming one by default
        const activeCampaign = campaignsWithDates.find((c: Campaign) => c.status === 'active');
        const upcomingCampaign = campaignsWithDates.find((c: Campaign) => c.status === 'scheduled');
        
        if (activeCampaign) {
          setSelectedCampaignId(activeCampaign.id);
        } else if (upcomingCampaign) {
          setSelectedCampaignId(upcomingCampaign.id);
        } else if (campaignsWithDates.length > 0) {
          setSelectedCampaignId(campaignsWithDates[0].id);
        }
      } catch (e) {
        console.error('Error parsing stored campaigns:', e);
      }
    } else {
      // Create sample campaigns for first-time use
      const sampleCampaigns = generateSampleCampaigns();
      setCampaigns(sampleCampaigns);
      localStorage.setItem('campaigns', JSON.stringify(sampleCampaigns));
      
      if (sampleCampaigns.length > 0) {
        setSelectedCampaignId(sampleCampaigns[0].id);
      }
    }
  }, []);
  
  // Save campaigns to localStorage when they change
  useEffect(() => {
    if (campaigns.length > 0) {
      localStorage.setItem('campaigns', JSON.stringify(campaigns));
    }
  }, [campaigns]);
  
  // Check for campaigns that need to be activated or deactivated based on date
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let updatedCampaigns = [...campaigns];
      let hasChanges = false;
      
      updatedCampaigns = updatedCampaigns.map(campaign => {
        // Start scheduled campaigns that have reached their start date
        if (campaign.status === 'scheduled' && campaign.startDate <= now) {
          hasChanges = true;
          return { ...campaign, status: 'active', lastUpdated: now };
        }
        
        // End active campaigns that have reached their end date
        if (campaign.status === 'active' && campaign.endDate && campaign.endDate <= now) {
          hasChanges = true;
          return { ...campaign, status: 'completed', lastUpdated: now };
        }
        
        return campaign;
      });
      
      if (hasChanges) {
        setCampaigns(updatedCampaigns);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [campaigns]);
  
  // Generate sample campaigns for first-time use
  const generateSampleCampaigns = (): Campaign[] => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const twoWeeksFromNow = new Date(now);
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    
    const monthEnd = new Date(now);
    monthEnd.setDate(monthEnd.getDate() + 30);
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    return [
      {
        id: '1',
        name: 'TERA Token Launch Airdrop',
        type: 'airdrop',
        status: 'scheduled',
        description: 'Special airdrop for all KLOUD-BUGS users to celebrate the launch of TERA token. Every active user will receive TERA tokens based on their subscription level.',
        startDate: nextWeek,
        endDate: twoWeeksFromNow,
        distributionMethod: 'subscription-tier',
        targetAudience: ['basic', 'standard', 'premium', 'enterprise'],
        rewardDetails: {
          token: 'tera',
          amount: 500,
        },
        isRecurring: false,
        createdAt: now,
        lastUpdated: now,
        stats: {
          participants: 0,
          totalDistributed: 0,
          completionRate: 0
        }
      },
      {
        id: '2',
        name: 'Weekend Mining Boost',
        type: 'mining-boost',
        status: 'active',
        description: 'All miners get a 2x boost to their hashrate during the weekend. Limited time promotional event to boost network participation.',
        startDate: yesterday,
        endDate: tomorrow,
        distributionMethod: 'all-users',
        targetAudience: ['basic', 'standard', 'premium', 'enterprise'],
        rewardDetails: {
          multiplier: 2,
        },
        isRecurring: true,
        recurringPattern: 'weekly',
        createdAt: lastWeek,
        lastUpdated: yesterday,
        stats: {
          participants: 124,
          totalDistributed: 0,
          completionRate: 48
        }
      },
      {
        id: '3',
        name: 'Premium User Appreciation',
        type: 'rewards-multiplier',
        status: 'draft',
        description: 'A special reward multiplier for our premium and enterprise subscribers. All mining rewards are multiplied by 1.5x for the duration of the campaign.',
        startDate: twoWeeksFromNow,
        endDate: monthEnd,
        distributionMethod: 'subscription-tier',
        targetAudience: ['premium', 'enterprise'],
        rewardDetails: {
          multiplier: 1.5,
        },
        isRecurring: false,
        createdAt: now,
        lastUpdated: now,
        stats: {
          participants: 0,
          totalDistributed: 0,
          completionRate: 0
        }
      },
      {
        id: '4',
        name: 'Monthly MPT Token Distribution',
        type: 'airdrop',
        status: 'completed',
        description: 'Monthly MPT token distribution to all active miners based on their contribution to the network.',
        startDate: lastWeek,
        endDate: yesterday,
        distributionMethod: 'mining-power',
        targetAudience: ['basic', 'standard', 'premium', 'enterprise'],
        rewardDetails: {
          token: 'mpt',
          amount: 200,
        },
        isRecurring: true,
        recurringPattern: 'monthly',
        createdAt: lastWeek,
        lastUpdated: yesterday,
        stats: {
          participants: 213,
          totalDistributed: 42600,
          completionRate: 100
        }
      }
    ];
  };
  
  // Create a new campaign
  const createCampaign = () => {
    if (!campaignName.trim() || !campaignDescription.trim() || !startDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsCreatingCampaign(true);
    
    const now = new Date();
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: campaignName,
      type: campaignType,
      status: startDate && startDate <= now ? 'active' : 'scheduled',
      description: campaignDescription,
      startDate: startDate || now,
      endDate: endDate || null,
      distributionMethod,
      targetAudience,
      rewardDetails: {
        token: campaignType === 'airdrop' || campaignType === 'token-sale' ? rewardToken : undefined,
        amount: campaignType === 'airdrop' || campaignType === 'token-sale' ? rewardAmount : undefined,
        multiplier: campaignType === 'mining-boost' || campaignType === 'rewards-multiplier' ? rewardMultiplier : undefined,
        customField: ['special-event', 'network-event'].includes(campaignType) ? customRewardField : undefined,
      },
      isRecurring,
      recurringPattern: isRecurring ? recurringPattern : undefined,
      createdAt: now,
      lastUpdated: now,
      stats: {
        participants: 0,
        totalDistributed: 0,
        completionRate: 0
      }
    };
    
    // Add to campaigns list
    const updatedCampaigns = [...campaigns, newCampaign];
    setCampaigns(updatedCampaigns);
    
    // Select the new campaign
    setSelectedCampaignId(newCampaign.id);
    
    // Reset form
    resetCampaignForm();
    
    // Show success message
    toast({
      title: "Campaign Created",
      description: `${campaignName} has been created and ${newCampaign.status === 'active' ? 'activated' : 'scheduled'}.`,
      duration: 3000,
    });
    
    setIsCreatingCampaign(false);
  };
  
  // Update existing campaign
  const updateCampaign = () => {
    if (!selectedCampaignId || !campaignName.trim() || !campaignDescription.trim() || !startDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsEditingCampaign(true);
    
    const now = new Date();
    const updatedCampaigns = campaigns.map(campaign => {
      if (campaign.id === selectedCampaignId) {
        return {
          ...campaign,
          name: campaignName,
          type: campaignType,
          description: campaignDescription,
          startDate: startDate || campaign.startDate,
          endDate: endDate || campaign.endDate,
          distributionMethod,
          targetAudience,
          rewardDetails: {
            token: campaignType === 'airdrop' || campaignType === 'token-sale' ? rewardToken : campaign.rewardDetails.token,
            amount: campaignType === 'airdrop' || campaignType === 'token-sale' ? rewardAmount : campaign.rewardDetails.amount,
            multiplier: campaignType === 'mining-boost' || campaignType === 'rewards-multiplier' ? rewardMultiplier : campaign.rewardDetails.multiplier,
            customField: ['special-event', 'network-event'].includes(campaignType) ? customRewardField : campaign.rewardDetails.customField,
          },
          isRecurring,
          recurringPattern: isRecurring ? recurringPattern : undefined,
          lastUpdated: now
        };
      }
      return campaign;
    });
    
    setCampaigns(updatedCampaigns);
    
    // Show success message
    toast({
      title: "Campaign Updated",
      description: `${campaignName} has been updated.`,
      duration: 3000,
    });
    
    setIsEditingCampaign(false);
    resetCampaignForm();
  };
  
  // Delete campaign
  const deleteCampaign = (id: string) => {
    const campaignToDelete = campaigns.find(c => c.id === id);
    if (!campaignToDelete) return;
    
    const updatedCampaigns = campaigns.filter(campaign => campaign.id !== id);
    setCampaigns(updatedCampaigns);
    
    if (selectedCampaignId === id) {
      setSelectedCampaignId(updatedCampaigns.length > 0 ? updatedCampaigns[0].id : null);
    }
    
    // Show success message
    toast({
      title: "Campaign Deleted",
      description: `${campaignToDelete.name} has been removed.`,
      duration: 3000,
    });
  };
  
  // Activate campaign
  const activateCampaign = (id: string) => {
    const updatedCampaigns = campaigns.map(campaign => {
      if (campaign.id === id) {
        return {
          ...campaign,
          status: 'active',
          lastUpdated: new Date()
        };
      }
      return campaign;
    });
    
    setCampaigns(updatedCampaigns);
    
    const campaignName = campaigns.find(c => c.id === id)?.name;
    
    // Show success message
    toast({
      title: "Campaign Activated",
      description: `${campaignName} is now active.`,
      duration: 3000,
    });
  };
  
  // Pause campaign
  const pauseCampaign = (id: string) => {
    const updatedCampaigns = campaigns.map(campaign => {
      if (campaign.id === id) {
        return {
          ...campaign,
          status: 'paused',
          lastUpdated: new Date()
        };
      }
      return campaign;
    });
    
    setCampaigns(updatedCampaigns);
    
    const campaignName = campaigns.find(c => c.id === id)?.name;
    
    // Show success message
    toast({
      title: "Campaign Paused",
      description: `${campaignName} has been paused.`,
      duration: 3000,
    });
  };
  
  // Edit campaign
  const editCampaign = (id: string) => {
    const campaignToEdit = campaigns.find(c => c.id === id);
    if (!campaignToEdit) return;
    
    setCampaignName(campaignToEdit.name);
    setCampaignType(campaignToEdit.type);
    setCampaignDescription(campaignToEdit.description);
    setStartDate(campaignToEdit.startDate);
    setEndDate(campaignToEdit.endDate || undefined);
    setDistributionMethod(campaignToEdit.distributionMethod);
    setTargetAudience(campaignToEdit.targetAudience);
    setRewardToken(campaignToEdit.rewardDetails.token || TOKENS[0].id);
    setRewardAmount(campaignToEdit.rewardDetails.amount || 0);
    setRewardMultiplier(campaignToEdit.rewardDetails.multiplier || 1);
    setCustomRewardField(campaignToEdit.rewardDetails.customField || '');
    setIsRecurring(campaignToEdit.isRecurring);
    setRecurringPattern(campaignToEdit.recurringPattern || 'weekly');
    
    setSelectedCampaignId(id);
    setIsEditingCampaign(true);
  };
  
  // Reset campaign form
  const resetCampaignForm = () => {
    setCampaignName('');
    setCampaignType(CAMPAIGN_TYPES[0].id);
    setCampaignDescription('');
    setStartDate(new Date());
    setEndDate(undefined);
    setDistributionMethod(DISTRIBUTION_METHODS[0].id);
    setTargetAudience([SUBSCRIPTION_TIERS[2].id, SUBSCRIPTION_TIERS[3].id, SUBSCRIPTION_TIERS[4].id]);
    setRewardToken(TOKENS[2].id);
    setRewardAmount(100);
    setRewardMultiplier(2);
    setCustomRewardField('');
    setIsRecurring(false);
    setRecurringPattern('weekly');
    setIsCreatingCampaign(false);
    setIsEditingCampaign(false);
  };
  
  // Get selected campaign
  const selectedCampaign = campaigns.find(campaign => campaign.id === selectedCampaignId);
  
  // Format date
  const formatDate = (date: Date): string => {
    return format(date, 'PPP');
  };
  
  // Format time
  const formatTime = (date: Date): string => {
    return format(date, 'p');
  };
  
  // Format date range
  const formatDateRange = (startDate: Date, endDate: Date | null): string => {
    if (!endDate) return `Starts ${formatDate(startDate)}`;
    
    if (startDate.toDateString() === endDate.toDateString()) {
      return `${formatDate(startDate)} (one day)`;
    }
    
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return `${formatDate(startDate)} - ${formatDate(endDate)} (${days} days)`;
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'draft':
        return 'bg-gray-600';
      case 'scheduled':
        return 'bg-blue-600';
      case 'active':
        return 'bg-green-600';
      case 'completed':
        return 'bg-purple-600';
      case 'paused':
        return 'bg-amber-600';
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };
  
  // Get campaign type badge color
  const getTypeBadgeColor = (type: string): string => {
    const campaignType = CAMPAIGN_TYPES.find(t => t.id === type);
    return campaignType?.color || 'bg-gray-600';
  };
  
  // Get campaign type icon
  const getTypeIcon = (type: string) => {
    return CAMPAIGN_TYPES.find(t => t.id === type)?.icon || <Gift className="h-4 w-4" />;
  };
  
  // Get token icon
  const getTokenIcon = (token: string) => {
    return TOKENS.find(t => t.id === token)?.icon || <Coins className="h-4 w-4" />;
  };
  
  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    if (typeFilter && campaign.type !== typeFilter) return false;
    if (statusFilter && campaign.status !== statusFilter) return false;
    
    if (activeTab === 'upcoming') {
      return ['scheduled', 'draft'].includes(campaign.status);
    } else if (activeTab === 'active') {
      return campaign.status === 'active';
    } else if (activeTab === 'past') {
      return ['completed', 'cancelled'].includes(campaign.status);
    } else if (activeTab === 'all') {
      return true;
    }
    
    return true;
  });
  
  // Sort campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (activeTab === 'upcoming') {
      return a.startDate.getTime() - b.startDate.getTime();
    } else if (activeTab === 'active') {
      return b.startDate.getTime() - a.startDate.getTime();
    } else if (activeTab === 'past') {
      return b.endDate!.getTime() - a.endDate!.getTime();
    }
    
    return b.lastUpdated.getTime() - a.lastUpdated.getTime();
  });
  
  // Get calendar events (for the calendar view)
  const getCalendarEvents = () => {
    return campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      type: campaign.type,
      status: campaign.status,
      startDate: campaign.startDate,
      endDate: campaign.endDate
    }));
  };
  
  // Check if a date has campaigns
  const hasEventsOnDate = (date: Date): boolean => {
    const dateString = date.toDateString();
    
    return campaigns.some(campaign => {
      const start = campaign.startDate.toDateString();
      const end = campaign.endDate ? campaign.endDate.toDateString() : null;
      
      if (start === dateString) return true;
      if (end === dateString) return true;
      
      if (end && new Date(start) <= date && date <= new Date(end)) {
        return true;
      }
      
      return false;
    });
  };
  
  // Get campaigns for a specific date
  const getCampaignsForDate = (date: Date) => {
    const dateString = date.toDateString();
    
    return campaigns.filter(campaign => {
      const start = campaign.startDate.toDateString();
      const end = campaign.endDate ? campaign.endDate.toDateString() : null;
      
      if (start === dateString) return true;
      if (end === dateString) return true;
      
      if (end && new Date(start) <= date && date <= new Date(end)) {
        return true;
      }
      
      return false;
    });
  };
  
  return (
    <Card className={`w-full bg-gradient-to-br from-gray-900/80 to-amber-900/20 backdrop-blur-sm border border-amber-800/50 ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-6 w-6 text-amber-400" />
              Campaign & Airdrop Manager
            </CardTitle>
            <CardDescription>
              Schedule and manage token airdrops, mining boosts, and special events for your users.
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={calendarView}
              onValueChange={(value: 'month' | 'week') => setCalendarView(value)}
            >
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{isEditingCampaign ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
                  <DialogDescription>
                    {isEditingCampaign 
                      ? 'Update campaign details and settings.' 
                      : 'Schedule a new campaign, airdrop, or special event for your users.'}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Basic Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="campaign-name">Campaign Name</Label>
                      <Input
                        id="campaign-name"
                        placeholder="Enter campaign name..."
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="campaign-type">Campaign Type</Label>
                      <Select value={campaignType} onValueChange={setCampaignType}>
                        <SelectTrigger id="campaign-type" className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {CAMPAIGN_TYPES.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center">
                                {type.icon}
                                <span className="ml-2">{type.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="campaign-description">Description</Label>
                      <Textarea
                        id="campaign-description"
                        placeholder="Describe the campaign details..."
                        value={campaignDescription}
                        onChange={(e) => setCampaignDescription(e.target.value)}
                        className="bg-gray-800 border-gray-700 min-h-[100px]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-gray-800 border-gray-700"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? formatDate(startDate) : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800">
                            <CalendarComponent
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-gray-800 border-gray-700"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? formatDate(endDate) : <span>Optional</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800">
                            <CalendarComponent
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                              disabled={(date) => 
                                (startDate ? date < startDate : false)
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="recurring"
                        checked={isRecurring}
                        onCheckedChange={setIsRecurring}
                      />
                      <Label htmlFor="recurring">Recurring Campaign</Label>
                    </div>
                    
                    {isRecurring && (
                      <div className="space-y-2">
                        <Label htmlFor="recurring-pattern">Recurring Pattern</Label>
                        <Select 
                          value={recurringPattern} 
                          onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setRecurringPattern(value)}
                        >
                          <SelectTrigger id="recurring-pattern" className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select pattern" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  {/* Distribution Settings */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Distribution Settings</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="distribution-method">Distribution Method</Label>
                      <Select value={distributionMethod} onValueChange={setDistributionMethod}>
                        <SelectTrigger id="distribution-method" className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select distribution method" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {DISTRIBUTION_METHODS.map(method => (
                            <SelectItem key={method.id} value={method.id}>
                              <div className="flex flex-col">
                                <span>{method.name}</span>
                                <span className="text-xs text-gray-400">{method.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Target Audience (only show if distribution is based on subscription tier) */}
                    {distributionMethod === 'subscription-tier' && (
                      <div className="space-y-2">
                        <Label>Target Subscription Tiers</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {SUBSCRIPTION_TIERS.map(tier => (
                            <div key={tier.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`tier-${tier.id}`}
                                checked={targetAudience.includes(tier.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setTargetAudience([...targetAudience, tier.id]);
                                  } else {
                                    setTargetAudience(targetAudience.filter(id => id !== tier.id));
                                  }
                                }}
                                className="h-4 w-4 bg-gray-800 border-gray-700 rounded"
                              />
                              <Label htmlFor={`tier-${tier.id}`}>{tier.name}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Reward Settings based on campaign type */}
                    <h3 className="text-sm font-medium pt-2">Reward Settings</h3>
                    
                    {(campaignType === 'airdrop' || campaignType === 'token-sale') && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="token">Token</Label>
                          <Select value={rewardToken} onValueChange={setRewardToken}>
                            <SelectTrigger id="token" className="bg-gray-800 border-gray-700">
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {TOKENS.map(token => (
                                <SelectItem key={token.id} value={token.id}>
                                  <div className="flex items-center">
                                    {token.icon}
                                    <span className="ml-2">{token.name} ({token.symbol})</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="amount">Amount per User</Label>
                            <span className="text-xs text-gray-400">
                              {TOKENS.find(t => t.id === rewardToken)?.symbol}
                            </span>
                          </div>
                          <Input
                            id="amount"
                            type="number"
                            value={rewardAmount}
                            onChange={(e) => setRewardAmount(parseFloat(e.target.value) || 0)}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                      </div>
                    )}
                    
                    {(campaignType === 'mining-boost' || campaignType === 'rewards-multiplier') && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="multiplier">Multiplier</Label>
                          <span className="text-xs text-gray-400">x</span>
                        </div>
                        <Input
                          id="multiplier"
                          type="number"
                          value={rewardMultiplier}
                          onChange={(e) => setRewardMultiplier(parseFloat(e.target.value) || 1)}
                          min="1"
                          step="0.1"
                          className="bg-gray-800 border-gray-700"
                        />
                        <p className="text-xs text-gray-400">
                          {campaignType === 'mining-boost' 
                            ? 'Mining power will be multiplied by this value during the campaign.' 
                            : 'Mining rewards will be multiplied by this value during the campaign.'}
                        </p>
                      </div>
                    )}
                    
                    {(campaignType === 'special-event' || campaignType === 'network-event') && (
                      <div className="space-y-2">
                        <Label htmlFor="custom-reward">Custom Reward Details</Label>
                        <Textarea
                          id="custom-reward"
                          placeholder="Describe the special event rewards or benefits..."
                          value={customRewardField}
                          onChange={(e) => setCustomRewardField(e.target.value)}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="ghost" onClick={resetCampaignForm}>Cancel</Button>
                  <Button
                    onClick={isEditingCampaign ? updateCampaign : createCampaign}
                    disabled={isCreatingCampaign || isEditingCampaign}
                  >
                    {isCreatingCampaign || isEditingCampaign ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isEditingCampaign ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        {isEditingCampaign ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Update Campaign
                          </>
                        ) : (
                          <>
                            <Rocket className="h-4 w-4 mr-2" />
                            Create Campaign
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-gray-800">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-amber-600">
                <Clock className="h-4 w-4 mr-2" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-amber-600">
                <Broadcast className="h-4 w-4 mr-2" />
                Active
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-amber-600">
                <CheckIcon className="h-4 w-4 mr-2" />
                Past
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-amber-600">
                <ListFilter className="h-4 w-4 mr-2" />
                All
              </TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-amber-600">
                <CalendarFull className="h-4 w-4 mr-2" />
                Calendar
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    {(typeFilter || statusFilter) && (
                      <Badge className="h-5 px-1">
                        {(typeFilter ? 1 : 0) + (statusFilter ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4 bg-gray-900 border-gray-800">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Filter Campaigns</h4>
                    
                    <div className="space-y-2">
                      <Label>Campaign Type</Label>
                      <Select
                        value={typeFilter || ""}
                        onValueChange={(value) => setTypeFilter(value || null)}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Any type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="">Any type</SelectItem>
                          {CAMPAIGN_TYPES.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center">
                                {type.icon}
                                <span className="ml-2">{type.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={statusFilter || ""}
                        onValueChange={(value) => setStatusFilter(value || null)}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Any status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="">Any status</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTypeFilter(null);
                          setStatusFilter(null);
                        }}
                        disabled={!typeFilter && !statusFilter}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <TabsContent value="upcoming" className="m-0 w-full md:w-1/2">
              <div className="space-y-4">
                {sortedCampaigns.length === 0 ? (
                  <div className="bg-gray-800/70 rounded-md border border-gray-700 p-6 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                    <h3 className="text-lg font-medium text-gray-300">No Upcoming Campaigns</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                      Create a new campaign to see it listed here.
                    </p>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </div>
                ) : (
                  sortedCampaigns.map(campaign => (
                    <div
                      key={campaign.id}
                      className={`p-4 rounded-md border cursor-pointer transition-all ${
                        selectedCampaignId === campaign.id 
                          ? 'border-amber-500 bg-amber-900/20' 
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                      onClick={() => {
                        setSelectedCampaignId(campaign.id);
                        setShowCampaignDetails(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getTypeBadgeColor(campaign.type)}`}>
                            {getTypeIcon(campaign.type)}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-xs text-gray-400">
                              {formatDateRange(campaign.startDate, campaign.endDate)}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusBadgeColor(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-300 line-clamp-2">
                        {campaign.description}
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="bg-gray-700">
                            {campaign.distributionMethod === 'all-users' ? 'All Users' : 
                             campaign.distributionMethod === 'subscription-tier' ? 'By Subscription' : 
                             campaign.distributionMethod === 'mining-power' ? 'By Mining Power' : 
                             campaign.distributionMethod === 'random-lottery' ? 'Random Lottery' : 
                             campaign.distributionMethod === 'staking-amount' ? 'By Staking' : 
                             'Custom Distribution'}
                          </Badge>
                          {campaign.isRecurring && (
                            <Badge className="ml-2 bg-blue-600">
                              {campaign.recurringPattern === 'daily' ? 'Daily' : 
                               campaign.recurringPattern === 'weekly' ? 'Weekly' : 
                               'Monthly'}
                            </Badge>
                          )}
                        </div>
                        
                        <div>
                          <Button 
                            variant="ghost" 
                            className="h-7 px-2 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="active" className="m-0 w-full md:w-1/2">
              <div className="space-y-4">
                {sortedCampaigns.length === 0 ? (
                  <div className="bg-gray-800/70 rounded-md border border-gray-700 p-6 text-center">
                    <Broadcast className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                    <h3 className="text-lg font-medium text-gray-300">No Active Campaigns</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                      Start a campaign to see it listed here.
                    </p>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </div>
                ) : (
                  sortedCampaigns.map(campaign => (
                    <div
                      key={campaign.id}
                      className={`p-4 rounded-md border cursor-pointer transition-all ${
                        selectedCampaignId === campaign.id 
                          ? 'border-amber-500 bg-amber-900/20' 
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                      onClick={() => {
                        setSelectedCampaignId(campaign.id);
                        setShowCampaignDetails(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getTypeBadgeColor(campaign.type)}`}>
                            {getTypeIcon(campaign.type)}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-xs text-gray-400">
                              {formatDateRange(campaign.startDate, campaign.endDate)}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusBadgeColor(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-300 line-clamp-2">
                        {campaign.description}
                      </div>
                      
                      {campaign.stats && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div className="bg-gray-700/50 p-2 rounded-md">
                            <div className="text-xs text-gray-400">Participants</div>
                            <div className="font-medium">{campaign.stats.participants}</div>
                          </div>
                          
                          {campaign.type === 'airdrop' || campaign.type === 'token-sale' ? (
                            <div className="bg-gray-700/50 p-2 rounded-md">
                              <div className="text-xs text-gray-400">Distributed</div>
                              <div className="font-medium">
                                {campaign.stats.totalDistributed} {TOKENS.find(t => t.id === campaign.rewardDetails.token)?.symbol}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-700/50 p-2 rounded-md">
                              <div className="text-xs text-gray-400">Progress</div>
                              <div className="font-medium">{campaign.stats.completionRate}%</div>
                            </div>
                          )}
                          
                          <div className="bg-gray-700/50 p-2 rounded-md">
                            <div className="text-xs text-gray-400">Status</div>
                            <div className="font-medium">
                              {campaign.status === 'active' ? 'Running' : 'Paused'}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            pauseCampaign(campaign.id);
                          }}
                        >
                          <Pause className="h-3.5 w-3.5 mr-1" />
                          Pause
                        </Button>
                        
                        <div>
                          <Button 
                            variant="ghost" 
                            className="h-7 px-2 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="past" className="m-0 w-full md:w-1/2">
              <div className="space-y-4">
                {sortedCampaigns.length === 0 ? (
                  <div className="bg-gray-800/70 rounded-md border border-gray-700 p-6 text-center">
                    <CheckIcon className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                    <h3 className="text-lg font-medium text-gray-300">No Past Campaigns</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Completed campaigns will appear here.
                    </p>
                  </div>
                ) : (
                  sortedCampaigns.map(campaign => (
                    <div
                      key={campaign.id}
                      className={`p-4 rounded-md border cursor-pointer transition-all ${
                        selectedCampaignId === campaign.id 
                          ? 'border-amber-500 bg-amber-900/20' 
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                      onClick={() => {
                        setSelectedCampaignId(campaign.id);
                        setShowCampaignDetails(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getTypeBadgeColor(campaign.type)}`}>
                            {getTypeIcon(campaign.type)}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-xs text-gray-400">
                              {formatDateRange(campaign.startDate, campaign.endDate)}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusBadgeColor(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                      </div>
                      
                      {campaign.stats && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div className="bg-gray-700/50 p-2 rounded-md">
                            <div className="text-xs text-gray-400">Participants</div>
                            <div className="font-medium">{campaign.stats.participants}</div>
                          </div>
                          
                          {campaign.type === 'airdrop' || campaign.type === 'token-sale' ? (
                            <div className="bg-gray-700/50 p-2 rounded-md">
                              <div className="text-xs text-gray-400">Distributed</div>
                              <div className="font-medium">
                                {campaign.stats.totalDistributed} {TOKENS.find(t => t.id === campaign.rewardDetails.token)?.symbol}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-700/50 p-2 rounded-md">
                              <div className="text-xs text-gray-400">Completion</div>
                              <div className="font-medium">{campaign.stats.completionRate}%</div>
                            </div>
                          )}
                          
                          <div className="bg-gray-700/50 p-2 rounded-md">
                            <div className="text-xs text-gray-400">Final Status</div>
                            <div className="font-medium">
                              {campaign.status === 'completed' ? 'Completed' : 'Cancelled'}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="bg-gray-700">
                            {campaign.distributionMethod === 'all-users' ? 'All Users' : 
                             campaign.distributionMethod === 'subscription-tier' ? 'By Subscription' : 
                             campaign.distributionMethod === 'mining-power' ? 'By Mining Power' : 
                             campaign.distributionMethod === 'random-lottery' ? 'Random Lottery' : 
                             campaign.distributionMethod === 'staking-amount' ? 'By Staking' : 
                             'Custom Distribution'}
                          </Badge>
                        </div>
                        
                        <div>
                          <Button 
                            variant="ghost" 
                            className="h-7 px-2 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                          >
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="m-0 w-full md:w-1/2">
              <div className="space-y-4">
                {sortedCampaigns.length === 0 ? (
                  <div className="bg-gray-800/70 rounded-md border border-gray-700 p-6 text-center">
                    <CalendarFull className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                    <h3 className="text-lg font-medium text-gray-300">No Campaigns</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                      Create your first campaign to get started.
                    </p>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedCampaigns.map(campaign => (
                        <TableRow 
                          key={campaign.id}
                          className={selectedCampaignId === campaign.id ? 'bg-amber-900/20' : ''}
                        >
                          <TableCell className="font-medium">
                            <div 
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedCampaignId(campaign.id);
                                setShowCampaignDetails(true);
                              }}
                            >
                              {campaign.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeBadgeColor(campaign.type)}>
                              <div className="flex items-center">
                                {getTypeIcon(campaign.type)}
                                <span className="ml-1">
                                  {CAMPAIGN_TYPES.find(t => t.id === campaign.type)?.name}
                                </span>
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(campaign.status)}>
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs">
                              {formatDate(campaign.startDate)}
                              {campaign.endDate && ` - ${formatDate(campaign.endDate)}`}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-gray-900 border-gray-800">
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setSelectedCampaignId(campaign.id);
                                    setShowCampaignDetails(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => editCampaign(campaign.id)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                
                                {campaign.status === 'draft' || campaign.status === 'scheduled' ? (
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => activateCampaign(campaign.id)}
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Activate
                                  </DropdownMenuItem>
                                ) : campaign.status === 'active' ? (
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => pauseCampaign(campaign.id)}
                                  >
                                    <Pause className="h-4 w-4 mr-2" />
                                    Pause
                                  </DropdownMenuItem>
                                ) : null}
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-500 focus:text-red-500"
                                  onClick={() => deleteCampaign(campaign.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="m-0 w-full md:w-2/3">
              <div className="bg-gray-800 rounded-md border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Campaign Calendar</h3>
                  
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        const newDate = new Date(calendarDate);
                        if (calendarView === 'month') {
                          newDate.setMonth(newDate.getMonth() - 1);
                        } else {
                          newDate.setDate(newDate.getDate() - 7);
                        }
                        setCalendarDate(newDate);
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="mx-4 font-medium">
                      {calendarView === 'month' 
                        ? format(calendarDate, 'MMMM yyyy')
                        : `Week of ${format(calendarDate, 'MMM d, yyyy')}`}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        const newDate = new Date(calendarDate);
                        if (calendarView === 'month') {
                          newDate.setMonth(newDate.getMonth() + 1);
                        } else {
                          newDate.setDate(newDate.getDate() + 7);
                        }
                        setCalendarDate(newDate);
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 ml-2"
                      onClick={() => setCalendarDate(new Date())}
                    >
                      Today
                    </Button>
                  </div>
                </div>
                
                {calendarView === 'month' ? (
                  <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-medium p-2">
                        {day}
                      </div>
                    ))}
                    
                    {(() => {
                      const days = [];
                      const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
                      const today = new Date();
                      
                      // Add empty cells for days of the week before the first day of the month
                      const firstDayOfMonth = date.getDay();
                      for (let i = 0; i < firstDayOfMonth; i++) {
                        days.push(
                          <div key={`empty-start-${i}`} className="h-24 border border-gray-700/50 rounded-md bg-gray-800/30" />
                        );
                      }
                      
                      // Add cells for each day of the month
                      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                      for (let i = 1; i <= daysInMonth; i++) {
                        const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
                        const isToday = currentDate.toDateString() === today.toDateString();
                        const hasEvents = hasEventsOnDate(currentDate);
                        const eventsForDate = getCampaignsForDate(currentDate);
                        
                        days.push(
                          <div 
                            key={`day-${i}`} 
                            className={`h-24 border rounded-md p-1 overflow-hidden ${
                              isToday 
                                ? 'border-amber-500 bg-amber-900/10' 
                                : 'border-gray-700/50 bg-gray-800/50'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className={`text-sm font-medium ${
                                isToday ? 'text-amber-400' : ''
                              }`}>
                                {i}
                              </span>
                              
                              {hasEvents && (
                                <div className="h-2 w-2 rounded-full bg-amber-500" />
                              )}
                            </div>
                            
                            <div className="mt-1 space-y-1">
                              {eventsForDate.slice(0, 2).map(event => (
                                <div 
                                  key={event.id} 
                                  className={`text-xs truncate rounded px-1 py-0.5 cursor-pointer ${getTypeBadgeColor(event.type)}`}
                                  onClick={() => {
                                    setSelectedCampaignId(event.id);
                                    setShowCampaignDetails(true);
                                  }}
                                >
                                  {event.name}
                                </div>
                              ))}
                              
                              {eventsForDate.length > 2 && (
                                <div className="text-xs text-gray-400 pl-1">
                                  +{eventsForDate.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      
                      // Add empty cells for days of the week after the last day of the month
                      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
                      for (let i = lastDayOfMonth; i < 6; i++) {
                        days.push(
                          <div key={`empty-end-${i}`} className="h-24 border border-gray-700/50 rounded-md bg-gray-800/30" />
                        );
                      }
                      
                      return days;
                    })()}
                  </div>
                ) : (
                  // Week view
                  <div className="space-y-2">
                    {(() => {
                      const days = [];
                      const startOfWeek = new Date(calendarDate);
                      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                      const today = new Date();
                      
                      for (let i = 0; i < 7; i++) {
                        const currentDate = new Date(startOfWeek);
                        currentDate.setDate(currentDate.getDate() + i);
                        const isToday = currentDate.toDateString() === today.toDateString();
                        const eventsForDate = getCampaignsForDate(currentDate);
                        
                        days.push(
                          <div 
                            key={`week-day-${i}`} 
                            className={`border rounded-md p-2 ${
                              isToday 
                                ? 'border-amber-500 bg-amber-900/10' 
                                : 'border-gray-700 bg-gray-800/50'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">
                                  {format(currentDate, 'EEEE')}
                                </span>
                                <span className={`text-sm ml-2 ${
                                  isToday ? 'text-amber-400' : 'text-gray-400'
                                }`}>
                                  {format(currentDate, 'MMM d')}
                                </span>
                              </div>
                              
                              {eventsForDate.length > 0 && (
                                <Badge className="bg-amber-600">{eventsForDate.length}</Badge>
                              )}
                            </div>
                            
                            <div className="mt-2 space-y-2">
                              {eventsForDate.map(event => (
                                <div 
                                  key={event.id} 
                                  className={`p-2 rounded-md cursor-pointer border-l-4 ${
                                    getTypeBadgeColor(event.type).replace('bg-', 'border-l-')
                                  } bg-gray-800`}
                                  onClick={() => {
                                    setSelectedCampaignId(event.id);
                                    setShowCampaignDetails(true);
                                  }}
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="font-medium">{event.name}</div>
                                    <Badge className={getStatusBadgeColor(event.status)}>
                                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center text-xs mt-1 text-gray-400">
                                    {CAMPAIGN_TYPES.find(t => t.id === event.type)?.icon}
                                    <span className="ml-1">
                                      {CAMPAIGN_TYPES.find(t => t.id === event.type)?.name}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              
                              {eventsForDate.length === 0 && (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                  No campaigns scheduled
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      
                      return days;
                    })()}
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Campaign Details Panel */}
            {showCampaignDetails && selectedCampaign && (
              <div className="w-full md:w-1/2 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getTypeBadgeColor(selectedCampaign.type)}`}>
                      {getTypeIcon(selectedCampaign.type)}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{selectedCampaign.name}</div>
                      <div className="text-xs text-gray-400">
                        {formatDateRange(selectedCampaign.startDate, selectedCampaign.endDate)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadgeColor(selectedCampaign.status)}>
                      {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                    </Badge>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setShowCampaignDetails(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                    <p className="text-sm">{selectedCampaign.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Campaign Type</h3>
                      <Badge className={getTypeBadgeColor(selectedCampaign.type)}>
                        <div className="flex items-center">
                          {getTypeIcon(selectedCampaign.type)}
                          <span className="ml-2">
                            {CAMPAIGN_TYPES.find(t => t.id === selectedCampaign.type)?.name}
                          </span>
                        </div>
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Distribution Method</h3>
                      <Badge className="bg-gray-700">
                        {selectedCampaign.distributionMethod === 'all-users' ? 'All Users' : 
                         selectedCampaign.distributionMethod === 'subscription-tier' ? 'By Subscription' : 
                         selectedCampaign.distributionMethod === 'mining-power' ? 'By Mining Power' : 
                         selectedCampaign.distributionMethod === 'random-lottery' ? 'Random Lottery' : 
                         selectedCampaign.distributionMethod === 'staking-amount' ? 'By Staking' : 
                         'Custom Distribution'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Schedule</h3>
                    <div className="bg-gray-900 rounded-md p-3 space-y-2">
                      <div className="flex justify-between">
                        <span>Start Date:</span>
                        <span className="font-medium">{formatDate(selectedCampaign.startDate)} at {formatTime(selectedCampaign.startDate)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>End Date:</span>
                        <span className="font-medium">
                          {selectedCampaign.endDate 
                            ? `${formatDate(selectedCampaign.endDate)} at ${formatTime(selectedCampaign.endDate)}` 
                            : 'No end date'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Recurring:</span>
                        <span className="font-medium">
                          {selectedCampaign.isRecurring 
                            ? `Yes (${
                                selectedCampaign.recurringPattern === 'daily' ? 'Daily' : 
                                selectedCampaign.recurringPattern === 'weekly' ? 'Weekly' : 
                                'Monthly'
                              })` 
                            : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reward Details */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Reward Details</h3>
                    <div className="bg-gray-900 rounded-md p-3">
                      {(selectedCampaign.type === 'airdrop' || selectedCampaign.type === 'token-sale') && selectedCampaign.rewardDetails.token && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getTokenIcon(selectedCampaign.rewardDetails.token)}
                            <span className="ml-2">
                              {TOKENS.find(t => t.id === selectedCampaign.rewardDetails.token)?.name}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">{selectedCampaign.rewardDetails.amount}</span>
                            <span className="ml-1">
                              {TOKENS.find(t => t.id === selectedCampaign.rewardDetails.token)?.symbol}
                            </span>
                            <span className="text-gray-400 text-sm"> per user</span>
                          </div>
                        </div>
                      )}
                      
                      {(selectedCampaign.type === 'mining-boost' || selectedCampaign.type === 'rewards-multiplier') && selectedCampaign.rewardDetails.multiplier && (
                        <div className="flex items-center justify-between">
                          <span>
                            {selectedCampaign.type === 'mining-boost' ? 'Hashrate Multiplier' : 'Rewards Multiplier'}:
                          </span>
                          <span className="font-medium">{selectedCampaign.rewardDetails.multiplier}x</span>
                        </div>
                      )}
                      
                      {(selectedCampaign.type === 'special-event' || selectedCampaign.type === 'network-event') && selectedCampaign.rewardDetails.customField && (
                        <div>
                          <p>{selectedCampaign.rewardDetails.customField}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Target Audience */}
                  {selectedCampaign.distributionMethod === 'subscription-tier' && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Target Subscription Tiers</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCampaign.targetAudience.map(tier => (
                          <Badge key={tier} className="bg-blue-600">
                            {SUBSCRIPTION_TIERS.find(t => t.id === tier)?.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Stats (if active or completed) */}
                  {selectedCampaign.stats && (selectedCampaign.status === 'active' || selectedCampaign.status === 'completed') && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Campaign Statistics</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-900 p-3 rounded-md">
                          <div className="text-xs text-gray-400">Participants</div>
                          <div className="text-lg font-medium">{selectedCampaign.stats.participants}</div>
                        </div>
                        
                        {selectedCampaign.type === 'airdrop' || selectedCampaign.type === 'token-sale' ? (
                          <div className="bg-gray-900 p-3 rounded-md">
                            <div className="text-xs text-gray-400">Total Distributed</div>
                            <div className="text-lg font-medium">
                              {selectedCampaign.stats.totalDistributed} {
                                TOKENS.find(t => t.id === selectedCampaign.rewardDetails.token)?.symbol
                              }
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-900 p-3 rounded-md">
                            <div className="text-xs text-gray-400">Completion Rate</div>
                            <div className="text-lg font-medium">{selectedCampaign.stats.completionRate}%</div>
                          </div>
                        )}
                        
                        <div className="bg-gray-900 p-3 rounded-md">
                          <div className="text-xs text-gray-400">Duration</div>
                          <div className="text-lg font-medium">
                            {selectedCampaign.status === 'completed' && selectedCampaign.endDate 
                              ? Math.ceil((selectedCampaign.endDate.getTime() - selectedCampaign.startDate.getTime()) / (1000 * 60 * 60 * 24))
                              : selectedCampaign.endDate
                                ? Math.ceil((selectedCampaign.endDate.getTime() - selectedCampaign.startDate.getTime()) / (1000 * 60 * 60 * 24))
                                : Math.ceil((new Date().getTime() - selectedCampaign.startDate.getTime()) / (1000 * 60 * 60 * 24))
                            } days
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <Button
                        variant="outline"
                        className="mr-2"
                        onClick={() => editCampaign(selectedCampaign.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Campaign
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="text-red-500"
                        onClick={() => {
                          deleteCampaign(selectedCampaign.id);
                          setShowCampaignDetails(false);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    
                    <div>
                      {selectedCampaign.status === 'draft' || selectedCampaign.status === 'scheduled' ? (
                        <Button
                          onClick={() => activateCampaign(selectedCampaign.id)}
                        >
                          <Rocket className="h-4 w-4 mr-2" />
                          Activate Now
                        </Button>
                      ) : selectedCampaign.status === 'active' ? (
                        <Button
                          variant="destructive"
                          onClick={() => pauseCampaign(selectedCampaign.id)}
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Pause Campaign
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          <Gift className="h-5 w-5 mr-2 text-amber-400" />
          <span className="text-sm text-gray-400">
            {campaigns.length} Campaigns | {campaigns.filter(c => c.status === 'active').length} Active
          </span>
        </div>
        
        <div>
          <Select value={'today'} onValueChange={() => {}}>
            <SelectTrigger className="w-[180px] h-8 text-xs border-amber-800">
              <SelectValue placeholder="View events" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              <SelectItem value="today">Events today</SelectItem>
              <SelectItem value="upcoming">Upcoming events (7 days)</SelectItem>
              <SelectItem value="all">All scheduled events</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardFooter>
    </Card>
  );
}

export default CampaignManager;