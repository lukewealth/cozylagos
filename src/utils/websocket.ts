type MessageHandler = (data: any) => void;
type ConnectionHandler = () => void;
type ErrorHandler = (error: Event) => void;

interface WebSocketOptions {
  url: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

class WebSocketManager {
  private ws: WebSocket | null = null;
  private options: Required<WebSocketOptions>;
  private reconnectAttempts = 0;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private disconnectionHandlers: Set<ConnectionHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isClosed = false;

  constructor(options: WebSocketOptions) {
    this.options = {
      reconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      ...options,
    };
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isClosed = false;

    try {
      this.ws = new WebSocket(this.options.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.connectionHandlers.forEach((handler) => handler());
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { type, payload } = data;

          if (type === 'pong') {
            return;
          }

          const handlers = this.messageHandlers.get(type);
          if (handlers) {
            handlers.forEach((handler) => handler(payload));
          }

          const allHandlers = this.messageHandlers.get('*');
          if (allHandlers) {
            allHandlers.forEach((handler) => handler(data));
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.stopHeartbeat();
        this.disconnectionHandlers.forEach((handler) => handler());

        if (!this.isClosed && this.options.reconnect) {
          this.attemptReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.errorHandlers.forEach((handler) => handler(error));
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      if (this.options.reconnect) {
        this.attemptReconnect();
      }
    }
  }

  disconnect() {
    this.isClosed = true;
    this.stopHeartbeat();
    this.clearReconnectTimer();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(type: string, payload?: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  onMessage(type: string, handler: MessageHandler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    this.messageHandlers.get(type)!.add(handler);

    return () => {
      this.messageHandlers.get(type)?.delete(handler);
    };
  }

  onConnection(handler: ConnectionHandler) {
    this.connectionHandlers.add(handler);
    return () => {
      this.connectionHandlers.delete(handler);
    };
  }

  onDisconnection(handler: ConnectionHandler) {
    this.disconnectionHandlers.add(handler);
    return () => {
      this.disconnectionHandlers.delete(handler);
    };
  }

  onError(handler: ErrorHandler) {
    this.errorHandlers.add(handler);
    return () => {
      this.errorHandlers.delete(handler);
    };
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.send('ping');
    }, this.options.heartbeatInterval);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.options.reconnectInterval * this.reconnectAttempts);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

let wsManager: WebSocketManager | null = null;

export function getWebSocketManager(url?: string) {
  if (!wsManager && url) {
    wsManager = new WebSocketManager({ url });
  }
  return wsManager;
}

export function createWebSocketManager(options: WebSocketOptions) {
  if (wsManager) {
    wsManager.disconnect();
  }
  wsManager = new WebSocketManager(options);
  return wsManager;
}

export { WebSocketManager };
