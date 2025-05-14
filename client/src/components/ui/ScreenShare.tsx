import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Cast, UserPlus, UserMinus, Settings, Globe, Eye, EyeOff, Video, VideoOff, Mic, MicOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ElectricBorder } from '@/components/ui/ElectricBorder';
import { Switch } from '@/components/ui/switch';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: number;
  username: string;
  isAdmin: boolean;
  isSharing?: boolean;
}

interface StreamInfo {
  userId: number;
  username: string;
  streamId: string;
}

export function ScreenShare() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isViewingScreen, setIsViewingScreen] = useState(false);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [activeStreams, setActiveStreams] = useState<StreamInfo[]>([]);
  const [selectedStream, setSelectedStream] = useState<StreamInfo | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  
  const ws = useRef<WebSocket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  
  // Effect to initialize WebSocket connection
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      // Clean up resources when component unmounts
      if (ws.current) {
        ws.current.close();
      }
      stopScreenShare();
      closeConnection();
    };
  }, []);
  
  // Function to establish WebSocket connection
  const connectWebSocket = () => {
    // Get the current host
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('WebSocket connected for screen sharing');
      setIsConnected(true);
      
      // Send authentication message
      if (user) {
        socket.send(JSON.stringify({
          type: 'auth',
          userId: user.id,
          username: user.username
        }));
        
        // Request active users and streams
        socket.send(JSON.stringify({
          type: 'getActiveUsers'
        }));
        
        socket.send(JSON.stringify({
          type: 'getActiveStreams'
        }));
      }
    };
    
    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'activeUsers') {
          setActiveUsers(data.users);
        }
        else if (data.type === 'activeStreams') {
          setActiveStreams(data.streams);
        }
        else if (data.type === 'streamStarted') {
          // Add new stream to active streams
          setActiveStreams(prev => [...prev, {
            userId: data.userId,
            username: data.username,
            streamId: data.streamId
          }]);
          
          toast({
            title: 'Stream Available',
            description: `${data.username} started sharing their screen`,
          });
        }
        else if (data.type === 'streamEnded') {
          // Remove stream from active streams
          setActiveStreams(prev => prev.filter(stream => stream.streamId !== data.streamId));
          
          // If we were viewing this stream, stop viewing
          if (selectedStream?.streamId === data.streamId) {
            setSelectedStream(null);
            setIsViewingScreen(false);
            
            toast({
              title: 'Stream Ended',
              description: `${data.username} stopped sharing their screen`,
              variant: 'destructive'
            });
          }
        }
        else if (data.type === 'rtcOffer') {
          if (data.targetUserId === user?.id) {
            await handleRTCOffer(data);
          }
        }
        else if (data.type === 'rtcAnswer') {
          if (data.targetUserId === user?.id) {
            await handleRTCAnswer(data);
          }
        }
        else if (data.type === 'rtcIceCandidate') {
          if (data.targetUserId === user?.id) {
            await handleRTCIceCandidate(data);
          }
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
  
  // Start screen sharing
  const startScreenShare = async () => {
    try {
      // Request screen capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      // Save the stream
      localStream.current = stream;
      
      // Display the stream in local video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Initialize WebRTC connection
      initializePeerConnection();
      
      // Update state
      setIsSharingScreen(true);
      
      // Notify server that we're sharing
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'startStreaming',
          userId: user?.id,
          username: user?.username
        }));
      }
      
      // Listen for stream end
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
      
      toast({
        title: 'Screen Sharing Started',
        description: 'You are now sharing your screen'
      });
    } catch (error) {
      console.error('Error starting screen share:', error);
      toast({
        title: 'Screen Share Error',
        description: 'Could not start screen sharing',
        variant: 'destructive'
      });
    }
  };
  
  // Stop screen sharing
  const stopScreenShare = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    closeConnection();
    setIsSharingScreen(false);
    
    // Notify server that we're no longer sharing
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'stopStreaming',
        userId: user?.id,
        username: user?.username
      }));
    }
  };
  
  // Initialize WebRTC peer connection
  const initializePeerConnection = () => {
    const configuration = { 
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ] 
    };
    
    const pc = new RTCPeerConnection(configuration);
    
    // Add local stream tracks to the connection
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        pc.addTrack(track, localStream.current!);
      });
    }
    
    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && ws.current) {
        ws.current.send(JSON.stringify({
          type: 'rtcIceCandidate',
          candidate: event.candidate,
          userId: user?.id,
          targetUserId: selectedStream?.userId  // For viewers
        }));
      }
    };
    
    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
    };
    
    // Save the peer connection
    peerConnection.current = pc;
  };
  
  // Close WebRTC connection
  const closeConnection = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
  };
  
  // Handle incoming RTC offer
  const handleRTCOffer = async (data: any) => {
    try {
      // Initialize peer connection if not already done
      if (!peerConnection.current) {
        initializePeerConnection();
      }
      
      // Set the remote description
      await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(data.offer));
      
      // Create answer
      const answer = await peerConnection.current!.createAnswer();
      await peerConnection.current!.setLocalDescription(answer);
      
      // Send the answer back
      if (ws.current) {
        ws.current.send(JSON.stringify({
          type: 'rtcAnswer',
          answer,
          userId: user?.id,
          targetUserId: data.userId
        }));
      }
      
      // Set up remote stream
      peerConnection.current!.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
    } catch (error) {
      console.error('Error handling RTC offer:', error);
    }
  };
  
  // Handle incoming RTC answer
  const handleRTCAnswer = async (data: any) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    } catch (error) {
      console.error('Error handling RTC answer:', error);
    }
  };
  
  // Handle incoming ICE candidate
  const handleRTCIceCandidate = async (data: any) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };
  
  // View a stream
  const viewStream = (stream: StreamInfo) => {
    setSelectedStream(stream);
    setIsViewingScreen(true);
    
    // Initialize peer connection
    initializePeerConnection();
    
    // Create and send offer
    if (peerConnection.current) {
      peerConnection.current.createOffer()
        .then(offer => peerConnection.current!.setLocalDescription(offer))
        .then(() => {
          if (ws.current) {
            ws.current.send(JSON.stringify({
              type: 'rtcOffer',
              offer: peerConnection.current!.localDescription,
              userId: user?.id,
              targetUserId: stream.userId
            }));
          }
        })
        .catch(error => {
          console.error('Error creating offer:', error);
          toast({
            title: 'Connection Error',
            description: 'Failed to connect to the stream',
            variant: 'destructive'
          });
        });
        
      // Set up remote stream
      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
    }
  };
  
  // Stop viewing a stream
  const stopViewingStream = () => {
    setSelectedStream(null);
    setIsViewingScreen(false);
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    closeConnection();
  };
  
  // Toggle audio
  const toggleAudio = () => {
    if (localStream.current) {
      const audioTracks = localStream.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const enabled = !isMuted;
        audioTracks[0].enabled = enabled;
        setIsMuted(!enabled);
      }
    }
  };
  
  // Toggle camera
  const toggleCamera = async () => {
    try {
      if (cameraEnabled && localStream.current) {
        // Remove camera track
        const videoTracks = localStream.current.getVideoTracks().filter(track => track.kind === 'video' && track.label.includes('camera'));
        videoTracks.forEach(track => {
          track.stop();
          localStream.current!.removeTrack(track);
        });
        
        setCameraEnabled(false);
      } else {
        // Add camera track
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = cameraStream.getVideoTracks()[0];
        
        if (localStream.current) {
          localStream.current.addTrack(videoTrack);
          
          // Update peer connection
          if (peerConnection.current) {
            peerConnection.current.getSenders().forEach(sender => {
              if (sender.track && sender.track.kind === 'video') {
                sender.replaceTrack(videoTrack);
              }
            });
          }
          
          setCameraEnabled(true);
        }
      }
    } catch (error) {
      console.error('Error toggling camera:', error);
      toast({
        title: 'Camera Error',
        description: 'Could not access camera',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <ElectricBorder 
      className="h-full"
      cornerAccentColor="border-cyan-500"
      edgeGlowColor="rgba(6, 182, 212, 0.5)"
      noiseBg={true}
      centerGlow={true}
    >
      <div className="h-full flex flex-col bg-black/60 backdrop-blur-lg rounded-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b border-cyan-500/30">
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="mr-2 text-cyan-400"
            >
              <Monitor size={18} />
            </motion.div>
            <h3 className="text-sm font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Cosmic Screen Sharing
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`flex items-center px-2 py-0.5 rounded-full text-xs ${isConnected ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-7 h-7 border-cyan-500/30"
                    onClick={() => isConnected ? connectWebSocket() : null}
                    disabled={!isConnected}
                  >
                    <Settings size={14} className="text-cyan-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Control panel */}
          <div className="lg:col-span-1 flex flex-col space-y-4">
            <div className="border border-cyan-500/20 rounded-md bg-gray-950/50 p-3">
              <h4 className="text-sm font-medium text-cyan-400 mb-3">Control Panel</h4>
              
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Share Your Screen</span>
                    <Switch 
                      checked={isSharingScreen} 
                      onCheckedChange={checked => checked ? startScreenShare() : stopScreenShare()}
                      disabled={!isConnected}
                      className="data-[state=checked]:bg-cyan-600"
                    />
                  </div>
                  
                  {isSharingScreen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col space-y-2 mt-2"
                    >
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-8 border-cyan-500/30"
                          onClick={toggleAudio}
                        >
                          {isMuted ? (
                            <MicOff size={14} className="mr-1.5 text-red-400" />
                          ) : (
                            <Mic size={14} className="mr-1.5 text-green-400" />
                          )}
                          {isMuted ? 'Unmute' : 'Mute'}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-8 border-cyan-500/30"
                          onClick={toggleCamera}
                        >
                          {cameraEnabled ? (
                            <VideoOff size={14} className="mr-1.5 text-red-400" />
                          ) : (
                            <Video size={14} className="mr-1.5 text-green-400" />
                          )}
                          {cameraEnabled ? 'Hide Camera' : 'Show Camera'}
                        </Button>
                      </div>
                      
                      <div className="text-xs text-green-400 border border-green-500/30 bg-green-900/10 rounded p-2">
                        Your screen is visible to others
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <div className="border-t border-cyan-500/20 pt-3">
                  <h5 className="text-xs font-medium text-cyan-400 mb-2">Active Streams</h5>
                  
                  {activeStreams.length === 0 ? (
                    <div className="text-xs text-gray-500 py-2">
                      No active screen shares
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeStreams.map(stream => (
                        <div 
                          key={stream.streamId}
                          className="flex items-center justify-between rounded-md border border-cyan-500/20 bg-cyan-900/10 p-2"
                        >
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <div className="flex h-full w-full items-center justify-center bg-cyan-900 text-white text-xs">
                                {stream.username.charAt(0).toUpperCase()}
                              </div>
                            </Avatar>
                            <div>
                              <div className="text-xs font-medium text-cyan-300">{stream.username}</div>
                              <div className="text-[10px] text-cyan-500">Sharing screen</div>
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => viewStream(stream)}
                            disabled={isViewingScreen && selectedStream?.streamId !== stream.streamId}
                          >
                            <Eye size={14} className="mr-1.5 text-cyan-400" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Online users list */}
            <div className="border border-cyan-500/20 rounded-md bg-gray-950/50 p-3">
              <h4 className="text-sm font-medium text-cyan-400 mb-3">Online Users</h4>
              
              {activeUsers.length === 0 ? (
                <div className="text-xs text-gray-500 py-2">
                  No users online
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {activeUsers.map(user => (
                    <div 
                      key={user.id}
                      className="flex items-center justify-between rounded-md border border-cyan-500/20 bg-gray-900/30 p-2"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <div className="flex h-full w-full items-center justify-center bg-blue-900 text-white text-xs">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        </Avatar>
                        <div className="text-xs text-gray-300">{user.username}</div>
                      </div>
                      
                      <div className="flex items-center">
                        {user.isSharing && (
                          <motion.div 
                            animate={{
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="text-cyan-400 mr-2"
                          >
                            <Cast size={14} />
                          </motion.div>
                        )}
                        
                        <div className={`w-1.5 h-1.5 rounded-full ${user.isSharing ? 'bg-cyan-500' : 'bg-green-500'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Video display area */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <div className="relative flex-1 border border-cyan-500/30 rounded-md bg-gray-900/40 overflow-hidden">
              {isSharingScreen ? (
                <>
                  {/* Show local video when sharing */}
                  <video 
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-contain"
                  />
                  
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-md p-2 border border-cyan-500/30">
                    <div className="flex items-center">
                      <div className="flex items-center text-xs text-cyan-400 mr-3">
                        <Cast size={14} className="mr-1.5" />
                        Sharing
                      </div>
                      
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={stopScreenShare}
                      >
                        <X size={14} className="mr-1.5" />
                        Stop
                      </Button>
                    </div>
                  </div>
                </>
              ) : isViewingScreen && selectedStream ? (
                <>
                  {/* Show remote video when viewing */}
                  <video 
                    ref={remoteVideoRef}
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                  
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-md p-2 border border-cyan-500/30">
                    <div className="flex items-center">
                      <div className="flex items-center text-xs text-cyan-400 mr-3">
                        <Eye size={14} className="mr-1.5" />
                        Viewing: {selectedStream.username}
                      </div>
                      
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={stopViewingStream}
                      >
                        <EyeOff size={14} className="mr-1.5" />
                        Stop
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-cyan-500 mb-4"
                  >
                    <Globe size={48} />
                  </motion.div>
                  
                  <h3 className="text-xl font-medium text-cyan-300 mb-2">Welcome to Screen Sharing</h3>
                  <p className="text-gray-400 text-sm max-w-md">
                    Share your screen with other miners or view someone else's screen to collaborate in real-time.
                  </p>
                  
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button 
                      onClick={startScreenShare}
                      disabled={!isConnected || isSharingScreen}
                      className="bg-cyan-700 hover:bg-cyan-600"
                    >
                      <Cast size={16} className="mr-2" />
                      Share Your Screen
                    </Button>
                    
                    {activeStreams.length > 0 && (
                      <Button 
                        variant="outline" 
                        onClick={() => viewStream(activeStreams[0])}
                        disabled={!isConnected || isViewingScreen || activeStreams.length === 0}
                        className="border-cyan-700 text-cyan-400"
                      >
                        <Eye size={16} className="mr-2" />
                        View Available Stream
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Information panel */}
            <div className="mt-3 border border-cyan-500/20 rounded-md bg-gray-950/50 p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-cyan-400">Information</h4>
                
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-400">
                    Streams: <span className="text-cyan-400">{activeStreams.length}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Users: <span className="text-cyan-400">{activeUsers.length}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-1">
                Screen sharing uses WebRTC for secure peer-to-peer connections. Your screen is only shared with users you allow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ElectricBorder>
  );
}