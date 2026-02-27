export const planets = [
  { 
    name: "Saturn", 
    radius: 2.5,
    distance: 150,
    texturePath: `${import.meta.env.BASE_URL}textures/2k_saturn.jpg`,
    projectData: { 
      projectName: "Crossroads",
      time: "2026",
      description: "A branching 360° VR narrative experience featuring real time decision logic, seamless video transitions, and optimized playback for Meta Quest 3.",
      technologies: "Unity, Meta Quest 3, 360 Video Pipeline, Twine Logic System",
      links: "https://www.meta.com/en-gb/experiences/crossroads/24759322267081080/",
      images: [
        `${import.meta.env.BASE_URL}Project-Images/Crossroads/Crossroads1.png`,
        `${import.meta.env.BASE_URL}Project-Images/Crossroads/Crossroads2.png`,
        `${import.meta.env.BASE_URL}Project-Images/Crossroads/Crossroads3.png`,
        `${import.meta.env.BASE_URL}Project-Images/Crossroads/Crossroads4.png`,
        `${import.meta.env.BASE_URL}Project-Images/Crossroads/Crossroads5.png`,
      ],
    }
  },

  { 
    name: "Jupiter", 
    radius: 2.5,
    distance: 125,
    texturePath: `${import.meta.env.BASE_URL}textures/2k_jupiter.jpg`,
    projectData: { 
      projectName: "Crime Scene VR",
      time: "2024",
      description: "A multiplayer VR investigation simulation where users analyze crime scenes and submit reports to instructors via Mirror networking and REST APIs.",
      technologies: "Unity, Mirror Multiplayer, REST API, MySQL",
      links: "https://www.linkedin.com/posts/infivrlabs_infivrs-next-generation-ai-powered-training-activity-7280832496454324224-yAQx?utm_source=share&utm_medium=member_android&rcm=ACoAADeoZ-AB8GUPWcS15f1TkXQmfiNWFZGEwSQ",
      images: [
        `${import.meta.env.BASE_URL}Project-Images/Crime-Scene/CrimeScene1.png`,
        `${import.meta.env.BASE_URL}Project-Images/Crime-Scene/CrimeScene2.png`,
      ],
    }
  },

  { 
    name: "Mars", 
    radius: 2.5,
    distance: 100,
    texturePath: `${import.meta.env.BASE_URL}textures/2k_mars.jpg`,
    projectData: { 
      projectName: "Cockpit VR",
      time: "2024",
      description: "A VR flight simulation where users perform structured pre flight validation checks before takeoff, implementing rule based interaction logic.",
      technologies: "Unity, XR Interaction Toolkit, Finite State Machine",
      links: "https://youtu.be/_iM7F6KqUNU?si=EZmwXB9ab0MtNlxP",
      images: [
        `${import.meta.env.BASE_URL}Project-Images/Cockpit/Cockpit1.png`,
        `${import.meta.env.BASE_URL}Project-Images/Cockpit/Cockpit2.png`,
      ],
    }
  },

  { 
    name: "Earth", 
    radius: 2.5,
    distance: 75,
    texturePath: `${import.meta.env.BASE_URL}textures/2k_earth_daymap.jpg`,
    projectData: { 
      projectName: "Sunday",
      time: "2024",
      description: "A VR narrative experience featuring primitive 3D model animations, voice acting, and spatial audio for immersive storytelling.",
      technologies: "Unity, Audacity, Adobe Premiere Pro",
      links: "https://www.youtube.com/watch?v=YZAAgqMNcSA",
      images: [
        `${import.meta.env.BASE_URL}Project-Images/Sunday/Sunday1.png`,
      ],
    }
  },

  { 
    name: "Venus", 
    radius: 2.5,
    distance: 50,
    texturePath: `${import.meta.env.BASE_URL}textures/2k_venus_surface.jpg`,
    projectData: { 
      projectName: "VR School",
      time: "2023",
      description: "A VR educational application deployed to government schools, featuring adaptive learning based on user progress.",
      technologies: "Unity, Blender, Jupyter Notebook, Meta Quest 2",
      links: "https://github.com/SarathChandraKaza/VR-School",
      images: [
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool1.png`,
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool2.png`,
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool3.png`,
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool4.png`,
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool5.png`,
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool6.png`,
        `${import.meta.env.BASE_URL}Project-Images/VR-School/VRSchool7.png`,
      ],
    }
  },

  { 
    name: "Mercury", 
    radius: 2.5,
    distance: 25,
    texturePath: `${import.meta.env.BASE_URL}textures/2k_mercury.jpg`,
    projectData: { 
      projectName: "Dodge Ball",
      time: "2022",
      description: "A third person VR game built for Oculus featuring physics based gameplay and interactive audio feedback.",
      technologies: "Unity, Blender, Audacity",
      links: "https://github.com/SarathChandraKaza/Dodge-Ball",
      images: [
        `${import.meta.env.BASE_URL}Project-Images/Dodge-Ball/DodgeBall1.png`,
        `${import.meta.env.BASE_URL}Project-Images/Dodge-Ball/DodgeBall2.png`,
        `${import.meta.env.BASE_URL}Project-Images/Dodge-Ball/DodgeBall3.png`,
      ],
    }
  },

  { 
    name: "Sun", 
    radius: 5,
    distance: 0,
    texturePath: `${import.meta.env.BASE_URL}textures/2k_sun.jpg`,
    material: "basic"
  }
];