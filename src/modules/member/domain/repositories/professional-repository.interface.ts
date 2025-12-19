import { Prisma, Professional } from 'src/generated/client/client';

export interface IProfessionalRepository {
  // Query methods
  findById(id: string): Promise<Professional | null>;
  findByUserId(userId: string): Promise<Professional | null>;
  findAll(): Promise<Professional[]>;
  exists(id: string): Promise<boolean>;
  count(): Promise<number>;

  // Mutation methods
  create(data: Prisma.ProfessionalUncheckedCreateInput): Promise<Professional>;
  update(
    id: string,
    data: Prisma.ProfessionalUncheckedUpdateInput,
  ): Promise<Professional>;
  delete(id: string): Promise<void>;
}

/**
 * Injection token for the Professional repository.
 */
export const PROFESSIONAL_REPOSITORY = Symbol('PROFESSIONAL_REPOSITORY');
