import { User } from 'src/domain/entities/user.entity';
import { CreateVendorUserDto } from 'src/application/dto/vendor/create-vendor-user.dto';
import { Role } from 'src/domain/enums/role.enum';
import { UserStatus } from 'src/domain/enums/user-status.enum';

export class UserMapper {
  static dtoToEntity(
    dto: Pick<
      CreateVendorUserDto,
      'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'password'
    >,
  ): Partial<User> {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      passwordHash: dto.password,
      role: Role.VENDOR,
    };
  }

  static entityToDto(entity: User): {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    dateOfBirth?: Date;
    profilePhotoUrl?: string;
    role: Role;
    userStatus: UserStatus;
  } {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      phoneNumber: entity.phoneNumber,
      isEmailVerified: entity.isEmailVerified,
      isPhoneVerified: entity.isPhoneVerified,
      dateOfBirth: entity.dateOfBirth,
      profilePhotoUrl: entity.profilePhotoUrl,
      role: entity.role,
      userStatus: entity.userStatus,
    };
  }
}
