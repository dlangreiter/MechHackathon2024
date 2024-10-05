// src/components/BeaconVisualization.tsx

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Beacon from './Beacon';
import Earth from './Earth';
import { BeaconData, parseBeaconMessages } from '../utils/parseBeaconMessage';

const EARTH_RADIUS = 100;

const BeaconVisualization: React.FC = () => {
  const [beaconDataArray, setBeaconDataArray] = useState<BeaconData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dataView, setDataView] = useState<'position' | 'orientation' | 'acceleration'>('position');
  const [predictedRotation, setPredictedRotation] = useState<[number, number, number] | null>(null);

  useEffect(() => {
    const fetchData = () => {
      fetch('/data.txt')
        .then((response) => response.text())
        .then((text) => {
          console.log('Raw data:', text);
          const parsedData = parseBeaconMessages(text);
          console.log('Parsed data:', parsedData);
          if (parsedData.length > 0) {
            setBeaconDataArray(parsedData);
          } else {
            console.error('No valid beacon data found');
          }
        })
        .catch((error) => {
          console.error('Error fetching beacon data:', error);
        });
    };

    fetchData(); // Initial fetch

    const interval = setInterval(() => {
      fetchData(); // Fetch new data every 5 seconds
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (beaconDataArray.length > 0) {
      // Start updating the Beacon position over time
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex < beaconDataArray.length - 1 ? prevIndex + 1 : 0
        );
      }, 1000); // Update every second

      return () => clearInterval(interval);
    }
  }, [beaconDataArray]);

  useEffect(() => {
    // Implement predictive analytics
    if (currentIndex >= 1 && beaconDataArray.length > currentIndex + 1) {
      const prevData = beaconDataArray[currentIndex - 1];
      const currData = beaconDataArray[currentIndex];

      const deltaYaw = currData.rotation.yaw - prevData.rotation.yaw;
      const deltaPitch = currData.rotation.pitch - prevData.rotation.pitch;
      const deltaRoll = currData.rotation.roll - prevData.rotation.roll;

      const predictedYaw = currData.rotation.yaw + deltaYaw;
      const predictedPitch = currData.rotation.pitch + deltaPitch;
      const predictedRoll = currData.rotation.roll + deltaRoll;

      setPredictedRotation([predictedYaw, predictedPitch, predictedRoll]);
    } else {
      setPredictedRotation(null);
    }
  }, [currentIndex, beaconDataArray]);

  if (beaconDataArray.length === 0) {
    return <p>Loading beacon data...</p>;
  }

  const currentBeaconData = beaconDataArray[currentIndex];

  // Calculate beacon position on Earth using spherical coordinates
  const latitude = currentBeaconData.location.latitude;
  const longitude = currentBeaconData.location.longitude;

  const phi = ((90 - latitude) * Math.PI) / 180;
  const theta = ((longitude + 180) * Math.PI) / 180;

  const x = -EARTH_RADIUS * Math.sin(phi) * Math.cos(theta);
  const z = EARTH_RADIUS * Math.sin(phi) * Math.sin(theta);
  const y = EARTH_RADIUS * Math.cos(phi);

  const beaconPosition: [number, number, number] = [x, y, z];

  return (
    <>
      {/* Control Panel */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
        <button onClick={() => setDataView('position')}>Position</button>
        <button onClick={() => setDataView('orientation')}>Orientation</button>
        <button onClick={() => setDataView('acceleration')}>Acceleration</button>
      </div>
      
      <div className="canvas-container">
      <Canvas camera={{ position: [0, 150, 300], near: 0.1, far: 1000 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[200, 200, 200]} intensity={1} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

        {/* Add Earth to the scene */}
        <Earth />

        {currentBeaconData && (
          <Beacon
            key={currentBeaconData.messageId}
            position={beaconPosition}
            rotation={[
              currentBeaconData.rotation.yaw,
              currentBeaconData.rotation.pitch,
              currentBeaconData.rotation.roll,
            ]}
            gyroscopicAcceleration={currentBeaconData.gyroscopicAcceleration}
            dataView={dataView}
            predictedRotation={predictedRotation}
          />
        )}
      </Canvas>
      </div>
    </>
  );
};

export default BeaconVisualization;
