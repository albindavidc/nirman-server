import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { RedisService } from './redis.service';

export interface SessionData {
  userId: string;
  refreshTokenHash: string;
  deviceInfo: string;
  ip: string;
  createdAt: string;
}

@Injectable()
export class SessionService {
  private readonly sessionTtlSeconds: number;

  constructor(
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.sessionTtlSeconds = parseInt(
      this.configService.get<string>('SESSION_TTL_SECONDS', '604800'),
      10,
    );
  }

  private buildKey(userId: string, refreshToken: string): string {
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    return `session:${userId}:${tokenHash}`;
  }

  async createSession(
    userId: string,
    refreshToken: string,
    deviceInfo: string,
    ip: string,
  ): Promise<void> {
    const key = this.buildKey(userId, refreshToken);
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

    const data: SessionData = {
      userId,
      refreshTokenHash: tokenHash,
      deviceInfo,
      ip,
      createdAt: new Date().toISOString(),
    };

    await this.redis.set(key, data, this.sessionTtlSeconds);
  }

  async validateSession(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const key = this.buildKey(userId, refreshToken);
    return this.redis.exists(key);
  }

  async deleteSession(userId: string, refreshToken: string): Promise<void> {
    const key = this.buildKey(userId, refreshToken);
    await this.redis.del(key);
  }

  /** Delete all active sessions for a user (e.g. on password reset / force logout). */
  async deleteAllSessions(userId: string): Promise<void> {
    await this.redis.delByPattern(`session:${userId}:*`);
  }
}
