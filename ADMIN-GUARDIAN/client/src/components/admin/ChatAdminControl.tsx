import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Shield, Ban, Eye, UserPlus, AlertTriangle, Trash2, User, Wifi, Search, Filter, Settings, Lock, MessageCircle, MessagesSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isRemoved: boolean;
  isFlagged: boolean;
};

type ChatUser = {
  id: string;
  username: string;
  profileImage?: string;
  isActive: boolean;
  isBanned: boolean;
  isAdmin: boolean;
  chatRestricted: boolean;
  lastActive: Date;
};

export function ChatAdminControl() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [messageFilter, setMessageFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bannedWords, setBannedWords] = useState<string[]>(['scam', 'spam', 'hack', 'password']);
  const [newBannedWord, setNewBannedWord] = useState('');
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const [moderationLevel, setModerationLevel] = useState('medium');
  const [systemAnnouncement, setSystemAnnouncement] = useState('');
  
  // Fetch chat messages
  useEffect(() => {
    // This would be an API call in production
    setMessages([
      {
        id: '1',
        userId: '101',
        username: 'alice',
        content: 'Just started mining and already seeing results!',
        timestamp: new Date(Date.now() - 3600000),
        isRemoved: false,
        isFlagged: false,
      },
      {
        id: '2',
        userId: '102',
        username: 'bob',
        content: 'Has anyone configured the Antminer S19 Pro yet?',
        timestamp: new Date(Date.now() - 2700000),
        isRemoved: false,
        isFlagged: false,
      },
      {
        id: '3',
        userId: '103',
        username: 'charlie',
        content: 'Check out my mining setup!',
        timestamp: new Date(Date.now() - 1800000),
        isRemoved: false,
        isFlagged: false,
      },
      {
        id: '4',
        userId: '104',
        username: 'spammer',
        content: 'Free BTC! Visit scam-site dot com',
        timestamp: new Date(Date.now() - 900000),
        isRemoved: true,
        isFlagged: true,
      },
    ]);
    
    // Fetch users
    setUsers([
      {
        id: '101',
        username: 'alice',
        isActive: true,
        isBanned: false,
        isAdmin: false,
        chatRestricted: false,
        lastActive: new Date(Date.now() - 600000),
      },
      {
        id: '102',
        username: 'bob',
        isActive: true,
        isBanned: false,
        isAdmin: false,
        chatRestricted: false,
        lastActive: new Date(Date.now() - 300000),
      },
      {
        id: '103',
        username: 'charlie',
        isActive: false,
        isBanned: false,
        isAdmin: false,
        chatRestricted: false,
        lastActive: new Date(Date.now() - 7200000),
      },
      {
        id: '104',
        username: 'spammer',
        isActive: false,
        isBanned: true,
        isAdmin: false,
        chatRestricted: true,
        lastActive: new Date(Date.now() - 900000),
      },
      {
        id: '105',
        username: 'moderator',
        isActive: true,
        isBanned: false,
        isAdmin: true,
        chatRestricted: false,
        lastActive: new Date(Date.now() - 120000),
      },
    ]);
  }, []);

  // Filter messages based on search term and filter
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         message.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (messageFilter === 'all') return matchesSearch;
    if (messageFilter === 'flagged') return matchesSearch && message.isFlagged;
    if (messageFilter === 'removed') return matchesSearch && message.isRemoved;
    return matchesSearch;
  });

  // Filter users based on search term and filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (userFilter === 'all') return matchesSearch;
    if (userFilter === 'active') return matchesSearch && user.isActive;
    if (userFilter === 'banned') return matchesSearch && user.isBanned;
    if (userFilter === 'restricted') return matchesSearch && user.chatRestricted;
    if (userFilter === 'admin') return matchesSearch && user.isAdmin;
    return matchesSearch;
  });

  // Handle message moderation
  const handleRemoveMessage = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isRemoved: true } : msg
    ));
    toast({
      title: "Message Removed",
      description: "The message has been removed from chat.",
    });
  };

  const handleFlagMessage = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isFlagged: !msg.isFlagged } : msg
    ));
    toast({
      title: "Message Flagged",
      description: "The message has been flagged for review.",
    });
  };

  // Handle user moderation
  const handleToggleBan = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isBanned: !user.isBanned } : user
    ));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: user.isBanned ? "User Unbanned" : "User Banned",
        description: `${user.username} has been ${user.isBanned ? 'unbanned' : 'banned'} from the chat.`,
      });
    }
  };

  const handleToggleChatRestriction = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, chatRestricted: !user.chatRestricted } : user
    ));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: user.chatRestricted ? "Chat Restriction Removed" : "Chat Restricted",
        description: `${user.username} ${user.chatRestricted ? 'can now' : 'cannot'} send messages in chat.`,
      });
    }
  };

  // Handle banned words
  const addBannedWord = () => {
    if (newBannedWord.trim() && !bannedWords.includes(newBannedWord.trim())) {
      setBannedWords([...bannedWords, newBannedWord.trim()]);
      setNewBannedWord('');
      toast({
        title: "Word Added to Blacklist",
        description: `"${newBannedWord.trim()}" has been added to the banned words list.`,
      });
    }
  };

  const removeBannedWord = (word: string) => {
    setBannedWords(bannedWords.filter(w => w !== word));
    toast({
      title: "Word Removed from Blacklist",
      description: `"${word}" has been removed from the banned words list.`,
    });
  };

  // Handle system announcement
  const sendSystemAnnouncement = () => {
    if (systemAnnouncement.trim()) {
      toast({
        title: "System Announcement Sent",
        description: "Your announcement has been broadcast to all users.",
      });
      setSystemAnnouncement('');
    }
  };

  // Toggle chat enabled status
  const toggleChatEnabled = () => {
    setIsChatEnabled(!isChatEnabled);
    toast({
      title: isChatEnabled ? "Chat Disabled" : "Chat Enabled",
      description: isChatEnabled ? "Chat has been disabled for all users." : "Chat has been enabled for all users.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Chat Administration</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${isChatEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium">Chat System</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {isChatEnabled ? 'Chat system is currently enabled' : 'Chat system is currently disabled'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Switch 
            checked={isChatEnabled}
            onCheckedChange={toggleChatEnabled}
          />
        </div>
      </div>
      
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="messages" className="data-[state=active]:bg-blue-600">
            <MessagesSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
            <User className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="announcements" className="data-[state=active]:bg-blue-600">
            <Wifi className="h-4 w-4 mr-2" />
            Announcements
          </TabsTrigger>
        </TabsList>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card className="border-blue-800/50 bg-gray-900/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Chat Messages</CardTitle>
              <CardDescription>
                View, moderate, and manage chat messages
              </CardDescription>
              
              <div className="flex items-center gap-3 mt-3">
                <div className="relative flex items-center flex-1">
                  <Search className="absolute left-2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search messages..." 
                    className="pl-8 bg-gray-800 border-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select 
                    className="bg-gray-800 border border-gray-700 text-white rounded-md px-2 py-1 text-sm"
                    value={messageFilter}
                    onChange={(e) => setMessageFilter(e.target.value)}
                  >
                    <option value="all">All Messages</option>
                    <option value="flagged">Flagged</option>
                    <option value="removed">Removed</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map(message => (
                      <div 
                        key={message.id} 
                        className={`p-3 rounded-lg ${
                          message.isRemoved ? 'bg-red-900/20 border border-red-900/40' :
                          message.isFlagged ? 'bg-amber-900/20 border border-amber-800/40' :
                          'bg-gray-800/70 border border-gray-700/40'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback className="bg-blue-900 text-blue-100">
                                {message.username.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium">{message.username}</span>
                                {users.find(u => u.id === message.userId)?.isAdmin && (
                                  <Badge className="ml-2 bg-blue-600 text-xs">Admin</Badge>
                                )}
                                {users.find(u => u.id === message.userId)?.isBanned && (
                                  <Badge className="ml-2 bg-red-600 text-xs">Banned</Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(message.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-7 w-7"
                                    onClick={() => handleFlagMessage(message.id)}
                                  >
                                    <AlertTriangle className={`h-4 w-4 ${message.isFlagged ? 'text-amber-400' : 'text-gray-400'}`} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {message.isFlagged ? 'Remove flag' : 'Flag message'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-7 w-7"
                                    onClick={() => handleRemoveMessage(message.id)}
                                    disabled={message.isRemoved}
                                  >
                                    <Trash2 className={`h-4 w-4 ${message.isRemoved ? 'text-gray-600' : 'text-gray-400'}`} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {message.isRemoved ? 'Message removed' : 'Remove message'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        
                        <div className={message.isRemoved ? 'line-through text-gray-500' : 'text-white'}>
                          {message.content}
                        </div>
                        
                        {message.isRemoved && (
                          <div className="mt-1 text-xs text-red-400">
                            This message has been removed by a moderator.
                          </div>
                        )}
                        
                        {message.isFlagged && !message.isRemoved && (
                          <div className="mt-1 text-xs text-amber-400">
                            This message has been flagged for review.
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No messages match your search criteria.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="border-blue-800/50 bg-gray-900/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Chat Users</CardTitle>
              <CardDescription>
                Manage user access and permissions in the chat
              </CardDescription>
              
              <div className="flex items-center gap-3 mt-3">
                <div className="relative flex items-center flex-1">
                  <Search className="absolute left-2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-8 bg-gray-800 border-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select 
                    className="bg-gray-800 border border-gray-700 text-white rounded-md px-2 py-1 text-sm"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  >
                    <option value="all">All Users</option>
                    <option value="active">Active Now</option>
                    <option value="banned">Banned</option>
                    <option value="restricted">Restricted</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <div 
                        key={user.id} 
                        className={`p-3 rounded-lg ${
                          user.isBanned ? 'bg-red-900/20 border border-red-900/40' :
                          user.chatRestricted ? 'bg-amber-900/20 border border-amber-800/40' :
                          user.isAdmin ? 'bg-blue-900/20 border border-blue-800/40' :
                          'bg-gray-800/70 border border-gray-700/40'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className={`${
                                user.isAdmin ? 'bg-blue-900 text-blue-100' : 'bg-gray-700 text-gray-100'
                              }`}>
                                {user.username.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium">{user.username}</span>
                                <div className="flex ml-2 gap-1">
                                  {user.isAdmin && (
                                    <Badge className="bg-blue-600 text-xs">Admin</Badge>
                                  )}
                                  {user.isBanned && (
                                    <Badge className="bg-red-600 text-xs">Banned</Badge>
                                  )}
                                  {user.chatRestricted && (
                                    <Badge className="bg-amber-600 text-xs">Restricted</Badge>
                                  )}
                                  {user.isActive && (
                                    <Badge className="bg-green-600 text-xs">Online</Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-400 mt-1">
                                Last active: {new Date(user.lastActive).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant={user.chatRestricted ? "outline" : "destructive"} 
                                    className={`h-8 ${user.chatRestricted ? 'border-amber-600 text-amber-600 hover:bg-amber-900/20' : 'bg-amber-600 hover:bg-amber-700'}`}
                                    onClick={() => handleToggleChatRestriction(user.id)}
                                  >
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    {user.chatRestricted ? 'Unrestrict' : 'Restrict'}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {user.chatRestricted ? 'Allow user to chat' : 'Restrict user from chatting'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant={user.isBanned ? "outline" : "destructive"} 
                                    className={`h-8 ${user.isBanned ? 'border-red-600 text-red-600 hover:bg-red-900/20' : 'bg-red-600 hover:bg-red-700'}`}
                                    onClick={() => handleToggleBan(user.id)}
                                  >
                                    <Ban className="h-4 w-4 mr-1" />
                                    {user.isBanned ? 'Unban' : 'Ban'}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {user.isBanned ? 'Remove ban from user' : 'Ban user from platform'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No users match your search criteria.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className="border-blue-800/50 bg-gray-900/70">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Chat Settings</CardTitle>
              <CardDescription>
                Configure chat behavior and word filters
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Chat Moderation Level</Label>
                    <select 
                      className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-1"
                      value={moderationLevel}
                      onChange={(e) => setModerationLevel(e.target.value)}
                    >
                      <option value="low">Low - Manual moderation only</option>
                      <option value="medium">Medium - Filter banned words</option>
                      <option value="high">High - Approve messages before posting</option>
                    </select>
                  </div>
                  
                  <p className="text-sm text-gray-400">
                    {moderationLevel === 'low' && 'Messages will only be moderated manually by admins. Banned words will still be highlighted.'}
                    {moderationLevel === 'medium' && 'Messages containing banned words will be automatically filtered and flagged for review.'}
                    {moderationLevel === 'high' && 'All messages will require admin approval before appearing in the chat.'}
                  </p>
                </div>
                
                <div className="border-t border-gray-800 pt-5">
                  <h3 className="text-md font-medium mb-3">Banned Words</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Input 
                      placeholder="Add a word to ban..." 
                      className="bg-gray-800 border-gray-700"
                      value={newBannedWord}
                      onChange={(e) => setNewBannedWord(e.target.value)}
                    />
                    <Button 
                      onClick={addBannedWord}
                      disabled={!newBannedWord.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {bannedWords.map(word => (
                      <Badge 
                        key={word} 
                        className="bg-red-900/40 border border-red-900/60 text-red-200 hover:bg-red-900/60 cursor-pointer px-2 py-1"
                        onClick={() => removeBannedWord(word)}
                      >
                        {word}
                        <span className="ml-1 text-red-400">×</span>
                      </Badge>
                    ))}
                    
                    {bannedWords.length === 0 && (
                      <p className="text-sm text-gray-500">No banned words added yet.</p>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-800 pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Maximum Message Length</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        className="w-20 bg-gray-800 border-gray-700"
                        defaultValue="500"
                      />
                      <span className="text-sm text-gray-400">characters</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Allow Media Sharing</Label>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Allow Links</Label>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Message Rate Limiting</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        className="w-16 bg-gray-800 border-gray-700"
                        defaultValue="5"
                      />
                      <span className="text-sm text-gray-400">per minute</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Settings Saved",
                    description: "Chat settings have been updated.",
                  });
                }}
              >
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <Card className="border-blue-800/50 bg-gray-900/70">
            <CardHeader>
              <CardTitle className="text-lg font-medium">System Announcements</CardTitle>
              <CardDescription>
                Send system-wide announcements to all users in the chat
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Announcement Message</Label>
                  <textarea 
                    className="w-full h-32 rounded-md bg-gray-800 border border-gray-700 p-3 text-white"
                    placeholder="Enter your system announcement here..."
                    value={systemAnnouncement}
                    onChange={(e) => setSystemAnnouncement(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="pin-announcement" />
                  <Label htmlFor="pin-announcement">Pin announcement to top of chat</Label>
                </div>
                
                <div className="p-4 border border-blue-900/50 bg-blue-900/20 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="h-5 w-5 text-blue-400" />
                    <h3 className="font-medium">Recent Announcements</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-800/60 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">System Maintenance</span>
                        <span className="text-xs text-gray-400">2 days ago</span>
                      </div>
                      <p className="text-sm mt-1">Scheduled maintenance completed. All systems operating normally.</p>
                    </div>
                    
                    <div className="p-3 bg-gray-800/60 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Welcome</span>
                        <span className="text-xs text-gray-400">5 days ago</span>
                      </div>
                      <p className="text-sm mt-1">Welcome to the new Cosmic Chat feature! Connect with miners across the galaxy.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full"
                onClick={sendSystemAnnouncement}
                disabled={!systemAnnouncement.trim()}
              >
                <Wifi className="h-4 w-4 mr-2" />
                Broadcast Announcement
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}