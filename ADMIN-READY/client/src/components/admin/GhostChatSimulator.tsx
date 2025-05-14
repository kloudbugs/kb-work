import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Zap, Bot, Activity, Cpu, Database, Upload, Settings, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type SimulatedUser = {
  id: string;
  username: string;
  avatarColor: string;
  isActive: boolean;
  messageFrequency: number; // messages per minute
  lastMessage: number; // timestamp
  personality: 'friendly' | 'technical' | 'excited' | 'curious' | 'skeptical' | 'random';
};

type SimulatedMessage = {
  id: string;
  userId: string;
  username: string;
  avatarColor: string;
  content: string;
  timestamp: Date;
};

// Predefined topics for chat simulation
const CHAT_TOPICS = [
  'mining performance',
  'hardware setups',
  'cooling solutions',
  'energy efficiency',
  'profitability calculations',
  'crypto market trends',
  'new ASIC models',
  'pool strategies',
  'transaction fees',
  'network difficulty',
  'hashrate optimization',
  'mining software',
  'wallet security',
  'Tera token benefits',
  'Bitcoin predictions',
  'mining cafes',
  'cloud mining',
  'rig maintenance',
  'overclocking strategies',
  'KloudBugs Mining Cafe features'
];

// Personality-based message templates
const MESSAGE_TEMPLATES = {
  friendly: [
    "Hey everyone! How's the mining going today?",
    "Just wanted to share that I'm really enjoying the mining cafe experience!",
    "Good vibes in the chat today! Anyone hitting their targets?",
    "Has anyone tried the new feature? It's pretty awesome!",
    "Great to see so many miners online today!",
    "Hope everyone's hashrates are looking good!",
    "Just stopped by to say hello to my fellow miners!",
    "Mining has been super smooth lately, loving the platform!",
    "Anyone else experiencing the great uptime lately?",
    "The community here is so helpful, thanks everyone!"
  ],
  technical: [
    "I'm seeing a 15% increase in hashrate after optimizing my cooling system.",
    "Has anyone analyzed the correlation between ambient temperature and ASIC efficiency?",
    "The new firmware update improved my TH/s by approximately 7.2%.",
    "I've calculated that my ROI will occur in approximately 142 days at current rates.",
    "Looking at the difficulty adjustment algorithm, we should expect a 3.4% increase next cycle.",
    "My power efficiency ratio improved from 0.082 J/GH to 0.078 J/GH after reconfiguring.",
    "The latest Antminer's hash/watt ratio is 23% better than the previous generation.",
    "I've been documenting my overclocking results in a spreadsheet; happy to share my methodology.",
    "Analyzing my last 30 days of data shows a clear correlation between pool size and reward variance.",
    "Has anyone implemented a PID controller for ASIC temperature management?"
  ],
  excited: [
    "OMG my mining rig just found a block!! 🚀🚀🚀",
    "JUST HIT MY HIGHEST HASHRATE EVER!!! So pumped right now!",
    "WOW! Mining rewards are INSANE today! Anyone else seeing this??",
    "I can't believe how FAST this new setup is running! Best decision ever!",
    "THIS IS AMAZING! Just upgraded and my efficiency is through the roof!",
    "YESSSS! Finally got my cooling perfect and temps are BEAUTIFUL!",
    "SO EXCITED about the new platform update! Game changer!!",
    "INCREDIBLE performance today! My best day mining EVER!",
    "JUST BROKE MY PERSONAL RECORD for daily mining profits!!",
    "THIS COMMUNITY IS THE BEST! So glad I found you all!"
  ],
  curious: [
    "Has anyone tried mining with the new S19 XP? Wondering if it's worth the investment.",
    "I'm curious about immersion cooling - has anyone here implemented it?",
    "What's everyone's thought on the next halving impact?",
    "How do you all balance your mining portfolio between different coins?",
    "I'm wondering what pool everyone prefers and why?",
    "Has anyone found a good solution for mining in apartments with limited power?",
    "What metrics do you all use to determine when to upgrade hardware?",
    "I'm curious how many people here are mining full-time vs as a side hustle?",
    "Does anyone have experience with solar power for mining operations?",
    "What's the general consensus on ASIC longevity? How many years do you plan for?"
  ],
  skeptical: [
    "Not sure if the new hardware prices are justified by the performance gains.",
    "I'm doubtful these hashrate numbers are sustainable over the long term.",
    "The power efficiency claims seem exaggerated based on my testing.",
    "I remain unconvinced that cloud mining contracts are profitable after all fees.",
    "The ROI calculations being shared don't account for difficulty increases realistically.",
    "I question whether these new cooling methods actually extend ASIC lifespan.",
    "The market projections seem overly optimistic considering regulatory trends.",
    "I've analyzed the data and I'm skeptical about the claimed power consumption figures.",
    "These mining pool fees appear to have hidden costs not clearly disclosed.",
    "I'm not convinced the extra cost of premium hosting is justified by the uptime difference."
  ],
  random: [] // Will be randomly selected from other categories
};

