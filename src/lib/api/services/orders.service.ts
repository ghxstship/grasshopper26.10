/**
 * Orders API Service
 * Centralized order-related API calls
 */

import { apiClient } from '../client';

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
  currency: string;
  createdAt: string;
  items: Array<{
    id: string;
    type: string;
    itemId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

export const ordersService = {
  /**
   * Get user's orders
   */
  async list() {
    const response = await apiClient.get<{ orders: Order[] }>('/api/orders');
    return response.data;
  },

  /**
   * Get single order by ID
   */
  async getById(id: string) {
    const response = await apiClient.get<Order>(`/api/orders/${id}`);
    return response.data;
  },

  /**
   * Cancel order
   */
  async cancel(id: string, reason?: string) {
    const response = await apiClient.post<Order>(`/api/orders/${id}/cancel`, {
      reason,
    });
    return response.data;
  },
};
