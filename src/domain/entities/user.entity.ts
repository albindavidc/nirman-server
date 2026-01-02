import { AggregateRoot } from '@nestjs/cqrs';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { Vendor } from './vendor.entity';

export class User extends AggregateRoot {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

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
  professional?: any;
  vendor?: Vendor;
  // Note: Using 'any' or specific Entity types if available to avoid circular deps.
  // Ideally should import { Professional } and { Vendor } but circular imports are tricky in TS.
  // Given strict architecture, maybe better to use Interfaces or just 'any' for the property if it's just for transport.
}
