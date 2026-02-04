/**
 * Member Repository Interface
 */

export interface MemberWithProfessional {
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

export interface CreateMemberData {
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

export interface UpdateMemberData {
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

export interface IMemberRepository {
  /**
   * Find a member by their ID
   */
  findById(id: string): Promise<MemberWithProfessional | null>;

  /**
   * Find a member by their email
   */
  findByEmail(email: string): Promise<MemberWithProfessional | null>;

  /**
   * Find all members with pagination and filters
   */
  findAllWithFilters(params: {
    page: number;
    limit: number;
    role?: string;
    search?: string;
  }): Promise<{ members: MemberWithProfessional[]; total: number }>;

  /**
   * Create a new member
   */
  create(data: CreateMemberData): Promise<MemberWithProfessional>;

  /**
   * Update an existing member
   */
  update(id: string, data: UpdateMemberData): Promise<MemberWithProfessional>;

  /**
   * Update member status (active/blocked)
   */
  updateStatus(id: string, status: string): Promise<MemberWithProfessional>;
}

/**
 * Injection token for the Member repository
 */
export const MEMBER_REPOSITORY = Symbol('MEMBER_REPOSITORY');
