import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { BlockMemberCommand } from '../../commands/block-member.command';
import { IUserRepository, USER_REPOSITORY } from 'src/domain/repositories';

@CommandHandler(BlockMemberCommand)
export class BlockMemberHandler implements ICommandHandler<BlockMemberCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: BlockMemberCommand): Promise<any> {
    const { id, isBlocked } = command;

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.updateUser({
      id,
      user_status: isBlocked ? 'blocked' : 'active',
    } as any);

    // Map to frontend format (camelCase with professional fields)
    return {
      id: updatedUser.id,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phone_number,
      role: updatedUser.role,
      userStatus: updatedUser.user_status,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
      professionalTitle:
        (updatedUser as any).professional?.professional_title || null,
      experienceYears:
        (updatedUser as any).professional?.experience_years || null,
      skills: (updatedUser as any).professional?.skills || [],
      addressStreet: (updatedUser as any).professional?.address_street || null,
      addressCity: (updatedUser as any).professional?.address_city || null,
      addressState: (updatedUser as any).professional?.address_state || null,
      addressZipCode:
        (updatedUser as any).professional?.address_zip_code || null,
    };
  }
}
