/**
 * Professional Repository Interface
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
  findAllWithFilters(params: {
    search?: string;
    excludeUserIds?: string[];
    limit?: number;
  }): Promise<ProfessionalWithUser[]>;

  verifyProfessionals(userIds: string[]): Promise<string[]>;
}

export const PROFESSIONAL_REPOSITORY = Symbol('PROFESSIONAL_REPOSITORY');
