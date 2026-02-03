import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  BlockMemberCommand,
  UnblockMemberCommand,
} from '../../../commands/member/block-member.command';
import { MemberResponseDto } from '../../../dto/member/member-response.dto';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../../domain/repositories/member-repository.interface';

@CommandHandler(BlockMemberCommand)
export class BlockMemberHandler implements ICommandHandler<BlockMemberCommand> {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(command: BlockMemberCommand): Promise<MemberResponseDto> {
    const { id } = command;

    // Check if member exists
    const existingMember = await this.memberRepository.findById(id);

    if (!existingMember) {
      throw new NotFoundException('Member not found');
    }

    // Update status to blocked
    const member = await this.memberRepository.updateStatus(id, 'blocked');

    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phoneNumber: member.phoneNumber ?? undefined,
      role: member.role,
      userStatus: member.userStatus,
      professionalTitle: member.professionalTitle,
      experienceYears: member.experienceYears,
      skills: member.skills,
      addressStreet: member.addressStreet,
      addressCity: member.addressCity,
      addressState: member.addressState,
      addressZipCode: member.addressZipCode,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }
}

@CommandHandler(UnblockMemberCommand)
export class UnblockMemberHandler implements ICommandHandler<UnblockMemberCommand> {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(command: UnblockMemberCommand): Promise<MemberResponseDto> {
    const { id } = command;

    // Check if member exists
    const existingMember = await this.memberRepository.findById(id);

    if (!existingMember) {
      throw new NotFoundException('Member not found');
    }

    // Update status to active
    const member = await this.memberRepository.updateStatus(id, 'active');

    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phoneNumber: member.phoneNumber ?? undefined,
      role: member.role,
      userStatus: member.userStatus,
      professionalTitle: member.professionalTitle,
      experienceYears: member.experienceYears,
      skills: member.skills,
      addressStreet: member.addressStreet,
      addressCity: member.addressCity,
      addressState: member.addressState,
      addressZipCode: member.addressZipCode,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }
}
