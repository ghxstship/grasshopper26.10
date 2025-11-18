/**
 * Analytics Tracking System
 * User behavior, conversion, and performance tracking
 */

export enum EventType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  FORM_SUBMIT = 'form_submit',
  CONVERSION = 'conversion',
  ERROR = 'error',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom',
}

export interface AnalyticsEvent {
  type: EventType;
  name: string;
  properties?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  page?: string;
  referrer?: string;
}

export interface UserProperties {
  userId: string;
  email?: string;
  name?: string;
  role?: string;
  plan?: string;
  signupDate?: string;
  [key: string]: any;
}

export interface ConversionEvent {
  name: string;
  value?: number;
  currency?: string;
  properties?: Record<string, any>;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private userProperties: UserProperties | null = null;
  private sessionId: string;
  private eventCallbacks: Array<(event: AnalyticsEvent) => void> = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  /**
   * Initialize tracking
   */
  private initializeTracking(): void {
    if (typeof window === 'undefined') return;

    // Track page views
    this.trackPageView();

    // Track navigation
    if ('navigation' in window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.trackPerformance('page_load', {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstPaint: this.getFirstPaint(),
      });
    }
  }

  /**
   * Set user properties
   */
  identify(properties: UserProperties): void {
    this.userProperties = properties;
    this.track(EventType.CUSTOM, 'user_identified', properties);
  }

  /**
   * Track event
   */
  track(
    type: EventType,
    name: string,
    properties?: Record<string, any>
  ): void {
    const event: AnalyticsEvent = {
      type,
      name,
      properties,
      timestamp: new Date().toISOString(),
      userId: this.userProperties?.userId,
      sessionId: this.sessionId,
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    };

    this.events.push(event);
    this.notifyCallbacks(event);
    this.sendToBackend(event);
  }

  /**
   * Track page view
   */
  trackPageView(properties?: Record<string, any>): void {
    if (typeof window === 'undefined') return;

    this.track(EventType.PAGE_VIEW, window.location.pathname, {
      ...properties,
      title: document.title,
      url: window.location.href,
    });
  }

  /**
   * Track click
   */
  trackClick(
    element: string,
    properties?: Record<string, any>
  ): void {
    this.track(EventType.CLICK, element, properties);
  }

  /**
   * Track form submission
   */
  trackFormSubmit(
    formName: string,
    properties?: Record<string, any>
  ): void {
    this.track(EventType.FORM_SUBMIT, formName, properties);
  }

  /**
   * Track conversion
   */
  trackConversion(conversion: ConversionEvent): void {
    this.track(EventType.CONVERSION, conversion.name, {
      value: conversion.value,
      currency: conversion.currency || 'USD',
      ...conversion.properties,
    });
  }

