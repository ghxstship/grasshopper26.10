/**
 * Supabase Realtime integration
 * Provides database change subscriptions, presence, and broadcast channels
 */

import { createClient, RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Get Supabase client for realtime
 */
function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    supabaseClient = createClient<Database>(supabaseUrl, supabaseKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  return supabaseClient;
}

/**
 * Database change event types
 */
export type DatabaseChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export interface DatabaseChangePayload<T = Record<string, unknown>> {
  eventType: DatabaseChangeEvent;
  new: T | null;
  old: T | null;
  schema: string;
  table: string;
  commit_timestamp: string;
}

/**
 * Presence state
 */
export interface PresenceState {
  userId: string;
  username?: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: string;
  metadata?: Record<string, unknown>;
}

/**
 * Broadcast message
 */
export interface BroadcastMessage<T = Record<string, unknown>> {
  type: string;
  payload: T;
  senderId?: string;
  timestamp: string;
}

/**
 * Channel subscription options
 */
export interface ChannelOptions {
  channelName: string;
  onPresenceSync?: (state: Record<string, PresenceState[]>) => void;
  onPresenceJoin?: (key: string, state: PresenceState) => void;
  onPresenceLeave?: (key: string, state: PresenceState) => void;
  onBroadcast?: (message: BroadcastMessage) => void;
  onError?: (error: Error) => void;
}

/**
 * Database subscription options
 */
export interface DatabaseSubscriptionOptions<T = Record<string, unknown>> {
  schema: string;
  table: string;
  event: DatabaseChangeEvent;
  filter?: string;
  onInsert?: (payload: DatabaseChangePayload<T>) => void;
  onUpdate?: (payload: DatabaseChangePayload<T>) => void;
  onDelete?: (payload: DatabaseChangePayload<T>) => void;
  onChange?: (payload: DatabaseChangePayload<T>) => void;
  onError?: (error: Error) => void;
}

/**
 * Realtime Channel Manager
 */
export class RealtimeChannelManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private supabase = getSupabaseClient();

  /**
   * Subscribe to a channel with presence and broadcast
   */
  subscribeToChannel(options: ChannelOptions): RealtimeChannel {
    const { channelName, onPresenceSync, onPresenceJoin, onPresenceLeave, onBroadcast, onError } = options;

    // Check if channel already exists
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!;
    }

    // Create channel
    const channel = this.supabase.channel(channelName);

    // Setup presence tracking
    if (onPresenceSync || onPresenceJoin || onPresenceLeave) {
      channel.on('presence', { event: 'sync' }, () => {
        if (onPresenceSync) {
          const state = channel.presenceState<PresenceState>();
          onPresenceSync(state);
        }
      });

      channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (onPresenceJoin && newPresences.length > 0) {
          onPresenceJoin(key, newPresences[0] as unknown as PresenceState);
        }
      });

      channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        if (onPresenceLeave && leftPresences.length > 0) {
          onPresenceLeave(key, leftPresences[0] as unknown as PresenceState);
        }
      });
    }

    // Setup broadcast listening
    if (onBroadcast) {
      channel.on('broadcast', { event: '*' }, ({ event, payload }) => {
        onBroadcast({
          type: event,
          payload,
          timestamp: new Date().toISOString(),
        });
      });
    }

    // Subscribe to channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`[Realtime] Subscribed to channel: ${channelName}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`[Realtime] Channel error: ${channelName}`);
        if (onError) {
          onError(new Error(`Channel subscription failed: ${channelName}`));
        }
      } else if (status === 'TIMED_OUT') {
        console.error(`[Realtime] Channel timeout: ${channelName}`);
        if (onError) {
          onError(new Error(`Channel subscription timed out: ${channelName}`));
        }
      }
    });

    this.channels.set(channelName, channel);
    return channel;
  }

  /**
   * Subscribe to database changes
   */
  subscribeToDatabaseChanges<T = any>(options: DatabaseSubscriptionOptions<T>): RealtimeChannel {
    const { schema, table, event, filter, onInsert, onUpdate, onDelete, onChange, onError } = options;

    const channelName = `db:${schema}:${table}:${event}${filter ? `:${filter}` : ''}`;

    // Check if channel already exists
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!;
    }

    // Create channel
    const channel = this.supabase.channel(channelName);

    // Setup database change listeners
    const postgresChanges: Record<string, unknown> = {
      event,
      schema,
      table,
    };

    if (filter) {
      postgresChanges.filter = filter;
    }

    channel.on('postgres_changes' as const, postgresChanges as any, (payload: RealtimePostgresChangesPayload<T>) => {
      const changePayload: DatabaseChangePayload<T> = {
        eventType: payload.eventType as DatabaseChangeEvent,
        new: payload.new as T | null,
        old: payload.old as T | null,
        schema: payload.schema,
        table: payload.table,
        commit_timestamp: payload.commit_timestamp,
      };

      // Call specific handlers
      if (payload.eventType === 'INSERT' && onInsert) {
        onInsert(changePayload);
      } else if (payload.eventType === 'UPDATE' && onUpdate) {
        onUpdate(changePayload);
      } else if (payload.eventType === 'DELETE' && onDelete) {
        onDelete(changePayload);
      }

      // Call general handler
      if (onChange) {
        onChange(changePayload);
      }
    });

    // Subscribe to channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`[Realtime] Subscribed to database changes: ${channelName}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`[Realtime] Database subscription error: ${channelName}`);
        if (onError) {
          onError(new Error(`Database subscription failed: ${channelName}`));
        }
      }
    });

    this.channels.set(channelName, channel);
    return channel;
  }

  /**
   * Track presence in a channel
   */
  async trackPresence(channelName: string, state: PresenceState): Promise<void> {
    const channel = this.channels.get(channelName);
    if (!channel) {
      throw new Error(`Channel not found: ${channelName}`);
    }

    await channel.track(state);
  }

  /**
   * Untrack presence in a channel
   */
  async untrackPresence(channelName: string): Promise<void> {
    const channel = this.channels.get(channelName);
    if (!channel) {
      throw new Error(`Channel not found: ${channelName}`);
    }

    await channel.untrack();
  }

  /**
   * Send broadcast message to channel
   */
  async broadcast<T = Record<string, unknown>>(channelName: string, event: string, payload: T): Promise<void> {
    const channel = this.channels.get(channelName);
    if (!channel) {
      throw new Error(`Channel not found: ${channelName}`);
    }

    await channel.send({
      type: 'broadcast',
      event,
      payload,
    });
  }

  /**
   * Unsubscribe from a channel
   */
  async unsubscribe(channelName: string): Promise<void> {
    const channel = this.channels.get(channelName);
    if (channel) {
      await this.supabase.removeChannel(channel);
      this.channels.delete(channelName);
      console.log(`[Realtime] Unsubscribed from channel: ${channelName}`);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  async unsubscribeAll(): Promise<void> {
    const promises = Array.from(this.channels.keys()).map((channelName) =>
      this.unsubscribe(channelName)
    );
    await Promise.all(promises);
  }

  /**
   * Get channel by name
   */
  getChannel(channelName: string): RealtimeChannel | undefined {
    return this.channels.get(channelName);
  }

  /**
   * Get all active channels
   */
  getActiveChannels(): string[] {
    return Array.from(this.channels.keys());
  }

  /**
   * Check if channel is subscribed
   */
  isSubscribed(channelName: string): boolean {
    return this.channels.has(channelName);
  }
}

// Singleton instance
let realtimeManager: RealtimeChannelManager | null = null;

/**
 * Get realtime manager instance
 */
export function getRealtimeManager(): RealtimeChannelManager {
  if (!realtimeManager) {
    realtimeManager = new RealtimeChannelManager();
  }
  return realtimeManager;
}

/**
 * Helper functions for common use cases
 */

/**
 * Subscribe to table changes
 */
export function subscribeToTable<T = Record<string, unknown>>(
  table: string,
  event: DatabaseChangeEvent,
  onChange: (payload: DatabaseChangePayload<T>) => void,
  filter?: string
): RealtimeChannel {
  const manager = getRealtimeManager();
  return manager.subscribeToDatabaseChanges({
    schema: 'public',
    table,
    event,
    filter,
    onChange,
  });
}

/**
 * Subscribe to room presence
 */
export function subscribeToRoom(
  roomId: string,
  userId: string,
  onPresenceSync: (state: Record<string, PresenceState[]>) => void
): RealtimeChannel {
  const manager = getRealtimeManager();
  const channel = manager.subscribeToChannel({
    channelName: `room:${roomId}`,
    onPresenceSync,
  });

  // Track user presence
  manager.trackPresence(`room:${roomId}`, {
    userId,
    status: 'online',
    lastSeen: new Date().toISOString(),
  });

  return channel;
}

/**
 * Broadcast message to room
 */
export async function broadcastToRoom<T = Record<string, unknown>>(
  roomId: string,
  event: string,
  payload: T
): Promise<void> {
  const manager = getRealtimeManager();
  await manager.broadcast(`room:${roomId}`, event, payload);
}

/**
 * Leave room
 */
export async function leaveRoom(roomId: string): Promise<void> {
  const manager = getRealtimeManager();
  await manager.untrackPresence(`room:${roomId}`);
  await manager.unsubscribe(`room:${roomId}`);
}
