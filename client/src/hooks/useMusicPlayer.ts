import { useState, useEffect } from 'react';

export interface MusicPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentSongIndex: number;
  currentTime: number;
  isCollapsed: boolean;
}

export interface SongItem {
  title: string;
  artist: string;
  src: string;
}

export interface UseMusicPlayerOptions {
  defaultCollapsed?: boolean;
}

/**
 * A custom hook for managing music player state with localStorage persistence
 * This ensures consistent music playback across page navigations
 */
export function useMusicPlayer({ defaultCollapsed = true }: UseMusicPlayerOptions = {}) {
  // Retrieve values from localStorage to persist state across page navigation
  const savedCollapsed = localStorage.getItem('musicPlayerCollapsed');
  const savedPlaying = localStorage.getItem('musicPlayerPlaying');
  const savedMuted = localStorage.getItem('musicPlayerMuted');
  const savedVolume = localStorage.getItem('musicPlayerVolume');
  const savedSongIndex = localStorage.getItem('musicPlayerSongIndex');
  const savedCurrentTime = localStorage.getItem('musicPlayerCurrentTime');
  
  // Initialize state with saved values or defaults
  const [isCollapsed, setIsCollapsed] = useState(savedCollapsed ? savedCollapsed === 'true' : defaultCollapsed);
  const [isPlaying, setIsPlaying] = useState(savedPlaying === 'true');
  const [isMuted, setIsMuted] = useState(savedMuted === 'true');
  const [volume, setVolume] = useState(savedVolume ? parseInt(savedVolume) : 80);
  const [currentSongIndex, setCurrentSongIndex] = useState(savedSongIndex ? parseInt(savedSongIndex) : 0);
  const [currentTime, setCurrentTime] = useState(savedCurrentTime ? parseFloat(savedCurrentTime) : 0);
  const [duration, setDuration] = useState(0);
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('musicPlayerCollapsed', String(isCollapsed));
    localStorage.setItem('musicPlayerPlaying', String(isPlaying));
    localStorage.setItem('musicPlayerMuted', String(isMuted));
    localStorage.setItem('musicPlayerVolume', String(volume));
    localStorage.setItem('musicPlayerSongIndex', String(currentSongIndex));
  }, [isCollapsed, isPlaying, isMuted, volume, currentSongIndex]);
  
  // Update currentTime separately to avoid excessive writes
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && currentTime > 0) {
        localStorage.setItem('musicPlayerCurrentTime', String(currentTime));
      }
    }, 5000); // Update every 5 seconds to reduce writes
    
    return () => clearInterval(interval);
  }, [isPlaying, currentTime]);
  
  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleCollapsed = () => setIsCollapsed(!isCollapsed);
  const nextSong = (totalSongs: number) => {
    setCurrentSongIndex(prev => (prev === totalSongs - 1 ? 0 : prev + 1));
  };
  const prevSong = (totalSongs: number) => {
    setCurrentSongIndex(prev => (prev === 0 ? totalSongs - 1 : prev - 1));
  };
  
  return {
    // State
    isPlaying,
    isMuted,
    volume,
    currentSongIndex,
    currentTime,
    duration,
    isCollapsed,
    
    // Setters
    setIsPlaying,
    setIsMuted,
    setVolume,
    setCurrentSongIndex,
    setCurrentTime,
    setDuration,
    setIsCollapsed,
    
    // Actions
    togglePlay,
    toggleMute,
    toggleCollapsed,
    nextSong,
    prevSong,
    
    // Helper values
    savedCurrentTime
  };
}

export default useMusicPlayer;