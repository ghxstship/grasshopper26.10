import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  createdAt: string;
  read: boolean;
}

export function useMessage(messageId?: string) {
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!messageId) return;

    const fetchMessage = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        const response = await apiClient.get<Message>(`/api/messages/${messageId}`);
        if (response.data) {
          setMessage(response.data);
        }
      } catch (err) {
        setError('Failed to fetch message');
        console.error('Failed to fetch message:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [messageId]);

  return { message, loading, error };
}
