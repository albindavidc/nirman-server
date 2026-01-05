/**
 * OTP Storage Service Interface
 * Port definition for OTP persistence.
 */
export interface IOtpStorageService {
  generateOtp(): string;
  storeOtp(email: string, otp: string): void;
  getOtp(
    email: string,
  ): { otp: string; expiresAt: Date; email: string } | undefined;
  deleteOtp(email: string): void;
  validateOtp(email: string, otp: string): { valid: boolean; message: string };
}

export const OTP_STORAGE_SERVICE = Symbol('OTP_STORAGE_SERVICE');
