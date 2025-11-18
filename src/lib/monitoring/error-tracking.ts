/**
 * Error Tracking and Monitoring System
 * Centralized error handling, logging, and reporting
 */

export enum ErrorSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  AUTH = 'auth',
  DATABASE = 'database',
  API = 'api',
  VALIDATION = 'validation',
  NETWORK = 'network',
  PERMISSION = 'permission',
  BUSINESS_LOGIC = 'business_logic',
  EXTERNAL_SERVICE = 'external_service',
  UNKNOWN = 'unknown',
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  url?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  [key: string]: any;
}

export interface TrackedError {
  id: string;
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context: ErrorContext;
  timestamp: string;
  fingerprint: string;
  count: number;
}

/**
 * Error Tracker Class
 */
class ErrorTracker {
  private errors: Map<string, TrackedError> = new Map();
  private errorCallbacks: Array<(error: TrackedError) => void> = [];

  /**
   * Track an error
   */
  track(
    error: Error | string,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    context: ErrorContext = {}
  ): TrackedError {
    const message = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'string' ? undefined : error.stack;
    
    const fingerprint = this.generateFingerprint(message, stack, category);
    
    // Check if error already exists
    const existing = this.errors.get(fingerprint);
    if (existing) {
      existing.count++;
      existing.timestamp = new Date().toISOString();
      this.errors.set(fingerprint, existing);
      this.notifyCallbacks(existing);
      return existing;
    }
    
    // Create new error
    const trackedError: TrackedError = {
      id: this.generateId(),
      message,
      stack,
      severity,
      category,
      context,
      timestamp: new Date().toISOString(),
      fingerprint,
      count: 1,
    };
    
    this.errors.set(fingerprint, trackedError);
    this.notifyCallbacks(trackedError);
    this.logError(trackedError);
    
    return trackedError;
  }

  /**
   * Track API error
   */
  trackAPIError(
    error: Error,
    endpoint: string,
    method: string,
    statusCode?: number,
    context: ErrorContext = {}
  ): TrackedError {
    return this.track(
      error,
      statusCode && statusCode >= 500 ? ErrorSeverity.ERROR : ErrorSeverity.WARNING,
      ErrorCategory.API,
      {
        ...context,
        endpoint,
        method,
        statusCode,
      }
    );
  }

  /**
   * Track database error
   */
  trackDatabaseError(
    error: Error,
    query?: string,
    context: ErrorContext = {}
  ): TrackedError {
    return this.track(
      error,
      ErrorSeverity.ERROR,
      ErrorCategory.DATABASE,
      {
        ...context,
        query: query?.substring(0, 500), // Truncate long queries
      }
    );
  }

  /**
   * Track auth error
   */
  trackAuthError(
    error: Error | string,
    context: ErrorContext = {}
  ): TrackedError {
    return this.track(
      error,
      ErrorSeverity.WARNING,
      ErrorCategory.AUTH,
      context
    );
  }

  /**
   * Track validation error
   */
  trackValidationError(
    message: string,
    field?: string,
    context: ErrorContext = {}
  ): TrackedError {
    return this.track(
      message,
      ErrorSeverity.INFO,
      ErrorCategory.VALIDATION,
      {
        ...context,
        field,
      }
    );
  }

  /**
   * Get error by fingerprint
   */
  getError(fingerprint: string): TrackedError | undefined {
    return this.errors.get(fingerprint);
  }

  /**
   * Get all errors
   */
  getAllErrors(): TrackedError[] {
    return Array.from(this.errors.values());
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): TrackedError[] {
    return this.getAllErrors().filter((e) => e.severity === severity);
  }

  /**
   * Get errors by category
   */
  getErrorsByCategory(category: ErrorCategory): TrackedError[] {
    return this.getAllErrors().filter((e) => e.category === category);
  }

  /**
   * Clear all errors
   */
  clear(): void {
    this.errors.clear();
  }

  /**
   * Subscribe to error events
   */
  onError(callback: (error: TrackedError) => void): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) {
        this.errorCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Generate error fingerprint
   */
  private generateFingerprint(
    message: string,
    stack?: string,
    category?: ErrorCategory
  ): string {
    const stackLine = stack?.split('\n')[1] || '';
    return `${category}:${message}:${stackLine}`;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Notify callbacks
   */
  private notifyCallbacks(error: TrackedError): void {
    this.errorCallbacks.forEach((callback) => {
      try {
        callback(error);
      } catch (err) {
        console.error('Error in error callback:', err);
      }
    });
  }

  /**
   * Log error to console
   */
  private logError(error: TrackedError): void {
    const logFn = this.getLogFunction(error.severity);
    logFn(`[${error.severity.toUpperCase()}] [${error.category}] ${error.message}`, {
      id: error.id,
      context: error.context,
      stack: error.stack,
    });
  }

  /**
   * Get appropriate log function
   */
  private getLogFunction(severity: ErrorSeverity): typeof console.log {
    switch (severity) {
      case ErrorSeverity.DEBUG:
        return console.debug;
      case ErrorSeverity.INFO:
        return console.info;
      case ErrorSeverity.WARNING:
        return console.warn;
      case ErrorSeverity.ERROR:
      case ErrorSeverity.CRITICAL:
        return console.error;
      default:
        return console.log;
    }
  }
}

// Singleton instance
export const errorTracker = new ErrorTracker();

/**
 * React Error Boundary compatible error handler
 */
export function handleReactError(
  error: Error,
  errorInfo: { componentStack: string }
): void {
  errorTracker.track(error, ErrorSeverity.ERROR, ErrorCategory.UNKNOWN, {
    componentStack: errorInfo.componentStack,
  });
}

/**
 * Global error handler for unhandled errors
 */
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorTracker.track(
      event.error || event.message,
      ErrorSeverity.ERROR,
      ErrorCategory.UNKNOWN,
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.track(
      event.reason,
      ErrorSeverity.ERROR,
      ErrorCategory.UNKNOWN,
      {
        type: 'unhandledrejection',
      }
    );
  });
}

/**
 * Error metrics
 */
export function getErrorMetrics() {
  const errors = errorTracker.getAllErrors();
  
  return {
    total: errors.length,
    bySeverity: {
      debug: errors.filter((e) => e.severity === ErrorSeverity.DEBUG).length,
      info: errors.filter((e) => e.severity === ErrorSeverity.INFO).length,
      warning: errors.filter((e) => e.severity === ErrorSeverity.WARNING).length,
      error: errors.filter((e) => e.severity === ErrorSeverity.ERROR).length,
      critical: errors.filter((e) => e.severity === ErrorSeverity.CRITICAL).length,
    },
    byCategory: {
      auth: errors.filter((e) => e.category === ErrorCategory.AUTH).length,
      database: errors.filter((e) => e.category === ErrorCategory.DATABASE).length,
      api: errors.filter((e) => e.category === ErrorCategory.API).length,
      validation: errors.filter((e) => e.category === ErrorCategory.VALIDATION).length,
      network: errors.filter((e) => e.category === ErrorCategory.NETWORK).length,
      permission: errors.filter((e) => e.category === ErrorCategory.PERMISSION).length,
      businessLogic: errors.filter((e) => e.category === ErrorCategory.BUSINESS_LOGIC).length,
      externalService: errors.filter((e) => e.category === ErrorCategory.EXTERNAL_SERVICE).length,
      unknown: errors.filter((e) => e.category === ErrorCategory.UNKNOWN).length,
    },
    topErrors: errors
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((e) => ({
        message: e.message,
        count: e.count,
        severity: e.severity,
        category: e.category,
      })),
  };
}
