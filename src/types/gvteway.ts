/**
 * TypeScript types for GVTEWAY module
 */

export interface Event {
  id: string;
  name: string;
  description?: string;
  date?: string;
  venue?: string;
  status?: string;
  capacity?: number;
  [key: string]: unknown;
}

export interface Ticket {
  id: string;
  eventId: string;
  type?: string;
  price?: number;
  status?: string;
  holder?: string;
  [key: string]: unknown;
}

export interface Venue {
  id: string;
  name: string;
  address?: string;
  capacity?: number;
  amenities?: string[];
  [key: string]: unknown;
}

export interface Artist {
  id: string;
  name: string;
  genre?: string;
  bio?: string;
  image?: string;
  [key: string]: unknown;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  status?: string;
  tickets?: number;
  total?: number;
  [key: string]: unknown;
}

export interface LoyaltyPoints {
  userId: string;
  points: number;
  tier?: string;
  [key: string]: unknown;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock?: number;
  [key: string]: unknown;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  [key: string]: unknown;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  [key: string]: unknown;
}
