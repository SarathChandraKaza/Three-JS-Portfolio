  //#region IMPORTS
  //=== IMPORTS ===
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'; // Import FontLoader
  import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
  import gsap from 'gsap';
  //#endregion

  //#region SOUNDS
  let buttonClickSound = new Audio('/Three-JS-Portfolio/Sounds/SFX/button-click.mp3');
  let iconClickSound = new Audio('/Three-JS-Portfolio/Sounds/SFX/icon-click.mp3');
  let hoverSound = new Audio('/Three-JS-Portfolio/Sounds/SFX/hover-sound.mp3');
  let helpPopupSound = new Audio('/Three-JS-Portfolio/Sounds/SFX/ui-popup.mp3');
  let animationSound = new Audio('/Three-JS-Portfolio/Sounds/SFX/scroll-animation.mp3');
  let planetClickSound = new Audio('/Three-JS-Portfolio/Sounds/SFX/planet-click.mp3');

  // Reset and play a sound
    function playSound(audio) {
      audio.currentTime = 0; // Reset playback for consecutive interactions
      audio.play().catch(err => console.warn('Audio play error:', err));
    }

  //#endregion
  
  //#region SCENE SETUP
  // === SCENE SETUP ===
  const scene = new THREE.Scene();
  //#endregion

  //#region PRE-LOAD IMAGES
  function preloadImages(imageUrls) {
    return Promise.all(
        imageUrls.map(
            (url) =>
                new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = resolve; // Resolve the promise when the image is loaded
                    img.onerror = reject; // Reject the promise on error
                })
        )
    );
}

  //#endregion

  //#region LOADING SCREEN

const manager = new THREE.LoadingManager();
manager.onLoad = () => {
    console.log('Three.js assets loaded!');

    // Wait for preloaded images too
    preloadImages([
        '/Three-JS-Portfolio/Icons/gmail.png',
        '/Three-JS-Portfolio/Icons/linkedin.png',
        '/Three-JS-Portfolio/Icons/github.png'
    ])
        .then(() => {
            console.log('All images preloaded!');
            hideLoadingScreen(); // Hide the loading screen when everything is done
        })
        .catch((error) => {
            console.error('Error preloading images:', error);
            hideLoadingScreen(); // Still hide the loading screen to avoid blocking UI
        });
};



  // Function to hide the loading screen
  function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none'; // Hide the loading screen
    }
  }

  // Function to show the loading screen (optional, in case of reset)
  function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex'; // Show the loading screen
    }
  } 

//#endregion

  //#region TEXTURE LOADER SETUP
  // === TEXTURE LOADER SETUP ===
  const textureLoader = new THREE.TextureLoader(manager);
  const cubeTextureLoader = new THREE.CubeTextureLoader(manager);
  cubeTextureLoader.setPath('/Three-JS-Portfolio/textures/Purple Nebula/');
  //#endregion

  //#region TEXTURE DEFINITIONS
  // === TEXTURE DEFINITIONS ===
  const sunTexture = textureLoader.load("/Three-JS-Portfolio/textures/2k_sun.jpg");
  sunTexture.colorSpace = THREE.SRGBColorSpace;


  const mercuryTexture = textureLoader.load("/Three-JS-Portfolio/textures/2k_mercury.jpg");
  mercuryTexture.colorSpace = THREE.SRGBColorSpace;

  const venusTexture = textureLoader.load("/Three-JS-Portfolio/textures/2k_venus_surface.jpg");
  venusTexture.colorSpace = THREE.SRGBColorSpace;

  const earthTexture = textureLoader.load("/Three-JS-Portfolio/textures/2k_earth_daymap.jpg");
  earthTexture.colorSpace = THREE.SRGBColorSpace;

  const marsTexture = textureLoader.load("/Three-JS-Portfolio/textures/2k_mars.jpg");
  marsTexture.colorSpace = THREE.SRGBColorSpace;

  // Background Skybox
