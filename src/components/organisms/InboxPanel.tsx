'use client';

import React, { useState } from 'react';
import { Avatar } from '../atoms/Avatar';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { cn } from '@/lib/utils';

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline?: boolean;
}

export interface InboxPanelProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onSearch?: (query: string) => void;
  className?: string;
}

export const InboxPanel: React.FC<InboxPanelProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onSearch,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className={cn('flex flex-col h-full bg-white border-r', className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <Text variant="h3" className="font-semibold mb-3">
          Messages
        </Text>
        
        {onSearch && (
          <Input
            type="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <Text variant="body" className="text-gray-500 text-center">
              No conversations yet
            </Text>
          </div>
        ) : (
          conversations.map((conversation) => (
            <Button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              variant="ghost"
              className={cn(
                'w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b',
                selectedConversationId === conversation.id && 'bg-accent'
              )}
            >
              <div className="relative flex-shrink-0">
                <Avatar
                  src={conversation.participantAvatar}
                  alt={conversation.participantName}
                  size="md"
                />
                {conversation.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <Text
                    variant="body"
                    className={cn(
                      'font-medium truncate',
                      conversation.unreadCount > 0 && 'font-semibold'
                    )}
                  >
                    {conversation.participantName}
                  </Text>
                  
                  <Text variant="caption" className="text-gray-500 flex-shrink-0 ml-2">
                    {formatTime(conversation.lastMessageTime)}
                  </Text>
                </div>

                <div className="flex items-center justify-between">
                  <Text
                    variant="caption"
                    className={cn(
                      'truncate',
                      conversation.unreadCount > 0
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-600'
                    )}
                  >
                    {conversation.lastMessage}
                  </Text>
                  
                  {conversation.unreadCount > 0 && (
                    <Badge variant="info" className="ml-2 flex-shrink-0">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </Button>
          ))
        )}
      </div>
    </div>
  );
};
