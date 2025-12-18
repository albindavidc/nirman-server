import { Prisma, Professional } from 'src/generated/client/client';

/**
 * Interface for Professional repository operations.
 * Defines the contract for professional data access that implementations must fulfill.
 */
export interface IProfessionalRepository {
  /**
   * Creates a new professional profile in the database.
   */
  create(data: Prisma.ProfessionalUncheckedCreateInput): Promise<Professional>;

  /**
   * Finds a professional profile by user ID.
   */
  findByUserId(userId: string): Promise<Professional | null>;

  /**
   * Updates an existing professional profile.
   */
  update(
    userId: string,
    data: Prisma.ProfessionalUncheckedUpdateInput,
  ): Promise<Professional>;
}

/**
 * Injection token for the Professional repository.
 */
export const PROFESSIONAL_REPOSITORY = Symbol('PROFESSIONAL_REPOSITORY');
