import React, { useState, useEffect, useRef } from 'react';
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
  Textarea 
} from '@/components/ui/textarea';
import { 
  Switch 
} from '@/components/ui/switch';
import { 
  Label 
} from '@/components/ui/label';
import {
  Separator
} from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Badge 
} from '@/components/ui/badge';
import { 
  Bot, 
  Brain, 
  Command, 
  Sparkles, 
  Code, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Send, 
  Loader2, 
  Mic, 
  World, 
  Bookmark, 
  Glasses, 
  Upload, 
  Save, 
  Terminal,
  History,
  Trash2,
  Globe,
  Settings,
  BrainCircuit,
  List,
  ShieldAlert,
  Edit3,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  LucideIcon,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface KloudAIControllerProps {
  className?: string;
}

// AI capability levels
const AI_CAPABILITY_LEVELS = [
  { id: 'basic', name: 'Basic Control', description: 'Simple command processing for environment changes' },
  { id: 'advanced', name: 'Advanced Control', description: 'Complex operations with multi-step processes' },
  { id: 'full', name: 'Full System Control', description: 'Complete access to all VR and system functions' },
  { id: 'autonomous', name: 'Autonomous Mode', description: 'AI operates independently with minimal supervision' }
];

// AI command categories
const COMMAND_CATEGORIES = [
  { id: 'environment', name: 'Environment Control', icon: World },
  { id: 'users', name: 'User Management', icon: Glasses },
  { id: 'data', name: 'Data Visualization', icon: BrainCircuit },
  { id: 'system', name: 'System Operations', icon: Settings },
  { id: 'security', name: 'Security Controls', icon: ShieldAlert },
  { id: 'content', name: 'Content Management', icon: Edit3 }
];

// Sample command history/templates
const SAMPLE_COMMANDS = [
  { id: '1', text: 'Change environment to Neural Network and activate particle flow effects', category: 'environment' },
  { id: '2', text: 'Show real-time mining hashrate as floating 3D holograms for all users', category: 'data' },
  { id: '3', text: 'Simulate blockchain transaction flow in the center of the environment', category: 'data' },
  { id: '4', text: 'Switch to presenter mode and gather all users to main display area', category: 'users' },
  { id: '5', text: 'Create an orbital display of all active mining nodes with status indicators', category: 'data' },
  { id: '6', text: 'Activate voice command recognition for administrator users only', category: 'system' },
  { id: '7', text: 'Launch the emergency security protocol and restrict access to sensitive areas', category: 'security' },
  { id: '8', text: 'Display the KLOUD-BUGS-VR logo as a massive floating hologram', category: 'content' },
  { id: '9', text: 'Run a system-wide diagnostic and report any performance issues', category: 'system' },
  { id: '10', text: 'Create a virtual conference room with seating for 20 participants', category: 'environment' }
];

// Command log entry interface
interface CommandLogEntry {
  id: string;
  timestamp: Date;
  command: string;
  response: string;
  status: 'success' | 'error' | 'pending';
  category: string;
}

// AI command context interface
interface AICommandContext {
  systemName: string;
  aiCapabilityLevel: string;
  environmentType: string;
  userCount: number;
  activeFeatures: string[];
  securityLevel: string;
  lastCommand?: string;
  temperature: number;
}

export function KloudAIController({ className = '' }: KloudAIControllerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const commandInputRef = useRef<HTMLTextAreaElement>(null);
  
  // State
  const [commandInput, setCommandInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiCapabilityLevel, setAiCapabilityLevel] = useState('advanced');
  const [commandHistory, setCommandHistory] = useState<CommandLogEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastExecutionTime, setLastExecutionTime] = useState<Date | null>(null);
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [aiSecurityLevel, setAiSecurityLevel] = useState('standard');
  const [bookmarkedCommands, setBookmarkedCommands] = useState<string[]>([]);
  const [systemStatus, setSystemStatus] = useState<{[key: string]: boolean}>({
    environmentControl: true,
    userManagement: true,
    dataVisualization: true,
    securityControls: true,
    voiceCommands: false,
    autonomousMode: false
  });
  
  // Default AI context
  const defaultContext: AICommandContext = {
    systemName: 'KLOUD-BUGS-VR',
    aiCapabilityLevel: aiCapabilityLevel,
    environmentType: 'Neural Network',
    userCount: 24,
    activeFeatures: ['Holographic Projections', 'Real-time Data Visualization', 'Voice Commands'],
    securityLevel: aiSecurityLevel,
    temperature: aiTemperature
  };
  
  const [aiContext, setAiContext] = useState<AICommandContext>(defaultContext);
  
  // Load state from localStorage on mount
  useEffect(() => {
    const storedContext = localStorage.getItem('kloudAIContext');
    if (storedContext) {
      try {
        setAiContext(JSON.parse(storedContext));
      } catch (e) {
        console.error('Error parsing AI context:', e);
      }
    }
    
    const storedHistory = localStorage.getItem('kloudAICommandHistory');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        // Convert string timestamps back to Date objects
        const historyWithDates = parsedHistory.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setCommandHistory(historyWithDates);
      } catch (e) {
        console.error('Error parsing command history:', e);
      }
    }
    
    const storedBookmarks = localStorage.getItem('kloudAIBookmarkedCommands');
    if (storedBookmarks) {
      try {
        setBookmarkedCommands(JSON.parse(storedBookmarks));
      } catch (e) {
        console.error('Error parsing bookmarked commands:', e);
      }
    }
  }, []);
  
  // Save AI context to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('kloudAIContext', JSON.stringify(aiContext));
  }, [aiContext]);
  
  // Save command history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('kloudAICommandHistory', JSON.stringify(commandHistory));
  }, [commandHistory]);
  
  // Save bookmarked commands to localStorage when they change
  useEffect(() => {
    localStorage.setItem('kloudAIBookmarkedCommands', JSON.stringify(bookmarkedCommands));
  }, [bookmarkedCommands]);
  
  // Update AI context when capability level changes
  useEffect(() => {
    setAiContext(prev => ({...prev, aiCapabilityLevel}));
  }, [aiCapabilityLevel]);
  
  // State for reviewing suggested commands
  const [pendingCommand, setPendingCommand] = useState<{
    id: string;
    originalCommand: string;
    suggestedResponse: string;
    editedResponse: string;
    category: string;
  } | null>(null);

  // Handle command submission
  const handleCommandSubmit = () => {
    if (!commandInput.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    // Create a new command log entry
    const newCommandId = Date.now().toString();
    const newCommand: CommandLogEntry = {
      id: newCommandId,
      timestamp: new Date(),
      command: commandInput,
      response: '',
      status: 'pending',
      category: determineCommandCategory(commandInput)
    };
    
    // Add to command history
    setCommandHistory(prev => [newCommand, ...prev]);
    
    // Reset input
    setCommandInput('');
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Process the command (in a real app, this would call an AI service)
      const suggestedResponse = processAICommand(commandInput);
      
      // Instead of executing immediately, set up for review
      setPendingCommand({
        id: newCommandId,
        originalCommand: newCommand.command,
        suggestedResponse: suggestedResponse,
        editedResponse: suggestedResponse, // Initially the same as suggested
        category: newCommand.category
      });
      
      // Keep processing state active until approval
      // But update the history entry to show it's waiting for approval
      setCommandHistory(prev => 
        prev.map(entry => 
          entry.id === newCommandId 
            ? { 
                ...entry, 
                response: 'Awaiting your approval before executing...',
                status: 'pending'
              } 
            : entry
        )
      );
      
      // Show toast notification
      toast({
        title: "Review Required",
        description: "Please review the AI's suggested command before execution.",
        duration: 3000,
      });
    }, 2000);
  };
  
  // Handle approval of a pending command
  const approveCommand = () => {
    if (!pendingCommand) return;
    
    // Execute the approved command
    const { id, originalCommand, editedResponse } = pendingCommand;
    
    // Update the command entry with the approved response
    setCommandHistory(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { 
              ...entry, 
              response: editedResponse,
              status: 'success'
            } 
          : entry
      )
    );
    
    // Update last execution time
    setLastExecutionTime(new Date());
    
    // Update AI context with last command
    setAiContext(prev => ({...prev, lastCommand: originalCommand}));
    
    // Show toast notification
    toast({
      title: "Command Executed",
      description: "Your approved command has been executed successfully.",
      duration: 3000,
    });
    
    // Clear the pending command
    setPendingCommand(null);
    setIsProcessing(false);
    
    // Update UI by invalidating queries
    queryClient.invalidateQueries({ queryKey: ['/api/network/vr'] });
  };
  
  // Handle rejection of a pending command
  const rejectCommand = () => {
    if (!pendingCommand) return;
    
    // Update the command entry to show it was rejected
    setCommandHistory(prev => 
      prev.map(entry => 
        entry.id === pendingCommand.id 
          ? { 
              ...entry, 
              response: 'Command rejected by administrator.',
              status: 'error'
            } 
          : entry
      )
    );
    
    // Show toast notification
    toast({
      title: "Command Rejected",
      description: "The command was rejected and not executed.",
      duration: 3000,
    });
    
    // Clear the pending command
    setPendingCommand(null);
    setIsProcessing(false);
  };
  
  // Process AI command (mock implementation)
  const processAICommand = (command: string): string => {
    // In a real application, this would call an AI service
    // For now, we'll return predefined responses based on keywords
    
    const lowercaseCommand = command.toLowerCase();
    
    if (lowercaseCommand.includes('environment') && lowercaseCommand.includes('change')) {
      return "Environment updated successfully. All users will see the new environment within 5 seconds.";
    }
    
    if (lowercaseCommand.includes('hologram') || lowercaseCommand.includes('display')) {
      return "Holographic display activated. Data visualization is now visible to all users in the specified format.";
    }
    
    if (lowercaseCommand.includes('user') && (lowercaseCommand.includes('manage') || lowercaseCommand.includes('gather'))) {
      return "User management command executed. Affected users have been notified of the changes.";
    }
    
    if (lowercaseCommand.includes('security') || lowercaseCommand.includes('restrict')) {
      return "Security protocols updated. Access controls have been modified according to your specifications.";
    }
    
    if (lowercaseCommand.includes('diagnostic') || lowercaseCommand.includes('performance')) {
      return "System diagnostic complete. All systems operating at optimal efficiency. No issues detected.";
    }
    
    // Default response
    return "Command executed successfully. The KLOUD-BUGS-VR system has been updated according to your instructions.";
  };
  
  // Determine command category based on content
  const determineCommandCategory = (command: string): string => {
    const lowercaseCommand = command.toLowerCase();
    
    if (lowercaseCommand.includes('environment') || lowercaseCommand.includes('world') || lowercaseCommand.includes('scene')) {
      return 'environment';
    }
    
    if (lowercaseCommand.includes('user') || lowercaseCommand.includes('participant') || lowercaseCommand.includes('people')) {
      return 'users';
    }
    
    if (lowercaseCommand.includes('data') || lowercaseCommand.includes('visualization') || lowercaseCommand.includes('display')) {
      return 'data';
    }
    
    if (lowercaseCommand.includes('system') || lowercaseCommand.includes('performance') || lowercaseCommand.includes('diagnostic')) {
      return 'system';
    }
    
    if (lowercaseCommand.includes('security') || lowercaseCommand.includes('protect') || lowercaseCommand.includes('restrict')) {
      return 'security';
    }
    
    if (lowercaseCommand.includes('content') || lowercaseCommand.includes('media') || lowercaseCommand.includes('asset')) {
      return 'content';
    }
    
    // Default to environment
    return 'environment';
  };
  
  // Get category icon
  const getCategoryIcon = (categoryId: string): LucideIcon => {
    const category = COMMAND_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.icon : World;
  };
  
  // Toggle bookmark for a command
  const toggleBookmark = (command: string) => {
    if (bookmarkedCommands.includes(command)) {
      setBookmarkedCommands(prev => prev.filter(cmd => cmd !== command));
    } else {
      setBookmarkedCommands(prev => [...prev, command]);
    }
  };
  
  // Clear command history
  const clearCommandHistory = () => {
    setCommandHistory([]);
    toast({
      title: "History Cleared",
      description: "Command history has been cleared.",
      duration: 3000,
    });
  };
  
  // Use a sample command
  const useSampleCommand = (command: string) => {
    setCommandInput(command);
    
    // Focus the input
    if (commandInputRef.current) {
      commandInputRef.current.focus();
    }
  };
  
  // Format timestamp
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  // Toggle system feature
  const toggleSystemFeature = (feature: string) => {
    setSystemStatus(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    
    // Show toast notification
    toast({
      title: `${systemStatus[feature] ? 'Disabled' : 'Enabled'} ${formatFeatureName(feature)}`,
      description: `The feature has been ${systemStatus[feature] ? 'disabled' : 'enabled'} successfully.`,
      duration: 3000,
    });
  };
  
  // Format feature name for display
  const formatFeatureName = (feature: string): string => {
    return feature
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };
  
  return (
    <Card className={`w-full bg-gradient-to-br from-gray-900/80 to-violet-900/20 backdrop-blur-sm border border-violet-800/50 ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-violet-900/50 p-2">
              <BrainCircuit className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                KLOUD-BUGS-VR AI Controller
                {aiEnabled ? (
                  <Badge className="ml-2 bg-green-600 animate-pulse">Active</Badge>
                ) : (
                  <Badge className="ml-2 bg-red-600">Disabled</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Control the entire virtual reality system with natural language commands
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center">
            <Label htmlFor="ai-enabled" className="mr-2">AI Control</Label>
            <Switch
              id="ai-enabled"
              checked={aiEnabled}
              onCheckedChange={setAiEnabled}
            />
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="flex items-center">
            <Badge className="bg-gray-700 hover:bg-violet-700 cursor-pointer" onClick={() => setShowHistory(!showHistory)}>
              <History className="h-3 w-3 mr-1" />
              {commandHistory.length} Commands
            </Badge>
            {lastExecutionTime && (
              <span className="text-xs text-gray-400 ml-2">
                Last: {formatTimestamp(lastExecutionTime)}
              </span>
            )}
          </div>
          
          <div>
            <Select value={aiCapabilityLevel} onValueChange={setAiCapabilityLevel}>
              <SelectTrigger className="h-8 text-xs bg-gray-800 border-gray-700">
                <SelectValue placeholder="AI Capability Level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {AI_CAPABILITY_LEVELS.map(level => (
                  <SelectItem key={level.id} value={level.id}>
                    <div className="flex flex-col">
                      <span>{level.name}</span>
                      <span className="text-xs text-gray-400">{level.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={aiSecurityLevel} onValueChange={setAiSecurityLevel}>
              <SelectTrigger className="h-8 text-xs bg-gray-800 border-gray-700">
                <SelectValue placeholder="Security Level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="low">
                  <div className="flex items-center">
                    <Lock className="h-3 w-3 mr-1 text-yellow-500" />
                    <span>Low Security</span>
                  </div>
                </SelectItem>
                <SelectItem value="standard">
                  <div className="flex items-center">
                    <Lock className="h-3 w-3 mr-1 text-blue-500" />
                    <span>Standard Security</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center">
                    <Lock className="h-3 w-3 mr-1 text-green-500" />
                    <span>High Security</span>
                  </div>
                </SelectItem>
                <SelectItem value="maximum">
                  <div className="flex items-center">
                    <Lock className="h-3 w-3 mr-1 text-red-500" />
                    <span>Maximum Security</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Command input area */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Command className="h-5 w-5" />
              </div>
              <Textarea
                ref={commandInputRef}
                placeholder="Enter your command for the KLOUD-BUGS-VR system..."
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="pl-10 resize-none h-[80px] bg-gray-800 border-gray-700"
                disabled={!aiEnabled || isProcessing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCommandSubmit();
                  }
                }}
              />
              {commandInput && (
                <div 
                  className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-300"
                  onClick={() => setCommandInput('')}
                >
                  <XCircle className="h-5 w-5" />
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {COMMAND_CATEGORIES.map(category => {
                const CategoryIcon = category.icon;
                return (
                  <Badge 
                    key={category.id}
                    className="bg-gray-800 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setCommandInput(prev => 
                        prev ? `${prev} [${category.name}]` : `[${category.name}]: `
                      );
                      // Focus the input
                      if (commandInputRef.current) {
                        commandInputRef.current.focus();
                      }
                    }}
                  >
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {category.name}
                  </Badge>
                );
              })}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs"
              >
                {showHistory ? (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Hide History
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Show History
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleCommandSubmit}
                disabled={!aiEnabled || isProcessing || !commandInput.trim()}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Execute Command
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Command history */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-300 flex items-center">
                    <History className="h-4 w-4 mr-2" />
                    Command History
                  </h3>
                  {commandHistory.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearCommandHistory}
                      className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
                
                {commandHistory.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No commands have been executed yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {commandHistory.map((entry) => {
                      const CategoryIcon = getCategoryIcon(entry.category);
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`rounded-md border p-3 ${
                            entry.status === 'pending' 
                              ? 'bg-gray-800/70 border-gray-700' 
                              : entry.status === 'success'
                                ? 'bg-gray-800/70 border-gray-700'
                                : 'bg-red-900/20 border-red-800/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="h-4 w-4 text-violet-400" />
                              <span className="font-medium">
                                {COMMAND_CATEGORIES.find(cat => cat.id === entry.category)?.name || 'Command'}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatTimestamp(entry.timestamp)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {entry.status === 'pending' ? (
                                <Badge className="bg-yellow-600">
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  Processing
                                </Badge>
                              ) : entry.status === 'success' ? (
                                <Badge className="bg-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Success
                                </Badge>
                              ) : (
                                <Badge className="bg-red-600">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Failed
                                </Badge>
                              )}
                              
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleBookmark(entry.command)}
                              >
                                <Bookmark 
                                  className={`h-4 w-4 ${
                                    bookmarkedCommands.includes(entry.command) 
                                      ? 'text-yellow-400 fill-yellow-400' 
                                      : 'text-gray-500'
                                  }`} 
                                />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex items-start gap-2">
                              <div className="min-w-6 mt-1">
                                <Send className="h-3.5 w-3.5 text-blue-400" />
                              </div>
                              <p className="text-sm">{entry.command}</p>
                            </div>
                            
                            {entry.status !== 'pending' && (
                              <div className="flex items-start gap-2">
                                <div className="min-w-6 mt-1">
                                  <Bot className="h-3.5 w-3.5 text-violet-400" />
                                </div>
                                <p className="text-sm text-gray-300">{entry.response}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2 flex justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => useSampleCommand(entry.command)}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Reuse
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* System status and control */}
          <div className="pt-3">
            <h3 className="text-sm font-medium text-gray-300 flex items-center mb-3">
              <Settings className="h-4 w-4 mr-2" />
              System Status & Control
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(systemStatus).map(([feature, enabled]) => (
                <div
                  key={feature}
                  className={`p-3 rounded-md border cursor-pointer ${
                    enabled ? 'border-green-500 bg-green-900/10' : 'border-gray-700 bg-gray-800/50'
                  }`}
                  onClick={() => toggleSystemFeature(feature)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{formatFeatureName(feature)}</span>
                    <Switch
                      checked={enabled}
                      className="scale-75 origin-right"
                      onCheckedChange={() => toggleSystemFeature(feature)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick commands */}
          <div className="pt-3">
            <h3 className="text-sm font-medium text-gray-300 flex items-center mb-3">
              <Lightbulb className="h-4 w-4 mr-2" />
              Quick Command Examples
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SAMPLE_COMMANDS.slice(0, 6).map(cmd => (
                <div
                  key={cmd.id}
                  className="p-2 rounded-md bg-gray-800/70 border border-gray-700 hover:border-violet-600 cursor-pointer flex items-center"
                  onClick={() => useSampleCommand(cmd.text)}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                    {getCategoryIcon(cmd.category)({ className: "h-4 w-4 text-violet-400" })}
                  </div>
                  <p className="text-sm line-clamp-1">{cmd.text}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Integration with Replit */}
          <div className="mt-4 p-4 rounded-md bg-gradient-to-r from-slate-900 to-blue-900/30 border border-blue-800/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                <Code className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-md font-bold">Replit Integration</h3>
                <p className="text-sm text-gray-400">Use Replit's powerful cloud infrastructure to enhance KLOUD-BUGS-VR</p>
              </div>
            </div>
            
            <div className="mt-3 ml-2 text-sm text-gray-300">
              <p className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                AI processing powered by Replit infrastructure
              </p>
              <p className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Real-time code execution and system modifications
              </p>
              <p className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Seamless deployment and accessibility across devices
              </p>
            </div>
            
            <div className="mt-3 text-center">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Globe className="h-4 w-4 mr-2" />
                Enable Global Replit Deployment
              </Button>
              <p className="text-xs text-gray-400 mt-1">
                Deploy this virtual reality system globally using Replit's cloud infrastructure
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center text-sm text-gray-400 sm:mr-auto">
          <Sparkles className="h-4 w-4 mr-2 text-violet-400" />
          {aiEnabled ? (
            <span>AI Controller is ready to assist you</span>
          ) : (
            <span>AI Controller is currently disabled</span>
          )}
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none border-violet-800"
            onClick={() => {
              setAiContext(defaultContext);
              toast({
                title: "AI Context Reset",
                description: "The AI context has been reset to default values.",
                duration: 3000,
              });
            }}
          >
            Reset AI
          </Button>
          
          <Button 
            className="flex-1 sm:flex-none bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            onClick={() => {
              // Save current context
              localStorage.setItem('kloudAIContext', JSON.stringify(aiContext));
              toast({
                title: "Settings Saved",
                description: "AI controller settings have been saved.",
                duration: 3000,
              });
            }}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default KloudAIController;