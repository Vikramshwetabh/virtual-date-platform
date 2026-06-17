import { useAuthStore } from '@/store/auth-store';

type EventHandler = (data: any) => void;

export class SocketClient {
  private socket: WebSocket | null = null;
  private url: string;
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  constructor() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://virtual-date-api.onrender.com';
    this.url = apiBase.replace(/^http/, 'ws') + '/api/v1/ws';
  }

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) return;
    
    const token = useAuthStore.getState().token;
    if (!token) return;

    this.isConnecting = true;
    const wsUrl = `${this.url}?token=${token}`;
    
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.emit(message.type, message.payload);
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    this.socket.onclose = () => {
      this.isConnecting = false;
      this.socket = null;
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, 1000 * Math.pow(2, this.reconnectAttempts));
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error', error);
      this.socket?.close();
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  on(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler) {
    if (this.handlers.has(event)) {
      this.handlers.get(event)!.delete(handler);
    }
  }

  private emit(event: string, data: any) {
    if (this.handlers.has(event)) {
      this.handlers.get(event)!.forEach((handler) => handler(data));
    }
  }

  send(type: string, payload: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('Cannot send message, WebSocket is not open');
    }
  }
}

export const socketClient = new SocketClient();