// Background Skybox
const backgroundCubemap = cubeTextureLoader.load([
  'PurpleNebulaSkybox_right1.png',  // Positive X (right)
  'PurpleNebulaSkybox_left2.png',   // Negative X (left)
  'PurpleNebulaSkybox_top3.png',    // Positive Y (top)
  'PurpleNebulaSkybox_bottom4.png', // Negative Y (bottom)
  'PurpleNebulaSkybox_front5.png',  // Positive Z (front)
  'PurpleNebulaSkybox_back6.png'    // Negative Z (back)
]);

  scene.background = backgroundCubemap;
    //#endregion

  //#region MATERIALS
  // === MATERIALS ===
  const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
  const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
  const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
  const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
  //#endregion

  //#region SUN CREATION
  // === SUN CREATION ===
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
  const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
  sun.scale.setScalar(5); // Size of the Sun

  const sunWorldPosition = new THREE.Vector3();
  sun.getWorldPosition(sunWorldPosition);
  console.log('Sun Object world position:', sunWorldPosition);

  scene.add(sun);
  //#endregion

  // //#region SPACESHIP - ENDURANCE CREATION
  // // ===SPACESHIP - ENDURANCE CREATION
  //  const loader = new GLTFLoader(manager);
  //  let gltfObjectEndurance;

  //  loader.load(
  //    '3D Models/Spaceship/scene.gltf', // Replace with the path to your GLTF model
  //    (gltf) => {
  //      gltfObjectEndurance = gltf.scene;
       
  //      // Set scale
  //      gltfObjectEndurance.scale.set(0.125, 0.125, 0.125);
       
  //      // Set position
  //      gltfObjectEndurance.position.set(50, 60, 0);
   
  //      // Rotate the object by 90 degrees on the Y-axis (to the left)
  //      gltfObjectEndurance.rotation.z = -Math.PI / 16; // 90 degrees in radians
  //      gltfObjectEndurance.rotation.y = Math.PI / 16; 

  //         // Create an AxesHelper for the GLTFObject
  //     const axesHelper = new THREE.AxesHelper(10); // Size of axes helper, adjust as needed
      
  //     // Position the axes helper at the center of the GLTF object
  //     axesHelper.position.copy(gltfObjectEndurance.position);  // Copy position of GLTFObject
      
  //     // Optionally, adjust the helper's rotation to match the GLTFObject's rotation
  //     axesHelper.rotation.copy(gltfObjectEndurance.rotation);  // Copy rotation of GLTFObject
      
  //     // Add the axes helper to the scene
  //     // scene.add(axesHelper);

  //      const gltfWorldPosition = new THREE.Vector3();
  //      gltfObjectEndurance.getWorldPosition(gltfWorldPosition);
  //     console.log('GLTF Object world position:', gltfWorldPosition);

  //      // Add the model to the scene
  //      scene.add(gltfObjectEndurance);
  //    },
  //  );
  //  //#endregion

  //#region SPACESHIP - RANGER CREATION
   // === RANGER CREATION
const loader2 = new GLTFLoader(manager);
let gltfObjectRanger;

