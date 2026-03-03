import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { Vendor } from './vendor.entity';
import { BaseEntity } from './base.entity';

export interface UserProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  dateOfBirth?: Date;
  profilePhotoUrl?: string;
  passwordHash: string;
  role: Role;
  userStatus: UserStatus;
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
}

export class User extends BaseEntity {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _phoneNumber?: string;
  private _isPhoneVerified: boolean;
  private _isEmailVerified: boolean;
  private _dateOfBirth?: Date;
  private _profilePhotoUrl?: string;
  private _passwordHash: string;
  private _role: Role;
  private _userStatus: UserStatus;

  // Relations
  private _professional?: UserProps['professional'];
  private _vendor?: Vendor;

  constructor(props: UserProps) {
    super();
    this.id = props.id ?? '';
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._phoneNumber = props.phoneNumber;
    this._isPhoneVerified = props.isPhoneVerified ?? false;
    this._isEmailVerified = props.isEmailVerified ?? false;
    this._dateOfBirth = props.dateOfBirth;
    this._profilePhotoUrl = props.profilePhotoUrl;
    this._passwordHash = props.passwordHash;
    this._role = props.role;
    this._userStatus = props.userStatus;
    this._professional = props.professional;
    this._vendor = props.vendor;
  }

  // Getters
  get firstName(): string {
    return this._firstName;
  }
  get lastName(): string {
    return this._lastName;
  }
  get email(): string {
    return this._email;
  }
  get phoneNumber(): string | undefined {
    return this._phoneNumber;
  }
  get isPhoneVerified(): boolean {
    return this._isPhoneVerified;
  }
  get isEmailVerified(): boolean {
    return this._isEmailVerified;
  }
  get dateOfBirth(): Date | undefined {
    return this._dateOfBirth;
  }
  get profilePhotoUrl(): string | undefined {
    return this._profilePhotoUrl;
  }
  get passwordHash(): string {
    return this._passwordHash;
  }
  get role(): Role {
    return this._role;
  }
  get userStatus(): UserStatus {
    return this._userStatus;
  }
  get professional(): UserProps['professional'] | undefined {
    return this._professional;
  }
  get vendor(): Vendor | undefined {
    return this._vendor;
  }

  // Setters / Behavior Methods
  updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    profilePhotoUrl?: string;
  }): void {
    if (data.firstName) this._firstName = data.firstName;
    if (data.lastName) this._lastName = data.lastName;
    if (data.phoneNumber) {
      this._phoneNumber = data.phoneNumber;
      this._isPhoneVerified = false; // Reset verification on change
    }
    if (data.dateOfBirth !== undefined) this._dateOfBirth = data.dateOfBirth;
    if (data.profilePhotoUrl !== undefined)
      this._profilePhotoUrl = data.profilePhotoUrl;
    this.updatedAt = new Date();
  }

  verifyEmail(): void {
    this._isEmailVerified = true;
    this.updatedAt = new Date();
  }

  verifyPhone(): void {
    this._isPhoneVerified = true;
    this.updatedAt = new Date();
  }

  updateStatus(status: UserStatus): void {
    this._userStatus = status;
    this.updatedAt = new Date();
  }

  updatePassword(newHash: string): void {
    this._passwordHash = newHash;
    this.updatedAt = new Date();
  }

  changeRole(newRole: Role): void {
    this._role = newRole;
    this.updatedAt = new Date();
  }
}
