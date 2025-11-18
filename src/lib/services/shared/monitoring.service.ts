/**
 * Monitoring Service
 * Error tracking and performance monitoring via Sentry
 */

import * as Sentry from '@sentry/nextjs';

export class MonitoringService {
  /**
   * Initialize monitoring
   */
  initialize() {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 1.0,
      });
    }
  }

  /**
   * Capture exception
   */
  captureException(error: Error, context?: Record<string, unknown>) {
    try {
      if (context) {
        Sentry.setContext('additional', context);
      }

      Sentry.captureException(error);
    } catch (err) {
      console.error('Error capturing exception:', err);
    }
  }

  /**
   * Capture message
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    try {
      Sentry.captureMessage(message, level);
    } catch (error) {
      console.error('Error capturing message:', error);
    }
  }

  /**
   * Set user context
   */
  setUser(user: { id: string; email?: string; username?: string }) {
    try {
      Sentry.setUser(user);
    } catch (error) {
      console.error('Error setting user context:', error);
    }
  }

  /**
   * Clear user context
   */
  clearUser() {
    try {
      Sentry.setUser(null);
    } catch (error) {
      console.error('Error clearing user context:', error);
    }
  }

  /**
   * Add breadcrumb
   */
  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: 'info' | 'warning' | 'error';
    data?: Record<string, unknown>;
  }) {
    try {
      Sentry.addBreadcrumb(breadcrumb);
    } catch (error) {
      console.error('Error adding breadcrumb:', error);
    }
  }

  /**
   * Start transaction (placeholder - use Sentry.startSpan in newer versions)
   */
  startTransaction(name: string, op: string) {
    try {
      // Sentry.startTransaction is deprecated, use startSpan instead
      this.addBreadcrumb({
        message: `Transaction: ${name}`,
        category: 'transaction',
        level: 'info',
        data: { op },
      });
      return null;
    } catch (error) {
      console.error('Error starting transaction:', error);
      return null;
    }
  }

  /**
   * Track performance metric
   */
  trackMetric(name: string, value: number, unit?: string) {
    try {
      this.addBreadcrumb({
        message: `Metric: ${name}`,
        category: 'performance',
        level: 'info',
        data: { value, unit },
      });
    } catch (error) {
      console.error('Error tracking metric:', error);
    }
  }

  /**
   * Track API call
   */
  trackAPICall(endpoint: string, method: string, statusCode: number, duration: number) {
    try {
      this.addBreadcrumb({
        message: `API: ${method} ${endpoint}`,
        category: 'api',
        level: statusCode >= 400 ? 'error' : 'info',
        data: {
          endpoint,
          method,
          statusCode,
          duration,
        },
      });
    } catch (error) {
      console.error('Error tracking API call:', error);
    }
  }

  /**
   * Track database query
   */
  trackDatabaseQuery(query: string, duration: number, success: boolean) {
    try {
      this.addBreadcrumb({
        message: 'Database Query',
        category: 'database',
        level: success ? 'info' : 'error',
        data: {
          query: query.substring(0, 100), // Truncate long queries
          duration,
          success,
        },
      });
    } catch (error) {
      console.error('Error tracking database query:', error);
    }
  }

  /**
   * Track user action
   */
  trackUserAction(action: string, data?: Record<string, unknown>) {
    try {
      this.addBreadcrumb({
        message: `User Action: ${action}`,
        category: 'user',
        level: 'info',
        data,
      });
    } catch (error) {
      console.error('Error tracking user action:', error);
    }
  }

  /**
   * Set custom context
   */
  setContext(name: string, context: Record<string, unknown>) {
    try {
      Sentry.setContext(name, context);
    } catch (error) {
      console.error('Error setting context:', error);
    }
  }

  /**
   * Set tag
   */
  setTag(key: string, value: string) {
    try {
      Sentry.setTag(key, value);
    } catch (error) {
      console.error('Error setting tag:', error);
    }
  }

  /**
   * Flush events
   */
  async flush(timeout = 2000) {
    try {
      await Sentry.flush(timeout);
    } catch (error) {
      console.error('Error flushing events:', error);
    }
  }

  /**
   * Close monitoring
   */
  async close(timeout = 2000) {
    try {
      await Sentry.close(timeout);
    } catch (error) {
      console.error('Error closing monitoring:', error);
    }
  }
}

export const monitoringService = new MonitoringService();
