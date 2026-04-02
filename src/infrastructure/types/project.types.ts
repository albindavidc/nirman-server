import { ProjectStatus } from '../../domain/enums/project-status.enum';

export interface ProjectWorkerPersistence {
  userId: string;
  role: string;
  joinedAt: Date;
  isCreator: boolean;
}

export interface ProjectPhasePersistence {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  plannedStartDate: Date | null;
  plannedEndDate: Date | null;
  actualStartDate: Date | null;
  actualEndDate: Date | null;
  sequence: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectBase {
  id: string;
  name: string;
  managerIds: string[];
  description: string | null;
  icon: string;
  status: ProjectStatus;
  progress: number;
  budget: number | null;
  spent: number | null;
  startDate: Date | null;
  dueDate: Date | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
}

export interface ProjectPersistence extends ProjectBase {
  members?: ProjectWorkerPersistence[];
  phases?: ProjectPhasePersistence[];
}

export interface ProjectMemberFilter {
  some?: {
    userId?: string;
    isCreator?: boolean;
    role?: string;
  };
  array_contains?: any; // Prisma expects JsonValue, but we'll use a more specific type if possible
  path_exists?: string[];
}

export interface ProjectWherePersistenceInput {
  id?: string;
  isDeleted?: boolean;
  status?: ProjectStatus;
  members?: ProjectMemberFilter;
  OR?: Array<{
    name?: { contains: string; mode: 'insensitive' };
    description?: { contains: string; mode: 'insensitive' };
  }>;
}

export interface ProjectCreatePersistenceInput extends Omit<
  ProjectBase,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
> {
  members?: {
    create: ProjectWorkerPersistence[];
  };
}

export interface ProjectUpdatePersistenceInput extends Partial<
  Omit<ProjectBase, 'id' | 'createdAt' | 'updatedAt'>
> {
  members?: {
    set: ProjectWorkerPersistence[];
  };
}