loader2.load(
  '/Three-JS-Portfolio/3D Models/Interstellar Ranger/scene.gltf', // Replace with the path to your GLTF model
  (gltf) => {
    gltfObjectRanger = gltf.scene;

    // Set scale
    gltfObjectRanger.scale.set(1, 1, 1);

    // Set position
    gltfObjectRanger.position.set(-150, 55, 0);

    // Rotate the object by 90 degrees on the Y-axis (to the left)
    gltfObjectRanger.rotation.y = -Math.PI / 2; // 90 degrees in radians

    // Optional: Add AxesHelper for debugging
    // const axesHelper = new THREE.AxesHelper(10);
    // scene.add(axesHelper);

    // Add spatial audio
    const listener = new THREE.AudioListener();
    camera.add(listener); // Attach listener to the camera

    const audioLoader = new THREE.AudioLoader();
    const positionalAudio = new THREE.PositionalAudio(listener);

    // Load the audio file
    audioLoader.load('/Three-JS-Portfolio/Sounds/SFX/rocket-moving.mp3', (buffer) => {
      positionalAudio.setBuffer(buffer);
      positionalAudio.setRefDistance(20); // Distance where audio volume is max
      positionalAudio.setMaxDistance(100); // Max range of the sound
      positionalAudio.setLoop(true); // Enable looping
      positionalAudio.setVolume(1); // Adjust the volume
      positionalAudio.play(); // Play the audio
    });

    // Attach the positional audio to the Ranger object
    gltfObjectRanger.add(positionalAudio);

    // Add the model to the scene
    scene.add(gltfObjectRanger);
  }
);

  //#endregion

  //#region TARS - CREATION
  // const loader3 = new GLTFLoader(manager);
  //  let gltfObjectTARS;
  //  let pointLightTARS;
  //  loader3.load(
  //    '3D Models/CASE Interstellar/scene.gltf', // Replace with the path to your GLTF model
  //    (gltf) => {
  //     gltfObjectTARS = gltf.scene;
       
  //      // Set scale
  //      gltfObjectTARS.scale.set(50, 50, 50);
       
  //      // Set position
  //      gltfObjectTARS.position.set(-50,-125, 75);
   
  //      // Rotate the object by 90 degrees on the Y-axis (to the left)
  //     // gltfObjectTARS.rotation.x = Math.PI; // 90 degrees in radians
  //     // gltfObjectTARS.rotation.y = -Math.PI;      
  //     // gltfObjectTARS.rotation.z = Math.PI;

  //         // Create an AxesHelper for the GLTFObject
  //     const axesHelper = new THREE.AxesHelper(10); // Size of axes helper, adjust as needed
      
  //     // Position the axes helper at the center of the GLTF object
  //     axesHelper.position.copy(gltfObjectTARS.position);  // Copy position of GLTFObject
      
  //     // Optionally, adjust the helper's rotation to match the GLTFObject's rotation
  //     axesHelper.rotation.copy(gltfObjectTARS.rotation);  // Copy rotation of GLTFObject
      
  //     // Add the axes helper to the scene
  //     // scene.add(axesHelper);

  //      const gltfWorldPosition = new THREE.Vector3();
  //      gltfObjectTARS.getWorldPosition(gltfWorldPosition);
  //     console.log('GLTF Object world position:', gltfWorldPosition);

  //      // Add the model to the scene
  //      scene.add(gltfObjectTARS);
  //    },
  //  );

  //#region PLANET DATA WITH PROJECT DATA
  // === PLANET DATA WITH PROJECT DATA ===
  const planets = [
    { 
      name: "Mars", 
      radius: 1, 
      distance: 100, 
      material: marsMaterial,
      projectData: { 
        projectName: "Sunday",
        time: "October 2024",
        description: " A VR narrative experience featuring primitive 3D models dubbed voice acting, and spatial audio for an immersive storytelling environment",
        technologies: "Unity, Audacity, Adobe Premiere Pro",
        links: "https://www.youtube.com/watch?v=YZAAgqMNcSA",
        images: [
          "/Three-JS-Portfolio/Project-Images/Sunday/Sunday1.png",
        ],
      }
    },
    { 
      name: "Earth", 
      radius: 1, 
      distance: 75, 
      material: earthMaterial,
      projectData: { 
        projectName: "VR School",
        time: "June 2023",
        description: "A VR Educational application with a content based recommendation system that adapts content to user progress providing personalized learning",
        technologies: "Unity, Blender, Jupyter Notebook, MS Excel",
        links: "https://github.com/SarathChandraKaza/VR-School",
        images: [
          "/Three-JS-Portfolio/Project-Images/VR-School/VRSchool1.png",
          "/Three-JS-Portfolio/Project-Images/VR-School/VRSchool2.png",
          "/Three-JS-Portfolio/Project-Images/VR-School/VRSchool3.png",
          "/Three-JS-Portfolio/Project-Images/VR-School/VRSchool4.png",
          "/Three-JS-Portfolio/Project-Images/VR-School/VRSchool5.png",
          "/Three-JS-Portfolio/Project-Images/VR-School/VRSchool6.png",
          "/Three-JS-Portfolio/Project-Images/VR-School/VRSchool7.png",
        ],
      }
    },
    { 
      name: "Venus", 
      radius: 1, 
      distance: 50, 
      material: venusMaterial,
      projectData: { 
        projectName: "Dodge Ball",
        time: "August 2022",
        description: "A third person player VR game designed for Oculus, with engaging gameplay and audio dynamics",
        technologies: "Unity, Blender, Audacity",
        links: "https://github.com/SarathChandraKaza/Dodge-Ball",
        images: [
          "/Three-JS-Portfolio/Project-Images/Dodge-Ball/DodgeBall1.png",
          "/Three-JS-Portfolio/Project-Images/Dodge-Ball/DodgeBall2.png",
          "/Three-JS-Portfolio/Project-Images/Dodge-Ball/DodgeBall3.png",
        ],
      }
    },
    { 
      name: "Mercury", 
      radius: 1, 
      distance: 25, 
      material: mercuryMaterial,
      projectData: { 
        projectName: "Eating Tom",
        time: "December 2021",
        description: "A 2D platformer game optimized for the web, providing smooth and interactive gameplay",
        technologies: "Unity, WebGL",
        links: "https://github.com/SarathChandraKaza/Eating-Tom",
        images: [
          "/Three-JS-Portfolio/Project-Images/Eating-Tom/EatingTom1.png",
          "/Three-JS-Portfolio/Project-Images/Eating-Tom/EatingTom2.png",
          "/Three-JS-Portfolio/Project-Images/Eating-Tom/EatingTom3.png",
        ],
      }
    },
    { 
      name: "Sun", 
      radius: 0.2, 
      distance: 0, 
      material: sunMaterial,
      // projectData: { 
      //   projectName: "Eating Tom",
      //   time: "December 2021",
      //   description: "A 2D platformer game optimized for the web, providing smooth and interactive gameplay",
      //   technologies: "Unity, WebGL",
      //   links: "https://github.com/SarathChandraKaza/Eating-Tom",
      //   images: [
      //     "/Project-Images/Eating-Tom/EatingTom1.png",
      //     "/Project-Images/Eating-Tom/EatingTom2.png",
      //     "/Project-Images/Eating-Tom/EatingTom3.png",
      //   ],
      // }
    },
  ];
  //#endregion

  //#region PLANET CREATION
  // === PLANET CREATION ===
  const createPlanet = (planet) => {
    const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
    planetMesh.scale.setScalar(planet.radius);
    planetMesh.position.set(planet.distance, 0, 0);
    planetMesh.userData = planet; // Store planet data in userData
    planetMesh.interactive = false; // Initially set to false (not clickable)
    return planetMesh;
  };

  const planetMeshes = planets.map(planet => {
    const planetMesh = createPlanet(planet);
    scene.add(planetMesh);
    return planetMesh;
  });

  planetMeshes.forEach((planetMesh) => 
    {

      const planetWorldPosition = new THREE.Vector3();
      planetMesh.getWorldPosition(planetWorldPosition);
      console.log('${planetMesh.userData.name} position:', planetWorldPosition);
    // console.log(`${planetMesh.userData.name} position:`, planetMesh.position);
  });
  //#endregion

  //#region LIGHTING SETUP
  // === LIGHTING SETUP ===
  scene.add(new THREE.AmbientLight(0xffffff, 0.75)); // Ambient light
  const pointLight = new THREE.PointLight(0xffffff, 5000); // Light source
  scene.add(pointLight);
  //#endregion

  //#region CAMERA SETUP
  // === CAMERA SETUP ===
  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 400);
  camera.position.set(0, 150, 150);
  camera.lookAt(0, 0, 0);

