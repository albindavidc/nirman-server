import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import {
  BlockMemberCommand,
  UnblockMemberCommand,
} from '../../../commands/member/block-member.command';
import { PrismaService } from '../../../../infrastructure/persistence/prisma/prisma.service';
import { MemberResponseDto } from '../../../dto/member/member-response.dto';

@CommandHandler(BlockMemberCommand)
export class BlockMemberHandler implements ICommandHandler<BlockMemberCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: BlockMemberCommand): Promise<MemberResponseDto> {
    const { id } = command;

    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('Member not found');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { user_status: 'blocked' },
      include: { professional: true },
    });

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number ?? undefined,
      role: user.role,
      userStatus: user.user_status,
      professionalTitle: user.professional?.professional_title,
      experienceYears: user.professional?.experience_years,
      skills: user.professional?.skills,
      addressStreet: user.professional?.address_street,
      addressCity: user.professional?.address_city,
      addressState: user.professional?.address_state,
      addressZipCode: user.professional?.address_zip_code,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}

@CommandHandler(UnblockMemberCommand)
export class UnblockMemberHandler implements ICommandHandler<UnblockMemberCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UnblockMemberCommand): Promise<MemberResponseDto> {
    const { id } = command;

    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('Member not found');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { user_status: 'active' },
      include: { professional: true },
    });

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number ?? undefined,
      role: user.role,
      userStatus: user.user_status,
      professionalTitle: user.professional?.professional_title,
      experienceYears: user.professional?.experience_years,
      skills: user.professional?.skills,
      addressStreet: user.professional?.address_street,
      addressCity: user.professional?.address_city,
      addressState: user.professional?.address_state,
      addressZipCode: user.professional?.address_zip_code,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}
