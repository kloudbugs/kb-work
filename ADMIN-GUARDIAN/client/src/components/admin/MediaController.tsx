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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Youtube, 
  BarChart3, 
  FileCode,
  Globe,
  Image,
  PlayCircle,
  Monitor,
  Laptop,
  Smartphone,
  Tv,
  Maximize2,
  X,
  Eye,
  EyeOff,
  Loader2,
  PictureInPicture,
  Layout,
  Layers,
  Projector,
  Grid3X3,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface MediaControllerProps {
  className?: string;
}

// Media content types
const MEDIA_TYPES = [
  { id: 'youtube', name: 'YouTube Video', icon: <Youtube className="h-4 w-4" /> },
  { id: 'webpage', name: 'Webpage / URL', icon: <Globe className="h-4 w-4" /> },
  { id: 'chart', name: 'Trading Chart', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'image', name: 'Image', icon: <Image className="h-4 w-4" /> },
  { id: 'video', name: 'Video URL', icon: <PlayCircle className="h-4 w-4" /> },
  { id: 'embed', name: 'Custom Embed', icon: <FileCode className="h-4 w-4" /> },
];

// Display modes
const DISPLAY_MODES = [
  { id: 'fullscreen', name: 'Fullscreen', icon: <Maximize2 className="h-4 w-4" /> },
  { id: 'overlay', name: 'Overlay', icon: <Layers className="h-4 w-4" /> },
  { id: 'pip', name: 'Picture-in-Picture', icon: <PictureInPicture className="h-4 w-4" /> },
  { id: 'split', name: 'Split Screen', icon: <Layout className="h-4 w-4" /> },
  { id: 'grid', name: 'Grid View', icon: <Grid3X3 className="h-4 w-4" /> },
];

// Target devices
const TARGET_DEVICES = [
  { id: 'all', name: 'All Devices', icon: <Monitor className="h-4 w-4" /> },
  { id: 'desktop', name: 'Desktop Only', icon: <Laptop className="h-4 w-4" /> },
  { id: 'mobile', name: 'Mobile Only', icon: <Smartphone className="h-4 w-4" /> },
  { id: 'large', name: 'Large Screens', icon: <Tv className="h-4 w-4" /> },
];

// Suggested media examples
const MEDIA_EXAMPLES = [
  { 
    type: 'youtube', 
    name: 'Bitcoin Mining Explained', 
    url: 'https://www.youtube.com/embed/GmOzih6I1zs' 
  },
  { 
    type: 'youtube', 
    name: 'Crypto Market Analysis', 
    url: 'https://www.youtube.com/embed/0cAFkY6nRMc' 
  },
  { 
    type: 'chart', 
    name: 'Bitcoin Live Chart', 
    url: 'https://s.tradingview.com/widgetembed/?frameElementId=tradingview_76d87&symbol=BITSTAMP%3ABTCUSD&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=F1F3F6&studies=%5B%5D&theme=Dark&style=1&timezone=Etc%2FUTC' 
  },
  { 
    type: 'webpage', 
    name: 'Crypto News', 
    url: 'https://cointelegraph.com/' 
  },
  { 
    type: 'image', 
    name: 'Mining Hardware Comparison', 
    url: '/assets/mining-comparison.jpg' 
  },
];

