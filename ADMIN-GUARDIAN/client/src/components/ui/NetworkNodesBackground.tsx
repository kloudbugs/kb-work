import React, { useEffect, useRef, useState } from 'react';

interface NetworkNodesBackgroundProps {
  nodeCount?: number;
  parentSelector: string;
  nodeColor?: string;
  connectionColor?: string;
  sendNodesToOrbit?: boolean;
  targetImageSelector?: string;
  nodesGrowEffect?: boolean;
  growthScale?: number;
  pulseIntensity?: number;
}

export function NetworkNodesBackground({
  nodeCount = 6,
  parentSelector,
  nodeColor = 'rgba(147, 51, 234, 0.9)',
  connectionColor = 'rgba(147, 51, 234, 0.6)',
  sendNodesToOrbit = false,
  targetImageSelector = '.orbit-target-image',
  nodesGrowEffect = false,
  growthScale = 2.5,
  pulseIntensity = 1.2
}: NetworkNodesBackgroundProps) {
  const nodesRef = useRef<HTMLDivElement>(null);
  const [orbitPosition, setOrbitPosition] = useState<{x: number, y: number} | null>(null);
  
  // Find orbit position based on target selector
  useEffect(() => {
    if (sendNodesToOrbit && targetImageSelector) {
      const findOrbitTarget = () => {
        const targetElement = document.querySelector(targetImageSelector) as HTMLElement;
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          setOrbitPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          });
        }
      };
      
      findOrbitTarget();
      // Update position on resize
      window.addEventListener('resize', findOrbitTarget);
      
      return () => {
        window.removeEventListener('resize', findOrbitTarget);
      };
    }
  }, [sendNodesToOrbit, targetImageSelector]);
  
  useEffect(() => {
    const container = document.querySelector(parentSelector) as HTMLElement;
    if (!container || !nodesRef.current) return;
    
    // Clear any existing nodes
    while (nodesRef.current.firstChild) {
      nodesRef.current.removeChild(nodesRef.current.firstChild);
    }
    
    const nodes: HTMLElement[] = [];
    const containerRect = container.getBoundingClientRect();
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const node = document.createElement('div');
      node.className = 'network-node';
      
      // Calculate positions around the text - distribute around the text
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = Math.min(containerRect.width * 0.6, containerRect.height * 1.8);
      
      // Position node in elliptical orbit around the text
      const left = containerRect.width / 2 + Math.cos(angle) * radius / 2;
      const top = containerRect.height / 2 + Math.sin(angle) * radius / 3;
      
      node.style.left = `${left}px`;
      node.style.top = `${top}px`;
      node.style.animationName = 'float-around';
      node.style.animationDuration = `${6 + Math.random() * 6}s`;
      node.style.animationDelay = `${Math.random() * 2}s`;
      node.style.animationTimingFunction = 'ease-in-out';
      node.style.animationIterationCount = 'infinite';
      
      // Apply growing effect if enabled
      if (nodesGrowEffect) {
        // Assign random growth timing for each node
        node.style.transition = 'width 0.8s ease-out, height 0.8s ease-out, opacity 0.8s ease-out, box-shadow 0.8s ease-out';
        
        // Store original size for reference
        node.dataset.originalSize = '8';
        
        // Start with smaller size
        node.style.width = '5px';
        node.style.height = '5px';
        node.style.opacity = '0.5';
        
        // Add class for easy identification
        node.classList.add('growing-node');
        
        // Apply delayed growth effect
        setTimeout(() => {
          node.style.width = `${8 * growthScale}px`;  
          node.style.height = `${8 * growthScale}px`;
          node.style.opacity = '0.9';
          node.style.boxShadow = `0 0 ${15 * pulseIntensity}px ${nodeColor}`;
          node.style.backgroundColor = nodeColor;
        }, 1000 + i * 200 + Math.random() * 1000);
      }
      
      // Add chance for nodes to travel to orbit
      if (sendNodesToOrbit && Math.random() < 0.3) { // 30% chance for each node
        node.classList.add('orbit-bound-node');
        // Put animation on pause temporarily
        node.style.animationPlayState = 'paused';
      }
      
      nodesRef.current.appendChild(node);
      nodes.push(node);
    }
    
    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      const node1 = nodes[i];
      
      // Connect to the next node and a random node to create a network
      const nextIndex = (i + 1) % nodes.length;
      const randomIndex = Math.floor(Math.random() * nodes.length);
      
      if (nextIndex !== i) {
        createConnection(node1, nodes[nextIndex], nodesRef.current);
      }
      
      if (randomIndex !== i && randomIndex !== nextIndex) {
        createConnection(node1, nodes[randomIndex], nodesRef.current);
      }
    }
    
    // Handle nodes traveling to orbit
    let travelingNodes: {
      node: HTMLElement;
      startX: number;
      startY: number;
      progress: number;
      speed: number;
    }[] = [];
    
    if (sendNodesToOrbit && orbitPosition) {
      // Setup nodes that will travel to the orbit
      const orbitBoundNodes = Array.from(nodesRef.current.querySelectorAll('.orbit-bound-node')) as HTMLElement[];
      
      // Stagger the start times
      orbitBoundNodes.forEach((node, index) => {
        const nodeRect = node.getBoundingClientRect();
        const startX = nodeRect.left + nodeRect.width / 2;
        const startY = nodeRect.top + nodeRect.height / 2;
        
        // Add to traveling nodes with slight delay based on index
        setTimeout(() => {
          travelingNodes.push({
            node,
            startX,
            startY,
            progress: 0,
            speed: 0.005 + Math.random() * 0.015 // Randomize speed a bit
          });
          
          // Create special animation effect for this node using the custom colors
          node.style.transition = 'none';
          node.style.animationName = 'pulse';
          node.style.animationDuration = '0.8s';
          node.style.animationIterationCount = 'infinite';
          node.style.boxShadow = `0 0 15px ${nodeColor}`;
          node.style.backgroundColor = nodeColor;
          node.style.zIndex = '20';
          // Make traveling nodes larger and more visible
          node.style.width = '12px';
          node.style.height = '12px';
        }, index * 1000 + Math.random() * 500); // Stagger start times
      });
    }
    
    // Update connections and traveling nodes on animation frames
    const updateElements = () => {
      // Update connections
      const connections = nodesRef.current?.querySelectorAll('.network-connection') || [];
      connections.forEach((connection: Element) => {
        const conn = connection as HTMLElement;
        const [sourceId, targetId] = conn.dataset.nodes?.split('-') || [];
        
        if (sourceId && targetId) {
          const sourceNode = nodes[parseInt(sourceId, 10)];
          const targetNode = nodes[parseInt(targetId, 10)];
          
          if (sourceNode && targetNode) {
            const sourceRect = sourceNode.getBoundingClientRect();
            const targetRect = targetNode.getBoundingClientRect();
            
            // Get positions relative to the container
            const sourceX = sourceRect.left + sourceRect.width / 2 - containerRect.left;
            const sourceY = sourceRect.top + sourceRect.height / 2 - containerRect.top;
            const targetX = targetRect.left + targetRect.width / 2 - containerRect.left;
            const targetY = targetRect.top + targetRect.height / 2 - containerRect.top;
            
            // Calculate distance and angle
            const dx = targetX - sourceX;
            const dy = targetY - sourceY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            // Update connection style
            conn.style.width = `${distance}px`;
            conn.style.left = `${sourceX}px`;
            conn.style.top = `${sourceY}px`;
            conn.style.transform = `rotate(${angle}deg)`;
          }
        }
      });
      
      // Update traveling nodes
      if (sendNodesToOrbit && orbitPosition && travelingNodes.length > 0) {
        travelingNodes.forEach((item, index) => {
          // Update progress
          item.progress += item.speed;
          
          if (item.progress >= 1) {
            // Node reached orbit - remove from tracking
            travelingNodes.splice(index, 1);
            
            // Make the node disappear with a flash effect
            item.node.style.transition = 'all 0.5s ease-out';
            item.node.style.transform = 'scale(1.5)';
            item.node.style.opacity = '0';
            
            // Then remove it
            setTimeout(() => {
              if (item.node.parentNode) {
                item.node.parentNode.removeChild(item.node);
              }
              
              // Create a "new arrival" effect at the orbit target
              if (orbitPosition && nodesRef.current) {
                const flash = document.createElement('div');
                flash.className = 'orbit-arrival-flash';
                flash.style.position = 'absolute';
                flash.style.left = `${orbitPosition.x - containerRect.left}px`;
                flash.style.top = `${orbitPosition.y - containerRect.top}px`;
                flash.style.width = '20px';
                flash.style.height = '20px';
                flash.style.borderRadius = '50%';
                // Create a more star-like shape for the flash
                const starShape = document.createElement('div');
                starShape.style.position = 'absolute';
                starShape.style.inset = '-5px';
                starShape.style.background = `radial-gradient(circle, ${nodeColor} 10%, rgba(255,255,255,0.8) 50%, transparent 70%)`;
                starShape.style.borderRadius = '50%';
                starShape.style.opacity = '0.7';
                
                flash.appendChild(starShape);
                
                flash.style.backgroundColor = nodeColor;
                flash.style.boxShadow = `0 0 25px ${nodeColor}`;
                flash.style.animation = 'pulse 1s ease-out, spin 4s linear infinite';
                flash.style.zIndex = '30';
                flash.style.transform = 'translate(-50%, -50%)';
                
                nodesRef.current.appendChild(flash);
                
                // Keep the flash effect spinning permanently
                // We'll create a persistent spinning effect at the target
                flash.style.animation = 'pulse 1s ease-out, spin 4s linear infinite';
                flash.style.opacity = '0.9';
                
                // Make it stick around
                setTimeout(() => {
                  flash.style.animation = 'spin 4s linear infinite';
                  flash.style.transition = 'all 0.5s ease';
                  flash.style.width = '16px';
                  flash.style.height = '16px';
                  flash.style.opacity = '0.7';
                }, 1000);
              }
            }, 500);
            
            return;
          }
          
          // Calculate current position with easing
          const easeProgress = easeInOutCubic(item.progress);
          const currentX = item.startX * (1 - easeProgress) + orbitPosition.x * easeProgress;
          const currentY = item.startY * (1 - easeProgress) + orbitPosition.y * easeProgress;
          
          // Add some slight curve to the path
          const curveX = Math.sin(item.progress * Math.PI) * 50;
          const curveY = Math.sin(item.progress * Math.PI) * 30;
          
          // Position the node
          item.node.style.position = 'fixed';
          item.node.style.left = `${currentX + curveX}px`;
          item.node.style.top = `${currentY + curveY}px`;
          item.node.style.transform = `scale(${1 + easeProgress * 0.5})`;
        });
      }
      
      requestAnimationFrame(updateElements);
    };
    
    // Start animation loop
    const animationId = requestAnimationFrame(updateElements);
    
    // Setup periodic dispatching of new nodes to orbit
    let dispatchInterval: number | null = null;
    
    if (sendNodesToOrbit) {
      dispatchInterval = window.setInterval(() => {
        // Find a node that's not already traveling
        const availableNodes = nodes.filter(node => 
          !node.classList.contains('orbit-bound-node') && 
          !travelingNodes.some(item => item.node === node)
        );
        
        if (availableNodes.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableNodes.length);
          const nodeToTravel = availableNodes[randomIndex];
          
          // Mark this node for travel
          nodeToTravel.classList.add('orbit-bound-node');
          
          // Get current position
          const nodeRect = nodeToTravel.getBoundingClientRect();
          const startX = nodeRect.left + nodeRect.width / 2;
          const startY = nodeRect.top + nodeRect.height / 2;
          
          // Stop its normal animation
          nodeToTravel.style.animationPlayState = 'paused';
          
          // Add special effects - use the provided nodeColor
          nodeToTravel.style.transition = 'none';
          nodeToTravel.style.animationName = 'pulse';
          nodeToTravel.style.animationDuration = '0.8s';
          nodeToTravel.style.animationIterationCount = 'infinite';
          nodeToTravel.style.boxShadow = `0 0 15px ${nodeColor}`;
          nodeToTravel.style.backgroundColor = nodeColor;
          nodeToTravel.style.zIndex = '20';
          // Make traveling nodes larger and more visible
          nodeToTravel.style.width = '12px';
          nodeToTravel.style.height = '12px';
          
          // Add to traveling nodes
          travelingNodes.push({
            node: nodeToTravel,
            startX,
            startY,
            progress: 0,
            speed: 0.005 + Math.random() * 0.015 // Randomize speed
          });
        }
      }, 8000); // Send a new node every 8 seconds
    }
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      if (dispatchInterval) clearInterval(dispatchInterval);
    };
  }, [nodeCount, parentSelector, sendNodesToOrbit, orbitPosition]);
  
  // Helper function to create a connection between two nodes
  function createConnection(node1: HTMLElement, node2: HTMLElement, container: HTMLElement) {
    const connection = document.createElement('div');
    connection.className = 'network-connection';
    
    // Store the indices of the connected nodes
    const node1Index = Array.from(container.querySelectorAll('.network-node')).indexOf(node1);
    const node2Index = Array.from(container.querySelectorAll('.network-node')).indexOf(node2);
    
    connection.dataset.nodes = `${node1Index}-${node2Index}`;
    container.appendChild(connection);
  }
  
  // Easing function for smoother animation
  function easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
  
  return (
    <div ref={nodesRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(1); opacity: 0.7; }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}