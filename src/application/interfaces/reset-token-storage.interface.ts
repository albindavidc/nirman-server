/**
 * Reset Token Storage Service Interface
 * Port definition for password reset token persistence.
 */
export interface IResetTokenStorageService {
  generateResetToken(): string;
  storeResetToken(email: string, token: string): void;
  getResetToken(
    email: string,
  ): { token: string; expiresAt: Date; email: string } | undefined;
  deleteResetToken(email: string): void;
  validateResetToken(
    email: string,
    token: string,
  ): { valid: boolean; message: string };
}

export const RESET_TOKEN_STORAGE_SERVICE = Symbol(
  'RESET_TOKEN_STORAGE_SERVICE',
);
