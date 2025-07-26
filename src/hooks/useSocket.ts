import {useEffect, useRef, useState} from 'react';
import io, {Socket} from 'socket.io-client';
import {SOCKET_SERVER_URL} from '../api/axiosInstance';
import {getData} from '../hooks/useAsyncStorage';
import {MsgDataType} from '../utils/typescriptInterfaces';

type UseSocketProps = {
  senderId: string;
  onMessageReceived: (msg: MsgDataType) => void;
  onError?: (msg: any) => void;
  onRegister?: (msg: any) => void;
};

const useSocket = ({
  senderId,
  onMessageReceived,
  onError,
  onRegister,
}: UseSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!senderId || initialized.current) return;

    const socketInstance = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      query: {userId: senderId},
    });

    setSocket(socketInstance);
    initialized.current = true;

    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketInstance.on('getMessage', (msg: MsgDataType) => {
      onMessageReceived(msg);
    });

    socketInstance.on('error', (msg: any) => {
      console.error('Socket error:', msg);
      onError?.(msg);
    });

    socketInstance.on('register', (msg: any) => {
      console.log('Socket registered:', msg);
      onRegister?.(msg);
    });

    const registerToken = async () => {
      const token = await getData('authToken');
      socketInstance.emit('register', senderId, token);
    };
    registerToken();

    return () => {
      socketInstance.disconnect();
      console.log('Socket disconnected');
    };
  }, [senderId]);

  return socket;
};

export default useSocket;
