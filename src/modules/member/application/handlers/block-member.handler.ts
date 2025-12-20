import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { BlockMemberCommand } from '../commands/block-member.command';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/repositories/user-repository.interface';
import { UserStatus } from 'src/shared/domain/enums/user-status.enum';
import { MemberResponseDto } from '../dto/member.response.dto';
import { Role } from 'src/shared/domain/enums/role.enum';

@CommandHandler(BlockMemberCommand)
export class BlockMemberHandler implements ICommandHandler<BlockMemberCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: BlockMemberCommand): Promise<MemberResponseDto> {
    const { id, isBlocked } = command;

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.update(id, {
      user_status: isBlocked ? UserStatus.BLOCKED : UserStatus.ACTIVE,
    });

    // Map to frontend format (camelCase with professional fields)
    return {
      id: updatedUser.id,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      email: updatedUser.email,
      phone: updatedUser.phone_number ?? '',
      role: updatedUser.role as Role, // Cast to any if needed for Enum compatibility, but status is now safe
      status: updatedUser.user_status as UserStatus,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
      professionalTitle: updatedUser.professional?.professional_title || null,
      experienceYears: updatedUser.professional?.experience_years || null,
      skills: updatedUser.professional?.skills || [],
      addressStreet: updatedUser.professional?.address_street || null,
      addressCity: updatedUser.professional?.address_city || null,
      addressState: updatedUser.professional?.address_state || null,
      addressZipCode: updatedUser.professional?.address_zip_code || null,
    } as MemberResponseDto;
  }
}
