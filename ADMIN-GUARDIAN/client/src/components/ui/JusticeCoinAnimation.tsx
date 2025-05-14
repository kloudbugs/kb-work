import React from 'react';
import CoinAnimation from './CoinAnimation';

interface JusticeCoinAnimationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function JusticeCoinAnimation({ 
  className = '',
  size = 'md' 
}: JusticeCoinAnimationProps) {
  // Define the image path for the Justice token
  const justiceCoinPath = "/images/justice-token.png";
  
  // Set size class based on the size prop
  const sizeClass = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }[size];
  
  return (
    <div className={`${sizeClass} ${className}`}>
      <CoinAnimation 
        imagePath={justiceCoinPath}
        altText="Justice Token"
        className="w-full h-full"
        onAnimationComplete={() => {
          console.log('Justice token animation completed');
        }}
      />
    </div>
  );
}