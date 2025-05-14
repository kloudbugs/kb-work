import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Music } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicContext';
import { cn } from '@/lib/utils';

interface GlobalMusicBarProps {
  onClose: () => void;
}

const GlobalMusicBar: React.FC<GlobalMusicBarProps> = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    currentSong, 
    isPlaying, 
    togglePlayPause, 
    skipToNext, 
    skipToPrevious,
    currentTime,
    duration,
    seekTo
  } = useMusicPlayer();

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    seekTo(seekTime);
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
    <div 
      className={cn(
        "fixed left-4 bottom-4 z-50 transition-all duration-300 ease-in-out",
        "bg-gradient-to-r from-indigo-950/90 to-purple-950/90 backdrop-blur-md",
        "border border-indigo-500/20 rounded-lg shadow-lg overflow-hidden",
        isExpanded ? "w-80" : "w-auto"
      )}
    >
      <div className="flex items-center">
        {/* Collapse/Expand button */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-indigo-300 hover:text-indigo-100 hover:bg-indigo-900/50 transition-colors"
        >
          <Music size={18} />
        </button>
        
        {isExpanded ? (
          <div className="flex-1 px-2 py-2">
            <div className="flex justify-between items-center mb-1">
              {/* Song info */}
              <div className="text-xs">
                <div className="text-indigo-100 font-medium truncate">
                  {currentSong?.title || 'No song playing'}
                </div>
                <div className="text-indigo-300 text-xs truncate">
                  {currentSong?.artist || 'Unknown artist'}
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="text-indigo-400 hover:text-indigo-200 p-1"
                title="Close music player"
              >
                <X size={14} />
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="relative h-1 bg-indigo-900/60 rounded-full mb-2 cursor-pointer">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 to-purple-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.01"
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            {/* Control buttons and time display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={skipToPrevious}
                  className="p-1 text-indigo-300 hover:text-indigo-100 transition-colors"
                  title="Previous track"
                >
                  <SkipBack size={16} />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                
                <button
                  onClick={skipToNext}
                  className="p-1 text-indigo-300 hover:text-indigo-100 transition-colors"
                  title="Next track"
                >
                  <SkipForward size={16} />
                </button>
              </div>
              
              <div className="text-xs text-indigo-300">
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="flex space-x-1">
              <button
                onClick={skipToPrevious}
                className="p-1 text-indigo-300 hover:text-indigo-100 transition-colors"
                title="Previous track"
              >
                <SkipBack size={14} />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="p-1 text-indigo-300 hover:text-indigo-100 transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
              
              <button
                onClick={skipToNext}
                className="p-1 text-indigo-300 hover:text-indigo-100 transition-colors"
                title="Next track"
              >
                <SkipForward size={14} />
              </button>
            </div>
            
            <div className="mx-2 text-xs text-indigo-300 truncate max-w-28">
              {currentSong?.title || 'No song'}
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 text-indigo-400 hover:text-indigo-200"
              title="Close music player"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalMusicBar;