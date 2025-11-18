import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  time: string;
  unreadCount: number;
}

/**
 * Hook for managing conversations
 */
export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await fetch('/api/gvteway/messages/conversations');
      if (!response.ok) throw new Error('Failed to fetch conversations');
      return response.json();
    },
  });
}

/**
 * Hook for managing messages in a conversation
 */
export function useMessages(conversationId: string | undefined) {
  return useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error('Conversation ID required');
      const response = await fetch(`/api/gvteway/messages/${conversationId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    enabled: !!conversationId,
  });
}

/**
 * Hook for sending messages
 */
export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      const response = await fetch(`/api/gvteway/messages/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

/**
 * Hook for marking messages as read
 */
export function useMarkMessagesRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await fetch(`/api/gvteway/messages/${conversationId}/read`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark messages as read');
      return response.json();
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
