import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Scene = () => {
  return (
    <Canvas
      camera={{ position: [0, 150, 150], fov: 35 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <OrbitControls 
        enableZoom={false}
        enableRotate={false}
        enablePan={false}
      />
      <ambientLight intensity={0.75} />
      <pointLight position={[0, 0, 0]} intensity={5000} />
    </Canvas>
  );
};

export default Scene; 