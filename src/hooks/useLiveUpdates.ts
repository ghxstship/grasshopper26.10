/* eslint-disable */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { mutate } from 'swr';

export interface LiveUpdate<T = unknown> {
  type: 'create' | 'update' | 'delete';
  resource: string;
  data: T;
  timestamp: Date;
}

export interface UseLiveUpdatesOptions {
  resource: string;
  roomId?: string;
  onUpdate?: (update: LiveUpdate) => void;
  autoRevalidate?: boolean;
}

export function useLiveUpdates<T = unknown>(options: UseLiveUpdatesOptions) {
  const { resource, roomId, onUpdate, autoRevalidate = true } = options;
  const { isConnected, lastMessage, send } = useWebSocket('ws://localhost:3001');
  const [updates, setUpdates] = useState<LiveUpdate<T>[]>([]);
  const [lastUpdate, setLastUpdate] = useState<LiveUpdate<T> | null>(null);

  // Subscribe to updates
  useEffect(() => {
    if (!isConnected) return;

    // Join resource-specific room
    const resourceRoom = roomId || `${resource}-updates`;
    send({ type: 'join-room', payload: resourceRoom });

    return () => {
      send({ type: 'leave-room', payload: resourceRoom });
    };
  }, [isConnected, resource, roomId, send]);

  // Handle incoming messages
  useEffect(() => {
    if (!lastMessage) return;

    const { type, payload } = lastMessage;
    
    if (type === 'live-update' || type === `${resource}-update`) {
      const updatePayload = payload as { type: 'create' | 'update' | 'delete'; resource: string; data: T; timestamp: string };
      const update: LiveUpdate<T> = {
        type: updatePayload.type,
        resource: updatePayload.resource,
        data: updatePayload.data,
        timestamp: new Date(updatePayload.timestamp),
      };

      setUpdates(prev => [...prev, update]);
      setLastUpdate(update);

      if (onUpdate) {
        onUpdate(update);
      }

      if (autoRevalidate) {
        const cacheKey = `/api/${resource}`;
        mutate(cacheKey);
        
        if (update.type !== 'create' && (update.data as any)?.id) {
          mutate(`${cacheKey}/${(update.data as any).id}`);
        }
      }
    }
  }, [lastMessage, resource, onUpdate, autoRevalidate]);

  // Broadcast update to other clients
  const broadcastUpdate = useCallback((
    type: 'create' | 'update' | 'delete',
    data: T
  ) => {
    if (!isConnected) return;

    const update: LiveUpdate<T> = {
      type,
      resource,
      data,
      timestamp: new Date(),
    };

    send({
      type: 'live-update',
      payload: update,
    });
  }, [send, isConnected, resource]);

  // Clear updates history
  const clearUpdates = useCallback(() => {
    setUpdates([]);
    setLastUpdate(null);
  }, []);

  // Get updates by type
  const getUpdatesByType = useCallback((type: 'create' | 'update' | 'delete') => {
    return updates.filter(u => u.type === type);
  }, [updates]);

  return {
    updates,
    lastUpdate,
    broadcastUpdate,
    clearUpdates,
    getUpdatesByType,
  };
}
