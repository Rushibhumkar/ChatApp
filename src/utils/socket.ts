// src/utils/socket.ts
import {io, Socket} from 'socket.io-client';
import {SOCKET_SERVER_URL} from '../api/axiosInstance';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      autoConnect: false,
    });
  }
  return socket;
};
