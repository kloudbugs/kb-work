import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useBroadcast } from '@/context/BroadcastContext';
import { motion } from 'framer-motion';
import {
  Cast,
  Monitor,
  Upload,
  Users,
  Eye,
  Settings,
  Radio,
  Pause,
  Play,
  Image as ImageIcon,
  Link,
  FileVideo,
  Layout,
  Globe,
  EyeOff,
  MessageCircle,
  Volume2,
  Volume1,
  VolumeX,
  Mic,
  MicOff,
  Maximize,
  Minimize,
  RefreshCw,
  Send,
  BarChart3,
  Info
} from 'lucide-react';

// Broadcast resolution options
const RESOLUTION_OPTIONS = [
  { value: '720p', label: '720p (HD)' },
  { value: '1080p', label: '1080p (Full HD)' },
  { value: '480p', label: 'SD (480p)' },
  { value: '360p', label: 'Low (360p)' },
  { value: 'auto', label: 'Auto (Adaptive)' }
];

// Broadcast quality options
const QUALITY_PRESETS = [
  { value: 'high', label: 'High Quality', bitrate: '2.5 Mbps', optimizedFor: 'Visual clarity' },
  { value: 'balanced', label: 'Balanced', bitrate: '1.5 Mbps', optimizedFor: 'Most scenarios' },
  { value: 'performance', label: 'Performance', bitrate: '800 Kbps', optimizedFor: 'Low latency' },
  { value: 'bandwidth', label: 'Bandwidth Saver', bitrate: '500 Kbps', optimizedFor: 'Mobile viewers' },
  { value: 'custom', label: 'Custom', bitrate: 'User defined', optimizedFor: 'Advanced users' }
];

// Content type options
const CONTENT_TYPES = [
  { value: 'live', label: 'Live Screen Share', icon: Monitor },
  { value: 'video', label: 'Video File', icon: FileVideo },
  { value: 'image', label: 'Image/Slides', icon: ImageIcon },
  { value: 'website', label: 'Website URL', icon: Globe }
];

// Event types for analytics
const BROADCAST_EVENTS = [
  { time: '12:32:15', type: 'broadcast_start', details: 'Admin started broadcast' },
  { time: '12:35:22', type: 'viewer_join', details: 'User CryptoMiner88 joined' },
  { time: '12:36:41', type: 'viewer_join', details: 'User TeraSupporter joined' },
  { time: '12:40:13', type: 'chat_message', details: 'TeraSupporter: Is this new mining software?' },
  { time: '12:44:56', type: 'viewer_join', details: 'User HashPower joined' },
  { time: '12:51:09', type: 'viewer_leave', details: 'User CryptoMiner88 left' },
  { time: '12:55:30', type: 'broadcast_pause', details: 'Admin paused broadcast' },
  { time: '12:56:45', type: 'broadcast_resume', details: 'Admin resumed broadcast' },
  { time: '13:02:18', type: 'chat_message', details: 'HashPower: This tutorial is very helpful' },
  { time: '13:15:22', type: 'broadcast_end', details: 'Admin ended broadcast' }
];