// Active media session type
interface MediaSession {
  id: string;
  type: string;
  title: string;
  url: string;
  displayMode: string;
  targetDevices: string;
  startTime: Date;
  isActive: boolean;
}

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export function MediaController({ className = '' }: MediaControllerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Media state
  const [mediaType, setMediaType] = useState('youtube');
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [displayMode, setDisplayMode] = useState('overlay');
  const [targetDevices, setTargetDevices] = useState('all');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeSession, setActiveSession] = useState<MediaSession | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('url');
  const [showControls, setShowControls] = useState(true);
  
  // Load active session from localStorage on mount
  useEffect(() => {
    const storedSession = localStorage.getItem('activeMediaSession');
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        // Convert string date back to Date object
        parsedSession.startTime = new Date(parsedSession.startTime);
        setActiveSession(parsedSession);
        setIsStreaming(parsedSession.isActive);
      } catch (e) {
        console.error('Error parsing stored media session:', e);
      }
    }
  }, []);
  
  // Process YouTube URL to get embed URL
  const processYouTubeUrl = (url: string): string => {
    // Handle different YouTube URL formats
    let videoId = '';
    
    // Standard YouTube URL
    const standardMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?]+)/);
    if (standardMatch && standardMatch[1]) {
      videoId = standardMatch[1];
    }
    
    // If we found a video ID, return the embed URL
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0`;
    }
    
    // If we couldn't parse it, return the original URL
    return url;
  };
  
  // Process media URL based on type
  const processMediaUrl = (url: string, type: string): string => {
    if (type === 'youtube') {
      return processYouTubeUrl(url);
    }
    return url;
  };
  
  // Start streaming media to all users
  const startStreaming = () => {
    if (!mediaUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid media URL.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsLoading(true);
    
    // Process the URL
    const processedUrl = processMediaUrl(mediaUrl, mediaType);
    
    // Create session
    const session: MediaSession = {
      id: generateId(),
      type: mediaType,
      title: mediaTitle || `${MEDIA_TYPES.find(t => t.id === mediaType)?.name} Stream`,
      url: processedUrl,
      displayMode,
      targetDevices,
      startTime: new Date(),
      isActive: true
    };
    
    // Simulate API call delay
    setTimeout(() => {
      setActiveSession(session);
      setIsStreaming(true);
      setIsLoading(false);
      
      // Store in localStorage
      localStorage.setItem('activeMediaSession', JSON.stringify(session));
      
      // Show toast notification
      toast({
        title: "Media Broadcast Started",
        description: "Your content is now being displayed to all users.",
        duration: 3000,
      });
      
      // Update UI
      queryClient.invalidateQueries({ queryKey: ['/api/network/media'] });
    }, 1500);
  };
  
  // Stop streaming
  const stopStreaming = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (activeSession) {
        // Update the active session
        const updatedSession = { ...activeSession, isActive: false };
        setActiveSession(updatedSession);
        
        // Store in localStorage
        localStorage.setItem('activeMediaSession', JSON.stringify(updatedSession));
      }
      
      setIsStreaming(false);
      setIsLoading(false);
      
      // Show toast notification
      toast({
        title: "Media Broadcast Stopped",
        description: "Network visualizations have been restored for all users.",
        duration: 3000,
      });
      
      // Update UI
      queryClient.invalidateQueries({ queryKey: ['/api/network/media'] });
    }, 1000);
  };
  
  // Use a preset example
  const useExample = (example: any) => {
    setMediaType(example.type);
    setMediaTitle(example.name);
    setMediaUrl(example.url);
  };
  
  // Calculate the time the media has been streaming
  const calculateStreamDuration = (startTime: Date): string => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000); // in seconds
    
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };
  
  // Render appropriate preview based on media type
  const renderPreview = () => {
    if (!mediaUrl) return null;
    
    const processedUrl = processMediaUrl(mediaUrl, mediaType);
    
    switch (mediaType) {
      case 'youtube':
      case 'video':
        return (
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-950">
            <iframe
              src={processedUrl}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      case 'webpage':
        return (
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-950">
            <iframe
              src={processedUrl}
              className="absolute inset-0 h-full w-full border-0"
            ></iframe>
          </div>
        );
      case 'chart':
        return (
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-950">
            <iframe
              src={processedUrl}
              className="absolute inset-0 h-full w-full border-0"
            ></iframe>
          </div>
        );
      case 'image':
        return (
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-950 flex items-center justify-center">
            <img
              src={processedUrl}
              alt={mediaTitle || "Preview"}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        );
      case 'embed':
        return (
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-950">
            <div 
              className="absolute inset-0 text-xs text-gray-400 flex items-center justify-center p-4 text-center"
              dangerouslySetInnerHTML={{ __html: processedUrl }}
            />
          </div>
        );
      default:
        return (
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-950 flex items-center justify-center">
            <div className="text-gray-500">Preview not available</div>
          </div>
        );
    }
  };
  
  return (
    <Card className={`w-full bg-gradient-to-br from-gray-900/80 to-purple-900/20 backdrop-blur-sm border border-purple-800/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Projector className="h-6 w-6 text-purple-400" />
          Virtual Display Controller
          {isStreaming && (
            <Badge className="ml-2 bg-green-600 animate-pulse">Live</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Override network visualizations with media content for all users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Active stream info */}
          {isStreaming && activeSession && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-700/50 rounded-md p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-purple-400 flex items-center">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Active Media Stream
                </h3>
                <Badge className="bg-purple-800 font-mono">
                  {calculateStreamDuration(activeSession.startTime)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Title:</span>
                    <span className="text-white">{activeSession.title}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Type:</span>
                    <span className="text-white">
                      {MEDIA_TYPES.find(t => t.id === activeSession.type)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Display:</span>
                    <span className="text-white">
                      {DISPLAY_MODES.find(d => d.id === activeSession.displayMode)?.name}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Target:</span>
                    <span className="text-white">
                      {TARGET_DEVICES.find(t => t.id === activeSession.targetDevices)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 overflow-hidden">
                    <span>URL:</span>
                    <span className="text-white truncate max-w-[180px]" title={activeSession.url}>
                      {activeSession.url}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Started:</span>
                    <span className="text-white">
                      {activeSession.startTime.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs border-purple-800 bg-purple-900/20"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-7 px-3"
                    onClick={stopStreaming}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <X className="h-3 w-3 mr-1" />}
                    Stop Stream
                  </Button>
                </div>
              </div>
              
              {/* Live preview */}
              {showPreview && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-950">
                    {activeSession.type === 'youtube' || activeSession.type === 'video' ? (
                      <iframe
                        src={activeSession.url}
                        className="absolute inset-0 h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : activeSession.type === 'webpage' || activeSession.type === 'chart' ? (
                      <iframe
                        src={activeSession.url}
                        className="absolute inset-0 h-full w-full border-0"
                      ></iframe>
                    ) : activeSession.type === 'image' ? (
                      <img
                        src={activeSession.url}
                        alt={activeSession.title}
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    ) : activeSession.type === 'embed' ? (
                      <div 
                        className="absolute inset-0 text-xs text-gray-400"
                        dangerouslySetInnerHTML={{ __html: activeSession.url }}
                      />
                    ) : null}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Media setup form */}
          {!isStreaming && (
            <div className="space-y-6">
              <Tabs defaultValue="url" value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                  <TabsTrigger value="url">Media URL</TabsTrigger>
                  <TabsTrigger value="examples">Quick Examples</TabsTrigger>
                </TabsList>
                
                <TabsContent value="url" className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="media-type">Media Type</Label>
                        <Select value={mediaType} onValueChange={setMediaType}>
                          <SelectTrigger id="media-type" className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select media type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {MEDIA_TYPES.map(type => (
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="media-title">Title (Optional)</Label>
                        <Input
                          id="media-title"
                          placeholder="Enter a title for this media"
                          value={mediaTitle}
                          onChange={(e) => setMediaTitle(e.target.value)}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="media-url">Media URL</Label>
                      <Input
                        id="media-url"
                        placeholder={`Enter ${mediaType === 'youtube' ? 'YouTube URL' : mediaType === 'image' ? 'image URL' : 'URL'}`}
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        className="bg-gray-800 border-gray-700"
                      />
                      {mediaType === 'youtube' && (
                        <p className="text-xs text-gray-500">
                          Paste any YouTube video URL (watch, embed, or share format)
                        </p>
                      )}
                      {mediaType === 'embed' && (
                        <p className="text-xs text-gray-500">
                          Paste custom iframe or embed HTML code
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="display-mode">Display Mode</Label>
                        <Select value={displayMode} onValueChange={setDisplayMode}>
                          <SelectTrigger id="display-mode" className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select display mode" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {DISPLAY_MODES.map(mode => (
                              <SelectItem key={mode.id} value={mode.id} className="flex items-center">
                                <div className="flex items-center">
                                  {mode.icon}
                                  <span className="ml-2">{mode.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="target-devices">Target Devices</Label>
                        <Select value={targetDevices} onValueChange={setTargetDevices}>
                          <SelectTrigger id="target-devices" className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select target devices" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {TARGET_DEVICES.map(device => (
                              <SelectItem key={device.id} value={device.id} className="flex items-center">
                                <div className="flex items-center">
                                  {device.icon}
                                  <span className="ml-2">{device.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center cursor-pointer" htmlFor="show-controls">
                        <span className="mr-2">Show Media Controls</span>
                        <Switch
                          id="show-controls"
                          checked={showControls}
                          onCheckedChange={setShowControls}
                        />
                      </Label>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => setMediaUrl('')}
                        disabled={!mediaUrl}
                      >
                        Clear
                      </Button>
                    </div>
                    
                    {/* Preview */}
                    {mediaUrl && (
                      <div className="mt-2">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Preview</h3>
                        {renderPreview()}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="examples" className="pt-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Start Examples</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {MEDIA_EXAMPLES.map((example, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-md border border-gray-700 hover:border-purple-600 cursor-pointer"
                        onClick={() => useExample(example)}
                      >
                        <div className="flex items-center">
                          {MEDIA_TYPES.find(t => t.id === example.type)?.icon}
                          <span className="ml-2 font-medium">{example.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Click any example to load it into the media controller
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </CardContent>
      {!isStreaming && (
        <CardFooter>
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            onClick={startStreaming}
            disabled={isLoading || !mediaUrl}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Starting Stream...
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4 mr-2" />
                Stream to All Users
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default MediaController;