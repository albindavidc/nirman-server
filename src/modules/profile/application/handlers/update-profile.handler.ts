import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateProfileCommand } from '../commands/update-profile.command';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/repositories/user-repository.interface';
import { ProfileResponseDto } from '../dto/profile.response.dto';
import { Role } from 'src/shared/domain/enums/role.enum';
import { UserStatus } from 'src/shared/domain/enums/user-status.enum';
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

    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Delete old profile photo if a new one is being uploaded
    if (profilePhotoUrl !== undefined && existingUser.profile_photo_url) {
      const oldPhotoPath = existingUser.profile_photo_url;
      // Only delete if it's a local upload path
      if (oldPhotoPath.startsWith('/uploads/profiles/')) {
        const fullPath = join(process.cwd(), oldPhotoPath);
        if (existsSync(fullPath)) {
          try {
            unlinkSync(fullPath);
          } catch {
            // Log error but don't fail the update
            console.warn(`Failed to delete old profile photo: ${fullPath}`);
          }
        }
      }
    }

    // Build update data object with only provided fields
    const updateData: Record<string, string> = { id: userId };
    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (phoneNumber !== undefined) updateData.phone_number = phoneNumber;
    if (profilePhotoUrl !== undefined)
      updateData.profile_photo_url = profilePhotoUrl;

    const updatedUser = await this.userRepository.update(userId, updateData);

    return {
      id: updatedUser.id,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phone_number ?? undefined,
      profilePhotoUrl: updatedUser.profile_photo_url ?? undefined,
      role: updatedUser.role as Role,
      userStatus: updatedUser.user_status as UserStatus,
      isEmailVerified: updatedUser.is_email_verified,
      isPhoneVerified: updatedUser.is_phone_verified,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    };
  }
}
