import { ITransactionContext } from '../interfaces/transaction-context.interface';
import { Role as UserRole } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

// ─── Response Types ────────────────────────────────────────────────────────

export interface WorkerWithProfessional {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
  userStatus: UserStatus;
  professional: {
    id: string; // The professional record ID (from the Professional table)
    professionalTitle?: string;
    experienceYears?: number;
    skills?: string[];
    addressStreet?: string;
    addressCity?: string;
    addressState?: string;
    addressZipCode?: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Input Types ───────────────────────────────────────────────────────────

export interface CreateWorkerData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  passwordHash: string;
  role: UserRole;
  professional?: {
    professionalTitle: string;
    experienceYears?: number;
    skills?: string[];
    addressStreet?: string;
    addressCity?: string;
    addressState?: string;
    addressZipCode?: string;
  };
}

export interface UpdateWorkerData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: UserRole;
  professional?: {
    professionalTitle?: string;
    experienceYears?: number;
    skills?: string[];
    addressStreet?: string;
    addressCity?: string;
    addressState?: string;
    addressZipCode?: string;
  };
}

// ─── Repository Interface ──────────────────────────────────────────────────

export interface IWorkerRepository {
  /**
   * Find a worker by their ID
   */
  findById(
    id: string,
    tx?: ITransactionContext,
  ): Promise<WorkerWithProfessional | null>;

  /**
   * Find a worker by their email
   */
  findByEmail(
    email: string,
    tx?: ITransactionContext,
  ): Promise<WorkerWithProfessional | null>;

  /**
   * Find all workers with pagination and filters
   */
  findAllWithFilters(
    params: {
      page: number;
      limit: number;
      role?: UserRole;
      search?: string;
    },
    tx?: ITransactionContext,
  ): Promise<{ workers: WorkerWithProfessional[]; total: number }>;

  /**
   * Create a new worker
   */
  create(
    data: CreateWorkerData,
    tx?: ITransactionContext,
  ): Promise<WorkerWithProfessional>;

  /**
   * Update an existing worker
   */
  update(
    id: string,
    data: UpdateWorkerData,
    tx?: ITransactionContext,
  ): Promise<WorkerWithProfessional>;

  /**
   * Update worker status
   */
  updateStatus(
    id: string,
    status: UserStatus,
    tx?: ITransactionContext,
  ): Promise<WorkerWithProfessional>;
}

// ─── Injection Token ───────────────────────────────────────────────────────

export const WORKER_REPOSITORY = Symbol('WORKER_REPOSITORY');
