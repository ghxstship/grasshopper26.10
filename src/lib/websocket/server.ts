/**
 * WebSocket Server for Real-time Features
 * Handles connections, rooms, and message broadcasting
 */

import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
  userId?: string;
}

export interface Room {
  id: string;
  members: Set<string>;
  metadata?: Record<string, any>;
}

class WebSocketServer {
  private io: SocketIOServer | null = null;
  private rooms: Map<string, Room> = new Map();
  private userSockets: Map<string, Set<string>> = new Map();

  /**
   * Initialize WebSocket server
   */
  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventHandlers();
    console.log('[WebSocket] Server initialized');
  }

  /**
   * Set up event handlers
   */
  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log(`[WebSocket] Client connected: ${socket.id}`);

      // Handle authentication
      socket.on('authenticate', (data: { userId: string; token: string }) => {
        this.handleAuthentication(socket, data);
      });

      // Handle room join
      socket.on('join-room', (roomId: string) => {
        this.handleJoinRoom(socket, roomId);
      });

      // Handle room leave
      socket.on('leave-room', (roomId: string) => {
        this.handleLeaveRoom(socket, roomId);
      });

      // Handle message broadcast
      socket.on('broadcast', (message: WebSocketMessage) => {
        this.handleBroadcast(socket, message);
      });

      // Handle direct message
      socket.on('direct-message', (data: { userId: string; message: WebSocketMessage }) => {
        this.handleDirectMessage(socket, data);
      });

      // Handle presence update
      socket.on('presence', (status: 'online' | 'away' | 'offline') => {
        this.handlePresenceUpdate(socket, status);
      });

      // Handle typing indicator
      socket.on('typing', (data: { roomId: string; isTyping: boolean }) => {
        this.handleTyping(socket, data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });

      // Handle heartbeat
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: Date.now() });
      });
    });
  }

  /**
   * Handle user authentication
   */
  private async handleAuthentication(socket: Socket, data: { userId: string; token: string }) {
    try {
      // Verify JWT token with NextAuth
      const { decode } = await import('next-auth/jwt');
      
      const decoded = await decode({
        token: data.token,
        secret: process.env.NEXTAUTH_SECRET!,
        salt: 'authjs.session-token',
      });

      if (!decoded || decoded.sub !== data.userId) {
        socket.emit('auth:error', { message: 'Invalid authentication token' });
        socket.disconnect();
        return;
      }

      // Token is valid - store user information
      (socket as any).userId = data.userId;
      (socket as any).authenticated = true;
      (socket as any).userRole = decoded.role;

      // Send authentication success
      socket.emit('auth:success', { 
        userId: data.userId,
        authenticated: true,
      });

      console.log(`User ${data.userId} authenticated via WebSocket`);
    } catch (error) {
      console.error('WebSocket authentication failed:', error);
      socket.emit('auth:error', { message: 'Authentication failed' });
      socket.disconnect();
    }

    // Track user socket
    if (!this.userSockets.has(data.userId)) {
      this.userSockets.set(data.userId, new Set());
    }
    this.userSockets.get(data.userId)!.add(socket.id);

    socket.emit('authenticated', { userId: data.userId });
    console.log(`[WebSocket] User authenticated: ${data.userId}`);
  }

  /**
   * Handle joining a room
   */
  private handleJoinRoom(socket: Socket, roomId: string) {
    socket.join(roomId);

    // Create room if it doesn't exist
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        id: roomId,
        members: new Set(),
      });
    }

    const room = this.rooms.get(roomId)!;
    const userId = (socket as any).userId;
    if (userId) {
      room.members.add(userId);
    }

    // Notify room members
    socket.to(roomId).emit('user-joined', {
      userId,
      socketId: socket.id,
      timestamp: new Date(),
    });

    socket.emit('room-joined', {
      roomId,
      members: Array.from(room.members),
    });

    console.log(`[WebSocket] User ${userId} joined room: ${roomId}`);
  }

  /**
   * Handle leaving a room
   */
  private handleLeaveRoom(socket: Socket, roomId: string) {
    socket.leave(roomId);

    const room = this.rooms.get(roomId);
    if (room) {
      const userId = (socket as any).userId;
      if (userId) {
        room.members.delete(userId);
      }

      // Notify room members
      socket.to(roomId).emit('user-left', {
        userId,
        socketId: socket.id,
        timestamp: new Date(),
      });

      // Clean up empty rooms
      if (room.members.size === 0) {
        this.rooms.delete(roomId);
      }
    }

    console.log(`[WebSocket] User left room: ${roomId}`);
  }

  /**
   * Handle message broadcast to room
   */
  private handleBroadcast(socket: Socket, message: WebSocketMessage) {
    const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);
    
    rooms.forEach(roomId => {
      socket.to(roomId).emit('message', {
        ...message,
        senderId: (socket as any).userId,
        socketId: socket.id,
        timestamp: new Date(),
      });
    });
  }

  /**
   * Handle direct message to specific user
   */
  private handleDirectMessage(socket: Socket, data: { userId: string; message: WebSocketMessage }) {
    const targetSockets = this.userSockets.get(data.userId);
    
    if (targetSockets) {
      targetSockets.forEach(socketId => {
        this.io?.to(socketId).emit('direct-message', {
          ...data.message,
          senderId: (socket as any).userId,
          timestamp: new Date(),
        });
      });
    }
  }

  /**
   * Handle presence update
   */
  private handlePresenceUpdate(socket: Socket, status: 'online' | 'away' | 'offline') {
    const userId = (socket as any).userId;
    
    if (userId) {
      // Broadcast presence to all rooms user is in
      const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);
      
      rooms.forEach(roomId => {
        socket.to(roomId).emit('presence-update', {
          userId,
          status,
          timestamp: new Date(),
        });
      });
    }
  }

  /**
   * Handle typing indicator
   */
  private handleTyping(socket: Socket, data: { roomId: string; isTyping: boolean }) {
    socket.to(data.roomId).emit('typing', {
      userId: (socket as any).userId,
      isTyping: data.isTyping,
      timestamp: new Date(),
    });
  }

  /**
   * Handle client disconnect
   */
  private handleDisconnect(socket: Socket) {
    const userId = (socket as any).userId;

    // Remove from user sockets
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    }

    // Remove from all rooms
    this.rooms.forEach((room, roomId) => {
      if (room.members.has(userId)) {
        room.members.delete(userId);
        
        // Notify room members
        socket.to(roomId).emit('user-left', {
          userId,
          socketId: socket.id,
          timestamp: new Date(),
        });

        // Clean up empty rooms
        if (room.members.size === 0) {
          this.rooms.delete(roomId);
        }
      }
    });

    console.log(`[WebSocket] Client disconnected: ${socket.id}`);
  }

  /**
   * Broadcast to all connected clients
   */
  broadcastToAll(event: string, data: any) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  /**
   * Broadcast to specific room
   */
  broadcastToRoom(roomId: string, event: string, data: any) {
    if (this.io) {
      this.io.to(roomId).emit(event, data);
    }
  }

  /**
   * Send to specific user
   */
  sendToUser(userId: string, event: string, data: any) {
    const sockets = this.userSockets.get(userId);
    if (sockets && this.io) {
      sockets.forEach(socketId => {
        this.io!.to(socketId).emit(event, data);
      });
    }
  }

  /**
   * Get room members
   */
  getRoomMembers(roomId: string): string[] {
    const room = this.rooms.get(roomId);
    return room ? Array.from(room.members) : [];
  }

  /**
   * Get online users
   */
  getOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}

// Export singleton instance
export const wsServer = new WebSocketServer();
