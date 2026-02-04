import { Role } from 'src/domain/enums/role.enum';
import { UserStatus } from 'src/domain/enums/user-status.enum';
import { VendorPersistence } from './vendor.types';

export interface UserProfessionalPersistence {
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

interface UserBase {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  phone_number: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  date_of_birth: Date | null;
  profile_photo_url: string | null;
  role: Role;
  user_status: UserStatus;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  deleted_at: Date | null;
}

export interface UserPersistence extends UserBase {
  vendor?: VendorPersistence | null;
  professional?: UserProfessionalPersistence | null;
}

export interface UserCreatePersistenceInput extends Partial<UserBase> {
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: Role;
  user_status: UserStatus;
}

export type UserUpdatePersistenceInput = Omit<
  Partial<UserBase>,
  'id' | 'created_at' | 'updated_at'
>;
