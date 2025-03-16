import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Planet from './Planet';
import Skybox from './Skybox';
import Text3DComponent from './Text3D';
import Ranger from './Ranger';
import LoadingScreen from '../LoadingScreen';
import { planets } from '../../data/planetData';
import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Sound Effects
const buttonClickSound = new Audio('/docs/Sounds/SFX/button-click.mp3');
const iconClickSound = new Audio('/docs/Sounds/SFX/icon-click.mp3');
const hoverSound = new Audio('/docs/Sounds/SFX/hover-sound.mp3');
const planetClickSound = new Audio('/docs/Sounds/SFX/planet-click.mp3');

// Function to play sound with logging
const playSound = (audio) => {
  const audioName = {
    [buttonClickSound]: 'Button Click Sound',
    [iconClickSound]: 'Icon Click Sound',
    [hoverSound]: 'Hover Sound',
    [planetClickSound]: 'Planet Click Sound'
  }[audio] || 'Unknown Sound';
};

// Create a separate component for camera animation
const CameraController = ({ hasScrolled, showInfoScreen, setHasScrolled, setFocusedPlanetIndex, isInfoScreenVisible, showProjectUI }) => {
  const { camera } = useThree();
  const isAnimating = useRef(false);
  const currentPlanetIndex = useRef(0); // Start at first planet (index 0)
  const isBirdsEyeView = useRef(true); // Start in birds-eye view

  useEffect(() => {
    if (isInfoScreenVisible || showProjectUI) {
      return; // Don't add wheel listener if info screen or project UI is visible
    }

    const handleWheel = (event) => {
      if (showInfoScreen || isAnimating.current || showProjectUI) return;

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
  }, [showInfoScreen, camera, setHasScrolled, setFocusedPlanetIndex, isInfoScreenVisible, showProjectUI]);

  return null;
};

const PlanetInteraction = ({ planet, index, focusedPlanetIndex, setCurrentProject, setCurrentImageIndex, setShowProjectUI }) => {
  const { camera } = useThree();

  const closeProjectUI = () => {
    playSound(buttonClickSound);
    setShowProjectUI(false);
    setCurrentProject(null);
    
    // Reset camera to original viewing position
    const planetDistance = index * 25;
    gsap.to(camera.position, {
      x: camera.position.x+10,
      y: 0,
      z: 0,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(new THREE.Vector3(camera.position.x, 0, 0));
      }
    });
  };

  useEffect(() => {
    window.closeProjectUI = closeProjectUI;
    return () => {
      delete window.closeProjectUI;
    };
  }, []);

  const handleClick = () => {
    if (index === focusedPlanetIndex && index !== 4) {
      playSound(planetClickSound);
      
      // Only move camera slightly up
      const planetDistance = index * 25;
      gsap.to(camera.position, {
        x: camera.position.x-10,
        y: 7.5,
        z: 0,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.lookAt(new THREE.Vector3(camera.position.x, 0, 0));
        },
        onComplete: () => {
          setCurrentProject(planet.projectData);
          setCurrentImageIndex(0);
          setShowProjectUI(true);
        }
      });
    }
  };

  return (
    <Planet 
      {...planet}
      onClick={handleClick}
      isClickable={index === focusedPlanetIndex && index !== 4}
      index={index}
    />
  );
};

