import { Role } from '../../../domain/enums/role.enum';
import { UserStatus } from '../../../domain/enums/user-status.enum';

export class ProfileResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePhotoUrl?: string;
  role: Role;
  userStatus: UserStatus;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ProfileResponseDto>) {
    this.id = partial.id ?? '';
    this.firstName = partial.firstName ?? '';
    this.lastName = partial.lastName ?? '';
    this.email = partial.email ?? '';
    this.phoneNumber = partial.phoneNumber;
    this.profilePhotoUrl = partial.profilePhotoUrl;
    this.role = partial.role ?? Role.WORKER;
    this.userStatus = partial.userStatus ?? UserStatus.ACTIVE;
    this.isEmailVerified = partial.isEmailVerified ?? false;
    this.isPhoneVerified = partial.isPhoneVerified ?? false;
    this.createdAt = partial.createdAt ?? new Date();
    this.updatedAt = partial.updatedAt ?? new Date();
  }
}
