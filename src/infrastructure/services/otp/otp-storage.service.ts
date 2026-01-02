import { Injectable } from '@nestjs/common';

interface OtpRecord {
  otp: string;
  expiresAt: Date;
  email: string;
}

import { IOtpStorageService } from '../../../application/interfaces/services/otp-storage.interface';

@Injectable()
export class OtpStorageService implements IOtpStorageService {
  private otpStore: Map<string, OtpRecord> = new Map();

  generateOtp(): string {
    // Generate 6-digit random OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  storeOtp(email: string, otp: string): void {
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
    this.otpStore.set(email.toLowerCase(), {
      otp,
      expiresAt,
      email: email.toLowerCase(),
    });
  }

  getOtp(email: string): OtpRecord | undefined {
    return this.otpStore.get(email.toLowerCase());
  }

  deleteOtp(email: string): void {
    this.otpStore.delete(email.toLowerCase());
  }

  validateOtp(email: string, otp: string): { valid: boolean; message: string } {
    const record = this.otpStore.get(email.toLowerCase());

    if (!record) {
      return { valid: false, message: 'No OTP found for this email' };
    }

    if (new Date() > record.expiresAt) {
      this.deleteOtp(email);
      return { valid: false, message: 'OTP has expired' };
    }

    if (record.otp !== otp) {
      return { valid: false, message: 'Invalid OTP' };
    }

    // OTP is valid, remove it from store
    this.deleteOtp(email);
    return { valid: true, message: 'OTP verified successfully' };
  }
}
