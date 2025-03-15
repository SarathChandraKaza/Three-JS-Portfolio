import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Planet from './Planet';
import Skybox from './Skybox';
import Text3DComponent from './Text3D';
import Ranger from './Ranger';
import { planets } from '../../data/planetData';
import * as THREE from 'three';

// Create a separate component for camera animation
const CameraController = ({ hasScrolled, showInfoScreen, setHasScrolled, setIsLastPlanetClickable }) => {
  const { camera } = useThree();
  const isAnimating = useRef(false);
  const currentPlanetIndex = useRef(0);
  const isBirdsEyeView = useRef(true);

  useEffect(() => {
    const handleWheel = (event) => {
      // Only process scroll if the UI is NOT visible or already scrolling
      if (showInfoScreen || isAnimating.current) return;

      const scrollAmount = event.deltaY;

      if((scrollAmount > 0 && scrollAmount < 5) || (scrollAmount < 0 && scrollAmount > -5)) {
        return;
      }

      isAnimating.current = true;

      if (scrollAmount < 0) {
        // Scroll backward - prev planet
        if (isBirdsEyeView.current) {
          currentPlanetIndex.current = 0;
          isBirdsEyeView.current = false;
          setHasScrolled(true);
        } else if (currentPlanetIndex.current < 3) {
          currentPlanetIndex.current = Math.min(currentPlanetIndex.current + 1, 3);
        } else {
          isBirdsEyeView.current = true;
          setIsLastPlanetClickable(false);
        }
      } else {
        // Scroll forward - next planet
        if (isBirdsEyeView.current) {
          isAnimating.current = false;
          return;
        } else if (currentPlanetIndex.current === 0) {
          isBirdsEyeView.current = true;
          setIsLastPlanetClickable(false);
        } else {
          currentPlanetIndex.current = Math.max(currentPlanetIndex.current - 1, 0);
        }
      }

      // Set new camera position
      const newPosition = isBirdsEyeView.current
        ? { x: 0, y: 200, z: 200 } // Bird's-eye view position
        : {
            x: 100 + 10, // Mars position + offset
            y: 0,
            z: 0
          };

      // GSAP-style animation
      const startPos = camera.position.clone();
      const startTime = Date.now();
      const duration = 1500; // 1.5 seconds

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Power2.inOut easing
        const t = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

        camera.position.x = startPos.x + (newPosition.x - startPos.x) * t;
        camera.position.y = startPos.y + (newPosition.y - startPos.y) * t;
        camera.position.z = startPos.z + (newPosition.z - startPos.z) * t;

        const target = isBirdsEyeView.current
          ? new THREE.Vector3(0, 0, 0)
          : new THREE.Vector3(100, 0, 0); // Look at Mars position
        
        camera.lookAt(target);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isAnimating.current = false;
          if (!isBirdsEyeView.current) {
            setIsLastPlanetClickable(true);
          }
        }
      };

      animate();

      // Allow scrolling again after animation duration
      setTimeout(() => {
        isAnimating.current = false;
      }, 3000);
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [showInfoScreen, camera, setHasScrolled, setIsLastPlanetClickable]);

  return null;
};

const Scene = () => {
  const [showInfoIcon, setShowInfoIcon] = useState(false);
  const [showInfoScreen, setShowInfoScreen] = useState(true);
  const [isInitialScreen, setIsInitialScreen] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isLastPlanetClickable, setIsLastPlanetClickable] = useState(false);

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

  // Add a camera logger component
  const CameraLogger = () => {
    const { camera } = useThree();
    
    useEffect(() => {
      if (!showInfoScreen) {
        console.log('Initial Camera Position:', {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z
        });
      }
    }, [showInfoScreen, camera]);

    return null;
  };

  // Function to determine button text
  const getButtonText = () => {
    if (isInitialScreen) return "Start!";
    return "Close";
  };

  const handlePlanetClick = (planet) => {
    if (!isLastPlanetClickable || planet !== planets[planets.length - 1]) return;
    console.log(`Clicked on ${planet.name}`);
    // Add your planet click handling logic here
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
          <CameraLogger />
          <CameraController 
            hasScrolled={hasScrolled}
            showInfoScreen={showInfoScreen}
            setHasScrolled={setHasScrolled}
            setIsLastPlanetClickable={setIsLastPlanetClickable}
          />
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
          
          <Text3DComponent />
          <Ranger />
          
          {planets.map((planet, index) => (
            <Planet 
              key={planet.name}
              {...planet}
              onClick={() => handlePlanetClick(planet)}
              isClickable={isLastPlanetClickable && index === planets.length - 1}
              index={index}
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
          Scroll forward once to focus on the last planet. <br />
          Click on the focused planet to learn more about the project.
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

      <div id="hoverTooltip" className="tooltip"></div>
    </>
  );
};

export default Scene;