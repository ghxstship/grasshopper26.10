import { getCache, setCache, deleteCache, deleteCachePattern, getCacheOrSet, invalidateResource, CACHE_TTL, CACHE_PREFIX,  } from '@/lib/cache';

// Mock Redis
const mockRedis = {
  get: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
  on: jest.fn(),
};

// Mock the redis module
jest.mock('ioredis', () => {
  return jest.fn(() => mockRedis);
});

describe('Cache Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CACHE_TTL Constants', () => {
    it('should have correct TTL values', () => {
      expect(CACHE_TTL.SHORT).toBe(60);
      expect(CACHE_TTL.MEDIUM).toBe(300);
      expect(CACHE_TTL.LONG).toBe(3600);
      expect(CACHE_TTL.DAY).toBe(86400);
    });
  });

  describe('CACHE_PREFIX Constants', () => {
    it('should have all required prefixes', () => {
      expect(CACHE_PREFIX.USER).toBe('user:');
      expect(CACHE_PREFIX.EVENT).toBe('event:');
      expect(CACHE_PREFIX.VENUE).toBe('venue:');
      expect(CACHE_PREFIX.ARTIST).toBe('artist:');
      expect(CACHE_PREFIX.PRODUCT).toBe('product:');
      expect(CACHE_PREFIX.ORDER).toBe('order:');
      expect(CACHE_PREFIX.TICKET).toBe('ticket:');
      expect(CACHE_PREFIX.ORGANIZATION).toBe('org:');
      expect(CACHE_PREFIX.SESSION).toBe('session:');
    });
  });

  describe('getCache', () => {
    it('should return null when redis is not available', async () => {
      const result = await getCache('test-key');
      expect(result).toBeNull();
    });

    it('should return null when key does not exist', async () => {
      mockRedis.get.mockResolvedValue(null);
      const result = await getCache('nonexistent');
      expect(result).toBeNull();
    });

    it('should parse and return cached value', async () => {
      const testData = { id: 1, name: 'Test' };
      mockRedis.get.mockResolvedValue(JSON.stringify(testData));
      
      const result = await getCache<typeof testData>('test-key');
      expect(result).toEqual(testData);
    });

    it('should handle JSON parse errors', async () => {
      mockRedis.get.mockResolvedValue('invalid json');
      const result = await getCache('test-key');
      expect(result).toBeNull();
    });

    it('should handle redis errors', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis error'));
      const result = await getCache('test-key');
      expect(result).toBeNull();
    });
  });

  describe('setCache', () => {
    it('should return false when redis is not available', async () => {
      const result = await setCache('test-key', 'value');
      expect(result).toBe(false);
    });

    it('should serialize and store value with default TTL', async () => {
      mockRedis.setex.mockResolvedValue('OK');
      const testData = { id: 1, name: 'Test' };
      
      const result = await setCache('test-key', testData);
      
      expect(result).toBe(true);
      expect(mockRedis.setex).toHaveBeenCalledWith(
        'test-key',
        CACHE_TTL.MEDIUM,
        JSON.stringify(testData)
      );
    });

    it('should use custom TTL when provided', async () => {
      mockRedis.setex.mockResolvedValue('OK');
      const customTTL = 600;
      
      await setCache('test-key', 'value', customTTL);
      
      expect(mockRedis.setex).toHaveBeenCalledWith(
        'test-key',
        customTTL,
        JSON.stringify('value')
      );
    });

    it('should handle redis errors', async () => {
      mockRedis.setex.mockRejectedValue(new Error('Redis error'));
      const result = await setCache('test-key', 'value');
      expect(result).toBe(false);
    });

    it('should handle complex objects', async () => {
      mockRedis.setex.mockResolvedValue('OK');
      const complexData = {
        user: { id: 1, name: 'Test' },
        metadata: { created: new Date().toISOString() },
        tags: ['tag1', 'tag2'],
      };
      
      const result = await setCache('test-key', complexData);
      expect(result).toBe(true);
    });
  });

  describe('deleteCache', () => {
    it('should return false when redis is not available', async () => {
      const result = await deleteCache('test-key');
      expect(result).toBe(false);
    });

    it('should delete key and return true', async () => {
      mockRedis.del.mockResolvedValue(1);
      
      const result = await deleteCache('test-key');
      
      expect(result).toBe(true);
      expect(mockRedis.del).toHaveBeenCalledWith('test-key');
    });

    it('should handle redis errors', async () => {
      mockRedis.del.mockRejectedValue(new Error('Redis error'));
      const result = await deleteCache('test-key');
      expect(result).toBe(false);
    });
  });

  describe('deleteCachePattern', () => {
    it('should return false when redis is not available', async () => {
      const result = await deleteCachePattern('test:*');
      expect(result).toBe(false);
    });

    it('should delete all matching keys', async () => {
      const matchingKeys = ['test:1', 'test:2', 'test:3'];
      mockRedis.keys.mockResolvedValue(matchingKeys);
      mockRedis.del.mockResolvedValue(3);
      
      const result = await deleteCachePattern('test:*');
      
      expect(result).toBe(true);
      expect(mockRedis.keys).toHaveBeenCalledWith('test:*');
      expect(mockRedis.del).toHaveBeenCalledWith(...matchingKeys);
    });

    it('should handle no matching keys', async () => {
      mockRedis.keys.mockResolvedValue([]);
      
      const result = await deleteCachePattern('test:*');
      
      expect(result).toBe(true);
      expect(mockRedis.del).not.toHaveBeenCalled();
    });

    it('should handle redis errors', async () => {
      mockRedis.keys.mockRejectedValue(new Error('Redis error'));
      const result = await deleteCachePattern('test:*');
      expect(result).toBe(false);
    });
  });

  describe('getCacheOrSet', () => {
    const mockFetcher = jest.fn();

    beforeEach(() => {
      mockFetcher.mockClear();
    });

    it('should return cached value if exists', async () => {
      const cachedData = { id: 1, name: 'Cached' };
      mockRedis.get.mockResolvedValue(JSON.stringify(cachedData));
      mockFetcher.mockResolvedValue({ id: 2, name: 'Fresh' });
      
      const result = await getCacheOrSet('test-key', mockFetcher);
      
      expect(result).toEqual(cachedData);
      expect(mockFetcher).not.toHaveBeenCalled();
    });

    it('should fetch and cache if not in cache', async () => {
      const freshData = { id: 1, name: 'Fresh' };
      mockRedis.get.mockResolvedValue(null);
      mockRedis.setex.mockResolvedValue('OK');
      mockFetcher.mockResolvedValue(freshData);
      
      const result = await getCacheOrSet('test-key', mockFetcher);
      
      expect(result).toEqual(freshData);
      expect(mockFetcher).toHaveBeenCalledTimes(1);
      expect(mockRedis.setex).toHaveBeenCalled();
    });

    it('should use custom TTL', async () => {
      const freshData = { id: 1, name: 'Fresh' };
      mockRedis.get.mockResolvedValue(null);
      mockRedis.setex.mockResolvedValue('OK');
      mockFetcher.mockResolvedValue(freshData);
      const customTTL = 1800;
      
      await getCacheOrSet('test-key', mockFetcher, customTTL);
      
      expect(mockRedis.setex).toHaveBeenCalledWith(
        'test-key',
        customTTL,
        JSON.stringify(freshData)
      );
    });

    it('should handle fetcher errors', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockFetcher.mockRejectedValue(new Error('Fetch error'));
      
      await expect(getCacheOrSet('test-key', mockFetcher)).rejects.toThrow('Fetch error');
    });
  });

  describe('invalidateResource', () => {
    it('should delete main key and pattern', async () => {
      mockRedis.del.mockResolvedValue(1);
      mockRedis.keys.mockResolvedValue(['user:123:profile', 'user:123:settings']);
      
      await invalidateResource(CACHE_PREFIX.USER, '123');
      
      expect(mockRedis.del).toHaveBeenCalledWith('user:123');
      expect(mockRedis.keys).toHaveBeenCalledWith('user:123:*');
    });

    it('should handle resources with no related keys', async () => {
      mockRedis.del.mockResolvedValue(1);
      mockRedis.keys.mockResolvedValue([]);
      
      await invalidateResource(CACHE_PREFIX.EVENT, '456');
      
      expect(mockRedis.del).toHaveBeenCalledWith('event:456');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings', async () => {
      mockRedis.get.mockResolvedValue('""');
      const result = await getCache<string>('test-key');
      expect(result).toBe('');
    });

    it('should handle null values', async () => {
      mockRedis.setex.mockResolvedValue('OK');
      const result = await setCache('test-key', null);
      expect(result).toBe(true);
    });

    it('should handle undefined values', async () => {
      mockRedis.setex.mockResolvedValue('OK');
      const result = await setCache('test-key', undefined);
      expect(result).toBe(true);
    });

    it('should handle arrays', async () => {
      mockRedis.get.mockResolvedValue('[1,2,3]');
      const result = await getCache<number[]>('test-key');
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle nested objects', async () => {
      const nested = {
        level1: {
          level2: {
            level3: 'deep value',
          },
        },
      };
      mockRedis.get.mockResolvedValue(JSON.stringify(nested));
      const result = await getCache<typeof nested>('test-key');
      expect(result).toEqual(nested);
    });

    it('should handle special characters in keys', async () => {
      mockRedis.setex.mockResolvedValue('OK');
      const specialKey = 'user:email:test@example.com';
      
      await setCache(specialKey, 'value');
      expect(mockRedis.setex).toHaveBeenCalledWith(
        specialKey,
        CACHE_TTL.MEDIUM,
        JSON.stringify('value')
      );
    });

    it('should handle very large objects', async () => {
      const largeObject = {
        data: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          value: `item-${i}`,
        })),
      };
      mockRedis.setex.mockResolvedValue('OK');
      
      const result = await setCache('large-key', largeObject);
      expect(result).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should maintain type information with generics', async () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const user: User = { id: 1, name: 'Test', email: 'test@example.com' };
      mockRedis.get.mockResolvedValue(JSON.stringify(user));
      
      const result = await getCache<User>('user:1');
      
      if (result) {
        expect(result.id).toBe(1);
        expect(result.name).toBe('Test');
        expect(result.email).toBe('test@example.com');
      }
    });
  });
});
