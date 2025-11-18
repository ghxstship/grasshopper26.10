'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { cn } from '@/lib/utils';

export interface ChatInputProps {
  onSend: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onTyping,
  placeholder = 'Type a message...',
  disabled = false,
  maxLength = 1000,
  className,
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Typing indicator logic
    if (onTyping) {
      if (!isTyping) {
        setIsTyping(true);
        onTyping(true);
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping(false);
      }, 1000);
    }
  };

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      
      if (onTyping && isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn('flex items-center gap-2 p-4 border-t bg-white', className)}>
      <Input
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className="flex-1"
      />
      
      <Button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        variant="primary"
        size="md"
      >
        Send
      </Button>
    </div>
  );
};
