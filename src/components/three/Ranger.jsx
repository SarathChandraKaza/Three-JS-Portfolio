import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const Ranger = () => {
  const rangerRef = useRef();
  const { scene } = useGLTF('/models/Interstellar-Ranger/scene.gltf');

  useFrame(() => {
    if (rangerRef.current) {
      // Move Ranger to the right along the X axis
      rangerRef.current.position.x += 0.09;
      
      // Reset position when reaching the end
      if (rangerRef.current.position.x >= 150) {
        rangerRef.current.position.x = -150;
      }
    }
  });

  return (
    <primitive
      ref={rangerRef}
      object={scene}
      position={[-150, 80, 0]}
      rotation={[0, -Math.PI / 2, 0]} // 90 degrees rotation on Y axis
      scale={[1, 1, 1]}
      name="ranger"
    />
  );
};

export default Ranger;

// Preload the model
useGLTF.preload('/models/Interstellar-Ranger/scene.gltf');