// Create an audio listener and attach it to the camera
const listener = new THREE.AudioListener();
camera.add(listener); // Attach the listener to the camera for audio context

// Create a global (non-positional) audio object
const globalAudio = new THREE.Audio(listener);

// Load the ambient music file
const audioLoader = new THREE.AudioLoader();
audioLoader.load('/Three-JS-Portfolio/Sounds/SFX/ambient-music.mp3', (buffer) => {
  globalAudio.setBuffer(buffer);  // Set the audio buffer
  globalAudio.setLoop(true);      // Enable looping for continuous playback
  globalAudio.setVolume(0.5);     // Adjust the volume (0.0 to 1.0)
  
  // Wait for a user gesture (click or any other interaction) before starting audio
  window.addEventListener('click', () => {
    globalAudio.play();           // Play the audio after user gesture
  });
});

  //#endregion

  //#region RENDERER SETUP
  // === RENDERER SETUP ===
  const canvas = document.querySelector("canvas.threejs");
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //#endregion

  //#region ORBIT CONTROLS
  // === ORBIT CONTROLS ===
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Smooth camera movement
  controls.enableZoom = false; // Disable zooming in OrbitControls
  controls.mouseButtons.RIGHT = THREE.MOUSE.NO_MODIFIER;
  controls.mouseButtons.LEFT = THREE.MOUSE.NO_MODIFIER;
  //#endregion

  //#region RAYCASTER SETUP
  // === RAYCASTER SETUP ===
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  //#endregion

  //#region SCROLL AND INTERACTION SETUP
  // === SCROLL AND INTERACTION VARIABLES ===
  let currentPlanetIndex = 0;
  let isBirdsEyeView = true;
  let isScrolling = false;
  let isZoomedIn = false; // Track if the camera has zoomed in
  let isUIVisible = false; // Track whether the UI is visible or not
  let isClickEnabled = true; // Flag to enable/disable click events
  // === CAMERA POSITION CALCULATION ===
  const calculateCameraPosition = (planet) => planet.radius * 10;
    //#endregion

  //#region HELP TEXT
    let interactionTimer; // Timer for user inactivity
  const helpText = document.getElementById('help-text'); // Help text element
  let allowHelpText = true; // Flag to control help text visibility

  // Function to show help text
  function showHelpText() {
    if (helpText && allowHelpText) { // Only show if the flag allows it
      console.log("Showing help text");
      playSound(helpPopupSound);
      helpText.style.display = 'block';
    }
  }

  // Function to hide help text
  function hideHelpText() {
    if (helpText) {
      helpText.style.display = 'none';
    }
  }

