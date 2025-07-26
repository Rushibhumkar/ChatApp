import {useEffect, useRef, useState} from 'react';
import io, {Socket} from 'socket.io-client';
import {SOCKET_SERVER_URL} from '../api/axiosInstance';
import {getData} from '../hooks/useAsyncStorage';
import {MsgDataType} from '../utils/typescriptInterfaces';
import * as MessageService from '../services/MessageService';

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
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);
    initialized.current = true;

    socketInstance.on('connect', () => {
      console.log('✅ Connected to socket server');
    });

    socketInstance.on('disconnect', () => {
      console.warn('⚠️ Socket disconnected');
    });

    socketInstance.io.on('reconnect', async () => {
      console.log('🔁 Reconnected to socket');
      const token = await getData('authToken');
      socketInstance.emit('register', senderId, token);
    });

    // Incoming message from server
    socketInstance.on('getMessage', async (msg: MsgDataType) => {
      try {
        await MessageService.insertMessage(msg); // save to SQLite
        onMessageReceived(msg); // update UI
      } catch (err) {
        console.error('Failed to save received message to SQLite:', err);
      }
    });

    // Message delivered/inserted ack by server
    socketInstance.on('messageSentAck', async (messageId: string) => {
      try {
        await MessageService.updateMessageSyncStatus(messageId, true);
      } catch (err) {
        console.error('Failed to update message sync status:', err);
      }
    });

    // Handle socket error
    socketInstance.on('error', (msg: any) => {
      console.error('❌ Socket error:', msg);
      onError?.(msg);
    });

    // Handle register response
    socketInstance.on('register', (msg: any) => {
      console.log('📌 Socket registered:', msg);
      onRegister?.(msg);
    });

    // Register after initial connect
    const registerToken = async () => {
      const token = await getData('authToken');
      socketInstance.emit('register', senderId, token);
    };
    registerToken();

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      console.log('🛑 Socket disconnected');
    };
  }, [senderId]);

  return socket;
};

export default useSocket;
