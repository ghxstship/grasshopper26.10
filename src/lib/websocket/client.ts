/**
 * WebSocket Client for Real-time Features
 * Handles connection, reconnection, and message queuing
 */

export interface WebSocketClientConfig {
  url: string;
  autoConnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: Date;
}

type EventHandler = (data: unknown) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketClientConfig>;
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private messageQueue: WebSocketMessage[] = [];
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private isAuthenticated = false;

  constructor(config: WebSocketClientConfig) {
    this.config = {
      url: config.url,
      autoConnect: config.autoConnect ?? true,
      reconnectDelay: config.reconnectDelay ?? 3000,
      maxReconnectAttempts: config.maxReconnectAttempts ?? 5,
      heartbeatInterval: config.heartbeatInterval ?? 30000,
    };

    if (this.config.autoConnect) {
      this.connect();
    }
  }

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;

      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          console.log('[WebSocket] Connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.flushMessageQueue();
          this.emit('connected', {});
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.ws.onerror = (error) => {
          console.error('[WebSocket] Error:', error);
          this.emit('error', error);
        };

        this.ws.onclose = () => {
          console.log('[WebSocket] Disconnected');
          this.isConnecting = false;
          this.isAuthenticated = false;
          this.stopHeartbeat();
          this.emit('disconnected', {});
          this.attemptReconnect();
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isAuthenticated = false;
  }

  /**
   * Authenticate with server
   */
  authenticate(userId: string, token: string) {
    this.send('authenticate', { userId, token });
  }

  /**
   * Join a room
   */
  joinRoom(roomId: string) {
    this.send('join-room', roomId);
  }

  /**
   * Leave a room
   */
  leaveRoom(roomId: string) {
    this.send('leave-room', roomId);
  }

  /**
   * Broadcast message to room
   */
  broadcast(message: WebSocketMessage) {
    this.send('broadcast', message);
  }

  /**
   * Send direct message to user
   */
  sendDirectMessage(userId: string, message: WebSocketMessage) {
    this.send('direct-message', { userId, message });
  }

  /**
   * Update presence status
   */
  updatePresence(status: 'online' | 'away' | 'offline') {
    this.send('presence', status);
  }

  /**
   * Send typing indicator
   */
  sendTyping(roomId: string, isTyping: boolean) {
    this.send('typing', { roomId, isTyping });
  }

  /**
   * Send message to server
   */
  private send(event: string, data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }));
    } else {
      // Queue message for later
      this.messageQueue.push({
        type: event,
        payload: data,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Handle incoming message
   */
  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      
      if (data.event) {
        this.emit(data.event, data.data);
      }

      // Handle special events
      if (data.event === 'authenticated') {
        this.isAuthenticated = true;
      } else if (data.event === 'pong') {
        // Heartbeat response received
      }
    } catch (error) {
      console.error('[WebSocket] Failed to parse message:', error);
    }
  }

  /**
   * Emit event to handlers
   */
  private emit(event: string, data: unknown) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`[WebSocket] Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Register event handler
   */
  on(event: string, handler: EventHandler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  /**
   * Unregister event handler
   */
  off(event: string, handler: EventHandler) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnect attempts reached');
      this.emit('reconnect-failed', {});
      return;
    }

    this.reconnectAttempts++;
    console.log(`[WebSocket] Reconnecting... (attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(error => {
        console.error('[WebSocket] Reconnect failed:', error);
      });
    }, this.config.reconnectDelay);
  }

  /**
   * Start heartbeat
   */
  private startHeartbeat() {
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping', {});
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Flush queued messages
   */
  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message.type, message.payload);
      }
    }
  }

  /**
   * Get connection state
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get authentication state
   */
  get authenticated(): boolean {
    return this.isAuthenticated;
  }
}

/**
 * Create WebSocket client instance
 */
export function createWebSocketClient(config: WebSocketClientConfig): WebSocketClient {
  return new WebSocketClient(config);
}
