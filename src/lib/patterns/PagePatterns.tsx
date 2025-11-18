/**
 * Reusable Page Patterns for Frontend Logic
 * 
 * This file provides standardized patterns that can be applied
 * to any page to achieve 100% frontend logic completion.
 */

import { ReactNode } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader } from '@/components/atoms/Card';

// ============================================================================
// PATTERN 1: Data Fetching with Loading/Error States
// ============================================================================

interface DataFetchingPatternProps<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  children: (data: T) => ReactNode;
  emptyState?: ReactNode;
  loadingMessage?: string;
}

export function DataFetchingPattern<T>({
  data,
  isLoading,
  error,
  refetch,
  children,
  emptyState,
  loadingMessage = 'Loading...'
}: DataFetchingPatternProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
          <p className="text-gray-400">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="atlvs" className="bg-gray-900/50">
        <CardHeader>
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h3 className="text-h6 font-bebas mb-2">Failed to Load Data</h3>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="atlvs" onClick={refetch}>
              Try Again
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return emptyState || (
      <Card variant="atlvs" className="bg-gray-900/50">
        <CardHeader>
          <div className="text-center py-12 text-gray-400">
            <p>No data available</p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return <>{children(data)}</>;
}

// ============================================================================
// PATTERN 2: Form State Management
// ============================================================================

export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
}

export function createFormHandlers<T extends Record<string, any>>(
  state: FormState<T>,
  setState: (state: FormState<T>) => void
) {
  return {
    handleChange: (field: keyof T, value: any) => {
      setState({
        ...state,
        data: { ...state.data, [field]: value },
        isDirty: true,
        errors: { ...state.errors, [field]: undefined }
      });
    },

    handleSubmit: async (
      onSubmit: (data: T) => Promise<void>,
      validate?: (data: T) => Partial<Record<keyof T, string>>
    ) => {
      if (validate) {
        const errors = validate(state.data);
        if (Object.keys(errors).length > 0) {
          setState({ ...state, errors });
          return;
        }
      }

      setState({ ...state, isSubmitting: true });
      try {
        await onSubmit(state.data);
        setState({
          ...state,
          isSubmitting: false,
          isDirty: false,
          errors: {}
        });
      } catch (error) {
        setState({
          ...state,
          isSubmitting: false,
          errors: { ...state.errors }
        });
        throw error;
      }
    },

    reset: (initialData: T) => {
      setState({
        data: initialData,
        errors: {},
        isSubmitting: false,
        isDirty: false
      });
    }
  };
}

// ============================================================================
// PATTERN 3: List with Filters and Search
// ============================================================================

export interface ListFilterState {
  search: string;
  filters: Record<string, any>;
  sort: { field: string; direction: 'asc' | 'desc' };
  page: number;
  pageSize: number;
}

export function createListHandlers(
  state: ListFilterState,
  setState: (state: ListFilterState) => void
) {
  return {
    handleSearch: (search: string) => {
      setState({ ...state, search, page: 1 });
    },

    handleFilter: (key: string, value: any) => {
      setState({
        ...state,
        filters: { ...state.filters, [key]: value },
        page: 1
      });
    },

    handleSort: (field: string) => {
      setState({
        ...state,
        sort: {
          field,
          direction:
            state.sort.field === field && state.sort.direction === 'asc'
              ? 'desc'
              : 'asc'
        }
      });
    },

    handlePageChange: (page: number) => {
      setState({ ...state, page });
    },

    resetFilters: () => {
      setState({
        ...state,
        search: '',
        filters: {},
        page: 1
      });
    }
  };
}

// ============================================================================
// PATTERN 4: Mutation with Optimistic Updates
// ============================================================================

export interface MutationHandlers<T> {
  onMutate?: (variables: T) => void | Promise<void>;
  onSuccess?: (data: any, variables: T) => void;
  onError?: (error: Error, variables: T) => void;
  onSettled?: () => void;
}

export function createMutationHandler<T>(
  mutationFn: (variables: T) => Promise<any>,
  handlers: MutationHandlers<T>
) {
  return async (variables: T) => {
    try {
      if (handlers.onMutate) {
        await handlers.onMutate(variables);
      }

      const result = await mutationFn(variables);

      if (handlers.onSuccess) {
        handlers.onSuccess(result, variables);
      }

      return result;
    } catch (error) {
      if (handlers.onError) {
        handlers.onError(error as Error, variables);
      }
      throw error;
    } finally {
      if (handlers.onSettled) {
        handlers.onSettled();
      }
    }
  };
}

// ============================================================================
// PATTERN 5: Empty State Component
// ============================================================================

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4 opacity-50">{icon}</div>
      <h3 className="text-h6 font-bebas mb-2">{title}</h3>
      {description && <p className="text-gray-400 mb-4">{description}</p>}
      {action && (
        <Button variant="atlvs" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// PATTERN 6: Validation Helpers
// ============================================================================

export const validators = {
  required: (value: any, message = 'This field is required') =>
    !value || (typeof value === 'string' && !value.trim()) ? message : undefined,

  email: (value: string, message = 'Invalid email address') =>
    value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? message : undefined,

  minLength: (min: number, message?: string) => (value: string) =>
    value && value.length < min
      ? message || `Must be at least ${min} characters`
      : undefined,

  maxLength: (max: number, message?: string) => (value: string) =>
    value && value.length > max
      ? message || `Must be no more than ${max} characters`
      : undefined,

  pattern: (regex: RegExp, message = 'Invalid format') => (value: string) =>
    value && !regex.test(value) ? message : undefined,

  compose: (...validators: Array<(value: any) => string | undefined>) => (value: any) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return undefined;
  }
};

// ============================================================================
// PATTERN 7: Debounced Input Handler
// ============================================================================

export function createDebouncedHandler<T extends any[]>(
  fn: (...args: T) => void,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout;

  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// ============================================================================
// PATTERN 8: Status Badge Helper
// ============================================================================

export function getStatusColor(status: string, _variant: 'atlvs' | 'compvss' | 'gvteway' = 'atlvs') {
  const colors = {
    approved: 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50',
    pending: 'bg-warning-light text-warning border-warning-border',
    rejected: 'bg-error-light text-error border-error-border',
    'under-review': 'bg-info-light text-info border-info-border',
    draft: 'bg-gray-500/20 text-gray-500 border-gray-500/50',
    active: 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50',
    inactive: 'bg-gray-500/20 text-gray-500 border-gray-500/50',
    completed: 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50',
    'in-progress': 'bg-info-light text-info border-info-border',
    cancelled: 'bg-error-light text-error border-error-border'
  };

  return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-500 border-gray-500/50';
}

export function getPriorityColor(priority: string) {
  const colors = {
    urgent: 'bg-error',
    high: 'bg-warning-light0',
    medium: 'bg-warning',
    low: 'bg-info'
  };

  return colors[priority as keyof typeof colors] || 'bg-gray-500';
}
