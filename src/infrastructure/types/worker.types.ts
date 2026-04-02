import { Role as UserRole } from '../../domain/enums/role.enum';
import { UserStatus } from '../../domain/enums/user-status.enum';

interface ProfessionalBase {
  id: string;
  userId: string;
  professionalTitle: string;
  experienceYears: number;
  skills: string[];
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZipCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProfessionalPersistence = ProfessionalBase;

interface WorkerBase {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  passwordHash: string;
  role: UserRole;
  userStatus: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkerPersistence extends WorkerBase {
  professional?: ProfessionalPersistence | null;
}

export interface WorkerWherePersistenceInput {
  id?: string;
  email?: string;
  role?: UserRole | { in: UserRole[] };
  OR?: Array<{
    firstName?: { contains: string; mode: 'insensitive' };
    lastName?: { contains: string; mode: 'insensitive' };
    email?: { contains: string; mode: 'insensitive' };
  }>;
}

export interface WorkerCreatePersistenceInput extends Omit<
  WorkerBase,
  'id' | 'createdAt' | 'updatedAt' | 'userStatus' | 'phoneNumber'
> {
  phoneNumber?: string;
  userStatus?: string;
  professional?: {
    create: Omit<
      ProfessionalBase,
      'id' | 'userId' | 'createdAt' | 'updatedAt'
    >;
  };
}

export interface WorkerUpdatePersistenceInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: UserRole;
  userStatus?: string;
  professional?: {
    upsert: {
      create: Omit<
        ProfessionalBase,
        'id' | 'userId' | 'createdAt' | 'updatedAt'
      >;
      update: Partial<
        Omit<ProfessionalBase, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
      >;
    };
  };
}
