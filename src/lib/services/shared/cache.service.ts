/**
 * Cache Service
 */

export class CacheService {
  private static cache = new Map<string, { value: unknown; expiry: number }>();

  static set(key: string, value: unknown, ttlSeconds = 300) {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiry });
  }

  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  static delete(key: string) {
    this.cache.delete(key);
  }

  static clear() {
    this.cache.clear();
  }

  static has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  static async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds = 300
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const value = await fetcher();
    this.set(key, value, ttlSeconds);
    return value;
  }
}
