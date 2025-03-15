import React, { useRef, useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Text3DComponent = () => {
  const textRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const gradientColors = [
    new THREE.Color(0x00ffcc),  // Light Cyan
    new THREE.Color(0xff0000),  // Red
    new THREE.Color(0x0000ff),  // Blue
    new THREE.Color(0xffff00),  // Yellow
    new THREE.Color(0x800080),  // Purple
    new THREE.Color(0x00ff00),  // Green
    new THREE.Color(0xffa500),  // Orange
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 980);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useFrame(({ clock }) => {
    if (textRef.current) {
      const time = clock.getElapsedTime();
      const colorIndex = Math.floor(time * 0.5) % gradientColors.length;
      const nextColorIndex = (colorIndex + 1) % gradientColors.length;
      const mixRatio = (time * 0.5) % 1;
      
      const currentColor = gradientColors[colorIndex];
      const nextColor = gradientColors[nextColorIndex];
      
      const interpolatedColor = new THREE.Color(
        currentColor.r * (1 - mixRatio) + nextColor.r * mixRatio,
        currentColor.g * (1 - mixRatio) + nextColor.g * mixRatio,
        currentColor.b * (1 - mixRatio) + nextColor.b * mixRatio
      );
      
      textRef.current.material.color = interpolatedColor;
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
        color={0x00ffcc}
        anchorX="center"
        anchorY="middle"
      >
        {isMobile ? "An Interstellar Travel\nThrough My Works" : "An Interstellar Travel Through My Works"}
        <meshStandardMaterial
          metalness={0.8}
          roughness={0.2}
          emissive={0x005f5f}
          emissiveIntensity={0.5}
        />
      </Text>
    </group>
  );
};

export default Text3DComponent; 