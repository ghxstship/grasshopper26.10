'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessageProps } from '@/components/molecules/ChatMessage';

export interface UseChatOptions {
  conversationId: string;
  currentUserId: string;
  onMessageReceived?: (message: ChatMessageProps) => void;
  onTypingChanged?: (userId: string, isTyping: boolean) => void;
  autoConnect?: boolean;
}

export interface UseChatReturn {
  messages: ChatMessageProps[];
  sendMessage: (content: string) => Promise<void>;
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  typingUsers: string[];
  setTyping: (isTyping: boolean) => void;
}

/**
 * Hook for managing chat functionality with Socket.io
 * This is a client-side only hook
 */
export function useChat(options: UseChatOptions): UseChatReturn {
  const {
    conversationId,
    currentUserId,
    onMessageReceived,
    onTypingChanged,
    autoConnect = true,
  } = options;

  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [typingUsers] = useState<string[]>([]);
  
  const socketRef = useRef<unknown>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load messages
  const loadMessages = useCallback(async () => {
    try {
      // In a real implementation, this would fetch messages from the API
      console.log('[useChat] Loading messages for conversation:', conversationId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For now, return empty array
      setMessages([]);
    } catch (err) {
      console.error('[useChat] Failed to load messages:', err);
      setError(err instanceof Error ? err : new Error('Failed to load messages'));
    }
  }, [conversationId]);

  // Initialize connection
  useEffect(() => {
    if (!autoConnect) return;

    const initConnection = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would initialize Socket.io
        // For now, we'll simulate the connection
        console.log('[useChat] Initializing connection for conversation:', conversationId);
        
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setIsConnected(true);
        setIsLoading(false);
        
        // Load initial messages
        await loadMessages();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to connect'));
        setIsLoading(false);
      }
    };

    initConnection();

    // Cleanup
    return () => {
      if (socketRef.current) {
        console.log('[useChat] Disconnecting from conversation:', conversationId);
        socketRef.current = null;
      }
      setIsConnected(false);
    };
  }, [conversationId, currentUserId, autoConnect, loadMessages]);

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!isConnected) {
        throw new Error('Not connected');
      }

      try {
        const newMessage: ChatMessageProps = {
          id: `temp-${Date.now()}`,
          content,
          message: content,
          sender: (currentUserId === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          timestamp: new Date(),
          status: 'sending',
        };

        // Optimistically add message
        setMessages(prev => [...prev, newMessage]);

        // In a real implementation, this would send via Socket.io
        console.log('[useChat] Sending message:', content);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update message status
        setMessages(prev =>
          prev.map(msg =>
            msg.id === newMessage.id
              ? { ...msg, status: 'sent' as const }
              : msg
          )
        );
      } catch (err) {
        console.error('[useChat] Failed to send message:', err);
        
        // Update message status to failed
        setMessages(prev =>
          prev.map(msg =>
            msg.status === 'sending'
              ? { ...msg, status: 'failed' as const }
              : msg
          )
        );
        
        throw err;
      }
    },
    [isConnected, currentUserId]
  );

  // Set typing indicator
  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!isConnected) return;

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (isTyping) {
        // In a real implementation, this would emit via Socket.io
        console.log('[useChat] User is typing');
        
        // Auto-stop typing after 3 seconds
        typingTimeoutRef.current = setTimeout(() => {
          console.log('[useChat] User stopped typing (timeout)');
        }, 3000);
      } else {
        console.log('[useChat] User stopped typing');
      }
    },
    [isConnected]
  );

  // Handle incoming typing events
  useEffect(() => {
    // In a real implementation, this would listen to Socket.io events
    // For now, we'll just log
    if (onTypingChanged) {
      console.log('[useChat] Typing handler registered');
    }
  }, [onTypingChanged]);

  // Handle incoming messages
  useEffect(() => {
    // In a real implementation, this would listen to Socket.io events
    // For now, we'll just log
    if (onMessageReceived) {
      console.log('[useChat] Message handler registered');
    }
  }, [onMessageReceived]);

  return {
    messages,
    sendMessage,
    isConnected,
    isLoading,
    error,
    typingUsers,
    setTyping,
  };
}
