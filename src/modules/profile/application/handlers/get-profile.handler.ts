import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetProfileQuery } from '../queries/get-profile.query';
import { IUserRepository, USER_REPOSITORY } from 'src/modules/user/domain/repositories/user-repository.interface';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetProfileQuery): Promise<any> {
    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Map to frontend format
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number,
      profilePhotoUrl: user.profile_photo_url,
      role: user.role,
      userStatus: user.user_status,
      isEmailVerified: user.is_email_verified,
      isPhoneVerified: user.is_phone_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}