// Reset inactivity timer
function resetInteractionTimer() {
  clearTimeout(interactionTimer); // Clear the existing timer
  hideHelpText(); // Hide the help text if it's currently showing

  // Start a new timer
  interactionTimer = setTimeout(() => {
    showHelpText();
  }, 45000); // 45 seconds
}


  //#endregion

  //#region SCROLL HANDLER
  // === SCROLL HANDLER ===
  const handleScroll = (event) => {
    // Only process scroll if the UI is NOT visible or already scrolling
    if (isUIVisible || isScrolling) return;
  
    isScrolling = true;


    

    if (event.deltaY < 0) {
      // Scroll down
      if (isBirdsEyeView) {
        currentPlanetIndex = 0;
        isBirdsEyeView = false;
        resetInteractionTimer();
        // Enable help text when leaving bird's-eye view
        allowHelpText = true;
      } else if (currentPlanetIndex < planets.length-2) 
        {
        currentPlanetIndex = Math.min(currentPlanetIndex+1, planets.length - 2);
        resetInteractionTimer();
      } else {
        // If at the last planet, transition back to bird's-eye view
        isBirdsEyeView = true;
         // Disable help text when entering bird's-eye view
        allowHelpText = false;
        hideHelpText();
      }
    } else {
      // Scroll up
      if (isBirdsEyeView) 
        {
        // Stay in bird's-eye view
        isScrolling = false;
        return;
      } else if (currentPlanetIndex === 0) {
        isBirdsEyeView = true;
      } else {
        currentPlanetIndex = Math.max(currentPlanetIndex - 1, 0);
      }
    }
  
    const selectedPlanet = isBirdsEyeView ? null : planets[currentPlanetIndex];
    const selectedPlanetMesh = isBirdsEyeView ? null : planetMeshes[currentPlanetIndex];
  
    planetMeshes.forEach(mesh => (mesh.interactive = false)); // Disable interaction
  
    // Set new camera position
    const newPosition = isBirdsEyeView
      ? { x: 0, y: 150, z: 150 } // Bird's-eye view position
      : {
          x: selectedPlanetMesh.position.x + calculateCameraPosition(selectedPlanet),
          y: 0,
          z: 0,
        };
  
        // Function to fade out audio
function fadeOutAudio(audio, duration = 1) {
  const fadeInterval = 50; // Interval in milliseconds
  const fadeStep = audio.volume / (duration * 1000 / fadeInterval);

  const fadeOut = setInterval(() => {
    if (audio.volume > 0) {
      audio.volume = Math.max(0, audio.volume - fadeStep); // Reduce volume
    } else {
      clearInterval(fadeOut); // Stop fading
      audio.pause(); // Pause the audio
      audio.currentTime = 0; // Reset to start
    }
  }, fadeInterval);
}

    // GSAP animation with sound
gsap.to(camera.position, {
  x: newPosition.x,
  y: newPosition.y,
  z: newPosition.z,
  duration: 1.5,
  ease: "power2.inOut",
  onStart: () => {
    // Play sound when animation starts
    animationSound.volume=1;
    animationSound.currentTime = 0; // Reset audio to start
    animationSound.play().catch(err => console.warn('Audio play error:', err));
  },
  onUpdate: () => {
    const target = isBirdsEyeView
      ? new THREE.Vector3(0, 0, 0)
      : selectedPlanetMesh.position;
    camera.lookAt(target);
  },
  onComplete: () => {
     // Fade out sound when animation ends
     fadeOutAudio(animationSound, 0.2); // 0.2-second fade-out duration

    isZoomedIn = !isBirdsEyeView;
    if (!isBirdsEyeView && selectedPlanetMesh) {
      selectedPlanetMesh.interactive = true;
    }

    //Enable Disable the information sprite according to birds eye view.
    if (isBirdsEyeView) {
      // Remove the sprite with a delay
      setTimeout(() => {
        scene.add(sprite);
      }, 1000); 
    } else {
      // Add the sprite with a delay
      setTimeout(() => {
        scene.remove(sprite);
      }, 0); 
    }

    controls.update();
    isScrolling = false;
  },
});
  };
  
  // Add scroll event listener
  window.addEventListener("wheel", handleScroll);
  

  //#endregion

  //#region CLICK HANDLER WITH PROJECT DATA HANDLER
  // === UPDATED CLICK HANDLER TO RENDER PROJECT DATA WITH BACKGROUND IMAGE ===

  const handleClick = (event) => 
  {
   
  if (!isZoomedIn) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planetMeshes.filter(mesh => mesh.interactive));

  if (intersects.length > 0) 
    {
    const planet = intersects[0].object.userData;
    clearTimeout(interactionTimer); // Clear the existing timer
    hideHelpText(); //Hide the help
    playSound(planetClickSound);
    // Zoom into the selected planet and display UI
    gsap.to(camera.position, {
      x: planet.distance + 10,
      y: 3,
      z: 0,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(planetMeshes[planets.indexOf(planet)].position);
      },
      onComplete: () => {
        const uiMenu = document.getElementById("ui-menu");
        const projectData = planet.projectData;

        let currentImageIndex = 0;

        const renderImage = () => {
          const imageUrl = `${projectData.images[currentImageIndex]}`;
          console.log('Loading image from:', imageUrl);  // Check if this is the correct URL
          return `<img src="${imageUrl}" alt="Project Image" class="carousel-image">`;
        };

        const bulletPointsHtml = `
          <p><strong>Description:</strong> ${projectData.description}</p>
          <p><strong>Technologies:</strong> ${projectData.technologies}</p>
        `;

        let carouselButtonsHtml = '';
        if (projectData.images.length > 2) {
          carouselButtonsHtml = `
            <button class="carousel-button carousel-button-left"></button>
            <div class="carousel-image-wrapper">${renderImage()}</div>
            <button class="carousel-button carousel-button-right"></button>
          `;
        } else {
          carouselButtonsHtml = `
            <div class="carousel-image-wrapper">${renderImage()}</div>
          `;
        }

        uiMenu.innerHTML = `
          <div class="ui-content">
            <button id="project-link" class="link-button">Project Link</button>
            <button id="close-ui" class="close-button">Close</button>
            <div class="project-info">
              <h1 id="project-name">${projectData.projectName}</h1>
              <h3 id="project-date">${projectData.time}</h3>
              <div id="planet-details">${bulletPointsHtml}</div>
              <div class="carousel-container">
                ${carouselButtonsHtml}
              </div>
            </div>
          </div>
        `;

        // Attach event listeners for carousel navigation
        if (projectData.images.length > 2) {
          document.getElementById('.carousel-button-left').addEventListener('mouseover', () =>
          {
              // playSound(hoverSound);
          });

          document.getElementById('.carousel-button-right').addEventListener('mouseover', () =>
            {
                // playSound(hoverSound);
            });

          document.getElementById('.carousel-button-left').addEventListener('click', () => 
            {
              playSound(iconClickSound);
            currentImageIndex = (currentImageIndex - 1 + projectData.images.length) % projectData.images.length;
            document.querySelector('.carousel-image-wrapper').innerHTML = renderImage();
          });

          document.getElementById('.carousel-button-right').addEventListener('click', () => 
            {
              playSound(iconClickSound);
            currentImageIndex = (currentImageIndex + 1) % projectData.images.length;
            document.querySelector('.carousel-image-wrapper').innerHTML = renderImage();
          });
        }

        // Attach event listener to the project link button
        const projectLinkButton = document.getElementById('project-link');
        if (projectLinkButton) {
          projectLinkButton.addEventListener('click', () => {
            window.open(projectData.links, '_blank');
             // Play the click sound effect
            buttonClickSound.currentTime = 0; // Reset the audio to start for consecutive clicks
            buttonClickSound.play().catch((error) => console.warn('Audio play error:', error));
          });

          projectLinkButton.addEventListener('mouseover', () => {playSound(hoverSound);});
        }
        uiMenu.style.display = "flex";  // Show the UI menu
        isUIVisible = true;  // Mark UI as visible

        // Attach close button event listener dynamically
        const closeButton = document.getElementById('close-ui');
        if (closeButton) {
          closeButton.removeEventListener('click', closeUIHandler);
          closeButton.addEventListener('click', closeUIHandler);
          closeButton.addEventListener('mouseover', () => {playSound(hoverSound);});
        } else {
          console.error("Close button not found!");
        }
      }
    });
  }
};


  // Add click event listener
  window.addEventListener("click", handleClick);

  //#endregion

  //#region CLOSE UI HANDLER
  // === CLOSE UI HANDLER ===
  const closeUIHandler = () => {
    const uiMenu = document.getElementById("ui-menu");
    uiMenu.style.display = 'none';
    isUIVisible = false; // Mark UI as hidden
     // Play the click sound effect
     buttonClickSound.currentTime = 0; // Reset the audio to start for consecutive clicks
     buttonClickSound.play().catch((error) => console.warn('Audio play error:', error));
    // Reset camera position
    gsap.to(camera.position, {
      y: 0, // Move camera back to origin (y = 0)
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(0, 0, 0); // Look at the center of the scene
      },
      onComplete: () => {
        controls.update();
        resetInteractionTimer();
        isClickEnabled = true; // Re-enable click events after camera returns to default position
      }
    });
  };
  //#endregion

  //#region 3D TEXT OF MY PROJECTS
