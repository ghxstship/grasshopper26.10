#!/bin/bash
cd /Users/julianclarkson/Documents/Grasshopper26.10/gvteway-atlvs

# Create all 8 channel files with proper structure
for channel in notifications advancing project chat presence social tasks budget; do
  cat > "src/lib/realtime/channels/${channel}.ts" << 'EOF'
import { realtimeClient } from '../client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export class CHANNEL_CLASSChannel {
  private channel: RealtimeChannel | null = null;

  subscribe(): RealtimeChannel | null {
    this.channel = realtimeClient.channel('CHANNEL_NAME');
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
EOF

  # Replace placeholders
  CLASS_NAME=$(echo "$channel" | sed 's/\b\(.\)/\u\1/g')
  sed -i '' "s/CHANNEL_CLASS/${CLASS_NAME}/g" "src/lib/realtime/channels/${channel}.ts"
  sed -i '' "s/CHANNEL_NAME/${channel}/g" "src/lib/realtime/channels/${channel}.ts"
  
  echo "Created ${channel}.ts"
done

echo "All channel files created"
