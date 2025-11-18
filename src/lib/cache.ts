// Redis client for caching (requires ioredis package)
// Install with: npm install ioredis @types/ioredis
type Redis = {
  get: (key: string) => Promise<string | null>;
  setex: (key: string, ttl: number, value: string) => Promise<string>;
  del: (...keys: string[]) => Promise<number>;
  keys: (pattern: string) => Promise<string[]>;
  on: (event: string, callback: (error?: Error) => void) => void;
};

let redis: Redis | null = null;

// Initialize Redis if URL is provided
async function initRedis() {
  if (process.env.REDIS_URL && !redis) {
    try {
      const Redis = (await import('ioredis' as any)).default;
      redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      redis?.on('error', (err?: Error) => {
        console.error('Redis Client Error:', err);
      });
    } catch (err) {
      console.error('Failed to initialize Redis (optional dependency):', err);
      redis = null;
    }
  }
}

// Initialize on module load
initRedis().catch(console.error);

// Cache configuration
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
};

// Cache key prefixes
export const CACHE_PREFIX = {
  USER: 'user:',
  EVENT: 'event:',
  VENUE: 'venue:',
  ARTIST: 'artist:',
  PRODUCT: 'product:',
  ORDER: 'order:',
  TICKET: 'ticket:',
  ORGANIZATION: 'org:',
  SESSION: 'session:',
};

/**
 * Get value from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null;

  try {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Set value in cache
 */
export async function setCache(
  key: string,
  value: unknown,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<boolean> {
  if (!redis) return false;

  try {
    const serialized = JSON.stringify(value);
    await redis.setex(key, ttl, serialized);
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}

/**
 * Delete value from cache
 */
export async function deleteCache(key: string): Promise<boolean> {
  if (!redis) return false;

  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
}

/**
 * Delete multiple keys matching pattern
 */
export async function deleteCachePattern(pattern: string): Promise<boolean> {
  if (!redis) return false;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Cache pattern delete error:', error);
    return false;
  }
}

/**
 * Get or set cache (cache-aside pattern)
 */
export async function getCacheOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try to get from cache
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const fresh = await fetcher();

  // Store in cache
  await setCache(key, fresh, ttl);

  return fresh;
}

/**
 * Invalidate cache for a resource
 */
export async function invalidateResource(
  prefix: string,
  id: string
): Promise<void> {
  await deleteCache(`${prefix}${id}`);
  await deleteCachePattern(`${prefix}${id}:*`);
}

/**
 * Cache middleware for API routes
 */
export function withCache<T>(
  key: string | ((args: unknown) => string),
  ttl: number = CACHE_TTL.MEDIUM
) {
  return async (
    fetcher: (...args: unknown[]) => Promise<T>,
    ...args: unknown[]
  ): Promise<T> => {
    const cacheKey = typeof key === 'function' ? key(args) : key;
    return getCacheOrSet(cacheKey, () => fetcher(...args), ttl);
  };
}

// Export Redis client for advanced usage
export { redis };
