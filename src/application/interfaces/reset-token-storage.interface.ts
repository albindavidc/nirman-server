/**
 * Reset Token Storage Service Interface
 * Methods are async to support distributed storage (e.g. Redis).
 */
export interface IResetTokenStorageService {
  generateResetToken(): string;
  storeResetToken(email: string, token: string): Promise<void>;
  getResetToken(
    email: string,
  ): Promise<{ token: string; email: string } | undefined>;
  deleteResetToken(email: string): Promise<void>;
  validateResetToken(
    email: string,
    token: string,
  ): Promise<{ valid: boolean; message: string }>;
}

export const RESET_TOKEN_STORAGE_SERVICE = Symbol(
  'RESET_TOKEN_STORAGE_SERVICE',
);
