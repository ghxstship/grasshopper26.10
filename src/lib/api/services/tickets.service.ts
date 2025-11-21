/**
 * Tickets API Service
 * Centralized ticket-related API calls
 */

import { apiClient } from '../client';

export interface Ticket {
  id: string;
  status: string;
  qrCode: string;
  seatNumber?: string;
  event: {
    id: string;
    name: string;
    startDate: string;
    venue: string;
  };
  ticketType: {
    name: string;
  };
}

export interface PurchaseTicketRequest {
  eventId: string;
  tickets: Array<{
    ticketTypeId: string;
    quantity: number;
  }>;
  paymentMethodId?: string;
}

export const ticketsService = {
  /**
   * Get user's tickets
   */
  async list() {
    const response = await apiClient.get<{ tickets: Ticket[] }>('/api/tickets');
    return response.data;
  },

  /**
   * Get single ticket by ID
   */
  async getById(id: string) {
    const response = await apiClient.get<Ticket>(`/api/tickets/${id}`);
    return response.data;
  },

  /**
   * Purchase tickets
   */
  async purchase(data: PurchaseTicketRequest) {
    const response = await apiClient.post<{
      orderId: string;
      tickets: Ticket[];
      total: number;
    }>('/api/tickets/purchase', data);
    return response.data;
  },

  /**
   * Validate ticket
   */
  async validate(id: string) {
    const response = await apiClient.post<{ valid: boolean; ticket: Ticket }>(
      `/api/tickets/${id}/validate`
    );
    return response.data;
  },

  /**
   * Transfer ticket
   */
  async transfer(id: string, recipientEmail: string) {
    const response = await apiClient.post<Ticket>(`/api/tickets/${id}/transfer`, {
      recipientEmail,
    });
    return response.data;
  },

  /**
   * Request refund
   */
  async refund(id: string, reason?: string) {
    const response = await apiClient.post<Ticket>(`/api/tickets/${id}/refund`, {
      reason,
    });
    return response.data;
  },
};
