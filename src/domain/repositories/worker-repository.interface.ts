/**
 * Worker Repository Interface
 */

export interface WorkerWithProfessional {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  userStatus: string;
  professionalTitle?: string;
  experienceYears?: number;
  skills?: string[];
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkerData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  passwordHash: string;
  role: string;
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
  role?: string;
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

export interface IWorkerRepository {
  /**
   * Find a worker by their ID
   */
  findById(id: string): Promise<WorkerWithProfessional | null>;

  /**
   * Find a worker by their email
   */
  findByEmail(email: string): Promise<WorkerWithProfessional | null>;

  /**
   * Find all workers with pagination and filters
   */
  findAllWithFilters(params: {
    page: number;
    limit: number;
    role?: string;
    search?: string;
  }): Promise<{ workers: WorkerWithProfessional[]; total: number }>;

  /**
   * Create a new worker
   */
  create(data: CreateWorkerData): Promise<WorkerWithProfessional>;

  /**
   * Update an existing worker
   */
  update(id: string, data: UpdateWorkerData): Promise<WorkerWithProfessional>;

  /**
   * Update worker status (active/blocked)
   */
  updateStatus(id: string, status: string): Promise<WorkerWithProfessional>;
}

/**
 * Injection token for the Worker repository
 */
export const WORKER_REPOSITORY = Symbol('WORKER_REPOSITORY');
