import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Planet from './Planet';
import Skybox from './Skybox';
import Text3DComponent from './Text3D';
import Ranger from './Ranger';
import { planets } from '../../data/planetData';

const Scene = () => {
  const [showInfoIcon, setShowInfoIcon] = useState(false);
  const [showInfoScreen, setShowInfoScreen] = useState(true);
  const [isInitialScreen, setIsInitialScreen] = useState(true);

  const handlePlanetClick = (planet) => {
    console.log(`Clicked on ${planet.name}`);
  };

  // Function to handle info icon click
  const handleInfoClick = () => {
    setShowInfoScreen(true);
    setShowInfoIcon(false);
    setIsInitialScreen(false);
  };

  // Function to handle Start/Close button click in info screen
  const handleInfoScreenButton = () => {
    setShowInfoScreen(false);
    setShowInfoIcon(true);
    setIsInitialScreen(false);
  };

  // Function to determine button text
  const getButtonText = () => {
    if (isInitialScreen) return "Start!";
    return "Close";
  };

  return (
    <>
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

      {/* Info Icon Overlay */}
      {showInfoIcon && (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: 1000,
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            padding: '3px',
            background: 'rgba(255, 255, 255, 0.88)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
          }}
          onClick={handleInfoClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            document.body.style.cursor = 'pointer';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            document.body.style.cursor = 'default';
          }}
        >
          <img 
            src="/Icons/information-button.png" 
            alt="Information"
            style={{
              width: window.innerWidth <= 360 ? '18px' : window.innerWidth <= 980 ? '20px' : '24px',
              height: 'auto',
              opacity: 0.8
            }}
          />
        </div>
      )}

      {/* Info Screen UI */}
      <div id="ui-screen" style={{ display: showInfoScreen ? 'block' : 'none' }}>
        <h2>Instructions</h2>
        <p>
          Scroll through the planets to explore different projects. <br />
          Click on a planet to learn more about a specific project and its details.
        </p>

        <h2>Introduction</h2>
        <p>
          Hi, I'm <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>Sarath Chandra</span>,
          a passionate XR developer with three years of experience creating immersive experiences
          using Unity and C#. I invite you to explore my works, and feel free to reach out for
          any further discussions.
        </p>

        <div id="social-icons">
          <a href="mailto:workmail.sarath@gmail.com" id="email-icon" aria-label="Email"></a>
          <a href="https://www.linkedin.com/in/sarath-chandra-b9487b220/" target="_blank" id="linkedin-icon" aria-label="LinkedIn"></a>
          <a href="https://github.com/SarathChandraKaza" target="_blank" id="github-icon" aria-label="GitHub"></a>
        </div>

        <button 
          id="close-icon-ui" 
          title="Close the UI"
          onClick={handleInfoScreenButton}
        >
          {getButtonText()}
        </button>
      </div>

      {/* Tooltip */}
      <div id="hoverTooltip" className="tooltip"></div>
    </>
  );
};

export default Scene; 