// === 3D TEXT IN BACKGROUND ===
// Load Font for 3D Text
const fontLoader = new FontLoader(manager);
let textMaterial;
fontLoader.load('/Three-JS-Portfolio/Fonts/SF Pro Display_Light.json', (font) => {
  // Define text properties
  const textGeometry = new TextGeometry('An Interstellar Travel Through My Works', {
    font: font,
    size: 4, // Text size
    depth: 1, // Text depth
    curveSegments: 25, // Number of curve segments
    bevelEnabled: true, // Bevel enabled
    bevelThickness: 0.5, // Thickness of the bevel
    bevelSize: 0.25, // Bevel size
    bevelSegments: 5 // Bevel segments
  });

  // Define material for text
  textMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffcc, // Text color
    emissive: 0x005f5f, // Slight emissive effect
  });

  // Create the text mesh
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // Position the text in the background
  textMesh.position.set(-45,47.5,-10); // Adjust the position as needed
  textMesh.rotation.set(-44.5, 0, 0); // Add rotation for better viewing

  // Add the text to the scene
  scene.add(textMesh);
});
//#endregion

  //#region INFORMATION ICON
  const textureLoader2 = new THREE.TextureLoader();
  const iconTexture = textureLoader2.load('/Three-JS-Portfolio/Icons/information-button.png');

  const spriteMaterial = new THREE.SpriteMaterial({ map: iconTexture });
  let sprite = new THREE.Sprite(spriteMaterial);

  // Position the sprite relative to the camera
  sprite.scale.set(7.5, 7.5, 7.5); // Adjust the size of the icon
  sprite.position.set(-160,-120, -5); // Place 5 units in front of the camera
  scene.add(sprite);


  //Raycast Information
  const raycaster2 = new THREE.Raycaster();
  const mouse2 = new THREE.Vector2();

  // Add a click event listener
  window.addEventListener('click', onSpriteClick);

  function onSpriteClick(event) 
  {
  
    // Convert screen coordinates to normalized device coordinates (-1 to +1)
    mouse2.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse2.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Set up the raycaster
    raycaster2.setFromCamera(mouse2, camera);

    // Check if the sprite is intersected
    const intersects = raycaster2.intersectObject(sprite);
    if (intersects.length > 0 && isUIVisible==false) 
      {
          // Play the click sound effect
          playSound(iconClickSound);
      // Sprite was clicked, show the UI
      showUIScreen("Close");
    }
}

    // Get the tooltip element
  const tooltip = document.getElementById('hoverTooltip');

  // Mouse move event listener
  function onSpriteHover(event) {
    // Convert screen coordinates to normalized device coordinates (-1 to +1)
    const mouse2 = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    };

    // Set up the raycaster
    raycaster2.setFromCamera(mouse2, camera);

    // Check if the sprite is intersected
    const intersects = raycaster2.intersectObject(sprite);

    if (intersects.length > 0 && isUIVisible==false) 
    {
      // Position the tooltip near the cursor
      tooltip.style.left = `${event.clientX + 10}px`;
      tooltip.style.top = `${event.clientY + 10}px`;
      tooltip.textContent = 'What is this?';
      tooltip.style.display = 'block';
      playSound(hoverSound);
    } else {
      // Hide the tooltip if not hovering
      tooltip.style.display = 'none';
    }
  }

  // Add mousemove event listener to the canvas or window
  window.addEventListener('mousemove', onSpriteHover);

  //Function to show Information Screen
  function showUIScreen(buttonText) {
    const uiScreen = document.getElementById("ui-screen");
    const closeButton = document.getElementById('close-icon-ui');
    closeButton.textContent = buttonText;
    uiScreen.style.display = "block"; // Show the UI screen
    isUIVisible=true;

    const socialIcons = document.querySelectorAll('#social-icons a');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseover', () => playSound(hoverSound)); // Hover sound
        icon.addEventListener('click', () => playSound(iconClickSound));    // Click sound
    });


  }

  // Function to hide the UI screen
  function hideUIScreen() {
    const uiScreen = document.getElementById("ui-screen");
    uiScreen.style.display = "none"; // Hide the UI screen
    isUIVisible=false;
  }

  // Attach close button event listener dynamically
  const closeButton = document.getElementById('close-icon-ui');
  if (closeButton) 
    {
      // Define the event handler function
      const closeUIHandler = () => 
        {
          // Play the click sound effect
          playSound(buttonClickSound);
          hideUIScreen(); // Call hideUIScreen when the button is clicked
      };
      
      // Add event listener to the button
      closeButton.addEventListener('click', closeUIHandler);

      //Add hover sfx for button
      closeButton.addEventListener('mouseover', () =>
      {
        playSound(hoverSound);
      }
      );
  } else {
      console.error("Close button not found!");
  }

