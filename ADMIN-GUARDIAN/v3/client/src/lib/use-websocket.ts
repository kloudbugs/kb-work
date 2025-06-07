import { useCallback, useEffect, useRef, useState } from 'react';

export type WebSocketMessage = {
  type: string;
  payload: any;
};

export function useWebSocket(
  onMessage: (message: WebSocketMessage) => void,
  onConnected?: () => void,
  onDisconnected?: () => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }
    
    try {
      // Determine WebSocket protocol based on current window protocol
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      socket.onopen = () => {
        setIsConnected(true);
        if (onConnected) onConnected();
      };
      
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      socket.onclose = () => {
        setIsConnected(false);
        if (onDisconnected) onDisconnected();
        // Attempt to reconnect after a delay
        setTimeout(() => connect(), 5000);
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        socket.close();
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }, [onConnected, onDisconnected, onMessage]);
  
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);
  
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message, WebSocket is not connected');
    }
  }, []);
  
  // Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  
  return { isConnected, connect, disconnect, sendMessage };
}
