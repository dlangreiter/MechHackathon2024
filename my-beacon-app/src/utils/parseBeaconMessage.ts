// src/utils/parseBeaconMessage.ts

export interface BeaconData {
  messageId: number;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  rotation: {
    yaw: number;
    pitch: number;
    roll: number;
  };
  gyroscopicAcceleration: {
    yaw: number;
    pitch: number;
    roll: number;
  };
}


export function parseBeaconMessages(data: string): BeaconData[] {
  const messages: BeaconData[] = [];

  // Regular expression to match individual messages
  const messageRegex = /Message\s\d+.*?@@\sRD\[.*?]IL/gms;
  const messageMatches = data.match(messageRegex);

  if (messageMatches) {
    for (const message of messageMatches) {
      try {
        const beaconData = parseSingleMessage(message);
        if (beaconData) {
          messages.push(beaconData);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    }
  } else {
    console.error('No messages found in data');
  }

  return messages;
}

function parseSingleMessage(message: string): BeaconData | null {
  // Helper function to extract value by key
  const extractValue = (key: string): string | null => {
    const regex = new RegExp(`${key}\\[([^\\]]*)\\]`);
    const match = message.match(regex);
    return match ? match[1] : null;
  };

  // Extract Message ID
  const messageIdMatch = message.match(/Message\s(\d+)/);
  const messageId = messageIdMatch ? parseInt(messageIdMatch[1], 10) : null;

  if (messageId === null) {
    console.error('Message ID not found');
    return null;
  }

  // Extract Location (L)
  const locationString = extractValue('L');
  if (!locationString) {
    console.error('Location data not found');
    return null;
  }
  const [latitudeStr, longitudeStr, altitudeStr] = locationString.split(',');

  // Parse location coordinates
  const latitude = parseFloat(latitudeStr);
  const longitude = parseFloat(longitudeStr);
  const altitude = parseFloat(altitudeStr);

  // Extract Rotation (R)
  const rotationString = extractValue('R');
  if (!rotationString) {
    console.error('Rotation data not found');
    return null;
  }
  const [yawStr, pitchStr, rollStr] = rotationString.split(',');

  const yaw = parseFloat(yawStr);
  const pitch = parseFloat(pitchStr);
  const roll = parseFloat(rollStr);

  // Extract Gyroscopic Acceleration (G)
  const gyroscopeString = extractValue('G');
  if (!gyroscopeString) {
    console.error('Gyroscopic acceleration data not found');
    return null;
  }
  const [gyroYawStr, gyroPitchStr, gyroRollStr] = gyroscopeString.split(',');

  const gyroYaw = parseFloat(gyroYawStr);
  const gyroPitch = parseFloat(gyroPitchStr);
  const gyroRoll = parseFloat(gyroRollStr);

  // Basic validation
  if (
    isNaN(latitude) ||
    isNaN(longitude) ||
    isNaN(altitude) ||
    isNaN(yaw) ||
    isNaN(pitch) ||
    isNaN(roll) ||
    isNaN(gyroYaw) ||
    isNaN(gyroPitch) ||
    isNaN(gyroRoll)
  ) {
    console.error('Invalid data values in message ID:', messageId);
    return null;
  }

  // Construct BeaconData object
  const beaconData: BeaconData = {
    messageId,
    location: {
      latitude,
      longitude,
      altitude,
    },
    rotation: {
      yaw,
      pitch,
      roll,
    },
    gyroscopicAcceleration: {
      yaw: gyroYaw,
      pitch: gyroPitch,
      roll: gyroRoll,
    },
  };

  return beaconData;
}
