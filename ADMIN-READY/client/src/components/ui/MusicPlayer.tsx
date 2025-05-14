import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  audioSrc: string;
  songTitle: string;
  artistName?: string;
  autoPlay?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  audioSrc, 
  songTitle, 
  artistName = "Tribute Music",
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Effect to handle autoplay
  useEffect(() => {
    if (autoPlay && audioRef.current) {
      // Most browsers require user interaction before autoplay
      // This will prepare it, but might not actually play without interaction
      audioRef.current.play().catch(() => {
        console.log('Autoplay was prevented. User interaction required.');
      });
    }
  }, [autoPlay]);

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

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
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

  // Calculate progress percentage for styling
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-purple-900/50 backdrop-blur-lg border border-purple-500/30 rounded-lg p-4 shadow-lg max-w-md mx-auto">
      {/* Audio element */}
      <audio 
        ref={audioRef}
        src={audioSrc}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop
      />
      
      {/* Song info */}
      <div className="mb-3 text-center">
        <h3 className="text-purple-100 text-lg font-medium truncate">{songTitle}</h3>
        <p className="text-purple-300 text-sm truncate">{artistName}</p>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-center mb-3 space-x-4">
        {/* Play/Pause Button */}
        <button 
          onClick={togglePlay}
          className="bg-purple-700 hover:bg-purple-600 text-white p-3 rounded-full transition-colors duration-300 shadow-md"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        {/* Mute/Unmute Button */}
        <button 
          onClick={toggleMute}
          className="bg-purple-800 hover:bg-purple-700 text-white p-2 rounded-full transition-colors duration-300"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mb-2">
        <div className="relative h-1 bg-purple-800 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-fuchsia-500 transition-all duration-100 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.01"
          value={currentTime}
          onChange={handleSeek}
          className="absolute w-full opacity-0 cursor-pointer -mt-1"
        />
      </div>
      
      {/* Time indicators */}
      <div className="flex justify-between text-xs text-purple-300 px-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default MusicPlayer;