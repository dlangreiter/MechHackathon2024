// src/utils/parseBeaconMessage.test.ts

import { parseBeaconMessages, BeaconData } from './parseBeaconMessage';

describe('parseBeaconMessages', () => {
  const sampleData = `
Message 23435V[1.3]B[0003266717]D[0000-00-00T00:00:00]L[0.000,0.000,600.0]I[1]R[314.953583,-11.333508,6.500096]A[-0.264000,-0.042000,0.959000]G[-10.465000,-83.466003,15.338000]IR[0,0000000000]E[TFF] @@ RD[0000-01-01T00:53:38]IL
Message 23436V[1.3]B[0003266884]D[0000-00-00T00:00:00]L[0.021,-0.00,600.0]I[1]R[312.371307,-7.195503,19.413263]A[-0.530000,0.042000,0.841000]G[-22.548000,-74.129997,7.061000]IR[0,0000000000]E[TFF] @@ RD[0000-01-01T00:53:38]IL
Message 23437V[1.3]B[0003267030]D[0000-00-00T00:00:00]L[0.042,-0.01,600.0]I[1]R[308.536713,-13.799095,11.834105]A[-0.637000,0.054000,0.787000]G[-46.838001,-57.924999,9.003000]IR[0,0000000000]E[TFF] @@ RD[0000-01-01T00:53:39]IL
`;

  it('parses multiple messages correctly', () => {
    const results = parseBeaconMessages(sampleData);
    expect(results.length).toBe(3);

    expect(results[0]).toEqual<BeaconData>({
      messageId: 23435,
      location: {
        latitude: 0.0,
        longitude: 0.0,
        altitude: 600.0,
      },
      rotation: {
        yaw: 314.953583,
        pitch: -11.333508,
        roll: 6.500096,
      },
      gyroscopicAcceleration: {
        yaw: -10.465000,
        pitch: -83.466003,
        roll: 15.338000,
      },
    });

    // Additional assertions can be added for other messages
  });
});
