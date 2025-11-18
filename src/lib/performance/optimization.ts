/**
 * Performance Optimization Utilities
 * Debouncing, throttling, memoization, and lazy loading helpers
 */

/**
 * Debounce function - delays execution until after wait time
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - limits execution to once per wait time
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
    
    return lastResult;
  };
}

/**
 * Memoize function results
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Memoize with TTL (time-to-live)
 */
export function memoizeWithTTL<T extends (...args: any[]) => any>(
  func: T,
  ttl: number
): T {
  const cache = new Map<string, { value: ReturnType<T>; expiry: number }>();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const now = Date.now();
    
    const cached = cache.get(key);
    if (cached && cached.expiry > now) {
      return cached.value;
    }
    
    const result = func(...args);
    cache.set(key, {
      value: result,
      expiry: now + ttl,
    });
    
    return result;
  }) as T;
}

/**
 * Lazy load a module
 */
export async function lazyLoad<T>(
  importFn: () => Promise<{ default: T }>
): Promise<T> {
  const loadedModule = await importFn();
  return loadedModule.default;
}

/**
 * Batch multiple async operations
 */
export async function batchAsync<T>(
  operations: (() => Promise<T>)[],
  batchSize: number = 5
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(op => op()));
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Retry async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

/**
 * Create a queue for sequential async operations
 */
export class AsyncQueue {
  private queue: (() => Promise<any>)[] = [];
  private running = false;
  
  async add<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.process();
    });
  }
  
  private async process(): Promise<void> {
    if (this.running || this.queue.length === 0) {
      return;
    }
    
    this.running = true;
    
    while (this.queue.length > 0) {
      const operation = this.queue.shift()!;
      await operation();
    }
    
    this.running = false;
  }
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  
  return chunks;
}

/**
 * Sleep/delay utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Timeout wrapper for promises
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError: string = 'Operation timed out'
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(timeoutError)), timeoutMs);
  });
  
  return Promise.race([promise, timeout]);
}

/**
 * Create a singleton instance
 */
export function singleton<T>(factory: () => T): () => T {
  let instance: T | null = null;
  
  return () => {
    if (instance === null) {
      instance = factory();
    }
    return instance;
  };
}

/**
 * Deep clone object (performance optimized)
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any;
  }
  
  if (obj instanceof Object) {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
}