  /**
   * Track error
   */
  trackError(
    error: Error | string,
    properties?: Record<string, any>
  ): void {
    const message = typeof error === 'string' ? error : error.message;
    this.track(EventType.ERROR, message, {
      ...properties,
      stack: typeof error === 'string' ? undefined : error.stack,
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(
    metric: string,
    value: number | Record<string, number>
  ): void {
    this.track(EventType.PERFORMANCE, metric, 
      typeof value === 'number' ? { value } : value
    );
  }

  /**
   * Subscribe to events
   */
  onEvent(callback: (event: AnalyticsEvent) => void): () => void {
    this.eventCallbacks.push(callback);
    return () => {
      const index = this.eventCallbacks.indexOf(callback);
      if (index > -1) {
        this.eventCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Get events
   */
  getEvents(filter?: {
    type?: EventType;
    since?: string;
    userId?: string;
  }): AnalyticsEvent[] {
    let filtered = this.events;

    if (filter?.type) {
      filtered = filtered.filter((e) => e.type === filter.type);
    }

    if (filter?.since) {
      const sinceTime = new Date(filter.since).getTime();
      filtered = filtered.filter((e) => {
        const eventTime = new Date(e.timestamp).getTime();
        return eventTime >= sinceTime;
      });
    }

    if (filter?.userId) {
      filtered = filtered.filter((e) => e.userId === filter.userId);
    }

    return filtered;
  }

  /**
   * Get analytics metrics
   */
  getMetrics() {
    const events = this.events;
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;

    return {
      totalEvents: events.length,
      last24h: events.filter((e) => new Date(e.timestamp).getTime() > last24h).length,
      byType: {
        pageViews: events.filter((e) => e.type === EventType.PAGE_VIEW).length,
        clicks: events.filter((e) => e.type === EventType.CLICK).length,
        formSubmits: events.filter((e) => e.type === EventType.FORM_SUBMIT).length,
        conversions: events.filter((e) => e.type === EventType.CONVERSION).length,
        errors: events.filter((e) => e.type === EventType.ERROR).length,
      },
      uniqueUsers: new Set(events.map((e) => e.userId).filter(Boolean)).size,
      topPages: this.getTopPages(10),
      conversionValue: this.getTotalConversionValue(),
    };
  }

  /**
   * Get top pages
   */
  private getTopPages(limit: number = 10): Array<{ page: string; views: number }> {
    const pageViews = this.events.filter((e) => e.type === EventType.PAGE_VIEW);
    const pageCounts = new Map<string, number>();

    pageViews.forEach((e) => {
      if (e.page) {
        pageCounts.set(e.page, (pageCounts.get(e.page) || 0) + 1);
      }
    });

    return Array.from(pageCounts.entries())
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  /**
   * Get total conversion value
   */
  private getTotalConversionValue(): number {
    return this.events
      .filter((e) => e.type === EventType.CONVERSION)
      .reduce((sum, e) => sum + (e.properties?.value || 0), 0);
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get first paint time
   */
  private getFirstPaint(): number | undefined {
    if (typeof window === 'undefined') return undefined;

    const paintEntries = window.performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find((entry) => entry.name === 'first-paint');
    return firstPaint?.startTime;
  }

  /**
   * Notify callbacks
   */
  private notifyCallbacks(event: AnalyticsEvent): void {
    this.eventCallbacks.forEach((callback) => {
      try {
        callback(event);
      } catch (err) {
        console.error('Error in analytics callback:', err);
      }
    });
  }

  /**
   * Send event to backend
   */
  private async sendToBackend(event: AnalyticsEvent): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }
}

// Singleton instance
export const analytics = new Analytics();

/**
 * React hook for analytics
 */
export function useAnalytics() {
  return {
    track: (name: string, properties?: Record<string, any>) =>
      analytics.track(EventType.CUSTOM, name, properties),
    trackPageView: (properties?: Record<string, any>) =>
      analytics.trackPageView(properties),
    trackClick: (element: string, properties?: Record<string, any>) =>
      analytics.trackClick(element, properties),
    trackFormSubmit: (formName: string, properties?: Record<string, any>) =>
      analytics.trackFormSubmit(formName, properties),
    trackConversion: (conversion: ConversionEvent) =>
      analytics.trackConversion(conversion),
    identify: (properties: UserProperties) =>
      analytics.identify(properties),
  };
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  /**
   * Monitor Core Web Vitals
   */
  static monitorWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    this.observeLCP();

    // First Input Delay (FID)
    this.observeFID();

    // Cumulative Layout Shift (CLS)
    this.observeCLS();
  }

  /**
   * Observe LCP
   */
  private static observeLCP(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      const lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
      
      analytics.trackPerformance('lcp', lcp);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  /**
   * Observe FID
   */
  private static observeFID(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
        analytics.trackPerformance('fid', fid);
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
  }

  /**
   * Observe CLS
   */
  private static observeCLS(): void {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!(entry as LayoutShift).hadRecentInput) {
          clsValue += (entry as LayoutShift).value;
        }
      });

      analytics.trackPerformance('cls', clsValue);
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }
}

// Initialize web vitals monitoring
if (typeof window !== 'undefined') {
  PerformanceMonitor.monitorWebVitals();
}

// Type definitions for Performance API
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}
