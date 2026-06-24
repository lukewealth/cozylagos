import { useEffect, useState, useCallback, useRef } from 'react';
import { getWebSocketManager, createWebSocketManager } from '../utils/websocket';

interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { url, autoConnect = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const managerRef = useRef(getWebSocketManager(url));

  useEffect(() => {
    if (url && !managerRef.current) {
      managerRef.current = createWebSocketManager({ url });
    }

    const manager = managerRef.current;
    if (!manager) return;

    if (autoConnect && !manager.isConnected) {
      manager.connect();
    }

    const unsubscribeConnection = manager.onConnection(() => {
      setIsConnected(true);
    });

    const unsubscribeDisconnection = manager.onDisconnection(() => {
      setIsConnected(false);
    });

    return () => {
      unsubscribeConnection();
      unsubscribeDisconnection();
    };
  }, [url, autoConnect]);

  const send = useCallback((type: string, payload?: any) => {
    managerRef.current?.send(type, payload);
  }, []);

  const onMessage = useCallback((type: string, handler: (data: any) => void) => {
    return managerRef.current?.onMessage(type, handler);
  }, []);

  const connect = useCallback(() => {
    managerRef.current?.connect();
  }, []);

  const disconnect = useCallback(() => {
    managerRef.current?.disconnect();
  }, []);

  return {
    isConnected,
    send,
    onMessage,
    connect,
    disconnect,
    manager: managerRef.current,
  };
}

export function useRealtimeListings() {
  const [listings, setListings] = useState<any[]>([]);
  const { onMessage, isConnected } = useWebSocket();

  useEffect(() => {
    const unsubscribe = onMessage('listings:update', (data) => {
      setListings(data);
    });

    return () => {
      unsubscribe?.();
    };
  }, [onMessage]);

  return { listings, isConnected };
}

export function useRealtimeBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const { onMessage, isConnected } = useWebSocket();

  useEffect(() => {
    const unsubscribe = onMessage('bookings:update', (data) => {
      setBookings(data);
    });

    return () => {
      unsubscribe?.();
    };
  }, [onMessage]);

  return { bookings, isConnected };
}

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { onMessage, isConnected } = useWebSocket();

  useEffect(() => {
    const unsubscribe = onMessage('notifications:new', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      unsubscribe?.();
    };
  }, [onMessage]);

  return { notifications, isConnected };
}
