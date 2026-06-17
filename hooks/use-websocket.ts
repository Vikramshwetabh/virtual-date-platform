"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface WebSocketMessage {
  type: string;
  roomId?: string;
  userId?: string;
  payload?: any;
  timestamp?: string;
}

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://virtual-date-api.onrender.com/api/v1/ws";

export function useWebSocket(roomId?: string) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;

    let token: string | null = null;
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        token = JSON.parse(authStorage).state.token;
      }
    } catch (e) {
      console.error("Failed to parse auth token", e);
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("userId");
    }
    if (!token) return;

    const url = new URL(WS_BASE_URL);
    url.searchParams.append("token", token);
    if (roomId) {
      url.searchParams.append("roomId", roomId);
    }

    const ws = new WebSocket(url.toString());
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      reconnectAttemptsRef.current = 0; // Reset attempts on successful connection
    };

    ws.onclose = () => {
      setConnected(false);
      
      // Exponential Backoff Reconnect: 1s, 2s, 4s, 8s, 16s max
      const attempt = reconnectAttemptsRef.current;
      const maxBackoff = 16000;
      const backoff = Math.min(1000 * Math.pow(2, attempt), maxBackoff);
      reconnectAttemptsRef.current += 1;
      
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, backoff);
    };

    ws.onmessage = (event) => {
      try {
        const msg: WebSocketMessage = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", event.data);
      }
    };
  }, [roomId]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent reconnect on explicit unmount
        wsRef.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((type: string, payload: any = {}) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, roomId, payload }));
    }
  }, [roomId]);

  return { connected, messages, send };
}