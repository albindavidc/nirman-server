import { ProjectStatus as PrismaProjectStatus } from '../../../../generated/client/enums';

/**
 * Represents a project member embedded document.
 */
export interface ProjectMemberPersistence {
  user_id: string;
  role: string;
  joined_at: Date;
  is_creator: boolean;
}

/**
 * Represents the raw Project data as returned by Prisma.
 * Explicitly defined to avoid @ts-nocheck issues in generated client.
 */
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

export interface ProjectPersistence {
  id: string;
  name: string;
  manager_ids: string[];
  description: string | null;
  icon: string;
  status: PrismaProjectStatus;
  progress: number;
  budget: number | null;
  spent: number | null;
  start_date: Date | null;
  due_date: Date | null;
  latitude: number | null;
  longitude: number | null;
  members: ProjectMemberPersistence[];
  phases: ProjectPhasePersistence[];
  created_at: Date;
  updated_at: Date;
}
