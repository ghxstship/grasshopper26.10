/**
 * Events API Service
 * Centralized event-related API calls
 */

import { apiClient } from '../client';

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  venue: string;
  location: string;
  category: string;
  status: string;
  imageUrl?: string;
  bannerUrl?: string;
  ticketsAvailable: number;
  capacity?: number;
  organizer?: {
    id: string;
    name: string;
  };
}

export interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  maxPerOrder: number;
}

export interface EventFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const eventsService = {
  /**
   * Get list of events with optional filters
   */
  async list(filters?: EventFilters) {
    const response = await apiClient.get<{ events: Event[]; pagination?: unknown }>('/api/events', {
      params: filters as Record<string, string | number | boolean>,
    });
    return response.data;
  },

  /**
   * Get single event by ID
   */
  async getById(id: string) {
    const response = await apiClient.get<Event>(`/api/events/${id}`);
    return response.data;
  },

  /**
   * Get ticket types for an event
   */
  async getTicketTypes(eventId: string) {
    const response = await apiClient.get<{ ticketTypes: TicketType[] }>(
      `/api/events/${eventId}/tickets`
    );
    return response.data;
  },

  /**
   * Create new event (requires ORGANIZER role)
   */
  async create(data: Partial<Event>) {
    const response = await apiClient.post<Event>('/api/events', data);
    return response.data;
  },

  /**
   * Update event
   */
  async update(id: string, data: Partial<Event>) {
    const response = await apiClient.put<Event>(`/api/events/${id}`, data);
    return response.data;
  },

  /**
   * Delete event
   */
  async delete(id: string) {
    const response = await apiClient.delete(`/api/events/${id}`);
    return response.data;
  },
};
