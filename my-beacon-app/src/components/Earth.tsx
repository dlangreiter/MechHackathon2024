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

  // Adjust rotation speed to match the beacon's longitude change
  const rotationSpeedDegreesPerSecond = 0.0216; // degrees per second
  const rotationSpeed = THREE.MathUtils.degToRad(rotationSpeedDegreesPerSecond); // Convert to radians

  useFrame((_, delta) => {
    // Rotate Earth around its Y-axis
    earthRef.current.rotation.y += rotationSpeed * delta;
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
