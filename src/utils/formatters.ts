/**
 * Locale-aware formatting utilities
 * Required for internationalization (i18n) support
 */

export class Formatters {
  private locale: string;
  
  constructor(locale: string = 'en-US') {
    this.locale = locale;
  }
  
  /**
   * Format date according to locale
   */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.locale, {
      dateStyle: 'medium',
      ...options,
    }).format(date);
  }
  
  /**
   * Format number according to locale
   */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.locale, options).format(value);
  }
  
  /**
   * Format currency according to locale
   */
  formatCurrency(
    value: number, 
    currency: string = 'USD',
    options?: Intl.NumberFormatOptions
  ): string {
    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency,
      ...options,
    }).format(value);
  }
  
  /**
   * Format relative time (e.g., "2 hours ago")
   */
  formatRelativeTime(
    value: number, 
    unit: Intl.RelativeTimeFormatUnit
  ): string {
    return new Intl.RelativeTimeFormat(this.locale, {
      numeric: 'auto',
    }).format(value, unit);
  }
  
  /**
   * Format list according to locale
   */
  formatList(items: string[], options?: Intl.ListFormatOptions): string {
    return new Intl.ListFormat(this.locale, {
      style: 'long',
      type: 'conjunction',
      ...options,
    }).format(items);
  }
}

// Default formatter instance
export const formatters = new Formatters();
