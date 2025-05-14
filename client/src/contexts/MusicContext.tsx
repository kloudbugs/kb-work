import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Define song interface
interface Song {
  src: string;
  title: string;
  artist?: string;
}

// Define available songs in our playlist
const availableSongs: Song[] = [
  {
    src: '/music/deep-track.mp3', // Using simpler filename without spaces
    title: 'Deep',
    artist: 'Stewart Villain'
  },
  {
    src: '/music/stay-down.mp3',
    title: 'Stay Down',
    artist: 'Jr Patton Ft Greezy'
  },
  // Add more songs as needed - new songs will be available for all pages that use the music context
];

// Specific playlists for different pages
const pagePlaylists: Record<string, Song[]> = {
  welcome: [
    {
      src: '/music/deep-track.mp3',
      title: 'Deep',
      artist: 'Stewart Villain'
    }
  ],
  signup: [
    {
      src: '/music/deep-track.mp3',
      title: 'Deep',
      artist: 'Stewart Villain'
    }
  ],
  teraLegacy: [
    {
      src: '/music/tribute_song.mp3',
      title: 'No Weapon Formed Against Me Shall Prosper',
      artist: 'Fred Hammond'
    }
  ]
};

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  seekTo: (time: number) => void;
  setPagePlaylist: (page: string) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const useMusicPlayer = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlist, setPlaylist] = useState<Song[]>(availableSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element on component mount
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleSongEnd);
    
    // Try to load the first song
    if (playlist.length > 0) {
      audio.src = playlist[0].src;
      audio.volume = volume;
      audio.load();
    }
    
    // Clean up on unmount
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleSongEnd);
      audio.pause();
      audio.src = '';
    };
  }, []);
  
  // Set specific playlist for different pages
  const setPagePlaylist = (page: string) => {
    if (pagePlaylists[page]) {
      setPlaylist(pagePlaylists[page]);
      setCurrentSongIndex(0);
      
      if (audioRef.current) {
        const wasPlaying = !audioRef.current.paused;
        audioRef.current.src = pagePlaylists[page][0].src;
        audioRef.current.load();
        
        if (wasPlaying) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(error => {
              console.error('Failed to autoplay:', error);
              setIsPlaying(false);
            });
        }
      }
    }
  };
  
  // Load and play current song
  useEffect(() => {
    if (audioRef.current && playlist.length > 0) {
      const currentSong = playlist[currentSongIndex];
      audioRef.current.src = currentSong.src;
      audioRef.current.load();
      
      if (isPlaying) {
        audioRef.current.play()
          .catch(error => {
            console.error('Failed to play audio:', error);
            setIsPlaying(false);
          });
      }
    }
  }, [currentSongIndex, playlist]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleSongEnd = () => {
    // Play next song when current one ends
    skipToNext();
  };
  
  // Player control functions
  const togglePlayPause = () => {
    console.log('Toggle play/pause called, current state:', isPlaying);
    if (audioRef.current) {
      console.log('Audio element exists, current src:', audioRef.current.src);
      
      // If we don't have a src yet, try to set one
      if (!audioRef.current.src && playlist.length > 0) {
        console.log('Setting audio source to:', playlist[currentSongIndex].src);
        audioRef.current.src = playlist[currentSongIndex].src;
        audioRef.current.load();
      }
      
      if (isPlaying) {
        console.log('Pausing playback');
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        console.log('Starting playback');
        audioRef.current.play()
          .then(() => {
            console.log('Playback started successfully');
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Failed to play audio:', error);
            // Even if we failed, try one more time with a user interaction
            const retryPlay = () => {
              audioRef.current?.play()
                .then(() => {
                  console.log('Retry successful');
                  setIsPlaying(true);
                })
                .catch(retryError => {
                  console.error('Retry also failed:', retryError);
                  setIsPlaying(false);
                });
            };
            
            // Try again after a short delay
            setTimeout(retryPlay, 100);
          });
      }
    } else {
      console.error('Audio element not initialized');
    }
  };
  
  const skipToNext = () => {
    if (playlist.length > 0) {
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    }
  };
  
  const skipToPrevious = () => {
    if (playlist.length > 0) {
      setCurrentSongIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
    }
  };
  
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  // Save audio state in sessionStorage for page transitions
  useEffect(() => {
    const storeAudioState = () => {
      if (audioRef.current) {
        sessionStorage.setItem('musicCurrentTime', audioRef.current.currentTime.toString());
        sessionStorage.setItem('musicVolume', volume.toString());
        sessionStorage.setItem('musicPlaying', isPlaying.toString());
        sessionStorage.setItem('musicCurrentSongIndex', currentSongIndex.toString());
      }
    };
    
    window.addEventListener('beforeunload', storeAudioState);
    
    return () => {
      window.removeEventListener('beforeunload', storeAudioState);
    };
  }, [isPlaying, volume, currentSongIndex]);
  
  // Try to restore audio state from sessionStorage on page load
  useEffect(() => {
    const savedTime = sessionStorage.getItem('musicCurrentTime');
    const savedVolume = sessionStorage.getItem('musicVolume');
    const savedPlaying = sessionStorage.getItem('musicPlaying');
    const savedSongIndex = sessionStorage.getItem('musicCurrentSongIndex');
    
    if (savedVolume) {
      const parsedVolume = parseFloat(savedVolume);
      setVolume(parsedVolume);
      if (audioRef.current) {
        audioRef.current.volume = parsedVolume;
      }
    }
    
    if (savedSongIndex && playlist.length > 0) {
      const parsedIndex = parseInt(savedSongIndex, 10);
      if (parsedIndex >= 0 && parsedIndex < playlist.length) {
        setCurrentSongIndex(parsedIndex);
      }
    }
    
    if (savedTime && audioRef.current) {
      const parsedTime = parseFloat(savedTime);
      audioRef.current.currentTime = parsedTime;
      setCurrentTime(parsedTime);
    }
    
    if (savedPlaying === 'true' && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);
  
  // Get current song
  const currentSong = playlist.length > 0 ? playlist[currentSongIndex] : null;
  
  // Context value
  const contextValue: MusicContextType = {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    togglePlayPause,
    setVolume,
    skipToNext,
    skipToPrevious,
    seekTo,
    setPagePlaylist
  };
  
  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;