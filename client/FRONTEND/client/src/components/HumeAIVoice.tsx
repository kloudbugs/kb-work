import React, { useEffect, useRef, useState } from 'react';

interface HumeAIVoiceProps {
  text?: string;
  autoPlay?: boolean;
  onPlayComplete?: () => void;
  className?: string;
  useWelcomeMessage?: boolean;
}

/**
 * Component that uses Hume AI to generate and play high-quality AI voice
 */
export function HumeAIVoice({
  text,
  autoPlay = true,
  onPlayComplete,
  className = '',
  useWelcomeMessage = false
}: HumeAIVoiceProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isFallback, setIsFallback] = useState(false);

  // Generate speech when the component mounts or text changes
  useEffect(() => {
    if (!text && !useWelcomeMessage) return;

    const fetchAudio = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use welcome message endpoint if specified, otherwise generate speech from text
        const endpoint = useWelcomeMessage 
          ? '/api/hume/zig-welcome'
          : '/api/hume/generate-speech';

        const response = useWelcomeMessage
          ? await fetch(endpoint)
          : await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                text,
                voiceId: 'female_british_001',
                outputFileName: `speech-${Date.now()}`
              }),
            });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.fallback) {
          setIsFallback(true);
          console.warn("Using fallback audio instead of Hume AI voice:", data.error);
        }

        if (data.audioPath) {
          setAudioUrl(data.audioPath);
        } else {
          throw new Error('No audio path returned from server');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error generating speech');
        console.error('Error generating speech:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudio();
  }, [text, useWelcomeMessage]);

  // Play audio when URL is set and autoPlay is enabled
  useEffect(() => {
    if (audioUrl && autoPlay && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error('Error auto-playing audio:', err);
        setError('Could not auto-play audio. Please click to play.');
      });
    }
  }, [audioUrl, autoPlay]);

  // Handle play completion
  const handleEnded = () => {
    if (onPlayComplete) {
      onPlayComplete();
    }
  };

  return (
    <div className={`hume-ai-voice ${className}`}>
      {isLoading && <div className="hume-loading">Loading AI voice...</div>}
      
      {error && <div className="hume-error">Error: {error}</div>}
      
      {audioUrl && (
        <>
          <audio 
            ref={audioRef}
            src={audioUrl} 
            onEnded={handleEnded}
            controls={!autoPlay}
          />
          
          {isFallback && (
            <div className="hume-fallback-notice">
              Using fallback audio (Hume AI service unavailable)
            </div>
          )}
          
          {!autoPlay && (
            <button 
              onClick={() => audioRef.current?.play()} 
              className="hume-play-button"
            >
              Play
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default HumeAIVoice;