export function GhostChatSimulator() {
  const { toast } = useToast();
  
  // Chat simulation state
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulatedUsers, setSimulatedUsers] = useState<SimulatedUser[]>([]);
  const [simulatedMessages, setSimulatedMessages] = useState<SimulatedMessage[]>([]);
  const [userCount, setUserCount] = useState(5);
  const [messageFrequency, setMessageFrequency] = useState(10); // messages per minute across all users
  const [currentTopic, setCurrentTopic] = useState(CHAT_TOPICS[0]);
  const [topicChangeInterval, setTopicChangeInterval] = useState(5); // minutes
  const [realisticTyping, setRealisticTyping] = useState(true);
  const [includeRandomReactions, setIncludeRandomReactions] = useState(true);
  
  // Simulation intervals
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);
  const [topicInterval, setTopicInterval] = useState<NodeJS.Timeout | null>(null);
  
  // List of random realistic usernames
  const USERNAMES = [
    'CryptoMiner42', 'HashQueen', 'BlockchainBob', 'ASICmaster', 'BitDigger',
    'MiningPro', 'HashRatePro', 'SatoshiFan', 'TeraHodler', 'MiningRig9',
    'CoinCollector', 'HashPower', 'BlockReward', 'TeraMiner', 'BitFarmer',
    'ChainMiner', 'GPUguru', 'CryptoDigger', 'HashKing', 'TeraFan',
    'BlockExporer', 'MiningPool', 'SatoshiMiner', 'CryptoNaut', 'RigBuilder',
    'HashMaster', 'NodeRunner', 'ValidatorPro', 'TeraStacker', 'CoinMinter',
    'DigitalGold', 'HashHunter', 'BlockGuru', 'Miner49er', 'BitBaron',
    'ChainBuilder', 'GPUminer', 'CryptoFarmer', 'HashChaser', 'TeraTreasure'
  ];
  
  // Avatar background colors
  const AVATAR_COLORS = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-red-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
  ];
  
  // Personality distribution
  const PERSONALITIES: Array<'friendly' | 'technical' | 'excited' | 'curious' | 'skeptical' | 'random'> = [
    'friendly', 'technical', 'excited', 'curious', 'skeptical', 'random'
  ];
  
  // Generate simulated users
  const generateUsers = (count: number) => {
    const newUsers: SimulatedUser[] = [];
    
    // Create a set to track used usernames
    const usedUsernames = new Set();
    
    for (let i = 0; i < count; i++) {
      let username;
      // Ensure unique usernames
      do {
        username = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
      } while (usedUsernames.has(username));
      
      usedUsernames.add(username);
      
      newUsers.push({
        id: `sim-user-${i}`,
        username,
        avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        isActive: true,
        messageFrequency: Math.random() * 5 + 1, // 1-6 messages per minute
        lastMessage: Date.now(),
        personality: PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)]
      });
    }
    
    return newUsers;
  };
  
  // Generate a message based on user personality and current topic
  const generateMessageForUser = (user: SimulatedUser): string => {
    let templates = [...MESSAGE_TEMPLATES[user.personality === 'random' 
      ? PERSONALITIES[Math.floor(Math.random() * (PERSONALITIES.length - 1))] 
      : user.personality]];
    
    // 50% chance to reference the current topic
    if (Math.random() > 0.5 && currentTopic) {
      // Generate a message that includes the current topic
      const topicPhrases = [
        `What does everyone think about ${currentTopic}?`,
        `Has anyone had experience with ${currentTopic} lately?`,
        `I've been studying ${currentTopic} and found some interesting insights.`,
        `${currentTopic} is becoming really important in the mining world.`,
        `I'm looking for advice on ${currentTopic}.`,
        `Just read an article about ${currentTopic} - game changer!`,
        `How does ${currentTopic} affect your mining strategy?`,
        `Thinking of investing more in ${currentTopic}, good idea?`,
        `${currentTopic} seems to be trending in the mining community.`,
        `Need help understanding ${currentTopic} better.`
      ];
      
      // Randomly select a topic phrase
      templates.push(topicPhrases[Math.floor(Math.random() * topicPhrases.length)]);
    }
    
    // Select a random template from the available ones
    return templates[Math.floor(Math.random() * templates.length)];
  };
  
  // Start the chat simulation
  const startSimulation = () => {
    if (isSimulationRunning) return;
    
    // Generate users
    const users = generateUsers(userCount);
    setSimulatedUsers(users);
    
    // Clear previous messages
    setSimulatedMessages([]);
    
    // Set initial topic
    const initialTopic = CHAT_TOPICS[Math.floor(Math.random() * CHAT_TOPICS.length)];
    setCurrentTopic(initialTopic);
    
    // Start topic change interval
    const topicInt = setInterval(() => {
      const newTopic = CHAT_TOPICS[Math.floor(Math.random() * CHAT_TOPICS.length)];
      setCurrentTopic(newTopic);
      
      // Announce topic change with system message
      const systemMessage: SimulatedMessage = {
        id: `system-${Date.now()}`,
        userId: 'system',
        username: 'System',
        avatarColor: 'bg-blue-500',
        content: `The conversation has shifted to "${newTopic}".`,
        timestamp: new Date()
      };
      
      setSimulatedMessages(prev => [...prev, systemMessage]);
      
      // Optionally notify in chat about topic change
      if (Math.random() > 0.7) {
        const announcer = users[Math.floor(Math.random() * users.length)];
        const announceMessage = [
          `Hey, let's talk about ${newTopic}!`,
          `Anyone interested in discussing ${newTopic}?`,
          `I've been thinking about ${newTopic} lately.`,
          `What are your thoughts on ${newTopic}?`,
          `Can we explore ${newTopic} for a bit?`
        ];
        
        const message: SimulatedMessage = {
          id: `msg-${Date.now()}-${Math.random()}`,
          userId: announcer.id,
          username: announcer.username,
          avatarColor: announcer.avatarColor,
          content: announceMessage[Math.floor(Math.random() * announceMessage.length)],
          timestamp: new Date()
        };
        
        setSimulatedMessages(prev => [...prev, message]);
      }
      
    }, topicChangeInterval * 60 * 1000);
    
    setTopicInterval(topicInt);
    
    // Calculate average message delay based on frequency
    const avgMessageDelay = 60000 / messageFrequency;
    
    // Start message generation interval
    const msgInt = setInterval(() => {
      // Randomly select a user to send a message
      const activeUsers = users.filter(user => user.isActive);
      if (activeUsers.length === 0) return;
      
      const user = activeUsers[Math.floor(Math.random() * activeUsers.length)];
      
      // Check if it's time for this user to send a message based on their frequency
      const now = Date.now();
      const userMessageDelay = 60000 / user.messageFrequency;
      
      if (now - user.lastMessage >= userMessageDelay) {
        // Generate message content
        const content = generateMessageForUser(user);
        
        // Create the message
        const message: SimulatedMessage = {
          id: `msg-${now}-${Math.random()}`,
          userId: user.id,
          username: user.username,
          avatarColor: user.avatarColor,
          content,
          timestamp: new Date()
        };
        
        // Update user's last message time
        setSimulatedUsers(prev => 
          prev.map(u => u.id === user.id ? { ...u, lastMessage: now } : u)
        );
        
        // Add the new message
        setSimulatedMessages(prev => {
          const updated = [...prev, message];
          // Keep only the last 100 messages for performance
          return updated.slice(-100);
        });
        
        // Simulate reactions to messages
        if (includeRandomReactions && Math.random() > 0.7) {
          // Random delay for reaction (0.5 to 3 seconds)
          setTimeout(() => {
            const reactors = activeUsers.filter(u => u.id !== user.id);
            if (reactors.length === 0) return;
            
            const reactor = reactors[Math.floor(Math.random() * reactors.length)];
            
            const reactions = [
              `@${user.username} Interesting point!`,
              `@${user.username} I totally agree with that.`,
              `@${user.username} Not sure I follow, can you explain?`,
              `@${user.username} That's exactly what I was thinking!`,
              `@${user.username} Have you considered trying a different approach?`,
              `@${user.username} Thanks for sharing that insight.`,
              `@${user.username} That's been my experience too.`,
              `@${user.username} Where did you learn that?`,
              `@${user.username} That's a game changer!`,
              `@${user.username} Do you have any resources on that topic?`
            ];
            
            const reactionMessage: SimulatedMessage = {
              id: `msg-${Date.now()}-${Math.random()}`,
              userId: reactor.id,
              username: reactor.username,
              avatarColor: reactor.avatarColor,
              content: reactions[Math.floor(Math.random() * reactions.length)],
              timestamp: new Date()
            };
            
            setSimulatedMessages(prev => {
              const updated = [...prev, reactionMessage];
              return updated.slice(-100);
            });
            
            // Update reactor's last message time
            setSimulatedUsers(prev => 
              prev.map(u => u.id === reactor.id ? { ...u, lastMessage: Date.now() } : u)
            );
            
          }, Math.random() * 2500 + 500);
        }
      }
    }, avgMessageDelay);
    
    setSimulationInterval(msgInt);
    setIsSimulationRunning(true);
    
    toast({
      title: "Ghost Chat Simulation Started",
      description: `Simulating ${userCount} users discussing mining topics.`,
    });
  };
  
  // Stop the chat simulation
  const stopSimulation = () => {
    if (!isSimulationRunning) return;
    
    // Clear intervals
    if (simulationInterval) clearInterval(simulationInterval);
    if (topicInterval) clearInterval(topicInterval);
    
    setSimulationInterval(null);
    setTopicInterval(null);
    setIsSimulationRunning(false);
    
    toast({
      title: "Ghost Chat Simulation Stopped",
      description: "The simulated chat activity has been halted.",
    });
  };
  
  // Reset the simulation
  const resetSimulation = () => {
    stopSimulation();
    setSimulatedMessages([]);
    setSimulatedUsers([]);
    setCurrentTopic(CHAT_TOPICS[0]);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval) clearInterval(simulationInterval);
      if (topicInterval) clearInterval(topicInterval);
    };
  }, [simulationInterval, topicInterval]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Configuration Card */}
        <Card className="md:col-span-1 bg-gray-900/70 border-cyan-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-cyan-400" />
              Simulation Settings
            </CardTitle>
            <CardDescription>
              Configure the ghost chat simulation parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="user-count">Simulated Users</Label>
                <Badge variant="outline">{userCount}</Badge>
              </div>
              <Slider
                id="user-count"
                min={2}
                max={20}
                step={1}
                value={[userCount]}
                onValueChange={(val) => setUserCount(val[0])}
                disabled={isSimulationRunning}
              />
              <p className="text-xs text-gray-400">Number of AI users to simulate in the chat</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="message-frequency">Message Frequency</Label>
                <Badge variant="outline">{messageFrequency}/min</Badge>
              </div>
              <Slider
                id="message-frequency"
                min={1}
                max={60}
                step={1}
                value={[messageFrequency]}
                onValueChange={(val) => setMessageFrequency(val[0])}
                disabled={isSimulationRunning}
              />
              <p className="text-xs text-gray-400">Messages per minute across all users</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="topic-interval">Topic Change Interval</Label>
                <Badge variant="outline">{topicChangeInterval} min</Badge>
              </div>
              <Slider
                id="topic-interval"
                min={1}
                max={15}
                step={1}
                value={[topicChangeInterval]}
                onValueChange={(val) => setTopicChangeInterval(val[0])}
                disabled={isSimulationRunning}
              />
              <p className="text-xs text-gray-400">How often the discussion topic changes</p>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="realistic-typing" 
                    checked={realisticTyping}
                    onCheckedChange={(checked) => setRealisticTyping(checked as boolean)}
                    disabled={isSimulationRunning}
                  />
                  <Label htmlFor="realistic-typing">Realistic Typing</Label>
                </div>
                <Switch 
                  checked={realisticTyping} 
                  onCheckedChange={setRealisticTyping}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="random-reactions" 
                    checked={includeRandomReactions}
                    onCheckedChange={(checked) => setIncludeRandomReactions(checked as boolean)}
                    disabled={isSimulationRunning}
                  />
                  <Label htmlFor="random-reactions">Include Reactions</Label>
                </div>
                <Switch 
                  checked={includeRandomReactions} 
                  onCheckedChange={setIncludeRandomReactions}
                  disabled={isSimulationRunning}
                />
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label htmlFor="current-topic">Current Topic</Label>
              <Select
                value={currentTopic}
                onValueChange={setCurrentTopic}
                disabled={isSimulationRunning}
              >
                <SelectTrigger id="current-topic">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {CHAT_TOPICS.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">The main topic users will discuss</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {!isSimulationRunning ? (
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700"
                onClick={startSimulation}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Simulation
              </Button>
            ) : (
              <Button 
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700"
                onClick={stopSimulation}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause Simulation
              </Button>
            )}
            
            <Button 
              variant="outline"
              className="w-full border-gray-700 text-gray-300"
              onClick={resetSimulation}
            >
              Reset Simulation
            </Button>
          </CardFooter>
        </Card>
        
        {/* Simulated Chat Card */}
        <Card className="md:col-span-2 bg-gray-900/70 border-cyan-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-cyan-400" />
              Ghost Chat Preview
            </CardTitle>
            <CardDescription>
              AI-simulated chat activity with {simulatedUsers.length} virtual users
            </CardDescription>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isSimulationRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-gray-400">
                  {isSimulationRunning ? 'Simulation Running' : 'Simulation Stopped'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-gray-400">
                  Topic: <span className="text-cyan-400">{currentTopic}</span>
                </span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <ScrollArea className="h-[450px] pr-4">
              <div className="space-y-4">
                {simulatedMessages.length > 0 ? (
                  simulatedMessages.map(message => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className={message.avatarColor}>
                          {message.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{message.username}</span>
                          {message.userId === 'system' && (
                            <Badge variant="outline" className="text-xs">System</Badge>
                          )}
                          <span className="text-xs text-gray-400">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <p className={`mt-1 ${message.userId === 'system' ? 'text-cyan-400 italic' : 'text-gray-200'}`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 text-gray-500">
                    <Bot className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                    <p>No simulated messages yet.</p>
                    <p className="text-sm mt-1">Start the simulation to generate ghost chat activity.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="border-t border-gray-800 pt-3">
            <div className="w-full flex items-center gap-2">
              <div className="flex gap-1">
                <Badge className="bg-blue-600">{simulatedMessages.length}</Badge>
                <span className="text-xs text-gray-400">messages</span>
              </div>
              <div className="h-4 w-px bg-gray-700"></div>
              <div className="flex gap-1">
                <Badge className="bg-green-600">{simulatedUsers.filter(u => u.isActive).length}</Badge>
                <span className="text-xs text-gray-400">active users</span>
              </div>
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-gray-400"
                  onClick={() => setSimulatedMessages([])}
                  disabled={simulatedMessages.length === 0}
                >
                  Clear Chat
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Stats Card */}
      {simulatedUsers.length > 0 && (
        <Card className="bg-gray-900/70 border-cyan-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              Simulated Users
            </CardTitle>
            <CardDescription>
              Details of AI-generated users participating in the ghost chat
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {simulatedUsers.map(user => (
                <div key={user.id} className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={user.avatarColor}>
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.username}</span>
                        <div className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {user.personality}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {user.messageFrequency.toFixed(1)} msg/min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}