'use client';

import React from 'react';
import { Avatar } from '../atoms/Avatar';
import { Text } from '../atoms/Text';
import { Caption } from '../atoms/Typography';
import { cn } from '@/lib/utils';

export interface ChatMessageProps {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  isCurrentUser?: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  senderName,
  senderAvatar,
  timestamp,
  isCurrentUser = false,
  status = 'sent',
  className,
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        isCurrentUser ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {!isCurrentUser && (
        <Avatar
          src={senderAvatar}
          alt={senderName}
          size="sm"
          className="flex-shrink-0"
        />
      )}
      
      <div
        className={cn(
          'flex flex-col max-w-[70%]',
          isCurrentUser ? 'items-end' : 'items-start'
        )}
      >
        {!isCurrentUser && (
          <Text variant="caption" className="mb-1 px-1 text-grey-600">
            {senderName}
          </Text>
        )}
        
        <div
          className={cn(
            'rounded-2xl px-4 py-2',
            isCurrentUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-grey-100 text-grey-900 rounded-bl-sm'
          )}
        >
          <Text variant="body" className={isCurrentUser ? 'text-white' : ''}>
            {content}
          </Text>
        </div>
        
        <div className="flex items-center gap-2 mt-1 px-1">
          <Text variant="caption" className="text-grey-500">
            {formatTime(timestamp)}
          </Text>
          
          {isCurrentUser && status && (
            <Caption className="text-grey-500">
              {status === 'sending' && '⏳'}
              {status === 'sent' && '✓'}
              {status === 'delivered' && '✓✓'}
              {status === 'read' && '✓✓'}
              {status === 'failed' && '❌'}
            </Caption>
          )}
        </div>
      </div>
    </div>
  );
};
