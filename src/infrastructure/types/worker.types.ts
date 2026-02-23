import { Role as UserRole } from '../../domain/enums/role.enum';

interface ProfessionalBase {
  id: string;
  user_id: string;
  professional_title: string;
  experience_years: number;
  skills: string[];
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip_code: string;
  created_at: Date;
  updated_at: Date;
}

export type ProfessionalPersistence = ProfessionalBase;

interface WorkerBase {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  password_hash: string;
  role: UserRole;
  user_status: string;
  created_at: Date;
  updated_at: Date;
}

export interface WorkerPersistence extends WorkerBase {
  professional?: ProfessionalPersistence | null;
}

export interface WorkerWherePersistenceInput {
  id?: string;
  email?: string;
  role?: UserRole | { in: UserRole[] };
  OR?: Array<{
    first_name?: { contains: string; mode: 'insensitive' };
    last_name?: { contains: string; mode: 'insensitive' };
    email?: { contains: string; mode: 'insensitive' };
  }>;
}

export interface WorkerCreatePersistenceInput extends Omit<
  WorkerBase,
  'id' | 'created_at' | 'updated_at' | 'user_status' | 'phone_number'
> {
  phone_number?: string;
  user_status?: string;
  professional?: {
    create: Omit<
      ProfessionalBase,
      'id' | 'user_id' | 'created_at' | 'updated_at'
    >;
  };
}

export interface WorkerUpdatePersistenceInput {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role?: UserRole;
  user_status?: string;
  professional?: {
    upsert: {
      create: Omit<
        ProfessionalBase,
        'id' | 'user_id' | 'created_at' | 'updated_at'
      >;
      update: Partial<
        Omit<ProfessionalBase, 'id' | 'user_id' | 'created_at' | 'updated_at'>
      >;
    };
  };
}
