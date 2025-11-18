import { realtimeClient } from '../client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export class advancingChannel {
  private channel: RealtimeChannel | null = null;

  subscribe(): RealtimeChannel | null {
    this.channel = realtimeClient.channel('advancing');
    return this.channel;
  }

  async unsubscribe(): Promise<void> {
    if (this.channel) {
      await realtimeClient.removeChannel(this.channel);
      this.channel = null;
    }
  }

  isSubscribed(): boolean {
    return this.channel !== null;
  }
}
