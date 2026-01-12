import { ProjectStatus as PrismaProjectStatus } from '../../../../generated/client/enums';

/**
 * Represents the raw Project data as returned by Prisma.
 * Explicitly defined to avoid @ts-nocheck issues in generated client.
 */
export interface ProjectPersistence {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  status: PrismaProjectStatus;
  progress: number;
  budget: number | null;
  spent: number | null;
  start_date: Date | null;
  due_date: Date | null;
  team_member_ids: string[];
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Represents the raw Project data with optional creator relation.
 */
export interface ProjectPersistenceWithCreator extends ProjectPersistence {
  creator?: {
    first_name: string;
    last_name: string;
  } | null;
}
