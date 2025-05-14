import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PurpleNodeBackgroundProps {
  count?: number;
  radius?: number;
  size?: number;
}

const PurpleNodeBackground: React.FC<PurpleNodeBackgroundProps> = ({
  count = 80,
  radius = 15,
  size = 0.08
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const edgesRef = useRef<THREE.Line[]>([]);
  
  // Generate random positions for nodes
  const nodes = useMemo(() => {
    const nodes = [];
    for (let i = 0; i < count; i++) {
      // Generate random position in sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random()); // Cube root for more even distribution
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      nodes.push({
        position: new THREE.Vector3(x, y, z),
        scale: size * (0.5 + Math.random()),
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random()
      });
    }
    return nodes;
  }, [count, radius, size]);
  
  // Create connections between nearby nodes
  const edges = useMemo(() => {
    const maxDistance = radius * 0.5; // Only connect relatively nearby nodes
    const edges = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position);
        if (distance < maxDistance && Math.random() < 0.15) {
          edges.push({
            start: nodes[i].position,
            end: nodes[j].position,
            opacity: Math.max(0.1, 1 - distance / maxDistance),
            pulse: Math.random() * Math.PI * 2
          });
        }
      }
    }
    
    return edges;
  }, [nodes, radius]);
  
  // Create materials
  const nodeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#9900ff'),
    emissive: new THREE.Color('#9900ff'),
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.9,
    metalness: 0.7,
    roughness: 0.2
  }), []);
  
  const edgeMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color('#cc66ff'),
    transparent: true,
    opacity: 0.6
  }), []);
  
  // Animation frame
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    // Slowly rotate the entire node network
    groupRef.current.rotation.y += delta * 0.05;
    groupRef.current.rotation.x += delta * 0.02;
    
    // Pulse nodes
    nodesRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      if (i < nodes.length) {
        const node = nodes[i];
        node.phase += delta * node.speed;
        
        // Calculate pulse scale
        const scale = node.scale * (0.8 + 0.2 * Math.sin(node.phase));
        mesh.scale.set(scale, scale, scale);
      }
    });
    
    // Pulse edge opacity
    edgesRef.current.forEach((line, i) => {
      if (!line || i >= edges.length) return;
      
      const edge = edges[i];
      if (!edge.pulse) edge.pulse = 0; // Initialize if undefined
      
      edge.pulse += delta;
      
      const material = line.material as THREE.LineBasicMaterial;
      material.opacity = edge.opacity * (0.3 + 0.7 * Math.sin(edge.pulse) * Math.sin(edge.pulse));
    });
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <mesh
          key={`purple-node-${i}`}
          position={node.position}
          ref={(el: THREE.Mesh | null) => el && (nodesRef.current[i] = el)}
          material={nodeMaterial}
        >
          <sphereGeometry args={[1, 8, 8]} />
        </mesh>
      ))}
      
      {/* Edges */}
      {edges.map((edge, i) => {
        const points = [edge.start, edge.end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <primitive
            key={`purple-edge-${i}`}
            object={new THREE.Line(geometry, edgeMaterial)}
            ref={(el: THREE.Line | null) => el && (edgesRef.current[i] = el)}
          />
        );
      })}
    </group>
  );
};

export default PurpleNodeBackground;