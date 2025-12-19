import { User } from 'src/modules/user/domain/entities/user.entity';
import { ProfileResponseDto } from '../dto/profile.response.dto';

export class ProfileMapper {
  static toResponse(user: User): ProfileResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePhotoUrl: user.profilePhotoUrl,
      role: user.role,
      userStatus: user.userStatus,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
