/**
 * Advanced Caching Utilities
 * Redis-based caching with automatic invalidation
 */

import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  // Return null if Redis is not configured
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('[Upstash Redis] Redis is not configured. Caching will be disabled.');
    return null;
  }

  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  return redis;
}

/**
 * Cache configuration
 */
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

/**
 * Cache key prefixes for organization
 */
export const CACHE_PREFIX = {
  USER: 'user:',
  EVENT: 'event:',
  TICKET: 'ticket:',
  ORDER: 'order:',
  ANALYTICS: 'analytics:',
  QUERY: 'query:',
} as const;

/**
 * Get cached data with automatic JSON parsing
 */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient();
    if (!client) return null;
    
    const cached = await client.get(key);
    return cached as T | null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Set cached data with TTL
 */
export async function setCached<T>(
  key: string,
  value: T,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;
    
    await client.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

/**
 * Delete cached data
 */
export async function deleteCached(key: string): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;
    
    await client.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}

/**
 * Delete multiple cached keys by pattern
 */
export async function deleteCachedPattern(pattern: string): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;
    
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    console.error('Cache pattern delete error:', error);
  }
}

/**
 * Cache wrapper for functions
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try to get from cache
  const cached = await getCached<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Execute function and cache result
  const result = await fn();
  await setCached(key, result, ttl);
  return result;
}

/**
 * Invalidate cache for a resource
 */
export async function invalidateCache(
  prefix: string,
  id?: string
): Promise<void> {
  if (id) {
    await deleteCached(`${prefix}${id}`);
  } else {
    await deleteCachedPattern(`${prefix}*`);
  }
}

/**
 * Cache warming - preload frequently accessed data
 */
export async function warmCache<T>(
  keys: Array<{ key: string; fn: () => Promise<T>; ttl?: number }>
): Promise<void> {
  await Promise.all(
    keys.map(({ key, fn, ttl }) => withCache(key, fn, ttl))
  );
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  keys: number;
}> {
  try {
    const client = getRedisClient();
    if (!client) return { keys: 0 };
    
    const keys = await client.dbsize();
    
    return {
      keys,
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return { keys: 0 };
  }
}