//#endregion

  //#region RENDER LOOP
  // === RENDER LOOP ===
  
  const renderloop = () => {
    // Rotate planets continuously
    planetMeshes.forEach((planetMesh) => {
      planetMesh.rotation.y += 0.009;
    });

  //   // Make sprite always in front of the camera
  //   sprite.position.set(
  //     camera.position.x -90,
  //     camera.position.y -90 ,
  //     camera.position.z -145
  // );

  //   // If the TARS object exists, make it face the camera
  // if (gltfObjectTARS) {
  //     gltfObjectTARS.lookAt(camera.position); // Make TARS face the camera
  //   }

  //   // Check if gltfObjectEndurance is loaded and then apply rotation
  //   if (gltfObjectEndurance) {
  //     gltfObjectEndurance.rotation.x += 0.0005; // Rotate Endurance
  // }

      // Check if gltfObjectRanger is loaded and then apply movement
    if (gltfObjectRanger) {
      // Move Ranger to the right along the X axis
      gltfObjectRanger.position.x += 0.09; // Move Ranger by 0.09 units each frame

      // Ranger and Text colour changing working
      // Array of multiple colors for the gradient animation
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

      // Function to interpolate between colors
      function lerpColor(color1, color2, t) {
        if (!color1 || !color2) {
          console.error('Invalid colors in lerpColor function:', color1, color2);
          return new THREE.Color(0x00ffcc); // Fallback to a default color if something goes wrong
        }
        return new THREE.Color(
          color1.r * (1 - t) + color2.r * t,
          color1.g * (1 - t) + color2.g * t,
          color1.b * (1 - t) + color2.b * t
        );
      }

      // If the Ranger's x position reaches or exceeds 150, reset it to -150
      if (gltfObjectRanger.position.x >= 150) {
        gltfObjectRanger.position.x = -150; // Abrupt shift to -150
      }

      if (gltfObjectRanger.position.x >= -100 && gltfObjectRanger.position.x <= 50) {
        // Change the color of the text when the Ranger is in front

        // Normalize the position of the Ranger to a value between 0 and 1
        const rangeMin = -30; // Min position
        const rangeMax = 30;  // Max position
        let t = (gltfObjectRanger.position.x - rangeMin) / (rangeMax - rangeMin);

        // Speed up the transition by adding a factor to t
        const speedFactor = 1; // Increase this value for faster transitions
        t = t * speedFactor;

        // Ensure t stays within the range [0, 1]
        t = Math.max(0, Math.min(1, t));

        // Find the two nearest color indices and interpolate between them
        const numColors = gradientColors.length;
        const totalRange = numColors;
        const index = Math.floor(t * totalRange); // Find the starting color index
        const nextIndex = (index + 1) % numColors; // Loop back to the first color when we reach the last one

        // Clamp index and nextIndex to be within valid bounds (0 to numColors - 1)
        const validIndex = Math.min(Math.max(index, 0), numColors - 1);
        const validNextIndex = Math.min(Math.max(nextIndex, 0), numColors - 1);

        // Get the interpolation ratio within the current two colors
        const colorT = (t * totalRange) - validIndex;  // Fractional value for smooth interpolation

        // Ensure valid color indices
        if (gradientColors[validIndex] && gradientColors[validNextIndex]) {
          const currentColor = gradientColors[validIndex];
          const nextColor = gradientColors[validNextIndex];

          // Set the text color using the interpolated value
          const newColor = lerpColor(currentColor, nextColor, colorT);
          textMaterial.color.set(newColor);
        } else {
          console.error('Invalid color indices:', validIndex, validNextIndex);
        }
      } else {
        // Reset the color when the Ranger is not in front
        textMaterial.color.set(0x00ffcc); // Original text color
      }
    }

    controls.update(); // Update controls for smooth interaction
    renderer.render(scene, camera); // Render the scene
    window.requestAnimationFrame(renderloop); // Keep the animation loop going
  };
  renderloop();
  showUIScreen("Enter");
  //#endregion

  //#region WINDOW RESIZE HANDLER
  // === WINDOW RESIZE HANDLER ===
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  //#endregion

 
