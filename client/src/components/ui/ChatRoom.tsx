import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Send, Users, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ElectricBorder } from '@/components/ui/electric-border';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  userId: number;
  username: string;
  message: string;
  timestamp: Date;
  isAdmin: boolean;
}

export function ChatRoom() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<{id: number, username: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  // Effect to initialize WebSocket connection
  useEffect(() => {
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Function to establish WebSocket connection
  const connectWebSocket = () => {
    setIsConnecting(true);
    
    // Get the current host
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setIsConnecting(false);
      
      // Send authentication message
      if (user) {
        socket.send(JSON.stringify({
          type: 'auth',
          userId: user.id,
          username: user.username
        }));
        
        // Request active users list
        socket.send(JSON.stringify({
          type: 'getActiveUsers'
        }));
      }
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chatMessage') {
          setMessages(prev => [...prev, {
            id: data.id,
            userId: data.userId,
            username: data.username,
            message: data.message,
            timestamp: new Date(data.timestamp),
            isAdmin: data.isAdmin
          }]);
          
          // Scroll to bottom
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        } 
        else if (data.type === 'activeUsers') {
          setActiveUsers(data.users);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
    
    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      
      // Try to reconnect after a delay
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
          connectWebSocket();
        }
      }, 3000);
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
    
    ws.current = socket;
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageText.trim() || !isConnected || !ws.current) return;
    
    try {
      ws.current.send(JSON.stringify({
        type: 'chatMessage',
        message: messageText
      }));
      
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: 'Please try again',
        variant: 'destructive'
      });
    }
  };
  
  // Handle Enter key press in textarea
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <ElectricBorder 
        className="h-full flex-1 flex flex-col"
        cornerAccentColor="border-purple-500"
        edgeGlowColor="rgba(139, 92, 246, 0.5)"
        noiseBg={true}
        centerGlow={true}
      >
        <div className="bg-black/60 backdrop-blur-md rounded-md h-full p-1 flex flex-col">
          {/* Chat header */}
          <div className="flex justify-between items-center p-2 border-b border-purple-500/30">
            <div className="flex items-center">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  opacity: isConnected ? [0.7, 1, 0.7] : 0.5
                }}
                transition={{ 
                  rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                  opacity: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                }}
                className="mr-2 text-purple-400"
              >
                <Users size={18} />
              </motion.div>
              <h3 className="text-sm font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Cosmic Chat Room
              </h3>
            </div>
            
            {/* Connection status indicator */}
            <div className="flex items-center">
              {isConnecting ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="text-blue-400 mr-1"
                >
                  <RefreshCw size={14} />
                </motion.div>
              ) : isConnected ? (
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 mr-1">{activeUsers.length} online</span>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              ) : (
                <div className="flex items-center">
                  <AlertTriangle size={14} className="text-red-500 mr-1" />
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Messages area */}
          <ScrollArea className="flex-1 px-2 py-4">
            {messages.length === 0 && !isConnecting ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="text-gray-500 mb-2">No messages yet</div>
                <p className="text-sm text-gray-600">Be the first to start the conversation!</p>
              </div>
            ) : isConnecting ? (
              <div className="space-y-4 p-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-16 w-64" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex items-start space-x-3 ${msg.userId === user?.id ? 'justify-end' : ''}`}
                  >
                    {msg.userId !== user?.id && (
                      <Avatar className={`h-8 w-8 border ${msg.isAdmin ? 'border-red-500' : 'border-blue-500'}`}>
                        <div className="flex h-full w-full items-center justify-center bg-blue-900 text-white">
                          {msg.username.charAt(0).toUpperCase()}
                        </div>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-md ${msg.userId === user?.id ? 'text-right' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${msg.isAdmin ? 'text-red-400' : 'text-blue-400'}`}>
                          {msg.username}
                          {msg.isAdmin && ' (Admin)'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div 
                        className={`mt-1 rounded-lg p-3 text-sm ${
                          msg.userId === user?.id
                            ? 'bg-purple-500/20 border border-purple-500/30 text-purple-100'
                            : msg.isAdmin
                            ? 'bg-red-500/10 border border-red-500/30 text-gray-100'
                            : 'bg-blue-500/10 border border-blue-500/30 text-gray-100'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                    
                    {msg.userId === user?.id && (
                      <Avatar className="h-8 w-8 border border-purple-500">
                        <div className="flex h-full w-full items-center justify-center bg-purple-900 text-white">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
          
          {/* Message input */}
          <div className="p-2 border-t border-purple-500/30">
            <div className="flex items-end space-x-2">
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="min-h-12 bg-gray-900/50 border-purple-500/30 resize-none"
                disabled={!isConnected}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!isConnected || !messageText.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white h-10 w-10"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </ElectricBorder>
      
      {/* Online users sidebar */}
      <div className="w-full mt-4">
        <ElectricBorder
          cornerSize="sm"
          cornerAccentColor="border-blue-500"
          edgeGlowColor="rgba(59, 130, 246, 0.5)"
        >
          <div className="bg-black/60 backdrop-blur-md rounded-md p-3">
            <div className="flex items-center mb-2">
              <User size={14} className="text-blue-400 mr-2" />
              <h4 className="text-xs font-bold text-blue-400">Online Users</h4>
            </div>
            
            <div className="space-y-2">
              {isConnecting ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              ) : activeUsers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {activeUsers.map((user) => (
                    <div 
                      key={user.id}
                      className="flex items-center space-x-1.5 rounded-full bg-blue-950/50 border border-blue-500/30 px-2 py-0.5"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span className="text-xs text-blue-300">{user.username}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No users online</div>
              )}
            </div>
          </div>
        </ElectricBorder>
      </div>
    </div>
  );
}