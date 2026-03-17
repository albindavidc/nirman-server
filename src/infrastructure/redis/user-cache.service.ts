import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

export interface CachedPermissions {
  roles: string[];
  orgId?: string;
  features?: string[];
}

@Injectable()
export class UserCacheService {
  private readonly permissionsTtlSeconds: number;
  private readonly profileTtlSeconds: number;

  constructor(
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.permissionsTtlSeconds = parseInt(
      this.configService.get<string>('PERMISSIONS_TTL_SECONDS', '3600'),
      10,
    );
    this.profileTtlSeconds = parseInt(
      this.configService.get<string>('PROFILE_TTL_SECONDS', '1800'),
      10,
    );
  }

  // ─── Permissions ─────────────────────────────────────────────────────────────

  async getPermissions(userId: string): Promise<CachedPermissions | null> {
    return this.redis.get<CachedPermissions>(`user:permissions:${userId}`);
  }

  async setPermissions(userId: string, data: CachedPermissions): Promise<void> {
    await this.redis.set(
      `user:permissions:${userId}`,
      data,
      this.permissionsTtlSeconds,
    );
  }

  async invalidatePermissions(userId: string): Promise<void> {
    await this.redis.del(`user:permissions:${userId}`);
  }

  // ─── Profile ─────────────────────────────────────────────────────────────────

  async getProfile<T>(userId: string): Promise<T | null> {
    return this.redis.get<T>(`user:profile:v2:${userId}`);
  }

  async setProfile<T>(userId: string, data: T): Promise<void> {
    await this.redis.set(
      `user:profile:v2:${userId}`,
      data,
      this.profileTtlSeconds,
    );
  }

  async invalidateProfile(userId: string): Promise<void> {
    await this.redis.del(`user:profile:v2:${userId}`);
  }
}
