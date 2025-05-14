import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  BarChart3, 
  Clock, 
  Users, 
  Activity, 
  Signal, 
  Bitcoin, 
  MessageSquareMore, 
  ShieldAlert,
  User, 
  LogOut,
  Webhook
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useUserTracking } from '@/contexts/UserTrackingContext';
import { apiRequest } from '@/lib/queryClient';

// Interface for an active user with session details
type ActiveUserDetails = {
  userId: string;
  username: string;
  avatar?: string;
  loginTime: Date;
  lastActive: Date;
  status: 'active' | 'inactive' | 'away';
  hashRate?: number;
  miningRewards?: number;
  device?: string;
  ip?: string;
  location?: string;
};

export function ActiveUserTracker() {
  const { activeUsers } = useUserTracking();
  const [detailedUsers, setDetailedUsers] = useState<ActiveUserDetails[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [userEvents, setUserEvents] = useState<{
    userId: string;
    username: string;
    timestamp: Date;
    event: string;
    details?: string;
  }[]>([]);
  
  // Fetch detailed user information
  useEffect(() => {
    const fetchDetailedUserInfo = async () => {
      try {
        // If we already have basic active users from context
        if (activeUsers && activeUsers.length > 0) {
          // Fetch additional details for each user
          const userDetailsPromises = activeUsers.map(async (user) => {
            try {
              const response = await apiRequest(`/api/users/${user.userId}/details`);
              
              if (response.data) {
                // Combine active user data with additional details
                return {
                  ...user,
                  avatar: response.data.avatar,
                  hashRate: response.data.currentHashRate,
                  miningRewards: response.data.totalRewards,
                  device: response.data.currentDevice,
                  ip: response.data.ipAddress,
                  location: response.data.location
                };
              }
              return user;
            } catch (error) {
              console.error(`Failed to fetch details for user ${user.userId}`, error);
              return user;
            }
          });
          
          const userDetails = await Promise.all(userDetailsPromises);
          setDetailedUsers(userDetails as ActiveUserDetails[]);
        } else {
          // If no users from context, fetch directly
          const response = await apiRequest('/api/users/active');
          if (response.data && response.data.users) {
            setDetailedUsers(response.data.users);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };
    
    fetchDetailedUserInfo();
    
    // Set up polling interval to refresh every 30 seconds
    const interval = setInterval(fetchDetailedUserInfo, 30000);
    
    return () => clearInterval(interval);
  }, [activeUsers]);
  
  // Fetch user login/logout events
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const response = await apiRequest('/api/users/events');
        if (response.data && response.data.events) {
          // Convert string timestamps to Date objects
          const events = response.data.events.map((event: any) => ({
            ...event,
            timestamp: new Date(event.timestamp)
          }));
          setUserEvents(events);
        }
      } catch (error) {
        console.error('Failed to fetch user events:', error);
      }
    };
    
    fetchUserEvents();
    const interval = setInterval(fetchUserEvents, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Get filtered users based on status
  const filteredUsers = filterStatus === 'all' 
    ? detailedUsers 
    : detailedUsers.filter(user => user.status === filterStatus);
  
  // Get user count statistics
  const activeCount = detailedUsers.filter(u => u.status === 'active').length;
  const inactiveCount = detailedUsers.filter(u => u.status === 'inactive').length;
  const awayCount = detailedUsers.filter(u => u.status === 'away').length;
  
  // Get selected user details
  const selectedUser = selectedUserId 
    ? detailedUsers.find(user => user.userId === selectedUserId) 
    : null;
    
  // Handle direct message to user
  const handleMessageUser = (userId: string) => {
    // Implementation for direct messaging (admin to user)
    console.log(`Sending message to user ${userId}`);
  };
  
  // Handle force logout of user
  const handleForceLogout = async (userId: string) => {
    try {
      await apiRequest(`/api/users/${userId}/logout`, { 
        method: 'POST', 
        data: { forceLogout: true } 
      });
      
      // Update user list after forcing logout
      setDetailedUsers(prev => 
        prev.map(user => 
          user.userId === userId 
            ? { ...user, status: 'inactive' } 
            : user
        )
      );
    } catch (error) {
      console.error(`Failed to force logout user ${userId}`, error);
    }
  };
  
  // Handle boosting a user's mining rewards
  const handleBoostMiningRewards = async (userId: string) => {
    try {
      await apiRequest(`/api/admin/boost`, {
        method: 'POST',
        data: { userId, boostType: 'mining', amount: 15 } // 15% boost
      });
      
      // You could update UI to reflect the boost or show a success message
    } catch (error) {
      console.error(`Failed to boost mining rewards for user ${userId}`, error);
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };
  
  // Get time since login/last active
  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  // Format hashrate correctly
  const formatHashRate = (hashRate?: number) => {
    if (!hashRate) return 'N/A';
    
    if (hashRate >= 1000000) {
      return `${(hashRate / 1000000).toFixed(2)} MH/s`;
    } else if (hashRate >= 1000) {
      return `${(hashRate / 1000).toFixed(2)} KH/s`;
    }
    
    return `${hashRate.toFixed(2)} H/s`;
  };
  
  // Format mining rewards with BTC symbol
  const formatMiningRewards = (rewards?: number) => {
    if (!rewards) return '0.00000000 BTC';
    return `${rewards.toFixed(8)} BTC`;
  };
  
  return (
    <Card className="shadow-md border-0 bg-gradient-to-br from-slate-900 to-slate-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-400" />
              Active User Tracker
            </CardTitle>
            <CardDescription className="text-gray-400">
              Monitor user logins, activity and mining performance in real-time
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="px-2 py-1 border-green-500 text-green-500">
              <span className="mr-1">●</span> {activeCount} Active
            </Badge>
            <Badge variant="outline" className="px-2 py-1 border-yellow-500 text-yellow-500">
              <span className="mr-1">●</span> {awayCount} Away
            </Badge>
            <Badge variant="outline" className="px-2 py-1 border-gray-500 text-gray-500">
              <span className="mr-1">●</span> {inactiveCount} Inactive
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="users">
          <TabsList className="w-full mb-4 bg-slate-950">
            <TabsTrigger value="users" className="flex-1 data-[state=active]:text-blue-400">
              <Users className="h-4 w-4 mr-2" /> Users ({detailedUsers.length})
            </TabsTrigger>
            <TabsTrigger value="events" className="flex-1 data-[state=active]:text-blue-400">
              <Activity className="h-4 w-4 mr-2" /> Events ({userEvents.length})
            </TabsTrigger>
            {selectedUser && (
              <TabsTrigger value="details" className="flex-1 data-[state=active]:text-blue-400">
                <User className="h-4 w-4 mr-2" /> User Details
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="users" className="mt-0">
            <div className="flex justify-end mb-3">
              <div className="flex items-center text-sm">
                <span className="mr-2 text-gray-400">Filter:</span>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-white text-sm"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="away">Away</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div 
                    key={user.userId}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedUserId === user.userId 
                        ? 'bg-slate-700' 
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    onClick={() => setSelectedUserId(user.userId)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border-2 border-slate-600">
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback className="bg-slate-700 text-blue-400">
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span 
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${getStatusColor(user.status)} ring-2 ring-slate-800`}
                        />
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-white">{user.username}</h3>
                        <div className="text-xs flex items-center text-gray-400">
                          <Clock className="h-3 w-3 mr-1" /> 
                          Login: {getTimeAgo(user.loginTime)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="hidden md:flex flex-col items-end">
                        <div className="flex items-center text-gray-300">
                          <Signal className="h-3 w-3 mr-1 text-blue-400" />
                          {formatHashRate(user.hashRate)}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Bitcoin className="h-3 w-3 mr-1 text-amber-400" />
                          {formatMiningRewards(user.miningRewards)}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full hover:bg-blue-500/20 hover:text-blue-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMessageUser(user.userId);
                                }}
                              >
                                <MessageSquareMore className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Direct Message</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full hover:bg-red-500/20 hover:text-red-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleForceLogout(user.userId);
                                }}
                              >
                                <LogOut className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Force Logout</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full hover:bg-amber-500/20 hover:text-amber-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBoostMiningRewards(user.userId);
                                }}
                              >
                                <Webhook className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Boost Mining Rewards</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>No users match the current filter</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="mt-0">
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {userEvents.length > 0 ? (
                userEvents.map((event, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-slate-800 border-l-4 border-blue-500"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">
                          {event.username} 
                          <span className="ml-2 text-sm font-normal text-gray-400">
                            {event.event}
                          </span>
                        </h3>
                        {event.details && (
                          <p className="text-xs text-gray-400 mt-1">{event.details}</p>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getTimeAgo(event.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Activity className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>No recent user events recorded</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {selectedUser && (
            <TabsContent value="details" className="mt-0">
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16 border-2 border-slate-600">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.username} />
                    <AvatarFallback className="text-lg bg-slate-700 text-blue-400">
                      {selectedUser.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedUser.username}</h2>
                    <div className="flex items-center">
                      <Badge className={`mr-2 ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        User ID: {selectedUser.userId.substring(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-850 rounded-lg p-3">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Session Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Login Time:</span>
                        <span className="text-white">{getTimeAgo(selectedUser.loginTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Active:</span>
                        <span className="text-white">{getTimeAgo(selectedUser.lastActive)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Device:</span>
                        <span className="text-white">{selectedUser.device || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">IP Address:</span>
                        <span className="text-white">{selectedUser.ip || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location:</span>
                        <span className="text-white">{selectedUser.location || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-850 rounded-lg p-3">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Mining Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Current Hashrate:</span>
                        <span className="text-white">{formatHashRate(selectedUser.hashRate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Mining Rewards:</span>
                        <span className="text-white">{formatMiningRewards(selectedUser.miningRewards)}</span>
                      </div>
                      {/* Additional mining stats would go here */}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                    onClick={() => handleMessageUser(selectedUser.userId)}
                  >
                    <MessageSquareMore className="h-4 w-4 mr-2" />
                    Direct Message
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-amber-500 text-amber-400 hover:bg-amber-500/20"
                    onClick={() => handleBoostMiningRewards(selectedUser.userId)}
                  >
                    <Webhook className="h-4 w-4 mr-2" />
                    Boost Mining Rewards
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-500 text-red-400 hover:bg-red-500/20"
                    onClick={() => handleForceLogout(selectedUser.userId)}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Force Logout
                  </Button>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t border-slate-700 pt-4 text-xs text-gray-500">
        <div className="flex justify-between w-full">
          <span>Last refreshed: {new Date().toLocaleTimeString()}</span>
          <span>{detailedUsers.length} users tracked in real-time</span>
        </div>
      </CardFooter>
    </Card>
  );
}