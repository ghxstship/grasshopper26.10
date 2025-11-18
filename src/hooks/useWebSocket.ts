import { useEffect, useRef, useState, useCallback } from 'react';

export interface WebSocketMessage {
  type: string;
  payload: unknown;
}

export function useWebSocket(url?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const connectRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    connectRef.current = () => {
      if (!url) return;
      try {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
          setIsConnected(true);
          if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
          }
        };

        ws.current.onclose = () => {
          setIsConnected(false);
          reconnectTimeout.current = setTimeout(() => {
            connectRef.current?.();
          }, 3000);
        };

        ws.current.onerror = () => {
          setIsConnected(false);
        };

        ws.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            setLastMessage(message);
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err);
          }
        };
      } catch (err) {
        console.error('WebSocket connection error:', err);
      }
    };
  }, [url]);

  const connect = useCallback(() => {
    connectRef.current?.();
  }, []);

  const send = useCallback((message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    ws.current?.close();
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  // Create a getter function for socket to avoid accessing ref during render
  const getSocket = useCallback(() => ws.current, []);

  return {
    isConnected,
    lastMessage,
    send,
    disconnect,
    getSocket,
  };
}
