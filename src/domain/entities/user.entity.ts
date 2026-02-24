import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { Vendor } from './vendor.entity';
import { BaseEntity } from './base.entity';

export class User extends BaseEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  dateOfBirth?: Date;
  profilePhotoUrl?: string;
  passwordHash: string;
  role: Role;
  userStatus: UserStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional, populated by Repository via include)
  professional?: {
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
  };
  vendor?: Vendor;

  constructor(props: Partial<User>) {
    super();
    this.id = props.id ?? '';
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.firstName = props.firstName!;
    this.lastName = props.lastName!;
    this.email = props.email!;
    this.phoneNumber = props.phoneNumber;
    this.isPhoneVerified = props.isPhoneVerified ?? false;
    this.isEmailVerified = props.isEmailVerified ?? false;
    this.dateOfBirth = props.dateOfBirth;
    this.profilePhotoUrl = props.profilePhotoUrl;
    this.passwordHash = props.passwordHash!;
    this.role = props.role!;
    this.userStatus = props.userStatus!;
    this.vendor = props.vendor;
  }
}
