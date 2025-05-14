import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Disc, Radio } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface MusicControlPanelProps {
  className?: string;
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
  }
];

const MusicControlPanel: React.FC<MusicControlPanelProps> = ({ 
  className
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [enableFloatingPlayer, setEnableFloatingPlayer] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Current song based on index
  const currentSong = DEFAULT_SONGS[currentSongIndex];

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

  // Format time (seconds) to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toggle floating player visibility in App.tsx
  useEffect(() => {
    // Store the setting in localStorage to be read by App.tsx
    localStorage.setItem('showFloatingMusicPlayer', String(enableFloatingPlayer));
    
    // Dispatch a custom event to notify App.tsx about the change
    const event = new CustomEvent('musicPlayerSettingChanged', { 
      detail: { showFloatingPlayer: enableFloatingPlayer } 
    });
    window.dispatchEvent(event);
  }, [enableFloatingPlayer]);

  return (
    <Card className={cn("bg-black/80 backdrop-blur-md border border-purple-500/30", className)}>
      <CardHeader className="bg-gradient-to-r from-indigo-700 to-purple-800 border-b border-purple-500/30 p-4">
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <Disc className="h-5 w-5 animate-spin text-purple-200" style={{ animationDuration: "4s" }} />
          Cosmic Music Administration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Audio element (hidden) */}
        <audio 
          ref={audioRef}
          src={currentSong.src}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          preload="metadata"
        />

        {/* Song details */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
            <Radio className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-purple-100 font-medium truncate">{currentSong.title}</h3>
            <p className="text-purple-300 text-sm truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Seek bar */}
        <div>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="my-2"
          />
          <div className="flex justify-between text-xs text-purple-300">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button
            onClick={togglePlay}
            variant="default"
            size="icon"
            className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center gap-2 flex-1">
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

        {/* Floating player toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
          <label className="text-sm text-purple-300">Show Floating Music Player</label>
          <Toggle 
            pressed={enableFloatingPlayer} 
            onPressedChange={setEnableFloatingPlayer}
            className="data-[state=on]:bg-purple-600"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicControlPanel;