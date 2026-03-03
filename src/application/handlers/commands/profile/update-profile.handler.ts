import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../../domain/repositories/user-repository.interface';
import { S3Service } from '../../../../infrastructure/services/s3/s3.service';
import { UpdateProfileCommand } from '../../../commands/profile/update-profile.command';
import { ProfileResponseDto } from '../../../dto/profile/profile.response.dto';
import { UserMapper } from '../../../mappers/user.mapper';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly s3Service: S3Service,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<ProfileResponseDto> {
    const { userId, firstName, lastName, phoneNumber, profilePhotoUrl } =
      command;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let finalProfilePhotoUrl: string | undefined = undefined;

    // Handle Profile Photo Update
    if (profilePhotoUrl && user.profilePhotoUrl !== profilePhotoUrl) {
      // 1. Delete old photo if it exists (and is different)
      if (user.profilePhotoUrl) {
        const oldKey = this.s3Service.extractKeyFromUrl(user.profilePhotoUrl);
        // Also handle backward compatibility if user.profilePhotoUrl was already a key
        const keyToDelete =
          oldKey ||
          (user.profilePhotoUrl.startsWith('http')
            ? null
            : user.profilePhotoUrl);

        if (keyToDelete) {
          await this.s3Service.deleteFile(keyToDelete);
        }
      }

      // 2. Extract Key from the new URL to store only the Key
      // This ensures we don't store expiring URLs
      const newKey = this.s3Service.extractKeyFromUrl(profilePhotoUrl);
      if (newKey) {
        finalProfilePhotoUrl = newKey;
      } else {
        // Fallback: if it's not an S3 URL, just store as is (e.g. if we support other URLs later)
        finalProfilePhotoUrl = profilePhotoUrl;
      }
    }

    user.updateProfile({
      firstName,
      lastName,
      phoneNumber,
      profilePhotoUrl:
        finalProfilePhotoUrl !== undefined ? finalProfilePhotoUrl : undefined,
    });

    const updatedUser = await this.userRepository.update(userId, user);

    const dto = UserMapper.entityToDto(updatedUser);

    // Generate fresh URL for the returned DTO
    if (dto.profilePhotoUrl && !dto.profilePhotoUrl.startsWith('http')) {
      dto.profilePhotoUrl = await this.s3Service.generateViewUrl(
        dto.profilePhotoUrl,
      );
    }

    return dto;
  }
}
