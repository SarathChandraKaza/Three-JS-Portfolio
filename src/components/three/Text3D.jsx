import React, { useRef, useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Text3DComponent = () => {
  const textRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const baseColor = new THREE.Color(0x00ffcc);
  const glowColor = new THREE.Color(0xff3366);
  
  const gradientColors = [
    new THREE.Color(0x00ffcc),  // Light Cyan
    new THREE.Color(0xff0000),  // Red
    new THREE.Color(0x0000ff),  // Blue
    new THREE.Color(0xffff00),  // Yellow
    new THREE.Color(0x800080),  // Purple
    new THREE.Color(0x00ff00),  // Green
    new THREE.Color(0xffa500),  // Orange
    new THREE.Color(0x800000),  // Maroon
    new THREE.Color(0x000000),  // Black
    new THREE.Color(0xffffff),  // White
    new THREE.Color(0x8a2be2),  // Blue Violet
    new THREE.Color(0x5f9ea0),  // Cadet Blue
    new THREE.Color(0x808000),  // Olive
    new THREE.Color(0xa52a2a),  // Brown
    new THREE.Color(0x7fff00),  // Chartreuse
    new THREE.Color(0x6495ed),  // Cornflower Blue
    new THREE.Color(0xdc143c),  // Crimson
    new THREE.Color(0x00bfff),  // Deep Sky Blue
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 980);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to interpolate between colors with safety checks
  const lerpColor = (color1, color2, t) => {
    // If either color is undefined, return the default color
    if (!color1 || !color2) {
      console.warn('Invalid colors in lerpColor:', color1, color2);
      return baseColor;
    }

    // Ensure t is between 0 and 1
    const clampedT = Math.max(0, Math.min(1, t));

    return new THREE.Color(
      color1.r * (1 - clampedT) + color2.r * clampedT,
      color1.g * (1 - clampedT) + color2.g * clampedT,
      color1.b * (1 - clampedT) + color2.b * clampedT
    );
  };

  useFrame(({ clock }) => {
    if (!textRef.current?.material) return;

    // Find the Ranger in the scene
    const ranger = textRef.current.parent.parent.getObjectByName('ranger');
    const rangerX = ranger?.position.x || 0;

    // Check if Ranger is in front of text
    if (rangerX >= -30 && rangerX <= 30) {
      // Calculate pulse based on time
      const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.5 + 0.5;
      
      // Interpolate between base color and glow color
      const color = baseColor.clone().lerp(glowColor, pulse);
      
      // Update material properties
      textRef.current.material.color = color;
      textRef.current.material.emissiveIntensity = pulse * 2;
      textRef.current.material.emissive = color;
    } else {
      // Reset to default state
      textRef.current.material.color = baseColor;
      textRef.current.material.emissiveIntensity = 0.5;
      textRef.current.material.emissive = new THREE.Color(0x005f5f);
    }
  });

  return (
    <group position={[0, 75, -10]} rotation={[-Math.PI / 4, 0, 0]}>
      <Text
        ref={textRef}
        fontSize={isMobile ? Math.min(window.innerWidth * 0.08, 5) : Math.min(window.innerWidth * 0.08, 7)}
        maxWidth={isMobile ? window.innerWidth * 0.2 : window.innerWidth * 0.9}
        lineHeight={1.5}
        letterSpacing={0.02}
        textAlign="center"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZFhjQ.ttf"
        color={baseColor}
        anchorX="center"
        anchorY="middle"
      >
        {isMobile ? "An Interstellar Travel\nThrough My Works" : "An Interstellar Travel Through My Works"}
        <meshStandardMaterial
          metalness={0.8}
          roughness={0.2}
          emissive={new THREE.Color(0x005f5f)}
          emissiveIntensity={0.5}
        />
      </Text>
    </group>
  );
};

export default Text3DComponent; 