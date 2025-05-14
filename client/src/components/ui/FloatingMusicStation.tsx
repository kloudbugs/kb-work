import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, ChevronUp, ChevronDown, SkipForward, SkipBack, Disc, Radio } from 'lucide-react';
import { Button } from "./button";
import { Slider } from "./slider";
import { cn } from "@/lib/utils";

interface FloatingMusicStationProps {
  songs?: SongItem[];
  className?: string;
  defaultCollapsed?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'mid-left' | 'mid-right';
}

interface SongItem {
  title: string;
  artist: string;
  src: string;
}

// Default songs list
const DEFAULT_SONGS: SongItem[] = [
  {
    title: "No Weapon Formed Against Me Shall Prosper",
    artist: "Fred Hammond",
    src: "/tera/media/no-weapon.mp3"
  },
  {
    title: "Deep",
    artist: "Stewart Villain",
    src: "/music/Deep (prod. Stewart Villain).mp3"
  },
  {
    title: "Cosmic Waves",
    artist: "KLOUD BUGS",
    src: "/music/cosmic-waves.mp3"
  },
  {
    title: "Digital Rights",
    artist: "The Guardians",
    src: "/music/digital-rights.mp3"
  }
];

const FloatingMusicStation: React.FC<FloatingMusicStationProps> = ({ 
  songs = DEFAULT_SONGS,
  className,
  defaultCollapsed = true,
  position = 'top-right'
}) => {
  // Retrieve values from localStorage to persist state across page navigation
  const savedCollapsed = localStorage.getItem('musicPlayerCollapsed');
  const savedPlaying = localStorage.getItem('musicPlayerPlaying');
  const savedMuted = localStorage.getItem('musicPlayerMuted');
  const savedVolume = localStorage.getItem('musicPlayerVolume');
  const savedSongIndex = localStorage.getItem('musicPlayerSongIndex');
  const savedCurrentTime = localStorage.getItem('musicPlayerCurrentTime');
  
  const [isCollapsed, setIsCollapsed] = useState(savedCollapsed ? savedCollapsed === 'true' : defaultCollapsed);
  const [isPlaying, setIsPlaying] = useState(savedPlaying === 'true');
  const [isMuted, setIsMuted] = useState(savedMuted === 'true');
  const [volume, setVolume] = useState(savedVolume ? parseInt(savedVolume) : 80);
  const [currentSongIndex, setCurrentSongIndex] = useState(savedSongIndex ? parseInt(savedSongIndex) : 0);
  const [currentTime, setCurrentTime] = useState(savedCurrentTime ? parseFloat(savedCurrentTime) : 0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showVisualizer, setShowVisualizer] = useState(false);
  
  // Save music player state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('musicPlayerCollapsed', String(isCollapsed));
    localStorage.setItem('musicPlayerPlaying', String(isPlaying));
    localStorage.setItem('musicPlayerMuted', String(isMuted));
    localStorage.setItem('musicPlayerVolume', String(volume));
    localStorage.setItem('musicPlayerSongIndex', String(currentSongIndex));
    
    if (audioRef.current) {
      localStorage.setItem('musicPlayerCurrentTime', String(audioRef.current.currentTime));
    }
  }, [isCollapsed, isPlaying, isMuted, volume, currentSongIndex]);
  
  // Resume playback when component mounts based on the saved state
  useEffect(() => {
    if (audioRef.current) {
      // Set the volume first
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
      
      // If we have a saved time, seek to it
      if (savedCurrentTime) {
        audioRef.current.currentTime = parseFloat(savedCurrentTime);
      }
      
      // Start playing if it was playing before
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Auto-resume playback failed:", err);
          setIsPlaying(false);
        });
      }
    }
  }, []);

  // Current song based on index
  const currentSong = songs[currentSongIndex];

  // Get position classes
  const getPositionClasses = (pos: string) => {
    switch (pos) {
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      case 'mid-right': return 'top-1/2 -translate-y-1/2 right-4';
      case 'mid-left': return 'top-1/2 -translate-y-1/2 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-24 left-4'; // Adjusted to be higher from the bottom to avoid sound controls
      default: return 'bottom-24 left-4';
    }
  };
  
  const positionClasses = getPositionClasses(position);

  // Load metadata when audio is ready
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Update current time as the audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error("Playback failed:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle volume change
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  // Handle seeking
  const handleSeek = (values: number[]) => {
    const seekTime = values[0];
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Previous song
  const playPreviousSong = () => {
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
    if (isPlaying && audioRef.current) {
      // Need to wait for the new song to load
      audioRef.current.onloadeddata = () => {
        audioRef.current?.play();
      };
    }
  };

  // Next song
  const playNextSong = () => {
    setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1));
    if (isPlaying && audioRef.current) {
      // Need to wait for the new song to load
      audioRef.current.onloadeddata = () => {
        audioRef.current?.play();
      };
    }
  };

  // Format time (seconds) to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // When song ends, play next song
  const handleSongEnd = () => {
    playNextSong();
  };

  return (
    <div 
      className={cn(
        "fixed z-[30] transition-all duration-300 ease-in-out",
        positionClasses,
        className
      )}
    >
      {/* Collapsed mode - just a button */}
      {isCollapsed ? (
        <Button
          onClick={() => setIsCollapsed(false)}
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 shadow-lg hover:shadow-purple-500/20"
        >
          <Music className="h-5 w-5" />
        </Button>
      ) : (
        // Expanded music player
        <div className="w-72 bg-black/80 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden">
          {/* Header with collapse button */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-700 to-purple-800 border-b border-purple-500/30">
            <div className="flex items-center gap-2">
              <Disc className="h-5 w-5 animate-spin text-purple-200" style={{ animationDuration: "4s" }} />
              <span className="font-semibold text-purple-100">Cosmic Sound Station</span>
            </div>
            <Button
              onClick={() => setIsCollapsed(true)}
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-purple-700/50"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Song details */}
          <div className="p-3 border-b border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                <Radio className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-purple-100 font-medium truncate text-sm">{currentSong.title}</h3>
                <p className="text-purple-300 text-xs truncate">{currentSong.artist}</p>
              </div>
            </div>
          </div>

          {/* Audio element (hidden) */}
          <audio 
            ref={audioRef}
            src={currentSong.src}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleSongEnd}
            onError={(e) => console.error("Audio error:", e)}
            preload="metadata"
            autoPlay={isPlaying}
            loop={false}
          />

          {/* Seek bar */}
          <div className="px-3 py-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="my-1"
            />
            <div className="flex justify-between text-xs text-purple-300">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-3 py-3">
            <Button
              onClick={playPreviousSong}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-purple-700/30"
            >
              <SkipBack className="h-5 w-5 text-purple-200" />
            </Button>
            
            <Button
              onClick={togglePlay}
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <Button
              onClick={playNextSong}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-purple-700/30"
            >
              <SkipForward className="h-5 w-5 text-purple-200" />
            </Button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2 px-3 pb-3">
            <Button
              onClick={toggleMute}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-purple-300 hover:text-white hover:bg-purple-700/30"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingMusicStation;