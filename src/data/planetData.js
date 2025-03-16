export const planets = [
  { 
    name: "Mars", 
    radius: 2.5, 
    distance: 100,
    texturePath: `${import.meta.env.BASE_URL}textures/2k_mars.jpg`,
    projectData: { 
      projectName: "Sunday",
      time: "October 2024",
      description: "A VR narrative experience featuring primitive 3D models, dubbed voice acting, and spatial audio for an immersive storytelling environment",
      technologies: "Unity, Audacity, Adobe Premiere Pro",
      links: "https://www.youtube.com/watch?v=YZAAgqMNcSA",
      images: [
        `${import.meta.env.BASE_URL}Project-Images/Sunday/Sunday1.png`,
      ],
    }
  },
  { 
    name: "Earth", 
    radius: 2.5, 
    distance: 75,
    texturePath: `${import.meta.env.BASE_URL}textures/2k_earth_daymap.jpg`,
    projectData: { 
      projectName: "VR School",
      time: "June 2023",
      description: "A VR Educational application with a content-based recommendation system that adapts content to user progress, providing personalized learning.",
      technologies: "Unity, Blender, Jupyter Notebook, MS Excel",
      links: "https://github.com/SarathChandraKaza/VR-School",
      images: [
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool1.png`,
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool2.png`,
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool3.png`,
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool4.png`,
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool5.png`,
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool6.png`,
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool7.png`
      ],
    }
  },
  { 
    name: "Venus", 
    radius: 2.5, 
    distance: 50,
    texturePath: `${import.meta.env.BASE_URL}textures/2k_venus_surface.jpg`,
    projectData: { 
      projectName: "Dodge Ball",
      time: "August 2022",
      description: "A third-person VR game designed for Oculus, featuring engaging gameplay and audio dynamics.",
      technologies: "Unity, Blender, Audacity",
      links: "https://github.com/SarathChandraKaza/Dodge-Ball",
      images: [
        `${import.meta.env.BASE_URL}Project-Images/Dodge-Ball/DodgeBall1.png`,
        `${import.meta.env.BASE_URL}Project-Images/Dodge-Ball/DodgeBall2.png`,
        `${import.meta.env.BASE_URL}Project-Images/Dodge-Ball/DodgeBall3.png`
      ],
    }
  },
  { 
    name: "Mercury", 
    radius: 2.5, 
    distance: 25,
    texturePath: `${import.meta.env.BASE_URL}textures/2k_mercury.jpg`,
    projectData: { 
      projectName: "Eating Tom",
      time: "December 2021",
      description: "A 2D platformer game optimized for the web, providing smooth and interactive gameplay.",
      technologies: "Unity, WebGL",
      links: "https://github.com/SarathChandraKaza/Eating-Tom",
      images: [
        `${import.meta.env.BASE_URL}Project-Images/Eating-Tom/EatingTom1.png`,
        `${import.meta.env.BASE_URL}Project-Images/Eating-Tom/EatingTom2.png`,
        `${import.meta.env.BASE_URL}Project-Images/Eating-Tom/EatingTom3.png`
      ],
    }
  },
  { 
    name: "Sun", 
    radius: 5,
    distance: 0,
    texturePath: `${import.meta.env.BASE_URL}textures/2k_sun.jpg`,
    material: "basic" // Special flag for sun's material
  }
];  
