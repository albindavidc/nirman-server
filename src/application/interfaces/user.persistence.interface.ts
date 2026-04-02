import { Role } from '../../domain/enums/role.enum';
import { UserStatus } from '../../domain/enums/user-status.enum';

export interface UserProfessionalPersistence {
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

export interface VendorPersistence {
  id: string;
  userId: string;
  companyName: string;
  registrationNumber: string;
  taxNumber: string | null;
  yearsInBusiness: number | null;
  addressStreet: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressZipCode: string | null;
  productsServices: string[];
  websiteUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  vendorStatus: string;
  rejectionReason: string | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserBase {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phoneNumber: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  dateOfBirth: Date | null;
  profilePhotoUrl: string | null;
  role: Role;
  userStatus: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}

export interface UserPersistence extends UserBase {
  vendor?: VendorPersistence | null;
  professional?: UserProfessionalPersistence | null;
}

export interface UserCreatePersistenceInput extends Partial<UserBase> {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: Role;
  userStatus: UserStatus;
}

export type UserUpdatePersistenceInput = Omit<
  Partial<UserBase>,
  'id' | 'createdAt' | 'updatedAt'
>;
