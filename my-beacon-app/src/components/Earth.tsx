// src/components/Earth.tsx

import React, { useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Earth: React.FC = () => {
  const [colorMap, nightMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth_daymap.jpg',
    '/textures/earth_nightmap.jpg',
  ]);

  const earthRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    earthRef.current.rotation.y += 0.0005; // Rotate Earth slowly
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[100, 64, 64]} />
      <meshStandardMaterial
        map={colorMap}
        emissiveMap={nightMap}
        emissiveIntensity={0.5}
        emissive={new THREE.Color(0xffffff)} // Corrected property name
      />
    </mesh>
  );
};

export default Earth;