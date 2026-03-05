import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { IResetTokenStorageService } from '../../../application/interfaces/reset-token-storage.interface';

const RESET_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes
const RESET_TOKEN_PREFIX = 'reset_token:';

@Injectable()
export class ResetTokenStorageService implements IResetTokenStorageService {
  constructor(private readonly redis: RedisService) {}

  generateResetToken(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }

  async storeResetToken(email: string, token: string): Promise<void> {
    const key = `${RESET_TOKEN_PREFIX}${email.toLowerCase()}`;
    await this.redis.set(
      key,
      { token, email: email.toLowerCase() },
      RESET_TOKEN_TTL_SECONDS,
    );
  }

  async getResetToken(
    email: string,
  ): Promise<{ token: string; email: string } | undefined> {
    const key = `${RESET_TOKEN_PREFIX}${email.toLowerCase()}`;
    const result = await this.redis.get<{ token: string; email: string }>(key);
    return result ?? undefined;
  }

  async deleteResetToken(email: string): Promise<void> {
    const key = `${RESET_TOKEN_PREFIX}${email.toLowerCase()}`;
    await this.redis.del(key);
  }

  async validateResetToken(
    email: string,
    token: string,
  ): Promise<{ valid: boolean; message: string }> {
    const record = await this.getResetToken(email);

    if (!record) {
      return { valid: false, message: 'No reset token found for this email' };
    }

    if (record.token !== token) {
      return { valid: false, message: 'Invalid reset token' };
    }

    // One-time use — delete immediately after validation
    await this.deleteResetToken(email);
    return { valid: true, message: 'Reset token verified successfully' };
  }
}
