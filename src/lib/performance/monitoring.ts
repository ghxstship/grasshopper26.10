/**
 * Performance Monitoring Utilities
 * Track and log performance metrics for optimization
 */

import { captureMessage } from '@/lib/integrations/monitoring/sentry';

/**
 * Performance thresholds (in milliseconds)
 */
const THRESHOLDS = {
  API_RESPONSE: 200,
  DATABASE_QUERY: 100,
  PAGE_LOAD: 2000,
  RENDER: 16, // 60fps
} as const;

/**
 * Performance metric types
 */
export type MetricType = 'api' | 'database' | 'render' | 'custom';

/**
 * Performance metric interface
 */
export interface PerformanceMetric {
  name: string;
  type: MetricType;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * In-memory metrics storage (for development)
 */
const metrics: PerformanceMetric[] = [];

/**
 * Start a performance timer
 */
export function startTimer(_name: string): () => number {
  const start = performance.now();
  
  return () => {
    const duration = performance.now() - start;
    return duration;
  };
}

/**
 * Measure async function performance
 */
export async function measureAsync<T>(
  name: string,
  type: MetricType,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const endTimer = startTimer(name);
  
  try {
    const result = await fn();
    const duration = endTimer();
    
    logMetric({
      name,
      type,
      duration,
      timestamp: Date.now(),
      metadata,
    });
    
    return result;
  } catch (error) {
    const duration = endTimer();
    
    logMetric({
      name: `${name} (error)`,
      type,
      duration,
      timestamp: Date.now(),
      metadata: { ...metadata, error: String(error) },
    });
    
    throw error;
  }
}

/**
 * Measure sync function performance
 */
export function measureSync<T>(
  name: string,
  type: MetricType,
  fn: () => T,
  metadata?: Record<string, any>
): T {
  const endTimer = startTimer(name);
  
  try {
    const result = fn();
    const duration = endTimer();
    
    logMetric({
      name,
      type,
      duration,
      timestamp: Date.now(),
      metadata,
    });
    
    return result;
  } catch (error) {
    const duration = endTimer();
    
    logMetric({
      name: `${name} (error)`,
      type,
      duration,
      timestamp: Date.now(),
      metadata: { ...metadata, error: String(error) },
    });
    
    throw error;
  }
}

/**
 * Log a performance metric
 */
export function logMetric(metric: PerformanceMetric): void {
  // Store in memory
  metrics.push(metric);
  
  // Keep only last 1000 metrics
  if (metrics.length > 1000) {
    metrics.shift();
  }
  
  // Check against thresholds
  const threshold = getThreshold(metric.type);
  if (metric.duration > threshold) {
    console.warn(`Performance warning: ${metric.name} took ${metric.duration.toFixed(2)}ms (threshold: ${threshold}ms)`);
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      captureMessage(`Slow ${metric.type}: ${metric.name}`, 'warning', {
        extra: metric as unknown as Record<string, unknown>,
      });
    }
  }
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`⏱️ ${metric.name}: ${metric.duration.toFixed(2)}ms`);
  }
}

/**
 * Get threshold for metric type
 */
function getThreshold(type: MetricType): number {
  switch (type) {
    case 'api':
      return THRESHOLDS.API_RESPONSE;
    case 'database':
      return THRESHOLDS.DATABASE_QUERY;
    case 'render':
      return THRESHOLDS.RENDER;
    default:
      return THRESHOLDS.API_RESPONSE;
  }
}

/**
 * Get all metrics
 */
export function getMetrics(): PerformanceMetric[] {
  return [...metrics];
}

/**
 * Get metrics by type
 */
export function getMetricsByType(type: MetricType): PerformanceMetric[] {
  return metrics.filter(m => m.type === type);
}

/**
 * Get average duration for a metric name
 */
export function getAverageDuration(name: string): number {
  const filtered = metrics.filter(m => m.name === name);
  if (filtered.length === 0) return 0;
  
  const sum = filtered.reduce((acc, m) => acc + m.duration, 0);
  return sum / filtered.length;
}

/**
 * Get slowest metrics
 */
export function getSlowestMetrics(limit: number = 10): PerformanceMetric[] {
  return [...metrics]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, limit);
}

/**
 * Clear all metrics
 */
export function clearMetrics(): void {
  metrics.length = 0;
}

/**
 * Generate performance report
 */
export function generateReport(): {
  totalMetrics: number;
  averages: Record<MetricType, number>;
  slowest: PerformanceMetric[];
  warnings: number;
} {
  const types: MetricType[] = ['api', 'database', 'render', 'custom'];
  
  const averages = types.reduce((acc, type) => {
    const typeMetrics = getMetricsByType(type);
    const avg = typeMetrics.length > 0
      ? typeMetrics.reduce((sum, m) => sum + m.duration, 0) / typeMetrics.length
      : 0;
    acc[type] = avg;
    return acc;
  }, {} as Record<MetricType, number>);
  
  const warnings = metrics.filter(m => m.duration > getThreshold(m.type)).length;
  
  return {
    totalMetrics: metrics.length,
    averages,
    slowest: getSlowestMetrics(5),
    warnings,
  };
}

/**
 * React hook for measuring component render time
 */
export function useRenderMetric(componentName: string) {
  if (typeof window === 'undefined') return;
  
  const endTimer = startTimer(`${componentName} render`);
  
  // Measure on mount and unmount
  return () => {
    const duration = endTimer();
    logMetric({
      name: `${componentName} render`,
      type: 'render',
      duration,
      timestamp: Date.now(),
    });
  };
}