export function ScreenBroadcastControl() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Broadcast state
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [contentType, setContentType] = useState('live');
  const [resolution, setResolution] = useState('720p');
  const [qualityPreset, setQualityPreset] = useState('balanced');
  const [customBitrate, setCustomBitrate] = useState(1500);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastDescription, setBroadcastDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('all'); // 'all', 'premium', 'admin'
  
  // Statistics
  const [viewerCount, setViewerCount] = useState(0);
  const [peakViewers, setPeakViewers] = useState(0);
  const [broadcastDuration, setBroadcastDuration] = useState(0);
  const [broadcastStartTime, setBroadcastStartTime] = useState<Date | null>(null);
  
  // Feature flags
  const [enableChat, setEnableChat] = useState(true);
  const [enableQA, setEnableQA] = useState(true);
  const [enableViewerCount, setEnableViewerCount] = useState(true);
  const [restrictScreenshots, setRestrictScreenshots] = useState(false);
  const [muteAudio, setMuteAudio] = useState(false);
  const [recordBroadcast, setRecordBroadcast] = useState(false);
  
  // Media content
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Messages from viewers
  const [viewerMessages, setViewerMessages] = useState<Array<{
    id: string;
    user: string;
    message: string;
    time: Date;
    isQuestion: boolean;
  }>>([
    { id: '1', user: 'HashPower', message: 'Is this the new ASIC tutorial?', time: new Date(), isQuestion: true },
    { id: '2', user: 'MiningPro23', message: 'The performance looks amazing!', time: new Date(), isQuestion: false },
    { id: '3', user: 'TeraHolder', message: 'What cooling system do you recommend?', time: new Date(), isQuestion: true }
  ]);
  
  // Animation states for the pulse effect
  const [isPulsing, setIsPulsing] = useState(false);
  
  // Duration timer for the broadcast
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isBroadcasting && !isPaused) {
      interval = setInterval(() => {
        setBroadcastDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBroadcasting, isPaused]);
  
  // Format seconds to readable time format
  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0) parts.push(`${mins}m`);
    parts.push(`${secs}s`);
    
    return parts.join(' ');
  };
  
  // Simulate viewer count changes
  useEffect(() => {
    if (isBroadcasting && !isPaused) {
      const interval = setInterval(() => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newCount = Math.max(0, viewerCount + change);
        setViewerCount(newCount);
        
        if (newCount > peakViewers) {
          setPeakViewers(newCount);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isBroadcasting, isPaused, viewerCount, peakViewers]);
  
  // Handle screen sharing
  // Import the useBroadcast hook from our context
  const broadcastContext = useBroadcast();
  
  const startScreenShare = async () => {
    if (contentType === 'live') {
      try {
        // Request screen capture
        const mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: !muteAudio
        });
        
        // Set the stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          
          // Handle when user stops sharing
          mediaStream.getVideoTracks()[0].onended = () => {
            stopBroadcast();
          };
        }
        
        setIsBroadcasting(true);
        setIsPaused(false);
        setBroadcastStartTime(new Date());
        
        // Start the global exclusive broadcast mode
        broadcastContext.startBroadcast(
          broadcastTitle || "Live Screen Share", 
          broadcastDescription || "Admin is sharing their screen. All features are disabled until broadcast ends."
        );
        
        toast({
          title: "Broadcast Started",
          description: "Your screen is now being shared with all users in EXCLUSIVE MODE.",
        });
        
        // Start pulsing the indicator
        setIsPulsing(true);
        
      } catch (error) {
        console.error('Error starting screen share:', error);
        toast({
          title: "Broadcast Failed",
          description: "Unable to start screen sharing. Please check permissions.",
          variant: "destructive"
        });
      }
    } else if (contentType === 'video' || contentType === 'image') {
      if (!uploadedFile) {
        toast({
          title: "No File Selected",
          description: "Please upload a file to broadcast.",
          variant: "destructive"
        });
        return;
      }
      
      setIsBroadcasting(true);
      setIsPaused(false);
      setBroadcastStartTime(new Date());
      
      // Start the global exclusive broadcast mode
      broadcastContext.startBroadcast(
        broadcastTitle || `${contentType === 'video' ? 'Video' : 'Image'} Broadcast`, 
        broadcastDescription || `Admin is sharing a ${contentType}. All features are disabled until broadcast ends.`
      );
      
      toast({
        title: "Broadcast Started",
        description: `Your ${contentType === 'video' ? 'video' : 'image'} is now being shared with all users in EXCLUSIVE MODE.`,
      });
      
      // Start pulsing the indicator
      setIsPulsing(true);
    } else if (contentType === 'website') {
      if (!mediaUrl) {
        toast({
          title: "No URL Provided",
          description: "Please enter a website URL to broadcast.",
          variant: "destructive"
        });
        return;
      }
      
      setIsBroadcasting(true);
      setIsPaused(false);
      setBroadcastStartTime(new Date());
      
      // Start the global exclusive broadcast mode
      broadcastContext.startBroadcast(
        broadcastTitle || "Website Broadcast", 
        broadcastDescription || `Admin is sharing a website: ${mediaUrl}. All features are disabled until broadcast ends.`
      );
      
      toast({
        title: "Broadcast Started",
        description: "The website is now being shared with all users in EXCLUSIVE MODE.",
      });
      
      // Start pulsing the indicator
      setIsPulsing(true);
    }
  };
  
  const pauseBroadcast = () => {
    setIsPaused(true);
    setIsPulsing(false);
    
    toast({
      title: "Broadcast Paused",
      description: "Your broadcast has been paused. Viewers will see a pause screen.",
    });
  };
  
  const resumeBroadcast = () => {
    setIsPaused(false);
    setIsPulsing(true);
    
    toast({
      title: "Broadcast Resumed",
      description: "Your broadcast has been resumed.",
    });
  };
  
  const stopBroadcast = () => {
    // Stop all tracks in the stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsBroadcasting(false);
    setIsPaused(false);
    setIsPulsing(false);
    
    // Calculate broadcast stats
    const endTime = new Date();
    const startTime = broadcastStartTime || endTime;
    const totalDuration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    // End the global exclusive broadcast mode
    broadcastContext.stopBroadcast();
    
    toast({
      title: "Broadcast Ended",
      description: `Your broadcast has ended. Total duration: ${formatDuration(totalDuration)}.`,
    });
    
    // Reset duration if needed
    setBroadcastDuration(0);
    setBroadcastStartTime(null);
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded and is ready to broadcast.`,
      });
    }
  };
  
  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Mute/unmute audio
  const toggleAudio = () => {
    setMuteAudio(!muteAudio);
    
    // If we're already broadcasting, update the audio tracks
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = muteAudio; // We're toggling the state, so use the previous value
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Preview and Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Preview Section */}
        <div className="md:col-span-2">
          <Card className="bg-gray-900/70 border-blue-900/50 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-blue-400" />
                  Broadcast Preview
                </div>
                {isBroadcasting && (
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="h-3 w-3 rounded-full bg-red-500"
                      animate={{ 
                        opacity: isPulsing ? [0.5, 1, 0.5] : 1,
                        scale: isPulsing ? [0.95, 1.05, 0.95] : 1
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <span className="text-sm font-medium text-gray-300">
                      {isPaused ? "Paused" : "Broadcasting"}
                    </span>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                {broadcastTitle || "No broadcast title specified"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
                {!isBroadcasting ? (
                  <div className="text-center p-6">
                    <Cast className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-semibold text-gray-300">No Active Broadcast</h3>
                    <p className="text-gray-500 max-w-md mx-auto mt-2">
                      Start a broadcast to share your screen, a video, image or website URL with all platform users.
                    </p>
                  </div>
                ) : contentType === 'live' ? (
                  <>
                    <video 
                      ref={videoRef} 
                      className="w-full h-full object-contain" 
                      autoPlay 
                      muted={muteAudio} 
                    />
                    {isPaused && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                        <div className="text-center">
                          <Pause className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-xl font-semibold text-gray-300">Broadcast Paused</h3>
                          <p className="text-gray-500 max-w-md mx-auto mt-2">
                            The broadcast is currently paused. Resume to continue sharing.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : contentType === 'image' && uploadedFile ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <img 
                      src={URL.createObjectURL(uploadedFile)} 
                      alt="Broadcast content" 
                      className="max-w-full max-h-full object-contain" 
                    />
                    {isPaused && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                        <div className="text-center">
                          <Pause className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-xl font-semibold text-gray-300">Broadcast Paused</h3>
                        </div>
                      </div>
                    )}
                  </div>
                ) : contentType === 'video' && uploadedFile ? (
                  <>
                    <video 
                      src={URL.createObjectURL(uploadedFile)} 
                      className="w-full h-full object-contain" 
                      controls={!isPaused}
                      autoPlay 
                      muted={muteAudio} 
                    />
                    {isPaused && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                        <div className="text-center">
                          <Pause className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-xl font-semibold text-gray-300">Broadcast Paused</h3>
                        </div>
                      </div>
                    )}
                  </>
                ) : contentType === 'website' && mediaUrl ? (
                  <>
                    <iframe 
                      src={mediaUrl}
                      className="w-full h-full border-0"
                      title="Website broadcast"
                    />
                    {isPaused && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                        <div className="text-center">
                          <Pause className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-xl font-semibold text-gray-300">Broadcast Paused</h3>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center p-6">
                    <Upload className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-semibold text-gray-300">No Content Selected</h3>
                    <p className="text-gray-500 max-w-md mx-auto mt-2">
                      Please upload a file or enter a URL to broadcast.
                    </p>
                  </div>
                )}
                
                {/* Broadcast controls overlay */}
                {isBroadcasting && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Audio Control */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-full" 
                          onClick={toggleAudio}
                        >
                          {muteAudio ? (
                            <VolumeX className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Volume2 className="h-4 w-4 text-blue-400" />
                          )}
                        </Button>
                        
                        {/* Viewers */}
                        {enableViewerCount && (
                          <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md">
                            <Eye className="h-3 w-3 text-blue-400" />
                            <span className="text-xs text-gray-300">{viewerCount}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Full screen */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <Maximize className="h-4 w-4 text-gray-400" />
                        </Button>
                        
                        {/* Settings */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <Settings className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            {/* Broadcast controls */}
            <CardFooter className="flex justify-between items-center p-4 border-t border-gray-800">
              {!isBroadcasting ? (
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={startScreenShare}
                >
                  <Radio className="h-4 w-4 mr-2" />
                  Start Broadcasting
                </Button>
              ) : isPaused ? (
                <div className="flex items-center gap-2">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={resumeBroadcast}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                    onClick={stopBroadcast}
                  >
                    End Broadcast
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={pauseBroadcast}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-gray-700 text-red-300 hover:border-red-700 hover:bg-red-900/20"
                    onClick={stopBroadcast}
                  >
                    End Broadcast
                  </Button>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-gray-800/50">
                    {resolution}
                  </Badge>
                </div>
                
                {broadcastDuration > 0 && (
                  <div className="text-sm text-gray-400">
                    {formatDuration(broadcastDuration)}
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Settings and Stats Section */}
        <div className="md:col-span-1">
          <Tabs defaultValue="content">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
              <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
            </TabsList>
            
            {/* Content Selection Tab */}
            <TabsContent value="content">
              <Card className="bg-gray-900/70 border-blue-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5 text-blue-400" />
                    Content Selection
                  </CardTitle>
                  <CardDescription>
                    Choose what to broadcast to users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Content Type Selection */}
                  <div className="space-y-2">
                    <Label>Broadcast Type</Label>
                    <Select
                      value={contentType}
                      onValueChange={value => {
                        setContentType(value);
                        // Reset uploaded file when switching content types
                        if (value !== 'video' && value !== 'image') {
                          setUploadedFile(null);
                        }
                      }}
                      disabled={isBroadcasting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTENT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Content Specific Settings */}
                  {contentType === 'live' && (
                    <div className="space-y-2">
                      <Label>Screen Capture Options</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="include-audio" 
                              checked={!muteAudio}
                              onCheckedChange={(checked) => setMuteAudio(!checked)}
                            />
                            <Label htmlFor="include-audio">Include Audio</Label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="record-broadcast" 
                              checked={recordBroadcast}
                              onCheckedChange={(checked) => setRecordBroadcast(checked as boolean)}
                            />
                            <Label htmlFor="record-broadcast">Record Broadcast</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(contentType === 'video' || contentType === 'image') && (
                    <div className="space-y-3">
                      <Label>{contentType === 'video' ? 'Upload Video File' : 'Upload Image'}</Label>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-6 bg-gray-800/50">
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          accept={contentType === 'video' ? 'video/*' : 'image/*'} 
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={isBroadcasting}
                        />
                        
                        {uploadedFile ? (
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              {contentType === 'video' ? (
                                <FileVideo className="h-8 w-8 text-blue-400" />
                              ) : (
                                <ImageIcon className="h-8 w-8 text-blue-400" />
                              )}
                            </div>
                            <p className="text-sm text-gray-300 font-medium">{uploadedFile.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="mt-3" 
                              onClick={() => setUploadedFile(null)}
                              disabled={isBroadcasting}
                            >
                              Change File
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            className="h-20 border border-dotted border-gray-600"
                            onClick={triggerFileUpload}
                            disabled={isBroadcasting}
                          >
                            <div className="flex flex-col items-center">
                              <Upload className="h-6 w-6 mb-2 text-gray-400" />
                              <span className="text-sm text-gray-400">Click to upload</span>
                              <span className="text-xs text-gray-500 mt-1">
                                {contentType === 'video' ? 'MP4, WebM, or AVI' : 'JPG, PNG, or GIF'}
                              </span>
                            </div>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {contentType === 'website' && (
                    <div className="space-y-3">
                      <Label>Website URL</Label>
                      <Input 
                        placeholder="https://example.com" 
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        disabled={isBroadcasting}
                      />
                      <p className="text-xs text-gray-500">
                        Enter the full URL including https:// to broadcast a website.
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2 pt-2">
                    <Label>Broadcast Title</Label>
                    <Input 
                      placeholder="Enter a title for your broadcast" 
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      disabled={isBroadcasting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea 
                      placeholder="Add a description or instructions for viewers" 
                      value={broadcastDescription}
                      onChange={(e) => setBroadcastDescription(e.target.value)}
                      className="resize-none h-20"
                      disabled={isBroadcasting}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="bg-gray-900/70 border-blue-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-400" />
                    Broadcast Settings
                  </CardTitle>
                  <CardDescription>
                    Configure quality and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Resolution Settings */}
                  <div className="space-y-2">
                    <Label htmlFor="resolution">Resolution</Label>
                    <Select
                      value={resolution}
                      onValueChange={setResolution}
                      disabled={isBroadcasting}
                    >
                      <SelectTrigger id="resolution">
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESOLUTION_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Quality Settings */}
                  <div className="space-y-2">
                    <Label htmlFor="quality">Quality Preset</Label>
                    <Select
                      value={qualityPreset}
                      onValueChange={setQualityPreset}
                      disabled={isBroadcasting}
                    >
                      <SelectTrigger id="quality">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        {QUALITY_PRESETS.map(preset => (
                          <SelectItem key={preset.value} value={preset.value}>
                            {preset.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {QUALITY_PRESETS.find(p => p.value === qualityPreset)?.optimizedFor}
                      {qualityPreset !== 'custom' && ` (${QUALITY_PRESETS.find(p => p.value === qualityPreset)?.bitrate})`}
                    </p>
                  </div>
                  
                  {/* Custom Bitrate (only if custom quality is selected) */}
                  {qualityPreset === 'custom' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="bitrate">Custom Bitrate</Label>
                        <Badge variant="outline">{customBitrate} Kbps</Badge>
                      </div>
                      <Slider
                        id="bitrate"
                        min={100}
                        max={5000}
                        step={100}
                        value={[customBitrate]}
                        onValueChange={(val) => setCustomBitrate(val[0])}
                        disabled={isBroadcasting}
                      />
                      <p className="text-xs text-gray-500">
                        Higher bitrate = better quality but requires more bandwidth
                      </p>
                    </div>
                  )}
                  
                  {/* Target Audience */}
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select
                      value={targetAudience}
                      onValueChange={setTargetAudience}
                      disabled={isBroadcasting}
                    >
                      <SelectTrigger id="audience">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="premium">Premium Users Only</SelectItem>
                        <SelectItem value="admin">Admins Only (Test Mode)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Feature Toggle Settings */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-medium text-gray-300">Interaction Features</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="enable-chat" 
                          checked={enableChat}
                          onCheckedChange={(checked) => setEnableChat(checked as boolean)}
                          disabled={isBroadcasting}
                        />
                        <Label htmlFor="enable-chat" className="text-sm">Enable Chat</Label>
                      </div>
                      <MessageCircle className="h-4 w-4 text-gray-500" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="enable-qa" 
                          checked={enableQA}
                          onCheckedChange={(checked) => setEnableQA(checked as boolean)}
                          disabled={isBroadcasting}
                        />
                        <Label htmlFor="enable-qa" className="text-sm">Enable Q&A</Label>
                      </div>
                      <MessageCircle className="h-4 w-4 text-gray-500" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="viewer-count" 
                          checked={enableViewerCount}
                          onCheckedChange={(checked) => setEnableViewerCount(checked as boolean)}
                          disabled={isBroadcasting}
                        />
                        <Label htmlFor="viewer-count" className="text-sm">Show Viewer Count</Label>
                      </div>
                      <Eye className="h-4 w-4 text-gray-500" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="restrict-screenshots" 
                          checked={restrictScreenshots}
                          onCheckedChange={(checked) => setRestrictScreenshots(checked as boolean)}
                          disabled={isBroadcasting}
                        />
                        <Label htmlFor="restrict-screenshots" className="text-sm">Restrict Screenshots</Label>
                      </div>
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Stats Tab */}
            <TabsContent value="stats">
              <Card className="bg-gray-900/70 border-blue-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Broadcast Statistics
                  </CardTitle>
                  <CardDescription>
                    Real-time analytics and viewer data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Viewer Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/60 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Current Viewers</div>
                      <div className="text-2xl font-semibold text-white">{viewerCount}</div>
                    </div>
                    
                    <div className="bg-gray-800/60 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Peak Viewers</div>
                      <div className="text-2xl font-semibold text-white">{peakViewers}</div>
                    </div>
                    
                    <div className="bg-gray-800/60 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Broadcast Time</div>
                      <div className="text-xl font-semibold text-white">{formatDuration(broadcastDuration)}</div>
                    </div>
                    
                    <div className="bg-gray-800/60 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Quality</div>
                      <div className="text-xl font-semibold text-white flex items-center">
                        {qualityPreset === 'high' && (
                          <Badge className="bg-green-600">High</Badge>
                        )}
                        {qualityPreset === 'balanced' && (
                          <Badge className="bg-blue-600">Balanced</Badge>
                        )}
                        {qualityPreset === 'performance' && (
                          <Badge className="bg-amber-600">Performance</Badge>
                        )}
                        {qualityPreset === 'bandwidth' && (
                          <Badge className="bg-orange-600">Low</Badge>
                        )}
                        {qualityPreset === 'custom' && (
                          <Badge className="bg-purple-600">Custom</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Event Log */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-300">Event Log</h3>
                      <RefreshCw className="h-4 w-4 text-gray-500" />
                    </div>
                    
                    <ScrollArea className="h-[180px] border border-gray-800 rounded-md p-2 bg-gray-800/30">
                      {BROADCAST_EVENTS.map((event, i) => (
                        <div 
                          key={i} 
                          className="py-1.5 border-b border-gray-800 last:border-0 flex items-start gap-2"
                        >
                          <div className="text-xs text-gray-500 min-w-[60px]">{event.time}</div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              {event.type === 'broadcast_start' && (
                                <Radio className="h-3 w-3 text-green-500" />
                              )}
                              {event.type === 'broadcast_end' && (
                                <Radio className="h-3 w-3 text-red-500" />
                              )}
                              {event.type === 'viewer_join' && (
                                <Users className="h-3 w-3 text-blue-500" />
                              )}
                              {event.type === 'viewer_leave' && (
                                <Users className="h-3 w-3 text-gray-500" />
                              )}
                              {event.type === 'chat_message' && (
                                <MessageCircle className="h-3 w-3 text-purple-500" />
                              )}
                              {event.type === 'broadcast_pause' && (
                                <Pause className="h-3 w-3 text-amber-500" />
                              )}
                              {event.type === 'broadcast_resume' && (
                                <Play className="h-3 w-3 text-green-500" />
                              )}
                              <span className="text-xs font-medium text-gray-300">
                                {event.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{event.details}</p>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                  
                  {/* Status Info */}
                  {isBroadcasting && (
                    <Alert className="bg-blue-900/20 border-blue-700/30">
                      <Info className="h-4 w-4 text-blue-400" />
                      <AlertDescription>
                        Broadcast is active and visible to {targetAudience === 'all' ? 'all users' : targetAudience === 'premium' ? 'premium users' : 'admins only'}.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Viewer Messages Section */}
      {isBroadcasting && enableChat && (
        <Card className="bg-gray-900/70 border-blue-900/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-400" />
                Viewer Messages
              </CardTitle>
              <CardDescription>
                Chat and questions from your audience
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-blue-900">{viewerMessages.length} messages</Badge>
              <Badge className="bg-purple-900">{viewerMessages.filter(m => m.isQuestion).length} questions</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-4">
                {viewerMessages.map(message => (
                  <div key={message.id} className="flex gap-3">
                    <div className={`${message.isQuestion ? 'bg-purple-600' : 'bg-blue-600'} h-8 w-8 rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                      {message.user.slice(0, 2).toUpperCase()}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{message.user}</span>
                        {message.isQuestion && (
                          <Badge variant="outline" className="text-xs bg-purple-900/30 text-purple-300 border-purple-800">
                            Question
                          </Badge>
                        )}
                        <span className="text-xs text-gray-400">
                          {message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-gray-200">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-4 flex items-center gap-2">
              <Input 
                placeholder="Reply to viewers..." 
                className="flex-1"
              />
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}