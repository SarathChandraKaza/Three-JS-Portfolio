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
      `${import.meta.env.BASE_URL}textures/PurpleNebula/PurpleNebulaSkybox_right1.png`,
      `${import.meta.env.BASE_URL}textures/PurpleNebula/PurpleNebulaSkybox_left2.png`,
      `${import.meta.env.BASE_URL}textures/PurpleNebula/PurpleNebulaSkybox_top3.png`,
      `${import.meta.env.BASE_URL}textures/PurpleNebula/PurpleNebulaSkybox_bottom4.png`,
      `${import.meta.env.BASE_URL}textures/PurpleNebula/PurpleNebulaSkybox_front5.png`,
      `${import.meta.env.BASE_URL}textures/PurpleNebula/PurpleNebulaSkybox_back6.png`
    ]);
    
    scene.background = skyboxTexture;

    return () => {
      skyboxTexture.dispose();
    };
  }, [scene]);

  return null;
};

export default Skybox; 