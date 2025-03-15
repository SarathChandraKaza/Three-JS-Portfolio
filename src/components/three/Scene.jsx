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
const CameraController = ({ hasScrolled, showInfoScreen, setHasScrolled, setFocusedPlanetIndex, isInfoScreenVisible }) => {
  const { camera } = useThree();
  const isAnimating = useRef(false);
  const currentPlanetIndex = useRef(0); // Start at first planet (index 0)
  const isBirdsEyeView = useRef(true); // Start in birds-eye view

  useEffect(() => {
    if (isInfoScreenVisible) {
      return; // Don't add wheel listener if info screen is visible
    }

    const handleWheel = (event) => {
      if (showInfoScreen || isAnimating.current) return;

      const scrollAmount = event.deltaY;
      if ((scrollAmount > 0 && scrollAmount < 5) || (scrollAmount < 0 && scrollAmount > -5)) return;

      isAnimating.current = true;

      if (scrollAmount < 0) { // Scrolling backward
        if (isBirdsEyeView.current) {
          // From birds-eye view, go to Mars
          isBirdsEyeView.current = false;
          currentPlanetIndex.current = 4; // Mars
          setFocusedPlanetIndex(0); // Mars is index 0 in the planets array
        } else if (currentPlanetIndex.current > 1) { // If not at Mercury
          currentPlanetIndex.current--;
          setFocusedPlanetIndex(4 - currentPlanetIndex.current); // Convert to array index
        } else if (currentPlanetIndex.current === 1) { // At Mercury, go to birds-eye view
          isBirdsEyeView.current = true;
          setFocusedPlanetIndex(null);
        }
      } else { // Scrolling forward
        if (isBirdsEyeView.current) {
          // Do nothing when scrolling forward in birds-eye view
          isAnimating.current = false;
          return;
        } else if (currentPlanetIndex.current === 4) { // At Mars, go to birds-eye view
          isBirdsEyeView.current = true;
          setFocusedPlanetIndex(null);
        } else if (currentPlanetIndex.current < 4) { // If not at Mars
          currentPlanetIndex.current++;
          setFocusedPlanetIndex(4 - currentPlanetIndex.current); // Convert to array index
        }
      }

      // Calculate planet position based on index
      const planetDistance = (currentPlanetIndex.current) * 25; // 25 units between each planet

      // Set new camera position
      const newPosition = isBirdsEyeView.current
        ? { x: 0, y: 200, z: 200 } // Bird's-eye view position
        : {
            x: planetDistance + 25, // Planet position + offset
            y: 0,
            z: 0
          };

      // GSAP-style animation
      const startPos = camera.position.clone();
      const startTime = Date.now();
      const duration = 1500;

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
          : new THREE.Vector3(planetDistance, 0, 0);
        
        camera.lookAt(target);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isAnimating.current = false;
        }
      };

      animate();

      setTimeout(() => {
        isAnimating.current = false;
      }, 3000);
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [showInfoScreen, camera, setHasScrolled, setFocusedPlanetIndex, isInfoScreenVisible]);

  return null;
};

const Scene = () => {
  const [showInfoIcon, setShowInfoIcon] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [focusedPlanetIndex, setFocusedPlanetIndex] = useState(null);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [introScreenClosed, setIntroScreenClosed] = useState(false);
  const [isInfoScreenVisible, setIsInfoScreenVisible] = useState(true);

  useEffect(() => {
    // Check if it's a mobile device
    const checkMobile = () => {
      const isMobile = window.innerWidth <= 980 || 
                      navigator.maxTouchPoints > 0 || 
                      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      setShowMobileNav(isMobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to handle info icon click
  const handleInfoClick = () => {
    const event = new CustomEvent('toggleIntroduction', { detail: { show: true } });
    window.dispatchEvent(event);
    setShowInfoIcon(false);
    setIsInfoScreenVisible(true);
  };

  // Function to simulate scroll events for mobile navigation
  const simulateScroll = (direction) => {
    // Create a synthetic wheel event
    const event = new WheelEvent('wheel', {
      deltaY: direction === 'next' ? -100 : 100, // next = backward scroll, prev = forward scroll
      bubbles: true
    });
    window.dispatchEvent(event);
  };

  const handlePlanetClick = (planet, index) => {
    if (index === focusedPlanetIndex && index !== 4) {
      console.log(`Selected planet: ${planet.name}`);
    }
  };

  // Listen for the introduction close event
  useEffect(() => {
    const handleIntroClose = () => {
      setShowInfoIcon(true);
      setIntroScreenClosed(true);
      setIsInfoScreenVisible(false);
    };
    window.addEventListener('introductionClosed', handleIntroClose);
    return () => window.removeEventListener('introductionClosed', handleIntroClose);
  }, []);

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
          <CameraController 
            hasScrolled={hasScrolled}
            showInfoScreen={false}
            setHasScrolled={setHasScrolled}
            setFocusedPlanetIndex={setFocusedPlanetIndex}
            isInfoScreenVisible={isInfoScreenVisible}
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
              onClick={() => handlePlanetClick(planet, index)}
              isClickable={index === focusedPlanetIndex && index !== 4}
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
            top: '20px',
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

      {/* Mobile Navigation Buttons */}
      {showMobileNav && introScreenClosed && !isInfoScreenVisible && (
        <div className="navigation-buttons">
          <button 
            className="nav-button"
            onClick={() => simulateScroll('prev')}
          >
            Previous Project
          </button>
          <button 
            className="nav-button"
            onClick={() => simulateScroll('next')}
          >
            Next Project
          </button>
        </div>
      )}

      <div id="hoverTooltip" className="tooltip"></div>
    </>
  );
};

export default Scene;