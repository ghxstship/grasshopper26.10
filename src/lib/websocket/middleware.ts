/**
 * WebSocket Middleware
 * Authentication and authorization middleware for WebSocket connections
 */

import { Socket } from 'socket.io';
import { decode } from 'next-auth/jwt';

/**
 * Authenticate WebSocket connection
 */
export async function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    // Verify JWT token
    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
      salt: 'authjs.session-token',
    });

    if (!decoded) {
      return next(new Error('Invalid authentication token'));
    }

    // Attach user information to socket
    (socket as any).userId = decoded.sub;
    (socket as any).userEmail = decoded.email;
    (socket as any).userRole = decoded.role;
    (socket as any).authenticated = true;

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication failed'));
  }
}

/**
 * Require authentication for socket event
 */
export function requireAuth(socket: Socket): boolean {
  if (!(socket as any).authenticated) {
    socket.emit('error', { message: 'Authentication required' });
    return false;
  }
  return true;
}

/**
 * Check if socket user has required role
 */
export function requireRole(socket: Socket, roles: string[]): boolean {
  if (!requireAuth(socket)) {
    return false;
  }

  const userRole = (socket as any).userRole;
  
  if (!roles.includes(userRole)) {
    socket.emit('error', { message: 'Insufficient permissions' });
    return false;
  }

  return true;
}

/**
 * Rate limiting for socket events
 */
export class SocketRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  /**
   * Check if request is allowed
   */
  check(socketId: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(socketId) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(socketId, validRequests);

    return true;
  }

  /**
   * Clear requests for a socket
   */
  clear(socketId: string) {
    this.requests.delete(socketId);
  }
}

/**
 * Apply rate limiting to socket
 */
export function rateLimit(limiter: SocketRateLimiter) {
  return (socket: Socket, next: (err?: Error) => void) => {
    if (!limiter.check(socket.id)) {
      return next(new Error('Rate limit exceeded'));
    }
    next();
  };
}
