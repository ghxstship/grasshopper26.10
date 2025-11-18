/**
 * Common TypeScript types used across all modules
 */

// Generic callback types
export type MapCallback<T, R> = (item: T, index: number, array: T[]) => R;
export type FilterCallback<T> = (item: T, index: number, array: T[]) => boolean;
export type ReduceCallback<T, R> = (accumulator: R, item: T, index: number, array: T[]) => R;
export type ForEachCallback<T> = (item: T, index: number, array: T[]) => void;

// Generic data structures
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Common UI types
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ComponentType;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number | boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Status types
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'error';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  [key: string]: unknown;
}

// Generic list item
export interface ListItem {
  id: string;
  name: string;
  description?: string;
  status?: Status;
  [key: string]: unknown;
}
