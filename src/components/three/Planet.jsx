import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Planet = ({ name, radius = 1, distance = 0, texturePath, onClick, material = "standard", isClickable, index }) => {
  const meshRef = useRef();
  const texture = useTexture(texturePath);

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (isClickable) {
      document.body.style.cursor = hovered ? 'pointer' : 'default';
    }
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [hovered, isClickable]);

  // Initial position - all planets in a straight line along X-axis
  const position = [distance, 0, 0];

  // Add rotation animation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.009; // Same rotation speed as in script.js
    }
  });

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
      onPointerOver={() => isClickable && setHovered(true)}
      onPointerOut={() => isClickable && setHovered(false)}
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