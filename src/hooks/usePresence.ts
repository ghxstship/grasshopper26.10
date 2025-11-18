/* eslint-disable */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';

export interface PresenceStatus {
  userId: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
}

export interface UsePresenceOptions {
  roomId?: string;
  autoUpdate?: boolean;
  updateInterval?: number;
}

export function usePresence(options: UsePresenceOptions = {}) {
  const { roomId, autoUpdate = true, updateInterval = 60000 } = options;
  const { isConnected, send, lastMessage } = useWebSocket('ws://localhost:3001');
  const [presenceMap, setPresenceMap] = useState<Map<string, PresenceStatus>>(new Map());
  const [myStatus, setMyStatus] = useState<'online' | 'away' | 'offline'>('online');

  // Update presence status
  const updatePresence = useCallback((status: 'online' | 'away' | 'offline') => {
    if (isConnected) {
      send({ type: 'presence', payload: status });
      setMyStatus(status);
    }
  }, [send, isConnected]);

  // Handle incoming messages
  useEffect(() => {
    if (!lastMessage) return;

    const { type, payload } = lastMessage;

    switch (type) {
      case 'presence-update':
        setPresenceMap(prev => {
          const updated = new Map(prev);
          const presencePayload = payload as { userId: string; status: 'online' | 'away' | 'offline'; lastSeen?: string };
          updated.set(presencePayload.userId, {
            ...presencePayload,
            lastSeen: presencePayload.lastSeen ? new Date(presencePayload.lastSeen) : undefined,
          });
          return updated;
        });
        break;

      case 'user-joined':
        setPresenceMap(prev => {
          const updated = new Map(prev);
          const joinPayload = payload as { userId: string };
          updated.set(joinPayload.userId, {
            userId: joinPayload.userId,
            status: 'online',
          });
          return updated;
        });
        break;

      case 'user-left':
        setPresenceMap(prev => {
          const updated = new Map(prev);
          const leftPayload = payload as { userId: string };
          const user = updated.get(leftPayload.userId);
          if (user) {
            updated.set(leftPayload.userId, {
              ...user,
              status: 'offline',
              lastSeen: new Date(),
            });
          }
          return updated;
        });
        break;
    }
  }, [lastMessage]);

  // Auto-update presence based on user activity
  useEffect(() => {
    if (!autoUpdate || !isConnected) return;

    let activityTimer: NodeJS.Timeout | undefined;
    let awayTimer: NodeJS.Timeout;

    const resetTimers = () => {
      clearTimeout(activityTimer);
      clearTimeout(awayTimer);

      // Set to away after 5 minutes of inactivity
      awayTimer = setTimeout(() => {
        updatePresence('away');
      }, 5 * 60 * 1000);
    };

    const handleActivity = () => {
      if (myStatus !== 'online') {
        updatePresence('online');
      }
      resetTimers();
    };

    // Listen for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    resetTimers();

    return () => {
      clearTimeout(activityTimer);
      clearTimeout(awayTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [autoUpdate, isConnected, myStatus, updatePresence]);

  // Join room on mount
  useEffect(() => {
    if (roomId && isConnected) {
      send({ type: 'join-room', payload: roomId });
      updatePresence('online');

      return () => {
        send({ type: 'leave-room', payload: roomId });
      };
    }
  }, [roomId, isConnected, updatePresence, send]);

  // Get presence for specific user
  const getUserPresence = useCallback((userId: string): PresenceStatus | undefined => {
    return presenceMap.get(userId);
  }, [presenceMap]);

  // Get all online users
  const getOnlineUsers = useCallback((): PresenceStatus[] => {
    return Array.from(presenceMap.values()).filter(p => p.status === 'online');
  }, [presenceMap]);

  // Check if user is online
  const isUserOnline = useCallback((userId: string): boolean => {
    const presence = presenceMap.get(userId);
    return presence?.status === 'online';
  }, [presenceMap]);

  return {
    presenceMap,
    myStatus,
    updatePresence,
    getUserPresence,
    getOnlineUsers,
    isUserOnline,
  };
}
