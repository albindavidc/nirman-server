import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      await this.client.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (err) {
      this.logger.error(
        `Redis SET failed for key "${key}": ${(err as Error).message}`,
      );
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.client.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      this.logger.error(
        `Redis GET failed for key "${key}": ${(err as Error).message}`,
      );
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err) {
      this.logger.error(
        `Redis DEL failed for key "${key}": ${(err as Error).message}`,
      );
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (err) {
      this.logger.error(
        `Redis EXISTS failed for key "${key}": ${(err as Error).message}`,
      );
      return false;
    }
  }

  /**
   * Atomically increment a counter, optionally setting TTL only on the first increment.
   * Returns the new count.
   */
  async increment(key: string, ttlSeconds?: number): Promise<number> {
    try {
      const count = await this.client.incr(key);
      // Set TTL only when creating the key for the first time
      if (count === 1 && ttlSeconds) {
        await this.client.expire(key, ttlSeconds);
      }
      return count;
    } catch (err) {
      this.logger.error(
        `Redis INCR failed for key "${key}": ${(err as Error).message}`,
      );
      return 0;
    }
  }

  /** Scan and delete all keys matching a glob pattern (use sparingly). */
  async delByPattern(pattern: string): Promise<void> {
    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.client.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100,
        );
        cursor = nextCursor;
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== '0');
    } catch (err) {
      this.logger.error(
        `Redis DEL by pattern "${pattern}" failed: ${(err as Error).message}`,
      );
    }
  }
}
