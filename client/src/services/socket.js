import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,   // Send cookies with requests (including WS handshake)
  transports: ['websocket', 'polling'],  // Ensure transport includes websocket
  autoConnect: false,      // Connect explicitly when ready
});

export default socket;
