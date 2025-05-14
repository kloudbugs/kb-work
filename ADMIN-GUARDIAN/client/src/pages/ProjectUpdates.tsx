import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'wouter';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarIcon, 
  ClockIcon, 
  DollarSignIcon, 
  LandmarkIcon,
  HeartIcon,
  UsersIcon,
  ArrowRightIcon
} from 'lucide-react';

// Types for project updates
interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  contributionTotal: number;
  contributorsCount: number;
  category: 'announcement' | 'milestone' | 'impact' | 'upcoming';
}

// Types for fund stats
interface FundStats {
  totalContributions: number;
  totalContributors: number;
  currentBalance: number;
  lastWithdrawal?: {
    amount: number;
    date: string;
    purpose: string;
  };
  movementImpact: {
    peopleHelped: number;
    communitiesSupported: number;
    eventsOrganized: number;
  };
}

const ProjectUpdates = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Fetch project updates
  const { 
    data: updates, 
    isLoading: updatesLoading,
    error: updatesError
  } = useQuery<ProjectUpdate[]>({
    queryKey: ['/api/project-updates'],
    refetchOnWindowFocus: false
  });

  // Fetch fund statistics
  const { 
    data: stats, 
    isLoading: statsLoading,
    error: statsError
  } = useQuery<FundStats>({
    queryKey: ['/api/movement-fund/stats'],
    refetchOnWindowFocus: false
  });

  // Filter updates based on active tab
  const filteredUpdates = updates?.filter(update => {
    if (activeTab === 'all') return true;
    return update.category === activeTab;
  });

  // Format currency amount as BTC
  const formatBtc = (amount: number) => {
    return `${(amount / 100000000).toFixed(8)} BTC`;
  };

  if (updatesLoading || statsLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading project updates...</h2>
        </div>
      </div>
    );
  }

  if (updatesError || statsError) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error loading project updates</h2>
          <p className="mt-2">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Civil Rights Movement Fund</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Your mining contributes to real social change. Here are the latest updates on how your contributions are making a difference.
        </p>
      </div>

      {/* Fund Statistics Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <DollarSignIcon className="mr-2 h-5 w-5 text-primary" />
                Total Contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatBtc(stats.totalContributions)}</div>
              <p className="text-sm text-muted-foreground mt-1">
                From {stats.totalContributors.toLocaleString()} contributors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <LandmarkIcon className="mr-2 h-5 w-5 text-primary" />
                Current Fund Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatBtc(stats.currentBalance)}</div>
              {stats.lastWithdrawal && (
                <p className="text-sm text-muted-foreground mt-1">
                  Last withdrawal: {formatBtc(stats.lastWithdrawal.amount)} on {new Date(stats.lastWithdrawal.date).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <HeartIcon className="mr-2 h-5 w-5 text-primary" />
                Movement Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-2xl font-bold">{stats.movementImpact.peopleHelped.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">People Helped</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.movementImpact.communitiesSupported.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Communities</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.movementImpact.eventsOrganized.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Project Updates Tabs */}
      <Tabs defaultValue="all" className="mb-12" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">All Updates</TabsTrigger>
            <TabsTrigger value="announcement">Announcements</TabsTrigger>
            <TabsTrigger value="milestone">Milestones</TabsTrigger>
            <TabsTrigger value="impact">Impact Stories</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {filteredUpdates && filteredUpdates.length > 0 ? (
            <div className="space-y-8">
              {filteredUpdates.map((update) => (
                <Card key={update.id} className="overflow-hidden">
                  <div className="md:flex">
                    {update.imageUrl && (
                      <div className="md:w-1/3">
                        <img 
                          src={update.imageUrl} 
                          alt={update.title} 
                          className="h-full w-full object-cover max-h-64 md:max-h-none"
                        />
                      </div>
                    )}
                    <div className={`md:${update.imageUrl ? 'w-2/3' : 'w-full'}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge className="mb-2" variant={
                              update.category === 'announcement' ? 'default' : 
                              update.category === 'milestone' ? 'secondary' :
                              update.category === 'impact' ? 'destructive' : 'outline'
                            }>
                              {update.category.charAt(0).toUpperCase() + update.category.slice(1)}
                            </Badge>
                            <CardTitle>{update.title}</CardTitle>
                          </div>
                          <div className="text-right text-sm text-muted-foreground flex items-center">
                            <CalendarIcon className="mr-1 h-4 w-4" />
                            {new Date(update.date).toLocaleDateString()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: update.content }}></div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <UsersIcon className="mr-1 h-4 w-4" />
                          <span>{update.contributorsCount.toLocaleString()} contributors</span>
                          <Separator orientation="vertical" className="mx-2 h-4" />
                          <DollarSignIcon className="mr-1 h-4 w-4" />
                          <span>{formatBtc(update.contributionTotal)}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Read More <ArrowRightIcon className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No updates available</h3>
              <p className="text-muted-foreground mt-2">
                Check back soon for updates on this category.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Sample placeholder data for development */}
      {(!updates || updates.length === 0) && (
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium">Getting Started</h3>
          <p className="text-sm text-muted-foreground mt-2">
            As the admin, you'll be able to post project updates here to keep your community informed about how their contributions are making a difference.
            This is a great way to maintain transparency and build trust with your users.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectUpdates;