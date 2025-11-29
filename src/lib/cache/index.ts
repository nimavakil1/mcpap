import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn('REDIS_URL not configured, caching disabled');
    return null;
  }

  if (!redis) {
    try {
      redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryDelayOnFailover: 100,
        enableOfflineQueue: false,
      });

      redis.on('error', (err) => {
        console.error('Redis connection error:', err);
      });

      redis.on('connect', () => {
        console.log('Redis connected');
      });
    } catch (error) {
      console.error('Failed to create Redis client:', error);
      return null;
    }
  }

  return redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  expirationSeconds: number = 300
): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.setex(key, expirationSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}

export async function cacheDelete(key: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
}

export async function cacheDeletePattern(pattern: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Cache delete pattern error:', error);
    return false;
  }
}

// Cache keys
export const CACHE_KEYS = {
  CATEGORIES: 'categories:all',
  CATEGORY: (slug: string) => `category:${slug}`,
  PRODUCTS: (page: number, filters: string) => `products:${page}:${filters}`,
  PRODUCT: (slug: string) => `product:${slug}`,
  SEARCH: (query: string) => `search:${query}`,
  USER_CART: (userId: string) => `cart:${userId}`,
  SETTINGS: 'settings:all',
};

// Cache durations in seconds
export const CACHE_DURATION = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
};
