/**
 * Professional Repository Interface
 *
 * Defines the contract for professional persistence operations.
 */

export interface ProfessionalWithUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  profilePhoto: string | null;
  title: string;
  experienceYears: number | null;
  skills: string[];
}

export interface IProfessionalRepository {
  /**
   * Find all professionals with optional filters
   */
  findAllWithFilters(params: {
    search?: string;
    excludeUserIds?: string[];
    limit?: number;
  }): Promise<ProfessionalWithUser[]>;

  /**
   * Verify that users are professionals
   * Returns the user IDs that are professionals
   */
  verifyProfessionals(userIds: string[]): Promise<string[]>;
}

/**
 * Injection token for the Professional repository
 */
export const PROFESSIONAL_REPOSITORY = Symbol('PROFESSIONAL_REPOSITORY');
