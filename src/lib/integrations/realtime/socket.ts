/**
 * Socket.io real-time integration
 * Client-side only - for use in React components
 */

import { createSuccessResponse, createErrorResponse } from '../utils';
import type { IntegrationResponse } from '../types';

/**
 * Socket.io event types
 */
export type SocketEvent =
  | 'notification'
  | 'message'
  | 'event_update'
  | 'ticket_update'
  | 'order_update'
  | 'user_online'
  | 'user_offline'
  | 'typing'
  | 'location_update'
  | 'task_update'
  | 'project_update';

export interface SocketMessage {
  type: SocketEvent;
  data: unknown;
  timestamp: number;
  userId?: string;
}

/**
 * Initialize Socket.io connection (client-side only)
 * This should be called from a React component
 */
export async function initSocket(): Promise<IntegrationResponse<{ url: string }>> {
  try {
    if (typeof window === 'undefined') {
      return createErrorResponse(
        'SOCKET_NOT_BROWSER',
        'Socket.io can only be initialized in the browser'
      );
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;

    return createSuccessResponse({ url: socketUrl });
  } catch (error) {
    return createErrorResponse(
      'SOCKET_INIT_ERROR',
      error instanceof Error ? error.message : 'Failed to initialize Socket.io',
      error
    );
  }
}

/**
 * Socket.io connection options
 */
export const socketOptions = {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'],
  autoConnect: true,
};

/**
 * Create a typed socket event emitter
 */
export function createSocketEmitter<T>(event: SocketEvent) {
  return (data: T) => {
    const message: SocketMessage = {
      type: event,
      data,
      timestamp: Date.now(),
    };
    return message;
  };
}

/**
 * Socket event handlers type
 */
export interface SocketEventHandlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onNotification?: (data: unknown) => void;
  onMessage?: (data: unknown) => void;
  onEventUpdate?: (data: unknown) => void;
  onTicketUpdate?: (data: unknown) => void;
  onOrderUpdate?: (data: unknown) => void;
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (userId: string) => void;
  onTyping?: (userId: string) => void;
  onLocationUpdate?: (data: unknown) => void;
  onTaskUpdate?: (data: unknown) => void;
  onProjectUpdate?: (data: unknown) => void;
}

/**
 * Room management
 */
export interface RoomConfig {
  roomId: string;
  userId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Join a Socket.io room
 */
export function joinRoom(roomId: string, userId: string) {
  return {
    event: 'join_room',
    data: { roomId, userId },
  };
}

/**
 * Leave a Socket.io room
 */
export function leaveRoom(roomId: string, userId: string) {
  return {
    event: 'leave_room',
    data: { roomId, userId },
  };
}

/**
 * Broadcast to a room
 */
export function broadcastToRoom(roomId: string, event: SocketEvent, data: unknown) {
  return {
    event: 'broadcast',
    data: {
      roomId,
      event,
      payload: data,
    },
  };
}

/**
 * Send direct message to user
 */
export function sendDirectMessage(toUserId: string, message: unknown) {
  return {
    event: 'direct_message',
    data: {
      toUserId,
      message,
    },
  };
}

/**
 * Presence tracking
 */
export interface PresenceData {
  userId: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: number;
  metadata?: Record<string, unknown>;
}

export function updatePresence(presence: PresenceData) {
  return {
    event: 'update_presence',
    data: presence,
  };
}

/**
 * Typing indicators
 */
export function startTyping(roomId: string, userId: string) {
  return {
    event: 'typing_start',
    data: { roomId, userId },
  };
}

export function stopTyping(roomId: string, userId: string) {
  return {
    event: 'typing_stop',
    data: { roomId, userId },
  };
}

/**
 * Real-time notifications
 */
export interface NotificationPayload {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  userId: string;
  metadata?: Record<string, unknown>;
}

export function sendNotification(notification: NotificationPayload) {
  return {
    event: 'notification',
    data: notification,
  };
}
