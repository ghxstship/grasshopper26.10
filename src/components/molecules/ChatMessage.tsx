/**
 * Chat Message Component
 */

import { Body } from '@/components/ui-rebuild/atoms/Typography';

export interface ChatMessageProps {
  id?: string;
  message: string;
  content?: string;
  sender: 'user' | 'assistant';
  timestamp?: Date;
  status?: 'sending' | 'sent' | 'error' | 'failed';
}

export function ChatMessage({ message, sender, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] p-4 rounded-lg ${
        sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}>
        <Body>{message}</Body>
        {timestamp && (
          <Body className="text-xs opacity-70 mt-1">
            {timestamp.toLocaleTimeString()}
          </Body>
        )}
      </div>
    </div>
  );
}
