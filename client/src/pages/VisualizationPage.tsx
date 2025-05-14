import React, { Suspense, useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Create OrbitingLogo component inline since we don't have direct access to the original
const OrbitingLogo: React.FC<{ radius?: number, speed?: number }> = ({ 
  radius = 3,
  speed = 0.3
}) => {
  // Use React Three Fiber to create the orbing effect
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshStandardMaterial 
          color="#ffcc00" 
          metalness={0.9}
          roughness={0.1}
          emissive="#ff9900"
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* Create orbiting elements */}
      {[0, 1, 2].map((idx) => (
        <OrbitingItem 
          key={idx} 
          radius={radius} 
          speed={speed} 
          offset={idx * Math.PI * 0.67}
          height={idx * 0.1 - 0.1} 
        />
      ))}
    </group>
  );
};

// OrbitingItem for the logo
const OrbitingItem: React.FC<{ 
  radius: number;
  speed: number;
  offset: number;
  height: number;
}> = ({ radius, speed, offset, height }) => {
  const ref = React.useRef<THREE.Group>(null);
  
  // Animation using useFrame from react-three-fiber
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed + offset;
      
      // Calculate position on orbit circle
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      
      // Set position with y offset for height
      ref.current.position.set(x, height, z);
      
      // Make the item always face the center
      ref.current.lookAt(0, height, 0);
    }
  });
  
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#FF5733" 
          emissive="#FF5733"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

// Helper component for Electric Tendrils effect
const ElectricTendrils: React.FC<{ count?: number }> = ({ count = 20 }) => {
  const groupRef = React.useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });
  
  // Generate tendrils
  const tendrils = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const points = [];
      const segments = 20;
      const radius = 2 + Math.random() * 1;
      const startAngle = Math.random() * Math.PI * 2;
      const angleStep = ((Math.random() > 0.5 ? 1 : -1) * Math.PI * 2) / segments;
      
      for (let j = 0; j <= segments; j++) {
        const angle = startAngle + angleStep * j;
        const x = Math.cos(angle) * radius * (1 - j / segments * 0.5);
        const z = Math.sin(angle) * radius * (1 - j / segments * 0.5);
        const y = (j / segments) * 2 - 1 + (Math.random() * 0.2 - 0.1);
        
        points.push(new THREE.Vector3(x, y, z));
      }
      
      return new THREE.CatmullRomCurve3(points);
    });
  }, [count]);
  
  return (
    <group ref={groupRef}>
      {tendrils.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 64, 0.02, 8, false]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#00ffff" : "#ff00ff"} 
            emissive={i % 2 === 0 ? "#00ffff" : "#ff00ff"}
            emissiveIntensity={0.8}
            transparent={true}
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
};

// Helper function for useFrame hook
function useFrame(callback: (state: { clock: THREE.Clock }) => void) {
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

const VisualizationPage: React.FC = () => {
  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden', background: 'black' }}>
      {/* Return to Home link */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '4px',
        padding: '6px 12px',
        border: '1px solid #8A2BE2',
      }}>
        <Link href="/">
          <button style={{ 
            color: '#8A2BE2', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontFamily: 'monospace',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}>
            ← Back to Home
          </button>
        </Link>
      </div>
      
      {/* The main visualization interface using Three.js */}
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
          
          {/* Cosmic Background */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {/* Main OrbitingLogo Component */}
          <OrbitingLogo radius={3} speed={0.3} />
          
          {/* Electric Tendrils Effect */}
          <ElectricTendrils count={30} />
          
          {/* Camera Controls */}
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={4}
            maxDistance={20}
            zoomSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      
      {/* Information overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '10px 15px',
          borderRadius: '4px',
          color: 'white',
          fontSize: '14px',
          zIndex: 1000,
          border: '1px solid #8A2BE2',
        }}
      >
        <p>Cosmic Mining Platform Visualization</p>
        <p>Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
};

export default VisualizationPage;