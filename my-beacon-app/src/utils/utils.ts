// utils.ts

let messageIndex = 0;
const messages = [
  // Array of your raw message strings
  'Message 23435V[1.3]B[0003266717]D[0000-00-00T00:00:00]L[0.000,0.000,600.0]I[1]R[314.953583,-11.333508,6.500096]A[-0.264000,-0.042000,0.959000]G[-10.465000,-83.466003,15.338000]IR[0,0000000000]E[TFF] @@ RD[0000-01-01T00:53:38]IL___',
  // Add more messages as needed
];

export function getNextBeaconMessage(): string {
  const message = messages[messageIndex];
  messageIndex = (messageIndex + 1) % messages.length;
  return message;
}
