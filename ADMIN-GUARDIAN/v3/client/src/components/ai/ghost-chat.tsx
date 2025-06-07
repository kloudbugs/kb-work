import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Send, 
  Ghost,
  Zap,
  Shield,
  Brain,
  Activity,
  MessageCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
  guardian?: string;
  aiEntity?: string;
}

interface AIEntity {
  id: string;
  name: string;
  type: 'guardian' | 'ghost' | 'optimizer';
  status: 'active' | 'thinking' | 'offline';
  specialization: string;
  avatar: string;
}

export default function GhostChat() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageInput, setMessageInput] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('ghost-alpha');
  const [isTyping, setIsTyping] = useState(false);

  // Mock AI entities (in real app, this would come from API)
  const [aiEntities] = useState<AIEntity[]>([
    {
      id: 'ghost-alpha',
      name: 'Ghost Alpha',
      type: 'ghost',
      status: 'active',
      specialization: 'Mining Optimization',
      avatar: '👻'
    },
    {
      id: 'tera-guardian-1',
      name: 'TERA Guardian Prime',
      type: 'guardian',
      status: 'active',
      specialization: 'Security & Protection',
      avatar: '🛡️'
    },
    {
      id: 'tera-optimizer',
      name: 'TERA Optimizer',
      type: 'optimizer',
      status: 'thinking',
      specialization: 'Performance Analysis',
      avatar: '⚡'
    },
    {
      id: 'ghost-beta',
      name: 'Ghost Beta',
      type: 'ghost',
      status: 'active',
      specialization: 'Pool Management',
      avatar: '🌙'
    }
  ]);

  // Chat messages state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Ghost Chat System Initialized. TERA Guardian AI entities are ready for communication.',
      timestamp: Date.now() - 300000,
    },
    {
      id: '2',
      type: 'ai',
      content: 'Hello! I\'m Ghost Alpha, your mining optimization specialist. I can help you maximize your hashrate and profitability. What would you like to optimize today?',
      timestamp: Date.now() - 240000,
      aiEntity: 'Ghost Alpha',
    },
    {
      id: '3',
      type: 'ai',
      content: 'TERA Guardian Prime here. I\'m monitoring your security protocols and ensuring optimal protection for your mining operations. All systems are secure.',
      timestamp: Date.now() - 180000,
      aiEntity: 'TERA Guardian Prime',
    }
  ]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: { message: string; entityId: string }) =>
      apiRequest({
        url: '/api/ai/chat',
        method: 'POST',
        data: {
          message: data.message,
          targetEntity: data.entityId,
          userId: 1 // Would come from auth context
        }
      }),
    onSuccess: (response) => {
      // Add AI response to messages
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: response.response || 'I understand your request. Let me analyze the current mining parameters and provide recommendations.',
        timestamp: Date.now(),
        aiEntity: aiEntities.find(e => e.id === selectedEntity)?.name || 'AI Assistant'
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      toast({
        title: "AI Response Received",
        description: `${aiResponse.aiEntity} has responded to your message.`
      });
    },
    onError: () => {
      // Add fallback AI response when API fails
      const fallbackResponse: ChatMessage = {
        id: `fallback-${Date.now()}`,
        type: 'ai',
        content: 'I received your message and I\'m processing your request. Based on current mining data, I recommend checking your hashrate optimization settings and pool connection stability.',
        timestamp: Date.now(),
        aiEntity: aiEntities.find(e => e.id === selectedEntity)?.name || 'AI Assistant'
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
      setIsTyping(false);
    }
  });

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: messageInput,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Send to selected AI entity
    sendMessageMutation.mutate({
      message: messageInput,
      entityId: selectedEntity
    });

    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'ghost': return <Ghost className="w-4 h-4" />;
      case 'guardian': return <Shield className="w-4 h-4" />;
      case 'optimizer': return <Zap className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'thinking': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Entity Selection */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>AI Entity Communication</span>
          </CardTitle>
          <CardDescription>Select an AI entity to communicate with</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {aiEntities.map((entity) => (
              <button
                key={entity.id}
                onClick={() => setSelectedEntity(entity.id)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedEntity === entity.id
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-xl">{entity.avatar}</div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{entity.name}</div>
                    <div className="text-xs text-slate-400">{entity.specialization}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getEntityIcon(entity.type)}
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(entity.status)}`} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center justify-between">
            <span>Ghost Chat - {aiEntities.find(e => e.id === selectedEntity)?.name}</span>
            <Badge className={`${getStatusColor(aiEntities.find(e => e.id === selectedEntity)?.status || 'offline')} text-white`}>
              {aiEntities.find(e => e.id === selectedEntity)?.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages Display */}
          <div className="h-96 overflow-y-auto bg-black/20 rounded-lg p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.type === 'system'
                      ? 'bg-gray-600 text-white text-center w-full max-w-none'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="text-xs text-purple-200 mb-1">
                      {message.aiEntity}
                    </div>
                  )}
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs text-slate-300 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-purple-600 text-white px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm">AI is thinking...</div>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${aiEntities.find(e => e.id === selectedEntity)?.name} about mining optimization...`}
              className="flex-1 p-3 rounded-lg bg-white/10 text-white border border-white/20 resize-none"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || sendMessageMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {[
              'Optimize my hashrate',
              'Check security status',
              'Analyze profitability',
              'Pool recommendations',
              'Hardware temperature check'
            ].map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setMessageInput(action)}
                className="text-xs border-white/20 text-slate-300 hover:bg-white/10"
              >
                {action}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}