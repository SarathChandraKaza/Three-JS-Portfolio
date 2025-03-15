import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Planet from './Planet';
import Skybox from './Skybox';
import Text3DComponent from './Text3D';
import Ranger from './Ranger';
import { planets } from '../../data/planetData';

const Scene = () => {
  const handlePlanetClick = (planet) => {
    console.log(`Clicked on ${planet.name}`);
  };

  return (
    <Canvas
      camera={{ 
        position: [0, 200, 200],
        fov: 40,
        near: 0.1,
        far: 1000
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <Suspense fallback={null}>
        <Skybox />
        <OrbitControls 
          enableZoom={false}
          enableRotate={false}
          enablePan={false}
        />
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 0]} intensity={2000} color="#ffffff" />
        <directionalLight 
          position={[100, 100, 100]} 
          intensity={0.5}
          castShadow
        />
        
        {/* 3D Text */}
        <Text3DComponent />

        {/* Ranger Spaceship */}
        <Ranger />
        
        {/* Render all planets */}
        {planets.map((planet) => (
          <Planet 
            key={planet.name}
            {...planet}
            onClick={() => handlePlanetClick(planet)}
          />
        ))}
      </Suspense>
    </Canvas>
  );
};

export default Scene; 