import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateProfileCommand } from '../commands/update-profile.command';
import { IUserRepository, USER_REPOSITORY } from 'src/modules/user/domain/repositories/user-repository.interface';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<any> {
    const { userId, firstName, lastName, phoneNumber, profilePhotoUrl } =
      command;

    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Build update data object with only provided fields
    const updateData: any = { id: userId };
    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (phoneNumber !== undefined) updateData.phone_number = phoneNumber;
    if (profilePhotoUrl !== undefined)
      updateData.profile_photo_url = profilePhotoUrl;

    const updatedUser = await this.userRepository.update(userId, updateData);

    // Map to frontend format
    return {
      id: updatedUser.id,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phone_number,
      profilePhotoUrl: updatedUser.profile_photo_url,
      role: updatedUser.role,
      userStatus: updatedUser.user_status,
      isEmailVerified: updatedUser.is_email_verified,
      isPhoneVerified: updatedUser.is_phone_verified,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    };
  }
}