const Scene = () => {
  // 1. All useState hooks
  const [showInfoIcon, setShowInfoIcon] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [focusedPlanetIndex, setFocusedPlanetIndex] = useState(null);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [introScreenClosed, setIntroScreenClosed] = useState(false);
  const [isInfoScreenVisible, setIsInfoScreenVisible] = useState(true);
  const [showProjectUI, setShowProjectUI] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showHelpText, setShowHelpText] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 2. All useRef hooks
  const loadingState = useRef({
    totalAssets: 0,
    loadedAssets: 0,
    startTime: Date.now(),
    errors: [],
    loadedFiles: new Set()
  });
  const inactivityTimer = useRef(null);
  const lastInteractionTime = useRef(Date.now());

  // 3. All useEffect hooks
  // Mobile check effect
  useEffect(() => {
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

  // Asset preloading effect
  useEffect(() => {
    console.log('🔄 Initial loading state:', isLoading);
    const manager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(manager);
    const audioLoader = new THREE.AudioLoader(manager);
    const gltfLoader = new GLTFLoader(manager);
    
    loadingState.current.totalAssets = 
      assetUrls.images.length + 
      assetUrls.audio.length + 
      assetUrls.textures.length + 
      assetUrls.models.length;

    console.log('📦 Total assets to load:', loadingState.current.totalAssets);

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      setLoadingProgress(progress);
      console.log(`📊 Loading progress: ${progress.toFixed(1)}% (${itemsLoaded}/${itemsTotal})`);
    };

    manager.onLoad = () => {
      const loadTime = (Date.now() - loadingState.current.startTime) / 1000;
      console.log(`✨ All assets loaded in ${loadTime.toFixed(2)} seconds!`);
      console.log('🔄 Setting loading state to false');
      setIsLoading(false);
    };

    manager.onError = (url) => {
      console.error(`❌ Error loading asset: ${url}`);
      loadingState.current.errors.push(url);
    };

    const preloadAssets = async () => {
      console.log('🚀 Starting asset preload...');
      
      try {
        await Promise.all([
          ...assetUrls.images.map(url => 
            new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => {
                loadingState.current.loadedFiles.add(url);
                resolve(url);
              };
              img.onerror = reject;
              img.src = url;
            })
          ),
          ...assetUrls.audio.map(url =>
            new Promise((resolve, reject) => {
              audioLoader.load(url, 
                (buffer) => {
                  loadingState.current.loadedFiles.add(url);
                  resolve(url);
                },
                null,
                reject
              );
            })
          ),
          ...assetUrls.textures.map(url =>
            new Promise((resolve, reject) => {
              textureLoader.load(url,
                (texture) => {
                  texture.colorSpace = THREE.SRGBColorSpace;
                  loadingState.current.loadedFiles.add(url);
                  resolve(url);
                },
                null,
                reject
              );
            })
          ),
          ...assetUrls.models.map(url =>
            new Promise((resolve, reject) => {
              gltfLoader.load(url,
                (gltf) => {
                  loadingState.current.loadedFiles.add(url);
                  resolve(url);
                },
                null,
                reject
              );
            })
          )
        ]);
        console.log('✅ All assets preloaded successfully');
      } catch (error) {
        console.error('❌ Error during asset preloading:', error);
      }
    };

    preloadAssets();
  }, []);

  // Introduction close effect
  useEffect(() => {
    const handleIntroClose = () => {
      setShowInfoIcon(true);
      setIntroScreenClosed(true);
      setIsInfoScreenVisible(false);
    };

    const exploreButton = document.getElementById('close-icon-ui');
    const socialIcons = document.querySelectorAll('#social-icons a');

    if (exploreButton) {
      exploreButton.addEventListener('click', () => playSound(buttonClickSound));
      exploreButton.addEventListener('mouseover', () => playSound(hoverSound));
    }

    socialIcons.forEach(icon => {
      icon.addEventListener('click', () => playSound(buttonClickSound));
      icon.addEventListener('mouseover', () => playSound(hoverSound));
    });

    window.addEventListener('introductionClosed', handleIntroClose);
    return () => {
      window.removeEventListener('introductionClosed', handleIntroClose);
      if (exploreButton) {
        exploreButton.removeEventListener('click', () => playSound(buttonClickSound));
        exploreButton.removeEventListener('mouseover', () => playSound(hoverSound));
      }
      socialIcons.forEach(icon => {
        icon.removeEventListener('click', () => playSound(buttonClickSound));
        icon.removeEventListener('mouseover', () => playSound(hoverSound));
      });
    };
  }, []);

  // User interaction effect
  useEffect(() => {
    const handleInteraction = () => {
      setShowHelpText(false);
      resetInactivityTimer();
    };

    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('wheel', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('wheel', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [introScreenClosed, showProjectUI]);

  // Inactivity timer effect
  useEffect(() => {
    if (introScreenClosed && !showProjectUI) {
      resetInactivityTimer();
    }
  }, [introScreenClosed, showProjectUI]);

  // Asset URLs
  const assetUrls = {
    images: [
      '/docs/Icons/gmail.png',
      '/docs/Icons/linkedin.png',
      '/docs/Icons/github.png',
      '/docs/Icons/left.png',
      '/docs/Icons/right.png',
      '/docs/Icons/information-button.png',
      '/docs/Project-Images/Sunday/Sunday1.png',
      '/docs/Project-Images/VR-School/VRSchool1.png',
      '/docs/Project-Images/VR-School/VRSchool2.png',
      '/docs/Project-Images/VR-School/VRSchool3.png',
      '/docs/Project-Images/VR-School/VRSchool4.png',
      '/docs/Project-Images/VR-School/VRSchool5.png',
      '/docs/Project-Images/VR-School/VRSchool6.png',
      '/docs/Project-Images/VR-School/VRSchool7.png',
      '/docs/Project-Images/Dodge-Ball/DodgeBall1.png',
      '/docs/Project-Images/Dodge-Ball/DodgeBall2.png',
      '/docs/Project-Images/Dodge-Ball/DodgeBall3.png',
      '/docs/Project-Images/Eating-Tom/EatingTom1.png',
      '/docs/Project-Images/Eating-Tom/EatingTom2.png',
      '/docs/Project-Images/Eating-Tom/EatingTom3.png',
      '/docs/textures/Purple Nebula/PurpleNebulaSkybox_right1.png',
      '/docs/textures/Purple Nebula/PurpleNebulaSkybox_left2.png',
      '/docs/textures/Purple Nebula/PurpleNebulaSkybox_top3.png',
      '/docs/textures/Purple Nebula/PurpleNebulaSkybox_bottom4.png',
      '/docs/textures/Purple Nebula/PurpleNebulaSkybox_front5.png',
      '/docs/textures/Purple Nebula/PurpleNebulaSkybox_back6.png'
    ],
    audio: [
      '/docs/Sounds/SFX/button-click.mp3',
      '/docs/Sounds/SFX/icon-click.mp3',
      '/docs/Sounds/SFX/hover-sound.mp3',
      '/docs/Sounds/SFX/ui-popup.mp3',
      '/docs/Sounds/SFX/scroll-animation.mp3',
      '/docs/Sounds/SFX/planet-click.mp3',
      '/docs/Sounds/SFX/ambient-music.mp3',
      '/docs/Sounds/SFX/rocket-moving.mp3'
    ],
    textures: [
      '/docs/textures/2k_sun.jpg',
      '/docs/textures/2k_mercury.jpg',
      '/docs/textures/2k_venus_surface.jpg',
      '/docs/textures/2k_earth_daymap.jpg',
      '/docs/textures/2k_mars.jpg'
    ],
    models: [
      '/docs/models/Interstellar-Ranger/scene.gltf'
    ]
  };

  // Function to simulate scroll events for mobile navigation
  const simulateScroll = (direction) => {
    // Play button click sound
    playSound(buttonClickSound);
    
    // Create a synthetic wheel event
    const event = new WheelEvent('wheel', {
      deltaY: direction === 'next' ? -100 : 100, // next = backward scroll, prev = forward scroll
      bubbles: true
    });
    window.dispatchEvent(event);
  };

  // Function to handle info icon click
  const handleInfoClick = () => {
    // Play button click sound
    playSound(buttonClickSound);
    
    const event = new CustomEvent('toggleIntroduction', { detail: { show: true } });
    window.dispatchEvent(event);
    setShowInfoIcon(false);
    setIsInfoScreenVisible(true);
  };

  const resetInactivityTimer = () => {
    lastInteractionTime.current = Date.now();
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    
    if (introScreenClosed && !showProjectUI) {
      inactivityTimer.current = setTimeout(() => {
        setShowHelpText(true);
      }, 30000); // Show after 30 seconds of inactivity
    }
  };

  // Update handleImageNavigation to include sound
  const handleImageNavigation = (direction) => {
    if (!currentProject || !currentProject.images) return;
    
    playSound(iconClickSound);
    
    const totalImages = currentProject.images.length;
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen progress={loadingProgress} />
      ) : (
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
                showProjectUI={showProjectUI}
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
                <PlanetInteraction
                  key={planet.name}
                  planet={planet}
                  index={index}
                  focusedPlanetIndex={focusedPlanetIndex}
                  setCurrentProject={setCurrentProject}
                  setCurrentImageIndex={setCurrentImageIndex}
                  setShowProjectUI={setShowProjectUI}
                />
              ))}
            </Suspense>
          </Canvas>

          {/* Project Details UI */}
          {showProjectUI && currentProject && (
            <div className="project-panel">
              <div className="project-content">
                <div className="project-header">
                  <h1>{currentProject.projectName}</h1>
                  <div className="header-actions">
                    <button 
                      className="action-button primary"
                      onClick={() => {
                        playSound(buttonClickSound);
                        window.open(currentProject.links, '_blank');
                      }}
                      onMouseEnter={() => playSound(hoverSound)}
                    >
                      View Project
                    </button>
                    <button 
                      className="action-button"
                      onClick={() => {
                        playSound(buttonClickSound);
                        window.closeProjectUI();
                      }}
                      onMouseEnter={() => playSound(hoverSound)}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="project-body">
                  <div className="project-showcase">
                    <div className="showcase-image">
                      <img 
                        src={currentProject.images[currentImageIndex]} 
                        alt={`${currentProject.projectName} showcase ${currentImageIndex + 1}`}
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                      {currentProject.images.length > 1 && (
                        <div className="showcase-controls">
                          <button 
                            className="showcase-nav prev"
                            onClick={() => handleImageNavigation('prev')}
                            onMouseEnter={() => playSound(hoverSound)}
                            aria-label="Previous image"
                          >
                            <img src="docs/Icons/left.png" alt="Previous" />
                          </button>
                          <div className="showcase-indicator">
                            {currentImageIndex + 1} / {currentProject.images.length}
                          </div>
                          <button 
                            className="showcase-nav next"
                            onClick={() => handleImageNavigation('next')}
                            onMouseEnter={() => playSound(hoverSound)}
                            aria-label="Next image"
                          >
                            <img src="docs/Icons/right.png" alt="Next" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="project-details">
                    <div className="detail-section">
                      <span className="detail-label">Timeline</span>
                      <span className="detail-value">{currentProject.time}</span>
                    </div>
                    
                    <div className="detail-section">
                      <span className="detail-label">Description</span>
                      <p className="detail-value">{currentProject.description}</p>
                    </div>

                    <div className="detail-section">
                      <span className="detail-label">Technologies</span>
                      <div className="tech-stack">
                        {currentProject.technologies.split(', ').map((tech, index) => (
                          <span key={index} className="tech-item">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Icon Overlay */}
          {showInfoIcon && !showProjectUI && (
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
                playSound(hoverSound);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                document.body.style.cursor = 'default';
              }}
            >
              <img 
                src="docs/Icons/information-button.png" 
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
          {showMobileNav && introScreenClosed && !isInfoScreenVisible && !showProjectUI && (
            <div className="navigation-buttons">
              <button 
                className="nav-button"
                onClick={() => simulateScroll('prev')}
                onMouseEnter={() => playSound(hoverSound)}
              >
                Previous Project
              </button>
              <button 
                className="nav-button"
                onClick={() => simulateScroll('next')}
                onMouseEnter={() => playSound(hoverSound)}
              >
                Next Project
              </button>
            </div>
          )}

          {/* Help Text Overlay */}
          {introScreenClosed && (
            <div className={`help-text-overlay ${showHelpText ? 'visible' : ''}`}>
              {showMobileNav ? (
                "Use the Previous/Next buttons to navigate between projects"
              ) : (
                "Scroll up/down to navigate between projects"
              )}
            </div>
          )}

          <div id="hoverTooltip" className="tooltip"></div>
        </>
      )}
    </>
  );
};

export default Scene;