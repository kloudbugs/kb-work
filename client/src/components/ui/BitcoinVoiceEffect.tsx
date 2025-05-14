import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

interface BitcoinVoiceEffectProps {
  onComplete?: () => void;
}

// Manually create a useFrame hook since we're not using it directly in a Canvas
function useFrame(callback: (state: any) => void) {
  const [clock] = React.useState(() => new THREE.Clock());
  
  React.useEffect(() => {
    const animate = () => {
      callback({ clock });
      frameId = requestAnimationFrame(animate);
    };
    
    let frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [callback, clock]);
}

// Component for electric tendrils that emit from the bitcoin
const ElectricTendrils: React.FC<{
  count: number;
  length: number;
  color: string;
  width: number;
}> = ({ count, length, color, width }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });
  
  // Generate tendrils
  const tendrils = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const points = [];
      const segments = 20;
      const radius = 0.5 + Math.random() * 0.3;
      const startAngle = Math.random() * Math.PI * 2;
      const angleStep = ((Math.random() > 0.5 ? 1 : -1) * Math.PI * 2) / segments;
      
      for (let j = 0; j <= segments; j++) {
        const angle = startAngle + angleStep * j;
        const x = Math.cos(angle) * radius * (1 - j / segments * 0.5);
        const z = Math.sin(angle) * radius * (1 - j / segments * 0.5);
        const y = (j / segments) * length - length * 0.5;
        
        points.push(new THREE.Vector3(x, y, z));
      }
      
      return new THREE.CatmullRomCurve3(points);
    });
  }, [count, length]);
  
  return (
    <group ref={groupRef}>
      {tendrils.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 64, width, 8, false]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.8}
            transparent={true}
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
};

// Star notification that appears in corner
const StarNotification: React.FC<{
  visible: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  pulseColor: string;
  size: number;
  message: string;
  onClick: () => void;
}> = ({ visible, position, pulseColor, size, message, onClick }) => {
  if (!visible) return null;
  
  const positionStyles: React.CSSProperties = {
    position: 'absolute',
    padding: '15px',
  };
  
  switch (position) {
    case 'top-left':
      positionStyles.top = '20px';
      positionStyles.left = '20px';
      break;
    case 'top-right':
      positionStyles.top = '20px';
      positionStyles.right = '20px';
      break;
    case 'bottom-left':
      positionStyles.bottom = '20px';
      positionStyles.left = '20px';
      break;
    case 'bottom-right':
      positionStyles.bottom = '20px';
      positionStyles.right = '20px';
      break;
  }
  
  return (
    <div 
      style={positionStyles}
      onClick={onClick}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 15px',
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '8px',
        border: `1px solid ${pulseColor}`,
        boxShadow: `0 0 10px ${pulseColor}`,
        cursor: 'pointer',
        animation: 'pulse 2s infinite'
      }}>
        <div style={{
          width: `${size}px`,
          height: `${size}px`,
          marginRight: '10px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${pulseColor} 0%, rgba(0,0,0,0) 70%)`,
            animation: 'pulse 2s infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '24px',
            color: 'white'
          }}>
            ★
          </div>
        </div>
        <div style={{
          fontSize: '14px',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      </div>
    </div>
  );
};

const BitcoinVoiceEffect: React.FC<BitcoinVoiceEffectProps> = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tendrilsActive, setTendrilsActive] = useState(false);
  const [showStarNotification, setShowStarNotification] = useState(false);
  const bitcoinPosition = [0, 0, 0]; // Center position for the bitcoin
  const tendrilsRef = useRef<THREE.Group>(null);
  
  // Function to trigger effect visuals when voice is playing
  const playEffect = () => {
    setIsPlaying(true);
    setTendrilsActive(true);
    
    // Simulate voice duration
    setTimeout(() => {
      setTendrilsActive(false);
      setIsPlaying(false);
      
      // Show star notification after voice finishes
      setTimeout(() => {
        setShowStarNotification(true);
      }, 1000);
      
      // Call onComplete callback
      if (onComplete) {
        onComplete();
      }
    }, 5000);
  };
  
  // Handle star notification click
  const handleStarClick = () => {
    setShowStarNotification(false);
  };
  
  // Auto-play when the component mounts (after a delay to ensure audio is ready)
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Auto-playing welcome effect...");
      playEffect();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <group position={bitcoinPosition} ref={tendrilsRef}>
      {tendrilsActive && (
        <ElectricTendrils 
          count={12}
          length={5}
          color="#00ffff"
          width={0.15}
        />
      )}
      
      {/* Star notification that appears in the top left corner when effect ends */}
      <StarNotification 
        visible={showStarNotification}
        position="top-left"
        pulseColor="#ffcc00"
        size={40}
        message="DISCOVER FEATURES!"
        onClick={handleStarClick}
      />
    </group>
  );
};

export default BitcoinVoiceEffect;