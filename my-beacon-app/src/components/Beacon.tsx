// src/components/Beacon.tsx

import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

interface BeaconProps {
  position: [number, number, number];
  rotation: [number, number, number];
  gyroscopicAcceleration: {
    yaw: number;
    pitch: number;
    roll: number;
  };
  dataView: 'position' | 'orientation' | 'acceleration';
  predictedRotation?: [number, number, number] | null;
}

const Beacon: React.FC<BeaconProps> = ({
  position,
  rotation,
  gyroscopicAcceleration,
  dataView,
  predictedRotation,
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const arrowRef = useRef<THREE.ArrowHelper>(null!);

  // Load model & textures
  const materials = useLoader(MTLLoader, '/models/beacon.mtl');
  const beacon = useLoader(OBJLoader, '/models/beacon.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  useFrame(() => {
    // Apply current rotation
    mesh.current.rotation.set(
      THREE.MathUtils.degToRad(rotation[0]),
      THREE.MathUtils.degToRad(rotation[1]),
      THREE.MathUtils.degToRad(rotation[2])
    );

    // Optionally, apply gyroscopic acceleration to rotation
    mesh.current.rotation.x +=
      THREE.MathUtils.degToRad(gyroscopicAcceleration.pitch) * 0.01;
    mesh.current.rotation.y +=
      THREE.MathUtils.degToRad(gyroscopicAcceleration.yaw) * 0.01;
    mesh.current.rotation.z +=
      THREE.MathUtils.degToRad(gyroscopicAcceleration.roll) * 0.01;

    // Update predicted orientation arrow
    if (predictedRotation && arrowRef.current) {
      const direction = new THREE.Vector3(
        Math.sin(THREE.MathUtils.degToRad(predictedRotation[1])) *
          Math.cos(THREE.MathUtils.degToRad(predictedRotation[0])),
        Math.sin(THREE.MathUtils.degToRad(predictedRotation[1])),
        Math.cos(THREE.MathUtils.degToRad(predictedRotation[1])) *
          Math.sin(THREE.MathUtils.degToRad(predictedRotation[0]))
      );

      arrowRef.current.setDirection(direction.normalize());
    }
  });

  // Determine which data to display based on dataView
  let displayData;
  switch (dataView) {
    case 'position':
      displayData = `Lat: ${position[0].toFixed(
        2
      )}, Lon: ${position[2].toFixed(2)}, Alt: ${position[1].toFixed(2)}`;
      break;
    case 'orientation':
      displayData = `Yaw: ${rotation[0].toFixed(
        2
      )}, Pitch: ${rotation[1].toFixed(2)}, Roll: ${rotation[2].toFixed(2)}`;
      break;
    case 'acceleration':
      displayData = `Gyro Yaw: ${gyroscopicAcceleration.yaw.toFixed(
        2
      )}, Gyro Pitch: ${gyroscopicAcceleration.pitch.toFixed(
        2
      )}, Gyro Roll: ${gyroscopicAcceleration.roll.toFixed(2)}`;
      break;
    default:
      displayData = '';
  }

  return (
      <group position={position}>
        <primitive ref={mesh} object={beacon}/>

        {/* Predicted Orientation Arrow */}
        {predictedRotation && (
            <arrowHelper
                ref={arrowRef}
                args={[
                  new THREE.Vector3(0, 1, 0), // initial direction
                  new THREE.Vector3(0, 0, 0), // origin
                  20, // length of arrow
                  0x00ff00, // color (green)
                ]}
            />
        )}

        <Html position={[0, 10, 0]} center>
          <div
              style={{
                color: 'white',
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '2px 5px',
                borderRadius: '5px',
                whiteSpace: 'nowrap',
              }}
          >
            {displayData}
          </div>
        </Html>
      </group>
  );
};

export default Beacon;
