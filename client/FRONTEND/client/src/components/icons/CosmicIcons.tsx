import React from 'react';

// Voice icon - cosmic microphone with star/sound waves
export const VoiceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <circle cx="5" cy="3" r="1" fill="currentColor" />
    <circle cx="19" cy="5" r="1" fill="currentColor" />
    <circle cx="3" cy="12" r="1" fill="currentColor" />
    <circle cx="21" cy="12" r="1" fill="currentColor" />
    <circle cx="5" cy="19" r="1" fill="currentColor" />
    <circle cx="19" cy="19" r="1" fill="currentColor" />
  </svg>
);

// Music icon - cosmic musical note with stars
export const MusicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
    <circle cx="4" cy="4" r="1" fill="currentColor" />
    <circle cx="20" cy="4" r="1" fill="currentColor" />
    <circle cx="12" cy="10" r="1" fill="currentColor" />
  </svg>
);

// Mute icon - cosmic sound wave with x
export const MuteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="3" x2="21" y2="21" />
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <circle cx="20" cy="5" r="1" fill="currentColor" />
    <circle cx="16" cy="20" r="1" fill="currentColor" />
  </svg>
);

// Sound icon - cosmic sound wave
export const SoundIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m11 5-5 4H2v6h4l5 4V5Z" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <circle cx="3" cy="4" r="1" fill="currentColor" />
    <circle cx="20" cy="20" r="1" fill="currentColor" />
  </svg>
);

// Mining icon - cosmic pickaxe with stars
export const MiningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 10 9 15 5 11l5-5" />
    <path d="m19 5-5 5" />
    <path d="m2 22 5-5" />
    <path d="M10.5 13.5 7 17" />
    <path d="M14 6 9 11" />
    <circle cx="22" cy="2" r="1" fill="currentColor" />
    <circle cx="4" cy="8" r="1" fill="currentColor" />
    <circle cx="16" cy="18" r="1" fill="currentColor" />
  </svg>
);

// Electric icon - cosmic lightning with stars
export const ElectricIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    <circle cx="20" cy="3" r="1" fill="currentColor" />
    <circle cx="4" cy="6" r="1" fill="currentColor" />
    <circle cx="10" cy="20" r="1" fill="currentColor" />
  </svg>
);

// Platform icon - cosmic platform/portal with stars
export const PlatformIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="m2 12 4-4" />
    <path d="M22 12h-4" />
    <path d="m12 2 3 3" />
    <path d="m19 19-3-3" />
    <circle cx="17" cy="5" r="1" fill="currentColor" />
    <circle cx="6" cy="18" r="1" fill="currentColor" />
  </svg>
);

// Vault icon - cosmic lock with stars
export const VaultIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
    <circle cx="4" cy="4" r="1" fill="currentColor" />
    <circle cx="20" cy="4" r="1" fill="currentColor" />
    <circle cx="12" cy="22" r="1" fill="currentColor" />
  </svg>
);

// Stats icon - cosmic chart with stars
export const StatsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <circle cx="3" cy="4" r="1" fill="currentColor" />
    <circle cx="20" cy="6" r="1" fill="currentColor" />
    <circle cx="16" cy="16" r="1" fill="currentColor" />
  </svg>
);

// Enter Platform icon - cosmic portal/doorway with stars
export const EnterPlatformIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
    <circle cx="4" cy="4" r="1" fill="currentColor" />
    <circle cx="20" cy="20" r="1" fill="currentColor" />
    <circle cx="4" cy="20" r="1" fill="currentColor" />
    <circle cx="20" cy="4" r="1" fill="currentColor" />
  </svg>
);