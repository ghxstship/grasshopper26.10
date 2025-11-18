#!/bin/bash

# Fix all realtime channel files with correct imports and types

for file in src/lib/realtime/channels/*.ts; do
  if [ -f "$file" ]; then
    # Replace incorrect import
    sed -i '' "s|import { createClient } from '@/lib/supabase/client';|import { createClient } from '@supabase/supabase-js';\n\nconst supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;\nconst supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;\nconst supabase = createClient(supabaseUrl, supabaseAnonKey);|g" "$file"
    
    # Fix payload types
    sed -i '' 's|(payload) => {|(payload: any) => {|g' "$file"
    sed -i '' 's|(status) => {|(status: string) => {|g' "$file"
    
    # Fix subscribe return type
    sed -i '' 's|subscribe(): RealtimeChannel {|subscribe(): RealtimeChannel \| null {|g' "$file"
    
    # Fix unsubscribe
    sed -i '' 's|const supabase = createClient();||g' "$file"
    
    # Fix return statement
    sed -i '' 's|return this.channel;|return this.channel!;|g' "$file"
    
    echo "Fixed $file"
  fi
done

echo "All realtime channel files fixed"
