import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GlobeVisualizationProps {
  className?: string;
}

export function GlobeVisualization({ className }: GlobeVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match the display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.85;
    
    // Create points for the globe (latitude/longitude grid)
    const points = [];
    const latitudeCount = 18;
    const longitudeCount = 36;
    
    // Create latitude rings
    for (let lat = -90; lat <= 90; lat += 180 / latitudeCount) {
      for (let lon = -180; lon < 180; lon += 360 / longitudeCount) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + rotation) * (Math.PI / 180);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        // Only add points that are on the front half of the sphere (z > 0)
        if (z > -radius * 0.2) {
          points.push({
            x: centerX + x,
            y: centerY + y,
            z,
            radius: 1 + (z / radius) * 1.5, // Size based on depth
            alpha: 0.2 + (z / radius) * 0.8, // Opacity based on depth
            isLand: Math.random() > 0.7, // Randomly assign as land or water
          });
        }
      }
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections between nearby points
    ctx.lineWidth = 0.5;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const p1 = points[i];
        const p2 = points[j];
        
        // Calculate distance between points
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Draw connection if points are close enough
        if (distance < radius * 0.4) {
          // Calculate opacity based on z-position of both points
          const avgZ = (p1.z + p2.z) / (2 * radius);
          const connectionAlpha = 0.05 + avgZ * 0.1;
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${connectionAlpha})`;
          ctx.stroke();
        }
      }
    }
    
    // Draw points
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      
      // Different colors for land vs water
      if (point.isLand) {
        ctx.fillStyle = `rgba(56, 189, 248, ${point.alpha})`; // Bright cyan for land
      } else {
        ctx.fillStyle = `rgba(6, 182, 212, ${point.alpha * 0.7})`; // Darker cyan for water
      }
      
      ctx.fill();
    });
    
    // Add pulsing glow effect for active mining nodes
    const activeNodePositions = [
      { lat: 40, lon: -74 },  // New York
      { lat: 34, lon: -118 }, // Los Angeles
      { lat: 51, lon: -0.1 }, // London
      { lat: 35, lon: 139 },  // Tokyo
      { lat: -33, lon: 151 }, // Sydney
      { lat: 55, lon: 37 },   // Moscow
      { lat: 1, lon: 103 },   // Singapore
      { lat: -23, lon: -46 }, // São Paulo
    ];
    
    activeNodePositions.forEach(pos => {
      const phi = (90 - pos.lat) * (Math.PI / 180);
      const theta = (pos.lon + rotation) * (Math.PI / 180);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      // Only draw if on front-facing side
      if (z > -radius * 0.2) {
        const screenX = centerX + x;
        const screenY = centerY + y;
        
        // Draw pulsing circle
        const pulseSize = 3 + (z / radius) * 4; // Size based on depth
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
          screenX, screenY, 0,
          screenX, screenY, pulseSize * 2
        );
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.8)');
        gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.3)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
        
        ctx.beginPath();
        ctx.arc(screenX, screenY, pulseSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Inner dot
        ctx.beginPath();
        ctx.arc(screenX, screenY, pulseSize * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(14, 165, 233)';
        ctx.fill();
      }
    });
    
    // Add a subtle ambient glow around the globe
    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.8,
      centerX, centerY, radius * 1.5
    );
    glowGradient.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
    glowGradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();
  }, [rotation]);
  
  // Rotate the globe smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`relative ${className || ''}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      
      {/* Add cosmic atmosphere effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Add moving particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`globe-particle-${i}`}
            className="absolute rounded-full bg-cyan-400"
            initial={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.1
            }}
            animate={{
              top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + Math.random() * 10,
              ease: "linear"
            }}
            style={{ filter: 'blur(1px)' }}
          />
        ))}
      </div>
    </div>
  );
}

export default GlobeVisualization;