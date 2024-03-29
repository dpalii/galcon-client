import { createContext } from 'react';
import { io } from 'socket.io-client';

const URL = 'http://localhost:3000';

export const socket = io(URL, {
  autoConnect: true,
});

export const SocketContext = createContext(socket);
