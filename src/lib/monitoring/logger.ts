/**
 * Structured Logging System
 * JSON-formatted logs with levels, context, and metadata
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  metadata?: Record<string, any>;
  userId?: string;
  requestId?: string;
  service?: string;
}

class Logger {
  private minLevel: LogLevel = LogLevel.INFO;
  private service: string = 'grasshopper';
  private logCallbacks: Array<(entry: LogEntry) => void> = [];

  constructor() {
    // Set log level from environment
    const envLevel = process.env.LOG_LEVEL?.toLowerCase();
    if (envLevel && Object.values(LogLevel).includes(envLevel as LogLevel)) {
      this.minLevel = envLevel as LogLevel;
    }
  }

  /**
   * Set minimum log level
   */
  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Set service name
   */
  setService(service: string): void {
    this.service = service;
  }

  /**
   * Subscribe to log events
   */
  onLog(callback: (entry: LogEntry) => void): () => void {
    this.logCallbacks.push(callback);
    return () => {
      const index = this.logCallbacks.indexOf(callback);
      if (index > -1) {
        this.logCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Debug log
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Info log
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Warning log
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Error log
   */
  error(message: string, error?: Error | unknown, context?: Record<string, any>): void {
    const errorContext = error instanceof Error
      ? {
          ...context,
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
        }
      : context;

    this.log(LogLevel.ERROR, message, errorContext);
  }

  /**
   * Log API request
   */
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    context?: Record<string, any>
  ): void {
    this.info(`${method} ${url} ${statusCode} ${duration}ms`, {
      ...context,
      type: 'request',
      method,
      url,
      statusCode,
      duration,
    });
  }

  /**
   * Log database query
   */
  logQuery(
    query: string,
    duration: number,
    rowCount?: number,
    context?: Record<string, any>
  ): void {
    this.debug(`Query executed in ${duration}ms`, {
      ...context,
      type: 'query',
      query: query.substring(0, 500), // Truncate long queries
      duration,
      rowCount,
    });
  }

  /**
   * Log audit event
   */
  logAudit(
    action: string,
    userId: string,
    resource: string,
    context?: Record<string, any>
  ): void {
    this.info(`Audit: ${action} on ${resource}`, {
      ...context,
      type: 'audit',
      action,
      userId,
      resource,
    });
  }

  /**
   * Core log method
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      service: this.service,
    };

    // Output to console
    this.outputToConsole(entry);

    // Notify callbacks
    this.logCallbacks.forEach((callback) => {
      try {
        callback(entry);
      } catch (err) {
        console.error('Error in log callback:', err);
      }
    });
  }

  /**
   * Check if should log based on level
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const minIndex = levels.indexOf(this.minLevel);
    const levelIndex = levels.indexOf(level);
    return levelIndex >= minIndex;
  }

  /**
   * Output to console
   */
  private outputToConsole(entry: LogEntry): void {
    const logFn = this.getConsoleFunction(entry.level);
    
    if (process.env.NODE_ENV === 'production') {
      // JSON format for production
      logFn(JSON.stringify(entry));
    } else {
      // Pretty format for development
      logFn(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.context || {});
    }
  }

  /**
   * Get console function for level
   */
  private getConsoleFunction(level: LogLevel): typeof console.log {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
        return console.error;
      default:
        return console.log;
    }
  }
}

// Singleton instance
export const logger = new Logger();

/**
 * Create child logger with context
 */
export function createLogger(context: Record<string, any>): {
  debug: (message: string, additionalContext?: Record<string, any>) => void;
  info: (message: string, additionalContext?: Record<string, any>) => void;
  warn: (message: string, additionalContext?: Record<string, any>) => void;
  error: (message: string, error?: Error, additionalContext?: Record<string, any>) => void;
} {
  return {
    debug: (message, additionalContext) =>
      logger.debug(message, { ...context, ...additionalContext }),
    info: (message, additionalContext) =>
      logger.info(message, { ...context, ...additionalContext }),
    warn: (message, additionalContext) =>
      logger.warn(message, { ...context, ...additionalContext }),
    error: (message, error, additionalContext) =>
      logger.error(message, error, { ...context, ...additionalContext }),
  };
}

/**
 * Performance logger
 */
export class PerformanceLogger {
  private startTime: number;
  private marks: Map<string, number> = new Map();

  constructor(private operation: string) {
    this.startTime = performance.now();
  }

  /**
   * Mark a checkpoint
   */
  mark(name: string): void {
    this.marks.set(name, performance.now() - this.startTime);
  }

  /**
   * End and log performance
   */
  end(context?: Record<string, any>): void {
    const duration = performance.now() - this.startTime;
    
    logger.debug(`Performance: ${this.operation} completed in ${duration.toFixed(2)}ms`, {
      ...context,
      type: 'performance',
      operation: this.operation,
      duration,
      marks: Object.fromEntries(this.marks),
    });
  }
}

/**
 * Log retention policy
 */
export class LogRetentionManager {
  private logs: LogEntry[] = [];
  private maxLogs: number = 10000;
  private retentionMs: number = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor() {
    // Subscribe to logger
    logger.onLog((entry) => {
      this.addLog(entry);
    });

    // Cleanup old logs periodically
    setInterval(() => this.cleanup(), 60 * 60 * 1000); // Every hour
  }

  /**
   * Add log entry
   */
  private addLog(entry: LogEntry): void {
    this.logs.push(entry);

    // Trim if exceeds max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Cleanup old logs
   */
  private cleanup(): void {
    const cutoff = Date.now() - this.retentionMs;
    this.logs = this.logs.filter((log) => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime > cutoff;
    });
  }

  /**
   * Get logs
   */
  getLogs(filter?: {
    level?: LogLevel;
    since?: string;
    service?: string;
  }): LogEntry[] {
    let filtered = this.logs;

    if (filter?.level) {
      filtered = filtered.filter((log) => log.level === filter.level);
    }

    if (filter?.since) {
      const sinceTime = new Date(filter.since).getTime();
      filtered = filtered.filter((log) => {
        const logTime = new Date(log.timestamp).getTime();
        return logTime >= sinceTime;
      });
    }

    if (filter?.service) {
      filtered = filtered.filter((log) => log.service === filter.service);
    }

    return filtered;
  }

  /**
   * Export logs
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    }

    // CSV format
    const headers = ['timestamp', 'level', 'service', 'message'];
    const rows = this.logs.map((log) => [
      log.timestamp,
      log.level,
      log.service || '',
      log.message.replace(/"/g, '""'), // Escape quotes
    ]);

    return [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');
  }
}

// Create retention manager
export const logRetentionManager = new LogRetentionManager();
