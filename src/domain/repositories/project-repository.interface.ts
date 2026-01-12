import { Project } from '../entities/project.entity';

export interface IProjectRepository {
  // Query methods
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  findAllWithFilters(params: {
    search?: string;
    status?: string;
    page: number;
    limit: number;
  }): Promise<{ projects: Project[]; total: number }>;
  findByCreator(userId: string): Promise<Project[]>;
  exists(id: string): Promise<boolean>;
  count(): Promise<number>;
  countByStatus(status: string): Promise<number>;

  // Mutation methods
  create(data: Partial<Project>): Promise<Project>;
  update(id: string, data: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
}

/**
 * Injection token for the Project repository.
 */
export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');
