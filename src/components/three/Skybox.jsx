import { useThree } from '@react-three/fiber';
import { CubeTextureLoader } from 'three';
import { useEffect } from 'react';

const Skybox = () => {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new CubeTextureLoader();
    // Load the skybox textures
    const baseUrl = import.meta.env.BASE_URL;
    const skyboxTexture = loader.load([
      `${baseUrl}textures/PurpleNebulaSkybox_right1.png`,  // Right
      `${baseUrl}textures/PurpleNebulaSkybox_left2.png`,   // Left
      `${baseUrl}textures/PurpleNebulaSkybox_top3.png`,    // Top
      `${baseUrl}textures/PurpleNebulaSkybox_bottom4.png`, // Bottom
      `${baseUrl}textures/PurpleNebulaSkybox_front5.png`,  // Front
      `${baseUrl}textures/PurpleNebulaSkybox_back6.png`    // Back
    ]);
    scene.background = skyboxTexture;

    return () => {
      skyboxTexture.dispose();
    };
  }, [scene]);

  return null;
};

export default Skybox; 