import React, {createContext, useContext, useEffect} from 'react';
import {getSocket} from '../utils/socket';
import {Socket} from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

interface Props {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({children}) => {
  const socket = getSocket();

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('connect_error', err => {
      console.log('❌ Socket connection error:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
