import { Injectable } from '@nestjs/common';

interface ResetTokenRecord {
  token: string;
  expiresAt: Date;
  email: string;
}

import { IResetTokenStorageService } from '../../../application/interfaces/reset-token-storage.interface';

@Injectable()
export class ResetTokenStorageService implements IResetTokenStorageService {
  private tokenStore: Map<string, ResetTokenRecord> = new Map();

  generateResetToken(): string {
    // Generate a secure random token
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }

  storeResetToken(email: string, token: string): void {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    this.tokenStore.set(email.toLowerCase(), {
      token,
      expiresAt,
      email: email.toLowerCase(),
    });
  }

  getResetToken(email: string): ResetTokenRecord | undefined {
    return this.tokenStore.get(email.toLowerCase());
  }

  deleteResetToken(email: string): void {
    this.tokenStore.delete(email.toLowerCase());
  }

  validateResetToken(
    email: string,
    token: string,
  ): { valid: boolean; message: string } {
    const record = this.tokenStore.get(email.toLowerCase());

    if (!record) {
      return { valid: false, message: 'No reset token found for this email' };
    }

    if (new Date() > record.expiresAt) {
      this.deleteResetToken(email);
      return { valid: false, message: 'Reset token has expired' };
    }

    if (record.token !== token) {
      return { valid: false, message: 'Invalid reset token' };
    }

    // Token is valid, remove it from store (one-time use)
    this.deleteResetToken(email);
    return { valid: true, message: 'Reset token verified successfully' };
  }
}
