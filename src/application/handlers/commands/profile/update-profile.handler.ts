import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateProfileCommand } from '../../../commands/profile/update-profile.command';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../../domain/repositories/user-repository.interface';
import { ProfileResponseDto } from '../../../dto/profile/profile.response.dto';
import { UserMapper } from '../../../mappers/user/user.mapper';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<ProfileResponseDto> {
    const { userId, firstName, lastName, phoneNumber, profilePhotoUrl } =
      command;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If updating profile photo, delete the old one first
    if (
      profilePhotoUrl &&
      user.profilePhotoUrl &&
      user.profilePhotoUrl !== profilePhotoUrl
    ) {
      try {
        // The profilePhotoUrl is like '/uploads/profiles/filename.png'
        const oldFilePath = join(process.cwd(), user.profilePhotoUrl);
        if (existsSync(oldFilePath)) {
          unlinkSync(oldFilePath);
        }
      } catch (error) {
        // Log but don't fail the request if old file deletion fails
        console.warn('Failed to delete old profile photo:', error);
      }
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (profilePhotoUrl) user.profilePhotoUrl = profilePhotoUrl;

    const updatedUser = await this.userRepository.update(userId, user);

    return UserMapper.entityToDto(updatedUser);
  }
}
