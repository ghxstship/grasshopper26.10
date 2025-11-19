'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, ChatMessageProps } from '../molecules/ChatMessage';
import { ChatInput } from '../molecules/ChatInput';
import { Text } from '../atoms/Text';
import { cn } from '@/lib/utils';

export interface ChatWindowProps {
  messages: ChatMessageProps[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onTyping?: (isTyping: boolean) => void;
  typingUsers?: string[];
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  currentUserId,
  onSendMessage,
  onTyping,
  typingUsers = [],
  title,
  subtitle,
  isLoading = false,
  className,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom =
      element.scrollHeight - element.scrollTop === element.clientHeight;
    setAutoScroll(isAtBottom);
  };

  return (
    <div className={cn('flex flex-col h-full bg-white rounded-lg shadow-lg', className)}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="p-4 border-b bg-grey-50">
          {title && (
            <Text variant="h3" className="font-semibold">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="caption" className="text-grey-600 mt-1">
              {subtitle}
            </Text>
          )}
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2"
        onScroll={handleScroll}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Text variant="body" className="text-grey-500">
              Loading messages...
            </Text>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Text variant="body" className="text-grey-500">
              No messages yet. Start the conversation!
            </Text>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                {...message}
                isCurrentUser={message.senderId === currentUserId}
              />
            ))}
            
            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-grey-400 rounded-full animate-bounce animation-delay-0" />
                  <span className="w-2 h-2 bg-grey-400 rounded-full animate-bounce animation-delay-150" />
                  <span className="w-2 h-2 bg-grey-400 rounded-full animate-bounce animation-delay-300" />
                </div>
                <Text variant="caption" className="text-grey-500">
                  {typingUsers.length === 1
                    ? `${typingUsers[0]} is typing...`
                    : `${typingUsers.length} people are typing...`}
                </Text>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={onSendMessage} onTyping={onTyping} />
    </div>
  );
};
