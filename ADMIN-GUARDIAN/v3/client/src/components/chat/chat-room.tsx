import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Message types
type Message = {
  id: number;
  userId: number;
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
  isAdmin?: boolean;
};

// Chat channels
const CHANNELS = [
  { id: 'general', name: 'General' },
  { id: 'mining', name: 'Mining Talk' },
  { id: 'cafe', name: 'Café Chat' },
  { id: 'guardian', name: 'TERA Guardian' },
  { id: 'admin', name: 'Admin Channel' }
];

// User list
const USERS = [
  { id: 1, username: 'admin', avatarUrl: '', isOnline: true, isAdmin: true },
  { id: 2, username: 'moderator', avatarUrl: '', isOnline: true, isModerator: true },
  { id: 3, username: 'user', avatarUrl: '', isOnline: true },
  { id: 4, username: 'miner1', avatarUrl: '', isOnline: true },
  { id: 5, username: 'cafeowner', avatarUrl: '', isOnline: false },
  { id: 6, username: 'ghost', avatarUrl: '', isOnline: true, isAdmin: true }
];

// Mock messages
const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    userId: 0,
    username: 'System',
    avatarUrl: '',
    content: 'Welcome to the KLOUD BUGS Chat Room! This is where our community exchanges ideas and supports each other.',
    timestamp: '2025-05-20T08:00:00Z',
    isSystem: true
  },
  {
    id: 2,
    userId: 1,
    username: 'admin',
    avatarUrl: '',
    content: 'Hi everyone! Just a reminder that we have system maintenance scheduled for May 25.',
    timestamp: '2025-05-20T08:15:00Z',
    isAdmin: true
  },
  {
    id: 3,
    userId: 3,
    username: 'user',
    avatarUrl: '',
    content: 'Thanks for the heads up! How long will the system be down?',
    timestamp: '2025-05-20T08:20:00Z'
  },
  {
    id: 4,
    userId: 1,
    username: 'admin',
    avatarUrl: '',
    content: 'It should only be for about 2 hours, from 2AM to 4AM UTC.',
    timestamp: '2025-05-20T08:25:00Z',
    isAdmin: true
  },
  {
    id: 5,
    userId: 4,
    username: 'miner1',
    avatarUrl: '',
    content: 'Has anyone tried the new mining pool configurations? They seem to be working great for me!',
    timestamp: '2025-05-20T09:30:00Z'
  },
  {
    id: 6,
    userId: 6,
    username: 'ghost',
    avatarUrl: '',
    content: 'I\'ve just updated the TERA Guardian system with enhanced security features. All mining operations are now protected with quantum-resistant encryption.',
    timestamp: '2025-05-20T10:15:00Z',
    isAdmin: true
  },
  {
    id: 7,
    userId: 2,
    username: 'moderator',
    avatarUrl: '',
    content: 'The new Nebula Cold Brew at the café is amazing! Highly recommended if you need a boost during your mining sessions.',
    timestamp: '2025-05-20T11:05:00Z'
  }
];

export default function ChatRoom() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('general');
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle new message submission
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Create a new message
    const message: Message = {
      id: messages.length + 1,
      userId: 3, // Current user (assuming 'user')
      username: 'user',
      avatarUrl: '',
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulate system/admin response
    if (Math.random() > 0.7) {
      setTimeout(() => {
        let responseMessage: Message;
        
        if (Math.random() > 0.5) {
          // Admin response
          responseMessage = {
            id: messages.length + 2,
            userId: 1,
            username: 'admin',
            avatarUrl: '',
            content: 'Thanks for your message! The team is working on it.',
            timestamp: new Date().toISOString(),
            isAdmin: true
          };
        } else {
          // System response
          responseMessage = {
            id: messages.length + 2,
            userId: 0,
            username: 'System',
            avatarUrl: '',
            content: 'Your message has been logged in the KLOUD BUGS system.',
            timestamp: new Date().toISOString(),
            isSystem: true
          };
        }
        
        setMessages(prevMessages => [...prevMessages, responseMessage]);
      }, 2000);
    }
  };
  
  // Handle 'Enter' key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="chat-room h-full">
      <Tabs defaultValue={activeChannel} onValueChange={setActiveChannel} className="h-full flex flex-col">
        <div className="border-b">
          <div className="container mx-auto py-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">KLOUD BUGS Chat Room</h2>
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
            <TabsList className="mt-2">
              {CHANNELS.map(channel => (
                <TabsTrigger key={channel.id} value={channel.id}>{channel.name}</TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {CHANNELS.map(channel => (
            <TabsContent key={channel.id} value={channel.id} className="h-full flex">
              <div className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.userId === 3 ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${message.isSystem ? 'bg-blue-100 dark:bg-blue-900' : message.isAdmin ? 'bg-amber-100 dark:bg-amber-900' : message.userId === 3 ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'} p-3 rounded-lg`}>
                          <div className="flex items-center space-x-2">
                            {message.userId !== 3 && (
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={message.avatarUrl} />
                                <AvatarFallback className={message.isSystem ? 'bg-blue-500' : message.isAdmin ? 'bg-amber-500' : 'bg-gray-500'}>
                                  {message.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <span className="font-medium text-sm">{message.username}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="mt-1">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>Send</Button>
                  </div>
                </div>
              </div>
              
              <div className="w-60 border-l p-4 hidden md:block">
                <h3 className="font-medium mb-3">Online Users</h3>
                <div className="space-y-3">
                  {USERS.filter(user => user.isOnline).map(user => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className={user.isAdmin ? 'bg-amber-500' : user.isModerator ? 'bg-blue-500' : 'bg-gray-500'}>
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className={user.isAdmin ? 'text-amber-500 font-medium' : user.isModerator ? 'text-blue-500 font-medium' : ''}>{user.username}</span>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                  ))}
                </div>
                
                <h3 className="font-medium mt-6 mb-3">Offline Users</h3>
                <div className="space-y-3">
                  {USERS.filter(user => !user.isOnline).map(user => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="bg-gray-400">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">{user.username}</span>
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}