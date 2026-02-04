import { ProjectStatus } from '../../domain/enums/project-status.enum';

export interface ProjectMemberPersistence {
  user_id: string;
  role: string;
  joined_at: Date;
  is_creator: boolean;
}

export interface ProjectPhasePersistence {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  planned_start_date: Date | null;
  planned_end_date: Date | null;
  actual_start_date: Date | null;
  actual_end_date: Date | null;
  sequence: number;
  created_at: Date;
  updated_at: Date;
}

interface ProjectBase {
  id: string;
  name: string;
  manager_ids: string[];
  description: string | null;
  icon: string;
  status: ProjectStatus;
  progress: number;
  budget: number | null;
  spent: number | null;
  start_date: Date | null;
  due_date: Date | null;
  latitude: number | null;
  longitude: number | null;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  deleted_at: Date | null;
}

export interface ProjectPersistence extends ProjectBase {
  members?: ProjectMemberPersistence[];
  phases?: ProjectPhasePersistence[];
}

export interface ProjectWherePersistenceInput {
  id?: string;
  is_deleted?: boolean;
  status?: ProjectStatus;
  members?: {
    some: {
      user_id: string;
      is_creator?: boolean;
    };
  };
  OR?: Array<{
    name?: { contains: string; mode: 'insensitive' };
    description?: { contains: string; mode: 'insensitive' };
  }>;
}

export interface ProjectCreatePersistenceInput extends Omit<
  ProjectBase,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> {
  members?: {
    create: ProjectMemberPersistence[];
  };
}

export interface ProjectUpdatePersistenceInput extends Partial<
  Omit<ProjectBase, 'id' | 'created_at' | 'updated_at'>
> {
  members?: {
    set: ProjectMemberPersistence[];
  };
}
