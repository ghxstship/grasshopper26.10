/**
 * Date and Time Utilities
 * Comprehensive date/time manipulation and formatting functions
 */

/**
 * Get the start of day for a given date
 */
export function startOfDay(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of day for a given date
 */
export function endOfDay(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Add months to a date
 */
export function addMonths(date: Date | string, months: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * Add years to a date
 */
export function addYears(date: Date | string, years: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

/**
 * Get difference between two dates in days
 */
export function diffInDays(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get difference between two dates in hours
 */
export function diffInHours(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60));
}

/**
 * Get difference between two dates in minutes
 */
export function diffInMinutes(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60));
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d > new Date();
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

/**
 * Check if two dates are on the same day
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return d1.toDateString() === d2.toDateString();
}

/**
 * Format date as relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const isPast = diffMs < 0;

  if (diffSec < 60) {
    return isPast ? 'just now' : 'in a moment';
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return isPast ? `${diffMin} minute${diffMin > 1 ? 's' : ''} ago` : `in ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
  }

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return isPast ? `${diffHour} hour${diffHour > 1 ? 's' : ''} ago` : `in ${diffHour} hour${diffHour > 1 ? 's' : ''}`;
  }

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) {
    return isPast ? `${diffDay} day${diffDay > 1 ? 's' : ''} ago` : `in ${diffDay} day${diffDay > 1 ? 's' : ''}`;
  }

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4) {
    return isPast ? `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago` : `in ${diffWeek} week${diffWeek > 1 ? 's' : ''}`;
  }

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) {
    return isPast ? `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago` : `in ${diffMonth} month${diffMonth > 1 ? 's' : ''}`;
  }

  const diffYear = Math.floor(diffDay / 365);
  return isPast ? `${diffYear} year${diffYear > 1 ? 's' : ''} ago` : `in ${diffYear} year${diffYear > 1 ? 's' : ''}`;
}

/**
 * Format time only (e.g., "2:30 PM")
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

/**
 * Format date range (e.g., "Jan 1 - Jan 5, 2024")
 */
export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth && start.getDate() === end.getDate()) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(start);
  }

  const startFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  }).format(start);

  const endFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(end);

  return `${startFormat} - ${endFormat}`;
}

/**
 * Get the start of week for a given date
 */
export function startOfWeek(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

/**
 * Get the end of week for a given date
 */
export function endOfWeek(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (6 - day);
  return new Date(d.setDate(diff));
}

/**
 * Get the start of month for a given date
 */
export function startOfMonth(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * Get the end of month for a given date
 */
export function endOfMonth(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/**
 * Parse ISO date string to Date object
 */
export function parseISODate(isoString: string): Date {
  return new Date(isoString);
}

/**
 * Format date to ISO string
 */
export function toISOString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Get timezone offset in hours
 */
export function getTimezoneOffset(): number {
  return new Date().getTimezoneOffset() / 60;
}

/**
 * Convert date to UTC
 */
export function toUTC(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
}

/**
 * Convert UTC date to local time
 */
export function fromUTC(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000);
}
