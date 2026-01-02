import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';

/**
 * Abstract base repository class that provides common functionality
 * for all repository implementations.
 *
 * @template T - The persistence/entity type for this repository
 * @template CreateInput - The input type for create operations
 * @template UpdateInput - The input type for update operations
 */
export abstract class BaseRepository<
  T,
  CreateInput = Partial<T>,
  UpdateInput = Partial<T>,
> {
  constructor(protected readonly prisma: PrismaService) {}

  // Query methods
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract exists(id: string): Promise<boolean>;
  abstract count(): Promise<number>;

  // Mutation methods
  abstract create(data: CreateInput): Promise<T>;
  abstract update(id: string, data: UpdateInput): Promise<T>;
  abstract delete(id: string): Promise<void>;
}
