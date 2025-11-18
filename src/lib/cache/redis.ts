/**
 * Redis Cache Configuration
 * Provides caching layer for API responses and frequently accessed data
 */

import { Redis } from '@upstash/redis';

/**
 * Validate Redis configuration
 */
function isValidRedisConfig(): boolean {
  const url = process.env.REDIS_URL;
  const token = process.env.REDIS_TOKEN;
  
  // Check if URL and token are provided and not placeholders
  if (!url || !token) return false;
  if (url.includes('localhost') && !token) return false; // localhost doesn't need token
  if (url.includes('[') || token?.includes('[')) return false; // placeholder values
  
  return true;
}

// Initialize Redis client (using Upstash for serverless compatibility)
const redis = isValidRedisConfig()
  ? new Redis({
      url: process.env.REDIS_URL!,
      token: process.env.REDIS_TOKEN!,
    })
  : null;

/**
 * Cache TTL constants (in seconds)
 */
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
  WEEK: 604800, // 7 days
} as const;

/**
 * Cache key prefixes for organization
 */
export const CACHE_PREFIX = {
  USER: 'user:',
  EVENT: 'event:',
  TICKET: 'ticket:',
  PROJECT: 'project:',
  TASK: 'task:',
  ADVANCING: 'advancing:',
  SESSION: 'session:',
} as const;

/**
 * Get value from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) {
    console.warn('Redis not configured, skipping cache read');
    return null;
  }

  try {
    const value = await redis.get<T>(key);
    return value;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

/**
 * Set value in cache with TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<void> {
  if (!redis) {
    console.warn('Redis not configured, skipping cache write');
    return;
  }

  try {
    await redis.set(key, value, { ex: ttl });
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

/**
 * Delete value from cache
 */
export async function deleteCache(key: string): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    await redis.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}

/**
 * Delete multiple keys matching a pattern
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Cache pattern delete error:', error);
  }
}

/**
 * Cache wrapper for functions
 * Automatically caches function results
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try to get from cache first
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Execute function and cache result
  const result = await fn();
  await setCache(key, result, ttl);
  return result;
}

/**
 * Invalidate cache for a specific entity
 */
export async function invalidateEntity(
  prefix: string,
  id: string
): Promise<void> {
  await deleteCachePattern(`${prefix}${id}*`);
}

/**
 * Invalidate all cache for a prefix
 */
export async function invalidatePrefix(prefix: string): Promise<void> {
  await deleteCachePattern(`${prefix}*`);
}

/**
 * Get or set cache with automatic invalidation
 */
export async function getCacheOrSet<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  return withCache(key, fn, ttl);
}

/**
 * Cache statistics (for monitoring)
 */
export async function getCacheStats(): Promise<{
  connected: boolean;
  keyCount?: number;
}> {
  if (!redis) {
    return { connected: false };
  }

  try {
    const keys = await redis.keys('*');
    return {
      connected: true,
      keyCount: keys.length,
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return { connected: false };
  }
}

/**
 * Clear all cache (use with caution!)
 */
export async function clearAllCache(): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    await redis.flushdb();
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}
