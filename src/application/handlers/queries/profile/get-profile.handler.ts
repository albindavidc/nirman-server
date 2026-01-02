import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetProfileQuery } from '../../../queries/profile/get-profile.query';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../../domain/repositories/user-repository.interface';
import { ProfileResponseDto } from '../../../dto/profile/profile.response.dto'; // Fixed import
import { UserMapper } from '../../../mappers/user/user.mapper';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetProfileQuery): Promise<ProfileResponseDto> {
    const { userId } = query;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Role type mismatch should be resolved by Repository returning correct Domain Entity
    return UserMapper.entityToDto(user);
  }
}
