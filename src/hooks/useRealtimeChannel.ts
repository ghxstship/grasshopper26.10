/* eslint-disable */
/**
 * React hook for Supabase Realtime channels
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getRealtimeManager, type PresenceState, type ChannelOptions,  } from '@/lib/realtime/supabase';

export interface UseRealtimeChannelOptions extends Omit<ChannelOptions, 'channelName'> {
  enabled?: boolean;
}

export function useRealtimeChannel(channelName: string, options: UseRealtimeChannelOptions = {}) {
  const { enabled = true, onPresenceSync, onPresenceJoin, onPresenceLeave, onBroadcast, onError } = options;
  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [presenceState, setPresenceState] = useState<Record<string, PresenceState[]>>({});
  const [error, setError] = useState<Error | null>(null);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const managerRef = useRef(getRealtimeManager());

  // Subscribe to channel
  useEffect(() => {
    if (!enabled) return;

    const manager = managerRef.current;

    try {
      const channel = manager.subscribeToChannel({
        channelName,
        onPresenceSync: (state) => {
          setPresenceState(state);
          if (onPresenceSync) {
            onPresenceSync(state);
          }
        },
        onPresenceJoin: (key, state) => {
          if (onPresenceJoin) {
            onPresenceJoin(key, state);
          }
        },
        onPresenceLeave: (key, state) => {
          if (onPresenceLeave) {
            onPresenceLeave(key, state);
          }
        },
        onBroadcast: (message) => {
          if (onBroadcast) {
            onBroadcast(message);
          }
        },
        onError: (err) => {
          setError(err);
          if (onError) {
            onError(err);
          }
        },
      });

      channelRef.current = channel;
      setIsSubscribed(true);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to subscribe to channel');
      setError(error);
      if (onError) {
        onError(error);
      }
    }

    return () => {
      if (channelRef.current) {
        manager.unsubscribe(channelName);
        channelRef.current = null;
        setIsSubscribed(false);
      }
    };
  }, [channelName, enabled, onPresenceSync, onPresenceJoin, onPresenceLeave, onBroadcast, onError]);

  // Track presence
  const trackPresence = useCallback(async (state: PresenceState) => {
    if (!channelRef.current) {
      throw new Error('Channel not subscribed');
    }

    try {
      await managerRef.current.trackPresence(channelName, state);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to track presence');
      setError(error);
      throw error;
    }
  }, [channelName]);

  // Untrack presence
  const untrackPresence = useCallback(async () => {
    if (!channelRef.current) {
      throw new Error('Channel not subscribed');
    }

    try {
      await managerRef.current.untrackPresence(channelName);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to untrack presence');
      setError(error);
      throw error;
    }
  }, [channelName]);

  // Broadcast message
  const broadcast = useCallback(async <T = Record<string, unknown>>(event: string, payload: T) => {
    if (!channelRef.current) {
      throw new Error('Channel not subscribed');
    }

    try {
      await managerRef.current.broadcast(channelName, event, payload);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to broadcast message');
      setError(error);
      throw error;
    }
  }, [channelName]);

  // Get channel (safe for render)
  const getChannel = useCallback(() => channelRef.current, []);

  return {
    isSubscribed,
    presenceState,
    error,
    trackPresence,
    untrackPresence,
    broadcast,
    getChannel,
  };
}
