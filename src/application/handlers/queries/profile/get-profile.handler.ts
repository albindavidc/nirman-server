import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetProfileQuery } from '../../../queries/profile/get-profile.query';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../../domain/repositories/user-repository.interface';
import { ProfileResponseDto } from '../../../dto/profile/profile.response.dto';
import { UserMapper } from '../../../mappers/user/user.mapper';
import { S3Service } from '../../../../infrastructure/services/s3/s3.service';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly s3Service: S3Service,
  ) {}

  async execute(query: GetProfileQuery): Promise<ProfileResponseDto> {
    const { userId } = query;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const dto = UserMapper.entityToDto(user);

    // If profile photo exists, generate a fresh presigned URL
    if (dto.profilePhotoUrl) {
      // Check if it's a key or already a URL (for backward compatibility)
      if (!dto.profilePhotoUrl.startsWith('http')) {
        dto.profilePhotoUrl = await this.s3Service.generateViewUrl(
          dto.profilePhotoUrl,
        );
      }
    }

    return dto;
  }
}
