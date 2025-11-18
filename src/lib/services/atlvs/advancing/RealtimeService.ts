import { createClient, RealtimeChannel } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface RealtimeSubscriptionOptions {
  requestId: string;
  onCommentAdded?: (comment: unknown) => void;
  onStatusChanged?: (status: unknown) => void;
  onAttachmentAdded?: (attachment: unknown) => void;
  onPresenceUpdate?: (presence: unknown) => void;
}

/**
 * Service for managing real-time updates for advancing requests
 * Uses Supabase Realtime for live synchronization
 */
export class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  /**
   * Subscribe to real-time updates for a request
   */
  subscribe(options: RealtimeSubscriptionOptions): () => void {
    const { requestId, onCommentAdded, onStatusChanged, onAttachmentAdded, onPresenceUpdate } = options;

    const channelName = `advancing:${requestId}`;

    // Remove existing channel if any
    if (this.channels.has(channelName)) {
      this.unsubscribe(requestId);
    }

    // Create new channel
    const channel = supabase.channel(channelName);

    // Subscribe to comments
    if (onCommentAdded) {
      channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'advancing_comments',
          filter: `requestId=eq.${requestId}`,
        },
        (payload) => {
          onCommentAdded(payload.new);
        }
      );
    }

    // Subscribe to status changes (via history)
    if (onStatusChanged) {
      channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'advancing_history',
          filter: `requestId=eq.${requestId}`,
        },
        (payload) => {
          const history = payload.new as { action?: string };
          if (history.action === 'status_changed') {
            onStatusChanged(payload.new);
          }
        }
      );
    }

    // Subscribe to attachments
    if (onAttachmentAdded) {
      channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'advancing_attachments',
          filter: `requestId=eq.${requestId}`,
        },
        (payload) => {
          onAttachmentAdded(payload.new);
        }
      );
    }

    // Subscribe to presence (who's viewing)
    if (onPresenceUpdate) {
      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        onPresenceUpdate(state);
      });

      channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      });

      channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      });
    }

    // Subscribe to channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to ${channelName}`);
      }
    });

    // Store channel reference
    this.channels.set(channelName, channel);

    // Return unsubscribe function
    return () => this.unsubscribe(requestId);
  }

  /**
   * Unsubscribe from real-time updates
   */
  unsubscribe(requestId: string): void {
    const channelName = `advancing:${requestId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      console.log(`Unsubscribed from ${channelName}`);
    }
  }

  /**
   * Track user presence on a request
   */
  async trackPresence(requestId: string, userId: string, userName: string): Promise<void> {
    const channelName = `advancing:${requestId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      await channel.track({
        userId,
        userName,
        onlineAt: new Date().toISOString(),
      });
    }
  }

  /**
   * Untrack user presence
   */
  async untrackPresence(requestId: string): Promise<void> {
    const channelName = `advancing:${requestId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      await channel.untrack();
    }
  }

  /**
   * Broadcast a custom event to all subscribers
   */
  async broadcast(requestId: string, event: string, payload: unknown): Promise<void> {
    const channelName = `advancing:${requestId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      await channel.send({
        type: 'broadcast',
        event,
        payload,
      });
    }
  }

  /**
   * Clean up all subscriptions
   */
  cleanup(): void {
    this.channels.forEach((channel, channelName) => {
      supabase.removeChannel(channel);
      console.log(`Cleaned up ${channelName}`);
    });
    this.channels.clear();
  }
}

// Singleton instance
export const realtimeService = new RealtimeService();
