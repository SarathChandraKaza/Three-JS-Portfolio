import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Planet = ({ name, radius = 1, distance = 0, texturePath, onClick, material = "standard" }) => {
  const meshRef = useRef();
  const orbitRef = useRef(0);
  const texture = useTexture(texturePath);
  
  // Calculate orbital speed based on Kepler's laws
  // Using a simplified version of Kepler's Third Law: period ∝ distance^(3/2)
  // Therefore, angular velocity ∝ 1/distance^(3/2)
  const getOrbitalSpeed = (dist) => {
    if (dist === 0) return 0; // Sun doesn't orbit
    const baseSpeed = 0.005; // Base speed constant
    // Closer planets move faster (inverse relationship with distance^(3/2))
    return baseSpeed / Math.pow(dist/25, 3/2); // Normalized to Mercury's distance
  };

  // Rotation and orbit animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Self rotation - adjusted for each planet
      const rotationSpeed = name === "Sun" ? 0.002 : 0.004;
      meshRef.current.rotation.y += rotationSpeed;
      
      // Orbital rotation (if not the Sun)
      if (distance > 0) {
        const orbitalSpeed = getOrbitalSpeed(distance);
        orbitRef.current += orbitalSpeed;
        const x = Math.cos(orbitRef.current) * distance;
        const z = Math.sin(orbitRef.current) * distance;
        meshRef.current.position.x = x;
        meshRef.current.position.z = z;
      }
    }
  });

  // Initial position (only used for Sun since other planets will be positioned by orbital motion)
  const position = distance === 0 ? [0, 0, 0] : [distance, 0, 0];

  // Choose material based on planet type
  const materialProps = material === "basic" 
    ? { map: texture }  // Basic material for the sun
    : {                 // Standard material for other planets
        map: texture,
        metalness: 0.4,
        roughness: 0.7
      };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      {material === "basic" ? (
        <meshBasicMaterial {...materialProps} />
      ) : (
        <meshStandardMaterial {...materialProps} />
      )}
    </mesh>
  );
};

export default Planet; 