import { useThree } from '@react-three/fiber';
import { CubeTextureLoader } from 'three';
import { useEffect } from 'react';

const Skybox = () => {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new CubeTextureLoader();
    // Load the skybox textures
    const skyboxTexture = loader.load([
      '/textures/Purple Nebula/PurpleNebulaSkybox_right1.png',  // Right
      '/textures/Purple Nebula/PurpleNebulaSkybox_left2.png',   // Left
      '/textures/Purple Nebula/PurpleNebulaSkybox_top3.png',    // Top
      '/textures/Purple Nebula/PurpleNebulaSkybox_bottom4.png', // Bottom
      '/textures/Purple Nebula/PurpleNebulaSkybox_front5.png',  // Front
      '/textures/Purple Nebula/PurpleNebulaSkybox_back6.png'    // Back
    ]);

    scene.background = skyboxTexture;

    return () => {
      skyboxTexture.dispose();
    };
  }, [scene]);

  return null;
};

export default Skybox; 