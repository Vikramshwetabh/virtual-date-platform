import { useEffect, useRef } from 'react';
import { socketClient } from './socket';
import { useAuthStore } from './auth-store';

export function useSocket() {
  const { isAuthenticated } = useAuthStore();
  const isConnected = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !isConnected.current) {
      socketClient.connect();
      isConnected.current = true;
    }

    return () => {
      if (isConnected.current) {
        socketClient.disconnect();
        isConnected.current = false;
      }
    };
  }, [isAuthenticated]);

  return { socket: socketClient };
}