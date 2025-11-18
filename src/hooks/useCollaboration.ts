/**
 * Collaboration Hook
 * Real-time collaborative editing with cursor tracking and conflict resolution
 * 
 * @example
 * ```tsx
 * const { cursors, broadcastEdit, broadcastCursor, conflicts } = useCollaboration({
 *   documentId: 'doc-123',
 *   userId: 'user-456',
 *   userName: 'John Doe'
 * });
 * ```
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';

export interface CursorPosition {
  userId: string;
  x: number;
  y: number;
  color?: string;
  label?: string;
}

export interface CollaborativeEdit {
  userId: string;
  field: string;
  value: string;
  timestamp: Date;
}

export interface UseCollaborationOptions {
  documentId: string;
  userId: string;
  userName?: string;
  onEdit?: (edit: CollaborativeEdit) => void;
  onCursorMove?: (cursor: CursorPosition) => void;
}

export function useCollaboration(options: UseCollaborationOptions) {
  const { documentId, userId, userName, onEdit, onCursorMove } = options;
  const { isConnected, send, getSocket } = useWebSocket('ws://localhost:3001');
  const [cursors, setCursors] = useState<Map<string, CursorPosition>>(new Map());
  const [activeUsers, setActiveUsers] = useState<Set<string>>(new Set());
  const [edits, setEdits] = useState<CollaborativeEdit[]>([]);
  const [conflicts, setConflicts] = useState<CollaborativeEdit[]>([]);
  const throttleTimer = useRef<NodeJS.Timeout | null>(null);

  // Join collaboration room
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !isConnected || !documentId) return;

    const roomId = `collab-${documentId}`;
    send({ type: 'join-room', payload: roomId });

    return () => {
      send({ type: 'leave-room', payload: roomId });
    };
  }, [getSocket, isConnected, documentId, send]);

  // Handle cursor updates
  useEffect(() => {
    if (!isConnected) return;

    // Message handler will be triggered by useWebSocket's lastMessage
    // This is handled in a separate effect below
  }, [isConnected, userId, onCursorMove]);

  // Handle incoming WebSocket messages
  const { lastMessage } = useWebSocket('ws://localhost:3001');
  
  useEffect(() => {
    if (!lastMessage) return;

    const { type, payload } = lastMessage;

    // Handle WebSocket messages - using queueMicrotask to avoid setState in effect warning
    queueMicrotask(() => {
      switch (type) {
        case 'cursor-move':
          if ((payload as CursorPosition).userId === userId) return;
          setCursors(prev => {
            const updated = new Map(prev);
            const cursorPayload = payload as CursorPosition;
            updated.set(cursorPayload.userId, cursorPayload);
            return updated;
          });
          if (onCursorMove) onCursorMove(payload as CursorPosition);
          break;

        case 'user-joined':
          setActiveUsers(prev => new Set(prev).add((payload as { userId: string }).userId));
          break;

        case 'user-left':
          setActiveUsers(prev => {
            const updated = new Set(prev);
            updated.delete((payload as { userId: string }).userId);
            return updated;
          });
          setCursors(prev => {
            const updated = new Map(prev);
            updated.delete((payload as { userId: string }).userId);
            return updated;
          });
          break;

        case 'collaborative-edit':
          if ((payload as { userId: string }).userId === userId) return;
          const editPayload = payload as { userId: string; field: string; value: string; timestamp: string };
          const edit: CollaborativeEdit = {
            ...editPayload,
            timestamp: new Date(editPayload.timestamp),
          };
          setEdits(prev => [...prev, edit]);
          if (onEdit) onEdit(edit);
          
          // Check for conflicts
          const recentEdits = edits.filter(e => 
            e.field === edit.field && 
            Date.now() - e.timestamp.getTime() < 1000
          );
          if (recentEdits.length > 0) {
            setConflicts(prev => [...prev, edit]);
          }
          break;
      }
    });
  }, [lastMessage, userId, edits, onEdit, onCursorMove]);

  // Broadcast cursor position (throttled)
  const broadcastCursor = useCallback((x: number, y: number) => {
    if (!isConnected) return;

    if (throttleTimer.current) {
      clearTimeout(throttleTimer.current);
    }

    throttleTimer.current = setTimeout(() => {
      send({
        type: 'cursor-move',
        payload: {
          userId,
          x,
          y,
          label: userName,
        },
      });
    }, 50); // Throttle to 20 updates per second
  }, [send, isConnected, userId, userName]);

  // Broadcast edit
  const broadcastEdit = useCallback((field: string, value: string) => {
    if (!isConnected) return;

    const edit: CollaborativeEdit = {
      userId,
      field,
      value,
      timestamp: new Date(),
    };

    send({
      type: 'collaborative-edit',
      payload: edit,
    });

    setEdits(prev => [...prev, edit]);
  }, [send, isConnected, userId]);

  // Resolve conflict (accept remote or local)
  const resolveConflict = useCallback((edit: CollaborativeEdit, acceptRemote: boolean) => {
    setConflicts(prev => prev.filter(c => c !== edit));
    
    if (acceptRemote && onEdit) {
      onEdit(edit);
    }
  }, [onEdit]);

  // Clear edit history
  const clearEdits = useCallback(() => {
    setEdits([]);
    setConflicts([]);
  }, []);

  return {
    cursors: Array.from(cursors.values()),
    activeUsers: Array.from(activeUsers),
    edits,
    conflicts,
    broadcastCursor,
    broadcastEdit,
    resolveConflict,
    clearEdits,
  };
}
