/**
 * Sentry Error Tracking Integration
 * Agent 6: Integration Specialist
 */

import { createSuccessResponse, createErrorResponse } from '../utils';
import type { IntegrationResponse } from '../types';

export interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate?: number;
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
}

export interface ErrorContext {
  user?: {
    id: string;
    email?: string;
    username?: string;
  };
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
}

/**
 * Initialize Sentry
 */
export async function initSentry(): Promise<IntegrationResponse<SentryConfig>> {
  try {
    const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
    const environment = process.env.NODE_ENV || 'development';

    if (!dsn) {
      return createErrorResponse(
        'SENTRY_MISSING_DSN',
        'Sentry DSN is not configured'
      );
    }

    const config: SentryConfig = {
      dsn,
      environment,
      tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    };

    return createSuccessResponse(config);
  } catch (error) {
    return createErrorResponse(
      'SENTRY_INIT_ERROR',
      error instanceof Error ? error.message : 'Failed to initialize Sentry',
      error
    );
  }
}

/**
 * Capture an exception
 */
export function captureException(error: Error, context?: ErrorContext) {
  try {
    // This is a placeholder - actual implementation uses @sentry/nextjs
    // Usage: Sentry.captureException(error, { ...context })
    console.error('[Sentry] Exception:', error, context);
    
    // In production, this would send to Sentry
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, context);
    }
  } catch (err) {
    console.error('Failed to capture exception in Sentry:', err);
  }
}

/**
 * Capture a message
 */
export function captureMessage(message: string, level: ErrorContext['level'] = 'info', context?: ErrorContext) {
  try {
    // This is a placeholder - actual implementation uses @sentry/nextjs
    // Usage: Sentry.captureMessage(message, { level, ...context })
    console.log(`[Sentry] Message [${level}]:`, message, context);
    
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureMessage(message, { level, ...context });
    }
  } catch (err) {
    console.error('Failed to capture message in Sentry:', err);
  }
}

/**
 * Set user context
 */
export function setUser(user: ErrorContext['user']) {
  try {
    // This is a placeholder - actual implementation uses @sentry/nextjs
    // Usage: Sentry.setUser(user)
    console.log('[Sentry] Set user:', user);
    
    if (process.env.NODE_ENV === 'production') {
      // Sentry.setUser(user);
    }
  } catch (err) {
    console.error('Failed to set user in Sentry:', err);
  }
}

/**
 * Clear user context
 */
export function clearUser() {
  try {
    // This is a placeholder - actual implementation uses @sentry/nextjs
    // Usage: Sentry.setUser(null)
    console.log('[Sentry] Clear user');
    
    if (process.env.NODE_ENV === 'production') {
      // Sentry.setUser(null);
    }
  } catch (err) {
    console.error('Failed to clear user in Sentry:', err);
  }
}

/**
 * Add breadcrumb
 */
export function addBreadcrumb(message: string, category?: string, data?: Record<string, unknown>) {
  try {
    // This is a placeholder - actual implementation uses @sentry/nextjs
    // Usage: Sentry.addBreadcrumb({ message, category, data })
    console.log('[Sentry] Breadcrumb:', { message, category, data });
    
    if (process.env.NODE_ENV === 'production') {
      // Sentry.addBreadcrumb({ message, category, data });
    }
  } catch (err) {
    console.error('Failed to add breadcrumb in Sentry:', err);
  }
}

/**
 * Set tag
 */
export function setTag(key: string, value: string) {
  try {
    // This is a placeholder - actual implementation uses @sentry/nextjs
    // Usage: Sentry.setTag(key, value)
    console.log('[Sentry] Set tag:', key, value);
    
    if (process.env.NODE_ENV === 'production') {
      // Sentry.setTag(key, value);
    }
  } catch (err) {
    console.error('Failed to set tag in Sentry:', err);
  }
}

/**
 * Set context
 */
export function setContext(name: string, context: Record<string, unknown>) {
  try {
    // This is a placeholder - actual implementation uses @sentry/nextjs
    // Usage: Sentry.setContext(name, context)
    console.log('[Sentry] Set context:', name, context);
    
    if (process.env.NODE_ENV === 'production') {
      // Sentry.setContext(name, context);
    }
  } catch (err) {
    console.error('Failed to set context in Sentry:', err);
  }
}

/**
 * Start a transaction (performance monitoring)
 */
export function startTransaction(name: string, op: string) {
  try {
    // This is a placeholder - actual implementation uses @sentry/nextjs
    // Usage: Sentry.startTransaction({ name, op })
    console.log('[Sentry] Start transaction:', name, op);
    
    if (process.env.NODE_ENV === 'production') {
      // return Sentry.startTransaction({ name, op });
    }
    
    return null;
  } catch (err) {
    console.error('Failed to start transaction in Sentry:', err);
    return null;
  }
}

/**
 * Common error tracking helpers
 */
export const ErrorTracking = {
  // API errors
  apiError: (endpoint: string, error: Error, statusCode?: number) =>
    captureException(error, {
      tags: { endpoint, status_code: statusCode?.toString() || 'unknown' },
      level: 'error',
    }),

  // Payment errors
  paymentError: (orderId: string, error: Error, provider: string) =>
    captureException(error, {
      tags: { order_id: orderId, payment_provider: provider },
      level: 'error',
      extra: { orderId, provider },
    }),

  // Authentication errors
  authError: (error: Error, method?: string) =>
    captureException(error, {
      tags: { auth_method: method || 'unknown' },
      level: 'warning',
    }),

  // Integration errors
  integrationError: (integration: string, error: Error) =>
    captureException(error, {
      tags: { integration },
      level: 'error',
    }),

  // Database errors
  databaseError: (operation: string, error: Error) =>
    captureException(error, {
      tags: { db_operation: operation },
      level: 'error',
    }),

  // Performance issues
  performanceIssue: (operation: string, duration: number, threshold: number) =>
    captureMessage(`Slow operation: ${operation}`, 'warning', {
      tags: { operation },
      extra: { duration, threshold },
    }),
};
