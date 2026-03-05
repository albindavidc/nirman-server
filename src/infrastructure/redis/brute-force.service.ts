import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Injectable()
export class BruteForceService {
  private readonly ttlSeconds: number;
  private readonly maxAttempts: number;

  constructor(
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.ttlSeconds = parseInt(
      this.configService.get<string>('BRUTE_FORCE_TTL_SECONDS', '900'),
      10,
    );
    this.maxAttempts = parseInt(
      this.configService.get<string>('MAX_ATTEMPTS', '5'),
      10,
    );
  }

  private buildKey(ip: string): string {
    return `failed_login:${ip}`;
  }

  async recordFailedAttempt(ip: string): Promise<number> {
    const key = this.buildKey(ip);
    return this.redis.increment(key, this.ttlSeconds);
  }

  async clearAttempts(ip: string): Promise<void> {
    const key = this.buildKey(ip);
    await this.redis.del(key);
  }

  async isBlocked(ip: string): Promise<boolean> {
    const key = this.buildKey(ip);
    const count = await this.redis.get<number>(key);
    return (count ?? 0) >= this.maxAttempts;
  }

  async getAttemptCount(ip: string): Promise<number> {
    const key = this.buildKey(ip);
    const count = await this.redis.get<number>(key);
    return count ?? 0;
  }
}
