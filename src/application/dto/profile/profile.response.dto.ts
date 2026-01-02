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
}
